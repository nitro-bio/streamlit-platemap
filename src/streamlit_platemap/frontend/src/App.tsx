import {
  Button,
  Card,
  NitroContextMenu,
  NitroTable,
  SimpleTable,
  classNames,
} from "@ninjha01/nitro-ui";
import {
  Plate,
  PlateSelection,
  WellAnnotation,
} from "@nitro-bio/nitro-ui-premium";
import { DownloadIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "./hooks/useDebounce";
import { useMock } from "./hooks/useMock";
import { useStreamlit } from "./hooks/useStreamlit";
import { StreamlitData, StreamlitDataSchema } from "./schemas";

type ExternalWellAnnotation = Omit<WellAnnotation<any>, "className"> & {
  color: any;
};

function App() {
  const ref = useRef<HTMLDivElement>(null);
  const { data, setData } = useStreamlit<StreamlitData>({
    ref,
    zodSchema: StreamlitDataSchema,
  });

  const [internalWellAnnotations, setInternalWellAnnotations] = useState<
    ExternalWellAnnotation[] | null
  >(data?.wellAnnotations ?? null);

  const debouncedInternalWellAnnotations = useDebounce({
    value: internalWellAnnotations,
    delay: 50,
  });

  useEffect(
    function sendSelectedDataIndicesToStreamlit() {
      if (data) {
        if (debouncedInternalWellAnnotations === null) {
          console.log("skipping streamlit update");
          return;
        }
        const next = {
          ...data,
          wellAnnotations: debouncedInternalWellAnnotations,
        };
        setData(next);
      }
    },
    [debouncedInternalWellAnnotations],
  );
  // useMock({ schema: StreamlitDataSchema });

  const [selection, setSelection] = useState<PlateSelection | null>(null);
  if (!data) {
    return null;
  }
  return (
    <div ref={ref} className="light flex gap-2">
      <Card className={classNames("w-2/3")}>
        <NitroContextMenu
          trigger={
            <Plate
              className="mr-2 pb-8"
              wells={data.wells}
              selection={selection}
              setSelection={setSelection}
              wellAnnotations={data.wellAnnotations.map((x) => ({
                ...x,
                className: colorToClassName[x.color],
              }))}
              rowAnnotations={data.rowAnnotations.map((x) => ({
                ...x,
                className: colorToClassName[x.color],
              }))}
              colAnnotations={data.colAnnotations.map((x) => ({
                ...x,
                className: colorToClassName[x.color],
              }))}
            />
          }
          groups={[
            {
              label: "Create Annotations",
              type: "base",
              items: [
                ...data.wellAnnotations.map((ann) => ({
                  id: ann.id,
                  label: ann.label,
                  onClick: () => {
                    if (selection) {
                      const newAnn = {
                        ...ann,
                        wells: [...ann.wells, ...selection.wells],
                      };
                      const prevWithoutAnn = data.wellAnnotations.filter(
                        (a) => a.id !== ann.id,
                      );
                      const next = [...prevWithoutAnn, newAnn];

                      setInternalWellAnnotations(next);
                      setSelection(null);
                    } else {
                      alert("Select wells first");
                    }
                  },
                })),
                {
                  id: "Clear Annotations",
                  label: "Clear Annotations",
                  onClick: () => {
                    if (selection) {
                      const selectedWells = selection.wells;
                      const next = data.wellAnnotations.map((ann) => {
                        const wells = ann.wells.filter(
                          (w) => !selectedWells.includes(w),
                        );
                        return { ...ann, wells };
                      });
                      setInternalWellAnnotations(next);
                      setSelection(null);
                    }
                  },
                },
              ],
            },
          ]}
        />
      </Card>
      <Card className="flex w-1/3 flex-col gap-4">
        <Button
          variant="outline"
          onClick={() => {
            const csvString = wellAnnotationsToCSV(
              data.wellAnnotations,
              data.wells,
            );
            const blob = new Blob([csvString], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "well_annotations.csv";
            a.click();
          }}
          className="flex max-w-xs items-center justify-center gap-2"
        >
          Export <DownloadIcon className="h-4 w-4" />
        </Button>
        <NitroTable
          data={wellAnnotationsToList(data.wellAnnotations, data.wells)}
          pageSize={10}
        />
      </Card>
    </div>
  );
}
export default App;

const colorToClassName = {
  red: "bg-rose-400 text-rose-800",
  green: "bg-emerald-400 text-emerald-800",
  blue: "bg-sky-400 text-sky-800",
  yellow: "bg-amber-400 text-amber-800",
  cyan: "bg-cyan-400 text-cyan-800",
  fuchsia: "bg-fuchsia-400 text-fuchsia-800",
};

export const wellsToRowsCols = (wells: 24 | 96 | 48 | 384) => {
  switch (wells) {
    case 24:
      return { rows: 4, cols: 6 };
    case 48:
      return { rows: 6, cols: 8 };
    case 96:
      return { rows: 8, cols: 12 };
    case 384:
      return { rows: 16, cols: 24 };
    default:
      throw new Error("Invalid number of wells");
  }
};

export const indexToCSVCell = (index: number, wells: 24 | 96 | 48 | 384) => {
  const { cols } = wellsToRowsCols(wells);
  const row = Math.floor(index / cols);
  const col = index % cols;
  return `${String.fromCharCode(65 + col)}${row + 1}`;
};

export const csvCellToIndex = (cell: string, wells: 24 | 96 | 48 | 384) => {
  const { cols } = wellsToRowsCols(wells);
  const col = cell.charCodeAt(0) - 65;
  const row = parseInt(cell.slice(1)) - 1;
  return row * cols + col;
};

const wellAnnotationsToCSV = (
  wellAnnotations: WellAnnotation<Record<string, unknown>>[],
  wells: 24 | 96 | 48 | 384,
) => {
  const { rows, cols } = wellsToRowsCols(wells);
  const plateMap: string[][] = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(""));
  Array.from({ length: rows }).forEach((_, i) => {
    Array.from({ length: cols }).forEach((_, j) => {
      const index = i * cols + j;
      const annotationsForWell = wellAnnotations.filter((ann) =>
        ann.wells.includes(index),
      );
      plateMap[i][j] = annotationsForWell.map((ann) => ann.label).join(" | ");
    });
  });

  const headerRow = Array(cols + 1)
    .fill(0)
    .map((_, i) => {
      if (i === 0) {
        return "idx";
      }
      return String.fromCharCode(65 + i - 1);
    });
  const csvRows = [headerRow, ...plateMap.map((row, i) => [i + 1, ...row])];

  return csvRows.map((row) => row.join(",")).join("\n");
};

const wellAnnotationsToList = (
  wellAnnotations: WellAnnotation<Record<string, unknown>>[],
  wells: 24 | 96 | 48 | 384,
) => {
  const annotationMap = new Map<number, string[]>();

  // Initialize the map with empty arrays for all wells
  for (let i = 0; i < wells; i++) {
    annotationMap.set(i, []);
  }

  // Populate the map with annotations
  wellAnnotations.forEach((annotation) => {
    annotation.wells.forEach((wellIndex) => {
      annotationMap.get(wellIndex)?.push(annotation.label);
    });
  });

  // Convert to the desired output format
  return Array.from(annotationMap, ([index, annotations]) => ({
    well: indexToCSVCell(index, wells),
    annotations: annotations.join(", "),
  }));
};

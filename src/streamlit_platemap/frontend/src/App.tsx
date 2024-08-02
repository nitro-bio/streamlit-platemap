import { useEffect, useRef, useState } from "react";

import { Card, NitroContextMenu, classNames } from "@ninjha01/nitro-ui";
import {
  Plate,
  PlateSelection,
  WellAnnotation,
} from "@nitro-bio/nitro-ui-premium";
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
    <div ref={ref} className="light">
      <Card className={classNames("max-w-4xl")}>
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

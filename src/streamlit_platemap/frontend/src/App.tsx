import { useEffect, useRef, useState } from "react";

import { useMock } from "./hooks/useMock";
import { useStreamlit } from "./hooks/useStreamlit";
import { StreamlitData, StreamlitDataSchema } from "./schemas";
import { Card, NitroContextMenu, classNames } from "@ninjha01/nitro-ui";
import {
  Plate,
  PlateSelection,
  WellAnnotation,
} from "@nitro-bio/nitro-ui-premium";
import { z } from "zod";
import { useDebounce } from "./hooks/useDebounce";

function App() {
  const ref = useRef<HTMLDivElement>(null);
  const { data, setData } = useStreamlit<StreamlitData>({
    ref,
    zodSchema: StreamlitDataSchema,
  });

  const [internalWellAnnotations, setInternalWellAnnotations] = useState<
    WellAnnotation<any>[]
  >([]);

  const debouncedInternalWellAnnotations = useDebounce({
    value: internalWellAnnotations,
    delay: 50,
  });

  useEffect(
    function sendSelectedDataIndicesToStreamlit() {
      if (data) {
        const next = {
          ...data,
          wellAnnotations: debouncedInternalWellAnnotations,
        };
        setData(next);
      }
    },
    [debouncedInternalWellAnnotations],
  );
  useMock({ schema: StreamlitDataSchema });

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
              wells={24}
              selection={selection}
              setSelection={setSelection}
              wellAnnotations={data.wellAnnotations}
              rowAnnotations={data.rowAnnotations}
              colAnnotations={data.colAnnotations}
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
                      setInternalWellAnnotations((prev) => {
                        const newAnn = {
                          ...ann,
                          wells: [...ann.wells, ...selection.wells],
                        };
                        return [...prev.filter((a) => a.id !== ann.id), newAnn];
                      });
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

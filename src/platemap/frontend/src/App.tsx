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

function App() {
  const ref = useRef<HTMLDivElement>(null);
  const { data, setData } = useStreamlit<any>({
    ref,
    zodSchema: z.any(),
  });
  const [foo, setFoo] = useState<string | null>(null);
  useEffect(
    function sendSelectedDataIndicesToStreamlit() {
      if (data) {
        const next = {
          ...data,
          foo,
        };
        setData(next);
      }
    },
    [foo],
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
          groups={[]}
        />
      </Card>
    </div>
  );
}
export default App;

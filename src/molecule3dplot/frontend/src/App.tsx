import { useEffect, useRef, useState } from "react";

import { ThreeDPlot } from "./components/ThreeDPlot";
import { useDebounce } from "./hooks/useDebounce";
import { useStreamlit } from "./hooks/useStreamlit";
import { classNames, colorByValue } from "./utils/strings";
import { useMock } from "./hooks/useMock";
import { StreamlitData, StreamlitDataSchema } from "./schemas";

function App() {
  const ref = useRef<HTMLDivElement>(null);
  const [selectedDataIndices, setSelectedDataIndices] = useState<Set<number>>(
    new Set(),
  );
  const debouncedSelectedDataIndices = useDebounce({
    value: selectedDataIndices,
    delay: 50,
  });

  const { data, setData } = useStreamlit<StreamlitData>({
    ref,
    zodSchema: StreamlitDataSchema,
  });
  useEffect(
    function sendSelectedDataIndicesToStreamlit() {
      if (data) {
        const next = {
          ...data,
          selectedDataIndices: Array.from(debouncedSelectedDataIndices),
        };
        setData(next);
      }
    },
    [debouncedSelectedDataIndices],
  );
  useMock({ schema: StreamlitDataSchema });

  return (
    <div ref={ref} className="light">
      {data && (
        <PlotAndSelection
          data={data}
          setSelectedDataIndices={setSelectedDataIndices}
          selectedDataIndices={selectedDataIndices}
        />
      )}
    </div>
  );
}

const PlotAndSelection = ({
  data,
  setSelectedDataIndices,
  selectedDataIndices,
}: {
  data: StreamlitData;
  setSelectedDataIndices: (x: any) => void;
  selectedDataIndices: Set<number>;
}) => {
  const colors = colorByValue(data);
  return (
    <div className="px-8 flex">
      <div className="flex flex-col w-64 pt-[400px]">
        <button
          onClick={() => {
            setSelectedDataIndices(new Set([]));
          }}
          className="btn my-2"
          disabled={selectedDataIndices.size === 0}
        >
          Clear Selected Points
        </button>
        <ul className="flex flex-col gap-2 items-start ">
          {[...selectedDataIndices].map((i) => {
            return (
              <li
                className={classNames(
                  "text-white/80 px-3 py-2 rounded-xl text-xs w-full",
                )}
                key={i}
                style={{
                  backgroundColor: colors[i],
                }}
              >
                {data.hovertext[i][0]}
              </li>
            );
          })}
        </ul>
      </div>
      <ThreeDPlot
        className={classNames("w-full h-full")}
        x={data.x}
        y={data.y}
        z={data.z}
        xTitle={data.xTitle}
        yTitle={data.yTitle}
        zTitle={data.zTitle}
        smiles={data.smiles}
        setSelectedDataIndices={setSelectedDataIndices}
        selectedDataIndices={selectedDataIndices}
        marker={data.marker}
        hovertext={data.hovertext}
        overlayClassName={data.overlayClassName}
        filterColumns={data.filterColumns}
        colorBy={data.colorBy}
        legendLabel={data.legendLabel}
        categorical={data.categorical}
      />
    </div>
  );
};

export default App;

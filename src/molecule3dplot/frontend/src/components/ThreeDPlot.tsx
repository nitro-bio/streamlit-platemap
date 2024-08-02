import { PlotMarker, PlotMouseEvent } from "plotly.js";
import { PlotHoverEvent } from "plotly.js-basic-dist-min";

import { useState } from "react";
import { FilterColumn } from "../schemas";
import { classNames, colorByValue } from "../utils/strings";
import { PlotlyWithCustomOverlay } from "./CustomPlot";
import { Filter, Filters } from "./Filters";
import { Legend } from "./Legend";
import { Overlay } from "./Overlay";

export const ThreeDPlot = ({
  className,
  x,
  xTitle,
  y,
  yTitle,
  z,
  zTitle,
  colorBy,
  smiles,
  selectedDataIndices,
  setSelectedDataIndices,
  filterColumns,
  marker,
  hovertext,
  legendLabel,
  overlayClassName,
  categorical,
}: {
  marker: Partial<PlotMarker>;
  hovertext: string[][];
  legendLabel: string;
  overlayClassName: string;
  className?: string;
  x: number[];
  y: number[];
  z?: number[] | null;
  xTitle?: string | null;
  yTitle?: string | null;
  zTitle?: string | null;
  colorBy: number[];
  smiles: string[];
  filterColumns: FilterColumn[];
  selectedDataIndices: Set<number>;
  setSelectedDataIndices: (x: any) => void;
  categorical?: boolean;
}) => {
  const defaultString = null;
  const defaultNumber = [null, null] as [null, null];
  const initialFilters: Filter[] = filterColumns.map((f) => ({
    ...f,
    filterValue: f.filter_type === "text" ? defaultString : defaultNumber,
  }));

  const [filters, setFilters] = useState<Filter[]>(initialFilters);

  const survivingIndices = x.map((_, i) => {
    const idxSurvives = filters.every((f) => {
      if (f.filterValue === null) {
        return true;
      }
      if (f.filter_type === "number") {
        // assert f.filterValue is [number, number]
        if (!Array.isArray(f.filterValue)) {
          throw new Error("Expected filterValue to be an array");
        }
        const value = f.values[i] as number;
        const [min, max] = f.filterValue;
        const passesMinFilter = min === null || value >= min;
        const passesMaxFilter = max === null || value <= max;
        return passesMinFilter && passesMaxFilter;
      }
      if (f.filter_type === "text") {
        const isString =
          typeof f.filterValue === "string" || f.filterValue instanceof String;
        if (!isString) {
          throw new Error("Expected filterValue to be a string");
        }
        // TODO: use zod to validate
        const value = f.values[i] as string;
        const filterValue = f.filterValue as string;
        // see if regex matches
        try {
          return value.match(new RegExp(filterValue, "i"));
        } catch (e) {
          return false;
        }
      }
    });
    return idxSurvives;
  });
  const filteredX = x.map((x_datum, i) => {
    if (survivingIndices[i]) {
      return x_datum;
    } else {
      return null;
    }
  });
  const filteredY = y.map((y_datum, i) => {
    if (survivingIndices[i]) {
      return y_datum;
    } else {
      return null;
    }
  });
  const filteredZ = z?.map((z_datum, i) => {
    if (survivingIndices[i]) {
      return z_datum;
    } else {
      return null;
    }
  });
  const traces = [
    {
      x: filteredX,
      y: filteredY,
      z: filteredZ,
      customdata: smiles,
      type: (z ? "scatter3d" : "scatter") as "scatter3d" | "scatter",
      mode: "markers" as const,
      marker: {
        size: marker.size,
        color: colorByValue({ colorBy, categorical }).map((origColor, i) => {
          if (selectedDataIndices.has(i)) {
            return "black";
          } else {
            return origColor;
          }
        }),
        opacity: 0.5,
        line: {
          width: 0,
        },
      },
      hoverinfo: "none" as const,
    },
  ];

  return (
    <div className={classNames("flex flex-col justify-end", className)}>
      <div className="flex flex-col ml-auto min-w-[700px]">
        <Filters filters={filters} setFilters={setFilters} />
        <Legend
          colorBy={colorBy}
          label={legendLabel}
          categorical={categorical}
        />
      </div>

      <div className="">
        <PlotlyWithCustomOverlay
          className="h-full w-full min-h-[650px] -my-10"
          data={traces}
          layout={{
            hovermode: "closest",
            dragmode: "pan",
            uirevision: 1,
            scene: {
              xaxis: {
                title: xTitle ?? undefined,
              },
              yaxis: {
                title: yTitle ?? undefined,
              },
              zaxis: {
                title: zTitle ?? undefined,
              },
            },
            xaxis: {
              title: xTitle ?? undefined,
            },
            yaxis: {
              title: yTitle ?? undefined,
            },
          }}
          config={{
            displaylogo: false,
            watermark: false,
            responsive: true,
          }}
          onClick={(click: PlotMouseEvent) => {
            setSelectedDataIndices((prev: Set<number> | null) => {
              return new Set([
                ...Array.from(prev || []),
                ...click.points.map((p) => p.pointNumber),
              ]);
            });
          }}
          children={(hoverEvent: PlotHoverEvent) => (
            <Overlay
              hoverEvent={hoverEvent}
              hovertext={hoverEvent.points.map(
                (p) => hovertext[p.pointNumber] as unknown as string[],
              )}
              overlayClassName={overlayClassName}
            />
          )}
        />
      </div>
    </div>
  );
};

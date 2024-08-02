import { classNames } from "@ninjha01/nitro-ui";
import { PlotHoverEvent } from "plotly.js";
import { Molecule } from "./MoleculeViz";

export const Overlay = ({
  hoverEvent,
  hovertext,
  overlayClassName,
}: {
  hoverEvent: PlotHoverEvent;
  hovertext: string[][];
  overlayClassName: string;
}) => {
  return (
    <div
      className={classNames(
        "p-4 rounded-lg pointer-events-none select-none w-fit bg-white/80",
        overlayClassName,
      )}
    >
      {hoverEvent.points.map((_point) => {
        const point = _point as unknown as {
          pointNumber: number;
          customdata: string;
          x: any;
          y: any;
          z: any;
        };

        return (
          <div
            key={point.pointNumber}
            className="ml-8 w-[300px] h-[300px] text-zinc-800"
          >
            {hovertext.map((text, i) => (
              <div
                className="font-mono text-sm"
                key={`${point.pointNumber}-text-${i}`}
              >
                {text.map((t) => (
                  <p key={t}>{t}</p>
                ))}
              </div>
            ))}
            <Molecule smiles={point.customdata} />
          </div>
        );
      })}
    </div>
  );
};

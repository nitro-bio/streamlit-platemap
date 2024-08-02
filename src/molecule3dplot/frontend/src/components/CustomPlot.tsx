import { useState, useEffect } from "react";
import Plot, { PlotParams } from "react-plotly.js";
import { PlotHoverEvent, PlotMouseEvent } from "plotly.js";

export type HoverPoint = {
  data: Plotly.PlotDatum;
};

export const PlotlyWithCustomOverlay = ({
  children,
  ...props
}: PlotParams & {
  children: (hoverEvent: PlotHoverEvent) => React.ReactNode;
}) => {
  const [hoverEvent, setHoverEvent] = useState<PlotHoverEvent | null>(null);
  const { mousePosition } = useMousePosition();
  return (
    <>
      <Plot
        {...props}
        className={props.className}
        onHover={(hover: PlotHoverEvent) => {
          setHoverEvent(hover);
          props.onHover?.(hover);
        }}
        onUnhover={(unhover: PlotMouseEvent) => {
          setHoverEvent(null);
          props.onUnhover?.(unhover);
        }}
      />
      {hoverEvent && mousePosition !== null && (
        <div
          style={{
            position: "fixed",
            left: mousePosition.x + 10,
            top: mousePosition.y + 10,
          }}
        >
          {children(hoverEvent)}
        </div>
      )}
    </>
  );
};

// from https://www.joshwcomeau.com/snippets/react-hooks/use-mouse-position/
export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  useEffect(function wireUpListener() {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);
  return { mousePosition };
};

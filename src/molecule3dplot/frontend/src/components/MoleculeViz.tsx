import { useRef, useEffect } from "react";
import SmilesDrawer from "smiles-drawer";

const SETTINGS = {
  width: 800,
  height: 400,
};

export const Molecule = ({
  smiles,
  className,
}: {
  smiles?: string;
  className?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  let drawer = new SmilesDrawer.SvgDrawer(SETTINGS);

  useEffect(() => {
    SmilesDrawer.parse(smiles, function (tree: any) {
      drawer.draw(tree, "structure-svg", "light");
    });
  }, []);
  if (!smiles) {
    return null;
  }
  return <svg id="structure-svg" ref={svgRef} className={className} />;
};

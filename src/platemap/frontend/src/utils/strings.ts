import { z } from "zod";

export function classNames(
  ...classes: (string | undefined | null | boolean)[]
) {
  return classes.filter(Boolean).join(" ");
}

export const stringToColor = (str: string): string => {
  // pads string to 32 char before hashing
  str = str.padEnd(32, " ");
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32bit integer
  }
  let color = Math.abs(hash).toString(16);
  color = "#" + color.slice(0, 6).padEnd(6, "0");
  return color;
};
export function colorByValue({
  colorBy,
  categorical,
}: {
  colorBy: number[] | string[];
  categorical?: boolean;
}): string[] {
  if (categorical) {
    return colorBy.map((value) => stringToColor(value.toString()));
  }
  // if colorBy is an array of strings, convert to numbers
  const numericColorBy = z.array(z.number()).safeParse(colorBy);
  if (!numericColorBy.success) {
    throw new Error(
      "colorBy must be an array of numbers when categorical is false",
    );
  }
  colorBy = numericColorBy.data;

  const [minVal, maxVal] = [Math.min(...colorBy), Math.max(...colorBy)];

  // Normalize values and map to colors between red and blue
  const normalizedColors = colorBy.map((value) => {
    // Normalize current value to a 0-1 scale
    const normalized = (value - minVal) / (maxVal - minVal);
    const red = 255 * normalized;
    const blue = 255 * (1 - normalized);

    // Convert the colors to a CSS-friendly format
    return `rgb(${Math.round(red)}, 0, ${Math.round(blue)})`;
  });

  return normalizedColors;
}

import { stringToColor } from "../utils/strings";

export const Legend = ({
  colorBy,
  label,
  categorical,
}: {
  colorBy: number[];
  label: string;
  categorical?: boolean;
}) => {
  console.log("cat", categorical, colorBy);
  if (categorical) {
    const colorCategories = Array.from(new Set(colorBy)).map((value) => {
      return { label: value, color: stringToColor(value.toString()) };
    });
    console.log("colorCategories", colorCategories);

    return (
      <div className="flex flex-col gap-4 h-full text-noir-600 font-bold py-4 z-10">
        <h4 className="text-xl font-bold text-noir-700 ">{label}</h4>
        <div className="flex gap-2">
          {colorCategories.map((category) => (
            <span key={category.label}>
              <span
                className="inline-block w-4 h-4 border rounded-full mr-2"
                style={{ background: category.color.padEnd(7, "0") }}
              />
              {category.label}
            </span>
          ))}
        </div>
      </div>
    );
  }

  const sorted = colorBy.slice().sort((a, b) => a - b);
  return (
    <div className="flex gap-4 h-full text-noir-600 font-bold py-4 z-10">
      <div className="flex-1">
        <h4 className="text-xl font-bold text-noir-700 ">{label}</h4>
        <p className="px-2">
          {" | "}
          {sorted[0]}
        </p>
        <div
          className="h-3 w-full border rounded-xl"
          style={{
            background:
              "linear-gradient(137deg, rgba(0,0,255,1) 0%, rgba(128,0,128,1) 50%, rgba(255,0,0,1) 100%)",
          }}
        />
        <p className="text-right px-2">
          {sorted[sorted.length - 1].toFixed(2)}
          {" | "}
        </p>
      </div>
    </div>
  );
};

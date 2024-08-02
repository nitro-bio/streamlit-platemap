import { Dropdown } from "@ninjha01/nitro-ui";
import { useState } from "react";
import { classNames } from "../utils/strings";
import { FilterColumn } from "../schemas";

export interface Filter extends FilterColumn {
  filterValue: string | null | [number | null, number | null];
}

export const Filters = ({
  filters,
  setFilters,
}: {
  filters: Filter[];
  setFilters: (x: Filter[]) => void;
}) => {
  const [currentFilterKey, setCurrentFilterKey] = useState<string>(
    filters.length ? filters[0].key : "",
  );
  const currentFilter = filters.find((f) => f.key === currentFilterKey);
  if (!currentFilter) {
    return null;
  }

  return (
    <span className="flex w-full space-x-4 justify-end">
      <span className="relative w-full ">
        {currentFilter.filter_type === "text" && (
          <StringFilter
            currentFilter={currentFilter}
            currentFilterKey={currentFilterKey}
            filters={filters}
            setFilters={setFilters}
          />
        )}
        {currentFilter.filter_type === "number" && (
          <NumberFilter
            currentFilter={currentFilter}
            currentFilterKey={currentFilterKey}
            filters={filters}
            setFilters={setFilters}
          />
        )}
      </span>
      <Dropdown
        groups={[
          {
            label: "",
            value: currentFilter.key,
            onValueChange: setCurrentFilterKey,
            type: "radio",
            items: filters.map((filter) => {
              let filterIsActivated = false;
              if (filter.filter_type === "number") {
                const [min, max] = filter.filterValue as [
                  number | null,
                  number | null,
                ];
                filterIsActivated = !!(min || max);
              }
              if (filter.filter_type === "text") {
                filterIsActivated = !!filter.filterValue;
              }
              return {
                label: (
                  <span className="flex -my-1 justify-between w-full">
                    <p className="mr-4">{filterIsActivated ? "▼" : "∇"} </p>
                    <p>{filter.label}</p>
                  </span>
                ),
                id: filter.key,
              };
            }) as unknown as { label: string; id: string }[], // library wants label to be string but will take Element
          },
        ]}
        buttonLabel={`Filtering by ${currentFilter.label}`}
        menuLabel={`Available Filters`}
      />
    </span>
  );
};
const NumberFilter = ({
  currentFilter,
  currentFilterKey,
  filters,
  setFilters,
}: {
  currentFilter: Filter;
  currentFilterKey: string;
  filters: Filter[];
  setFilters: (x: Filter[]) => void;
}) => {
  const [min, max] = currentFilter.filterValue as [
    number | null,
    number | null,
  ];

  const handleFilterChange = (value: string, type: "min" | "max") => {
    const newFilterIdx = filters.findIndex((f) => f.key === currentFilterKey);
    if (newFilterIdx === -1) {
      throw new Error(`Could not find filter with key ${currentFilterKey}`);
    }
    const newFilter = filters[newFilterIdx];
    let newMin = type === "min" ? parseFloat(value) || null : min;
    let newMax = type === "max" ? parseFloat(value) || null : max;

    newFilter.filterValue = [newMin, newMax];
    const newFilters = [
      filters.slice(0, newFilterIdx),
      newFilter,
      filters.slice(newFilterIdx + 1),
    ].flat();
    setFilters(newFilters);
  };
  return (
    <div className="flex gap-2">
      <InputComponent
        type="min"
        value={min}
        placeholder={`Set filter min`}
        onValueChange={handleFilterChange}
        currentFilter={currentFilter}
      />
      <InputComponent
        type="max"
        value={max}
        placeholder={`Set filter max`}
        onValueChange={handleFilterChange}
        currentFilter={currentFilter}
      />
    </div>
  );
};
const InputComponent = ({
  type,
  value,
  placeholder,
  onValueChange, // Add this prop to handle value changes
  currentFilter, // Ensure to pass currentFilter to access .values for min/max
}: {
  type: "min" | "max";
  value: number | null;
  placeholder: string;
  onValueChange: (value: string, type: "min" | "max") => void;
  currentFilter: Filter;
}) => (
  <span className="relative flex w-full gap-2">
    <input
      type="number"
      className="flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-noir-100 text-noir-800 placeholder:text-noir-500"
      placeholder={placeholder}
      value={value ?? ""}
      onChange={(e) => onValueChange(e.target.value, type)}
    />
    <p className="hidden sm:block absolute right-7 top-1/2 z-1 text-xs truncate transform -translate-y-1/2 text-end left-1/2 text-zinc-500/80 pointer-events-none">
      {type}:{" "}
      {type === "min"
        ? Math.min(...(currentFilter.values as number[]))
        : Math.max(...(currentFilter.values as number[]))}
    </p>
  </span>
);

const StringFilter = ({
  currentFilter,
  currentFilterKey,
  filters,
  setFilters,
}: {
  currentFilter: Filter;
  currentFilterKey: string;
  filters: Filter[];
  setFilters: (x: Filter[]) => void;
}) => {
  const filterValue = currentFilter.filterValue as string | null;
  return (
    <span className="relative w-full max-w-xl">
      <input
        className={classNames(
          "flex h-10 w-full rounded-md px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "bg-noir-100 text-noir-800 placeholder:text-noir-500",
        )}
        placeholder={`Search ${currentFilter.label} `}
        value={filterValue || ""}
        onChange={(event) => {
          const newFilterIdx = filters.findIndex(
            (f) => f.key === currentFilterKey,
          );
          if (newFilterIdx === -1) {
            throw new Error(
              `Could not find filter with key ${currentFilterKey}`,
            );
          }
          const newFilter = filters[newFilterIdx];
          newFilter.filterValue = event.target.value;
          const newFilters = [
            filters.slice(0, newFilterIdx),
            newFilter,
            filters.slice(newFilterIdx + 1),
          ].flat();
          setFilters(newFilters);
        }}
      />
      <p className="hidden sm:block absolute right-2 top-1/2 z-1 text-xs truncate transform -translate-y-1/2 text-end left-1/2 text-zinc-500/80 pointer-events-none">{`i.e. ${currentFilter.values[0]}`}</p>
    </span>
  );
};

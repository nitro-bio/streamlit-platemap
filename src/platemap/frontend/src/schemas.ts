import { z } from "zod";
export const FilterColumnSchema = z.object({
  key: z.string(),
  label: z.string(),
  values: z.union([z.array(z.string()), z.array(z.number())]),
  filter_type: z.union([z.literal("text"), z.literal("number")]),
});
export type FilterColumn = z.infer<typeof FilterColumnSchema>;

export const StreamlitDataSchema = z.object({
  selectedDataIndices: z.array(z.number()),
  x: z.array(z.coerce.number()),
  xTitle: z.string().optional().nullable(),
  y: z.array(z.coerce.number()),
  yTitle: z.string().optional().nullable(),
  z: z.array(z.coerce.number()).nullable().optional(),
  zTitle: z.string().nullable().optional(),
  marker: z.object({
    size: z.array(z.coerce.number()),
  }),
  legendLabel: z.string(),
  colorBy: z.union([z.array(z.coerce.number()), z.array(z.string())]),
  filterColumns: z.array(FilterColumnSchema),
  smiles: z.array(z.string()),
  hovertext: z.array(z.array(z.coerce.string())),
  overlayClassName: z.string(),
  categorical: z.boolean().optional(),
});

export type StreamlitData = z.infer<typeof StreamlitDataSchema>;

import { z } from "zod";

const WellAnnotation = z.object({
  id: z.string(),
  wells: z.array(z.number()),
  label: z.string(),
});

const RowAnnotation = z.object({
  id: z.string(),
  rows: z.array(z.number()),
  label: z.string(),
});

const ColAnnotation = z.object({
  id: z.string(),
  cols: z.array(z.number()),
  label: z.string(),
});
// replace import { PlateSelectionSchema } from "@nitro-bio/nitro-ui-premium";
export const PlateSelectionSchema = z.object({
  wells: z.array(z.number()),
  className: z.string().optional(),
});

export const StreamlitDataSchema = z.object({
  wells: z.union([z.literal(24), z.literal(96), z.literal(48), z.literal(384)]),
  rowAnnotations: z.array(RowAnnotation),
  colAnnotations: z.array(ColAnnotation),
  wellAnnotations: z.array(WellAnnotation),
  selection: PlateSelectionSchema,
});
export type StreamlitData = z.infer<typeof StreamlitDataSchema>;

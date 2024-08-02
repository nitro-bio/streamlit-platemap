import { z } from "zod";

const color = z.union([
  z.literal("red"),
  z.literal("green"),
  z.literal("blue"),
  z.literal("yellow"),
  z.literal("cyan"),
  z.literal("fuchsia"),
]);
const WellAnnotation = z.object({
  id: z.string(),
  wells: z.array(z.number()),
  label: z.string(),
  color: color,
});

const RowAnnotation = z.object({
  id: z.string(),
  rows: z.array(z.number()),
  label: z.string(),
  color: color,
});

const ColAnnotation = z.object({
  id: z.string(),
  cols: z.array(z.number()),
  label: z.string(),
  color: color,
});

export const StreamlitDataSchema = z.object({
  wells: z.union([z.literal(24), z.literal(96), z.literal(48), z.literal(384)]),
  rowAnnotations: z.array(RowAnnotation),
  colAnnotations: z.array(ColAnnotation),
  wellAnnotations: z.array(WellAnnotation),
});
export type StreamlitData = z.infer<typeof StreamlitDataSchema>;

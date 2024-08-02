import { ZodSchema } from "zod";
import { useStreamlitMock } from "./useStreamlit";
import { useEffect } from "react";
import rawData from "../data/dummy_data.csv";

export const useMock = ({ schema }: { schema: ZodSchema }) => {
  const { sendToReact } = useStreamlitMock({
    zodSchema: schema,
  });
  useEffect(function initializeData() {
    const data = csvJSON(rawData).slice(0, -1); // Assume the csvJSON function is defined elsewhere
    const parsed = schema.parse({
      x: data.map((d: any) => d.r1),
      xTitle: "r1",
      y: data.map((d: any) => d.r2),
      yTitle: "r2",
      z: data.map((d: any) => d.r3),
      zTitle: "r3",
      smiles: data.map((d: any) => d.smiles),
      selectedDataIndices: [],
      filterColumns: [
        {
          key: "cpd_index",
          values: data.map((d: any) => d.cpd_index),
          label: "cpd_index",
          filter_type: "text",
        },

        {
          key: "r1",
          values: data.map((d: any) => d.r1),
          label: "r1",
          filter_type: "number",
        },

        {
          key: "r2",
          values: data.map((d: any) => d.r2),
          filter_type: "number",
          label: "r2",
        },

        {
          key: "r3",
          values: data.map((d: any) => d.r3),
          filter_type: "number",
          label: "r3",
        },

        {
          key: "smiles",
          values: data.map((d: any) => d.smiles),
          filter_type: "number",
          label: "smiles",
        },

        {
          key: "expt_t_max_count",
          values: data.map((d: any) => d.expt_t_max_count),
          filter_type: "number",
          label: "expt_t_max_count",
        },

        {
          key: "r1_reagent",
          values: data.map((d: any) => d.r1_reagent),
          filter_type: "number",
          label: "r1_reagent",
        },

        {
          key: "r2_reagent",
          values: data.map((d: any) => d.r2_reagent),
          filter_type: "number",
          label: "r2_reagent",
        },

        {
          key: "r3_reagent",
          values: data.map((d: any) => d.r3_reagent),
          filter_type: "number",
          label: "r3_reagent",
        },

        {
          key: "protein",
          values: data.map((d: any) => d.protein),
          filter_type: "number",
          label: "protein",
        },

        {
          key: "expt",
          values: data.map((d: any) => d.expt),
          filter_type: "number",
          label: "expt",
        },

        {
          key: "mw",
          values: data.map((d: any) => d.mw),
          filter_type: "number",
          label: "mw",
        },
        {
          key: "log_p",
          values: data.map((d: any) => d.log_p),
          filter_type: "number",
          label: "log_p",
        },
      ],
      marker: {
        size: data.map(() => 8),
      },
      // colorBy: data.map((d: any) => d.r2),
      // categorical: false,
      // legendLabel: "Color by r2",
      colorBy: data.map((d: any) => (d.r2 % 2 ? "foo" : "bar")),
      categorical: true,
      legendLabel: "Binary Color",
      hovertext: data.map((d: any) => [
        `cpd_index: ${d.cpd_index}`,
        `mw: ${d.mw}`,
        `log_p: ${d.log_p}`,
      ]),
      overlayClassName: "py-4 fixed top-0 left-0",
    });
    sendToReact(parsed);
  }, []);

  function csvJSON(csv: string) {
    let lines = csv.split("\n");
    let result = [];
    let headers = lines[0].split(",");
    for (let i = 1; i < lines.length; i++) {
      let obj = {};
      let currentline = lines[i].split(",");

      for (let j = 0; j < headers.length; j++) {
        // @ts-ignore
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }
    return result;
  }
};

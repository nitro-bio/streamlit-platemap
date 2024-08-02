import { ZodSchema } from "zod";
import { useStreamlitMock } from "./useStreamlit";
import { useEffect } from "react";
import rawData from "../data/initial_plate.json";

export const useMock = ({ schema }: { schema: ZodSchema }) => {
  const { sendToReact } = useStreamlitMock({
    zodSchema: schema,
  });
  useEffect(function initializeData() {
    // console.log("useMock", rawData);
    // const parsed = schema.parse(rawData);

    sendToReact(rawData);
  }, []);
};

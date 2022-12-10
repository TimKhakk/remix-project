import type { LinearError } from "@linear/sdk";
import { linearErrorLogger } from "./linearErrorLogger";

export function linearErrorCreator<T>(error: LinearError, restResBody: T){
  linearErrorLogger(error);

  return {
    ...restResBody,
    errors: {
      message: error.message,
      type: "linear",
    },
  };
}
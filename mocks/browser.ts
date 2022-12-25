import { setupWorker } from "msw";
import { routesHandlers } from "./routes";

export const worker = setupWorker(...routesHandlers);

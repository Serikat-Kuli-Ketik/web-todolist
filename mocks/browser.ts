import { setupWorker } from "msw";
import { handlers } from "./routes/tasks";

export const worker = setupWorker(...handlers);

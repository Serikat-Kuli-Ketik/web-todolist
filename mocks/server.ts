import { setupServer } from "msw/node";
import { handlers } from "./routes/tasks";

export const server = setupServer(...handlers);

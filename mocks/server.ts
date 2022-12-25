import { setupServer } from "msw/node";
import { routesHandlers } from "./routes";

export const server = setupServer(...routesHandlers);

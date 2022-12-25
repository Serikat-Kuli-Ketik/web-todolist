import { handlers as authHandlers } from "./auth";
import { handlers as taskHandlers } from "./tasks";

const aggregatedRoutes = [...authHandlers, ...taskHandlers];

export { aggregatedRoutes as routesHandlers };

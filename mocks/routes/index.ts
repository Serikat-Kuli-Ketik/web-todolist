import { handlers as authHandlers } from "./auth";
import { handlers as taskHandlers } from "./tasks";
import { handlers as labelHandlers } from "./labels";

const aggregatedRoutes = [...authHandlers, ...taskHandlers, ...labelHandlers];

export { aggregatedRoutes as routesHandlers };

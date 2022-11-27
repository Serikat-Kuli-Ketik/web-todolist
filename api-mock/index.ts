import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import routes, { RouteMethods } from "./modules/routes";

const apiRoutes = [...routes];

const methodsMap: Record<RouteMethods, string> = {
  GET: "onGet", // Mock any GET request
  POST: "onPost", // Mock any POST request
  PUT: "onPut", // Mock any PUT request
  DELETE: "onAny", // Mock onAny can be use for DELETE or PATCH request
};

/**
 * A generateQueryParams function is for turn object params to string params
 * @param {Object} queryParams - Query params object
 * @return {String} queryParamsString - query params in string
 */
const generateQueryParams = (queryParams: any) => {
  const queryParamsString = [];
  for (const key in queryParams) {
    if (queryParams.hasOwnProperty(key)) {
      queryParamsString.push(
        encodeURIComponent(key) + "=" + encodeURIComponent(queryParams[key])
      );
    }
  }

  return queryParamsString.length > 0 ? "?" + queryParamsString.join("&") : "";
};
/**
 * Example Input Output for this function
 * Example 1
 * Input: { itemPerPage: 10, page: 2, searchTerm: 'samsung' }
 * Output: ?itemPerPage=10&page=2&searchTerm=samsung
 * Example 2 (empty param)
 * Input: null || {} || undefined
 * Output: ''
 */

const delayResponse = 0; // In millisecond
const mock = new MockAdapter(axios, { delayResponse });

apiRoutes.forEach((route) => {
  let queryParams = "";
  if (route.queryParams) {
    queryParams = generateQueryParams(route.queryParams);
  }

  // @ts-ignore
  mock[methodsMap[route.method]](`${route.url}${queryParams}`, {
    ...route.params,
  }).reply(route.code, route.response);
});

console.log("success creating mock");

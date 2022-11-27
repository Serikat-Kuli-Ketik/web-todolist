import axios from "axios";

type RequestCallback = (response: any) => void;

const dataAdapter = (axiosResponse: any) => {
  const response = axiosResponse.response || axiosResponse;
  return {
    status: response.status,
    body: response.data,
  };
};

const get = (url: string, success: RequestCallback, fail: RequestCallback) => {
  axios
    .get(url)
    .then((response) => success(dataAdapter(response)))
    .catch((response) => fail(dataAdapter(response)));
};

const post = (
  url: string,
  success: RequestCallback,
  fail: RequestCallback,
  data: object
) => {
  axios
    .put(url, data)
    .then((response) => success(dataAdapter(response)))
    .catch((response) => fail(dataAdapter(response)));
};

const put = (
  url: string,
  success: RequestCallback,
  fail: RequestCallback,
  data: object
) => {
  axios
    .put(url, data)
    .then((response) => success(dataAdapter(response)))
    .catch((response) => fail(dataAdapter(response)));
};

const del = (url: string, success: RequestCallback, fail: RequestCallback) => {
  axios
    .delete(url)
    .then((response) => success(dataAdapter(response)))
    .catch((response) => fail(dataAdapter(response)));
};

const httpApi = {
  get,
  post,
  put,
  del,
};

export default httpApi;

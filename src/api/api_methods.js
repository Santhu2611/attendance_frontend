import { addHeader, addHeaderWithOutBody } from "./headers";
import constants from "./api_urls";

export async function apiGet(path) {
  const response = await fetch(
    (constants.isTestServer ? constants.testUrl : constants.baseUrl) + path,
    await addHeaderWithOutBody("GET")
  );
  console.log(response);

  const data = await response.json();
  return { body: data, status: response.status };
}

export async function apiGetOpenSource(uriPath) {
  const response = await fetch(uriPath, await addHeaderWithOutBody("GET"));

  const data = await response.json();
  return { body: data, status: response.status };
}

export async function apiDelete(path) {
  const response = await fetch(
    (constants.isTestServer ? constants.testUrl : constants.baseUrl) + path,
    await addHeaderWithOutBody("DELETE")
  );
  console.log(response);
  const data = response.status === 200 ? response.json() : {};
  return { body: data, status: response.status };
}

export async function apiPostPut(body, path, method) {
  const uri =
    (constants.isTestServer ? constants.testUrl : constants.baseUrl) + path;
  const response = await fetch(uri, await addHeader(body, method));

  const data = await response.json();
  return { body: data, status: response.status };
}

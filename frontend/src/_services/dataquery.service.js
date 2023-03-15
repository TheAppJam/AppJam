import { config } from "../Constant";

export const dataqueryService = {
  preview,
  run,
  create,
  getAll,
  remove,
  update
};

function preview() {
  const body = {
  };

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  return fetch(`${config.url.API_URL}/data_queries/preview`, requestOptions);
}

function run(options) {
  const url = options.url
  const method = options.method.toUpperCase()
  let requestOptions = { method }
  let headers = {}
  if (options.headers) {
    headers = Object.fromEntries(options.headers)
  }
  requestOptions['headers'] = headers
  if (method !== 'GET') {
    let body = {}
    if (options.body) {
      body = Object.fromEntries(options.body)
    }
    requestOptions = { ...requestOptions, body: JSON.stringify(body) };
  }
  return fetch(url, requestOptions)
}

function create(appId, name, options) {
  const body = {
    appId, name, options
  }
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  return fetch(`${config.url.API_URL}/data_queries/`, requestOptions);
}

function update(id, name, options) {
  const body = {
    options,
    name,
  };

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };

  return fetch(`${config.url.API_URL}/data_queries/${id}`, requestOptions);
}

function getAll(id) {
  const requestOptions = { method: 'GET' };
  return fetch(`${config.url.API_URL}/data_queries/${id}`, requestOptions)
}

function remove(id) {
  const requestOptions = { method: 'DELETE' };
  return fetch(`${config.url.API_URL}/data_queries/${id}`, requestOptions)
}



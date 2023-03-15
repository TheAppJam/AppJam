import { values } from "lodash";
import { config } from "../Constant";
import { handleResponse } from "../_helpers/handle-response";
import { authenticationService } from "./authentication.service";


export const appService = {
  getApp,
  save,
  buildApp,
  saveDefinition,
  getAll,
  createApp,
  saveSettings,
  previewApp,
  remove
}

export function authHeader() {
  // return authorization header with jwt token
  const currentUser = authenticationService.currentUserValue;
  if (currentUser && currentUser.auth_token) {
    return {
      Authorization: `Bearer ${currentUser.auth_token}`,
      'Content-Type': 'application/json',
    };
  }
  return {
    'Content-Type': 'application/json',
  };
}

function getApp(id) {
  const requestOptions = { method: 'GET' };
  return fetch(`${config.url.API_URL}/apps/${id}`, requestOptions)
}

function getAll() {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(`${config.url.API_URL}/apps`, requestOptions).then(handleResponse)
}

function save(id, values) {
  const body = {};
  body['order'] = values.order
  const requestOptions = {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'}
  };
  return fetch(`${config.url.API_URL}/apps/${id}`, requestOptions)
}

function saveDefinition(id, values) {
  const body = {};
  body['definition'] = values.definition
  const requestOptions = {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'}
  };
  return fetch(`${config.url.API_URL}/apps/definition/${id}`, requestOptions)
}

function saveSettings(id, values) {
  const body = {};
  body['settings'] = values
  const requestOptions = {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'}
  };
  return fetch(`${config.url.API_URL}/apps/settings/${id}`, requestOptions)
}

function buildApp(id) {
  const requestOptions = { method: 'GET'};
  return fetch(`${config.url.API_URL}/apps/build/${id}`, requestOptions)
}

function previewApp(id) {
  const requestOptions = { method: 'GET'};
  return fetch(`${config.url.API_URL}/apps/preview/${id}`, requestOptions)
}

function createApp() {
  const requestOptions = { method: 'POST', headers: authHeader() };
  return fetch(`${config.url.API_URL}/apps`, requestOptions);
}

function remove(id) {
  const requestOptions = { method: 'DELETE' };
  return fetch(`${config.url.API_URL}/apps/${id}`, requestOptions)
}

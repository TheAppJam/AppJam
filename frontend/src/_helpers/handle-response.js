import { authenticationService } from "../_services";


export function handleResponse(response) {
  if (!response.ok) {
    if ([401].indexOf(response.status) !== -1) {
      
      authenticationService.logout();
      
    }
    const error = response.statusText;
    return Promise.reject({ error });
  }
  return response
}
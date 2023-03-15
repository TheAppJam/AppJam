import { BehaviorSubject } from 'rxjs';
import { config } from '../Constant';
import { handleResponse } from "../_helpers/handle-response";

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
  signup,
  login,
  logout,
  get currentUserValue() {
    return currentUserSubject.value;
  },
};

function signup(email, name, password) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, password }),
  };

  return fetch(`${config.url.API_URL}/signup`, requestOptions).then(handleResponse).then((data) => {
    data.text().then((value) => {
      const user = JSON.parse(value);
      updateUser(user)
      return user
    });
  });;
}

function login(email, password) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  };
  return fetch(`${config.url.API_URL}/login`, requestOptions).then(handleResponse).then((data) => {
    data.text().then((value) => {
      const user = JSON.parse(value);
      updateUser(user)
      return user
    });
  });
}

function updateUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
  currentUserSubject.next(user);
}

function logout() {
  clearUser();
  const loginPath = '/' + 'login';
  window.location.href = loginPath;
}

function clearUser() {
  // remove user from local storage to log user out
  localStorage.removeItem('currentUser');
  currentUserSubject.next(null);
}

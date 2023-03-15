import Editor from './Editor/Editor';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import "./_styles/theme.scss";
import Dashboard from './Dashboard/Dashboard';
import LoginPage from './LoginPage/LoginPage';
import SignupPage from './SignupPage/SignupPage';

function App() {

  const history = createBrowserHistory({
    basename: window.public_config?.SUB_PATH || '/',
  });

  return (
    <BrowserRouter history={history} basename={window.public_config?.SUB_PATH || '/'}>
      <Route
        exact
        path="/"
        component={Dashboard}
      />
      <Route
        exact
        path="/editor/:id"
        component={Editor}
      />
      <Route
        exact
        path="/login"
        component={LoginPage}
      />
      <Route
        exact
        path="/signup"
        component={SignupPage}
      />
    </BrowserRouter>
  );
}

export default App;

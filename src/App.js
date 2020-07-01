import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";

//axios import
import axios from "axios";

//theming
// import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import jwtDecode from "jwt-decode";

//redux
import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED } from "./redux/types";
import { logoutUser, getUserData } from "./redux/actions/userActions";

//Components
import Navbar from "./components/Navbar";
import AuthRoute from "./util/AuthRoute";
//pages
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#0d47a1"
    },
    secondary: {
      main: "#1e88e5"
    }
  },
  typography: {
    useNextVariants: true
  }
});

const token = localStorage.FBIdToken;

if (token) {
  //decode token jwt-decode library
  const decodedToken = jwtDecode(token);

  //check token is expired
  if (decodedToken.exp * 1000 < Date.now) {
    store.dispatch(logoutUser());
    window.location.href = "/login";
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common["Authorization"] = token;
    store.dispatch(getUserData());
  }
}

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={home} />
              <AuthRoute exact path="/login" component={login} />
              <AuthRoute exact path="/signup" component={signup} />
            </Switch>
          </div>
        </Router>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;

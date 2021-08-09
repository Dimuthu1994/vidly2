import { Route, Redirect, Switch } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import Movies from "./components/movies";
import Customers from "./components/customers";
import Rentals from "./components/rentals";
import NotFound from "./components/notFound";
import NavBar from "./components/navBar";
import React from "react";
import MovieForm from "./components/movieForm";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import Logout from "./components/logout";
import auth from "./services/authService";
import ProtectedRoute from "./components/common/protectedRoute";

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    setUser(auth.getCurrentUser());
  }, []);

  return (
    <React.Fragment>
      <ToastContainer />
      <NavBar user={user} />
      <main className="container">
        <Switch>
          <Route path="/register" component={RegisterForm} />
          <Route path="/login" component={LoginForm} />
          <Route path="/logout" component={Logout} />
          <ProtectedRoute path="/movies/:id" component={MovieForm} />
          <Route
            path="/movies"
            render={(props) => <Movies {...props} user={user} />}
          ></Route>
          <Route path="/customers" component={Customers}></Route>
          <Route path="/rentals" component={Rentals}></Route>
          <Route path="/not-found" component={NotFound}></Route>
          <Redirect from="/" exact to="/movies" />
          <Redirect to="/not-found"></Redirect>
        </Switch>
      </main>
    </React.Fragment>
  );
}

export default App;

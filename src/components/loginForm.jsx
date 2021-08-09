import React, { useState } from "react";
import Input from "./common/input";
import Joi from "joi-browser";
import auth from "../services/authService";
import { Redirect } from "react-router-dom";
import useForm from "./common/useForm";

function LoginForm({ history, location }) {
  //const dataInit = { username: "", password: "" };
  const [dataInit, setDataInit] = useState({ username: "", password: "" });
  const schema = {
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
  };

  const { handleChange, handleSubmit, validate, data, errors } = useForm({
    schema,
    dataInit,
  });
  const [errorsNew, setErrorsNew] = useState(errors);
  const doSubmit = async () => {
    // call the server
    try {
      await auth.login(data.username, data.password);
      //console.log(jwt);
      const { state } = location;
      window.location = state ? state.from.pathname : "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...errorsNew };
        errors.username = ex.response.data; //we can pass error msg
        setErrorsNew(errors);
      }
    }
  };
  if (auth.getCurrentUser()) return <Redirect to="/" />;
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <Input
          name="username"
          value={data.username} // value is always comming from State
          // Controlled element
          label="Username"
          onChange={handleChange}
          error={errorsNew.username}
        />
        <Input
          name="password"
          value={data.password}
          label="Password"
          onChange={handleChange}
          error={errorsNew.password}
          type="password"
        />
        <button
          disabled={validate()}
          onClick={doSubmit}
          className="btn btn-primary"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;

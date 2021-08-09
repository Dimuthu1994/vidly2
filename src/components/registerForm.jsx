import React, { useState } from "react";
import Input from "./common/input";
import Joi from "joi-browser";
import useForm from "./common/useForm";
import { register } from "../services/userService";
import auth from "../services/authService";

function RegisterForm({ history }) {
  const [dataInit, setDataInit] = useState({
    username: "",
    password: "",
    name: "",
  });

  const schema = {
    username: Joi.string().required().email().label("Username"),
    password: Joi.string().required().min(5).label("Password"),
    name: Joi.string().required().label("Name"),
  };

  const { handleChange, handleSubmit, validate, data, errors } = useForm({
    schema,
    dataInit,
  });
  const [errorsNew, setErrorsNew] = useState(errors);
  const doSubmit = async () => {
    // call the server
    console.log("submitted");
    try {
      const response = await register(data);
      auth.loginWithJwit(response.headers["x-auth-token"]);
      window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...errorsNew };
        errors.username = ex.response.data; //we can pass error msg
        setErrorsNew(errors);
      }
    }
  };

  return (
    <div>
      <h1>Register</h1>
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

        <Input
          name="name"
          value={data.name} // value is always comming from State
          // Controlled element
          label="Name"
          onChange={handleChange}
          error={errorsNew.name}
        />
        <button
          onClick={doSubmit}
          disabled={validate()}
          className="btn btn-primary"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;

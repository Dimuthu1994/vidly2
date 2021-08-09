import { useState } from "react";
import Joi from "joi-browser";

const useForm = ({ schema, dataInit }) => {
  const [data, setData] = useState(dataInit);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const option = { abortEarly: false };
    const result = Joi.validate(data, schema, option); //{error}
    //console.log(result);
    if (!result.error) return null;
    const errorsVal = {};
    for (let item of result.error.details)
      errorsVal[item.path[0]] = item.message;
    return errorsVal;
  };

  const validateProprty = ({ name, value }) => {
    const obj = { [name]: value };
    const schemaProperty = { [name]: schema[name] };
    const { error } = Joi.validate(obj, schemaProperty);
    return error ? error.details[0].message : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errorsNew = validate();

    //console.log(errorsNew);
    setErrors(errorsNew || {});
    if (errorsNew) return;
  };

  const handleChange = ({ currentTarget: input }) => {
    const errorsClone = { ...errors };
    const errorMessage = validateProprty(input); //----------*
    if (errorMessage) errorsClone[input.name] = errorMessage;
    else delete errorsClone[input.name];
    // Dosent need to create another handleer to create password property
    //so we need to set properties Dynamically
    // Bracket Notation
    const accountNew = { ...data };
    accountNew[input.name] = input.value;
    setData(accountNew);
    setErrors(errorsClone);
  };

  return {
    handleSubmit,
    handleChange,
    validate,
    data,
    errors,
    setData,
  };
};

export default useForm;

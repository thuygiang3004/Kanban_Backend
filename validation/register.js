const validator = require("validator");
const { isEmpty } = require("./is-empty");

const validateRegisterInput = (data) => {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const NAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

  if (!EMAIL_REGEX.test(data.email)) {
    errors.email = "Email is invalid";
  }

  if (!NAME_REGEX.test(data.name)) {
    errors.name = "Name is invalid";
  }

  if (!PWD_REGEX.test(data.password)) {
    errors.password = "Password is invalid";
  }

  if (validator.isEmpty(data.password2)) {
    errors.password2 = " confirm Password required";
  }
  if (!validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }

  return { errors, isValid: isEmpty(errors) };
};

module.exports = validateRegisterInput;

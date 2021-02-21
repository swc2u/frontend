import React from "react";
import formHoc from "egov-ui-kit/hocs/form";
import { Banner } from "modules/common";
import { Screen } from "modules/common";
import LoginForm from "./components/LoginForm";

const LoginFormHOC = formHoc({ formKey: "employeeLogin" })(LoginForm);

const Login = () => {
  
  return (
    <Banner hideBackButton={true}>
      <LoginFormHOC />
    </Banner>
  );
};

export default Login;

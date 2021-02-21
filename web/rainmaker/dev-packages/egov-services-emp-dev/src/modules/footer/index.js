import React from "react";
import "./index.css";
const Footer=(props)=>{
  const {children,...rest}=props;
  return (
    <div {...rest}>
        {children}
    </div>
  )
}

export default Footer;

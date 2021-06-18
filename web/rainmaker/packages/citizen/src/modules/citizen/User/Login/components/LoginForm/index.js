import React from "react";
import Field from "egov-ui-kit/utils/field";
import { Link } from "react-router-dom";
import { Button, Card, Image ,Icon , DropDown} from "components";
import IconButton from "material-ui/IconButton";
import Label from "egov-ui-kit/utils/translationNode";
import { startSMSRecevier } from "egov-ui-kit/utils/commons";
import Hidden from "@material-ui/core/Hidden";
import logo from "egov-ui-kit/assets/images/logo_black.png";
import qrlogo from "egov-ui-kit/assets/images/qrImage.png";
import "./index.css";
import { blue } from "@material-ui/core/colors";

const LoginForm = ({ handleFieldChange, form, logoUrl,qrCodeURL,enableWhatsApp,languages,onLanguageChange,languageSelected,hasLocalisation }) => {
  const fields = form.fields || {};
  const submit = form.submit;
  const callIconStyle = {
    marginLeft: "17px",
    height: "17px",
    width: "17px",
    borderRadius: "50%",
    position: "absolute",
    top: "0px",
  };
  const style = {
    baseStyle: {
      background: "#ffffff",
      height: "30px",
    //  marginRight: "30px",
      width: "98px",
      marginBottom: "10px",
    },
    label: {
      color: "#5F5C57",
      fontSize: "12px",
      paddingRight: "40px",
      top : "-27px"
    },
    iconStyle: {
      top : "-24px",
      fill : "black"
    },
    listStyle: {
      display: "block",
    },
  }



  return (
    <div className="rainmaker-displayInline">
    <Card
      className={enableWhatsApp?"login-cardwidth user-screens-card":"login-cardwidthmob col-sm-offset-4 col-sm-4 user-screens-card"}
      textChildren={
        <div>
           <marquee width="100%" direction="left" height="50px">
        <Label style={{ marginBottom: "2px" }}        
        color="blue" 
        bold={true} dark={false} 
        fontSize={18} label="CORE_COMMON_MESSAGE_MARQEE" />
        </marquee>
          <div className="rainmaker-displayInline" style={{ justifyContent: "center" }}>
        {/*}    <div style={{ marginBottom: "24px" }}>
              <Image className="mseva-logo" source={`${logo}`} />
            </div >
          <div style={{marginLeft:"7px", marginBottom: "24px" }}>
          <Label bold={true}  fontSize= "23px" label="|" />
          </div>
      */}
           <div style={{marginLeft:"7px" }}>
              <Label bold={true} color="black" fontSize= "24px" label="STATE_LABEL" />
           </div>
          </div>
          <Label style={{ marginBottom: "12px" }} className="text-center" bold={true} dark={true} fontSize={16} label="CORE_COMMON_LOGIN" />
          <Field fieldKey="phone" field={fields.phone} handleFieldChange={handleFieldChange}  />
          {/* pattern={/^[0-9]{10}$/i} */}
          <div style={{ marginBottom: "0px", position: "relative", zIndex: 10,marginRight:20}} className="text-right">
            <Label id="otp-trigger" className="otp-prompt" label="CORE_LOGIN_NO_ACCOUNT" />
            <Link to="/user/register">
              <div style={{ display: "inline-block" }}>
                <Label containerStyle={{ cursor: "pointer" }} id="otp-resend" className="otp-resend" label="CORE_REGISTER_HEADING" />
              </div>
            </Link>
            </div>
            {/* <div>
            
            <div style={{ marginBottom: "10px", position: "relative", zIndex: 10 }} className="text-right">
           
           <div style={{ display: "inline-block" }}>
          
           <Label containerStyle={{ cursor: "pointer" }} id="otp-resend" className="otp-resend" label={languageSelected ?`LANGUAGE_${languageSelected.toUpperCase()}`:'en_IN'} />
           </div>
           <div style={{ display: "inline-block" , float:"right", height:40 }}>
         {hasLocalisation && (
     <DropDown
         onChange={onLanguageChange}
         listStyle={style.listStyle}
         style={style.baseStyle}
         labelStyle={style.label}
         iconStyle={style.iconStyle}
         dropDownData={languages}
         value={languageSelected}
         underlineStyle={{ borderBottom: "none" }}
       />
         )}  
          </div>
       </div>
            </div> */}
           
            
          <Button
            {...submit}
            fullWidth={true}
            primary={true}
            onClick={(e) => {
              startSMSRecevier();
            }}
          />
          <div style={{ marginBottom: "0px", position: "relative", zIndex: 10,marginRight:0}} className="text-right">           
          <Link to="/user/privacy"> 
           {/*  */}
              <div style={{ display: "inline-block" }}  >
               {/* <u> <Label containerStyle={{ cursor: "pointer" }}
               style={{ color: "lightsalmon",fontSize:"12px",textDEcoration:"underline"}}
               id="privacy"  className="privacy" label="Privacy Policy" /></u> */}
               <p style={{ color: "burlywood",fontSize:"12px",textDecorationLine:"underline"}} >Privacy Policy</p>
              </div>
            </Link>
            </div>
            
            <div style={{  position: "relative",paddingTop:"0px"}} className="text-center"> 
            {/* <IconButton style={{paddingLeft:0,paddingRight:0}}>
            <Icon action="action" name="help" color="#000" />  
           
              </IconButton>  */}
                <p>
                In case of any support or query,<br></br> kindly contact us on                   
                {/* <b  style={{  color:"blue"}} > 0172-2787200</b> */}
                <a
              className="citizen-mobileNumber-style"
              href={`tel:+0172-2787200`}
              style={{ textDecoration: "none", position: "relative" }}
            >
              <Icon action="communication" name="call" style={callIconStyle} color={"#22b25f"} />
              <span
                style={{
                  fontSize:12,// filedBy.includes("@CSR") ? 12 : 14,
                  marginLeft: "43px",
                }}
              >{`0172-2787200`}</span>
            </a>
                </p> 
              {/* <Label bold={false} color="black" fontSize= "14px" label="In case of any support or query, kindly contact us on"/> */}
              
               
              </div>
          {enableWhatsApp&&
           <Hidden mdUp>
          <div>
        <div className="login-hl-divider">
       <div className ="login-circle-mobile">
       <Label  color="black" fontSize= "16px" label="Or"/>
       </div>
    </div>
    <div className="rainmaker-displayInline login-mobile-whatsapp-button"  onClick={()=>{window.location.href="https://api.whatsapp.com/send?phone=918744960111&text=mseva"}} >      
        <Icon action="custom" name="whatsapp" className="login-mobile-whatsapp-icon" />
        <Label bold={true} color="black" fontSize= "14px" label="WHATSAPP_CONTINUE_MOBILE"/>
    </div>
    </div>
      </Hidden>
      }
        </div>
      }
    />
    {enableWhatsApp&&
      <Hidden smDown>
     <div className="login-vl-divider">
       <div className ="login-circle-web">
       <Label  color="black" fontSize= "16px" label="OR"/>
       </div>
    </div>
    <div className="login-qrscan">
       <Image className="login-qrlogo" source={`${qrCodeURL}`} /> 
       <div  className="login-qrtext">
       <Label  color="black" fontSize= "14px" label="WHATSAPP_SCAN_QR_CODE"/>
       </div>
    </div>
    </Hidden>
}
    </div>

  );
};

export default LoginForm;

import React from "react";
import { connect } from "react-redux";
import { Grid, Typography, Button } from "@material-ui/core";
import { Container } from "egov-ui-framework/ui-atoms";
import {
  LabelContainer,
  TextFieldContainer
} from "egov-ui-framework/ui-containers";
import { Dialog, DialogContent } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";
import { UploadMultipleFiles } from "egov-ui-framework/ui-molecules";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";
import { get } from "lodash";
import {DocumentListContainer} from "../../ui-containers-local";
import store from "egov-workflow/ui-redux/store";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";

const styles = theme => ({
  root: {
    marginTop: 24,
    width: "100%"
  }
});

const fieldConfig = {
  to: {
    label: {
      labelName: "To",
      labelKey: "WF_ROLE_TO_LABEL"
    },
    placeholder: {
      labelName: "Select To",
      labelKey: "WF_SELECT_ROLE_TO"
    }
  },
  approverName: {
    label: {
      labelName: "Assignee Name",
      labelKey: "WF_ASSIGNEE_NAME_LABEL"
    },
    placeholder: {
      labelName: "Select assignee Name",
      labelKey: "WF_ASSIGNEE_NAME_PLACEHOLDER"
    }
  },
  comments: {
    label: {
      labelName: "Comments",
      labelKey: "ES_COMMON_COMMENTS"
    },
    placeholder: {
      labelName: "Enter Comments",
      labelKey: "WF_ADD_HOC_CHARGES_POPUP_COMMENT_LABEL"
    }
  },
  termsandcondition: {
    label: {
      labelName: "Comments",
      labelKey: "ES_COMMON_TERMS_AND_CONDITIONS"
    },
    placeholder: {
      labelName: "Enter Comments",
      labelKey: "ES_COMMON_TERMS_AND_CONDITIONS_PLACEHOLDER"
    }
  },
  mandatoryComments: {
    label: {
      labelName: "Comments",
      labelKey: "ES_MANDATORY_COMMON_COMMENTS"
    },
    placeholder: {
      labelName: "Enter Comments",
      labelKey: "WF_ADD_HOC_CHARGES_POPUP_COMMENT_LABEL"
    }
  },
  
  hardCopyReceivedDate: {
    label: {
      labelName: "Hard Copy Received Date",
      labelKey: "ES_HARD_COPY_RECEIVED_DATE"
    }
  }
};

let bb_payment_config = [
  {
    label: {
      labelName: "Development Charges",
      labelKey: "ES_BB_DEVELOPMENT_CHARGES"
    },
    placeholder: {
      labelName: "Enter Development Charges",
      labelKey: "ES_BB_DEVELOPMENT_CHARGES_PLACEHOLDER"
    },
    path: "developmentCharges",
    errorMessage: "ES_ERR_DEVELOPMENT_CHARGES",
    showError: false
  },
  {
    label: {
      labelName: "Conversion Charges",
      labelKey: "ES_BB_CONVERSION_CHARGES"
    },
    placeholder: {
      labelName: "Enter Conversion Charges",
      labelKey: "ES_BB_CONVERSION_CHARGES_PLACEHOLDER"
    },
    path: "conversionCharges",
    errorMessage: "ES_ERR_CONVERSION_CHARGES",
    showError: false
  },
  {
    label: {
      labelName: "Scrutiny Charges",
      labelKey: "ES_BB_SCRUTINY_CHARGES"
    },
    placeholder: {
      labelName: "Enter Scrutiny Charges",
      labelKey: "ES_BB_SCRUTINY_CHARGES_PLACEHOLDER"
    },
    path: "scrutinyCharges",
    errorMessage: "ES_ERR_SCRUTINY_CHARGES",
    showError: false
  },
  {
    label: {
      labelName: "Transfer Fees",
      labelKey: "ES_BB_TRANSFER_FEES"
    },
    placeholder: {
      labelName: "Enter Transfer Fees",
      labelKey: "ES_BB_TRANSFER_FEES_PLACEHOLDER"
    },
    path: "transferFee",
    errorMessage: "ES_ERR_TRANSFER_FEES",
    showError: false
  },
  {
    label: {
      labelName: "Allotment Number Charges",
      labelKey: "ES_BB_ALLOTMENT_NUMBER_CHARGES"
    },
    placeholder: {
      labelName: "Enter Allotment Number Charges",
      labelKey: "ES_BB_ALLOTMENT_NUMBER_CHARGES_PLACEHOLDER"
    },
    path: "applicationNumberCharges",
    errorMessage: "ES_ERR_BB_ALLOTMENT_NUMBER",
    showError: false
  }
]

let eb_payment_config = [
  {
    label: {
      labelName: "Transfer Charges",
      labelKey: "ES_EB_TRANSFER_CHARGES"
    },
    placeholder: {
      labelName: "Enter Transfer Charges",
      labelKey: "ES_EB_TRANSFER_CHARGES_PLACEHOLDER"
    },
    path: "transferCharges",
    errorMessage: "ES_ERR_TRANSFER_CHARGES",
    showError: false
  },
  {
    label: {
      labelName: "GST",
      labelKey: "ES_EB_GST_CHARGES"
    },
    placeholder: {
      labelName: "Enter GST",
      labelKey: "ES_EB_GST_PLACEHOLDER"
    },
    path: "GST",
    errorMessage: "ES_ERR_GST",
    showError: false
  },
  {
    label: {
      labelName: "Application Fee",
      labelKey: "ES_EB_APPLICATION_FEE"
    },
    placeholder: {
      labelName: "Enter Application Charges",
      labelKey: "ES_EB_APPLICATION_FEE_PLACEHOLDER"
    },
    path: "applicationFee",
    required: true,
    errorMessage: "ES_ERR_APPLICATION_FEE",
    showError: false
  },
  {
    label: {
      labelName: "Inspection Fees",
      labelKey: "ES_EB_INSPECTION_FEES"
    },
    placeholder: {
      labelName: "Enter Inspection Fees",
      labelKey: "ES_EB_INSPECTION_FEES_PLACEHOLDER"
    },
    path: "inspectionFee",
    errorMessage: "ES_ERR_INSPECTION_FEES",
    showError: false
  },
  {
    label: {
      labelName: "Security Fee",
      labelKey: "ES_EB_SECURITY_FEE"
    },
    placeholder: {
      labelName: "Enter Security Fee",
      labelKey: "ES_EB_SECURITY_FEE_PLACEHOLDER"
    },
    path: "securityFee",
    errorMessage: "ES_ERR_SECURITY_FEE",
    showError: false
  },
  {
    label: {
      labelName: "Extension Fee",
      labelKey: "ES_EB_EXTENSION_FEE"
    },
    placeholder: {
      labelName: "Enter Extension Fee",
      labelKey: "ES_EB_EXTENSION_FEE_PLACEHOLDER"
    },
    path: "extensionFee",
    errorMessage: "ES_ERR_EXTENSION_FEE",
    showError: false
  },
  {
    label: {
      labelName: "Document copying Fee",
      labelKey: "ES_EB_DOCUMENT_COPYING_FEE"
    },
    placeholder: {
      labelName: "Enter Document copying Fee",
      labelKey: "ES_EB_DOCUMENT_COPYING_FEE_PLACEHOLDER"
    },
    path: "DocumentCopyingFee",
    errorMessage: "ES_ERR_DOCUMENT_COPYING_FEE",
    showError: false
  },
  {
    label: {
      labelName: "Allotment Fee",
      labelKey: "ES_EB_ALLOTMENT_FEE"
    },
    placeholder: {
      labelName: "Enter Allotment Fee",
      labelKey: "ES_EB_ALLOTMENT_FEE_PLACEHOLDER"
    },
    path: "allotmentFee",
    errorMessage: "ES_ERR_ALLOTMENT_FEE",
    showError: false
  },
  {
    label: {
      labelName: "Conversion Fee",
      labelKey: "ES_EB_CONVERSION_FEE"
    },
    placeholder: {
      labelName: "Enter Conversion Fee",
      labelKey: "ES_EB_CONVERSION_FEE_PLACEHOLDER"
    },
    path: "conversionFee",
    errorMessage: "ES_ERR_CONVERSION_FEE",
    showError: false
  },
  {
    label: {
      labelName: "Property Transfer Charge",
      labelKey: "ES_EB_PROPERTY_TRANSFER_CHARGE"
    },
    placeholder: {
      labelName: "Enter Property Transfer Charge",
      labelKey: "ES_EB_PROPERTY_TRANSFER_CHARGE_PLACEHOLDER"
    },
    path: "propertyTransferCharge",
    errorMessage: "ES_ERR_PROPERTY_TRANSFER_CHARGE",
    showError: false
  }
]

const getEpoch = (dateString, dayStartOrEnd = "dayend") => {
  //example input format : "2018-10-02"
  try {
    const parts = dateString.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    const DateObj = new Date(Date.UTC(parts[1], parts[2] - 1, parts[3]));
    DateObj.setMinutes(DateObj.getMinutes() + DateObj.getTimezoneOffset());
    if (dayStartOrEnd === "dayend") {
      DateObj.setHours(DateObj.getHours() + 24);
      DateObj.setSeconds(DateObj.getSeconds() - 1);
    }
    return DateObj.getTime();
  } catch (e) {
    return dateString;
  }
};

class ActionDialog extends React.Component {
  state = {
    showEmployeeList: false,
    isDocRequired: false,
    roleserror:false,
    hardCopyReceivedDateError: false,
    commentsErr:false,
    documentsErr: false,
    paymentErr: false,
  };

  getButtonLabelName = label => {
    switch (label) {
      case "FORWARD":
        return "Verify and Forward";
      case "MARK":
        return "Mark";
      case "REJECT":
        return "Reject";
      case "CANCEL":
      case "APPROVE":
        return "APPROVE";
      case "PAY":
        return "Pay";
      case "SENDBACK":
        return "Send Back";
      default:
        return label;
    }
  };
  componentDidUpdate(prevProps) {
    if(prevProps.open === true && this.props.open === false) {
      this.setState({
        showEmployeeList: false,
        isDocRequired: false,
        selectedData: null
      })
    }
    if(this.props.open === true && prevProps.open === false) {
      const {dialogData} = this.props
      this.setState({
        selectedData: dialogData && dialogData.roleProps && dialogData.roleProps.length === 1 ? dialogData.roleProps[0] : null
      })
    }
  }
  handleValidation = (buttonLabel, isDocRequired, applicationState) => {
      let {dataPath, state} = this.props;
      dataPath = `${dataPath}[0]`;
      const data = get(state.screenConfiguration.preparedFinalObject, dataPath)
      const validationDate = data.hardCopyReceivedDate;
      const {dialogData} = this.props;
      const {documentsJsonPath, documentProps} = dialogData
      if(!!dialogData.roleProps) {
        if(!this.state.selectedData){
        this.setState({
          roleserror:true
        })
        return
      }
      else {
        this.setState({
          roleserror: false
        })
      }
    }
      const _buttonLabel = !!this.state.selectedData ? `${buttonLabel}_TO_${this.state.selectedData.role}` : buttonLabel
      const applicationType = (get(state.screenConfiguration.preparedFinalObject, dataPath) || {}).applicationType
      if(!!documentProps) {
        let documents = get(state.screenConfiguration.preparedFinalObject, documentsJsonPath)
        documents = documents.filter(item => !!item)
        if (!documents || !documents.length) {
          this.setState({
            documentsErr: true
          })
          return
        } else {
          this.setState({
            documentsErr: false
          })
        }
      }
      if(buttonLabel === "FORWARD" && (applicationState === "ES_PENDING_DS_VERIFICATION"||applicationState==="ES_MM_PENDING_DS_VERIFICATION")){
        if(!!validationDate) {
          this.props.onButtonClick(_buttonLabel, isDocRequired)
        } else {
          this.setState({
            hardCopyReceivedDateError: true
          })
        }
      } else if(buttonLabel === "FORWARD" && applicationState === "ES_PENDING_DA_FEE") {
        eb_payment_config = eb_payment_config.map((payment) => ({
          ...payment,
          isError: payment.required
            ? !data.applicationDetails[payment.path]
            : !!data.applicationDetails[payment.path]
            ? isNaN(data.applicationDetails[payment.path])
            : false,
        }));
        const isError = eb_payment_config.some(payment => !!payment.isError)
        if(isError) {
          this.setState({
            paymentErr: true
          })
          return
        } else {
          for(let i=0; i < eb_payment_config.length; i++) {
            if(!data.applicationDetails[eb_payment_config[i].path]) {
              this.props.handleFieldChange(`${dataPath}.applicationDetails.${eb_payment_config[i].path}`, "0")
            }
          }
          this.props.onButtonClick(_buttonLabel, isDocRequired)
        }
      } else if(buttonLabel === "FORWARD" && applicationState === "ES_PENDING_DRAFSMAN_CALCULATION") {
        bb_payment_config = bb_payment_config.map((payment) => ({
          ...payment,
          isError: payment.required
          ? !data.applicationDetails[payment.path]
          : !!data.applicationDetails[payment.path]
          ? isNaN(data.applicationDetails[payment.path])
          : false
        }));
        const isError = bb_payment_config.some(payment => !!payment.isError)
        if(isError) {
          this.setState({
            paymentErr: true
          })
          return
        } else {
          for(let i=0; i < bb_payment_config.length; i++) {
            if(!data.applicationDetails[bb_payment_config[i].path]) {
              this.props.handleFieldChange(`${dataPath}.applicationDetails.${bb_payment_config[i].path}`, "0")
            }
          }
          this.props.onButtonClick(_buttonLabel, isDocRequired)
        }
      } else if(buttonLabel === "FORWARD" && applicationState === "ES_PENDING_DA_PREPARE_LETTER" && applicationType !== "ChangeInTrade" && applicationType !== "DuplicateCopy") {
        let finalLetter = data.finalLetter || [];
        finalLetter = finalLetter.filter(item => !!item);
        if(!finalLetter || !finalLetter.length) {
          this.setState({
            finalLetterErr: true
          })
          return
        } else {
          this.setState({
            finalLetterErr: false
          })
          this.props.onButtonClick(_buttonLabel, isDocRequired)
        }
      } else if(buttonLabel == 'APPROVE' || buttonLabel == 'REJECT'){
        const comments = data.comments;
        if(!!comments) {
          this.props.onButtonClick(_buttonLabel, isDocRequired)
        } else {
          this.setState({
            commentsErr: true
          })
        }
      } else {
        this.props.onButtonClick(_buttonLabel, isDocRequired)
      }
  }

  onClose = () => {
    this.setState({
      hardCopyReceivedDateError: false,
      commentsErr:false,
      documentsErr: false
    })
    this.props.onClose()
  }
  onRoleToClick = (e) => {
    const {dialogData} = this.props
    this.setState({
      selectedData: e.target.value,
      showEmployeeList: e.target.value.showEmployeeList,
      isDocRequired: e.target.value.isDocRequired
    })
    const item = {
      buttonLabel: dialogData.buttonLabel,
      buttonUrl: dialogData.buttonUrl,
      dialogHeader: dialogData.dialogHeader,
      isLast: dialogData.isLast,
      moduleName: dialogData.moduleName,
      ...e.target.value
    }
    this.props.onRoleSelect(item)
  }
  render() {  
    let {
      open,
      onClose,
      dropDownData,
      handleFieldChange,
      onButtonClick,
      dialogData,
      dataPath,
      state
    } = this.props;
    const showEmployeeList = !!dialogData && !!dialogData.roleProps && dialogData.roleProps.length === 1 ? dialogData.roleProps[0].showEmployeeList : !!dialogData && !!dialogData.showEmployeeList? !!dialogData.showEmployeeList : this.state.showEmployeeList
    const isDocRequired = !!dialogData && !!dialogData.roleProps && dialogData.roleProps.length === 1 ? dialogData.roleProps[0].isDocRequired : !!dialogData && !!dialogData.isDocRequired? !!dialogData.isDocRequired : this.state.isDocRequired
    const rolesData =  !!dialogData && !!dialogData.roleProps && !!dialogData.roleProps.length ? dialogData.roleProps.map(roledata => ({
      label: roledata.role,
      value: roledata
    })) : []
    const {
      buttonLabel,
      dialogHeader,
      moduleName,
      documentProps,
      documentsJsonPath
    } = dialogData;
    const { getButtonLabelName } = this;
    let fullscreen = false;
    if (window.innerWidth <= 768) {
      fullscreen = true;
    }
    dataPath = `${dataPath}[0]`;
const pattern=/^[0-9]+$/i
    const applicationState = (get(state.screenConfiguration.preparedFinalObject, dataPath) || {}).state
    const applicationType = (get(state.screenConfiguration.preparedFinalObject, dataPath) || {}).applicationType
    const branchtype=(get(state.screenConfiguration.preparedFinalObject,dataPath)||{}).branchType
      let documents = get(state.screenConfiguration.preparedFinalObject, documentsJsonPath) || []
      documents = documents.filter(item => !!item)
    return (
      <Dialog
        fullScreen={fullscreen}
        open={open}
        onClose={this.onClose}
        maxWidth='sm'
        style={{zIndex:2000}}
      >
        <DialogContent
          children={
            <Container
              children={
                <Grid
                  container="true"
                  spacing={12}
                  marginTop={16}
                  className="action-container"
                >
                  <Grid
                    style={{
                      alignItems: "center",
                      display: "flex"
                    }}
                    item
                    sm={10}
                  >
                    <Typography component="h2" variant="subheading">
                      <LabelContainer {...dialogHeader} />
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    sm={2}
                    style={{
                      textAlign: "right",
                      cursor: "pointer",
                      position: "absolute",
                      right: "16px",
                      top: "16px"
                    }}
                    onClick={this.onClose}
                  >
                    <CloseIcon />
                  </Grid>

                  {!!rolesData.length && (<Grid 
                  item
                  sm="12"
                  style={{
                    marginTop: 16
                  }}>
                    <TextFieldContainer
                        select={true}
                        style={{ marginRight: "15px", width: "90%" }}
                        label={fieldConfig.to.label}
                        placeholder={fieldConfig.to.placeholder}
                        required={true}
                        data={rolesData}
                        value={this.state.selectedData}
                        optionValue="value"
                        optionLabel="label"
                        hasLocalization={false}
                        jsonPath={`${dataPath}.roles[0]`}
                        onChange={e => {this.onRoleToClick(e)
                        handleFieldChange(`${dataPath}.roles`, e.target.value) } }                        
                      />
                       {/* <span style={{color: "red"}}>{this.state.errors["roles"]}</span> */}
                       {!!this.state.roleserror && (<span style={{color: "red"}}>Please select the role</span>)}
                  </Grid>)}




                  {showEmployeeList && applicationState !== "ES_MM_PENDING_DA_FEE" &&!!dropDownData.length && (moduleName === "ES-EB-IS-RefundOfEmd" ? buttonLabel !== "MODIFY" : true) && (
                    <Grid
                      item
                      sm="12"
                      style={{
                        marginTop: 16
                      }}
                    >
                      <TextFieldContainer
                        select={true}
                        style={{ marginRight: "15px" }}
                        label={fieldConfig.approverName.label}
                        placeholder={fieldConfig.approverName.placeholder}
                        data={dropDownData}
                        optionValue="value"
                        optionLabel="label"
                        hasLocalization={false}
                        //onChange={e => this.onEmployeeClick(e)}
                        onChange={e =>
                          handleFieldChange(
                            `${dataPath}.assignee`,
                            [e.target.value]
                          )
                        }
                        jsonPath={`${dataPath}.assignee[0]`}
                      />
                    </Grid>
                  )}
                  <Grid item sm="12">
                    <TextFieldContainer
                      InputLabelProps={{ shrink: true }}
                      // label= {fieldConfig.comments.label }
                      label= {buttonLabel == 'APPROVE' || buttonLabel == 'REJECT' ? fieldConfig.mandatoryComments.label : fieldConfig.comments.label }
                      onChange={e =>
                        handleFieldChange(`${dataPath}.comments`, e.target.value)
                      }
                      // required = {true}
                      //jsonPath={this.open != true ? "" : `${dataPath}.comments`}
                      placeholder={fieldConfig.comments.placeholder}
                      inputProps={{ maxLength: 120 }}
                    />
                    {!!this.state.commentsErr && (<span style={{color: "red"}}>Please enter comments</span>)}
                  </Grid>

                  {/* {buttonLabel === "FORWARD" && (applicationState === "ES_PENDING_DA_PREPARE_LETTER" && branchtype==="EstateBranch") && (
                  <Grid item sm="12">
                    <TextFieldContainer
                      InputLabelProps={{ shrink: true }}
                      label= { fieldConfig.termsandcondition.label}
                      onChange={e =>
                        handleFieldChange(`${dataPath}.termsAndConditions`, e.target.value)
                      }
                      placeholder={fieldConfig.termsandcondition.placeholder}
                    />
                  </Grid>
                  )} */}


                  {buttonLabel === "FORWARD" && (applicationState === "ES_PENDING_DS_VERIFICATION" || applicationState == "ES_MM_PENDING_DS_VERIFICATION") && (
                    <Grid item sm="12">
                    <TextFieldContainer
                    type="date"
                    required={true}
                    // defaultValue={new Date().toISOString().split('T')[0]}
                    InputLabelProps={{ shrink: true }}
                    inputProps = {{max: new Date().toISOString().split('T')[0]}}
                    label= {fieldConfig.hardCopyReceivedDate.label}
                    onChange={e =>
                     handleFieldChange( `${dataPath}.hardCopyReceivedDate` , getEpoch(e.target.value))
                   }
                   jsonPath={`${dataPath}.hardCopyReceivedDate`}
                    /> 
                    {!!this.state.hardCopyReceivedDateError && (<span style={{color: "red"}}>Please enter hard copy received date</span>)}
                    </Grid>
                  )}
                   {applicationState === "ES_PENDING_DA_FEE" && buttonLabel === "FORWARD" && eb_payment_config.map((payment, ind) => (
                    <Grid payment sm="12">
                    <TextFieldContainer
                    InputLabelProps={{ shrink: true }}
                    label= {payment.label}
                    onChange={e =>
                      {
                        handleFieldChange(`${dataPath}.applicationDetails.${payment.path}`, e.target.value)
                        eb_payment_config[ind].isError = false
                      }
                    }
                    required = {payment.required}
                    jsonPath={`${dataPath}.applicationDetails.${payment.path}`}
                    placeholder={payment.placeholder}
                    inputProps={{ maxLength: 120 }}
                    /> 
                    {!!payment.isError && (<span style={{color: "red"}}>{getLocaleLabels(payment.errorMessage, payment.errorMessage)}</span>)}
                    </Grid>)
                    )}
                  {applicationState === "ES_PENDING_DRAFSMAN_CALCULATION" && buttonLabel === "FORWARD" && bb_payment_config.map((payment,ind) => (
                    <Grid payment sm="12">
                    <TextFieldContainer
                    InputLabelProps={{ shrink: true }}
                    label= {payment.label}
                    onChange={e =>{
                      handleFieldChange(`${dataPath}.applicationDetails.${payment.path}`, e.target.value)
                      e.target.value.match(pattern)?bb_payment_config[ind].isError = false:
                      bb_payment_config[ind].isError = true
                    }}
                    // required = {true}
                    jsonPath={`${dataPath}.applicationDetails.${payment.path}`}
                    placeholder={payment.placeholder}
                    inputProps={{ maxLength: 120 }}
                    /> 
                    {!!payment.isError && (<span style={{color: "red"}}>{getLocaleLabels(payment.errorMessage, payment.errorMessage)}</span>)}
                    </Grid>
                  ))}

                  {!!documentProps && buttonLabel != "SENDBACK" && (
                    <Grid item sm="12">
                    <Typography
                    component="h3"
                    variant="subheading"
                    style={{
                      color: "rgba(0, 0, 0, 0.8700000047683716)",
                      fontFamily: "Roboto",
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "20px",
                      marginBottom: "8px"
                    }}
                  >
                    <div className="rainmaker-displayInline">
                      <LabelContainer
                        labelName="Supporting Documents"
                        labelKey="ES_WF_APPROVAL_UPLOAD_HEAD"
                      />
                      {isDocRequired && (
                        <span style={{ marginLeft: 5, color: "red" }}>*</span>
                      )}
                    </div>
                  </Typography>
                  <DocumentListContainer {...documentProps}/>
                  {(this.state.documentsErr && (!documents || !documents.length)) && (<span style={{color: "red"}}>Please upload documents</span>)}
                  </Grid>
                  )}

                  {(buttonLabel === "FORWARD" && applicationState === "ES_PENDING_DA_PREPARE_LETTER" && applicationType !== "ChangeInTrade" && applicationType !== "DuplicateCopy") && (<Grid item sm="12">
                  <Typography
                      component="h3"
                      variant="subheading"
                      style={{
                        color: "rgba(0, 0, 0, 0.8700000047683716)",
                        fontFamily: "Roboto",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "20px",
                        marginBottom: "8px"
                      }}
                    >
                      <div className="rainmaker-displayInline">
                        <LabelContainer
                          labelName="Final Letter Document"
                          labelKey="ES_UPLOAD_FINAL_LETTER_DOCUMENT"
                        />
                          <span style={{ marginLeft: 5, color: "red" }}>*</span>
                      </div>
                    </Typography>
                    <div
                      style={{
                        color: "rgba(0, 0, 0, 0.60)",
                        fontFamily: "Roboto",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "20px"
                      }}
                    >
                      <LabelContainer
                        labelName="Only .pdf files. 5MB max file size."
                        labelKey="ES_ONLY_PDF_FILES"
                      />
                    </div>
                    <UploadMultipleFiles
                      maxFiles={1}
                      inputProps={{
                        accept: ".pdf"
                      }}
                      buttonLabel={{ labelName: "UPLOAD FILES",labelKey : "ES_UPLOAD_FILES_BUTTON" }}
                      jsonPath={`${dataPath}.finalLetter`}
                      maxFileSize={5000}
                    />
                    {this.state.finalLetterErr && (<span style={{color: "red"}}>Please upload documents</span>)}
                    </Grid>)}

                  <Grid item sm="12">
                    <Typography
                      component="h3"
                      variant="subheading"
                      style={{
                        color: "rgba(0, 0, 0, 0.8700000047683716)",
                        fontFamily: "Roboto",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "20px",
                        marginBottom: "8px"
                      }}
                    >
                    </Typography>
                    <Grid sm={12} style={{ textAlign: "right" }} className="bottom-button-container">
                      <Button
                        variant={"contained"}
                        color={"primary"}
                        style={{
                          minWidth: "200px",
                          height: "48px"
                        }}
                        className="bottom-button"
                        onClick={() =>
                          this.handleValidation(buttonLabel, isDocRequired, applicationState)
                          // buttonLabel === "FORWARD" && applicationState === "ES_PENDING_DS_VERIFICATION" ? this.handleValidation(buttonLabel, isDocRequired) : onButtonClick(buttonLabel, isDocRequired,applicationState)
                        }
                      >
                        <LabelContainer
                          labelName={getButtonLabelName(buttonLabel)}
                          labelKey={
                            moduleName
                              ? `WF_${moduleName.toUpperCase()}_${buttonLabel}`
                              : ""
                          }
                        />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              }
            />
          }
        />
      </Dialog>
    );
  }
}
export default withStyles(styles)(ActionDialog);

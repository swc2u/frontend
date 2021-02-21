
import {
  getBreak,
  getCommonCard,
  getCommonContainer,
  getCommonGrayCard,
  getCommonTitle,
  getSelectField,
  getTextField,
  getDateField,
  getPattern,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { downloadAcknowledgementLetter , downloadAcknowledgementForm} from "../../utils";;
import "./index.css";
import { getPMSPattern } from "../../../../../ui-utils/commons";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTransformedLocale, getFileUrlFromAPI } from "egov-ui-framework/ui-utils/commons";
import axios from 'axios';
import { sampleGetBill, ApplicationConfiguration } from "../../../../../ui-utils/sampleResponses";
import { httpRequest } from "../../../../../ui-utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
const ActiongetLetter = async (state, dispatch) => {
  const { PaymentDetails} = state.screenConfiguration.preparedFinalObject;
  try {
    let config = ApplicationConfiguration();
    downloadAcknowledgementLetter(PaymentDetails,config.DOP_PAYMENT_ORDER,config.DOP_PAYMENT_ORDER_config)
   
  }
  catch(error)
  {
    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
  }
}
const ActiongetApplication = async (state, dispatch) => {
  //let response = WFConfig(); 
  const { PaymentDetails} = state.screenConfiguration.preparedFinalObject;
 
  try {
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const tenantId = getQueryArg(window.location.href, "tenantId");
    let queryObject = [
      {
        key: "tenantId",
        value: tenantId
      }];
    queryObject.push({
      key: "businessIds",
      value: applicationNumber
    });
      let url = "/pension-services/v1/_searchWorkflowPaymentDetails";
    
      let pdfResponce = await httpRequest(
        "post",
        url,
        "_search",          
        queryObject
      );
    let config = ApplicationConfiguration();
    downloadAcknowledgementLetter(pdfResponce.PaymentDetails,config.DOP_PAYMENT_ORDER,config.DOP_PAYMENT_ORDER_config)
  }
  catch(error)
  {
    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
  }
  
}



export const otherDetails = (data) => {
  //alert(data[5].Isletter)
//export const otherDetails = getCommonCard({
  // header: getCommonTitle(
  //   {
  //     labelName: "Applicant Details",
  //     labelKey: "PENSION_EMPLOYEE_OTHER_DETAIL"
  //   },
  //   {
  //     style: {
  //       marginBottom: 18
  //     }
  //   }
  // ),
  return getCommonCard({
  break: getBreak(),
  otherdetails: getCommonContainer({
   
    comments: getTextField({
      label: {
        labelName: "Comment",
        labelKey: "PENSION_EMPLOYEE_PENSION_COMMENT"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "Comment",
        labelKey: "PENSION_EMPLOYEE_PENSION_COMMENT"
      },
      required: true,
      props: {
        disabled: false,       
      },
      pattern: getPMSPattern("WFComment"),
      jsonPath: "ProcessInstances[0].comment"
    }),
    dateOfContingent: {
      ...getDateField({
        label: {
          labelName: "Date of Contingent",
          labelKey: "PENSION_EMPLOYEE_PENSION_DOC"
        },
        placeholder: {
          labelName: "Trade License From Date",
          labelName: "PENSION_EMPLOYEE_PENSION_DOC"
        },
       
        props: {
          disabled: false,      
        },
        pattern: getPattern("Date"),
        jsonPath: "ProcessInstances[0].employeeOtherDetails.dateOfContingent",
        props: {
          className:"applicant-details-error",
         
        }
      }),
      visible: data[5].Isletter
    },
  }),

  isDDODeclaration: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-pms",
    componentPath: "CheckboxContainer",
    gridDefination: {
      xs: 24,
      sm: 12

    },
    visible: !data[0].employeeOtherDetailsUpdate,
    isFieldValid: true,
    required:false,
    props: {
      //content: "isDaMedicalAdmissible",
      content: "PENSION_WORKFLOW_DDO_DECLARATION",
      jsonPath: "ProcessInstances[0].employeeOtherDetails.isDDODeclaration",
     disabled: false,
    }

  },
  // isAODeclaration: {
  //   uiFramework: "custom-containers-local",
  //   moduleName: "egov-pms",
  //   componentPath: "CheckboxContainer",
  //   gridDefination: {
  //     xs: 6
  //   },
  //   visible: data[5].Isletter,
  //   isFieldValid: true,
  //   required:false,
  //   props: {
  //     //content: "isDaMedicalAdmissible",
  //     content: "PENSION_WORKFLOW_AO_DECLARATION",
  //     jsonPath: "ProcessInstances[0].employeeOtherDetails.isAODeclaration",
  //    disabled: false,
  //   }

  // },
  
  POApplication: {
    componentPath: "Button",
    gridDefination: {
      xs: 12,
      sm: 6,
      align: "left"
    },
    visible: data[5].Isletter,
    props: {
      variant: "contained",
      color: "primary",
      style: {
        color: "white",
        borderRadius: "2px",
        width: "250px",
        height: "48px"
      }
    },

    children: {
     

      buttonLabel: getLabel({
        labelName: "NEW APPLICATION",
        labelKey: "PENSION_LETTER_DOWNLOAD"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: ActiongetApplication

    },
    
  },
  pensionLetter: {
    componentPath: "Button",
    gridDefination: {
      xs: 12,
      sm: 6,
      align: "left"
    },
    visible: false,//data[5].Isletter,
    props: {
      variant: "contained",
      color: "primary",
      style: {
        color: "white",
        borderRadius: "2px",
        width: "250px",
        height: "48px"
      }
    },

    children: {
     

      buttonLabel: getLabel({
        labelName: "NEW APPLICATION",
        labelKey: "PENSION_LETTER_DOWNLOAD"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: ActiongetLetter

    },
    
  },
});
}

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

import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {  
  WFConfig, 
  ActionMessage
  } from "../../../../../ui-utils/sampleResponses";
  import { httpRequest } from "../../../../../ui-utils";
  import { getPMSPattern } from "../../../../../ui-utils/commons";



export const PensionerDetails = (IsEdit) => {
//export const pensionDetails = getCommonCard({ 
return getCommonCard({
header: getCommonTitle(
{
  labelName: "Pension Information",
  labelKey: "PENSION_EMPLOYEE_PENSIONER_DATA"
},
{
  style: {
    marginBottom: 18
  }
}
),
pensionDetailsConatiner: getCommonContainer({

//2
pensionerName: getTextField({
  label: {
    labelName: "Pesioner Name",
    labelKey: "PENSION_PENSIONER_NAME_INPUT"
  },
  props:{
    className:"applicant-details-error"
  }, 
  placeholder: {
    labelName: "basicPension",
    labelKey: "PENSION_PENSIONER_NAME_INPUT"
  },
  required:true,
    minValue:0,
    maxLength:18,
  props: {
    disabled:false,        
  },
  pattern: getPMSPattern("Amount"),
  jsonPath: "ProcessInstances[0].pensionRevision[0].basicPension"
}),
dob: getDateField({
  label: {
    labelName: "Date of Birth",
    labelKey: "PENSION_DOB"
  },
  props:{
    className:"applicant-details-error"
  }, 
  placeholder: {
    labelName: "Date of Birth",
    labelKey: "PENSION_DOB"
  },
  required: true,
  minValue:0,
  props: {
    disabled: false,      
  },
  pattern: getPattern("Date"),
  jsonPath: "ProcessInstances[0].dependents[0].dob"
}),
gender: getTextField({
  label: {
    labelName: "gender",
    labelKey: "PENSION_EMPLOYEE_GENDER"
  },
  props:{
    className:"applicant-details-error"
  },
  placeholder: {
    labelName: "gender",
    labelKey: "PENSION_EMPLOYEE_GENDER"
  },
  required:true,
  props: {
    disabled: false,       
  },
  pattern: getPattern("name"),
  jsonPath: "ProcessInstances[0].employee.user.gender"
}),
mobileNumber: getTextField({
  label: {
    labelName: "mobileNumber",
    labelKey: "PENSION_EMPLOYEE_MOBILE_NUMBER"
  },
  props:{
    className:"applicant-details-error"
  },
  placeholder: {
    labelName: "mobileNumber",
    labelKey: "PENSION_EMPLOYEE_MOBILE_NUMBER"
  },
  required:true,
  props: {
    disabled: false,       
  },
  pattern: getPattern("name"),
  jsonPath: "ProcessInstances[0].employee.user.mobileNumber"
}),
email: getTextField({
  label: {
    labelName: "mobileNumber",
    labelKey: "PENSION_EMPLOYEE_EMAIL"
  },
  props:{
    className:"applicant-details-error"
  },
  placeholder: {
    labelName: "mobileNumber",
    labelKey: "PENSION_EMPLOYEE_EMAIL"
  },
  required:true,
  props: {
    disabled: false,       
  },
  pattern: getPattern("name"),
  jsonPath: "ProcessInstances[0].employee.user.mobileNumber"
}),
Address: getTextField({
  label: {
    labelName: "Address",
    labelKey: "PENSION_DEPENDENT_ADDRESS_P"
  },
  props:{
    className:"applicant-details-error"
  }, 
  placeholder: {
    labelName: "Address",
    labelKey: "PENSION_DEPENDENT_ADDRESS_P"
  },
  required: true,
  minValue:0,
  props: {
    disabled: false,      
  },
  pattern: getPMSPattern("Address"),
  jsonPath: "ProcessInstances[0].dependents[0].address"
}),
doc: getDateField({
  label: {
    labelName: "Date of Comminsment",
    labelKey: "PENSION_DOCM"
  },
  props:{
    className:"applicant-details-error"
  }, 
  placeholder: {
    labelName: "Date of Birth",
    labelKey: "PENSION_DOCM"
  },
  required: true,
  minValue:0,
  props: {
    disabled: false,      
  },
  pattern: getPattern("Date"),
  jsonPath: "ProcessInstances[0].dependents[0].dob"
}),



})
});
}
export const PensionerBankDetails = (IsEdit) => {
//export const pensionDetails = getCommonCard({ 
return getCommonCard({
header: getCommonTitle(
  {
    labelName: "Pensioner Bank Information",
    labelKey: "PENSION_EMPLOYEE_PENSIONER_BANK_DATA"
  },
  {
    style: {
      marginBottom: 18
    }
  }
),
pensionBankDetailsConatiner: getCommonContainer({

  //2
  bankAccountNumber: getTextField({
    label: {
      labelName: "Pesioner Name",
      labelKey: "PENSION_EMPLOYEE_PENSION_AN"
    },
    props:{
      className:"applicant-details-error"
    }, 
    placeholder: {
      labelName: "basicPension",
      labelKey: "PENSION_EMPLOYEE_PENSION_AN"
    },
    required:true,
      minValue:0,
      maxLength:18,
    props: {
      disabled:false,        
    },
    pattern: getPMSPattern("Amount"),
    jsonPath: "ProcessInstances[0].pensionRevision[0].basicPension"
  }),       
  bankName: getTextField({
    label: {
      labelName: "bankName",
      labelKey: "PENSION_EMPLOYEE_PENSION_BN"
    },
    props:{
      className:"applicant-details-error"
    },
    placeholder: {
      labelName: "bankName",
      labelKey: "PENSION_EMPLOYEE_PENSION_BN"
    },
    required:true,
    props: {
      disabled: false,       
    },
    pattern: getPattern("name"),
    jsonPath: "ProcessInstances[0].employee.user.gender"
  }),
  bankIfsc: getTextField({
    label: {
      labelName: "mobileNumber",
      labelKey: "PENSION_BANK_IFSC"
    },
    props:{
      className:"applicant-details-error"
    },
    placeholder: {
      labelName: "mobileNumber",
      labelKey: "PENSION_BANK_IFSC"
    },
    required:true,
    props: {
      disabled: true,       
    },
    pattern: getPattern("name"),
    jsonPath: "ProcessInstances[0].employee.user.mobileNumber"
  }),
  bankcode: getTextField({
    label: {
      labelName: "mobileNumber",
      labelKey: "PENSION_BANK_CODE"
    },
    props:{
      className:"applicant-details-error"
    },
    placeholder: {
      labelName: "mobileNumber",
      labelKey: "PENSION_BANK_CODE"
    },
    required:true,
    props: {
      disabled: false,       
    },
    pattern: getPattern("name"),
    jsonPath: "ProcessInstances[0].employee.user.mobileNumber"
  }),
  Address: getTextField({
    label: {
      labelName: "Address",
      labelKey: "PENSION_EMPLOYEE_PENSION_BA"
    },
    props:{
      className:"applicant-details-error"
    }, 
    placeholder: {
      labelName: "Address",
      labelKey: "PENSION_EMPLOYEE_PENSION_BA"
    },
    required: true,
    minValue:0,
    props: {
      disabled: false,      
    },
    pattern: getPMSPattern("Address"),
    jsonPath: "ProcessInstances[0].dependents[0].address"
  }),

  

  
})
});
}
export const PensionerClaimantDetails = (IsEdit) => {
//export const pensionDetails = getCommonCard({ 
  return getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Pensioner Claimant Information",
      labelKey: "PENSION_EMPLOYEE_PENSIONER_C_I"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  pensionClaimantDetailsConatiner: getCommonContainer({
  
    //2
    ClaimantName: getTextField({
      label: {
        labelName: "Claimant Name",
        labelKey: "PENSION_EMPLOYEE_PENSION_CN"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "basicPension",
        labelKey: "PENSION_EMPLOYEE_PENSION_CN"
      },
      required:true,
        minValue:0,
        maxLength:18,
      props: {
        disabled:false,        
      },
      pattern: getPMSPattern("Amount"),
      jsonPath: "ProcessInstances[0].pensionRevision[0].basicPension"
    }),       
    ClaimantDateofBirth: getTextField({
      label: {
        labelName: "bankName",
        labelKey: "PENSION_EMPLOYEE_PENSION_CDOB"
      },
      props:{
        className:"applicant-details-error"
      },
      placeholder: {
        labelName: "bankName",
        labelKey: "PENSION_EMPLOYEE_PENSION_CDOB"
      },
      required:true,
      props: {
        disabled: false,       
      },
      pattern: getPattern("name"),
      jsonPath: "ProcessInstances[0].employee.user.gender"
    }),
    ClaimantrelationType: {
      ...getSelectField({
        label: {
          labelName: "relation Type",
          labelKey: "PENSION_DEPENDENT_TYPEC"
        },
        placeholder: {
          labelName: "Select relation Type",
          labelKey: "PENSION_DEPENDENT_TYPEC"
        },
        required: true,
       
        jsonPath: "ProcessInstances[0].dependents[0].relationship",
        localePrefix: {
          moduleName: "egov-PENSION",
         masterName: "relationType"
        },
        props: {
          jsonPathUpdatePrefix: "ProcessInstances[0].dependents",
          setDataInField: true,
          disabled: false,  
          className:"applicant-details-error"
        },
        sourceJsonPath:
        "applyScreenMdmsData.pension.relationships",
        //"applyScreenMdmsData.relationships",
       
      }),
      beforeFieldChange: (action, state, dispatch) => { 
         
       
      }
    },
    ClaimantMobileNumber: getTextField({
      label: {
        labelName: "mobileNumber",
        labelKey: "PENSION_EMPLOYEE_MOBILE_NUMBER_C"
      },
      props:{
        className:"applicant-details-error"
      },
      placeholder: {
        labelName: "mobileNumber",
        labelKey: "PENSION_EMPLOYEE_MOBILE_NUMBER_C"
      },
      required:true,
      props: {
        disabled: false,       
      },
      pattern: getPattern("name"),
      jsonPath: "ProcessInstances[0].employee.user.mobileNumber"
    }),
    
    ClaimantAdddress: getTextField({
      label: {
        labelName: "Address",
        labelKey: "PENSION_EMPLOYEE_PENSION_CA"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "Address",
        labelKey: "PENSION_EMPLOYEE_PENSION_CA"
      },
      required: true,
      minValue:0,
      props: {
        disabled: false,      
      },
      pattern: getPMSPattern("Address"),
      jsonPath: "ProcessInstances[0].dependents[0].address"
    }),
    claimantbankname: getTextField({
      label: {
        labelName: "mobileNumber",
        labelKey: "PENSION_EMPLOYEE_PENSION_CBN"
      },
      props:{
        className:"applicant-details-error"
      },
      placeholder: {
        labelName: "mobileNumber",
        labelKey: "PENSION_EMPLOYEE_PENSION_CBN"
      },
      required:true,
      props: {
        disabled: false,       
      },
      pattern: getPattern("name"),
      jsonPath: "ProcessInstances[0].employee.user.mobileNumber"
    }),
    
    ClaimantbankIfsc: getTextField({
      label: {
        labelName: "mobileNumber",
        labelKey: "PENSION_BANK_IFSC_C"
      },
      props:{
        className:"applicant-details-error"
      },
      placeholder: {
        labelName: "mobileNumber",
        labelKey: "PENSION_BANK_IFSC_C"
      },
      required:true,
      props: {
        disabled: false,       
      },
      pattern: getPattern("name"),
      jsonPath: "ProcessInstances[0].employee.user.mobileNumber"
    }),
    Claimantbankcode: getTextField({
      label: {
        labelName: "mobileNumber",
        labelKey: "PENSION_BANK_CODE_C"
      },
      props:{
        className:"applicant-details-error"
      },
      placeholder: {
        labelName: "mobileNumber",
        labelKey: "PENSION_BANK_CODE_C"
      },
      required:true,
      props: {
        disabled: false,       
      },
      pattern: getPattern("name"),
      jsonPath: "ProcessInstances[0].employee.user.mobileNumber"
    }),
    ClaimantbankAccountNumber: getTextField({
      label: {
        labelName: "Pesioner Name",
        labelKey: "PENSION_EMPLOYEE_PENSION_AN_C"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "basicPension",
        labelKey: "PENSION_EMPLOYEE_PENSION_AN_C"
      },
      required:true,
        minValue:0,
        maxLength:18,
      props: {
        disabled:false,        
      },
      pattern: getPMSPattern("Amount"),
      jsonPath: "ProcessInstances[0].pensionRevision[0].basicPension"
    }), 

    
  })
});
}

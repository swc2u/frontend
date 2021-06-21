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
    labelName: "name",
    labelKey: "PENSION_PENSIONER_NAME_INPUT"
  },
  required:true,
    minValue:0,
    maxLength:18,
  props: {
    disabled:false,        
  },
  pattern: getPMSPattern("Address"),
  jsonPath: "PensionerDetails.name"
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
    inputProps: {
      max: new Date().toISOString().slice(0, 10),
    },
    disabled: false,      
  },
  pattern: getPattern("Date"),
  jsonPath: "PensionerDetails.dob"
}),
// gender: getTextField({
//   label: {
//     labelName: "gender",
//     labelKey: "PENSION_EMPLOYEE_GENDER"
//   },
//   props:{
//     className:"applicant-details-error"
//   },
//   placeholder: {
//     labelName: "gender",
//     labelKey: "PENSION_EMPLOYEE_GENDER"
//   },
//   required:true,
//   props: {
//     disabled: false,       
//   },
//   pattern: getPattern("name"),
//   jsonPath: "PensionerDetails.gender"
// }),
gender: {
  ...getSelectField({
    label: { labelName: "Gender", labelKey: "PENSION_EMPLOYEE_GENDER" },
    placeholder: {
      labelName: "Select Gender",
      labelKey: "PENSION_EMPLOYEE_GENDER"
    },
    required: true,
    jsonPath: "PensionerDetails.gender",
    props: {
      className: "hr-generic-selectfield",
      data: [
        {
          value: "MALE",
          label: "COMMON_GENDER_MALE"
        },
        {
          value: "FEMALE",
          label: "COMMON_GENDER_FEMALE"
        },
        {
          value: "OTHERS",
         // label: "COMMON_GENDER_OTHERS"
          label: "OTHERS"
        }
      ],
      optionValue: "value",
      optionLabel: "label"
    }
  })
},
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
  pattern: getPattern("MobileNo"),
  jsonPath: "PensionerDetails.mobileNumber"
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
    labelName: "email",
    labelKey: "PENSION_EMPLOYEE_EMAIL"
  },
  required:true,
  props: {
    disabled: false,       
  },
  pattern: getPMSPattern("Email"),
  jsonPath: "PensionerDetails.email"
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
  jsonPath: "PensionerDetails.address"
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
  jsonPath: "PensionerDetails.wef"
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
      labelName: "Bank Account Number",
      labelKey: "PENSION_EMPLOYEE_PENSION_AN"
    },
    props:{
      className:"applicant-details-error"
    }, 
    placeholder: {
      labelName: "Bank Account Number",
      labelKey: "PENSION_EMPLOYEE_PENSION_AN"
    },
    required:true,
      minValue:0,
      maxLength:18,
    props: {
      disabled:false,        
    },
    pattern: getPMSPattern("Amount"),
    jsonPath: "PensionerDetails.bankAccountNumber"
  }),       
  // bankName: getTextField({
  //   label: {
  //     labelName: "bankName",
  //     labelKey: "PENSION_EMPLOYEE_PENSION_BN"
  //   },
  //   props:{
  //     className:"applicant-details-error"
  //   },
  //   placeholder: {
  //     labelName: "bank Details",
  //     labelKey: "PENSION_EMPLOYEE_PENSION_BN"
  //   },
  //   required:true,
  //   props: {
  //     disabled: false,       
  //   },
  //   pattern: getPattern("name"),
  //   jsonPath: "PensionerDetails.bankDetails"
  // }),
  bankName: getSelectField({
    label: {
      labelName: "Bank address",
      labelKey: "PENSION_EMPLOYEE_PENSION_BN"
    },
    props:{
      className:"applicant-details-error"
    }, 
    placeholder: {
      labelName: "Bank address",
      labelKey: "PENSION_EMPLOYEE_PENSION_BN"
    },
    required:true,
    props: {
      disabled: false,
      optionValue: "code",
      optionLabel: "name"      
    },
    pattern: getPattern("name"),
    jsonPath: "PensionerDetails.bankDetails",
    //jsonPath: "ProcessInstances[0].employeeOtherDetails.bankAddress",
    sourceJsonPath:
   "applyScreenMdmsData.pension.BankDetails",
  }),
  bankIfsc: getTextField({
    label: {
      labelName: "Bank Ifsc",
      labelKey: "PENSION_BANK_IFSC"
    },
    props:{
      className:"applicant-details-error"
    },
    placeholder: {
      labelName: "Bank Ifsc",
      labelKey: "PENSION_BANK_IFSC"
    },
    required:true,
    props: {
      disabled: false,       
    },
    pattern: getPattern("name"),
    jsonPath: "PensionerDetails.bankIfsc"
  }),
  bankcode: getTextField({
    label: {
      labelName: "bankCode",
      labelKey: "PENSION_BANK_CODE"
    },
    props:{
      className:"applicant-details-error"
    },
    placeholder: {
      labelName: "bankCode",
      labelKey: "PENSION_BANK_CODE"
    },
    required:false,
    props: {
      disabled: false,       
    },
    pattern: getPattern("name"),
    jsonPath: "PensionerDetails.bankCode"
  }),
  Address: getTextField({
    label: {
      labelName: "bankDetails",
      labelKey: "PENSION_EMPLOYEE_PENSION_BA"
    },
    props:{
      className:"applicant-details-error"
    }, 
    placeholder: {
      labelName: "bankDetails",
      labelKey: "PENSION_EMPLOYEE_PENSION_BA"
    },
    required: true,
    visible:false,
    minValue:0,
    props: {
      disabled: false,      
    },
    pattern: getPMSPattern("Address"),
    jsonPath: "PensionerDetails.bankDetails"
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
        labelName: "claimantName",
        labelKey: "PENSION_EMPLOYEE_PENSION_CN"
      },
      required:true,
        minValue:0,
        maxLength:18,
      props: {
        disabled:false,        
      },
      pattern: getPMSPattern("Name"),
      jsonPath: "PensionerDetails.claimantName"
    }),       
    ClaimantDateofBirth: getDateField({
      label: {
        labelName: "claimantDob",
        labelKey: "PENSION_EMPLOYEE_PENSION_CDOB"
      },
      props:{
        className:"applicant-details-error"
      },
      placeholder: {
        labelName: "claimantDob",
        labelKey: "PENSION_EMPLOYEE_PENSION_CDOB"
      },
      required:true,
      props: {
        inputProps: {
          max: new Date().toISOString().slice(0, 10),
        },
        disabled: false,       
      },
      pattern: getPattern("Date"),
      jsonPath: "PensionerDetails.claimantDob"
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
       
        jsonPath: "PensionerDetails.claimantRelationship",
        localePrefix: {
          moduleName: "egov-PENSION",
         masterName: "relationType"
        },
        props: {
          jsonPathUpdatePrefix: "PensionerDetails.dependents",
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
        labelName: "claimantMobileNumber",
        labelKey: "PENSION_EMPLOYEE_MOBILE_NUMBER_C"
      },
      props:{
        className:"applicant-details-error"
      },
      placeholder: {
        labelName: "claimantMobileNumber",
        labelKey: "PENSION_EMPLOYEE_MOBILE_NUMBER_C"
      },
      required:true,
      props: {
        disabled: false,       
      },
      pattern: getPattern("name"),
      jsonPath: "PensionerDetails.claimantMobileNumber"
    }),
    
    ClaimantAdddress: getTextField({
      label: {
        labelName: "claimantAddress",
        labelKey: "PENSION_EMPLOYEE_PENSION_CA_LABEL"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "claimantAddress",
        labelKey: "PENSION_EMPLOYEE_PENSION_CA_LABEL"
      },
      required: true,
      minValue:0,
      props: {
        disabled: false,      
      },
      pattern: getPMSPattern("Address"),
      jsonPath: "PensionerDetails.claimantAddress"
    }),
    // claimantbankname: getTextField({
    //   label: {
    //     labelName: "claimantBankDetails",
    //     labelKey: "PENSION_EMPLOYEE_PENSION_CBN"
    //   },
    //   props:{
    //     className:"applicant-details-error"
    //   },
    //   placeholder: {
    //     labelName: "claimantBankDetails",
    //     labelKey: "PENSION_EMPLOYEE_PENSION_CBN"
    //   },
    //   required:true,
    //   props: {
    //     disabled: false,       
    //   },
    //   pattern: getPattern("name"),
    //   jsonPath: "PensionerDetails.claimantBankDetails"
    // }),
    claimantbankname: getSelectField({
      label: {
        labelName: "Bank address",
        labelKey: "PENSION_EMPLOYEE_PENSION_CBN"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "Bank address",
        labelKey: "PENSION_EMPLOYEE_PENSION_CBN"
      },
      required:false,
      props: {
        disabled: false,
        optionValue: "code",
        optionLabel: "name"      
      },
      pattern: getPattern("name"),
      jsonPath: "PensionerDetails.claimantBankDetails",
      //jsonPath: "ProcessInstances[0].employeeOtherDetails.bankAddress",
      sourceJsonPath:
     "applyScreenMdmsData.pension.BankDetails",
    }),
    
    ClaimantbankIfsc: getTextField({
      label: {
        labelName: "claimantBankIfsc",
        labelKey: "PENSION_BANK_IFSC_C"
      },
      props:{
        className:"applicant-details-error"
      },
      placeholder: {
        labelName: "claimantBankIfsc",
        labelKey: "PENSION_BANK_IFSC_C"
      },
      required:true,
      props: {
        disabled: false,       
      },
      pattern: getPattern("name"),
      jsonPath: "PensionerDetails.claimantBankIfsc"
    }),
    Claimantbankcode: getTextField({
      label: {
        labelName: "claimantBankCode",
        labelKey: "PENSION_BANK_CODE_C"
      },
      props:{
        className:"applicant-details-error"
      },
      placeholder: {
        labelName: "claimantBankCode",
        labelKey: "PENSION_BANK_CODE_C"
      },
      required:false,
      props: {
        disabled: false,       
      },
      pattern: getPattern("name"),
      jsonPath: "PensionerDetails.claimantBankCode"
    }),
    ClaimantbankAccountNumber: getTextField({
      label: {
        labelName: "claimantBankAccountNumber",
        labelKey: "PENSION_EMPLOYEE_PENSION_AN_C"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "claimantBankAccountNumber",
        labelKey: "PENSION_EMPLOYEE_PENSION_AN_C"
      },
      required:true,
        minValue:0,
        maxLength:18,
      props: {
        disabled:false,        
      },
      pattern: getPMSPattern("Amount"),
      jsonPath: "PensionerDetails.claimantBankAccountNumber"
    }), 

    
  })
});
}

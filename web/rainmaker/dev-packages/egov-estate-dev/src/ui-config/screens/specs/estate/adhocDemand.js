import {
    handleScreenConfigurationFieldChange as handleField,
    prepareFinalObject,
    toggleSnackbar
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import {
    getCommonHeader,
    getCommonCard,
    getCommonContainer,
    getTextField,
    getDateField,
    getPattern,
    getCommonTitle,
    getLabel,
    getSelectField
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  
  import {
    getSearchResults
  } from "../../../../ui-utils/commons";
  import {
    propertyInfo
  } from "./preview-resource/preview-properties";
  import {
    getQueryArg
  } from "egov-ui-framework/ui-utils/commons";
  import {addHocDemandUpdate} from '../../../../ui-utils/apply'
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import get from "lodash/get";
  import { validateFields,getTodaysDateInYMD, _getPattern } from "../utils";
import { set } from "lodash";
  
  const header = getCommonHeader({
    labelName: "Adhoc Demand",
    labelKey: "ES_ADHOC_DEMAND_HEADER"
  });
  
  
  const beforeInitFn = async (action, state, dispatch) => {
    let fileNumber = getQueryArg(window.location.href, "fileNumber")
    const queryObject = [{
      key: "fileNumber",
      value: fileNumber
    }]
    const response = await getSearchResults(queryObject)
    if (!!response.Properties && !!response.Properties.length) {
      dispatch(prepareFinalObject("Properties", response.Properties))
    }
  }
  
  const adhocDetailsHeader = getCommonTitle({
    labelName: "Adhoc Demand Details",
    labelKey: "ES_ADHOC_DEMAND_DETAILS_HEADER"
  }, {
    style: {
      marginBottom: 18,
      marginTop: 18
    }
  })
  
  const RentField = {
    label: {
        labelName: "Rent",
        labelKey: "ES_RENT_LABEL"
    },
    placeholder: {
        labelName: "Enter Rent",
        labelKey: "ES_RENT_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    errorMessage:"ES_ERROR_ONLY_NUMBERIC_VALUE",
    pattern: _getPattern('float'),
    required: true,
    jsonPath: "adhocDetails.rent",
    visible:false
  }

  const gstField = {
    label: {
        labelName: "GST",
        labelKey: "ES_GST_LABEL"
    },
    placeholder: {
        labelName: "Enter Gst",
        labelKey: "ES_GST_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    errorMessage:"ES_ERROR_ONLY_NUMBERIC_VALUE",
    pattern: _getPattern('float'),
    required: true,
    jsonPath: "adhocDetails.gst",
    visible:false
  }

  const interestOnRentField = {
    label: {
        labelName: "Interest on Rent",
        labelKey: "ES_INTEREST_ON_RENT_LABEL"
    },
    placeholder: {
        labelName: "Enter Interest on Rent",
        labelKey: "ES_INTEREST_ON_RENT_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    errorMessage:"ES_ERROR_ONLY_NUMBERIC_VALUE",
    pattern: _getPattern('float'),
    required: true,
    jsonPath: "adhocDetails.penaltyInterest",
    visible:false
  }

  const intestOnGstField = {
    label: {
        labelName: "Interest On Gst",
        labelKey: "ES_INTEREST_ON_GST_LABEL"
    },
    placeholder: {
        labelName: "Enter Gst",
        labelKey: "ES_INTEREST_ON_GST_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    errorMessage:"ES_ERROR_ONLY_NUMBERIC_VALUE",
    pattern: _getPattern('float'),
    required: true,
    jsonPath: "adhocDetails.gstInterest",
    visible:false
  }

const dateOfAdjustmentEntryField = {
  label: {
    labelName: "Date of Adjustment entry",
    labelKey: "ES_ADJUSTMENT_ENTRY_DATE_LABEL"
  },
  placeholder: {
    labelName: "Select Date",
    labelKey: "ES_ADJUSTMENT_ENTRY_PLACEHOLDER"
  },
  required: true,
  pattern: getPattern("Date"),
  jsonPath: "adhocDetails.adjustmentDate",
  props: {
      inputProps: {
          max: getTodaysDateInYMD()
      }
  },
  errorMessage:"ES_ERR_DATE_OF_ADJUSTMENT",
  visible:false
}

const commentsField = {
  label: {
      labelName: "Comments",
      labelKey: "ES_COMMENTS_LABEL"
  },
  placeholder: {
      labelName: "Enter Comments",
      labelKey: "ES_COMMENTS_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  jsonPath: "adhocDetails.comment",
  visible:false
}
const commentField = {
  label: {
      labelName: "Comments",
      labelKey: "ES_COMMENTS_LABEL"
  },
  placeholder: {
      labelName: "Enter Comments",
      labelKey: "ES_COMMENTS_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  jsonPath: "adhocDetails.comments",
  visible:false
}
const AmountPaid = {
  label: {
      labelName: "Amount",
      labelKey: "ES_AMOUNT_LABEL"
  },
  placeholder: {
      labelName: "Enter Amount",
      labelKey: "ES_AMOUNT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  errorMessage:"ES_ERROR_ONLY_NUMBERIC_VALUE",
  pattern: _getPattern('float'),
  required: true,
  jsonPath: "adhocDetails.amountPaid",
  visible:false
}

const dateOfPaymentField = {
  label: {
    labelName: "Date of Payment",
    labelKey: "ES_DATE_OF_PAYMENT_LABEL"
  },
  placeholder: {
    labelName: "Select Date",
    labelKey: "ES_DATE_OF_PAYMENT_PLACEHOLDER"
  },
  required: true,
  pattern: getPattern("Date"),
  jsonPath: "adhocDetails.dateOfPayment",
  props: {
      inputProps: {
          max: getTodaysDateInYMD()
      }
  },
  errorMessage:"ES_ERR_DATE_OF_PAYMENT",
  visible:false
}

const adhocdemand = {
  label: {
    labelName: "Payment Mode",
    labelKey: "ES_ADHOC_DEMAND_PAYMENT",
  },
  placeholder: {
    labelName: "Select Payment Mode",
    labelKey: "ES_ADHOC_DEMAND_PLACEHOLDER",
  },
  required: true,
  optionValue: "value",
  optionLabel: "label",
  jsonPath: "adhocDetails.type",
  data: [
    {
      label: "ES_ADHOC_DEMAND",
      value: "AdhocDemand",
    },
    {
      label: "ES_ADHOC_PAYMENT",
      value: "AdhocPayment",
    }
  ],
  gridDefination: {
    xs: 12,
    sm: 6,
  },
  errorMessage: "RP_ERR_ADHOC_DEMAND_FIELD",
  afterFieldChange: (action, state, dispatch) => {
 if(action.value==="AdhocDemand"){
   set(state.screenConfiguration.preparedFinalObject,"Properties[0].propertyDetails.adhocDemand",true)
   set(state.screenConfiguration.preparedFinalObject,"Properties[0].propertyDetails.adhocPayment",false)
   dispatch(
     handleField(
       "adhocDemand",
      "components.div.children.detailsContainer.children.adhocDetails.children.cardContent.children.detailsContainer.children.adjustmentEntryDate",
      "visible",
      true
     )
   )
   dispatch(
    handleField(
      "adhocDemand",
      "components.div.children.detailsContainer.children.adhocDetails.children.cardContent.children.detailsContainer.children.gst",
     "visible",
     true
    )
  )
  dispatch(
    handleField(
      "adhocDemand",
      "components.div.children.detailsContainer.children.adhocDetails.children.cardContent.children.detailsContainer.children.gstInterest",
     "visible",
     true
    )
  )
  dispatch(
    handleField(
      "adhocDemand",
      "components.div.children.detailsContainer.children.adhocDetails.children.cardContent.children.detailsContainer.children.rent",
     "visible",
     true
    )
  )
  dispatch(
    handleField(
      "adhocDemand",
      "components.div.children.detailsContainer.children.adhocDetails.children.cardContent.children.detailsContainer.children.rentInterest",
     "visible",
     true
    )
  )
  dispatch(
    handleField(
      "adhocDemand",
      "components.div.children.detailsContainer.children.adhocDetails.children.cardContent.children.detailsContainer.children.comment",
     "visible",
     false
    )
  )
  dispatch(
    handleField(
      "adhocDemand",
      "components.div.children.detailsContainer.children.adhocDetails.children.cardContent.children.detailsContainer.children.comments",
     "visible",
     true
    )
  )
  dispatch(
    handleField(
      "adhocDemand",
      "components.div.children.detailsContainer.children.adhocDetails.children.cardContent.children.detailsContainer.children.AmountPaid",
     "visible",
     false
    )
  )
  dispatch(
    handleField(
      "adhocDemand",
      "components.div.children.detailsContainer.children.adhocDetails.children.cardContent.children.detailsContainer.children.dateOfPaymentField",
     "visible",
     false
    )
  )
 }
 if(action.value==="AdhocPayment"){
  set(state.screenConfiguration.preparedFinalObject,"Properties[0].propertyDetails.adhocDemand",false)
  set(state.screenConfiguration.preparedFinalObject,"Properties[0].propertyDetails.adhocPayment",true)
  dispatch(
    handleField(
      "adhocDemand",
      "components.div.children.detailsContainer.children.adhocDetails.children.cardContent.children.detailsContainer.children.AmountPaid",
     "visible",
     true
    )
  )
  dispatch(
    handleField(
      "adhocDemand",
      "components.div.children.detailsContainer.children.adhocDetails.children.cardContent.children.detailsContainer.children.dateOfPaymentField",
     "visible",
     true
    )
  )
  dispatch(
    handleField(
      "adhocDemand",
      "components.div.children.detailsContainer.children.adhocDetails.children.cardContent.children.detailsContainer.children.comment",
     "visible",
     true
    )
  )
  dispatch(
    handleField(
      "adhocDemand",
      "components.div.children.detailsContainer.children.adhocDetails.children.cardContent.children.detailsContainer.children.comments",
     "visible",
     false
    )
  )
  dispatch(
    handleField(
      "adhocDemand",
     "components.div.children.detailsContainer.children.adhocDetails.children.cardContent.children.detailsContainer.children.adjustmentEntryDate",
     "visible",
     false
    )
  )
  dispatch(
   handleField(
     "adhocDemand",
     "components.div.children.detailsContainer.children.adhocDetails.children.cardContent.children.detailsContainer.children.gst",
    "visible",
    false
   )
 )
 dispatch(
   handleField(
     "adhocDemand",
     "components.div.children.detailsContainer.children.adhocDetails.children.cardContent.children.detailsContainer.children.gstInterest",
    "visible",
    false
   )
 )
 dispatch(
   handleField(
     "adhocDemand",
     "components.div.children.detailsContainer.children.adhocDetails.children.cardContent.children.detailsContainer.children.rent",
    "visible",
    false
   )
 )
 dispatch(
   handleField(
     "adhocDemand",
     "components.div.children.detailsContainer.children.adhocDetails.children.cardContent.children.detailsContainer.children.rentInterest",
    "visible",
    false
   )
 )
 }
  }
};
  export const adhocDetails = getCommonCard({
    header: adhocDetailsHeader,
    detailsContainer: getCommonContainer({
      adhocdemand:getSelectField(adhocdemand),
      rent:getTextField(RentField),
      rentInterest: getTextField(interestOnRentField),
      gst:getTextField(gstField),
      gstInterest:getTextField(intestOnGstField) ,
      adjustmentEntryDate: getDateField(dateOfAdjustmentEntryField),
      AmountPaid:getTextField(AmountPaid),
      dateOfPaymentField:getDateField(dateOfPaymentField),
      comments : getTextField(commentsField),
      comment:getTextField(commentField)
    })
  })
    
  const detailsContainer = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1"
    },
    children: {
        adhocDetails
    },
    visible: true
  }
  
  export const getCommonApplyFooter = children => {
    return {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "apply-wizard-footer"
      },
      children
    };
  };
  
  const callBackForSubmit = (state, dispatch) => {
    let isValid = true;
    isValid = validateFields("components.div.children.detailsContainer.children.adhocDetails.children.cardContent.children.detailsContainer.children", state, dispatch, "adhocDemand")
    if(!isValid){
      let errorMessage = {
        labelName:
            "Please Enter Mandatory Fields",
        labelKey: "ES_ERR_MANDATORY_FIELDS"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
    if(!!isValid){
      addHocDemandUpdate(state,dispatch)
    }
   
  }
  
  const submitFooter = getCommonApplyFooter({
    submitButton: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
          minWidth: "180px",
          height: "48px",
          marginRight: "45px",
          borderRadius: "inherit"
        }
      },
      children: {
        submitButtonLabel: getLabel({
          labelName: "Submit",
          labelKey: "ES_COMMON_SUBMIT"
        })
      },
      onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
          callBackForSubmit(state, dispatch)
        },
      },
      visible: true
    }
  })
  
  const adHocDemand = {
    uiFramework: "material-ui",
    name: "adhocDemand",
    beforeInitScreen: (action, state, dispatch) => {
      dispatch(prepareFinalObject("adhocDetails",{}))
      beforeInitFn(action, state, dispatch);
      return action
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          className: "common-div-css"
        },
        children: {
          headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
            children: {
              header: {
                gridDefination: {
                  xs: 12,
                  sm: 10
                },
                ...header
              }
            }
          },
          detailsContainer,
          footer: submitFooter
        }
      }
    }
  }
  
  export default adHocDemand;
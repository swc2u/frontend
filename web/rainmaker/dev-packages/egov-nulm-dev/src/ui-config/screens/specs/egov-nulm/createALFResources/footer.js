import get from "lodash/get";
import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    prepareDocumentsUploadData
} from "../../../../../ui-utils/storecommonsapi";
import { convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { toggleSnackbar,prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getFileUrl } from "egov-ui-framework/ui-utils/commons";
import {
  getButtonVisibility,
  getCommonApplyFooter,
  ifUserRoleExists,
  validateFields,
  epochToYmd
} from "../../utils";
import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels,
} from "egov-ui-framework/ui-utils/commons";
import {NULM_SEP_CREATED,
  FORWARD_TO_TASK_FORCE_COMMITTEE,
  APPROVED_BY_TASK_FORCE_COMMITTEE,
  REJECTED_BY_TASK_FORCE_COMMITTEE,
  SENT_TO_BANK_FOR_PROCESSING,
SANCTION_BY_BANK} from '../../../../../ui-utils/commons'
// import "./index.css";

  const moveToReview = dispatch => {
    const reviewUrl =`/egov-nulm/review-alf`;
    dispatch(setRoute(reviewUrl));
  };



export const callBackForNext = async (state, dispatch) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["create-alf"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  debugger;

//   const {NULMSEPRequest} = state.screenConfiguration.preparedFinalObject;
  const {NULMALFRequest} = state.screenConfiguration.preparedFinalObject;
  let isFormValid = true;
  let documentsPreview =[];
  let applicationDocument =[];
  if (activeStep === 0) {
    const isAlfDetailsValid = validateFields(
      "components.div.children.formwizardFirstStep.children.AlfDetails.children.cardContent.children.AlfDetailsContainer.children",
      state,
      dispatch,
      "create-alf"
    );
    if (isAlfDetailsValid) {
    if(NULMALFRequest ){
      if(NULMALFRequest.name === "" || NULMALFRequest.name === null || NULMALFRequest.name === undefined || 
        NULMALFRequest.accountName === "" || NULMALFRequest.accountName === null || NULMALFRequest.accountName === undefined ||
        NULMALFRequest.address === "" || NULMALFRequest.address === null || NULMALFRequest.address === undefined ||
        NULMALFRequest.bankName === "" || NULMALFRequest.bankName === null || NULMALFRequest.bankName === undefined ||
        NULMALFRequest.branchName === "" || NULMALFRequest.branchName === null || NULMALFRequest.branchName === undefined ||
        NULMALFRequest.contact === "" || NULMALFRequest.contact === null || NULMALFRequest.contact === undefined ||
        NULMALFRequest.dof === "" || NULMALFRequest.dof === null || NULMALFRequest.dof === undefined || 
        NULMALFRequest.dor === "" || NULMALFRequest.dor === null || NULMALFRequest.dor === undefined
        ){
        isFormValid = false;
        const errorMessage = {
          labelName: "Please fill all mandatory fields",
          labelKey: "ERR_NULM_ALF_REQUIRED_VALIDATION"
        };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
      }
    }
    }else{
      isFormValid = false;
      const errorMessage = {
        labelName: "Please fill all mandatory fields",
        labelKey: "ERR_NULM_ALF_REQUIRED_VALIDATION"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
  }
    if(activeStep == 0 && isFormValid){
      moveToReview(dispatch);
    }
};

export const changeStep = (
  state,
  dispatch,
  mode = "next",
  defaultActiveStep = -1
) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["create-sep"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  if (defaultActiveStep === -1) {
    activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
  } else {
    activeStep = defaultActiveStep;
  }

  const isPreviousButtonVisible = activeStep > 0 ? true : false;
  const isNextButtonVisible = activeStep < 4 ? true : false;
  const isPayButtonVisible = activeStep === 4 ? true : false;
  const actionDefination = [
    {
      path: "components.div.children.stepper.props",
      property: "activeStep",
      value: activeStep
    },
    {
      path: "components.div.children.footer.children.previousButton",
      property: "visible",
      value: isPreviousButtonVisible
    },
    {
      path: "components.div.children.footer.children.nextButton",
      property: "visible",
      value: isNextButtonVisible
    },
    {
      path: "components.div.children.footer.children.payButton",
      property: "visible",
      value: isPayButtonVisible
    }
  ];
  dispatchMultipleFieldChangeAction("create-sep", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "create-sep",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "create-sep",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "create-sep",
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
   
    default:
      dispatchMultipleFieldChangeAction(
        "create-sep",
        getActionDefinationForStepper(
          "components.div.children.formwizardFifthStep"
        ),
        dispatch
      );
  }
};

export const getActionDefinationForStepper = path => {
  const actionDefination = [
    {
      path: "components.div.children.formwizardFirstStep",
      property: "visible",
      value: true
    },
    {
      path: "components.div.children.formwizardSecondStep",
      property: "visible",
      value: false
    },
    {
      path: "components.div.children.formwizardThirdStep",
      property: "visible",
      value: false
    },
   
  ];
  for (var i = 0; i < actionDefination.length; i++) {
    actionDefination[i] = {
      ...actionDefination[i],
      value: false
    };
    if (path === actionDefination[i].path) {
      actionDefination[i] = {
        ...actionDefination[i],
        value: true
      };
    }
  }
  return actionDefination;
};

export const callBackForPrevious = (state, dispatch) => {
  const {NULMSEPRequest} = state.screenConfiguration.preparedFinalObject;
  if(NULMSEPRequest && NULMSEPRequest.dob && NULMSEPRequest.age ){
    if(NULMSEPRequest.dob && NULMSEPRequest.age ){
      dispatch(
        handleField(
          `create-sep`,
          "components.div.children.formwizardFirstStep.children.SepDetails.children.cardContent.children.SepDetailsContainer.children.age",
          "props.value",
          ''
        )
      );
      dispatch(prepareFinalObject(`NULMSEPRequest.age`, null ));
    }
  }
  changeStep(state, dispatch, "previous");
};

export const footer = getCommonApplyFooter({
//   previousButton: {
//     componentPath: "Button",
//     props: {
//       variant: "outlined",
//       color: "primary",
//       style: {
//         minWidth: "200px",
//         height: "48px",
//         marginRight: "16px"
//       }
//     },
//     children: {
//       previousButtonIcon: {
//         uiFramework: "custom-atoms",
//         componentPath: "Icon",
//         props: {
//           iconName: "keyboard_arrow_left"
//         }
//       },
//       previousButtonLabel: getLabel({
//         labelName: "Previous Step",
//         labelKey: "STORE_COMMON_BUTTON_PREV_STEP"
//       })
//     },
//     onClickDefination: {
//       action: "condition",
//       callBack: callBackForPrevious
//     },
//     visible: false
//   },
//   nextButton: {
//     componentPath: "Button",
//     props: {
//       variant: "contained",
//       color: "primary",
//       style: {
//         minWidth: "200px",
//         height: "48px",
//         marginRight: "45px"
//       }
//     },
//     children: {
//       nextButtonLabel: getLabel({
//         labelName: "Next Step",
//         labelKey: "STORE_COMMON_BUTTON_NXT_STEP"
//       }),
//       nextButtonIcon: {
//         uiFramework: "custom-atoms",
//         componentPath: "Icon",
//         props: {
//           iconName: "keyboard_arrow_right"
//         }
//       }
//     },
//     onClickDefination: {
//       action: "condition",
//       callBack: callBackForNext
//     }
//   },
  payButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Submit",
        labelKey: "NULM_NBUTTON_SEW_ALF_SUBMIT"
      }),
      submitButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForNext
    },
    visible: true
  }
});

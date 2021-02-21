import {
    getStepperObject,
    getCommonHeader,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { footer } from "./createSUSVResource/footer";
  
  import { SUSVDetails } from "./createSUSVResource/susv-Details";
  import { NomineeDetails } from "./createSUSVResource/nominee-Details";
  import { UnderTaking } from "./createSUSVResource/underTaking";
  import { documentDetails } from "./createSUSVResource/documentDetails";
  import get from "lodash/get";
  import { httpRequest } from "../../../../ui-utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { NULMConfiguration } from "../../../../ui-utils/sampleResponses";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import { prepareDocumentsUploadData } from "../../../../ui-utils/storecommonsapi";
  import commonConfig from "../../../../config/common";
  
  export const stepsData = [
    { labelName: "SUSV Details", labelKey: "NULM_SUSV_DETAILS" },
    { labelName: "Nominee Details", labelKey: "NULM_SUSV_NOMINEE_DETAILS" },
    { labelName: "Documents", labelKey: "NULM_SEP_DOCUMENT_HEADER" },
    { labelName: "UnderTaking", labelKey: "NULM_SUSV_UNDERTAKING_HEADER" },
  ];
  export const stepper = getStepperObject(
    { props: { activeStep: 0 } },
    stepsData
  );
  
  
  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `SUSV program`,
      labelKey: "NULM_APPLICATION_FOR_SUSV_PROGRAM"
    })
  });
  
  export const formwizardFirstStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1"
    },
    children: {
        SUSVDetails
    }
  };
  
  export const formwizardSecondStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form2"
    },
    children: {
        NomineeDetails
    },
    visible: false
  };
  
  export const formwizardThirdStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form3"
    },
    children: {
      documentDetails
    },
    visible: false
  };
  export const formwizardFourthStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form4"
    },
    children: {
      UnderTaking
    },
    visible: false
  };
  
  
  const getMdmsData = async (state, dispatch) => {
    let tenantId = commonConfig.tenantId;
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenantId,
        moduleDetails: [
          {
            moduleName: "NULM",
            masterDetails: [
              {
                name: "SusvDocuments",
              }
            ]
          },
  
  
        ]
      }
    };
    try {
      const response = await httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
      // document type 
  
    dispatch(prepareFinalObject("applyScreenMdmsData", get(response, "MdmsRes")));

  
      // setting documents
      prepareDocumentsUploadData(state, dispatch, 'SUSVApplication');
  
      return true;
    } catch (e) {
      console.log(e);
    }
  };
  
  
  const screenConfig = {
    uiFramework: "material-ui",
    name: `create-susv`,
    // hasBeforeInitAsync:true,
    beforeInitScreen: (action, state, dispatch) => {
  
     getMdmsData(state, dispatch);
  
      return action;
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
          stepper,
          formwizardFirstStep,
          formwizardSecondStep,
          formwizardThirdStep,
          formwizardFourthStep,
          footer
        }
      }
    }
  };
  
  export default screenConfig;
  
  
  
  
  
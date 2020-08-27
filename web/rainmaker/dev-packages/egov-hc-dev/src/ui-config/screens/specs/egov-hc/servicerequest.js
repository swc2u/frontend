import { getCommonContainer, getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getFileUrlFromAPI, getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getTenantId, getUserInfo, setapplicationNumber, setapplicationType } from "egov-ui-kit/utils/localStorageUtils";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import { httpRequest } from "../../../../ui-utils";
import { getSearchResultsView, setApplicationNumberBox } from "../../../../ui-utils/commons";
import { clearlocalstorageAppDetails } from "../utils";
import { addressdetails } from './serviceRequestDetails/addressdetails';
import { footer } from "./serviceRequestDetails/footer";
import { ownerdetails } from './serviceRequestDetails/ownerdetails';
import { servicerequestdetails } from './serviceRequestDetails/servicerequestdetails';
import { uploadimage } from './serviceRequestDetails/uploadimage';






export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Service Request`, 
    labelKey: "HC_SERVICE_REQUEST_HEADER"
  }),
  
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-hc",
    componentPath: "ApplicationNoContainer",
    props: {
      number: "NA"
    },
    visible: false
  }
});

export const formwizardImageStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: {
    uploadimage
  }
};

export const formwizardFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form2"
  },
  children: {
    servicerequestdetails
  }
};

export const formwizardSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form3"
  },
  children: {
    ownerdetails
  }
};

export const formwizardThirdStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form4"
  },
  children: {
    addressdetails
  }
};





























































































const getMdmsData = async (action, state, dispatch) => {
  
  
  
  
  
  let tenantId = getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants"
            }
          ]
        },
        {
          moduleName: "eg-horticulture",
          masterDetails: [
            {
              name: "ServiceType"
            }
          ]
        },
        {
          moduleName: "RAINMAKER-PGR",
          masterDetails: [
            {
              name: "Sector"
            }
          ]
        }
      ]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};


const getFirstListFromDotSeparated = list => {
  list = list.map(item => {
    if (item.active) {
      return item.code.split(".")[0];
    }
  });
  list = [...new Set(list)].map(item => {
    return { code: item };
  });
  return list;
};




























// 

const screenConfig = {
  uiFramework: "material-ui",
  name: "servicerequest",
  beforeInitScreen: (action, state, dispatch) => {
 
    let media = [];
        let servicerequestmedia = get(state, "form.newapplication.files.media", []);
        servicerequestmedia.map((item, index) => {
          media.push(item.fileStoreId)
        });
        
    
        set(state, "form.newapplication.files.media", []);
        
        
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    !applicationNumber ? clearlocalstorageAppDetails(state) : '';
    setapplicationType('HORTICULTURE');
    const tenantId = getQueryArg(window.location.href, "tenantId");

    // const userInfo = JSON.parse(getUserInfo());

    set(state, "screenConfiguration.moduleName", "hc");

    
    getMdmsData(action, state, dispatch).then(response => {

      
      // prepareDocumentsUploadData(state, dispatch, 'apply_sellmeat');
    });

    
    // prepareEditFlow(state, dispatch, applicationNumber, tenantId);


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
                xs: 18,
                sm: 20
              },
              ...header
            }
          }
        },
        
        formwizardImageStep,
        formwizardFirstStep,
        formwizardSecondStep,
        
        footer
      }
    }
  }
};

export default screenConfig;
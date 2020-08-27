import {
  getCommonHeader,
  getCommonCard,
  getCommonContainer,
  getLabel,
  getBreak,
  getCommonApplyFooter
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getSearchPensionerForPensionRevision } from "../../../../ui-utils/commons";
import { httpRequest } from "../../../../ui-utils";
import { getSearchPensioner } from "../../../../ui-utils/commons";
import {empDetails} from "./revisionResource/employeeDetails"
import {pensionerBasicDetails} from "./revisionResource/pensionerBasicData"
import {pensionerverifiedData} from "./revisionResource/pensionerVerifiedData"
// import {pensionerverifiedDataDOE} from "./revisionResource/pensionerverifiedDataDOE"
// import {pensionerverifiedDataDOP} from "./revisionResource/pensionerverifiedDataDOP"
import { DOPApplication} from "./revisionResource/RevisionApplication"
import { GetMonthlydata } from "./revisionResource/function";
import { searchResults} from "./revisionResource/searchResult"
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
  getTenantId
} from "egov-ui-kit/utils/localStorageUtils";
import find from "lodash/find";
import set from "lodash/set";
import get from "lodash/get";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  WFConfig
} from "../../../../ui-utils/sampleResponses";

export const getMdmsData = async (action, state, dispatch) => {
  
  let tenantId = getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        { 
          moduleName: "pension", 
          masterDetails: 
          [{ name: "PensionRevisionYear" 
          },
          {
            name:"PensionRevisionMonth"
          },
          
          
        ] }
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
export const getData = async (action, state, dispatch) => {
  await getMdmsData(action, state, dispatch);
}
export const prepareEditFlow = async (
  state,
  dispatch,
  applicationNumber,
  tenantId
) => {
 
  
  if (applicationNumber) {
    let queryObject = [
      {
        key: "pensionerNumber",
      value: applicationNumber
       
      }];
    queryObject.push({
      key: "tenantId",
      value: tenantId
    });
     
    const response_ = await getSearchPensioner(queryObject);
    const response = await getSearchPensionerForPensionRevision(queryObject);
    
     dispatch(prepareFinalObject("ProcessInstancesTemp", get(response, "Pensioners", [])));

     let  data_ =[
      {
        pensionRevision:response.ProcessInstances[0].pensionrevesion,
        pensioner :response.ProcessInstances[0].pensioner,
        pensionerFinalCalculatedBenefitDetails:response.ProcessInstances[0].pensionerFinalCalculatedBenefitDetails,
        PensionersBasicData : get(response_, "Pensioners", [])
      } ];
   // dispatch(prepareFinalObject("ProcessInstances", response.ProcessInstances, []));
    dispatch(prepareFinalObject("ProcessInstances", data_, []));
     dispatch(
      handleField(
        "revision",
        "components.div.children.pensionerverifiedData",
        "props.style",
        { display: "inline-block" }
      )
    );
    dispatch(
      handleField(
        "revision",
        "components.div.children.card",
        "props.style",
        { display: "none" }
      )
    );
    

  }
};
const header = getCommonHeader({
  labelName: "PENSION_PENSIONER_REVESION",
  labelKey: "PENSION_PENSIONER_REVESION"
});
const DOEapplyResult = {
  uiFramework: "material-ui",
  name: "revision",
  beforeInitScreen: (action, state, dispatch) => {
  //  resetFields(state, dispatch);
    const tenantId = getTenantId();
    const pensionerNumber = getQueryArg(
      window.location.href,
      "pensionerNumber"
    );
    
   //get Eployee details data
prepareEditFlow(state, dispatch, pensionerNumber, tenantId).then(res=>
  {

  }
);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "revision"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6
              },
              ...header
            },
            
          }
        },
       
        PensionReview: {
          uiFramework: "custom-containers-local",
          componentPath: "PensionReviewContainer",
          moduleName: "egov-pms",

            props: {
              dataPath: "ProcessInstances",
              moduleName: "DOE_SERVICE",
              pageName:"REVISION"
            }
        },
        empDetails:empDetails(),
        breakAfterSearch: getBreak(),         
        searchResults,
      }
    },
   
  }
};

export default DOEapplyResult;

import {
  getCommonHeader,
  getCommonCard,
  getCommonContainer,
  getLabel,
  getCommonTitle,
  getDateField,  
  getPattern,
  getSelectField,
  getTextField,
  getBreak,
  getCommonApplyFooter
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getSearchPensioner } from "../../../../ui-utils/commons";
import { PensionerDetails,PensionerBankDetails,PensionerClaimantDetails} from "./PensionerDetailsResource/RevisionApplication"
import { footer} from "./PensionerDetailsResource/footer"

import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
  getTenantId
} from "egov-ui-kit/utils/localStorageUtils";
import find from "lodash/find";
import set from "lodash/set";
import get from "lodash/get";
import { reverse, max,slice} from "lodash"
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "../../../../ui-utils";
let IsAdd = false
let IsEdit = false
let IsRevisionEdit = false
let Year = getQueryArg(window.location.href, "Year")
let Month = getQueryArg(window.location.href, "Month")


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
          {
            name:"PensionRevisionMonth"
          },
          {
            name:"relationships"
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
   // const response = await getSearchPensionerForPensionRevision(queryObject);
     //response = sampleSingleSearch(); 

    //  queryObject = [
    //   {
    //     key: "pensionerNumber",
    //   value: applicationNumber
       
    //   }];
    // queryObject.push({
    //   key: "tenantId",
    //   value: tenantId
    // });
     
    const response_ = await getSearchPensioner(queryObject);
    dispatch(prepareFinalObject("ProcessInstancesTemp", get(response_, "Pensioners", [])));
    
    // dispatch(prepareFinalObject("pensionRevisionTemp", response.ProcessInstances[0].pensionRevision, []));

     //set in case of add revesion default value of last records
   

  }
};
function getMax(arr, prop) {
  var max;
  for (var i=0 ; i<arr.length ; i++) {
      if (max == null || parseInt(arr[i][prop]) > parseInt(max[prop]))
          max = arr[i];
  }
  return max;
}
const header = getCommonHeader({
  labelName: "PENSION_PENSIONER_REVESION",
  labelKey: "PENSION_PENSIONER_REVESION"
});
const DOEapplyResult = {
  uiFramework: "material-ui",
  name: "updatePensionerDetails",
  beforeInitScreen: (action, state, dispatch) => {
  //  resetFields(state, dispatch);
    const tenantId = getTenantId();
    const pensionerNumber = getQueryArg(
      window.location.href,
      "pensionerNumber"
    );
    getData(action, state, dispatch).then(responseAction => {
    
    });
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
        id: "updatePensionerDetails"
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
       
       
        break: getBreak(),
        PensionerDetails:PensionerDetails(IsRevisionEdit),
        PensionerBankDetails:PensionerBankDetails(IsRevisionEdit),
        PensionerClaimantDetails:PensionerClaimantDetails(IsRevisionEdit),
        footer:footer(IsAdd,IsEdit, IsRevisionEdit)
        
      
      }
    },
   
  }
};

export default DOEapplyResult;

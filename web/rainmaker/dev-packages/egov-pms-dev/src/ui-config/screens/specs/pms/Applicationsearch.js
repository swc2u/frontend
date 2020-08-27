import {
  getCommonHeader,
  getLabel,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { SearchApplication } from "./searchApplicationResource/SearchApplication";
import {searchResults} from "./searchApplicationResource/searchResults"
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
  getTenantId,
  localStorageGet
} from "egov-ui-kit/utils/localStorageUtils";
import {
  ActionPensionReview
} from "../../../../ui-utils/PensionResponce";
import find from "lodash/find";
import set from "lodash/set";
import get from "lodash/get";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getRequiredDocuments } from "./requiredDocuments/reqDocs";

const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : false;

const header = getCommonHeader({
  labelName: "PENSION_APPLICATION_SEARCH",
  labelKey: "PENSION_APPLICATION_SEARCH"
});



const SearchAndResult = {
  uiFramework: "material-ui",
  name: "Applicationsearch",
  beforeInitScreen: (action, state, dispatch) => {
  //  resetFields(state, dispatch);
    const tenantId = getTenantId();
    //set search param blank
dispatch(prepareFinalObject("searchScreen",{}));
   
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "Applicationsearch"
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
        //pendingApprovals,
        SearchApplication,
        breakAfterSearch: getBreak(),   
        searchResults  ,
        
        
      }
    },
   
  }
};

export default SearchAndResult;

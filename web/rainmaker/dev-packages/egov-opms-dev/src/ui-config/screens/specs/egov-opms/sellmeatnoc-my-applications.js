import { fetchData } from "./searchResource/citizenSearchFunctions";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setapplicationType, localStorageSet, getOPMSTenantId } from "egov-ui-kit/utils/localStorageUtils";
import {
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "../../../../ui-utils";
const header = getCommonHeader(
  {
    labelName: "My Applications",
    labelKey: "NOC_MY_APPLICATIONS_HEADER"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);
//alert("Hii...");
setapplicationType("SELLMEATNOC");
const getMdmsData = async (action, state, dispatch) => {
  let tenantId = getOPMSTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "egpm",
          masterDetails: [
            {
              name: "nocSought"
            },
            {
              name: "sector"
            },
            {
              name: "applicationType"
            }
          ]
        }
      ]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);
   dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "my-applications",
  beforeInitScreen: (action, state, dispatch) => {
    getMdmsData(action, state, dispatch).then(response => {
      fetchData(action, state, dispatch,"SELLMEATNOC");
    });

    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        header: header,
        applicationsCard: {
          uiFramework: "custom-molecules",
          componentPath: "SingleApplication",
          visible: true,
          props: {
            contents: [
              {
                label: "NOC_SOUGHT_FOR_LABEL",
                jsonPath: "nocSought"
              },
              {
                label: "NOC_COMMON_TABLE_COL_APP_NO_LABEL",
                jsonPath: "applicationId"
              },
              {
                label: "NOC_HOUSE_NO_LABEL",
                jsonPath: "houseNo"
              },
              {
                label: "NOC_DIVISION_LABEL",
                jsonPath: "division"
              },
              {
                label: "NOC_COMMON_TABLE_COL_STATUS_LABEL",
                jsonPath: "applicationStatus",
                prefix: "WF_SELLMEATNOC_"
              },
            ],
              moduleName: "SELL-MEAT-NOC",
              homeURL: "/egov-opms/home"
            }
          }
      }
  }
}
};

export default screenConfig;

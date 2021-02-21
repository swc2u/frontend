import { getCommonHeader, getLabel, getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setapplicationType, getTenantId } from "egov-ui-kit/utils/localStorageUtils/";
import { serachReportInventoryDetailGrid } from "./searchReportResource/serachResultGrid";
import { searchTextItemAgingreport } from "./searchReportResource/searchTextItemAgingreport";
import { fetchMdmsData } from "../../../../ui-utils/commons";
import { resetAllFields } from "../utils";
import get from "lodash/get";

const header = getCommonHeader({
  labelName: "Item Ageing Report",
  labelKey: "EC_ITEM_AGEING_REPORT_HEADER"
});

const getMdmsData = async (action, state, dispatch) => {
  try {
    let tenantId = getTenantId().length > 2 ? getTenantId().split('.')[0] : getTenantId();
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenantId,
        moduleDetails: [
          {
            moduleName: "egec",
            masterDetails: [
              {
                name: "TimeLine"
              },

            ]
          }
        ]
      }
    };

    await fetchMdmsData(state, dispatch, mdmsBody, false);

  } catch (e) {
    console.log(e);
  }
};
const ITEMAGEINGSearchAndResult = {
  uiFramework: "material-ui",
  name: "reportInventoryDetail",
  beforeInitScreen: (action, state, dispatch) => {
    setapplicationType('inventoryDetails-Report');
    const objectJsonPath = `components.div.children.searchTextItemAgingreport.children.cardContent.children`;
    const children = get(
      state.screenConfiguration.screenConfig["reportInventoryDetail"],
      objectJsonPath,
      {}
    );
    resetAllFields(children, dispatch, state, 'reportInventoryDetail');


    getMdmsData(action, state, dispatch).then(response => {
    });
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "serachReportInventoryDetailGrid"
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
        searchTextItemAgingreport,
        breakAfterSearch: getBreak(),
        serachReportInventoryDetailGrid
      }
    },
  }
};

export default ITEMAGEINGSearchAndResult;

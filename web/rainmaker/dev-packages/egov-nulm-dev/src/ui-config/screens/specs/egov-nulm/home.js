import React from "react";
import { getCommonHeader,getCommonContainer } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getRequiredDocData, checkForRole } from "../utils";
import {
  getUserInfo, setNULMTenantId, getTenantId, getNULMTenantId
} from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";


let roles = JSON.parse(getUserInfo()).roles
export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: "National Urban Livelihood Mission",
      labelKey: "ACTION_TEST_NULM_TITLE"
    }),
});

let SEP = {
  label: {
    labelKey: "NULM_SEP_CARD_TITLE",
    labelName: "Self-Employment Program"
  },
  icon: <i
    viewBox="0 -8 35 42"
    color="primary"
    font-size="40px"
    class="material-icons module-page-icon" style={{ fontSize: "42px" }}>
    picture_in_picture
  </i>,
  route: "search-sep"
}
let SMID = {
  label: {
    labelKey: "NULM_SMID_CARD_TITLE",
    labelName: "Social Mobilization Institution Development"
  },
  icon: <i
    viewBox="0 -8 35 42"
    color="primary"
    class="material-icons module-page-icon" style={{ fontSize: "42px" }}>
    picture_in_picture
  </i>,
  route: "search-smid"
}
let SUSV = {
  label: {
    labelKey: "NULM_SUSV_CARD_TITLE",
    labelName: "Permission for Advertisement",
    style:{
        paddingLeft:"5px",

    },
  },
  icon: <i
    viewBox="0 -8 35 42"
    color="primary"
    class="material-icons module-page-icon" style={{ fontSize: "42px" }}>
    picture_in_picture
  </i>,
  route: "search-susv"
}
let SVRU = {
  label: {
    labelKey: "NULM_SVRU_CARD_TITLE",
    labelName: "Permission for Road Cut"
  },
  icon: <i
    viewBox="0 -8 35 42"
    color="primary"
    class="material-icons module-page-icon" style={{ fontSize: "42px" }}>
    picture_in_picture
  </i>,
  route: "search-svru"
}
let SUHC = {
    label: {
      labelKey: "NULM_SUHC_CARD_TITLE",
      labelName: "Permission for Road Cut"
    },
    icon: <i
      viewBox="0 -8 35 42"
      color="primary"
      class="material-icons module-page-icon" style={{ fontSize: "42px" }}>
      picture_in_picture
    </i>,
    route: "searchSuh"
  }
  let NGOR = {
    label: {
      labelKey: "NULM_NGOR_CARD_TITLE",
      labelName: "Permission for Road Cut"
    },
    icon: <i
      viewBox="0 -8 35 42"
      color="primary"
      class="material-icons module-page-icon" style={{ fontSize: "42px" }}>
      picture_in_picture
    </i>,
    route: "search-organization"
  }
  let SMIDNGO = {
    label: {
      labelKey: "NULM_SMIDNGO_CARD_TITLE",
      labelName: "Permission for Road Cut"
    },
    icon: <i
      viewBox="0 -8 35 42"
      color="primary"
      class="material-icons module-page-icon" style={{ fontSize: "42px" }}>
      picture_in_picture
    </i>,
    route: "search-smid-org"
  }
  let SUHP = {
    label: {
      labelKey: "NULM_SUHP_CARD_TITLE",
      labelName: "Permission for Road Cut"
    },
    icon: <i
      viewBox="0 -8 35 42"
      color="primary"
      class="material-icons module-page-icon" style={{ fontSize: "42px" }}>
      picture_in_picture
    </i>,
    route: "search-suh"
  }
  let SUHLOG = {
    label: {
      labelKey: "NULM_SUHLOG_CARD_TITLE",
      labelName: "Permission for Road Cut"
    },
    icon: <i
      viewBox="0 -8 35 42"
      color="primary"
      class="material-icons module-page-icon" style={{ fontSize: "42px" }}>
      picture_in_picture
    </i>,
    route: "search-log-maintenance"
  }

  let SUSVT = {
    label: {
      labelKey: "NULM_SUSVT_CARD_TITLE",
      labelName: "Permission for Road Cut"
    },
    icon: <i
      viewBox="0 -8 35 42"
      color="primary"
      class="material-icons module-page-icon" style={{ fontSize: "42px" }}>
      picture_in_picture
    </i>,
    route: "search-susv-transaction"
  }
let allCardList = [{ "code": "SEP", "value": SEP }, { "code": "SMID", "value": SMID },
{ "code": "SUSV", "value": SUSV },{ "code": "SVRU", "value": SVRU },{ "code": "SUHC", "value": SUHC },
{ "code": "NGOR", "value": NGOR },{ "code": "SMIDNGO", "value": SMIDNGO },{ "code": "SUHLOG", "value": SUHLOG },
{ "code": "SUHP", "value": SUHP },
{ "code": "SUSVT", "value": SUSVT }]


const getMdmsData = async (action, state, dispatch) => {

  let tenantId = "ch.chandigarh";//getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "nulm",
          masterDetails: [
            {
              name: "cardList"
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
const setcardList = (state, dispatch) => {
  let mdmsCardList = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData.nulm.cardList",
    []
  );
  let employeeCardList = []
  let roles = JSON.parse(getUserInfo()).roles
  mdmsCardList.map((item, index) => {
    roles.some(r => {
      if (item.roles.includes(r.code)) {
        if (employeeCardList.length > 0) {
          if (!employeeCardList.find((x) => x.code == item.code)) {
            if (JSON.parse(getUserInfo()).type === "CITIZEN") {
              allCardList[index].value.route = item.routeCitizen;
              employeeCardList.push(allCardList[index])
            } else {
              employeeCardList.push(allCardList[index])
            }
          }
        } else {
          if (JSON.parse(getUserInfo()).type === "CITIZEN") {
            allCardList[index].value.route = item.routeCitizen;
            employeeCardList.push(allCardList[index])
          } else {
            employeeCardList.push(allCardList[index])
          }
        }
      }
    })
  });

  const cards = employeeCardList.map((item, index) => {
    return item.value
  });

  dispatch(
    handleField(
      "home",
      "components.div.children.applyCard",
      "props.items",
      cards
    )
  );
}
const PermissionManagementSearchAndResult = {
  uiFramework: "material-ui",
  name: "home",
  beforeInitScreen: (action, state, dispatch) => {
    let UsertenantInfo = JSON.parse(getUserInfo()).permanentCity;
    if (JSON.parse(getUserInfo()).type === "CITIZEN")
    setNULMTenantId('ch');
    else
    setNULMTenantId(getTenantId());

    getMdmsData(action, state, dispatch).then(response => {
      setcardList(state, dispatch)
    });
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
        applyCard: {
          uiFramework: "custom-molecules",
          componentPath: "LandingPage",
          style: {
            paddingTop: "20px",
          },
          props: {
            items: [],
            history: {},
            module: "PRSCP"
          }
        }
      }
    },
    // adhocDialog: {
    //   uiFramework: "custom-containers-local",
    //   moduleName: "egov-nulm",
    //   componentPath: "DialogContainer",
    //   props: {
    //     open: false,
    //     maxWidth: false,
    //     screenKey: "home",


    //   },
    //   children: {
    //     popup: {}
    //   }
    // }
  }
};

export default PermissionManagementSearchAndResult;

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
import  {GetCardList} from '../../../../ui-utils/sampleResponses'
let roles = JSON.parse(getUserInfo()).roles
export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: "Help & Support",
      labelKey: "CS_HEADER_HELP_SUPPORT"
    }),
});

let UPDATEUSER = {
  label: {
    labelKey: "COMMON_USER_UPDATE",
    labelName: "Un-lock User"
  },
  icon: <i
    viewBox="0 -8 35 42"
    color="primary"
    font-size="40px"
    class="material-icons module-page-icon" style={{ fontSize: "42px" }}>
    picture_in_picture
  </i>,
  route: "user-update"
}


  

  
let allCardList = [{ "code": "USER_UNLOCK", "value": UPDATEUSER }, ,
// { "code": "ALF", "value": ALF }
]


const getMdmsData = async (action, state, dispatch) => {

  let tenantId = "ch.chandigarh";//getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: 'ch',
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
  let mdmsCardList = GetCardList()//get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData.nulm.cardList", [] );
  mdmsCardList = get(mdmsCardList,'helpdesk.cardList',[])
  // var demo = {
  //   "code": "ALF",
  //   "roles": [
  //     "CITIZEN",
  //     "EMPLOYEE"
  //   ],
  //   "routeCitizen": "search-smid-NGO"
  // }
  // mdmsCardList.push(demo);
  let employeeCardList = []
  let roles = JSON.parse(getUserInfo()).roles
  mdmsCardList.map((item, index) => {
    roles.some(r => {
     // if (item.roles.includes(r.code)) {
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
     // }
    })
  });

  const cards = employeeCardList.map((item, index) => {
    return item.value
  });

  dispatch(
    handleField(
      "helpDesk",
      "components.div.children.applyCard",
      "props.items",
      cards
    )
  );
}
const helpDeskManagementSearchAndResult = {
    uiFramework: "material-ui",
    name: "helpDesk",
    beforeInitScreen: (action, state, dispatch) => {
    //   let UsertenantInfo = JSON.parse(getUserInfo()).permanentCity;
    //   if (JSON.parse(getUserInfo()).type === "CITIZEN")
    //   setNULMTenantId('ch');
    //   else
    //   setNULMTenantId(getTenantId());
  
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
  
  export default helpDeskManagementSearchAndResult;
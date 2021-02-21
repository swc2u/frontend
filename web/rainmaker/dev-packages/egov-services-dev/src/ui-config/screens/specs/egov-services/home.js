import React from "react";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import MyApplicationIcon from "../../../../ui-atoms-local/Icons/MyApplicationIcon";
import FormIcon from "../../../../ui-atoms-local/Icons/FormIcon";
import TradeLicenseIcon from "../../../../ui-atoms-local/Icons/TradeLicenseIcon";
import AddBookingIcon from "../../../../ui-atoms-local/Icons/AddBookingIcon";
import { getRequiredDocData, clearlocalstorageAppDetails } from "../utils";
import get from "lodash/get";
import set from "lodash/set";
import {
  getAccessToken,
  getTenantId,
  getLocale,
  getUserInfo,
  setapplicationType
} from "egov-ui-kit/utils/localStorageUtils";
let role_name=JSON.parse(getUserInfo()).roles[0].code
const header = getCommonHeader(
  {
    labelName: "Services",
    labelKey: "ACTION_TEST_SERVICES"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);
let cardItems = [];
if(role_name === 'CITIZEN'){
  const cardlist = [
    {
      label: {
        labelKey: "BK_APPLY",
        labelName: "Apply for Booking"
      },
      icon : <AddBookingIcon />,
      // icon: <i 
      // viewBox="0 -8 35 42"
      // color="primary"
      // style={{fontSize : "50px"}}
      // // font-size="30px"
      // class="material-icons module-page-icon">
      // post_add
      // </i>,
      route: "applyservices"
      
    },
    {
      label: {
        labelKey: "My Applications",
        labelName: "BK_MY_BOOKINGS"
      },
      // icon : <i 
      // viewBox="0 -8 35 42"
      // color="primary"
      // style={{fontSize : "50px"}}
      // // font-size="30px"
      // class="material-icons module-page-icon">
      // list_alt
      // </i>,
      icon: <FormIcon />,
      route: "my-applications"
    },
   
  
  ];
  cardItems = cardlist;
}


const screenConfig = {
  uiFramework: "material-ui",
  name: "home",
  beforeInitScreen: (action, state, dispatch) => {
    clearlocalstorageAppDetails(state);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        header: header,
        applyCard: {
          uiFramework: "custom-molecules",
          componentPath: "LandingPage",
          props: {
            items: cardItems,
            history: {},
            module:"SERVICES"
          }
        }
      }
    }
  }
};

export default screenConfig;

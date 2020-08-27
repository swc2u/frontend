import React from "react";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import MyApplicationIcon from "../../../../ui-atoms-local/Icons/MyApplicationIcon";
import get from "lodash/get";
import set from "lodash/set";

const header = getCommonHeader(
  {
    labelName: "E-CHALLAN",
    labelKey: "EC_ECHALLAN"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  },
  {
    style: {
      marginLeft: "10px"
    }
  },
);

let cardItems = [];
// if(role_name === 'CITIZEN'){
const cardlist = [
  {
    label: {
      labelKey: "My challan",
      labelName: "EC_MY_CHALLAN"
    },
    icon: <MyApplicationIcon />,
    route: "my-challans"
  },


];
cardItems = cardlist;
// }


const eChallanCitizenSearchAndResult = {
  uiFramework: "material-ui",
  name: "citizenMainLanding",
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
            history: {}
          }
        },        
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-noc",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: false,
        screenKey: "citizenMainLanding"
      },
      children: {
        popup: {}
      }
    }
  }
};

export default eChallanCitizenSearchAndResult;

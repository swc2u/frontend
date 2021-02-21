import React from "react";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import FireNocIcon from "../../../../ui-atoms-local/Icons/FireNocIcon";
import MyApplicationIcon from "../../../../ui-atoms-local/Icons/MyApplicationIcon";
import { getRequiredDocData } from "../utils";
import get from "lodash/get";
import set from "lodash/set";
import { getRequiredDocuments } from "./requiredDocuments/reqDocs";
import { pbkdf2 } from "crypto";

const header = getCommonHeader(
  {
    labelName: "Pension",
    labelKey: "PENSION_PENSION_HOME"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);

// const cardItems = [
//   {
//     label: {
//       labelKey: "PENSION_NORMAL_RETIREMENT_PENSION",
//       labelName: "Normal Retirement Pension"
//     },
//     icon: <MyApplicationIcon />,
//     route: "search"
//   },
//   {
//     label: {
//       labelKey: "PENSION_PENSION_REGISTER",
//       labelName: "Pension Register"
//     },
//     icon: <MyApplicationIcon />,
//     route: "searchNormalRetirementPension"
//   },
//   {
//     label: {
//       labelKey: "PENSION_REGISTER_EARLY_RETIREMENT",
//       labelName: "Register Early Retirement"
//     },
//     icon: <MyApplicationIcon />,
//     route: "searchRegisterEarlyRetirement"
//   },
  
//   {
//     label: {
//       labelKey: "PENSION_SEARCH_APPLICATION",
//       labelName: "Search Application"
//     },
//     icon: <MyApplicationIcon />,
//     route: "searchppr"
//   },
//   {
//     label: {
//       labelKey: "PENSION_DEATH_OF_A_PENSIONER",
//       labelName: "Death of a Pensioner"
//     },
//     icon: <MyApplicationIcon />,
//     route: "searchdop"
//   },
//   {
//     label: {
//       labelKey: "PENSION_DEATH_OF_AN_EMPLOYEE",
//       labelName: "Death of an Employee"
//     },
//     icon: <MyApplicationIcon />,
//     route: "searchdoe"
//   }
  
// ];

const pensionCardResult = {
  uiFramework: "material-ui",
  name: "home",
 
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "home"
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
        pensioncard: {
          uiFramework: "custom-containers-local",
          componentPath: "CardContainer",
          moduleName: "egov-pms",
         
        },
        
      }
    },
   
  }
};

export default pensionCardResult;

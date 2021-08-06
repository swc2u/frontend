import {
    getCommonContainer,
    getCommonCard,
    getCommonHeader,
    getCommonTitle,
    getCommonParagraph,
    getLabel,
    getLabelWithValue,
    getBreak,
    getStepperObject
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import set from "lodash/set";
  import { httpRequest } from "../../../../ui-utils";
  import { searchForm } from "./searchuserResource/searchForm";
  import { footer } from "./searchuserResource/footer";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import { convertEpochToDateAndHandleNA, handleNA } from '../utils';
  import commonConfig from '../../../../config/common';
  const hasButton = getQueryArg(window.location.href, "hasButton");
  let enableButton = true;
  //enableButton = hasButton && hasButton === "false" ? false : true;
  
  const header = getCommonHeader({
    labelName: "Un-lock User",
    labelKey: "COMMON_USER_UPDATE",
  });
  
  const createSEPHandle = async (state, dispatch) => {
    dispatch(setRoute(`/egov-nulm/create-sep`));
  };
  


  const getData = async (action, state, dispatch) => {

 
  };
  
  const sepSearchAndResult = {
    uiFramework: "material-ui",
    name: "user-update",
    beforeInitScreen: (action, state, dispatch) => {
            // fetching MDMS data
      getData(action, state, dispatch);    
    
      dispatch(prepareFinalObject("searchScreen", {}));
      return action;
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Form",
        props: {
          className: "common-div-css",
          id: "search",
        },
        children: {
          headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
  
            children: {
              header: {
                gridDefination: {
                  xs: 12,
                  sm: 6,
                },
                ...header,
              },
              newApplicationButton: {
                componentPath: "Button",
                gridDefination: {
                  xs: 12,
                  sm: 6,
                  align: "right",
                },
                visible: false,
                props: {
                  variant: "contained",
                  color: "primary",
                  style: {
                    color: "white",
                    borderRadius: "2px",
                    width: "250px",
                    height: "48px",
                  },
                },
  
                children: {
                  plusIconInsideButton: {
                    uiFramework: "custom-atoms",
                    componentPath: "Icon",
                    props: {
                      iconName: "add",
                      style: {
                        fontSize: "24px",
                      },
                    },
                  },
  
                  buttonLabel: getLabel({
                    labelName: "Add SEP",
                    labelKey: "NULM_ADD_NEW_SEP_BUTTON",
                  }),
                },
                onClickDefination: {
                  action: "condition",
                  callBack: createSEPHandle,
                },
              },
            },
          },
          searchForm,
          breakAfterSearch: getBreak(),
          employeeDetails: getCommonCard(
            {
              header: getCommonTitle(
                {
                  labelName: "Employee Information",
                  labelKey: "COMMON_EMPLOYEE_INFORMATION"
                },
            ),
            break: getBreak(),
            employeeDisabiltyConatiner: getCommonContainer({ 
      
                Name: getLabelWithValue(
                {
                  labelName: "Name",
                  labelKey: "CORE_COMMON_NAME"
                },
                {
                  jsonPath:
                    "UserInfo[0].name",
                    callBack: handleNA
                }
              ), 
              Email: getLabelWithValue(
                {
                  labelName: "Email",
                  labelKey: "CS_HELP_EMAIL_LABLE"
                },
                {
                  jsonPath:
                    "UserInfo[0].emailId",
                    callBack: handleNA
                }
              ), 
              
            }),
            
      
            }),
            footer
        },
      },
    },
  };
  
  export default sepSearchAndResult;
  
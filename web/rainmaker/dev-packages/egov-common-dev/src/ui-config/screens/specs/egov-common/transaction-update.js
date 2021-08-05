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
  import { searchForm } from "./searchTransactionResource/searchForm";
  import { footer } from "./searchTransactionResource/footer";
  import { searchResults } from "./searchTransactionResource/searchResults";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import { convertEpochToDateAndHandleNA, handleNA } from '../utils';
  import commonConfig from '../../../../config/common';
  const hasButton = getQueryArg(window.location.href, "hasButton");
  let enableButton = true;
  //enableButton = hasButton && hasButton === "false" ? false : true;
  
  const header = getCommonHeader({
    labelName: "Consumer Update",
    labelKey: "COMMON_CONSUMER_UPDATE",
  });
  
  const createSEPHandle = async (state, dispatch) => {
    dispatch(setRoute(`/egov-nulm/create-sep`));
  };
  


  const getData = async (action, state, dispatch) => {

 
  };
  
  const sepSearchAndResult = {
    uiFramework: "material-ui",
    name: "transaction-update",
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
            //   newApplicationButton: {
            //     componentPath: "Button",
            //     gridDefination: {
            //       xs: 12,
            //       sm: 6,
            //       align: "right",
            //     },
            //     visible: false,
            //     props: {
            //       variant: "contained",
            //       color: "primary",
            //       style: {
            //         color: "white",
            //         borderRadius: "2px",
            //         width: "250px",
            //         height: "48px",
            //       },
            //     },
  
            //     children: {
            //       plusIconInsideButton: {
            //         uiFramework: "custom-atoms",
            //         componentPath: "Icon",
            //         props: {
            //           iconName: "add",
            //           style: {
            //             fontSize: "24px",
            //           },
            //         },
            //       },
  
            //       buttonLabel: getLabel({
            //         labelName: "Add SEP",
            //         labelKey: "NULM_ADD_NEW_SEP_BUTTON",
            //       }),
            //     },
            //     onClickDefination: {
            //       action: "condition",
            //       callBack: createSEPHandle,
            //     },
            //   },
            },
          },
          searchForm,
          breakAfterSearch: getBreak(),
          // employeeDetails: getCommonCard(
          //   {
          //     header: getCommonTitle(
          //       {
          //         labelName: "Consumer Information",
          //         labelKey: "COMMON_CONSUMER_INFORMATION"
          //       },
          //   ),
          //   break: getBreak(),
          //   employeeDisabiltyConatiner: getCommonContainer({ 
      
          //       TransactionID: getLabelWithValue(
          //       {
          //         labelName: "Transaction ID",
          //         labelKey: "COMMON_CONSUMER_TRANSACTION_ID"
          //       },
          //       {
          //         jsonPath:
          //           "Transaction[0].txnId",
          //           callBack: handleNA
          //       }
          //     ), 
          //     Amount: getLabelWithValue(
          //       {
          //         labelName: "Amount",
          //         labelKey: "COMMON_CONSUMER_TRANASCTION_AMOUNT"
          //       },
          //       {
          //         jsonPath:
          //           "Transaction[0].txnAmount",
          //           callBack: handleNA
          //       }
          //     ),
          //     Status: getLabelWithValue(
          //       {
          //         labelName: "Status",
          //         labelKey: "COMMON_CONSUMER_TRANSACTION_STATUS"
          //       },
          //       {
          //         jsonPath:
          //           "Transaction[0].txnStatus",
          //           callBack: handleNA
          //       }
          //     ),
          //     Module: getLabelWithValue(
          //       {
          //         labelName: "Module Name",
          //         labelKey: "COMMON_MODULE_NAME"
          //       },
          //       {
          //         jsonPath:
          //           "Transaction[0].module",
          //           callBack: handleNA
          //       }
          //     ),
          //     CreatedDt: getLabelWithValue(
          //       {
          //         labelName: "Created Date",
          //         labelKey: "COMMON_CONSUMER_TRANSACTION_CREATED_DATE"
          //       },
          //       {
          //         jsonPath:
          //           "Transaction[0].auditDetails.createdTime",
          //           callBack: handleNA
          //       }
          //     ),
          //     LastModifiedDt: getLabelWithValue(
          //       {
          //         labelName: "Last Modified Date",
          //         labelKey: "COMMON_CONSUMER_TRANSACTION_LAST_MODIFIED_DATE"
          //       },
          //       {
          //         jsonPath:
          //           "Transaction[0].auditDetails.lastModifiedTime",
          //           callBack: handleNA
          //       }
          //     ), 
              
          //   }),
            
      
          //   }),
            searchResults,
            footer
        },
      },
    },
  };
  
  export default sepSearchAndResult;
  
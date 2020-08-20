import {
    getCommonHeader,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import get from "lodash/get";
  import set from "lodash/set";
  import { POReviewDetails } from "./viewPurchaseOrder/po-review";
  import { poViewFooter } from "./viewPurchaseOrder/footer";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import { getstoreTenantId } from "../../../../ui-utils/storecommonsapi";
  import {
    convertDateToEpoch,
    epochToYmdDate,
    showHideAdhocPopup,
    validateFields
  } from "../utils";
  import { httpRequest } from "../../../../ui-utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getSearchResults } from "../../../../ui-utils/commons";
  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `View Purchase Order`,
      labelKey: "STORE_PURCHASE_ORDER_VIEW"
    })
  });
  
  const tradeView = POReviewDetails(false);
  
  const getMdmsData = async (action, state, dispatch, tenantId) => {
    const tenant = getstoreTenantId();
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenant,
        moduleDetails: [
          {
            moduleName: "egov-hrms",
            masterDetails: [
              {
                name: "DeactivationReason",
                filter: "[?(@.active == true)]"
              }
            ]
          }
        ]
      }
    };
    try {
      const payload = await httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
      dispatch(prepareFinalObject("viewScreenMdmsData", payload.MdmsRes));
    } catch (e) {
      console.log(e);
    }
  };
  const setDateInYmdFormat = (obj, values) => {
    values.forEach(element => {
      set(obj, element, epochToYmdDate(get(obj, element)));
    });
  };
  const furnishindentData = (state, dispatch) => {
    let purchaseOrders = get(
      state.screenConfiguration.preparedFinalObject,
      "purchaseOrders",
      []
    );
     setDateInYmdFormat(purchaseOrders[0], ["expectedDeliveryDate", "purchaseOrderDate"]); 
     //get set total value
     for (let index = 0; index < purchaseOrders[0].purchaseOrderDetails.length; index++) {
       const element = purchaseOrders[0].purchaseOrderDetails[index];
       let userQuantity = get(purchaseOrders[0], `purchaseOrderDetails[${index}].userQuantity`,0)
       let unitPrice = get(purchaseOrders[0], `purchaseOrderDetails[${index}].unitPrice`,0)
       set(purchaseOrders[0], `purchaseOrderDetails[${index}].totalValue`,unitPrice*userQuantity);
       
     } 
    dispatch(prepareFinalObject("purchaseOrders", purchaseOrders));
  };
  const screenConfig = {
    uiFramework: "material-ui",
    name: "view-purchase-order",
    beforeInitScreen: (action, state, dispatch) => {
      let poNumber = getQueryArg(window.location.href, "poNumber");
      let tenantId = getQueryArg(window.location.href, "tenantId");
      const queryObject = [{ key: "tenantId", value: tenantId},{ key: "purchaseOrderNumber", value: poNumber}];
      getSearchResults(queryObject, dispatch,"purchaseOrder")
      .then(response =>{
        if(response){
          dispatch(prepareFinalObject("purchaseOrders", [...response.purchaseOrders]));       
          furnishindentData(state, dispatch);
      if(response.purchaseOrders && response.purchaseOrders[0].supplier.code){
        const queryObject = [{ key: "tenantId", value: getTenantId()},{ key: "suppliers", value: response.purchaseOrders[0].supplier.code}];
       
        getSearchResults(queryObject, dispatch,"priceList")
        .then(response =>{
          if(response){
            let priceList = [{rateContractNumber:"",rateContractDate:"",agreementNumber:"",agreementDate:"",agreementStartDate:"",agreementEndDate:""}];
            priceList[0].rateContractNumber  =  response.priceLists[0].rateContractNumber;
            priceList[0].rateContractDate   = new Date(response.priceLists[0].rateContractDate).toISOString().substr(0,10);
            priceList[0].agreementNumber   =   response.priceLists[0].agreementNumber;
            priceList[0].agreementDate   =   new Date(response.priceLists[0].agreementDate).toISOString().substr(0,10);
            priceList[0].agreementStartDate   = new Date(response.priceLists[0].agreementStartDate).toISOString().substr(0,10);
            priceList[0].agreementEndDate   =  new Date(response.priceLists[0].agreementEndDate).toISOString().substr(0,10);
            dispatch(prepareFinalObject("searchMaster.priceList", response.priceLists));  
                dispatch(prepareFinalObject("purchaseOrders[0].priceList", priceList));          
           }  
        });     
       }
      }
    });  
    //   getMdmsData(action, state, dispatch, tenantId);
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
          tradeView,
          footer: poViewFooter()
        }
      },
    }
  };
  
  export default screenConfig;
  
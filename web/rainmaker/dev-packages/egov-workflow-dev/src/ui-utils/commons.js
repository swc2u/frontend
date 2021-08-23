
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get"
import store from "redux/store";

export const getNextFinancialYearForRenewal = async (currentFinancialYear) => {
    
  let payload = null;
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: getTenantId(),
      moduleDetails: [
        {
          moduleName: "egf-master",
          masterDetails: [{ name: "FinancialYear", filter: `[?(@.module == "TL")]` }]
        }
      ]
    }
  };

  try {
    
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );

    const financialYears = get(payload.MdmsRes , "egf-master.FinancialYear");
    const currrentFYending = financialYears.filter(item => item.code === currentFinancialYear)[0]
    .endingDate;
    return financialYears.filter(item => item.startingDate === currrentFYending)[0].code;
  }catch(e){
    console.log(e.message)
  }
}

export const getSearchResults = async (tenantId ,licenseNumber) => {
  let queryObject = [
    {
      key: "tenantId",
      value: tenantId 
    },
    { key: "offset", value: "0" },
    { key: "licenseNumbers", value: licenseNumber}
  ];
  try {
    const response = await httpRequest(
      "post",
      "/tl-services/v1/_search",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};
export const WNSConfigName =()=>{
  return {
      ONE_TIME_FEE_WS: "PUBLIC_HEALTH_SERVICES_DIV2",
      ONE_TIME_FEE_SW:"PUBLIC_HEALTH_SERVICES_DIV4"
    
};
}


export const WNSBusinessService = () => {
  return {
    
    BusinessService: [
     "NewWS1",
     "SW_SEWERAGE",
     "REGULARWSCONNECTION",
     "TEMPORARY_WSCONNECTION",
     "TEMPORARY_WSCONNECTION_BILLING",
     "WS_TEMP_TEMP",
     "WS_TEMP_REGULAR",
     "WS_DISCONNECTION",
     "WS_TEMP_DISCONNECTION",
     "WS_RENAME",
     "WS_METER_UPDATE",
     "WS_CONVERSION",
     "WS_REACTIVATE",
     "WS_TUBEWELL",
     "WS_METER_TESTING"

    ]
  }
}

export const WNSWaterBusinessService = () => {
  return {
    
    BusinessService: [
     "NewWS1",
     "REGULARWSCONNECTION",
     "TEMPORARY_WSCONNECTION",
     "TEMPORARY_WSCONNECTION_BILLING",
     "WS_TEMP_TEMP",
     "WS_TEMP_REGULAR",
     "WS_DISCONNECTION",
     "WS_TEMP_DISCONNECTION",
     "WS_RENAME",
     "WS_METER_UPDATE",
     "WS_CONVERSION",
     "WS_REACTIVATE",
     "WS_TUBEWELL",
     "WS_METER_TESTING"

    ]
  }
}
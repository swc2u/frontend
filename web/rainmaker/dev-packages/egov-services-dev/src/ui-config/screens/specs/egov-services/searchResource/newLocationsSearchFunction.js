import { getNewLocationsSearchResults } from "../../../../../ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getTenantId,
  getUserInfo,
} from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";

export const fetchData = async (action, state, dispatch) => {
  let data = get(
    state,
    "screenConfiguration.preparedFinalObject.NewLocationsApps"
  );
  let newData = {}
  if(data == undefined){
    newData = {
      applicationNumber:"",
      mobileNumber:"",
      fromDate:"",
      toDate:"",
      applicationStatus : "",
      
      tenantId : getTenantId().split(".")[0],
      uuid : JSON.parse(getUserInfo()).uuid
    }
  } else {
    if(data.applicationNumber == undefined){
      data.applicationNumber = ""
    }
    if(data.mobileNumber == undefined){
      data.mobileNumber = ""
    }
    if(data.fromDate == undefined){
      data.fromDate = ""
    }
    if(data.toDate == undefined){
      data.toDate = ""
    }
    if(data.applicationStatus == undefined){
      data.applicationStatus = ""
    }
    
    newData = {
      tenantId : getTenantId().split(".")[0],
      uuid : JSON.parse(getUserInfo()).uuid
    }
    newData = Object.assign(newData, data);
  };
  console.log(newData, "New Locations newData");
  const response = await getNewLocationsSearchResults(newData);
  
  try {

    if (response.osujmNewLocationModelList.length > 0) {
      dispatch(prepareFinalObject("searchResults", response.osujmNewLocationModelList));
      dispatch(
        prepareFinalObject("myNewLocationsAppsCount", response.bookingsCount)
      );
    } 
    
  } catch (error) {
    console.log(error);
  }
};

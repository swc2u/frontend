import { handleScreenConfigurationFieldChange as handleField, toggleSnackbar,toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getUserInfo, getTenantIdCommon } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { fetchBill, findAndReplace, getSearchResults, getSearchResultsForSewerage, getWorkFlowData,getBillingEstimation } from "../../../../../ui-utils/commons";
import { validateFields,getTextToLocalMapping,getTextToLocalMappingCode,GetMdmsNameBycode } from "../../utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { convertDateToEpoch, convertEpochToDate, resetFieldsForApplication, resetFieldsForConnection } from "../../utils/index";
import { httpRequest } from "../../../../../ui-utils";

//import { getTextToLocalMapping } from "./searchApplicationResults";
//import { validateFields, getTextToLocalMapping } from "../../utils";
import { set } from "lodash";
export const searchApiCall = async (state, dispatch) => {

 
  let getCurrentTab = get(state.screenConfiguration.preparedFinalObject, "currentTab");
  let currentSearchTab = getCurrentTab === undefined ? "SEARCH_CONNECTION" : getCurrentTab;
  if (currentSearchTab === "SEARCH_CONNECTION") {
    showHideConnectionTable(false, dispatch);
    resetFieldsForApplication(state, dispatch);
    await renderSearchConnectionTable(state, dispatch);
  } else {
    showHideApplicationTable(false, dispatch);
    resetFieldsForConnection(state, dispatch);
    await renderSearchApplicationTable(state, dispatch);
  }
}
// export const findAndReplace = (obj, oldValue, newValue) => {
//   Object.keys(obj).forEach(key => {
//       if ((obj[key] instanceof Object) || (obj[key] instanceof Array)) findAndReplace(obj[key], oldValue, newValue)
//       obj[key] = obj[key] === oldValue ? newValue : obj[key]
//   })
//   return obj
// }
export const deactivateConnection = async (state, dispatch) => {

  try
  {
    
    let queryObjectForUpdate = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0]");
    queryObjectForUpdate = findAndReplace(queryObjectForUpdate, "NA", null);
   if(!Number(queryObjectForUpdate.connectionExecutionDate) ||  queryObjectForUpdate.connectionExecutionDate !=='')
   {
     if(queryObjectForUpdate.connectionExecutionDate ==='1970-01-01')
     {
      set(queryObjectForUpdate, "connectionExecutionDate", 0);
     }
     else
     {
      set(queryObjectForUpdate, "connectionExecutionDate", convertDateToEpoch(queryObjectForUpdate.connectionExecutionDate));
     }
    
   }
   //INDIVIDUAL.SINGLEOWNER
   set(queryObjectForUpdate, "connectionHolders[0].ownerType", "INDIVIDUAL.SINGLEOWNER");
   set(queryObjectForUpdate, "status", "Inactive");
   // set other propert as workflow service did in backend
   set(queryObjectForUpdate, "applicationStatus", "TEMPORARY_CONNECTION_CLOSED");
   //set(queryObjectForUpdate, "activityType", "REACTIVATE_CONNECTION");
   let inWorkflow = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].inWorkflow",false);
   //inWorkflow = true;
   if(inWorkflow === true)
   {
    const errorMessageN = {
      labelName: "Duplicate name Added",
      labelKey:   `WS_DEACTIVATION_VALIDATIONM_MESSAGE`
      //labelKey:   LocalizationCodeValueN+' '+DuplicatItem[0].duplicates
    };
    dispatch(toggleSnackbar(true, errorMessageN, "warning"));
   }
   else{
    const payloadbillingPeriod = await httpRequest("post", "/ws-services/wc/_deactivateConnection", "", [], { WaterConnection: queryObjectForUpdate });
    let errorMessage = {
     labelName: "Connection deactivate successfully!",
     labelKey: "WS_DEACTIVATE_SUCCESS"
   };
    dispatch(toggleSnackbar(true, errorMessage, "success"));
       dispatch(
         handleField(
           "connection-details",
           "components.div.children.connectionDetails.children.cardContent.children.button.children.buttonContainer.children.Deactivate",
           {visible:false}
         )
       );
   set(
     state.screenConfiguration.screenConfig,
     "components.div.children.connectionDetails.children.cardContent.children.button.children.buttonContainer.children.Deactivate.visible",
     false
   );
 let connectionNumber =getQueryArg(window.location.href, "connectionNumber")
 let tenantId =getQueryArg(window.location.href, "tenantId")
 let service =getQueryArg(window.location.href, "service")
 let connectionType =getQueryArg(window.location.href, "connectionType")
   window.location.href = `connection-details?connectionNumber=${connectionNumber}&tenantId=${tenantId}&service=${service}&connectionType=${connectionType}&Active=${false}`

   }
   
  }
  catch(error)
        {
          dispatch(
            toggleSnackbar(
              true,
              { labelName: error.message, labelKey: error.message },
              "error"
            )
          );
          
        }
}
const renderSearchConnectionTable = async (state, dispatch) => {
  let queryObject = [{ key: "tenantId", value: getTenantIdCommon() }];
  let searchScreenObject = get(state.screenConfiguration.preparedFinalObject, "searchConnection", {});
  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.showSearches.children.showSearchScreens.props.tabs[0].tabContent.wnsApplication.children.cardContent.children.wnsApplicationContainer.children",
    state,
    dispatch,
    "search"
  );

  const isSearchBoxSecondRowValid = validateFields(
    "components.div.children.showSearches.children.showSearchScreens.props.tabs[0].tabContent.wnsApplication.children.cardContent.children.wnsApplicationContainer.children",
    state,
    dispatch,
    "search"
  );
  if (!(isSearchBoxFirstRowValid && isSearchBoxSecondRowValid)) {
    dispatch(toggleSnackbar(true, { labelKey: "ERR_WS_FILL_ATLEAST_ONE_FIELD" }, "warning"));
  } else if (
    Object.keys(searchScreenObject).length == 0 ||
    Object.values(searchScreenObject).every(x => x === "")
  ) {
    dispatch(toggleSnackbar(true, { labelKey: "ERR_WS_FILL_ATLEAST_ONE_FIELD" }, "warning"));
  } else if (
    (searchScreenObject["fromDate"] === undefined || searchScreenObject["fromDate"].length === 0) &&
    searchScreenObject["toDate"] !== undefined && searchScreenObject["toDate"].length !== 0) {
    dispatch(toggleSnackbar(true, { labelName: "Please fill From Date", labelKey: "ERR_FILL_FROM_DATE" }, "warning"));
  } else {
    for (var key in searchScreenObject) {
      if (searchScreenObject.hasOwnProperty(key) && searchScreenObject[key].trim() !== "") {
        if (key === "fromDate") {
          queryObject.push({ key: key, value: convertDateToEpoch(searchScreenObject[key], "daystart") });
        } else if (key === "toDate") {
          queryObject.push({ key: key, value: convertDateToEpoch(searchScreenObject[key], "dayend") });
        } else {
          queryObject.push({ key: key, value: searchScreenObject[key].trim() });
        }
      }
    }
    try {
      let waterMeteredDemandExipryDate = 0;
      let waterNonMeteredDemandExipryDate = 0;
      let sewerageNonMeteredDemandExpiryDate = 0;
      let payloadbillingPeriod = "";
      try {
        // Get the MDMS data for billingPeriod
        let mdmsBody = {
          MdmsCriteria: {
            tenantId: getTenantIdCommon(),
            moduleDetails: [
              { moduleName: "ws-services-masters", masterDetails: [{ name: "billingPeriod" }] },
              { moduleName: "sw-services-calculation", masterDetails: [{ name: "billingPeriod" }] }
            ]
          }
        }
        //Read metered & non-metered demand expiry date and assign value.
        payloadbillingPeriod = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);
        console.log(payloadbillingPeriod);
      } catch (err) { console.log(err) }
      let getSearchResult = getSearchResults(queryObject)
      let getSearchResultForSewerage = getSearchResultsForSewerage(queryObject, dispatch)
      let finalArray = [];
      let searchWaterConnectionResults, searcSewerageConnectionResults;
      try { searchWaterConnectionResults = await getSearchResult } catch (error) { finalArray = []; console.log(error) }
      try { searcSewerageConnectionResults = await getSearchResultForSewerage } catch (error) { finalArray = []; console.log(error) }
      const waterConnections = searchWaterConnectionResults ? searchWaterConnectionResults.WaterConnection.map(e => { e.service = 'WATER'; return e }) : []
      const sewerageConnections = searcSewerageConnectionResults ? searcSewerageConnectionResults.SewerageConnections.map(e => { e.service = 'SEWERAGE'; return e }) : [];
      let combinedSearchResults = searchWaterConnectionResults || searcSewerageConnectionResults ? sewerageConnections.concat(waterConnections) : []
      //start loader
      //dispatch(toggleSpinner());
      for (let i = 0; i < combinedSearchResults.length; i++) {
        let element = combinedSearchResults[i];
        if (element.connectionNo !== "NA" && element.connectionNo !== null) {
          let queryObjectForWaterFetchBill;
          if (element.service === "WATER") {
            // queryObjectForWaterFetchBill = [{ key: "tenantId", value: getTenantIdCommon() },
            //  { key: "consumerCode", value: element.connectionNo },
            //  {ket:'paymentMode',value:'cash'},
            //  {ket:'isGenerateDemand',value:false}
            //  // { key: "businessService", value: "WS" }
            // ];
            queryObjectForWaterFetchBill = {billGeneration:
              {            
                consumerCode:element.connectionNo,
                tenantId:getTenantIdCommon(),
                paymentMode:'cash',
                isGenerateDemand:false,            
              }
            }
            
          } else {
            // queryObjectForWaterFetchBill = [{ key: "tenantId", value: getTenantIdCommon() },
            //  { key: "consumerCode", value: element.connectionNo },
            //  {ket:'paymentMode',value:'cash'},
            //  {ket:'isGenerateDemand',value:false}
            //  // { key: "businessService", value: "SW" }
            // ];
            queryObjectForWaterFetchBill = {billGeneration:
              {            
                consumerCode:element.connectionNo,
                tenantId:getTenantIdCommon(),
                paymentMode:'cash',
                isGenerateDemand:false,            
              }
            }
          }

          if (element.service === "WATER" &&
            payloadbillingPeriod &&
            payloadbillingPeriod.MdmsRes['ws-services-masters'] &&
            payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod !== undefined &&
            payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod !== null) {
            payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod.forEach(obj => {
              if (obj.connectionType === 'Metered') {
                waterMeteredDemandExipryDate = obj.demandExpiryDate;
              } else if (obj.connectionType === 'Non Metered') {
                waterNonMeteredDemandExipryDate = obj.demandExpiryDate;
              }
            });
          }
          if (element.service === "SEWERAGE" &&
            payloadbillingPeriod &&
            payloadbillingPeriod.MdmsRes['sw-services-calculation'] &&
            payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod !== undefined &&
            payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod !== null) {
            payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod.forEach(obj => {
              if (obj.connectionType === 'Non Metered') {
                sewerageNonMeteredDemandExpiryDate = obj.demandExpiryDate;
              }
            });
          }

         // let billResults = await fetchBill(queryObjectForWaterFetchBill, dispatch)
         try{
          let billResults = await getBillingEstimation(queryObjectForWaterFetchBill, dispatch)
          if(billResults !== undefined)
          {
            if(billResults && billResults.billGeneration.length>0)
            {
              let updatedDueDate = 0;
              // if (element.service === "WATER") {
              //   updatedDueDate = (element.connectionType === 'Metered' ?//
              //     (bill.billDetails[0].toPeriod + waterMeteredDemandExipryDate) :
              //     (bill.billDetails[0].toPeriod + waterNonMeteredDemandExipryDate));
              // } else if (element.service === "SEWERAGE") {
              //   updatedDueDate = bill[0].billDetails[0].toPeriod + sewerageNonMeteredDemandExpiryDate;
              // }
              finalArray.push({
                //due: bill.totalAmount ===null?'':bill.totalAmount,
                due: bill.totalNetAmount ===null?'':bill.totalNetAmount,
                dueDate:bill.dueDateCash,// updatedDueDate>0? convertDateToEpoch(updatedDueDate):'',
                service: element.service,
                connectionNo: element.connectionNo,
                billGenerationId:bill.billGenerationId,
                name: (element.property) ? element.property.owners[0].name : '',
                //status: element.status,
                status: bill.status,                
                address: handleAddress(element),
                connectionType: element.connectionType,
                tenantId: element.tenantId,
                ActionType:element.activityType,
                ConStatus:element.status
              })
            }
            else
            {
              finalArray.push({
                due: 'NA',
                dueDate: 'NA',
                service: element.service,
                connectionNo: element.connectionNo,
                billGenerationId:0,
                name: (element.property) ? element.property.owners[0].name : '',
                status: "NA",//element.status,
                address: handleAddress(element),
                connectionType: element.connectionType,
                tenantId: element.tenantId,
                ActionType:element.activityType,
                ConStatus:element.status
              })

            }
            // billResults && billResults.billGeneration.length>0 ? billResults.billGeneration.map(bill => {

            // }) : 

          }
          else{
            finalArray.push({
            due: 'NA',
              dueDate: 'NA',
              service: element.service,
              connectionNo: element.connectionNo,
              billGenerationId:0,
              name: (element.property) ? element.property.owners[0].name : '',
              status: "NA",              
              address: handleAddress(element),
              connectionType: element.connectionType,
              tenantId: element.tenantId,
              ActionType:element.activityType,
              ConStatus:element.status
            })
          }
          
        }
        catch(err)
        {
          console.log(err)
        }
        }

      }
      showConnectionResults(finalArray, dispatch)
      // end loader
      //dispatch(toggleSpinner());
    } catch (err) { console.log(err) }
  }
}

const renderSearchApplicationTable = async (state, dispatch) => {
  let queryObject = [{ key: "tenantId", value: getTenantIdCommon() }];
  let searchScreenObject = get(state.screenConfiguration.preparedFinalObject, "searchScreen", {});
  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.showSearches.children.showSearchScreens.props.tabs[0].tabContent.wnsApplication.children.cardContent.children.wnsApplicationContainer.children",
    state,
    dispatch,
    "search"
  );

  const isSearchBoxSecondRowValid = validateFields(
    "components.div.children.showSearches.children.showSearchScreens.props.tabs[0].tabContent.wnsApplication.children.cardContent.children.wnsApplicationContainer.children",
    state,
    dispatch,
    "search"
  );
  if (!(isSearchBoxFirstRowValid && isSearchBoxSecondRowValid)) {
    dispatch(toggleSnackbar(true, { labelKey: "ERR_WS_FILL_ATLEAST_ONE_FIELD" }, "warning"));
  } else if (
    Object.keys(searchScreenObject).length == 0 ||
    Object.values(searchScreenObject).every(x => x === "")
  ) {
    dispatch(toggleSnackbar(true, { labelKey: "ERR_WS_FILL_ATLEAST_ONE_FIELD" }, "warning"));
  } else if (
    (searchScreenObject["fromDate"] === undefined || searchScreenObject["fromDate"].length === 0) &&
    searchScreenObject["toDate"] !== undefined && searchScreenObject["toDate"].length !== 0) {
    dispatch(toggleSnackbar(true, { labelName: "Please fill From Date", labelKey: "ERR_FILL_FROM_DATE" }, "warning"));
  } else {
    for (var key in searchScreenObject) {
      if (searchScreenObject.hasOwnProperty(key) && searchScreenObject[key].trim() !== "") {
        if (key === "fromDate") {
          queryObject.push({ key: key, value: convertDateToEpoch(searchScreenObject[key], "daystart") });
        } else if (key === "toDate") {
          queryObject.push({ key: key, value: convertDateToEpoch(searchScreenObject[key], "dayend") });
        } else {
          queryObject.push({ key: key, value: searchScreenObject[key].trim() });
        }
      }
    }
    try {
      let getSearchResult, getSearchResultForSewerage;
      if (searchScreenObject.applicationType === "New Water connection") {
        getSearchResult = getSearchResults(queryObject)
      } else if (searchScreenObject.applicationType === "New Sewerage Connection") {
        getSearchResultForSewerage = getSearchResultsForSewerage(queryObject, dispatch)
      } else {
        getSearchResult = getSearchResults(queryObject),
          getSearchResultForSewerage = getSearchResultsForSewerage(queryObject, dispatch)
      }
      let finalArray = [];
      let searchWaterConnectionResults, searcSewerageConnectionResults;
      try { searchWaterConnectionResults = await getSearchResult } catch (error) { finalArray = []; console.log(error) }
      try { searcSewerageConnectionResults = await getSearchResultForSewerage } catch (error) { finalArray = []; console.log(error) }
      const waterConnections = searchWaterConnectionResults ? searchWaterConnectionResults.WaterConnection.map(e => { e.service = 'WATER'; return e }) : []
      const sewerageConnections = searcSewerageConnectionResults ? searcSewerageConnectionResults.SewerageConnections.map(e => { e.service = 'SEWERAGE'; return e }) : [];
      let combinedSearchResults = searchWaterConnectionResults || searcSewerageConnectionResults ? sewerageConnections.concat(waterConnections) : []

      let appNo = "";
      // let combinedWFSearchResults = [];
      // for (let i = 0; i < combinedSearchResults.length; i++) {
      //   let element = findAndReplace(combinedSearchResults[i], null, "NA");
      //   if (element.applicationNo !== "NA" && element.applicationNo !== undefined) {
      //     appNo = appNo + element.applicationNo + ",";
      //   }
      //   if (i % 50 === 0 || i === (combinedSearchResults.length - 1)) {
      //     //We are trying to fetch 50 WF objects at a time
      //     appNo = appNo.substring(0, appNo.length - 1);
      //     const queryObj = [
      //       { key: "businessIds", value: appNo },
      //       { key: "history", value: true },
      //       { key: "tenantId", value: getTenantIdCommon() }
      //     ];
      //     // let wfResponse = await getWorkFlowData(queryObj);
      //     // if (wfResponse !== null && wfResponse.ProcessInstances !== null) {
      //     //   combinedWFSearchResults = combinedWFSearchResults.concat(wfResponse.ProcessInstances);
      //     // }
      //     appNo = "";
      //   }
      // }
      /*const queryObj = [
        { key: "businessIds", value: appNo },
        { key: "history", value: true },
        { key: "tenantId", value: getTenantIdCommon() }
      ];
      let Response = await getWorkFlowData(queryObj);*/
      //dispatch(toggleSpinner());
      let stime = new Date() 
      for (let i = 0; i < combinedSearchResults.length; i++) {
        let element = findAndReplace(combinedSearchResults[i], null, "NA");
        let appStatus;
        let paidamount_ = 0;
        let Locality = (element.property && element.property !== "NA" && element.property.address) ? element.property.address.locality.code : ""
        if (element.applicationNo !== "NA" && element.applicationNo !== undefined) {
          //appStatus = combinedWFSearchResults.filter(item => item.businessId.includes(element.applicationNo))[0]
         // appStatus = combinedWFSearchResults.filter(item => item.businessId === element.applicationNo)
          // appStatus = combinedWFSearchResults.filter(item => item.businessId === element.applicationNo)[0]
          // if (appStatus !== undefined && appStatus.state !== undefined) {
          //   appStatus = appStatus.state.applicationStatus;
          // } else {
          //   appStatus = "NA";
          // }
          if(element.applicationNo.includes("WS"))
          {
            appStatus = element.waterApplicationList[0].applicationStatus
            paidamount_ = (element.waterApplication.totalAmountPaid === null || element.waterApplication.totalAmountPaid ==='NA')?0:element.waterApplication.totalAmountPaid
            Locality =GetMdmsNameBycode(state, dispatch,"applyScreenMdmsData1.ws-services-masters.wssectorList",Locality) 
           // Locality = Locality;
          }
          else
          {
            appStatus = element.applicationStatus
            paidamount_ = (element.totalAmountPaid === null|| element.totalAmountPaid === "NA")?0:element.totalAmountPaid
           // Locality = Locality;
            Locality =GetMdmsNameBycode(state, dispatch,"applyScreenMdmsData1.ws-services-masters.swSectorList",Locality) 
          }
          
          if (element.property && element.property.owners &&
            element.property.owners !== "NA" &&
            element.property.owners !== null &&
            element.property.owners.length > 1) {
            let ownerName = "";
            element.property.owners.forEach(ele => { ownerName = ownerName + ", " + ele.name })

            finalArray.push({
              connectionNo: element.connectionNo,
              applicationNo: element.applicationNo,
              name: ownerName.slice(2),
             //name: (element.connectionHolders) ? element.connectionHolders[0].name : '',
              applicationStatus: appStatus,
              address: handleAddress(element),
              service: element.service,
              connectionType: element.connectionType,
              tenantId: element.tenantId,
              ActionType:element.activityType,
            })
          } else {
            finalArray.push({
              connectionNo: element.connectionNo,
              applicationNo: element.applicationNo,
              name: (element.property && element.property !== "NA" && element.property.owners) ? element.property.owners[0].name : "",
             // name: (element.connectionHolders) ? element.connectionHolders[0].name : '',
              applicationStatus: appStatus,
              address: handleAddress(element),
              service: element.service,
              connectionType: element.connectionType,
              tenantId: element.tenantId,
              ActionType:element.activityType,
              Sector: Locality,
              division:element.div,
              subdivision:element.subdiv,              
              plotnumber:(element.property && element.property !== "NA" && element.property.address) ? element.property.address.doorNo : "",
              paidamount:paidamount_,
            })
          }
        }
      }
      showApplicationResults(finalArray, dispatch)
     let endtime = new Date()// console.log(new Date())
     console.log(`${endtime}_${stime}`)
      //dispatch(toggleSpinner());
    } catch (err) { console.log(err) }
  }
}

const handleAddress = (element) => {
  let city = (
    element.property &&
    element.property !== "NA" &&
    element.property.address !== undefined &&
    element.property.address.city !== undefined &&
    element.property.address.city !== null
  ) ? element.property.address.city : "";
  let localityName = (
    element.property &&
    element.property !== "NA" &&
    element.property.address.locality !== undefined &&
    element.property.address.locality !== null &&
    element.property.address.locality.name !== null
  ) ? element.property.address.locality.name : "";
return (element.connectionHolders && element.connectionHolders !== null
   && element.connectionHolders[0].correspondenceAddress) 
   ? element.connectionHolders[0].correspondenceAddress 
   : '';
  //return (city === "" && localityName === "") ? "NA" : `${localityName}, ${city}`;
}

const showHideConnectionTable = (booleanHideOrShow, dispatch) => {
  dispatch(handleField("search", "components.div.children.searchResults", "visible", booleanHideOrShow));
};

const showHideApplicationTable = (booleanHideOrShow, dispatch) => {
  dispatch(handleField("search", "components.div.children.searchApplicationResults", "visible", booleanHideOrShow));
};

const showConnectionResults = (connections, dispatch) => {
  let data = connections.map(item => {
    return{
      [getTextToLocalMappingCode("service")]: item.service,
      [getTextToLocalMappingCode("Consumer No")]: item.connectionNo,
      [getTextToLocalMappingCode("Owner Name")]: item.name,
      [getTextToLocalMappingCode("Status")]: item.status,
      [getTextToLocalMappingCode("Due")]: item.due,
      [getTextToLocalMappingCode("Address")]: item.address,
      [getTextToLocalMappingCode("Due Date")]: (item.dueDate !== undefined && item.dueDate !== "NA") ? convertEpochToDate(item.dueDate) : item.dueDate,
      [getTextToLocalMappingCode("tenantId")]: item.tenantId,
      [getTextToLocalMappingCode("connectionType")]: item.connectionType,
      [getTextToLocalMappingCode("billGenerationId")]: item.billGenerationId,
      [getTextToLocalMappingCode("ConStatus")]: item.ConStatus
    }

  });
  dispatch(handleField("search", "components.div.children.searchResults", "props.data", data));
  dispatch(handleField("search", "components.div.children.searchResults", "props.rows",
    connections.length
  ));
  showHideConnectionTable(true, dispatch);
}

const showApplicationResults = (connections, dispatch) => {
  let data = connections.map(item => {
    return{
      [getTextToLocalMappingCode("Consumer No")]: item.connectionNo,
    [getTextToLocalMappingCode("Application No")]: item.applicationNo,
    [getTextToLocalMappingCode("Application Type")]: item.service === "WATER" ? "New Water Connection" : "New Sewerage Connection",
    [getTextToLocalMappingCode("Owner Name")]: item.name,
    [getTextToLocalMappingCode("Application Status")]: item.applicationStatus.split("_").join(" "),
    [getTextToLocalMappingCode("Address")]: item.address,
    [getTextToLocalMappingCode("tenantId")]: item.tenantId,
    [getTextToLocalMappingCode("service")]: item.service,
    [getTextToLocalMappingCode("connectionType")]: item.connectionType,
    [getTextToLocalMappingCode("ActionType")]: item.ActionType,
    [getTextToLocalMappingCode("Sector")]: item.Sector,
    [getTextToLocalMappingCode("division")]: item.division,
    [getTextToLocalMappingCode("subdivision")]: item.subdivision,
    [getTextToLocalMappingCode("plotnumber")]: item.plotnumber,
    [getTextToLocalMappingCode("paidamount")]: item.paidamount,

    }
    // [getTextToLocalMapping("Consumer No")]: item.connectionNo,
    // [getTextToLocalMapping("Application No")]: item.applicationNo,
    // [getTextToLocalMapping("Application Type")]: item.service === "WATER" ? "New Water Connection" : "New Sewerage Connection",
    // [getTextToLocalMapping("Owner Name")]: item.name,
    // [getTextToLocalMapping("Application Status")]: item.applicationStatus.split("_").join(" "),
    // [getTextToLocalMapping("Address")]: item.address,
    // [getTextToLocalMapping("tenantId")]: item.tenantId,
    // [getTextToLocalMapping("service")]: item.service,
    // [getTextToLocalMapping("connectionType")]: item.connectionType,
    // [getTextToLocalMapping("ActionType")]: item.ActionType,
  });
  dispatch(handleField("search", "components.div.children.searchApplicationResults", "props.data", data));
  dispatch(handleField("search", "components.div.children.searchApplicationResults", "props.rows",
    connections.length
  ));
  showHideApplicationTable(true, dispatch);
}


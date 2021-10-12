import commonConfig from "config/common.js";
import { downloadReceiptFromFilestoreID } from "egov-common/ui-utils/commons";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar, toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getFileUrl, getFileUrlFromAPI, getQueryArg, getTransformedLocale, setDocuments } from "egov-ui-framework/ui-utils/commons";
import { getTenantId, getUserInfo, getTenantIdCommon } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import store from "redux/store";
import { convertDateToEpoch,convertEpochToDate, getCheckBoxJsonpath, getHygeneLevelJson, getLocalityHarmedJson, getSafetyNormsJson, getTranslatedLabel, ifUserRoleExists, updateDropDowns } from "../ui-config/screens/specs/utils";
import { httpRequest } from "./api";

import cloneDeep from "lodash/cloneDeep";
export const serviceConst = {
    "WATER": "WATER",
    "SEWERAGE": "SEWERAGE"
}

export const pushTheDocsUploadedToRedux = async (state, dispatch) => {
    let reduxDocuments = get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux", {});
    let uploadedDocs = [];
    if (reduxDocuments !== null && reduxDocuments !== undefined) {
        dispatch(prepareFinalObject("DocumentsData", []));
        Object.keys(reduxDocuments).forEach(async key => {
            if (reduxDocuments !== undefined && reduxDocuments[key] !== undefined && reduxDocuments[key].documents !== undefined) {
                reduxDocuments[key].documents.forEach(element => {
                    if (reduxDocuments[key].dropdown !== undefined) {
                        element.documentType = reduxDocuments[key].dropdown.value;
                    } else {
                        if(reduxDocuments[key].documentType === undefined)
                        {
                            let activityType=  get(
                                state,
                                "screenConfiguration.preparedFinalObject.WaterConnection[0].activityType",
                                ''
                            );
                            element.documentType =`${activityType}_ROADCUT_NOC`
                        }
                        else
                        {
                        element.documentType = reduxDocuments[key].documentType;
                        }
                    }
                    element.documentCode = reduxDocuments[key].documentCode;
                    element.status = "ACTIVE";
                    element.id = reduxDocuments[key].id;
                });
                uploadedDocs = uploadedDocs.concat(reduxDocuments[key].documents);
                dispatch(prepareFinalObject("applyScreen.documents", uploadedDocs));
                let docArrayFromFileStore = await setDocsForEditFlow(state);
                uploadedDocs.forEach(obj => {
                    let element = obj.fileStoreId;
                    Object.keys(docArrayFromFileStore).forEach(resp => {
                        docArrayFromFileStore[resp].forEach(arr => { if (arr.fileStoreId === element) { obj.fileName = arr.fileName; } })
                    })
                })
                let docs = get(state, "screenConfiguration.preparedFinalObject");
                await setDocuments(docs, "applyScreen.documents", "UploadedDocs", dispatch);
                await setDocuments(docs, "applyScreen.documents", "DocumentsData", dispatch);
                let applyScreenObject = findAndReplace(get(state.screenConfiguration.preparedFinalObject, "applyScreen", {}), "NA", null);
                let applyScreenObj = findAndReplace(applyScreenObject, 0, null);
                dispatch(prepareFinalObject("applyScreen", applyScreenObj));
                if (getQueryArg(window.location.href, "action") === "edit") {
                    dispatch(prepareFinalObject("WaterConnection[0]", applyScreenObj));
                }
            }
        });
    }
}
export const updateTradeDetails = async requestBody => {
    try {
        const payload = await httpRequest(
            "post",
            "/tl-services/v1/_update",
            "", [],
            requestBody
        );
        return payload;
    } catch (error) {
        store.dispatch(toggleSnackbar(true, error.message, "error"));
    }
};

export const getLocaleLabelsforTL = (label, labelKey, localizationLabels) => {
    alert(1);
    console.log(label, labelKey)
    if (labelKey) {
        let translatedLabel = getTranslatedLabel(labelKey, localizationLabels);
        if (!translatedLabel || labelKey === translatedLabel) {
            return label;
        } else {
            return translatedLabel;
        }
    } else {
        return label;
    }
};

export const getPropertyObj = async (waterConnection) => {
    let uuidsArray =[];
    let uuids = "";
    let propertyArr = [];
   for(var i=0; i<waterConnection.length;i++){
       if(waterConnection[i].propertyId && waterConnection[i].propertyId !== null && waterConnection[i].propertyId !== "NA"){
           if(!uuidsArray.includes(waterConnection[i]['propertyId'])){
               uuidsArray.push(waterConnection[i]['propertyId']);
               uuids += waterConnection[i]['propertyId'] + ",";                       
            }
            if(uuidsArray.length % 50 === 0 || (uuidsArray.length > 0 && i === (waterConnection.length-1))) {
               let queryObject1 = [];
               uuids = uuids.substring(0, uuids.length-1);
               if (process.env.REACT_APP_NAME === "Citizen") {
                   queryObject1 = [{ key: "uuids", value: uuids }];
               }else{
                   queryObject1 = [{ key: "tenantId", value: getTenantIdCommon() }, { key: "uuids", value: uuids }];
               }
               let payload = await getPropertyResultsWODispatch(queryObject1);
               if(payload.Properties.length > 0){                                   
                   for(var j=0; j< payload.Properties.length; j++) {
                       propertyArr[payload.Properties[j].id] = payload.Properties[j]
                   }                                   
                }
                uuids = "";
                uuidsArray = [];
            }
       }else{
           waterConnection[i].property = null;
       }    
    }
    let tempPropertyObj = null
    if(Object.keys(propertyArr).length > 0 ){
       for(var i=0; i<waterConnection.length;i++){
           if(waterConnection[i].propertyId && waterConnection[i].propertyId !== null && waterConnection[i].propertyId !== "NA"){
               if(propertyArr[waterConnection[i].propertyId]){
                   tempPropertyObj = (propertyArr[waterConnection[i].propertyId])?propertyArr[waterConnection[i].propertyId]:null 
                   waterConnection[i].property = tempPropertyObj;
                   waterConnection[i].tenantId = (tempPropertyObj && tempPropertyObj.tenantId)?tempPropertyObj.tenantId:null;
                   tempPropertyObj = null;
               }
           }
        }
    }
    return waterConnection;
}

export const getResults = async (queryObject,dispatch,screenName) => {
    let url =""
    switch(screenName){
      case "download": url =  "/ws-services/wc/_search";
      break;
      
    }
    try {
      const response = await httpRequest("post", url, "", queryObject, {} );
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
  export const getSearchResultsP = async queryObject => {
    try {
        const response = await httpRequest(
            "post",
            "/ws-services/wc/_search",
            "_search",
            queryObject
        );
        if(response.WaterConnection && response.WaterConnection.length == 0){
            return response;
        }
        let result = findAndReplace(response, null, "NA");
        let waterSource = result.WaterConnection[0].waterSource.includes("null") ? "NA" : result.WaterConnection[0].waterSource.split(".")[0];
        let waterSubSource = result.WaterConnection[0].waterSource.includes("null") ? "NA" : result.WaterConnection[0].waterSource.split(".")[1];
        result.WaterConnection[0].waterSource = waterSource;
        result.WaterConnection[0].waterSubSource = waterSubSource;
        // if(result.WaterConnection[0].connectionHolders && result.WaterConnection[0].connectionHolders[0] && result.WaterConnection[0].connectionHolders !=='NA')
        // {
        //     if(result.WaterConnection[0].activityType='UPDATE_CONNECTION_HOLDER_INFO' &&  result.WaterConnection[0].applicationStatus==='PENDING_FOR_DOCUMENT_VERIFICATION')
        //     {
        //         result.WaterConnection[0].connectionHolders[0].proposedName = result.WaterConnection[0].connectionHolders[0].proposedName;
        //         result.WaterConnection[0].connectionHolders[0].proposedMobileNo = result.WaterConnection[0].connectionHolders[0].proposedMobileNo;
        //         result.WaterConnection[0].connectionHolders[0].proposedCorrespondanceAddress = result.WaterConnection[0].connectionHolders[0].proposedCorrespondanceAddress;

        //     }
               

        // }
        
       // result.WaterConnection = await getPropertyObj(result.WaterConnection); 
        return result;
    } catch (error) { console.log(error) }
};
export const getSearchResults = async queryObject => {
    try {
        const response = await httpRequest(
            "post",
            "/ws-services/wc/_search",
            "_search",
            queryObject
        );
        if(response.WaterConnection && response.WaterConnection.length == 0){
            return response;
        }
        let result = findAndReplace(response, null, "NA");
        let waterSource = result.WaterConnection[0].waterSource.includes("null") ? "NA" : result.WaterConnection[0].waterSource.split(".")[0];
        let waterSubSource = result.WaterConnection[0].waterSource.includes("null") ? "NA" : result.WaterConnection[0].waterSource.split(".")[1];
        result.WaterConnection[0].waterSource = waterSource;
        result.WaterConnection[0].waterSubSource = waterSubSource;
        // if(result.WaterConnection[0].connectionHolders && result.WaterConnection[0].connectionHolders[0] && result.WaterConnection[0].connectionHolders !=='NA')
        // {
        //     if(result.WaterConnection[0].activityType='UPDATE_CONNECTION_HOLDER_INFO' &&  result.WaterConnection[0].applicationStatus==='PENDING_FOR_DOCUMENT_VERIFICATION')
        //     {
        //         result.WaterConnection[0].connectionHolders[0].proposedName = result.WaterConnection[0].connectionHolders[0].proposedName;
        //         result.WaterConnection[0].connectionHolders[0].proposedMobileNo = result.WaterConnection[0].connectionHolders[0].proposedMobileNo;
        //         result.WaterConnection[0].connectionHolders[0].proposedCorrespondanceAddress = result.WaterConnection[0].connectionHolders[0].proposedCorrespondanceAddress;

        //     }
               

        // }
        
        result.WaterConnection = await getPropertyObj(result.WaterConnection); 
        return result;
    } catch (error) { console.log(error) }
};

export const getSearchResultsForSewerage = async (queryObject, dispatch) => {
    dispatch(toggleSpinner());
    try {
        const response = await httpRequest(
            "post",
            "/sw-services/swc/_search",
            "_search",
            queryObject
        );
        if(response.SewerageConnections && response.SewerageConnections.length == 0){
            dispatch(toggleSpinner());
            return response;
        }        
        let result = findAndReplace(response, null, "NA");
        result.SewerageConnections = await getPropertyObj(result.SewerageConnections); 
        dispatch(toggleSpinner());
        return result;
    } catch (error) {
        dispatch(toggleSpinner());
        console.log(error)
    }
};

export const getDescriptionFromMDMS = async (requestBody, dispatch) => {
    dispatch(toggleSpinner());
    try {
        const response = await httpRequest(
            "post",
            "/egov-mdms-service/v1/_search",
            "_search", [],
            requestBody
        );
        dispatch(toggleSpinner());
        return findAndReplace(response, null, "NA");
    } catch (error) {
        dispatch(toggleSpinner());
        store.dispatch(
            toggleSnackbar(
                true, { labelName: error.message, labelCode: error.message },
                "error"
            )
        );
    }
};

export const fetchBill = async (queryObject, dispatch) => {
    dispatch(toggleSpinner());
    try {
        const response = await httpRequest(
            "post",
            "/billing-service/bill/v2/_fetchbill",
            "_fetchBill",
            queryObject
        );
        dispatch(toggleSpinner());
        return findAndReplace(response, null, "NA");
    } catch (error) {
        dispatch(toggleSpinner());
        console.log(error)
        let errorMessage = {
            labelName: error.message,
            labelKey: error.message
          };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
};
export const getBillingEstimation = async (queryObject, dispatch) => {
    dispatch(toggleSpinner());
    try {
        const response = await httpRequest(
            "post",
            "/ws-calculator/billing/_getBillingEstimation",
            "_search",
            [],
            queryObject
        );
        dispatch(toggleSpinner());
        return findAndReplace(response, null, "NA");
    } catch (error) {
        dispatch(toggleSpinner());
        console.log(error)
        let errorMessage = {
            labelName: error.message,
            labelKey: error.message
          };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
};
export const getSearchBillingEstimation = async (queryObject, dispatch, action) => {
    dispatch(toggleSpinner());
    try {
        const response = await httpRequest(
            "post",
            "/ws-calculator/billing/_getBillingEstimation",
            "_search",
            [],
            queryObject
        );
        dispatch(toggleSpinner());
        return findAndReplace(response, null, "NA");
    } catch (error) {
        dispatch(toggleSpinner());
        console.log(error)
        let errorMessage = {
            labelName: error.message,
            labelKey: error.message
          };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewConnectionBillDetailException.visible",true);
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewConnectionBillDetail.visible",false);
        dispatch(prepareFinalObject("billGenerationdata.status", 'No Data Found'))
        dispatch(prepareFinalObject("billGenerationdata.totalNetAmount", ''))
        dispatch(prepareFinalObject("billGenerationdata.dueDateCash", ''))
    }
};

//Workflow process instances for application status
export const getWorkFlowData = async (queryObject) => {
    try {
        const response = await httpRequest(
            "post",
            "egov-workflow-v2/egov-wf/process/_search",
            "_search",
            queryObject
        );
        return response;
    } catch (error) {
        console.log(error)
    }
};

// api call to get my connection details
export const getMyConnectionResults = async (queryObject, dispatch,action) => {
    dispatch(toggleSpinner());
    try {
        const response = await httpRequest(
            "post",
            "/ws-services/wc/_search",
            "_search",
            queryObject
        );

        if (response.WaterConnection.length > 0) {
            response.WaterConnection = await getPropertyObj(response.WaterConnection);             
            let IsEstimatecall = false
            if(action)
            {
                if(action.screenKey !== "home")
                {
                    IsEstimatecall = true

                }
                // if(action.screenKey !== "home1")
                // {
                //     IsEstimatecall = true
                // }
            }
            for (let i = 0; i < response.WaterConnection.length; i++) {
                response.WaterConnection[i].service = "Water"
                if (response.WaterConnection[i].connectionNo !== null && response.WaterConnection[i].connectionNo !== undefined && IsEstimatecall===true) {
                    try {
                        let queryObject = {billGeneration:
                            {            
                              consumerCode:response.WaterConnection[i].connectionNo,
                            //   tenantId: response.WaterConnection[i].property.tenantId,//getTenantId(),
                            //   paymentMode:'cash',
                            //   isGenerateDemand:false,            
                            }
                          }
                        const data = await httpRequest(
                            "post",
                            //`billing-service/bill/v2/_fetchbill?consumerCode=${response.WaterConnection[i].connectionNo}&tenantId=${response.WaterConnection[i].property.tenantId}&businessService=WS`,
                            '/ws-services/billGeneration/_getBillData',
                            "_search",
                            [],
                            queryObject
                        );
                        if (data && data !== undefined) {
                            if (data.billGeneration !== undefined && data.billGeneration.length > 0) {
                               response.WaterConnection[i].due = 0//data.billGeneration[0].totalAmount
                                response.WaterConnection[i].status = data.billGeneration[0].status
                                response.WaterConnection[i].id = data.billGeneration[0].billGenerationId
                                response.WaterConnection[i].error = ""
                            }

                        } else {
                            response.WaterConnection[i].due = "NA"
                            response.WaterConnection[i].status = "NA"
                            response.WaterConnection[i].id = 0
                            response.WaterConnection[i].error = ""
                        }

                    } catch (err) {
                        console.log(err)
                        response.WaterConnection[i].due = "NA"
                        response.WaterConnection[i].status = "NA"
                        response.WaterConnection[i].error = err.message
                        response.WaterConnection[i].id = 0
                        //Error.message
                    }
                }
            }
            // });
        }
        dispatch(toggleSpinner());
        return findAndReplace(response, null, "NA");
    } catch (error) {
        dispatch(toggleSpinner());
        console.log(error);
    }

};

export const getMyApplicationResults = async (queryObject, dispatch) => {
    dispatch(toggleSpinner());
    try {
        const response = await httpRequest(
            "post",
            "/ws-services/wc/_search",
            "_search",
            queryObject
        );

        if (response.WaterConnection.length > 0) {
            response.WaterConnection = await getPropertyObj(response.WaterConnection);
            for (let i = 0; i < response.WaterConnection.length; i++) {
                response.WaterConnection[i].service = "Water"

                if (response.WaterConnection[i].applicationNo !== null && response.WaterConnection[i].applicationNo !== undefined) {
                    try {
                        let queryObject = {billGeneration:
                            {            
                              consumerCode:response.WaterConnection[i].connectionNo,                                        
                            }
                        }
                        let  WNSConfigName_= WNSConfigName()
                        const data = await httpRequest(
                            "post",
                            `billing-service/bill/v2/_fetchbill?consumerCode=${response.WaterConnection[i].applicationNo}&tenantId=${response.WaterConnection[i].property.tenantId}&businessService=${WNSConfigName_.ONE_TIME_FEE_WS}`,
                            //'/ws-services/billGeneration/_getBillData',
                            "_search",
                             queryObject
                        );
                        if (data && data !== undefined) {
                            if (data.Bill !== undefined && data.Bill.length > 0) {
                                if (data.Bill[0].totalAmount !== 0) {
                                    response.WaterConnection[i].due = data.Bill[0].totalAmount
                                } else {
                                    response.WaterConnection[i].due = "NA"
                                }
                            }

                        } else {
                            response.WaterConnection[i].due = 0
                        }
                        // if (data && data !== undefined) {
                        //     if (data.billGeneration !== undefined && data.billGeneration.length > 0) {
                        //        response.WaterConnection[i].due = 0//data.billGeneration[0].totalAmount
                        //         response.WaterConnection[i].status = data.billGeneration[0].status
                        //         response.WaterConnection[i].id = data.billGeneration[0].billGenerationId
                        //         response.WaterConnection[i].error = ""
                        //     }

                        // } else {
                        //     response.WaterConnection[i].due = "NA"
                        //     response.WaterConnection[i].status = "NA"
                        //     response.WaterConnection[i].error = ""
                        //     response.WaterConnection[i].id = 0
                        // }

                    } catch (err) {
                        console.log(err)
                        response.WaterConnection[i].due = "NA"
                        //response.WaterConnection[i].status = "NA"
                        response.WaterConnection[i].error = err.message
                        response.WaterConnection[i].id = 0
                    }
                }
                
            }
            // });
        }
        dispatch(toggleSpinner());
        return findAndReplace(response, null, "NA");
    } catch (error) {
        dispatch(toggleSpinner());
        console.log(error);
    }

};

export const getSWMyApplicationResults = async (queryObject, dispatch) => {
    dispatch(toggleSpinner());
    try {
        const response = await httpRequest(
            "post",
            "/sw-services/swc/_search",
            // "/sw-services/swc/_search",
            "_search",
            queryObject
        );
        if (response.SewerageConnections.length > 0) {
            response.SewerageConnections = await getPropertyObj(response.SewerageConnections);
            for (let i = 0; i < response.SewerageConnections.length; i++) {
                response.SewerageConnections[i].service = "Sewerage"
                if (response.SewerageConnections[i].applicationNo !== undefined && response.SewerageConnections[i].applicationNo !== null) {
                    try {
                        let queryObject = {billGeneration:
                            {            
                              consumerCode:response.SewerageConnections[i].connectionNo,                                        
                            }
                        }
                        const data = await httpRequest(
                            "post",
                            //`billing-service/bill/v2/_fetchbill?consumerCode=${response.SewerageConnections[i].applicationNo}&tenantId=${response.SewerageConnections[i].property.tenantId}&businessService=SW.ONE_TIME_FEE`,
                            '/ws-services/billGeneration/_getBillData',
                            "_search",
                            queryObject
                        );
                        if (data && data !== undefined) {
                            if (data.Bill !== undefined && data.Bill.length > 0) {
                                if (data.Bill[0].totalAmount !== 0) {
                                    response.SewerageConnections[i].due = data.Bill[0].totalAmount
                                } else {
                                    response.SewerageConnections[i].due = "NA"
                                }
                            }

                        } else {
                            response.SewerageConnections[i].due = 0
                        }
                        // if (data && data !== undefined) {
                        //     if (data.billGeneration !== undefined && data.billGeneration.length > 0) {
                        //        response.SewerageConnections[i].due = 0//data.billGeneration[0].totalAmount
                        //         response.SewerageConnections[i].status = data.billGeneration[0].status
                        //         response.SewerageConnections[i].id = data.billGeneration[0].billGenerationId
                        //         response.SewerageConnections[i].error = ""
                        //     }

                        // } else {
                        //     response.SewerageConnections[i].due = "NA"
                        //     response.SewerageConnections[i].status = "NA"
                        //     response.SewerageConnections[i].error = ""
                        //     response.SewerageConnections[i].id = 0
                        // }

                    } catch (err) {
                        console.log(err)
                        response.SewerageConnections[i].due = "NA"
                       // response.SewerageConnections[i].status = "NA"
                        response.SewerageConnections[i].error = err.message
                        response.SewerageConnections[i].id = 0
                    }
                }
            }
            // });
        }
        dispatch(toggleSpinner());
        return findAndReplace(response, null, "NA");
    } catch (error) {
        dispatch(toggleSpinner());
        console.log(error);
    }

};

export const getPropertyResults = async (queryObject, dispatch) => {
    dispatch(toggleSpinner());
    try {
        const response = await httpRequest(
            "post",
            "/property-services/property/_search",
            "_search",
            queryObject
        );
        dispatch(toggleSpinner());
       // return findAndReplace(response, null, "NA");
       //set subusageCategory from usageCategory
       if(response)
       {
        set(response.Properties[0], `subusageCategory`, response.Properties[0].usageCategory);
       }
      
       return response;
    } catch (error) {
        dispatch(toggleSpinner());
        console.log(error);
    }

};

export const getPropertyResultsWODispatch = async (queryObject) => {
    try {
        const response = await httpRequest(
            "post",
            "/property-services/property/_search",
            "_search",
            queryObject
        );
        if(response)
        {
         set(response.Properties[0], `subusageCategory`, response.Properties[0].usageCategory);
        }
        return findAndReplace(response, null, "NA");
    } catch (error) {        
        console.log(error);
    }

};



export const getConsumptionDetails = async (queryObject, dispatch) => {
    dispatch(toggleSpinner());
    try {
        const response = await httpRequest(
            "post",
            "/ws-calculator/meterConnection/_search",
            "_search",
            queryObject
        );
        dispatch(toggleSpinner());
        return findAndReplace(response, null, "NA");
    } catch (error) {
        dispatch(toggleSpinner());
        store.dispatch(
            toggleSnackbar(
                true, { labelName: error.message, labelCode: error.message },
                "error"
            )
        );
    }
};

export const updatePFOforSearchResults = async (
    action,
    state,
    dispatch,
    queryValue,
    queryValuePurpose,
    tenantId
) => {
    let queryObject = [{
        key: "tenantId",
        value: tenantId ? tenantId : getTenantIdCommon()
    },
    { key: "applicationNumber", value: queryValue }
    ];
    const isPreviouslyEdited = getQueryArg(window.location.href, "edited");
    const payload = !isPreviouslyEdited ?
        await getSearchResults(queryObject) :
        {
            WaterConnection: get(state.screenConfiguration.preparedFinalObject, "WaterConnection")
        };
    getQueryArg(window.location.href, "action") === "edit" &&
        (await setDocsForEditFlow(state));
    if (payload) {
        dispatch(prepareFinalObject("WaterConnection[0]", payload.WaterConnection[0]));
    }
    // const licenseType = payload && get(payload, "Licenses[0].licenseType");
    // const structureSubtype =
    //     payload && get(payload, "Licenses[0].tradeLicenseDetail.structureType");
    // const tradeTypes = setFilteredTradeTypes(
    //     state,
    //     dispatch,
    //     licenseType,
    //     structureSubtype
    // );
    // const tradeTypeDdData = getTradeTypeDropdownData(tradeTypes);
    // tradeTypeDdData &&
    //     dispatch(
    //         prepareFinalObject(
    //             "applyScreenMdmsData.TradeLicense.TradeTypeTransformed",
    //             tradeTypeDdData
    //         )
    //     );
    updateDropDowns(payload, action, state, dispatch, queryValue);
    if (queryValuePurpose !== "cancel") {
        set(payload, getSafetyNormsJson(queryValuePurpose), "yes");
        set(payload, getHygeneLevelJson(queryValuePurpose), "yes");
        set(payload, getLocalityHarmedJson(queryValuePurpose), "No");
    }
    set(payload, getCheckBoxJsonpath(queryValuePurpose), true);

    setApplicationNumberBox(state, dispatch);

    // createOwnersBackup(dispatch, payload);
};

export const getBoundaryData = async (
    action,
    state,
    dispatch,
    queryObject,
    code) => {
    try {
        let payload = await httpRequest(
            "post",
            "/egov-location/location/v11/boundarys/_search?hierarchyTypeCode=REVENUE&boundaryType=Locality",
            "_search",
            queryObject, {}
        );
        const tenantId =
            process.env.REACT_APP_NAME === "Employee" ?
                get(
                    state.screenConfiguration.preparedFinalObject,
                    "Licenses[0].tradeLicenseDetail.address.city"
                ) :
                getQueryArg(window.location.href, "tenantId");

        const mohallaData =
            payload &&
            payload.TenantBoundary[0] &&
            payload.TenantBoundary[0].boundary &&
            payload.TenantBoundary[0].boundary.reduce((result, item) => {
                result.push({
                    ...item,
                    name: `${tenantId
                        .toUpperCase()
                        .replace(/[.]/g, "_")}_REVENUE_${item.code
                            .toUpperCase()
                            .replace(/[._:-\s\/]/g, "_")}`
                });
                return result;
            }, []);

        dispatch(
            prepareFinalObject(
                "applyScreenMdmsData.tenant.localities",
                // payload.TenantBoundary && payload.TenantBoundary[0].boundary,
                mohallaData
            )
        );

        dispatch(
            handleField(
                "apply",
                "components.div.children.formwizardFirstStep.children.tradeLocationDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLocMohalla",
                "props.suggestions",
                mohallaData
            )
        );
        if (code) {
            let data = payload.TenantBoundary[0].boundary;
            let messageObject =
                data &&
                data.find(item => {
                    return item.code == code;
                });
            if (messageObject)
                dispatch(
                    prepareFinalObject(
                        "Licenses[0].tradeLicenseDetail.address.locality.name",
                        messageObject.name
                    )
                );
        }
    } catch (e) {
        console.log(e);
    }
};

export const validateFeildsForBothWaterAndSewerage = (applyScreenObject) => {
    if (
        applyScreenObject.hasOwnProperty("property") &&
        applyScreenObject['property'] !== undefined &&
        applyScreenObject["property"] !== "" &&
        applyScreenObject.hasOwnProperty("water") &&
        applyScreenObject["water"] !== undefined &&
        applyScreenObject["water"] !== "" &&
        applyScreenObject.hasOwnProperty("sewerage") &&
        applyScreenObject["sewerage"] !== undefined &&
        applyScreenObject["sewerage"] !== "" &&
        // applyScreenObject.hasOwnProperty("proposedTaps") &&
        // applyScreenObject["proposedTaps"] !== undefined &&
        // applyScreenObject["proposedTaps"] !== "" &&
        // applyScreenObject["proposedTaps"].match(/^[0-9]*$/i) &&
        applyScreenObject.hasOwnProperty("proposedPipeSize") &&
        applyScreenObject["proposedPipeSize"] !== undefined &&
        applyScreenObject["proposedPipeSize"] !== "" &&
        applyScreenObject.hasOwnProperty("proposedWaterClosets") &&
        applyScreenObject["proposedWaterClosets"] !== undefined &&
        applyScreenObject["proposedWaterClosets"] !== "" &&
        applyScreenObject["proposedWaterClosets"].match(/^[0-9]*$/i) &&
        applyScreenObject.hasOwnProperty("proposedToilets") &&
        applyScreenObject["proposedToilets"] !== undefined &&
        applyScreenObject["proposedToilets"] !== "" &&
        applyScreenObject["proposedToilets"].match(/^[0-9]*$/i)
    ) { return true; } else { return false; }
}

export const validateFeildsForWater = (applyScreenObject) => {
    if (
        applyScreenObject.hasOwnProperty("property") &&
        applyScreenObject['property'] !== undefined &&
        applyScreenObject["property"] !== "" &&
        applyScreenObject.hasOwnProperty("water") &&
        applyScreenObject["water"] !== undefined &&
        applyScreenObject["water"] !== "" &&
        applyScreenObject.hasOwnProperty("sewerage") &&
        applyScreenObject["sewerage"] !== undefined &&
        applyScreenObject["sewerage"] !== "" &&
        // applyScreenObject.hasOwnProperty("proposedTaps") &&
        // applyScreenObject["proposedTaps"] !== undefined &&
        // applyScreenObject["proposedTaps"] !== "" &&
        // applyScreenObject["proposedTaps"].match(/^[0-9]*$/i) &&
        applyScreenObject.hasOwnProperty("proposedPipeSize") &&
        applyScreenObject["proposedPipeSize"] !== undefined &&
        applyScreenObject["proposedPipeSize"] !== ""
    ) { return true; } else { return false; }
}

export const validateFeildsForSewerage = (applyScreenObject) => {
    if (
        applyScreenObject.hasOwnProperty("property") &&
        applyScreenObject['property'] !== undefined &&
        applyScreenObject["property"] !== "" &&
        applyScreenObject.hasOwnProperty("water") &&
        applyScreenObject["water"] !== undefined &&
        applyScreenObject["water"] !== "" &&
        applyScreenObject.hasOwnProperty("sewerage") &&
        applyScreenObject["sewerage"] !== undefined &&
        applyScreenObject["sewerage"] !== "" &&
        applyScreenObject.hasOwnProperty("proposedWaterClosets") &&
        applyScreenObject["proposedWaterClosets"] !== undefined &&
        applyScreenObject["proposedWaterClosets"] !== "" &&
        applyScreenObject["proposedWaterClosets"].match(/^[0-9]*$/i) &&
        applyScreenObject.hasOwnProperty("proposedToilets") &&
        applyScreenObject["proposedToilets"] !== undefined &&
        applyScreenObject["proposedToilets"] !== "" &&
        applyScreenObject["proposedToilets"].match(/^[0-9]*$/i)
    ) { return true; } else { return false }
}

export const handleMandatoryFeildsOfProperty = (applyScreenObject) => {
    let propertyObject = findAndReplace(applyScreenObject, "NA", null);
    if (
        propertyObject.hasOwnProperty("propertyId") && propertyObject['propertyId'] !== undefined && propertyObject["propertyId"] !== "" &&
        propertyObject.hasOwnProperty("propertyType") && propertyObject["propertyType"] !== undefined && propertyObject["propertyType"] !== "" &&
        propertyObject.hasOwnProperty("usageCategory") && propertyObject["usageCategory"] !== undefined && propertyObject["usageCategory"] !== "" &&
        propertyObject.hasOwnProperty("landArea") && propertyObject["landArea"] !== undefined && propertyObject["landArea"] !== "" &&
        // propertyObject.hasOwnProperty("rainWaterHarvesting") && propertyObject["rainWaterHarvesting"] !== undefined && propertyObject["rainWaterHarvesting"] !== "" &&
        propertyObject.hasOwnProperty("owners") && propertyObject["owners"] !== undefined && propertyObject["owners"] !== "" &&
        validatePropertyOwners(applyScreenObject) &&
        handleAddressObjectInProperty(applyScreenObject.address)
    ) { return true; } else { return false; }
}

const handleAddressObjectInProperty = (address) => {
    if (address !== undefined && address !== null && address !== {}) {
        if (
            address.hasOwnProperty("city") && address['city'] !== undefined && address["city"] !== "" && address["city"] !== null &&
            address.hasOwnProperty("doorNo") && address["doorNo"] !== undefined && address["doorNo"] !== "" && address["doorNo"] !== null &&
            address.hasOwnProperty("locality") && address.locality.name !== undefined && address.locality.name !== "" && address.locality.name !== null
        ) { return true; } else { return false; }
    }
}

const validatePropertyOwners = (applyScreenObject) => {
    if (applyScreenObject.owners && applyScreenObject.owners.length > 0) {
        let owners = applyScreenObject.owners;
        let valid = [];
        for (let i = 0; i < owners.length; i++) {
            if (
                owners[i].hasOwnProperty("mobileNumber") && owners[i]['mobileNumber'] !== undefined && owners[i]["mobileNumber"] !== "" &&
                owners[i].hasOwnProperty("name") && owners[i]['name'] !== undefined && owners[i]["name"] !== "" &&
                owners[i].hasOwnProperty("fatherOrHusbandName") && owners[i]['fatherOrHusbandName'] !== undefined && owners[i]["fatherOrHusbandName"] !== "" &&
                owners[i].hasOwnProperty("correspondenceAddress") && owners[i]['correspondenceAddress'] !== undefined && owners[i]["correspondenceAddress"] !== ""
            ) { valid.push(1) } else { valid.push(0) }
        }
        if (valid.includes(0)) { return false; } else { return true; }
    }
}

export const prepareDocumentsUploadData = (state, dispatch,type="upload") => {
    let documents = '';
    let wsDocument ='';
    if (type == "wsupload") {
        documents = get(
          state,
          "screenConfiguration.preparedFinalObject.DocumentType_wsbillupload",
          []
        );
      }
      else{
        documents = get(
            state,
            "screenConfiguration.preparedFinalObject.applyScreenMdmsData.ws-services-masters.Documents",
            []
        );
        documents =[];
        wsDocument = get(
            state,
            "screenConfiguration.preparedFinalObject.applyScreenMdmsData.ws-services-masters.wsDocument",
            []
        );

        // fiter baed on occupancycode (Property Sub Usage Type),category(Uses Caregory) and applicationType(Application Type) 
        let occupancycode = get(
            state,
            "screenConfiguration.preparedFinalObject.applyScreen.property.usageCategory",
            ''
        );
        let subusageCategory = get(
            state,
            "screenConfiguration.preparedFinalObject.applyScreen.property.subusageCategory",
            ''
        );
        if(occupancycode !== undefined && occupancycode!= null)
                {
        if(occupancycode.split('.').length != 2)
        {
            occupancycode = subusageCategory;

        }
    }
        let category = get(
            state,
            "screenConfiguration.preparedFinalObject.applyScreen.waterProperty.usageSubCategory",
            ''
        );
        let water = get(state.screenConfiguration.preparedFinalObject, "applyScreen.water", false);
        let sewerage = get(state.screenConfiguration.preparedFinalObject, "applyScreen.sewerage", false);
        let tubewell = get(state.screenConfiguration.preparedFinalObject, "applyScreen.tubewell", false);
        let applicationType = get(
            state,
            "screenConfiguration.preparedFinalObject.applyScreen.waterApplicationType",
            ''
        );

        // check activity
        let activityType=  get(
            state,
            "screenConfiguration.preparedFinalObject.WaterConnection[0].activityType",
            ''
        );
        //const wnsStatus =  window.localStorage.getItem("WNS_STATUS");
        let wnsStatus =  window.localStorage.getItem("WNS_STATUS");
        let  ActionType = getQueryArg(window.location.href, "actionType");
        if(wnsStatus === null)
        {
        wnsStatus =ActionType;
        } 

        const wns_workflow =  window.localStorage.getItem("wns_workflow"); 
                if(wnsStatus){
                    activityType = wnsStatus
                }
                else
                {
                    if(wns_workflow){
                        activityType = wns_workflow
                    }
                }
        //
            if(water)
            {
            if(occupancycode && applicationType && category)
            {

                if(activityType ==='UPDATE_CONNECTION_HOLDER_INFO' || activityType ==='WS_RENAME')
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === "UPDATE_CONNECTION_HOLDER_INFO")
                }
                else if(activityType ==='TEMPORARY_DISCONNECTION' || activityType ==='WS_TEMP_DISCONNECTION')
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === "TEMPORARY_DISCONNECTION")
                }
                else if(activityType ==='CONNECTION_CONVERSION' || activityType ==='WS_CONVERSION')
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === "CONNECTION_CONVERSION")
                }
                else if(activityType ==='PERMANENT_DISCONNECTION' || activityType ==='WS_DISCONNECTION')
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === 'PERMANENT_DISCONNECTION')
                }
                else if(activityType ==='UPDATE_METER_INFO' || activityType ==='WS_METER_UPDATE' )
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === 'UPDATE_METER_INFO')
                }
                else if(activityType ==='APPLY_FOR_METER_TESTING' || activityType ==='WS_METER_TESTING' )
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === 'APPLY_FOR_METER_TESTING')
                }
                else if(activityType ==='REACTIVATE_CONNECTION' || activityType ==='WS_REACTIVATE' )
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === 'REACTIVATE_CONNECTION')
                }
                else if(activityType ==='NEW_WS_CONNECTION' 
                     || activityType ==='APPLY_FOR_TEMPORARY_REGULAR_CONNECTION' 
                     || activityType ==='APPLY_FOR_TEMPORARY_CONNECTION'
                     || activityType ==='APPLY_FOR_TEMPORARY_CONNECTION_BILLING'
                     || activityType ==='TEMPORARY_WSCONNECTION_BILLING'
                     || activityType ==='REGULARWSCONNECTION'
                     || activityType ==='TEMPORARY_WSCONNECTION'
                     || activityType === 'WS_TUBEWELL'
                     || activityType === 'WS_TEMP_TEMP'
                     || activityType === 'WS_TEMP_REGULAR'
                     || activityType === 'WS_DISCONNECTION'
                     || activityType === 'WS_TEMP_DISCONNECTION'
                     || activityType === 'WS_RENAME'
                     || activityType ==='WS_METER_UPDATE'
                     || activityType === 'WS_CONVERSION'
                     || activityType === 'WS_REACTIVATE'
                     || activityType ==='APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION')
                {
                    if(applicationType ==='TEMPORARY' &&( activityType ==='APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION' || activityType ==='WS_TEMP_TEMP'))
                    {
                        wsDocument = wsDocument.filter(x=>x.applicationType === applicationType 
                            && x.category === category)
                        // &&x.occupancycode === occupancycode)
                    }
                    else if(applicationType ==='TEMPORARY' &&( activityType ==='APPLY_FOR_TEMPORARY_REGULAR_CONNECTION' || activityType ==='WS_TEMP_REGULAR'))
                    {
                        // wsDocument = wsDocument.filter(x=>x.applicationType === applicationType 
                        //     && x.occupancycode === occupancycode)
                            // wsDocument = wsDocument.filter(x=>x.occupancycode === occupancycode)
                            wsDocument = wsDocument.filter(function (x) {
                                return x.applicationType === applicationType && x.category === category;
                            });
                    }
                    else if(applicationType ==='REGULAR' &&( activityType ==='APPLY_FOR_TEMPORARY_REGULAR_CONNECTION' || activityType ==='WS_TEMP_REGULAR'))
                    {
                        wsDocument = wsDocument.filter(x=>x.applicationType === applicationType 
                            && x.occupancycode === occupancycode)
                    } 
                    else if(applicationType ==='REGULAR' &&( activityType ==='NEW_WS_CONNECTION' || activityType ==='REGULARWSCONNECTION'))
                    {
                        wsDocument = wsDocument.filter(x=>x.applicationType === applicationType 
                            && x.occupancycode === occupancycode)
                    }
                    
                    else if(applicationType === 'TEMPORARY' || applicationType ==='TEMPORARY_BILLING')
                    {
                        if(activityType ==='UPDATE_METER_INFO' || activityType ==='WS_METER_UPDATE' )
                            {
                                wsDocument = wsDocument.filter(x=>x.WaterActivity === 'UPDATE_METER_INFO')
                            }
                            else if(activityType ==='APPLY_FOR_METER_TESTING' || activityType ==='WS_METER_TESTING' )
                            {
                                wsDocument = wsDocument.filter(x=>x.WaterActivity === 'APPLY_FOR_METER_TESTING')
                            }
                            else if(applicationType ==='TEMPORARY_BILLING')
                            {
                                wsDocument = wsDocument.filter(x=>x.applicationType === applicationType )
                                   // && x.category === category)

                            }
                            else{
                                wsDocument = wsDocument.filter(x=>x.applicationType === applicationType 
                                    && x.category === category)

                            }
                        // wsDocument = wsDocument.filter(function (x) {
                        //     return x.applicationType === applicationType && x.category === category;
                        // });

                    }
                    
                    else if(applicationType === 'REGULAR')
                    {
                        wsDocument = wsDocument.filter(function (x) {
                            return x.applicationType === applicationType && x.occupancycode === occupancycode;
                        });
                        
                    } 

                    
                }  
            }
            else{
                if(applicationType ==='REGULAR')
                {
                
                if(activityType ==='UPDATE_CONNECTION_HOLDER_INFO' || activityType ==='WS_RENAME')
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === "UPDATE_CONNECTION_HOLDER_INFO")
                }
                else if(activityType ==='TEMPORARY_DISCONNECTION' || activityType ==='WS_TEMP_DISCONNECTION')
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === "TEMPORARY_DISCONNECTION")
                }
                else if(activityType ==='CONNECTION_CONVERSION' || activityType ==='WS_CONVERSION')
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === "CONNECTION_CONVERSION")
                }
                else if(activityType ==='PERMANENT_DISCONNECTION' || activityType ==='WS_DISCONNECTION')
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === 'PERMANENT_DISCONNECTION')
                }
                else if(activityType ==='UPDATE_METER_INFO' || activityType ==='WS_METER_UPDATE' )
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === 'UPDATE_METER_INFO')
                }
                else if(activityType ==='APPLY_FOR_METER_TESTING' || activityType ==='WS_METER_TESTING' )
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === 'APPLY_FOR_METER_TESTING')
                }
                else if(activityType ==='REACTIVATE_CONNECTION' || activityType ==='WS_REACTIVATE' )
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === 'REACTIVATE_CONNECTION')
                }
                else if(activityType === 'REGULARWSCONNECTION')
                {
                    wsDocument = wsDocument.filter(function (x) {
                        return x.applicationType === applicationType && x.occupancycode === occupancycode;
                    });
                    
                } 
            }
            else if(applicationType ==='TEMPORARY' || applicationType ==='TEMPORARY_BILLING'){
                if(activityType ==='UPDATE_METER_INFO' || activityType ==='WS_METER_UPDATE' )
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === 'UPDATE_METER_INFO')
                }
                if(activityType ==='APPLY_FOR_METER_TESTING' || activityType ==='WS_METER_TESTING' )
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === 'APPLY_FOR_METER_TESTING')
                }
                if(activityType ==='UPDATE_CONNECTION_HOLDER_INFO' || activityType ==='WS_RENAME')
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === "UPDATE_CONNECTION_HOLDER_INFO")
                }
                else if(activityType ==='TEMPORARY_DISCONNECTION' || activityType ==='WS_TEMP_DISCONNECTION')
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === "TEMPORARY_DISCONNECTION")
                }
                else if(activityType ==='CONNECTION_CONVERSION' || activityType ==='WS_CONVERSION')
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === "CONNECTION_CONVERSION")
                }
                else if(activityType ==='PERMANENT_DISCONNECTION' || activityType ==='WS_DISCONNECTION')
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === 'PERMANENT_DISCONNECTION')
                }
                else if(activityType ==='UPDATE_METER_INFO' || activityType ==='WS_METER_UPDATE' )
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === 'UPDATE_METER_INFO')
                }
                else if(activityType ==='APPLY_FOR_METER_TESTING' || activityType ==='WS_METER_TESTING' )
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === 'APPLY_FOR_METER_TESTING')
                }
                else if(activityType ==='REACTIVATE_CONNECTION' || activityType ==='WS_REACTIVATE' )
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === 'REACTIVATE_CONNECTION')
                }
                else if(applicationType ==='TEMPORARY_BILLING')
                {
                    wsDocument = wsDocument.filter(x=>x.applicationType === applicationType )
                }
                else{
                    wsDocument = wsDocument.filter(x=>x.applicationType === applicationType 
                        && x.category === category)

                }
               

            }

            }
            }
            else if (sewerage)
            {
                /// logic for sewarage document
                wsDocument = wsDocument.filter(function (x) {
                    return x.WaterActivity === "SEWERAGE";
                });
            }
            else if (tubewell)
            {
                /// logic for sewarage document
                wsDocument = wsDocument.filter(x=>x.WaterActivity === 'NEW_TUBEWELL_CONNECTION')
            }
            if(sewerage === undefined && tubewell === undefined && water === undefined)
            {
                wsDocument = wsDocument.filter(x=>x.WaterActivity === activityType)
            }
            if( sewerage === false && tubewell === false && water === false)
            {
                if(applicationType ==='TEMPORARY' || applicationType ==='TEMPORARY_BILLING'){
                    if(activityType ==='UPDATE_METER_INFO' || activityType ==='WS_METER_UPDATE' )
                    {
                        wsDocument = wsDocument.filter(x=>x.WaterActivity === 'UPDATE_METER_INFO')
                    }
                    else if(activityType ==='APPLY_FOR_METER_TESTING' || activityType ==='WS_METER_TESTING' )
                    {
                        wsDocument = wsDocument.filter(x=>x.WaterActivity === 'APPLY_FOR_METER_TESTING')
                    }
                    else if(applicationType ==='TEMPORARY_BILLING' 
                    && (activityType === 'CONNECTION_CONVERSION'
                        || activityType ==='PERMANENT_DISCONNECTION'
                        || activityType ==='TEMPORARY_DISCONNECTION'
                        || activityType ==='REACTIVATE_CONNECTION'
                        || activityType ==='UPDATE_CONNECTION_HOLDER_INFO') )
                    {
                        wsDocument = wsDocument.filter(x=>x.WaterActivity === activityType )
                    }
                    else if(applicationType ==='TEMPORARY_BILLING')
                    {
                        wsDocument = wsDocument.filter(x=>x.applicationType === applicationType )
                    }
                    else{
                        wsDocument = wsDocument.filter(x=>x.applicationType === applicationType 
                            && x.category === category)
    
                    }
    
                }
                else
                wsDocument = wsDocument.filter(x=>x.WaterActivity === activityType)
            }
            if(wsDocument && wsDocument[0])
                        documents = wsDocument[0].document;
        

      }
 if(documents !== undefined)
 {
    documents = documents.filter(item => {
        return item.active;
    });

    // add document type upload if applicationStatus is  PENDING_ROADCUT_NOC_BY_CITIZEN-- start
    let applicationStatus=  get(
        state,
        "screenConfiguration.preparedFinalObject.WaterConnection[0].applicationStatus",
        ''
    );
    let sewerage_ = get(state.screenConfiguration.preparedFinalObject, "applyScreen.sewerage", false);
    if(sewerage_)
            {
                applicationStatus=  get(
                    state,
                    "screenConfiguration.preparedFinalObject.SewerageConnection[0].applicationStatus",
                    ''
                );
            }
    let activityType=  get(
        state,
        "screenConfiguration.preparedFinalObject.WaterConnection[0].activityType",
        ''
    );
    if(sewerage_)
            {
                activityType= 'SW_SEWERAGE'
            }
    if(applicationStatus ==='PENDING_ROADCUT_NOC_BY_CITIZEN')
    {

        let duplicatedoc = documents.filter(x=>x.code === `${activityType}_ROADCUT_NOC`)
        if(duplicatedoc !== undefined)
        {
        if(duplicatedoc && duplicatedoc.length == 0)
        {
        documents.push(
            {
                name:'Road cut NOC document',
                code:`${activityType}_ROADCUT_NOC`,
                isMandatory:true,
                active:true
            }
        )
        }
        }
        else{
            documents.push(
                {
                    name:'Road cut NOC document',
                    code:`${activityType}_ROADCUT_NOC`,
                    isMandatory:true,
                    active:true
                }
            )

        }
    }

    //end
    let documentsContract = [];
    let tempDoc = {};
    documents.forEach(doc => {
        let card = {};
        card["code"] = doc.code;
        card["title"] = doc.code;
        card["cards"] = [];
        tempDoc[doc.code] = card;
    });

    documents.forEach(doc => {
        // Handle the case for multiple muildings
        let card = {};
        card["name"] = doc.code;
        card["code"] = doc.code;
        card["required"] = doc.isMandatory ? true : false;
        if (doc.hasDropdown && doc.dropdownData) {
            let dropdown = {};
            dropdown.label = "WS_SELECT_DOC_DD_LABEL";
            dropdown.required = true;
            dropdown.menu = doc.dropdownData.filter(item => {
                return item.active;
            });
            dropdown.menu = dropdown.menu.map(item => {
                return { code: item.code, label: getTransformedLocale(item.code) };
            });
            card["dropdown"] = dropdown;
        }
        tempDoc[doc.code].cards.push(card);
    });

    Object.keys(tempDoc).forEach(key => {
        documentsContract.push(tempDoc[key]);
    });

    dispatch(prepareFinalObject("documentsContract", documentsContract));
}
};

const parserFunction = (state) => {
    let queryObject = JSON.parse(JSON.stringify(get(state.screenConfiguration.preparedFinalObject, "applyScreen", {})));
    let usageCategory ='SW_TEMP'
    let usageSubCategory =null
    let id = null
    let isFerruleApplicable = get(queryObject.waterApplication, "isFerruleApplicable",true);
    // if(queryObject.waterApplication && queryObject.waterApplication!== undefined)
    // {
    //     if (queryObject.waterApplication.applicationStatus !== 'PENDING_FOR_SECURITY_DEPOSIT') {
    //         isFerruleApplicable = isFerruleApplicable;
    //     }
    // }
    // else{
    //     isFerruleApplicable = isFerruleApplicable;
    // }
    if(queryObject.water === undefined)
    {
        if(queryObject.applicationNo.includes("WS"))
        {
            set(queryObject,'water', true)
        }

    }
    if(queryObject.water)
    {
        if(queryObject.waterProperty.id)
        {
            id = queryObject.waterProperty.id
        }
        
        else{
            id =  get(state.screenConfiguration.preparedFinalObject, "WaterConnection[0].waterProperty.id", null)
        }
        usageCategory =(queryObject.waterProperty.usageCategory === null || queryObject.waterProperty.usageCategory === "NA") ? "" : queryObject.waterProperty.usageCategory
        usageSubCategory = (queryObject.waterProperty.usageSubCategory === null || queryObject.waterProperty.usageSubCategory === "NA") ? "" : queryObject.waterProperty.usageSubCategory

    }
    if(queryObject.sewerage ===undefined && queryObject.water === undefined  && queryObject.tubewell === undefined)
    {
        if (queryObject.waterProperty.usageCategory) {
            usageCategory = queryObject.waterProperty.usageCategory;
        }
    }

    let parsedObject = {
        roadCuttingArea: parseInt(queryObject.roadCuttingArea),
        meterInstallationDate: convertDateToEpoch(queryObject.meterInstallationDate),
        connectionExecutionDate: convertDateToEpoch(queryObject.connectionExecutionDate),
        proposedWaterClosets: parseInt(queryObject.proposedWaterClosets),
        proposedToilets: parseInt(queryObject.proposedToilets),
        noOfTaps: parseInt(queryObject.noOfTaps),
        isFerruleApplicable:isFerruleApplicable,
        noOfWaterClosets: parseInt(queryObject.noOfWaterClosets),
        noOfToilets: parseInt(queryObject.noOfToilets),
       // proposedTaps: parseInt(queryObject.proposedTaps),        
        waterApplicationType: (queryObject.waterApplicationType === null || queryObject.waterApplicationType === "NA") ? "" : queryObject.waterApplicationType,
        waterProperty :{
        //id : get(state.screenConfiguration.preparedFinalObject, "Properties.id", null),
        id : id,

        usageCategory: usageCategory,// (queryObject.waterProperty.usageCategory === null || queryObject.waterProperty.usageCategory === "NA") ? "" : queryObject.waterProperty.usageCategory,
        usageSubCategory:usageSubCategory// (queryObject.waterProperty.usageSubCategory === null || queryObject.waterProperty.usageSubCategory === "NA") ? "" : queryObject.waterProperty.usageSubCategory
        },
        swProperty :{
           // id : get(state.screenConfiguration.preparedFinalObject, "Properties.id", null),
           // SW_TEMP
            id : id,//get(state.screenConfiguration.preparedFinalObject, "WaterConnection[0].waterProperty.id", null),
            usageCategory: usageCategory,
            usageSubCategory: usageSubCategory,           
            },
        securityCharge:(queryObject.securityCharge === null || queryObject.securityCharge === "NA") ? "" : parseFloat(queryObject.securityCharge),
        
        propertyId: (queryObject.property)?queryObject.property.id:null,
        additionalDetails: {
            initialMeterReading: (
                queryObject.additionalDetails !== undefined &&
                queryObject.additionalDetails.initialMeterReading !== undefined
            ) ? parseFloat(queryObject.additionalDetails.initialMeterReading) : null,
            detailsProvidedBy: (
                queryObject.additionalDetails !== undefined &&
                queryObject.additionalDetails.detailsProvidedBy !== undefined &&
                queryObject.additionalDetails.detailsProvidedBy !== null
            ) ? queryObject.additionalDetails.detailsProvidedBy : "",
        }
    }
    queryObject = { ...queryObject, ...parsedObject }
    return queryObject;
}

export const prepareDocumentsUploadRedux = async (state, dispatch) => {
    const { documentsUploadRedux } = state.screenConfiguration.preparedFinalObject;
    let documentsList = get(state, "screenConfiguration.preparedFinalObject.documentsContract", []);
    let index = 0;
    documentsList.forEach(docType => {
        docType.cards &&
            docType.cards.forEach(card => {
                if (card.subCards) {
                    card.subCards.forEach(subCard => {
                        let oldDocType = get(
                            documentsUploadRedux,
                            `[${index}].documentType`
                        );
                        let oldDocCode = get(
                            documentsUploadRedux,
                            `[${index}].documentCode`
                        );
                        let oldDocSubCode = get(
                            documentsUploadRedux,
                            `[${index}].documentSubCode`
                        );
                        if (
                            oldDocType != docType.code ||
                            oldDocCode != card.name ||
                            oldDocSubCode != subCard.name
                        ) {
                            documentsUploadRedux[index] = {
                                documentType: docType.code,
                                documentCode: card.name,
                                documentSubCode: subCard.name
                            };
                        }
                        index++;
                    });
                } else {
                    let oldDocType = get(documentsUploadRedux, `[${index}].documentType`);
                    let oldDocCode = get(documentsUploadRedux, `[${index}].documentCode`);
                    if (oldDocType != docType.code || oldDocCode != card.name) {
                        documentsUploadRedux[index] = {
                            documentType: docType.code,
                            documentCode: card.name,
                            isDocumentRequired: card.required,
                            isDocumentTypeRequired: card.dropdown
                                ? card.dropdown.required
                                : false
                        };
                    }
                }
                index++;
            });
    });
    prepareFinalObject("documentsUploadRedux", documentsUploadRedux);
};

export const setDocsForEditFlow = async (state) => {
    const applicationDocuments = get(state.screenConfiguration.preparedFinalObject, "applyScreen.documents", []);
    let uploadedDocuments = {};
    let fileStoreIds = applicationDocuments && applicationDocuments.map(item => item.fileStoreId).join(",");
    const fileUrlPayload = fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
    if (fileUrlPayload !== undefined && fileUrlPayload !== null) {
        applicationDocuments && applicationDocuments.forEach((item, index) => {
            uploadedDocuments[index] = [{
                fileName: (fileUrlPayload && fileUrlPayload[item.fileStoreId] &&
                    decodeURIComponent(
                        getFileUrl(fileUrlPayload[item.fileStoreId])
                            .split("?")[0]
                            .split("/")
                            .pop()
                            .slice(13)
                    )) || `Document - ${index + 1}`,
                fileStoreId: item.fileStoreId,
                fileUrl: Object.values(fileUrlPayload)[index]
            }];
        });
    }
    return uploadedDocuments;
};

export const setWSDocuments = async (payload, sourceJsonPath, businessService) => {
    const uploadedDocData = get(payload, sourceJsonPath);
    if (uploadedDocData !== "NA" && uploadedDocData.length > 0) {
        const fileStoreIds =
            uploadedDocData &&
            uploadedDocData
                .map((item) => {
                    return item.fileStoreId;
                })
                .join(",");
        const fileUrlPayload = fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
        const reviewDocData =
            uploadedDocData &&
            uploadedDocData.map((item, index) => {
                return {
                    title: `${businessService}_${item.documentType}`.replace(".", "_") || "",
                    link: (fileUrlPayload && fileUrlPayload[item.fileStoreId] && getFileUrl(fileUrlPayload[item.fileStoreId])) || "",
                    linkText: "View",
                    name:
                        (fileUrlPayload &&
                            fileUrlPayload[item.fileStoreId] &&
                            decodeURIComponent(
                                getFileUrl(fileUrlPayload[item.fileStoreId])
                                    .split("?")[0]
                                    .split("/")
                                    .pop()
                                    .slice(13)
                            )) ||
                        `Document - ${index + 1}`,
                };
            });
        return reviewDocData;
    }
};

export const downloadAndPrintForNonApply = async (state, dispatch) => {
    let documentPath;
    const {
        WaterConnection,
        SewerageConnection
    } = state.screenConfiguration.preparedFinalObject;
    if (
        (WaterConnection.length > 0 &&
            SewerageConnection.length > 0) ||
        WaterConnection.length > 0
    ) {
        documentPath = 'WaterConnection[0].documents';
    } else if (SewerageConnection.length > 0) {
        documentPath = 'SewerageConnection[0].documents';
    }
    await setDocuments(
        state.screenConfiguration.preparedFinalObject,
        documentPath,
        "DocumentsData",
        dispatch,
       // "WS"
    );
}

export const prepareDocUploadRedux = async (state, dispatch) => {
    let documentsUploadRedux = {}, uploadedDocs = [];
    let payload = state.screenConfiguration.preparedFinalObject;
    let documentPath;
    const {
        WaterConnection,
        SewerageConnection
    } = state.screenConfiguration.preparedFinalObject;
    if (
        (
            WaterConnection !== undefined &&
            WaterConnection.length > 0 &&
            SewerageConnection !== undefined &&
            SewerageConnection.length > 0
        ) ||
        (
            WaterConnection !== undefined &&
            WaterConnection.length > 0
        )
    ) {
        documentPath = payload.WaterConnection[0].documents;
        uploadedDocs = await setWSDocuments(state.screenConfiguration.preparedFinalObject, "WaterConnection[0].documents", "WS");
    } else if (SewerageConnection !== undefined && SewerageConnection.length > 0) {
        documentPath = payload.SewerageConnection[0].documents;
        uploadedDocs = await setWSDocuments(state.screenConfiguration.preparedFinalObject, "SewerageConnection[0].documents", "WS");
    }
    if (uploadedDocs !== undefined && uploadedDocs !== null && uploadedDocs.length > 0) {
        documentsUploadRedux = uploadedDocs && uploadedDocs.length && uploadedDocs.map((item, key) => {
            let docUploadRedux = {};
            docUploadRedux[key] = { documents: [{ fileName: item.name, fileUrl: item.link, fileStoreId: documentPath[key].fileStoreId }] };
            let splittedString = documentPath[key].documentType.split(".");
            if (splittedString[1] === "ADDRESSPROOF") { docUploadRedux[key].dropdown = { value: splittedString.join(".") }; }
            else if (splittedString[1] === "IDENTITYPROOF") { docUploadRedux[key].dropdown = { value: splittedString.join(".") }; }
            else { docUploadRedux[key].documentType = documentPath[key].documentType; }
            docUploadRedux[key].id = documentPath[key].id;
            docUploadRedux[key].isDocumentRequired = true;
            docUploadRedux[key].isDocumentTypeRequired = true;
            return docUploadRedux;
        });
        let docs = {};
        for (let i = 0; i < documentsUploadRedux.length; i++) {
            docs[i] = documentsUploadRedux[i][i];
        }
        dispatch(prepareFinalObject("documentsUploadRedux", docs))
    }
};

export const prefillDocuments = async (payload, destJsonPath, dispatch) => {
    let documentsUploadRedux = {};
    // const uploadedDocData = get(payload, sourceJsonPath);
    let uploadedDocs = await setWSDocuments(payload, "applyScreen.documents", "WS");
    if (uploadedDocs !== undefined && uploadedDocs !== null && uploadedDocs.length > 0) {
        documentsUploadRedux = uploadedDocs && uploadedDocs.length && uploadedDocs.map((item, key) => {
            let docUploadRedux = {};
            docUploadRedux[key] = { documents: [{ fileName: item.name, fileUrl: item.link, fileStoreId: payload.applyScreen.documents[key].fileStoreId }] };
            let splittedString = payload.applyScreen.documents[key].documentType.split(".");
            if (splittedString[1] === "ADDRESSPROOF") { docUploadRedux[key].dropdown = { value: splittedString.join(".") }; }
            else if (splittedString[1] === "IDENTITYPROOF") { docUploadRedux[key].dropdown = { value: splittedString.join(".") }; }
            else { 
                docUploadRedux[key].dropdown = { value: payload.applyScreen.documents[key].documentType }; 
            }
            docUploadRedux[key].documentType = payload.applyScreen.documents[key].documentType;
            docUploadRedux[key].id = payload.applyScreen.documents[key].id;
            docUploadRedux[key].isDocumentRequired = true;
            docUploadRedux[key].isDocumentTypeRequired = true;
            return docUploadRedux;
        });
        let docs = {};
        for (let i = 0; i < documentsUploadRedux.length; i++) {
            docs[i] = documentsUploadRedux[i][i];
        }

        var tempDoc = {},docType="";
        var dList = null
        if(payload.applyScreenMdmsData['ws-services-masters']!== undefined)
         payload.applyScreenMdmsData['ws-services-masters'].Documents;
        // impliment new document 
                // fiter baed on occupancycode (Property Sub Usage Type),category(Uses Caregory) and applicationType(Application Type) 
                let occupancycode = get(
                    payload,
                    "applyScreen.property.usageCategory",
                    ''
                );
                let category = get(
                    payload,
                    "applyScreen.waterProperty.usageSubCategory",
                    ''
                );
                let applicationType = get(
                    payload,
                    "applyScreen.waterApplicationType",
                    ''
                );
                let subusageCategory = get(
                    payload,
                    "applyScreen.property.subusageCategory",
                    ''
                );
                if(occupancycode !== undefined && occupancycode != null)
                {
                if(occupancycode.split('.').length != 2)
                {
                    occupancycode = subusageCategory;
        
                }
            }
                let documents = '';
                let wsDocument ='';
                if(payload.applyScreenMdmsData['ws-services-masters']!== undefined)
                wsDocument = payload.applyScreenMdmsData['ws-services-masters'].wsDocument; 
                else{
                    if(localStorage.getItem("WNS_STATUS")){
                        window.localStorage.removeItem("WNS_STATUS");
                    }

                }
                // let subusageCategory = get(
                //     payload,
                //     "applyScreen.property.subusageCategory",
                //     ''
                // );
                let water = get(payload, "applyScreen.water", false);
                let sewerage = get(payload, "applyScreen.sewerage", false);
                let tubewell = get(payload, "applyScreen.tubewell", false); 
                // check activity
                let activityType=  get(
                    payload,
                    "WaterConnection[0].activityType",
                    ''
                );
               // const wnsStatus =  window.localStorage.getItem("WNS_STATUS"); 
                let wnsStatus =  window.localStorage.getItem("WNS_STATUS");
                let  ActionType = getQueryArg(window.location.href, "actionType");
                if(wnsStatus === null)
                {
                wnsStatus =ActionType;
                }
                const wns_workflow =  window.localStorage.getItem("wns_workflow"); 
                if(wnsStatus){
                    activityType = wnsStatus
                }
                else
                {
                    if(wns_workflow){
                        activityType = wns_workflow
                    }
                }
                //
            if(water)
            {
            if(occupancycode && applicationType && category)
            {
                
                console.log(activityType);
                if(activityType ==='UPDATE_CONNECTION_HOLDER_INFO' || activityType ==='WS_RENAME')
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === "UPDATE_CONNECTION_HOLDER_INFO")
                }
                else if(activityType ==='TEMPORARY_DISCONNECTION' || activityType ==='WS_TEMP_DISCONNECTION')
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === "TEMPORARY_DISCONNECTION")
                }
                else if(activityType ==='CONNECTION_CONVERSION' || activityType ==='WS_CONVERSION')
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === "CONNECTION_CONVERSION")
                }
                else if(activityType ==='PERMANENT_DISCONNECTION' || activityType ==='WS_DISCONNECTION')
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === 'PERMANENT_DISCONNECTION')
                }
                else if(activityType ==='UPDATE_METER_INFO' || activityType ==='WS_METER_UPDATE' )
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === 'UPDATE_METER_INFO')
                }
                else if(activityType ==='APPLY_FOR_METER_TESTING' || activityType ==='WS_METER_TESTING' )
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === 'APPLY_FOR_METER_TESTING')
                }
                else if(activityType ==='REACTIVATE_CONNECTION' || activityType ==='WS_REACTIVATE' )
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === 'REACTIVATE_CONNECTION')
                }
                else if(activityType ==='TEMPORARY_WSCONNECTION_BILLING' )
                {
                    wsDocument = wsDocument.filter(x=>x.applicationType === applicationType )
                }
                else if(activityType ==='NEW_WS_CONNECTION' 
                     || activityType ==='APPLY_FOR_TEMPORARY_REGULAR_CONNECTION' 
                     || activityType ==='APPLY_FOR_TEMPORARY_CONNECTION'
                     || activityType ==='APPLY_FOR_TEMPORARY_CONNECTION_BILLING'
                     || activityType ==='TEMPORARY_WSCONNECTION_BILLING'
                     || activityType ==='REGULARWSCONNECTION'
                     || activityType ==='TEMPORARY_WSCONNECTION'
                     || activityType === 'WS_TUBEWELL'
                     || activityType === 'WS_TEMP_TEMP'
                     || activityType === 'WS_TEMP_REGULAR'
                     || activityType === 'WS_DISCONNECTION'
                     || activityType === 'WS_TEMP_DISCONNECTION'
                     || activityType === 'WS_RENAME'
                     || activityType === 'WS_METER_UPDATE'
                     || activityType === 'WS_CONVERSION'
                     || activityType === 'WS_REACTIVATE'
                     || activityType ==='APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION')
                {
                    if(applicationType ==='TEMPORARY' && ( activityType ==='APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION' || activityType ==='WS_TEMP_TEMP'))
                    {
                        wsDocument = wsDocument.filter(x=>x.applicationType === applicationType 
                            && x.category === category)
                        // &&x.occupancycode === occupancycode)
                    }
                    else if(applicationType ==='TEMPORARY' && ( activityType ==='APPLY_FOR_TEMPORARY_REGULAR_CONNECTION' || activityType ==='WS_TEMP_REGULAR'))
                    {
                        // // wsDocument = wsDocument.filter(x=>x.applicationType === applicationType 
                        // //     && x.occupancycode === occupancycode)
                        // wsDocument = wsDocument.filter(x=>x.occupancycode === occupancycode)
                        wsDocument = wsDocument.filter(function (x) {
                            return x.applicationType === applicationType && x.category === category;
                        });
                    }
                    else if(applicationType ==='REGULAR' || activityType ==='APPLY_FOR_TEMPORARY_REGULAR_CONNECTION' || activityType ==='WS_TEMP_REGULAR')
                    {
                        wsDocument = wsDocument.filter(x=>x.applicationType === applicationType 
                            && x.occupancycode === occupancycode)
                    } 
                    else if(applicationType ==='REGULAR' &&( activityType ==='NEW_WS_CONNECTION' || activityType ==='REGULARWSCONNECTION'))
                    {
                        wsDocument = wsDocument.filter(x=>x.applicationType === applicationType 
                            && x.occupancycode === occupancycode)
                    } 
                    else if(applicationType === 'TEMPORARY' || applicationType ==='TEMPORARY_BILLING')
                    {
                        if(activityType ==='UPDATE_METER_INFO' || activityType ==='WS_METER_UPDATE' )
                            {
                                wsDocument = wsDocument.filter(x=>x.WaterActivity === 'UPDATE_METER_INFO')
                            }
                            else if(activityType ==='APPLY_FOR_METER_TESTING' || activityType ==='WS_METER_TESTING' )
                            {
                                wsDocument = wsDocument.filter(x=>x.WaterActivity === 'APPLY_FOR_METER_TESTING')
                            }
                            else if(applicationType ==='TEMPORARY_BILLING' 
                            && (activityType === 'CONNECTION_CONVERSION'
                                || activityType ==='PERMANENT_DISCONNECTION'
                                || activityType ==='TEMPORARY_DISCONNECTION'
                                || activityType ==='REACTIVATE_CONNECTION'
                                || activityType ==='UPDATE_CONNECTION_HOLDER_INFO') )
                            {
                                wsDocument = wsDocument.filter(x=>x.WaterActivity === activityType )
                            }
                            else if(applicationType ==='TEMPORARY_BILLING')
                            {
                                wsDocument = wsDocument.filter(x=>x.applicationType === applicationType )
                                   // && x.category === category)

                            }
                            else{
                                wsDocument = wsDocument.filter(x=>x.applicationType === applicationType 
                                    && x.category === category)

                            }
                        // wsDocument = wsDocument.filter(function (x) {
                        //     return x.applicationType === applicationType && x.category === category;
                        // });

                    }
                    else if(applicationType === 'REGULAR')
                    {
                        wsDocument = wsDocument.filter(function (x) {
                            return x.applicationType === applicationType && x.occupancycode === occupancycode;
                        });
                        
                    }
                }  
            }
            else{
                if(applicationType ==='REGULAR' || applicationType ==='TEMPORARY_BILLING')
                {
                
                if(activityType ==='UPDATE_CONNECTION_HOLDER_INFO' || activityType ==='WS_RENAME')
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === "UPDATE_CONNECTION_HOLDER_INFO")
                }
                else if(activityType ==='TEMPORARY_DISCONNECTION' || activityType ==='WS_TEMP_DISCONNECTION')
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === "TEMPORARY_DISCONNECTION")
                }
                else if(activityType ==='CONNECTION_CONVERSION' || activityType ==='WS_CONVERSION')
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === "CONNECTION_CONVERSION")
                }
                else if(activityType ==='PERMANENT_DISCONNECTION' || activityType ==='WS_DISCONNECTION')
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === 'PERMANENT_DISCONNECTION')
                }
                else if(activityType ==='UPDATE_METER_INFO' || activityType ==='WS_METER_UPDATE' )
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === 'UPDATE_METER_INFO')
                }
                else if(activityType ==='APPLY_FOR_METER_TESTING' || activityType ==='WS_METER_TESTING' )
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === 'APPLY_FOR_METER_TESTING')
                }
                else if(activityType ==='REACTIVATE_CONNECTION' || activityType ==='WS_REACTIVATE' )
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === 'REACTIVATE_CONNECTION')
                }
                else if(activityType === 'REGULARWSCONNECTION')
                {
                    wsDocument = wsDocument.filter(function (x) {
                        return x.applicationType === applicationType && x.occupancycode === occupancycode;
                    });
                    
                } 
                else if(activityType ==='TEMPORARY_WSCONNECTION_BILLING' )
                {
                    wsDocument = wsDocument.filter(x=>x.applicationType === applicationType )
                }
            }
            else if(applicationType ==='TEMPORARY'|| applicationType ==='TEMPORARY_BILLING' ){
                if(activityType ==='UPDATE_METER_INFO' || activityType ==='WS_METER_UPDATE' )
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === 'UPDATE_METER_INFO')
                }
                if(activityType ==='APPLY_FOR_METER_TESTING' || activityType ==='WS_METER_TESTING' )
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === 'APPLY_FOR_METER_TESTING')
                }
                if(activityType ==='UPDATE_CONNECTION_HOLDER_INFO' || activityType ==='WS_RENAME')
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === "UPDATE_CONNECTION_HOLDER_INFO")
                }
                else if(activityType ==='TEMPORARY_DISCONNECTION' || activityType ==='WS_TEMP_DISCONNECTION')
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === "TEMPORARY_DISCONNECTION")
                }
                else if(activityType ==='CONNECTION_CONVERSION' || activityType ==='WS_CONVERSION')
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === "CONNECTION_CONVERSION")
                }
                else if(activityType ==='PERMANENT_DISCONNECTION' || activityType ==='WS_DISCONNECTION')
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === 'PERMANENT_DISCONNECTION')
                }
                else if(activityType ==='UPDATE_METER_INFO' || activityType ==='WS_METER_UPDATE' )
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === 'UPDATE_METER_INFO')
                }
                else if(activityType ==='APPLY_FOR_METER_TESTING' || activityType ==='WS_METER_TESTING' )
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === 'APPLY_FOR_METER_TESTING')
                }
                else if(activityType ==='REACTIVATE_CONNECTION' || activityType ==='WS_REACTIVATE' )
                {
                    wsDocument = wsDocument.filter(x=>x.WaterActivity === 'REACTIVATE_CONNECTION')
                }
                else if(applicationType ==='TEMPORARY_BILLING')
                {
                    wsDocument = wsDocument.filter(x=>x.applicationType === applicationType )
                }
                else{
                    wsDocument = wsDocument.filter(x=>x.applicationType === applicationType 
                        && x.category === category)

                }
                // wsDocument = wsDocument.filter(x=>x.applicationType === applicationType 
                //     && x.category === category)

            }

            }
            }
            else if (sewerage)
            {
               /// logic for sewarage document
               wsDocument = wsDocument.filter(function (x) {
                return x.WaterActivity === "SEWERAGE";
            });
            }
            else if (tubewell)
            {
                /// logic for sewarage document
                wsDocument = wsDocument.filter(x=>x.WaterActivity === 'NEW_TUBEWELL_CONNECTION')
            }
            if(sewerage === undefined && tubewell === undefined && water === undefined)
            {
                wsDocument = wsDocument.filter(x=>x.WaterActivity === activityType)
            }
            if(sewerage === false && tubewell === false && water === false)
            {
                if(applicationType ==='TEMPORARY'){
                    wsDocument = wsDocument.filter(x=>x.applicationType === applicationType 
                        && x.category === category)
    
                }
                // else if(applicationType ==='REGULAR'){
                //     wsDocument = wsDocument.filter(x=>x.applicationType === applicationType 
                //         && x.occupancycode === occupancycode)
    
                // }
                else
                wsDocument = wsDocument.filter(x=>x.WaterActivity === activityType)
            }
                
                if(wsDocument && wsDocument[0])
                    dList = wsDocument[0].document;

                        // add document type upload if applicationStatus is  PENDING_ROADCUT_NOC_BY_CITIZEN-- start
    let applicationStatus=  get(payload, "WaterConnection[0].applicationStatus",'');
    let activityType_=  get(payload, "WaterConnection[0].activityType",'');
   // let sewerage = get(payload, "applyScreen.sewerage", false);
   if(sewerage)
   {
    applicationStatus = get(payload, "SewerageConnection[0].applicationStatus",'');
    activityType_ = 'SW_SEWERAGE'

   }
    
    if(applicationStatus ==='PENDING_ROADCUT_NOC_BY_CITIZEN')
    {
        let duplicatedoc = dList.filter(x=>x.code === `${activityType}_ROADCUT_NOC`)
        if(duplicatedoc !== undefined)
        {
        if(duplicatedoc && duplicatedoc.length == 0)
        {
        dList.push(
            {
                name:'Road cut NOC document',
                code:`${activityType_}_ROADCUT_NOC`,
                isMandatory:true,
                active:true
            }
        )
        }
    }
    else{
        dList.push(
            {
                name:'Road cut NOC document',
                code:`${activityType_}_ROADCUT_NOC`,
                isMandatory:true,
                active:true
            }
        )

    }
    }
        if(dList !== undefined && dList !==null){
            for(var i=0;i<dList.length;i++){
                for(var key in docs){
                    docType = docs[key].documentType
                    if(dList[i].code === docType.substring(0,docType.lastIndexOf("."))){
                        tempDoc[i] = docs[key];
                    }else if(dList[i].code === docType){
                        tempDoc[i] = docs[key];
                    }
                }
            }
        }else{
            tempDoc = docs;  
        }

        dispatch(prepareFinalObject("documentsUploadRedux", tempDoc));
        dispatch(prepareFinalObject(destJsonPath, tempDoc));
    }
};

export const applyForWaterOrSewerage = async (state, dispatch) => {
   // let queryObject = parserFunction(state);
   // let queryObject = parserFunction(state);
    if (get(state, "screenConfiguration.preparedFinalObject.applyScreen.water") && get(state, "screenConfiguration.preparedFinalObject.applyScreen.sewerage")) {
        let response = await applyForBothWaterAndSewerage(state, dispatch);
        return response;
    }
    else if (get(state, "screenConfiguration.preparedFinalObject.applyScreen.tubewell") && get(state, "screenConfiguration.preparedFinalObject.applyScreen.sewerage")){
        let response = await applyForBothWaterAndSewerage(state, dispatch);
        return response;
    }
     else if (get(state.screenConfiguration.preparedFinalObject, "applyScreen.sewerage")) {
        let response = await applyForSewerage(state, dispatch);
        return response;
    } else {
        let response = await applyForWater(state, dispatch);
        return response;
    }
}

export const applyForWater = async (state, dispatch) => {
    let queryObject = parserFunction(state);
    let waterId = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].id");
    let doorNo = get(state, "screenConfiguration.preparedFinalObject.applyScreen.property.address.doorNo");
    let method = waterId ? "UPDATE" : "CREATE";
    try {
        const tenantId = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].property.tenantId");
        let response;
        queryObject.tenantId = (queryObject && queryObject.property && queryObject.property.tenantId)?queryObject.property.tenantId:null;
        if (method === "UPDATE") {
            queryObject.additionalDetails.appCreatedDate = get(
                state.screenConfiguration.preparedFinalObject,
                "WaterConnection[0].additionalDetails.appCreatedDate"
            )
            let queryObjectForUpdate = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0]");                                  
            set(queryObjectForUpdate, "tenantId", queryObject.tenantId);
            queryObjectForUpdate = { ...queryObjectForUpdate, ...queryObject }
            set(queryObjectForUpdate, "processInstance.action", "SUBMIT_APPLICATION");
            // need to add status from the localstorage here for the status and remove the local storage
           // const wnsStatus =  window.localStorage.getItem("WNS_STATUS"); 
            let wnsStatus =  window.localStorage.getItem("WNS_STATUS");
            let  ActionType = getQueryArg(window.location.href, "actionType");
            if(wnsStatus === null)
            {
              wnsStatus =ActionType;
            }

            if(wnsStatus){
              switch(wnsStatus){
                case "UPDATE_CONNECTION_HOLDER_INFO" :   dispatch(prepareFinalObject("WaterConnection[0].activityType", "UPDATE_CONNECTION_HOLDER_INFO")); break;
                case "REACTIVATE_CONNECTION":  dispatch(prepareFinalObject("WaterConnection[0].activityType", "REACTIVATE_CONNECTION")); break;
                case "TEMPORARY_DISCONNECTION":  dispatch(prepareFinalObject("WaterConnection[0].activityType", "TEMPORARY_DISCONNECTION")); break;
                case "APPLY_FOR_REGULAR_INFO":  dispatch(prepareFinalObject("WaterConnection[0].activityType", "APPLY_FOR_REGULAR_INFO")); break;
                case "PERMANENT_DISCONNECTION":  dispatch(prepareFinalObject("WaterConnection[0].activityType", "PERMANENT_DISCONNECTION")); break;
                case "CONNECTION_CONVERSION":  dispatch(prepareFinalObject("WaterConnection[0].activityType", "CONNECTION_CONVERSION")); break;
                case "APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION":  dispatch(prepareFinalObject("WaterConnection[0].activityType", "APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION")); break;
                case "APPLY_FOR_TEMPORARY_REGULAR_CONNECTION":  dispatch(prepareFinalObject("WaterConnection[0].activityType", "APPLY_FOR_TEMPORARY_REGULAR_CONNECTION")); break;
                case "UPDATE_METER_INFO":  dispatch(prepareFinalObject("WaterConnection[0].activityType", "UPDATE_METER_INFO")); break;
                case "APPLY_FOR_METER_TESTING":  dispatch(prepareFinalObject("WaterConnection[0].activityType", "APPLY_FOR_METER_TESTING")); break;
              }
              let activeStep = get(state.screenConfiguration.screenConfig["apply"], "components.div.children.stepper.props.activeStep", 0);
              if(activeStep === 0)
              {
                set(queryObjectForUpdate, "processInstance.action", "INITIATE"); 
                set(queryObjectForUpdate, "waterApplication", null);
              }
              else{
                set(queryObjectForUpdate, "processInstance.action", "SUBMIT_APPLICATION");
                //set workflow_id in connection holder 
                if(wnsStatus)
                {
                    let connectionHolders = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].connectionHolders",[]);
                    let waterApplicationList = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].waterApplicationList",[]);
                    if(waterApplicationList)
                    {                        
                       // waterApplicationList = waterApplicationList.filter(x=>x.applicationNo === applicationNo)
                        waterId = waterApplicationList[0].id
                        waterApplicationList = waterApplicationList.sort((a, b) => (a.auditDetails.lastModifiedTime > b.auditDetails.lastModifiedTime ? -1 : 1));
                        waterId = waterApplicationList[0].id
                        //WaterConnection[0].activityType = waterApplicationList_[0].activityType
                    }
                    
                    for (let index = 0; index < connectionHolders.length; index++) {
                        const element = connectionHolders[index];
                        if(element.status==='ACTIVE')
                        {
                            set(queryObjectForUpdate, `connectionHolders[${index}].ws_application_id`, waterId);
                        }
                        
                    }
                    

                }
                else
                {
                    let waterApplication = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].waterApplication");
                    if(waterApplication)
                    {
                        set(queryObjectForUpdate, "connectionHolders[0].ws_application_id", waterApplication.id);
                    }
                    

                }
              }             
              
              set(queryObjectForUpdate, "activityType", wnsStatus);
            } 
            
           
            set(queryObjectForUpdate, "waterSource", (queryObjectForUpdate.waterSource + "." + queryObjectForUpdate.waterSubSource));
            const appNumber =   getQueryArg(window.location.href, "applicationNumber");

                queryObjectForUpdate = findAndReplace(queryObjectForUpdate, "NA", null);
            
           /// in case of connection state is INITIATED or PENDING_FOR_CITIZEN_ACTION
           let subdiv = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].subdiv");
           let searchPreviewScreenMdmsData  = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData");
            
           searchPreviewScreenMdmsData= searchPreviewScreenMdmsData['ws-services-masters'].wsWorkflowRole.filter(x=>x.state === 'PENDING_FOR_DOCUMENT_VERIFICATION')
           let roles =[]
           let rolecode ='';
             if(searchPreviewScreenMdmsData && searchPreviewScreenMdmsData[0])
             {
             roles =  searchPreviewScreenMdmsData = searchPreviewScreenMdmsData[0].roles
             roles = roles.filter(x=>x.subdivision === subdiv )
             if(roles.length>0)
             {
             rolecode = roles[0].role 
             }
             }
             if(queryObjectForUpdate.processInstance.action !=='INITIATE')
             {
                if(rolecode)
                {
                    set(queryObjectForUpdate, "processInstance.additionalDetails.role", rolecode); 
                }
                else
                {
                    set(queryObjectForUpdate, "processInstance.additionalDetails", null); 
   
                }
             }
             else{
                set(queryObjectForUpdate, "processInstance.additionalDetails", null);
             }
             //? update property in case any field change in ui using previous button
             propertyUpdateCitizen(state,dispatch)
             ///?
          let responseWater =  await httpRequest("post", "/ws-services/wc/_update", "", [], { WaterConnection: queryObjectForUpdate });
            let searchQueryObject = [{ key: "tenantId", value: queryObjectForUpdate.tenantId }, { key: "applicationNumber", value: queryObjectForUpdate.applicationNo }];
            
            const btnName = ["UPDATE_CONNECTION_HOLDER_INFO",
                            "APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION",
                            "APPLY_FOR_TEMPORARY_REGULAR_CONNECTION",
                            "APPLY_FOR_REGULAR_INFO",
                            "REACTIVATE_CONNECTION",
                            "CONNECTION_CONVERSION",
                            "TEMPORARY_DISCONNECTION",
                            "UPDATE_METER_INFO",
                            "APPLY_FOR_METER_TESTING",
                            "PERMANENT_DISCONNECTION"];
        if(btnName.includes(wnsStatus)){
            responseWater.WaterConnection[0].property = queryObjectForUpdate.property;
            dispatch(prepareFinalObject("WaterConnection", responseWater.WaterConnection));
            setApplicationNumberBox(state, dispatch);
            dispatch(prepareFinalObject("applyScreen", findAndReplace(responseWater.WaterConnection[0], "null", "NA")));
            let oldcombinedArray = cloneDeep(responseWater.WaterConnection[0]);
            dispatch(prepareFinalObject("applyScreenOld", findAndReplace(oldcombinedArray, "null", "NA")));
        }
        else{
            let searchResponse = await getSearchResults(searchQueryObject);
            dispatch(prepareFinalObject("WaterConnection", searchResponse.WaterConnection));
        }

            if(localStorage.getItem("WNS_STATUS")){
                window.localStorage.removeItem("WNS_STATUS");
            }
            
        } else {
            set(queryObject, "processInstance.action", "INITIATE")
            //set doorNo
            set(queryObject, "property.address.doorNo", doorNo.toUpperCase())
            queryObject = findAndReplace(queryObject, "NA", null);
            if(get(state, "screenConfiguration.preparedFinalObject.applyScreen.tubewell")){
                queryObject.activityType = "NEW_TUBEWELL_CONNECTION";
            }else{
                //set based on Application Type
                if(queryObject.waterApplicationType === 'TEMPORARY')
                {
                    queryObject.activityType = "APPLY_FOR_TEMPORARY_CONNECTION"

                }
                else if(queryObject.waterApplicationType === 'TEMPORARY_BILLING')
                {
                    queryObject.activityType = "APPLY_FOR_TEMPORARY_CONNECTION_BILLING"

                }
                else{
                    queryObject.activityType = "NEW_WS_CONNECTION"

                }
                
            }
           
            response = await httpRequest("post", "/ws-services/wc/_create", "", [], { WaterConnection: queryObject });
            dispatch(prepareFinalObject("WaterConnection", response.WaterConnection));
            setApplicationNumberBox(state, dispatch);
            dispatch(handleField(
                "apply",
                `components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.ownershipTypeInput`,
                "props.disabled",
                //Isreadolny
                true
                ));
                const textFieldsOwnerInformation = ["ownerName","mobileNumber","email","guardianName","correspondenceAddress"];
                let ownershipCategory = get(state.screenConfiguration.preparedFinalObject,"applyScreen.property.ownershipCategory", 'INDIVIDUAL.SINGLEOWNER' )
                
                if(ownershipCategory ==='INDIVIDUAL.MULTIPLEOWNERS')
                {
                    let owners = get(state.screenConfiguration.preparedFinalObject,"applyScreen.property.owners",[])
                    for (let index = 0; index < owners.length; index++) {
                        //const element = array[index];
                        for (let i = 0; i < textFieldsOwnerInformation.length; i++) {
                            dispatch(handleField(
                              "apply",
                              `components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.MultiownerDetail.children.cardContent.children.headerDiv.props.items.${index}.item${index}.children.cardContent.children.viewFive.children.${textFieldsOwnerInformation[i]}`,
                              "props.disabled",
                              true
                              ));
                          }
                        
                    }
                    dispatch(handleField(
                        "apply",
                        `components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.MultiownerDetail.children.cardContent.children.headerDiv`,
                        "props.hasAddItem",
                        false
                        ));
                        dispatch(handleField(
                            "apply",
                            `components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.MultiownerDetail.children.cardContent.children.headerDiv`,
                            "props.isReviewPage",
                            true
                            ));
                }
                else{
                    for (let i = 0; i < textFieldsOwnerInformation.length; i++) {
                        dispatch(handleField(
                          "apply",
                          `components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.ownerDetail.children.cardContent.children.headerDiv.props.items.0.item0.children.cardContent.children.viewFive.children.${textFieldsOwnerInformation[i]}`,
                          "props.disabled",
                          true
                          ));
                      }

                }

                
        }
        return true;
    } catch (error) {
        dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
        console.log(error);
        if(localStorage.getItem("WNS_STATUS")){
            window.localStorage.removeItem("WNS_STATUS");
        }
        return false;
    }
}
export const propertyUpdate = async (state, dispatch,propertyPayload)=>{
    try {

        let payload = null;
        payload = await httpRequest(
          "post",
          "/property-services/property/_update",
          "_update",
          [],
          { Property: propertyPayload }
  
        );
        if (payload) {
         
        }
        return true;
      } catch (error) {
        console.log(error);
        if(localStorage.getItem("WNS_STATUS")){
            window.localStorage.removeItem("WNS_STATUS");
        }
        dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
        return false;
       
      }
}

export const applyForSewerage = async (state, dispatch) => {
    let queryObject = parserFunction(state);
    let sewerId = get(state, "screenConfiguration.preparedFinalObject.SewerageConnection[0].id");
    let method = sewerId ? "UPDATE" : "CREATE";
    try {
        const tenantId = get(state, "screenConfiguration.preparedFinalObject.SewerageConnection[0].property.tenantId");
        let response;
        set(queryObject, "tenantId", tenantId);
        queryObject.tenantId = (queryObject && queryObject.property && queryObject.property.tenantId)?queryObject.property.tenantId:null;
        if (method === "UPDATE") {
            queryObject.additionalDetails.appCreatedDate = get(
                state.screenConfiguration.preparedFinalObject,
                "SewerageConnection[0].additionalDetails.appCreatedDate"
            )
            let queryObjectForUpdate = get(state, "screenConfiguration.preparedFinalObject.SewerageConnection[0]");
            queryObjectForUpdate = { ...queryObjectForUpdate, ...queryObject }
            set(queryObjectForUpdate, "processInstance.action", "SUBMIT_APPLICATION");
            set(queryObjectForUpdate, "connectionType", "Non Metered");
            queryObjectForUpdate = findAndReplace(queryObjectForUpdate, "NA", null);
                       /// in case of connection state is INITIATED or PENDING_FOR_CITIZEN_ACTION
           let subdiv = get(state, "screenConfiguration.preparedFinalObject.SewerageConnection[0].subdiv",'');
           let searchPreviewScreenMdmsData  = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData");
            
           searchPreviewScreenMdmsData= searchPreviewScreenMdmsData['ws-services-masters'].swWorkflowRole.filter(x=>x.state === 'PENDING_FOR_DOCUMENT_VERIFICATION_BY_SDO')
           let roles =[]
           let rolecode ='';
             if(searchPreviewScreenMdmsData && searchPreviewScreenMdmsData[0])
             {
             roles =  searchPreviewScreenMdmsData = searchPreviewScreenMdmsData[0].roles
             roles = roles.filter(x=>x.subdivision === subdiv )
             if(roles.length>0)
             {
             rolecode = roles[0].role 
             }
             }
             if(rolecode)
             {
                 set(queryObjectForUpdate, "processInstance.additionalDetails.role", rolecode); 
             }
             else
             {
                 set(queryObjectForUpdate, "processInstance.additionalDetails", null); 

             }
            await httpRequest("post", "/sw-services/swc/_update", "", [], { SewerageConnection: queryObjectForUpdate });
            let searchQueryObject = [{ key: "tenantId", value: queryObjectForUpdate.tenantId }, { key: "applicationNumber", value: queryObjectForUpdate.applicationNo }];
            let searchResponse = await getSearchResultsForSewerage(searchQueryObject, dispatch);
            dispatch(prepareFinalObject("SewerageConnection", searchResponse.SewerageConnections));
        } else {
            set(queryObject, "processInstance.action", "INITIATE");
            queryObject = findAndReplace(queryObject, "NA", null);
            response = await httpRequest("post", "/sw-services/swc/_create", "", [], { SewerageConnection: queryObject });
            dispatch(prepareFinalObject("SewerageConnection", response.SewerageConnections));
            setApplicationNumberBox(state, dispatch);
        }
        return true;
    } catch (error) {
        dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
        console.log(error);
        return false;
    }
}

export const applyForBothWaterAndSewerage = async (state, dispatch) => {
    let method;
    let queryObject = parserFunction(state);
    let waterId = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].id");
    let sewerId = get(state, "screenConfiguration.preparedFinalObject.SewerageConnection[0].id");
    if (waterId && sewerId) { method = "UPDATE" } else { method = "CREATE" };
    try {
        const tenantId = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].property.tenantId");
        let response;
        set(queryObject, "tenantId", tenantId);
        queryObject.tenantId = (queryObject && queryObject.property && queryObject.property.tenantId)?queryObject.property.tenantId:null;
        if (method === "UPDATE") {
            let queryObjectForUpdateWater = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0]");
            let queryObjectForUpdateSewerage = get(state, "screenConfiguration.preparedFinalObject.SewerageConnection[0]");
            queryObjectForUpdateWater = { ...queryObjectForUpdateWater, ...queryObject }
            queryObjectForUpdateWater = findAndReplace(queryObjectForUpdateWater, "NA", null);
            queryObjectForUpdateSewerage = { ...queryObjectForUpdateSewerage, ...queryObject }
            queryObjectForUpdateSewerage = findAndReplace(queryObjectForUpdateSewerage, "NA", null);
            set(queryObjectForUpdateWater, "processInstance.action", "SUBMIT_APPLICATION");
            set(queryObjectForUpdateWater, "waterSource", (queryObjectForUpdateWater.waterSource + "." + queryObjectForUpdateWater.waterSubSource));
            set(queryObjectForUpdateSewerage, "processInstance.action", "SUBMIT_APPLICATION");
            set(queryObjectForUpdateSewerage, "connectionType", "Non Metered");
            set(
                queryObjectForUpdateSewerage,
                "additionalDetails.appCreatedDate", get(
                    state.screenConfiguration.preparedFinalObject,
                    "SewerageConnection[0].additionalDetails.appCreatedDate"
                )
            );
            set(
                queryObjectForUpdateWater,
                "additionalDetails.appCreatedDate", get(
                    state.screenConfiguration.preparedFinalObject,
                    "WaterConnection[0].additionalDetails.appCreatedDate"
                )
            );
            await httpRequest("post", "/ws-services/wc/_update", "", [], { WaterConnection: queryObjectForUpdateWater });
            await httpRequest("post", "/sw-services/swc/_update", "", [], { SewerageConnection: queryObjectForUpdateSewerage });
            let searchQueryObjectWater = [
                { key: "tenantId", value: queryObjectForUpdateWater.tenantId },
                { key: "applicationNumber", value: queryObjectForUpdateWater.applicationNo }
            ];
            let searchQueryObjectSewerage = [
                { key: "tenantId", value: queryObjectForUpdateSewerage.tenantId },
                { key: "applicationNumber", value: queryObjectForUpdateSewerage.applicationNo }
            ];
            let searchResponse = await getSearchResults(searchQueryObjectWater);
            let sewerageResponse = await getSearchResultsForSewerage(searchQueryObjectSewerage, dispatch);
            dispatch(prepareFinalObject("WaterConnection", searchResponse.WaterConnection));
            dispatch(prepareFinalObject("SewerageConnection", sewerageResponse.SewerageConnections));
        } else {
            set(queryObject, "processInstance.action", "INITIATE");
            queryObject = findAndReplace(queryObject, "NA", null);
            let waterObject = queryObject;
            if(get(state, "screenConfiguration.preparedFinalObject.applyScreen.tubewell")){
                waterObject.activityType = "NEW_TUBEWELL_CONNECTION";
            }else{
                //set based on Application Type
                waterObject.activityType = "NEW_WS_CONNECTION";
            }
            
            response = await httpRequest("post", "/ws-services/wc/_create", "_create", [], { WaterConnection: waterObject });
            const sewerageResponse = await httpRequest("post", "/sw-services/swc/_create", "_create", [], { SewerageConnection: queryObject });
            dispatch(prepareFinalObject("WaterConnection", response.WaterConnection));
            dispatch(prepareFinalObject("SewerageConnection", sewerageResponse.SewerageConnections));
        }
        setApplicationNumberBox(state, dispatch);
        return true;
    } catch (error) {
        dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
        console.log(error);
        return false;
    }
}


export const getImageUrlByFile = file => {
    return new Promise(resolve => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => {
            const fileurl = e.target.result;
            resolve(fileurl);
        };
    });
};

export const getFileSize = file => {
    const size = parseFloat(file.size / 1024).toFixed(2);
    return size;
};

export const isFileValid = (file, acceptedFiles) => {
    const mimeType = file["type"];
    return (
        (mimeType &&
            acceptedFiles &&
            acceptedFiles.indexOf(mimeType.split("/")[1]) > -1) ||
        false
    );
};

const setApplicationNumberBox = (state, dispatch) => {
    let applicationNumberWater = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].applicationNo", null);
    let applicationNumberSewerage = get(state, "screenConfiguration.preparedFinalObject.SewerageConnection[0].applicationNo", null);
    if (applicationNumberSewerage && applicationNumberWater) {
        handleApplicationNumberDisplayForBoth(dispatch, applicationNumberWater, applicationNumberSewerage)
    } else if (applicationNumberWater) {
        handleApplicationNumberDisplay(dispatch, applicationNumberWater)
    } else {
        handleApplicationNumberDisplay(dispatch, applicationNumberSewerage)
    }
};

export const handleApplicationNumberDisplay = (dispatch, applicationNumber) => {
    dispatch(handleField("apply", "components.div.children.headerDiv.children.header.children.applicationNumberWater", "visible", true));
    dispatch(handleField("apply", "components.div.children.headerDiv.children.header.children.applicationNumberWater", "props.number", applicationNumber));
}

const handleApplicationNumberDisplayForBoth = (dispatch, applicationNumberWater, applicationNumberSewerage) => {
    dispatch(
        handleField(
            "apply",
            "components.div.children.headerDiv.children.header.children.applicationNumberWater",
            "visible",
            true
        )
    );
    dispatch(
        handleField(
            "apply",
            "components.div.children.headerDiv.children.header.children.applicationNumberWater",
            "props.number",
            applicationNumberWater
        )
    );
    dispatch(
        handleField(
            "apply",
            "components.div.children.headerDiv.children.header.children.applicationNumberSewerage",
            "visible",
            true
        )
    );

    dispatch(
        handleField(
            "apply",
            "components.div.children.headerDiv.children.header.children.applicationNumberSewerage",
            "props.number",
            applicationNumberSewerage
        )
    );
}

export const findItemInArrayOfObject = (arr, conditionCheckerFn) => {
    for (let i = 0; i < arr.length; i++) {
        if (conditionCheckerFn(arr[i])) {
            return arr[i];
        }
    }
};


export const getMdmsDataForMeterStatus = async (dispatch) => {
    let mdmsBody = {
        MdmsCriteria: {
            tenantId: commonConfig.tenantId,
            "moduleDetails": [
                {
                    "moduleName": "ws-services-calculation",
                    "masterDetails": [
                        {
                            "name": "MeterStatus",
                            "filter": "$.*.name"
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
        // console.log(payload.MdmsRes)
        let data = payload.MdmsRes['ws-services-calculation'].MeterStatus.map(ele => {
            return { code: ele }
        })
        payload.MdmsRes['ws-services-calculation'].MeterStatus = data;
        dispatch(prepareFinalObject("meterMdmsData", payload.MdmsRes));

    } catch (e) {
        console.log(e);
    }
};
export const getMdmsDataForAutopopulated = async (dispatch) => {
    try {
        let connectionNo = getQueryArg(window.location.href, "connectionNos");
        let queryObject = [
            {
                key: "tenantId",
                value: getTenantIdCommon()
            },
            { key: "offset", value: "0" },
            { key: "connectionNumber", value: connectionNo }
        ];
        const data = await getSearchResults(queryObject)
        let res = findAndReplace(data, null, "NA")
        let connectionType = res.WaterConnection[0].connectionType
        let mdmsBody = {
                MdmsCriteria: {
                    tenantId: commonConfig.tenantId,
                    "moduleDetails": [
                        {
                            "moduleName": "ws-services-masters",
                            "masterDetails": [
                                {
                                    "name": "billingPeriod",
                                    "filter": "*"
                                }
                            ]
                        }
                    ]
                }
            };
        try {
            let payload = await httpRequest(
                "post",
                "/egov-mdms-service/v1/_search",
                "_search",
                [],
                mdmsBody
            );

            let billingCycle;
            payload.MdmsRes['ws-services-masters'].billingPeriod.map((x) => {
                if (x.connectionType === connectionType) {
                    billingCycle = x.billingCycle
                }
            })
            dispatch(prepareFinalObject("billingCycle", billingCycle));
        } catch (e) {
            console.log(e);
        }
    } catch (e) {
        console.log(e);
    }
}

export const getMeterReadingData = async (dispatch) => {
    let queryObject = [
        {
            key: "tenantId",
            value: getTenantIdCommon()
        },
        {
            key: "connectionNos",
            value: getQueryArg(window.location.href, "connectionNos")
        },
        { key: "offset", value: "0" }
    ];

    try {
        const response = await getConsumptionDetails(queryObject, dispatch);
        const data = findAndReplace(response, null, "NA");
        if (data && data.meterReadings && data.meterReadings.length > 0) {
            dispatch(prepareFinalObject("consumptionDetails", data.meterReadings));
            dispatch(
                prepareFinalObject("consumptionDetailsCount", data.meterReadings.length)
            );
        }
    } catch (error) {
        console.log(error);
    }
};

export const getPastPaymentsForWater = async (dispatch) => {
    dispatch(toggleSpinner());
    let queryObject = [
        {
            key: "tenantId",
            value: getTenantIdCommon()
        },
        {
            key: "businessServices",
            value: "WS"
        },
        {
            key: "uuid",
            value: JSON.parse(getUserInfo()).uuid.toString()
        },
    ];
    try {
        const response = await httpRequest(
            "post",
            "/collection-services/payments/_search",
            "_search",
            queryObject
        );
        dispatch(toggleSpinner());
        if (response && response.Payments) {
            dispatch(prepareFinalObject("pastPaymentsForWater", response.Payments));
        }
        return findAndReplace(response, null, "NA");;
    } catch (error) {
        dispatch(toggleSpinner());
        store.dispatch(
            toggleSnackbar(
                true, { labelName: error.message, labelCode: error.message },
                "error"
            )
        );
    }
}

export const getPastPaymentsForSewerage = async (dispatch) => {
    dispatch(toggleSpinner());
    let queryObject = [
        {
            key: "tenantId",
            value: getTenantIdCommon()
        },
        {
            key: "businessServices",
            value: "SW"
        },
        {
            key: "uuid",
            value: JSON.parse(getUserInfo()).uuid.toString()
        }
    ];
    try {
        const response = await httpRequest(
            "post",
            "/collection-services/payments/_search",
            "_search",
            queryObject
        );
        dispatch(toggleSpinner());
        if (response && response.Payments) {
            dispatch(prepareFinalObject("pastPaymentsForSewerage", response.Payments));
        }
        return findAndReplace(response, null, "NA");;
    } catch (error) {
        dispatch(toggleSpinner());
        store.dispatch(
            toggleSnackbar(
                true, { labelName: error.message, labelCode: error.message },
                "error"
            )
        );
    }
}

export const createMeterReading = async (dispatch, body) => {
    dispatch(toggleSpinner());
    try {
        const response = await httpRequest(
            "post",
            "/ws-calculator/meterConnection/_create",
            "", [], { meterReadings: body }
        );
        if (response && response !== undefined && response !== null) {
            getMeterReadingData(dispatch);
            dispatch(
                handleField(
                    "meter-reading",
                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.secondContainer.children.status.props",
                    "value",
                    "Working"
                )
            );
            dispatch(
                handleField(
                    "meter-reading",
                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fourthContainer.children.currentReading.props",
                    "disabled",
                    false
                )
            );
            dispatch(
                handleField(
                    "meter-reading",
                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fifthContainer.children.currentReadingDate.props",
                    "disabled",
                    false
                )
            );
            dispatch(
                handleField(
                    "meter-reading",
                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.secCont",
                    "visible",
                    true
                )
            );
            dispatch(
                handleField(
                    "meter-reading",
                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.thirdCont",
                    "visible",
                    false
                )
            );
            let todayDate = new Date()
            dispatch(
                handleField(
                    "meter-reading",
                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fifthContainer.children.currentReadingDate.props",
                    "value",
                    todayDate
                )
            );
            dispatch(
                handleField(
                    "meter-reading",
                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fourthContainer.children.currentReading.props",
                    "value",
                    ""
                )
            );
            dispatch(
                handleField(
                    "meter-reading",
                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.thirdCont.props",
                    "value",
                    ""
                )
            );
            dispatch(
                handleField(
                    "meter-reading",
                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.secCont.children.billingPeriod.props",
                    "labelName",
                    ""
                )
            );
        }
        dispatch(
            handleField(
                "meter-reading",
                "components.div.children.meterReadingEditable",
                "visible",
                false
            )
        );
        dispatch(prepareFinalObject("metereading", {}));
        dispatch(toggleSpinner());
    } catch (error) {
        dispatch(toggleSpinner());
        store.dispatch(
            toggleSnackbar(
                true, { labelName: error.message, labelCode: error.message },
                "error"
            )
        );
    }
}

export const wsDownloadConnectionDetails = (receiptQueryString, mode, dispatch) => {
    const FETCHCONNECTIONDETAILS = {
        GET: {
            URL: "/ws-services/wc/_search",
            ACTION: "_post",
        },
    };
    const DOWNLOADCONNECTIONDETAILS = {
        GET: {
            URL: "/pdf-service/v1/_create",
            ACTION: "_get",
        },
    };

    const FETCHSWCONNECTIONDETAILS = {
        GET: {
            URL: "/sw-services/swc/_search",
            ACTION: "_post",
        },
    };
    const service = getQueryArg(window.location.href, "service")

    switch (service) {
        case 'WATER':
            try {
                httpRequest("post", FETCHCONNECTIONDETAILS.GET.URL, FETCHCONNECTIONDETAILS.GET.ACTION, receiptQueryString).then(async (payloadReceiptDetails) => {
                    const queryStr = [
                        { key: "key", value: "ws-consolidatedacknowlegment" },
                        { key: "tenantId", value: receiptQueryString[1].value.split('.')[0] }
                    ]

                    if (payloadReceiptDetails.WaterConnection[0].rainWaterHarvesting !== undefined && payloadReceiptDetails.WaterConnection[0].rainWaterHarvesting !== null) {
                        if (payloadReceiptDetails.WaterConnection[0].rainWaterHarvesting === true) {
                            payloadReceiptDetails.WaterConnection[0].rainWaterHarvesting = 'SCORE_YES'
                        } else {
                            payloadReceiptDetails.WaterConnection[0].rainWaterHarvesting = 'SCORE_NO'
                        }
                    }
                    payloadReceiptDetails.WaterConnection = await getPropertyObj(payloadReceiptDetails.WaterConnection);
                    httpRequest("post", DOWNLOADCONNECTIONDETAILS.GET.URL, DOWNLOADCONNECTIONDETAILS.GET.ACTION, queryStr, { WaterConnection: payloadReceiptDetails.WaterConnection }, { 'Accept': 'application/pdf' }, { responseType: 'arraybuffer' })
                        .then(res => {
                            downloadReceiptFromFilestoreID(res.filestoreIds[0], mode);
                        });
                })

            } catch (exception) {
                alert('Some Error Occured while downloading!');
            }
            break;
        case 'SEWERAGE':
            try {
                httpRequest("post", FETCHSWCONNECTIONDETAILS.GET.URL, FETCHSWCONNECTIONDETAILS.GET.ACTION, receiptQueryString).then(async (payloadReceiptDetails) => {
                    const queryStr = [
                        { key: "key", value: "ws-consolidatedsewerageconnection" },
                        { key: "tenantId", value: receiptQueryString[1].value.split('.')[0] }
                    ]
                    payloadReceiptDetails.SewerageConnections = await getPropertyObj(payloadReceiptDetails.SewerageConnections);
                    httpRequest("post", DOWNLOADCONNECTIONDETAILS.GET.URL, DOWNLOADCONNECTIONDETAILS.GET.ACTION, queryStr, { SewerageConnections: payloadReceiptDetails.SewerageConnections }, { 'Accept': 'application/pdf' }, { responseType: 'arraybuffer' })
                        .then(res => {
                            downloadReceiptFromFilestoreID(res.filestoreIds[0], mode);
                        });
                })

            } catch (exception) {
                alert('Some Error Occured while downloading!');
            }
            break;
    }
}


export const getSWMyConnectionResults = async (queryObject, dispatch,action) => {
    dispatch(toggleSpinner());
    try {
        const response = await httpRequest(
            "post",
            "/sw-services/swc/_search",
            "_search",
            queryObject
        );
        if (response.SewerageConnections.length > 0) {
            response.SewerageConnections = await getPropertyObj(response.SewerageConnections);
            let IsEstimatecall = false
            if(action)
            {
                if(action.screenKey !== "home" || action.screenKey !== "home1")
                {
                    IsEstimatecall = true

                }
            }
            for (let i = 0; i < response.SewerageConnections.length; i++) {
                response.SewerageConnections[i].service = "Sewerage"
                if (response.SewerageConnections[i].connectionNo !== undefined && response.SewerageConnections[i].connectionNo !== null && IsEstimatecall === true ) {
                    try {
                        let queryObject = {billGeneration:
                            {            
                              consumerCode:response.SewerageConnections[i].connectionNo,
                            //   tenantId:response.WaterConnection[i].property.tenantId,//getTenantId(),
                            //   paymentMode:'cash',
                            //   isGenerateDemand:false,            
                            }
                          }
                        const data = await httpRequest(
                            "post",
                            //`billing-service/bill/v2/_fetchbill?consumerCode=${response.WaterConnection[i].connectionNo}&tenantId=${response.WaterConnection[i].property.tenantId}&businessService=WS`,
                            '/ws-services/billGeneration/_getBillData',
                            "_search",
                            [],
                            queryObject
                        );
                        // const data = await httpRequest(
                        //     "post",
                        //     `billing-service/bill/v2/_fetchbill?consumerCode=${response.SewerageConnections[i].connectionNo}&tenantId=${response.SewerageConnections[i].property.tenantId}&businessService=SW`,
                        //     "_fetchbill",
                        //     // queryObject
                        // );
                        // if (data && data !== undefined) {
                        //     if (data.Bill !== undefined && data.Bill.length > 0) {
                        //         response.SewerageConnections[i].due = data.Bill[0].totalAmount
                        //     }

                        // } else {
                        //     response.SewerageConnections[i].due = 0
                        // }

                        if (data && data !== undefined) {
                            if (data.billGeneration !== undefined && data.billGeneration.length > 0) {
                               response.SewerageConnections[i].due = 0//data.billGeneration[0].totalAmount
                                response.SewerageConnections[i].status = data.billGeneration[0].status
                                response.SewerageConnections[i].error = ""
                                response.SewerageConnections[i].id = data.billGeneration[0].billGenerationId
                            }

                        } else {
                            response.SewerageConnections[i].due = "NA"
                            response.SewerageConnections[i].status = "NA"
                            response.SewerageConnections[i].error = ""
                            response.SewerageConnections[i].id = 0
                        }

                    } catch (err) {
                        console.log(err)
                        response.SewerageConnections[i].due = "NA"
                        response.SewerageConnections[i].status = "NA"
                        response.SewerageConnections[i].error = err.message
                        response.SewerageConnections[i].id = 0
                    }
                }
            }
            // });
        }
        dispatch(toggleSpinner());
        return findAndReplace(response, null, "NA");
    } catch (error) {
        dispatch(toggleSpinner());
        console.log(error);
    }

};

export const billingPeriodMDMS = (toPeriod,payloadbillingPeriod,service) => {
    const connectionType = getQueryArg(window.location.href, "connectionType");
    let demandExipryDate = 0;
    if (service === 'WATER' &&
        payloadbillingPeriod['ws-services-masters'] && 
        payloadbillingPeriod['ws-services-masters'].billingPeriod !== undefined && 
        payloadbillingPeriod['ws-services-masters'].billingPeriod  !== null) {
      payloadbillingPeriod['ws-services-masters'].billingPeriod.forEach(obj => {
        if(obj.connectionType === 'Metered' && connectionType === "Metered") {
          demandExipryDate = obj.demandExpiryDate;
        } else if (obj.connectionType === 'Non Metered' && connectionType === "Non Metered") {
          demandExipryDate = obj.demandExpiryDate;
        }
      }); 
    }               
    
    if (service === 'SEWERAGE' &&
        payloadbillingPeriod['sw-services-calculation'] && 
        payloadbillingPeriod['sw-services-calculation'].billingPeriod !== undefined && 
        payloadbillingPeriod['sw-services-calculation'].billingPeriod  !== null) {
      payloadbillingPeriod['sw-services-calculation'].billingPeriod.forEach(obj => {
        if (obj.connectionType === 'Non Metered') {
          demandExipryDate = obj.demandExpiryDate;
        }
      }); 
    }
    return toPeriod + demandExipryDate;
}

export const downloadBill = (receiptQueryString, mode = "download") => {
    const FETCHBILL = {
        GET: {
            URL: "/billing-service/bill/v2/_fetchbill",
            ACTION: "_get",
        },
    };
    const DOWNLOADBILL = {
        GET: {
            URL: "/pdf-service/v1/_create",
            ACTION: "_get",
        },
    };

    const requestBody = { 
        "MdmsCriteria": { 
            "tenantId": getTenantIdCommon(),
              "moduleDetails": [            
                { "moduleName": "ws-services-masters", "masterDetails": [{ "name": "billingPeriod" }]},
                { "moduleName": "sw-services-calculation", "masterDetails": [{ "name": "billingPeriod" }]}
              ]
            }
        }
    
    try {
       
        httpRequest("post", FETCHBILL.GET.URL, FETCHBILL.GET.ACTION, receiptQueryString).then((payloadReceiptDetails) => {
            const queryStr = [
                { key: "key", value: "ws-bill" },
                { key: "tenantId", value: receiptQueryString[1].value.split('.')[0] }
            ]
            let data = [];
            payloadReceiptDetails.Bill[0].billDetails.map(curEl => data.push(curEl));
            let sortData = data.sort((a, b) => b.toPeriod - a.toPeriod);
            sortData.shift();
            let totalAmount = 0;
            let previousArrears = 0;
            if (sortData.length > 0) {
                let totalArrearsAmount = sortData.map(el => el.amount + totalAmount);
                previousArrears = totalArrearsAmount.reduce((a, b) => a + b);
            }

            payloadReceiptDetails.Bill[0].billDetails.sort((a, b) => b.toPeriod - a.toPeriod);

            payloadReceiptDetails.Bill[0].arrearAmount = previousArrears.toFixed(2);
            httpRequest("post","/egov-mdms-service/v1/_search","_search", [],requestBody).then((payloadbillingPeriod) => {
                console.log(payloadbillingPeriod);
                let waterMeteredDemandExipryDate =0,waterNonMeteredDemandExipryDate=0,sewerageNonMeteredDemandExpiryDate=0;
                const service = (payloadReceiptDetails.Bill && payloadReceiptDetails.Bill.length>0 && payloadReceiptDetails.Bill[0].businessService)?payloadReceiptDetails.Bill[0].businessService:'WS';
                if (service === 'WS' && 
                    payloadbillingPeriod.MdmsRes['ws-services-masters'] && 
                    payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod !== undefined && 
                    payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod  !== null) {
                  payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod.forEach(obj => {
                    if(obj.connectionType === 'Metered' && getQueryArg(window.location.href, "connectionType") === "Metered") {
                      payloadReceiptDetails.Bill[0].billDetails[0]['expiryDate'] = payloadReceiptDetails.Bill[0].billDetails[0].toPeriod+obj.demandExpiryDate;
                    } else if (obj.connectionType === 'Non Metered' && getQueryArg(window.location.href, "connectionType") === "Non Metered") {
                      payloadReceiptDetails.Bill[0].billDetails[0]['expiryDate'] = payloadReceiptDetails.Bill[0].billDetails[0].toPeriod + obj.demandExpiryDate;
                    }
                  }); 
                }               
                
                if (service === "SW" && 
                    payloadbillingPeriod.MdmsRes['sw-services-calculation'] && 
                    payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod !== undefined && 
                    payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod  !== null) {
                  payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod.forEach(obj => {
                    if (obj.connectionType === 'Non Metered') {
                      payloadReceiptDetails.Bill[0].billDetails[0]['expiryDate'] = payloadReceiptDetails.Bill[0].billDetails[0].toPeriod + obj.demandExpiryDate;
                    }
                  }); 
                }

                httpRequest("post", DOWNLOADBILL.GET.URL, DOWNLOADBILL.GET.ACTION, queryStr, { Bill: payloadReceiptDetails.Bill }, { 'Accept': 'application/pdf' }, { responseType: 'arraybuffer' })
                    .then(res => {
                        downloadReceiptFromFilestoreID(res.filestoreIds[0], mode);
                });
            })
        })
    } catch (exception) {
        alert('Some Error Occured while downloading Bill!');
    }
}

export const findAndReplace = (obj, oldValue, newValue) => {
    Object.keys(obj).forEach(key => {
        if ((obj[key] instanceof Object) || (obj[key] instanceof Array)) findAndReplace(obj[key], oldValue, newValue)
        obj[key] = obj[key] === oldValue ? newValue : obj[key]
    })
    return obj
}

// api call to calculate water estimate
export const waterEstimateCalculation = async (queryObject, dispatch) => {
    dispatch(toggleSpinner());
    set(queryObject[0] ,'waterConnection.proposedMeterInstallationDate',convertDateToEpoch(queryObject[0].waterConnection.proposedMeterInstallationDate))
    try {
        const response = await httpRequest(
            "post",
            "ws-calculator/waterCalculator/_estimate",
            "_estimate",
            [],
            
            {
                isconnectionCalculation: false,
                CalculationCriteria: queryObject
            }
        );
        dispatch(toggleSpinner());
        return findAndReplace(response, null, "NA");
    } catch (error) {
        dispatch(toggleSpinner());
        console.log(error);
    }

};

// api call to calculate sewerage estimate
export const swEstimateCalculation = async (queryObject, dispatch) => {
    dispatch(toggleSpinner());
    try {
        const response = await httpRequest(
            "post",
            "sw-calculator/sewerageCalculator/_estimate",
            "_estimate",
            [],
            {
                isconnectionCalculation: false,
                CalculationCriteria: queryObject
            }
        );
        dispatch(toggleSpinner());
        return findAndReplace(response, null, "NA");
    } catch (error) {
        dispatch(toggleSpinner());
        console.log(error);
    }

};
export const epochToYmdDate = et => {
    if (!et) return null;
    if (typeof et === "string") return et;
    let d = new Date(et),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
  
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
  
    return [year, month, day].join("-");
  };
// to download application 
export const downloadApp = async (state,wnsConnection, type, mode = "download",dispatch) => {

    if(type === 'receiptLetter' || type === 'ndcLetter' ){
       // console.log(wnsConnection)
       if(wnsConnection[0].service ==='SEWERAGE_')
       {

       }
       else  if(wnsConnection[0].service ==='WATER' || wnsConnection[0].service ==='SEWERAGE')
       {
        const receiptQueryString = [
            { key: "consumerCodes", value: getQueryArg(window.location.href, "applicationNumber") },
            { key: "tenantId", value: getQueryArg(window.location.href, "tenantId") }
        ]
            const FETCHRECEIPT = {
            GET: {
            URL: "/collection-services/payments/_search",
            ACTION: "_get",
            },
            };
            const DOWNLOADRECEIPT = {
            GET: {
            URL: "/pdf-service/v1/_create",
            ACTION: "_get",
            },
            };
            try{
                let keyvalue ='ws-bill-receipt' 
                let KeytenantId = getQueryArg(window.location.href, "tenantId")
                if(process.env.REACT_APP_NAME === "Citizen")
                    {
                        KeytenantId = KeytenantId.split('.')[0]
                    }
                    if(type === 'ndcLetter')
                    {
                        keyvalue ='ws-bill-receipt-no-due'
                    }
                
                try{
                    httpRequest("post", FETCHRECEIPT.GET.URL, FETCHRECEIPT.GET.ACTION, receiptQueryString).then((payloadReceiptDetails) => {
                      const queryStr = [
                        { key: "key", value: keyvalue },
                        { key: "tenantId", value: KeytenantId  }//KeytenantId = receiptQueryString[1].value.split('.')[0]
                      ]
                      if(payloadReceiptDetails&&payloadReceiptDetails.Payments&&payloadReceiptDetails.Payments.length==0){
                        console.log("Could not find any receipts"); 
                        dispatch(
                                      toggleSnackbar(
                                        true,
                                        { labelName: "Could not find any receipts", labelKey: "Could not find any receipts" },
                                        "warning"
                                      )
                                    );  
                        return;
                      }

                      else                     
                      {
                        let paymentReceiptDate = 0;
                        let paidAmount =0;
                        let dueAmount = 0;
                        let receiptNumber =9;
                        if(payloadReceiptDetails&&payloadReceiptDetails.Payments&&payloadReceiptDetails.Payments.length===1)
                        {
                         paymentReceiptDate = epochToYmdDate(get(payloadReceiptDetails, "Payments[0].paymentDetails[0].receiptDate", ''))
                         paidAmount = get(payloadReceiptDetails, "Payments[0].paymentDetails[0].totalAmountPaid", '')
                         dueAmount = get(payloadReceiptDetails, "Payments[0].paymentDetails[0].totalDue", '')
                         receiptNumber  =get(payloadReceiptDetails, "Payments[0].paymentDetails[0].receiptNumber", '') 
                        }
                        else if(payloadReceiptDetails&&payloadReceiptDetails.Payments&&payloadReceiptDetails.Payments.length>1)
                        {
                            let payment_ = payloadReceiptDetails.Payments.filter(x=>x.totalDue >0)
                            paymentReceiptDate = epochToYmdDate(get(payment_[0], "transactionDate", ''))
                            paidAmount = get(payment_[0], "paymentDetails[0].totalAmountPaid", '')
                            dueAmount = get(payment_[0], "paymentDetails[0].totalDue", '')
                            receiptNumber  =get(payment_[0], "paymentDetails[0].receiptNumber", '') 
                        }
                        // call get api to set  WaterConnection details
                        let applicationNumber = getQueryArg(window.location.href, "applicationNumber")
                        let queryObject =  [{ key: "tenantId", value: getQueryArg(window.location.href, "tenantId") }, { key: "applicationNumber", value: applicationNumber }]
                        let div=''
                        let subDiv=''
                        let activityType=''
                        let applicantName=''
                        let applicantAddress=''
                        let houseNo=''
                        let plotnumber=''
                        let sector =''
                        let upto =''
                        let connectionNumber=''
                        if(applicationNumber.includes("WS"))
                        {                      
                       try{
                    //    const wc_search = {
                    //      GET: {
                    //        URL: "/ws-services/wc/_search",
                    //        ACTION: "_search",
                    //      },
                    //    };


                         if(wnsConnection && wnsConnection.length>0){
                           div =get(wnsConnection[0], "div", '')
                         subDiv =get(wnsConnection[0], "subdiv", '')
                         activityType =get(wnsConnection[0], "activityType", '')
                         applicantName =get(wnsConnection[0], "connectionHolders[0].name", '')
                         applicantAddress =get(wnsConnection[0], "connectionHolders[0].correspondenceAddress", '')
                         plotnumber =get(wnsConnection[0], "property.address.doorNo", '')
                         houseNo =get(wnsConnection[0], "property.address.plotNo", '')
                         sector = get(wnsConnection[0], "property.address.locality.name", '')
                         upto = epochToYmdDate(get(wnsConnection[0], "waterApplication.auditDetails.lastModifiedTime", ''))
                         connectionNumber = get(wnsConnection[0], "connectionNo", '')
                         let connectionHolders = get(wnsConnection[0], "connectionHolders", [])
                         let waterApplicationList = get(wnsConnection[0], "waterApplicationList", [])

                         if(connectionNumber.length < 14)
                         {
                            connectionNumber = 'Account Number Generation Under Process'
                         }
                         if(connectionHolders.length>1)
                         {
                            waterApplicationList = waterApplicationList.filter(x=>x.applicationNo === applicationNumber )
                            connectionHolders = connectionHolders.filter(x=>x.ws_application_id ===waterApplicationList[0].id)
                            if(connectionHolders && connectionHolders[0])
                            {
                                applicantName = connectionHolders[0].name
                               // applicantName = connectionHolders[0].name
                            }
                            

                         }
                         applicantAddress = `Plot number-${plotnumber},House number-${houseNo},Locality-${sector}`
                         // set activityType 
                         switch (activityType) {
                                case "APPLY_FOR_TEMPORARY_CONNECTION":
                                activityType ='Temporary Water Connection Construction'
                                break;
                                case "APPLY_FOR_TEMPORARY_CONNECTION_BILLING":
                                activityType ='Temporary Water Connection Billing'
                                break;
                                case "NEW_WS_CONNECTION":
                                activityType ='Regular Water Connection'
                                break;
                                case "REGULARWSCONNECTION":
                                activityType ='Regular Water Connection'
                                break;
                                case "APPLY_FOR_TEMPORARY_REGULAR_CONNECTION":
                                activityType ='Temporary Regular Water Connection'
                                break;
                                case "TEMPORARY_WSCONNECTION":
                                case "APPLY_FOR_TEMPORARY_CONNECTION":
                                activityType ='Temporary Disconnection'
                                break;
                                case "WS_TUBEWELL":
                                activityType ='New Tubewell Connection'
                                break;
                                case "WS_TEMP_TEMP":
                                case "APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION":
                                activityType ='Temporary to Temporary Conversion'
                                break;
                                case "WS_TEMP_REGULAR":
                                case "APPLY_FOR_TEMPORARY_REGULAR_CONNECTION":
                                activityType ='Temporary to Regular Conversion'
                                break;
                                case "WS_DISCONNECTION":
                                case "PERMANENT_DISCONNECTION":
                                activityType ='Permanent Disconnection'
                                break;
                                case "WS_TEMP_DISCONNECTION":
                                case "TEMPORARY_DISCONNECTION":
                                activityType ='Temporary Disconnection'
                                break;
                                case "WS_RENAME":
                                case "UPDATE_CONNECTION_HOLDER_INFO":
                                activityType ='Update Connection Holder Information'
                                {
                                    applicantName =get(wnsConnection[0], "connectionHolders[0].proposedName", '')
                                  }
                                break;
                                case "WS_METER_UPDATE":
                                case "UPDATE_METER_INFO":
                                activityType ='Meter Update'
                                break;
                                case "APPLY_FOR_METER_TESTING":
                                case "WS_METER_TESTING":
                                activityType ='Meter Testing'
                                break;
                                case "WS_CONVERSION":
                                case "CONNECTION_CONVERSION":
                                activityType ='Tariff Change'
                                break;
                                case "WS_REACTIVATE":
                                case "REACTIVATE_CONNECTION":
                                activityType ='Reactive Connection'
                                break;
                                case "APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION":
                                activityType ='Temporary to Temporary Conversion'
                                break;
               
                         }
                         let billGeneration_ =[
                         {
                           
                            div: div,
                            subDiv:subDiv,
                            applicationNumber:applicationNumber,
                           receiptNumber:receiptNumber,
                           connectionNumber:connectionNumber,
                           activityType: activityType,
                           applicantName: applicantName,
                           applicantAddress: applicantAddress,
                           paymentReceiptDate:paymentReceiptDate,
                           dueAmount: dueAmount,
                           paidAmount:paidAmount,
                           status:'Payment complete',
                         }
                       ]
                       if(type ==='ndcLetter')
                       {

                         billGeneration_ =[
                            {
                              
                                applicationNo: applicationNumber,
                                dated:paymentReceiptDate,
                                applicantName:applicantName,  
                                houseNo: houseNo,
                                sector:sector,
                                rs: paidAmount,
                                upto:upto,
                                accountNo:connectionNumber,
                                receiptNo:receiptNumber,                                
                                date:paymentReceiptDate,
                                division:subDiv,
                                plotNo:plotnumber
                            }
                          ]

                       }
                   
                       
                         httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, { WSReceiptRequest: billGeneration_ }, { 'Accept': 'application/json' }, { responseType: 'arraybuffer' })
                         .then(res => {
                           res.filestoreIds[0]
                           if(res&&res.filestoreIds&&res.filestoreIds.length>0){
                             res.filestoreIds.map(fileStoreId=>{
                               downloadReceiptFromFilestoreID(fileStoreId,mode,KeytenantId)
                             })          
                           }else{
                             console.log("Error In Receipt Download");        
                           }         
                         });
                     
                      
                                    
                         }
                         else{
                           console.log("Error In Receipt Download");        
                         }         
                      
                       //
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
                              console.log(error)
                    
                            }
                        }
                        else if(applicationNumber.includes("SW"))
                        {
                       
                     const wswc_search = {
                       GET: {
                         URL: "/sw-services/swc/_search",
                         ACTION: "_search",
                       },
                     };
                     httpRequest("post", wswc_search.GET.URL, wswc_search.GET.ACTION, queryObject, [], { 'Accept': 'application/json' }, { responseType: 'arraybuffer' })
                     .then(res => {
                       res.SewerageConnections[0]
                       if(res&&res.SewerageConnections&&res.SewerageConnections.length>0){
                         div =get(res, "SewerageConnections[0].div", '')
                       subDiv =get(res, "SewerageConnections[0].subdiv", '')
                       activityType =get(res, "SewerageConnections[0].activityType", '')
                       applicantName =get(res, "SewerageConnections[0].connectionHolders[0].name", '')
                       applicantAddress =get(res, "SewerageConnections[0].connectionHolders[0].correspondenceAddress", '')
                       plotnumber =get(wnsConnection[0], "property.address.doorNo", '')
                         houseNo =get(wnsConnection[0], "property.address.plotNo", '')
                         sector = get(wnsConnection[0], "property.address.locality.name", '')
                         applicantAddress = `Plot number-${plotnumber},House number-${houseNo},Locality-${sector}`
                       if(activityType === null)
                       {
                         activityType = "Sewarage Connection"
                       }
                       let billGeneration_ =[
                         {
                           
                           div: div,
                           subDiv:subDiv,
                           applicationNumber:applicationNumber,
                           receiptNumber:receiptNumber,
                           activityType: activityType,
                           applicantName: applicantName,
                           applicantAddress: applicantAddress,
                           paymentReceiptDate:paymentReceiptDate,
                           dueAmount: dueAmount,
                           paidAmount:paidAmount,
                           status:'Payment complete',
                         }
                       ]
                         httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, { WSReceiptRequest: billGeneration_ }, { 'Accept': 'application/json' }, { responseType: 'arraybuffer' })
                         .then(res => {
                           res.filestoreIds[0]
                           if(res&&res.filestoreIds&&res.filestoreIds.length>0){
                             res.filestoreIds.map(fileStoreId=>{
                               downloadReceiptFromFilestoreID(fileStoreId,mode,KeytenantId)
                             })          
                           }else{
                             console.log("Error In Receipt Download");        
                           }         
                         });
                                  
                       }else{
                         console.log("Error In Receipt Download");        
                       }         
                     });
                        }
               
                      }

                      
                     
                    })
                   }
                   catch(error)
                   {
                     
                     console.log(error)
                     dispatch(
                                  toggleSnackbar(
                                    true,
                                    { labelName: error.message, labelKey: error.message },
                                    "error"
                                  )
                                );  
                   }

            }
            catch (error) {
                console.log(error)
                dispatch(
                              toggleSnackbar(
                                true,
                                { labelName: error.message, labelKey: error.message },
                                "error"
                              )
                            );  
                //alert('Some Error Occured while downloading Receipt!');
              }

       }
      
        

    }
    else{    

    let tenantName = wnsConnection[0].property.tenantId;
    tenantName = tenantName.split('.')[1];

    wnsConnection[0].tenantName = tenantName.toUpperCase();
    const appNo = wnsConnection[0].applicationNo;
let KeytenantId = getTenantIdCommon() !== null?getTenantIdCommon():getTenantId() 
if (wnsConnection[0].service === "SEWERAGE") {
    KeytenantId ='ch';
}
    let queryStr = [{ key: "tenantId", value:KeytenantId }];
    let apiUrl, appService, estKey, queryObjectForEst
    if (wnsConnection[0].service === "WATER") {

        // for Estimate api 
        if (wnsConnection[0].property.rainWaterHarvesting !== undefined && wnsConnection[0].property.rainWaterHarvesting !== null) {
            if (wnsConnection[0].property.rainWaterHarvesting === 'SCORE_YES') {
                wnsConnection[0].property.rainWaterHarvesting = true
            } else if (wnsConnection[0].property.rainWaterHarvesting === 'SCORE_NO') {
                wnsConnection[0].property.rainWaterHarvesting = false
            }
        }
        apiUrl = "ws-calculator/waterCalculator/_estimate";
        appService = "ws-applicationwater";
        queryObjectForEst = [{
            applicationNo: appNo,
            tenantId: getTenantIdCommon() !== null?getTenantIdCommon():getTenantId(),
            waterConnection: wnsConnection[0]
        }]

    } else {
        apiUrl = "sw-calculator/sewerageCalculator/_estimate";
        appService = "ws-applicationsewerage";
        //set usageCategory and subusageCategory from mdms call
        let usageCategory = GetMdmsNameBycode(state, "searchPreviewScreenMdmsData.PropertyTax.UsageType",wnsConnection[0].property.usageCategory) 
        let subusageCategory = GetMdmsNameBycode(state, "searchPreviewScreenMdmsData.PropertyTax.subUsageType",wnsConnection[0].property.subusageCategory) 
        let lastModifiedTime = convertDateToEpoch(wnsConnection[0].auditDetails.lastModifiedTime)
            set( wnsConnection[0], `property.usageCategory`, usageCategory);
            set( wnsConnection[0], `property.subusageCategory`, subusageCategory);
        let connectionExecutionDate = get( wnsConnection[0], `connectionExecutionDate`)
        if(connectionExecutionDate!== null)
        {            
            connectionExecutionDate =convertDateToEpoch(connectionExecutionDate)
            if(connectionExecutionDate>0)
            set( wnsConnection[0], `connectionExecutionDate`, connectionExecutionDate);
            else
            set( wnsConnection[0], `connectionExecutionDate`, lastModifiedTime);
        }
        else{            
            set( wnsConnection[0], `connectionExecutionDate`, lastModifiedTime);
        }        
        queryObjectForEst = [{
            applicationNo: appNo,
            tenantId: 'ch',//getTenantIdCommon() !== null?getTenantIdCommon():getTenantId(),
            sewerageConnection: wnsConnection[0]
        }]
    }
    const DOWNLOADCONNECTIONDETAILS = {
        GET: {
            URL: "/pdf-service/v1/_create",
            ACTION: "_get",
        },
    };
    switch (type) {
        case 'application':
            queryStr.push({ key: "key", value: appService })
            break
        case 'estimateNotice':
            appService = "ws-estimationnotice";
            queryStr.push({ key: "key", value: appService });
            break;
        case 'sanctionLetter':
            appService = "ws-sanctionletter";
            queryStr.push({ key: "key", value: appService });
            break;
    }
    try {
        const estResponse = await httpRequest(
            "post",
            apiUrl,
            "_estimate",
            [],

            {
                isconnectionCalculation: false,
                CalculationCriteria: queryObjectForEst
            }
        );

        wnsConnection[0].totalAmount = estResponse.Calculation[0].totalAmount;
        wnsConnection[0].applicationFee = estResponse.Calculation[0].fee;
        wnsConnection[0].serviceFee = estResponse.Calculation[0].charge;
        wnsConnection[0].tax = estResponse.Calculation[0].taxAmount;

        let obj = {};
        if (type === 'estimateNotice' || type === 'sanctionLetter') {
            estResponse.Calculation[0].taxHeadEstimates.map((val) => {
                val.taxHeadCode = val.taxHeadCode.substring(3)
            });
            wnsConnection[0].pdfTaxhead = estResponse.Calculation[0].taxHeadEstimates;

            obj = {
                WnsConnection: wnsConnection
            }
        }

        if (type === 'sanctionLetter') {
            const slaDetails = await httpRequest(
                "post",
                `egov-workflow-v2/egov-wf/businessservice/_search?tenantId=${wnsConnection[0].property.tenantId}&businessService=WS`,
                "_search"
            );

            var states = [], findSLA = false;
            for (var i = 0; i < slaDetails.BusinessServices.length; i++) {
                states = slaDetails.BusinessServices[i].states;
                if (findSLA) break;
                if (states.length > 0) {
                    for (var j = 0; j < states.length; j++) {
                        if (states[j]['state'] && states[j]['state'] !== undefined && states[j]['state'] !== null && states[j]['state'] !== "" && states[j]['state'] === 'PENDING_FOR_CONNECTION_ACTIVATION') {
                            //console.log(states[j]['sla']);
                            wnsConnection[0].sla = states[j]['sla'] / 86400000;
                            findSLA = true;
                            break;
                        }
                    }
                }
                //console.log(i);
            }
            let connectionExecutionDate = new Date(wnsConnection[0].connectionExecutionDate);
            wnsConnection[0].slaDate = connectionExecutionDate.setDate(connectionExecutionDate.getDate() + wnsConnection[0].sla);
        }


        if (type === 'application') {
            if(wnsConnection[0].property && wnsConnection[0].property.units && wnsConnection[0].property.units.length > 0 && wnsConnection[0].property.units[0].usageCategory){
               wnsConnection[0].property.propertySubUsageType = wnsConnection[0].property.units[0].usageCategory;
            }
            if (wnsConnection[0].service === "WATER") {
                if (wnsConnection[0].property.rainWaterHarvesting !== undefined && wnsConnection[0].property.rainWaterHarvesting !== null) {
                    if (wnsConnection[0].property.rainWaterHarvesting === true) {
                        wnsConnection[0].property.rainWaterHarvesting = 'SCORE_YES'
                    } else {
                        wnsConnection[0].property.rainWaterHarvesting = 'SCORE_NO'
                    }
                }
                obj = {
                    WaterConnection: WaterConnection
                }
               // wnsConnection[0].connectionExecutionDate = 
                set( wnsConnection, `connectionExecutionDate`, convertEpochToDate(wnsConnection[0].connectionExecutionDate));
            } else {
                set(wnsConnection[0], `connectionExecutionDate`, convertEpochToDate(wnsConnection[0].connectionExecutionDate));
                obj = {
                    SewerageConnection: wnsConnection[0]
                }
            }
        }
        await httpRequest("post", DOWNLOADCONNECTIONDETAILS.GET.URL, DOWNLOADCONNECTIONDETAILS.GET.ACTION, queryStr, obj, { 'Accept': 'application/json' }, { responseType: 'arraybuffer' })
            .then(res => {
                res.filestoreIds[0]
                if (res && res.filestoreIds && res.filestoreIds.length > 0) {
                    res.filestoreIds.map(fileStoreId => {
                        downloadReceiptFromFilestoreID(fileStoreId, mode,KeytenantId)
                    })
                } else {
                    console.log("Error In Download");
                }

            });
    } catch (error) {
        dispatch(
            toggleSnackbar(
              true,
              { labelName: error.message, labelKey: error.message },
              "error"
            )
          );
        alert('Some Error Occured while downloading!');
    }
}
}

export const GetMdmsNameBycode = (state, jsonpath, code) => {
    //Material
    let Obj  = get(state, `screenConfiguration.preparedFinalObject.${jsonpath}`,[]) 
    let Name = code
    Obj = Obj.filter(x=>x.code === code)
    if(Obj &&Obj[0])
    Name = Obj[0].name
    return Name;
  };
  export const ValidateCard = (state,dispatch,cardJsonPath,pagename,jasonpath,value) => {
    let  DuplicatItem =[];
    let CardItem = get(
      state.screenConfiguration.screenConfig[`${pagename}`],
      cardJsonPath,
      []
    );
   let matcode =[];
    for (let index = 0; index < CardItem.length; index++) {
      if(CardItem[index].isDeleted === undefined ||
      CardItem[index].isDeleted !== false)
      {
      let code = get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${value}`,'')
      matcode.push(code)
      }
    } 
    var uniq = matcode
    .map((name) => {
      return {
        count: 1,
        name: name
      }
    })
    .reduce((a, b) => {
      a[b.name] = (a[b.name] || 0) + b.count
      return a
    }, {})  
    var duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1)
    if(duplicates.length>0)
    {
    duplicates= duplicates.map(itm => {
        return `${itm}`;
      })
      .join() || "-"
     // IsDuplicatItem = true;  
      DuplicatItem.push(
        {
          duplicates: duplicates,
          IsDuplicatItem:true
        }      
      )  
    } 
    else{
      DuplicatItem.push(
        {
          duplicates: duplicates,
          IsDuplicatItem:false
        });
  
    }
  
    return DuplicatItem;
  };
export const validateConnHolderDetails = (holderData) => {
    if(holderData.connectionHolders==null){
        return true
    }else if( holderData.connectionHolders && holderData.connectionHolders.length > 0){
        let holderOwners = holderData.connectionHolders;
        let valid = [];
        for (let i = 0; i < holderOwners.length; i++) {
            if (
                holderOwners[i].hasOwnProperty("mobileNumber") && holderOwners[i]['mobileNumber'] !== undefined && holderOwners[i]["mobileNumber"] !== "" &&
                holderOwners[i].hasOwnProperty("name") && holderOwners[i]['name'] !== undefined && holderOwners[i]["name"] !== "" &&
               // holderOwners[i].hasOwnProperty("fatherOrHusbandName") && holderOwners[i]['fatherOrHusbandName'] !== undefined && holderOwners[i]["fatherOrHusbandName"] !== "" &&
                holderOwners[i].hasOwnProperty("correspondenceAddress") && holderOwners[i]['correspondenceAddress'] !== undefined && holderOwners[i]["correspondenceAddress"] !== ""
               // holderOwners[i].hasOwnProperty("gender") &&
                //holderOwners[i]["gender"] !== undefined &&
                //holderOwners[i]["gender"] !== "" &&
               // holderOwners[i].hasOwnProperty("ownerType") &&
               // holderOwners[i]["ownerType"] !== undefined &&
                //holderOwners[i]["ownerType"] !== "" 
               // holderOwners[i].hasOwnProperty("relationship") &&
                //holderOwners[i]["relationship"] !== undefined &&
               // holderOwners[i]["relationship"] !== ""
            ) { valid.push(1) } else { valid.push(0) }
        }
        //if (valid.includes(0)) { return false; } else { return true; }
        return true
    }
}

export const getDomainLink = () =>{
    let link = "";
    if(process.env.NODE_ENV !== "development"){
       link += "/"+process.env.REACT_APP_NAME.toLowerCase()
    }
    return link
}

export const isActiveProperty = (propertyObj) =>{
    // if(propertyObj.status === 'INACTIVE' || propertyObj.status === 'INWORKFLOW' ){      
    //   return false;
    // }
    return true;
}

export const isModifyMode = () =>{
    let isMode = getQueryArg(window.location.href, "mode");
    return (isMode && isMode.toUpperCase() === 'MODIFY');
}

export const isModifyModeAction = () =>{
    let isMode = getQueryArg(window.location.href, "modeaction");
    return (isMode && isMode.toUpperCase() === 'EDIT');
}
export const showHideFieldsFirstStep = (dispatch, propertyId, value) => {
    if(propertyId){
      dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardFirstStep.children.IDDetails.children.cardContent.children.propertyID.children.propertyID",
          "props.value",
          propertyId
        )
      );
    }
    dispatch(
        handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.IDDetails.children.cardContent.children.propertyIDDetails",
        "visible",
        value
        )
    );
    dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardFirstStep.children.Details",
          "visible",
          value
        )
    );
    dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardFirstStep.children.ownerDetails",
          "visible",
          value
        )
    );
    dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardFirstStep.children.connectionHolderDetails",
          "visible",
          value
        )
    );
}
export const savebillGeneration = async (state, dispatch,billGeneration) => {
    const tenantId =  getTenantId();
    let queryObject = [
      {
        key: "tenantId",
        value: tenantId
      }
    ];
    try {       
           
        const response = await httpRequest(
                "post", 
                "/ws-services/billGeneration/_saveBilling",
                 "", 
                 queryObject,
                 { billGeneration: billGeneration}
                 );
           // dispatch(prepareFinalObject("WaterConnection", response.WaterConnection));
           // setApplicationNumberBox(state, dispatch);
        //}
        if(response)
        {
           // alert('success')
           dispatch(toggleSnackbar(
            true,
            { labelName: "succcess ", labelKey: "WS_SUCCESS" },
            "success"
          ))
            return response;
        }
        
    } catch (error) {
        dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
        console.log(error);
       // return false;
    }
   
   
    // try {
    //   const response = await httpRequest(
    //     "post",
    //     "/ws-service/billGeneration/_saveBilling",
    //     "",
    //     queryObject,
    //     { billGeneration: payload}
    //   );
    //   return response;
    // } catch (error) {
    //   dispatch(
    //     toggleSnackbar(
    //       true,
    //       { labelName: error.message, labelKey: error.message },
    //       "error"
    //     )
    //   );
    //   throw error;
    // }
  };
  export const getDataExchangeFile = async (queryObject , api,fromdate,todate,doctype) => {

    try {
      store.dispatch(toggleSpinner());
      const response = await httpRequest(
        "post",
        api,     
        "",
        queryObject,
        { billGeneration: {fromDate:fromdate,toDate:todate,dataExchangeType:doctype}}
      );
      store.dispatch(toggleSpinner());
      return response;
    } catch (error) {
      store.dispatch(
        toggleSnackbar(
          true,
          { labelName: error.message, labelKey: error.message },
          "error"
        )
      );
      store.dispatch(toggleSpinner());
     // throw error;
    }
  
  };
  export const generateBillFile = async (queryObject , api) => {

    try {
      store.dispatch(toggleSpinner());
      const response = await httpRequest(
        "post",
        api,     
        "",
        queryObject,
        { billGeneration: {}}
      );
      store.dispatch(toggleSpinner());
      return response;
    } catch (error) {
      store.dispatch(
        toggleSnackbar(
          true,
          { labelName: error.message, labelKey: error.message },
          "error"
        )
      );
      store.dispatch(toggleSpinner());
     // throw error;
    }
  
  };
  export const WNSConfigName =()=>{
    return {
        ONE_TIME_FEE_WS: "PUBLIC_HEALTH_SERVICES_DIV2",
        ONE_TIME_FEE_SW: "PUBLIC_HEALTH_SERVICES_DIV4",
      
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
       "REGULARWSCONNECTION",//1
       "TEMPORARY_WSCONNECTION",//2
       "TEMPORARY_WSCONNECTION_BILLING",//3
       "WS_TEMP_TEMP",//4
       "WS_TEMP_REGULAR",//5
       "WS_DISCONNECTION",//6
       "WS_TEMP_DISCONNECTION",//7
       "WS_RENAME",//8
       "WS_METER_UPDATE",//9
       "WS_CONVERSION",//10
       "WS_REACTIVATE",//11
       "WS_TUBEWELL",//12
       "WS_METER_TESTING"//13
  
      ]
    }
  }
  export const propertyUpdateCitizen = async (state, dispatch) => {

    let applicationStatus =get(
        state.screenConfiguration.preparedFinalObject,
      "WaterConnection[0].applicationStatus"
    );
    let applicationNo = get(state.screenConfiguration.preparedFinalObject, "WaterConnection[0].applicationNo", null);
    let connectionNo = get(state.screenConfiguration.preparedFinalObject, "WaterConnection[0].connectionNo", null);     
    if(applicationNo && (connectionNo === null && applicationStatus ==='INITIATED') )
    {
  
      let propertyData = get(
        state,
        "screenConfiguration.preparedFinalObject.applyScreen.property"
      );
      let tenantId = get(
        state,
        "screenConfiguration.preparedFinalObject.applyScreenMdmsData.tenant.tenants[0].code"
      );
      let doorNo =propertyData.address.doorNo
      if(doorNo.length ===1)
      {
        doorNo =`000${doorNo}` 
      }
      else if(doorNo.length ===2)
      {
        doorNo =`00${doorNo}` 
      } 
      else if(doorNo.length ===3)
      {
        doorNo =`0${doorNo}` 
      } 
      set(propertyData, "address.doorNo", doorNo.toUpperCase());
      propertyData.landArea = (propertyData.landArea);
      propertyData.totalConstructedArea = (propertyData.landArea);
      propertyData.tenantId = tenantId;
      //set usage category
      let usageCategory = get(state.screenConfiguration.preparedFinalObject, "applyScreen.property.usageCategory", '');
      let subusageCategory = get(state.screenConfiguration.preparedFinalObject, "applyScreen.property.subusageCategory", '');
      if(usageCategory!== null)
      {
      if(usageCategory.split('.').length ===1)
      {
      //st
      set(propertyData, "usageCategory", subusageCategory);
  
      }
    }
    if(subusageCategory!== null)
    {
      if(subusageCategory.split('.').length ===2)
      {
      //set 
      set(propertyData, "usageCategory", subusageCategory);
      }
    }
    let code = get(
        state.screenConfiguration.preparedFinalObject,
        "applyScreen.property.address.locality.code"
      )
       if(code.value)
       {
        code = code.value
       }
       set(propertyData, "address.locality.code", code);
      set(propertyData, "creationReason", "UPDATE");
      let response_ = await propertyUpdate(state, dispatch,propertyData)
    }
  
  }
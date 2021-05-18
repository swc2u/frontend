
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId, getUserInfo, setapplicationMode, setapplicationNumber } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import store from "redux/store";
import { getTranslatedLabel } from "../ui-config/screens/specs/utils";
import { httpRequest } from "./api";
import { toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
// import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";



export const commonConfig = {
  
  tenantId: "ch.chandigarh"
  // forgotPasswordTenant: "ch.chandigarh",
};
export const TypeOfServiceRequest = {
  
  PRUNLESSTHAN90: "PRUNING OF TREES GIRTH LESS THAN OR EQUAL TO 90 CMS",
  PRUNMORETHAN90: "PRUNING OF TREES GIRTH GREATER THAN 90 CMS",
  REMOVALOFGREEN: "REMOVAL OF GREEN TREES",
  REMOVALOFDEADDRY: "REMOVAL OF DEAD/DANGEROUS/DRY TREES",
};
export const NumberOfTreesInPruning = {
  
  DefaultTrees: 1,
  
};


export const getLocaleLabelsforTL = (label, labelKey, localizationLabels) => {
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

export const getSearchResultsEmployeeRequestFilter = async (data) => {
  // debugger
  
  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/hc-services/serviceRequest/_get",
      "",
      [],
      data
    );
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

export const getSearchResults = async queryObject => {
  let data = {
    "iscitizen" : 1
  };
  try {
    const response = await httpRequest(
      "post",
      "/hc-services/serviceRequest/_get",
      "",
      [],
      data
    );
    store.dispatch(toggleSpinner())
    return response;

  } catch (error) {
    store.dispatch(toggleSpinner())
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }

};

export const getCurrentAssigneeUserNameAndRole = async (dispatch,userId) => {
  var tenantIdCommonConfig
      if (getTenantId() != commonConfig.tenantId){
          tenantIdCommonConfig = JSON.parse(getUserInfo()).permanentCity
      }
      else{
        tenantIdCommonConfig = getTenantId()
      }
  
  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      `/egov-hrms/employees/_search?ids=${userId}&tenantId=${tenantIdCommonConfig}`,
      "_search",  
      [],
      
    );
    return(payload)
   
  } catch (e) {
    console.log(e);
  }};

  export const getSearchResultsForFilters = async (filterdata) => {
    
    let data = filterdata
   
    try {
      store.dispatch(toggleSpinner());
      const response = await httpRequest(
        "post",
        "/hc-services/serviceRequest/_get",
        "",
        [],
        data
      );
      store.dispatch(toggleSpinner());
      return response;
  
    } catch (error) {
      store.dispatch(toggleSpinner());
      store.dispatch(
        toggleSnackbar(
          true,
          { labelName: error.message, labelCode: error.message },
          "error"
        )
      );
    }
  
  };

export const getSearchResultsView = async queryObject => {


  try {
    //debugger
    const response = await httpRequest(
      "post", "hc-services/serviceRequest/_getDetail", "",
      [],
      {
        "service_request_id": queryObject[1].value,
        "tenantId":queryObject[0].value
        }
      
    );
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true, { labelName: error.message, labelCode: error.message }, "error"
      )
    );
  }
  
};

export const setRadioButtonResponse =  (serviceRequestType, subType,  dispatch) => {

  if(serviceRequestType === TypeOfServiceRequest.REMOVALOFDEADDRY)
  {
    dispatch(handleField("apply",
    "components.div.children.formwizardFirstStep.children.servicerequestdetailsEdit.children.cardContent.children.servicerequestdetailsContainer.children.serviceRequestSubtype",
    "props.buttons[0].disabled",
    false
  )
);
dispatch(handleField("apply",
    "components.div.children.formwizardFirstStep.children.servicerequestdetailsEdit.children.cardContent.children.servicerequestdetailsContainer.children.serviceRequestSubtype",
    "props.buttons[1].disabled",
    false
  )
);
dispatch(handleField("apply",
    "components.div.children.formwizardFirstStep.children.servicerequestdetailsEdit.children.cardContent.children.servicerequestdetailsContainer.children.serviceRequestSubtype",
    "props.buttons[2].disabled",
    false
  )
);
dispatch(handleField("apply",
    "components.div.children.formwizardFirstStep.children.servicerequestdetailsEdit.children.cardContent.children.servicerequestdetailsContainer.children.serviceRequestSubtype",
    "props.value",
    subType
  )
);
  }
  else{
    dispatch(handleField("apply",
          "components.div.children.formwizardFirstStep.children.servicerequestdetailsEdit.children.cardContent.children.servicerequestdetailsContainer.children.serviceRequestSubtype",
          "props.buttons[0].disabled",
          true
        )
      );
      dispatch(handleField("apply",
          "components.div.children.formwizardFirstStep.children.servicerequestdetailsEdit.children.cardContent.children.servicerequestdetailsContainer.children.serviceRequestSubtype",
          "props.buttons[1].disabled",
          true
        )
      );
      dispatch(handleField("apply",
          "components.div.children.formwizardFirstStep.children.servicerequestdetailsEdit.children.cardContent.children.servicerequestdetailsContainer.children.serviceRequestSubtype",
          "props.buttons[2].disabled",
          true
        )
      );
      dispatch(handleField("apply",
      "components.div.children.formwizardFirstStep.children.servicerequestdetailsEdit.children.cardContent.children.servicerequestdetailsContainer.children.serviceRequestSubtype",
      "props.value",
      undefined
    )
  );
  }

  
  
};
export const setTreeCountFieldEnableDisable =  (serviceRequestType,  dispatch) => {
  
        if(serviceRequestType ===TypeOfServiceRequest.PRUNLESSTHAN90 || serviceRequestType ===TypeOfServiceRequest.PRUNMORETHAN90 ){
         
        dispatch(handleField("apply",
        "components.div.children.formwizardFirstStep.children.servicerequestdetailsEdit.children.cardContent.children.servicerequestdetailsContainer.children.nooftrees",
        "props.disabled",
        true
      ))
      }
      else{
      
      dispatch(handleField("apply",
      "components.div.children.formwizardFirstStep.children.servicerequestdetailsEdit.children.cardContent.children.servicerequestdetailsContainer.children.nooftrees",
      "props.disabled",
      false
      ))
      }
  
  
};

export const returnNameFromCodeMdmsorViceVersa = (JSonArrayFromWhichValueToBeFiltered, valueToBeFiltered,codeRequiredOrName) => {
  
 
  var nameArray = []
  var keyValuePairObtainedFromFilter = []
  var codeArray = []
  var codeString = ""
  var nameString = ""
  
  keyValuePairObtainedFromFilter = JSonArrayFromWhichValueToBeFiltered.filter(function (state) {
    if (valueToBeFiltered === state.code )
    return state 
  });
  //if name is required from code
    if(codeRequiredOrName == 1)
   {
     nameArray = keyValuePairObtainedFromFilter.map(element => element.name )
     nameString = nameArray.join(",") 
     return nameString
    
  }
  else
 {  
  codeArray = keyValuePairObtainedFromFilter.map(element => element.code )
  codeString = codeArray.join(",") 
  return codeString
}

};
export const prepareDocumentsUploadData = (state, dispatch, type) => {
  let documents = '';
  if (type == "serviceRequestIDProof") {
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.applyScreenMdmsData['eg-horticulture'].IDProofDocument",
      []
    );
  }
  
  else {
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.applyScreenMdmsData.PetNOC.Documents",
      []
    );
  }

  documents = documents.filter(item => {
    return item.active;
  });
  let documentsContract = [];
  let tempDoc = {};
  documents.forEach(doc => {
    let card = {};
    card["code"] = doc.documentType;
    card["title"] = doc.documentType;
    card["cards"] = [];
    tempDoc[doc.documentType] = card;
  });

  documents.forEach(doc => {
    // Handle the case for multiple muildings
   
     if (doc.code === "HORTICULTURE.ID_PROOF" && doc.hasMultipleRows && doc.options) {

      let buildingsData = get(state,
        "screenConfiguration.preparedFinalObject.applyScreenMdmsData['eg-horticulture'].IDProofDocument",
        []
      );

      buildingsData.forEach(building => {
        let card = {};
        card["name"] = building.name;
        card["code"] = doc.code;
        card["hasSubCards"] = true;
        card["subCards"] = [];
        doc.options.forEach(subDoc => {
          let subCard = {};
          subCard["name"] = subDoc.code;
          subCard["required"] = subDoc.required ? true : false;
          card.subCards.push(subCard);
        });
        tempDoc[doc.documentType].cards.push(card);
      });
    }
  
    else {
      let card = {};
      card["name"] = doc.code;
      card["code"] = doc.code;
      card["required"] = doc.required ? true : false;
      if (doc.hasDropdown && doc.dropdownData) {
        let dropdown = {};
        dropdown.label = "HC_SELECT_DOC_DD_LABEL";
        dropdown.required = true;
        dropdown.menu = doc.dropdownData.filter(item => {
          return item.active;
        });
        dropdown.menu = dropdown.menu.map(item => {
          return { code: item.code, label: getTransformedLocale(item.code) };
        });
        card["dropdown"] = dropdown;
      }
      tempDoc[doc.documentType].cards.push(card);
    }
  });

  Object.keys(tempDoc).forEach(key => {
    documentsContract.push(tempDoc[key]);
  });

  dispatch(prepareFinalObject("documentsContract", documentsContract));
};
export const furnishServiceRequestDetailResponse = (state, response, dispatch) => {
  debugger
  let refurnishresponse = {};
  var serviceRequestType = []
  var sectorData = []
  serviceRequestTypeCodeFromResponse = []
  serviceRequestType = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData['eg-horticulture'].ServiceType")
  sectorData = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData['RAINMAKER-PGR'].Sector")

  //setting service request type data
  var serviceRequestTypeFromResponse = serviceRequestType.filter(function (state) {
    if (response.ResponseBody[0].service_type === state.code )
    return state 
  });
  var serviceRequestTypeCodeFromResponse = serviceRequestTypeFromResponse.map(element => element.code )
  var finalserviceRequestTypeCodeFromResponse = serviceRequestTypeCodeFromResponse.join(",")
  serviceRequestTypeFromResponse = serviceRequestTypeFromResponse.map(element => element.name )
  var serviceRequestTypeNameFromResponse = serviceRequestTypeFromResponse.join(",")

  // setting sector data 
  var sectorDataFromResponse = sectorData.filter(function (state) {
    if (response.ResponseBody[0].locality === state.code )
    return state 
  });
  var sectorDataNameFromResponse = sectorDataFromResponse.map(element => element.name )
   sectorDataNameFromResponse = sectorDataNameFromResponse.join(",") 
   var sectorDataCodeFromResponse = sectorDataFromResponse.map(element => element.code )
   sectorDataCodeFromResponse = sectorDataCodeFromResponse.join(",") 


  if(response.ResponseBody[0].servicerequestsubtype != null && response.ResponseBody[0].servicerequestsubtype != undefined && response.ResponseBody[0].servicerequestsubtype != ""  ){
    var serviceRequestSubtype =  response.ResponseBody[0].servicerequestsubtype
    serviceRequestSubtype = JSON.parse(serviceRequestSubtype)
    response.ResponseBody[0].servicerequestsubtype = serviceRequestSubtype.subservicetype
  }
  setRadioButtonResponse(finalserviceRequestTypeCodeFromResponse, response.ResponseBody[0].servicerequestsubtype, dispatch)
  setTreeCountFieldEnableDisable(finalserviceRequestTypeCodeFromResponse, dispatch)
  set(refurnishresponse, "contactNumber", response.ResponseBody[0].contact_number);
  set(refurnishresponse, "subType", response.ResponseBody[0].servicerequestsubtype);
  set(refurnishresponse, "description", response.ResponseBody[0].description);
  set(refurnishresponse, "ownerName", response.ResponseBody[0].owner_name);
  set(refurnishresponse, "tenantId", response.ResponseBody[0].tenant_id);
  set(refurnishresponse, "email", response.ResponseBody[0].email_id);
  set(refurnishresponse, "mohalla", {value:sectorDataCodeFromResponse, label:sectorDataNameFromResponse});
  set(refurnishresponse, "houseNoAndStreetName", response.ResponseBody[0].street_name);
  set(refurnishresponse, "landmark", response.ResponseBody[0].landmark);
  set(refurnishresponse, "latitude", response.ResponseBody[0].latitude);
  set(refurnishresponse, "longitude", response.ResponseBody[0].longitude);
  set(refurnishresponse, "address", response.ResponseBody[0].location);
  set(refurnishresponse, "serviceType", {value:finalserviceRequestTypeCodeFromResponse, label:serviceRequestTypeNameFromResponse});
  set(refurnishresponse, "treeCount", response.ResponseBody[0].tree_count);
  set(refurnishresponse, "service_request_id", response.ResponseBody[0].service_request_id);
  set(refurnishresponse, "media", JSON.parse(response.ResponseBody[0].service_request_document));
  
  set(refurnishresponse, "isEditState", 1);
  return refurnishresponse;
};
export const furnishServiceRequestDetailResponseForEdit = (response, state,dispatch)=> {
  debugger
  let refurnishresponse = {};
  var serviceRequestType = []
  var sectorData = []
  serviceRequestType = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData['eg-horticulture'].ServiceType")
  sectorData = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData['RAINMAKER-PGR'].Sector")

  //setting service request type data
  var serviceRequestTypeFromResponse = serviceRequestType.filter(function (state) {
    if (response.serviceType === state.code )
    return state 
  });
  var serviceRequestTypeCodeFromResponse = serviceRequestTypeFromResponse.map(element => element.code )
  var serviceRequestTypenameFromResponse = serviceRequestTypeFromResponse.map(element => element.name )
  var finalserviceRequestTypeCodeFromResponse = serviceRequestTypeCodeFromResponse.join(",")
  var finalServiceRequestTypeNameFromResponse = serviceRequestTypenameFromResponse.join(",")

  // setting sector data 
  var sectorDataFromResponse = sectorData.filter(function (state) {
    if ( response.mohalla === state.code )
    return state 
  });
  var sectorDataNameFromResponse = sectorDataFromResponse.map(element => element.name )
  var sectorDataCodeFromResponse = sectorDataFromResponse.map(element => element.code )
  var finalSectorDataNameFromResponse = sectorDataNameFromResponse.join(",")
  var finalSectorDataCodeFromResponse = sectorDataCodeFromResponse.join(",")
  
 

  set(refurnishresponse, "contactNumber", response.contactNumber);
  set(refurnishresponse, "description", response.description);
  set(refurnishresponse, "ownerName", response.ownerName);
  set(refurnishresponse, "tenantId", response.tenantId);
  set(refurnishresponse, "email", response.email);
  set(refurnishresponse, "mohalla", {value:finalSectorDataCodeFromResponse, label:finalSectorDataNameFromResponse});
  set(refurnishresponse, "houseNoAndStreetName", response.houseNoAndStreetName);
  set(refurnishresponse, "landmark", response.landmark);
  set(refurnishresponse, "latitude", response.latitude);
  set(refurnishresponse, "longitude", response.longitude);
  set(refurnishresponse, "address", response.address);
  set(refurnishresponse, "serviceType", {value:finalServiceRequestTypeNameFromResponse, label: finalserviceRequestTypeCodeFromResponse});
  set(refurnishresponse, "subType", response.subType);
  set(refurnishresponse, "treeCount", response.treeCount);
  set(refurnishresponse, "service_request_id", response.service_request_id);
  // set(refurnishresponse, "media", JSON.parse(response.media));
  
  set(refurnishresponse, "isEditState", 1);
  return refurnishresponse;
};
export const setApplicationNumberBox = (state, dispatch) => {

  let applicationNumber = get(state, "state.screenConfiguration.preparedFinalObject.SERVICEREQUEST.service_request_id", null);

  if (applicationNumber) {
    dispatch(
      handleField(
        "apply",
        "components.div.children.headerDiv.children.header.children.service_request_id",
        "visible",
        true
      )
    );
    dispatch(
      handleField(
        "apply",
        "components.div.children.headerDiv.children.header.children.service_request_id",
        "props.number",
        applicationNumber
      )
    );
  }
};

export const findItemInArrayOfObject = (arr, conditionCheckerFn) => {
  // debugger
  for (let i = 0; i < arr.length; i++) {
    if (conditionCheckerFn(arr[i])) {
      return arr[i];
    }
  }
};



export const EditServiceRequest = async (state, dispatch, status) => {
  let response = '';
  
  let method = "CREATE";

  try {
    
    let payload = get(state.screenConfiguration.preparedFinalObject, "SERVICEREQUEST", []);
    // console.log("payload"+payload)
   
    let service_request_id_for_edit
    try{
      service_request_id_for_edit = payload.service_request_id
    }
    catch(e){
      service_request_id_for_edit= "";
    }
    let response = '';
    setapplicationMode(status);
    let arraypayload=[]
    arraypayload.push(payload);

    if (method === "CREATE") {
      
      dispatch(toggleSpinner());
      response = await httpRequest("post", "hc-services/serviceRequest/_create", "", [], {services: arraypayload });

      if (response.ResponseInfo.status === 'successful') {
        dispatch(prepareFinalObject("SERVICES", response));
        setapplicationNumber(service_request_id_for_edit);

        setApplicationNumberBox(state, dispatch);
        dispatch(toggleSpinner());
        return { status: "successful", message: response };
      } else {
        dispatch(toggleSpinner());
        return { status: "fail", message: response };
      }
    } 

  } catch (error) {
    dispatch(toggleSpinner());
    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));

  }
};

export const createServiceRequest = async (state, dispatch, status) => {
let response = '';

let method = "CREATE";

try {
  
  let payload = get(state.screenConfiguration.preparedFinalObject, "SERVICEREQUEST", []);
  console.log("payload",payload)

  let response = '';
  setapplicationMode(status);
  let arraypayload=[]
  arraypayload.push(payload);

  if (method === "CREATE") {
    
    dispatch(toggleSpinner());

    response = await httpRequest("post", "hc-services/serviceRequest/_create", "", [], {services: arraypayload });
    
    
    if (response.services[0].serviceRequestId !== 'null' || response.services[0].serviceRequestId !== '') {
      dispatch(prepareFinalObject("SERVICES", response));
    
      setapplicationNumber(response.services[0].service_request_id);
      
    
      
      setApplicationNumberBox(state, dispatch);
      dispatch(toggleSpinner());
      return { status: "success", message: response };
    } else {
      dispatch(toggleSpinner());
      return { status: "fail", message: response };
    }
  } 

} catch (error) {
  dispatch(toggleSpinner());
  dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));

  
  
  return { status: "failure", message: error };
}
};


// Demo API call

export const demoAPICall = async (state, dispatch, status) => {
  let response = '';
	let method = "CREATE";

	try {
	  let payload = "PAYLOAD_DEMO"
	  console.log("payload",payload)
	  let response = '';
	  // setapplicationMode(status);
	  let arraypayload=[]
	  arraypayload.push(payload);
	  if (method === "CREATE") {
		dispatch(toggleSpinner());
		response = await httpRequest("post", "DEMO/hc-services/serviceRequest/_create", "", [], {services: arraypayload });
		
		if (response.services[0].serviceRequestId !== 'null' || response.services[0].serviceRequestId !== '') {
		  dispatch(prepareFinalObject("SERVICES", response));
		  setapplicationNumber(response.services[0].service_request_id);
		  setApplicationNumberBox(state, dispatch);
		  dispatch(toggleSpinner());
		  return { status: "success", message: response };
		} else {
		  dispatch(toggleSpinner());
		  return { status: "fail", message: response };
		}
	  } 

	} catch (error) {
	  dispatch(toggleSpinner());
	  dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
	  return { status: "failure", message: error };
	}
};

export const previewWF = async (state, dispatch, status) => {
  let response = '';
	let method = "CREATE";

	try {
    debugger
    const serviceName =  get(state.screenConfiguration.preparedFinalObject, "dropDownData2", {});
	  let payload = "PAYLOAD_DEMO"
	  console.log("payload",payload)
	  let response = '';
	  // setapplicationMode(status);
	  let arraypayload=[]
	  arraypayload.push(payload);
	  if (method === "CREATE") {
		dispatch(toggleSpinner());
		response = await httpRequest("post", "egov-workflow-v2/egov-wf/businessservice/_search?businessServices="+ serviceName.value +"&tenantId=ch", "", [], {services: arraypayload });
    
    dispatch(prepareFinalObject("WF_PREVIEW", response));

    var data = get(
      state,
      "screenConfiguration.preparedFinalObject.WF_PREVIEW",
      {});

    // dispatch(
    //     handleField("review_petnoc",
    //     "components.div.children.body.children.cardContent.children.reportCardGraph",
    //     "props.data.demo",
    //     data
    //     )
    //     );

    dispatch(
      handleField("preview",
      "components.div.children.body.children.cardContent.children.reportCardGraph",
      "props.data.demo",
      data
      )
      );
       
    dispatch(toggleSpinner());
    return { status: "success", message: response };
  
    
		if (response.services[0].serviceRequestId !== 'null' || response.services[0].serviceRequestId !== '') {
		  dispatch(prepareFinalObject("SERVICES", response));
		  setapplicationNumber(response.services[0].service_request_id);
		  setApplicationNumberBox(state, dispatch);
		  dispatch(toggleSpinner());
		  return { status: "success", message: response };
		} else {
		  dispatch(toggleSpinner());
		  return { status: "fail", message: response };
		}
	  } 

	} catch (error) {
	  dispatch(toggleSpinner());
	  dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
	  return { status: "failure", message: error };
	}
};

export const getData = async (state, dispatch, status) =>  {
  let response = '';
	let method = "CREATE";

	try {
    
    debugger
    const serviceName =  get(state.screenConfiguration.preparedFinalObject, "dropDownData2", {});
	  let payload = "PAYLOAD_DEMO"
	  console.log("payload",payload)
	  let response = '';
	  // setapplicationMode(status);
	  let arraypayload=[]
	  arraypayload.push(payload);
	  if (method === "CREATE") {
		dispatch(toggleSpinner());
		response = await httpRequest("post", "egov-workflow-v2/egov-wf/businessservice/_search?businessServices="+ serviceName.value +"&tenantId=ch", "", [], {services: arraypayload });
    
    // dispatch(prepareFinalObject("WF_PREVIEW", response));
    debugger

    const allData = {
      "modulewiseWF" : [
        {
        "moduleName" : "OPMS",
        "wfName" : "PETNOC",
        "wfCode" : "PETNOC",
        "wfDesc" : "PETNOC Descripton"
        },
        {
        "moduleName" : "OPMS",
        "wfName" : "SELLMEATNOC",
        "wfCode" : "SELLMEATNOC",
        "wfDesc" : "SELLMEATNOC Descripton"
        },
        {
        "moduleName" : "OPMS",
        "wfName" : "ADVERTISEMENTNOC",
        "wfCode" : "ADVERTISEMENTNOC",
        "wfDesc" : "ADVERTISEMENTNOC Descripton"
        },
        {
        "moduleName" : "OPMS",
        "wfName" : "ROADCUTNOC",
        "wfCode" : "ROADCUTNOC",
        "wfDesc" : "ROADCUTNOC Descripton"
        },
        {
        "moduleName" : "RentedProperties",
        "wfName" : "OwnershipTransferRP",
        "wfCode" : "OwnershipTransferRP",
        "wfDesc" : "OwnershipTransfer Descripton"
        },
        {
        "moduleName" : "RentedProperties",
        "wfName" : "OwnershipTransferRP",
        "wfCode" : "OwnershipTransferRP",
        "wfDesc" : "OwnershipTransferRP Descripton"
        }
        ]
    }

    debugger
    
    const filterData = allData.modulewiseWF.filter(function (el) {
      return el.moduleName == serviceName.value ;
    });

    if(filterData.length > 0){
      dispatch(
        handleField("module_preview",
        "components.div.children.body.children.cardContent.children.moduleWiseWorkflow",
        "props.data",
        filterData
        )
        );
        
      dispatch(prepareFinalObject("WF_CHARTDATA", filterData));
    }else{
      const data =  get(state.screenConfiguration.preparedFinalObject, "WF_CHARTDATA", []);

      dispatch(
        handleField("module_preview",
        "components.div.children.body.children.cardContent.children.moduleWiseWorkflow",
        "props.data",
        data
        )
        );
    }   
    dispatch(toggleSpinner());
    return { status: "success", message: response };
  
    
		if (response.services[0].serviceRequestId !== 'null' || response.services[0].serviceRequestId !== '') {
		  dispatch(prepareFinalObject("SERVICES", response));
		  setapplicationNumber(response.services[0].service_request_id);
		  setApplicationNumberBox(state, dispatch);
		  dispatch(toggleSpinner());
		  return { status: "success", message: response };
		} else {
		  dispatch(toggleSpinner());
		  return { status: "fail", message: response };
		}
	  } 

	} catch (error) {
	  dispatch(toggleSpinner());
	  dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
	  return { status: "failure", message: error };
	}
};

export const getDashboardDropdownData = async (state, dispatch, status) =>  {
  let response = '';
	let method = "";

	try {
    
    debugger
    // const serviceName =  get(state.screenConfiguration.preparedFinalObject, "dropDownData2", {});
	  let payload = "PAYLOAD_DEMO"
	  console.log("payload",payload)
    let response = '';
    let response2 = '';
	  // setapplicationMode(status);
	  let arraypayload=[]
	  arraypayload.push(payload);
	  if (method === "") {
		dispatch(toggleSpinner());
		response = await httpRequest("post", "egov-workflow-v2/egov-wf/businessservice/_search?businessServices=DEMO&tenantId=ch", "", [], {services: arraypayload });
    
    // dispatch(prepareFinalObject("WF_PREVIEW", response));
    debugger
    var data =  [
      {
          "name" : "PGR",
          "code" : "rainmaker-pgr"
      },
      {
          "name" : "Module 2",
          "code" : "Module 2"
      }
      ]
    var selectedDefaultData = {value: "rainmaker-pgr", label: "PGR"}
    dispatch(prepareFinalObject("dahsboardHome.dropDownData", data));
    dispatch(prepareFinalObject("dahsboardHome.dropDownData2", selectedDefaultData));

    const dashboardModuleSelected =  get(state.screenConfiguration.preparedFinalObject, "dropDownData2", {});
	  response2 = await httpRequest("post", "egov-workflow-v2/egov-wf/businessservice/_search?businessServices="+dashboardModuleSelected.value+"&tenantId=ch", "", [], {services: arraypayload });
    
    var reportdata =  [
      {
          "name" : "Complaint Type",
          "code" : "ComplaintTypesReport"
      },
      {
          "name" : "Source Wise",
          "code" : "SourceWiseReport"
      },
      {
        "name" : "Department Wise",
        "code" : "DepartmentReport"
      }
      ]
    var selectedDefaultReportData = {value: "ComplaintTypesReport", label: "Complaint Type"}
    dispatch(prepareFinalObject("dahsboardHome.reportDropDownData", reportdata));
    dispatch(prepareFinalObject("dahsboardHome.reportdefaultDropDownData", selectedDefaultReportData));
    
    // Date dispatch to component
    const fromDate =  get(state.screenConfiguration.preparedFinalObject, "dahsboardHome.defaultFromDate", "");
    const toDate =  get(state.screenConfiguration.preparedFinalObject, "dahsboardHome.defaulttoDate", "");
    
    dispatch(
      handleField(
        "home",
        "components.div.children.FilterFormforEmployee.children.cardContent.children.FilterConstraintsContainer.children.fromDate",
        "props.value",
        fromDate
      )
    );

    dispatch(
      handleField(
        "home",
        "components.div.children.FilterFormforEmployee.children.cardContent.children.FilterConstraintsContainer.children.toDate",
        "props.value",
        toDate
      )
    );
    // const filterData = allData.modulewiseWF.filter(function (el) {
    //   return el.moduleName == serviceName.value ;
    // });

    // if(filterData.length > 0){
    //   dispatch(
    //     handleField("module_preview",
    //     "components.div.children.body.children.cardContent.children.moduleWiseWorkflow",
    //     "props.data",
    //     filterData
    //     )
    //     );
        
    //   dispatch(prepareFinalObject("WF_CHARTDATA", filterData));
    // }else{
    //   const data =  get(state.screenConfiguration.preparedFinalObject, "WF_CHARTDATA", []);

    //   dispatch(
    //     handleField("module_preview",
    //     "components.div.children.body.children.cardContent.children.moduleWiseWorkflow",
    //     "props.data",
    //     data
    //     )
    //     );
    // }
    dispatch(toggleSpinner());
    return { status: "success", message: response };
  
    
		if (response.services[0].serviceRequestId !== 'null' || response.services[0].serviceRequestId !== '') {
		  dispatch(prepareFinalObject("SERVICES", response));
		  setapplicationNumber(response.services[0].service_request_id);
		  setApplicationNumberBox(state, dispatch);
		  dispatch(toggleSpinner());
		  return { status: "success", message: response };
		} else {
		  dispatch(toggleSpinner());
		  return { status: "fail", message: response };
		}
	  } 

	}catch (error) {
	  dispatch(toggleSpinner());
	  dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
	  return { status: "failure", message: error };
	}
};

export const getStoreDropdownData = async (action, state, dispatch) => {
  debugger;
  // STore MDMS Store data
  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/store-asset-services/stores/_search?tenantId="+getTenantId(),
      "",
      [],
      []
    );

    // alert("OK....")
    // dispatch(prepareFinalObject("StoreName", response));
    var storeDropdown = []
    for(var i=0; i<response.stores.length; i++){
      var storeData = {}
      storeData["name"] = response.stores[i].name;
      storeData["code"] = response.stores[i].code;
      storeDropdown.push(storeData);
    }
    dispatch(prepareFinalObject("dahsboardHome.storeName", storeDropdown));
    var storeData = {}
    storeData["label"] = response.stores[0].name;
    storeData["value"] = response.stores[0].code;
    dispatch(prepareFinalObject("dahsboardHome.storeNameDefault", storeData));
    store.dispatch(toggleSpinner());
    // return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }

  debugger;
  // Store MDMS Financial data
  try {
    store.dispatch(toggleSpinner());
    var mdmsCriteria = {
      "MdmsCriteria": {
      "tenantId": "ch",
        "moduleDetails": [
          {
            "moduleName": "egf-master",
            "masterDetails": [
              {
                "name": "FinancialYear"
              }
            ]
          },
          {
            "moduleName": "store-asset",
            "masterDetails": [
              {
                "name": "businessService"
              }
            ]
          }
        ]
      }
    }
    const response = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "",
      [],
      mdmsCriteria
    );
    // Store MDMS data Financial Year

    var sortYearData = response;

    const financialRes = response.MdmsRes["egf-master"]["FinancialYear"];
    var Yeardata = []
    for(var i=0; i<financialRes.length; i++ ){
        var demo = {};
        demo["name"] = financialRes[i].name;
        demo["code"] = financialRes[i].code;
        Yeardata.push(demo);
    }
    var selectedYear = {value: Yeardata[0].code, label: Yeardata[0].name};
    dispatch(prepareFinalObject("dahsboardHome.financialYearData", Yeardata));
    dispatch(prepareFinalObject("dahsboardHome.selectedFinancialYearData", selectedYear));
    
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
}

export const getDashboardResult = async ( dispatch, data ) => {
  debugger

  const payloadData = data
  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      // "/hc-services/serviceRequest/_get_DEMO_DASHBOARD", 
      "/report/"+ payloadData.moduleName +"/"+ payloadData.reportName +"/_get?tenantId=ch.chandigarh&pageSize=false&offset=0",
      "",
      [],
      payloadData
    );

    dispatch(prepareFinalObject("dashboardSearchData", response));

    dispatch(
      handleField("dashboardType",
      "components.div.children.dashboardTypeSearchResults.children.cardContent.children.dashboardResult.children.customGraph",
      "props.data",
      response
      )
      );

    dispatch(
      handleField("dashboardSource",
      "components.div.children.dashboardSourceSearchResults.children.cardContent.children.dashboardResult.children.customGraph",
      "props.data",
      response
        )
        );
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

// All Complaint Types DAshboard Result
export const getAllDashboardResult = async ( dispatch, data ) => {
  debugger

  const moduleName = "rainmaker-pgr" 
  const reportName = ["ComplaintTypesReport", "SourceWiseReport", "DepartmentReport"]
  var payloadData = data
  payloadData["reportName"] = reportName[0];
  payloadData["moduleName"] = moduleName;
  
  try {
    store.dispatch(toggleSpinner());
    const ComplaintTypeResponse = await httpRequest(
      "post",
      // "/hc-services/serviceRequest/_get_DEMO_DASHBOARD", 
      "/report/rainmaker-pgr/ComplaintTypesReport/_get?tenantId=ch.chandigarh&pageSize=false&offset=0",
      "",
      [],
      payloadData
    );
    payloadData["reportName"] = reportName[1];
    const SourceWiseResponse = await httpRequest(
      "post",
      // "/hc-services/serviceRequest/_get_DEMO_DASHBOARD", 
      "/report/rainmaker-pgr/SourceWiseReport/_get?tenantId=ch.chandigarh&pageSize=false&offset=0",
      "",
      [],
      payloadData
    );
    payloadData["reportName"] = reportName[2];
    const DepartmentResponse = await httpRequest(
      "post",
      // "/hc-services/serviceRequest/_get_DEMO_DASHBOARD", 
      "/report/rainmaker-pgr/DepartmentReport/_get?tenantId=ch.chandigarh&pageSize=false&offset=0",
      "",
      [],
      payloadData
    );

    debugger
    var response = []
    response.push(ComplaintTypeResponse.reportResponses[0]);
    response.push(SourceWiseResponse.reportResponses[0]);
    response.push(DepartmentResponse.reportResponses[0]);

    dispatch(prepareFinalObject("allDashboardSearchData", response));

    dispatch(
      handleField("dashboardType",
      // "components.div.children.dashboardTypeSearchResults.children.cardContent.children.customGraph",
      "components.div.children.dashboardTypeSearchResults",
      "props.data",
      response
      )
      );
    
    dispatch(
      handleField("dashboardType",
      // "components.div.children.dashboardTypeSearchResults.children.cardContent.children.customGraph",
      "components.div.children.dashboardSearchResultHorizontalBar",
      "props.data",
      response
      )
      );

    dispatch(
      handleField("dashboardSource",
      "components.div.children.dashboardSourceSearchResults.children.cardContent.children.dashboardResult.children.customGraph",
      "props.data",
      response
        )
        );
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

// Get Description Report
export const getDescriptionReport = async ( dispatch, data ) => {
  debugger

  const moduleName = "rainmaker-pgr" 
  const reportName = "DescriptionReport"
  var payloadData = data
  payloadData["reportName"] = reportName;
  payloadData["moduleName"] = moduleName;
  
  try {
    store.dispatch(toggleSpinner());
    const DescriptionReport = await httpRequest(
      "post",
      // "/hc-services/serviceRequest/_get_DEMO_DASHBOARD", 
      "/report/rainmaker-pgr/DescriptionReport/_get?tenantId=ch.chandigarh&pageSize=false&offset=0",
      "",
      [],
      payloadData
    );

    debugger
    var response = DescriptionReport
    dispatch(prepareFinalObject("allDashboardSearchData", response));

    // OK
    dispatch(
      handleField("PGRDashboard",
      "components.div.children.PGRDashboardResults",
      "props.data",
      response
      )
      );
      
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};


// Get Description Report New Function
export const getDescriptionReportDashboard = async ( dispatch, data ) => {
  
  //debugger;
  const moduleName = "rainmaker-pgr" 
  const reportName = "DescriptionReport"
  var payloadData = data
  payloadData["reportName"] = reportName;
  payloadData["moduleName"] = moduleName;
  
  try {
    store.dispatch(toggleSpinner());
    const DescriptionReport = await httpRequest(
      "post",
      // "/hc-services/serviceRequest/_get_DEMO_DASHBOARD", 
      "/report/rainmaker-pgr/DescriptionReport/_get?tenantId=ch.chandigarh&pageSize=false&offset=0",
      "",
      [],
      payloadData
    );

    debugger
    var response = [ DescriptionReport, payloadData.reportSortBy ];
    dispatch(prepareFinalObject("allDashboardSearchData", response));

    // OK
    dispatch(
      handleField("PGRDashboard",
      "components.div.children.PGRDashboardResults",
      // "components.div.children.PGRDashboardResults.children.dashboardResult",
      "props.data",
      response
      )
      );
      
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

// Get Dashboard Data for Horticulture 
export const getHCDashboardData = async ( dispatch, data ) => {
  
  //debugger;
  const moduleName = "rainmaker-pgr" 
  const reportName = "DescriptionReport"
  var payloadData = data
  payloadData["reportName"] = reportName;
  payloadData["moduleName"] = moduleName;

  var HCPayload = {
    "fromDate": payloadData.searchParams[0].input,
    "toDate": payloadData.searchParams[1].input,
    "sortBy": payloadData.reportSortBy.value,
    "dataPayload": {}
  }
  
  try {
    store.dispatch(toggleSpinner());
    const DescriptionReport = await httpRequest(
      "post",
      // "egov-workflow-v2/egov-wf/businessservice/_desc?tenantId=ch.chandigarh", 
      "/hc-services/serviceRequest/_get",
      "",
      [],
      HCPayload
    );

    // Working from here is pending
    //debugger;
    var response = [ DescriptionReport, HCPayload.sortBy ];
    dispatch(prepareFinalObject("allDashboardSearchData", response));

    // OK
    dispatch(
      handleField("HCDashboard",
      "components.div.children.HCDashboardResults",
      "props.data",
      response
      )
      );
      
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

// Get Dashboard Data for EChallan 
export const getEChallanDashboardData = async ( dispatch, data ) => {
  
  debugger;
  
  var payloadData = {
    "applicationType": "egov-echallan",
  "applicationStatus": null,
  "applicationId": null,
  "tenantId": data.tenantId,
  "RequestBody": {
    "tenantId": data.tenantId,
    "fromDate": data.fromDate,
    "toDate": data.toDate,
    "encroachmentType": "",
    "sector": "",
    "siName": "",
    "status": ""
  },
  "reportSortBy": data.reportSortBy
  }

  try {
    store.dispatch(toggleSpinner());
    const DescriptionReport = await httpRequest(
      "post",
      "/ec-services/violation/_search",
      "",
      [],
      payloadData
    );

    // Working from here is pending
    //debugger;
    var response = [ DescriptionReport, payloadData.reportSortBy ];
    dispatch(prepareFinalObject("allDashboardSearchData", response));

    // OK
    dispatch(
      handleField("EChallanDashboard",
      "components.div.children.EchallanDashboardResults",
      "props.data",
      response
      )
      );
      
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

// Get Dashboard Data for SportAndCulture
export const getSportAndCultureDashboardData = async ( dispatch, data ) => {
  
  debugger;
  
  var payloadData = {
  "tenantId": data.tenantId,
  "RequestBody": {
    "tenantId": data.tenantId,
    "moduleCode": "SCP",
    "eventDetailUuid": "",
    "eventTitle": "",
    "eventStatus": "",
    "status": "",
    "startDate": data.fromDate,
    "endDate": data.toDate,
    "eventId": "",
    "defaultGrid": false
  },
  "reportSortBy": data.reportSortBy
  }

  try {
    store.dispatch(toggleSpinner());
    const DescriptionReport = await httpRequest(
      "post",
      "/prscp-services/v1/event/_get",
      "",
      [],
      payloadData
    );

    //debugger;
    var response = [ DescriptionReport, payloadData.reportSortBy ];
    dispatch(prepareFinalObject("allDashboardSearchData", response));

    // OK
    dispatch(
      handleField(
      "SportCultureDashboard",
      "components.div.children.SportCultureDashboardResults",
      "props.data",
      response
      )
      );
      
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

// Get Dashboard Data for PublicRelation
export const getPublicRelationData = async ( dispatch, data ) => {
  
  debugger;
  // Same as per Sport and culture but module code is different
  var payloadData = {
  "tenantId": data.tenantId,
  "RequestBody": {
    "tenantId": data.tenantId,
    "moduleCode": "PR",
    "eventDetailUuid": "",
    "eventTitle": "",
    "eventStatus": "",
    "status": "",
    "startDate": data.fromDate,
    "endDate": data.toDate,
    "eventId": "",
    "defaultGrid": false
  },
  "reportSortBy": data.reportSortBy
  }

  try {
    store.dispatch(toggleSpinner());
    const DescriptionReport = await httpRequest(
      "post",
      "/prscp-services/v1/event/_get",
      "",
      [],
      payloadData
    );

    //debugger;
    var response = [ DescriptionReport, payloadData.reportSortBy ];
    dispatch(prepareFinalObject("allDashboardSearchData", response));

    // OK
    dispatch(
      handleField(
      "PublicRelationDashboard",
      "components.div.children.DashboardResults",
      "props.data",
      response
      )
      );
      
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

// Get Dashboard Data for NULM
export const getNULMData = async ( dispatch, data ) => {
  
  debugger;
  // const data = data;
  // Same as per Sport and culture but module code is different
  const check = data.reportSortBy.value;

  var payloadData = {};
  var resData;
  try {
    store.dispatch(toggleSpinner());
    if(check === "SEP"){
      payloadData = {
        "NULMSEPRequest": {
          "fromDate": data.fromDate,
          "toDate": data.toDate,
          "tenantId": getTenantId()
        },
        "reportSOrtBy": data.reportSortBy
      }
      resData = await httpRequest(
        "post",
        "/nulm-services/v1/sep/_get",
        "",
        [],
        payloadData
      );
    }
    if(check === "SMID"){
      payloadData = {
        "NULMSMIDRequest": {
          "fromDate": data.fromDate,
          "toDate": data.toDate,
          "tenantId": getTenantId()
        },
        "reportSOrtBy": data.reportSortBy
      }
      resData = await httpRequest(
        "post",
        "/nulm-services/v1/smid/_get",
        "",
        [],
        payloadData
      );
    }
    if(check === "SUSV"){
      payloadData = {
        "NulmSusvRequest": {
          "fromDate": data.fromDate,
          "toDate": data.toDate,
          "tenantId": getTenantId()
        },
        "reportSOrtBy": data.reportSortBy
      }
      resData = await httpRequest(
        "post",
        "/nulm-services/v1/susv/_get",
        "",
        [],
        payloadData
      );
    }
    if(check === "SUH"){
      payloadData = {
        "NulmSuhRequest": {
          "fromDate": data.fromDate,
          "toDate": data.toDate,
          "tenantId": getTenantId()
        },
        "reportSOrtBy": data.reportSortBy
      }
      resData = await httpRequest(
        "post",
        "/nulm-services/v1/suh/_get",
        "",
        [],
        payloadData
      );
    }
    if(check === "All Program"){
      var payloadData1 = {
        "NULMSEPRequest": {
          "fromDate": data.fromDate,
          "toDate": data.toDate,
          "tenantId": getTenantId()
        },
        "reportSOrtBy": data.reportSortBy
      }
      var resData1 = await httpRequest(
        "post",
        "/nulm-services/v1/sep/_get",
        "",
        [],
        payloadData1
      );
      var payloadData2 = {
        "NULMSMIDRequest": {
          "fromDate": data.fromDate,
          "toDate": data.toDate,
          "tenantId": getTenantId()
        },
        "reportSOrtBy": data.reportSortBy
      }
      var resData2 = await httpRequest(
        "post",
        "/nulm-services/v1/smid/_get",
        "",
        [],
        payloadData2
      );
      var payloadData3 = {
        "NulmSusvRequest": {
          "fromDate": data.fromDate,
          "toDate": data.toDate,
          "tenantId": getTenantId()
        },
        "reportSOrtBy": data.reportSortBy
      }
      var resData3 = await httpRequest(
        "post",
        "/nulm-services/v1/susv/_get",
        "",
        [],
        payloadData3
      );
      var payloadData4 = {
        "NulmSuhRequest": {
          "fromDate": data.fromDate,
          "toDate": data.toDate,
          "tenantId": getTenantId()
        },
        "reportSOrtBy": data.reportSortBy
      }
      var resData4 = await httpRequest(
        "post",
        "/nulm-services/v1/suh/_get",
        "",
        [],
        payloadData4
      );
      resData = {"SEP" : resData1,
      "SMID" : resData2,
      "SUSV" : resData3,
      "SUH" : resData4}
    }
    

    //debugger;
    var response = [ resData, data ];
    dispatch(prepareFinalObject("allDashboardSearchData", response));

    // // OK
    dispatch(
      handleField(
      "NULMDashboard",
      "components.div.children.DashboardResults",
      "props.data",
      response
      )
      );
      
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

// Get Dashboard Data for Pension
export const getPensionData = async ( state, dispatch, data ) => {
  
  // debugger;
  var payloadData = data;

  try {
    store.dispatch(toggleSpinner());
    const DescriptionReport = await httpRequest(
      "post",
      "/pension-services/v1/_searchPensionDisbursement?tenantId=ch.chandigarh&pageSize=200&offset=0",
      "",
      [],
      payloadData
    );

    // debugger;

    var response = [ DescriptionReport, "payloadData.reportSortBy" ];
    
    
    var listMonthData = get(state.screenConfiguration.preparedFinalObject,"allDashboardSearchData",{});
    listMonthData[payloadData.searchParams[1].input] = response[0].reportResponses[0].reportData;
    dispatch(prepareFinalObject("allDashboardSearchData", listMonthData));    
    dispatch(prepareFinalObject(payloadData.searchParams[1].input, response));
      
    store.dispatch(toggleSpinner());
    return listMonthData;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

// Get Pension Data from Three APIS
export const getEmpToRetirePensionData = async ( state, dispatch, data ) => {
  
  // debugger;
  var payloadData = data;

  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/report/rainmaker-pension/EmployeeToBeRetired/_get?tenantId=ch.chandigarh&pageSize=false&offset=0",
      "",
      [],
      payloadData
    );

    // debugger;      
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

export const getNormalPensionData = async ( state, dispatch, data ) => {
  
  // debugger;
  var payloadData = data;

  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/report/rainmaker-pension/RegularNormalPension/_get?tenantId=ch.chandigarh&pageSize=false&offset=0",
      "",
      [],
      payloadData
    );

    // debugger;      
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

export const getDeathOfEmpPensionData = async ( state, dispatch, data ) => {
  
  // debugger;
  var payloadData = data;

  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/report/rainmaker-pension/DeathOfAnEmployee/_get?tenantId=ch.chandigarh&pageSize=false&offset=0",
      "",
      [],
      payloadData
    );

    // debugger;
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

export const getDeathPensionerPensionData = async ( state, dispatch, data ) => {
  
  // debugger;
  var payloadData = data;

  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/report/rainmaker-pension/DeathOfPensioner/_get?tenantId=ch.chandigarh&pageSize=false&offset=0",
      "",
      [],
      payloadData
    );

    // debugger;

    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

// Get Dashboard Data for Rented Property CollectionReport
export const getRentedPropertyData = async ( dispatch, data ) => {
  
  debugger;
  var payloadRP = {
    "tenantId": data.tenantId,
    "reportName": "RPRentRegistryReport",
    "searchParams": [
      {
        "name": "fromDate",
        "input": data.fromDate
      },
      {
        "name": "toDate",
        "input": data.toDate
      }
    ],
    "reportSortBy": data.reportSortBy
  };
  var payloadOT ={
    "tenantId": data.tenantId,
    "reportName": "OTRegistryReport",
    "searchParams": [
      {
        "name": "fromDate",
        "input": data.fromDate
      },
      {
        "name": "toDate",
        "input": data.toDate
      }
    ],
    "reportSortBy": data.reportSortBy
  };
  var payloadDC = {
    "tenantId": data.tenantId,
    "reportName": "DCRegistryReport",
    "searchParams": [
      {
        "name": "fromDate",
        "input": data.fromDate
      },
      {
        "name": "toDate",
        "input": data.toDate
      }
    ],
    "reportSortBy": data.reportSortBy
  };

  var payloadDataDue = {
    "tenantId": data.tenantId,
    "reportName": "RPDueAmountReport",
    "searchParams": [],
    "reportSortBy": data.reportSortBy
  }

  try {
    store.dispatch(toggleSpinner());
    const resReistryReport = await httpRequest(
      "post",
      "/report/rainmaker-rp/RPRentRegistryReport/_get?tenantId="+getTenantId()+"&pageSize=false&offset=0",
      "",
      [],
      payloadRP
    );

    const resOwnerReport = await httpRequest(
      "post",
      "/report/rainmaker-rp/OTRegistryReport/_get?tenantId="+getTenantId()+"&pageSize=false&offset=0",
      "",
      [],
      payloadOT
    );

    const resDuplicateReport = await httpRequest(
      "post",
      "/report/rainmaker-rp/DCRegistryReport/_get?tenantId="+getTenantId()+"&pageSize=false&offset=0",
      "",
      [],
      payloadDC
    );

    const DueData = await httpRequest(
      "post",
      "/report/rainmaker-rp/RPDueAmountReport/_get?tenantId=ch.chandigarh&pageSize=false&offset=0",
      "",
      [],
      payloadDataDue
    );

    //debugger;
    var CollectionData = [resReistryReport, resOwnerReport, resDuplicateReport]
    const DescriptionReport = [CollectionData, DueData];
    var response = [ DescriptionReport, payloadDataDue ];
    dispatch(prepareFinalObject("allDashboardSearchData", response));

    // OK
    dispatch(
      handleField(
      "RentedPropertyDashboard",
      "components.div.children.DashboardResults",
      "props.data",
      response
      )
      );
      
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};


// Get Dashboard Data for Estate Data
export const getEStateData = async ( dispatch, data ) => {
  
  debugger;
  // Same as per Sport and culture but module code is different
  var payloadData = {
  "tenantId": data.tenantId,
  "RequestBody": {
    "tenantId": data.tenantId,
    "moduleCode": "",
    "eventDetailUuid": "",
    "eventTitle": "",
    "eventStatus": "",
    "status": "",
    "startDate": data.fromDate,
    "endDate": data.toDate,
    "eventId": "",
    "defaultGrid": false
  },
  "reportSortBy": data.reportSortBy
  }

  try {
    store.dispatch(toggleSpinner());
    const DescriptionReport = await httpRequest(
      "post",
      "/est-services/application/_search?branchType=EstateBranch",
      "",
      [],
      payloadData
    );

    //debugger;
    var response = [ DescriptionReport, payloadData.reportSortBy ];
    dispatch(prepareFinalObject("allDashboardSearchData", response));

    // OK
    dispatch(
      handleField(
      "EstateDashboard",
      "components.div.children.DashboardResults",
      "props.data",
      response
      )
      );
      
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

// Get Dashboard Data for TradeLicense
export const getTradeLicenseData = async ( dispatch, data ) => {
  
  debugger;
  // Same as per Sport and culture but module code is different
  var payloadData = data;

  try {
    store.dispatch(toggleSpinner());
    var DescriptionReport = [];
    const res1 = await httpRequest(
      "post",
      "/tl-services/v1/_search?tenantId="+data.tenantId+"&limit=100&fromDate="+data.fromDate+"&toDate="+data.toDate,
      // "/tl-services/v1/_search?tenantId="+data.tenantId+"&limit=100&fromDate="+data.fromDate+"&toDate="+data.toDate+"",
      "",
      [],
      {}
    );
    
    DescriptionReport = res1;
    //debugger;
    
    var response = [ DescriptionReport, payloadData ];
    dispatch(prepareFinalObject("allDashboardSearchData", response));

    // OK
    dispatch(
      handleField(
      "TradeLicenseDashboard",
      "components.div.children.DashboardResults",
      "props.data",
      response
      )
      );
      
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

// Get Dashboard Data for Eaawas
export const getEaawasData = async ( dispatch, data ) => {
  
  debugger;
  // Same as per Sport and culture but module code is different
  var payloadData = {
    "eawasRequest": {
      "wsmsconstrant": "Nic@Chandigarh@#123"
    }
  }

  try {
    store.dispatch(toggleSpinner());
    const DescriptionReport = await httpRequest(
      "post",
      "/integration-services/eawas/v1/_get",
      "",
      [],
      payloadData
    );

    //debugger;
    var response = DescriptionReport;
    dispatch(prepareFinalObject("allDashboardSearchData", response));

    // OK
    dispatch(
      handleField(
      "EaawasDashboard",
      "components.div.children.DashboardResults",
      "props.data",
      response
      )
      );
      
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

// Get Legal Dashboard Data
export const getLegalDashboardData = async ( dispatch, data ) => {
  
  debugger;
  // Same as per Sport and culture but module code is different
  var payloadData = {
  "tenantId": data.tenantId,
  "RequestBody": {
    "tenantId": data.tenantId,
    "moduleCode": "PR",
    "eventDetailUuid": "",
    "eventTitle": "",
    "eventStatus": "",
    "status": "",
    "startDate": data.fromDate,
    "endDate": data.toDate,
    "eventId": "",
    "defaultGrid": false
  },
  "reportSortBy": data.reportSortBy
  }
  var response = payloadData.reportSortBy ;
  try {
    store.dispatch(toggleSpinner());
    const DescriptionReport = await httpRequest(
      "get",
      "https://chandigarh-uat.chandigarhsmartcity.in/services/EGF/legalcase/getLegalCase",
      "",
      [],
      {}
    );

    //debugger;
    var response = [DescriptionReport, data]
    dispatch(
      handleField(
      "LegalDashboard",
      "components.div.children.DashboardResults",
      "props.data",
      response
      )
      );

    dispatch(prepareFinalObject("allDashboardSearchData", response));
      
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

export const getLegalDashboardData2 = async ( dispatch, data ) => {
  try {

    // let filestoreIds = get(queryObject[2], "value");

    const response = await httpRequest(
      "get",
      "https://chandigarh-uat.chandigarhsmartcity.in/services/EGF/legalcase/getLegalCase",
      "", 
      []);
    return response;

  } catch (error) {
    //alert("rrrrr")
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
}; 

// Get Agenda Dashboard Data
export const getAgendaDashboardData = async ( dispatch, data ) => {
  
  debugger;
  // Same as per Sport and culture but module code is different
  var payloadData = {
  "tenantId": data.tenantId,
  "RequestBody": {
    "tenantId": data.tenantId,
    "startDate": data.fromDate,
    "endDate": data.toDate,
    "defaultGrid": false
  },
  "reportSortBy": data.reportSortBy
  }
  var response = payloadData.reportSortBy ;
  try {
    store.dispatch(toggleSpinner());
    const getAllAgenda = await httpRequest(
      "get",
      "https://chandigarh-uat.chandigarhsmartcity.in/services/EGF/agenda/getAllAgenda",
      "",
      [],
      {}
    );

    const getAllMeeting = await httpRequest(
      "get",
      "https://chandigarh-uat.chandigarhsmartcity.in/services/EGF/agenda/getAllMeeting",
      "",
      [],
      {}
    );

    const getAllMoM = await httpRequest(
      "get",
      "https://chandigarh-uat.chandigarhsmartcity.in/services/EGF/agenda/getAllMom",
      "",
      [],
      {}
    );

    //debugger;
    var response = [
      {
        "respData": {
          "getAllAgenda": getAllAgenda,
          "getAllMom": getAllMoM,
          "getAllMeeting": getAllMeeting
        }
      },
      {
        "sortby": payloadData
      }
    ]

    dispatch(
      handleField(
      "AgendaDashboard",
      "components.div.children.DashboardResults",
      "props.data",
      response
      )
      );

    dispatch(prepareFinalObject("allDashboardSearchData", response));
      
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

// Get Audit Dashboard Data
export const getAuditData = async ( dispatch, data ) => {
  
  
  try {
    store.dispatch(toggleSpinner());
    const getAllAudit = await httpRequest(
      "get",
      "https://chandigarh-uat.chandigarhsmartcity.in/services/EGF/auditrest/getAllAudit",
      "",
      [],
      {}
    );
    
    var response = [getAllAudit, data]
    
    dispatch(
      handleField(
      "AuditDashboard",
      "components.div.children.DashboardResults",
      "props.data",
      response
      )
      );

    dispatch(prepareFinalObject("allDashboardSearchData", response));
      
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

// Get Dashboard Data for OPMS (Status))
export const getStatusOPMSData = async ( dispatch, data ) => {
  
  debugger;
  // Payload for all Status 4 API OPMS report 
  var petnocPayload = {
    "applicationType": "PETNOC",
    "applicationStatus": null,
    "reportName": "",
    "tenantId": data.tenantId,
    "dataPayload": {
      "fromDate": data.fromDate,
      "toDate": data.toDate,
      "applicationStatus": null
    },
    "reportSortBy": data.reportSortBy
  }

  var roadcutnocPayload = {
    "applicationType": "ROADCUTNOC",
    "applicationStatus": null,
    "reportName": "",
    "tenantId": data.tenantId,
    "dataPayload": {
      "fromDate": data.fromDate,
      "toDate": data.toDate,
      "applicationStatus": null
    },
    "reportSortBy": data.reportSortBy
  }

  var advertisementnocPayload = {
    "applicationType": "ADVERTISEMENTNOC",
    "applicationStatus": null,
    "reportName": "",
    "tenantId": data.tenantId,
    "dataPayload": {
      "fromDate": data.fromDate,
      "toDate": data.toDate,
      "applicationStatus": null
    },
    "reportSortBy": data.reportSortBy
  }

  var sellmeatnocPayload = {
    "applicationType": "SELLMEATNOC",
    "applicationStatus": null,
    "reportName": "",
    "tenantId": data.tenantId,
    "dataPayload": {
      "fromDate": data.fromDate,
      "toDate": data.toDate,
      "applicationStatus": null
    },
    "reportSortBy": data.reportSortBy
  }
  
  try {
    store.dispatch(toggleSpinner());
    const petnocStatusRes = await httpRequest(
      "post",
      "/pm-services/noc/_get",
      "",
      [],
      petnocPayload
    );

    const roadcutStatusRes = await httpRequest(
      "post",
      "/pm-services/noc/_get",
      "",
      [],
      roadcutnocPayload
    );
    
    const advertisementStatusRes = await httpRequest(
      "post",
      "/pm-services/noc/_get",
      "",
      [],
      advertisementnocPayload
    );
    
    const sellmeatStatusRes = await httpRequest(
      "post",
      "/pm-services/noc/_get",
      "",
      [],
      sellmeatnocPayload
    );

    const DescriptionReport2 = [];

    //debugger;
    var resJSON = {
      "PETNOC" : petnocStatusRes.nocApplicationDetail,
      "ROADCUTNOC": roadcutStatusRes.nocApplicationDetail,
      "ADVERTISEMENTNOC": advertisementStatusRes.nocApplicationDetail,
      "SELLMEATNOC": sellmeatStatusRes.nocApplicationDetail
    }
    var response = [ resJSON, petnocPayload.reportSortBy, petnocPayload ];
    dispatch(prepareFinalObject("allDashboardSearchData", resJSON));

    // OK
    dispatch(
      handleField(
      "OPMSDashboard",
      "components.div.children.DashboardResults",
      "props.data",
      response
      )
      );
      
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

export const getCollectionOPMSData = async ( dispatch, data ) => {
  
  debugger;
  
  const typewisePayloadData = {
    "applicationStatus": null,
    "tenantId": data.tenantId,
    "reportName": "RevenueCollectionReportApplicationTypeWise",
    "searchParams": [
      {
        "name": "fromDate",
        "input": data.fromDate
      },
      {
        "name": "toDate",
        "input": data.toDate
      }
    ],
    "reportSortBy" : data.reportSortBy
  };

  const sectorwisePayloadData = {
    "applicationStatus": null,
    "tenantId": data.tenantId,
    "reportName": "RevenueCollectionReportSectorWise",
    "searchParams": [
      {
        "name": "fromDate",
        "input": data.fromDate
      },
      {
        "name": "toDate",
        "input": data.toDate
      },
      {
        "name": "sector",
        "input": ""
      }
    ],
    "reportSortBy" : data.reportSortBy
  };

  try {
    store.dispatch(toggleSpinner());
    const typeWiseData = await httpRequest(
      "post",
      "/report/pm-services/RevenueCollectionReportApplicationTypeWise/_get",
      "",
      [],
      typewisePayloadData
    );

    const sectorWiseData = await httpRequest(
      "post",
      "/report/pm-services/RevenueCollectionReportSectorWise/_get",
      "",
      [],
      sectorwisePayloadData
    );;

    //debugger;
    var resJSON = {
      "revenueCollectionTypeWise" : typeWiseData.reportResponses,
      "revenueCollectionSectorWise": sectorWiseData.reportResponses,
    }
    var response = [ resJSON, typewisePayloadData.reportSortBy ];
    dispatch(prepareFinalObject("allDashboardSearchData", resJSON));

    // OK
    dispatch(
      handleField(
      "OPMSDashboard",
      "components.div.children.DashboardResults",
      "props.data",
      response
      )
      );
      
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

// Get Dashboard Data for OSBM
export const getOSBMData = async ( dispatch, data ) => {
  
  debugger;
  // Same as per Sport and culture but module code is different
  var payloadData = data

  try {
    store.dispatch(toggleSpinner());
    const DescriptionReport = await httpRequest(
      "post",
      // "/bookings/api/employee/_search?tenantId=ch.chandigarh",
      "/report/rainmaker-services/DescriptionReport/_get?tenantId="+getTenantId()+"&pageSize=false&offset=0",
      "",
      [],
      payloadData.payload
    );

    //debugger;
    var response = [ DescriptionReport, payloadData ];
    dispatch(prepareFinalObject("allDashboardSearchData", response));

    // OK
    dispatch(
      handleField(
      "OSBMDashboard",
      "components.div.children.DashboardResults",
      "props.data",
      response
      )
      );
      
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

// Get Dashboard Data for Store Indent Issue Note
export const getStoreIndentData = async ( dispatch, data ) => {
  
  // Same as per Sport and culture but module code is different
  var payloadData = data;

  try {
    store.dispatch(toggleSpinner());
    const DescriptionReport = await httpRequest(
      "post",
      "/store-asset-services/materialissues/_search?tenantId="+data.tenantId+"&fromStore="+data.storeName.value,
      "",
      [],
      []
    );

    var response = [ DescriptionReport, payloadData ];
    dispatch(prepareFinalObject("allDashboardSearchData", response));
    
    dispatch(
      handleField(
        "StoreDashboard",
        "components.div.children.DashboardResults",
        "props.data",
        response
      )
    );
    
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

// Get Dashboard Data for Store MaterialReceipt Data
export const getStoreMaterialReceiptData = async ( dispatch, data ) => {
  
  var payloadData = data;

  try {
    store.dispatch(toggleSpinner());
    const DescriptionReport = await httpRequest(
      "post",
      "/store-asset-services/receiptnotes/_search?tenantId="+data.tenantId+"&receiptType=PURCHASE%20RECEIPT&receivingStore="+data.storeName.value,
      "",
      [],
      []
    );

    //debugger;
    var response = [ DescriptionReport, payloadData ];
    dispatch(prepareFinalObject("allDashboardSearchData", response));

    dispatch(
      handleField(
        "StoreDashboard",
        "components.div.children.DashboardResults",
        "props.data",
        response
      )
    );

    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

// Get Dashboard Data for Store Purchase Order Data
export const getStorePurchaseOrderData = async ( dispatch, data ) => {
  
  var payloadData = data;

  try {
    store.dispatch(toggleSpinner());
    const openBalance = await httpRequest(
      "post",
      "/store-asset-services/openingbalance/_report?tenantId="+data.tenantId+"&storecode="+data.storeName.value
      +"&financialyear="+data.selectedYear.value+"&isprint=false",
      "",
      [],
      []
    );

    var dt = data.selectedYear.value;
    dt = dt.substring(dt.length, dt.length-2);
    var formattedDate = "20"+dt+"-12-31";
    const closeBalance = await httpRequest(
      "post",
      "/store-asset-services/openingbalance/_closingReport?tenantId="+data.tenantId+"&storecode="+data.storeName.value+"&asOnDate="+formattedDate+"&isprint=false",
      "",
      [],
      []
    );

    //debugger;
    var DescriptionReport = {
      "OpenBalance" : openBalance,
      "CloseBalance" : closeBalance
    };
    var response = [ DescriptionReport, payloadData ];
    dispatch(prepareFinalObject("allDashboardSearchData", response));

    dispatch(
      handleField(
        "StoreDashboard",
        "components.div.children.DashboardResults",
        "props.data",
        response
      )
    );

    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};



// Get Dashboard 1 data
// Get Dashboard Data for Store Purchase Order Data
export const getStorePurchaseOrderData2 = async ( dispatch, data ) => {
  
  debugger;
  // Same as per Sport and culture but module code is different
  // var payloadData = {
  //   "tenantId": data.tenantId,
  //   "startDate": data.fromDate,
  //   "endDate": data.toDate,
  //   "reportSortBy": data.reportSortBy
  // }

  var payloadData = data;

  try {
    store.dispatch(toggleSpinner());
    const DescriptionReport = await httpRequest(
      "post",
      "/store-asset-services/purchaseorders/_search?tenantId="+getTenantId()+"&store="+payloadData.storeName.value+"",
      "",
      [],
      []
    );

    //debugger;
    var response = [ DescriptionReport.purchaseOrders, payloadData ];
    dispatch(prepareFinalObject("allDashboardSearchData", response));

    // OK
    dispatch(
      handleField(
      "StoreIndentDashboard",
      "components.div.children.DashboardResults",
      "props.data",
      response
      )
      );
      
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};


// Get Dashboard Data for Store MaterialReceipt Data
export const getStoreMaterialReceiptData2 = async ( dispatch, data ) => {

debugger;
// Same as per Sport and culture but module code is different
// var payloadData = {
//   "tenantId": data.tenantId,
//   "startDate": data.fromDate,
//   "endDate": data.toDate,
//   "reportSortBy": data.reportSortBy
// }

var payloadData = data;

try {
  store.dispatch(toggleSpinner());
  const DescriptionReport = await httpRequest(
  "post",
  "store-asset-services/receiptnotes/_search?tenantId="+getTenantId()+"&receiptType=PURCHASE%20RECEIPT&receivingStore="
  +payloadData.storeName.value+"",
  "",
  [],
  []
  );

  //debugger;
  var response = [ DescriptionReport.MaterialReceipt, payloadData ];
  dispatch(prepareFinalObject("allDashboardSearchData", response));

  // OK
  dispatch(
  handleField(
  "StoreIndentDashboard",
  "components.div.children.DashboardResults",
  "props.data",
  response
  )
  );
  
  store.dispatch(toggleSpinner());
  return response;
} catch (error) {
  store.dispatch(toggleSpinner());
  store.dispatch(
  toggleSnackbar(
      true,
      { labelName: error.message, labelCode: error.message },
      "error"
  )
  );
}
};

// Get Dashboard Data for Store Indent Issue Note
export const getStoreIndentData2 = async ( dispatch, data ) => {

debugger;
// Same as per Sport and culture but module code is different
var payloadData = data;

try {
  store.dispatch(toggleSpinner());
  const DescriptionReport = await httpRequest(
  "post",
  "/store-asset-services/materialissues/_search?tenantId="+getTenantId()
  +"&fromStore="+payloadData.reportSortBy.value+"&issueFromDate="+payloadData.fromDate
  +"&issueToDate="+payloadData.toDate+"",
  "",
  [],
  []
  );

  //debugger;
  var response = [ DescriptionReport.materialIssues, payloadData ];
  dispatch(prepareFinalObject("allDashboardSearchData", response));

  // OK
  dispatch(
  handleField(
  "StoreIndentDashboard",
  "components.div.children.DashboardResults",
  "props.data",
  response
  )
  );
  
  store.dispatch(toggleSpinner());
  return response;
} catch (error) {
  store.dispatch(toggleSpinner());
  store.dispatch(
  toggleSnackbar(
      true,
      { labelName: error.message, labelCode: error.message },
      "error"
  )
  );
}
};

// Get Dashboard Data for Water n Sewerage
export const getWNSData = async ( dispatch, data ) => {
  
  debugger;
  // Same as per Sport and culture but module code is different
  var payloadData = {
  "tenantId": data.tenantId,
  "RequestBody": {
    "tenantId": data.tenantId,
    "moduleCode": "PR",
    "eventDetailUuid": "",
    "eventTitle": "",
    "eventStatus": "",
    "status": "",
    "startDate": data.fromDate,
    "endDate": data.toDate,
    "eventId": "",
    "defaultGrid": false
  },
  "reportSortBy": data.reportSortBy
  }
  // let response = payloadData.reportSortBy ;
  try {
    store.dispatch(toggleSpinner());
    
    const applicationList = await httpRequest(
      "post",
      "/ws-services/wc/_search?tenantId=ch.chandigarh&fromDate="+data.fromDate+"&toDate="+data.toDate+"",
      "",
      [],
      payloadData
    );

    var billPayload = {
      "billGeneration": {
        "fromDate":data.fromDate,
        "toDate":data.toDate
        }
    }
    const billData = await httpRequest(
      "post",
      "/ws-services/wsreport/_getBillReportData?",
      "",
      [],
      billPayload
    );

    // //debugger;
    var response = [ applicationList, billData, payloadData.reportSortBy ];
    // dispatch(prepareFinalObject("allDashboardSearchData", response));

    // // OK
    dispatch(
      handleField(
      "WNSDashboard",
      "components.div.children.DashboardResults",
      "props.data",
      response
      )
      );
      
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

// Get Dashboard Data for Water n Sewerage
export const getSewerageData = async ( dispatch, data ) => {
  
  debugger;
  try {
    store.dispatch(toggleSpinner());
    
    const sewerageApplication = await httpRequest(
      "post",
      "/sw-services/swc/_search?tenantId="+data.tenantId+"&fromDate="+data.fromDate+"&toDate="+data.toDate,
      "",
      [],
      {}
    );
    var response = [ sewerageApplication, data ];
    // dispatch(prepareFinalObject("allDashboardSearchData", response));

    // // OK
    dispatch(
      handleField(
      "SewerageDashboard",
      "components.div.children.DashboardResults",
      "props.data",
      response
      )
      );
      
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

// Get Dashboard Data for Work
export const getWorkData = async ( dispatch, data ) => {
  
  debugger;
  // Same as per Sport and culture but module code is different
  var payloadData = {
  "tenantId": data.tenantId,
  "startDate": data.fromDate,
  "endDate": data.toDate,
  "reportSortBy": data.reportSortBy
  }
  var response = payloadData.reportSortBy ;
  try {
    store.dispatch(toggleSpinner());
    const getAllEstimate = await httpRequest(
      "get",
      "https://chandigarh-uat.chandigarhsmartcity.in/services/EGF/dashboard/getAllEstimationPreparation",
      "",
      [],
      {}
    );
    const getAllDNIT = await httpRequest(
      "get",
      "https://chandigarh-uat.chandigarhsmartcity.in/services/EGF/dashboard/getAllDnit",
      "",
      [],
      {}
    );
    const getAllWorkAgreement = await httpRequest(
      "get",
      "https://chandigarh-uat.chandigarhsmartcity.in/services/EGF/dashboard/getAllWorkAgreementByMilestone",
      "",
      [],
      {}
    );

    var propsData = {
      "getAllEstimationPreparation" : getAllEstimate,
      "getAllDnit" : getAllDNIT,
      "getAllWorkAgreementByMilestone" : getAllWorkAgreement
    }
    //debugger;
    response = [ propsData, payloadData ];
    dispatch(prepareFinalObject("allDashboardSearchData", response));

    // // OK
    dispatch(
      handleField(
      "WorkDashboard",
      "components.div.children.DashboardResults",
      "props.data",
      response
      )
      );
      
    store.dispatch(toggleSpinner());
    return response;
  } catch (error) {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

//---------------------------------------DROPDOWN----------------------------------------
// API call for Dropdown Data
export const getWorkflowDropdownData = async (state, dispatch, status) => {
  let response = '';
	let method = "CREATE";

	try {
	  let payload = "PAYLOAD_DEMO"
	  console.log("payload",payload)
	  let response = '';
	  // setapplicationMode(status);
	  let arraypayload={"searchParams": [
      {
        "name": "fromDate",
        "input": 1610649000000
      },
      {
        "name": "toDate",
        "input": 1610735399000
      }
    ]}
	  if (method === "CREATE") {
    dispatch(toggleSpinner());
  
    // response = await httpRequest("post", "egov-workflow-v2/egov-wf/businessservice/_search?businessServices=ROADCUTNOC&tenantId=ch.chandigarh", "", [], {services: arraypayload });
    response = await httpRequest("post", 
    "/egov-workflow-v2/egov-wf/businessservice/_desc?tenantId=ch.chandigarh", 
    "",
    [], 
    {services: arraypayload });
 
    //debugger;
    const HARDDATA = response

		if (response) {
      dispatch(prepareFinalObject("DROPDOWNAPIDATA", HARDDATA));
      var dropdownOne = []
      var dropdownItem = {}
      var listData = HARDDATA.businessServiceDescription
      for(var i=0; i<listData.length; i++){
        var dropdownOneData = {"name":listData[i].business.toUpperCase(), "code": listData[i].business}
        dropdownOne.push(dropdownOneData)
        // dropdownOne.push(HARDDATA[i].business)
        dropdownItem[listData[i].business] = listData[i];
        // dropdownTwoDesc.push(dropdownItem)
      }
		  // setapplicationNumber(response.services[0].service_request_id);
      // setApplicationNumberBox(state, dispatch);
      var data =  [
      {
          "name" : "ROADCUTNOC",
          "code" : "ROADCUTNOC"
      },
      {
          "name" : "PETNOC",
          "code" : "PETNOC"
      }
      ]
      dispatch(prepareFinalObject("dropDownData", data));
      // dispatch(prepareFinalObject("DropdownOne", dropdownOne));
      // dispatch(prepareFinalObject("DropdownItem", dropdownItem));
      dispatch(prepareFinalObject("DropdownOne", dropdownOne));
      // First Element in Dropdown One
      var element = {"label": dropdownOne[0].name, "value": dropdownOne[0].code}
      dispatch(prepareFinalObject("selectedDropDownOneData", element))
      dispatch(prepareFinalObject("DropdownItem", dropdownItem));

      // First Element in Dropdown Two----------------------------------------
      var dropdownTwo = dropdownItem[element.value].businessService;
      var dropdownTwoService= []
      var dropdownTwoDesc= []
      var desc = {}
      for(var i=0; i<dropdownTwo.length; i++){
      var dropdownOneData = {"name":dropdownTwo[i].businessService.toUpperCase(), "code": dropdownTwo[i].businessService}
      // dropdownTwoService.push(dropdownTwo[i].businessService)
      dropdownTwoService.push(dropdownOneData);
      desc[dropdownTwo[i].businessService] = dropdownTwo[i].businessServiceDescription
      // dropdownTwoDesc.push(dropdownTwo[i].businessServiceDescription)
      dropdownTwoDesc.push(desc);
      }

      // dispatch(
      //   handleField(
      //     "review",
      //     "components.div.children.body.children.cardContent.children.buisnessService2",
      //     "visible",
      //     true
      //   )
      // );

      // First Element in Dropdown One
      var element = {"label": dropdownTwoService[0].name, "value": dropdownTwoService[0].code};
      dispatch(prepareFinalObject("selectedDropDownTwoData", element));

      dispatch(prepareFinalObject("DropdownTwo", dropdownTwoService));
      dispatch(prepareFinalObject("DropdownDescription", desc));

      let response = await workflowPreview(state, dispatch, status);
      // dispatch(prepareFinalObject("DropdownTwo", data));
		  dispatch(toggleSpinner());
		  return { status: "success", message: response };
		} else {
		  dispatch(toggleSpinner());
		  return { status: "fail", message: response };
		}
	  } 

	} catch (error) {
	  dispatch(toggleSpinner());
	  dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
	  return { status: "failure", message: error };
	}
};

// API call for Search workflowPreview Data
export const workflowPreview = async (state, dispatch, status) => {

  //debugger;
  let response = '';
	let method = "CREATE";

	try {
	  let payload = "PAYLOAD_DEMO"
	  console.log("payload",payload)
	  let response = '';
    // setapplicationMode(status);
    var getModuleNAme =  get(state, "screenConfiguration.preparedFinalObject.selectedDropDownTwoData");
    var workflowDescription =  get(state, "screenConfiguration.preparedFinalObject.DropdownDescription");
	  let arraypayload={}
	  if (method === "CREATE") {
    dispatch(toggleSpinner());
  
    response = await httpRequest("post", 
    "egov-workflow-v2/egov-wf/businessservice/_search?businessServices="+getModuleNAme.value+"&tenantId=ch.chandigarh", 
    "", 
    [], 
    {services: arraypayload });
    // response = await httpRequest("post", "egov-workflow-v2/egov-wf/businessservice/_desc?tenantId=ch.chandigarh", "", [], {services: arraypayload });
    
    //debugger;
    
    workflowDescription = workflowDescription[getModuleNAme.label]

		if (response) {
    
      dispatch(
        handleField("review",
        "components.div.children.WorkflowReport.children.cardContent.children.reportCardGraph",
        "props.data",
        [response, workflowDescription]
        )
      );

      dispatch(toggleSpinner());
		  return { status: "success", message: response };
		} else {
		  dispatch(toggleSpinner());
		  return { status: "fail", message: response };
		}
	  } 

	} catch (error) {
	  dispatch(toggleSpinner());
	  dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
	  return { status: "failure", message: error };
	}
}
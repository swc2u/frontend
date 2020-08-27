import { convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  toggleSnackbar,
  toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
//import { httpRequest } from "egov-ui-framework/ui-utils/api";
import {httpRequest } from './api'
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import store from "ui-redux/store";
import { getTranslatedLabel } from "../ui-config/screens/specs/utils";
import {  
  ActionMessage,
  ActionWorkflowAccessibility,
  WFConfig,
  ActionButton
  } from "./sampleResponses";
const handleDeletedCards = (jsonObject, jsonPath, key) => {
  let originalArray = get(jsonObject, jsonPath, []);
  let modifiedArray = originalArray.filter(element => {
    return element.hasOwnProperty(key) || !element.hasOwnProperty("isDeleted");
  });
  modifiedArray = modifiedArray.map(element => {
    if (element.hasOwnProperty("isDeleted")) {
      element["isActive"] = false;
    }
    return element;
  });
  set(jsonObject, jsonPath, modifiedArray);
};

// export const getLocaleLabelsforTL = (label, labelKey, localizationLabels) => {
//   if (labelKey) {
//     let translatedLabel = getTranslatedLabel(labelKey, localizationLabels);
//     if (!translatedLabel || labelKey === translatedLabel) {
//       return label;
//     } else {
//       return translatedLabel;
//     }
//   } else {
//     return label;
//   }
// };

export const findItemInArrayOfObject = (arr, conditionCheckerFn) => {
  for (let i = 0; i < arr.length; i++) {
    if (conditionCheckerFn(arr[i])) {
      return arr[i];
    }
  }
};

export const getSearchResults = async (queryObject, dispatch) => {
  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/pension-services/v1/_searchPensionNotificationRegister",
      // "/egov-hrms/employees/_search",
      "",
      queryObject
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
    throw error;
  }
};
export const getWorkflowAccessibility = async (queryObject, dispatch) => {
  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/pension-services/v1/_getWorkflowAccessibility",
      // "/egov-hrms/employees/_search",
      "",
      queryObject
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
    throw error;
  }
};
export const getPensionEmployees = async (queryObject, dispatch) => {
  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      //"/pension-services/v1/_searchEmployeeForDeathRegistration",
       "/pension-services/v1/_getPensionEmployees",
      "",
      queryObject
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
    throw error;
  }
};
export const getSearchResultsEmployeeForDeath = async (queryObject, dispatch) => {
  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      //"/pension-services/v1/_searchEmployeeForDeathRegistration",
       "/pension-services/v1/_searchEmployeeFromHRMS",
      "",
      queryObject
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
    throw error;
  }
};
export const getSearchPensioner = async (queryObject, dispatch) => {
  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/pension-services/v1/_searchPensioner",
      //"/pension-services/v1/_searchPensionerForDeathRegistration",
      // "/egov-hrms/employees/_search",
      "",
      queryObject
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
    throw error;
  }
};
export const getSearchPensionerForPensionRevision = async (queryObject, dispatch) => {
  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/pension-services/v1/_searchPensionerForPensionRevision",
      // "/egov-hrms/employees/_search",
      "",
      queryObject
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
    throw error;
  }
};
export const getsearchPensionRegister = async (queryObject, dispatch) => {
  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/pension-services/v1/_searchPensionRegister",
      // "/egov-hrms/employees/_search",
      "",
      queryObject
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
    throw error;
  }
};
export const searchClosedApplication = async (queryObject, dispatch) => {
  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/pension-services/v1/_searchClosedApplication",
      // "/egov-hrms/employees/_search",
      "",
      queryObject
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
    throw error;
  }
};
export const pushManualRegisterToPensionNotificationRegister = async (queryObject, dispatch) => {
  try {
    //store.dispatch(toggleSpinner());
    
    const response = await httpRequest(
      "post",
      "/pension-services/v1/pushManualRegisterToPensionNotificationRegister",
      // "/egov-hrms/employees/_search",
      "",
      queryObject
    );
    
    //store.dispatch(toggleSpinner());
    return response;
    
  } catch (error) {
    alert('i am at exception at module lable')
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};

export const getworkflowData = async (queryObject, dispatch) => {
  console.log(queryObject)
  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/pension-services/v1/_searchWorkflow",
      // "/egov-hrms/employees/_search",
      "",
      queryObject
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
    throw error;
  }
};
export const getworkflowhistoryData = async (queryObject, dispatch) => {
 
  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "egov-workflow-v2/egov-wf/process/_search",
      // "/egov-hrms/employees/_search",
      "",
      queryObject
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
    throw error;
  }
};
export const initiateRegularRetirementPension = async (state, dispatch, tenantId,code) => {
  try {
    let payload = [];
    set(payload[0], "tenantId", tenantId);
    set(payload[0], "code", code);


    let response;
    
      response = await httpRequest(
        "post",
        "/pension-services/v1/_initiateRegularRetirementPension",
        "",
        [],
        { Employees: payload }
      );
     // response = furnishNocResponse(response);
      dispatch(prepareFinalObject("Employees", response.Employee));
      setApplicationNumberBox(state, dispatch);
   
    return { status: "success", message: response };
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
    dispatch(prepareFinalObject("Employees", employeeData.Employees));

    return { status: "failure", message: error };
  }
};
export const createUpdateNPApplication = async (state, dispatch, status) => {
  let businessService = get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].businessService", '' )
  let _wfconfig = WFConfig()
  let step_calculation = false;
  let step = getQueryArg(window.location.href, "step");
  if(step === `WF_${businessService}_${_wfconfig.PENDING_FOR_CALCULATION}` && status ===ActionButton().BACKWORD)
  step_calculation = true;

  try{
    let payload =[]
    if(step_calculation)
    {
      // let queryObject = [
      //   {
      //     key: "businessIds",
      //   value: getQueryArg(window.location.href, "applicationNumber")
         
      //   }];
      // queryObject.push({
      //   key: "tenantId",
      //   value: getQueryArg(window.location.href, "tenantId")
      // });
      // response = await getworkflowData(queryObject);
       payload = get(state.screenConfiguration.preparedFinalObject, "ProcessInstances", [])
    }
    else
    {
      payload = get(
        state.screenConfiguration.preparedFinalObject,
        "ProcessInstances",
        []
      );

    }
   
  
   let wef = payload[0].employeeOtherDetails.wef
   if(wef=== null)
   {
     
    set(payload[0].employeeOtherDetails, "wef", 0);
    
   }
   let dateOfContingent = payload[0].employeeOtherDetails.dateOfContingent
   if(dateOfContingent=== null)
   {
    set(payload[0].employeeOtherDetails, "dateOfContingent", 0);
     
   }
   else if(dateOfContingent !== undefined)
   {
    set(payload[0].employeeOtherDetails, "dateOfContingent",  convertDateToEpoch(dateOfContingent));
   }
    //alert(status)
    if(status !=="INITIATE")
    {
      set(payload[0], "action", status);
    }
    if(step_calculation)
    {
      set(payload[0], "comment", get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].comment", '' ));
    }
    // set reasion for retirement in case of DOP and DOE
    let reasonForRetirement = payload[0].employeeOtherDetails.reasonForRetirement
    // set default false in case of RRP and reasonForRetirement is not ABOLITION_OF_POST
  if(reasonForRetirement !== "ABOLITION_OF_POST")
  {
    set(payload[0].employeeOtherDetails, "isTakenMonthlyPensionAndGratuity", false);
    set(payload[0].employeeOtherDetails, "isTakenGratuityCommutationTerminalBenefit", false);
    set(payload[0].employeeOtherDetails, "isTakenCompensationPensionAndGratuity", false);
  }

    
    
    if(reasonForRetirement=== null ||reasonForRetirement!== null )
    {
      
      switch(businessService)
        {
          

          case _wfconfig.businessServiceDOE:
            set(payload[0].employeeOtherDetails, "reasonForRetirement", _wfconfig.ReasionOfRetirement_DOE);
        break;
          case _wfconfig.businessServiceDOP:
            set(payload[0].employeeOtherDetails, "reasonForRetirement", _wfconfig.ReasionOfRetirement_DOP);
            break;

        }
    }
    let response = [];  
     response = await httpRequest(
        "post",
        "/pension-services/v1/_processWorkflow",
        "",
        [],
        { ProcessInstances: payload }
      );
      if(status ==="INITIATE")
    {
      //console.log(response.ResponseInfo.status);
      let message_ = ActionMessage()

      dispatch(toggleSnackbar(true, { labelName: message_.INITIATED}, "success"));
    }

    return response;
  }
 catch (error) {
  dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));

  // Revert the changed pfo in case of request failure
  // let fireNocData = get(
  //   state,
  //   "screenConfiguration.preparedFinalObject.ProcessInstances",
  //   []
  // );
  // fireNocData = furnishNocResponse({ FireNOCs: fireNocData });
  // dispatch(prepareFinalObject("FireNOCs", fireNocData.FireNOCs));

  return { status: "failure", message: error };
}

};
export const getEmployeeDisability = async (queryObject, dispatch) => {
  console.log(queryObject)
  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/pension-services/v1/_getEmployeeDisability",
      // "/egov-hrms/employees/_search",
      "",
      queryObject
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
    throw error;
  }
};
export const saveEmployeeDisability = async (state, dispatch) => {

  try{
    let payload = get(
      state.screenConfiguration.preparedFinalObject,
      "Employees",
      []
    );

    let response = [];  
     response = await httpRequest(
        "post",
        "/pension-services/v1/_saveEmployeeDisability",
        "",
        [],
        { Employees: payload }
      );
    return response;
  }
 catch (error) {
  dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
  return { status: "failure", message: error };
}

};
export const prepareDocumentsUploadData = (state, dispatch) => {
  let documents = get(
    state,
    "screenConfiguration.preparedFinalObject.ProcessInstances[0].documents",
    []
  );
  let isCommutationOpted = get(
    state,
    "screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.isCommutationOpted",
    false
  );
  let noDuesForAvailGovtAccomodation = get(
    state,
    "screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.noDuesForAvailGovtAccomodation",
    false
  );
  
 
  let documentsContract = [];
  let tempDoc = {};
 
  // for (let index = 0; index < documents.length; index++) {
  //   const element = documents[index];
  //    let documentHistory = get(
  //   state,
  //   `screenConfiguration.preparedFinalObject.ProcessInstances[0].documents[${index}].documentAudit`,
  //   []
    
  // );
  
  // }
 
 
  documents.forEach(doc => {
    let card = {};
    card["code"] = doc.documentType;
    card["title"] = doc.documentType;
    card["comment"] = doc.comment;
    card["url"] = doc.url;
    card["documentsUpload"] = doc.documentsUpload;
    card["documentComment"] = doc.documentComment;
    if(isCommutationOpted === true && doc.isMandatoryForCommutation)
    {
      //card["required"] = true;  
      card["required"] = false;  
    }
    else if(noDuesForAvailGovtAccomodation=== true && doc.isMandatoryForNoGovtAccomodation)
    {
       //card["required"] = true;  
       card["required"] = false;
    }
    else
    {
      card["required"] = doc.isMandatory;  
    }
    card["documentAudit"] = doc.documentAudit;  
    card["cards"] = [];
    tempDoc[doc.documentType] = card;
  });
  

  documents.forEach(doc => {   
      let card = {};
      card["title"] = doc.documentType;
      card["code"] = doc.documentType;
      card["comment"] = doc.comment;
      card["url"] = doc.url;
      card["documentsUpload"] = doc.documentsUpload;
      card["documentComment"] = doc.documentComment;
      if(isCommutationOpted === true && doc.isMandatoryForCommutation)
    {
      //card["required"] = true;  
      card["required"] = false; 
    }
    else if(noDuesForAvailGovtAccomodation=== true && doc.isMandatoryForNoGovtAccomodation)
    {
      //card["required"] = true;  
      card["required"] = false;
    }
    else
    {
      card["required"] = doc.isMandatory;  
    }
      card["documentAudit"] = doc.documentAudit;      
      tempDoc[doc.documentType].cards.push(card);    
  });
  
  Object.keys(tempDoc).forEach(key => {
    documentsContract.push(tempDoc[key]);
  });
  //set redx

    let documentsUploadRedux = {};

    let index = 0;
    let required = false;
    documents.forEach(docType => {
      if(isCommutationOpted === true && docType.isMandatoryForCommutation)
    {
       //required= true; 
       required = false 
    }
    else if(noDuesForAvailGovtAccomodation=== true && docType.isMandatoryForNoGovtAccomodation)
    {
      //required= true; 
      required = false
    }
    else
    {
      required = docType.isMandatory;  
    }
    documentsUploadRedux[index] = {
      documentType: docType.documentType,
      documentCode: docType.documentType,
      isDocumentRequired: required,
      isDocumentTypeRequired: false
    };
    index++;;
  });

  dispatch(prepareFinalObject("documentsContract", documentsContract));
  dispatch(prepareFinalObject("documentsUploadRedux", documentsUploadRedux));
};
export const claimReleaseWorkflowApplication = async (state, dispatch, isActive, Action,businessId) => {
  let WFBody = {
    ProcessInstances: [
      {
        businessId : businessId
      }       
  ]
  };
  try{
    let message  = ActionWorkflowAccessibility()
    let displaymessage =''
    let url='/pension-services/v1/_processWorkflow'
    //alert(isActive+'_'+Action)
    if(isActive)
    {
      if(Action ==="RELEASE")
      {
      url = '/pension-services/v1/_releaseWorkflow';
      }
      else if (Action ==="CLAIM")
      {
        url = '/pension-services/v1/_claimWorkflow';
      } 

     
        let response = await httpRequest(
            "post",
           url,
            "",
            [],
           WFBody
          );


          if(Action ==="RELEASE")
        {
        displaymessage = message.ActiveReleaseMessage;
        }
        else if (Action ==="CLAIM")
        {
          displaymessage = message.ActiveClaimMessage;
        } 

        dispatch(toggleSnackbar(true, { labelName: displaymessage}, "success"));
      }
      else
      {
        if(Action ==="RELEASE")
        {
        displaymessage = message.InActiveReleaseMessage;
        }
        else if (Action ==="CLAIM")
        {
          displaymessage = message.InActiveClaimMessage;
        } 

        dispatch(toggleSnackbar(true, { labelName: displaymessage}, "warning"));
  }
      //console.log(response.ResponseInfo.status);
      
   

    
  }
 catch (error) {
  dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));

}

};

export const getuserevents = async (queryObject, dispatch) => {
  
  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "egov-user-event/v1/events/_search",
      // "/egov-hrms/employees/_search",
      "",
      queryObject
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
    throw error;
  }

};
export const getsearchApplication = async (queryObject, dispatch) => {
  
  try {
    store.dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "/pension-services/v1/_searchApplication",
      // "/egov-hrms/employees/_search",
      "",
      queryObject
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
    throw error;
  }

};

export const prepareDocumentsUploadRedux = (state, dispatch) => {
  const {
    documentsList,
    documentsUploadRedux = {},
    prepareFinalObject
  } = this.props;
  let index = 0;
  documentsList.forEach(docType => {
    documentsUploadRedux[index] = {
      documentType: docType.code,
      documentCode: card.name,
      isDocumentRequired: docType.required,
      isDocumentTypeRequired: false
    };
    index++
  });
  prepareFinalObject("documentsUploadRedux", documentsUploadRedux);
};
export const setApplicationNumberBox = (state, dispatch, applicationNo) => {
  if (!applicationNo) {
    applicationNo = get(
      state,
      "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.applicationNumber",
      null
    );
  }

  if (applicationNo) {
    dispatch(
      handleField(
        "apply",
        "components.div.children.headerDiv.children.header.children.applicationNumber",
        "visible",
        true
      )
    );
    dispatch(
      handleField(
        "apply",
        "components.div.children.headerDiv.children.header.children.applicationNumber",
        "props.number",
        applicationNo
      )
    );
  }
};

export const getPMSPattern = type => {
  switch (type) {
    case "Name":
      return /^[^\$\"'<>?\\\\~`!@#$%^()+={}\[\]*,.:;“”‘’]{1,50}$/i;
    case "MobileNo":
      return /^[6789][0-9]{9}$/i;
      case "Percentage":
        return /^[0-9]{0,3}$/i;
    case "Amount":
      return /^[0-9]{0,18}$/i;
    case "Email":
      return /^(?=^.{1,64}$)((([^<>()\[\]\\.,;:\s$*@'"]+(\.[^<>()\[\]\\.,;:\s@'"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))$/i;
    case "Address":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*:;]{1,500}$/i;
    case "PAN":
      return /^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/i;
    case "TradeName":
      return /^[^\$\"'<>?\\\\~`!@#$%^()+={}\[\]*,.:;“”‘’]{1,100}$/i;
    case "Date":
      return /^[12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/i;
    case "UOMValue":
      return /^(0)*[1-9][0-9]{0,3}$/i;
    case "OperationalArea":
      return /^(0)*[1-9][0-9]{0,6}$/i;
    case "NoOfEmp":
      return /^(0)*[1-9][0-9]{0,2}$/i;
    case "GSTNo":
      return /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/i;
    case "DoorHouseNo":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,50}$/i;
    case "BuildingStreet":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,100}$/i;
    case "Pincode":
      return /^[1-9][0-9]{5}$/i;
    case "PropertyID":
      return /^[a-zA-z0-9\s\\/\-]$/i;
    case "ElectricityConnNo":
      return /^[0-9]{15}$/i;
    case "eventName":
      return /^[^\$\"'<>?\\\\~`!@#$%^()+={}\[\]*,.:;“”‘’]{1,65}$/i;
    case "eventDescription":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,500}$/i;
    case "FireNOCNo":
      return /^[a-zA-Z0-9-]*$/i;
    case "consumerNo":
      return /^[a-zA-Z0-9/-]*$/i;
      case "Comment":
        return /^[^\$\"'<>\\\\~`@$%^()+={}\[\]*:;]{1,500}$/i;
        case "WFComment":
        return /^[^\$\"'<>\\\\~`@$%^()+={}\[\]*:;]{1,120}$/i;
  }
};





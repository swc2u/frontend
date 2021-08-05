
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar, toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getFileUrlFromAPI, getMultiUnits, getQueryArg,getFileUrl } from "egov-ui-framework/ui-utils/commons";
import { getTenantId, getUserInfo, } from "egov-ui-kit/utils/localStorageUtils";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import store from "redux/store";

import { httpRequest } from "./api";

import { setRoute } from "egov-ui-framework/ui-redux/app/actions";


const role_name = JSON.parse(getUserInfo()).roles[0].code
export const getstoreTenantId = () => {
  let gettenantId = getTenantId()
  gettenantId = gettenantId.split('.')
  return gettenantId[0];
};
export const prefillDocuments = async (payload, destJsonPath, dispatch, jasonpath,Documents) => {
  
  let documentsUploadRedux = {};
  // const uploadedDocData = get(payload, sourceJsonPath);
  let uploadedDocs = await setNULMDocuments(payload,jasonpath, "WS");
  if (uploadedDocs !== undefined && uploadedDocs !== null && uploadedDocs.length > 0) {
      documentsUploadRedux = uploadedDocs && uploadedDocs.length && uploadedDocs.map((item, key) => {
          let docUploadRedux = {};
          if(Documents ==='SMIDDocuments')
          {
            docUploadRedux[key] = { documents: [{ fileName: item.name, fileUrl: item.link, fileStoreId: payload.NULMSMIDRequest.documentAttachemnt[key].filestoreId }] }; 
          }
          if(Documents ==='ALFDocuments')
          {
            docUploadRedux[key] = { documents: [{ fileName: item.name, fileUrl: item.link, fileStoreId: payload.NULMALFRequest.applicationDocument[key].filestoreId }] }; 
          }
          else if(Documents ==='SEPDocuments') 
          {
            docUploadRedux[key] = { documents: [{ fileName: item.name, fileUrl: item.link, fileStoreId: payload.NULMSEPRequest.applicationDocument[key].filestoreId }] }; 
          }
         
          else if(Documents ==='SUSVRDocuments') 
          {
            docUploadRedux[key] = { documents: [{ fileName: item.name, fileUrl: item.link, fileStoreId: payload.NulmSusvRenewRequest.documentAttachemnt[key].filestoreId }] }; 
          }
          else if(Documents ==='SusvDocuments')
          {
            docUploadRedux[key] = { documents: [{ fileName: item.name, fileUrl: item.link, fileStoreId: payload.NulmSusvRequest.applicationDocument[key].filestoreId }] };                 

          } 
          
         // docUploadRedux[key].documentType = `${payload}.${jasonpath}`[key].documentType;
          docUploadRedux[key].documentType =payload.documentsPreview[key].title;
          docUploadRedux[key].id = jasonpath[key].id;
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
      // if(payload.applyScreenMdmsData['NULM']!== undefined)
      //  payload.applyScreenMdmsData['NULM'].Documents;
      // impliment new document 

              let documents = '';
              let wsDocument ='';
              if(payload.applyScreenMdmsData['NULM']!== undefined)
              {
                //dList = payload.applyScreenMdmsData['NULM'].Documents; 
                dList = get(payload.applyScreenMdmsData['NULM'], Documents)

              }
              
              // if(wsDocument && wsDocument[0])
              //     dList = wsDocument[0].document;




      if(dList !== undefined && dList !==null){
          for(var i=0;i<dList.length;i++){
              for(var key in docs){
                  docType = docs[key].documentType
                 // if(dList[i].description === docType.substring(0,docType.lastIndexOf("."))){
                    if(dList[i].description.toUpperCase() === docType.toUpperCase()){
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
export const setNULMDocuments = async (payload, sourceJsonPath, businessService) => {
  
  const uploadedDocData = get(payload, sourceJsonPath);
  const uploadedDocData_ = payload.documentAttachemnt;
  const uploadedDocData__ = get(payload, "NULMSMIDRequest.documentAttachemnt");

  if (uploadedDocData !== "NA" && uploadedDocData.length > 0) {
      const fileStoreIds =
          uploadedDocData &&
          uploadedDocData
              .map((item) => {
                  return item.filestoreId;
              })
              .join(",");
      const fileUrlPayload = fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
      const reviewDocData =
          uploadedDocData &&
          uploadedDocData.map((item, index) => {
              return {
                  //title: `${businessService}_${item.documentType}`.replace(".", "_") || "",
                  title: `${item.documentType}`.replace(".", "_") || "",
                  link: (fileUrlPayload && fileUrlPayload[item.filestoreId] && getFileUrl(fileUrlPayload[item.filestoreId])) || "",
                  linkText: "View",
                  name:
                      (fileUrlPayload &&
                          fileUrlPayload[item.filestoreId] &&
                          decodeURIComponent(
                              getFileUrl(fileUrlPayload[item.filestoreId])
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
export const prepareDocumentsUploadData = async (state, dispatch, type) => {
  let documents = '';
  if (type == "SEPApplication") {
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.applyScreenMdmsData.NULM.SEPDocuments",
      []
    );
  }
  else if (type === "ALFApplication"){
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.applyScreenMdmsData.SMIDDocuments",
      []
    );
  }
  else if (type === "SMIDApplication"){
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.applyScreenMdmsData.NULM.SMIDDocuments",
      []
    );
  }  
  else if (type === "SUHApplication"){
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.applyScreenMdmsData.NULM.SUHDocuments",
      []
    );
  }
  else if(type === "SUSVApplication"){
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.applyScreenMdmsData.NULM.SusvDocuments",
      []
    );
  }
  else if(type === "SVRUApplication"){
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.applyScreenMdmsData.NULM.SUSVRDocuments",
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
    card["inputProps.accept"]=".jpeg";
    tempDoc[doc.documentType] = card;
  });

  documents.forEach(doc => {
    // Handle the case for multiple muildings
    const isHandicapped = get(state.screenConfiguration.preparedFinalObject, "NULMSEPRequest.isHandicapped");      
    const isDisabilityCertificateAvailable = get(state.screenConfiguration.preparedFinalObject, "NULMSEPRequest.isDisabilityCertificateAvailable");
    const lookingfor = get(state.screenConfiguration.preparedFinalObject, "NULMSEPRequest.lookingfor");
    const isDisability = get(state.screenConfiguration.preparedFinalObject, "NulmSusvRequest.isDisability");
    let card = {};
    card["name"] = doc.code;
    card["code"] = doc.code;
    if(isHandicapped ==='Yes'&& isDisabilityCertificateAvailable==="Yes" && doc.code ==='NULM_DISABILITY_CERTIFICATE')
    {
      card["required"] = true ;
    }
    else if(lookingfor === 'Application for Transfer of Registration on Death Cases'&& doc.code ==='NULM_NOC_DEPENDENT_FAMILY_MEMBER')
    {
      card["required"] = true ;
    }
    else if(isDisability && isDisability ==='Yes' && doc.code ==='NULM_DISABILITY_PROOF')
    {
      card["required"] = true ;
    }
    else
    {
      card["required"] = doc.required ? true : false;
    }
    
    if (doc.hasDropdown && doc.dropdownData) {
      let dropdown = {};
      dropdown.label = "NOC_SELECT_DOC_DD_LABEL";
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

  });

  Object.keys(tempDoc).forEach(key => {
    documentsContract.push(tempDoc[key]);
  });
  dispatch(prepareFinalObject("documentsContract", documentsContract));
};

export const getprintpdf = async (queryObject , api,pagename) => {
let requestBody ={}
  try {
    store.dispatch(toggleSpinner());
   const state = store.getState();
   // ALF 
   if(pagename ==='Alf')
   {
      const {NULMALFRequest} = state.screenConfiguration.preparedFinalObject;
      var FormatPayoad = {
        "account_number": NULMALFRequest.accountNumber,
        "address": NULMALFRequest.address,
        "alf_formated_through": NULMALFRequest.alfFormattedThrough,
        "registeration_date": NULMALFRequest.dof,
        "contact_number": NULMALFRequest.contact,
        "date_of_opening_account": NULMALFRequest.dateOfOpeningAccount,
        "date_of_formation": NULMALFRequest.dof,
        "branch_name": NULMALFRequest.branchName,
        "name": NULMALFRequest.name,
        "bank_name": NULMALFRequest.bankName,
        "adhaar_number": NULMALFRequest.adharNumber,
        "id": NULMALFRequest.registrationNo
      }
      const ALFApplication = [FormatPayoad]; 

      const fileStoreIdsObj = NULMALFRequest.applicationDocument.filter(docInfo => {
        if(docInfo.documentType==="Copy of Voter ID" || docInfo.documentType==="NULM_ALF_DOCUMENT") 
        return docInfo.filestoreId
      });

      if(fileStoreIdsObj.length > 0){
        const fileStoreIds = fileStoreIdsObj[0].filestoreId;
        const fileUrlPayload =  fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
        if(fileUrlPayload){
          const photoUrl = getFileUrl(fileUrlPayload[fileStoreIds]);
          ALFApplication[0].applicantPhoto = photoUrl;
          // Hard code value is set which is not get from API responce
          ALFApplication[0].corporationName = "MUNICIPAL CORPORATION CHANDIGARH";
          ALFApplication[0].corporationAddress = "New Deluxe Building, Sector 17, Chandigarh";
          ALFApplication[0].corporationContact = "+91-172-2541002, 0172-2541003";
          ALFApplication[0].corporationWebsite = "http://mcchandigarh.gov.in";
          ALFApplication[0].corporationEmail = null;
          requestBody = {ALFApplication}
        }
      }else{
        ALFApplication[0].corporationName = "MUNICIPAL CORPORATION CHANDIGARH";
        ALFApplication[0].corporationAddress = "New Deluxe Building, Sector 17, Chandigarh";
        ALFApplication[0].corporationContact = "+91-172-2541002, 0172-2541003";
        ALFApplication[0].corporationWebsite = "http://mcchandigarh.gov.in";
        ALFApplication[0].corporationEmail = null;
        requestBody = {ALFApplication}
      }
      //------------------------------------------------------------
      // var ALFApplication = [
      //   {
      //       "corporationName": "MUNICIPAL CORPORATION CHANDIGARH",
      //       "corporationAddress": "New Deluxe Building, Sector 17, Chandigarh",
      //       "corporationContact": "+91-172-2541002, 0172-2541003",
      //       "corporationWebsite": "http://mcchandigarh.gov.in",
      //       "corporationEmail": null,
      //       "account_number": "112233445566",
      //       "address": "address",
      //       "alf_formated_through": "alfFormatedThrough",
      //       "registeration_date": "registerationDate",
      //       "contact_number": "contactNumber",
      //       "date_of_opening_account": "Date of Opening Account",
      //       "date_of_formation": "dateOfFormation",
      //       "branch_name": "branchName",
      //       "name": "name",
      //       "bank_name": "bankName",
      //       "adhaar_number": "adhaarNumber",
      //       "id": "SHG/2021-22/000074"
      //   }
      // ]
      // requestBody = {ALFApplication}
    }
   if(pagename ==='Sep')
   {
    const {NULMSEPRequest} = state.screenConfiguration.preparedFinalObject;

    const SepApplication = [NULMSEPRequest]; 
    
    const fileStoreIdsObj = NULMSEPRequest.applicationDocument.filter(docInfo => {
      if(docInfo.documentType==="Photo copy of Applicant" || docInfo.documentType==="Photo of Applicant" || docInfo.documentType==="Applicant Photo – Passport Size") 
      return docInfo.filestoreId
      });
      const fileStoreIds = fileStoreIdsObj[0].filestoreId;
       const fileUrlPayload =  fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
       if(fileUrlPayload){
        const photoUrl = getFileUrl(fileUrlPayload[fileStoreIds]);
        SepApplication[0].applicantPhoto = photoUrl;
        // Hard code value is set which is not get from API responce
          SepApplication[0].corporationName = "MUNICIPAL CORPORATION CHANDIGARH";
          SepApplication[0].corporationAddress = "New Deluxe Building, Sector 17, Chandigarh";
          SepApplication[0].corporationContact = "+91-172-2541002, 0172-2541003";
          SepApplication[0].corporationWebsite = "http://mcchandigarh.gov.in";
          SepApplication[0].corporationEmail = null;
          requestBody = {SepApplication}
   }
  }
   else if(pagename ==='SMID')
   {
    const {NULMSMIDRequest} = state.screenConfiguration.preparedFinalObject;

    const SmidCitizenApplication = [NULMSMIDRequest]; 
    
    const fileStoreIdsObj = NULMSMIDRequest.documentAttachemnt.filter(docInfo => {
      if(docInfo.documentType==="Applicant Photo – Passport Size") 
      return docInfo.filestoreId
      });
      const fileStoreIds = fileStoreIdsObj[0].filestoreId;
       const fileUrlPayload =  fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
       if(fileUrlPayload){
        const photoUrl = getFileUrl(fileUrlPayload[fileStoreIds]);
        SmidCitizenApplication[0].applicantPhoto = photoUrl;
        // Hard code value is set which is not get from API responce
        SmidCitizenApplication[0].corporationName = "MUNICIPAL CORPORATION CHANDIGARH";
        SmidCitizenApplication[0].corporationAddress = "New Deluxe Building, Sector 17, Chandigarh";
        SmidCitizenApplication[0].corporationContact = "+91-172-2541002, 0172-2541003";
        SmidCitizenApplication[0].corporationWebsite = "http://mcchandigarh.gov.in";
        SmidCitizenApplication[0].corporationEmail = null;
          requestBody = {SmidCitizenApplication}

   }
  }
  else if(pagename ==='SUSV')
  {
   const {NulmSusvRequest} = state.screenConfiguration.preparedFinalObject;

   const SmidCitizenApplication = [NulmSusvRequest]; 
   if(NulmSusvRequest.applicationDocument !== null){
   const fileStoreIdsObj = NulmSusvRequest.applicationDocument.filter(docInfo => {
     if(docInfo.documentType==="Identity Proof") 
     return docInfo.filestoreId
     });
     const fileStoreIds = fileStoreIdsObj[0].filestoreId;
      const fileUrlPayload =  fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
      if(fileUrlPayload){
      const photoUrl = getFileUrl(fileUrlPayload[fileStoreIds]);
       SmidCitizenApplication[0].applicantPhoto = photoUrl;
   }else{
      SmidCitizenApplication[0].applicantPhoto = "";
   }
       // Hard code value is set which is not get from API responce
       SmidCitizenApplication[0].corporationName = "MUNICIPAL CORPORATION CHANDIGARH";
       SmidCitizenApplication[0].corporationAddress = "New Deluxe Building, Sector 17, Chandigarh";
       SmidCitizenApplication[0].corporationContact = "+91-172-2541002, 0172-2541003";
       SmidCitizenApplication[0].corporationWebsite = "http://mcchandigarh.gov.in";
       SmidCitizenApplication[0].corporationEmail = null;
         requestBody = {SmidCitizenApplication}

  }
 }
 else if(pagename ==='SUSV_UPDATE')//svru
 {
  const {NulmSusvRenewRequest} = state.screenConfiguration.preparedFinalObject;

  const SmidCitizenApplication = [NulmSusvRenewRequest]; 
  
  // const fileStoreIdsObj = NulmSusvRenewRequest.documentAttachemnt.filter(docInfo => {
  //   if(docInfo.documentType==="Identity Proof") 
  //   return docInfo.filestoreId
  //   });
  //   const fileStoreIds = fileStoreIdsObj[0].filestoreId;
  //    const fileUrlPayload =  fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
  //    if(fileUrlPayload){
  //    const photoUrl = getFileUrl(fileUrlPayload[fileStoreIds]);
  //     SmidCitizenApplication[0].applicantPhoto = photoUrl;
      // Hard code value is set which is not get from API responce
      SmidCitizenApplication[0].corporationName = "MUNICIPAL CORPORATION CHANDIGARH";
      SmidCitizenApplication[0].corporationAddress = "New Deluxe Building, Sector 17, Chandigarh";
      SmidCitizenApplication[0].corporationContact = "+91-172-2541002, 0172-2541003";
      SmidCitizenApplication[0].corporationWebsite = "http://mcchandigarh.gov.in";
      SmidCitizenApplication[0].corporationEmail = null;
        requestBody = {SmidCitizenApplication}

// }
}
else if(pagename ==='SUH')
{
 const {NulmSuhRequest} = state.screenConfiguration.preparedFinalObject;

 const SmidCitizenApplication = [NulmSuhRequest]; 
 
 // const fileStoreIdsObj = NulmSusvRenewRequest.documentAttachemnt.filter(docInfo => {
 //   if(docInfo.documentType==="Identity Proof") 
 //   return docInfo.filestoreId
 //   });
 //   const fileStoreIds = fileStoreIdsObj[0].filestoreId;
 //    const fileUrlPayload =  fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
 //    if(fileUrlPayload){
 //    const photoUrl = getFileUrl(fileUrlPayload[fileStoreIds]);
 //     SmidCitizenApplication[0].applicantPhoto = photoUrl;
     // Hard code value is set which is not get from API responce
     SmidCitizenApplication[0].corporationName = "MUNICIPAL CORPORATION CHANDIGARH";
     SmidCitizenApplication[0].corporationAddress = "New Deluxe Building, Sector 17, Chandigarh";
     SmidCitizenApplication[0].corporationContact = "+91-172-2541002, 0172-2541003";
     SmidCitizenApplication[0].corporationWebsite = "http://mcchandigarh.gov.in";
     SmidCitizenApplication[0].corporationEmail = null;
       requestBody = {SmidCitizenApplication}

// }
}

   let requestBody = requestBody// {SepApplication};
    const response = await httpRequest(
      "post",
      api,     
      "",
      queryObject,
      requestBody
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
   // throw error;
  }

};
import {
  dispatchMultipleFieldChangeAction,
  getLabel,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getCommonApplyFooter,validateFields,getLocalizationCodeValue,GetMdmsNameBycode, getEpochForDate,convertDateToEpoch } from "../../utils";
import "./index.css";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import commonConfig from "config/common.js";
import get from "lodash/get";
import set from 'lodash/set';
import { propertySearchApiCall } from './functions';
import { httpRequest } from "../../../../../ui-utils";

import {
  prepareDocumentsUploadData,
  applyForWaterOrSewerage,
  pushTheDocsUploadedToRedux,
  findAndReplace,
  applyForSewerage,
  applyForWater,
  propertyUpdate,
  validateFeildsForBothWaterAndSewerage,
  validateFeildsForWater,
  ValidateCard,
  validateFeildsForSewerage,
  validateConnHolderDetails,
  isActiveProperty,
  showHideFieldsFirstStep,
  getPropertyResults,
  isModifyMode,
  isModifyModeAction
} from "../../../../../ui-utils/commons";
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField ,toggleSpinner} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantIdCommon } from "egov-ui-kit/utils/localStorageUtils";

const setReviewPageRoute = (state, dispatch) => {
  let service = getQueryArg(window.location.href, "service");
  let tenantId = getTenantIdCommon() === null?commonConfig.tenantId:getTenantIdCommon();
  tenantId = getQueryArg(window.location.href, "tenantId");
  const applicationNumber = get(state, "screenConfiguration.preparedFinalObject.applyScreen.applicationNo");
  const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
    if(applicationNumber.includes("WS"))
    {
      service ='WATER'

    }
    else if(applicationNumber.includes("SW"))
    {
      service ='SEWERAGE'

    }
  const reviewUrl =  service ?
  
  `${appendUrl}/wns/search-preview?applicationNumber=${applicationNumber}&tenantId=${tenantId}&edited="true"&service=${service}`
  :`${appendUrl}/wns/search-preview?applicationNumber=${applicationNumber}&tenantId=${tenantId}&edited="true"`;
  dispatch(setRoute(reviewUrl));
};
const moveToReview = (state, dispatch) => {
  const documentsFormat = Object.values(
    get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux")
  );
const documentsContract = Object.values(
      get(state.screenConfiguration.preparedFinalObject, "documentsContract")
    );
  let validateDocumentField = false;
let validateDocumentselect = false;
let index = documentsContract.length;
  if(documentsFormat.length > index)
  {
    index = index;
  }
  else{
    index = documentsFormat.length;
  }

  for (let i = 0; i < index; i++) {
    let isDocumentRequired = get(documentsFormat[i], "isDocumentRequired");
    let isDocumentTypeRequired = get(documentsFormat[i], "isDocumentTypeRequired");

    if (isDocumentRequired) {
      let documents = get(documentsFormat[i], "documents");
      if (documents && documents.length > 0) {
        if (isDocumentTypeRequired) {
          let dropdownData=get(documentsFormat[i],"dropdown.value");
          if(dropdownData){
          // if (get(documentsFormat[i], "dropdown.value") !== null && get(documentsFormat[i]).dropdown !==undefined ){
            validateDocumentField = true;
          } else {
//             dispatch(
//               toggleSnackbar(
//                 true,
//                 { labelName: "Please select type of Document!", labelKey: "" },
//                 "warning"
//               )
//             );
           // validateDocumentField = false;
            //validateDocumentselect = false;
            validateDocumentField = true;
            validateDocumentselect = true;
            break;
          }
        } else {
          validateDocumentField = true;
        }
      } else {
        dispatch(
          toggleSnackbar(
            true,
            { labelName: "Please uplaod mandatory documents!", labelKey: "" },
            "warning"
          )
        );
        validateDocumentField = false;
        break;
      }
    } else {
      validateDocumentField = true;
    }
  }
if(validateDocumentField)
{
  let applicationStatus=  get(
    state,
    "screenConfiguration.preparedFinalObject.WaterConnection[0].applicationStatus",
    ''
);
  if(applicationStatus ==='PENDING_ROADCUT_NOC_BY_CITIZEN')
  {
    let ValidNoc = false
    let documentsFormat_ = documentsFormat;
    let documentsContract_ = documentsContract
    documentsFormat_ = documentsFormat_.filter(x=>x.isDocumentRequired === true)
    documentsContract_ = documentsContract_.filter(x=>x.cards[0].required)
   // documentsFormat_ = documentsFormat_.filter(x=>x.documents === undefined)
    if(documentsContract_.length!=documentsFormat_.length)
    {
      ValidNoc = true
    }
    else  if(documentsContract_.length ===documentsFormat_.length)
    {
      documentsFormat_ = documentsFormat_.filter(x=>x.documents === undefined)
       if(documentsFormat_.length>0)
          {
            ValidNoc = true
          }

     // ValidNoc = true
    }

    // if(documentsFormat_.length>0)
    // {
    //   ValidNoc = true
    // }
    // else if(documentsFormat_.length === 0)
    // {
    //   if(documentsFormat.length+1 !== documentsFormat.length)
    // {
    //   ValidNoc = true
    // }
    // }
    // else if(documentsFormat.length+1 !== documentsFormat.length)
    // {
    //   ValidNoc = true
    // }
    if(ValidNoc)
    //if(documentsFormat.length !== documentsContract.length)
    {
      dispatch(
                  toggleSnackbar(
                    true,
                    { labelName: "Please uplaod mandatory documents!", labelKey: "" },
                    "warning"
                  )
                );
        validateDocumentField = false;

    }
  }
}

  return validateDocumentField;
};

const propertyUpdateCitizen = async (state, dispatch) => {

  let applicationStatus =get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreen.applicationStatus"
  );
  let connectionNo =get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreen.connectionNo"
  );
    if((applicationStatus ==='PENDING_FOR_CITIZEN_ACTION' || applicationStatus ==="INITIATED")&&  (connectionNo ===null))
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

    set(propertyData, "creationReason", "UPDATE");
    let response_ = await propertyUpdate(state, dispatch,propertyData)
    if(response_)
    {
      if(subusageCategory!== null)
      {
        if(subusageCategory.split('.').length ===2)
        {
        //set 
        set(state.screenConfiguration.preparedFinalObject, "applyScreen.property.usageCategory", subusageCategory.split('.')[0]);
        set(state.screenConfiguration.preparedFinalObject, "applyScreen.property.subusageCategory", subusageCategory);
        }
      }

    }
  }

}
const getMdmsData = async (state, dispatch) => {
  let tenantId = get(
    state.screenConfiguration.preparedFinalObject,
    "FireNOCs[0].fireNOCDetails.propertyDetails.address.city"
  );
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId, moduleDetails: [
        { moduleName: "ws-services-masters", masterDetails: [{ name: "Documents" }] },
        { moduleName: "sw-services-calculation", masterDetails: [{ name: "Documents" }] }
      ]
    }
  };
  try {
    let payload = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);
    dispatch(prepareFinalObject("applyScreenMdmsData.applyScreen.Documents", payload.MdmsRes['ws-services-masters'].Documents));
    prepareDocumentsUploadData(state, dispatch);
  } catch (e) {
    console.log(e);
  }
};
const removingDocumentsWorkFlow = (state, dispatch) =>{
  const {screenConfiguration} = state;
  const {preparedFinalObject} = screenConfiguration;
  const {documentsUploadRedux} = preparedFinalObject;

  if(documentsUploadRedux){
    let newDocumentsUploadRedux = Object.assign({},documentsUploadRedux)
        Object.keys(documentsUploadRedux).map(val => {
          if(newDocumentsUploadRedux[val].documents)
              delete newDocumentsUploadRedux[val].documents;

           if(newDocumentsUploadRedux[val].dropdown)
           delete newDocumentsUploadRedux[val].dropdown;
        })

        console.log(newDocumentsUploadRedux,"testintg")
  }
}
const callBackForNext = async (state, dispatch) => {
  window.scrollTo(0, 0);
  let activeStep = get(state.screenConfiguration.screenConfig["apply"], "components.div.children.stepper.props.activeStep", 0);
  let isFormValid = true;
  let hasFieldToaster = false;
  //window.localStorage.setItem("ActivityStatusFlag","false");
  if (activeStep === 0) {
    // if (validatePropertyLocationDetails && validatePropertyDetails && validateForm) {
    //   isFormValid = await appl;
    // }
    

//set for back and previous action
let water = get(state.screenConfiguration.preparedFinalObject, "applyScreen.water", false);
let sewerage = get(state.screenConfiguration.preparedFinalObject, "applyScreen.sewerage", false);
let tubewell = get(state.screenConfiguration.preparedFinalObject, "applyScreen.tubewell", false);
let connectionCreated = false
if(water || sewerage || tubewell)
{
  if(water)
  {
    let WaterConnection = get(state.screenConfiguration.preparedFinalObject, "WaterConnection", []);
    if(WaterConnection.length>0)
    {
      connectionCreated = true
    }

  }
  else if(sewerage)
  {
    let SewerageConnection = get(state.screenConfiguration.preparedFinalObject, "SewerageConnection", []);
    if(SewerageConnection.length>0)
    {
      connectionCreated = true
    }
  }
  // else if(tubewell)
  // {
    
  // }

}

    if (getQueryArg(window.location.href, "action") === "edit" || connectionCreated) {
      let application = findAndReplace(get(state.screenConfiguration.preparedFinalObject, "applyScreen", {}), "NA", null);
      const uploadedDocData = application.documents;
      const reviewDocData = uploadedDocData && uploadedDocData.map(item => {
        return {
          title: `WS_${item.documentType}`,
          link: item.fileUrl && item.fileUrl.split(",")[0],
          linkText: "View",
          id:item.id,
          name: item.fileName
        };
      });
      dispatch(prepareFinalObject("applyScreen.reviewDocData", reviewDocData));
     let applyScreenObject = findAndReplace(get(state.screenConfiguration.preparedFinalObject, "applyScreen", {}), "NA", null);
      //let applyScreenObject = get(state.screenConfiguration.preparedFinalObject, "applyScreen", {});
      let applyScreenObj =  findAndReplace(applyScreenObject, 0, null);
       //connectionholdercode
       let connectionHolderObj = get(state.screenConfiguration.preparedFinalObject, "connectionHolders");
       let ownershipCategory_H= get(state.screenConfiguration.preparedFinalObject,"applyScreen.property.ownershipCategory", 'INDIVIDUAL.SINGLEOWNER' )
       let holderData =null;
       if(connectionHolderObj.length!==0)
      {
       if(connectionHolderObj[0].ownerType === null)
       {
        connectionHolderObj[0].ownerType= ownershipCategory_H;
       }
       else{
         connectionHolderObj[0].ownerType= ownershipCategory_H;
  
       }
       
       
        holderData = connectionHolderObj[0];
        if (holderData !== null && holderData !== undefined) {
          if (holderData.sameAsPropertyAddress === true) {
            holderData = connectionHolderObj[0];
          }
        }
      }
        if (holderData == null) {
          applyScreenObject.connectionHolders = holderData;
       } else {
          let arrayHolderData = [];
          arrayHolderData.push(holderData);
          if (getQueryArg(window.location.href, "action") !== "edit" ) {
          applyScreenObj.connectionHolders = arrayHolderData;
        // applyScreenObject.connectionHolders = applyScreenObj;
          }
        }
        // multi ownner validation and set valid ownner

        if(ownershipCategory_H === "INDIVIDUAL.MULTIPLEOWNERS")
        {
          let owners = get(state.screenConfiguration.preparedFinalObject,"applyScreen.property.owners",[])
          if(owners.length === 1)
          {
            if(process.env.REACT_APP_NAME === "Citizen")
            {
              let errorMessage_ = {
                labelName: "Please add multilple ownner data",
                labelKey: "WS_FILL_MULTIPLEOWNERS_FIELDS"
              };
            errorMessage_.labelName="Please add multilple ownner data"
            errorMessage_.labelKey="WS_FILL_MULTIPLEOWNERS_FIELDS"
            
            dispatch(toggleSnackbar(true, errorMessage_, "warning"));
            return false
            }

          }
          else if (owners.length>1)
          {
            let cardJsonPath =
            "components.div.children.formwizardSecondStep.children.MaterialIndentMapDetails.children.cardContent.children.MaterialIndentDetailsCard.props.items";
            cardJsonPath ="components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.MultiownerDetail.children.cardContent.children.headerDiv.props.items";
            //[0].item0.children.cardContent.children.viewFive.children"
            let pagename = "apply";
            let jasonpath =  "applyScreen.property.owners";//indents[0].indentDetails
            let value = "name";
            let DuplicatItem = ValidateCard(state,dispatch,cardJsonPath,pagename,jasonpath,value)
            if(DuplicatItem && DuplicatItem[0])
            {
              if(DuplicatItem[0].IsDuplicatItem)
              {
              const LocalizationCodeValueN = getLocalizationCodeValue("WS_FILL_MULTIPLEOWNERS_NAME_FIELDS")
              const errorMessageN = {
                labelName: "Duplicate name Added",
                //labelKey:   `STORE_MATERIAL_DUPLICATE_VALIDATION ${DuplicatItem[0].duplicates}`
                labelKey:   LocalizationCodeValueN+' '+DuplicatItem[0].duplicates
              };
              dispatch(toggleSnackbar(true, errorMessageN, "warning"));
              return false;
            }
            }
            // value = "mobileNumber";
            // let DuplicatItemM = ValidateCard(state,dispatch,cardJsonPath,pagename,jasonpath,value)             
            // if(DuplicatItemM && DuplicatItemM[0])
            // {
            //   if(DuplicatItemM[0].IsDuplicatItem)
            //   {
            //   const LocalizationCodeValueM = getLocalizationCodeValue("WS_FILL_MULTIPLEOWNERS_MOBILE_FIELDS")
            //   const errorMessageM = {
            //     labelName: "Duplicate mobile number Added",
            //     //labelKey:   `STORE_MATERIAL_DUPLICATE_VALIDATION ${DuplicatItem[0].duplicates}`
            //     labelKey:   LocalizationCodeValueM+' '+DuplicatItemM[0].duplicates
            //   };
            //   dispatch(toggleSnackbar(true, errorMessageM, "warning"));
            //   return false;
            // }
            // }
            // value = "emailId";
            // let DuplicatItemE = ValidateCard(state,dispatch,cardJsonPath,pagename,jasonpath,value)             
            // if(DuplicatItemE && DuplicatItemE[0])
            // {
            //   if(DuplicatItemE[0].IsDuplicatItem)
            //   {
            //   const LocalizationCodeValueE = getLocalizationCodeValue("WS_FILL_MULTIPLEOWNERS_EMAIL_FIELDS")
            //   const errorMessageE = {
            //     labelName: "Duplicate email id Added",
            //     //labelKey:   `STORE_MATERIAL_DUPLICATE_VALIDATION ${DuplicatItem[0].duplicates}`
            //     labelKey:   LocalizationCodeValueE+' '+DuplicatItemE[0].duplicates
            //   };
            //   dispatch(toggleSnackbar(true, errorMessageE, "warning"));
            //   return false;
            // }
            // }
          }
        }
        else if(ownershipCategory_H !== "INDIVIDUAL.MULTIPLEOWNERS")
        {
          let owners = get(state.screenConfiguration.preparedFinalObject,"applyScreen.property.owners",[])
          let SingleOwnerDetailsCardPathS = "components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.ownerDetail.children.cardContent.children.headerDiv.props.items"
          let SingleOwnerDetailsItemsS = get(
            state.screenConfiguration.screenConfig.apply,
            SingleOwnerDetailsCardPathS,
            []
          );
          SingleOwnerDetailsItemsS = SingleOwnerDetailsItemsS.filter( x=>x.isDeleted === undefined || x.isDeleted !== false)
          if (SingleOwnerDetailsItemsS.length>1)
          {
            if(process.env.REACT_APP_NAME === "Citizen")
            {
              let errorMessageS = {
                labelName: "Please remove multilple ownner data",
                labelKey: "WS_FILL_SINGLEOWNERS_FIELDS"
              };
              
              dispatch(toggleSnackbar(true, errorMessageS, "warning"));
              return false

            }
           

          }

        }

        let SingleOwnerDetailsCardPath =
          "components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.ownerDetail.children.cardContent.children.headerDiv.props.items";
        let SingleOwnerDetailsItems = get(
          state.screenConfiguration.screenConfig.apply,
          SingleOwnerDetailsCardPath,
          []
        );
        if(ownershipCategory_H !=="INDIVIDUAL.MULTIPLEOWNERS")
        {
          SingleOwnerDetailsCardPath = "components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.ownerDetail.children.cardContent.children.headerDiv.props.items"
          SingleOwnerDetailsItems = get(
            state.screenConfiguration.screenConfig.apply,
            SingleOwnerDetailsCardPath,
            []
          );
          SingleOwnerDetailsItems = SingleOwnerDetailsItems.filter( x=>x.isDeleted === undefined || x.isDeleted !== false)
          //
          let owners = get(state.screenConfiguration.preparedFinalObject,"applyScreen.property.owners",[])
          let jsonPath = ''//SingleOwnerDetailsItems.item0.children.cardContent.children.viewFive.children.ownerName.props.jsonPath
          if(SingleOwnerDetailsItems && SingleOwnerDetailsItems[0] && SingleOwnerDetailsItems !== undefined)
          {
           jsonPath = SingleOwnerDetailsItems[0].item0.children.cardContent.children.viewFive.children.ownerName.props.jsonPath
          let name = get(
            state.screenConfiguration.preparedFinalObject,
            jsonPath,
            ''
          );
          if(name !== undefined)
          {
            owners = owners.filter(x=>x.name ===name);
          }
          if(owners.length>0)
          {
            set(state.screenConfiguration.preparedFinalObject, "applyScreen.property.owners", owners);
          }
          
          }
          

        }
        else if(ownershipCategory_H ==="INDIVIDUAL.MULTIPLEOWNERS"){
          SingleOwnerDetailsCardPath = "components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.MultiownerDetail.children.cardContent.children.headerDiv.props.items"
          SingleOwnerDetailsItems = get(
            state.screenConfiguration.screenConfig.apply,
            SingleOwnerDetailsCardPath,
            []
          );
          SingleOwnerDetailsItems = SingleOwnerDetailsItems.filter( x=>x.isDeleted === undefined || x.isDeleted !== false)

        }

        //

      if(!isActiveProperty(applyScreenObj.property)){
        dispatch(toggleSnackbar(true, { labelKey: `ERR_WS_PROP_STATUS_${applyScreenObj.property.status}`, labelName: `Property Status is ${applyScreenObj.property.status}` }, "warning"));     
        showHideFieldsFirstStep(dispatch,"",false);        
        dispatch(prepareFinalObject("applyScreen", applyScreenObj));
        return false;
      }
      // if wnsStatus is present then check the required fields
let wnsStatus =  window.localStorage.getItem("WNS_STATUS");
let  ActionType = getQueryArg(window.location.href, "actionType");
if(wnsStatus === null)
{
  if(ActionType!== null)
  wnsStatus =ActionType;
  else{
    if(process.env.REACT_APP_NAME === "Citizen" && ActionType)
    wnsStatus =  window.localStorage.getItem("wns_workflow")
    else if(process.env.REACT_APP_NAME === "Citizen" || ActionType)
  {
    wnsStatus =  window.localStorage.getItem("wns_workflow")

    }
  }
}
let action = get(
  state.screenConfiguration.preparedFinalObject,
  `applyScreen.waterApplication.action`,
  ''
);
let documentClear = true
if(action ==='SEND_BACK_TO_CITIZEN' || action ==='SEND_BACK_TO_CITIZEN_FOR_ROADCUT_NOC')
{
  documentClear = false

}

if(wnsStatus && wnsStatus === "CONNECTION_CONVERSION" || wnsStatus === "WS_CONVERSION"){
  const iswaterConnFomValid = validateFields(
    "components.div.children.formwizardFirstStep.children.connConversionDetails.children.cardContent.children.connectionConversionDetails.children.ConnectionConversionDetails.children",
    state,
    dispatch,
    "apply"
  );

const proposedUsageCategory = get(
  state.screenConfiguration.preparedFinalObject,
  "WaterConnection[0].proposedUsageCategory"
);
const usageCategory = get(
  state.screenConfiguration.preparedFinalObject,
  "WaterConnection[0].waterProperty.usageCategory"
);
  if(!iswaterConnFomValid){
    dispatch(
      toggleSnackbar(
        true, {
        labelKey: "WS_FILL_REQUIRED_FIELDS",
        labelName: "Please fill Required details"
      },
        "warning"
      )
    )
    return;
  }
  if(usageCategory === proposedUsageCategory)
  {
    dispatch(
      toggleSnackbar(
        true, {
        labelKey: "WS_PROPERTY_USAGE_TYPE_TARRIF_LABEL_INPUT_PROPOSED_VALIDATION",
        labelName: "Please select different proposed tarif type"
      },
        "warning"
      )
    )

    return

  } 

  if(action ==='INITIATED'  || action ==='')//if(action !=='SEND_BACK_TO_CITIZEN' || action !=='SEND_BACK_TO_CITIZEN_FOR_ROADCUT_NOC' )
  {
  removingDocumentsWorkFlow(state, dispatch) ;
  prepareDocumentsUploadData(state, dispatch);
  }
  else if(documentClear=== true)
  {
  removingDocumentsWorkFlow(state, dispatch) ;
  prepareDocumentsUploadData(state, dispatch);
  }
  // else if(action !=='SEND_BACK_TO_CITIZEN_FOR_ROADCUT_NOC')
  // {
  // removingDocumentsWorkFlow(state, dispatch) ;
  // prepareDocumentsUploadData(state, dispatch);    
  // }
  try{
    let inWorkflow = get(state.screenConfiguration.preparedFinalObject, "applyScreen.inWorkflow", false);
    if(inWorkflow === false)
    {
      let abc = await applyForWater(state, dispatch);
      window.localStorage.setItem("ActivityStatusFlag","true");
    }
    
    
  }catch (err){
    if(localStorage.getItem("WNS_STATUS")){
      window.localStorage.removeItem("WNS_STATUS");
  }
  dispatch(toggleSnackbar(true, { labelName: err.message }, "error"));
  return false;
    console.log("errrr")
  }
}
else if(wnsStatus && wnsStatus === "UPDATE_CONNECTION_HOLDER_INFO" || wnsStatus === "WS_RENAME"){
  const proconnHolderDetail = validateFields(
    "components.div.children.formwizardFirstStep.children.proposedconnectionHolderDetails.children.cardContent.children.proposedholderDetails.children.holderDetails.children",
    state,
    dispatch,
    "apply"
  );

const connectionHolders = get(
  state.screenConfiguration.preparedFinalObject,
  "WaterConnection[0].connectionHolders[0]"
);

if(!proconnHolderDetail){
  dispatch(
    toggleSnackbar(
      true, {
      labelKey: "WS_FILL_REQUIRED_FIELDS",
      labelName: "Please fill Required details"
    },
      "warning"
    )
  )
  return false;
}

  if((connectionHolders.proposedName === connectionHolders.name || connectionHolders.proposedName ==='NA')
    && (connectionHolders.proposedMobileNo === connectionHolders.mobileNumber || connectionHolders.proposedMobileNo ==='NA')
    && (connectionHolders.proposedCorrespondanceAddress === connectionHolders.correspondenceAddress || connectionHolders.proposedCorrespondanceAddress ==='NA')   
    ){
    dispatch(
      toggleSnackbar(
        true, {
        labelKey: "WS_OWNER_DETAILS_PROPOSED_DUPLICATE_VALIDATION",
        labelName: "Proposed Holder details can not be same"
      },
        "warning"
      )
    )
    return false;
  }
 
  
  
  if(action ==='INITIATED'  || action ==='')
  {
  removingDocumentsWorkFlow(state, dispatch) ;
  prepareDocumentsUploadData(state, dispatch);
  }
  else if(documentClear=== true)
  {
  removingDocumentsWorkFlow(state, dispatch) ;
  prepareDocumentsUploadData(state, dispatch);
  }
  // else if(action !=='SEND_BACK_TO_CITIZEN_FOR_ROADCUT_NOC')
  // {
  // removingDocumentsWorkFlow(state, dispatch) ;
  // prepareDocumentsUploadData(state, dispatch);    
  // }
  try{
    let inWorkflow = get(state.screenConfiguration.preparedFinalObject, "applyScreen.inWorkflow", false);
    if(inWorkflow === false)
    {
      let abc = await applyForWater(state, dispatch);
      window.localStorage.setItem("ActivityStatusFlag","true");
    }
    
 
  }catch (err){
    if(localStorage.getItem("WNS_STATUS")){
      window.localStorage.removeItem("WNS_STATUS");
  }
  dispatch(toggleSnackbar(true, { labelName: err.message }, "error"));
  return false;
    console.log("errrr")
  }
} 
else if(wnsStatus && wnsStatus === "UPDATE_METER_INFO" || wnsStatus ==='WS_METER_UPDATE' || wnsStatus ==='APPLY_FOR_METER_TESTING' || wnsStatus ==='WS_METER_TESTING' ){
  const iswaterConnFomValid = validateFields(
    "components.div.children.formwizardFirstStep.children.commentSectionDetails.children.cardContent.children.commentDetails.children.CommentDetails.children",
    state,
    dispatch,
    "apply"
  );

  if(!iswaterConnFomValid){
    dispatch(
      toggleSnackbar(
        true, {
        labelKey: "WS_FILL_REQUIRED_FIELDS",
        labelName: "Please fill Required details"
      },
        "warning"
      )
    )
    return;
  } 
  if(action ==='INITIATED'  || action ==='')
  {
  removingDocumentsWorkFlow(state, dispatch) ;
  prepareDocumentsUploadData(state, dispatch);
  }
  else if(documentClear=== true)
  {
  removingDocumentsWorkFlow(state, dispatch) ;
  prepareDocumentsUploadData(state, dispatch);
  }
  // else if(action !=='SEND_BACK_TO_CITIZEN_FOR_ROADCUT_NOC')
  // {
  // removingDocumentsWorkFlow(state, dispatch) ;
  // prepareDocumentsUploadData(state, dispatch);    
  // }
  try{
    let inWorkflow = get(state.screenConfiguration.preparedFinalObject, "applyScreen.inWorkflow", false);
    if(inWorkflow === false)
    {
      let abc = await applyForWater(state, dispatch);
      window.localStorage.setItem("ActivityStatusFlag","true");
    }
    
 
  }catch (err){
    if(localStorage.getItem("WNS_STATUS")){
      window.localStorage.removeItem("WNS_STATUS");
  }
  dispatch(toggleSnackbar(true, { labelName: err.message }, "error"));
  return false;
    console.log("errrr")
  }
}
else if (wnsStatus && wnsStatus === "TEMPORARY_DISCONNECTION" || wnsStatus ==='WS_TEMP_DISCONNECTION')
{
  const isPropertyValid = validateFields(
    "components.div.children.formwizardFirstStep.children.commentTempSectionDetails.children.cardContent.children.propertyTempIDDetails.children.viewTwo.children",
    state,
    dispatch,
    "apply"
  );
  const isCommentValid = validateFields(
    "components.div.children.formwizardFirstStep.children.commentTempSectionDetails.children.cardContent.children.commentDetails.children.CommentDetails.children",
    state,
    dispatch,
    "apply"
  );

  if(!isPropertyValid || !isCommentValid){
    dispatch(
      toggleSnackbar(
        true, {
        labelKey: "WS_FILL_REQUIRED_FIELDS",
        labelName: "Please fill Required details"
      },
        "warning"
      )
    )
    return;
  }
  else if(1===1){
    let subusageCategory_ = get(state.screenConfiguration.preparedFinalObject, "applyScreen.property.subusageCategory", '');
    if(!subusageCategory_)
   {
    dispatch(
      toggleSnackbar(
        true, {
        labelKey: "WS_FILL_SUB_USAGE_TYPE_VALIDATION",
        labelName: "Please select property sub usage type"
      },
        "warning"
      )
    )
    return ;  


   }
  
    
  }


  //if(action !=='SEND_BACK_TO_CITIZEN' || action !=='SEND_BACK_TO_CITIZEN_FOR_ROADCUT_NOC' )
  if(action ==='INITIATED'  || action ==='')
  {
  removingDocumentsWorkFlow(state, dispatch) ;
  prepareDocumentsUploadData(state, dispatch);
  }
  else if(documentClear=== true)
  {
  removingDocumentsWorkFlow(state, dispatch) ;
  prepareDocumentsUploadData(state, dispatch);
  }
  // else if(action !=='SEND_BACK_TO_CITIZEN_FOR_ROADCUT_NOC')
  // {
  // removingDocumentsWorkFlow(state, dispatch) ;
  // prepareDocumentsUploadData(state, dispatch);    
  // }
  try{
    // call api property search then property-services/property/_update  
    let queryObject = [];//[{ key: "tenantId", value: tenantId }];
    let searchScreenObject = get(state.screenConfiguration.preparedFinalObject, "searchScreen", {});
    for (var key in searchScreenObject) {
     if (searchScreenObject.hasOwnProperty(key) && searchScreenObject[key].trim() !== "") {
       queryObject.push({ key: key, value: searchScreenObject[key].trim() });
     }
   }
    let response = await getPropertyResults(queryObject, dispatch);
    if (response && response.Properties) {
     if(response.Properties[0].status === 'INACTIVE'){
      if(localStorage.getItem("WNS_STATUS")){
        window.localStorage.removeItem("WNS_STATUS");
    }
       dispatch(toggleSnackbar(true, { labelKey: "ERR_WS_PROP_STATUS_INACTIVE", labelName: "Property Status is INACTIVE" }, "warning"));
     }else{
       let propertyData = response.Properties[0];
       // let contractedCorAddress = "";
        propertyData = get(
          state,
          "screenConfiguration.preparedFinalObject.applyScreen.property"
        );
        let tenantId = get(
          state,
          "screenConfiguration.preparedFinalObject.applyScreenMdmsData.tenant.tenants[0].code"
        );
        let owners_temp = get(response.Properties[0],'owners',[])
        set(propertyData,'owners',owners_temp)
    dispatch(prepareFinalObject("applyScreen.property", propertyData));

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
    if(subusageCategory !== null)
    {
      if(subusageCategory.split('.').length ===2)
      {
        //set 
        set(propertyData, "usageCategory", subusageCategory);
      }
    }

    // end set usage category
    // propertyPayload.landArea = parseInt(propertyPayload.landArea);
    // propertyPayload.totalConstructedArea = parseInt(propertyPayload.landArea);
    set(propertyData, "creationReason", "UPDATE");
    let response_ = await propertyUpdate(state, dispatch,propertyData)
    if(response_)
    {
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
       // set(propertyData, "usageCategory", subusageCategory);
        set(state.screenConfiguration.preparedFinalObject, "applyScreen.property.usageCategory", subusageCategory.split('.')[0]);
        set(state.screenConfiguration.preparedFinalObject, "applyScreen.property.subusageCategory", subusageCategory);
      }
      }
      dispatch(prepareFinalObject("applyScreen.property", propertyData));
      let inWorkflow = get(state.screenConfiguration.preparedFinalObject, "applyScreen.inWorkflow", false);
      if(inWorkflow === false)
      {
        let abc = await applyForWater(state, dispatch);
        window.localStorage.setItem("ActivityStatusFlag","true");
      }
    
    }
    else{
      if(localStorage.getItem("WNS_STATUS")){
        window.localStorage.removeItem("WNS_STATUS");
    }
    return;
    }
     }
   }

  }catch (err){
    console.log("errrr")
    if(localStorage.getItem("WNS_STATUS")){
      window.localStorage.removeItem("WNS_STATUS");
  }
  dispatch(toggleSnackbar(true, { labelName: err.message }, "error"));
  return false;
  }

}
else if(wnsStatus && (wnsStatus === "REACTIVATE_CONNECTION"||
                      wnsStatus === "WS_REACTIVATE"||                     
                      wnsStatus === "WS_DISCONNECTION"||
                     // wnsStatus === "TEMPORARY_DISCONNECTION"||                     
                      //wnsStatus === "WS_TEMP_DISCONNECTION"||
                      wnsStatus === "PERMANENT_DISCONNECTION")){
  const iswaterConnFomValid = validateFields(
    "components.div.children.formwizardFirstStep.children.commentSectionDetails.children.cardContent.children.commentDetails.children.CommentDetails.children",
    state,
    dispatch,
    "apply"
  );

  if(!iswaterConnFomValid){
    dispatch(
      toggleSnackbar(
        true, {
        labelKey: "WS_FILL_REQUIRED_FIELDS",
        labelName: "Please fill Required details"
      },
        "warning"
      )
    )
    return;
  }
 
  if(action ==='INITIATED'  || action ==='')
  {
  removingDocumentsWorkFlow(state, dispatch) ;
  prepareDocumentsUploadData(state, dispatch);
  }
  else if(documentClear=== true)
  {
  removingDocumentsWorkFlow(state, dispatch) ;
  prepareDocumentsUploadData(state, dispatch);
  }
  // else if(action !=='SEND_BACK_TO_CITIZEN_FOR_ROADCUT_NOC')
  // {
  // removingDocumentsWorkFlow(state, dispatch) ;
  // prepareDocumentsUploadData(state, dispatch);    
  // }
  try{
    let inWorkflow = get(state.screenConfiguration.preparedFinalObject, "applyScreen.inWorkflow", false);
    if(inWorkflow === false)
    {
      let abc = await applyForWater(state, dispatch);
      window.localStorage.setItem("ActivityStatusFlag","true");
    }
    
  }catch (err){
    if(localStorage.getItem("WNS_STATUS")){
      window.localStorage.removeItem("WNS_STATUS");
  }
  dispatch(toggleSnackbar(true, { labelName: err.message }, "error"));
  return false;
    console.log("errrr")
  }
 
}
else if(wnsStatus && wnsStatus === "APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION" 
                    || wnsStatus === "WS_TEMP_TEMP" 
                    ||wnsStatus === "WS_TEMP_REGULAR" 
                    || wnsStatus === "APPLY_FOR_TEMPORARY_REGULAR_CONNECTION" )
{
  const isPropertyDetailsValid= validateFields(
    "components.div.children.formwizardFirstStep.children.IDDetails.children.cardContent.children.propertyIDDetails.children.viewTwo.children",
    state,
    dispatch,
    "apply"
  );
  const isPropertyLocationDetailValid= validateFields(
    "components.div.children.formwizardFirstStep.children.Details.children.cardContent.children.propertyDetail.children.viewFour.children",
    state,
    dispatch,
    "apply"
  );  
   const isPropertyUsageValid= validateFields(
    "components.div.children.formwizardFirstStep.children.propertyUsageDetails.children.cardContent.children.propertyUsage.children.PropertyUsageDetails.children",
    state,
    dispatch,
    "apply"
  );


  if(!isPropertyDetailsValid || !isPropertyLocationDetailValid ||!isPropertyUsageValid){
    dispatch(
      toggleSnackbar(
        true, {
        labelKey: "WS_FILL_REQUIRED_FIELDS",
        labelName: "Please fill Required details"
      },
        "warning"
      )
    )
    return;
  }
  
  if(action ==='INITIATED'  || action ==='')
  {
  removingDocumentsWorkFlow(state, dispatch) ;
  prepareDocumentsUploadData(state, dispatch);
  }
  else if(documentClear=== true)
  {
  removingDocumentsWorkFlow(state, dispatch) ;
  prepareDocumentsUploadData(state, dispatch);
  }
  // else if(action !=='SEND_BACK_TO_CITIZEN_FOR_ROADCUT_NOC')
  // {
  // removingDocumentsWorkFlow(state, dispatch) ;
  // prepareDocumentsUploadData(state, dispatch);    
  // }
  try{
    // call api property search then property-services/property/_update  
    let queryObject = [];//[{ key: "tenantId", value: tenantId }];
    let searchScreenObject = get(state.screenConfiguration.preparedFinalObject, "searchScreen", {});
    for (var key in searchScreenObject) {
     if (searchScreenObject.hasOwnProperty(key) && searchScreenObject[key].trim() !== "") {
       queryObject.push({ key: key, value: searchScreenObject[key].trim() });
     }
   }
    let response = await getPropertyResults(queryObject, dispatch);
    if (response && response.Properties) {
     if(response.Properties[0].status === 'INACTIVE'){
      if(localStorage.getItem("WNS_STATUS")){
        window.localStorage.removeItem("WNS_STATUS");
    }
       dispatch(toggleSnackbar(true, { labelKey: "ERR_WS_PROP_STATUS_INACTIVE", labelName: "Property Status is INACTIVE" }, "warning"));
     }else{
       let propertyData = response.Properties[0];
       // let contractedCorAddress = "";
        propertyData = get(
          state,
          "screenConfiguration.preparedFinalObject.applyScreen.property"
        );
        let tenantId = get(
          state,
          "screenConfiguration.preparedFinalObject.applyScreenMdmsData.tenant.tenants[0].code"
        );
       
    
   // propertyData.landArea = parseInt(propertyData.landArea);
    propertyData.landArea = propertyData.landArea;
    propertyData.totalConstructedArea = (propertyData.landArea);
    propertyData.tenantId = tenantId;
    //propertyData.address.doorNo = propertyData.address.plotNo;
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
    set(propertyData, "landArea", (propertyData.landArea));
    set(propertyData, "totalConstructedArea", (propertyData.landArea));
    if(propertyData.address.locality !== undefined)
    {
      if(propertyData.address.locality.code.value)
      {
      // propertyPayload.address.locality.code = propertyPayload.address.locality.code.value;
      set(propertyData, "address.locality.code", propertyData.address.locality.code.value);
      }
      else if(propertyData.address.locality.code)
      {
        //propertyData.address.locality.code = propertyData.address.locality.code;
        set(propertyData, "address.locality.code", propertyData.address.locality.code);
      }
      
    }
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

    // end set usage category
    // propertyPayload.landArea = parseInt(propertyPayload.landArea);
    // propertyPayload.totalConstructedArea = parseInt(propertyPayload.landArea);
    set(propertyData, "creationReason", "UPDATE");
    let response_ = await propertyUpdate(state, dispatch,propertyData)
    if(response_)
    {
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
        set(state.screenConfiguration.preparedFinalObject, "applyScreen.property.usageCategory", subusageCategory.split('.')[0]);
        set(state.screenConfiguration.preparedFinalObject, "applyScreen.property.subusageCategory", subusageCategory);
      }
      }
      dispatch(prepareFinalObject("applyScreen.property", propertyData));
      let jpath ='components.div.children.formwizardFirstStep.children.propertyUsageDetails.children.cardContent.children.propertyUsage.children.PropertyUsageDetails.children.propertySubUsageType.props.value'
      let category_ = get(state.screenConfiguration.screenConfig.apply,
        jpath,
        null
        )
        if(category_ ===null || category_ ==='')
        {
          category_ = get(state.screenConfiguration.preparedFinalObject,'applyScreen.waterProperty.usageSubCategory','')

        }
        set(state.screenConfiguration.preparedFinalObject,'applyScreen.waterProperty.usageSubCategory',category_)
        let inWorkflow = get(state.screenConfiguration.preparedFinalObject, "applyScreen.inWorkflow", false);
        if(inWorkflow === false)
        {
          let abc = await applyForWater(state, dispatch);
          window.localStorage.setItem("ActivityStatusFlag","true");
        }
    
    }
    else{
      if(localStorage.getItem("WNS_STATUS")){
        window.localStorage.removeItem("WNS_STATUS");
    }
    return;
    }
     }
   }

  }catch (err){
    console.log("errrr")
    if(localStorage.getItem("WNS_STATUS")){
      window.localStorage.removeItem("WNS_STATUS");
  }
  dispatch(toggleSnackbar(true, { labelName: err.message }, "error"));
  return false;
  }

}

// validate on previous and next click
let applicationNo = get(state.screenConfiguration.preparedFinalObject, "WaterConnection[0].applicationNo", null);
let connectionNo = get(state.screenConfiguration.preparedFinalObject, "WaterConnection[0].connectionNo", null);
let applicationStatus = get(state.screenConfiguration.preparedFinalObject, "WaterConnection[0].applicationStatus", null);
const isPropertyDetailsValid= validateFields(
  "components.div.children.formwizardFirstStep.children.IDDetails.children.cardContent.children.propertyIDDetails.children.viewTwo.children",
  state,
  dispatch,
  "apply"
);
const isPropertyLocationDetailValid= validateFields(
  "components.div.children.formwizardFirstStep.children.Details.children.cardContent.children.propertyDetail.children.viewFour.children",
  state,
  dispatch,
  "apply"
); 
const isPropertyUsageValid= validateFields(
  "components.div.children.formwizardFirstStep.children.propertyUsageDetails.children.cardContent.children.propertyUsage.children.PropertyUsageDetails.children",
  state,
  dispatch,
  "apply"
);
const isConnectionHolderDetailsValid= validateFields(
  "components.div.children.formwizardFirstStep.children.connectionHolderDetails.children.cardContent.children.holderDetails.children.holderDetails.children",
  state,
  dispatch,
  "apply"
);
const _ownershipCategory= get(state.screenConfiguration.preparedFinalObject,"applyScreen.property.ownershipCategory", '' )
if(applicationNo && connectionNo === null && applicationStatus ==='INITIATED' )
{
  //console.log(`pritam_${isPropertyDetailsValid}_${isPropertyLocationDetailValid}_${isPropertyUsageValid}_${isConnectionHolderDetailsValid}_${ownershipCategory}`)
  if(!isPropertyDetailsValid 
    || !isPropertyLocationDetailValid 
    || !isPropertyUsageValid
    || !isConnectionHolderDetailsValid 
    || !_ownershipCategory)
  {
    dispatch(
      toggleSnackbar(
        true, {
        labelKey: "WS_FILL_REQUIRED_FIELDS",
        labelName: "Please fill Required details"
      },
        "warning"
      )
    )
    return false

  }
  /////? ownner ship validation in case of draft
  let ownershipCategory= get(state.screenConfiguration.preparedFinalObject,"applyScreen.property.ownershipCategory", '' )
  let isOwnershipsingleValid_ = true
  if(ownershipCategory)
  {
    let SingleOwnerDetailsCardPath =''
    
    if(ownershipCategory !=='INDIVIDUAL.MULTIPLEOWNERS')
    {
      //SingleOwnerDetailsCardPath='components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.ownerDetail.children.cardContent.children.headerDiv.props.items'
      isOwnershipsingleValid_ =  validateFields(
        "components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.ownerDetail.children.cardContent.children.headerDiv.props.items[0].item0.children.cardContent.children.viewFive.children",
        state,
        dispatch,
        "apply"
      ); 

    }
    else{
      let SingleOwnerDetailsCardPath =
      "components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.MultiownerDetail.children.cardContent.children.headerDiv.props.items";
    let SingleOwnerDetailsItems = get(
      state.screenConfiguration.screenConfig.apply,
      SingleOwnerDetailsCardPath,
      []
    );
    let isMasterDetailsValid = true;
    isOwnershipsingleValid_ = true;
    for (var j = 0; j < SingleOwnerDetailsItems.length; j++) {
      if (
        (SingleOwnerDetailsItems[j].isDeleted === undefined ||
          SingleOwnerDetailsItems[j].isDeleted !== false) &&
        !validateFields(
          `${SingleOwnerDetailsCardPath}[${j}].item${j}.children.cardContent.children.viewFive.children`,
          state,
          dispatch,
          "apply"
        )
      )
      {
        isMasterDetailsValid = false; 
        isOwnershipsingleValid_ = false;

      }

    }
  }

  }
  if(!isOwnershipsingleValid_)
  {
    dispatch(
      toggleSnackbar(
        true, {
        labelKey: "WS_FILL_REQUIRED_FIELDS",
        labelName: "Please fill Required details"
      },
        "warning"
      )
    )
    return false

  }

}
if(applicationNo && connectionNo === null && applicationStatus ==='PENDING_FOR_CITIZEN_ACTION' )
{
  if(!isPropertyDetailsValid 
    || !isPropertyLocationDetailValid 
    || !isPropertyUsageValid
    || !isConnectionHolderDetailsValid 
    || !_ownershipCategory)
  {
    dispatch(
      toggleSnackbar(
        true, {
        labelKey: "WS_FILL_REQUIRED_FIELDS",
        labelName: "Please fill Required details"
      },
        "warning"
      )
    )
    return false

  }
}
///?



    } 
    else {

     

      const isPropertyDetailsValid= validateFields(
        "components.div.children.formwizardFirstStep.children.IDDetails.children.cardContent.children.propertyIDDetails.children.viewTwo.children",
        state,
        dispatch,
        "apply"
      );
      const isPropertyLocationDetailValid= validateFields(
        "components.div.children.formwizardFirstStep.children.Details.children.cardContent.children.propertyDetail.children.viewFour.children",
        state,
        dispatch,
        "apply"
      );  
      const isOwnershipTypeInputValid =  validateFields(
        "components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.ownershipTypeInput",
        state,
        dispatch,
        "apply"
      ); 
      let isConnectionDetailsValidpipesize = validateFields(
        "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children",//pipeSize
        state,
        dispatch,
        "apply"
      );
      let isConnectionDetailsValid_ = true;
      let water_ = get(state.screenConfiguration.preparedFinalObject, "applyScreen.water", false);
      let sewerage_ = get(state.screenConfiguration.preparedFinalObject, "applyScreen.sewerage", false);
      let tubewell_ = get(state.screenConfiguration.preparedFinalObject, "applyScreen.tubewell", false);
      const fields_ = get(
        state.screenConfiguration.screenConfig["apply"],
        "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children",
        {}
      );
      if(water_)
      {
       
        // let isConnectionDetailsValidApplicationType = validateFields(
        //   "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.waterApplicationType",
        //   state,
        //   dispatch,
        //   "apply"
        // );
        if(fields_.waterApplicationType!==undefined) 
        {
          if(fields_.waterApplicationType.isFieldValid ===false)
          isConnectionDetailsValid_ = false
          
        }
        if(fields_.pipeSize!==undefined)
        {
          if(fields_.pipeSize.isFieldValid ===false)
          isConnectionDetailsValid_ = false
          
          
        }
        // if(isConnectionDetailsValidpipesize && isConnectionDetailsValidApplicationType)
        // {
        //   isConnectionDetailsValid_ = true
    
        // }
        // else{
        //   isConnectionDetailsValid_ = false
        // }
    
      }
      else if(sewerage_)
      {
        // let isConnectionDetailsValidNoOfWaterClosets = validateFields(
        //   "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.numberOfWaterClosets",
        //   state,
        //   dispatch,
        //   "apply"
        // );
        // let isConnectionDetailsValidNoOfToilets = validateFields(
        //   "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.numberOfToilets",
        //   state,
        //   dispatch,
        //   "apply"
        // );
        // if(isConnectionDetailsValidNoOfWaterClosets && isConnectionDetailsValidNoOfToilets)
        // {
        //   isConnectionDetailsValid_ = true
    
        // }
        // else{
        //   isConnectionDetailsValid_ = false
        // }
        if(fields_.numberOfToilets!==undefined) 
        {
          if(fields_.numberOfToilets.isFieldValid ===false)
          isConnectionDetailsValid_ = false
          
        }
         if(fields_.numberOfWaterClosets!==undefined)
        {
          if(fields_.numberOfWaterClosets.isFieldValid ===false)
          isConnectionDetailsValid_ = false
          
          
        }
    
      }
      else if(tubewell_){
        isConnectionDetailsValid_ = true 
    
      }
      let isOwnershipsingleValid =false

      // for Ownership Type
      let x = get('applyScreen.property.ownershipCategory')
      let ownershipCategory= get(state.screenConfiguration.preparedFinalObject,"applyScreen.property.ownershipCategory", '' )
      if(ownershipCategory)
      {
        let SingleOwnerDetailsCardPath =''
        if(ownershipCategory !=='INDIVIDUAL.MULTIPLEOWNERS')
        {
          //SingleOwnerDetailsCardPath='components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.ownerDetail.children.cardContent.children.headerDiv.props.items'
           isOwnershipsingleValid =  validateFields(
            "components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.ownerDetail.children.cardContent.children.headerDiv.props.items[0].item0.children.cardContent.children.viewFive.children",
            state,
            dispatch,
            "apply"
          ); 

        }
        else{
          let SingleOwnerDetailsCardPath =
          "components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.MultiownerDetail.children.cardContent.children.headerDiv.props.items";
        let SingleOwnerDetailsItems = get(
          state.screenConfiguration.screenConfig.apply,
          SingleOwnerDetailsCardPath,
          []
        );
        let isMasterDetailsValid = true;
        isOwnershipsingleValid = true;
        for (var j = 0; j < SingleOwnerDetailsItems.length; j++) {
          if (
            (SingleOwnerDetailsItems[j].isDeleted === undefined ||
              SingleOwnerDetailsItems[j].isDeleted !== false) &&
            !validateFields(
              `${SingleOwnerDetailsCardPath}[${j}].item${j}.children.cardContent.children.viewFive.children`,
              state,
              dispatch,
              "apply"
            )
          )
          {
            isMasterDetailsValid = false; 
            isOwnershipsingleValid = false;

          }


        }
      }

      }

      let isPropertyUsageValid= validateFields(
        "components.div.children.formwizardFirstStep.children.propertyUsageDetails.children.cardContent.children.propertyUsage.children.PropertyUsageDetails.children",
        state,
        dispatch,
        "apply"
      );
      const isConnectionHolderDetailsValid= validateFields(
        "components.div.children.formwizardFirstStep.children.connectionHolderDetails.children.cardContent.children.holderDetails.children.holderDetails.children",
        state,
        dispatch,
        "apply"
      );
      const water = get(
        state.screenConfiguration.preparedFinalObject,
        "applyScreen.water"
      );
      const sewerage = get(
        state.screenConfiguration.preparedFinalObject,
        "applyScreen.sewerage"
      );
      const tubewell = get(
        state.screenConfiguration.preparedFinalObject,
        "applyScreen.tubewell"
      );
      const fields = get(
        state.screenConfiguration.screenConfig["apply"],
        "components.div.children.formwizardFirstStep.children.propertyUsageDetails.children.cardContent.children.propertyUsage.children.PropertyUsageDetails.children",
        {}
      );
      if(sewerage || tubewell)
      {
        if(fields.propertySubUsageType!==undefined) 
        {
          if(fields.propertySubUsageType.isFieldValid ===false)
          {
            isPropertyUsageValid = true

          }
          else{
            isPropertyUsageValid = true
          }
          
          
        }
        else
        isPropertyUsageValid = true

      }
      

      if(!isPropertyUsageValid || !isConnectionHolderDetailsValid || !isOwnershipTypeInputValid ||!isPropertyLocationDetailValid || !isPropertyDetailsValid || !isOwnershipsingleValid || !isConnectionDetailsValid_){
        isFormValid = false;
      }
      
      let searchPropertyId = get(
        state.screenConfiguration.preparedFinalObject,
        "searchScreen.propertyIds"
      )
      let applyScreenObject = get(state.screenConfiguration.preparedFinalObject, "applyScreen");
      //connectionholdercode

     let connectionHolderObj = get(state.screenConfiguration.preparedFinalObject, "connectionHolders");
     let ownershipCategory_T= get(state.screenConfiguration.preparedFinalObject,"applyScreen.property.ownershipCategory", 'INDIVIDUAL.SINGLEOWNER' )
    if(connectionHolderObj.length>0)
    {
      if(connectionHolderObj[0].ownerType === null)
      {
       connectionHolderObj[0].ownerType= ownershipCategory_T;
      }
      else{
        connectionHolderObj[0].ownerType= ownershipCategory_T;
 
      }
      //connectionHolderObj.ownerType = "INDIVIDUAL.SINGLEOWNER"
      let holderData = connectionHolderObj[0];
       if (holderData !== null && holderData !== undefined) {
         if (holderData.sameAsPropertyAddress === true) {
           holderData = connectionHolderObj[0]
         }
       }
       if (holderData == null) {
         applyScreenObject.connectionHolders = holderData;
      } else {
         let arrayHolderData = [];
         arrayHolderData.push(holderData);
         applyScreenObject.connectionHolders = arrayHolderData;
       }

    }

      // call if conection is not created
      //validate ownner ship
      let propertyPayload = get(
        state,
        "screenConfiguration.preparedFinalObject.applyScreen.property"
      );
      let ValidOwnership = false
      let ownershipCategory_= get(state.screenConfiguration.preparedFinalObject,"applyScreen.property.ownershipCategory", '' )
      if(ownershipCategory_)
      {      
        ValidOwnership =  true;
      }
      if(ValidOwnership)
      {
        if(validateConnHolderDetails(applyScreenObject))
        {
          ValidOwnership = true
          // validation to check multi owner data if ownershipCategory is  INDIVIDUAL.MULTIPLEOWNERS
          let errorMessage_ = {
            labelName: "Please select all Fequired field ",
            labelKey: "WS_FILL_REQUIRED_FIELDS"
          };
          if(ownershipCategory_ === "INDIVIDUAL.MULTIPLEOWNERS")
          {
            let owners = get(state.screenConfiguration.preparedFinalObject,"applyScreen.property.owners",[])
            if(owners.length === 1)
            {
              errorMessage_.labelName="Please add multilple ownner data"
              errorMessage_.labelKey="WS_FILL_MULTIPLEOWNERS_FIELDS"
              
              dispatch(toggleSnackbar(true, errorMessage_, "warning"));
              return false

            }
            else if (owners.length>1)
            {
              let cardJsonPath =
              "components.div.children.formwizardSecondStep.children.MaterialIndentMapDetails.children.cardContent.children.MaterialIndentDetailsCard.props.items";
              cardJsonPath ="components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.MultiownerDetail.children.cardContent.children.headerDiv.props.items";
              //[0].item0.children.cardContent.children.viewFive.children"
              let pagename = "apply";
              let jasonpath =  "applyScreen.property.owners";//indents[0].indentDetails
              let value = "name";
              let DuplicatItem = ValidateCard(state,dispatch,cardJsonPath,pagename,jasonpath,value)
              if(DuplicatItem && DuplicatItem[0])
              {
                if(DuplicatItem[0].IsDuplicatItem)
                {
                const LocalizationCodeValueN = getLocalizationCodeValue("WS_FILL_MULTIPLEOWNERS_NAME_FIELDS")
                const errorMessageN = {
                  labelName: "Duplicate name Added",
                  //labelKey:   `STORE_MATERIAL_DUPLICATE_VALIDATION ${DuplicatItem[0].duplicates}`
                  labelKey:   LocalizationCodeValueN+' '+DuplicatItem[0].duplicates
                };
                dispatch(toggleSnackbar(true, errorMessageN, "warning"));
                return false;
              }
              }
              value = "mobileNumber";
              let DuplicatItemM = ValidateCard(state,dispatch,cardJsonPath,pagename,jasonpath,value)             
              // if(DuplicatItemM && DuplicatItemM[0])
              // {
              //   if(DuplicatItemM[0].IsDuplicatItem)
              //   {
              //   const LocalizationCodeValueM = getLocalizationCodeValue("WS_FILL_MULTIPLEOWNERS_MOBILE_FIELDS")
              //   const errorMessageM = {
              //     labelName: "Duplicate mobile number Added",
              //     //labelKey:   `STORE_MATERIAL_DUPLICATE_VALIDATION ${DuplicatItem[0].duplicates}`
              //     labelKey:   LocalizationCodeValueM+' '+DuplicatItemM[0].duplicates
              //   };
              //   dispatch(toggleSnackbar(true, errorMessageM, "warning"));
              //   return false;
              // }
              // }
              value = "emailId";
              let DuplicatItemE = ValidateCard(state,dispatch,cardJsonPath,pagename,jasonpath,value)             
              // if(DuplicatItemE && DuplicatItemE[0])
              // {
              //   if(DuplicatItemE[0].IsDuplicatItem)
              //   {
              //   const LocalizationCodeValueE = getLocalizationCodeValue("WS_FILL_MULTIPLEOWNERS_EMAIL_FIELDS")
              //   const errorMessageE = {
              //     labelName: "Duplicate email id Added",
              //     //labelKey:   `STORE_MATERIAL_DUPLICATE_VALIDATION ${DuplicatItem[0].duplicates}`
              //     labelKey:   LocalizationCodeValueE+' '+DuplicatItemE[0].duplicates
              //   };
              //   dispatch(toggleSnackbar(true, errorMessageE, "warning"));
              //   return false;
              // }
              // }
            }
          }

        }
        else{
          ValidOwnership = false;
        }
        
      }

      if(ValidOwnership)
      {

      if(isFormValid)
      {
        
        let tenantId = get(
          state,
          "screenConfiguration.preparedFinalObject.applyScreenMdmsData.tenant.tenants[0].code"
        );
        set(propertyPayload, "channel", "SYSTEM");
        set(propertyPayload, "source", "MUNICIPAL_RECORDS");
       // set(propertyPayload, "noOfFloors", 1);
        set(propertyPayload, "propertyType", "VACANT");
       // propertyPayload.landArea = parseInt(propertyPayload.landArea);
        propertyPayload.landArea = propertyPayload.landArea;
        propertyPayload.totalConstructedArea = (propertyPayload.landArea);
        propertyPayload.tenantId = tenantId;
       // propertyPayload.address.doorNo = propertyPayload.address.plotNo;
       let doorNo =propertyPayload.address.doorNo
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
        set(propertyPayload, "address.doorNo", doorNo.toUpperCase());
        if(propertyPayload.address.city !== undefined)
        propertyPayload.address.city = propertyPayload.address.city;
        else
        {
          let city  = get(
            state,
            "screenConfiguration.preparedFinalObject.applyScreenMdmsData.City[0].name"
          );
          propertyPayload.address.city = city;
        }
        if(propertyPayload.address.locality !== undefined)
        {
          if(propertyPayload.address.locality.code.value)
          {
          propertyPayload.address.locality.code = propertyPayload.address.locality.code.value;
          }
          else if(propertyPayload.address.locality.code)
          {
            propertyPayload.address.locality.code = propertyPayload.address.locality.code;
          }
          else
          {
         // propertyPayload.address.locality.code = "DB_1";
          set(propertyPayload, "address.locality.code", "DB_1");
          }
        }
        else
        {
          // propertyPayload.address.locality.code = "DB_1";
           set(propertyPayload, "address.locality.code", "DB_1");
           }
        // remove deleted ownner from the list 
        let owners_ = propertyPayload.owners.filter(x=> (x.isDeleted === undefined || x.isDeleted !== false ))
        set(propertyPayload, "owners", owners_);
       // propertyPayload.address.locality.code = propertyPayload.address.locality.code.value;
       // validate water field 
       if (water) {
        if (validateFeildsForWater(applyScreenObject)) {
          isFormValid = true;
          hasFieldToaster = false;
        } else {
          isFormValid = false;
          dispatch(
            toggleSnackbar(
              true, {
              labelKey: "WS_FILL_REQUIRED_FIELDS",
              labelName: "Please fill Required details"
            },
              "warning"
            )
          )
          return;
        }
      }
      if (sewerage) {
        if (validateFeildsForSewerage(applyScreenObject)) {
          isFormValid = true;
          hasFieldToaster = false;
        } else {
          isFormValid = false;
          dispatch(
            toggleSnackbar(
              true, {
              labelKey: "WS_FILL_REQUIRED_FIELDS",
              labelName: "Please fill Required details"
            },
              "warning"
            )
          )
          return;
        }
      }
        propertyPayload.rainWaterHarvesting=false;
        try {
        propertyPayload.creationReason = 'CREATE';
        let payload = null;
        payload = await httpRequest(
          "post",
          "/property-services/property/_create",
          "_update",
          [],
          { Property: propertyPayload }
  
        );
        if (payload) {
          dispatch(prepareFinalObject("Properties", payload.Properties[0]));
          if(payload.Properties[0].propertyId != null)
          searchPropertyId = payload.Properties[0].propertyId
          else{
            searchPropertyId = payload.Properties[0].id
          }
          dispatch(prepareFinalObject("searchScreen.propertyIds", searchPropertyId));
         // propertySearchApiCall(state,dispatch);
         let tenantId = getTenantIdCommon();
         let queryObject = [];//[{ key: "tenantId", value: tenantId }];
         let searchScreenObject = get(state.screenConfiguration.preparedFinalObject, "searchScreen", {});
         for (var key in searchScreenObject) {
          if (searchScreenObject.hasOwnProperty(key) && searchScreenObject[key].trim() !== "") {
            queryObject.push({ key: key, value: searchScreenObject[key].trim() });
          }
        }
         let response = await getPropertyResults(queryObject, dispatch);
         if (response && response.Properties.length > 0) {
          if(response.Properties[0].status === 'INACTIVE'){
            dispatch(toggleSnackbar(true, { labelKey: "ERR_WS_PROP_STATUS_INACTIVE", labelName: "Property Status is INACTIVE" }, "warning"));
          }else{
            let propertyData = response.Properties[0];
         // let contractedCorAddress = "";
         dispatch(prepareFinalObject("applyScreen.property", propertyData));
          }
        }
        }
        else{
          dispatch(
            toggleSnackbar(
              true, {
              labelKey: "PT_COMMON_FAILED_TO_REGISTER_PROPERTY",
              labelName: "Failed to register property"
            },
              "warning"
            )
          )
          return;
        }
      } catch (error) {
        console.log(error.message);
        dispatch(
          toggleSnackbar(
            true, {
            // labelKey: "PT_COMMON_FAILED_TO_REGISTER_PROPERTY",
            // labelName: "Failed to register property"
            labelKey:error.message,
            labelName: error.message
          },
            "warning"
          )
        )
        return false;
        isFormValid = false
      }
      }
      if (searchPropertyId !== undefined && searchPropertyId !== "") {
        if(!isActiveProperty(applyScreenObject.property)){
          dispatch(toggleSnackbar(true, { labelKey: `ERR_WS_PROP_STATUS_${applyScreenObject.property.status}`, labelName: `Property Status is ${applyScreenObject.property.status}` }, "warning"));     
          showHideFieldsFirstStep(dispatch,"",false);
          return true;
        }
        // TODO else part update propertyId.
        if (validateConnHolderDetails(applyScreenObject)) {
                   isFormValid = true;
                   hasFieldToaster = false;
        if (applyScreenObject.water || applyScreenObject.sewerage || applyScreenObject.tubewell) {
          if (
            applyScreenObject.hasOwnProperty("property") &&
            !_.isUndefined(applyScreenObject["property"]) &&
            !_.isNull(applyScreenObject["property"]) &&
            !_.isEmpty(applyScreenObject["property"])
          ) {
            if ((water && sewerage) ||(sewerage && tubewell)) {
              if (water && sewerage && validateFeildsForBothWaterAndSewerage(applyScreenObject)) {
                isFormValid = true;
                hasFieldToaster = false;
              } 
              else if (tubewell && validateFeildsForSewerage(applyScreenObject) ){
                isFormValid = true;
                hasFieldToaster = false;
              }
                else {
                isFormValid = false;
                dispatch(
                  toggleSnackbar(
                    true, {
                    labelKey: "WS_FILL_REQUIRED_FIELDS",
                    labelName: "Please fill Required details"
                  },
                    "warning"
                  )
                )
              }
            } else if (water) {
              if (validateFeildsForWater(applyScreenObject)) {
                isFormValid = true;
                hasFieldToaster = false;
              } else {
                isFormValid = false;
                dispatch(
                  toggleSnackbar(
                    true, {
                    labelKey: "WS_FILL_REQUIRED_FIELDS",
                    labelName: "Please fill Required details"
                  },
                    "warning"
                  )
                )
              }
            } else if (sewerage) {
              if (validateFeildsForSewerage(applyScreenObject)) {
                isFormValid = true;
                hasFieldToaster = false;
              } else {
                isFormValid = false;
                dispatch(
                  toggleSnackbar(
                    true, {
                    labelKey: "WS_FILL_REQUIRED_FIELDS",
                    labelName: "Please fill Required details"
                  },
                    "warning"
                  )
                )
              }
            }
          } 
          else {
            isFormValid = false;
            dispatch(
              toggleSnackbar(
                true, {
                labelKey: "ERR_WS_PROP_NOT_FOUND",
                labelName: "No Property records found, please search or create a new property"
              },
                "warning"
              )
            );
          }
          let waterData = get(state, "screenConfiguration.preparedFinalObject.WaterConnection");
          let sewerData = get(state, "screenConfiguration.preparedFinalObject.SewerageConnection")
          let waterChecked = get(state, "screenConfiguration.preparedFinalObject.applyScreen.water");
          let sewerChecked = get(state, "screenConfiguration.preparedFinalObject.applyScreen.sewerage");
          let tubewellChecked = get(state, "screenConfiguration.preparedFinalObject.applyScreen.tubewell");
          if (isFormValid) {
            if ((waterData && waterData.length > 0) || (sewerData && sewerData.length > 0)) {
              if (waterChecked && sewerChecked) {
                dispatch(
                  prepareFinalObject(
                    "applyScreen.service",
                    "Water And Sewerage"
                  )
                );
                if (sewerData && sewerData.length > 0 && waterData.length === 0) { await applyForWater(state, dispatch); }
                else if (waterData && waterData.length > 0 && sewerData.length === 0) { await applyForSewerage(state, dispatch); }
              } else if (sewerChecked && sewerData.length === 0) {
                dispatch(
                  prepareFinalObject(
                    "applyScreen.service",
                    "Sewerage"
                  )
                );
                await applyForSewerage(state, dispatch);
              } else if (waterChecked && waterData.length === 0) {
                dispatch(
                  prepareFinalObject(
                    "applyScreen.service",
                    "Water"
                  )
                );
                await applyForWater(state, dispatch);
              }
            } else if ((waterChecked && sewerChecked) || (sewerChecked && tubewellChecked)) {
              dispatch(
                prepareFinalObject(
                  "applyScreen.service",
                  "Water And Sewerage"
                )
              );
              if (waterData.length === 0 && sewerData.length === 0) { isFormValid = await applyForWaterOrSewerage(state, dispatch); }
            } else if (waterChecked || tubewellChecked) {
              dispatch(
                prepareFinalObject(
                  "applyScreen.service",
                  "Water"
                )
              );
              if (waterData.length === 0) { isFormValid = await applyForWaterOrSewerage(state, dispatch); }
            } else if (sewerChecked) {
              dispatch(prepareFinalObject("applyScreen.service", "Sewerage"))
              if (sewerData.length === 0) { isFormValid = await applyForWaterOrSewerage(state, dispatch); }
            }
          }
        } else {
          isFormValid = false;
          hasFieldToaster = true;
        }
      }
      else{
           isFormValid = false;
                dispatch(
                  toggleSnackbar(
                    true, {
                    labelKey: "WS_FILL_REQUIRED_HOLDER_FIELDS",
                    labelName: "Please fill Required details"
                  },
                    "warning"
                  )
                )
              }
            }
            else {
        isFormValid = isFormValid;
        if(!isFormValid)
        {
        dispatch(
          toggleSnackbar(
            true, {
            labelKey: "WS_FILL_REQUIRED_FIELDS",
            labelName: "Please fill Required details"
          },
            "warning"
          )
        );
        }
      }
    }
    else{
      let errorMessage = {
        labelName: "Please select all Fequired field ",
        labelKey: "WS_FILL_REQUIRED_FIELDS"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
      return false

    }
    }
    const applicationNo_ = getQueryArg(window.location.href, "applicationNumber");
    let connectionNo =  get(
      state.screenConfiguration.preparedFinalObject,
      "WaterConnection[0].connectionNo",
      null
    );
    let applicationStatus_ =  get(
      state.screenConfiguration.preparedFinalObject,
      "WaterConnection[0].applicationStatus",
      null
    );
    if(process.env.REACT_APP_NAME === "Citizen" && !applicationNo_)
    {
      removingDocumentsWorkFlow(state, dispatch);
    }
    else if(process.env.REACT_APP_NAME === "Citizen" && !connectionNo)
    {
      if(water)
      {
        //console.log('document clear block')
        if(applicationStatus_ ==='INITIATED')
        removingDocumentsWorkFlow(state, dispatch);
      }

    }
    // validate category if Application Type is changged
    if(process.env.REACT_APP_NAME === "Citizen")
    {
      let category_ = get(
        state.screenConfiguration.preparedFinalObject,
        "applyScreen.waterProperty.usageSubCategory",
        null
      );
      
      
      if(!connectionNo)
      {
      if(water)
      {
        
        if(category_ === null)
      {
        category_ = get(state.screenConfiguration.screenConfig.apply,
          'components.div.children.formwizardFirstStep.children.propertyUsageDetails.children.cardContent.children.propertyUsage.children.PropertyUsageDetails.children.propertySubUsageType.props.value',
          null
          )
      if(category_ === null)
      {
        
       
        let errorMessage_ = {
          labelName: "Please select Usage Caregory",
          labelKey: "WS_APPLICATION_TYPE_CHANGGED_VALIDATION"
        };
        let waterApplicationType = get(
          state.screenConfiguration.preparedFinalObject,
          "applyScreen.waterApplicationType",
          null
        );
        if(waterApplicationType !=="TEMPORARY_BILLING")
        {
          dispatch(toggleSnackbar(true, errorMessage_, "warning"));
          return false;
        }
        
      }
      }
      else
      {
        set(
          state.screenConfiguration.preparedFinalObject,
          "applyScreen.waterProperty.usageSubCategory",
          category_
        );
        dispatch(prepareFinalObject("applyScreen.waterProperty.usageSubCategory", category_));

      
        
  
      }
  
      }
    }
    if(connectionNo)
    {
      // if(water)
      // {
        if(category_ === null)
        {
          category_ = get(state.screenConfiguration.screenConfig.apply,
            'components.div.children.formwizardFirstStep.children.propertyUsageDetails.children.cardContent.children.propertyUsage.children.PropertyUsageDetails.children.propertySubUsageType.props.value',
            null
            )
            if(category_ ===null || category_ ==='')
            {
              category_ = get(state.screenConfiguration.preparedFinalObject,'applyScreen.waterProperty.usageSubCategory','')
    
            }
            set(
              state.screenConfiguration.preparedFinalObject,
              "applyScreen.waterProperty.usageSubCategory",
              category_
            );
            dispatch(prepareFinalObject("applyScreen.waterProperty.usageSubCategory", category_));
          }

      //}
    }

    }
  //?
  // property update if PENDING_FOR_CITIZEN_ACTION
  // dispatch(handleField(
  //   "apply",
  //   `components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.ownershipTypeInput`,
  //   "props.disabled",
  //   //Isreadolny
  //   true
  //   ));
  //   const textFieldsOwnerInformation = ["ownerName","mobileNumber","email","guardianName","correspondenceAddress"];
  //   for (let i = 0; i < textFieldsOwnerInformation.length; i++) {
  //     dispatch(handleField(
  //       "apply",
  //       `components.div.children.formwizardFirstStep.children.ownerDetails.children.cardContent.children.ownerDetail.children.cardContent.children.headerDiv.props.items.0.item0.children.cardContent.children.viewFive.children.${textFieldsOwnerInformation[i]}`,
  //       "props.disabled",
  //       true
  //       ));
  //   }
  propertyUpdateCitizen(state,dispatch)

  //?
    
    
    prepareDocumentsUploadData(state, dispatch);
  }
  // console.log(activeStep);

  if (activeStep === 1) {
    if (moveToReview(state, dispatch)) {
      await pushTheDocsUploadedToRedux(state, dispatch);
      isFormValid = true; hasFieldToaster = false;
      const wnsStatus =  window.localStorage.getItem("WNS_STATUS");
      let water = get(state.screenConfiguration.preparedFinalObject, "applyScreen.water", false);
      let sewerage = get(state.screenConfiguration.preparedFinalObject, "applyScreen.sewerage", false);
      let tubewell = get(state.screenConfiguration.preparedFinalObject, "applyScreen.tubewell", false);
      if(water || tubewell)
      {
        let ProcessInstances =  get(
          state,
          `screenConfiguration.preparedFinalObject.workflow.ProcessInstances`,
          ''
      );
        let action=  get(
          state,
          `screenConfiguration.preparedFinalObject.workflow.ProcessInstances[${ProcessInstances.length-1}].action`,
          ''
      );
      if(action ==='')
      {
        action = get(
          state.screenConfiguration.preparedFinalObject,
          `applyScreen.waterApplication.action`,
          ''
      );
        }
      if(action ==='SEND_BACK_TO_CITIZEN' ||action ==='SEND_BACK_TO_CITIZEN_FOR_ROADCUT_NOC')
      {
        window.localStorage.removeItem("ActivityStatusFlag");
      }

      }
      else if (sewerage)
      {
        let ProcessInstances =  get(
          state,
          `screenConfiguration.preparedFinalObject.workflow.ProcessInstances`,
          ''
      );
        let action=  get(
          state,
          `screenConfiguration.preparedFinalObject.workflow.ProcessInstances[${ProcessInstances.length-1}].action`,
          ''
      );
      if(action ==='')
      {
        action = get(
          state.screenConfiguration.preparedFinalObject,
          `applyScreen.waterApplication.action`,
          ''
      );
      }
      if(action ==='SEND_BACK_TO_CITIZEN' ||action ==='SEND_BACK_TO_CITIZEN_FOR_ROADCUT_NOC' )//"SEND_BACK_TO_CITIZEN_FOR_ROADCUT_NOC"
      {
        window.localStorage.removeItem("ActivityStatusFlag");
      }

      }

      if(process.env.REACT_APP_NAME === "Citizen" && getQueryArg(window.location.href, "action") === "edit"&& window.localStorage.getItem("ActivityStatusFlag")=== "true"){
        //window.localStorage.removeItem("ActivityStatusFlag");
        console.log('pritam')
      }
     else if (process.env.REACT_APP_NAME === "Citizen" && getQueryArg(window.location.href, "action") === "edit") {  
        setReviewPageRoute(state, dispatch);
      }
          // set ledgerRange dropdown based on sectore code code

    let sectorcode = get(
      state.screenConfiguration.preparedFinalObject,
      "applyScreen.property.address.locality.code",
      null
    );
    //get  ledgerRange from sectorList jason
    let sectorList = get(
      state.screenConfiguration.preparedFinalObject,
      "applyScreenMdmsData.ws-services-masters.sectorList",
      []
    );

    let WaterConnection = get(state.screenConfiguration.preparedFinalObject, "WaterConnection");
      let SewerageConnection = get(state.screenConfiguration.preparedFinalObject, "SewerageConnection");
      if(SewerageConnection.length ==1)
      {
        if(SewerageConnection[0].sewerage === true)
        {
          sectorList = get(
            state.screenConfiguration.preparedFinalObject,
            "applyScreenMdmsData.ws-services-masters.swSectorList",
            []
          );
        }
      }
      if(WaterConnection.length ==1)
      {
        if(WaterConnection[0].sewerage === true)
        {
          sectorList = get(
            state.screenConfiguration.preparedFinalObject,
            "applyScreenMdmsData.ws-services-masters.swSectorList",
            []
          );
        }
      }
    if(sectorcode.value!== undefined)
    sectorcode = sectorcode.value
    sectorList = sectorList.filter(x=>x.code === sectorcode);
    let ledgerRange=[];
    if(sectorList && sectorList[0])
    {
      
      let maxvalue = parseInt(sectorList[0].ledgerRange)
      dispatch(prepareFinalObject("applyScreen.subdiv", sectorList[0].subdivision));
      for (let index = 1; index <= maxvalue; index++) {
       // const element = array[index];
       //let code
        if(index<= 9)
        {
          //let code = `0${index}`;
          ledgerRange.push(
          {
            code:`0${index}`,
            name :index
          }
            
          )

        }
        else{
          ledgerRange.push(
            {
              code:index,
              name :index
            }
              
            )

        }
        
      }
      let DIV_ = get(state, "screenConfiguration.preparedFinalObject.applyScreen.div",'1');
      let ledgerGroup = get(state, "screenConfiguration.preparedFinalObject.applyScreen.ledgerGroup",'0101');
      let connectionNoUI = `${DIV_}-${sectorList[0].subdivision}-${ledgerGroup}-XXXX-XX`
      dispatch(prepareFinalObject("applyScreen.connectionNoUI",connectionNoUI));
    }
    dispatch(prepareFinalObject("ledgerlist",ledgerRange));
    }
    else { isFormValid = false; hasFieldToaster = true; }

    //set subusageCategory
    let usageCategory_ = get(state, "screenConfiguration.preparedFinalObject.applyScreen.property.usageCategory");
    let subusageCategory = get(state, "screenConfiguration.preparedFinalObject.applyScreen.property.subusageCategory");
    console.log(`pritam${usageCategory_}`)
    set(state,"screenConfiguration.preparedFinalObject.applyScreen.property.subusageCategory",subusageCategory)
    // visible false based on application created
    let water = get(state.screenConfiguration.preparedFinalObject, "applyScreen.water", false);
    let sewerage = get(state.screenConfiguration.preparedFinalObject, "applyScreen.sewerage", false);
    let tubewell = get(state.screenConfiguration.preparedFinalObject, "applyScreen.tubewell", false);
    let activityType = get(state.screenConfiguration.preparedFinalObject, "applyScreen.activityType", '');
    let service = getQueryArg(window.location.href, "service");
    let code = get(state.screenConfiguration.preparedFinalObject, "applyScreen.property.address.locality.code", '');
    if(service)
    {
      if(service ==='WATER')
    {
      water =true
    }
    else{
      sewerage = true
    }
    }
    if(activityType ==='NEW_TUBEWELL_CONNECTION')
    {
      tubewell = true
    }
    if(sewerage)
    {
      //set sector name
      code =GetMdmsNameBycode(state, dispatch,"applyScreenMdmsData.ws-services-masters.swSectorList",code)   
      set(state,"screenConfiguration.preparedFinalObject.applyScreen.property.address.locality.name",code)
      dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewConnDetails.children.cardContent.children.viewpropertyLocation",
          "visible",
          false
        )
      );
      dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewConnDetails.children.cardContent.children.viewPropertyConnection",
          "visible",
          false
        )
      );
      dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewConnDetails.children.cardContent.children.viewPropertyConnectionSw",
          "visible",
          true
        )
      );
      //viewPropertyConnectionSw

    }
    if(water)
    {
      code =GetMdmsNameBycode(state, dispatch,"applyScreenMdmsData.ws-services-masters.sectorList",code) 
      set(state,"screenConfiguration.preparedFinalObject.applyScreen.property.address.locality.name",code)  
      dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewConnDetails.children.cardContent.children.viewPropertyConnectionSw",
          "visible",
          false
        )
      );

    }
    if(tubewell)
    {
      code =GetMdmsNameBycode(state, dispatch,"searchPreviewScreenMdmsData.ws-services-masters.sectorList",code)   
      set(state,"screenConfiguration.preparedFinalObject.applyScreen.property.address.locality.name",code)
      dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewConnDetails.children.cardContent.children.viewPropertyConnectionSw",
          "visible",
          false
        )
      );
      dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewConnDetails.children.cardContent.children.viewpropertyLocation",
          "visible",
          false
        )
      );
      dispatch(
        handleField(
          "apply",
          "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewConnDetails.children.cardContent.children.viewPropertyConnection",
          "visible",
          false
        )
      );

    }
  }

  if (activeStep === 2 && process.env.REACT_APP_NAME !== "Citizen") {
    if (getQueryArg(window.location.href, "action") === "edit") {

      //new validation

      const isConnectionDetailsValid= validateFields(
        "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children",
        state,
        dispatch,
        "apply"
      );
      const activeDetails= validateFields(
        "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children",
        state,
        dispatch,
        "apply"
      );
      const PropactiveDetails= validateFields(
        "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.ProposedActivationDetailsContainer.children.cardContent.children.PropactiveDetails.children",
        state,
        dispatch,
        "apply"
      );
      let IvalidadditionalCharges= validateFields(
        "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.OtherChargeContainer.children.cardContent.children.chargesDetails.children.additionalCharges",
        state,
        dispatch,
        "apply"
      );
      let IvalidconstructionCharges= validateFields(
        "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.OtherChargeContainer.children.cardContent.children.chargesDetails.children.constructionCharges",
        state,
        dispatch,
        "apply"
      );
      IvalidconstructionCharges = get(state.screenConfiguration.screenConfig["apply"], "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.OtherChargeContainer.children.cardContent.children.chargesDetails.children.constructionCharges.isFieldValid",true)
      IvalidadditionalCharges = get(state.screenConfiguration.screenConfig["apply"], "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.OtherChargeContainer.children.cardContent.children.chargesDetails.children.additionalCharges.isFieldValid",true)
      let additionalCharges =parseInt(get(state, "screenConfiguration.preparedFinalObject.applyScreen.waterApplication.additionalCharges",0));
      let constructionCharges =parseInt(get(state, "screenConfiguration.preparedFinalObject.applyScreen.waterApplication.constructionCharges",0));
      if(additionalCharges === 0 && constructionCharges === 0)
      {
        IvalidconstructionCharges = true
        IvalidadditionalCharges = true
      }
      else if(additionalCharges < 0 || constructionCharges < 0)
      {
        IvalidconstructionCharges = false
        IvalidadditionalCharges = false 

      }
      let waterT = get(state.screenConfiguration.preparedFinalObject, "applyScreen.water", false);
      let sewerageT = get(state.screenConfiguration.preparedFinalObject, "applyScreen.sewerage", false);
      let tubewellT = get(state.screenConfiguration.preparedFinalObject, "applyScreen.tubewell", false);
      if((sewerageT === false && tubewellT === false) && waterT === false )
      {
        IvalidconstructionCharges = true
        IvalidadditionalCharges = true
      }
      
 

if(isConnectionDetailsValid)
{
  isFormValid = isConnectionDetailsValid
  let errorMessage = {
    labelName: "Meter installation date must be greater then connection execution date",
    labelKey: "WS_METER_INSTALATION_DATE_VALIDATION"
  };
  let proposedMeterInstallationDate = get(state, "screenConfiguration.preparedFinalObject.applyScreen.proposedMeterInstallationDate");
  let connectionExecutionDate = get(state, "screenConfiguration.preparedFinalObject.applyScreen.connectionExecutionDate");
  let meterInstallationDate = get(state, "screenConfiguration.preparedFinalObject.applyScreen.meterInstallationDate");
  let businessService = get(state, "screenConfiguration.preparedFinalObject.workflow.ProcessInstances[0].businessService");
  let  activityType = get(state, "screenConfiguration.preparedFinalObject.applyScreen.activityType");
  let  applicationStatus = get(state, "screenConfiguration.preparedFinalObject.applyScreen.applicationStatus");
  let fourdigitNumber = get(state, "screenConfiguration.preparedFinalObject.applyScreen.waterApplication.fourdigitNumber");
  let twodigitNumber = get(state, "screenConfiguration.preparedFinalObject.applyScreen.waterApplication.twodigitNumber");
  let connectionNoCheck = get(state, "screenConfiguration.preparedFinalObject.applyScreen.connectionNo");
  if(connectionExecutionDate)
  {
    if(!Number(connectionExecutionDate))
    {
      connectionExecutionDate = convertDateToEpoch(connectionExecutionDate);

    }
  }
  if(proposedMeterInstallationDate)
  {
    if(!Number(proposedMeterInstallationDate))
    {
      proposedMeterInstallationDate = convertDateToEpoch(proposedMeterInstallationDate);

    }
  }
  if(meterInstallationDate)
  {
    if(!Number(meterInstallationDate))
    {
      meterInstallationDate = convertDateToEpoch(meterInstallationDate);  
    }
  }

  if(proposedMeterInstallationDate && connectionExecutionDate)
  {
    // proposedMeterInstallationDate =proposedMeterInstallationDate
    // proposedMeterInstallationDate =proposedMeterInstallationDate
    if(activityType)
    {
    if(activityType ==='WS_METER_UPDATE' || activityType === 'UPDATE_METER_INFO' || activityType ==='APPLY_FOR_METER_TESTING' || activityType ==='WS_METER_TESTING')
    {
      if(connectionExecutionDate> proposedMeterInstallationDate)
      {
        isFormValid = false;
        errorMessage = {
          labelName: "Proposed meter installation date must be greater then connection execution date",
          labelKey: "WS_PROP_METER_INSTALATION_DATE_VALIDATION"//WS_METER_INSTALATION_DATE_VALIDATION
        };
        // dispatch(toggleSnackbar(true, errorMessage, "warning"));
        //return 
      }
    }
    }


  }
 else  if(connectionExecutionDate && meterInstallationDate)
  {
  if(connectionExecutionDate >meterInstallationDate)
  {
    isFormValid = false;
     errorMessage = {
      labelName: "Meter installation date must be greater then connection execution date",
      labelKey: "WS_METER_INSTALATION_DATE_VALIDATION"
    };
   
    
   // return 
  }
  }
  // connection number set validation
  
  if(( activityType ==='TEMPORARY_WSCONNECTION'    
    || activityType ==='APPLY_FOR_TEMPORARY_CONNECTION_BILLING' //TB
    || activityType ==='TEMPORARY_WSCONNECTION_BILLING'
    || activityType ==='NEW_WS_CONNECTION'//NR
    || activityType ==='REGULARWSCONNECTION' )
  &&  
  (applicationStatus ==="PENDING_FOR_CONNECTION_ACTIVATION_BY_SUPERINTENDENT"
    || applicationStatus ==="PENDING_FOR_CONNECTION_ACTIVATION_BY_SUPERINTENDENT"
    ||applicationStatus ==="PENDING_FOR_CONNECTION_ACTIVATION_BY_SUPERINTENDENT"
    //|| 1===1
    ) 
    )
  {
    if(connectionNoCheck === undefined || connectionNoCheck === null)
      {
        isFormValid = false;
            errorMessage = {
              labelName: "Please set Consumer number/Account number",
              labelKey: "WS_SET_CONNECTION_NUMBER_VALIDATION"//WS_METER_INSTALATION_DATE_VALIDATION
            };
          }
          

          else if((connectionNoCheck && connectionNoCheck.length != 13) )
          {
            isFormValid = false;
            errorMessage = {
              labelName: "Please set Consumer number/Account number",
              labelKey: "WS_SET_CONNECTION_NUMBER_VALIDATION"//WS_METER_INSTALATION_DATE_VALIDATION
            };

          }
          // else if(connectionNoCheck.length === 13)
          // {
          //   isFormValid = false;
          //   errorMessage = {
          //     labelName: "Please set Consumer number/Account number",
          //     labelKey: "WS_SET_CONNECTION_NUMBER_VALIDATION"//WS_METER_INSTALATION_DATE_VALIDATION
          //   };

          // }

  }

else{

}

  //
  if(isFormValid)
  {
    //console.log('pritam')
    if(activeDetails)
    {
      if(PropactiveDetails)
      {
        if(IvalidadditionalCharges === true && IvalidconstructionCharges === true)
        {
          setReviewPageRoute(state, dispatch);

        }
        else{
          isFormValid = false;
          errorMessage = {
            labelName: "Please enter valid Other Charges Details",
            labelKey: "WS_ACTIVATION_DETAILS_OTHER_CHARGES_VALIDATION"
          };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
      return;

        }
        
      }
      else{
        isFormValid = false;
      errorMessage = {
        labelName: "Please enter proposed connection execution details",
        labelKey: "WS_ACTIVATION_DETAILS_PROP_VALIDATION"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
      return;

      }
       
    }
    else{
      isFormValid = false;
      errorMessage = {
        labelName: "Please enter valid data in activation details",
        labelKey: "WS_ACTIVATION_DETAILS_VALIDATION"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
      return;
      //
    }   
  }
 
  else{
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
    return;
  }
}
if(!isConnectionDetailsValid)
      {
        isFormValid = isConnectionDetailsValid
        hasFieldToaster = true;

      }
      
      
    }

    // if (!isApplicantTypeCardValid || !isSingleApplicantCardValid || !isInstitutionCardValid) {
    //   isFormValid = false;
    //   hasFieldToaster = true;
    // }


    isFormValid = isFormValid;
  }
  if (activeStep === 3) {
    let waterId = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].id");
    let sewerId = get(state, "screenConfiguration.preparedFinalObject.SewerageConnection[0].id");
    if (waterId && sewerId) {
      isFormValid = await acknoledgementForBothWaterAndSewerage(state, activeStep, isFormValid, dispatch);
    } else if (waterId) {
      isFormValid = await acknoledgementForWater(state, activeStep, isFormValid, dispatch);
    } else {
      isFormValid = await acknoledgementForSewerage(state, activeStep, isFormValid, dispatch);
    }
    // responseStatus === "success" && changeStep(activeStep, state, dispatch);
  }
  if (activeStep !== 3) {
    if (isFormValid) {
      changeStep(state, dispatch);
    } else if (hasFieldToaster) {
      let errorMessage = {
        labelName: "Please fill all mandatory fields!",
        labelKey: "WS_FILL_REQUIRED_FIELDS"
      };
      switch (activeStep) {
        case 1:
          // errorMessage = {
          //   labelName:
          //     "Please upload all Mandatory Document!",
          //   labelKey: "WS_UPLOAD_MANDATORY_DOCUMENTS"
          // };
          moveToReview(state,dispatch)
          return;
          break;
        case 2:
          errorMessage = {
            labelName:
              "Please fill all mandatory fields for Applicant Details, then proceed!",
            labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
          };
          break;
      }
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
  }
};

const moveToSuccess = (combinedArray, dispatch) => {
  const tenantId = get(combinedArray[0].property, "tenantId");
  const purpose = "apply";
  const status = "success";
  const applicationNoWater = get(combinedArray[0], "applicationNo");
  const applicationNoSewerage = get(combinedArray[1], "applicationNo");
  if(process.env.REACT_APP_NAME === "Citizen" && getQueryArg(window.location.href, "action") === "edit"&& window.localStorage.getItem("ActivityStatusFlag")=== "true"){
    window.localStorage.removeItem("ActivityStatusFlag");
  }
  if(localStorage.getItem("ActivityStatusFlag")){
    window.localStorage.removeItem("ActivityStatusFlag");
  }
  if (applicationNoWater && applicationNoSewerage) {
    dispatch(
      setRoute(
        `/wns/acknowledgement?purpose=${purpose}&status=${status}&applicationNumberWater=${applicationNoWater}&applicationNumberSewerage=${applicationNoSewerage}&tenantId=${tenantId}`
      )
    );
  } else if (applicationNoWater) {
    dispatch(
      setRoute(
        `/wns/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNoWater}&tenantId=${tenantId}`
      )
    );
  } else {
    dispatch(
      setRoute(
        `/wns/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNoSewerage}&tenantId=${tenantId}`
      )
    );
  }

};

const acknoledgementForBothWaterAndSewerage = async (state, activeStep, isFormValid, dispatch) => {
  if (isFormValid) {
    if (activeStep === 0) {
      prepareDocumentsUploadData(state, dispatch);
    }
    if (activeStep === 3) {
      isFormValid = await applyForWaterOrSewerage(state, dispatch);
      let WaterConnection = get(state.screenConfiguration.preparedFinalObject, "WaterConnection");
      let SewerageConnection = get(state.screenConfiguration.preparedFinalObject, "SewerageConnection");
      let combinedArray = WaterConnection.concat(SewerageConnection)
      if (isFormValid) { moveToSuccess(combinedArray, dispatch) }
    }
    return isFormValid;
  } else if (hasFieldToaster) {
    let errorMessage = {
      labelName: "Please fill all mandatory fields and upload the documents!",
      labelKey: "ERR_UPLOAD_MANDATORY_DOCUMENTS_TOAST"
    };
    switch (activeStep) {
      case 0:
        errorMessage = {
          labelName:
            "Please check the Missing/Invalid field for Property Details, then proceed!",
          labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_PROPERTY_TOAST"
        };
        break;
      case 1:
        errorMessage = {
          labelName:
            "Please check the Missing/Invalid field for Property Details, then proceed!",
          labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_PROPERTY_TOAST"
        };
        break;
      case 2:
        errorMessage = {
          labelName:
            "Please fill all mandatory fields for Applicant Details, then proceed!",
          labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
        };
        break;
    }
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
  return !isFormValid;
}

const acknoledgementForWater = async (state, activeStep, isFormValid, dispatch) => {
  if (isFormValid) {
    if (activeStep === 0) {
      
      prepareDocumentsUploadData(state, dispatch);
    }
    if (activeStep === 3) {
     // getMdmsData(state, dispatch);
     dispatch(toggleSpinner());
      isFormValid = await applyForWaterOrSewerage(state, dispatch);
      let combinedArray = get(state.screenConfiguration.preparedFinalObject, "WaterConnection");
      if (isFormValid) 
      { 
        moveToSuccess(combinedArray, dispatch)
        dispatch(toggleSpinner());
      }
    }
    return true;
  } else if (hasFieldToaster) {
    let errorMessage = {
      labelName: "Please fill all mandatory fields and upload the documents!",
      labelKey: "ERR_UPLOAD_MANDATORY_DOCUMENTS_TOAST"
    };
    switch (activeStep) {
      case 1:
        errorMessage = {
          labelName:
            "Please check the Missing/Invalid field for Property Details, then proceed!",
          labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_PROPERTY_TOAST"
        };
        break;
      case 2:
        errorMessage = {
          labelName:
            "Please fill all mandatory fields for Applicant Details, then proceed!",
          labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
        };
        break;
    }
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
  return false;
}

const acknoledgementForSewerage = async (state, activeStep, isFormValid, dispatch) => {
  if (isFormValid) {
    if (activeStep === 0) {
      prepareDocumentsUploadData(state, dispatch);
    }
    if (activeStep === 3) {
      //getMdmsData(state, dispatch);
      dispatch(toggleSpinner());
      isFormValid = await applyForWaterOrSewerage(state, dispatch);
      let combinedArray = get(state.screenConfiguration.preparedFinalObject, "SewerageConnection");
      if (isFormValid) 
      { 
        moveToSuccess(combinedArray, dispatch) 
        dispatch(toggleSpinner());
      }
    }
    return true;
  } else if (hasFieldToaster) {
    let errorMessage = {
      labelName: "Please fill all mandatory fields and upload the documents!",
      labelKey: "ERR_UPLOAD_MANDATORY_DOCUMENTS_TOAST"
    };
    switch (activeStep) {
      case 1:
        errorMessage = {
          labelName:
            "Please check the Missing/Invalid field for Property Details, then proceed!",
          labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_PROPERTY_TOAST"
        };
        break;
      case 2:
        errorMessage = {
          labelName:
            "Please fill all mandatory fields for Applicant Details, then proceed!",
          labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
        };
        break;
    }
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
  return false;
}

export const changeStep = (
  state,
  dispatch,
  mode = "next",
  defaultActiveStep = -1
) => {
  window.scrollTo(0, 0);
  let activeStep = get(state.screenConfiguration.screenConfig["apply"], "components.div.children.stepper.props.activeStep", 0);
  if (defaultActiveStep === -1) {
    if (activeStep === 1 && mode === "next") {
      const isDocsUploaded = get(
        state.screenConfiguration.preparedFinalObject,
        "applyScreen.documents",
        null
      );
      if(isDocsUploaded){
        activeStep = process.env.REACT_APP_NAME === "Citizen" ? 3 : 2;
      }
    } else if (process.env.REACT_APP_NAME === "Citizen" && activeStep === 3) {
      activeStep = mode === "next" ? activeStep + 1 : activeStep - 2;
    } else {
      activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
    }
  } else {
    activeStep = defaultActiveStep;
  }
  if(activeStep === 0){
    let conHolders = get(state, "screenConfiguration.preparedFinalObject.applyScreen.connectionHolders");
    let isCheckedSameAsProperty = (conHolders && conHolders.length > 0 && !conHolders[0].sameAsPropertyAddress)?false:true;
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.connectionHolderDetails.children.cardContent.children.sameAsOwner.children.sameAsOwnerDetails",
        "props.isChecked",
        isCheckedSameAsProperty
      )
    )
    let applyScreen = get(state, "screenConfiguration.preparedFinalObject.applyScreen",{});
    dispatch(prepareFinalObject("applyScreenOld", applyScreen));
  }
  
  const isPreviousButtonVisible = activeStep > 0 ? true : false;
  const isNextButtonVisible = isNextButton(activeStep);
  const isPayButtonVisible = activeStep === 3 ? true : false;
  const actionDefination = [
    {
      path: "components.div.children.stepper.props",
      property: "activeStep",
      value: activeStep
    },
    {
      path: "components.div.children.footer.children.previousButton",
      property: "visible",
      value: isPreviousButtonVisible
    },
    {
      path: "components.div.children.footer.children.nextButton",
      property: "visible",
      value: isNextButtonVisible
    },
    {
      path: "components.div.children.footer.children.payButton",
      property: "visible",
      value: isPayButtonVisible
    }
  ];
  dispatchMultipleFieldChangeAction("apply", actionDefination, dispatch);
  if (process.env.REACT_APP_NAME === "Citizen") { renderStepsCitizen(activeStep, dispatch); }
  else { renderSteps(activeStep, dispatch); }
}

export const isNextButton = (activeStep) => {
  if (process.env.REACT_APP_NAME === "Citizen" && activeStep < 2) { return true; }
  else if (process.env.REACT_APP_NAME !== "Citizen" && activeStep < 3) { return true; }
  else return false
}

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );

  }
};

export const renderStepsCitizen = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );
  }
};

export const getActionDefinationForStepper = path => {
  let actionDefination = [];
  if (process.env.REACT_APP_NAME === "Citizen") {
    actionDefination = [
      {
        path: "components.div.children.formwizardFirstStep",
        property: "visible",
        value: true
      },
      {
        path: "components.div.children.formwizardSecondStep",
        property: "visible",
        value: false
      },
      {
        path: "components.div.children.formwizardFourthStep",
        property: "visible",
        value: false
      }
    ];
  } else {
    actionDefination = [
      {
        path: "components.div.children.formwizardFirstStep",
        property: "visible",
        value: true
      },
      {
        path: "components.div.children.formwizardSecondStep",
        property: "visible",
        value: false
      },
      {
        path: "components.div.children.formwizardThirdStep",
        property: "visible",
        value: false
      },
      {
        path: "components.div.children.formwizardFourthStep",
        property: "visible",
        value: false
      }
    ];
  }
  for (var i = 0; i < actionDefination.length; i++) {
    actionDefination[i] = { ...actionDefination[i], value: false };
    if (path === actionDefination[i].path) {
      actionDefination[i] = { ...actionDefination[i], value: true };
    }
  }
  return actionDefination;
};

export const callBackForPrevious = (state, dispatch) => {
  window.scrollTo(0, 0);
  changeStep(state, dispatch, "previous");
};

export const footer = getCommonApplyFooter({
  previousButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        // minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      previousButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_left"
        }
      },
      previousButtonLabel: getLabel({
        labelName: "Previous Step",
        labelKey: "WS_COMMON_BUTTON_PREV_STEP"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForPrevious
    },
    visible: false
  },
  nextButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        // minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "Next Step",
        labelKey: "WS_COMMON_BUTTON_NXT_STEP"
      }),
      nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForNext
    }
  },
  payButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        //minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Submit",
        labelKey: "WS_COMMON_BUTTON_SUBMIT"
      }),
      submitButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForNext
    },
    visible: false
  }
});

export const footerReview = (
  action,
  state,
  dispatch,
  status) => {
  let tlCertificateDownloadObject = {
    label: { labelName: "TL Certificate", labelKey: "WSCERTIFICATE" },
    link: () => {
      const { Licenses } = state.screenConfiguration.preparedFinalObject;
      downloadCertificateForm(Licenses);
    },
    leftIcon: "book"
  };
  let tlCertificatePrintObject = {
    label: { labelName: "TL Certificate", labelKey: "WSCERTIFICATE" },
    link: () => {
      const { Licenses } = state.screenConfiguration.preparedFinalObject;
      downloadCertificateForm(Licenses, 'print');
    },
    leftIcon: "book"
  };
  let receiptDownloadObject = {
    label: { labelName: "Receipt", labelKey: "WSRECEIPT" },
    link: () => {


      const receiptQueryString = [
        { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "applicationNumber") },
        { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "tenantId") }
      ]
      download(receiptQueryString);
      // generateReceipt(state, dispatch, "receipt_download");
    },
    leftIcon: "receipt"
  };
  let receiptPrintObject = {
    label: { labelName: "Receipt", labelKey: "WSRECEIPT" },
    link: () => {
      const receiptQueryString = [
        { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "applicationNumber") },
        { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "tenantId") }
      ]
      download(receiptQueryString, "print");
      // generateReceipt(state, dispatch, "receipt_print");
    },
    leftIcon: "receipt"
  };
  let applicationDownloadObject = {
    label: { labelName: "Application", labelKey: "WSAPPLICATION" },
    link: () => {
      const { Licenses, LicensesTemp } = state.screenConfiguration.preparedFinalObject;
      const documents = LicensesTemp[0].reviewDocData;
      set(Licenses[0], "additionalDetails.documents", documents)
      downloadAcknowledgementForm(Licenses);
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Application", labelKey: "WSAPPLICATION" },
    link: () => {
      const { Licenses, LicensesTemp } = state.screenConfiguration.preparedFinalObject;
      const documents = LicensesTemp[0].reviewDocData;
      set(Licenses[0], "additionalDetails.documents", documents)
      downloadAcknowledgementForm(Licenses, 'print');
    },
    leftIcon: "assignment"
  };
  switch (status) {
    case "APPROVED":
      break;
    case "APPLIED":
    case "CITIZENACTIONREQUIRED":
    case "FIELDINSPECTION":
    case "PENDINGAPPROVAL":
    case "PENDINGPAYMENT":
      break;
    case "pending_approval":
      break;
    case "CANCELLED":
      break;
    case "REJECTED":
      break;
    default:
      break;
  }
}
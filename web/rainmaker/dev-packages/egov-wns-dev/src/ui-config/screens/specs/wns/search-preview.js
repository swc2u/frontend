import {
  getCommonHeader,
  getCommonCard,
  getCommonTitle,
  getCommonGrayCard,
  getCommonContainer,
  getCommonSubHeader,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import commonConfig from "config/common.js";
import { httpRequest } from "../../../../ui-utils";
import get from "lodash/get";
import set from "lodash/set";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg, setDocuments, setBusinessServiceDataToLocalStorage, getFileUrlFromAPI } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject, preparedFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults, 
  getSearchResultsForSewerage, 
  waterEstimateCalculation, 
  getDescriptionFromMDMS, 
  findAndReplace, 
  getSearchBillingEstimation,
  swEstimateCalculation, 
  setWSDocuments } from "../../../../ui-utils/commons";
import {
  createEstimateData,
  setMultiOwnerForSV,
  setValidToFromVisibilityForSV,
  getDialogButton,
  convertDateToEpoch,
  showHideAdhocPopup,
  GetMdmsNameBycode
} from "../utils";

import { footerReview } from "./applyResource/footer";
import { downloadPrintContainer } from "../wns/acknowledgement";
import {
  getFeesEstimateOverviewCard,
  getHeaderSideText,
  getTransformedStatus
} from "../utils";
import { getReviewConnectionDetails } from "./applyResource/review-trade";
import { getReviewOwner } from "./applyResource/review-owner";
import { getReviewDocuments } from "./applyResource/review-documents";
import { loadReceiptGenerationData } from "../utils/receiptTransformer";
import { adhocPopup } from "./applyResource/adhocPopup";
import { getWorkFlowData } from "../../../../ui-utils/commons";

const tenantId = getQueryArg(window.location.href, "tenantId");
let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
let service = getQueryArg(window.location.href, "service");
const serviceModuleName = service === "WATER" ? 
(window.localStorage.getItem("wns_workflow")===null ? "REGULARWSCONNECTION":  window.localStorage.getItem("wns_workflow"))
:"SW_SEWERAGE";
const serviceUrl = serviceModuleName === "SW_SEWERAGE" ?  "/sw-services/swc/_update" : "/ws-services/wc/_update" ;

const getLabelForWnsHeader = () => {
  const wnsHeader =  window.localStorage.getItem("wns_workflow");

  if(wnsHeader)
    return `${wnsHeader}_DETAIL_HEADER`;
  
  else
    return "WS_TASK_DETAILS"
}

const headerrow = getCommonContainer({
  header: getCommonHeader({
    labelKey: getLabelForWnsHeader()
  }),
  application: getCommonContainer({
    applicationNumber: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-wns",
      componentPath: "ApplicationNoContainer",
      props: {
        number: applicationNumber
      }
    }
  }),
  connection: getCommonContainer({
  connectionNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-wns",
    componentPath: "ConsumerNoContainer",
    props: {
      number: ""
    }
  }

})
});

const beforeInitFn = async (action, state, dispatch, applicationNumber) => {
  const queryObj = [
    { key: "businessIds", value: applicationNumber },
    { key: "history", value: true },
    { key: "tenantId", value: tenantId }
  ];

  let Response =await getWorkFlowData(queryObj);
  let securityCharges =0;
  let processInstanceAppStatus=Response.ProcessInstances[0].state.applicationStatus;
  //Search details for given application Number
  if (applicationNumber) {
    
    // hiding the Additional details for citizen. ,,
    if(process.env.REACT_APP_NAME === "Citizen" && processInstanceAppStatus && (processInstanceAppStatus === 'INITIATED' || processInstanceAppStatus ==="PENDING_FOR_CITIZEN_ACTION" || processInstanceAppStatus === 'PENDING_FOR_DOCUMENT_VERIFICATION')){
      set(
        action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.props.style",
        { display: "none" }
      ); 
    }
    //set proposed holder info if activityType: "UPDATE_CONNECTION_HOLDER_INFO"
    const activityTypeHolder =Response.ProcessInstances[0].businessService;// get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].activityType");
    if(activityTypeHolder ==='UPDATE_CONNECTION_HOLDER_INFO' || activityTypeHolder ==='WS_RENAME' )
    {
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewproposedHolderInfo.visible",true);

    }
    else{
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewproposedHolderInfo.visible",false);
    }
    if(activityTypeHolder ==='SW_SEWERAGE')
    {
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourteen.children.reviewMeterId.visible",false);
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourteen.children.reviewMeterInstallationDate.visible",false);
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourteen.children.reviewlastMeterReading.visible",false);
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourteen.children.reviewInitialMeterReading.visible",false);
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourteen.children.reviewmfrCode.visible",false);
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourteen.children.reviewmeterDigits.visible",false);
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourteen.children.reviewmeterUnit.visible",false);
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourteen.children.reviewsanctionedCapacity.visible",false);
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourteen.children.reviewmeterRentCode.visible",false);
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourteen.children.reviewMeterCount.visible",false);
      

    }

    if(activityTypeHolder ==='UPDATE_METER_INFO' || activityTypeHolder ==='WS_METER_UPDATE' )
    {
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFifteen.visible",true);
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixteen.visible",true);

    }
    else{
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFifteen.visible",false);
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixteen.visible",false);
    }

    if(activityTypeHolder ==='CONNECTION_CONVERSION'|| activityTypeHolder ==='WS_CONVERSION')
    {
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewpropertyproposedUsageDetail.visible",true);

    }
    else{
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewpropertyproposedUsageDetail.visible",false);
    }
    if (!getQueryArg(window.location.href, "edited")) {
      (await searchResults(action, state, dispatch, applicationNumber,processInstanceAppStatus));
      // set Billing info frm API calling ws-calculator/billing/_getBillingEstimation
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewConnectionBillDetail.visible",true);

      let service_ = get(state.screenConfiguration.preparedFinalObject, "applyScreen.service");
              //set security if bellow consition satisfy
              const {WaterConnection} = state.screenConfiguration.preparedFinalObject;
              if(WaterConnection &&WaterConnection[0])
              {
                if(WaterConnection[0].service ==='WATER')
                {
                  if(WaterConnection[0].applicationStatus === "PENDING_FOR_SECURITY_DEPOSIT" || WaterConnection[0].applicationStatus === "PENDING_FOR_JE_APPROVAL_AFTER_SUPERINTEDENT")
                  {
                    //regular
                    if(WaterConnection[0].waterApplicationType ==='REGULAR')
                    {
                      if(WaterConnection[0].proposedPipeSize == 15 && WaterConnection[0].activityType ==='NEW_WS_CONNECTION'){
                        const {searchPreviewScreenMdmsData} = state.screenConfiguration.preparedFinalObject;
                        const pipeSize = searchPreviewScreenMdmsData['ws-services-calculation'].PipeSize.filter(pipeSize => pipeSize.size == 15);
                         securityCharges = pipeSize[0].charges[0].security;
                        set(state.screenConfiguration.preparedFinalObject.WaterConnection[0], 'waterApplication.securityCharge', securityCharges);
                      }
                      else
                      {
                        let securityChargespath ='components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.OtherChargeContainer.children.cardContent.children.chargesDetails.children.enterSecurityAmount.props.value';
                        securityCharges = get(state.screenConfiguration.screenConfig.apply,securityChargespath,0)
                        
                        //securityCharges = 0
                      }
                    }
                    
                  }

                }


              }

              
      if(service_ ==='SEWERAGE')
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewpropertyUsageDetail.visible",false);
    } else {
      let applyScreenObject = get(state.screenConfiguration.preparedFinalObject, "applyScreen");
      // if(applyScreenObject)
      // {
        applyScreenObject.applicationNo.includes("WS")?applyScreenObject.service="WATER":applyScreenObject.service="SEWERAGE";
     // }
     
      let parsedObject = parserFunction(findAndReplace(applyScreenObject, "NA", null));
      let code = '03';
      let isFerruleApplicable = false
     // let securityCharges = false
      if (service === "WATER") 
      {
        code =GetMdmsNameBycode(state, dispatch,"searchPreviewScreenMdmsData.ws-services-masters.sectorList",parsedObject.property.address.locality.code)   
        if(parsedObject.waterApplication.applicationStatus!=='PENDING_FOR_JE_APPROVAL_AFTER_SUPERINTEDENT')
        {
            isFerruleApplicable  =true;
  
        }
        else{
          isFerruleApplicable = get(state.screenConfiguration.preparedFinalObject, "applyScreen.waterApplication.isFerruleApplicable",false);
        }

      }
        
        if (service === "SEWERAGE") 
        {
          code =GetMdmsNameBycode(state, dispatch,"searchPreviewScreenMdmsData.ws-services-masters.swSectorList",parsedObject.property.address.locality.code)   
          set(parsedObject, 'property.address.locality.name', code);
              if(parsedObject.applicationStatus!=='PENDING_FOR_JE_APPROVAL_AFTER_SUPERINTEDENT')
          {
              isFerruleApplicable  =true;

          }
          else{
            isFerruleApplicable = get(state.screenConfiguration.preparedFinalObject, "applyScreen.waterApplication.isFerruleApplicable",false);
          }
        }
        
      
     
      //set ferrul
     
      
      set(parsedObject, 'waterApplication.isFerruleApplicable', isFerruleApplicable);
      securityCharges = get(state.screenConfiguration.preparedFinalObject, "applyScreen.waterApplication.securityCharge",0);
      set(parsedObject, 'waterApplication.securityCharge', securityCharges);
      
      

      dispatch(prepareFinalObject("WaterConnection[0]", parsedObject));
      //dispatch(prepareFinalObject("WaterConnection[0].waterApplication.isFerruleApplicable", isFerruleApplicable));
       let estimate;
       if(processInstanceAppStatus==="CONNECTION_ACTIVATED"){
        let connectionNumber= parsedObject.connectionNo;
        set(action.screenConfig, "components.div.children.headerDiv.children.header1.children.connection.children.connectionNumber.props.number",connectionNumber );
      }else{
        set(action.screenConfig, "components.div.children.headerDiv.children.header1.children.connection.children.connectionNumber.visible",false ); 
      }
      if(processInstanceAppStatus==="PENDING_FOR_FIELD_INSPECTION"|| processInstanceAppStatus==="PENDING_FOR_METER_INSTALLATION"|| processInstanceAppStatus==="PENDING_FOR_JE_BR_APPROVAL" || 1===1){
        set(parsedObject, 'waterApplication.securityCharge', securityCharges);
        let queryObjectForEst = [{
          applicationNo: applicationNumber,
          tenantId: tenantId,
          waterConnection: parsedObject
        }]
        if (parsedObject.applicationNo.includes("WS")) {
          estimate = await waterEstimateCalculation(queryObjectForEst, dispatch);
          let viewBillTooltip = [];
          if (estimate !== null && estimate !== undefined) {
            if (estimate.Calculation.length > 0) {
              await processBills(estimate, viewBillTooltip, dispatch);
              // viewBreakUp 
              estimate.Calculation[0].billSlabData = _.groupBy(estimate.Calculation[0].taxHeadEstimates, 'category')
              estimate.Calculation[0].appStatus = processInstanceAppStatus; 
              if(parsedObject.waterApplication.totalAmountPaid !== null ||parsedObject.waterApplication.totalAmountPaid !== 'NA')
              {
                //dataCalculation
                if(isNaN(parseInt(parsedObject.waterApplication.totalAmountPaid)))
                set(estimate.Calculation[0], 'totalAmountPaid', 0);
                else
                set(estimate.Calculation[0], 'totalAmountPaid', parseInt(parsedObject.waterApplication.totalAmountPaid));
              }
             
              else
              set(estimate.Calculation[0], 'totalAmountPaid', 0);
              
              dispatch(prepareFinalObject("dataCalculation", estimate.Calculation[0]));
            }
          } 
        }else {
          let queryObjectForEst = [{
            applicationNo: applicationNumber,
            tenantId: tenantId,
            sewerageConnection: parsedObject
          }]
          estimate = await swEstimateCalculation(queryObjectForEst, dispatch);
          let viewBillTooltip = []
          if (estimate !== null && estimate !== undefined) {
            if (estimate.Calculation.length > 0) {
              await processBills(estimate, viewBillTooltip, dispatch);
              // viewBreakUp 
              estimate.Calculation[0].billSlabData = _.groupBy(estimate.Calculation[0].taxHeadEstimates, 'category')
              estimate.Calculation[0].appStatus = processInstanceAppStatus; 
              if(parsedObject.totalAmountPaid !== null || parsedObject.totalAmountPaid !=='NA' )
              {
                //dataCalculation
                if(isNaN(parseInt(parsedObject.waterApplication.totalAmountPaid)))
                set(estimate.Calculation[0], 'totalAmountPaid', 0);
                else
                set(estimate.Calculation[0], 'totalAmountPaid', parseInt(parsedObject.totalAmountPaid));
              }              
              else
              set(estimate.Calculation[0], 'totalAmountPaid', 0);
              dispatch(prepareFinalObject("dataCalculation", estimate.Calculation[0]));
            }
          }
        }
        if (estimate !== null && estimate !== undefined) {
          createEstimateData(estimate.Calculation[0].taxHeadEstimates, "taxHeadEstimates", dispatch, {}, {});
        }
      }
    }

    let connectionNo = get(state.screenConfiguration.preparedFinalObject, "WaterConnection[0].connectionNo",'');
    if(connectionNo)
    {
      set(action.screenConfig, "components.div.children.headerDiv.children.header1.children.connection.children.connectionNumber.props.number", connectionNo);
      set(action.screenConfig, "components.div.children.headerDiv.children.header1.children.connection.children.connectionNumber.visible",true ); 
    let requestBody=
    {
      billGeneration:
      {            
      consumerCode:connectionNo,
      tenantId:tenantId,
      paymentMode:'cash',
      isGenerateDemand:true,            
      }
    }
    try{
    let BillingEstimation = await getSearchBillingEstimation(requestBody,dispatch,action); 
      if(BillingEstimation)
      {
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewConnectionBillDetailException.visible",false);
        if(BillingEstimation.billGeneration[0].status ==='PAID')
        {
          dispatch(prepareFinalObject("billGenerationdata.status", BillingEstimation.billGeneration[0].status))
        }
      
      else
      {
        dispatch(prepareFinalObject("billGenerationdata.status", 'NOT PAID'))
      }        
      dispatch(prepareFinalObject("billGenerationdata.totalNetAmount", BillingEstimation.billGeneration[0].totalNetAmount))
      dispatch(prepareFinalObject("billGenerationdata.dueDateCash", BillingEstimation.billGeneration[0].dueDateCash))
        
      }
    }
    catch(error)
    {
      //viewConnectionBillDetailException
     
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewConnectionBillDetailException.visible",true);
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewConnectionBillDetail.visible",false);
      dispatch(prepareFinalObject("billGenerationdata.status", 'No Data Found'))
      dispatch(prepareFinalObject("billGenerationdata.totalNetAmount", ''))
      dispatch(prepareFinalObject("billGenerationdata.dueDateCash", ''))


    }
    }
    else
    {
      set(action.screenConfig, "components.div.children.headerDiv.children.header1.children.connection.children.connectionNumber.visible",false ); 
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewConnectionBillDetailException.visible",false);
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewConnectionBillDetail.visible",false);

    }
    let connectionType = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].connectionType");
    if (connectionType === "Metered") {
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterId.visible",
        true
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterInstallationDate.visible",
        true
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewInitialMeterReading.visible",
        true
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewlastMeterReading.visible",
        true
      );
    } else {
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterId.visible",
        false
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterInstallationDate.visible",
        false
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewlastMeterReading.visible",
        false
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewInitialMeterReading.visible",
        false
      );
    }
    const status = getTransformedStatus(
      get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].applicationStatus")
    );

    // const appStatus = get(
    //   state,
    //   "screenConfiguration.preparedFinalObject.WaterConnection[0].applicationStatus"
    // );
    // for showing addPenaltyRebateButton
 //   if(process.env.REACT_APP_NAME !== "Citizen" && (processInstanceAppStatus !== 'PENDING_FOR_PAYMENT' && processInstanceAppStatus !=="PENDING_FOR_CONNECTION_ACTIVATION" && processInstanceAppStatus !== 'CONNECTION_ACTIVATED')){
  if(process.env.REACT_APP_NAME !== "Citizen" && ((serviceModuleName==="WS_DISCONNECTION" && processInstanceAppStatus === 'PENDING_METER_READING_CAPTURE')|| (serviceModuleName==="REGULARWSCONNECTION" && processInstanceAppStatus === 'PENDING_FOR_TEMPORARY_TO_REGULAR_CONNECTION_APPROVAL'))){
      
      dispatch(
          handleField(
            "search-preview",
            "components.div.children.taskDetails.children.cardContent.children.estimate.children.cardContent.children.addPenaltyRebateButton",
            "visible",
            true
          )
        );
    }
    const printCont = downloadPrintContainer(
      action,
      state,
      dispatch,
      processInstanceAppStatus,
      applicationNumber,
      tenantId
    );
    set(
      action,
      "screenConfig.components.div.children.headerDiv.children.helpSection.children",
      printCont
    );

    let data = get(state, "screenConfiguration.preparedFinalObject");

    const obj = setStatusBasedValue(status);

    // Get approval details based on status and set it in screenconfig

    if (
      status === "APPROVED" ||
      status === "REJECTED" ||
      status === "CANCELLED"
    ) {
      set(
        action,
        "screenConfig.components.div.children.taskDetails.children.cardContent.children.approvalDetails.visible",
        true
      );

      if (get(data, "WaterConnection[0].documents")) {
        await setDocuments(
          data,
          "WaterConnection[0].documents",
          "LicensesTemp[0].verifyDocData",
          dispatch, 'REGULARWSCONNECTION'
        );
      } else {
        dispatch(
          handleField(
            "search-preview",
            "components.div.children.taskDetails.children.cardContent.children.approvalDetails.children.cardContent.children.viewTow.children.lbl",
            "visible",
            false
          )
        );
      }
    } else {
      set(
        action,
        "screenConfig.components.div.children.taskDetails.children.cardContent.children.approvalDetails.visible",
        false
      );
    }

    if (status === "cancelled")
      set(
        action,
        "screenConfig.components.div.children.headerDiv.children.helpSection.children.cancelledLabel.visible",
        true
      );

    setActionItems(action, obj);
    loadReceiptGenerationData(applicationNumber, tenantId);
    if(processInstanceAppStatus==="CONNECTION_ACTIVATED" || processInstanceAppStatus==="SEWERAGE_CONNECTION_ACTIVATED"){
      // set(action.screenConfig, "components.div.children.headerDiv.children.helpSection.children.rightdiv.visible",true );
      // set(action.screenConfig, "components.div.children.headerDiv.children.helpSection.children.rightdiv.children.downloadMenu.visible",true );
      // set(action.screenConfig, "components.div.children.headerDiv.children.helpSection.children.rightdiv.children.printMenu.visible",true );
      let action = false
      let service_ = getQueryArg(window.location.href, "service");
      if(service_ ==='SEWERAGE')
      {
        action = true
      }
      else if(service_ ==='WATER')
      {
        action = false

      }
      
      dispatch(
        handleField(
          "search-preview",
          "components.div.children.headerDiv.children.helpSection",
          "visible",
          action
        )
      );

    }
    else{
      // set(action.screenConfig, "components.div.children.headerDiv.children.helpSection.children.rightdiv.visible",false );
      // set(action.screenConfig, "components.div.children.headerDiv.children.helpSection.children.rightdiv.children.downloadMenu.visible",false );
      // set(action.screenConfig, "components.div.children.headerDiv.children.helpSection.children.rightdiv.children.printMenu.visible",false );
      dispatch(
        handleField(
          "search-preview",
          "components.div.children.headerDiv.children.helpSection",
          "visible",
          false
        )
      );

    }
  }


};

let titleText = "";

const setStatusBasedValue = status => {
  switch (status) {
    case "approved":
      return {
        titleText: "Review the Trade License",
        titleKey: "WS_REVIEW_TRADE_LICENSE",
        titleVisibility: true,
        roleDefination: {
          rolePath: "user-info.roles",
          roles: ["WS_APPROVER"]
        }
      };
    case "pending_payment":
      return {
        titleText: "Review the Application and Proceed",
        titleKey: "WS_REVIEW_APPLICATION_AND_PROCEED",
        titleVisibility: true,
        roleDefination: {
          rolePath: "user-info.roles",
          roles: ["WS_CEMP"]
        }
      };
    case "pending_approval":
      return {
        titleText: "Review the Application and Proceed",
        titleKey: "WS_REVIEW_APPLICATION_AND_PROCEED",
        titleVisibility: true,
        roleDefination: {
          rolePath: "user-info.roles",
          roles: ["WS_APPROVER"]
        }
      };
    case "cancelled":
      return {
        titleText: "",
        titleVisibility: false,
        roleDefination: {}
      };
    case "rejected":
      return {
        titleText: "",
        titleVisibility: false,
        roleDefination: {}
      };

    default:
      return {
        titleText: "",
        titleVisibility: false,
        roleDefination: {}
      };
  }
};

const estimateSection = () => {

  if(serviceModuleName === "WS_TUBEWELL")
  return{};

  return getCommonGrayCard({
  header: getCommonSubHeader({ labelKey: "WS_TASK_DETAILS_FEE_ESTIMATE" }),
  estimateSection: getFeesEstimateOverviewCard({
    sourceJsonPath: "dataCalculation",
    // isCardrequired: true
  }),
  buttonView: getDialogButton(
    "VIEW BREAKUP",
    "WS_PAYMENT_VIEW_BREAKUP",
    "search-preview"
  ),
  addPenaltyRebateButton: {
    componentPath: "Button",
    props: {
      color: "primary",
      style: {}
    },
    children: {
      previousButtonLabel: getLabel({
        labelKey: "WS_PAYMENT_ADD_REBATE_PENALTY"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        showHideAdhocPopup(state, dispatch, "search-preview");
      }
    },
    visible: false
  },
});
}
const estimate = estimateSection();
export const reviewConnectionDetails = getReviewConnectionDetails(false);

export const reviewOwnerDetails = getReviewOwner(false);

export const reviewDocumentDetails = getReviewDocuments(false);
export const getMdmsData = async (state,dispatch) => {
  let tenantId = getQueryArg(window.location.href, "tenantId");
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
       // { moduleName: "common-masters", masterDetails: [{ name: "OwnerType" }, { name: "OwnerShipCategory" }] },
       { moduleName: "ws-services-calculation", masterDetails: [{ name: "PipeSize" }] },
        { moduleName: "ws-services-masters", 
        masterDetails: [
          { name: "wsWorkflowRole" },
          { name: "swWorkflowRole" },
          { name: "sectorList" },
          { name: "swSectorList" },
          
        
        ] },
        {
          moduleName: "PropertyTax",
          masterDetails: [
          {name: "UsageCategory"},
          // {name:"Floor"},
          // {name:"OwnerShipCategory"},
          ]
        },
        
      ]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);
    let UsageType=[] , subUsageType=[];
    if( payload.MdmsRes['PropertyTax'].UsageCategory !== undefined){
      payload.MdmsRes.PropertyTax.UsageCategory.forEach(item=>{
        if(item.code.split(".").length<=1){
            UsageType.push({
              active:item.active,
              name:item.name,
              code:item.code,
              fromFY:item.fromFY
            })
          }
      });
       payload.MdmsRes.PropertyTax.UsageType=UsageType;
      
       payload.MdmsRes.PropertyTax.UsageCategory.forEach(item=>{
        if(item.code.split(".").length==2){
          subUsageType.push({
              active:item.active,
              name:item.name,
              code:item.code,
              fromFY:item.fromFY
            })
          }
      });
      payload.MdmsRes.PropertyTax.subUsageType=subUsageType;
    }
    dispatch(prepareFinalObject("searchPreviewScreenMdmsData", payload.MdmsRes));
    //
  } catch (e) { console.log(e); }
};

// let approvalDetails = getApprovalDetails(status);
let title = getCommonTitle({ labelName: titleText });

const setActionItems = (action, object) => {
  set(
    action,
    "screenConfig.components.div.children.taskDetails.children.cardContent.children.title",
    getCommonTitle({
      labelName: get(object, "titleText"),
      labelKey: get(object, "titleKey")
    })
  );
  set(
    action,
    "screenConfig.components.div.children.taskDetails.children.cardContent.children.title.visible",
    get(object, "titleVisibility")
  );
  set(
    action,
    "screenConfig.components.div.children.taskDetails.children.cardContent.children.title.roleDefination",
    get(object, "roleDefination")
  );
};

export const taskDetails = getCommonCard({
  title,
  estimate,
  reviewConnectionDetails,
  reviewDocumentDetails,
  reviewOwnerDetails
});

export const summaryScreen = getCommonCard({
  reviewConnectionDetails,
  reviewDocumentDetails,
  reviewOwnerDetails
})

const screenConfig = {
  uiFramework: "material-ui",
  name: "search-preview",
  beforeInitScreen: (action, state, dispatch) => {
    const status = getQueryArg(window.location.href, "status");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    if(process.env.REACT_APP_NAME === "Citizen" && getQueryArg(window.location.href, "action") === "edit"&& window.localStorage.getItem("ActivityStatusFlag")=== "true"){
      window.localStorage.removeItem("ActivityStatusFlag");
    }
    if(localStorage.getItem("ActivityStatusFlag")){
      window.localStorage.removeItem("ActivityStatusFlag");
    }
    
    getMdmsData( state, dispatch).then(() => { });
    //To set the application no. at the  top
    set(action.screenConfig, "components.div.children.headerDiv.children.header1.children.application.children.applicationNumber.props.number", applicationNumber);
    // if (status !== "pending_payment") {
    //   set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.viewBreakupButton.visible", false);
    // }
    const serviceModuleNameCurrent = service === "WATER" ? 
    (window.localStorage.getItem("wns_workflow")===null ? "REGULARWSCONNECTION":  window.localStorage.getItem("wns_workflow"))
    :"SW_SEWERAGE";
    const queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: serviceModuleNameCurrent }
    ];

    setBusinessServiceDataToLocalStorage(queryObject, dispatch);
    set(action,"screenConfig.components.adhocDialog.children.popup",adhocPopup);
    beforeInitFn(action, state, dispatch, applicationNumber);

    return action;
  },

  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css search-preview"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header1: {
              gridDefination: {
                xs: 12,
                sm: 8
              },
              ...headerrow
            },
            helpSection: {
              uiFramework: "custom-atoms",
              componentPath: "Container",
              props: {
                color: "primary",
                style: { justifyContent: "flex-end" } //, dsplay: "block"
              },
              gridDefination: {
                xs: 12,
                sm: 4,
                align: "right"
              },
              visible:true
            }
          }
        },
        taskStatus: {
          uiFramework: "custom-containers-local",
          componentPath: "WorkFlowContainer",
          moduleName: "egov-workflow",
          // visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
          props: {
            dataPath: "WaterConnection",
            moduleName: serviceModuleName,
            updateUrl: serviceUrl
          }
        },
        // actionDialog: {
        //   uiFramework: "custom-containers-local",
        //   componentPath: "ResubmitActionContainer",
        //   moduleName: "egov-wns",
        //   visible: process.env.REACT_APP_NAME === "Citizen" ? true : false,
        //   props: {
        //     open: true,
        //     dataPath: "WaterConnection",
        //     moduleName: serviceModuleName,
        //     updateUrl: serviceUrl,
        //     data: {
        //       buttonLabel: "RESUBMIT",
        //       moduleName: serviceModuleName,
        //       isLast: false,
        //       dialogHeader: {
        //         labelName: "RESUBMIT Application",
        //         labelKey: "WF_RESUBMIT_APPLICATION"

        //       },
        //       showEmployeeList: false,
        //       roles: "CITIZEN",
        //       isDocRequired: false
        //     }
        //   }
        // },
        taskDetails,
      }
    },
    breakUpDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-wns",
      componentPath: "ViewBreakupContainer",
      props: {
        open: false,
        maxWidth: "md",
        screenKey: "search-preview",
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-wns",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "search-preview"
      },
      children: {
        popup: {}
      }
    },
  }
};

//----------------- search code (feb17)---------------------- //
const searchResults = async (action, state, dispatch, applicationNumber,processInstanceAppStatus) => {
  let queryObjForSearch = [{ key: "tenantId", value: tenantId }, { key: "applicationNumber", value: applicationNumber }]
  let viewBillTooltip = [], estimate, payload = [];
  if (service === "WATER") {
    payload = [];
    payload = await getSearchResults(queryObjForSearch);
    payload.WaterConnection[0].service = service;
    payload.WaterConnection[0].property.subusageCategory = payload.WaterConnection[0].property.usageCategory;
    payload.WaterConnection[0].property.usageCategory = payload.WaterConnection[0].property.usageCategory.split('.')[0];
    //
    
      let code = '';
        code =GetMdmsNameBycode(state, dispatch,"searchPreviewScreenMdmsData.ws-services-masters.sectorList",payload.WaterConnection[0].property.address.locality.code)   
        payload.WaterConnection[0].property.address.locality.name = code;
     // set(payload, 'property.address.locality.name', code);
    ///
    //payload.WaterConnection[0].service = service;

    const convPayload = findAndReplace(payload, "NA", null)
    // securityCharges before api call _estimate in bellow condition.
    if(convPayload.WaterConnection && convPayload.WaterConnection[0])
    {
      if(convPayload.WaterConnection[0].service ==='WATER')
      {
        if(convPayload.WaterConnection[0].applicationStatus === "PENDING_FOR_SECURITY_DEPOSIT" || convPayload.WaterConnection[0].applicationStatus === "PENDING_FOR_JE_APPROVAL_AFTER_SUPERINTEDENT")
        {
          //regular
          if(convPayload.WaterConnection[0].waterApplicationType ==='REGULAR')
          {
            if(convPayload.WaterConnection[0].proposedPipeSize == 15 && convPayload.WaterConnection[0].activityType ==='NEW_WS_CONNECTION'){
              const {searchPreviewScreenMdmsData} = state.screenConfiguration.preparedFinalObject;
              const pipeSize = searchPreviewScreenMdmsData['ws-services-calculation'].PipeSize.filter(pipeSize => pipeSize.size == 15);
               let securityCharges_ = pipeSize[0].charges[0].security;
               set(convPayload.WaterConnection[0], 'waterApplication.securityCharge', securityCharges_);
              
            }
          }
          
        }

      }


    }
    //
    let queryObjectForEst = [{
      applicationNo: applicationNumber,
      tenantId: tenantId,
      waterConnection: convPayload.WaterConnection[0]
    }]
    if (payload !== undefined && payload !== null) {
      //set locality

      dispatch(prepareFinalObject("WaterConnection[0]", payload.WaterConnection[0]));
      if(!payload.WaterConnection[0].connectionHolders || payload.WaterConnection[0].connectionHolders === 'NA'){        
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFive.visible",false);
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewSix.visible",true);
      }else{
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewSix.visible",false);
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFive.visible",true);
      }
    }
    if(processInstanceAppStatus==="CONNECTION_ACTIVATED"){
      let connectionNumber= payload.WaterConnection[0].connectionNo;
      set(action.screenConfig, "components.div.children.headerDiv.children.header1.children.connection.children.connectionNumber.props.number",connectionNumber );
     // set(action.screenConfig, "components.div.children.headerDiv.children.helpSection.visible",true );
    }else{
      set(action.screenConfig, "components.div.children.headerDiv.children.header1.children.connection.children.connectionNumber.visible",false ); 
      //set(action.screenConfig, "components.div.children.headerDiv.children.helpSection.visible",false );
    }

    // to set documents 
    if (payload.WaterConnection[0].documents !== null && payload.WaterConnection[0].documents !== "NA") {
      await setDocuments(
        state.screenConfiguration.preparedFinalObject,
        "WaterConnection[0].documents",
        "DocumentsData",
        dispatch,
        //"WS"
      );
    }
    estimate = await waterEstimateCalculation(queryObjectForEst, dispatch);
    if (estimate !== null && estimate !== undefined) {
      if (estimate.Calculation.length > 0) {
        await processBills(estimate, viewBillTooltip, dispatch);

        // viewBreakUp 
        estimate.Calculation[0].billSlabData = _.groupBy(estimate.Calculation[0].taxHeadEstimates, 'category')
        estimate.Calculation[0].appStatus = processInstanceAppStatus; 
        if(payload.WaterConnection[0].waterApplication.totalAmountPaid!== null)
        set(estimate.Calculation[0], 'totalAmountPaid', parseInt(payload.WaterConnection[0].waterApplication.totalAmountPaid));
        else
        set(estimate.Calculation[0], 'totalAmountPaid', 0);
        dispatch(prepareFinalObject("dataCalculation", estimate.Calculation[0]));
      }
    }
  } else if (service === "SEWERAGE") {
    payload = [];
    payload = await getSearchResultsForSewerage(queryObjForSearch, dispatch);
    payload.SewerageConnections[0].service = service;
    payload.SewerageConnections[0].property.subusageCategory = payload.SewerageConnections[0].property.usageCategory;
    payload.SewerageConnections[0].property.usageCategory = payload.SewerageConnections[0].property.usageCategory.split('.')[0];
    //
     set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewpropertyUsageDetail.visible",false);
      let code = '';
        code =GetMdmsNameBycode(state, dispatch,"searchPreviewScreenMdmsData.ws-services-masters.swSectorList",payload.SewerageConnections[0].property.address.locality.code)   
        payload.SewerageConnections[0].property.address.locality.name = code;
        // set visible false for sw

     // set(payload, 'property.address.locality.name', code);
    ///
    if (payload !== undefined && payload !== null) {
      dispatch(prepareFinalObject("SewerageConnection[0]", payload.SewerageConnections[0]));
      dispatch(prepareFinalObject("WaterConnection[0]", payload.SewerageConnections[0]));
      if(!payload.SewerageConnections[0].connectionHolders || payload.SewerageConnections[0].connectionHolders === 'NA'){        
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFive.visible",false);
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewSix.visible",true);
        
      }else{
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewSix.visible",false);
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFive.visible",true);
      }
    }
    //connection number display
    if(processInstanceAppStatus==="CONNECTION_ACTIVATED" || processInstanceAppStatus==="SEWERAGE_CONNECTION_ACTIVATED"){
      let connectionNumber= payload.SewerageConnections[0].connectionNo;
      set(action.screenConfig, "components.div.children.headerDiv.children.header1.children.connection.children.connectionNumber.props.number",connectionNumber );
      //set(action.screenConfig, "components.div.children.headerDiv.children.helpSection.children.rightdiv.children.downloadMenu.visible",true );
    // set(action.screenConfig, "components.div.children.headerDiv.children.helpSection.visible",true );
    }else{
      set(action.screenConfig, "components.div.children.headerDiv.children.header1.children.connection.children.connectionNumber.visible",false ); 
      //set(action.screenConfig, "components.div.children.headerDiv.children.helpSection.children.rightdiv.children.downloadMenu",false );
     // set(action.screenConfig, "components.div.children.headerDiv.children.helpSection.children.rightdiv.children.printMenu.visible",true );
     //set(action.screenConfig, "components.div.children.headerDiv.children.helpSection.visible",false );
    }

    // to set documents 
    if (payload.SewerageConnections[0].documents !== null && payload.SewerageConnections[0].documents !== "NA") {
      await setDocuments(
        state.screenConfiguration.preparedFinalObject,
        "WaterConnection[0].documents",
        "DocumentsData",
        dispatch,
        //"WS"
      );
    }

    const convPayload = findAndReplace(payload, "NA", null)
    let queryObjectForEst = [{
      applicationNo: applicationNumber,
      tenantId: tenantId,
      sewerageConnection: convPayload.SewerageConnections[0]
    }]
    estimate = await swEstimateCalculation(queryObjectForEst, dispatch);
    let viewBillTooltip = []
    if (estimate !== null && estimate !== undefined) {
      if (estimate.Calculation !== undefined && estimate.Calculation.length > 0) {
        await processBills(estimate, viewBillTooltip, dispatch);
        // viewBreakUp 
        estimate.Calculation[0].billSlabData = _.groupBy(estimate.Calculation[0].taxHeadEstimates, 'category')
        estimate.Calculation[0].appStatus = processInstanceAppStatus; 
        if(payload.SewerageConnections[0].totalAmountPaid!== null)
        set(estimate.Calculation[0], 'totalAmountPaid', parseInt(payload.SewerageConnections[0].totalAmountPaid));
        else{
          set(estimate.Calculation[0], 'totalAmountPaid', 0);
        }
        dispatch(prepareFinalObject("dataCalculation", estimate.Calculation[0]));
      }
    }
  }
  if (estimate !== null && estimate !== undefined) {
    createEstimateData(estimate.Calculation[0].taxHeadEstimates, "taxHeadEstimates", dispatch, {}, {});
  }
};

const parserFunction = (obj) => {
  // let isFerruleApplicable = false
  // if(obj.waterApplication.applicationStatus !== 'PENDING_FOR_SECURITY_DEPOSIT' || obj.waterApplication.applicationStatus!=='PENDING_FOR_JE_APPROVAL_AFTER_SUPERINTEDENT')
  // {
  //     isFerruleApplicable  =true;

  // }
  // else{
  //   isFerruleApplicable = obj.waterApplication.isFerruleApplicable
  // }
  let usageCategory = null
  let usageSubCategory = null
  if(obj.service==='WATER')
  {
    usageCategory =(obj.waterProperty.usageCategory === null || obj.waterProperty.usageCategory === "NA") ? "" : obj.waterProperty.usageCategory
    usageSubCategory = (obj.waterProperty.usageSubCategory === null || obj.waterProperty.usageSubCategory === "NA") ? "" : obj.waterProperty.usageSubCategory
  }
  if(obj.service==='SEWERAGE')
  {
    usageCategory = obj.swProperty.usageCategory
  }
  let parsedObject = {
    roadCuttingArea: parseInt(obj.roadCuttingArea),
    meterInstallationDate: convertDateToEpoch(obj.meterInstallationDate),
    connectionExecutionDate: convertDateToEpoch(obj.connectionExecutionDate),
    proposedWaterClosets: parseInt(obj.proposedWaterClosets),
    proposedToilets: parseInt(obj.proposedToilets),
    roadCuttingArea: parseInt(obj.roadCuttingArea),
    securityCharge:(obj.securityCharge === null || obj.securityCharge === "NA") ? "" : parseFloat(obj.securityCharge),
    additionalDetails: {
      initialMeterReading: (
        obj.additionalDetails !== undefined &&
        obj.additionalDetails.initialMeterReading !== undefined
      ) ? parseFloat(obj.additionalDetails.initialMeterReading) : null,
      lastMeterReading: (
        obj.additionalDetails !== undefined &&
        obj.additionalDetails.lastMeterReading !== undefined
      ) ? parseFloat(obj.additionalDetails.lastMeterReading) : null,
      detailsProvidedBy: (
        obj.additionalDetails !== undefined &&
        obj.additionalDetails.detailsProvidedBy !== undefined &&
        obj.additionalDetails.detailsProvidedBy !== null
      ) ? obj.additionalDetails.detailsProvidedBy : "",
    },
    noOfTaps: parseInt(obj.noOfTaps),
    // isFerruleApplicable:isFerruleApplicable,
    // waterApplication:{
    //   isFerruleApplicable:isFerruleApplicable,
    // },
   // proposedTaps: parseInt(obj.proposedTaps),
    waterProperty :{
    usageCategory: usageCategory,
    usageSubCategory: usageSubCategory,    },
    waterApplicationType: (obj.waterApplicationType === null || obj.waterApplicationType === "NA") ? "" : obj.waterApplicationType,
    plumberInfo: (obj.plumberInfo === null || obj.plumberInfo === "NA") ? [] : obj.plumberInfo
  }
  obj = { ...obj, ...parsedObject }
  return obj;
}

const processBills = async (data, viewBillTooltip, dispatch) => {
  let des, obj, groupBillDetails = [];
  let appNumber=data.Calculation[0].applicationNo;
  data.Calculation[0].taxHeadEstimates.forEach(async element => {
    let cessKey = element.taxHeadCode
    let body;
    if (service === "WATER" ||appNumber.includes("WS")) {
      body = { "MdmsCriteria": { "tenantId": tenantId, "moduleDetails": [{ "moduleName": "ws-services-calculation", "masterDetails": [{ "name": cessKey }] }] } }
    } else {
      body = { "MdmsCriteria": { "tenantId": tenantId, "moduleDetails": [{ "moduleName": "sw-services-calculation", "masterDetails": [{ "name": cessKey }] }] } }
    }
    let res = await getDescriptionFromMDMS(body, dispatch)
    if (res !== null && res !== undefined && res.MdmsRes !== undefined && res.MdmsRes !== null) {
      if (service === "WATER" || appNumber.includes("WS")) { des = res.MdmsRes["ws-services-calculation"]; }
      else { des = res.MdmsRes["sw-services-calculation"]; }
      if (des !== null && des !== undefined && des[cessKey] !== undefined && des[cessKey][0] !== undefined && des[cessKey][0] !== null) {
        groupBillDetails.push({ key: cessKey, value: des[cessKey][0].description, amount: element.estimateAmount, order: element.order })
      } else {
        groupBillDetails.push({ key: cessKey, value: 'Please put some description in mdms for this Key', amount: element.estimateAmount, category: element.category })
      }
    }
  })
  obj = { bill: groupBillDetails }
  viewBillTooltip.push(obj);
  const dataArray = [{ total: data.Calculation[0].totalAmount }]
  const finalArray = [{ description: viewBillTooltip, data: dataArray }]
  dispatch(prepareFinalObject("viewBillToolipData", finalArray));
}


export default screenConfig;

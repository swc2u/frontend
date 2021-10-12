import React from "react";
import { connect } from "react-redux";
import TaskStatusContainer from "../TaskStatusContainer";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { Footer } from "../../ui-molecules-local";
import {
  getQueryArg,
  addWflowFileUrl,
  orderWfProcessInstances,
  getMultiUnits
} from "egov-ui-framework/ui-utils/commons";
import { convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import get from "lodash/get";
import set from "lodash/set";
import find from "lodash/find";
import {
  localStorageGet,
  getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";
import orderBy from "lodash/orderBy";
import { WNSConfigName, WNSBusinessService,WNSWaterBusinessService} from "../../ui-utils/commons";
const tenant = getQueryArg(window.location.href, "tenantId");

class WorkFlowContainer extends React.Component {
  state = {
    open: false,
    action: ""
  };

  componentDidMount = async () => {
    const { prepareFinalObject, toggleSnackbar } = this.props;
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const queryObject = [
      { key: "businessIds", value: applicationNumber },
      { key: "history", value: true },
      { key: "tenantId", value: tenantId }
    ];
    try {
      const payload = await httpRequest(
        "post",
        "egov-workflow-v2/egov-wf/process/_search",
        "",
        queryObject
      );
      if (payload && payload.ProcessInstances.length > 0) {
        const processInstances = orderWfProcessInstances(
          payload.ProcessInstances
        );
        addWflowFileUrl(processInstances, prepareFinalObject);
      } else {
        // toggleSnackbar(
        //   true,
        //   {
        //     labelName: "Workflow returned empty object !",
        //     labelKey: "WRR_WORKFLOW_ERROR"
        //   },
        //   "error"
        // );
      }
    } catch (e) {
      toggleSnackbar(
        true,
        {
          labelName: "Workflow returned empty object !",
          labelKey: "WRR_WORKFLOW_ERROR"
        },
        "error"
      );
    }
  };

  onClose = () => {
    this.setState({
      open: false
    });
  };
GetBusinessServiceConfig=(ModuleName)=>{
  let BusinessService = WNSBusinessService().BusinessService;  
  if (BusinessService.indexOf(ModuleName) > -1) {
    return true;
  } else return false;
}
GetWaterBusinessServiceConfig=(ModuleName)=>{
  let BusinessService = WNSWaterBusinessService().BusinessService;  
  if (BusinessService.indexOf(ModuleName) > -1) {
    return true;
  } else return false;
}
  getPurposeString = action => {
    switch (action) {
      case "APPLY":
        return "purpose=apply&status=success";
      case "FORWARD":
      case "RESUBMIT":
        return "purpose=forward&status=success";
      case "MARK":
        return "purpose=mark&status=success";
      case "VERIFY":
        return "purpose=verify&status=success";
      case "REJECT":
        return "purpose=application&status=rejected";
      case "CANCEL":
        return "purpose=application&status=cancelled";
      case "APPROVE":
        return "purpose=approve&status=success";
      case "SENDBACK":
        return "purpose=sendback&status=success";
      case "REFER":
        return "purpose=refer&status=success";
      case "SENDBACKTOCITIZEN":
        return "purpose=sendbacktocitizen&status=success";
      case "SUBMIT_APPLICATION":
        return "purpose=apply&status=success";
      case "RESUBMIT_APPLICATION":
        return "purpose=forward&status=success";
      case "SEND_BACK_TO_CITIZEN":
        return "purpose=sendback&status=success";
      case "VERIFY_AND_FORWARD":
        return "purpose=forward&status=success";
      case "SEND_BACK_FOR_DOCUMENT_VERIFICATION":
      case "SEND_BACK_FOR_FIELD_INSPECTION":
        return "purpose=sendback&status=success";
      case "APPROVE_FOR_CONNECTION":
        return "purpose=approve&status=success";
      case "ACTIVATE_CONNECTION":
      case "ACTIVATE_TEMP_CONNECTION":
        return "purpose=activate&status=success";
      case "REVOCATE":
        return "purpose=application&status=revocated";

      case "VERIFY_AND_FORWARD_EE":
      case "VERIFY_AND_FORWARD_JE_BR":
          return "purpose=forward&status=success";

      case "PAY":
      case "PAY_FOR_REGULAR_CONNECTION":
      case "PAY_FOR_TEMPORARY_CONNECTION":
          return "purpose=payment&status=success";
          
      case "INITIATE":
          return "purpose=initiated&status=success";
          
      case "APPLY_SECURITY_DEPOSIT":
      case "APPLY_FOR_REGULAR_CONNECTION":
      case "APPLY_CONNECTION_REACTIVATION":
          return "purpose=apply&status=success";

      case "APPROVE":
      case "APPROVE_TEMP_CONNECTION":
      case "APPROVE_FOR_CONNECTION_CONVERSION":
      case "APPROVE_ACTIVATE_CONNECTION":
      case "APPROVE_AND_STOP_BILLING":
      case "APPROVE_AND_TEMP_STOP_BILLING":
      case "APPROVE_FOR_CONNECTION_RENAME":
      case "APPROVE_FOR_CONNECTION":
      case "APPROVE_BY_JE_BR":
          return "purpose=approve&status=success";

      case "SEND_BACK_FOR_ADDON_PAYMENT":
      case "SEND_BACK":
          return "purpose=sendback&status=success";
          case "CANCEL_APPLICATION":
          return "purpose=cancel&status=success";
      default :
        return "purpose=forward&status=success";
    }
  };

  wfUpdate = async label => {
    let {
      toggleSnackbar,
      preparedFinalObject,
      dataPath,
      moduleName,
      updateUrl
    } = this.props;
    const tenant = getQueryArg(window.location.href, "tenantId");
    let data = get(preparedFinalObject, dataPath, []);
    if (moduleName === "NewTL") {
      if (getQueryArg(window.location.href, "edited")) {
        const removedDocs = get(
          preparedFinalObject,
          "LicensesTemp[0].removedDocs",
          []
        );
        if (data[0] && data[0].commencementDate) {
          data[0].commencementDate = convertDateToEpoch(
            data[0].commencementDate,
            "dayend"
          );
        }
        let owners = get(data[0], "tradeLicenseDetail.owners");
        owners = (owners && this.convertOwnerDobToEpoch(owners)) || [];
        set(data[0], "tradeLicenseDetail.owners", owners);
        set(data[0], "tradeLicenseDetail.applicationDocuments", [
          ...get(data[0], "tradeLicenseDetail.applicationDocuments", []),
          ...removedDocs
        ]);

        // Accessories issue fix by Gyan
        let accessories = get(data[0], "tradeLicenseDetail.accessories");
        let tradeUnits = get(data[0], "tradeLicenseDetail.tradeUnits");
        set(
          data[0],
          "tradeLicenseDetail.tradeUnits",
          getMultiUnits(tradeUnits)
        );
        set(
          data[0],
          "tradeLicenseDetail.accessories",
          getMultiUnits(accessories)
        );
      }
    }
    if (dataPath === "BPA") {
      data.assignees = [];
      if (data.assignee) {
        data.assignee.forEach(assigne => {
          data.assignees.push({
            uuid: assigne
          });
        });
      }
      if (data.wfDocuments) {
        for (let i = 0; i < data.wfDocuments.length; i++) {
          data.wfDocuments[i].fileStore = data.wfDocuments[i].fileStoreId
        }
      }
    }

    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );

    // if (moduleName === "NewWS1" 
    //     || moduleName === "REGULARWSCONNECTION" 
    //     || moduleName === "SW_SEWERAGE"
    //     || moduleName === "TEMPORARY_WSCONNECTION"
    //     || moduleName === "TEMPORARY_WSCONNECTION_BILLING"
    //     || moduleName === "WS_TEMP_TEMP" 
    //     ||moduleName === "WS_TEMP_REGULAR"
    //     ||moduleName === "WS_DISCONNECTION" 
    //     ||moduleName === "WS_TEMP_DISCONNECTION"
    //     || moduleName === "WS_RENAME"
    //     || moduleName === 'WS_METER_UPDATE' 
    //     || moduleName === "WS_CONVERSION" 
    //     || moduleName === "WS_REACTIVATE"
    //     || moduleName === "WS_TUBEWELL") 
        if(this.GetBusinessServiceConfig(moduleName))
        {
      data = data[0];
      data.assignees = [];
      if (data.assignee) {
        data.assignee.forEach(assigne => {
          data.assignees.push({
            uuid: assigne
          })
        })
      }
      // set additionalDetails for W&S module
      // if (moduleName === "NewWS1" 
      // || moduleName === "REGULARWSCONNECTION"
      //   || moduleName === "SW_SEWERAGE"
      //   || moduleName === "TEMPORARY_WSCONNECTION"
      //   || moduleName === "TEMPORARY_WSCONNECTION_BILLING"
      //   || moduleName === "WS_TEMP_TEMP" 
      //   ||moduleName === "WS_TEMP_REGULAR"
      //   ||moduleName === "WS_DISCONNECTION" 
      //   ||moduleName === "WS_TEMP_DISCONNECTION"
      //   || moduleName === "WS_RENAME" 
      //   || moduleName === 'WS_METER_UPDATE'
      //   || moduleName === "WS_CONVERSION" 
      //   || moduleName === "WS_REACTIVATE"
      // || moduleName === "WS_TUBEWELL")
      if(this.GetBusinessServiceConfig(moduleName))
      {
        let businessServiceData = JSON.parse(
          localStorageGet("businessServiceData")
        );
        let nextStateid=null
        let searchPreviewScreenMdmsData =null
        let roles =[]
        let rolecode ='';
        let nextActions
        let ApplicationStatus =''
        if(data.service ==='SEWERAGE')
         {
          ApplicationStatus = data.applicationStatus
         }
         else{
ApplicationStatus =  data.waterApplication.applicationStatus;
         }
        let curstateactions = businessServiceData[0].states.filter(x=>x.applicationStatus === ApplicationStatus)// data.waterApplication.applicationStatus )
       // let actions_ = data.action
        if(curstateactions && curstateactions[0])
        {
          if(curstateactions[0].actions)
          {
          nextActions = curstateactions[0].actions.filter(x=>x.action === data.action)
          if(nextActions !== undefined && nextActions !== null)
          {
          nextStateid = nextActions[0].nextState
          if(nextStateid !== undefined && nextStateid !== null)
          businessServiceData = businessServiceData[0].states.filter(x=>x.uuid === nextStateid )
          }
        }
        } 
        searchPreviewScreenMdmsData  = preparedFinalObject.searchPreviewScreenMdmsData;
        // for sw swSectorList
          //swWorkflowRole
          // for water wsWorkflowRole
          if(data.service ==='WATER')
          {
            searchPreviewScreenMdmsData= searchPreviewScreenMdmsData['ws-services-masters'].wsWorkflowRole.filter(x=>x.state === businessServiceData[0].state)
          }        
          else if(data.service ==='SEWERAGE')
          {
            searchPreviewScreenMdmsData= searchPreviewScreenMdmsData['ws-services-masters'].swWorkflowRole.filter(x=>x.state === businessServiceData[0].state)
          }
        //let searchPreviewScreenMdmsData =[]
        // if(nextActions && nextActions[0])
        // {
        //  nextStateid = nextActions[0].nextState
        // businessServiceData = businessServiceData[0].states.filter(x=>x.uuid === nextStateid )
        // let searchPreviewScreenMdmsData  = preparedFinalObject.searchPreviewScreenMdmsData;
        // searchPreviewScreenMdmsData= searchPreviewScreenMdmsData['ws-services-masters'].wsWorkflowRole.filter(x=>x.state === businessServiceData[0].state)
        // }
        if(searchPreviewScreenMdmsData && searchPreviewScreenMdmsData[0])
        {
          roles =  searchPreviewScreenMdmsData = searchPreviewScreenMdmsData[0].roles
         roles = roles.filter(x=>x.subdivision === data.subdiv )
         if(roles.length>0)
         {
          rolecode = roles[0].role 
         }
        }
        //searchPreviewScreenMdmsData = searchPreviewScreenMdmsData['ws-services-masters'].wsWorkflowRole.filter(x=>x.state === data.action)
      //   let roles =[]
      //   let rolecode ='';
      //   if(searchPreviewScreenMdmsData.length>0)
      //   {
      //   if(searchPreviewScreenMdmsData && searchPreviewScreenMdmsData[0])
      //   {
      //     roles =  searchPreviewScreenMdmsData = searchPreviewScreenMdmsData[0].roles
      //    roles = roles.filter(x=>x.subdivision === data.subdiv )
      //    if(roles.length>0)
      //    {
      //     rolecode = roles[0].role 
      //    }

      //   }
      // }
      if(rolecode)
      {
        data.processInstance = {
          documents: data.wfDocuments,
          assignee: data.assignees[0],
          comment: data.comment,
          action: data.action,
          additionalDetails:{
            role:rolecode
          }
        }

      }
      else{
              data.processInstance = {
                documents: data.wfDocuments,
                assignee: data.assignees.length === 0?null:data.assignees[0],
                comment: data.comment,
                action: data.action,
                additionalDetails:null
              }
            }

      }
      else{
        data.processInstance = {
          documents: data.wfDocuments,
          assignes: data.assignees,
          comment: data.comment,
          action: data.action
        }
      }      
      data.waterSource = data.waterSource + "." + data.waterSubSource;
    
    }
    let validRequest = true
    if (moduleName === "SW_SEWERAGE" && data.service ==='SEWERAGE') {
      dataPath = "SewerageConnection";
      updateUrl = '/sw-services/swc/_update'
      validRequest = this.ValidateRequestSW(data,preparedFinalObject);
      // set if if application is edit
     

    }

    
    // if (moduleName === "REGULARWSCONNECTION"
    //     || moduleName === "TEMPORARY_WSCONNECTION"
    //     || moduleName === "TEMPORARY_WSCONNECTION_BILLING"
    //     || moduleName === "WS_TEMP_TEMP" 
    //     ||moduleName === "WS_TEMP_REGULAR"
    //     ||moduleName === "WS_DISCONNECTION" 
    //     ||moduleName === "WS_TEMP_DISCONNECTION"
    //     || moduleName === "WS_RENAME" 
    //     || moduleName === 'WS_METER_UPDATE'
    //     || moduleName === "WS_CONVERSION" 
    //     || moduleName === "WS_REACTIVATE"
    //   || moduleName === "WS_TUBEWELL"
    //   || data.service ==='WATER'
    //   )
      if(this.GetWaterBusinessServiceConfig(moduleName) && data.service ==='WATER')
      {
        updateUrl = '/ws-services/wc/_update'
        validRequest = this.ValidateRequest(data,preparedFinalObject,moduleName)
      }   

    try {
      let payload = null
      if(validRequest)
      {
      const response = await httpRequest("post", updateUrl, "", [], {
        [dataPath]: data
      });
      payload = response
    }
    else{

      let labelKey = 'WS_REQUEST_VALIDATION_MESSAGE'
      let labelName='Please fill the required field in Edit section'
      if (moduleName === "SW_SEWERAGE" && data.service ==='SEWERAGE') {
        if(data.applicationStatus ==='INITIATED' && data.action==='SUBMIT_APPLICATION')
        {
          labelKey = 'WS_RESUBMIT_DOCUMENT_UPLOAD_VALIDATION_MESSAGE'
          labelName = 'Please upload mandatory document in document section then submit'
  
        }
        else if(data.applicationStatus ==='PENDING_ROADCUT_NOC_BY_CITIZEN' && data.action ==='SUBMIT_ROADCUT_NOC')
      {
        labelKey = 'WS_SUBMIT_ROADCUT_NOC_VALIDATION_MESSAGE'
        labelName = 'Please upload road cut NOC document in document section then submit'
      }
        toggleSnackbar(
          true,
          {
            labelName: labelName,
            labelKey: labelKey
          },
          "error"
        ); 
        return false;

      }
      else
      {
      if(data.waterApplication.applicationStatus ==='PENDING_FOR_SECURITY_DEPOSIT' && data.action==='VERIFY_AND_FORWARD_FOR_PAYMENT')
      {
        labelKey = 'WS_REQUEST_VALIDATION_MESSAGE'
        labelName = 'Please fill the required field in Edit section'
      }
      
      else if(data.waterApplication.applicationStatus ==='PENDING_ROADCUT_NOC_BY_CITIZEN' && data.action ==='SUBMIT_ROADCUT_NOC')
      {
        labelKey = 'WS_SUBMIT_ROADCUT_NOC_VALIDATION_MESSAGE'
        labelName = 'Please upload road cut NOC document in document section then submit'
      }
      else  if(data.waterApplication.applicationStatus ==='INITIATED' && data.action==='SUBMIT_APPLICATION')
      {
        labelKey = 'WS_RESUBMIT_DOCUMENT_UPLOAD_VALIDATION_MESSAGE'
        labelName = 'Please upload mandatory document in document section then submit'

      }
      else  if((data.waterApplication.applicationStatus ==='PENDING_FOR_SDE_APPROVAL')
      && (data.action==='VERIFY_AND_FORWARD_FOR_PAYMENT'|| data.action==='VERIFY_AND_FORWARD_TO_JE' ))//PENDING_FOR_SDE_APPROVAL,VERIFY_AND_FORWARD_FOR_PAYMENT
      {
        labelKey = 'WS_SUBMIT_UPDATE_METER_INFORMATION_VALIDATION_MESSAGE'
        labelName = 'Proposed connection execution details can not be blank'

      }
      else if(( data.activityType ==='TEMPORARY_WSCONNECTION' 
      || data.activityType ==='APPLY_FOR_TEMPORARY_CONNECTION' //TB   
    || data.activityType ==='APPLY_FOR_TEMPORARY_CONNECTION_BILLING' //TB
    || data.activityType ==='TEMPORARY_WSCONNECTION_BILLING'
    || data.activityType ==='NEW_WS_CONNECTION'//NR
    || data.activityType ==='REGULARWSCONNECTION' )
  &&  
  (data.waterApplication.applicationStatus ==="PENDING_FOR_CONNECTION_ACTIVATION_BY_SUPERINTENDENT"    
    ) 
    &&
    (
      data.action==='ACTIVATE_REGULAR_CONNECTION' 
      || data.action==='ACTIVATE_TEMPORARY_CONNECTION'
      || data.action==='ACTIVATE_REGULAR_CONNECTION'
      || 1===1
    )
    
    )
  {
    labelKey = 'WS_SET_CONNECTION_NUMBER_VALIDATION'
    labelName ="Please set Consumer number/Account number"
  }
      toggleSnackbar(
        true,
        {
          labelName: labelName,
          labelKey: labelKey
        },
        "error"
      ); 
      return false;

    }
  }

      this.setState({
        open: false
      });

      if (payload) {
        let path = "";

        if (moduleName == "PT.CREATE" || moduleName == "ASMT") {
          this.props.setRoute(`/pt-mutation/acknowledgement?${this.getPurposeString(
            label
          )}&moduleName=${moduleName}&applicationNumber=${get(payload, 'Properties[0].acknowldgementNumber', "")}&tenantId=${get(payload, 'Properties[0].tenantId', "")}`);
          return;
        }

        if (moduleName === "NewTL") path = "Licenses[0].licenseNumber";
        else if (moduleName === "FIRENOC") path = "FireNOCs[0].fireNOCNumber";
        else path = "Licenses[0].licenseNumber";
        const licenseNumber = get(payload, path, "");
        window.location.href = `acknowledgement?${this.getPurposeString(
          label
        )}&applicationNumber=${applicationNumber}&tenantId=${tenant}&secondNumber=${licenseNumber}`;

      //   if (moduleName === "NewWS1" 
      //   || moduleName ==="SW_SEWERAGE"
      //   || moduleName === "REGULARWSCONNECTION"
      //   || moduleName === "TEMPORARY_WSCONNECTION"
      //   || moduleName === "TEMPORARY_WSCONNECTION_BILLING"
      //   || moduleName === "WS_TEMP_TEMP" 
      //   ||moduleName === "WS_TEMP_REGULAR"
      //   ||moduleName === "WS_DISCONNECTION" 
      //   ||moduleName === "WS_TEMP_DISCONNECTION"
      //   || moduleName === "WS_RENAME" 
      //   || moduleName === 'WS_METER_UPDATE'
      //   || moduleName === "WS_CONVERSION" 
      //   || moduleName === "WS_REACTIVATE"
      // || moduleName === "WS_TUBEWELL")
      if(this.GetBusinessServiceConfig(moduleName))
         {
           let action = ''
           if(data.action);
           action = data.action
      // window.localStorage.setItem("WNS_STATUS",action );
          window.location.href = `acknowledgement?${this.getPurposeString(label)}&applicationNumber=${applicationNumber}&tenantId=${tenant}`;
        }

      }
    } catch (e) {
      if (moduleName === "BPA") {
        toggleSnackbar(
          true,
          {
            labelName: "Documents Required",
            labelKey: e.message
          },
          "error"
        );
      }else 
      // if (moduleName === "SW_SEWERAGE" 
      //   || moduleName === "REGULARWSCONNECTION"
      //   || moduleName === "TEMPORARY_WSCONNECTION"
      //   || moduleName === "TEMPORARY_WSCONNECTION_BILLING"
      //   || moduleName === "WS_TEMP_TEMP" 
      //   ||moduleName === "WS_TEMP_REGULAR"
      //   ||moduleName === "WS_DISCONNECTION" 
      //   ||moduleName === "WS_TEMP_DISCONNECTION"
      //   || moduleName === "WS_RENAME" 
      //   || moduleName === 'WS_METER_UPDATE'
      //   || moduleName === "WS_CONVERSION" 
      //   || moduleName === "WS_REACTIVATE"
      // || moduleName === "WS_TUBEWELL")
      if(this.GetBusinessServiceConfig(moduleName))
      {
        toggleSnackbar(
          true,
          {
            labelName: "Workflow update error!",
            labelKey: e.message
          },
          "error"
        ); 
      } else {
        toggleSnackbar(
          true,
          {
            labelName: "Workflow update error!",
            labelKey: "ERR_WF_UPDATE_ERROR"
          },
          "error"
        );
      }
    }
  };

  createWorkFLow = async (label, isDocRequired) => {
    const { toggleSnackbar, dataPath, preparedFinalObject,moduleName } = this.props;
    let data = {};

    if (dataPath == "BPA" || dataPath == "Assessment" || dataPath == "Property") {

      data = get(preparedFinalObject, dataPath, {})
    } else {
      data = get(preparedFinalObject, dataPath, [])
      data = data[0];
    }
    //setting the action to send in RequestInfo
    let appendToPath = ""
    if (dataPath === "FireNOCs") {
      appendToPath = "fireNOCDetails."
    } else if (dataPath === "Assessment" || dataPath === "Property") {
      appendToPath = "workflow."
    } else {
      appendToPath = ""
    }


    set(data, `${appendToPath}action`, label);

    if (isDocRequired) {
      const documents = get(data, "wfDocuments");
      if (documents && documents.length > 0) {
        this.wfUpdate(label);
      } else {
        toggleSnackbar(
          true,
          { labelName: "Please Upload file !", labelKey: "ERR_UPLOAD_FILE" },
          "error"
        );
      }
    } 
    else {
      var validated = true;
      const{WaterConnection} = preparedFinalObject
      // if (moduleName === "SW_SEWERAGE" 
      //   || moduleName === "REGULARWSCONNECTION"
      //   || moduleName === "TEMPORARY_WSCONNECTION"
      //   || moduleName === "TEMPORARY_WSCONNECTION_BILLING"
      //   || moduleName === "WS_TEMP_TEMP" 
      //   ||moduleName === "WS_TEMP_REGULAR"
      //   ||moduleName === "WS_DISCONNECTION" 
      //   ||moduleName === "WS_TEMP_DISCONNECTION"
      //   || moduleName === "WS_RENAME" 
      //   || moduleName === 'WS_METER_UPDATE'
      //   || moduleName === "WS_CONVERSION" 
      //   || moduleName === "WS_REACTIVATE"
      // || moduleName === "WS_TUBEWELL")
      if(this.GetBusinessServiceConfig(moduleName))
      {
        if (WaterConnection[0].comment.length === 0) {
          validated = false;
          toggleSnackbar(
            true,
            { labelName: "Please provide comments", labelKey: "ERR_PLEASE_PROVIDE_COMMENTS" },
            "error"
          );
        }
  
        if (WaterConnection[0].comment.length > 128) {
          validated = false;
          toggleSnackbar(
            true,
            { labelName: "Invalid comment length", labelKey: "ERR_INVALID_COMMENT_LENGTH" },
            "error"
          );
        }
      } 

      if (validated) {
        data.workFlowDetails = data.workFlowDetails
        this.wfUpdate(label);

      }

     // this.wfUpdate(label);
    }
  };

  getRedirectUrl = (action, businessId, moduleName) => {
    //console.log("modulenamewater", moduleName);
    const isAlreadyEdited = getQueryArg(window.location.href, "edited");
    const tenant = getQueryArg(window.location.href, "tenantId");
    const { ProcessInstances } = this.props;
    let applicationStatus;
    if (ProcessInstances && ProcessInstances.length > 0) {
      applicationStatus = get(ProcessInstances[ProcessInstances.length - 1], "state.applicationStatus");
    }
    let baseUrl = "";
    let bservice = "";
    if (moduleName === "FIRENOC") {
      baseUrl = "fire-noc";
    } else if (moduleName === "BPA") {
      baseUrl = "egov-bpa";
      bservice = ((applicationStatus == "PENDING_APPL_FEE") ? "BPA.NC_APP_FEE" : "BPA.NC_SAN_FEE");
    } else 
    // if (moduleName === "NewWS1" 
    //   || moduleName === "SW_SEWERAGE"
    //     || moduleName === "REGULARWSCONNECTION"
    //     || moduleName === "TEMPORARY_WSCONNECTION"
    //     || moduleName === "TEMPORARY_WSCONNECTION_BILLING"
    //     || moduleName === "WS_TEMP_TEMP" 
    //     ||moduleName === "WS_TEMP_REGULAR"
    //     ||moduleName === "WS_DISCONNECTION" 
    //     ||moduleName === "WS_TEMP_DISCONNECTION"
    //     || moduleName === "WS_RENAME" 
    //     || moduleName === 'WS_METER_UPDATE'
    //     || moduleName === "WS_CONVERSION" 
    //     || moduleName === "WS_REACTIVATE"
    //   || moduleName === "WS_TUBEWELL")
      if(this.GetBusinessServiceConfig(moduleName))
    {
      baseUrl = "wns"
    //   if (moduleName === "NewWS1"      
    //   || moduleName === "REGULARWSCONNECTION"
    //   || moduleName === "TEMPORARY_WSCONNECTION"
    //   || moduleName === "TEMPORARY_WSCONNECTION_BILLING"
    //   || moduleName === "WS_TEMP_TEMP" 
    //   ||moduleName === "WS_TEMP_REGULAR"
    //   ||moduleName === "WS_DISCONNECTION" 
    //   ||moduleName === "WS_TEMP_DISCONNECTION"
    //   || moduleName === "WS_RENAME"
    //   || moduleName === 'WS_METER_UPDATE' 
    //   || moduleName === "WS_CONVERSION" 
    //   || moduleName === "WS_REACTIVATE"
    // || moduleName === "WS_TUBEWELL")
    if(this.GetWaterBusinessServiceConfig(moduleName))
      {
        let  WNSConfigName_= WNSConfigName()
        bservice = WNSConfigName_.ONE_TIME_FEE_WS
      //   if (moduleName === "NewWS1" 
      //   || moduleName === "REGULARWSCONNECTION"
      //   || moduleName === "TEMPORARY_WSCONNECTION"
      //   || moduleName === "TEMPORARY_WSCONNECTION_BILLING"
      //   || moduleName === "WS_TEMP_TEMP" 
      //   ||moduleName === "WS_TEMP_REGULAR"
      //   ||moduleName === "WS_DISCONNECTION" 
      //   ||moduleName === "WS_TEMP_DISCONNECTION"
      //   || moduleName === "WS_RENAME"
      //   || moduleName === 'WS_METER_UPDATE' 
      //   || moduleName === "WS_CONVERSION" 
      //   || moduleName === "WS_REACTIVATE"
      // || moduleName === "WS_TUBEWELL")
      if(this.GetWaterBusinessServiceConfig(moduleName))
         window.localStorage.setItem("isTubeWell",false);
        if( moduleName === "WS_TUBEWELL") window.localStorage.setItem("isTubeWell",true);
      } else {
        let  WNSConfigName_= WNSConfigName()
        bservice =WNSConfigName_.ONE_TIME_FEE_SW
      }
    } else if (moduleName === "PT") {
      bservice = "PT"
    } else if (moduleName === "PT.MUTATION") {
      bservice = "PT.MUTATION"
    } else {
      baseUrl = "tradelicence";
    }
    const payUrl = `/egov-common/pay?consumerCode=${businessId}&tenantId=${tenant}`;
    switch (action) {
      case "PAY_FOR_TEMPORARY_CONNECTION":
      case "PAY_FOR_REGULAR_CONNECTION":
      case "PAY": return bservice ? `${payUrl}&businessService=${bservice}` : payUrl;
      case "EDIT": return isAlreadyEdited
        ? `/${baseUrl}/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit&edited=true&service=WATER`
        : `/${baseUrl}/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit&service=WATER`;
        case "WATERMODIFY":
          return isAlreadyEdited
          ? `/${baseUrl}/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit&edited=true&service=WATER`
          : `/${baseUrl}/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit&service=WATER`;
    }
  };

//
//validation methos for water Request if submit without filling rewuired field
//
ValidateRequest =(payload,preparedFinalObject,moduleName) =>{
  let isvalidRequest = false

  //if(payload.applicationStatus ==='PENDING_FOR_SECURITY_DEPOSIT' && payload.action==='VERIFY_AND_FORWARD_FOR_PAYMENT')
  //PENDING_FOR_JE_APPROVAL_AFTER_SUPERINTEDENT

  //set document if in case of resubmit
  // if(payload.action ==='RESUBMIT_APPLICATION')
  // {
    let applicationStatus = payload.waterApplication.applicationStatus;
    if(payload.documents !== null)
    {
      for (let index = 0; index < payload.documents.length; index++) {
        const element = payload.documents[index];

        let doctype =`WS_${element.documentType}`
        if(preparedFinalObject.WaterConnection[0].reviewDocData !== undefined && preparedFinalObject.WaterConnection[0].reviewDocData !== null)
        {
          let ids = preparedFinalObject.WaterConnection[0].reviewDocData.filter(x=>x.title === doctype)
        if(ids && ids[0])
        {
          set(payload.documents[index], "id", ids[0].id);
        }

        }
        
        
        
      }
    }
  //}
  if(payload.action ==='REJECT')
  {
    isvalidRequest = true
  }
  else{ 
  if(preparedFinalObject.applyScreen !==null && preparedFinalObject.applyScreen !== undefined)
  {
    if(preparedFinalObject.applyScreen.waterProperty!== undefined)
    payload.waterProperty.id = preparedFinalObject.applyScreen.waterProperty.id

  }
    
  if((applicationStatus ==='PENDING_FOR_JE_APPROVAL_AFTER_SUPERINTEDENT' || applicationStatus ==='PENDING_FOR_SUPERINTENDENT_APPROVAL_AFTER_JE' ) && (payload.action !=='REJECT' && payload.action !=='SEND_BACK_TO_JE')  )
  {
    isvalidRequest = false;
    // logic for null value validation for Connection Details date and Activation Details
    /// start
      // if(payload.plumberInfo === null)
      // {
        if(payload.div!= null && 
          payload.div !== "" &&
          payload.subdiv!= null &&
          payload.subdiv !== "" &&
          payload.ledgerNo!= null &&
          payload.ledgerNo !== "" &&
          payload.billGroup!= null &&
          payload.billGroup !== "" 
          )
        {
          isvalidRequest = true

        }
        else
        {
          isvalidRequest = false

        }
      //}

    /// end
    // logic for null value validation for security value if required
    /// start
    /// end

  }
  // validation to check road cut document uploaded
  else if(applicationStatus ==='PENDING_ROADCUT_NOC_BY_CITIZEN' && payload.action ==='SUBMIT_ROADCUT_NOC')
  {
    let activityType_=  payload.activityType
    let documents=  get(payload, "documents",[]);
    if(documents !== undefined && documents!== null && documents.length>0)
    {
      let duplicatedoc =  documents.filter(x=>x.documentType === `${activityType_}_ROADCUT_NOC`)
      if(duplicatedoc !== undefined)
        {
        if(duplicatedoc && duplicatedoc.length == 0)
        {
          isvalidRequest = false
          
        }
        else{
          isvalidRequest = true
        }
      }
      else{
        isvalidRequest = true
      }
    }
    else
   {
     isvalidRequest = true
    }

  }
  else{
    isvalidRequest = true
    payload.waterApplication.isFerruleApplicable = get(payload.waterApplication,'isFerruleApplicable',true);
  }
  // change tarrif type when state is PENDING_FOR_CONNECTION_TARIFF_CHANGE for action CHANGE_TARIFF

 if((applicationStatus ==='PENDING_FOR_CONNECTION_TARIFF_CHANGE' && payload.action==='CHANGE_TARIFF'))//PENDING_FOR_CONNECTION_HOLDER_CHANGE may be include for UPDATE_CONNECTION_HOLDER_INFO and CHANGE_CONNECTION_HOLDER
  {
    if(payload.proposedUsageCategory !==null)
    payload.waterProperty.usageCategory = payload.proposedUsageCategory
   
  }
  if((applicationStatus ==='PENDING_FOR_CONNECTION_HOLDER_CHANGE' && payload.action==='CHANGE_CONNECTION_HOLDER'))//PENDING_FOR_CONNECTION_HOLDER_CHANGE may be include for UPDATE_CONNECTION_HOLDER_INFO and CHANGE_CONNECTION_HOLDER
{
  if(payload.connectionHolders !==null)
  {
    payload.connectionHolders[0].name = payload.connectionHolders[0].proposedName
    payload.connectionHolders[0].mobileNumber = payload.connectionHolders[0].proposedMobileNo
    payload.connectionHolders[0].correspondenceAddress = payload.connectionHolders[0].proposedCorrespondanceAddress

  }
  
 
}
  if(applicationStatus ==='PENDING_FOR_CONNECTION_EXTENSION_REGULAR' && payload.action==='CONVERT_INTO_REGULAR_CONNECTION')//
  {
    payload.waterApplicationType = "REGULAR";
  }
  if(applicationStatus ==='INITIATED' && payload.action==='SUBMIT_APPLICATION')
  {
    if(payload.documents === null)
    {
      isvalidRequest = false

    }
  }
 
  if(payload.activityType ==='UPDATE_METER_INFO' || payload.activityType ==='WS_METER_UPDATE')// only for meter update
  {
    if((applicationStatus ==='PENDING_FOR_SDE_APPROVAL' || applicationStatus ==='PENDING_FOR_METER_UPDATE' )
    && ((payload.action==='VERIFY_AND_FORWARD_FOR_PAYMENT' 
       // || payload.action==='VERIFY_AND_FORWARD_FOR_PAYMENT' 
        || payload.action==='VERIFY_AND_FORWARD_TO_JE' 
        || payload.action ==='UPDATE_METER_INFORMATION') ))//PENDING_FOR_SDE_APPROVAL,VERIFY_AND_FORWARD_FOR_PAYMENT
    {
      isvalidRequest = true
      if(payload.connectionExecutionDate !== 0)
      { 
        if(!Number(payload.connectionExecutionDate))
        payload.connectionExecutionDate = convertDateToEpoch(payload.connectionExecutionDate)
        else
        payload.connectionExecutionDate = payload.connectionExecutionDate

      }
      if(payload.proposedMeterId !== null && payload.proposedMeterId !== '')
      {
        payload.meterId = payload.proposedMeterId
      }
      if(payload.proposedMeterInstallationDate !== 0)
      {
        if(!Number(payload.proposedMeterInstallationDate))
        {
          payload.meterInstallationDate = convertDateToEpoch(payload.proposedMeterInstallationDate)
          payload.proposedMeterInstallationDate = convertDateToEpoch(payload.proposedMeterInstallationDate)
        }
        
        else{
          payload.meterInstallationDate = payload.proposedMeterInstallationDate
        }
       // payload.proposedMeterInstallationDate = convertDateToEpoch(payload.proposedMeterInstallationDate)
      }
      else if(payload.proposedMeterInstallationDate !== null && payload.proposedMeterInstallationDate !== '')
      {
        if(!Number(payload.proposedMeterInstallationDate))
        {
          payload.proposedMeterInstallationDate = convertDateToEpoch(payload.proposedMeterInstallationDate)
          payload.meterInstallationDate = convertDateToEpoch(payload.proposedMeterInstallationDate)
        }
        
        else{
          payload.meterInstallationDate = payload.proposedMeterInstallationDate
          
        }
      }
      if(payload.proposedMeterCount !== null && payload.proposedMeterCount !== '')
      {
        payload.meterCount = payload.proposedMeterCount
      }
      if(payload.proposedMfrCode !== null && payload.proposedMfrCode !== '')
      {
        payload.mfrCode = payload.proposedMfrCode
      }
      if(payload.proposedInitialMeterReading !== null && payload.proposedInitialMeterReading !== '')
      {
        payload.additionalDetails.initialMeterReading = payload.proposedInitialMeterReading
      }
      else{
        payload.additionalDetails.initialMeterReading=0
      }
      if(payload.proposedMeterDigits !== null && payload.proposedMeterDigits !== '')
      {
        payload.meterDigits = payload.proposedMeterDigits
      }
      if(payload.proposedMeterUnit !== null && payload.proposedMeterUnit !== '')
      {
        payload.meterUnit = payload.proposedMeterUnit
      }
      if(payload.proposedSanctionedCapacity !== null && payload.proposedSanctionedCapacity !== '')
      {
        payload.sanctionedCapacity = payload.proposedSanctionedCapacity
      }
      if(payload.proposedMeterRentCode !== null && payload.proposedMeterRentCode !== '')
      {
        payload.meterRentCode = payload.proposedMeterRentCode
      }
      if(payload.proposedLastMeterReading !== null && payload.proposedLastMeterReading !== '')
      {
        payload.additionalDetails.lastMeterReading = payload.proposedLastMeterReading
      }
     
      // else{
      //   isvalidRequest = true
      //   if(payload.proposedMeterInstallationDate)
      //   payload.meterInstallationDate = convertDateToEpoch(payload.proposedMeterInstallationDate) 
      //   if(payload.proposedMeterInstallationDate)
      //   payload.proposedMeterInstallationDate = convertDateToEpoch(payload.proposedMeterInstallationDate)

        
      // }
  
    }
    else{
      payload.proposedMeterInstallationDate = convertDateToEpoch(payload.proposedMeterInstallationDate)
  
    }

  }
  if((payload.activityType ==='WS_TEMP_DISCONNECTION' || payload.activityType ==='TEMPORARY_DISCONNECTION') && applicationStatus ==='PENDING_FOR_TEMPORARY_CONNECTION_CLOSE')// only for meter update
  {
    payload.status = 'Inactive';

  }
  if((payload.activityType ==='WS_DISCONNECTION' || payload.activityType ==='PERMANENT_DISCONNECTION') && applicationStatus ==='PENDING_FOR_CONNECTION_CLOSE')// only for meter update
  {
    payload.status = 'Inactive';

  }
  if((payload.activityType ==='WS_REACTIVATE' || payload.activityType ==='REACTIVATE_CONNECTION') && 
  (applicationStatus ==='PENDING_FOR_CONNECTION_REACTIVATION'
  ||applicationStatus ==='PENDING_FOR_SUPERINTENDENT_APPROVAL_AFTER_JE_FOR_REACTIVATION'
  ||applicationStatus ==='VERIFY_AND_FORWARD_TO_SUPERINTENDENT_AFTER_PAYMENT_FOR_REACTIVATION')
  
  )// only for meter update
  {
    payload.status = 'Active';

  }
  // set application_code bassed on module name set in mdms data
  // if(applicationStatus ==='PENDING_FOR_DOCUMENT_VERIFICATION' ||  1===1 )
  // {
  //   let searchPreviewScreenMdmsData  = preparedFinalObject.searchPreviewScreenMdmsData;
  //   searchPreviewScreenMdmsData = searchPreviewScreenMdmsData['ws-services-masters'].ApplicationCode.filter(x=>x.name === moduleName)
  //   let code =''
  //   if(searchPreviewScreenMdmsData && searchPreviewScreenMdmsData[0])
  //   {
  //     code = searchPreviewScreenMdmsData[0].code
  //     payload.waterApplication.application_code = code
  //   }
    
  // }
  if(( payload.activityType ==='TEMPORARY_WSCONNECTION' // TC  
  || payload.activityType ==='APPLY_FOR_TEMPORARY_CONNECTION'
    || payload.activityType ==='APPLY_FOR_TEMPORARY_CONNECTION_BILLING' //TB
    || payload.activityType ==='TEMPORARY_WSCONNECTION_BILLING'
    || payload.activityType ==='NEW_WS_CONNECTION'//NR
    || payload.activityType ==='REGULARWSCONNECTION' )
  &&  
  (applicationStatus ==="PENDING_FOR_CONNECTION_ACTIVATION_BY_SUPERINTENDENT"
    //|| applicationStatus ==="PENDING_FOR_CONNECTION_ACTIVATION_BY_SUPERINTENDENT"
    //||applicationStatus ==="PENDING_FOR_CONNECTION_ACTIVATION_BY_SUPERINTENDENT"
    //|| 1===1
    ) 
    )
  {
    if(payload.connectionNo === null)
    {
      isvalidRequest = false
    }
    

  }

}

  // remove duplicate document

  let tmp = [];
    // for(let i = 0; i < payload.documents.length; i++){
    //     if(tmp.indexOf(payload.documents[i]) == -1){
    //     tmp.push(payload.documents[i]);
    //     }
    // }
    if(payload.documents !== null)
    {
    payload.documents =  this.uniqueBycode(payload.documents, x=>x.documentType);//payload.documents.filter((value,index) => payload.documents.indexOf(value) ===index)
    }
    ////
    // set wsid
    let waterId = payload.waterApplication.id
    if(payload.waterApplicationList)
      {                        
          // waterApplicationList = waterApplicationList.filter(x=>x.applicationNo === applicationNo)
          waterId = payload.waterApplicationList[0].id
         let waterApplicationList = payload.waterApplicationList.sort((a, b) => (a.auditDetails.lastModifiedTime > b.auditDetails.lastModifiedTime ? -1 : 1));
          waterId = waterApplicationList[0].id
          //WaterConnection[0].activityType = waterApplicationList_[0].activityType
      }
                    
      for (let index = 0; index < payload.connectionHolders.length; index++) {
          const element = payload.connectionHolders[index];
          if(element.status==='ACTIVE')
          {
              //set(payload, `connectionHolders[${index}].ws_application_id`, waterId);
              payload.connectionHolders[index].ws_application_id = waterId

          }          
      }
    ////
//return  false
return isvalidRequest
}
IsFlatrateconnection =(usageCategory,proposedUsageCategory,preparedFinalObject)=>{
  let searchPreviewScreenMdmsData  = preparedFinalObject.searchPreviewScreenMdmsData;

  let flatRate = []
  flatRate = searchPreviewScreenMdmsData['ws-services-masters'].tariffType.filter(x=>x.code === "11" || x.code ==="12" || x.code ==="2" || x.code ==="17" || x.code ==="19")
  let flatRateOther =searchPreviewScreenMdmsData['ws-services-masters'].tariffType.filter(x=>x.code !== "11" && x.code !=="12" && x.code !=="2" && x.code !=="17" && x.code !=="19")
  console.log(flatRate)
  console.log(flatRateOther)
  flatRate = flatRate.filter(x=>x.code === usageCategory)
  flatRateOther = flatRateOther.filter(x=>x.code === proposedUsageCategory)

  if((flatRate.length ===1) && (flatRateOther.length ===1) )
  {
    return true;
  }
  else
  {
    return false;
  }

}
ValidateRequestSW =(payload,preparedFinalObject)=>{
  let isvalidRequest = true
  if(payload.documents !== null)
  {
    for (let index = 0; index < payload.documents.length; index++) {
      const element = payload.documents[index];
      let doctype =`WS_${element.documentType}`
      // if(preparedFinalObject.WaterConnection[0].reviewDocData !== undefined)
      // {
        if(preparedFinalObject.WaterConnection[0].reviewDocData !== undefined && preparedFinalObject.WaterConnection[0].reviewDocData !== null)
        {
        let ids = preparedFinalObject.WaterConnection[0].reviewDocData.filter(x=>x.title === doctype)
      if(ids && ids[0])
      {
        set(payload.documents[index], "id", ids[0].id);
      }
      }
    }
  }
  if(payload.documents !== null)
  {
  payload.documents =  this.uniqueBycode(payload.documents, x=>x.documentType);//payload.documents.filter((value,index) => payload.documents.indexOf(value) ===index)
  }
  if(payload.applicationStatus ==='INITIATED' && payload.action==='SUBMIT_APPLICATION')
  {
    if(payload.documents === null)
    {
      isvalidRequest = false

    }
  }
  else if(payload.applicationStatus ==='PENDING_ROADCUT_NOC_BY_CITIZEN' && payload.action ==='SUBMIT_ROADCUT_NOC')
  {
    let activityType_=  "SW_SEWERAGE"
    let documents=  get(payload, "documents",[]);
    if(documents !== undefined && documents!== null && documents.length>0)
    {
      let duplicatedoc =  documents.filter(x=>x.documentType === `${activityType_}_ROADCUT_NOC`)
      if(duplicatedoc !== undefined)
        {
        if(duplicatedoc && duplicatedoc.length == 0)
        {
          isvalidRequest = false
          
        }
        else{
          isvalidRequest = true
        }
      }
      else{
        isvalidRequest = true
      }
    }
    else
   {
     isvalidRequest = true
    }

  }
  return isvalidRequest;

}

uniqueBycode =(data,key)=>{
  return [
    ... new Map(data.map(x=> [key(x),x])).values()
  ]

}
  getHeaderName = action => {
    return {
      labelName: `${action} Application`,
      labelKey: `WF_${action}_APPLICATION`
    };
  };

  getEmployeeRoles = (nextAction, currentAction, moduleName) => {
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = find(businessServiceData, { businessService: moduleName });
    let roles = [];
    if (nextAction === currentAction) {
      data.states &&
        data.states.forEach(state => {
          state.actions &&
            state.actions.forEach(action => {
              roles = [...roles, ...action.roles];
            });
        });
    } else {
      if( data !== undefined)
      {
      const states = find(data.states, { uuid: nextAction });
      states &&
        states.actions &&
        states.actions.forEach(action => {
          roles = [...roles, ...action.roles];
        });
    
    roles = [...new Set(roles)];
    roles.indexOf("*") > -1 && roles.splice(roles.indexOf("*"), 1);
    return roles.toString();
  }
}
  };

  checkIfTerminatedState = (nextStateUUID, moduleName) => {
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = businessServiceData && businessServiceData.length > 0 ? find(businessServiceData, { businessService: moduleName }) : [];
    // const nextState = data && data.length > 0 find(data.states, { uuid: nextStateUUID });

    const isLastState = data ? find(data.states, { uuid: nextStateUUID }) !== undefined? find(data.states, { uuid: nextStateUUID }).isTerminateState:false : false;
    return isLastState;
  };

  checkIfDocumentRequired = (nextStateUUID, moduleName) => {
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = find(businessServiceData, { businessService: moduleName });
    if(data!== undefined)
    {
    const nextState = find(data.states, { uuid: nextStateUUID });
    if(nextState)
    return nextState.docUploadRequired;
    else
    return false;
    }
    else
    {
      return false;
    }
  };

  getActionIfEditable = (status, businessId, moduleName) => {
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = find(businessServiceData, { businessService: moduleName });    
    const state = find(data.states, { applicationStatus: status });
    let actions = [];
    state.actions &&
      state.actions.forEach(item => {
        actions = [...actions, ...item.roles];
      });
    const userRoles = JSON.parse(getUserInfo()).roles;
    const roleIndex = userRoles.findIndex(item => {
      if (actions.indexOf(item.code) > -1) return true;
    });

    let editAction = {};
    if (state.isStateUpdatable && actions.length > 0 && roleIndex > -1) {
      editAction = {
        buttonLabel: "EDIT",
        moduleName: moduleName,
        tenantId: state.tenantId,
        isLast: true,
        buttonUrl: this.getRedirectUrl("EDIT", businessId, moduleName)
      };
    }
    return editAction;
  };
  getWNSButtonForCitizen = (preparedFinalObject, status, businessId, moduleName) =>{   
   // const btnName = ["Apply for Regular Connection","Reactivate Connection","Connection Conversion","Temporary Disconnection","Permanent Disconnection"]
    const btnName = ["UPDATE_CONNECTION_HOLDER_INFO","APPLY_FOR_REGULAR_INFO","REACTIVATE_CONNECTION","CONNECTION_CONVERSION","TEMPORARY_DISCONNECTION","PERMANENT_DISCONNECTION"];
      let actions  = btnName.map(btn => {
              const buttonObj = {
                buttonLabel: btn,
                moduleName: moduleName,
                tenantId: "ch.chandigarh",
                isLast: true,
                buttonUrl: this.getRedirectUrl("WATERMODIFY", businessId, moduleName)
              }

              return buttonObj;
            });

            //logic based on conditions  preparedFinalObject
            const {WaterConnection} = preparedFinalObject;
            let inWorkflow = false ;
            inWorkflow = WaterConnection && WaterConnection[0].inWorkflow;
            const connectionUsagesType = WaterConnection && WaterConnection[0].connectionUsagesType;
            if(inWorkflow){
              actions = [];
            }
            else if(status === "PENDING_FOR_REGULAR_CONNECTION"){
              actions = actions.filter(item => item.buttonLabel === 'APPLY_FOR_REGULAR_INFO'); 
            }
            else if(status === "TEMPORARY_DISCONNECTED"){
              actions = actions.filter(item => item.buttonLabel === 'REACTIVATE_CONNECTION'); 
            }
            else if (moduleName === "WS_TUBEWELL"){
              actions = actions.filter(item => item.buttonLabel === 'UPDATE_CONNECTION_HOLDER_INFO');
            }
            else if(connectionUsagesType && connectionUsagesType !=="COMMERCIAL"){
              actions = actions.filter(item => item.buttonLabel !== 'REACTIVATE_CONNECTION' && item.buttonLabel !== 'CONNECTION_CONVERSION'&& item.buttonLabel !== 'APPLY_FOR_REGULAR_INFO'); 
            } 
            else{
              actions = actions.filter(item => item.buttonLabel !== 'REACTIVATE_CONNECTION' && item.buttonLabel !== 'APPLY_FOR_REGULAR_INFO'); 
            }

    return actions;
}
  prepareWorkflowContract = (data, moduleName) => {
    const {
      getRedirectUrl,
      getHeaderName,
      checkIfTerminatedState,
      getActionIfEditable,
      checkIfDocumentRequired,
      getEmployeeRoles,
      getWNSButtonForCitizen
    } = this;
    const {preparedFinalObject , prepareFinalObject} = this.props;
    let businessService = moduleName === data[0].businessService ? moduleName : data[0].businessService;
    //let businessService =  data[0].businessService ?  data[0].businessService:moduleName
    let businessId = get(data[data.length - 1], "businessId");
    let filteredActions = [];

    filteredActions = get(data[data.length - 1], "nextActions", []).filter(
      item => item.action != "ADHOC"
    );
    let applicationStatus = get(
      data[data.length - 1],
      "state.applicationStatus"
    );
    let actions = orderBy(filteredActions, ["action"], ["desc"]);

    actions = actions.map(item => {
      return {
        buttonLabel: item.action,
        moduleName: data[data.length - 1].businessService,
        isLast: item.action === "PAY"||  item.action ===  "PAY_FOR_TEMPORARY_CONNECTION"||item.action === "PAY_FOR_REGULAR_CONNECTION" ? true : false,
        buttonUrl: getRedirectUrl(item.action, businessId, businessService),
        dialogHeader: getHeaderName(item.action),
         showEmployeeList: (
                              //businessService === "SW_SEWERAGE" 
        //                   || businessService === "REGULARWSCONNECTION" 
        //                   || businessService === "TEMPORARY_WSCONNECTION" 
        //                   || businessService === "TEMPORARY_WSCONNECTION_BILLING"
        //                   || businessService === "WS_TEMP_TEMP" 
        //                   || businessService === "WS_TEMP_REGULAR" 
        //                   || businessService === "WS_DISCONNECTION" 
        //                   || businessService === "WS_TEMP_DISCONNECTION" 
        //                   ||businessService === "WS_RENAME" 
        //                   || businessService === 'WS_METER_UPDATE'
        //                   || businessService === "WS_CONVERSION" 
        //                   || businessService === "WS_REACTIVATE" 
        //                   || businessService === "WS_TUBEWELL"
                          this.GetBusinessServiceConfig(businessService)) 
                          ? !checkIfTerminatedState(item.nextState, businessService) 
                          && item.action !== "SEND_BACK_TO_CITIZEN" 
                          && item.action !== "RESUBMIT_APPLICATION" 
                          && item.action !== "SUBMIT_APPLICATION" 
                          && item.action !== "SUBMIT_ROADCUT_NOC" 
                          && item.action !== "SEND_BACK_TO_CITIZEN_FOR_ROADCUT_NOC"
                          && item.action !== "VERIFY_AND_FORWARD_TO_CITIZEN_FOR_NOC"
                          && item.action !== "VERIFY_AND_FORWARD_FOR_PAYMENT"// VERIFY_AND_FORWARD_FOR_PAYMENT
                          : !checkIfTerminatedState(item.nextState, businessService) && item.action !== "SENDBACKTOCITIZEN",
                          // new action added SUBMIT_ROADCUT_NOC,SEND_BACK_TO_CITIZEN_FOR_ROADCUT_NOC
        roles: getEmployeeRoles(item.nextState, item.currentState, businessService),
        isDocRequired: checkIfDocumentRequired(item.nextState, businessService)
      };
    });
    actions = actions.filter(item => item.buttonLabel !== 'INITIATE');
    // filter action for tempt-regular and PENDING_FOR_SDE_APPROVAL
    if((businessService=='WS_TEMP_REGULAR') && applicationStatus ==='PENDING_FOR_SDE_APPROVAL')
    {
      const {WaterConnection} = preparedFinalObject;
      let securityCharge = 0 ;
      let additionalCharges = 0
      let constructionCharges = 0
      securityCharge = WaterConnection && WaterConnection[0].waterApplication.securityCharge;
      additionalCharges = WaterConnection && WaterConnection[0].waterApplication.additionalCharges;
      constructionCharges = WaterConnection && WaterConnection[0].waterApplication.constructionCharges;
      securityCharge = securityCharge === null?0:securityCharge
      additionalCharges = additionalCharges === null?0:additionalCharges
      constructionCharges = constructionCharges === null?0:constructionCharges
      if(additionalCharges !== null && additionalCharges !== NaN)
      {
        additionalCharges = parseInt(additionalCharges);
      }
      if(constructionCharges !== null && constructionCharges !== NaN)
      {
        constructionCharges = parseInt(constructionCharges);
      }
      securityCharge = parseInt(securityCharge) + additionalCharges + constructionCharges;
      if(securityCharge ===0 || securityCharge === NaN || Number.isNaN(securityCharge) )
      {
        //FORWARD_TO_JE_TARIFF_CHANGE
        actions = actions.filter(item => item.buttonLabel !== 'VERIFY_AND_FORWARD_FOR_PAYMENT');

      }
      else{
        //FORWARD_TO_JE_TARIFF_CHANGE
        actions = actions.filter(item => item.buttonLabel !== 'VERIFY_AND_FORWARD_TO_JE');

      }

    }
    if((businessService=='WS_METER_UPDATE' || businessService ==='UPDATE_METER_INFO') && applicationStatus ==='PENDING_FOR_DOCUMENT_VERIFICATION')
    {
      actions = actions.filter(item => item.buttonLabel !== 'INITIATE_SITE_INSPECTION');
      actions = actions.filter(item => item.buttonLabel !== 'VERIFY_AND_FORWARD_TO_SDE_ROADS');
    }
    if((businessService=='WS_METER_UPDATE') && applicationStatus ==='PENDING_FOR_SDE_APPROVAL')
    {
      const {WaterConnection} = preparedFinalObject;
      let pipeSize = 0 ;
      //applicationStatus: "PENDING_FOR_SDE_APPROVAL"
      pipeSize = WaterConnection && WaterConnection[0].proposedPipeSize;     
      if(  pipeSize === 'Private Meter'){
        //FORWARD_TO_JE_TARIFF_CHANGE
        actions = actions.filter(item => item.buttonLabel !== 'VERIFY_AND_FORWARD_FOR_PAYMENT');

      }
      else{
        //VERIFY_AND_FORWARD_FOR_PAYMENT,VERIFY_AND_FORWARD_TO_JE
        actions = actions.filter(item => item.buttonLabel !== 'VERIFY_AND_FORWARD_TO_JE');
      }

      
    }
     // filter action for Flat Rate to metered connection for tariff change workflow
  if((businessService ==='CONNECTION_CONVERSION' || businessService ==='WS_CONVERSION'))// only for meter update
  {
    const {WaterConnection} = preparedFinalObject;
      let usageCategory = 0 ;
      let proposedUsageCategory = 0      
     // payload.waterProperty.usageCategory = payload.proposedUsageCategory
      usageCategory = WaterConnection && WaterConnection[0].waterProperty.usageCategory;
      proposedUsageCategory = WaterConnection && WaterConnection[0].proposedUsageCategory;
    let IsvalidateFlatRateConversion = this.IsFlatrateconnection(usageCategory,proposedUsageCategory,preparedFinalObject)
    //actions = actions.filter(item => item.buttonLabel !== 'INITIATE_SITE_INSPECTION'
                                   // || item.buttonLabel !== 'SEND_BACK_TO_CITIZEN_FOR_ROADCUT_NOC');
    actions = actions.filter(item => item.buttonLabel !== 'INITIATE_SITE_INSPECTION');
    actions = actions.filter(item => item.buttonLabel !== 'SEND_BACK_TO_CITIZEN_FOR_ROADCUT_NOC');

    if(applicationStatus ==='PENDING_FOR_DOCUMENT_VERIFICATION' && IsvalidateFlatRateConversion === true)
    {
      actions = actions.filter(item => item.buttonLabel !== 'VERIFY_AND_FORWARD_TO_SUPERINTENDENT');

    }
    else if(applicationStatus ==='PENDING_FOR_DOCUMENT_VERIFICATION' && IsvalidateFlatRateConversion === false)
    {
      actions = actions.filter(item => item.buttonLabel !== 'VERIFY_AND_FORWARD_TO_SDE_FLAT_RATE');

    }
    // //PENDING_FOR_SDE_APPROVAL
    // if(applicationStatus ==='PENDING_FOR_SDE_APPROVAL' && IsvalidateFlatRateConversion === true)
    // {
    //   actions = actions.filter(item => item.buttonLabel !== 'SEND_BACK_TO_JE');

    // }
    // else if(applicationStatus ==='PENDING_FOR_SDE_APPROVAL' && IsvalidateFlatRateConversion === false)
    // {
    //   actions = actions.filter(item => item.buttonLabel !== 'VERIFY_AND_FORWARD_TO_DIV_SUPERITENDENT');

    // }
   if(applicationStatus ==='PENDING_FOR_SDE_APPROVAL_AFTER_DIV_SUPERITENDENT'  && IsvalidateFlatRateConversion === true)
    {
      actions = actions.filter(item => item.buttonLabel !== 'VERIFY_AND_FORWARD_TO_SUPERINTENDENT');

    }
    else if(applicationStatus ==='PENDING_FOR_SDE_APPROVAL_AFTER_DIV_SUPERITENDENT' && IsvalidateFlatRateConversion === false)
    {
      actions = actions.filter(item => item.buttonLabel !== 'VERIFY_AND_FORWARD_TO_SDE_FLAT_RATE');

    }
  }
    if((businessService=='WS_CONVERSION') && (applicationStatus ==='PENDING_FOR_SDC_APPROVAL' || applicationStatus ==='PENDING_FOR_SDE_APPROVAL_AFTER_EE') )
    {
      const {WaterConnection} = preparedFinalObject;
      let securityCharge = 0 ;
      let additionalCharges = 0
      let constructionCharges = 0
      securityCharge = WaterConnection && WaterConnection[0].waterApplication.securityCharge;
      additionalCharges = WaterConnection && WaterConnection[0].waterApplication.additionalCharges;
      constructionCharges = WaterConnection && WaterConnection[0].waterApplication.constructionCharges;
      securityCharge = securityCharge === null?0:securityCharge
      additionalCharges = additionalCharges === null?0:additionalCharges
      constructionCharges = constructionCharges === null?0:constructionCharges
      let usageCategory = 0 ;
      let proposedUsageCategory = 0      
     // payload.waterProperty.usageCategory = payload.proposedUsageCategory
      usageCategory = WaterConnection && WaterConnection[0].waterProperty.usageCategory;
      proposedUsageCategory = WaterConnection && WaterConnection[0].proposedUsageCategory;
    let IsvalidateFlatRateConversion = this.IsFlatrateconnection(usageCategory,proposedUsageCategory,preparedFinalObject)
      if(additionalCharges !== null && additionalCharges !== NaN)
      {
        additionalCharges = parseInt(additionalCharges);
      }
      if(constructionCharges !== null && constructionCharges !== NaN)
      {
        constructionCharges = parseInt(constructionCharges);
      }
      securityCharge = parseInt(securityCharge) + additionalCharges + constructionCharges;
      if(securityCharge ===0 || securityCharge === NaN || Number.isNaN(securityCharge))
      {
        //FORWARD_TO_JE_TARIFF_CHANGE
        actions = actions.filter(item => item.buttonLabel !== 'VERIFY_AND_FORWARD_FOR_PAYMENT');//VERIFY_AND_FORWARD_FOR_PAYMENT

      }
      else{
        //FORWARD_TO_JE_TARIFF_CHANGE
        actions = actions.filter(item => item.buttonLabel !== 'VERIFY_AND_FORWARD_TO_SUPERINTENDENT_FOR_APPROVAL');//FORWARD_TO_JE_TARIFF_CHANGE  

      }
      if(IsvalidateFlatRateConversion)
      {
        actions = actions.filter(item => item.buttonLabel !== 'SEND_BACK_TO_SUPERITENDENT_DIVISION');//FORWARD_TO_JE_TARIFF_CHANGE  

      }
      else{
        actions = actions.filter(item => item.buttonLabel !== 'SEND_BACK_TO_JE_FLAT_RATE');//FORWARD_TO_JE_TARIFF_CHANGE  

      }

    }
    //PENDING_FOR_SDC_APPROVAL and WS_CONVERSION
    //workflow change for water connection 
    if((businessService=='NewWS1' 
      || businessService === "REGULARWSCONNECTION"  // 15 status ''
        // || businessService === 'SW_SEWERAGE' 
        // || businessService === "TEMPORARY_WSCONNECTION"
        // || businessService === "WS_TEMP_TEMP" 
        // || businessService === "WS_TEMP_REGULAR"
        // || businessService === "WS_DISCONNECTION" 
        // || businessService === "WS_TEMP_DISCONNECTION"
        // || businessService === "WS_RENAME" 
        // || businessService === "WS_CONVERSION" 
        // || businessService === "WS_REACTIVATE"     
        // || businessService === "WS_TUBEWELL"
        //||applicationStatus == 'PENDING_FOR_SDE_APPROVAL_FOR_CITIZEN_'
    ) && (applicationStatus == 'PENDING_FOR_SDE_APPROVAL' ) ){
      const {WaterConnection} = preparedFinalObject;
      let pipeSize = 0 ;
      //applicationStatus: "PENDING_FOR_SDE_APPROVAL"
      pipeSize = WaterConnection && WaterConnection[0].proposedPipeSize;
      pipeSize = parseInt(pipeSize);
      if(  pipeSize === 15){
       // actions = actions.filter(item => item.buttonLabel !== 'FORWARD');
       if(applicationStatus ==='PENDING_FOR_SDE_APPROVAL')
       actions = actions.filter(item => item.buttonLabel !== 'FORWARD_TO_HDM');
      //  else
      //  actions = actions.filter(item => item.buttonLabel !== 'FORWARD');
      }
      else{
        actions = actions.filter(item => item.buttonLabel !== 'VERIFY_AND_FORWARD_FOR_PAYMENT');
        actions = actions.filter(item => item.buttonLabel !== 'SEND_BACK_TO_CITIZEN_FOR_ROADCUT_NOC');

      }
      
    }
    if(( businessService === "REGULARWSCONNECTION"  
        
    ) && applicationStatus == 'PENDING_FOR_EE_APPROVAL'){
      const {WaterConnection} = preparedFinalObject;
      let pipeSize = 0 ;
      //applicationStatus: "PENDING_FOR_SDE_APPROVAL"
      pipeSize = WaterConnection && WaterConnection[0].proposedPipeSize;
      pipeSize = parseInt(pipeSize);
       if (pipeSize >= 20 && pipeSize <= 40)
      {
        // required to modify the connection
        actions = actions.filter(item => item.buttonLabel !== 'VERIFY_AND_FORWARD_TO_SE');

      }
      else{
        // "VERIFY_AND_FORWARD_TO_SDE
        actions = actions.filter(item => item.buttonLabel !== 'VERIFY_AND_FORWARD_TO_SDE');
        
      }
    }

    if(( businessService === "TEMPORARY_WSCONNECTION"  
        
    ) && applicationStatus == 'PENDING_FOR_SDE_APPROVAL_AFTER_SUPERINTENDENT'){
      const {WaterConnection} = preparedFinalObject;
      let pipeSize = 0 ;
      //applicationStatus: "PENDING_FOR_SDE_APPROVAL"
      pipeSize = WaterConnection && WaterConnection[0].proposedPipeSize;
      pipeSize = parseInt(pipeSize);
       if (pipeSize ===15)
      {
        // required to modify the connection 
        actions = actions.filter(item => item.buttonLabel !== 'VERIFY_AND_FORWARD_FOR_SE_REVIEW');//PENDING_FOR_SE_REVIEW

      }
      else{
        // "VERIFY_AND_FORWARD_TO_SDE
        actions = actions.filter(item => item.buttonLabel !== 'VERIFY_AND_FORWARD_TO_JE');
        
      }
    }
    //end pipe size filter
    // VERIFY_AND_FORWARD_TO_JE_FOR_FEE VERIFY_AND_FORWARD_TO_SE, PENDING_FOR_SDE_APPROVAL_FOR_JE TEMPORARY_WSCONNECTION
    if((businessService === "TEMPORARY_WSCONNECTION_BILLING" || businessService ===  "TEMPORARY_WSCONNECTION" ) && (applicationStatus == 'PENDING_FOR_SDE_APPROVAL_FOR_JE' || applicationStatus ==='PENDING_FOR_EE_APPROVAL' ) )
    {
      const {WaterConnection} = preparedFinalObject;
      let pipeSize = 0 ;
      
      pipeSize = WaterConnection && WaterConnection[0].proposedPipeSize;
      pipeSize = parseInt(pipeSize);
       if (pipeSize <= 15)
      {
        actions = actions.filter(item => item.buttonLabel !== 'VERIFY_AND_FORWARD_TO_SE');//"VERIFY_AND_FORWARD_TO_SDE"

      }
      else{
        actions = actions.filter(item => item.buttonLabel !== "VERIFY_AND_FORWARD_TO_SDE");//"VERIFY_AND_FORWARD_TO_SE"
      }

    }
    if(businessService === "TEMPORARY_WSCONNECTION"  && applicationStatus == 'PENDING_FOR_SDE_APPROVAL_FOR_JE' )
    {
      const {WaterConnection} = preparedFinalObject;
      let pipeSize = 0 ;
      
      pipeSize = WaterConnection && WaterConnection[0].proposedPipeSize;
      pipeSize = parseInt(pipeSize);
       if (pipeSize <= 15)
      {
        actions = actions.filter(item => item.buttonLabel !== 'VERIFY_AND_FORWARD_TO_SE');

      }
      else{
        actions = actions.filter(item => item.buttonLabel !== 'VERIFY_AND_FORWARD_TO_JE_FOR_FEE');
      }

    }
    // if((businessService=='NewWS1' 
    //   || businessService === "REGULARWSCONNECTION"  
    //     || businessService === 'SW_SEWERAGE' 
    //     || businessService === "TEMPORARY_WSCONNECTION"
    //     || businessService === "TEMPORARY_WSCONNECTION_BILLING"
    //     || businessService === "WS_TEMP_TEMP" 
    //     ||businessService === "WS_TEMP_REGULAR"
    //     ||businessService === "WS_DISCONNECTION" 
    //     ||businessService === "WS_TEMP_DISCONNECTION"
    //     || businessService === "WS_RENAME"
    //     || businessService === "WS_METER_UPDATE" 
    //     || businessService === "WS_CONVERSION" 
    //     || businessService === "WS_REACTIVATE"     
    // || businessService === "WS_TUBEWELL") 
    // && applicationStatus == 'PENDING_FOR_PAYMENT')    
    if((this.GetBusinessServiceConfig(businessService) && applicationStatus == 'PENDING_FOR_PAYMENT'))
    {
      const {WaterConnection} = preparedFinalObject;
      let connectionType = "" ;
      connectionType = WaterConnection && WaterConnection[0].waterApplicationType;
      if(  connectionType == 'REGULAR'){
        actions = actions.filter(item => item.buttonLabel !== 'PAY_FOR_TEMPORARY_CONNECTION'); 
      }
      else{
        actions = actions.filter(item => item.buttonLabel !== 'PAY_FOR_REGULAR_CONNECTION');
      }
    }
    // if((businessService=='NewWS1' 
    //     || businessService === "REGULARWSCONNECTION"  
    //     || businessService === 'SW_SEWERAGE' 
    //     || businessService === "TEMPORARY_WSCONNECTION_BILLING"
    //     || businessService === "TEMPORARY_WSCONNECTION"
    //     || businessService === "WS_TEMP_TEMP" 
    //     || businessService === "WS_TEMP_REGULAR"
    //     || businessService === "WS_DISCONNECTION" 
    //     || businessService === "WS_TEMP_DISCONNECTION"
    //     || businessService === "WS_RENAME" 
    //     || businessService ==='WS_METER_UPDATE'
    //     || businessService === "WS_CONVERSION" 
    //     || businessService === "WS_REACTIVATE"     
    //     || businessService === "WS_TUBEWELL")
    // && applicationStatus == 'PENDING_FOR_TEMPORARY_TO_REGULAR_CONNECTION_APPROVAL')
    if((this.GetBusinessServiceConfig(businessService) && applicationStatus == 'PENDING_FOR_TEMPORARY_TO_REGULAR_CONNECTION_APPROVAL'))
    {
      //    actions.forEach(item => {
      //     if(item.buttonLabel === 'APPROVE_FOR_CONNECTION_CONVERSION')
      //     // prepareFinalObject("WaterConnection[0].waterApplicationType","REGULAR")
      // });
    }
    if(businessService=='WS_DISCONNECTION' && applicationStatus == 'PENDING_FOR_SUPERINTENTENT_APPROVAL'){
      const {WaterConnection} = preparedFinalObject;;
      const  activityType = WaterConnection && WaterConnection[0].activityType;

      // if(activityType ==="TEMPORARY_DISCONNECTION"){
      //   actions = actions.filter(item => item.buttonLabel !== 'APPROVE_AND_STOP_BILLING');
      // }
      // else if(activityType ==="PERMANENT_DISCONNECTION"){
      //   actions = actions.filter(item => item.buttonLabel !== 'APPROVE_AND_TEMP_STOP_BILLING');
      // }
    }

    // if(businessService === "NewWS1" 
    //     || businessService === "REGULARWSCONNECTION"  
    //     || businessService === 'SW_SEWERAGE' 
    //     || businessService === "TEMPORARY_WSCONNECTION"
    //     || businessService === "TEMPORARY_WSCONNECTION_BILLING"
    //     || businessService === "WS_TEMP_TEMP" 
    //     ||businessService === "WS_TEMP_REGULAR"
    //     ||businessService === "WS_DISCONNECTION" 
    //     ||businessService === "WS_TEMP_DISCONNECTION"
    //     || businessService === "WS_RENAME" 
    //     || businessService === 'WS_METER_UPDATE'
    //     || businessService === "WS_CONVERSION" 
    //     || businessService === "WS_REACTIVATE"  
    //     ||  businessService === "WS_TUBEWELL")
        if(this.GetBusinessServiceConfig(businessService))
    
    {
      const userRoles = JSON.parse(getUserInfo()).roles;
      const roleIndex = userRoles.some(item => item.code ==="CITIZEN" || item.code=== "WS_CEMP" );
      const isButtonPresent =  window.localStorage.getItem("WNS_STATUS") || false;
      if(roleIndex && !isButtonPresent ){
      //   const buttonArray = getWNSButtonForCitizen(preparedFinalObject, applicationStatus, businessId,businessService);
      //  actions = actions.concat(buttonArray);
      }
        
    }
    let editAction = getActionIfEditable(
      applicationStatus,
      businessId,
      businessService
    );
    editAction.buttonLabel && actions.push(editAction);
    return actions;
  };



  convertOwnerDobToEpoch = owners => {
    let updatedOwners =
      owners &&
      owners
        .map(owner => {
          return {
            ...owner,
            dob:
              owner && owner !== null && convertDateToEpoch(owner.dob, "dayend")
          };
        })
        .filter(item => item && item !== null);
    return updatedOwners;
  };

  render() {
    const {
      ProcessInstances,
      prepareFinalObject,
      preparedFinalObject,
      dataPath,
      moduleName
    } = this.props;
    const workflowContract =
      ProcessInstances &&
      ProcessInstances.length > 0 &&
      this.prepareWorkflowContract(ProcessInstances, moduleName);
     let showFooter;
    //  if (moduleName === "NewWS1" 
    //     || moduleName === "REGULARWSCONNECTION" 
    //     || moduleName === "SW_SEWERAGE"
    //     || moduleName === "TEMPORARY_WSCONNECTION"
    //     || moduleName === "TEMPORARY_WSCONNECTION_BILLING"
    //     || moduleName === "WS_TEMP_TEMP" 
    //     ||moduleName === "WS_TEMP_REGULAR"
    //     ||moduleName === "WS_DISCONNECTION" 
    //     ||moduleName === "WS_TEMP_DISCONNECTION"
    //     || moduleName === "WS_RENAME" 
    //     || moduleName === 'WS_METER_UPDATE'
    //     || moduleName === "WS_CONVERSION" 
    //     || moduleName === "WS_REACTIVATE"
    //     || moduleName === "WS_TUBEWELL") 
        if(this.GetBusinessServiceConfig(moduleName))
     {
         showFooter=true;
         // check valid role
        //  const userRoles = JSON.parse(getUserInfo()).roles;
        //  let role =''
         if (ProcessInstances && ProcessInstances[0])
         {
           
         }
         const {WaterConnection} = preparedFinalObject;
         if(ProcessInstances && ProcessInstances.length > 0)
         {
          //[ProcessInstances.length-1].additionalDetails.role
          if(ProcessInstances[ProcessInstances.length-1].additionalDetails!== undefined)
          {
            let role = ProcessInstances[ProcessInstances.length-1].additionalDetails.role
           let userInfo = JSON.parse(getUserInfo());
           const roles = get(userInfo, "roles");
           const roleCodes = roles ? roles.map(role => role.code) : [];
           if (roleCodes.indexOf(role) > -1) {
            showFooter = true;
           } else
           {
            showFooter = false;
           } 

          }
           
         }
        
      } else if(moduleName==='ROADCUTNOC'||moduleName==='PETNOC'||moduleName==='ADVERTISEMENTNOC'||moduleName==='SELLMEATNOC'){
        showFooter=false;
     }      else{
         showFooter=process.env.REACT_APP_NAME === "Citizen" ? false : true;
      }
    return (
      <div>
        {ProcessInstances && ProcessInstances.length > 0 && (
          <TaskStatusContainer ProcessInstances={ProcessInstances} moduleName={moduleName}/>
        )}
        {showFooter &&
          <Footer
            handleFieldChange={prepareFinalObject}
            variant={"contained"}
            color={"primary"}
            onDialogButtonClick={this.createWorkFLow}
            contractData={workflowContract}
            dataPath={dataPath}
            moduleName={moduleName}
          />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  const { workflow } = preparedFinalObject;
  const { ProcessInstances } = workflow || [];
  return { ProcessInstances, preparedFinalObject };
};

const mapDispacthToProps = dispatch => {
  return {
    prepareFinalObject: (path, value) =>
      dispatch(prepareFinalObject(path, value)),
    toggleSnackbar: (open, message, variant) =>
      dispatch(toggleSnackbar(open, message, variant)),
    setRoute: route => dispatch(setRoute(route))
  };
};

export default connect(
  mapStateToProps,
  mapDispacthToProps
)(WorkFlowContainer);

import { getCommonCard, getCommonContainer, getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getFileUrlFromAPI, getQueryArg, setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
import { getTenantId, getUserInfo, setapplicationNumber, setapplicationType, setCurrentAssignee, setHCRoles, setServiceRequestStatus, setSLADays } from "egov-ui-kit/utils/localStorageUtils";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import "../../../../customstyle.css";
import { httpRequest } from "../../../../ui-utils";
import { getCurrentAssigneeUserNameAndRole, getSearchResultsView, commonConfig } from "../../../../ui-utils/commons";
import { downloadPrintContainer } from "./applyResourceSearchPreview/footer";
import { documentsSummary } from "./myRequestSearchPreview/documentsSummary";
import { ownerDetails } from "./myRequestSearchPreview/ownerDetails";
import { requestDetails } from "./myRequestSearchPreview/requestDetails";
// import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";

let role_name = JSON.parse(getUserInfo()).roles[0].code

const titlebar = getCommonContainer({
  header: getCommonHeader({
    labelName: "Service Request Details",
    labelKey: "HC_SERVICE_REQUEST_DETAILS_HEADER"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-hc",
    componentPath: "ServiceRequestId",
  },
  SLA: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-hc",
    componentPath: "SLADays",
  },
  
  CurrentAssignee: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-hc",
    componentPath: "CurrentAssignee",
  },

 
});

const getProcessInstanceDataForServiceRequest = async (applicationNumber, state, dispatch)=>  {

  var tenantIdCommonConfig
  
    if (getTenantId() != commonConfig.tenantId){
        tenantIdCommonConfig = JSON.parse(getUserInfo()).permanentCity
    }
    else{
      tenantIdCommonConfig = getTenantId()
    }
  const queryObj = [
    {
      key: "businessIds",
      value: applicationNumber
    },
    {
      key: "tenantId",
      value: tenantIdCommonConfig
    },
    {
      key: "history",
      value: true
    },
  ];
  var payload = await httpRequest(
    "post",
    "/egov-workflow-v2/egov-wf/process/_search",
    "",
    queryObj
  );
    //sorting process instance data by time
  var SortedProcessInstanceBylastModifiedTimeOfEachObject = []
  
  SortedProcessInstanceBylastModifiedTimeOfEachObject=
    payload &&
    payload.ProcessInstances.sort(function(a, b) {
      var valueA, valueB;        

      valueA = a.auditDetails.lastModifiedTime; 
      valueB = b.auditDetails.lastModifiedTime;
      if (valueA < valueB) {
          return -1;
      }
      else if (valueA > valueB) {
          return 1;
      }
      return 0;
  })
  SortedProcessInstanceBylastModifiedTimeOfEachObject = SortedProcessInstanceBylastModifiedTimeOfEachObject.reverse()
  dispatch(prepareFinalObject("workflowHC", SortedProcessInstanceBylastModifiedTimeOfEachObject));
//  return SortedProcessInstanceBylastModifiedTimeOfEachObject
}

const prepareDocumentsView = async (state, dispatch) => {
  
  let documentsPreview = [];
  
  let document_list = []

  let hcdocuments = get(
    state,
    "screenConfiguration.preparedFinalObject.workflowHC",
    []
    );
  
    
  let hcUploadedDocs = get(
  state,
  "screenConfiguration.preparedFinalObject.myRequestDetails.service_request_document",
  {}
  );

      var myObj = JSON.parse(hcUploadedDocs);

      hcUploadedDocs = myObj['document'];

     let uuid = JSON.parse(getUserInfo()).uuid
  if (hcUploadedDocs.length > 0) {
    
    
   let cnt  = 0
   let createdby=0
   let hcdocuments_temp = []
   if(hcdocuments)
   {
     for (let index = 0; index < hcdocuments.length; index++) {
       const element = hcdocuments[index];
       if(element.action !=='INITIATE')
       {
         if( element.documents!= null &&  element.documents.length>0)
         {
          for (let index = 0; index < element.documents.length; index++) {
            const element_ = element.documents[index];
            hcdocuments_temp.push(
              {
                media:element_.fileStoreId
              }
            )           
          }
         }

       }      
       
     }
    // let x = hcdocuments[0].documents.filter(x=>x.fileStoreId === element.media)    
   }
   hcUploadedDocs.forEach(element => {

    let  IsDelete = false;

   let x = hcdocuments_temp.filter(x=>x.media ===element.media)
   if(x.length>0)
   {
    IsDelete = true 
   }
   else
   {
    IsDelete = false
   }
  
   documentsPreview.push({
   // title: "ID Proof",
    title: "Uploaded Document "+cnt,
    fileStoreId: element.media,
    linkText: "DOWNLOAD",
    IsDelete:IsDelete,
    
    })
    cnt = cnt +1;
  //    if (hcdocuments[0].action !=='INITIATE')
  //   {
      

  //    // if(element.media === )
  //   documentsPreview.push({
  //   title: "ID Proof",
  //   fileStoreId: element.media,
  //   linkText: "DOWNLOAD",
  //   IsDelete:IsDelete,
    
  //   })
  //   cnt = cnt +1;
  // }
  //   else{
  //     documentsPreview.push({
  //     title: "Uploaded Document "+cnt,
  //     fileStoreId: element.media,
  //     linkText: "DOWNLOAD",
  //     IsDelete: false,
  //     })
  //     cnt = cnt +1;
  //   }
    }
    )
  
    }


       let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
      
      let fileUrls =
        fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};
      documentsPreview = documentsPreview.map(function (doc, index) {
  
        doc["link"] = fileUrls && fileUrls[doc.fileStoreId] && fileUrls[doc.fileStoreId].split(",")[0] || "";
        
        doc["name"] =
          (fileUrls[doc.fileStoreId] &&
            decodeURIComponent(
              fileUrls[doc.fileStoreId]
                .split(",")[0]
                .split("?")[0]
                .split("/")
                .pop()
                .slice(13)
            )) ||
          `Document - ${index + 1}`;
          document_list.push(doc["name"]);
          
        return doc;
      });
      dispatch(prepareFinalObject("documentsPreview", documentsPreview));
      dispatch(prepareFinalObject("documents_list", document_list));

};

const setSearchResponse = async (state, dispatch, action, serviceRequestId) => {
  //debugger
  const tenantId = getQueryArg(window.location.href, "tenantId");
  const response = await getSearchResultsView([
    { key: "tenantId", value: tenantId },
    { key: "service_request_id", value: serviceRequestId }
  ]);
  var servicetype = response.ResponseBody[0].service_type

  if(servicetype != null && servicetype != undefined && servicetype != ""  )
 { 
  localStorage.setItem("HCBusinessService",servicetype)

    const queryObject = [
    { key: "tenantId", value: tenantId },
    { key: "businessServices", value: servicetype}
  ];
  await setBusinessServiceDataToLocalStorage(queryObject, dispatch);
  const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
  await getProcessInstanceDataForServiceRequest(applicationNumber, state, dispatch)
}

  if(!response.ResponseInfo['ver'] === false)
  {
    // dispatch(setRoute(`/egov-hc/acknowledgementInvalidServiceRequest?serviceRequestId=${serviceRequestId}`));
    dispatch(setRoute(`/egov-hc/acknowledgementInvalidServiceRequest`));
  }
  else{
    if(response.ResponseBody[0].servicerequestsubtype != null && response.ResponseBody[0].servicerequestsubtype != undefined && response.ResponseBody[0].servicerequestsubtype != ""  ){
      var serviceRequestSubtype =  response.ResponseBody[0].servicerequestsubtype
      serviceRequestSubtype = JSON.parse(serviceRequestSubtype)
      response.ResponseBody[0].servicerequestsubtype = serviceRequestSubtype.subservicetype
    }

    var serviceRequestType = []
    var sectorData = []
    
    
    serviceRequestType = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData['eg-horticulture'].ServiceType")
    sectorData = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData['RAINMAKER-PGR'].Sector")
  
    //setting service request type data
    var serviceRequestTypeFromResponse = serviceRequestType.filter(function (state) {
      if (response.ResponseBody[0].service_type === state.code )
      return state 
    });
    var serviceRequestTypeFromResponse = serviceRequestTypeFromResponse.map(element => element.name )
    var serviceRequestTypeNameFromResponse = serviceRequestTypeFromResponse.join(",")
  
    // setting sector data 
    var sectorDataFromResponse = sectorData.filter(function (state) {
      if (response.ResponseBody[0].locality === state.code )
      return state 
    });
    var sectorDataNameFromResponse = sectorDataFromResponse.map(element => element.name )
     sectorDataNameFromResponse = sectorDataNameFromResponse.join(",") 
     response.ResponseBody[0].sectorName = sectorDataNameFromResponse
     response.ResponseBody[0].serviceRequestTypeName = serviceRequestTypeNameFromResponse
  dispatch(prepareFinalObject("myRequestDetails", response.ResponseBody[0], {}));

  prepareDocumentsView(state, dispatch);
  set(state, "screenConfiguration.moduleName", "HC");

  
  try{
  var service_request_status = response.ResponseBody[0].service_request_status
  
  setServiceRequestStatus(service_request_status)
  
  }
  catch(e){
    console.log("Error in setting ServiceRequestStatus ")
  }
  try{  
    // var businessServiceSla = response.ResponseInfo.resMsgId
    // setSLADays(businessServiceSla)
    var businessServiceSla = Number(response.ResponseBody[0].sla)-Number(response.ResponseBody[0].sla_days_elapsed);
    setSLADays(businessServiceSla)
  }
  catch(e){
    console.log("Error in setting businessServiceSla ")
    }
    var CurrentAssignee = response.ResponseBody[0].current_assignee
     var userData = parseInt(CurrentAssignee);
     if(isNaN(userData))
     {
      setCurrentAssignee(CurrentAssignee)
     }
     else {
      const response = await getCurrentAssigneeUserNameAndRole(dispatch, userData);
      // var current_Assignee = response.Employees[0].user.userName
      var current_Assignee = response.Employees[0].user.name
       setCurrentAssignee(current_Assignee)
     }


    const printCont = downloadPrintContainer(
      state,
    );
    process.env.REACT_APP_NAME === "Citizen"
      ? set(
          action,
          "screenConfig.components.div.children.headerDiv.children.helpSection.children",
          printCont
        )
      : set(
          action,
          "screenConfig.components.div.children.headerDiv.children.helpSection.children",
          printCont
        );
    
        //keep this code commented till client's confirmation 
        // const printCont = downloadPrintContainerScreenDownload(
        //   serviceRequestId,
        // );
        // const CitizenprintCont=downloadPrintContainerScreenDownload(
        //   serviceRequestId, 
        // );
        
        
        // process.env.REACT_APP_NAME === "Citizen"
        //   ? set(
        //       action,
        //       "screenConfig.components.div.children.headerDiv.children.helpSection.children",
        //       CitizenprintCont
        //     )
        //   : set(
        //       action,
        //       "screenConfig.components.div.children.headerDiv.children.helpSection.children",
        //       printCont
        //     );
  }
};


const getMdmsData = async (dispatch) => {
  
  let tenantId = getTenantId().split(".")[0];
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants"
            }
          ]
        },
        {
          moduleName: "eg-horticulture",
          masterDetails: [
            {
              name: "ServiceType"
            },
            {
              name: "roles"
            }
          ]
        },
        {
          moduleName: "RAINMAKER-PGR",
          masterDetails: [
            {
              name: "Sector"
            }
          ]
        }
        
      ]
    }
  };
  try{
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",  
      [],
      mdmsBody
    );
    // debugger
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));

    //setting horticulture roles into mdms
    var roleList = []
    roleList = payload &&
    payload.MdmsRes["eg-horticulture"].roles
    setHCRoles(JSON.stringify(roleList))}
    catch(e){
      console.log(e);
    }
  };


const screenConfig = {
  uiFramework: "material-ui",
  name: "search-preview",
  beforeInitScreen: (action, state, dispatch) => {
    // debugger
    getMdmsData(dispatch).then(response => {  
    }) 
    const serviceRequestId = getQueryArg(window.location.href, "applicationNumber");
    
    setapplicationNumber(serviceRequestId);
     setapplicationType("HORTICULTUREWF");

    const tenantId = getTenantId();

    setSearchResponse(state, dispatch, action, serviceRequestId);

   
     
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 12
              },
              ...titlebar
            },
            helpSection: {
              uiFramework: "custom-atoms",
              componentPath: "Container",
              props: {
                color: "primary",
                style: { justifyContent: "flex-end" }
              },
              gridDefination: {
                xs: 12,
                sm: 12,
                align: "right"
              }
            }
          }
          
        },
        
        taskStatus: {
          uiFramework: "custom-containers-local",
          
          componentPath: "WorkFlowContainer",
          // moduleName: process.env.REACT_APP_NAME === "Employee" ? "egov-workflow" : "egov-hc",
          moduleName: "egov-hc",
          props: {
            dataPath: "services",
            moduleName: "HORTICULTURE",
            updateUrl: "/hc-services/serviceRequest/_update"
          }
        },
        body: role_name !== 'CITIZEN' ? getCommonCard({

          requestDetails: requestDetails,
          ownerDetails: ownerDetails,
          documentsSummary: documentsSummary

        })
          : getCommonCard({
            requestDetails: requestDetails,
            ownerDetails: ownerDetails,
            documentsSummary: documentsSummary
            
          }),
      }
    }
  }
};

export default screenConfig;

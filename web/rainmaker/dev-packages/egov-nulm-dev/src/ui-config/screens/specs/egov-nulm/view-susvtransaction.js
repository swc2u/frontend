import {
    getCommonHeader,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import set from "lodash/set";
  import { SUSVTransactionReviewDetails } from "./viewSUSVTransactionResource/transaction-review";
  import { poViewFooter } from "./viewSUSVTransactionResource/footer";
  import { getQueryArg,getFileUrlFromAPI,getFileUrl } from "egov-ui-framework/ui-utils/commons";
  import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
  import { httpRequest } from "../../../../ui-utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getSearchResults } from "../../../../ui-utils/commons";
  let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
  let status = getQueryArg(window.location.href, "status");
  let uuidCode = getQueryArg(window.location.href, "code");
  const applicationNumberContainer = () => {

    if (applicationNumber)
      return {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-nulm",
        componentPath: "ApplicationNoContainer",
        props: {
          number: `${applicationNumber}`,
          visibility: "hidden"
        },
        visible: true
      };
    else return {};
  };
  const statusContainer = () => {
 
  if(status)
      return {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-nulm",
      componentPath: "ApplicationStatusContainer",
      props: {
       status: `${status}`,
        visibility: "hidden"
      },
      visible: true
    };
   else return {};
 };
  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `View SUSV Transaction`,
      labelKey: "NULM_SUSV_TRANSACTION_VIEW"
    }),
    applicationNumber: applicationNumberContainer(),
    status: statusContainer()
  });
  
  const tradeView = SUSVTransactionReviewDetails(false);
  
  const getMdmsData = async (action, state, dispatch, tenantId) => {
    const tenant = tenantId || getTenantId();
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenant,
        moduleDetails: [
          {
            moduleName: "egov-hrms",
            masterDetails: [
              {
                name: "DeactivationReason",
                filter: "[?(@.active == true)]"
              }
            ]
          }
        ]
      }
    };
    try {
      const payload = await httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
      dispatch(prepareFinalObject("viewScreenMdmsData", payload.MdmsRes));
    } catch (e) {
      console.log(e);
    }
  };
  const getFileUrlDetails = async (state,dispatch,tenantId,response)=>{
    //mdms call
  //  getMdmsData(dispatch, tenantId);

   const fileStoreIds = response.ResponseBody[0].supportingDocument[0].filestoreId;


   const fileUrlPayload =  fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));

   if(fileUrlPayload){
   let  documentsUploadRedux ={}
  const documentsPreview = [  {    title: "supportingDocument",
                                    linkText: "VIEW", 
                                    link :  (fileUrlPayload &&
                                                    fileUrlPayload[fileStoreIds] &&
                                                    getFileUrl(fileUrlPayload[fileStoreIds])) ||
                                                    "",
                                     name:   (fileUrlPayload &&
                                                      fileUrlPayload[fileStoreIds] &&
                                                      decodeURIComponent(
                                                        getFileUrl(fileUrlPayload[fileStoreIds])
                                                          .split("?")[0]
                                                          .split("/")
                                                          .pop().slice(13)
                                                      )) ||
                                                    `Document - ${index + 1}` 
                                        }
                                      ];
                                        //for populating in update mode
                                        documentsUploadRedux[0] = {                          
                                          "documents":[
                                          {
                                          "fileName":  (fileUrlPayload &&
                                            fileUrlPayload[fileStoreIds] &&
                                            decodeURIComponent(
                                              getFileUrl(fileUrlPayload[fileStoreIds])
                                                .split("?")[0]
                                                .split("/")
                                                .pop().slice(13)
                                            )) ||
                                          `Document - 1`,
                                          "fileStoreId": fileStoreIds,
                                          "fileUrl": fileUrlPayload[fileStoreIds]
                                         }
                                        ]
                                       }
                                  
          documentsPreview && dispatch(prepareFinalObject("documentsPreview", documentsPreview));
         documentsPreview &&  dispatch(prepareFinalObject("documentsUploadRedux", documentsUploadRedux));
         }
                       
   
  }

  const getSMIDDetails = async(state, dispatch) =>{
    
    const tenantId = process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;
  
    let NulmTransactionRequest = {};
    NulmTransactionRequest.tenantId = tenantId;
    NulmTransactionRequest.uuid= uuidCode;
    const requestBody = {NulmTransactionRequest}
    let response = await getSearchResults([],requestBody, dispatch,"susvtransaction");
  
    if(response){ 
      getFileUrlDetails(state,dispatch,tenantId,response);
      dispatch(prepareFinalObject("NulmTransactionRequest", response.ResponseBody[0]));
    }
  }
  const roleBasedValidationForFooter = () => {
    if(process.env.REACT_APP_NAME === "Employee"){
        return poViewFooter();
    }
    else{
          return poViewFooter();
    }
   
  }
  
  const screenConfig = {
    uiFramework: "material-ui",
    name: "view-susvtransaction",
    beforeInitScreen: (action, state, dispatch) => {
      getSMIDDetails(state, dispatch);
      set(
        action.screenConfig,
        "components.div.children.headerDiv.children.header.children.applicationNumber.props.number",
        applicationNumber
      );
      set(
        action.screenConfig,
        "components.div.children.headerDiv.children.header.children.status.props.status",
        status
      );
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
                  sm: 10
                },
                ...header
              }
            }
          },
          tradeView,
          footer:  roleBasedValidationForFooter(),
        }
      },
    }
  };
  
  export default screenConfig;
  
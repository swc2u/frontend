import {
  getCommonHeader,
  getCommonContainer,
  getLabel,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import set from "lodash/set";
import get from "lodash/set";
import { SEPReviewDetails } from "./viewSVRUResource/sep-review";
import { poViewFooter } from "./viewSVRUResource/footer";
import { getQueryArg,getFileUrlFromAPI,getFileUrl } from "egov-ui-framework/ui-utils/commons";
import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { downloadAcknowledgementForm} from '../utils';
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getSearchResults ,SANCTION_BY_BANK,REJECTED_BY_TASK_FORCE_COMMITTEE } from "../../../../ui-utils/commons";
let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
let status = getQueryArg(window.location.href, "status");

const createSEPHandle = async (state, dispatch) => {
  dispatch(setRoute(`/egov-nulm/create-svru`));
};

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
    labelName: `View Street Vendor Registration Update`,
    labelKey: "NULM_SVRU_VIEW"
  }),
  applicationNumber: applicationNumberContainer(),
  status: statusContainer()
});

const tradeView = SEPReviewDetails(false);

const getMdmsData = async (dispatch, tenantId) => {
  const tenant = "ch"
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenant,
      moduleDetails: [
        {
          moduleName: "NULM",
          masterDetails: [
            {
              name: "SUSVRDocuments",
            }
          ]
        },
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
  getMdmsData(dispatch, tenantId);

  if(response.ResponseBody[0] && response.ResponseBody[0].applicationDocument !== null){
    const fileStoreIds = response.ResponseBody[0] ? response.ResponseBody[0].applicationDocument.map(docInfo => docInfo.filestoreId).join() : [];
    const fileUrlPayload =  fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
    let  documentsUploadRedux ={}
    const documentsPreview = response.ResponseBody[0] ? response.ResponseBody[0].applicationDocument 
                          && response.ResponseBody[0].applicationDocument.map((docInfo,index) => {
                            let docObj =  {
                                          title: docInfo.documentType,
                                          linkText: "VIEW", 
                                          link :  (fileUrlPayload &&
                                                    fileUrlPayload[docInfo.filestoreId] &&
                                                    getFileUrl(fileUrlPayload[docInfo.filestoreId])) ||
                                                    "",
                                          name:   (fileUrlPayload &&
                                                      fileUrlPayload[docInfo.filestoreId] &&
                                                      decodeURIComponent(
                                                        getFileUrl(fileUrlPayload[docInfo.filestoreId])
                                                          .split("?")[0]
                                                          .split("/")
                                                          .pop().slice(13)
                                                      )) ||
                                                    `Document - ${index + 1}` 
                                        }

                                        //for populating in update mode
                                        const {viewScreenMdmsData} = state.screenConfiguration.preparedFinalObject;
                                        if(viewScreenMdmsData && viewScreenMdmsData.NULM && viewScreenMdmsData.NULM.SEPDocuments){

                                          const {SEPDocuments} = viewScreenMdmsData.NULM;
                                          const documentsDes = ["Photo Copy of Certificate of Vending","Photo Copy of Govt. ID Proof","Proof of Current Residential Address","NOC From Other Dependent Family Member"]
                                          const indexOfDoc = documentsDes.findIndex(doc =>  doc === docInfo.documentType )

                                            documentsUploadRedux[indexOfDoc] = {                          
                                            "documents":[
                                            {
                                            "fileName":  (fileUrlPayload &&
                                              fileUrlPayload[docInfo.filestoreId] &&
                                              decodeURIComponent(
                                                getFileUrl(fileUrlPayload[docInfo.filestoreId])
                                                  .split("?")[0]
                                                  .split("/")
                                                  .pop().slice(13)
                                              )) ||
                                            `Document - ${index + 1}`,
                                            "fileStoreId": docInfo.filestoreId,
                                            "fileUrl": fileUrlPayload[docInfo.filestoreId]
                                          }
                                          ]
                                        }
                                        }

                              return docObj;
                          }) : []
    
    documentsPreview && dispatch(prepareFinalObject("documentsPreview", documentsPreview));
    documentsPreview &&  dispatch(prepareFinalObject("documentsUploadRedux", documentsUploadRedux));
  
  } 
}

const getSEPDetails = async(state, dispatch) =>{
  
const tenantId = process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;

let NulmSusvRenewRequest = {};
NulmSusvRenewRequest.tenantId = tenantId;
NulmSusvRenewRequest.applicationId= applicationNumber;
const requestBody = {NulmSusvRenewRequest}
let response = await getSearchResults([],requestBody, dispatch,"svru");

if(response){ 
  getFileUrlDetails(state,dispatch,tenantId,response);
  dispatch(prepareFinalObject("NulmSusvRenewRequest", response.ResponseBody[0]));

  if(response.ResponseBody){
    const NulmSusvRenewRequest  = { ...response.ResponseBody[0]};
    const radioButtonValue = ["changeOfLocation"];
  
    radioButtonValue.forEach(value => {
      if(NulmSusvRenewRequest[value] && NulmSusvRenewRequest[value]=== true ){
        dispatch(prepareFinalObject(`NulmSusvRenewRequest[${value}]`, "Yes" ));
      }else{
        dispatch(prepareFinalObject(`NulmSusvRenewRequest[${value}]`, "No" ));
      }
    })
// if(NulmSusvRenewRequest.dob !== null)
//       dispatch(prepareFinalObject(`NulmSusvRenewRequest.dob`, NulmSusvRenewRequest.dob.split(" ")[0] ));

  }
}
}

const roleBasedValidationForFooter = () => {
if(process.env.REACT_APP_NAME === "Employee" && (status !== SANCTION_BY_BANK && status!==REJECTED_BY_TASK_FORCE_COMMITTEE)){
    // return poViewFooter();
  return {};
}
else{
  if(status==="Drafted" || status==="Reassign To Citizen")
      return poViewFooter() 
  else
    return{};
}

}
let printMenu = [];
let receiptPrintObject = {
label: { labelName: "Receipt", labelKey: "NULM_PRINT_SVRU" },
link: () => {
  downloadAcknowledgementForm("SUSV_UPDATE");
},
leftIcon: "receipt"
};
printMenu = [receiptPrintObject];

const screenConfig = {
  uiFramework: "material-ui",
  name: "view-svru",
  beforeInitScreen: (action, state, dispatch) => {
    getSEPDetails(state, dispatch);
    window.localStorage.setItem("SEP_Status",status);
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
            },
            printMenu: {
              uiFramework: "custom-atoms-local",
              moduleName: "egov-nulm",
              componentPath: "MenuButton",
              gridDefination: {
                xs: 12,
                sm: 4,
                md:3,
                lg:3,
                align: "right",
              },  
              visible: true,// enableButton,
              props: {
                data: {
                  label: {
                    labelName:"PRINT",
                    labelKey:"NULM_PRINT"
                  },
                  leftIcon: "print",
                  rightIcon: "arrow_drop_down",
                  props: { variant: "outlined", style: { marginLeft: 10 } },
                  menu: printMenu
                }
              }
            },
            newApplicationButton: {
              componentPath: "Button",
              gridDefination: {
                xs: 12,
                sm: 6,
                align: "right",
              },
              // visible: true,
              visible: status === "Approved"? true : false,
              props: {
                variant: "contained",
                color: "primary",
                style: {
                  color: "white",
                  borderRadius: "2px",
                  width: "250px",
                  height: "48px",
                },
              },

              children: {
                plusIconInsideButton: {
                  uiFramework: "custom-atoms",
                  componentPath: "Icon",
                  props: {
                    iconName: "add",
                    style: {
                      fontSize: "24px",
                    },
                  },
                },

                buttonLabel: getLabel({
                  labelName: "Add svru",
                  labelKey: "NULM_ADD_NEW_SVRU_BUTTON",
                }),
              },
              onClickDefination: {
                action: "condition",
                callBack: createSEPHandle,
              },
            },
          }
        },
        taskStatus: {
          uiFramework: "custom-containers-local",
          componentPath: "WorkFlowContainer",
          moduleName: "egov-nulm",
          visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
          props: {
            dataPath: "NulmSusvRenewRequest",
            moduleName: "NULM",
            updateUrl: "/nulm-services/v1/susv/renew/_updateAppStatus"
          }
        },
        tradeView,
        footer: roleBasedValidationForFooter(),
      }
    },
  }
};

export default screenConfig;

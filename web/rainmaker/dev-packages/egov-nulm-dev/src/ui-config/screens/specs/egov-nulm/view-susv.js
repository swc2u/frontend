import {
  getCommonHeader,
  getCommonContainer,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import set from "lodash/set";
import { SUSVReviewDetails } from "./viewSUSVResource/susv-review";
import { poViewFooter } from "./viewSUSVResource/footer";
import { getQueryArg,getFileUrlFromAPI,getFileUrl } from "egov-ui-framework/ui-utils/commons";
import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import { downloadAcknowledgementForm} from '../utils';
import { handleScreenConfigurationFieldChange as handleField, toggleSnackbar, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../ui-utils/commons";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
let status = getQueryArg(window.location.href, "status");
const check = process.env.REACT_APP_NAME === "Employee"? false : true
const userRoles = JSON.parse(localStorage["user-info"]).roles
const approveVisible = userRoles.filter(function(item){
  return item.code == "NULMACMC" || item.code == "NULMADMIN";         
})

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
    labelName: `View SUSV`,
    labelKey: "NULM_SUSV_VIEW"
  }),
  applicationNumber: applicationNumberContainer(),
  status: statusContainer()
});

const updateApprovedSUSV = async (state, dispatch) => {
  dispatch(setRoute(`/egov-nulm/create-svru`));
};

const tradeView = SUSVReviewDetails(false);

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
              name: "SusvDocuments",
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
  if(response.ResponseBody[0].applicationDocument !== null){
 const fileStoreIds = response.ResponseBody[0].applicationDocument.map(docInfo => docInfo.filestoreId).join();


 const fileUrlPayload =  fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
 let  documentsUploadRedux ={}
const documentsPreview = response.ResponseBody[0].applicationDocument 
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
                                 //     const {viewScreenMdmsData} = state.screenConfiguration.preparedFinalObject;
                                  //    if(viewScreenMdmsData && viewScreenMdmsData.NULM && viewScreenMdmsData.NULM.SusvDocuments){

                               //         const {SusvDocuments} = viewScreenMdmsData.NULM;
                                        const documentsDes = ["Identity Proof","Address Proof","Disability Proof"];
                                     //  const documentsDes = ["NULM_IDENTITY_PROOF","NULM_ADDRESS_PRROF","NULM_DISABILITY_PROOF"];
                                       
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
                                   //   }

                            return docObj;
                        })
  
        documentsPreview && dispatch(prepareFinalObject("documentsPreview", documentsPreview));
                        
                          
        documentsPreview &&  dispatch(prepareFinalObject("documentsUploadRedux", documentsUploadRedux));
      }
                     
 
}

const getSUSVDetails = async(state, dispatch) =>{
  
  const tenantId = process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;

  let NulmSusvRequest = {};
  NulmSusvRequest.tenantId = tenantId;
  NulmSusvRequest.applicationId= applicationNumber;
  const requestBody = {NulmSusvRequest}
  let response = await getSearchResults([],requestBody, dispatch,"susv");

  if(response){ 
    getFileUrlDetails(state,dispatch,tenantId,response);
    
    if( response.ResponseBody[0]){

      const NulmSusvRequest = { ...response.ResponseBody[0]};
      const radioButtonValue = ["isDisability"];
    
      radioButtonValue.forEach(value => {
        if(NulmSusvRequest[value] && NulmSusvRequest[value]=== true ){
          dispatch(prepareFinalObject(`NulmSusvRequest[${value}]`, "Yes" ));
        }else{
          dispatch(prepareFinalObject(`NulmSusvRequest[${value}]`, "No" ));
        }
      });
      if(NulmSusvRequest.date !== null ){
        NulmSusvRequest.date = NulmSusvRequest.date.split(" ")[0];
      }else{
        NulmSusvRequest.date = ""
      }

      dispatch(prepareFinalObject("NulmSusvRequest", NulmSusvRequest));
    }
  }
}
const roleBasedValidationForFooter = () => {
  if(process.env.REACT_APP_NAME === "Employee"){
    return {};//poViewFooter();
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
  label: { labelName: "Receipt", labelKey: "NULM_PRINT_SUSV" },
  link: () => {
    downloadAcknowledgementForm("SUSV");
  },
  leftIcon: "receipt"
};
printMenu = [receiptPrintObject];

const screenConfig = {
  uiFramework: "material-ui",
  name: "view-susv",
  beforeInitScreen: (action, state, dispatch) => {
    getSUSVDetails(state, dispatch);
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

    set(
      "view-susv",
      "components.div.children.headerDiv.children.newApplicationButton.props.visible",
      false
    );

    // dispatch(handleField(
    //     "view-susv",
    //     "components.div.children.headerDiv.children.newApplicationButton",
    //     "props.visible",
    //     false
    //   )
    // );
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
              // visible:  process.env.REACT_APP_NAME === "Employee"? false : status === "Approved" ? true : false,
              visible:  status === "Approved" && approveVisible.length > 0 ? true : false,
              props: {
                variant: "contained",
                color: "primary",
                style: {
                  position: "absolute",
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
                callBack: updateApprovedSUSV,
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
            dataPath: "NulmSusvRequest",
            moduleName: "NULM",
            updateUrl: "/nulm-services/v1/susv/_updateAppStatus"
          }
        },
        tradeView,
        footer: roleBasedValidationForFooter(),
      }
    },
  }
};

export default screenConfig;

import {
  getCommonCard,
  getCommonContainer,
  getCommonHeader,
  getLabelWithValue,
  getCommonParagraph,
  getLabel,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject, toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { localStorageGet, localStorageSet, setapplicationNumber, getapplicationNumber, setOPMSTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { gotoApplyWithStep } from "../utils/index";
import {
  getFileUrlFromAPI,
  getQueryArg,
  getTransformedLocale,
  setBusinessServiceDataToLocalStorage
} from "egov-ui-framework/ui-utils/commons";
import { estimateSummary } from "./summaryResource/estimateSummary";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import { searchBill } from "../utils/index";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";

import { footer } from "./applyResource/employeeSellMeatFooter";
//import { footer ,footerReview} from "./applyResource/footer";
import { adhocPopup1, adhocPopup2 } from "./payResource/adhocPopup";
// import { getRequiredDocuments } from "./requiredDocuments/reqDocs";

import {
  sellmeatapplicantSummary

} from "./summaryResource/sellmeatapplicantSummary";
import { documentsSummary } from "./summaryResource/documentsSummary";
import { taskStatusSummary } from "./summaryResource/taskStatusSummary";
import { showHideAdhocPopup, checkForRole, showHideAdhocPopups } from "../utils";
import { SellMeatReassign, SellMeatReject, SellMeatForward, SellMeatApprove } from "./payResource/adhocPopup";
import {
  getAccessToken,
  getOPMSTenantId,
  getLocale,
  getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";
import { getSearchResultsView, getSearchResultsForNocCretificate, getSearchResultsForNocCretificateDownload, setCurrentApplicationProcessInstance, checkVisibility } from "../../../../ui-utils/commons";
import { preparepopupDocumentsSellMeatUploadData, prepareDocumentsUploadData } from "../../../../ui-utils/commons";
import { httpRequest } from "../../../../ui-utils";
import { getTextForSellMeatNoc } from "./searchResource/citizenSearchFunctions";


let roles = JSON.parse(getUserInfo()).roles
let nocStatus = '';

const styles = {
  header: {
    color: "gba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
    fontSize: "20px",
    fontWeight: 500,
    lineHeight: "28px",
    padding: "10px 0px"
    //paddingLeft: "5px"

  },
  subHeader: {
    color: "gba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "19px",
    display: "block",
    width: "95%",
  },
  docs: {
    color: "rgba(0, 0, 0, 0.6)",
    fontFamily: "Roboto",
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "17px",
    display: "block",
    width: "95%",
    // paddingBottom: "24px"
  },
  description: {
    fontFamily: "Roboto",
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: "12px",
    fontWeight: 400,
    letterSpacing: "0.6px",
    lineHeight: "14px",
    display: "block",
    width: "95%",
    padding: "10px",
    marginBottom: "0px !important"
  },

};

const setvalueCancel = async (state, dispatch,type) => {
  let pagename = "petnoc_summary";

  if(type ==="SELLMEATNOC")
  {
    pagename = "sellmeatnoc-search-preview"
  
  }
  else if(type ==="PETNOC")
  {
    pagename = "petnoc_summary"
  
  }

  dispatch(
    handleField(
      //"petnoc_summary",
      pagename,
      "components.div.children.body.children.cardContent.children.undertakingButton1.children.addPenaltyRebateButton1",
      "props.checked",
      false
    )
  );
  localStorageSet("undertaking", "")
  //showHideAdhocPopups(state, dispatch, "petnoc_summary")
  showHideAdhocPopups(state, dispatch, pagename)



}


const setvalue = async (state, dispatch,type) => {
let pagename = "petnoc_summary";

if(type ==="SELLMEATNOC")
{
  pagename = "sellmeatnoc-search-preview"

}
else if(type ==="PETNOC")
{
  pagename = "petnoc_summary"

}

  dispatch(
    handleField(
      pagename,
      "components.div.children.body.children.cardContent.children.undertakingButton1.children.addPenaltyRebateButton1",
      "props.checked",
      true
    )
  );
  localStorageSet("undertaking", "accept")
  showHideAdhocPopups(state, dispatch, pagename)



}

const header = getCommonHeader(
  {
    labelName: "Conditions for issue of No Objection Certifcate",
    labelKey: "NOC_REQ_SELLMEAT_DOCS_HEADER"
  },
  {
    style: styles.header
  }
);

const getRequiredDocuments = (type) => {
  return getCommonContainer(
    {
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 12,
          sm: 12
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {

          // closeButton: {
          //   componentPath: "Button",
          //   props: {
          //     style: {
          //       float: "right",
          //       marginRight: "-15",
          //       paddingRight: "0px",
          //       color: "rgba(0, 0, 0, 0.60)"
          //     }
          //   },
          //   children: {
          //     previousButtonIcon: {
          //       uiFramework: "custom-atoms",
          //       componentPath: "Icon",
          //       props: {
          //         iconName: "close"
          //       }
          //     }
          //   },
          //   onClickDefination: {
          //     action: "condition",
          //     callBack: (state, dispatch) => showHideAdhocPopups(state, dispatch, "petnoc_summary")
          //   }
          // },

          header: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
            children: {
              header
            },
            break: getBreak(),
          },
          subText1: getCommonParagraph({
            labelName: "UNDERTAKING1",
            labelKey: "UNDERTAKING_POINT1"
          }),
          subText2: getCommonParagraph({
            labelName: "UNDERTAKING2",
            labelKey: "UNDERTAKING_POINT2"
          }),
          subText3: getCommonParagraph({
            labelName: "UNDERTAKING3",
            labelKey: "UNDERTAKING_POINT3"
          }),
          subText4: getCommonParagraph({
            labelName: "UNDERTAKING4",
            labelKey: "UNDERTAKING_POINT4"
          }),
          subText5: getCommonParagraph({
            labelName: "UNDERTAKING5",
            labelKey: "UNDERTAKING_POINT5"
          }),
          subText6: getCommonParagraph({
            labelName: "UNDERTAKING6",
            labelKey: "UNDERTAKING_POINT6"
          }),
          subText7: getCommonParagraph({
            labelName: "UNDERTAKING7",
            labelKey: "UNDERTAKING_POINT7"
          }),
          subText8: getCommonParagraph({
            labelName: "UNDERTAKING8",
            labelKey: "UNDERTAKING_POINT8"
          }),
          subText9: getCommonParagraph({
            labelName: "UNDERTAKING9",
            labelKey: "UNDERTAKING_POINT9"
          }),
          subText10: getCommonParagraph({
            labelName: "UNDERTAKING10",
            labelKey: "UNDERTAKING_POINT10"
          }),
          subText11: getCommonParagraph({
            labelName: "UNDERTAKING11",
            labelKey: "UNDERTAKING_POINT11"
          }),
          subText12: getCommonParagraph({
            labelName: "UNDERTAKING12",
            labelKey: "UNDERTAKING_POINT12"
          }),
          subText13: getCommonParagraph({
            labelName: "UNDERTAKING13",
            labelKey: "UNDERTAKING_POINT13"
          }),
          subText14: getCommonParagraph({
            labelName: "UNDERTAKING14",
            labelKey: "SELLMEATNOC_UNDERTAKINGPOINT14"
          }),
          subText15: getCommonParagraph({
            labelName: "UNDERTAKING15",
            labelKey: "SELLMEATNOC_UNDERTAKINGPOINT15"
          }),
        }

      },
      nextButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            minWidth: "180px",
            height: "48px",
            marginRight: "45px"
          }
        },
        children: {
          nextButtonLabel: getLabel({
            labelName: "OK I Agree",
            labelKey: "PM_COMMON_OK_I_AGREE_BUTTON"
          }),
          nextButtonIcon: {
            uiFramework: "custom-atoms",
            componentPath: "Icon",
            // props: {
            //   iconName: "keyboard_arrow_right"
            // }
          }
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            setvalue(state, dispatch,type);

          }
        }
      },
      cancelButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            minWidth: "180px",
            height: "48px",
            marginRight: "45px"
          }
        },
        children: {
          cancelButtonLabel: getLabel({
            labelName: "Cancel",
            labelKey: "PM_COMMON_CANCEL"
          }),
          cancelButtonIcon: {
            uiFramework: "custom-atoms",
            componentPath: "Icon",
            // props: {
            //   iconName: "keyboard_arrow_right"
            // }
          }
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            setvalueCancel(state, dispatch,type);

          }
        }
      },
    },
    {
      style: {
        padding: "0px 10px"
      }
    }
  );
};

const undertakingsellmeatButton = getCommonContainer({

  downloadcard: {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-opms",
    componentPath: "SampleDownloadForSellMeat",

    visible: false,
  },

});
const undertakingButton1 = getCommonContainer({
  resendButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "45px",
        // borderRadius: "inherit",
        // align: "right"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Resend",
        labelKey: "PM_COMMON_BUTTON_RESEND"
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
      callBack: (state, dispatch) => {
        gotoApplyWithStep(state, dispatch, 0);
      }
    },
    visible: nocStatus === "REASSIGN" ? true : false

  }
});

const undertakingButton = getCommonContainer({
  addPenaltyRebateButton1: {
    componentPath: "Checkbox",
    props: {
      checked: false,
      variant: "contained",
      color: "primary",
      style: {
        // minWidth: "20",
        height: "10px",
        marginRight: "5px",
        marginTop: "15px"
      }
    },
    children: {
      previousButtonLabel: getLabel({
        labelName: "Undertaking",
        labelKey: "SELLMEATNOC_UNDERTAKING_HEADING"
      }),
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => showHideAdhocPopups(state, dispatch, "sellmeatnoc-search-preview")
    },
    //checked:true,
    visible: localStorageGet('app_noc_status') === "DRAFT" ? true : false,
  },
  addPenaltyRebateButton: {
    componentPath: "Button",
    props: {
      color: "primary",
      style: {
        //minWidth: "200px",
        height: "48px",
        marginRight: "40px",
        paddingLeft: "0px",
        paddingBottom: "14px",
        textTransform: "capitalize"
      }
    },
    children: {
      previousButtonLabel: getLabel({
        labelName: "Undertaking",
        labelKey: "NOC_UNDERTAKING"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => showHideAdhocPopups(state, dispatch, "sellmeatnoc-search-preview")
    },
    visible: true,
  }
});


const getMdmsData = async (action, state, dispatch) => {
  let tenantId = getOPMSTenantId();
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
          moduleName: "egpm",
          masterDetails: [
            {
              name: "nocSought"
            },
            {
              name: "sector"
            },
            {
              name: "applicationType"
            }
          ]
        },
        { moduleName: "SellMeatNOC", masterDetails: [{ name: "SellMeatNOCRemarksDocuments" }] }
      ]
    }
  };
  try {
    let payload = null;
    // alert('in payload')
    payload = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);

    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};



const titlebar = getCommonContainer({
  header: getCommonHeader({
    labelName: "Task Details",
    labelKey: "NOC_TASK_DETAILS_HEADER"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-opms",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getapplicationNumber(), //localStorage.getItem('applicationsellmeatNumber')
    }
  },
  applicationStatus: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-opms",
    componentPath: "ApplicationStatusContainer",
    props: {
      status: "NA",
    }
  },
  downloadMenu: {
    uiFramework: "custom-atoms",
    componentPath: "MenuButton",
    // visible: process.env.REACT_APP_NAME === "Citizen" ? true : false,
    visible: false,
    props: {
      data: {
        label: "Download",
        leftIcon: "cloud_download",
        rightIcon: "arrow_drop_down",
        props: { variant: "outlined", style: { marginLeft: 10, marginTop: 5 } },
        menu: []
      }
    }
  }
});


const prepareDocumentsView = async (state, dispatch) => {
  let documentsPreview = [];

  // Get all documents from response
  let docs = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0]", {});
  var mobileNumber = JSON.parse(docs.applicationdetail).mobileNumber;
  docs["mobileNumber"] = mobileNumber;
  dispatch(prepareFinalObject("nocApplicationDetail[0]", docs));

  let aggrementdocumnet = JSON.parse(docs.applicationdetail).hasOwnProperty('uploadDocuments') ?
    JSON.parse(docs.applicationdetail).uploadDocuments[0]['fileStoreId'] : '';

  let idProof = JSON.parse(docs.applicationdetail).hasOwnProperty('idProof') ?
    JSON.parse(docs.applicationdetail).idProof[0]['fileStoreId'] : '';
  // let uploadPetPicture=JSON.parse(doc.applicationdetail).hasOwnProperty('uploadPetPicture')?
  // JSON.parse(doc.applicationdetail).uploadPetPicture[0]['fileStoreId']:'';
  if (aggrementdocumnet !== '') {
    documentsPreview.push({
      title: "SELLMEAT.PROOF_POSSESSION_RENT_AGREEMENT",
      fileStoreId: aggrementdocumnet,
      linkText: "View"
    });
    if (idProof && idProof != '') { 
      documentsPreview.push({
        title: "SELLMEAT.ID_PROOF",
        fileStoreId: idProof,
        linkText: "View"
      });       

    }
    let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
    let fileUrls =
      fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};
    documentsPreview = documentsPreview.map(function (doc, index) {

      doc["link"] = fileUrls && fileUrls[doc.fileStoreId] && fileUrls[doc.fileStoreId].split(",")[0] || "";
      //doc["name"] = doc.fileStoreId;
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
      return doc;
    });
    dispatch(prepareFinalObject("documentsPreview", documentsPreview));

  }
};


const setDownloadMenu = (state, dispatch) => {
  /** MenuButton data based on status */
  let downloadMenu = [];

  //Object creation for NOC's
  let certificateDownloadObjectPET = {
    label: { labelName: "NOC Certificate PET", labelKey: "NOC_CERTIFICATE_PET" },
    link: () => {
      window.location.href = httpLinkPET;
    },
    leftIcon: "book"
  };

  downloadMenu = [
    certificateDownloadObjectPET
  ];

  dispatch(
    handleField(
      "sellmeatnoc-search-preview",
      "components.div.children.headerDiv.children.header.children.downloadMenu",
      "props.data.menu",
      downloadMenu
    )
  );
  /** END */
};

const HideshowEdit = (state, action, nocStatus) => {
  // Hide edit buttons
  let showEdit = false;
  if (nocStatus === "REASSIGN" || nocStatus === "DRAFT") {
    showEdit = true;
  }
  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.sellmeatapplicantSummary.children.cardContent.children.header.children.editSection.visible",
    checkForRole(roles, 'CITIZEN') ? showEdit === true ? true : false : false
  );
  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.documentsSummary.children.cardContent.children.header.children.editSection.visible",
    checkForRole(roles, 'CITIZEN') ? showEdit === true ? true : false : false
  );

  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.taskStatusSummary.children.cardContent.children.header.children.editSection.visible",
    false
  );

  set(
    action,
    "screenConfig.components.div.children.footer.children.previousButton.visible",
    checkForRole(roles, 'CITIZEN') ?
      nocStatus === "DRAFT" || nocStatus === "REASSIGN" ?
        true
        : false
      : false
  );

  set(
    action,
    "screenConfig.components.div.children.footer.children.submitButton.visible",
    checkForRole(roles, 'CITIZEN') ?
      nocStatus === "DRAFT" || nocStatus === "REASSIGN" ?
        true
        : false
      : false
  );

  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.undertakingsellmeatButton.children.downloadcard.visible",
    checkForRole(roles, 'CITIZEN') ?
      nocStatus === "DRAFT" ?
        true
        : false
      : true
  );
  set(
    action,
    "screenConfig.components.adhocDialog.children.popup",
    getRequiredDocuments()
  );

  set(state, 'screenConfiguration.preparedFinalObject.WFStatus', []);
  checkVisibility(state, "REJECTED", "reject", action, "screenConfig.components.div.children.footer.children.reject.visible", null)
  checkVisibility(state, "APPROVED", "approve", action, "screenConfig.components.div.children.footer.children.approve.visible", null)
  checkVisibility(state, "REASSIGN,REASSIGNTOSI,REASSIGNTOSUPERINTENDENT", "reassign", action, "screenConfig.components.div.children.footer.children.reassign.visible", null)
  checkVisibility(state, "REVIEWOFSUPERINTENDENT,PENDINGAPPROVAL", "nextButton", action, "screenConfig.components.div.children.footer.children.nextButton.visible", null)

}

const setSearchResponse = async (state, action, dispatch, applicationNumber, tenantId) => {
  const response = await getSearchResultsView([
    { key: "tenantId", value: tenantId },
    { key: "applicationNumber", value: applicationNumber }
  ]);
  if (response === undefined) {
    dispatch(setRoute(`/egov-opms/invalidIdErrorPage?applicationNumber=${applicationNumber}&tenantId=${tenantId}`))
  }
  else {
    dispatch(prepareFinalObject("nocApplicationDetail", get(response, "nocApplicationDetail", [])));
    let applicationdetail = JSON.parse(get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].applicationdetail", {}));
    let nocSoughtFromAPI = applicationdetail.nocSought;
    let mdmsDataForNocSought = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData.egpm.nocSought", []);
    let nocSoughtFinalData = "";
    nocSoughtFromAPI.split(",").map(item => { 
      
      if (mdmsDataForNocSought.find(str => str.code == item.trim())) {
        nocSoughtFinalData = nocSoughtFinalData + " , " +mdmsDataForNocSought.find(str => str.code == item.trim()).name;
      }
    });
    dispatch(prepareFinalObject("nocApplicationDetail[0].nocSoughtFinalData",nocSoughtFinalData.slice(2) ));
    
    nocStatus = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].applicationstatus", {});
    localStorageSet("app_noc_status", nocStatus);
    dispatch(
      handleField(
        "sellmeatnoc-search-preview",
        "components.div.children.headerDiv.children.header.children.applicationStatus",
        "props.status",
        getTextForSellMeatNoc(nocStatus)
      )
    );
    if (nocStatus != "DRAFT") { 
      dispatch(
        handleField(
          "sellmeatnoc-search-preview",
          "components.div.children.taskStatus",
          "visible",
          true
        )
      );
  
    }

    await setCurrentApplicationProcessInstance(state)
    HideshowEdit(state, action, nocStatus);

    prepareDocumentsView(state, dispatch);

    if (checkForRole(roles, 'CITIZEN'))
      setSearchResponseForNocCretificate(state, dispatch, applicationNumber, tenantId);
    //setDownloadMenu(state, dispatch);
  }
};

let httpLinkPET;
let httpLinkSELLMEAT = "";

const setSearchResponseForNocCretificate = async (
  state,
  dispatch,
  applicationNumber,
  tenantId
) => {
  let downloadMenu = [];
  //nocStatus = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].applicationstatus", {});
  let nocRemarks = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].remarks", {});
  let nocStatus = "";
  let certificateDownloadObjectSELLMEAT = {};
  let certificateDownloadObject_RECEIPT_SELLMEAT = {};

  var resApproved = nocRemarks.filter(function (item) {
    return item.applicationstatus == "APPROVED";
  });

  var resApprovedPAID = nocRemarks.filter(function (item) {
    return item.applicationstatus == "PAID";
  });

  if (resApproved.length != 0){
    nocStatus = "APPROVED";
  }

  if (resApprovedPAID.length != 0){
    nocRemarks = "PAID";
  }

  if (nocStatus === "APPROVED") {
    let getCertificateDataForSELLMEAT = { "applicationType": "SELLMEATNOC", "tenantId": tenantId, "applicationId": applicationNumber, "dataPayload": { "requestDocumentType": "certificateData" } };
   
    //SELLMEAT
    const response0SELLMEAT = await getSearchResultsForNocCretificate([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "getCertificateData", value: getCertificateDataForSELLMEAT },
      { key: "requestUrl", value: "/pm-services/noc/_getCertificateData" }
    ]);

    if (get(response0SELLMEAT, "ResposneInfo.status", "") == "") {
      let errorMessage = {
        labelName: "No Certificate Information Found",
        labelKey: "" //UPLOAD_FILE_TOAST
      };
      dispatch(toggleSnackbar(true, errorMessage, "error"));
    } else {
      let getFileStoreIdForSELLMEAT = { "nocApplicationDetail": [get(response0SELLMEAT, "nocApplicationDetail[0]", "")] }
      let nocSoughtFromAPI=get(response0SELLMEAT, "nocApplicationDetail[0].licenseType", "")
      let mdmsDataForNocSought = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData.egpm.nocSought", []);
      let nocSoughtFinalData = "";
      
      nocSoughtFromAPI.split(",").map(item => { 
        if (mdmsDataForNocSought.find(str => str.code == item.trim())) {
          nocSoughtFinalData = nocSoughtFinalData + " , " +mdmsDataForNocSought.find(str => str.code == item.trim()).name;
        }
      });
      set(response0SELLMEAT, "nocApplicationDetail[0].licenseType", nocSoughtFinalData.slice(2))
      const response1SELLMEAT = await getSearchResultsForNocCretificate([
        { key: "tenantId", value: tenantId },
        { key: "applicationNumber", value: applicationNumber },
        { key: "getCertificateDataFileStoreId", value: getFileStoreIdForSELLMEAT },
        { key: "requestUrl", value: "/pdf-service/v1/_create?key=sellmeat-noc&tenantId=" + tenantId }
      ]);

      const response2SELLMEAT = await getSearchResultsForNocCretificateDownload([
        { key: "tenantId", value: tenantId },
        { key: "applicationNumber", value: applicationNumber },
        { key: "filestoreIds", value: get(response1SELLMEAT, "filestoreIds[0]", "") },
        { key: "requestUrl", value: "/filestore/v1/files/url?tenantId=" + tenantId + "&fileStoreIds=" }
      ]);
      var httpLinkSELLMEAT_CERT = ""; 
      httpLinkSELLMEAT_CERT = get(response2SELLMEAT, get(response1SELLMEAT, "filestoreIds[0]", ""), "")
    }
    //Object creation for NOC's
    certificateDownloadObjectSELLMEAT = {
      label: { labelName: "NOC Certificate SELLMEAT", labelKey: "NOC_CERTIFICATE_SELLMEAT" },
      link: () => {
        if (httpLinkSELLMEAT_CERT != "")
          window.location.href = httpLinkSELLMEAT_CERT;
      },
      leftIcon: "book"
    };

    downloadMenu = [
      certificateDownloadObjectSELLMEAT
    ];
    dispatch(
      handleField(
        "sellmeatnoc-search-preview",
        "components.div.children.headerDiv.children.header.children.downloadMenu",
        "visible",
        true
      )
    );
  
  }

  if (nocRemarks === "PAID") {
    let getCertificateDataForSELLMEAT = { "applicationType": "SELLMEATNOC", "tenantId": tenantId, "applicationId": applicationNumber, "dataPayload": { "requestDocumentType": "receiptData" } };
   
    //SELLMEAT
    const response0SELLMEAT = await getSearchResultsForNocCretificate([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "getCertificateData", value: getCertificateDataForSELLMEAT },
      { key: "requestUrl", value: "/pm-services/noc/_getCertificateData" }
    ]);

    if (get(response0SELLMEAT, "ResposneInfo.status", "") == "") {
      let errorMessage = {
        labelName: "No Certificate Information Found",
        labelKey: "" //UPLOAD_FILE_TOAST
      };
      dispatch(toggleSnackbar(true, errorMessage, "error"));
    } else {
      let getFileStoreIdForSELLMEAT = { "nocApplicationDetail": [get(response0SELLMEAT, "nocApplicationDetail[0]", "")] }
      let nocSoughtFromAPI=get(response0SELLMEAT, "nocApplicationDetail[0].licenseType", "")
      let mdmsDataForNocSought = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData.egpm.nocSought", []);
      let nocSoughtFinalData = "";
      
      nocSoughtFromAPI.split(",").map(item => { 
        if (mdmsDataForNocSought.find(str => str.code == item.trim())) {
          nocSoughtFinalData = nocSoughtFinalData + " , " +mdmsDataForNocSought.find(str => str.code == item.trim()).name;
        }
      });
      set(response0SELLMEAT, "nocApplicationDetail[0].licenseType", nocSoughtFinalData.slice(2))
      const response1SELLMEAT = await getSearchResultsForNocCretificate([
        { key: "tenantId", value: tenantId },
        { key: "applicationNumber", value: applicationNumber },
        { key: "getCertificateDataFileStoreId", value: getFileStoreIdForSELLMEAT },
        { key: "requestUrl", value: "/pdf-service/v1/_create?key=sellMeat-receipt&tenantId=" + tenantId }
      ]);

      const response2SELLMEAT = await getSearchResultsForNocCretificateDownload([
        { key: "tenantId", value: tenantId },
        { key: "applicationNumber", value: applicationNumber },
        { key: "filestoreIds", value: get(response1SELLMEAT, "filestoreIds[0]", "") },
        { key: "requestUrl", value: "/filestore/v1/files/url?tenantId=" + tenantId + "&fileStoreIds=" }
      ]);
      var httpLinkSELLMEAT_RECEIPT = ""; 
      httpLinkSELLMEAT_RECEIPT = get(response2SELLMEAT, get(response1SELLMEAT, "filestoreIds[0]", ""), "")
    }
    //Object creation for NOC's
    certificateDownloadObject_RECEIPT_SELLMEAT = {
      label: { labelName: "Receipt", labelKey: "NOC_RECEIPT_PET" },
      link: () => {
        if (httpLinkSELLMEAT_RECEIPT != "")
          window.location.href = httpLinkSELLMEAT_RECEIPT;
      },
      leftIcon: "book"
    };

    downloadMenu = [
      certificateDownloadObject_RECEIPT_SELLMEAT
    ];
    dispatch(
      handleField(
        "sellmeatnoc-search-preview",
        "components.div.children.headerDiv.children.header.children.downloadMenu",
        "visible",
        true
      )
    );
  
  }

  if (nocStatus === "APPROVED" && nocRemarks === "PAID") {
    downloadMenu = [
      certificateDownloadObjectSELLMEAT,
      certificateDownloadObject_RECEIPT_SELLMEAT
    ];
  }
  dispatch(
    handleField(
      "sellmeatnoc-search-preview",
      "components.div.children.headerDiv.children.header.children.downloadMenu",
      "props.data.menu",
      downloadMenu
    )
  );
  //setDownloadMenu(state, dispatch);
};


const screenConfig = {
  uiFramework: "material-ui",
  name: "sellmeatnoc-search-preview",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    setapplicationNumber(applicationNumber); //localStorage.setItem('ApplicationNumber', applicationNumber); , applicationNumber)
    //localStorageSet('applicationsellmeatNumber',applicationNumber);
    const tenantId = getQueryArg(window.location.href, "tenantId");
    setOPMSTenantId(tenantId);
    if (JSON.parse(getUserInfo()).type === "EMPLOYEE") {
      set(state,
        "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
        ""
      )
      set(state.screenConfiguration.preparedFinalObject, "SellMeat[0].SellMeatDetails.Forward.remarks", "");
      set(state.screenConfiguration.preparedFinalObject, "SellMeat[0].SellMeatDetails.Approve.remarks", "");
      set(state.screenConfiguration.preparedFinalObject, "SellMeat[0].SellMeatDetails.Reject.remarks", "");
      set(state.screenConfiguration.preparedFinalObject, "SellMeat[0].SellMeatDetails.Reassign.remarks", "");
    }

    dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
    searchBill(dispatch, applicationNumber, tenantId);
    

    const queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: "SELLMEATNOC" }
    ];
    setBusinessServiceDataToLocalStorage(queryObject, dispatch);


    getMdmsData(action, state, dispatch).then(response => {
      prepareDocumentsUploadData(state, dispatch, 'popup_sellmeat');
      setSearchResponse(state, action, dispatch, applicationNumber, tenantId);
      // prepareDocumentsUploadData(state, dispatch, 'apply_sellmeat');      
    });
    preparepopupDocumentsSellMeatUploadData(state, dispatch, 'SELLMEATNOC');

    // Set Documents Data (TEMP)

    // set undertaking data
    set(
      action,
      "screenConfig.components.undertakingdialog.children.popup",
      getRequiredDocuments("SELLMEATNOC")
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
              ...titlebar
            }
          }
        },
        taskStatus: {
          uiFramework: "custom-containers-local",
          componentPath: "WorkFlowContainer",
          moduleName: "egov-workflow",
          visible: false,//process.env.REACT_APP_NAME === "Citizen" ? false : true,
          props: {
            dataPath: "Licenses",
            moduleName: "SELLMEATNOC",
          }
        },

        body: checkForRole(roles, 'CITIZEN') ? getCommonCard({
          estimateSummary: estimateSummary,
          sellmeatapplicantSummary: sellmeatapplicantSummary,
          documentsSummary: documentsSummary,
          taskStatusSummary: taskStatusSummary,
          undertakingButton1,
          undertakingsellmeatButton,
          // undertakingButton
        }) :
          getCommonCard({
            estimateSummary: estimateSummary,
            sellmeatapplicantSummary: sellmeatapplicantSummary,
            documentsSummary: documentsSummary
          }),
        break: getBreak(),


        // undertakingButton,
        // citizenFooter:
        //   process.env.REACT_APP_NAME === "Citizen" ? citizenFooter : {}
        footer: footer

      }
    },
    // undertakingdialog: {
    //   uiFramework: "custom-containers-local",
    //   moduleName: "egov-opms",
    //   componentPath: "UnderTakingContainer",
    //   props: {
    //     open: false,
    //     maxWidth: "md",
    //     screenKey: "sellmeatnoc-search-preview"
    //   },
    //   children: {
    //     popup: {}
    //   }
    // },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "DialogContainer",

      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "sellmeatnoc-search-preview"
      },
      children: {

        popup: {}
        //popup:adhocPopup1

      }
    },
    adhocDialogForward: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "ForwardContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "sellmeatnoc-search-preview"
      },
      children: {

        popup: SellMeatForward

      }
    },
    adhocDialog1: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "ApproveContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "sellmeatnoc-search-preview"
      },
      children: {
        popup: SellMeatApprove
      }
    },
    adhocDialog3: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "RejectContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "sellmeatnoc-search-preview"
      },
      children: {

        popup: SellMeatReject

      }
    },
    adhocDialog2: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "ReassignContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "sellmeatnoc-search-preview"
      },
      children: {

        popup: SellMeatReassign

      }
    },
  }
};

export default screenConfig;

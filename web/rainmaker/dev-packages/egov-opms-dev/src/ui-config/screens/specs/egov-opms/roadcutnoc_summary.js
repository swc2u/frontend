import {
  getBreak,
  getCommonCard,
  getCommonContainer,
  getCommonHeader,
  getLabelWithValue,
  getStepperObject,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";

import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getFileUrlFromAPI,
  getQueryArg,
  getTransformedLocale,
  setBusinessServiceDataToLocalStorage
} from "egov-ui-framework/ui-utils/commons";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import { getSearchResultsView, updateAppStatus } from "../../../../ui-utils/commons";
import { searchBill } from "../utils/index";
import { checkForRole } from "../utils";
import { toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";

import { citizenFooter } from "./searchResource/citizenFooter";
import {
  applicantSummary,
  institutionSummary
} from "./summaryResourceRoadCut/applicantSummary";
import { documentsSummary } from "./summaryResourceRoadCut/documentsSummary";
import { estimateSummary } from "./summaryResourceRoadCut/estimateSummary";
import { nocSummary } from "./summaryResourceRoadCut/nocSummary";
//import { propertySummary } from "./summaryResourceRoadCut/propertySummary";
import {
  getAccessToken,
  getOPMSTenantId,
  getLocale,
  getUserInfo,
  getapplicationNumber,
  localStorageGet,
  setapplicationNumber
} from "egov-ui-kit/utils/localStorageUtils";
import {
  createUpdateRoadCutNocApplication
} from "../../../../ui-utils/commons";
import { taskStatusSummary } from './summaryResource/taskStatusSummary';

import {

  getCommonApplyFooter,

} from "../utils";
import { getTextForRoadCuttNoc } from "./searchResource/citizenSearchFunctions";


export const stepsData = [
  { labelName: "Road Cut NOC Details", labelKey: "ROADCUT_APPLICANT_DETAILS_NOC" },
  { labelName: "Documents", labelKey: "ROADCUT_STEP_DOCUMENTS_NOC" },
  { labelName: "Summary", labelKey: "SELLMEATNOC_SUMMARY" }
  //{ labelName: "Applicant Details", labelKey: "ROADCUT_STEP_APPLICANT_DETAILS_NOC" }

];
export const stepper = getStepperObject(
  { props: { activeStep: 2 } },
  stepsData
);

let roles = JSON.parse(getUserInfo()).roles

const roadCutRate = getCommonContainer({
  downloadcard: {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-opms",
    componentPath: "SampleDownloadRoadCut",
    visible: true
  }
});


const titlebar = getCommonContainer({
  header: getCommonHeader({
    labelName: "Application for Road Cut",
    labelKey: "ROADCUT_APPLY_NOC"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-opms",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getQueryArg(window.location.href, "applicationNumber")
    }
  },
  applicationStatus: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-opms",
    componentPath: "ApplicationStatusContainer",
    props: {
      status: "NA",
    }
  }
});

const routePage = (dispatch, nocnumber) => {
  const appendUrl = process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  const reviewUrl = `${appendUrl}/egov-opms/acknowledgement-roadcut?purpose=submit&status=success&applicationNumber=`+nocnumber+`&tenantId=ch.chandigarh&secondNumber=`;
  dispatch(toggleSpinner());
  dispatch(setRoute(reviewUrl));


}

const routefromJEPage = (dispatch, nocnumber) => {
  const appendUrl = process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  const reviewUrl = `${appendUrl}/egov-opms/acknowledgement-roadcut?purpose=editAtJE&status=success&applicationNumber=`+nocnumber+`&tenantId=ch.chandigarh&secondNumber=`;
  dispatch(toggleSpinner());
  dispatch(setRoute(reviewUrl));
  // const appendUrl = process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  // const reviewUrl = `${appendUrl}/egov-opms/roadcut-search`;
  // dispatch(toggleSpinner());
  // dispatch(setRoute(reviewUrl));


}

export const callbackforSummaryActionSubmit = async (state, dispatch) => {
  try {
    dispatch(toggleSpinner());

    let applicationStatus = get(
      state,
      "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].applicationstatus",
      {}
    );
    let nocnumber = get(
      state,
      "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].nocnumber",
      {}
    );

    if(applicationStatus === "REVIEWOFJE"){
        let response = await updateAppStatus(state, dispatch, "EDITEDATJE");
        let responseStatus = get(response, "status", "");
        let nocnumber = get(response, "nocnumber", "");
        if (responseStatus == "success") {
          routefromJEPage(dispatch, nocnumber)
        }
        else if (responseStatus == "fail" || responseStatus == "Fail") {
          dispatch(toggleSpinner());
          dispatch(toggleSnackbar(true, { labelName: "API ERROR" }, "error"));
        }
    }
    if (applicationStatus === "DRAFT") {
      //INITIATED_TELECOM 
      var applicationType = JSON.parse(state.screenConfiguration.preparedFinalObject.nocApplicationDetail[0].applicationdetail).typeOfApplicant;
      var applicationState = "";
      if(applicationType === "TELECOM"){
        applicationState = "INITIATED_TELECOM";
      }else{
        applicationState = "INITIATED";
      }
      let response = await updateAppStatus(state, dispatch, applicationState);
      let responseStatus = get(response, "status", "");
      let nocnumber = get(response, "nocnumber", "");
      if (responseStatus == "success") {
        routePage(dispatch, nocnumber)
      }
      else if (responseStatus == "fail" || responseStatus == "Fail") {
        dispatch(toggleSpinner());
        dispatch(toggleSnackbar(true, { labelName: "API ERROR" }, "error"));
      }
    } else if (applicationStatus === "REASSIGN") {
      //INITIATED_TELECOM 
      var applicationType = JSON.parse(state.screenConfiguration.preparedFinalObject.nocApplicationDetail[0].applicationdetail).typeOfApplicant;
      var applicationState = "";
      if(applicationType === "TELECOM"){
        applicationState = "RESENTTOADM";
      }else{
        applicationState = "RESENT";
      }
      let response = await updateAppStatus(state, dispatch, applicationState);
      let responseStatus = get(response, "status", "");
      if (responseStatus == "success") {
        routePage(dispatch)
      }
      else if (responseStatus == "fail" || responseStatus == "Fail") {
        dispatch(toggleSpinner());
        dispatch(toggleSnackbar(true, { labelName: "API ERROR" }, "error"));
      }
    }
    else  {
      if(applicationStatus === "REVIEWOFJE"){
        dispatch(toggleSpinner());
        routefromJEPage(dispatch, nocnumber);
      }else{
        routePage(dispatch);
      }
    }
  } catch (error) {
    dispatch(toggleSpinner());
    console.log(error)
  }

};

export const callbackforSummaryActionCancel = async (state, dispatch) => {

  const appendUrl = process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  const reviewUrl = `${appendUrl}/egov-opms/roadcutnoc-my-applications`;
  dispatch(setRoute(reviewUrl));

};

var titlebarfooter = getCommonApplyFooter({
  previousButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "16px",

      }
    },
    children: {
      cancelButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_left"
        }
      },
      previousButtonLabel: getLabel({
        labelName: "Previous Step",
        labelKey: "NOC_CANCEL_BUTTON"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: callbackforSummaryActionCancel
    },
    visible: true
  },
  submitButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "SEND",
        labelKey: "NOC_SUBMIT_BUTTON"
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
      callBack: callbackforSummaryActionSubmit
    }
  }
});


const prepareDocumentsView = async (state, dispatch) => {
  let documentsPreview = [];

  let ROADCUTNOC = get(
    state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0]", {});

  let doc = JSON.parse(ROADCUTNOC.applicationdetail).uploadDocuments

  let doctitle = []
  if (doc.length > 0) {
    if (doc.length > 0) {

      for (let i = 0; i < doc.length; i++) {
        let eventDoc = doc[i]['fileStoreId']
        doctitle.push(doc[i]['name:']);

        if (eventDoc !== '' || eventDoc !== undefined) {
          documentsPreview.push({
            title: doc[i]['name:'],
            fileStoreId: eventDoc,
            linkText: "View",
            fileName: doc[i]['name:']
          })
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
            return doc;
          });
        }
      }

    }
  }
  dispatch(prepareFinalObject("documentsPreview", documentsPreview));

};

const setSearchResponse = async (
  state,
  dispatch,
  applicationNumber,
  tenantId
) => {
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
    let roadCutTypeFromAPI = applicationdetail.roadCutType;
    let mdmsDataForRoadType = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData.egpm.roadCutType", []);
    let RoadTypeFinalData = "";
    roadCutTypeFromAPI.split(",").map(item => { 
      
      if (mdmsDataForRoadType.find(str => str.code == item.trim())) {
        RoadTypeFinalData = RoadTypeFinalData + " , " +mdmsDataForRoadType.find(str => str.code == item.trim()).name;
      }
    });
    dispatch(prepareFinalObject("nocApplicationDetail[0].RoadTypeFinalData",RoadTypeFinalData.slice(2) ));


    let nocStatus = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].applicationstatus", "-");
    dispatch(
      handleField(
        "roadcutnoc_summary",
        "components.div.children.headerDiv.children.header.children.applicationStatus",
        "props.status",
        getTextForRoadCuttNoc(nocStatus)
      )
    );

    prepareDocumentsView(state, dispatch);
  }

};

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
              name: "roadCutDivision"
            },
            {
              name: "sector"
            },
            {
              name: "roadCutType"
            },
            {
              name: "applicationType"
            }
          ]
        },
        { moduleName: "RoadCutNOC", masterDetails: [{ name: "RoadCutNOCRemarksDocuments" }] }
      ]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );


    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "roadcutnoc_summary",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    const EditAtJE = getQueryArg(window.location.href, "EditAtJE");
    setapplicationNumber(applicationNumber);

    const tenantId = getQueryArg(window.location.href, "tenantId");
    dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));

    getMdmsData(action, state, dispatch).then(response => {
      searchBill(dispatch, applicationNumber, tenantId);
      setSearchResponse(state, dispatch, applicationNumber, tenantId);
    });

    localStorage.setItem("applicationNumber", applicationNumber);

    let payload = get(state.screenConfiguration.preparedFinalObject, "ROADCUTNOC", []);
    set(state.screenConfiguration.preparedFinalObject.ROADCUTNOC, "ROADCUTNOC", payload);

    const queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: "ROADCUTNOC" }
    ];
    setBusinessServiceDataToLocalStorage(queryObject, dispatch);
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
        stepper,
        taskStatus: {
          uiFramework: "custom-containers-local",
          componentPath: "WorkFlowContainer",
          moduleName: "egov-workflow",
          visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
          props: {
            dataPath: "nocApplicationDetail",
            moduleName: "ROADCUTNOC",
            //updateUrl: "/opms-services/v1/_update"
          }
        },
        body: checkForRole(roles, 'CITIZEN') ? getCommonCard({
          applicantSummary: applicantSummary,
          nocSummary: nocSummary,
          documentsSummary: documentsSummary,
          roadCutRate
        }) :
          getCommonCard({
            applicantSummary: applicantSummary,
            nocSummary: nocSummary,
            documentsSummary: documentsSummary,
            roadCutRate
          }),
        break: getBreak(),
        titlebarfooter,
        // citizenFooter:
        //   process.env.REACT_APP_NAME === "Citizen" ? citizenFooter : citizenFooter
      }
    }
  }
};

export default screenConfig;

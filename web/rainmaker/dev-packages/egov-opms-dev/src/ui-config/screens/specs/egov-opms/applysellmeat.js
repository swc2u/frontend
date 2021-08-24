import {
  getCommonContainer,
  getCommonParagraph,
  getBreak,
  getLabel,
  getCommonHeader,
  getStepperObject
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCurrentFinancialYear, clearlocalstorageAppDetails } from "../utils";
import { footer } from "./applyResourceSellMeat/footer";
import { nocDetails } from "./applyResourceSellMeat/nocDetails";
import { documentDetails } from "./applyResourceSellMeat/documentDetails";
import { getFileUrlFromAPI, getQueryArg, getTransformedLocale, setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getOPMSTenantId,getUserInfo, setapplicationType,
  IsRemoveItem, lSRemoveItemlocal, setapplicationNumber,
  localStorageSet } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import jp from "jsonpath";
import set from "lodash/set";
import get from "lodash/get";
import {
  prepareDocumentsUploadDataForSellMeat,
  prepareDocumentsUploadData,
  getSearchResultsView,
  furnishSellMeatNocResponse,
  setApplicationNumberBox
} from "../../../../ui-utils/commons";
import { getOPMSPattern, showHideAdhocPopups } from "../utils/index"


const styles = {
  header: {
    fontWeight: 400,
    lineHeight: 2,
    fontSize: "20px"

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

export const stepsData = [
  { labelName: "Sell Meat NOC Details", labelKey: "SELLMEATNOC_APPLICANT_DETAILS_NOC" },
  { labelName: "Documents", labelKey: "SELLMEATNOC_STEP_DOCUMENTS_NOC" },
  { labelName: "Summary", labelKey: "SELLMEATNOC_SUMMARY" }
];
export const stepper = getStepperObject(
  { props: { activeStep: 0 } },
  stepsData
);

const applicationNumberContainer = () => {
  const applicationNumber = getQueryArg(
    window.location.href,
    "applicationNumber"
  );
  if (applicationNumber)
    return {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-opms",
      componentPath: "ApplicationNoContainer",
      props: {
        number: `${applicationNumber}`,
        visibility: "hidden"
      },
      visible: true
    };
  else return {};
};

export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Apply New Permission for Sell Meat NOC (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
    labelKey: "SELLMEAT_APPLY_NOC"
  }),
  //applicationNumber: applicationNumberContainer()
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-opms",
    componentPath: "ApplicationNoContainer",
    props: {
      number: "NA"
    },
    visible: false
  }
});

export const header_DROPDOWN = getCommonContainer({
  header: getCommonHeader({
    labelName: `Apply New Permission for Sell Meat NOC (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
    labelKey: "DROPDWON_COMBINATION"
  }),
  //applicationNumber: applicationNumberContainer()
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-opms",
    componentPath: "ApplicationNoContainer",
    props: {
      number: "NA"
    },
    visible: false
  }
});

export const header_DROPDOWN_Note = getCommonContainer({
  header: getCommonHeader({
    labelName: "Note: I here confirm that my shop fall under commercial area",
    labelKey: "DROPDOWN_POINT_5"
  }),
  //applicationNumber: applicationNumberContainer()
  // applicationNumber: {
  //   uiFramework: "custom-atoms-local",
  //   moduleName: "egov-opms",
  //   componentPath: "ApplicationNoContainer",
  //   props: {
  //     number: "NA"
  //   },
  //   visible: false
  // }
});

export const formwizardFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: {
    nocDetails
  }
};

export const formwizardSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form2"
  },
  children: {
    documentDetails
  },
  visible: false
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
        { moduleName: "SellMeatNOC", masterDetails: [{ name: "SellMeatDocuments" }] }
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

export const prepareEditFlow = async (action, state, dispatch, applicationNumber, tenantId, step) => {
  if (applicationNumber) {
    let response = await getSearchResultsView([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber }
    ]);
    let Refurbishresponse = furnishSellMeatNocResponse(state,response, step);

    dispatch(prepareFinalObject("SELLMEATNOC", Refurbishresponse));

    let statusPAID = false;
    var array1 = response.nocApplicationDetail[0].remarks;
    var found = array1.find(element => element.applicationstatus === "PAID" );
    if(found){
      statusPAID = true;
    }
    if(statusPAID){
      set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.nocDetails.children.cardContent.children.nocDetailsContainer.children.nocSought.props.disabled",
        true
      );
      set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.nocDetails.children.cardContent.children.nocDetailsContainer.children.nocSought.props.disabled",
        true
      );
    }

    if (applicationNumber) {
      setapplicationNumber(applicationNumber);
      setApplicationNumberBox(state, dispatch, applicationNumber);
    }

    let documentsPreview = [];

    // Get all documents from response
    let sellmeatnocdetail = get(state, "screenConfiguration.preparedFinalObject.SELLMEATNOC", {});
    let uploadVaccinationCertificate = sellmeatnocdetail.hasOwnProperty('uploadDocuments') ?
      sellmeatnocdetail.uploadDocuments[0]['fileStoreId'] : '';

    let idProof = sellmeatnocdetail.hasOwnProperty('idProof') && sellmeatnocdetail.idProof != undefined ?
      sellmeatnocdetail.idProof[0]['fileStoreId'] : '';
    
    if (uploadVaccinationCertificate !== '') {
      documentsPreview.push({
        title: "PROOF_POSSESSION_RENT_AGREEMENT",
        fileStoreId: uploadVaccinationCertificate,
        linkText: "View"
      });
      if (idProof && idProof != '') {
        documentsPreview.push({
          title: "ID_PROOF",
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

          doc["fileUrl"] = fileUrls && fileUrls[doc.fileStoreId] && fileUrls[doc.fileStoreId].split(",")[0] || "";
          doc["fileName"] =
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
      dispatch(prepareFinalObject("documentsUploadRedux[0].documents[0]", documentsPreview[0]));
      if (documentsPreview[1]) {
        dispatch(prepareFinalObject("documentsUploadRedux[1].documents[0]", documentsPreview[1]));
      }

     }
  }
};

const setvalueCancel = async (state, dispatch,type) => {
  let pagename = "petnoc_summary";

  if(type ==="SELLMEATNOC")
  {
    pagename = "applysellmeat"
  
  }
  else if(type ==="PETNOC")
  {
    pagename = "petnoc_summary"
  
  }

  dispatch(
    handleField(
      //"petnoc_summary",
      pagename,
      "components.div.children.formwizardFirstStep.children.nocDetails.children.cardContent.children.checkboxBtnContainer.children.addPenaltyRebateButton1",
      "props.checked",
      false
    )
  );
  // localStorageSet("dropdownTermsAccepted", "")
  dispatch(prepareFinalObject("dropdownRead", false));
  //showHideAdhocPopups(state, dispatch, "petnoc_summary")
  showHideAdhocPopups(state, dispatch, pagename)



}


const setvalue = async (state, dispatch,type) => {
let pagename = "petnoc_summary";

if(type ==="SELLMEATNOC")
{
  pagename = "applysellmeat"

}
else if(type ==="PETNOC")
{
  pagename = "petnoc_summary"

}

  dispatch(
    handleField(
      pagename,
      "components.div.children.formwizardFirstStep.children.nocDetails.children.cardContent.children.checkboxBtnContainer.children.addPenaltyRebateButton1",
      "props.checked",
      true
    )
  );
  // localStorageSet("dropdownTermsAccepted", "accept")
  dispatch(prepareFinalObject("dropdownRead", true));
  showHideAdhocPopups(state, dispatch, pagename)



}

export const getRequiredDocuments = (type) => {
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
              header_DROPDOWN
            },
            break: getBreak(),
          },
          subText1: getCommonParagraph({
            labelName: "Jhatka(goat/sheep)+Fish+Frozen/Packed/Poultry",
            labelKey: "DROPDOWN_POINT_1"
          }),
          subText2: getCommonParagraph({
            labelName: "Halal(goat/sheep)+Fish +Frozen/Packed/Poultry",
            labelKey: "DROPDOWN_POINT_2"
          }),
          subText3: getCommonParagraph({
            labelName: "Pork+Fish+Packed/Frozen/Poultry",
            labelKey: "DROPDOWN_POINT_3"
          }),
          subText4: getCommonParagraph({
            labelName: "Pork(pig) can't be combined with Jhatka or Halal",
            labelKey: "DROPDOWN_POINT_4"
          }),
          // subText5: getCommonParagraph({
          //   labelName: "Note: I here confirm that my shop fall under commercial area",
          //   labelKey: "DROPDOWN_POINT_5"
          // },
          // {
          //   style: styles.header
          // }),
          subText5 : getCommonHeader(
            {
              labelName: "Note: I here confirm that my shop fall under commercial area",
              labelKey: "DROPDOWN_POINT_5"
            },
            {
              style: styles.header
            }
          )
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

const screenConfig = {
  uiFramework: "material-ui",
  name: "applysellmeat",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    !applicationNumber ? clearlocalstorageAppDetails(state) : '';
    setapplicationType('SELLMEATNOC');
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const step = getQueryArg(window.location.href, "step");

    const userInfo = JSON.parse(getUserInfo());
    const applicantName = userInfo.hasOwnProperty('name') && userInfo.name != null ? userInfo.name : '';
    const fatherHusbandName = userInfo.hasOwnProperty('fatherOrHusbandName') && userInfo.fatherOrHusbandName != null ? userInfo.fatherOrHusbandName : '';
    dispatch(prepareFinalObject("SELLMEATNOC.applicantName", applicantName));
    dispatch(prepareFinalObject("SELLMEATNOC.fatherHusbandName", fatherHusbandName));
    //Set Module Name
    set(state, "screenConfiguration.moduleName", "opms");

    set(
      action,
      "screenConfig.components.undertakingdialog.children.popup",
      getRequiredDocuments("SELLMEATNOC")
    );
    
    // Clear local Storeage val 
    // localStorageSet("dropdownTermsAccepted", "")

    // Set MDMS Data
    getMdmsData(action, state, dispatch).then(response => {

      // Set Documents Data (TEMP)
      prepareDocumentsUploadData(state, dispatch, 'apply_sellmeat');
    // Search in case of EDIT flow
    prepareEditFlow(action, state, dispatch, applicationNumber, tenantId, step);

    let statusPAID = get(state, "screenConfiguration.preparedFinalObject.SELLMEATNOC.statusPAID", false);
    if(statusPAID){
      set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.nocDetails.children.cardContent.children.nocDetailsContainer.children.nocSought.props.disabled",
        true
      );
      set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.nocDetails.children.cardContent.children.nocDetailsContainer.children.nocSought.props.disabled",
        true
      );
    }
    // Clear Undertakking dropdown 
    // dispatch(prepareFinalObject("SELLMEATNOC.nocSought", ""));
    dispatch(prepareFinalObject("dropdownRead", false));
    dispatch(prepareFinalObject("undertaking", false));

    // set(
    //   state,
    //   "screenConfiguration.preparedFinalObject.RevenueByApplicationTypeReport[0].ToDate",
    //   new Date()
    // );
    
    });



    // Code to goto a specific step through URL
    if (step && step.match(/^\d+$/)) {
      let intStep = parseInt(step);
      set(
        action.screenConfig,
        "components.div.children.stepper.props.activeStep",
        intStep
      );
      let formWizardNames = [
        "formwizardFirstStep",
        "formwizardSecondStep"
      ];
      for (let i = 0; i < 4; i++) {
        set(
          action.screenConfig,
          `components.div.children.${formWizardNames[i]}.visible`,
          i == step
        );
        set(
          action.screenConfig,
          `components.div.children.footer.children.previousButton.visible`,
          step != 0
        );
      }
    }

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
        stepper,
        formwizardFirstStep,
        formwizardSecondStep,
        footer
      }
    },
    undertakingdialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "UnderTakingContainer",
      props: {
        open: false,
        maxWidth: "md",
        screenKey: "applysellmeat"
      },
      children: {
        popup: {}
      }
    }
  }
};

export default screenConfig;

import { getBreak, getCommonCard, getCommonContainer, getCommonTitle, getTextField, getSelectField, getPattern } from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { furnishNocResponse, getSearchResults, findItemInArrayOfObject } from "../../../../../ui-utils/commons";
import { getOPMSPattern } from "../../utils/index"
import set from "lodash/set";
import "./index.css";

export const AdvtDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Applicant Details",
      labelKey: "ADV_APPLICANT_DETAILS_NOC"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  break: getBreak(),
  AdvtApplicatantContainer: getCommonContainer({
    typeOfApplicant: {
      ...getSelectField({
        label: {
          labelName: "Type Of Applicant",
          labelKey: "ADV_TYPE_OF_APPLICANT_NOC"
        },
        optionLabel: "typeOfApplicant",
        //optionValue:"name",
        placeholder: {
          labelName: "Type Of Applicant",
          labelKey: "ADV_TYPE_OF_APPLICANT_NOC_PLACEHOLDER"
        },
        sourceJsonPath: "applyScreenMdmsData.egpm.typeOfApplicant",
        jsonPath: "ADVERTISEMENTNOC.typeOfApplicant",
        required: true,
        errorMessage: "ERR_NOC_ADV_TYPE_OF_APPLICANT",
        props: {
          className: "hr-generic-selectfield",
          optionLabel: "name"
          // hasLocalization: false
          // disabled: true
        },
        afterFieldChange: (action, state, dispatch) => {
          if (action.value !== 'FIRM_COMPANY' && action.value !== 'Firm/Company') {
            dispatch(
              handleField(
                "advertisementApply",
                "components.div.children.formwizardFirstStep.children.AdvtDetails.children.cardContent.children.AdvtApplicatantContainer.children.pan",
                "props.required", false));
            dispatch(
              handleField(
                "advertisementApply",
                "components.div.children.formwizardFirstStep.children.AdvtDetails.children.cardContent.children.AdvtApplicatantContainer.children.tan",
                "props.required", false));
            dispatch(
              handleField(
                "advertisementApply",
                "components.div.children.formwizardFirstStep.children.AdvtDetails.children.cardContent.children.AdvtApplicatantContainer.children.cin",
                "props.required", false));
            dispatch(
              handleField(
                "advertisementApply",
                "components.div.children.formwizardFirstStep.children.AdvtDetails.children.cardContent.children.AdvtApplicatantContainer.children.gstin",
                "props.required", false));
            //disabled
            dispatch(
              handleField(
                "advertisementApply",
                "components.div.children.formwizardFirstStep.children.AdvtDetails.children.cardContent.children.AdvtApplicatantContainer.children.pan",
                "props.disabled", true));
            dispatch(
              handleField(
                "advertisementApply",
                "components.div.children.formwizardFirstStep.children.AdvtDetails.children.cardContent.children.AdvtApplicatantContainer.children.tan",
                "props.disabled", true));
            dispatch(
              handleField(
                "advertisementApply",
                "components.div.children.formwizardFirstStep.children.AdvtDetails.children.cardContent.children.AdvtApplicatantContainer.children.cin",
                "props.disabled", true));
            dispatch(
              handleField(
                "advertisementApply",
                "components.div.children.formwizardFirstStep.children.AdvtDetails.children.cardContent.children.AdvtApplicatantContainer.children.gstin",
                "props.disabled", true));

            //blank value set
            dispatch(
              handleField(
                "advertisementApply",
                "components.div.children.formwizardFirstStep.children.AdvtDetails.children.cardContent.children.AdvtApplicatantContainer.children.pan",
                "props.value", ''));
            dispatch(
              handleField(
                "advertisementApply",
                "components.div.children.formwizardFirstStep.children.AdvtDetails.children.cardContent.children.AdvtApplicatantContainer.children.tan",
                "props.value", ''));

            dispatch(
              handleField(
                "advertisementApply",
                "components.div.children.formwizardFirstStep.children.AdvtDetails.children.cardContent.children.AdvtApplicatantContainer.children.cin",
                "props.value", ''));

            dispatch(
              handleField(
                "advertisementApply",
                "components.div.children.formwizardFirstStep.children.AdvtDetails.children.cardContent.children.AdvtApplicatantContainer.children.gstin",
                "props.value", ''));
          } else {

            dispatch(
              handleField(
                "advertisementApply",
                "components.div.children.formwizardFirstStep.children.AdvtDetails.children.cardContent.children.AdvtApplicatantContainer.children.pan",
                "props.required", true));
            dispatch(
              handleField(
                "advertisementApply",
                "components.div.children.formwizardFirstStep.children.AdvtDetails.children.cardContent.children.AdvtApplicatantContainer.children.tan",
                "props.required", true));
            dispatch(
              handleField(
                "advertisementApply",
                "components.div.children.formwizardFirstStep.children.AdvtDetails.children.cardContent.children.AdvtApplicatantContainer.children.cin",
                "props.required", true));
            dispatch(
              handleField(
                "advertisementApply",
                "components.div.children.formwizardFirstStep.children.AdvtDetails.children.cardContent.children.AdvtApplicatantContainer.children.gstin",
                "props.required", true));
            //disabled
            dispatch(
              handleField(
                "advertisementApply",
                "components.div.children.formwizardFirstStep.children.AdvtDetails.children.cardContent.children.AdvtApplicatantContainer.children.pan",
                "props.disabled", false));
            dispatch(
              handleField(
                "advertisementApply",
                "components.div.children.formwizardFirstStep.children.AdvtDetails.children.cardContent.children.AdvtApplicatantContainer.children.tan",
                "props.disabled", false));
            dispatch(
              handleField(
                "advertisementApply",
                "components.div.children.formwizardFirstStep.children.AdvtDetails.children.cardContent.children.AdvtApplicatantContainer.children.cin",
                "props.disabled", false));
            dispatch(
              handleField(
                "advertisementApply",
                "components.div.children.formwizardFirstStep.children.AdvtDetails.children.cardContent.children.AdvtApplicatantContainer.children.gstin",
                "props.disabled", false));
          }
        }
      }),
    },
    applicantName: {
      ...getTextField({
        label: {
          labelName: "Name Of The Applicant",
          labelKey: "ADV_NAME_OF_APPLICANT_NOC"
        },
        placeholder: {
          labelName: "Name Of The Applicant",
          labelKey: "ADV_NAME_OF_APPLICANT_NOC_PLACEHOLDER"
        },
        required: true,
        pattern: getOPMSPattern("petnocApplicantName"),
        errorMessage: "ERR_NOC_ADV_NAME_OF_APPLICANT",
        jsonPath: "ADVERTISEMENTNOC.applicantName",
      })
    },
    pan: {
      ...getTextField({
        label: {
          labelName: "PAN",
          labelKey: "ADV_PAN_NOC"
        },
        placeholder: {
          labelName: "PAN",
          labelKey: "ADV_PAN_NOC_PLACEHOLDER"
        },
        props: {
          className: "TAN-CIN-GSTIN"
        },
        required: false,
        pattern: getPattern("PAN"),
        errorMessage: "ERR_NOC_ADV_PAN",
        jsonPath: "ADVERTISEMENTNOC.pan",
      })
    },
    tan: {
      ...getTextField({
        label: {
          labelName: "TAN",
          labelKey: "ADV_TAN_NOC"
        },
        placeholder: {
          labelName: "TAN",
          labelKey: "ADV_TAN_NOC_PLACEHOLDER"
        },
        props: {
          className: "TAN-CIN-GSTIN"
        },
        required: false,
        pattern: getPattern("PAN"),
        errorMessage: "ERR_NOC_ADV_TAN",
        jsonPath: "ADVERTISEMENTNOC.tan",
      })
    },
    cin: {
      ...getTextField({
        label: {
          labelName: "CIN",
          labelKey: "ADV_CIN_NOC"
        },
        placeholder: {
          labelName: "CIN",
          labelKey: "ADV_CIN_NOC_PLACEHOLDER"
        },
        props: {
          className: "TAN-CIN-GSTIN"
        },
        required: false,
        pattern: getOPMSPattern("cin"),
        errorMessage: "ERR_NOC_ADV_CIN",
        jsonPath: "ADVERTISEMENTNOC.cin",
      })
    },
    gstin: {
      ...getTextField({
        label: {
          labelName: "GSTIN",
          labelKey: "ADV_GSTIN_NOC"
        },
        placeholder: {
          labelName: "GSTIN",
          labelKey: "ADV_GSTIN_NOC_PLACEHOLDER"
        },
        props: {
          className: "TAN-CIN-GSTIN"
        },
        required: false,
        pattern: getPattern("GSTNo"),
        errorMessage: "ERR_NOC_ADV_GST",
        jsonPath: "ADVERTISEMENTNOC.gstin",
      })
    },
    applicantAddress: {
      ...getTextField({
        label: {
          labelName: "APPLICANTADDR",
          labelKey: "ADV_APPLICANTADDR_NOC"
        },
        placeholder: {
          labelName: "APPLICANTADDR",
          labelKey: "ADV_APPLICANTADDR_NOC_PLACEHOLDER"
        },
        props:{
          
                      className:"textfield-enterable-selection",
                      multiline: true,
                      rows: "2"
                    },
        required: true,
        pattern: getOPMSPattern("TexrearAddress"),
        errorMessage: "ERR_NOC_ADV_APPLICANTADDR",
        jsonPath: "ADVERTISEMENTNOC.applicantAddress",
      })
    },
    landmark: {
      ...getTextField({
        label: {
          labelName: "Landmark",
          labelKey: "ADV_LANDMARK_NOC"
        },
        placeholder: {
          labelName: "Landmark",
          labelKey: "ADV_LANDMARK_NOC_PLACEHOLDER"
        },
        
        required: true,
        pattern: getOPMSPattern("Address"),
        errorMessage: "ERR_NOC_ADV_LANDMARK",
        jsonPath: "ADVERTISEMENTNOC.applicantLandmark",
      })
    },
    applicantDivision: {
      ...getTextField({
        label: {
          labelName: "Division",
          labelKey: "ADV_APPLDIVISION_NOC"
        },
        placeholder: {
          labelName: "Village",
          labelKey: "ADV_APPLDIVISION_NOC_PLACEHOLDER"
        },
        required: true,
        pattern: getOPMSPattern("Address"),
        errorMessage: "ERR_NOC_ADV_APPLDIVISION",
        jsonPath: "ADVERTISEMENTNOC.applicantDivision",
      })
    },
    // applicantDivision: {
    //   ...getSelectField({
        
    //     optionLabel: "name",
    //     optionValue:"name",
    //     label: {
    //     labelName: "Division",
    //     labelKey: "ADV_APPLDIVISION_NOC"
    //   },
    //   placeholder: {
    //     labelName: "Division",
    //     labelKey: "ADV_APPLDIVISION_NOC_PLACEHOLDER"
    //   },
    //     sourceJsonPath: "applyScreenMdmsData.egpm.roadCutDivision",
    //     jsonPath: "ADVERTISEMENTNOC.applicantDivision",
    //     required: true,
    //     props: {
    //       className: "hr-generic-selectfield",
    //       optionLabel: "name"
    //       // hasLocalization: false
    //       // disabled: true
    //     },
        
    //   }),
    // },
    applicantWard: {
      ...getTextField({
        label: {
          labelName: "Ward",
          labelKey: "ADV_WARD_NOC"
        },
        placeholder: {
          labelName: "WARD",
          labelKey: "ADV_WARD_NOC_PLACEHOLDER"
        },
        jsonPath: "ADVERTISEMENTNOC.applicantWard",
        required: true,
        errorMessage: "ERR_NOC_ADV_WARD",
        pattern: getOPMSPattern("Address"),
        props: {
          className: "applicant-details-error",
          required: true
          // disabled: true
        },
      }),
    },
    sector: {
      ...getSelectField({
        label: {
          labelName: "Sector",
          labelKey: "ADV_SECTOR_NOC"
        },
        optionLabel: "name",
        placeholder: {
          labelName: "Sector",
          labelKey: "ADV_SECTOR_NOC_PLACEHOLDER"
        },
        sourceJsonPath: "applyScreenMdmsData.egpm.sector",
        jsonPath: "ADVERTISEMENTNOC.sector",
        errorMessage: "ERR_NOC_ADV_SECTOR",
        required: true,
        props: {
          className: "applicant-details-error",
          required: true
          // disabled: true
        },
      }),
    },
    village: {
      ...getTextField({
        label: {
          labelName: "Village",
          labelKey: "ADV_VILLAGE_NOC"
        },
        placeholder: {
          labelName: "Village",
          labelKey: "ADV_VILLAGE_NOC_PLACEHOLDER"
        },
        required: true,
        pattern: getOPMSPattern("petnocApplicantName"),
        errorMessage: "ERR_NOC_ADV_VILLAGE",
        jsonPath: "ADVERTISEMENTNOC.applicantVillageSuSector",
      })
    },
    mobileNo: {
      ...getTextField({
        label: {
          labelName: "Mobile No",
          labelKey: "ADV_MOBILE_NOC"
        },
        placeholder: {
          labelName: "Mobile No",
          labelKey: "ADV_MOBILE_NOC_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("MobileNo"),
        errorMessage: "ERR_NOC_ADV_MOBILE",
        jsonPath: "ADVERTISEMENTNOC.mobileNo",
      })
    },
    emailId: {
      ...getTextField({
        label: {
          labelName: "Email Id",
          labelKey: "ADV_EMAILID_NOC"
        },
        placeholder: {
          labelName: "Email Id",
          labelKey: "ADV_EMAILID_NOC_PLACEHOLDER"
        },
        required: true,
        pattern: getOPMSPattern("Email"),
        errorMessage: "ERR_NOC_ADV_EMAILID",
        jsonPath: "ADVERTISEMENTNOC.emailId",
      })
    },
  })
});
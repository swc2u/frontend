import { getBreak, getCommonCard, getCommonContainer, getCommonTitle, getTextField, getSelectField, getPattern } from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults, furnishRoadcutNocResponse } from "../../../../../ui-utils/commons";
import { getOPMSPattern } from '../../utils/index'

export const nocDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Application Details",
      labelKey: "ROADCUT_NEW_NOC_DETAILS_HEADER_PET_NOC"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  break: getBreak(),
  nocDetailsContainer: getCommonContainer({
    typeOfApplicant: {
      ...getSelectField({
        label: {
          labelName: "Type Of Applicant",
          labelKey: "ROADCUT_APPLICANT_TYPE_LABEL_NOC"
        },
        // localePrefix: {
        //   moduleName: "RoadCutNOC",
        //   masterName: "RoadCutTypeOfApplicant"
        // },
        optionLabel: "name",
        placeholder: {
          labelName: "Select Type Of Applicant",
          labelKey: "ROADCUT_APPLICANT_TYPE_PLACEHOLDER"
        },
        sourceJsonPath: "applyScreenMdmsData.egpm.RoadCutTypeOfApplicant",
        jsonPath: "ROADCUTNOC.typeOfApplicant",
        errorMessage: "ERR_NOC_ROADCUT_APPLICANT_TYPE",
        required: true,
        props: {
          className: "applicant-details-error",
          required: true
          // disabled: true
        },
      })
    },
    purposeOfRoadCutting: {
      ...getSelectField({
        label: {
          labelName: "Purpose Of Road Cutting",
          labelKey: "ROADCUT_PURPOSE_OF_ROAD_CUTTING_LABEL_NOC"
        },
        // localePrefix: {
        //   moduleName: "RoadCutNOC",
        //   masterName: "purposeOfRoadCutting"
        // },
        optionLabel: "name",
        placeholder: {
          labelName: "Select Purpose Of Road Cutting",
          labelKey: "ROADCUT_PURPOSE_OF_ROAD_CUTTING_PLACEHOLDER"
        },
        sourceJsonPath: "applyScreenMdmsData.egpm.purposeOfRoadCutting",
        jsonPath: "ROADCUTNOC.purposeOfRoadCutting",
        errorMessage: "ERR_NOC_ROADCUT_PURPOSE_OF_ROAD_CUTTING",
        required: true,
        props: {
          className: "applicant-details-error",
          required: true
          // disabled: true
        },
      })
    },
    roadCutType: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "AutosuggestContainer",
      sourceJsonPath: "applyScreenMdmsData.egpm.roadCutType",
      jsonPath: "ROADCUTNOC.roadCutType",
      required: true,
      errorMessage:"ERR_NOC_ROADCUT_ROAD_CUT_TYPE",
      gridDefination: {
        xs: 12,
        sm: 6,
        md: 6
      },
      props: {
        style: {
          width: "100%",
          cursor: "pointer"
        },
        className: "citizen-city-picker",
        label: {
          labelName: "Road Cut Type",
          labelKey: "ROADCUT_ROAD_CUT_TYPE_LABEL_NOC"
        },  
        placeholder: {
          labelName: "Enter Road Cut Type",
          labelKey: "ROADCUT_ROAD_CUT_TYPE_PLACEHOLDER"
        },
        sourceJsonPath: "applyScreenMdmsData.egpm.roadCutType",
        jsonPath: "ROADCUTNOC.roadCutType",
        errorMessage:"ERR_NOC_ROADCUT_ROAD_CUT_TYPE",
        labelsFromLocalisation: false,
        suggestions: [],
        fullwidth: true,
        required: true,
        // disabled: false,
        inputLabelProps: {
          shrink: true
        },
        isMulti: true,
        labelName: "name",
        valueName: "name"
      }
    },
    // roadCutType: {
    //   ...getSelectField({
    //     label: {
    //       labelName: "Road Cut Type",
    //       labelKey: "ROADCUT_ROAD_CUT_TYPE_LABEL_NOC"
    //     },
    //     optionLabel: "name",
    //     placeholder: {
    //       labelName: "Enter Road Cut Type",
    //       labelKey: "ROADCUT_ROAD_CUT_TYPE_PLACEHOLDER"
    //     },
    //     errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
    //     sourceJsonPath: "applyScreenMdmsData.egpm.roadCutType",
    //     jsonPath: "ROADCUTNOC.roadCutType",
    //     errorMessage: "ERR_NOC_ROADCUT_ROAD_CUT_TYPE",
    //     required: true,
    //     props: {
    //       className: "applicant-details-error",
    //       required: true
    //     }
    //   })
    // },
    // roadCutType: {
    //   ...getTextField({
    //     label: {
    //       labelName: "Road Cut Type",
    //       labelKey: "ROADCUT_ROAD_CUT_TYPE_LABEL_NOC"
    //     },
    //     placeholder: {
    //       labelName: "Enter Road Cut Type",
    //       labelKey: "ROADCUT_ROAD_CUT_TYPE_PLACEHOLDER"
    //     },
    //     pattern: getOPMSPattern("typeofroadcut"),
    //     errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
    //     required: false,
    //     jsonPath: "ROADCUTNOC.roadCutType"
    //   })
    // },
    applicantName: {
      ...getTextField({
        label: {
          labelName: "Applicant Name/ Authorize Signatory",
          labelKey: "ROADCUT_APPLICANT_NAME_LABEL_NOC"
        },
        placeholder: {
          labelName: "Enter Applicant Name",
          labelKey: "ROADCUT_APPLICANT_NAME_PLACEHOLDER"
        },
        pattern: getOPMSPattern("petnocApplicantName"),
        errorMessage: "ERR_NOC_ROADCUT_APPLICANT_NAME",
        required: true,
        jsonPath: "ROADCUTNOC.applicantName"
      })
    },
    gstin: {
      ...getTextField({
        label: {
          labelName: "GSTIN",
          labelKey: "ROADCUT_GSTIN_NOC"
        },
        placeholder: {
          labelName: "GSTIN",
          labelKey: "ROADCUT_GSTIN_NOC_PLACEHOLDER"
        },
        props: {
          className: "TAN-CIN-GSTIN"
        },
        required: false,
        pattern: getPattern("GSTNo"),
        errorMessage: "ERR_NOC_ROADCUT_GSTIN_NOC",
        jsonPath: "ROADCUTNOC.gstin",
      })
    },
      applicantDivision: {
      ...getSelectField({
        
        optionLabel: "name",
        optionValue:"name",
        label: {
          labelName: "Division",
          labelKey: "ROADCUT_DIVISION_NOC"
        },
        placeholder: {
          labelName: "Enter Division",
          labelKey: "ROADCUT_DIVISION_PLACEHOLDER"
        },
        sourceJsonPath: "applyScreenMdmsData.egpm.roadCutDivision",
        jsonPath: "ROADCUTNOC.division",
        errorMessage: "ERR_NOC_ROADCUT_DIVISION",
        required: true,
        disabled: true,
        props: {
          className: "hr-generic-selectfield",
          optionLabel: "name",
          // hasLocalization: false
          disabled: true,

        },
        
      }),
    },
    ward: {
      ...getTextField({
        label: {
          labelName: "Ward",
          labelKey: "ROADCUT_WARD_NOC"
        },
        placeholder: {
          labelName: "Enter Ward",
          labelKey: "ROADCUT_WARD_PLACEHOLDER"
        },
        required: false,
        pattern: getOPMSPattern("Division"),
        errorMessage: "ERR_NOC_ROADCUT_WARD",
        jsonPath: "ROADCUTNOC.ward"
      })
    },
    sector: {
      ...getSelectField({
        label: { labelName: "Sector", labelKey: "ROADCUT_PROPERTY_SECTOR_LABEL_NOC" },
        optionLabel: "name",
        placeholder: {
          labelName: "Select Sector",
          labelKey: "ROADCUT_PROPERTY_SECTOR_LABEL_NOC"
        },
        //sourceJsonPath: "applyScreenMdmsData.egpm.sector",
        sourceJsonPath: "applyScreenMdmsData.egpm.sector",
        jsonPath: "ROADCUTNOC.sector",
        errorMessage: "ERR_NOC_ROADCUT_SECTOR",
        required: true,
        props: {
          className: "applicant-details-error",
          required: true
          // disabled: true
        },
        afterFieldChange: (action, state, dispatch) => {
          try {
            

            let divisionData =
              get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData.egpm.sector", []).find(
                item => item.code === action.value
              );

            dispatch(
              prepareFinalObject(
                "ROADCUTNOC.division", divisionData.division
              )
            );

            dispatch(
              handleField(
                "applyroadcuts",
                "components.div.children.formwizardFirstStep.children.nocDetails.children.cardContent.children.nocDetailsContainer.children.applicantDivision",
                "props.value", divisionData.division));
 
          } catch (e) {
            console.log(e);
          }
        }
      }),
    },
    requestedLocation: {
      ...getTextField({
        label: {
          labelName: "Requested Location",
          labelKey: "ROADCUT_REQUESTED_LOCATION_NOC"
        },
        placeholder: {
          labelName: "Enter Requested Location",
          labelKey: "ROADCUT_REQUESTED_LOCATION_PLACEHOLDER"
        },
        required: false,
        errorMessage: "ERR_NOC_ROADCUT_REQUESTED_LOCATION",
         pattern: getOPMSPattern("Address"),
        jsonPath: "ROADCUTNOC.requestedLocation"
      })
    },
    landmark: {
      ...getTextField({
        label: {
          labelName: "Landmark",
          labelKey: "ROADCUT_LANDMARK_NOC"
        },
        placeholder: {
          labelName: "Enter Landmark",
          labelKey: "ROADCUT_LANDMARK_PLACEHOLDER"
        },
        required: true,
        pattern: getOPMSPattern("Address"),
        errorMessage: "ERR_NOC_ROADCUT_LANDMARK",
        jsonPath: "ROADCUTNOC.landmark"
      })
    },
    length: {
      ...getTextField({
        label: {
          labelName: "Length",
          labelKey: "ROADCUT_LENGTH_LABEL_NOC"

        },
        localePrefix: {
          moduleName: "egpm",
          masterName: "length"
        },
        optionLabel: "name",
        placeholder: {
          labelName: "Select Length",
          labelKey: "ROADCUT_LENGTH_PLACEHOLDER"
        },
        sourceJsonPath: "applyScreenMdmsData.egpm.length",
        jsonPath: "ROADCUTNOC.length",
        required: true,
        errorMessage: "ERR_NOC_ROADCUT_LENGTH",
		    pattern: getOPMSPattern("Length"),
        props: {
          className: "applicant-details-error",
          required: true
          // disabled: true
        },
      })
    }
  })
});
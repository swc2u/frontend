import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getSelectField,
  getCommonContainer,
  getCommonParagraph,
  getPattern,
  getDateField,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { searchApiCall } from "./functions";
import { resetFieldsForApplication } from '../../utils';
import get from "lodash/get";
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
export const searchApplications = getCommonCard({
  subHeader: getCommonTitle({
    labelKey: "WS_SEARCH_APPLICATION_SUB_HEADER"
  }),
  subParagraph: getCommonParagraph({
    labelKey: "WS_HOME_SEARCH_RESULTS_DESC"
  }),
  wnsApplicationSearch: getCommonContainer({
    consumerNo: getTextField({
      label: {
        labelKey: "WS_HOME_SEARCH_RESULTS_CONSUMER_NO_LABEL"
      },
      placeholder: {
        labelKey: "WS_HOME_SEARCH_RESULTS_CONSUMER_NO_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: false,
      pattern: getPattern("consumerNo"),
      errorMessage: "ERR_INVALID_CONSUMER_NO",
      jsonPath: "searchScreen.connectionNumber"
    }),
    applicationNo: getTextField({
      label: {
        labelKey: "WS_ACK_COMMON_APP_NO_LABEL"
      },
      placeholder: {
        labelKey: "WS_HOME_SEARCH_RESULTS_APP_NO_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: false,
      pattern: /^[a-zA-Z0-9-_/]*$/i,
      errorMessage: "ERR_INVALID_APPLICATION_NO",
      jsonPath: "searchScreen.applicationNumber"
    }),

    ownerMobNo: getTextField({
      label: {
        labelKey: "WS_HOME_SEARCH_RESULTS_OWN_MOB_LABEL"
      },
      placeholder: {
        labelKey: "WS_HOME_SEARCH_RESULTS_OWN_MOB_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      iconObj: {
        label: "+91 |",
        position: "start"
      },
      required: false,
      pattern: getPattern("MobileNo"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "searchScreen.mobileNumber"
    }),
    // applicationType: getSelectField({
    //   label: { labelName: "To Date", labelKey: "WS_APPLICATION_TYPE_LABEL" },
    //   placeholder: { labelName: "Select to Date", labelKey: "WS_COMMON_APPLICATION_TYPE_PLACEHOLDER" },
    //   sourceJsonPath: "applyScreenMdmsData.searchScreen.applicationType",
    //   jsonPath: "searchScreen.appType",
    //   gridDefination: { xs: 12, sm: 4 },
    //   required: false
    // }),
    applicationstatus: getSelectField({
      label: {
        labelKey: "WS_HOME_SEARCH_RESULTS_APP_STATUS_LABEL"
      },
      placeholder: {
        labelKey: "WS_HOME_SEARCH_RESULTS_APP_STATUS_PLACEHOLDER"
      },
      required: false,
      sourceJsonPath: "applyScreenMdmsData.searchScreen.applicationStatus",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: false,
      errorMessage: "ERR_INVALID_BILLING_PERIOD",
      jsonPath: "searchScreen.applicationStatus"
    }),

    fromDate: getDateField({
      label: { labelName: "From Date", labelKey: "WS_COMMON_FROM_DATE_LABEL" },
      placeholder: {
        labelName: "Select From Date",
        labelKey: "WS_FROM_DATE_PLACEHOLDER"
      },
      jsonPath: "searchScreen.fromDate",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: false,
      pattern: getPattern("Date"),
      errorMessage: "ERR_INVALID_DATE"
    }),

    toDate: getDateField({
      label: { labelName: "To Date", labelKey: "WS_COMMON_TO_DATE_LABEL" },
      placeholder: {
        labelName: "Select to Date",
        labelKey: "WS_COMMON_TO_DATE_PLACEHOLDER"
      },
      jsonPath: "searchScreen.toDate",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      pattern: getPattern("Date"),
      errorMessage: "ERR_INVALID_DATE",
      required: false
    }),
    // applicationType: getSelectField({
    //   label: { labelName: "To Date", labelKey: "WS_APPLICATION_TYPE_LABEL" },
    //   placeholder: { labelName: "Select to Date", labelKey: "WS_COMMON_APPLICATION_TYPE_PLACEHOLDER" },
    //   sourceJsonPath: "applyScreenMdmsData.searchScreen.applicationType",
    //   jsonPath: "searchScreen.applicationType",
    //   gridDefination: { xs: 12, sm: 4 },
    //   required: false
    // }),
    applicationType : getSelectField({
      label: { labelKey: "WS_APPLICATION_TYPE_LABEL" },
      sourceJsonPath: "applyScreenMdmsData.searchScreen.applicationType",
      placeholder: { labelKey: "WATER_APPLICATION_TYPE_PLACEHOLDER" },
      required: true,
      gridDefination: { xs: 12, sm: 4 },
      jsonPath: "searchScreen.applicationType",
      props: {
        optionValue: "code",
        optionLabel: "name",
       
      
    },
    beforeFieldChange: async (action, state, dispatch) => {
      dispatch(
        handleField(
          "search",
          "components.div.children.showSearches.children.showSearchScreens.props.tabs[1].tabContent.searchApplications.children.cardContent.children.wnsApplicationSearch.children.sectorNo",
          "props.value",
          ""
        )
      );
      if(action.value)
      {
        let swSectorList = state.screenConfiguration.preparedFinalObject.applyScreenMdmsData1['ws-services-masters'].swSectorList
        let sectorList = state.screenConfiguration.preparedFinalObject.applyScreenMdmsData1['ws-services-masters'].sectorList
       // get(state.screenConfiguration.preparedFinalObject, "SewerageConnection");
        if(action.value ==='New Sewerage Connection')
        {
          dispatch(prepareFinalObject("applyScreenMdmsData1.ws-services-masters.wssectorList", swSectorList));
        }
        else{
          dispatch(prepareFinalObject("applyScreenMdmsData1.ws-services-masters.wssectorList", sectorList));

        }
      }
       
   }
    }),

    sectorNo : getSelectField({
      label: { labelName: "Sector/Locality", labelKey: "WS_PROP_DETAIL_LOCALITY_MOHALLA_LABEL_INPUT" },
      placeholder: {
        labelName: "Select Sector/Locality",
        labelKey: "WS_PROP_DETAIL_LOCALITY_MOHALLA_LABEL_INPUT_PLACEHOLDER"
      },
      sourceJsonPath: "applyScreenMdmsData1.ws-services-masters.wssectorList",
      placeholder: { labelKey: "WATER_APPLICATION_TYPE_PLACEHOLDER" },
      required: false,
      gridDefination: { xs: 12, sm: 4 },
      jsonPath: "searchScreen.sectorNo",
      props: {
        optionValue: "code",
        optionLabel: "name",
       
      
    },
    beforeFieldChange: async (action, state, dispatch) => {
      if(action.value)
      {

      }
       
   }
    }),
    groupNo: getTextField({
      label: {
        labelKey: "WS_GROUP_NUMBER_INPUT"
      },
      placeholder: {
        labelKey: "WS_GROUP_NUMBER_INPUT_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      
      required: false,
     // pattern: getPattern("MobileNo"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "searchScreen.groupNo"
    }),
    plotNo: getTextField({
      label: {
        labelKey: "WS_PROP_DETAIL_DHNO_INPUT"
      },
      placeholder: {
        labelKey: "WS_PROP_DETAIL_DHNO_INPUT_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      
      required: false,
     // pattern: getPattern("MobileNo"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "searchScreen.plotNo"
    }),
  }),

  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      resetButton: {
        componentPath: "Button",
        gridDefination: { xs: 12, sm: 6 },
        props: {
          variant: "outlined",
          style: {
            color: "rgba(0, 0, 0, 0.6000000238418579)",
            borderColor: "rgba(0, 0, 0, 0.6000000238418579)",
            width: "220px",
            height: "48px",
            margin: "8px",
            float: "right"
          }
        },
        children: { buttonLabel: getLabel({ labelKey: "WS_SEARCH_CONNECTION_RESET_BUTTON" }) },
        onClickDefination: {
          action: "condition",
          callBack: resetFieldsForApplication
        }
      },
      searchButton: {
        componentPath: "Button",
        gridDefination: { xs: 12, sm: 6 },
        props: {
          variant: "contained",
          style: {
            color: "white",
            margin: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
            borderRadius: "2px",
            width: "220px",
            height: "48px"
          }
        },
        children: { buttonLabel: getLabel({ labelKey: "WS_SEARCH_CONNECTION_SEARCH_BUTTON" }) },
        onClickDefination: {
          action: "condition",
          callBack: searchApiCall
        }
      },
    })
  })
});

import { getCommonCard, getCommonContainer, getDateField, getLabel, getPattern,} from "egov-ui-framework/ui-config/screens/specs/utils";
// import { searchAPICall, SearchDashboardData, SearchPGRDashboardData } from "./functions";
import { SearchHCDashboardData } from "./HCFunction";
import get from "lodash/get";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import './index.css';

export const HCDashboardFilterForm = getCommonCard({
  FilterConstraintsContainer: getCommonContainer({
    fromDate: getDateField({
      label: { labelName: "From Date", labelKey: "DASHBOARD_FROM_DATE_LABEL" },
      placeholder: {
        labelName: "",
        labelKey: "Select From Date"
      },
      gridDefination: {
        xs: 6,
        sm: 2,
        md: 2
      },
      pattern: getPattern("Date"),
      jsonPath: "HCdahsboardHome.defaultFromDate",
      required: true,
      beforeFieldChange: (action, state, dispatch) => {
        debugger;
        const data = "data"
      },
      afterFieldChange: (action, state, dispatch) => {
        debugger;
        var dt = new Date();
        var year= dt.getFullYear();
        var month = parseInt(dt.getMonth()+1) < 10 ? "0"+parseInt(dt.getMonth()+1) : parseInt(dt.getMonth()+1);
        var currentDt = dt.getDate() < 10 ? "0"+dt.getDate() : dt.getDate();
        var todayDt = year+"-"+month+"-"+currentDt;
        dispatch(
          handleField(
            "HCDashboard",
            "components.div.children.HCDashboardFilterForm.children.cardContent.children.FilterConstraintsContainer.children.toDate",
            "props.inputProps.max",
            todayDt
          )
        );

        var selectedDt = get(state, "screenConfiguration.preparedFinalObject.HCdahsboardHome.defaultFromDate",'')
        dispatch(
          handleField(
            "HCDashboard",
            "components.div.children.HCDashboardFilterForm.children.cardContent.children.FilterConstraintsContainer.children.toDate",
            "props.inputProps.min",
            selectedDt
          )
        );

        }
    }),
    toDate: getDateField({
      label: { labelName: "To Date", labelKey: "DASHBOARD_TO_DATE_LABEL" },
      placeholder: {
        labelName: "To Date",
        labelKey: "Select To Date"
      },
      props: {
        inputProps: {
          min: ''
        }
      },
      gridDefination: {
        xs: 6,
        sm: 2,
        md: 2
      },
      pattern: getPattern("Date"),
      jsonPath: "HCdahsboardHome.defaulttoDate",
      required: true,
    }),
    moduleDashboardDropdown: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-dashboard",
      componentPath: "AutosuggestContainer",
      jsonPath: "HCdahsboardHome.dropDownData2",
      required: true,
      gridDefination: {
            xs: 6,
            sm: 2,
            md: 2
          },
      props: {
        style: {
        width: "100%",
        cursor: "pointer"
      },
  
      className: "citizen-city-picker",
      label: { labelName: "Report Type", labelKey: "DASHBOARD_DROPDOWN_REPORT_TYPE_LABEL" },
      placeholder: {
        labelName: "",
        labelKey: "Select Module"
      },
      sourceJsonPath: "HCdahsboardHome.dropDownData",
      jsonPath: "HCdahsboardHome.dropDownData2",
      maxLength:5,
      labelsFromLocalisation: false,
      suggestions: [],
      fullwidth: true,
      // required: true,
      inputLabelProps: {
        shrink: true
      },
      isMulti: false,
      labelName: "name",
      valueName: "name"
      },
    
    },
    searchButton: {
      componentPath: "Button",
      gridDefination: {
        xs: 6,
        sm: 2,
        md: 2
      },
      props: {
        variant: "contained",
        color: "primary",
        style: {
        width: "75%",
        height: "55px",
        /* margin-right: 80px; */
        // marginLeft: "90%"
        }
      },
      children: {
        buttonLabel: getLabel({
          labelName: "Search",
          labelKey: "DASHBOARD_SEARCH_BTN_LABEL"
        })
      },
      onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
          SearchHCDashboardData(state, dispatch)
        }
      }
    },
  })
});

export const HCDashboardResults = {
  uiFramework: "custom-molecules-local",
  moduleName: "egov-dashboard",
  componentPath: "HCDashboard",
  props: {
  // className: "dashboard-graph",
  formKey: `newapplication`,
  data : []
  },
  style: {
  },
  visible: true,
}
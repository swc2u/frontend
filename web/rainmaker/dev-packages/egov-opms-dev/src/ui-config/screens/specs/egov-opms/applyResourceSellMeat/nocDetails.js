import {  getBreak, getLabel, getCommonParagraph, getCommonCard,  getCommonContainer,  getCommonTitle,  getTextField,  getSelectField,  getPattern} from "egov-ui-framework/ui-config/screens/specs/utils";
import {  handleScreenConfigurationFieldChange as handleField,  prepareFinalObject} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/get";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {  furnishNocResponse,  getSearchResults} from "../../../../../ui-utils/commons";
import { getOPMSPattern, showHideAdhocPopups } from "../../utils/index"

// const showHideAdhocPopups = (state, dispatch, screenKey) => {

//   //alert(JSON.stringify( state.screenConfiguration.screenConfig[screenKey]))

//   let toggle = get(
//     state.screenConfiguration.screenConfig[screenKey],
//     "components.undertakingdialog.props.open",
//     false
//   );
//   dispatch(
//     handleField(screenKey, "components.undertakingdialog", "props.open", !toggle)
//   );
// };

export const nocDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Application Details",
      labelKey: "SELLMEATNOC_NEW_NOC_DETAILS_HEADER_PET_NOC"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  break: getBreak(),
  nocDetailsContainer: getCommonContainer({
 applicantName: {
    ...getTextField({
      label: {
        labelName: "Applicant Name",
        labelKey: "SELLMEAT_APPLICANT_NAME_LABEL_NOC"
      },
      placeholder: {
        labelName: "Enter Applicant Name",
        labelKey: "SELLMEAT_APPLICANT_NAME_PLACEHOLDER"
      },
      pattern: getOPMSPattern("petnocApplicantName"),
      errorMessage: "ERR_NOC_SELLMEAT_APPLICANT_NAME_LABEL",
      required: true,      
      jsonPath:"SELLMEATNOC.applicantName"
    })
  },
  fatherHusbandName:{
    ...getTextField({
       label:{
          labelName:"fatherHusbandName",
          labelKey:"SELLMEAT_FATHERHUSBANDNAME_NOC"
       },
       placeholder:{
          labelName:"Enter fatherHusbandName",
          labelKey:"SELLMEAT_FATHERHUSBANDNAME_PLACEHOLDER"
       },
       required:true,
       pattern:getOPMSPattern("petnocApplicantName"),
       errorMessage:"ERR_NOC_SELLMEAT_FATHERHUSBANDNAME",
       jsonPath:"SELLMEATNOC.fatherHusbandName"
    })
  },
  mobileNo:{
    ...getTextField({
       label:{
          labelName:"mobileNo",
          labelKey:"SELLMEAT_MONILENO_NOC"
       },
       placeholder:{
          labelName:"Enter Mobile No",
          labelKey:"SELLMEAT_MOBILENO_PLACEHOLDER"
       },
       required:true,
       pattern:getOPMSPattern("NOCMobileNo"),
       errorMessage:"ERR_NOC_SELLMEAT_MOBILENO",
       jsonPath:"SELLMEATNOC.mobileNumber"
    })
  },
  houseNo:{
    ...getTextField({
       label:{
          labelName:"houseNo",
          labelKey:"SELLMEAT_HOUSENO_NOC"
       },
       placeholder:{
          labelName:"Enter HouseNo",
          labelKey:"SELLMEAT_HOUSENO_PLACEHOLDER"
       },
       required:true,
       pattern:getOPMSPattern("DoorHouseNo"),
       errorMessage:"ERR_NOC_SELLMEAT_HOUSENO",
       jsonPath:"SELLMEATNOC.houseNo"
    })
  },
  nocSought: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-opms",
    componentPath: "AutosuggestContainer",
    sourceJsonPath: "applyScreenMdmsData.egpm.nocSought",
    jsonPath: "SELLMEATNOC.nocSought",
    required: true,
    errorMessage:"ERR_NOC_SELLMEAT_NOCSOUGHT_LABEL",
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
        labelName: "nocSought",
        labelKey: "SELLMEAT_NOCSOUGHT_LABEL_NOC"
      },  
      placeholder: {
        labelName: "Select nocSought",
        labelKey: "SELLMEAT_NOCSOUGHT_PLACEHOLDER"
      },
      sourceJsonPath: "applyScreenMdmsData.egpm.nocSought",
      jsonPath: "SELLMEATNOC.nocSought",
      errorMessage:"ERR_NOC_SELLMEAT_NOCSOUGHT_LABEL",
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
    },
    
    beforeFieldChange: (action, state, dispatch) => {
      var data = get(state.screenConfiguration.preparedFinalObject, "applyScreenMdmsData.egpm.nocSought", {});
      if(data.length >= 4){
        dispatch(prepareFinalObject("applyScreenMdmsData.egpm.dumpNocSought", data));
      }
    },
    afterFieldChange: (action, state, dispatch) => {   
      var dumpData = get(state.screenConfiguration.preparedFinalObject, "applyScreenMdmsData.egpm.dumpNocSought", []);
      var data = []; 
      var selectedDropdown = get(state.screenConfiguration.preparedFinalObject,"SELLMEATNOC.nocSought[0].value","");
      // if(dumpData.length >= 4){
      //   dispatch(prepareFinalObject("applyScreenMdmsData.egpm.dumpNocSought", data));
      // }
      if(selectedDropdown === ""){
        dispatch(prepareFinalObject("applyScreenMdmsData.egpm.nocSought", dumpData));
      }
      if(selectedDropdown === "JHATKA_MEAT_SHEEP_GOAT_POULTRY"){
        data = [];
        data = data.concat(dumpData[0])
        data = data.concat(dumpData[3])
        data = data.concat(dumpData[4])
        dispatch(prepareFinalObject("applyScreenMdmsData.egpm.nocSought", data));
      }
      if(selectedDropdown === "HALAL_MEAT_SHEEP_GOAT_POULTRY"){
        data = [];
        data = data.concat(dumpData[1])
        data = data.concat(dumpData[3])
        data = data.concat(dumpData[4])
        dispatch(prepareFinalObject("applyScreenMdmsData.egpm.nocSought", data));
      }
      if(selectedDropdown === "PIG"){
        data = [];
        data = data.concat(dumpData[2])
        data = data.concat(dumpData[3])
        data = data.concat(dumpData[4])
        dispatch(prepareFinalObject("applyScreenMdmsData.egpm.nocSought", data));
      }
      
    }
  },
  shopNumber:{
    ...getTextField({
       label:{
          labelName:"Shop Number",
          labelKey:"SELLMEAT_SHOPNO_NOC"
       },
       placeholder:{
          labelName:"Enter Shop Number",
          labelKey:"SELLMEAT_SHOPNO_PLACEHOLDER"
       },
       required:true,
       pattern:getPattern("DoorHouseNo"),
       errorMessage:"ERR_NOC_SELLMEAT_SHOPNO",
       jsonPath:"SELLMEATNOC.shopNumber"
    })
  },
  wardDetails:{
    ...getTextField({
       label:{
          labelName:"Ward Details",
          labelKey:"SELLMEAT_WARD_NOC"
       },
       placeholder:{
          labelName:"Enter Ward Details",
          labelKey:"SELLMEAT_WARD_PLACEHOLDER"
       },
       required:false,
       pattern:getPattern("DoorHouseNo"),
       errorMessage:"ERR_NOC_SELLMEAT_WARD",
       jsonPath:"SELLMEATNOC.ward"
    })
  },
  division:{
    ...getTextField({
       label:{
          labelName:"Division Details",
          labelKey:"SELLMEAT_DIVISION_LABEL_NOC"
       },
       placeholder:{
          labelName:"Enter Division",
          labelKey:"SELLMEAT_DIVISION_PLACEHOLDER"
       },
       required:false,
       pattern:getPattern("DoorHouseNo"),
       errorMessage:"ERR_SELLMEAT_DIVISION",
       jsonPath:"SELLMEATNOC.division"
    })
  },
  sector: {
    ...getSelectField({
      label: {
        labelName: "sector",
        labelKey: "SELLMEAT_SECTOR_LABEL_NOC"
      },     
      optionLabel: "name",
      placeholder: {
        labelName: "Select Sector",
        labelKey: "SELLMEAT_SECTOR_PLACEHOLDER"
      },
      sourceJsonPath: "applyScreenMdmsData.egpm.sector",
      jsonPath: "SELLMEATNOC.sector",
      required: true,
      errorMessage:"ERR_SELLMEAT_SECTOR",

      props: {
        className: "applicant-details-error",
        required: true
        // disabled: true
      },
    })
  },
  // nocSought: {
  //   ...getSelectField({
  //     label: {
  //       labelName: "nocSought",
  //       labelKey: "SELLMEAT_NOCSOUGHT_LABEL_NOC"
  //     },
  //     optionLabel: "name",
  //     placeholder: {
  //       labelName: "Select nocSought",
  //       labelKey: "SELLMEAT_NOCSOUGHT_PLACEHOLDER"
  //     },
  //     sourceJsonPath: "applyScreenMdmsData.egpm.nocSought",
  //     jsonPath: "SELLMEATNOC.nocSought",
  //     required: true,
  //     errorMessage:"ERR_NOC_SELLMEAT_NOCSOUGHT_LABEL",
  //     props: {
  //       className: "applicant-details-error",
  //       // disabled: true,
	// 	required: true,
  //     },
  //   })
  //   },

  }),
  checkboxDropdownContainer :getCommonContainer({

    downloadcard: {
      uiFramework: "custom-molecules-local",
      moduleName: "egov-opms",
      componentPath: "SampleDownloadForSellMeatDropdownCombo",
  
      visible: true,
    },
  
  }),
  checkboxBtnContainer : getCommonContainer({
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
        callBack: (state, dispatch) => showHideAdhocPopups(state, dispatch, "applysellmeat")
      },
      //checked:true,
      // visible: localStorageGet('app_noc_status') === "DRAFT" ? true : false,
      visible: true,
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
        callBack: (state, dispatch) => showHideAdhocPopups(state, dispatch, "applysellmeat")
      },
      visible: true,
    }
    })
});


import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getSelectField,
  getCommonContainer,
  getLabelWithValue,
  getCommonParagraph,
  getPattern,
  getDateField,
  getLabel,
  getBreak,
  getCommonHeader,
  getCommonGrayCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
//   import { searchApiCall } from "./functions";
import {commonConfig ,}from "config/common.js";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getHeaderSideText,handleNA } from "../../utils";
import get from 'lodash/get';
import { httpRequest } from '../../../../../ui-utils/index';
import set from 'lodash/set';
//smsconnection
const Setconnection = async (state, dispatch) => {
  let fourdigitNumber = get(state, "screenConfiguration.preparedFinalObject.applyScreen.waterApplication.fourdigitNumber");
  let twodigitNumber = get(state, "screenConfiguration.preparedFinalObject.applyScreen.waterApplication.twodigitNumber");
  let numberOfMeterNumber = get(state, "screenConfiguration.preparedFinalObject.applyScreen.waterApplication.numberOfMeterNumber");
  let DIV_ = get(state, "screenConfiguration.preparedFinalObject.applyScreen.div",'1');
  let subdivision = get(state, "screenConfiguration.preparedFinalObject.applyScreen.subdiv",'1');
  let ledgerGroup = get(state, "screenConfiguration.preparedFinalObject.applyScreen.ledgerGroup",'0101');
  let IvalidfourdigitNumber = get(state.screenConfiguration.screenConfig["apply"], "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.ConnectionNumberContainer.children.cardContent.children.connectionAccountDetails.children.fourdigitNumber.isFieldValid",false)
  let IvalidtwodigitNumber = get(state.screenConfiguration.screenConfig["apply"], "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.ConnectionNumberContainer.children.cardContent.children.connectionAccountDetails.children.twodigitNumber.isFieldValid",false)
  let IvalidnumberOfMeterNumber = get(state.screenConfiguration.screenConfig["apply"], "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.ConnectionNumberContainer.children.cardContent.children.connectionAccountDetails.children.numberOfMeterNumber.isFieldValid",false)
  let connectionNoUI = `${DIV_}-${subdivision}-${ledgerGroup}-XXXX-XX`
  if(fourdigitNumber === undefined || fourdigitNumber ==='')
  {
    dispatch(
      toggleSnackbar(
        true, {
        labelKey: "WS_FILL_HOUSE_NO_VALIDATION_FIELDS",
        labelName: "Please fill House No"
      },
        "warning"
      )
    );
    //return;
  }
  else if(twodigitNumber === undefined || twodigitNumber ==='')
  {
    dispatch(
      toggleSnackbar(
        true, {
        labelKey: "WS_FILL_NOF_VALIDATION_FIELDS",
        labelName: "Please fill Floor number"
      },
        "warning"
      )
    );
    //return;
      }
  else if(numberOfMeterNumber === undefined || numberOfMeterNumber ==='')
  {
    dispatch(
      toggleSnackbar(
        true, {
        labelKey: "WS_FILL_NOM_VALIDATION_FIELDS",
        labelName: "Please fill No. of meters"
      },
        "warning"
      )
    );
    //return;
  }
  if(IvalidfourdigitNumber=== false || fourdigitNumber ==='')
  {
    dispatch(
      toggleSnackbar(
        true, {
        labelKey: "ERR_HOUSE_NO_VALIDATION_FIELDS_MSG",
        labelName: "Please enter valid house no"
      },
        "warning"
      )
    );
    return
  }
   if(IvalidtwodigitNumber===false || twodigitNumber ==='')
  {
    dispatch(
      toggleSnackbar(
        true, {
        labelKey: "ERR_NOF_VALIDATION_FIELDS_MSG",
        labelName: "Please enter valid floor number"
      },
        "warning"
      )
    );
    return
  }
  if(IvalidnumberOfMeterNumber===false || numberOfMeterNumber ==='')
  {
    dispatch(
      toggleSnackbar(
        true, {
        labelKey: "ERR_NOM_VALIDATION_FIELDS_MSG",
        labelName: "Please enter valid no. of meters"
      },
        "warning"
      )
    );
    return
  }
   if(fourdigitNumber && fourdigitNumber!=='')
  {
    connectionNoUI = `${DIV_}-${subdivision}-${ledgerGroup}`
    dispatch(prepareFinalObject("applyScreen.connectionNoUI",`${connectionNoUI}-${fourdigitNumber.toUpperCase()}-XX`));
  }
   if(fourdigitNumber && fourdigitNumber!=='' && twodigitNumber && twodigitNumber!=='' )
  {
    connectionNoUI = `${DIV_}-${subdivision}-${ledgerGroup}`
    dispatch(prepareFinalObject("applyScreen.connectionNoUI",`${connectionNoUI}-${fourdigitNumber.toUpperCase()}-${twodigitNumber.toUpperCase()}X`));
  }
   if(numberOfMeterNumber && numberOfMeterNumber!=='' && fourdigitNumber && fourdigitNumber!=='' && twodigitNumber && twodigitNumber!=='' )
  {
    connectionNoUI = `${DIV_}-${subdivision}-${ledgerGroup}`
    dispatch(prepareFinalObject("applyScreen.connectionNoUI",`${connectionNoUI}-${fourdigitNumber.toUpperCase()}-${twodigitNumber.toUpperCase()}${numberOfMeterNumber}`));
    let connectionNo =`${DIV_}${subdivision}${ledgerGroup}`
    dispatch(prepareFinalObject("applyScreen.connectionNo",`${connectionNo}${fourdigitNumber.toUpperCase()}${twodigitNumber.toUpperCase()}${numberOfMeterNumber}`));
  }

  

}
const smsNotification = async (state, dispatch) => {

}
const getPlumberRadioButton = {
  uiFramework: "custom-containers-local",
  moduleName: "egov-wns",
  componentPath: "RadioGroupContainer",
  gridDefination: { xs: 12, sm: 12 },
  jsonPath: "applyScreen.additionalDetails.detailsProvidedBy",
  props: {
    label: { key: "WS_ADDN_DETAILS_PLUMBER_PROVIDED_BY" },
    buttons: [
      { labelKey: "WS_PLUMBER_ULB", value: "ULB" },
      { labelKey: "WS_PLUMBER_SELF", value: "Self" },
    ],
    required: false
  },
  type: "array"
};
let IsEdit = false;

export const additionDetails =(Disabled)=> getCommonCard({
  header: getCommonHeader({
    labelKey: "WS_COMMON_ADDN_DETAILS_HEADER"
  }),
  connectiondetailscontainer: getCommonGrayCard({
    subHeader: getCommonTitle({
      labelKey: "WS_COMMON_CONNECTION_DETAILS"
    }),

    connectionDetails: getCommonContainer({
      division: getSelectField({
        label: { labelKey: "WS_SERV_DETAIL_DIVISION" },
        placeholder: { labelKey: "WS_SERV_DETAIL_DIVISION_PLACEHOLDER" },
        gridDefination: { xs: 12, sm: 6 },
        required: true,
        sourceJsonPath: "applyScreenMdmsData.ws-services-masters.Division",
        jsonPath: "applyScreen.div",
        props: {         
          disabled: false
        },
       // pattern: /^[0-9]*$/i,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
      }),
      subdiv: getTextField({
        label: { labelKey: "WS_SERV_DETAIL_SUB_DIVISION" },
        placeholder: { labelKey: "WS_SERV_DETAIL_SUB_DIVISION_PLACEHOLDER" },
        gridDefination: { xs: 12, sm: 6 },
        //sourceJsonPath: "applyScreenMdmsData.ws-services-masters.subDivision",
        jsonPath: "applyScreen.subdiv",
        props: {         
          disabled: true
        },
       // pattern: /^[0-9]*$/i,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
      }),
      billGroup: {
        ...getSelectField({
         // ...getTextField({
          label: { labelKey: "WS_SERV_DETAIL_BILL_GROUP" },
          placeholder: { labelKey: "WS_SERV_DETAIL_BILL_GROUP_PLACEHOLDER" },
          required: true,
         sourceJsonPath: "applyScreenMdmsData.ws-services-masters.billGroup",
          //sourceJsonPath: "ledgerlist",
          gridDefination: { xs: 12, sm: 6 },
          errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
          jsonPath: "applyScreen.billGroup"
        }),
        beforeFieldChange: async (action, state, dispatch) => {

          if(action.value)
          {
            // let sectotecode = get(
            //   state.screenConfiguration.preparedFinalObject,
            //   "applyScreen.property.address.locality.code"
            // )             
            // let ledgerGroup = `${sectotecode}${action.value}`
            // dispatch(
            //   prepareFinalObject(
            //     "applyScreen.ledgerGroup",
            //     ledgerGroup
            //   )
            // )
          }
         
        }
      },
      ledgerNo: {
        ...getSelectField({
          label: { labelKey: "WS_SERV_DETAIL_LEDGER_NO" },
          placeholder: { labelKey: "WS_SERV_DETAIL_LEDGER_NO_PLACEHOLDER" },
          required: true,
          //sourceJsonPath: "applyScreenMdmsData.ws-services-masters.Ledger",
          sourceJsonPath: "ledgerlist",
          gridDefination: { xs: 12, sm: 6 },
          errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
          jsonPath: "applyScreen.ledgerNo"
        }),
        beforeFieldChange: async (action, state, dispatch) => {

          if(action.value)
          {
            let sectotecode = get(
              state.screenConfiguration.preparedFinalObject,
              "applyScreen.property.address.locality.code"
            )
             if(sectotecode.value)
             {
              sectotecode = sectotecode.value
             }
            let ledgerGroup = `${sectotecode}${action.value}`
            dispatch(
              prepareFinalObject(
                "applyScreen.ledgerGroup",
                ledgerGroup
              )
            )
          }
         
        }
      },
      ledgerGroup:
      getTextField({
       label: { labelKey: "WS_SERV_DETAIL_LEDGER_GROUP" },
       placeholder: { labelKey: "WS_SERV_DETAIL_LEDGER_GROUP_PLACEHOLDER" },
       gridDefination: { xs: 12, sm: 6 },        
       jsonPath: "applyScreen.ledgerGroup",
       pattern: /^[0-9]*$/i,
       props: {         
         disabled: true
       },
       errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
     }),
     ccCode: getTextField({
      label: { labelKey: "WS_SERV_DETAIL_CC_CODE" },
      placeholder: { labelKey: "WS_SERV_DETAIL_CC_CODE_PLACEHOLDER" },
      gridDefination: { xs: 12, sm: 6 },
      
      jsonPath: "applyScreen.ccCode",
      pattern: /^[0-9]*$/i,
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
    }),
      connectionType: {
        ...getSelectField({
          label: { labelKey: "WS_SERV_DETAIL_CONN_TYPE" },
          placeholder: { labelKey: "WS_ADDN_DETAILS_CONN_TYPE_PLACEHOLDER" },
          required: false,
          sourceJsonPath: "applyScreenMdmsData.ws-services-masters.connectionType",
          gridDefination: { xs: 12, sm: 6 },
          errorMessage: "ERR_INVALID_BILLING_PERIOD",
          jsonPath: "applyScreen.connectionType"
        }),
        afterFieldChange: async (action, state, dispatch) => {
          let connType = await get(state, "screenConfiguration.preparedFinalObject.applyScreen.connectionType");
          console.log('connType');
          console.log(connType);
          if (connType === undefined || connType === "Non Metered" || connType === "Bulk-supply" || connType !== "Metered") {
            showHideFeilds(dispatch, false);
          }
          else {
            showHideFeilds(dispatch, true);
          }
        }
      },
      // numberOfTaps: getTextField({
      //   label: { labelKey: "WS_SERV_DETAIL_NO_OF_TAPS" },
      //   placeholder: { labelKey: "WS_SERV_DETAIL_NO_OF_TAPS_PLACEHOLDER" },
      //   gridDefination: { xs: 12, sm: 6 },
      //   jsonPath: "applyScreen.noOfTaps",
      //   //pattern: /^[0-9]*$/i,
      //   pattern: getPattern("numeric-only"),
      //   errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      // }),
      ferruleSize: getTextField({
        label: { labelKey: "WS_ADDN_DETAILS_FERRULE_INPUT" },
        placeholder: { labelKey: "WS_ADDN_DETAILS_FERRULE_INPUT_PLACEHOLDER" },
        gridDefination: { xs: 12, sm: 6 },
        pattern: getPattern("AlphaNumValidation"),
        visible:true,
        props:{
          disabled:IsEdit
        },
        jsonPath: "applyScreen.ferruleSize",
        //pattern: /^[0-9]*$/i,
        
       // errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
      }),
      // waterSourceType: {
      //   ...getSelectField({
      //     label: { labelKey: "WS_SERV_DETAIL_WATER_SOURCE" },
      //     placeholder: { labelKey: "WS_ADDN_DETAILS_WARER_SOURCE_PLACEHOLDER" },
      //     required: false,
      //     sourceJsonPath: "applyScreenMdmsData.ws-services-masters.waterSource",
      //     gridDefination: { xs: 12, sm: 6 },
      //     errorMessage: "ERR_INVALID_BILLING_PERIOD",
      //     jsonPath: "applyScreen.waterSource"
      //   }),
      //   beforeFieldChange: async (action, state, dispatch) => {
      //     if (action.value === "GROUND") {
      //       dispatch(
      //         prepareFinalObject(
      //           "waterSubSourceForSelectedWaterSource",
      //           get(
      //             state.screenConfiguration.preparedFinalObject,
      //             "applyScreenMdmsData.ws-services-masters.GROUND"
      //           )
      //         )
      //       )
      //     } else if (action.value === "SURFACE") {
      //       dispatch(
      //         prepareFinalObject(
      //           "waterSubSourceForSelectedWaterSource",
      //           get(
      //             state.screenConfiguration.preparedFinalObject,
      //             "applyScreenMdmsData.ws-services-masters.SURFACE"
      //           )
      //         )
      //       )
      //     } else if (action.value === "BULKSUPPLY") {
      //       dispatch(
      //         prepareFinalObject(
      //           "waterSubSourceForSelectedWaterSource",
      //           get(
      //             state.screenConfiguration.preparedFinalObject,
      //             "applyScreenMdmsData.ws-services-masters.BULKSUPPLY"
      //           )
      //         )
      //       )
      //     }
      //   }
      // },
      // waterSubSource: getSelectField({
      //   label: { labelKey: "WS_SERV_DETAIL_WATER_SUB_SOURCE" },
      //   placeholder: { labelKey: "WS_ADDN_DETAILS_WARER_SUB_SOURCE_PLACEHOLDER" },
      //   required: false,
      //   sourceJsonPath: "waterSubSourceForSelectedWaterSource",
      //   gridDefination: { xs: 12, sm: 6 },
      //   errorMessage: "ERR_INVALID_BILLING_PERIOD",
      //   jsonPath: "applyScreen.waterSubSource"
      // }),
      
      // pipeSize: {
      //   ...getSelectField({
      //     label: { labelKey: "WS_SERV_DETAIL_PIPE_SIZE" },
      //     sourceJsonPath: "applyScreenMdmsData.ws-services-calculation.pipeSize",
      //     placeholder: { labelKey: "WS_SERV_DETAIL_PIPE_SIZE_PLACEHOLDER" },
      //     required: true,
      //     visible:false,
      //     gridDefination: { xs: 12, sm: 6 },
      //     jsonPath: "applyScreen.pipeSize"
      //   }),
      //   beforeFieldChange: async (action, state, dispatch) => {
  
      //     if(action.value)
      //     {
      //       const {applyScreenMdmsData} = state.screenConfiguration.preparedFinalObject;
      //       const pipeSize = applyScreenMdmsData['ws-services-calculation'].PipeSize.filter(pipeSize => pipeSize.size == action.value);
  
      //        if(pipeSize&&pipeSize[0])
      //        {            
      //         dispatch(
      //           prepareFinalObject(
      //             "applyScreen.sanctionedCapacity",
      //             pipeSize[0].SanctionCapacity
      //           )
      //         )
      //         dispatch(
      //           prepareFinalObject(
      //             "applyScreen.meterRentCode",
      //             pipeSize[0].MeterRentCode
      //           )
      //         )
      //        }
      //     }
         
      //   }
      // },
      // contractValue: getTextField({
      //   label: { labelKey: "WS_ADDN_DETAILS_CONTRACT_VALUE" },
      //   placeholder: { labelKey: "WS_ADDN_DETAILS_CONTRACT_VALUE_PLACEHOLDER" },
      //   gridDefination: { xs: 12, sm: 6 },
      //   pattern: getPattern("Name"),
      //   visible:false,
      //   jsonPath: "applyScreen.contractValue",
      //   pattern: /^[0-9]*$/i,
        
      //  // errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
      // }),





      // noOfWaterClosets: getTextField({
      //   label: { labelKey: "WS_ADDN_DETAILS_NO_OF_WATER_CLOSETS" },
      //   placeholder: { labelKey: "WS_ADDN_DETAILS_NO_OF_WATER_CLOSETS_PLACEHOLDER" },
      //   gridDefination: { xs: 12, sm: 6 },
      //   jsonPath: "applyScreen.noOfWaterClosets",
      //   pattern: /^[0-9]*$/i,
      //   errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
      // }),
      // noOfToilets: getTextField({
      //   label: { labelKey: "WS_ADDN_DETAILS_NO_OF_TOILETS" },
      //   placeholder: { labelKey: "WS_ADDN_DETAILS_NO_OF_TOILETS_PLACEHOLDER" },
      //   gridDefination: { xs: 12, sm: 6 },
      //   jsonPath: "applyScreen.noOfToilets",
      //   pattern: /^[0-9]*$/i,
      //   errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
      // })
    }),
  }),
  // plumberDetailsContainer: getCommonGrayCard({
  //   subHeader: getCommonTitle({
  //     labelKey: "WS_COMMON_PLUMBER_DETAILS"
  //   }),
  //   plumberDetails: getCommonContainer({
  //     getPlumberRadioButton,
  //     plumberLicenceNo: getTextField({
  //       label: {
  //         labelKey: "WS_ADDN_DETAILS_PLUMBER_LICENCE_NO_LABEL"
  //       },
  //       placeholder: {
  //         labelKey: "WS_ADDN_DETAILS_PLUMBER_LICENCE_NO_PLACEHOLDER"
  //       },
  //       gridDefination: {
  //         xs: 12,
  //         sm: 6
  //       },
  //       required: false,
  //       pattern: /^[0-9]*$/i,
  //       errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
  //       jsonPath: "applyScreen.plumberInfo[0].licenseNo"
  //     }),
  //     plumberName: getTextField({
  //       label: {
  //         labelKey: "WS_ADDN_DETAILS_PLUMBER_NAME_LABEL"
  //       },
  //       placeholder: {
  //         labelKey: "WS_ADDN_DETAILS_PLUMBER_NAME_PLACEHOLDER"
  //       },
  //       gridDefination: {
  //         xs: 12,
  //         sm: 6
  //       },
  //       required: false,
  //       pattern: getPattern("Name"),
  //       errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
  //       jsonPath: "applyScreen.plumberInfo[0].name"
  //     }),
  //     plumberMobNo: getTextField({
  //       label: {
  //         labelKey: "WS_ADDN_DETAILS_PLUMBER_MOB_NO_LABEL"
  //       },
  //       placeholder: {
  //         labelKey: "WS_ADDN_DETAILS_PLUMBER_MOB_NO_LABEL_PLACEHOLDER"
  //       },
  //       gridDefination: { xs: 12, sm: 6 },
  //       iconObj: { label: "+91 |", position: "start" },
  //       required: false,
  //       pattern: getPattern("MobileNo"),
  //       errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
  //       jsonPath: "applyScreen.plumberInfo[0].mobileNumber"
  //     }),
  //   })
  // }),
  // roadCuttingChargeContainer: getCommonGrayCard({
  //   subHeader: getCommonTitle({
  //     labelKey: "WS_ROAD_CUTTING_CHARGE_DETAILS"
  //   }),
  //   roadDetails: getCommonContainer({
  //     roadType: getSelectField({
  //       label: {
  //         labelKey: "WS_ADDN_DETAIL_ROAD_TYPE"
  //       },
  //       placeholder: {
  //         labelKey: "WS_ADDN_DETAILS_ROAD_TYPE_PLACEHOLDER"
  //       },
  //       required: false,
  //       sourceJsonPath: "applyScreenMdmsData.sw-services-calculation.RoadType",
  //       gridDefination: {
  //         xs: 12,
  //         sm: 6
  //       },
  //       required: false,
  //       errorMessage: "ERR_INVALID_BILLING_PERIOD",
  //       jsonPath: "applyScreen.roadType"
  //     }),
  //     enterArea: getTextField({
  //       label: {
  //         labelKey: "WS_ADDN_DETAILS_AREA_LABEL"
  //       },
  //       placeholder: {
  //         labelKey: "WS_ADDN_DETAILS_AREA_PLACEHOLDER"
  //       },
  //       gridDefination: {
  //         xs: 12,
  //         sm: 6
  //       },
  //       required: false,
  //       pattern: getPattern("Amount"),
  //       errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
  //       jsonPath: "applyScreen.roadCuttingArea"
  //     })
  //   }),
  // }),
  //sms section
  Notificationdetailscontainer: getCommonGrayCard({
    // subHeader: getCommonTitle({
    //   labelKey: "WS_COMMON_CONNECTION_DETAILS"
    // }),

    NotificationDetails: getCommonContainer({
      siUser: getSelectField({
        label: { labelKey: "WS_SI_USER_LABLE" },
        placeholder: { labelKey: "WS_SI_USER_PLACEHOLDER" },
        gridDefination: { xs: 12, sm: 6 },
        required: true,
        sourceJsonPath: "applyScreenMdmsData.siUser",
        jsonPath: "siUser.name",
        props: {         
          disabled: false
        },
       // pattern: /^[0-9]*$/i,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
      }),
      
      nextButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            minWidth: "200px",
            height: "48px",
            marginRight: "45px"
          }
        },
        children: {
          nextButtonLabel: getLabel({
            labelName: "Send Message",
            labelKey: "WS_SMS_NOTIFICATION"
          }),
    
          
        },
        onClickDefination: {
          action: "condition",
          callBack: smsNotification
        },
        visible: true
      },
    }),
  }),
  ///end sms section
  //// set connection number
  ConnectionNumberContainer: getCommonGrayCard({
    subHeader: getCommonTitle({
      labelKey: "WS_CONNECTION_NUMBER_DETAILS"
    }),
    connectionAccountDetails: getCommonContainer({
      
      fourdigitNumber: getTextField({
        label: {
          labelKey: "WS_FOUR_DIGIT_CONNECTION_LABEL"
        },
        // placeholder: {
        //   labelKey: "WS_FOUR_DIGIT_CONNECTION_LABEL"
        // },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: true,
       // pattern: getPattern("Amount"),
       pattern: /^[a-z0-9]{0,4}$/i,
        errorMessage: "ERR_HOUSE_NO_VALIDATION_FIELDS_MSG",
        jsonPath: "applyScreen.waterApplication.fourdigitNumber"
      }),
      twodigitNumber: getTextField({
        label: {
          labelKey: "WS_TWO_DIGIT_CONNECTION_LABEL"
        },
        // placeholder: {
        //   labelKey: "WS_TWO_DIGIT_CONNECTION_LABEL"
        // },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: true,
        //pattern: getPattern("Amount"),
        pattern: /^[a-z0-9]{0,1}$/i,
        errorMessage: "ERR_NOF_VALIDATION_FIELDS_MSG",
        jsonPath: "applyScreen.waterApplication.twodigitNumber"
      }),
      numberOfMeterNumber: getTextField({
        label: {
          labelKey: "WS_NOM_DIGIT_CONNECTION_LABEL"
        },
        // placeholder: {
        //   labelKey: "WS_TWO_DIGIT_CONNECTION_LABEL"
        // },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: true,
        //pattern: getPattern("Amount"),
        pattern: /^[0-9]{0,1}$/i,
        errorMessage: "ERR_NOM_VALIDATION_FIELDS_MSG",
        jsonPath: "applyScreen.waterApplication.numberOfMeterNumber"
      }),
      reviewDoorOrHouseNumber: getLabelWithValue(
        {
          labelName: "Consumer number/Account number",
          labelKey: "WS_COMMON_CONSUMER_NO_LABEL"
        },
        { jsonPath: "applyScreen.connectionNoUI",
        callBack: handleNA
         }
      ), 
      break:getBreak(),
      lastDigitNumber: getTextField({
        label: {
          labelKey: "WS_LAST_DIGIT_CONNECTION_LABEL"
        },
        // placeholder: {
        //   labelKey: "WS_TWO_DIGIT_CONNECTION_LABEL"
        // },
        props:{
          disabled:true

        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: true,
        //pattern: getPattern("Amount"),
        pattern: /^[a-zA-Z]{0,1}$/i,
        errorMessage: "ERR_NOM_VALIDATION_FIELDS_MSG",
        jsonPath: "applyScreen.waterApplication.lastDigitNumber"
      }),
      setButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            minWidth: "200px",
            height: "48px",
            marginRight: "45px"
          }
        },
        children: {
          nextButtonLabel: getLabel({
            labelName: "set Connection Number",
            labelKey: "WS_SET_CONNECTION_NUMBER_BUTTON"
          }),
    
          
        },
        onClickDefination: {
          action: "condition",
          callBack: Setconnection
        },
        visible: true
      },
        
    }),
  }),
  ////
  OtherChargeContainer: getCommonGrayCard({
    subHeader: getCommonTitle({
      labelKey: "WS_OTHER_CHARGE_DETAILS"
    }),
    chargesDetails: getCommonContainer({
      enterSecurityAmount: getTextField({
        label: {
          labelKey: "WS_ADDN_DETAILS_SECURITY_CHARGES_LABEL"
        },
        placeholder: {
          labelKey: "WS_ADDN_DETAILS_SECURITY_CHARGES_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        pattern: getPattern("Amount"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "applyScreen.waterApplication.securityCharge"
      }),
      IsFerruleApplicable: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-wns",
        componentPath: "CheckboxContainerConnHolder",
        gridDefination: { xs: 12, sm: 6 },
        props: {
          label: {
            name: "Ferrule Applicable",
            key: "WS_ADDN_DETAILS_IS_FERRULEAPPLICABLE",
          },
          jsonPath: "applyScreen.waterApplication.isFerruleApplicable",
          required: false,
          isChecked: false
        },
        type: "array",
        section:"SECURITY",
        jsonPath: "applyScreen.waterApplication.isFerruleApplicable"
      },
      additionalCharges: getTextField({
        label: {
          labelKey: "WS_ADDN_DETAILS_ADDITIONAL_CHARGES_LABEL"
        },
        placeholder: {
          labelKey: "WS_ADDN_DETAILS_ADDITIONAL_CHARGES_LABEL"
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        pattern: getPattern("Amount"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "applyScreen.waterApplication.additionalCharges"
      }),
      constructionCharges: getTextField({
        label: {
          labelKey: "WS_ADDN_DETAILS_CONSTRUCTION_CHARGES_LABEL"
        },
        placeholder: {
          labelKey: "WS_ADDN_DETAILS_CONSTRUCTION_CHARGES_LABEL"
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        pattern: getPattern("Amount"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "applyScreen.waterApplication.constructionCharges"
      }),
      isMeterStolen: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-wns",
        componentPath: "CheckboxContainerConnHolder",
        gridDefination: { xs: 12, sm: 6 },
        props: {
          label: {
            name: "Is this is a case of theft of meter",
            key: "WS_ADDN_DETAILS_IS_METER_STOLEN",
          },
          jsonPath: "applyScreen.waterApplication.isMeterStolen",
          required: false,
          isChecked: false
        },
        type: "array",
        jsonPath: "applyScreen.waterApplication.isMeterStolen"
      },
    }),
  }),
  activationDetailsContainer: getCommonGrayCard({
    subHeader: getCommonTitle({
      labelKey: "WS_ACTIVATION_DETAILS"
    }),
    activeDetails: getCommonContainer({
      connectionExecutionDate: getDateField({
        label: { labelName: "connectionExecutionDate", labelKey: "WS_SERV_DETAIL_CONN_EXECUTION_DATE" },
        // placeholder: {
        //   labelName: "Select From Date",
        //   labelKey: "WS_FROM_DATE_PLACEHOLDER"
        // },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        props: {
          inputProps: {
            min: new Date().toISOString().slice(0, 10),
          },
          disabled: Disabled
        },
        
        required: false,
        pattern: getPattern("Date"),
        errorMessage: "ERR_INVALID_DATE",
        jsonPath: "applyScreen.connectionExecutionDate"
      }),
      meterID: getTextField({
        label: {
          labelKey: "WS_SERV_DETAIL_METER_ID"
        },
        placeholder: {
          labelKey: "WS_ADDN_DETAILS_METER_ID_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        props: {         
          disabled: Disabled
        },
        required: false,
        pattern: /^[a-z0-9]+$/i,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "applyScreen.meterId"
      }),
      meterInstallationDate: getDateField({
        label: { labelName: "meterInstallationDate", labelKey: "WS_ADDN_DETAIL_METER_INSTALL_DATE" },
        // placeholder: {
        //   labelName: "Select From Date",
        //   labelKey: "WS_FROM_DATE_PLACEHOLDER"
        // },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        props: {
          inputProps: {
            min: new Date().toISOString().slice(0, 10),
          },
          disabled: Disabled
        },
        required: false,
        pattern: getPattern("Date"),
        errorMessage: "ERR_INVALID_DATE",
        jsonPath: "applyScreen.meterInstallationDate"
      }),
      initialMeterReading: getTextField({
        label: {
          labelKey: "WS_ADDN_DETAILS_INITIAL_METER_READING"
        },
        placeholder: {
          labelKey: "WS_ADDN_DETAILS_INITIAL_METER_READING_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        props: {         
          disabled: Disabled
        },
        pattern: /^[0-9]\d{0,9}(\.\d{1,3})?%?$/,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "applyScreen.additionalDetails.initialMeterReading"
      }),
      lastMeterReading: getTextField({
        label: {
          labelKey: "WS_ADDN_DETAILS_INITIAL_METER_READING_LAST"
        },
        placeholder: {
          labelKey: "WS_ADDN_DETAILS_INITIAL_METER_READING_LAST_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        props: {         
          disabled: Disabled
        },
        pattern: /^[0-9]\d{0,9}(\.\d{1,3})?%?$/,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "applyScreen.additionalDetails.lastMeterReading"
      }),
      meterCount: getTextField({
        label: {
          labelKey: "WS_ADDN_DETAILS_INITIAL_METER_COUNT"
        },
        placeholder: {
          labelKey: "WS_ADDN_DETAILS_INITIAL_METER_COUNT_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        props: {         
          disabled: Disabled
        },
        
        pattern: /^[0-9]\d{0,9}(\.\d{1,3})?%?$/,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "applyScreen.meterCount"
      }),

      mfrCode: {
        ...getSelectField({
          label: { labelKey: "WS_SERV_DETAIL_MFRCODE" },
          placeholder: { labelKey: "WS_SERV_DETAIL_MFRCODE_PLACEHOLDER" },
          required: false,
          sourceJsonPath: "applyScreenMdmsData.ws-services-masters.MFRCode",
          gridDefination: { xs: 12, sm: 6 },
          errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
          jsonPath: "applyScreen.mfrCode",
          props: {
            optionValue: "Code",
            optionLabel: "MakeOfMeter",
            disabled: Disabled,
          },
        }),
        beforeFieldChange: async (action, state, dispatch) => {

          if(action.value)
          {
            let MFRCode = get(
              state.screenConfiguration.preparedFinalObject,
              "applyScreenMdmsData.ws-services-masters.MFRCode"
            )
            MFRCode = MFRCode.filter(x=>x.Code === action.value)
             if(MFRCode&&MFRCode[0])
            {
              dispatch(
                prepareFinalObject(
                  "applyScreen.meterDigits",
                  MFRCode[0].Digit
                )
              )
              dispatch(
                prepareFinalObject(
                  "applyScreen.proposedMeterDigits",
                  MFRCode[0].Digit
                )
              )
            }
           
          }
         
        }
      },
      meterDigits:
      getTextField({
       label: { labelKey: "WS_SERV_DETAIL_METER_DIGIT" },
       placeholder: { labelKey: "WS_SERV_DETAIL_METER_DIGIT_PLACEHOLDER" },
       gridDefination: { xs: 12, sm: 6 },        
       jsonPath: "applyScreen.meterDigits",
       pattern: /^[0-9]*$/i,
       props: {         
         disabled: true
       },
       errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
     }),
     meterUnit: {
      ...getSelectField({
        label: { labelKey: "WS_SERV_DETAIL_METER_UNIT" },
        placeholder: { labelKey: "WS_SERV_DETAIL_METER_UNIT_PLACEHOLDER" },
        required: false,
        sourceJsonPath: "applyScreenMdmsData.ws-services-masters.MeterUnit",
        gridDefination: { xs: 12, sm: 6 },
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "applyScreen.meterUnit",
        props: {
          optionValue: "Name",
          optionLabel: "Name",
          disabled: Disabled
        },
      }),
      beforeFieldChange: async (action, state, dispatch) => {

        if(action.value)
        {
          
         
        }
       
      }
    },
    sanctionedCapacity:
    getTextField({
     label: { labelKey: "WS_SERV_DETAIL_SANCTION_CAPACITY" },
     placeholder: { labelKey: "WS_SERV_DETAIL_SANCTION_CAPACITY_PLACEHOLDER" },
     gridDefination: { xs: 12, sm: 6 },        
     jsonPath: "applyScreen.sanctionedCapacity",
     pattern: /^[0-9]*$/i,
     props: {         
       disabled: true
     },
     errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
   }),
   meterRentCode:
   getTextField({
    label: { labelKey: "WS_SERV_DETAIL_METER_RENT_CODE" },
    placeholder: { labelKey: "WS_SERV_DETAIL_METER_RENT_CODE_PLACEHOLDER" },
    gridDefination: { xs: 12, sm: 6 },        
    jsonPath: "applyScreen.meterRentCode",
    pattern: /^[0-9]*$/i,
    props: {         
      disabled: true
    },
    errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
  }),
    })
  }),
  ProposedActivationDetailsContainer: getCommonGrayCard({
    subHeader: getCommonTitle({
      labelKey: "WS_PROPOSED_ACTIVATION_DETAILS"
    }),
    PropactiveDetails: getCommonContainer({
      PropconnectionExecutionDate: getDateField({
        label: { labelName: "connectionExecutionDate", labelKey: "WS_PROP_SERV_DETAIL_CONN_EXECUTION_DATE" },
        // placeholder: {
        //   labelName: "Select From Date",
        //   labelKey: "WS_FROM_DATE_PLACEHOLDER"
        // },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        props: {
          inputProps: {
            min: new Date().toISOString().slice(0, 10),
          },
        },
        required: false,
        pattern: getPattern("Date"),
        errorMessage: "ERR_INVALID_DATE",
        jsonPath: "applyScreen.connectionExecutionDate"
      }),
      PropmeterID: getTextField({
        label: {
          labelKey: "WS_PROP_SERV_DETAIL_METER_ID"
        },
        placeholder: {
          labelKey: "WS_PROP_SERV_DETAIL_METER_ID_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        pattern: /^[a-z0-9]+$/i,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "applyScreen.proposedMeterId"
      }),
      PropmeterInstallationDate: getDateField({
        label: { labelName: "meterInstallationDate", labelKey: "WS_PROP_ADDN_DETAIL_METER_INSTALL_DATE" },
        // placeholder: {
        //   labelName: "Select From Date",
        //   labelKey: "WS_FROM_DATE_PLACEHOLDER"
        // },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        props: {
          inputProps: {
            min: new Date().toISOString().slice(0, 10),
          },
        },
        required: false,
        pattern: getPattern("Date"),
        errorMessage: "ERR_INVALID_DATE",
        jsonPath: "applyScreen.proposedMeterInstallationDate"
      }),
      PropinitialMeterReading: getTextField({
        label: {
          labelKey: "WS_PROP_ADDN_DETAILS_INITIAL_METER_READING"
        },
        placeholder: {
          labelKey: "WS_PROP_ADDN_DETAILS_INITIAL_METER_READING_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        pattern: /^[0-9]\d{0,9}(\.\d{1,3})?%?$/,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "applyScreen.proposedInitialMeterReading"
      }),
      proposedLastMeterReading: getTextField({
        label: {
          labelKey: "WS_PROP_ADDN_DETAILS_LAST_METER_READING"
        },
        placeholder: {
          labelKey: "WS_PROP_ADDN_DETAILS_LAST_METER_READING_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        pattern: /^[0-9]\d{0,9}(\.\d{1,3})?%?$/,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "applyScreen.proposedLastMeterReading"
      }),
      PropmeterCount: getTextField({
        label: {
          labelKey: "WS_PROP_ADDN_DETAILS_INITIAL_METER_COUNT"
        },
        placeholder: {
          labelKey: "WS_PROP_ADDN_DETAILS_INITIAL_METER_COUNT_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        pattern: /^[0-9]\d{0,9}(\.\d{1,3})?%?$/,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "applyScreen.proposedMeterCount"
      }),

      PropmfrCode: {
        ...getSelectField({
          label: { labelKey: "WS_PROP_SERV_DETAIL_MFRCODE" },
          placeholder: { labelKey: "WS_PROP_SERV_DETAIL_MFRCODE_PLACEHOLDER" },
          required: false,
          sourceJsonPath: "applyScreenMdmsData.ws-services-masters.MFRCode",
          gridDefination: { xs: 12, sm: 6 },
          errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
          jsonPath: "applyScreen.proposedMfrCode",
          props: {
            optionValue: "Code",
            optionLabel: "MakeOfMeter",
            
          },
        }),
        beforeFieldChange: async (action, state, dispatch) => {

          if(action.value)
          {
            let MFRCode = get(
              state.screenConfiguration.preparedFinalObject,
              "applyScreenMdmsData.ws-services-masters.MFRCode"
            )
            MFRCode = MFRCode.filter(x=>x.Code === action.value)
             if(MFRCode&&MFRCode[0])
            {
              dispatch(
                prepareFinalObject(
                  "applyScreen.meterDigits",
                  MFRCode[0].Digit
                )
              )
              dispatch(
                prepareFinalObject(
                  "applyScreen.proposedMeterDigits",
                  MFRCode[0].Digit
                )
              )
            }
           
          }
         
        }
      },
      PropmeterDigits:
      getTextField({
       label: { labelKey: "WS_PROP_SERV_DETAIL_METER_DIGIT" },
       placeholder: { labelKey: "WS_PROP_SERV_DETAIL_METER_DIGIT_PLACEHOLDER" },
       gridDefination: { xs: 12, sm: 6 },        
       jsonPath: "applyScreen.proposedMeterDigits",
       pattern: /^[0-9]*$/i,
       props: {         
         disabled: true
       },
       errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
     }),
     PropmeterUnit: {
      ...getSelectField({
        label: { labelKey: "WS_PROP_SERV_DETAIL_METER_UNIT" },
        placeholder: { labelKey: "WS_PROP_SERV_DETAIL_METER_UNIT_PLACEHOLDER" },
        required: false,
        sourceJsonPath: "applyScreenMdmsData.ws-services-masters.MeterUnit",
        gridDefination: { xs: 12, sm: 6 },
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "applyScreen.proposedMeterUnit",
        props: {
          optionValue: "Name",
          optionLabel: "Name",
          
        },
      }),
      beforeFieldChange: async (action, state, dispatch) => {

        if(action.value)
        {
          
         
        }
       
      }
    },
    PropsanctionedCapacity:
    getTextField({
     label: { labelKey: "WS_PROP_SERV_DETAIL_SANCTION_CAPACITY" },
     placeholder: { labelKey: "WS_PROP_SERV_DETAIL_SANCTION_CAPACITY_PLACEHOLDER" },
     gridDefination: { xs: 12, sm: 6 },        
     jsonPath: "applyScreen.proposedSanctionedCapacity",
     pattern: /^[0-9]*$/i,
     props: {         
       disabled: true
     },
     errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
   }),
   PropmeterRentCode:
   getTextField({
    label: { labelKey: "WS_PROP_SERV_DETAIL_METER_RENT_CODE" },
    placeholder: { labelKey: "WS_PROP_SERV_DETAIL_METER_RENT_CODE_PLACEHOLDER" },
    gridDefination: { xs: 12, sm: 6 },        
    jsonPath: "applyScreen.proposedMeterRentCode",
    pattern: /^[0-9]*$/i,
    props: {         
      disabled: true
    },
    errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
  }),
    }),
    // visible:false
  })
});

const showHideFeilds = (dispatch, value) => {
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.initialMeterReading",
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.lastMeterReading",
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterInstallationDate",
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterID",
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewInitialMeterReading",
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterInstallationDate",
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterId",
      "visible",
      value
    )
  );
}
import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getSelectField,
  getCommonContainer,
  getCommonParagraph,
  getPattern,
  getDateField,
  getLabel,
  getCommonHeader,
  getCommonGrayCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
//   import { searchApiCall } from "./functions";
import commonConfig from "config/common.js";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getHeaderSideText } from "../../utils";
import get from 'lodash/get';
import { httpRequest } from '../../../../../ui-utils/index';
import set from 'lodash/set';
const smsNotification = async (state, dispatch) => {

}



export const smsNotificationDetails =(Disabled)=> getCommonCard({
  header: getCommonHeader({
    labelKey: "WS_COMMON_SMS_NOTIFICATION_HEADER"
  }),
  Notificationdetailscontainer: getCommonGrayCard({
    // subHeader: getCommonTitle({
    //   labelKey: "WS_COMMON_CONNECTION_DETAILS"
    // }),

    NotificationDetails: getCommonContainer({
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
            labelKey: "WS_SMS_NOTIFICATIOJ"
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
  
});


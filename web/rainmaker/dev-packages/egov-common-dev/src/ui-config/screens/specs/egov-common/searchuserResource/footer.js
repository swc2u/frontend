import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getapplicationNumber, getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { set } from "lodash";
import get from "lodash/get";
import { userUnlock } from "../../../../../ui-utils/commons";
import { getCommonApplyFooter } from "../../utils";
//import "./index.css";





const callBackForNext = async (state, dispatch) => {
 

  // Field validation 
  let UserInfo = get(state.screenConfiguration.preparedFinalObject,"UserInfo", [] )
  console.log(UserInfo)
  set(UserInfo[0],'accountLocked',false)
  set(UserInfo[0],'accountLockedDate',0)
  //accountLockedDate
  let response = await userUnlock(UserInfo, dispatch);
 //console.log(UserInfo)

};



export const footer = getCommonApplyFooter({

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
        labelName: "HC_SUBMIT",
        labelKey: "UN LOCK"
      }),

      
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForNext
    },
    visible: false
  },

});




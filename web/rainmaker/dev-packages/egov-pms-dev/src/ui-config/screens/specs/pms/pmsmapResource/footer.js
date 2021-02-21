
  import { getCommonApplyFooter, } from "../../utils";
  import { getLabel} from "egov-ui-framework/ui-config/screens/specs/utils";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { httpRequest } from "../../../../../ui-utils/api";
  import {  WFConfig } from "../../../../../ui-utils/sampleResponses";
  import get from "lodash/get";
import set from "lodash/set";
  const wfActionSubmit= async (state, dispatch) => {
    const tenantId = getQueryArg(window.location.href, "tenantId");
    let WFBody = {
      ProcessInstances: [
        {
            moduleName: WFConfig().businessServiceRRP,
            tenantId: tenantId,
            businessService: WFConfig().businessServiceRRP,
            businessId: null,
            action: "INITIATE",
            comment: null,
            assignee: null,
            sla: null,
            previousStatus: null,
            employee: {
              pensionEmployeeId: get(state,"screenConfiguration.preparedFinalObject.ProcessInstances[0].pensionEmployeeId", '' ),
              code: get(state,"screenConfiguration.preparedFinalObject.ProcessInstances[0].code", '' ),
            },
          
        }       
    ]
    };
   
    try {
      let payload = null;
      
      payload = await httpRequest(
        "post",
        "/pension-services/v1/_processWorkflow",
        "",
        [],
        WFBody
      );
      // console.log(payload.ResponseInfo.status);
     
      dispatch(toggleSnackbar(
        true,
        { labelName: "succcess ", labelKey: 'PENSION_RRP_INITIATED' },
        "success"
      ));
     // window.location.href = "/inbox";
     
      //dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
    } catch (error) {
      
        dispatch(toggleSnackbar(
          true,
          { labelName: "succcess", labelKey:error.message },
          "error"
        ));
  
    }
  }
 
  export const footer = () => {

    return getCommonApplyFooter({
   // export const footer = getCommonApplyFooter({
       ActionButton:{
        uiFramework: "custom-containers-local",
        moduleName: "egov-pms",
        componentPath: "DropdownButton",
        props: {
            dataPath: "ProcessInstances",
            moduleName: "WF_CLAIM",
            pageName:"pmsmap",
            Visible:true,
            Accesslable:[]
          }

       },
      //  SubmitButton: {
      //   componentPath: "Button",
        
      //   props: {
      //     variant: "contained",
      //     color: "primary",
      //     style: {
      //       //minWidth: "200px",
      //       height: "48px",
      //       marginRight: "10px"
      //     }
      //   },
      //   children: {
         
      //     submitButtonLabel: getLabel({
      //       labelName: "Submit",
      //       labelKey: "PENSION_INITIATE"
      //     }),
         
         
      //   },
      //   onClickDefination: {
      //     action: "condition",
      //     callBack: wfActionSubmit
      //   },
      //   visible: true
      // },
   
   
  });
  }
  
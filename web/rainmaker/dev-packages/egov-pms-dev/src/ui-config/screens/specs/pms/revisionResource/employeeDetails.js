import {
    getBreak,
    getCommonCard,
    getCommonGrayCard,
    getCommonTitle,
    getCommonSubHeader,
    getTextField,
    getLabel,
    getDateField,
    getSelectField,
    getCommonContainer,
    getLabelWithValue,
    getPattern
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import {
    prepareFinalObject,
    handleScreenConfigurationFieldChange as handleField
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { GetMonthlydata } from "./function";
  import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getPMSPattern } from "../../../../../ui-utils/commons";
  import { getSearchPensionerForPensionRevision, getSearchPensioner } from "../../../../../ui-utils/commons";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import get from "lodash/get";
  import set from "lodash/set";
  import { httpRequest } from "egov-ui-framework/ui-utils/api";
  const ActionAdd = async (state, dispatch) => {  
   
    const pensionerNumber = getQueryArg(
      window.location.href,
      "pensionerNumber"
    );
    const tenantId = getQueryArg(window.location.href, "tenantId");
    
    window.location.href = `revisionDetails?pensionerNumber=${pensionerNumber}&tenantId=${tenantId}&Year=${0}&Month=${0}`;//&pensionerNumber=${rowData[6]}`;
   
  }
  export const pensionerPensionDiscontinuation = async (state, dispatch) => {
    try {  
      const tenantId = getQueryArg(window.location.href, "tenantId");
      let queryObject = [
      {
      key: "tenantId",
      value: tenantId
      }];  
      let ProcessInstances= get(state.screenConfiguration.preparedFinalObject,"ProcessInstances", [])   
      let response = await httpRequest(
      "post",
      "/pension-services/v1/_pensionerPensionDiscontinuation",
      "",
      [],
      { 
        ProcessInstances: [
                            {
                            tenantId:tenantId,
                            pensioner:{
                            pensionerNumber:ProcessInstances[0].pensioner.pensionerNumber,
                            }
                            
                            }
                          ] 
      }
      );
      console.log(response);
      dispatch(
      toggleSnackbar(
        true,
        {
        labelName: "Pension is discontineou of this pensioner from next month!",
        labelKey: "PENSION_REVIEW_PENSIONER_DISCONTINUATION_SUCCESS_MESSAGE"
        },
        "success"
        ));
        getpensionerdata(state, dispatch,ProcessInstances[0].pensioner.pensionerNumber)
    
    }
    catch (e) {
    console.log(e)
    dispatch(
    toggleSnackbar(
    true,
    {
    labelName: "Workflow returned empty object !",
    labelKey: "PENSION_API_EXCEPTION_ERROR"
    },
    "error"
    ));
    }
    }
    export const getpensionerdata = async (state,dispatch,id)=>{
      try { 
        const tenantId = getQueryArg(
          window.location.href,
          "tenantId"
        );
        let queryObject = [
          {
            key: "pensionerNumber",
          value: id
           
          }];
        queryObject.push({
          key: "tenantId",
          value: tenantId
        });
         
        const response_ = await getSearchPensioner(queryObject);
        const response = await getSearchPensionerForPensionRevision(queryObject);
        
         dispatch(prepareFinalObject("ProcessInstancesTemp", get(response, "Pensioners", [])));
         if(response)
         {
              let  data_ =[
               {
                 pensionRevision:response.ProcessInstances[0].pensionrevesion,
                 pensioner :response.ProcessInstances[0].pensioner,
                 pensionerFinalCalculatedBenefitDetails:response.ProcessInstances[0].pensionerFinalCalculatedBenefitDetails,
                 PensionersBasicData : get(response_, "Pensioners", [])
               } ];
               if(data_ && data_[0])
               {
                 let Active = get(data_[0].PensionersBasicData[0], "active", false)
                 set(
                  state.screenConfiguration.screenConfig,
                  "components.div.children.empDetails.children.cardContent.children.DiscontinuationButton.visible",
                  Active
                );
                set(
                  state.screenConfiguration.screenConfig,
                  "components.div.children.empDetails.children.cardContent.children.ContinuationButton.visible",
                  !Active
                );
                dispatch(prepareFinalObject("ProcessInstances", data_, []));
                window.location.href = `revision?pensionerNumber=${id}&tenantId=${tenantId}`;
                //  dispatch(
                //   handleField(
                //     "revision",
                //     "components.div.children.empDetails.children.cardContent.children.DiscontinuationButton",
                //    {visible:Active} 
                //   )
                // );
                // dispatch(
                //   handleField(
                //     "revision",
                //     "components.div.children.empDetails.children.cardContent.children.ContinuationButton",
                    
                //     {visible:!Active} 
                //   )
                // );
                //  if(Active)
                //  {
                  
                //   // set(
                //   //   action.screenConfig,
                //   //   "components.div.children.empDetails.children.cardContent.children.DiscontinuationButton.visible",
                //   //   Active
                //   // );
                //   // set(
                //   //   action.screenConfig,
                //   //   "components.div.children.empDetails.children.cardContent.children.ContinuationButton.visible",
                //   //   !Active
                //   // );
            
                //  }
                //  else{
                //   dispatch(
                //     handleField(
                //       "revision",
                //       "components.div.children.empDetails.children.cardContent.children.DiscontinuationButton",
                //      {visible:!Active} 
                //     )
                //   );
                //   dispatch(
                //     handleField(
                //       "revision",
                //       "components.div.children.empDetails.children.cardContent.children.ContinuationButton",
                      
                //       {visible:Active} 
                //     )
                //   );
                //   // set(
                //   //   action.screenConfig,
                //   //   "components.div.children.empDetails.children.cardContent.children.DiscontinuationButton.visible",
                //   //   !Active
                //   // );
                //   // set(
                //   //   action.screenConfig,
                //   //   "components.div.children.empDetails.children.cardContent.children.ContinuationButton.visible",
                //   //   Active
                //   // );
            
                //  }
                
            
               }
              }
      }
      catch (error) {
        console.log(error)
        dispatch(
        toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
        ));
        }
    }
    export const pensionerPensionContinuation = async (state, dispatch) => {
      try {  
        const tenantId = getQueryArg(window.location.href, "tenantId");
        let queryObject = [
        {
        key: "tenantId",
        value: tenantId
        }];  
        let ProcessInstances= get(state.screenConfiguration.preparedFinalObject,"ProcessInstances", [])   
        let response = await httpRequest(
        "post",
        "/pension-services/v1/_pensionerPensionContinuation",
        "",
        [],
        { 
          ProcessInstances: [
                              {
                              tenantId:tenantId,
                              pensioner:{
                              pensionerNumber:ProcessInstances[0].PensionersBasicData[0].pensionerNumber,
                              }
                              
                              }
                            ] 
        }
        );
        console.log(response);
        dispatch(
        toggleSnackbar(
          true,
          {
          labelName: "Pension is contineou of this pensioner from next month!",
          labelKey: "PENSION_REVIEW_PENSIONER_CONTINUATION_SUCCESS_MESSAGE"
          },
          "success"
          ));
          getpensionerdata(state, dispatch,ProcessInstances[0].PensionersBasicData[0].pensionerNumber)
      }
      catch (e) {
      console.log(e)
      dispatch(
      toggleSnackbar(
      true,
      {
      labelName: "Workflow returned empty object !",
      labelKey: "PENSION_API_EXCEPTION_ERROR"
      },
      "error"
      ));
      }
      }
export const empDetails = () => {
   
  
    return getCommonCard({
      
      ViewButton: {
        componentPath: "Button",       
        props: {
          variant: "contained",
          color: "primary",
          style: {
            //minWidth: "200px",
            height: "48px",
            marginRight: "10px",
    
          }
        },
        children: {
         
          submitButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "PENSION_VIEW"
          }),
         
         
        },
        onClickDefination: {
          action: "condition",
          callBack: GetMonthlydata
        },
        visible: true
      },
      AddButton: {
        componentPath: "Button",
        
        props: {
          variant: "contained",
          color: "primary",
          style: {
            //minWidth: "200px",
            height: "48px",
            marginRight: "10px",
    
          }
        },
        children: {
         
          submitButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "PENSION_ADD"
          }),
         
         
        },
        onClickDefination: {
          action: "condition",
          callBack: ActionAdd
        },
        visible: true
      },
      DiscontinuationButton: {
        componentPath: "Button",
        
        props: {
          variant: "contained",
          color: "primary",
          style: {
            //minWidth: "200px",
            height: "48px",
            marginRight: "10px",
    
          }
        },
        children: {
         
          submitButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "PENSION_DISCONTINUATION"
          }),
         
         
        },
        onClickDefination: {
          action: "condition",
          callBack: pensionerPensionDiscontinuation
        },
        visible: true
      },
      ContinuationButton: {
        componentPath: "Button",
        
        props: {
          variant: "contained",
          color: "primary",
          style: {
            //minWidth: "200px",
            height: "48px",
            marginRight: "10px",
    
          }
        },
        children: {
         
          submitButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "PENSION_CONTINUATION"
          }),
         
         
        },
        onClickDefination: {
          action: "condition",
          callBack: pensionerPensionContinuation
        },
        visible: true
      },
      
    });
    }
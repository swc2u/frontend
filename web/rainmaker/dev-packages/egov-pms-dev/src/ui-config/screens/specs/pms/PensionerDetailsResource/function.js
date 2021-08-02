
import get from "lodash/get";
import {prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchPensionerForPensionRevision,getSearchPensioner,updatePensionerDetails,validateFeildsupdatePensioner } from "../../../../../ui-utils/commons";
import { convertEpochToDate, convertDateToEpoch,epochToYmd } from "../../utils/index";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validateFields, getTextToLocalMapping } from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "../../../../../ui-utils/api";

import {  
   WFConfig
  } from "../../../../../ui-utils/sampleResponses";
export const createUpdatePensionerdata = async (state, dispatch) => {
  const tenantId = getQueryArg(window.location.href, "tenantId");
  let IsValidPensionerDetails = validateFields(
      "components.div.children.PensionerDetails.children.cardContent.children.pensionDetailsConatiner.children",
      state,
      dispatch,
      "updatePensionerDetails"
    );
    let IsValidPensionerBankDetails = validateFields(
      "components.div.children.PensionerBankDetails.children.cardContent.children.pensionBankDetailsConatiner.children",
      state,
      dispatch,
      "updatePensionerDetails"
    );
    let IsValidPensionerClaimantDetails = validateFields(
      "components.div.children.PensionerClaimantDetails.children.cardContent.children.pensionClaimantDetailsConatiner.children",
      state,
      dispatch,
      "updatePensionerDetails"
    );
    try{
    // new API Intigration

    if(IsValidPensionerDetails && IsValidPensionerBankDetails&&IsValidPensionerClaimantDetails)
    {
//updatePensionerDetails
//validate dob doc and claiment dob

      let dob = get(state.screenConfiguration.preparedFinalObject,"PensionerDetails.dob",'')
     // dob = new Date(epochToYmd(dob))
      dob = convertDateToEpoch(dob)
      let doc = get(state.screenConfiguration.preparedFinalObject,"PensionerDetails.wef",'')
      //doc = new Date(epochToYmd(doc))
      doc = convertDateToEpoch(doc)
      let cdob = get(state.screenConfiguration.preparedFinalObject,"PensionerDetails.claimantDob",'')
     // cdob = new Date(epochToYmd(cdob))
     cdob = convertDateToEpoch(cdob)
      let CurrentDate = new Date().getTime();
      const dateFromApi = new Date(CurrentDate);
      let month = dateFromApi.getMonth() + 1;
      let day = dateFromApi.getDate();
      let year = dateFromApi.getFullYear();
      CurrentDate =`${year}-${month}-${day}`
      CurrentDate = convertDateToEpoch(CurrentDate)
      if(dob!==undefined)
      {
        // const  GivenDate = new Date(dob)
        // const CurrentDate = new Date();

       // if(dob >= CurrentDate){
          if(dob > CurrentDate || dob === CurrentDate){
        // alert('Given date is greater than the current date.');   

        dispatch( toggleSnackbar(
        true,
        { labelName: "Pensioner date of birth can not be greater than the current date", labelKey: 'PENSION_CURRENT_DATE_VALIDATION_DOB' },
        "warning"
        ));
        return
        }
      }
    
      // if(doc!==undefined)
      // {
      //   const  GivenDate = new Date(doe)
      //   const CurrentDate = new Date();

      //   if(GivenDate > CurrentDate){
      //   // alert('Given date is greater than the current date.');   

      //   dispatch( toggleSnackbar(
      //     true,
      //     { labelName: "Pensioner date of comminsment can not be greater than the current date", labelKey: 'PENSION_CURRENT_DATE_VALIDATION_DOC' },
      //     "warning"
      //     ));
      //   return
      // } 

      
      //   const response_ = await updatePensionerDetails(state,dispatch);
      //   if(response_)
      //   {
      //     console.log(response_)
      //     let errorMessage = {
      //       labelName:
      //         "Pensioner details save successfully!",
      //       labelKey: "PENSION_SUCCESS_UPDATE_PENSIONER_DETAILS_MESSAGE"
      //     };
      //     dispatch(toggleSnackbar(true, errorMessage, "success"));
      //   }
      // }
      if(cdob!==undefined)
      {
        // const  GivenDate = new Date(cdob)
        // const CurrentDate = new Date();

        if(cdob > CurrentDate || cdob === CurrentDate){
        // alert('Given date is greater than the current date.');   

        dispatch( toggleSnackbar(
        true,
        { labelName: "Pensioner claimant date of birth can not be greater than the current date", labelKey: 'PENSION_CURRENT_DATE_VALIDATION_CDOB' },
        "warning"
        ));
        return
      } 
let Isvalid = true //validateFeildsupdatePensioner()

      if(Isvalid)

      {
        const response_ = await updatePensionerDetails(state,dispatch);
        if(response_)
        {
          console.log(response_)
          let errorMessage = {
            labelName:
              "Pensioner details save successfully!",
            labelKey: "PENSION_SUCCESS_UPDATE_PENSIONER_DETAILS_MESSAGE"
          };
          dispatch(toggleSnackbar(true, errorMessage, "success"));
        }
      }
      else
      {
        let errorMessage = {
          labelName:
            "Please fill all mandatory fields for Pension  Details, then save !",
          labelKey: "PENSION_ERR_FILL_PENSION_MANDATORY_FIELDS"
        };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));

      }
      }

      let datavalid = false
     let claimantName =  get(state.screenConfiguration.preparedFinalObject,"PensionerDetails.claimantName",null)
     if(claimantName === null || claimantName === "")
     {
      datavalid = true
      const textFields = ["ClaimantName","ClaimantDateofBirth","ClaimantrelationType","ClaimantMobileNumber","ClaimantbankIfsc","claimantbankname","ClaimantAdddress","ClaimantbankAccountNumber"];
      for (let i = 0; i < textFields.length; i++) {
      dispatch(handleField(
        "updatePensionerDetails",
        `components.div.children.PensionerClaimantDetails.children.cardContent.children.pensionClaimantDetailsConatiner.children.${textFields[i]}`,
        "required",
        false
        ));
      }
      let IsValidPensionerClaimantDetails__= validateFields(
        "components.div.children.PensionerClaimantDetails.children.cardContent.children.pensionClaimantDetailsConatiner.children",
        state,
        dispatch,
        "updatePensionerDetails"
      );
     }
     else
     {
      const textFields = ["ClaimantName","ClaimantDateofBirth","ClaimantrelationType","ClaimantMobileNumber","ClaimantbankIfsc","claimantbankname","ClaimantAdddress","ClaimantbankAccountNumber"];
      for (let i = 0; i < textFields.length; i++) {
      dispatch(handleField(
        "updatePensionerDetails",
        `components.div.children.PensionerClaimantDetails.children.cardContent.children.pensionClaimantDetailsConatiner.children.${textFields[i]}`,
        "required",
        true
        ));
      }
     let IsValidPensionerClaimantDetails_= validateFields(
        "components.div.children.PensionerClaimantDetails.children.cardContent.children.pensionClaimantDetailsConatiner.children",
        state,
        dispatch,
        "updatePensionerDetails"
      );
      datavalid = IsValidPensionerClaimantDetails_;
        // let errorMessage = {
        //   labelName:
        //     "Please fill all mandatory fields for Pension  Details, then save !",
        //   labelKey: "PENSION_ERR_FILL_PENSION_MANDATORY_FIELDS"
        // };
        // dispatch(toggleSnackbar(true, errorMessage, "warning"));
        // return false;
     }
      if(datavalid)
      {
            const response_ = await updatePensionerDetails(state,dispatch);
            if(response_)
            {
              console.log(response_)
              let errorMessage = {
                labelName:
                  "Pensioner details save successfully!",
                labelKey: "PENSION_SUCCESS_UPDATE_PENSIONER_DETAILS_MESSAGE"
              };
              dispatch(toggleSnackbar(true, errorMessage, "success"));
            }
          }
          else
          {
            let errorMessage = {
              labelName:
                "Please fill all mandatory fields for Pension  Details, then save !",
              labelKey: "PENSION_ERR_FILL_PENSION_MANDATORY_FIELDS"
            };
            dispatch(toggleSnackbar(true, errorMessage, "warning"));

          }
    }
    else{
      let errorMessage = {
        labelName:
          "Please fill all mandatory fields for Pension  Details, then save !",
        labelKey: "PENSION_ERR_FILL_PENSION_MANDATORY_FIELDS"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
  }
  catch (e){
     
      dispatch(
      toggleSnackbar(
          true,
          {
          labelName: "Workflow returned empty object !",
          labelKey: "PENSION_ERROR_REVISED_PENSION_ADD_EDIT"
          },
          "error"
          ));
  }

}
export const calculateRevisedPension = async (state, dispatch) => {
  const tenantId = getQueryArg(window.location.href, "tenantId");
  let IsValidPensionData = validateFields(
      "components.div.children.revisionDetails.children.cardContent.children.pensionDetailsConatiner.children",
      state,
      dispatch,
      "revisionDetails"
    );
    try{

    if(IsValidPensionData)
    {
        let IsValidMonth = true
        let Month = get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].pensionRevision[0].effectiveStartMonth", 0)
        let Year = get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].pensionRevision[0].effectiveStartYear", 0)
        if(Year!== null)
    {

      if(Year >= Number(new Date().getFullYear()))
    {
       
        if(Month< (Number(new Date().getMonth()) +1) && Year === Number(new Date().getFullYear()))
        IsValidMonth = true
        //IsValidMonth = false
        if(IsValidMonth)
        {
          let IsValidSubmissionDate = true;
          let configDayMonth = 0;
          let ConfigDay = get(state.screenConfiguration.preparedFinalObject,"applyScreenMdmsData.pension.PensionConfig", [])
          for (let index = 0; index < ConfigDay.length; index++) {
            const element = ConfigDay[index].key;
            if(ConfigDay[index].key ==="DAY_OF_MONTHLY_PENSION_REGISTER_GENERATION")
            {
              configDayMonth= Number(ConfigDay[index].value)
              break;
            }
          } 

          if(Month == (Number(new Date().getMonth()) +1))
          {
           
            if(configDayMonth<new Date().getDate() && Year === Number(new Date().getFullYear()))
            //IsValidSubmissionDate = false;
            IsValidSubmissionDate = true;
          }
            if(IsValidSubmissionDate)
            {
              let ProcessInstances= get(state.screenConfiguration.preparedFinalObject,"ProcessInstances", [])
              let response = await httpRequest(
                  "post",
                  "/pension-calculator/v1/_calculateRevisedPension",
                  "",
                  [],
                  { 
                    ProcessInstances: [
                                        {
                                        tenantId:tenantId,
                                        pensionRevision:[ProcessInstances[0].pensionRevision[0]]
                                        }
                                      ] 
                  }
                  );
                  let payload_= get(
                    response,
                    "ProcessInstances",
                    []
                  );
                  let  data =[
                    {
                      pensionRevision:payload_[0].pensionRevision,
                      pensioner :ProcessInstances[0].pensioner,
                      pensionerFinalCalculatedBenefitDetails:ProcessInstances[0].pensionerFinalCalculatedBenefitDetails,
                      PensionersBasicData:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].PensionersBasicData", [] )
                    } ];
                  dispatch(prepareFinalObject("ProcessInstances", data, []));
                  
            }
            else{
              dispatch( toggleSnackbar(
                  true,
                  { labelName: "Revsion data can't be update on or after dat of monthly pension register generation!", labelKey: 'PENSION_INVALID_SUBMMISION_DATE' },
                  "warning"
                ));

            }
          

        }
        else{
          dispatch( toggleSnackbar(
              true,
              { labelName: "invalid current year previous month", labelKey: 'PENSION_INVALID_CURRENT_YEAR_PREVIOUS_MONTH' },
              "warning"
            ));
        }
      }
      else
    {
      dispatch( toggleSnackbar(
        true,
        { labelName: "Invalid Year", labelKey: 'PENSION_INVALID_REVESION_CURRENT_YEAR' },
        "warning"
      ));

    }
    }
    else
    {
      dispatch( toggleSnackbar(
        true,
        { labelName: "Invalid Year", labelKey: 'PENSION_INVALID_REVESION_CURRENT_YEAR' },
        "warning"
      ));

    }
    }
    
    else
    {
      dispatch( toggleSnackbar(
          true,
          { labelName: "Input Valid data", labelKey: 'PENSION_REVESION_INVALID_INPUT_MESSAGE' },
          "warning"
        ));
    }
  }
  catch (e){
     
      dispatch(
      toggleSnackbar(
          true,
          {
          labelName: "Workflow returned empty object !",
          labelKey: "PENSION_ERROR_REVISED_PENSION_ADD_EDIT"
          },
          "error"
          ));
  }

}

  const showHideTable = (booleanHideOrShow, dispatch) => {
    dispatch(
      handleField(
        "revision",
        "components.div.children.searchResults",
        "visible",
        booleanHideOrShow
      )
    );
  };
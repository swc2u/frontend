import {
  getCommonHeader,
  getCommonCard,
  getCommonContainer,
  getCommonParagraph,
  getLabelWithValue,
  getCommonTitle,
  getDateField,
  getLabel,
  getPattern,
  getSelectField,
  getTextField,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
//import { DOEApplyApplication} from "./applydoeResources/DOEApplyApplication";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getSearchPensioner,getPMSPattern } from "../../../../ui-utils/commons";
import { toggleSnackbar,toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getTenantId
} from "egov-ui-kit/utils/localStorageUtils";
import find from "lodash/find";
import set from "lodash/set";
import get from "lodash/get";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {  
  ActionEmployee,
  ActionPensionReview
  } from "../../../../ui-utils/PensionResponce";
  import { httpRequest } from "../../../../ui-utils";
const ActionSubmit = async (state, dispatch) => {
  

const pensionerNumber = getQueryArg(
  window.location.href,
  "pensionerNumber"
);
let queryObject = [
  {
    key: "tenantId",
    value: getTenantId()
  }
  // { key: "limit", value: "10" },
  // { key: "offset", value: "0" }
];
let searchScreenObject = get(
  state.screenConfiguration.preparedFinalObject,
  "searchScreen",
  {}
);
let Validyear = false;
if( Object.keys(searchScreenObject).length == 0 )
{
  dispatch(
    toggleSnackbar(
      true,
      {
        labelName: "Please fill valid fields to search",
        labelKey: "PENSION_VALID_YEAR_SELECTION"
      },
      "warning"
    )
  );
}
else
{


for (var key in searchScreenObject) {
  if (key === "year") {
    if(Number(searchScreenObject[key])<= Number(new Date().getFullYear()))
    {
      Validyear = true
    }
  }
  
  queryObject.push({ key: key, value: Number(searchScreenObject[key]) });
}
  // queryObject.push({
  //   key: "year",
  //   value: "2020"
  // });
queryObject.push({
  key: "pensionerNumber",
  value: pensionerNumber
});

try {
  let payload =[];
  if(Validyear)
  {
 payload = await httpRequest(
    "post",
    "/pension-services/v1/_searchPensionRegister",
    "_search",
    
    queryObject
  );
  console.log(payload)
 }
 else{
  dispatch(
    toggleSnackbar(
      true,
      {
        labelName: "Please SELECT year equal to year or less then current year",
        labelKey: "PENSION_INVALID_YEAR_SELECTION"
      },
      "warning"
    )
  );
 }
  
const ActionPensionReview_ = ActionPensionReview()


let  data_ =[
  {
    pensionRegister:payload.ProcessInstances[0].pensionRegister,
    pensioner :payload.ProcessInstances[0].pensioner,
    pensionerFinalCalculatedBenefitDetails:payload.ProcessInstances[0].pensionerFinalCalculatedBenefitDetails,   
    PensionersBasicData:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].PensionersBasicData", [] )
  } ];
console.log(state.screenConfiguration.preparedFinalObject)
  console.log(data_)
  console.log("data_")
dispatch(prepareFinalObject("ProcessInstances", data_, []));
//dispatch(prepareFinalObject("ProcessInstances", payload.ProcessInstances, []));
//dispatch(prepareFinalObject("ProcessInstances", ActionPensionReview_.ProcessInstances, []));

return payload

} catch (e) {
  console.log(e);
}
}


}

export const getData = async (action, state, dispatch) => {
 
  await getMdmsData(action, state, dispatch);
  
  // await wfActionLoad(action, state, dispatch).then(res=>{
    
  // })
};
export const getMdmsData = async (action, state, dispatch) => {
  
  let tenantId = getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        { 
          moduleName: "pension", 
          masterDetails: 
          [{ name: "PensionRevisionYear" 
          },
          
         
          
        ] }
      ]
    }
  };
  try {
     let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
   
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
   
    console.log(payload.MdmsRes);
    console.log('mdms')
  } catch (e) {
    console.log(e);
  }
};
export const prepareEditFlow = async (
  state,
  dispatch,
  applicationNumber,
  tenantId
) => {
 
  
  if (applicationNumber) {
    let queryObject = [
      {
        key: "pensionerNumber",
      value: applicationNumber
       
      }];
    queryObject.push({
      key: "tenantId",
      value: tenantId
    });
     
    const response_ = await getSearchPensioner(queryObject);
    let queryObject_ = [
      {
        key: "pensionerNumber",
      value: applicationNumber
       
      }];
      queryObject_.push({
      key: "year",
      value: Number(new Date().getFullYear())
    });
    queryObject_.push({
      key: "tenantId",
      value: tenantId
    });
    //const response = await getSearchPensionerForPensionRevision(queryObject);

    const  response = await httpRequest(
      "post",
      "/pension-services/v1/_searchPensionRegister",
      "_search",
      
      queryObject_
    );
    
     dispatch(prepareFinalObject("ProcessInstancesTemp", get(response, "Pensioners", [])));

     let  data_ =[
      {
        pensionRegister:response.ProcessInstances[0].pensionRegister,
        pensioner :response.ProcessInstances[0].pensioner,
        pensionerFinalCalculatedBenefitDetails:response.ProcessInstances[0].pensionerFinalCalculatedBenefitDetails,
        PensionersBasicData : get(response_, "Pensioners", [])
      } ];
   dispatch(prepareFinalObject("searchScreen", {year:Number(new Date().getFullYear())}, {}));
    dispatch(prepareFinalObject("ProcessInstances", data_, []));
    // dispatch(prepareFinalObject("ProcessInstancesTemp", get(response, "Pensioners", [])));
     dispatch(
      handleField(
        "revision",
        "components.div.children.pensionerverifiedData",
        "props.style",
        { display: "none" }
      )
    );
   

  }
};
const header = getCommonHeader({
  labelName: "Pension Register Review",
  labelKey: "PENSION_PENSION_REVIEW"
});
const RegisterReviewResult = {
  uiFramework: "material-ui",
  name: "review",
  beforeInitScreen: (action, state, dispatch) => {
  //  resetFields(state, dispatch);
    const tenantId = getTenantId();   
    const pensionerNumber = getQueryArg(
      window.location.href,
      "pensionerNumber"
    );
    getData(action, state, dispatch).then(responseAction => {
    
    }); 

       //get Eployee details data
prepareEditFlow(state, dispatch, pensionerNumber, tenantId).then(res=>
  {

  }
);
    
        return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "review"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6
              },
              ...header
            },
            
          }
        },
        // PensionBasicDetails: {
        //   uiFramework: "custom-containers-local",
        //   componentPath: "PensionBasicContainer",
        //   moduleName: "egov-pms",
        //     props: {
        //       dataPath: "ProcessInstances",
        //       moduleName: "DOE_SERVICE",
        //       pageName:"REVISION"
        //     }
        // },

        PensionReview: {
          uiFramework: "custom-containers-local",
         // componentPath: "GridContainer",
          componentPath: "PensionReviewContainer",
          moduleName: "egov-pms",
            // visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
            props: {
              dataPath: "ProcessInstances",
              moduleName: "DOE_SERVICE",
              pageName:"REVISION"
             // updateUrl: "/tl-services/v1/_processWorkflow"
            }
        },

    SearchCard: getCommonCard({

      appPRSearchContainer: getCommonContainer({
        year: getSelectField({
    label: {
      labelName: "Pension Year",
      labelKey: "PENSION_PENSION_YEAR"
    },
    placeholder: {
      labelName: "Select Pension Year",
      labelKey: "PENSION_PENSION_YEAR_SELECT"
    },
    required: true,
    // localePrefix: {
    //   moduleName: "WF",
    //   masterName: "NEWTL"
    // },
    jsonPath: "searchScreen.year",
    sourceJsonPath: "applyScreenMdmsData.pension.PensionRevisionYear",
    gridDefination: {
      xs: 12,
      sm: 4
    }
  }),
  }),
      button: getCommonContainer({
        buttonContainer: getCommonContainer({
    
          searchButton: {
            componentPath: "Button",
            gridDefination: {
              xs: 12,
              sm: 6
              // align: "center"
            },
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
              buttonLabel: getLabel({
                labelName: "searchdoe",
                labelKey: "PENSION_SEARCH_RESULTS_BUTTON_SEARCH"
              })
            },
            onClickDefination: {
              action: "condition",
              callBack: ActionSubmit
            }
          }
        })
      }),

    }),
 
  breakAfterSearch: getBreak(),
        PensionReviewBottom: {
          uiFramework: "custom-containers-local",
         // componentPath: "GridContainer",
          componentPath: "PensionReviewContainer",
          moduleName: "egov-pms",

            // visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
            props: {
              dataPath: "ProcessInstances",
              moduleName: "DOE_SERVICE",
              pageName:"REGISTER"
             // updateUrl: "/tl-services/v1/_processWorkflow"
            }
        },

     
       
      }
    },
    
  }
};

export default RegisterReviewResult;

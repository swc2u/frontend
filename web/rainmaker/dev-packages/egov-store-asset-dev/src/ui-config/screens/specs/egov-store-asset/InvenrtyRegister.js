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
import { getstoreTenantId } from "../../../../ui-utils/storecommonsapi";
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
  InventoryData
  } from "../../../../ui-utils/sampleResponses";
  import { httpRequest } from "../../../../ui-utils";
  import { getSearchResults } from "../../../../ui-utils/commons";  
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
 
];
let searchScreenObject = get(
  state.screenConfiguration.preparedFinalObject,
  "searchScreen",
  {}
);
let Validyear = true;
if( Object.keys(searchScreenObject).length == 0 )
{
  dispatch(
    toggleSnackbar(
      true,
      {
        labelName: "Please fill at least one field to start search",
        labelKey: "ERR_FILL_ONE_FIELDS"
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
//  payload = await httpRequest(
//     "post",
//     "/pension-services/v1/_searchPensionRegister",
//     "_search",
    
//     queryObject
//   );

payload = InventoryData()
dispatch(prepareFinalObject("InventoryData", payload));
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
  


return payload

} catch (e) {
  console.log(e);
}
}


}

export const getData = async (action, state, dispatch) => {
 
  await getMdmsData(action, state, dispatch);
  
   //fetching store name
   const queryObject = [{ key: "tenantId", value: getTenantId()  }];
   getSearchResults(queryObject, dispatch,"storeMaster")
   .then(response =>{
     if(response){
       const storeNames = response.stores.map(item => {
         let code = item.code;
         let name = item.name;
         let department = item.department.name;
         let divisionName = item.divisionName;
         return{code,name,department,divisionName}
       } )
       dispatch(prepareFinalObject("searchMaster.storeNames", storeNames));
     }
   });
};
const getMdmsData = async (state, dispatch, tenantId) => {
   tenantId =  getstoreTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "store-asset",
          masterDetails: [
            { name: "Material", },
           
          ],
        },
      ]
    }
  };
  try {
    const response = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    dispatch(
      prepareFinalObject("searchScreenMdmsData", get(response, "MdmsRes"))
    );
    setRolesList(state, dispatch);
    setHierarchyList(state, dispatch);
    return true;
  } catch (e) {
    console.log(e);
  }
};
// export const prepareEditFlow = async (
//   state,
//   dispatch,  
//   tenantId
// ) => {
 
//   let applicationNumber=""
//   if (applicationNumber) {
//     let queryObject = [
//       {
//         key: "pensionerNumber",
//       value: applicationNumber
       
//       }];
//     queryObject.push({
//       key: "tenantId",
//       value: tenantId
//     });
     
//     const response_ = await getSearchPensioner(queryObject);
//     let queryObject_ = [
//       {
//         key: "pensionerNumber",
//       value: applicationNumber
       
//       }];
//       queryObject_.push({
//       key: "year",
//       value: Number(new Date().getFullYear())
//     });
//     queryObject_.push({
//       key: "tenantId",
//       value: tenantId
//     });
//     //const response = await getSearchPensionerForPensionRevision(queryObject);

//     const  response = await httpRequest(
//       "post",
//       "/pension-services/v1/_searchPensionRegister",
//       "_search",
      
//       queryObject_
//     );
    
//      dispatch(prepareFinalObject("ProcessInstancesTemp", get(response, "Pensioners", [])));

//      let  data_ =[
//       {
//         pensionRegister:response.ProcessInstances[0].pensionRegister,
//         pensioner :response.ProcessInstances[0].pensioner,
//         pensionerFinalCalculatedBenefitDetails:response.ProcessInstances[0].pensionerFinalCalculatedBenefitDetails,
//         PensionersBasicData : get(response_, "Pensioners", [])
//       } ];
//    dispatch(prepareFinalObject("searchScreen", {year:Number(new Date().getFullYear())}, {}));
//     dispatch(prepareFinalObject("ProcessInstances", data_, []));
//     // dispatch(prepareFinalObject("ProcessInstancesTemp", get(response, "Pensioners", [])));
//      dispatch(
//       handleField(
//         "revision",
//         "components.div.children.pensionerverifiedData",
//         "props.style",
//         { display: "none" }
//       )
//     );
   

//   }
// };
const header = getCommonHeader({
  labelName: "Inventory Register",
  labelKey: "STORE_INVENTORY_REGISTER"
});
const RegisterReviewResult = {
  uiFramework: "material-ui",
  name: "InvenrtyRegister",
  beforeInitScreen: (action, state, dispatch) => {
  //  resetFields(state, dispatch);
    const tenantId = getTenantId();   
    
    getData(action, state, dispatch).then(responseAction => {
    
    }); 
       //get Eployee details data       
// prepareEditFlow(state, dispatch,  tenantId).then(res=>
//   {
//   }
// );
    
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
 
    SearchCard: getCommonCard({

      appPRSearchContainer: getCommonContainer({
        storeName: {
          ...getSelectField({
            label: { labelName: "Store Name", labelKey: "STORE_DETAILS_STORE_NAME" },
            placeholder: {
              labelName: "Select Store Name",
              labelKey: "STORE_DETAILS_STORE_NAME_SELECT"
            },
            required: true,
            jsonPath: "searchScreen.storeName",
            sourceJsonPath: "searchMaster.storeNames",
            props: {
              disabled : false,
              className: "hr-generic-selectfield",
              optionValue: "code",
              optionLabel: "name"
            }
          }),

        },
        materialName: getSelectField({
          label: { labelName: "Material  Name", labelKey: "STORE_MATERIAL_NAME" },
          placeholder: {
            labelName: "Select Materila  Name",
            labelKey: "STORE_MATERIAL_NAME_SELECT",
          },
          required: false,
          jsonPath: "searchScreen.code",
          gridDefination: {
            xs: 12,
            sm: 4,
          },
          sourceJsonPath: "searchScreenMdmsData.store-asset.Material",
          props: {
            optionValue: "code",
            optionLabel: "name",
          },
         
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
          componentPath: "InventoryContainer",
          moduleName: "egov-store-asset",
            props: {
              dataPath: "InventoryData",
              moduleName: "STORE_ASSET",
              pageName:"INVENTRY"
            }
        },

     
       
      }
    },
    
  }
};

export default RegisterReviewResult;

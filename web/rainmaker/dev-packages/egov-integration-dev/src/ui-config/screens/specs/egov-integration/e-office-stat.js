import {
    getCommonHeader,
    getCommonCard,
    getCommonContainer, 
    getLabel,
    getPattern,
    getSelectField,
    getTextField,
    getBreak
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  //import { DOEApplyApplication} from "./applydoeResources/DOEApplyApplication";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { validateFields, getTextToLocalMapping } from "../utils";
  import { getSearchPensioner,getPTPattern } from "../../../../ui-utils/commons";
  import { toggleSnackbar,toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import store from "../../../../ui-redux/store";
  import { getstoreTenantId } from "../../../../ui-utils/storecommonsapi";
  import {
    getTenantId,getUserInfo
  } from "egov-ui-kit/utils/localStorageUtils";
  import find from "lodash/find";
  import set from "lodash/set";
  import get from "lodash/get";
  import {
    prepareFinalObject,
    handleScreenConfigurationFieldChange as handleField
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import {  
    sampleeofficestat
    } from "../../../../ui-utils/sampleResponses";
    import { httpRequest } from "../../../../ui-utils";
    import { getSearchResults } from "../../../../ui-utils/commons"; 
import { stringify } from "jsonpath";


  export const getData = async (action, state, dispatch) => {
   
    await getMdmsData(state, dispatch);
    
    
  };
  const getMdmsData = async (state, dispatch) => {
    const tenantId =  getTenantId();
    // let mdmsBody = {
    //   eOfficeRequest: {
    //     orgid: 37,
    //     postdetailid:212,
       
    //   }
    // };
    const userInfo = JSON.parse(getUserInfo());
    let employeeCode ='11819';
    if(userInfo){
      
      const queryParams = [{ key: "uuids", value: userInfo.uuid },{ key: "tenantId", value:  tenantId }];
      try { 
        const payload = await httpRequest(
          "post",
          "/egov-hrms/employees/_search",
          "_search",
          queryParams
        );
        if(payload){ 
          employeeCode = payload.Employees[0].code;
          // dispatch(prepareFinalObject("searchScreen.empCode", payload.Employees[0].code));
          // dispatch(prepareFinalObject("empCode", payload.Employees[0].code));
        }
        
      } catch (e) {
        console.log(e);
      }
    }
    let postdetailid =[]
    let orgid = 37
    // call api integration-services/eoffice/v1/_getPostDetailsId
   // dispatch(toggleSpinner());
    let Request ={
      employeePostDetailMap:{
        //employeeCode:"11819",// need to replace by login user id
        employeeCode:employeeCode,
      }
    }
    try {
      let response_ = await httpRequest(
          "post",
          "/integration-services/eoffice/v1/_getPostDetailsId",
          "_getPostDetailsId",
          [],
          Request
      );
      

    //  let response_ = 
    //   {
    //     ResponseBody: [
    //       {
    //         employee_code:"1991010019S",
    //         org_unit_id:"393",
    //         postdetail: "[{'post_detail_id' : '1622'}]"
    //       },
    //       {
    //         employee_code:"1991010019S",
    //         org_unit_id:"393",
    //         postdetail: "[{'post_detail_id' : '1622'}]"
    //       },
    //       {
    //         employee_code:"1991010019S",
    //         org_unit_id:"393",
    //         postdetail: "[{'post_detail_id' : '1622'}]"
    //       }
    //     ]

    //   }
      
      //
      let APIData_ =[]
      let totalVIPReceiptsPending =0;
      let totalFilesPendingCnt =0;
      let totalFilesClosed =0;
      let totalReceiptsPending =0;
      let totalReceiptsClosed =0;
      let postdetailid_ =''
      if (response_ && response_.ResponseBody) {
        //[{"post_detail_id" : "1882"},{"post_detail_id" : "2323"}]
        if(response_.ResponseBody.length>0)
        {
        for (let index = 0; index < response_.ResponseBody.length; index++) {
          postdetailid =[];
          const element = response_.ResponseBody[index];
          let postdetail = response_.ResponseBody[index].postdetail
          orgid = response_.ResponseBody[index].org_unit_id
          //let valuesArray = stringify(postdetail)
         let  valuesArray = JSON.parse(postdetail);
          for (let index = 0; index < valuesArray.length; index++) {
            const element = valuesArray[index];  
            postdetailid.push(element.post_detail_id)
          }
          // call get in loop
          let mdmsBody_ = {
            eOfficeRequest: {
             // orgid: 37, // set from  integration-services/eoffice/v1/_getPostDetailsId responce
              orgid: orgid,
              postdetailid:postdetailid,
             
            }
          };
          postdetailid_ =postdetailid;
          let curindex = 0;// index;
          dispatch(toggleSpinner());
          try {
            let response = await httpRequest(
              "post",
              "/integration-services/eoffice/v1/_get",
              "_get",
              [],
              mdmsBody_
            );
           // let  APIData = response;
              let  APIData = sampleeofficestat()
            if(APIData.ResponseBody && APIData.ResponseBody[curindex].length>0)
            { 
              if(APIData.ResponseBody && APIData.ResponseBody[curindex])
              {
               // postdetailid_ = APIData.ResponseBody[curindex].postdetailid
                if(APIData.ResponseBody[curindex].details.VipReceipts)//totalVIPReceiptsPending
                {
                  if(APIData.ResponseBody[curindex].details.VipReceipts.Row !== undefined)
                  {
                    let data = APIData.ResponseBody[curindex].details.VipReceipts.Row.Column
                    for (let index = 0; index < data.length; index++) {
                      const element = data[index];
                      if(element.name ==="Total")
                      {
                        totalVIPReceiptsPending = element.content
                      }                
                    }             
                  }
        
                }
                 if(APIData.ResponseBody[curindex].details.ReceiptPending)//totalReceiptsPending
                {
                  if(APIData.ResponseBody[curindex].details.ReceiptPending.Row !== undefined)
                  {
                    let ReceiptPending = APIData.ResponseBody[curindex].details.ReceiptPending.Row.Column
                    for (let index = 0; index < ReceiptPending.length; index++) {
                      const element = ReceiptPending[index];
                      if(element.name ==="Total")
                      {
                        totalReceiptsPending = element.content
                      }                
                    }
                  }
        
                }
                 if(APIData.ResponseBody[curindex].details.FilePending)//totalFilesPendingCnt
                {
                  if(APIData.ResponseBody[curindex].details.FilePending.Row !== undefined)
                  {
                    let FilePending = APIData.ResponseBody[curindex].details.FilePending.Row.Column
                    for (let index = 0; index < FilePending.length; index++) {
                      const element = FilePending[index];
                      if(element.name ==="Total")
                      {
                        totalFilesPendingCnt = element.content
                      }                
                    }
                  }
        
                }
                 if(APIData.ResponseBody[curindex].details.FileClosed)//totalFilesClosed
                {
                  if(APIData.ResponseBody[curindex].details.FileClosed.Row !== undefined)
                  {
                    let FileClosed = APIData.ResponseBody[curindex].details.FileClosed.Row.Column
                    for (let index = 0; index < FileClosed.length; index++) {
                      const element = FileClosed[index];
                      if(element.name ==="Total")
                      {
                        totalFilesClosed = element.content
                      }                
                    }
                  }
        
                }
                 if(APIData.ResponseBody[curindex].details.ReceiptClosed)//totalReceiptsClosed
                {
                  if(APIData.ResponseBody[curindex].details.ReceiptClosed.Row !== undefined)
                  {
                    let ReceiptClosed = APIData.ResponseBody[curindex].details.ReceiptClosed.Row.Column
                    for (let index = 0; index < ReceiptClosed.length; index++) {
                      const element = ReceiptClosed[index];
                      if(element.name ==="Total")
                      {
                        totalReceiptsClosed = element.content
                      }                
                    }
                  }
        
                }
              }
        
               APIData ={
                eofficestat:{
                  totalFilesClosed:totalFilesClosed,
                  totalFilesPendingCnt:totalFilesPendingCnt,
                  totalReceiptsClosed:totalReceiptsClosed,
                  totalReceiptsPending:totalReceiptsPending,
                  totalVIPReceiptsPending:totalVIPReceiptsPending,
                  postdetailid:postdetailid_
        
                }
              }
               APIData_.push(APIData)
             // dispatch(prepareFinalObject("APIData",APIData));
              // dispatch(prepareFinalObject("searchScreenMdmsData",response.ResponseBody))
      
      
            }
           
            
        
           // return true;
          } catch (e) {
          //  alert('1')
          dispatch(toggleSpinner());
            console.log(e);
          }
          /// end          
        }
        if(APIData_.length == 0)
        {
         let APIDataTemp ={
            eofficestat:{
              totalFilesClosed:0,
              totalFilesPendingCnt:0,
              totalReceiptsClosed:0,
              totalReceiptsPending:0,
              totalVIPReceiptsPending:0,
              postdetailid:0
    
            }
          }
          APIData_.push(APIDataTemp)
          const errorMessage = {
            labelName: "No records found",
            labelKey: "INTIGRATION_EOFFICE_POST_DETAIL_DATAS_HEADING"
          };
          dispatch(toggleSnackbar(true, errorMessage, "warning"));

        }
        dispatch(prepareFinalObject("APIData",APIData_));
        
        //dispatch(toggleSpinner());
      }
      else{
        const errorMessage = {
          labelName: "No records found",
          labelKey: "INTIGRATION_EOFFICE_POST_DETAIL_DATAS_HEADING"
        };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
      }

      }
  } catch (error) {
    
      dispatch(toggleSpinner());
      console.log(error);
  }
    //
    let mdmsBody = {
      eOfficeRequest: {
       // orgid: 37, // set from  integration-services/eoffice/v1/_getPostDetailsId responce
        orgid: orgid,
        postdetailid:postdetailid,
       
      }
    };
    // try {
    //   const response = await httpRequest(
    //     "post",
    //     "/integration-services/eoffice/v1/_get",
    //     "_get",
    //     [],
    //     mdmsBody
    //   );
    //   if(response)
    //   {
    //     let  APIData = response;
    //     let totalVIPReceiptsPending =0;
    //     let totalFilesPendingCnt =0;
    //     let totalFilesClosed =0;
    //     let totalReceiptsPending =0;
    //     let totalReceiptsClosed =0;
  
    //     if(APIData.ResponseBody[curindex].details)
    //     {
  
    //       if(APIData.ResponseBody[curindex].details.VipReceipts)//totalVIPReceiptsPending
    //       {
    //         if(APIData.ResponseBody[curindex].details.VipReceipts.Row !== undefined)
    //         {
    //           let data = APIData.ResponseBody[curindex].details.VipReceipts.Row.Column
    //           for (let index = 0; index < data.length; index++) {
    //             const element = data[index];
    //             if(element.name ==="Total")
    //             {
    //               totalVIPReceiptsPending = element.content
    //             }                
    //           }             
    //         }
  
    //       }
    //        if(APIData.ResponseBody[curindex].details.ReceiptPending)//totalReceiptsPending
    //       {
    //         if(APIData.ResponseBody[curindex].details.ReceiptPending.Row !== undefined)
    //         {
    //           let ReceiptPending = APIData.ResponseBody[curindex].details.ReceiptPending.Row.Column
    //           for (let index = 0; index < ReceiptPending.length; index++) {
    //             const element = ReceiptPending[index];
    //             if(element.name ==="Total")
    //             {
    //               totalReceiptsPending = element.content
    //             }                
    //           }
    //         }
  
    //       }
    //        if(APIData.ResponseBody[curindex].details.FilePending)//totalFilesPendingCnt
    //       {
    //         if(APIData.ResponseBody[curindex].details.FilePending.Row !== undefined)
    //         {
    //           let FilePending = APIData.ResponseBody[curindex].details.FilePending.Row.Column
    //           for (let index = 0; index < FilePending.length; index++) {
    //             const element = FilePending[index];
    //             if(element.name ==="Total")
    //             {
    //               totalReceiptsPending = element.content
    //             }                
    //           }
    //         }
  
    //       }
    //        if(APIData.ResponseBody[curindex].details.FileClosed)//totalFilesClosed
    //       {
    //         if(APIData.ResponseBody[curindex].details.FileClosed.Row !== undefined)
    //         {
    //           let FileClosed = APIData.ResponseBody[curindex].details.FileClosed.Row.Column
    //           for (let index = 0; index < FileClosed.length; index++) {
    //             const element = FileClosed[index];
    //             if(element.name ==="Total")
    //             {
    //               totalReceiptsPending = element.content
    //             }                
    //           }
    //         }
  
    //       }
    //        if(APIData.ResponseBody[curindex].details.ReceiptClosed)//totalReceiptsClosed
    //       {
    //         if(APIData.ResponseBody[curindex].details.ReceiptClosed.Row !== undefined)
    //         {
    //           let ReceiptClosed = APIData.ResponseBody[curindex].details.ReceiptClosed.Row.Column
    //           for (let index = 0; index < ReceiptClosed.length; index++) {
    //             const element = ReceiptClosed[index];
    //             if(element.name ==="Total")
    //             {
    //               totalReceiptsClosed = element.content
    //             }                
    //           }
    //         }
  
    //       }
    //     }
  
    //      APIData ={
    //       eofficestat:{
    //         totalFilesClosed:totalFilesClosed,
    //         totalFilesPendingCnt:totalFilesPendingCnt,
    //         totalReceiptsClosed:totalReceiptsClosed,
    //         totalReceiptsPending:totalReceiptsPending,
    //         totalVIPReceiptsPending:totalVIPReceiptsPending,
  
    //       }
    //     }
    //     dispatch(prepareFinalObject("APIData",APIData));
    //     // dispatch(prepareFinalObject("searchScreenMdmsData",response.ResponseBody))


    //   }
    //  //dispatch(prepareFinalObject("searchScreenMdmsData", get(response, "ResponseBody.result")));
    //   const {result} = state.screenConfiguration.preparedFinalObject.searchScreenMdmsData;
    //   // result.push(
    //   //   {
    //   //     propertyTaxId:"others",
    //   //     isActive:true,
    //   //     userId:0
    //   //   }
    //   // )
    //   // dispatch(prepareFinalObject("searchScreenMdmsData.result",result))
      
  
    //   return true;
    // } catch (e) {
    // //  alert('1')
    // dispatch(toggleSpinner());
    //   console.log(e);
    // }
  };
  
  const header = getCommonHeader({
    labelName: "View E-Office Stat",
    labelKey: "INTIGRATION_EOFFICE_STATE_HEADING_HOME"
  });
  const RegisterReviewResult = {
    uiFramework: "material-ui",
    name: "e-office-stat",
    beforeInitScreen: (action, state, dispatch) => {
    //  resetFields(state, dispatch);
      const tenantId = getTenantId();   
      dispatch(prepareFinalObject("searchScreen",{}));
      const propertyTaxId = getQueryArg(
        window.location.href,
        "propertyId"
      );
 
     // let  APIData =sampleeofficestat();
     
  
      getData(action, state, dispatch).then(responseAction => {    
      
      });
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
                //...header
              },
              
            }
          },
   
    breakAfterSearch: getBreak(),
          PensionReviewBottom: {
            uiFramework: "custom-containers-local",        
            componentPath: "EofficestatContainer",
            moduleName: "egov-integration",
              props: {
                dataPath: "records",
                moduleName: "RTI",
                pageName:"INTIGRATION_ESTAT",
  
              }
          },
         
        }
      },
      
    }
  };
  
  export default RegisterReviewResult;
  
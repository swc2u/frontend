import * as actionTypes from "./actionTypes";
import * as commonActions from "../common/actions";
import {CREATEBWTAPPLICATION, APPLICATION,MCCAPPLICATION, COMPLAINT, CATEGORY,PAYMENT,HISTORY,AFTERPAYMENTAPI,DWONLOADPAYMENTRECEIPT,DOWNLOADBWTAPPLICATION,DOWNLOADAPPLICATION,DWONLOADPERMISSIONLETTER } from "egov-ui-kit/utils/endPoints";
import { httpRequest } from "egov-ui-kit/utils/api";
import difference from "lodash/difference";
import uniq from "lodash/uniq";
import commonConfig from "config/common.js";

//checking users there in action history
const checkUsers = (dispatch, state, actionHistory, hasUsers, tenantId) => {
  if (hasUsers) {
    let employeeIds = [],
      userIds = [];
    actionHistory.forEach((actions) => {
      actions &&
        actions.actions &&
        actions.actions.forEach((action) => {
          if (action.by) {
            let { userId, employeeId } = getUserEmployeeId(action.by);
            if (userId) userIds.push(userId);
            if (employeeId) employeeIds.push(employeeId);
          }
          if (action.assignee) {
            let { userId, employeeId } = getUserEmployeeId(action.assignee);
            if (userId) userIds.push(userId);
            if (employeeId) employeeIds.push(employeeId);
          }
        });
    });
    let { common, auth } = state;
    if (employeeIds.length > 0) {
      let cachedEmployeeIds = [];
      if (common && common.employeeById) {
        cachedEmployeeIds = Object.keys(common.employeeById);
      }
      let value =
        uniq(difference(employeeIds, cachedEmployeeIds)).indexOf(auth.userInfo.id) === -1 && auth.userInfo.type !== "CITIZEN"
          ? [...uniq(difference(employeeIds, cachedEmployeeIds)), auth.userInfo.id].join(",")
          : [...uniq(difference(employeeIds, cachedEmployeeIds))].join(",");
      const queryObject = tenantId ? [{ key: "tenantId", value: tenantId }, { key: "ids", value }] : [{ key: "ids", value }];
      if (value.length) dispatch(commonActions.fetchEmployees(queryObject));
    }
    if (userIds.length > 0) {
      let cachedUserIds = [];
      if (common && common.citizenById) {
        cachedUserIds = Object.keys(common.citizenById);
      }
      let id =
        uniq(difference(userIds, cachedUserIds)).indexOf(auth.userInfo.id) === -1 && auth.userInfo.type === "CITIZEN"
          ? [...uniq(difference(userIds, cachedUserIds)), auth.userInfo.id]
          : [...uniq(difference(userIds, cachedUserIds))];
      if (id.length) dispatch(commonActions.fetchCitizens({ id }));
    }
  }
};

//get user and employee id from action
const getUserEmployeeId = (user) => {
  const splitArray = user.split(":");
  const id = splitArray[0];
  const role = splitArray[1];
  if (role && role.toLowerCase() === "citizen") {
    return { userId: id };
  } else {
    return { employeeId: id };
  }
};

// complaint categories success
const complaintCategoriesFetchSucess = (payload) => {
  return {
    type: actionTypes.COMPLAINTS_CATEGORIES_FETCH_SUCCESS,
    payload,
  };
};

const complaintCategoriesFetchError = (error) => {
  return {
    type: actionTypes.COMPLAINTS_CATEGORIES_FETCH_ERROR,
    error,
  };
};


// complaint department success
const complaintDepartmentFetchSucess = (payload) => {
  return {
    type: actionTypes.COMPLAINTS_DEPARTMENT_FETCH_SUCCESS,
    payload,
  };
};

const complaintDepartmentFetchError = (error) => {
  return {
    type: actionTypes.COMPLAINTS_DEPARTMENT_FETCH_ERROR,
    error,
  };
};

// complaint autoRoutingEscalation success
const complaintAutoRouteFetchSucess = (payload) => {
  return {
    type: actionTypes.COMPLAINTS_AUTOROUTING_FETCH_SUCCESS,
    payload,
  };
};

const complaintAutoRouteFetchError = (error) => {
  return {
    type: actionTypes.COMPLAINTS_AUTOROUTING_FETCH_ERROR,
    error,
  };
};

// complaint Sector success
const complaintSectorFetchSucess = (payload) => {
  return {
    type: actionTypes.COMPLAINTS_SECTOR_FETCH_SUCCESS,
    payload,
  };
};

const complaintSectorFetchError = (error) => {
  return {
    type: actionTypes.COMPLAINTS_SECTOR_FETCH_ERROR,
    error,
  };
};

//application sector fetch

const applicationSectorFetchSucess = (payload) => {
	return {
		type: actionTypes.APPLICATION_SECTOR_FETCH_SUCCESS,
		payload,
	};
};

const applicationSectorFetchError = (error) => {
	return {
		type: actionTypes.APPLICATION_SECTOR_FETCH_ERROR,
		error,
	};
};

//fetch MCC applications

const MCCapplicationFetchComplete = (payload, overWrite) => {
	return {
		type: actionTypes.MCCAPPLICATION_FETCH_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};
const MCCapplicationFetchError = (error) => {
	return {
		type: actionTypes.MCCAPPLICATION_FETCH_ERROR,
		error,
	};
};

//Create special request

const createWaterTankerComplete= (payload, overWrite) => {
	return {
		type: actionTypes.CREATE_WATER_TANKER_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};

const createWaterTankerError = (error) => {
	return {
		type: actionTypes.CREATE_WATER_ERROR,
		error,
	};
};

//Fetch Details after payment
const fetchAfterPaymentData = (payload, overWrite) => {
	return {
		type: actionTypes.AFTER_PAYMENT_FETCH_DETAILS,
		payload,
		overWrite: overWrite,
	};
};
const fetchAfterPaymentError = (error) => {
	return {
		type: actionTypes.AFTER_PAYMENT_FETCH_ERROR,
		error,
	};
};

//fetch history details

const historyFetchComplete = (payload, overWrite) => {
	return {
		type: actionTypes.HISTORY_FETCH_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};
const historyFetchError = (error) => {
	return {
		type: actionTypes.HISTORY_FETCH_ERROR,
		error,
	};
};

//fetch payment Details

const paymentFetchComplete = (payload, overWrite) => {
	return {
		type: actionTypes.PAYMENT_FETCH_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};
const paymentFetchError = (error) => {
	return {
		type: actionTypes.PAYMENT_FETCH_ERROR,
		error,
	};
};
//OswMCC
const OSBMfetchperDayRateComplete = (payload, overWrite) => {
	return {
		type: actionTypes.OSBMPAYMENT_PER_DAY_FETCH_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};

const OSBMfetchperDayRateError = (error) => {
	return {
		type: actionTypes.OSBMPAYMENT_PER_DAY_FETCH_FETCH_ERROR,
		error,
	};
};

const fetchperDayRateComplete = (payload, overWrite) => {
	return {
		type: actionTypes.PAYMENT_PER_DAY_FETCH_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};

const fetchperDayRateError = (error) => {
	return {
		type: actionTypes.PAYMENT_PER_DAY_FETCH_FETCH_ERROR,
		error,
	};
};

const downloadPermissionReceiptCompleteforCG = (payload, overWrite) => {
	return {
		type: actionTypes.DOWNLOAD_NEWRECEIPT_COMPLETE_CG,
		payload,
		overWrite: overWrite,
	};
};

const downloaddPermissionReceiptErrorforCG = (error) => {
	return {
		type: actionTypes.DOWNLOAD_NEWRECEIPT_ERROR_CG,
		error,
	};
};

const downloadMCCPLComplete = (payload, overWrite) => {
	return {
		type: actionTypes.DOWNLOAD_PLMCC_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};

const downloadMCCPLError = (error) => {
	return {
		type: actionTypes.DOWNLOAD_PLMCC_ERROR,
		error,
	};
};

const downloadAPPCompleteMCC = (payload, overWrite) => {
	console.log('payload', payload, overWrite)
	return {
		type: actionTypes.DOWNLOAD_MCCAPP_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};

const downloadAPPErrorMCC = (error) => {
	return {
		type: actionTypes.DOWNLOAD_MCCAPP_ERROR,
		error,
	};
};

const downloadReceiptCompleteforCG = (payload, overWrite) => {
	return {
		type: actionTypes.DOWNLOAD_RECEIPT_COMPLETE_CG,
		payload,
		overWrite: overWrite,
	};
};

const downloadReceiptErrorforCG = (error) => {
	return {
		type: actionTypes.DOWNLOAD_RECEIPT_ERROR_CG,
		error,
	};
};
const downloadApplicationCompleteforCG = (payload, overWrite) => {
	return {
		type: actionTypes.DOWNLOAD_APPLICATION_COMPLETE_CG,
		payload,
		overWrite: overWrite,
	};
};

const downloadApplicationErrorforCG = (error) => {
	return {
		type: actionTypes.DOWNLOAD_APPLICATION_ERROR_CG,
		error,
	};
};

//Download permission letter

const downloadPermissionLetterComplete= (payload, overWrite) => {
	return {
		type: actionTypes.DOWNLOAD_LETTER_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};
const downloadPermissionLetterError = (error) => {
	return {
		type: actionTypes.DOWNLOAD_LETTER_ERROR,
		error,
	};
};
//Download water tanker application

const downloadBWTApplicationComplete = (payload, overWrite) => {
	return {
		type: actionTypes.DOWNLOAD_BWT_APPLICATION_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};
const downloadBWTApplicationError = (error) => {
	return {
		type: actionTypes.DOWNLOAD_BWT_APPLICATION_ERROR,
		error,
	};
};

//Download OSBM  application

const downloadApplicationComplete = (payload, overWrite) => {
	return {
		type: actionTypes.DOWNLOAD_APPLICATION_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};

const downloadApplicationError = (error) => {
	return {
		type: actionTypes.DOWNLOAD_APPLICATION_ERROR,
		error,
	};
};

//Download OSBM payment receipt
const downloadReceiptComplete = (payload, overWrite) => {
	return {
		type: actionTypes.DOWNLOAD_RECEIPT_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};
const downloadReceiptError = (error) => {
	return {
		type: actionTypes.DOWNLOAD_RECEIPT_ERROR,
		error,
	};
};

//Fetch applications list

const applicationFetchComplete = (payload, overWrite) => {
	return {
		type: actionTypes.APPLICATION_FETCH_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};

const applicationFetchError = (error) => {
	return {
		type: actionTypes.APPLICATION_FETCH_ERROR,
		error,
	};
};


// complaints actions
const complaintFetchPending = () => {
  return {
    type: actionTypes.COMPLAINTS_FETCH_PENDING,
  };
};

const complaintFetchComplete = (payload, overWrite) => {
  return {
    type: actionTypes.COMPLAINTS_FETCH_COMPLETE,
    payload,
    overWrite: overWrite,
  };
};

const complaintSendSMS = (message) => {
  return {
    type: actionTypes.COMPLAINTS_SEND_MESSAGE,
    message,
  };
};

const complaintSendSMSTo = (message) => {
  return {
    type: actionTypes.COMPLAINTS_SEND_MESSAGE_SHARECONTENT_TO,
    message,
  };
};

const complaintSendSMSMedia = (message) => {
  return {
    type: actionTypes.COMPLAINTS_SEND_MESSAGE_SHAREMEDIA,
    message,
  };
};

const complaintFetchError = (error) => {
  return {
    type: actionTypes.COMPLAINTS_FETCH_ERROR,
    error,
  };
};

const complaintSortOrder = (order) => {
  return { type: actionTypes.COMPLAINTS_SORT_ORDER, order };
};

export const getComplaintDisplayOrder = (order) => {
  return async (dispatch, getState) => {
    dispatch(complaintSortOrder(order));
  };
};

export const fetchComplaints = (queryObject, hasUsers = true, overWrite) => {
  return async (dispatch, getState) => {
    dispatch(complaintFetchPending());
    try {
      let tenantId = "";
      const payload = await httpRequest(COMPLAINT.GET.URL, COMPLAINT.GET.ACTION, queryObject);
      if (payload.services && payload.services.length === 1) {
        tenantId = payload.services[0].tenantId;
      }
      checkUsers(dispatch, getState(), payload.actionHistory, hasUsers, tenantId);
      dispatch(complaintFetchComplete(payload, overWrite));
    } catch (error) {
      dispatch(complaintFetchError(error.message));
    }
  };
};

export const sendMessage = (message) => {
  return async (dispatch, getState) => {
    dispatch(complaintSendSMS(message));
  };
};

export const sendMessageTo = (message) => {
  return async (dispatch, getState) => {
    dispatch(complaintSendSMSTo(message));
  };
};

export const sendMessageMedia = (message) => {
  return async (dispatch, getState) => {
    dispatch(complaintSendSMSMedia(message));
  };
};

export const fetchComplaintCategories = () => {
  //Fetching Complaint Categories from MDMS
  let requestBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "RAINMAKER-PGR",
          masterDetails: [
            {
              name: "ServiceDefs",
            },
          ],
        },
      ],
    },
  };

  return async (dispatch) => {
    try {
      const payload = await httpRequest(CATEGORY.GET.URL, CATEGORY.GET.ACTION, [], requestBody);
      dispatch(complaintCategoriesFetchSucess(payload));
    } catch (error) {
      dispatch(complaintCategoriesFetchError(error.message));
    }
  };
};

export const fetchComplaintDepartment = () => {
  //Fetching Complaint Categories from MDMS
  let requestBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "RAINMAKER-PGR",
          masterDetails: [
            {
              name: "PgrDepartment",
            },
          ],
        },
      ],
    },
  };

  return async (dispatch) => {
    try {
      const payload = await httpRequest(CATEGORY.GET.URL, CATEGORY.GET.ACTION, [], requestBody);
      dispatch(complaintDepartmentFetchSucess(payload));
    } catch (error) {
      dispatch(complaintDepartmentFetchError(error.message));
    }
  };
};

export const fetchComplaintAutoRouting = () => {
  //Fetching Complaint auto from MDMS
  let requestBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "RAINMAKER-PGR",
          masterDetails: [
            {
              name: "AutoroutingEscalationMap",
            },
          ],
        },
      ],
    },
  };

  return async (dispatch) => {
    try {
      const payload = await httpRequest(CATEGORY.GET.URL, CATEGORY.GET.ACTION, [], requestBody);
      dispatch(complaintAutoRouteFetchSucess(payload));
    } catch (error) {
      dispatch(complaintCategoriesFetchError(error.message));
    }
  };
};
  export const fetchComplaintSector = () => {
    //Fetching Complaint Categories from MDMS
    let requestBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [
          {
            moduleName: "RAINMAKER-PGR",
            masterDetails: [
              {
                name: "Sector",
              },
            ],
          },
        ],
      },
    };
    return async (dispatch) => {
      try {
        const payload = await httpRequest(CATEGORY.GET.URL, CATEGORY.GET.ACTION, [], requestBody);
        dispatch(complaintSectorFetchSucess(payload));
      } catch (error) {
        dispatch(complaintSectorFetchError(error.message));
      }
    };
  };

  export const fetchApplications = (requestBody, hasUsers = true, overWrite) => {
    requestBody.tenantId = "ch"
    return async (dispatch, getState) => {
      try {
        let tenantId = "";
        const payload = await httpRequest(APPLICATION.POST.URL, APPLICATION.POST.ACTION, [], requestBody);
      
        dispatch(applicationFetchComplete(payload, overWrite));
      } catch (error) {
        dispatch(applicationFetchError(error.message));
      }
    };
  };
  export const downloadPaymentReceipt = (requestBody, hasUsers = true, overWrite) => {
   
   
    return async (dispatch, getState) => {
      try {
        let tenantId = "";
        const payload = await httpRequest(DWONLOADPAYMENTRECEIPT.POST.URL, DWONLOADPAYMENTRECEIPT.POST.ACTION, [], requestBody);
      
        dispatch(downloadReceiptComplete(payload, overWrite));
      } catch (error) {
        dispatch(downloadReceiptError(error.message));
      }
    };
  };
  export const downloadApplication = (requestBody, hasUsers = true, overWrite) => {
    
   
    return async (dispatch, getState) => {
      try {
        let tenantId = "";
      
        const payload = await httpRequest(DOWNLOADAPPLICATION.POST.URL, DOWNLOADAPPLICATION.POST.ACTION, [], requestBody);
       
        dispatch(downloadApplicationComplete(payload, overWrite));
      } catch (error) {
        dispatch(downloadApplicationError(error.message));
      }
    };
  };

  export const downloadBWTApplication = (requestBody, hasUsers = true, overWrite) => {
    return async (dispatch, getState) => {
      try {
        let tenantId = "";
        const payload = await httpRequest(DOWNLOADBWTAPPLICATION.POST.URL, DOWNLOADBWTAPPLICATION.POST.ACTION, [], requestBody);
       
        dispatch(downloadBWTApplicationComplete(payload, overWrite));
      } catch (error) {
        dispatch(downloadBWTApplicationError(error.message));
      }
    };
  };

  export const downloadPermissionLetter = (requestBody, hasUsers = true, overWrite) => {
   
  
    return async (dispatch, getState) => {
      try {
        let tenantId = "";
        const payload = await httpRequest(DWONLOADPERMISSIONLETTER.POST.URL, DWONLOADPERMISSIONLETTER.POST.ACTION, [], requestBody);
        dispatch(downloadPermissionLetterComplete(payload, overWrite));
      } catch (error) {
        dispatch(downloadPermissionLetterError(error.message));
      }
    };
  };
  
  export const fetchPayment = (queryObject, hasUsers = true, overWrite) => {
    return async (dispatch, getState) => {
      try {
        let tenantId = "";
        const payload = await httpRequest(PAYMENT.POST.URL, PAYMENT.POST.ACTION, queryObject);
        dispatch(paymentFetchComplete(payload, overWrite));
      } catch (error) {
        dispatch(paymentFetchError(error.message));
      }
    };
  };
  export const fetchHistory = (queryObject, hasUsers = true, overWrite) => {
    return async (dispatch, getState) => {
      try {
        let tenantId = "";
        const payload = await httpRequest(HISTORY.POST.URL, HISTORY.POST.ACTION, queryObject);
      
        dispatch(historyFetchComplete(payload, overWrite));
      } catch (error) {
        dispatch(historyFetchError(error.message));
      }
    };
  };
  export const fetchDataAfterPayment = (queryObject, hasUsers = true, overWrite) => {
    return async (dispatch, getState) => {
      try {
        let tenantId = "";
        const payload = await httpRequest(AFTERPAYMENTAPI.POST.URL, AFTERPAYMENTAPI.POST.ACTION, queryObject);
        
        dispatch(fetchAfterPaymentData(payload, overWrite));
      } catch (error) {
        dispatch(fetchAfterPaymentError(error.message));
      }
    };
  };
  export const createWaterTankerApplication = (requestBody, hasUsers = true, overWrite) => {
    return async (dispatch, getState) => {
      try {
        let tenantId = "";
  
        const payload = await httpRequest(CREATEBWTAPPLICATION.POST.URL, CREATEBWTAPPLICATION.POST.ACTION, [], requestBody);
        dispatch(createWaterTankerComplete(payload, overWrite));
      } catch (error) {
        dispatch(createWaterTankerError(error.message));
      }
    };
  };
  export const fetchMccApplications = (requestBody, hasUsers = true, overWrite) => {
		requestBody.tenantId = "ch"
		return async (dispatch, getState) => {
			try {
				let tenantId = "";
				const payload = await httpRequest(MCCAPPLICATION.POST.URL, MCCAPPLICATION.POST.ACTION, [], requestBody);
				dispatch(MCCapplicationFetchComplete(payload, overWrite));
			} catch (error) {
				
				dispatch(MCCapplicationFetchError(error.message));
			}
		};
  };
  export const fetchApplicaionSector = () => {
    let requestBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [
          {
            moduleName: "Booking",
            masterDetails: [
              {
                name: "Sector",
              },
  
              {
                "name": "PropertyType"
              },
            ],
          },
        ],
      },
    };
    return async (dispatch) => {
      try {
        const payload = await httpRequest(CATEGORY.GET.URL, CATEGORY.GET.ACTION, [], requestBody);
        
        dispatch(applicationSectorFetchSucess(payload));
      } catch (error) {
        dispatch(applicationSectorFetchError(error.message));
      }
    };
  };

  //fetchperDayOSWMCC
  export const OSBMfetchperDayRate = (requestBody, hasUsers = true, overWrite) => {
    return async (dispatch, getState) => {
      try {
        let tenantId = "";
        const payload = await httpRequest(OSBMPerDayRateAmount.POST.URL, OSBMPerDayRateAmount.POST.ACTION,[], requestBody);
        dispatch(OSBMfetchperDayRateComplete(payload, overWrite));
      } catch (error) {
        dispatch(OSBMfetchperDayRateError(error.message));
      }
    };
  };

 export const fetchperDayRate = (requestBody, hasUsers = true, overWrite) => {
    return async (dispatch, getState) => {
      try {
        let tenantId = "";
        const payload = await httpRequest(PerDayRateAmount.POST.URL, PerDayRateAmount.POST.ACTION,[], requestBody);
        dispatch(fetchperDayRateComplete(payload, overWrite));
      } catch (error) {
        dispatch(fetchperDayRateError(error.message));
      }
    };
  }; 
  export const downloadReceiptforCG = (requestBody, hasUsers = true, overWrite) => {
    return async (dispatch, getState) => {
      try {
        let tenantId = "";
        const payload = await httpRequest(DWONLOADNEWRECEIPTFORCG.POST.URL, DWONLOADNEWRECEIPTFORCG.POST.ACTION, [], requestBody);
        dispatch(downloadPermissionReceiptCompleteforCG(payload, overWrite));
      } catch (error) {
        dispatch(downloaddPermissionReceiptErrorforCG(error.message));
      }
    };
  };  
  export const downloadMccPL = (requestBody, hasUsers = true, overWrite) => {
    return async (dispatch, getState) => {
      try {
        let tenantId = "";
        const payload = await httpRequest(PermissionLetterDWNOSMCC.POST.URL, PermissionLetterDWNOSMCC.POST.ACTION, [], requestBody);
        dispatch(downloadMCCPLComplete(payload, overWrite));
      } catch (error) {
        dispatch(downloadMCCPLError(error.message));
      }
    };
  };
  export const downloadMccApp = (requestBody, hasUsers = true, overWrite) => {
    return async (dispatch, getState) => {
      try {
        let tenantId = "";
        const payload = await httpRequest(ApplicationDWNOSMCC.POST.URL, ApplicationDWNOSMCC.POST.ACTION, [], requestBody);
        dispatch(downloadAPPCompleteMCC(payload, overWrite));
      } catch (error) {
        dispatch(downloadAPPErrorMCC(error.message));
      }
    };
  };
  export const downloadPaymentReceiptforCG = (requestBody, hasUsers = true, overWrite) => {
    return async (dispatch, getState) => {
      try {
        let tenantId = "";
        const payload = await httpRequest(DWONLOADPAYMENTRECEIPTFORCG.POST.URL, DWONLOADPAYMENTRECEIPTFORCG.POST.ACTION, [], requestBody);
        dispatch(downloadReceiptCompleteforCG(payload, overWrite));
      } catch (error) {
        dispatch(downloadReceiptErrorforCG(error.message));
      }
    };
  };
  export const downloadApplicationforCG = (requestBody, hasUsers = true, overWrite) => {
    return async (dispatch, getState) => {
      try {
        let tenantId = "";
        const payload = await httpRequest(DWONLOADAPPLICATIONFORCG.POST.URL, DWONLOADAPPLICATIONFORCG.POST.ACTION, [], requestBody);
        dispatch(downloadApplicationCompleteforCG(payload, overWrite));
      } catch (error) {
        dispatch(downloadApplicationErrorforCG(error.message));
      }
    };
  };
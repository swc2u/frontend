import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import set from "lodash/set";
import { httpRequest } from "../../../../../ui-utils/api";
import {
  getSearchResults,
  getSearchResultsView,
} from "../../../../../ui-utils/commons";
import {
  convertDateToEpoch,
  getBill,
  validateFields,
  showHideAdhocPopup,
} from "../../utils";
import {
  getTenantId,getapplicationNumber,
  localStorageSet,
  getapplicationType,
  getUserInfo,localStorageGet
} from "egov-ui-kit/utils/localStorageUtils";
import {
  checkAvaialbilityAtSubmitCgb,
  checkAvaialbilityAtSubmitOsujm,
  checkAvaialbilityAtSubmit,
  downloadReceipt,
  downloadCertificate,
} from "../../utils";

export const selectPG = async (state, dispatch) => {
  showHideAdhocPopup(state, dispatch, "pay");
};

export const callPGService = async (state, dispatch, item) => {
  const bookingData = get(
    state,
    "screenConfiguration.preparedFinalObject.Booking"
  );
  console.log("bookingData--PGService",bookingData)
  let sendNewBusinessService;
  let findBookingType = bookingData.bkBookingType
  console.log("findBookingType",findBookingType)
  let findBusinessService = bookingData.businessService     
  console.log("findBusinessService",findBusinessService)     
  const businessService = getQueryArg(window.location.href, "businessService");
  // const tenantId = getQueryArg(window.location.href, "tenantId");
  const tenantId = process.env.REACT_APP_NAME === "Citizen" ? JSON.parse(getUserInfo()).permanentCity : getTenantId();
  console.log("tenantidofcitizen",tenantId)
  const applicationNumber = getQueryArg(
    window.location.href,
    "applicationNumber"
  );
  if(findBusinessService == 'OSBM'){
    sendNewBusinessService = "BOOKING_BRANCH_SERVICES.MANUAL_OPEN_SPACE";
  }
else if(findBusinessService == 'BWT'){
  sendNewBusinessService = "BOOKING_BRANCH_SERVICES.WATER_TANKAR_CHARGES";
}
else if(findBusinessService == 'GFCP'){
    sendNewBusinessService = "BOOKING_BRANCH_SERVICES.BOOKING_COMMERCIAL_GROUND";
}
else if(findBusinessService == "OSUJM"){
    sendNewBusinessService = "BOOKING_BRANCH_SERVICES.BOOKING_GROUND_OPEN_SPACES";
}
else if(findBusinessService == "PACC" && findBookingType == "Parks"){
    sendNewBusinessService = "BOOKING_BRANCH_SERVICES.MANUAL_OPEN_SPACE";
}
else if(findBusinessService == "PACC" && findBookingType == "Community Center"){
    sendNewBusinessService = "BOOKING_BRANCH_SERVICES.COMMUNITY_CENTRES_JHANJ_GHAR";
}
else if(findBusinessService == "BKROOM"){
  sendNewBusinessService = "BOOKING_BRANCH_SERVICES.COMMUNITY_CENTRES_JHANJ_GHAR";
}
else{
  sendNewBusinessService = findBusinessService;
}

  let fetchBillRequestBody = [
    { key: "tenantId", value: tenantId },
    { key: "consumerCode", value: applicationNumber },
    { key: "businessService", value: sendNewBusinessService},
];
console.log("RequestBodyOfFechFromMySide",fetchBillRequestBody)
const fetchBillAmount = await getBill(fetchBillRequestBody);
console.log("PayloadOfFetchBill",fetchBillAmount)
if(fetchBillAmount){
  let recData = get(fetchBillAmount, "Bill[0].totalAmount", []);
  console.log("recData--recData",recData)
  if(recData > 0)
  {
    const isAvailable = await checkAvaialbilityAtSubmit(bookingData, dispatch);
    console.log(isAvailable, "isAvailable");
    if (isAvailable) {
      let callbackUrl = `${
        process.env.NODE_ENV === "production"
          ? `${window.origin}/citizen`
          : window.origin
      }/egov-services/paymentRedirectPage`;
  
      let applicationnumber = getapplicationNumber();
      console.log("applicationnumberPayPage",applicationnumber)
      // let tenantId = getTenantId();
      console.log("tenantIdPayPage",tenantId)
      let applicationType = getapplicationType()
      console.log("applicationTypePayPage",applicationType)
      if(applicationType == "OSBM" || applicationType == "BWT"){
        const queryObject = [
          {
              key: "tenantId",
              value: tenantId,
          },
          {
              key: "applicationNumber",
              value: applicationnumber,
          },
      ];  
  console.log("queryObjectNewBookingSearch",queryObject)
  console.log("queryObjectNewBookingSearch898989",JSON.parse(JSON.stringify(queryObject)))
  
      const response = await getSearchResultsView(queryObject);
      console.log("ResonOfCitizenSearchOne",response)
  console.log("ResonOfCitizenSearch",JSON.parse(JSON.stringify(response)))
         
  let paymentRequest = response.bookingsModelList[0];
  console.log("ResonOfCitizenSearchOneRequestBody",paymentRequest)
  console.log("PaymentRequestCitizenSearch",JSON.parse(JSON.stringify(paymentRequest)))
  if(applicationType == "OSBM"){
    set(paymentRequest,"bkAction","PAY")
    // set(paymentRequest, "bkPaymentStatus", "SUCCESS");
  }
  else if(applicationType == "BWT"){
  let updatedQuantity = JSON.parse(
    localStorageGet("WaterTankerQuantity")
  );
  console.log("updatedQuantity", updatedQuantity);

  let updatedAddress = 
    localStorageGet("WaterTankerCreateAddress")
     console.log("updatedAddress--localStorage",updatedAddress)

let WaterTankerbkSector = 
localStorageGet("WaterTankerbkSector")
console.log("WaterTankerbkSector--localStorage",WaterTankerbkSector)

let WaterTankerbkType = 
    localStorageGet("WaterTankerbkType")
console.log("WaterTankerbkType--localStorage",WaterTankerbkType)


let WaterTankerbkHouseNo = 
    localStorageGet("WaterTankerbkHouseNo")
console.log("WaterTankerbkHouseNo--localStorage",WaterTankerbkHouseNo)


    set(paymentRequest,"bkAction","PAIDAPPLY")
    set(paymentRequest, "quantity", updatedQuantity);
    set(paymentRequest, "bkCompleteAddress", updatedAddress);
    set(paymentRequest, "bkSector", WaterTankerbkSector);
    set(paymentRequest, "bkType", WaterTankerbkType);
    set(paymentRequest, "bkHouseNo", WaterTankerbkHouseNo);

  }  

  {/**end**/}
        const newUpdateApiCall = await httpRequest(
          "post",
          "/bookings/api/update/payment",
          "",
          [],
          {
            Booking: paymentRequest,
        }
        );
  console.log("newUpdateApiCall--data",newUpdateApiCall)
  console.log("newUpdateApiCall--data--jsonData",JSON.parse(JSON.stringify(newUpdateApiCall)))
      }
      try {
        const queryObj = [
          { key: "tenantId", value: tenantId },
          { key: "consumerCode", value: applicationNumber },
          { key: "businessService", value: businessService },
        ];
  
        const taxAmount = get(
          state,
          "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].totalAmount"
        );
        const billId = get(
          state,
          "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].id"
        );
        const consumerCode = get(
          state,
          "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].consumerCode"
        );
        const Accountdetails = get(
          state,
          "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].billDetails[0].billAccountDetails"
        );
  
        const taxAndPayments = [
          {
            amountPaid: taxAmount,
            billId: billId,
          },
        ];
  
        try {
          const userMobileNumber = get(state, "auth.userInfo.mobileNumber");
          const userName = get(state, "auth.userInfo.name");
          const requestBody = {
            Transaction: {
              tenantId,
              billId: billId, // get(billPayload, "Bill[0].id"),
              txnAmount: taxAmount, //get(billPayload, "Bill[0].totalAmount"),
              module:businessService, 
              taxAndPayments,
              consumerCode: consumerCode, // get(billPayload, "Bill[0].consumerCode"),
              productInfo: businessService, // "Property Tax Payment",
              gateway: item,
              user: get(state, "auth.userInfo"),
              callbackUrl,
            },
          };
  
          const goToPaymentGateway = await httpRequest(
            "post",
            "pg-service/transaction/v1/_create",
            "_create",
            [],
            requestBody
          );
          const redirectionUrl = get(
            goToPaymentGateway,
            "Transaction.redirectUrl"
          );
  
          window.location = redirectionUrl;
  
        } catch (e) {
          dispatch(
            toggleSnackbar(
              true,
              {
                labelName: `A transaction for ${applicationNumber} has been abruptly discarded, please retry after 30 mins`,
                labelKey: "",
              },
              "error"
            )
          );
          console.log(e);
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Selected Dates are Already Booked. Try Again!",
            labelKey: "",
          },
          "warning"
        )
      );
   
    }

  }
  else {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Your payment is already received !",
          labelKey: "",
        },
        "warning"
      )
    );
 
  }
}
};
  
const convertDateFieldToEpoch = (finalObj, jsonPath) => {
  const dateConvertedToEpoch = convertDateToEpoch(
    get(finalObj, jsonPath),
    "daystart"
  );
  set(finalObj, jsonPath, dateConvertedToEpoch);
};

const allDateToEpoch = (finalObj, jsonPaths) => {
  jsonPaths.forEach((jsonPath) => {
    if (get(finalObj, jsonPath)) {
      convertDateFieldToEpoch(finalObj, jsonPath);
    }
  });
};

export const getCommonApplyFooter = (children) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer",
      style: { display: "flex", justifyContent: "flex-end" },
    },
    children,
  };
};
    
export const footer = getCommonApplyFooter({
  makePayment: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-services",
    componentPath: "MenuButton",
    props: {
      data: {
        label: {
          labelName: "MAKE PAYMENT",
          labelKey: "COMMON_MAKE_PAYMENT",
        },
        rightIcon: "arrow_drop_down",
        props: {
          variant: "outlined",
          style: {
            marginLeft: 5,
            marginRight: 15,
            backgroundColor: "#FE7A51",
            color: "#fff",
            border: "none",
            height: "60px",
            width: "250px",
          },
        },
        menu: [],
      },
    },
  },
});

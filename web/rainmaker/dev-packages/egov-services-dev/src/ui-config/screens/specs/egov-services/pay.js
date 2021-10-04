import {
    getCommonCard,
    getCommonContainer,
    getCommonHeader,
    getCommonTitle,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import set from "lodash/set";
import { getCurrentFinancialYear, generateBill } from "../utils";
import estimateDetails from "./payResource/estimate-details";
import { footer, callPGService } from "./payResource/footer";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
    getPaymentGateways,
    getSearchResultsView,
    getSearchResultsViewForRoomBooking
} from "../../../../ui-utils/commons";
import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
    getapplicationType,
    setapplicationType,
    setapplicationNumber,
    getUserInfo,
    localStorageGet,
    localStorageSet,
    getTenantId,
    getapplicationNumber
} from "egov-ui-kit/utils/localStorageUtils";
import {
    convertDateToEpoch,
    getBill,
    validateFields,
    showHideAdhocPopup,
    checkAvaialbilityAtSubmit
  } from "../utils";
import { httpRequest } from "../../../../ui-utils/api";
const header = getCommonContainer({
    header: getCommonHeader({
        labelName: `Application for ${
            getapplicationType() === "OSBM"
                ? "Open Space to Store Building Material"
                : getapplicationType() === "GFCP"
                ? "Commercial Ground"
                : getapplicationType() === "OSUJM"
                ? "Open Space within MCC jurisdiction"
                : getapplicationType() === "PACC"
                ? "Parks & Community Center/Banquet Halls"
                : getapplicationType() === "BKROOM"
                ?"Community Center Room Booking" 
                :"Water Tankers"
        } (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
    }),
    applicationNumber: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-services",
        componentPath: "ApplicationNoContainer",
        props: {
            number: "NA",
        },
        visible: true,
    },
});

const setSearchResponse = async (
    state,
    action,
    dispatch,
    applicationNumber,
    tenantId,
    businessService
) => {

    if(businessService==='BKROOM'){

        let businesServiceTemp = "BOOKING_BRANCH_SERVICES.COMMUNITY_CENTRES_JHANJ_GHAR";
    
        const response = await getSearchResultsViewForRoomBooking([
            
            { key: "applicationNumber", value: applicationNumber },
        ]);
    
        let recResponseData = get(response, "communityCenterRoomBookingMap", []);
      
        dispatch(
            prepareFinalObject("Booking", recResponseData !==undefined ? recResponseData[Object.keys(recResponseData)[0]]  : {})
        );
        dispatch(
            prepareFinalObject("BookingDocument", get(response, "communityCenterDocumentMap", {}))
        );

        await generateBill(
            state,
            dispatch,
            applicationNumber,
            tenantId,
            //recData[0].businessService
            businesServiceTemp
        );
        
    }else{
        const response = await getSearchResultsView([
            { key: "tenantId", value: tenantId },
            { key: "applicationNumber", value: applicationNumber },
        ]);
        let recData = get(response, "bookingsModelList", []);
        dispatch(
            prepareFinalObject("Booking", recData.length > 0 ? recData[0] : {})
        );
        dispatch(
            prepareFinalObject("BookingDocument", get(response, "documentMap", {}))
        );
        console.log(recData[0], "Search Result");
        let businesServiceTemp = '';
        if(recData[0].businessService == 'OSBM'){
            businesServiceTemp = "BOOKING_BRANCH_SERVICES.MANUAL_OPEN_SPACE";
          }
        else if(recData[0].businessService == 'BWT'){
          businesServiceTemp = "BOOKING_BRANCH_SERVICES.WATER_TANKAR_CHARGES";
        }
        else if(recData[0].businessService == 'GFCP'){
            businesServiceTemp = "BOOKING_BRANCH_SERVICES.BOOKING_COMMERCIAL_GROUND";
        }
        else if(recData[0].businessService == "OSUJM"){
            businesServiceTemp = "BOOKING_BRANCH_SERVICES.BOOKING_GROUND_OPEN_SPACES";
        }
        else if(recData[0].businessService == "PACC" && recData[0].bkBookingType==="Parks"){
            businesServiceTemp = "BOOKING_BRANCH_SERVICES.MANUAL_OPEN_SPACE";
        }
        else if(recData[0].businessService == "PACC" && recData[0].bkBookingType==="Community Center"){
            businesServiceTemp = "BOOKING_BRANCH_SERVICES.COMMUNITY_CENTRES_JHANJ_GHAR";
        }
        else{
          businesServiceTemp = recData[0].businessService;
        }
            await generateBill(
                state,
                dispatch,
                applicationNumber,
                tenantId,
                //recData[0].businessService
                businesServiceTemp
            );
        
        }
        
     // await handleCheckAvailability(
    //     recData.length > 0 ? recData[0] : {},
    //     action,
    //     dispatch
    // );
};

const callUpadateApi = async (state, dispatch, item) =>{

    const bookingData = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking"
      );
      
      let sendNewBusinessService="";

      let findBookingType = bookingData.bkBookingType
      
      let findBusinessService = bookingData.businessService     
         
      const tenantId = process.env.REACT_APP_NAME === "Citizen" ? JSON.parse(getUserInfo()).permanentCity : getTenantId();

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
    
      const fetchBillAmount = await getBill(fetchBillRequestBody);
    
      if(fetchBillAmount){
      let recData = get(fetchBillAmount, "Bill[0].totalAmount", []);
      
      if(recData > 0)
      {
        const isAvailable = await checkAvaialbilityAtSubmit(bookingData, dispatch);
        
        callPGService(state, dispatch, item, isAvailable)
        
        if (isAvailable) {
          let callbackUrl = `${
            process.env.NODE_ENV === "production"
              ? `${window.origin}/citizen`
              : window.origin
          }/egov-services/paymentRedirectPage`;
      
          let applicationnumber = getapplicationNumber();
          
         
          let applicationType = getapplicationType()

          
          if(applicationType == "OSBM" || applicationType == "BWT" || applicationType == "OSUJM"){
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
      
          const response = await getSearchResultsView(queryObject);
             
        let paymentRequest = response.bookingsModelList[0];

        if(applicationType == "OSBM" || applicationType == "OSUJM"){

            set(paymentRequest,"bkAction","PAY")
        }

        else if(applicationType == "BWT"){
            set(paymentRequest,"bkAction","PAIDAPPLY")
            let updatedPayloadAfterEdit =JSON.parse(localStorage.getItem('waterTankerBookingData'))
            paymentRequest= Object.assign(paymentRequest, updatedPayloadAfterEdit)
         }  
    else if(applicationType == "GFCP"){
        set(paymentRequest,"bkAction","APPLY")
    }
    else if(applicationType == "PACC"){
        let paymentStatus = get(
            paymentRequest,
            "bkPaymentStatus",
            ""
        );

        let action = paymentStatus === "SUCCESS" || paymentStatus === "succes" ? "MODIFY" : "APPLY"
        set(paymentRequest,"bkAction",action)
        if(action == "MODIFY"){
            paymentRequest.bkFromDate = paymentRequest.bkStartingDate;
            paymentRequest.bkToDate = paymentRequest.bkEndingDate;
            let modifiedTimeSlotArray=JSON.parse(localStorage.getItem('changeTimeSlotData'))
            if(paymentRequest.bkDuration==='HOURLY'){
              if(modifiedTimeSlotArray.length>1){
                    paymentRequest.timeslots[0].slot= modifiedTimeSlotArray[0].slot
                    paymentRequest.timeslots[1].slot= modifiedTimeSlotArray[1].slot        
                }else{
                    paymentRequest.timeslots[0].slot= modifiedTimeSlotArray[0].slot
                }
              
            }
       
           }
    }
   console.log("paymentRequest",paymentRequest)
        const newUpdateApiCall = await httpRequest(
              "post",
              "/bookings/api/update/payment",
              "",
              [],
              {
                Booking: paymentRequest,
            }
        );
        console.log("newUpdateApiCall",newUpdateApiCall)
        }
        
    }
    } else {
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
}

const setPaymentMethods = async (action, state, dispatch) => {
    const response = await getPaymentGateways();
    if (!!response.length) {
        const paymentMethods = response.map((item) => ({
            label: {
                labelName: item,
                labelKey: item,
            },
            link: () => callUpadateApi(state, dispatch, item),
        }));
        set(
            action,
            "screenConfig.components.div.children.footer.children.makePayment.props.data.menu",
            paymentMethods
        );
    }
};

// const handleCheckAvailability = async (Booking, action, dispatch) => {
//     if (getapplicationType() === "GFCP") {
//         let venue = Booking.bkBookingVenue;
//         let from = Booking.bkFromDate;
//         let to = Booking.bkToDate;
//         let bookedDates = await checkAvaialbilityAtSubmitCgb(venue, from, to);

//         bookedDates.data.map((val) => {
//             if (val === from || val === to) {
//                 dispatch(
//                     toggleSnackbar(
//                         true,
//                         {
//                             labelName: "Dates are Already Booked. Try Again!",
//                             labelKey: "",
//                         },
//                         "warning"
//                     )
//                 );
//                 dispatch(setRoute(`/egov-services/checkavailability`));
//             }
//         });
//     } else if (getapplicationType() === "OSUJM") {
//         let venue = Booking.bkBookingVenue;
//         let from = Booking.bkFromDate;
//         let to = Booking.bkToDate;
//         let sector = Booking.bkSector;
//         let bookedDates = await checkAvaialbilityAtSubmitOsujm(
//             sector,
//             venue,
//             from,
//             to
//         );
//         bookedDates.data.map((val) => {
//             if (val === from || val === to) {
//                 dispatch(
//                     toggleSnackbar(
//                         true,
//                         {
//                             labelName: "Dates are Already Booked. Try Again!",
//                             labelKey: "",
//                         },
//                         "warning"
//                     )
//                 );
//                 dispatch(setRoute(`/egov-services/checkavailability_oswmcc`));
//             }
//         });
//     }
// };

const screenConfig = {
    uiFramework: "material-ui",
    name: "pay",
    beforeInitScreen: (action, state, dispatch) => {
        let applicationNumber = getQueryArg(
            window.location.href,
            "applicationNumber"
        );
        let tenantId = getQueryArg(window.location.href, "tenantId");
        let businessService = getQueryArg(
            window.location.href,
            "businessService"
        );
        setapplicationNumber(applicationNumber);
        setapplicationType(businessService);
        setPaymentMethods(action, state, dispatch);
        setSearchResponse(state, action, dispatch, applicationNumber, tenantId,businessService);

        return action;
    },
    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Form",
            props: {
                className: "common-div-css",
                id: "pay",
            },
            children: {
                headerDiv: {
                    uiFramework: "custom-atoms",
                    componentPath: "Container",
                    children: {
                        header: {
                            gridDefination: {
                                xs: 12,
                                sm: 12,
                            },
                            ...header,
                        },
                    },
                },
                formwizardFirstStep: {
                    uiFramework: "custom-atoms",
                    componentPath: "Div",
                    children: {
                        paymentDetails: getCommonCard({
                            header: getCommonTitle({
                                labelName: "Payment Collection Details",
                                labelKey: "BK_PAYMENT_HEADER",
                            }),
                            estimateDetails,
                        }),
                    },
                },
                footer,
            },
        },
    },
};

export default screenConfig;

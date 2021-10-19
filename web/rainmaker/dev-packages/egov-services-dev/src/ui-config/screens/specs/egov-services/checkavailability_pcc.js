import {
    getCommonContainer,
    getCommonHeader,
    getLabel,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    availabilityForm,
    availabilityMediaCard,
    availabilityTimeSlot,
    availabilityCalendar,
} from "./checkAvailabilityForm_pcc";
import { ImageLocationSummary } from "./summaryResource/imagesOfNewLocationOswmcc";
import { perDayRateSummary } from "./summaryResource/perDayRateSummaryBookingOSWMCC";
import { showHideAdhocPopup } from "../utils";
import {
    setapplicationNumber,
    lSRemoveItemlocal,
    getTenantId,
} from "egov-ui-kit/utils/localStorageUtils";
import { dispatchMultipleFieldChangeAction } from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    prepareFinalObject,
    handleScreenConfigurationFieldChange as handleField,
    toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
    getFileUrlFromAPI,
    getQueryArg,
} from "egov-ui-framework/ui-utils/commons";
import {
    getSearchResultsView,
    setApplicationNumberBox,
} from "../../../../ui-utils/commons";
import {
    getAvailabilityDataPCC,
    getMasterDataPCC,
    getAvailabilityData,
    getBetweenDays,
} from "../utils";
import { httpRequest } from "../../../../ui-utils";
import get from "lodash/get";
import set from "lodash/set";

const getMdmsData = async (action, state, dispatch) => {
    let tenantId = getTenantId().split(".")[0];
    const booktingVenueType = getQueryArg(
        window.location.href,
        "booktingVenueType"
    );

    let mdmsBody = {
        MdmsCriteria: {
            tenantId: tenantId,
            moduleDetails: [
                {
                    moduleName: "tenant",
                    masterDetails: [
                        {
                            name: "tenants",
                        },
                    ],
                },
                {
                    moduleName: "Booking",
                    masterDetails: [
                        {
                            name: "Sector",
                        },
                        {
                            name: "bookingCancellationRefundCalc",
                        },
                        {
                            name: "PCC_Document",
                        },
                        {
                            name: "Booking_Config",
                        },
                        {
                            name: "Booking_Vanue",
                        },

                    ],
                },
            ],
        },
    };
    try {
        let payload = await httpRequest(
            "post",
            "/egov-mdms-service/v1/_search",
            "_search",
            [],
            mdmsBody
        );
        let ccSectorsRes;
        let parkSectorsRes
        if (booktingVenueType) {
            if (booktingVenueType === "Community Center") {
                ccSectorsRes = await httpRequest(
                    "post",
                    "/bookings/park/community/sector/_fetch?venueType=Community Center",
                    "_fetch",
                    []

                );
            } else if (booktingVenueType === "Parks") {
                parkSectorsRes = await httpRequest(
                    "post",
                    "/bookings/park/community/sector/_fetch?venueType=Parks",
                    "_fetch",
                    []

                );
            }
        } else {
            ccSectorsRes = await httpRequest(
                "post",
                "/bookings/park/community/sector/_fetch?venueType=Community Center",
                "_fetch",
                []

            );

            parkSectorsRes = await httpRequest(
                "post",
                "/bookings/park/community/sector/_fetch?venueType=Parks",
                "_fetch",
                []

            );
        }

        let parkSectors;
        let ccSectors;
        if (booktingVenueType) {
            if (booktingVenueType === "Community Center") {
                ccSectors = ccSectorsRes.data.map((item) => {
                    return { code: item.sector, active: item.isActive, name: item.sector }
                })
            } else if (booktingVenueType === "Parks") {
                parkSectors = parkSectorsRes.data.map((item) => {
                    return { code: item.sector, active: item.isActive, name: item.sector }
                })
            }
        } else {
            if (parkSectorsRes.status === "200") {
                parkSectors = parkSectorsRes.data.map((item) => {
                    return { code: item.sector, active: item.isActive, name: item.sector }
                })
            }
            if (ccSectorsRes.status === "200") {
                ccSectors = ccSectorsRes.data.map((item) => {
                    return { code: item.sector, active: item.isActive, name: item.sector }
                })
            }
        }

        dispatch(prepareFinalObject("parkSectors", parkSectors));
        dispatch(prepareFinalObject("ccSectors", ccSectors));
        dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
        let bookingTypeData = get(
            state,
            "screenConfiguration.preparedFinalObject.Booking.bkBookingType",
            ""
        );

        if (booktingVenueType) {
            if (booktingVenueType === "Community Center") {
                dispatch(prepareFinalObject("sectorJsonPath", ccSectors));
            } else if (booktingVenueType === "Parks") {
                dispatch(prepareFinalObject("sectorJsonPath", parkSectors));
            }
        } else {
            if (bookingTypeData === "Commercial Ground") {
                dispatch(prepareFinalObject("sectorJsonPath", payload.MdmsRes.Booking.Booking_Vanue));

            } else {
                //dispatch(prepareFinalObject("sectorJsonPath", payload.MdmsRes.Booking.Sector));
                dispatch(prepareFinalObject("sectorJsonPath", parkSectors));

            }
        }

    } catch (e) {
        console.log(e);
    }
};

// const getVenueData = async (action, state, dispatch) => {
//     try {
//         let payload = await httpRequest(
//             "post",
//             "/bookings/newLocation/citizen/osujm/_all"
//         );
//         return payload
//     } catch (e) {
//         console.log(e);
//     }
// };

// const getData = async (action, state, dispatch) => {
//     try {
//         let response = await getVenueData(action, state, dispatch);
//         dispatch(
//             prepareFinalObject(
//                 "sectorWiselocationsObject",
//                 response.osujmNewlocationMap
//             )
//         );
//         return response
//     } catch (error) {
//         console.log(error, "my error")
//     }

//   };

const setDataAutofill = (action, state, dispatch) => {
    // console.log("in set data autofill")
    let sectorWiselocationsObject = get(
        state,
        "screenConfiguration.preparedFinalObject.sectorWiselocationsObject"
    );
};

const prepareEditFlow = async (
    action,
    state,
    dispatch,
    applicationNumber,
    tenantId
) => {
    if (applicationNumber) {
        setapplicationNumber(applicationNumber);
        let response = await getSearchResultsView([
            { key: "tenantId", value: tenantId },
            { key: "applicationNumber", value: applicationNumber },
        ]);

        let bookingsModelList = get(response, "bookingsModelList", []);
        let documentMap = get(response, "documentMap", {});
        let documentList=get(response, "documentList", {});
        if (bookingsModelList !== null && bookingsModelList.length > 0) {

            dispatch(prepareFinalObject("Booking", bookingsModelList[0]));
            dispatch(
                prepareFinalObject(
                    "availabilityCheckData",
                    bookingsModelList[0]
                )
            );
            let oldAvailabilityCheckData = {
                bkFromDate: bookingsModelList[0].bkFromDate,
                bkToDate: bookingsModelList[0].bkToDate,
                bkBookingVenue: bookingsModelList[0].bkBookingVenue,
                bkDuration: bookingsModelList[0].bkDuration
            }
            dispatch(
                prepareFinalObject(
                    "oldAvailabilityCheckData",
                    oldAvailabilityCheckData
                )
            );

            set(
                action.screenConfig,
                "components.div.children.headerDiv.children.header.children.applicationNumber.visible",
                true
            );

            let requestBody = {
                venueType: bookingsModelList[0].bkBookingType,
                sector: bookingsModelList[0].bkSector,
            };
            let response = await getMasterDataPCC(requestBody);
            let responseStatus = get(response, "status", "");
            if (responseStatus == "SUCCESS" || responseStatus == "success") {
                
                let newResponse = response.data.map((el) => {
                let bkDuration =
                    el.bookingAllowedFor === "" ? "FULLDAY" : "HOURLY";
                let newObj = { ...el, bkDuration };
                return newObj;
                });
            dispatch(prepareFinalObject("masterData", newResponse));
              requestBody = {
                    bookingType: bookingsModelList[0].bkBookingType,
                    bookingVenue: bookingsModelList[0].bkBookingVenue,
                    sector: bookingsModelList[0].bkSector,
                    applicationNumber: bookingsModelList[0].bkApplicationStatus == "APPLIED" || bookingsModelList[0].bkApplicationStatus == "RE_INITIATED" ? applicationNumber : null
                };

                const availabilityData = await getAvailabilityDataPCC(
                    requestBody
                );
                let responseStatusAvailabilityData = get(
                    availabilityData,
                    "status",
                    ""
                );

                console.log(availabilityData, "availabilityData main page");

                if (
                    responseStatusAvailabilityData == "SUCCESS" ||
                    responseStatusAvailabilityData == "success"
                ) {


                    set(
                        action.screenConfig,
                        "components.div.children.availabilityMediaCardWrapper.visible",
                        true
                    );
                    set(
                        action.screenConfig,
                        "components.div.children.availabilityTimeSlotWrapper.visible",
                        bookingsModelList[0].bkDuration === "HOURLY"
                            ? true
                            : false
                    );

                    set(
                        action.screenConfig,
                        "components.div.children.availabilityCalendarWrapper.visible",
                        bookingsModelList[0].bkDuration === "FULLDAY"
                            ? true
                            : false
                    );

                    if (bookingsModelList[0].timeslots.length > 0) {
                                   
                    if( bookingsModelList[0].timeslots[0].slot.split("-")[0].trim()=='9:00 AM' &&  bookingsModelList[0].timeslots[0].slot.split("-")[1].trim()=='8:59 AM'){
                    
                        let d = new Date(new Date(bookingsModelList[0].bkToDate).setDate(new Date(bookingsModelList[0].bkToDate).getDate() + 1));
                        let  newToDate= d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
                         
                        dispatch(
                            prepareFinalObject(
                                "DisplayPacc.bkDisplayFromDateTime",
                                bookingsModelList[0].bkFromDate +
                                ", " +
                                bookingsModelList[0].timeslots[0].slot.split(
                                    "-"
                                )[0]
                            )
                        );
                        dispatch(
                            prepareFinalObject(
                                "DisplayPacc.bkDisplayToDateTime",
                                newToDate +
                                ", " +
                                bookingsModelList[0].timeslots[0].slot.split(
                                    "-"
                                )[1]
                            )
                        );
                    }else{
                        dispatch(
                            prepareFinalObject(
                                "DisplayPacc.bkDisplayFromDateTime",
                                bookingsModelList[0].bkFromDate +
                                ", " +
                                bookingsModelList[0].timeslots[0].slot.split(
                                    "-"
                                )[0]
                            )
                        );
                        dispatch(
                            prepareFinalObject(
                                "DisplayPacc.bkDisplayToDateTime",
                                bookingsModelList[0].bkToDate +
                                ", " +
                                bookingsModelList[0].timeslots[0].slot.split(
                                    "-"
                                )[1]
                            )
                        );
                    }

                }
                
                    let data = availabilityData.data;
                    let reservedDates = [];
                    var daylist = [];
                    data.map((dataitem) => {
                        let start = dataitem.fromDate;
                        let end = dataitem.toDate;
                        daylist = getBetweenDays(start, end);
                        daylist.map((v) => {
                            reservedDates.push(v.toISOString().slice(0, 10));
                        });
                    });
                    dispatch(
                        prepareFinalObject(
                            "availabilityCheckData.reservedDays",
                            reservedDates
                        )
                    );
                    dispatch(
                        prepareFinalObject(
                            "availabilityCheckData.reservedTimeSlotsData",
                            data
                        )
                    );
                } else {
                    dispatch(
                        toggleSnackbar(
                            true,
                            {
                                labelName: "Please try after sometime!",
                                labelKey: "",
                            },
                            "warning"
                        )
                    );
                }
            } else {
                let errorMessage = {
                    labelName: "Something went wrong, Try Again later!",
                    labelKey: "", //UPLOAD_FILE_TOAST
                };
                dispatch(toggleSnackbar(true, errorMessage, "error"));
            }

            let fileStoreIds = Object.keys(documentMap);
            let fileStoreIdsValue = Object.values(documentMap);
            if (fileStoreIds.length > 0) {
                let fileUrls =
                    fileStoreIds.length > 0
                        ? await getFileUrlFromAPI(fileStoreIds)
                        : {};
                        dispatch(
                            prepareFinalObject("documentsUploadReduxOld.documents", [
                                {
                                    fileName: fileStoreIdsValue[0],
                                    fileStoreId: fileStoreIds[0],
                                    fileUrl: fileUrls[fileStoreIds[0]],
                                },
                            ])
                        );
                        dispatch(
                            prepareFinalObject("dropDown.value", documentList[0].documentType)
                        );
            }
        } else {
            dispatch(
                toggleSnackbar(
                    true,
                    {
                        labelName: "Something went Wrong!",
                        labelKey: "",
                    },
                    "error"
                )
            );
        }
    } else {
        // console.log("in edit flow not application number")
        // setDataAutofill(action, state, dispatch);
    }
};
const header = getCommonContainer({
    header: getCommonHeader({
        labelName: `Apply for Parks & Community Center/Banquet Halls`,
        labelKey: "BK_PCC_APPLY",
    }),
    applicationNumber: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-services",
        componentPath: "ApplicationNoContainer",
        props: {
            number: "NA",
        },
        visible: false,
    },
});

const availabilitySearch = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
        id: "apply_form1",
    },
    children: {
        availabilityForm,
    },
};
const availabilityMediaCardWrapper = {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
        id: "availability-media-card",
    },
    children: {
        availabilityMediaCard,

    },
    visible: false,
};
const availabilityTimeSlotWrapper = {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
        id: "availability-timeslot",
    },
    children: {
        availabilityTimeSlot,
    },
    visible: false,
};
const availabilityCalendarWrapper = {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
        id: "availability-calender",
    },
    children: {
        availabilityCalendar,
    },
    visible: false,
};

const screenConfig = {
    uiFramework: "material-ui",
    name: "checkavailability_pcc",
    beforeInitScreen: (action, state, dispatch) => {
        const applicationNumber = getQueryArg(
            window.location.href,
            "applicationNumber"
        );
        const tenantId = getQueryArg(window.location.href, "tenantId");
        getMdmsData(action, state, dispatch);
        prepareEditFlow(action, state, dispatch, applicationNumber, tenantId);
        const changeDateVenue = getQueryArg(
            window.location.href,
            "changeDateVenue"
          );

          if(changeDateVenue=='Enabled')
            {
              set(
                action.screenConfig,
                "components.div.children.availabilitySearch.children.availabilityForm.children.cardContent.children.availabilityFields.children.bkSector.props.disabled",
                false
            );
            }


        return action;
    },
    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            props: {
                className: "common-div-css",
                id: "search",
            },
            children: {
                headerDiv: {
                    uiFramework: "custom-atoms",
                    componentPath: "Container",
                    children: {
                        header: {
                            gridDefination: {
                                xs: 12,
                                sm: 10,
                            },
                            ...header,
                        },
                    },
                },
                availabilitySearch,
                availabilityMediaCardWrapper,
                availabilityTimeSlotWrapper,
                availabilityCalendarWrapper,
                adhocDialog: {
                    uiFramework: "custom-containers-local",
                    moduleName: "egov-services",
                    componentPath: "DialogContainer",
                    props: {
                        open: false,
                        maxWidth: "lg",
                        screenKey: "checkavailability_pcc",
                    },
                    children: {
                        popup: getCommonContainer({
                            children: {
                                perDayRateSummary,
                                ImageLocationSummary,
                            },
                        }),
                        popup: getCommonContainer({
                            venuebasedSummary: {
                                uiFramework: "custom-atoms",
                                componentPath: "Card",
                                props: {
                                    style: {
                                        width: "100%",
                                        margin: "0",
                                        boxShadow: "none",
                                    },
                                },
                                children: {
                                    header: {
                                        uiFramework: "custom-atoms",
                                        componentPath: "Container",
                                        props: {
                                            style: {
                                                // width: "100%",
                                                // float: "right"
                                            },
                                        },
                                        children: {
                                            div1: {
                                                uiFramework: "custom-atoms",
                                                componentPath: "Div",
                                                gridDefination: {
                                                    xs: 10,
                                                    sm: 10,
                                                },
                                                props: {
                                                    style: {
                                                        // width: "100%",
                                                        // float: "right"
                                                    },
                                                },
                                                children: {
                                                    div: getCommonHeader(
                                                        {
                                                            labelName:
                                                                "Venue Details",
                                                            labelKey:
                                                                "BK_OSWMCC_BOOKING_VENUE_DETAILS",
                                                        },
                                                        {
                                                            style: {
                                                                fontSize:
                                                                    "18px",
                                                                marginTop:
                                                                    "8px",
                                                            },
                                                        }
                                                    ),
                                                },
                                            },
                                            div2: {
                                                uiFramework: "custom-atoms",
                                                componentPath: "Div",
                                                gridDefination: {
                                                    xs: 2,
                                                    sm: 2,
                                                },
                                                props: {
                                                    style: {
                                                        width: "100%",
                                                        float: "right",
                                                        cursor: "pointer",
                                                    },
                                                },
                                                children: {
                                                    closeButton: {
                                                        componentPath: "Button",
                                                        props: {
                                                            style: {
                                                                float: "right",
                                                                color:
                                                                    "rgba(0, 0, 0, 0.60)",
                                                            },
                                                        },
                                                        children: {
                                                            previousButtonIcon: {
                                                                uiFramework:
                                                                    "custom-atoms",
                                                                componentPath:
                                                                    "Icon",
                                                                props: {
                                                                    iconName:
                                                                        "close",
                                                                },
                                                            },
                                                        },
                                                        onClickDefination: {
                                                            action: "condition",
                                                            callBack: (
                                                                state,
                                                                dispatch
                                                            ) =>
                                                                showHideAdhocPopup(
                                                                    state,
                                                                    dispatch,
                                                                    "checkavailability_pcc"
                                                                ),
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                    perDayRateSummary,
                                    ImageLocationSummary,
                                },
                                visible: true,
                            },
                        }),
                    },
                },
            },
        },
    },
};

export default screenConfig;

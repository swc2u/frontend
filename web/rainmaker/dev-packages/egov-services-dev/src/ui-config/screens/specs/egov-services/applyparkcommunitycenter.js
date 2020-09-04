import {
    getCommonContainer,
    getCommonHeader,
    getStepperObject,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { footer } from "./applyResourceParkCommunityCenter/footer";
import {
    personalDetails,
    bookingDetails,
} from "./applyResourceParkCommunityCenter/nocDetails";
import { convertDateInYMD } from "../utils";
import { documentDetails } from "./applyResourceParkCommunityCenter/documentDetails";
import { summaryDetails } from "./applyResourceParkCommunityCenter/summaryDetails";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
    prepareFinalObject,
    handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";

import {
    getTenantId,
    setapplicationType,
    setapplicationNumber,
    getUserInfo,
} from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import set from "lodash/set";
import get from "lodash/get";

import {
    prepareDocumentsUploadData,
    getSearchResults,
    getSearchResultsView,
    setApplicationNumberBox,
    furnishOsbmResponse,
} from "../../../../ui-utils/commons";

export const stepsData = [
    { labelName: "Applicant Details", labelKey: "BK_PCC_APPLICANT_DETAILS" },
    { labelName: "Booking Details", labelKey: "BK_PCC_BOOKING_DETAILS" },
    { labelName: "Documents", labelKey: "BK_PCC_DOCUMENTS" },
    { labelName: "Summary", labelKey: "BK_PCC_SUMMARY" },
];
export const stepper = getStepperObject(
    { props: { activeStep: 0 } },
    stepsData
);

// const applicationNumberContainer = () => {
//     const applicationNumber = getQueryArg(
//         window.location.href,
//         "applicationNumber"
//     );
//     if (applicationNumber)
//         return {
//             uiFramework: "custom-atoms-local",
//             moduleName: "egov-services",
//             componentPath: "ApplicationNoContainer",
//             props: {
//                 number: `${applicationNumber}`,
//                 visibility: "hidden",
//             },
//             visible: true,
//         };
//     else return {};
// };

export const header = getCommonContainer({
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

export const formwizardFirstStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
        id: "apply_form1",
    },
    children: {
        personalDetails,
    },
};

export const formwizardSecondStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
        id: "apply_form2",
    },
    children: {
        bookingDetails,
    },
    visible: false,
};

export const formwizardThirdStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
        id: "apply_form3",
    },
    children: {
        documentDetails,
    },
    visible: false,
};

export const formwizardFourthStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
        id: "apply_form4",
    },
    children: {
        summaryDetails,
    },
    visible: false,
};

const getMdmsData = async (action, state, dispatch) => {
    let tenantId = getTenantId().split(".")[0];
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
                            name: "PCC_Document",
                        },
                    ],
                },
            ],
        },
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
        payload.MdmsRes.Booking.PCC_Document = [
            {
                active: true,
                code: "PCC_DOCUMENT",
                description: "PCC_DOCUMENT_DESCRIPTION",
                documentType: "DOC",
                dropdownData: [],
                hasDropdown: false,
                required: true,
            },
        ];
        dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
    } catch (e) {
        console.log(e);
    }
};

// export const prepareEditFlow = async (
//     state,
//     dispatch,
//     applicationNumber,
//     tenantId
// ) => {
//     if (applicationNumber) {
//         let response = await getSearchResultsView([
//             { key: "tenantId", value: tenantId },
//             { key: "applicationNumber", value: applicationNumber },
//         ]);
//         setapplicationNumber(applicationNumber);
//         setApplicationNumberBox(state, dispatch, applicationNumber);

//         // let Refurbishresponse = furnishOsbmResponse(response);
//         dispatch(prepareFinalObject("Booking", response.bookingsModelList[0]));

//         let fileStoreIds = Object.keys(response.documentMap);
//         let fileStoreIdsValue = Object.values(response.documentMap);
//         let fileUrls =
//             fileStoreIds.length > 0
//                 ? await getFileUrlFromAPI(fileStoreIds)
//                 : {};
//         dispatch(prepareFinalObject("documentsUploadReduxOld.documents", [
// 			{
// 				fileName: fileStoreIdsValue[0],
// 				fileStoreId: fileStoreIds[0],
// 				fileUrl: fileUrls[fileStoreIds[0]],
// 			},
// 		]));
// 		console.log("hereitis")
// 		// prepareFinalObject("documentsUploadRedux", {
// 		// 	0: {
// 		// 	  documents: [
// 		// 		{
// 		// 			fileName: fileStoreIdsValue[0],
// 		// 			fileStoreId: fileStoreIds[0],
// 		// 			fileUrl: fileUrls[fileStoreIds[0]],
// 		// 		},
// 		// 	  ]
// 		// 	}
// 		//   });
//     }
// };

const calculateBetweenDaysCount = (startDate, endDate) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = new Date(startDate);
    const secondDate = new Date(endDate);

    const daysCount =
        Math.round(Math.abs((firstDate - secondDate) / oneDay)) + 1;
    return daysCount;
};

export const prepareEditFlow = async (
    state,
    dispatch,
    applicationNumber,
    tenantId,
    businessService
    // fromDate,
    // toDate,
    // venue,
    // locality
) => {
    const availabilityCheckData = get(
        state,
        "screenConfiguration.preparedFinalObject.availabilityCheckData"
    );
    if (availabilityCheckData !== undefined) {
        const masterData = get(
            state,
            "screenConfiguration.preparedFinalObject.masterData"
        );

        const masterDataItem = masterData.filter(
            (el) => el.id === availabilityCheckData.bkBookingVenue
        );

        let daysCount = calculateBetweenDaysCount(
            availabilityCheckData.bkFromDate,
            availabilityCheckData.bkToDate
        );

        console.log(daysCount, "daysCount");

        dispatch(
            prepareFinalObject(
                "Booking.bkDimension",
                masterDataItem[0].dimensionSqrYards
            )
        );
        dispatch(
            prepareFinalObject("Booking.bkLocation", masterDataItem[0].name)
        );
        dispatch(
            prepareFinalObject(
                "Booking.bkFromDate",
                convertDateInYMD(availabilityCheckData.bkFromDate)
            )
        );
        dispatch(
            prepareFinalObject(
                "Booking.bkToDate",
                convertDateInYMD(availabilityCheckData.bkToDate)
            )
        );
        let rent = Number(masterDataItem[0].rent);
        let cleaningCharges = Number(masterDataItem[0].cleaningCharges);
        let amount = rent + cleaningCharges
        let totalAmount = amount * daysCount

        dispatch(
            prepareFinalObject(
                "Booking.bkCleansingCharges",
                masterDataItem[0].cleaningCharges * daysCount
            )
        );
        dispatch(
            prepareFinalObject(
                "Booking.bkRent",
                masterDataItem[0].rent * daysCount
            )
        );
        dispatch(
            prepareFinalObject(
                "Booking.bkSurchargeRent",
                (totalAmount * Number(masterDataItem[0].surcharge) / 100)
            )
        );

        // dispatch(
        //     prepareFinalObject("Booking.bkFacilitationCharges", masterDataItem[0])
        // );

        dispatch(
            prepareFinalObject(
                "Booking.bkUtgst",
                (totalAmount * Number(masterDataItem[0].utgstRate) / 100)
            )
        );
        dispatch(
            prepareFinalObject(
                "Booking.bkCgst",
                (totalAmount * Number(masterDataItem[0].cgstRate) / 100)
            )
        );

        dispatch(
            prepareFinalObject(
                "Booking.bkBookingVenue",
                availabilityCheckData.bkBookingVenue
            )
        );
        dispatch(
            prepareFinalObject(
                "Booking.bkSector",
                availabilityCheckData.bkSector
            )
        );
    } else {
        dispatch(
            setRoute(
                `/egov-services/checkavailability_pcc?applicationNumber=${applicationNumber}&tenantId=${tenantId}&businessService=${businessService}`
            )
        );
    }
    // if (applicationNumber) {
    //     let response = await getSearchResultsView([
    //         { key: "tenantId", value: tenantId },
    //         { key: "applicationNumber", value: applicationNumber },
    //     ]);
    //     setapplicationNumber(applicationNumber);
    //     setApplicationNumberBox(state, dispatch, applicationNumber);

    //     // let Refurbishresponse = furnishOsbmResponse(response);
    //     dispatch(prepareFinalObject("Booking", response.bookingsModelList[0]));
    //     // dispatch(
    //     //     prepareFinalObject("Booking.bkFromDate", convertDateInYMD(fromDate))
    //     // );
    //     // dispatch(
    //     //     prepareFinalObject("Booking.bkToDate", convertDateInYMD(toDate))
    //     // );

    //     // dispatch(prepareFinalObject("Booking.bkBookingVenue", venue));
    //     // dispatch(prepareFinalObject("Booking.bkSector", locality));

    //     let fileStoreIds = Object.keys(response.documentMap);
    //     let fileStoreIdsValue = Object.values(response.documentMap);
    //     if (fileStoreIds.length > 0) {
    //         let fileUrls =
    //             fileStoreIds.length > 0
    //                 ? await getFileUrlFromAPI(fileStoreIds)
    //                 : {};
    //         dispatch(
    //             prepareFinalObject("documentsUploadReduxOld.documents", [
    //                 {
    //                     fileName: fileStoreIdsValue[0],
    //                     fileStoreId: fileStoreIds[0],
    //                     fileUrl: fileUrls[fileStoreIds[0]],
    //                 },
    //             ])
    //         );
    //     }
    // }
};

const screenConfig = {
    uiFramework: "material-ui",
    name: "applyparkcommunitycenter",
    beforeInitScreen: (action, state, dispatch) => {
        setapplicationType("PACC");
        const applicationNumber = getQueryArg(
            window.location.href,
            "applicationNumber"
        );
        const tenantId = getQueryArg(window.location.href, "tenantId");
        const step = getQueryArg(window.location.href, "step");

        dispatch(
            prepareFinalObject(
                "Booking.bkApplicantName",
                JSON.parse(getUserInfo()).name
            )
        ),
            dispatch(
                prepareFinalObject(
                    "Booking.bkMobileNumber",
                    JSON.parse(getUserInfo()).mobileNumber
                )
            );

        //Set Module Name
        set(state, "screenConfiguration.moduleName", "services");

        // Set MDMS Data
        getMdmsData(action, state, dispatch).then((response) => {
            prepareDocumentsUploadData(state, dispatch, "apply_pcc");
        });

        // Search in case of EDIT flow
        if (applicationNumber !== null) {
            set(
                action.screenConfig,
                "components.div.children.headerDiv.children.header.children.applicationNumber.visible",
                true
            );
            prepareEditFlow(state, dispatch, applicationNumber, tenantId);
        } else {
            const availabilityCheckData = get(
                state,
                "screenConfiguration.preparedFinalObject.availabilityCheckData"
            );

            if (availabilityCheckData !== undefined) {
                const masterData = get(
                    state,
                    "screenConfiguration.preparedFinalObject.masterData"
                );

                const masterDataItem = masterData.filter(
                    (el) => el.id === availabilityCheckData.bkBookingVenue
                );

                let daysCount = calculateBetweenDaysCount(
                    availabilityCheckData.bkFromDate,
                    availabilityCheckData.bkToDate
                );

                console.log(daysCount, "daysCount");

                dispatch(
                    prepareFinalObject(
                        "Booking.bkDimension",
                        masterDataItem[0].dimensionSqrYards
                    )
                );
                dispatch(
                    prepareFinalObject("Booking.bkLocation", masterDataItem[0].name)
                );
                dispatch(
                    prepareFinalObject(
                        "Booking.bkFromDate",
                        convertDateInYMD(availabilityCheckData.bkFromDate)
                    )
                );
                dispatch(
                    prepareFinalObject(
                        "Booking.bkToDate",
                        convertDateInYMD(availabilityCheckData.bkToDate)
                    )
                );
                let rent = Number(masterDataItem[0].rent);
                let cleaningCharges = Number(masterDataItem[0].cleaningCharges);
                let amount = rent + cleaningCharges
                let totalAmount = amount * daysCount
        
                dispatch(
                    prepareFinalObject(
                        "Booking.bkCleansingCharges",
                        masterDataItem[0].cleaningCharges * daysCount
                    )
                );
                dispatch(
                    prepareFinalObject(
                        "Booking.bkRent",
                        masterDataItem[0].rent * daysCount
                    )
                );
                dispatch(
                    prepareFinalObject(
                        "Booking.bkSurchargeRent",
                        (totalAmount * Number(masterDataItem[0].surcharge) / 100)
                    )
                );
        
                // dispatch(
                //     prepareFinalObject("Booking.bkFacilitationCharges", masterDataItem[0])
                // );
        
                dispatch(
                    prepareFinalObject(
                        "Booking.bkUtgst",
                        (totalAmount * Number(masterDataItem[0].utgstRate) / 100)
                    )
                );
                dispatch(
                    prepareFinalObject(
                        "Booking.bkCgst",
                        (totalAmount * Number(masterDataItem[0].cgstRate) / 100)
                    )
                );
        
                dispatch(
                    prepareFinalObject(
                        "Booking.bkBookingVenue",
                        availabilityCheckData.bkBookingVenue
                    )
                );
                dispatch(
                    prepareFinalObject(
                        "Booking.bkSector",
                        availabilityCheckData.bkSector
                    )
                );
            } else {
                dispatch(setRoute(`/egov-services/checkavailability_pcc`));
            }
        }

        // Code to goto a specific step through URL
        if (step && step.match(/^\d+$/)) {
            let intStep = parseInt(step);
            set(
                action.screenConfig,
                "components.div.children.stepper.props.activeStep",
                intStep
            );
            let formWizardNames = [
                "formwizardFirstStep",
                "formwizardSecondStep",
                "formwizardThirdStep",
                "formwizardFourthStep",
            ];
            for (let i = 0; i < 4; i++) {
                set(
                    action.screenConfig,
                    `components.div.children.${formWizardNames[i]}.visible`,
                    i == step
                );
                set(
                    action.screenConfig,
                    `components.div.children.footer.children.previousButton.visible`,
                    step != 0
                );
            }
        }

        return action;
    },
    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            props: {
                className: "common-div-css",
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
                stepper,
                formwizardFirstStep,
                formwizardSecondStep,
                formwizardThirdStep,
                formwizardFourthStep,
                footer,
            },
        },
    },
};

export default screenConfig;

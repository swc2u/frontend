import {
    getCommonContainer,
    getCommonHeader,
    getStepperObject,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    getCurrentFinancialYear,
    clearlocalstorageAppDetails,
    convertDateInYMD,
} from "../utils";
import { footer } from "./applyResourceOSWMCC/footerBooking";
import {
    personalDetails,
    bookingDetails,
} from "./applyResourceOSWMCC/nocDetailsBooking";
import jp from "jsonpath";

import { documentDetails } from "./applyResourceOSWMCC/documentDetailsBooking";
import { summaryDetails } from "./applyResourceOSWMCC/summaryDetailsBooking";
import {
    getFileUrlFromAPI,
    getQueryArg,
    getTransformedLocale,
    setBusinessServiceDataToLocalStorage,
} from "egov-ui-framework/ui-utils/commons";
import {
    prepareFinalObject,
    handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
    getTenantId,
    setapplicationType,
    lSRemoveItem,
    lSRemoveItemlocal,
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
    furnishNocResponse,
} from "../../../../ui-utils/commons";

export const stepsData = [
    {
        labelName: "Applicant Details",
        labelKey: "BK_OSWMCC_BOOKING_APPLICANT_DETAILS",
    },
    { labelName: "Booking Details", labelKey: "BK_OSWMCC_BOOKING_DETAILS" },
    { labelName: "Documents", labelKey: "BK_OSWMCC_BOOKING_DOCUMENTS" },
    { labelName: "Summary", labelKey: "BK_OSWMCC_BOOKING_SUMMARY" },
];
export const stepper = getStepperObject(
    { props: { activeStep: 0 } },
    stepsData
);

export const header = getCommonContainer({
    header: getCommonHeader({
        labelName: `Apply for Open Space within MCC jurisdiction`,
        labelKey: "BK_OSWMCC_APPLY",
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
    console.log(tenantId, "tenantId");
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
                        // {
                        //     name: "Sector",
                        // },
                        {
                            name: "OSUJM_Documents",
                        },
                        // {
                        //     name: "Purpose",
                        // },
                        // {
                        //     name: "BookingVenue",
                        // },
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
        ///company///municipal corporation)
        payload.MdmsRes.BookingVenue = [
            {
                id: 1,
                code: "Sector 17",
                tenantId: "ch.chandigarh",
                name: "Sector 17",
                active: true,
            },
            {
                id: 2,
                code: "Sector 34",
                tenantId: "ch.chandigarh",
                name: "Sector 34",
                active: true,
            },
            {
                id: 2,
                code: "Manimajra",
                tenantId: "ch.chandigarh",
                name: "Manimajra",
                active: true,
            },
        ];
        payload.MdmsRes.Category = [
            {
                id: 1,
                code: "INDIVIDUAL",
                tenantId: "ch.chandigarh",
                name: "INDIVIDUAL",
                active: true,
            },
            {
                id: 1,
                code: "corporate",
                tenantId: "ch.chandigarh",
                name: "corporate",
                active: true,
            },
            {
                id: 1,
                code: "Society",
                tenantId: "ch.chandigarh",
                name: "Society",
                active: true,
            },
            {
                id: 1,
                code: "company",
                tenantId: "ch.chandigarh",
                name: "company",
                active: true,
            },
            {
                id: 1,
                code: "Government",
                tenantId: "ch.chandigarh",
                name: "Government",
                active: true,
            },
            {
                id: 1,
                code: "semi government",
                tenantId: "ch.chandigarh",
                name: "semi government",
                active: true,
            },
            {
                id: 2,
                code: "municipal corporation",
                tenantId: "ch.chandigarh",
                name: "municipal corporation",
                active: true,
            },
        ];
        dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
    } catch (e) {
        console.log(e);
    }
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
        dispatch(setRoute(
            `/egov-services/checkavailability_oswmcc?applicationNumber=${applicationNumber}&tenantId=${tenantId}&businessService=${businessService}`
        ))
        // dispatch(setRoute(`/egov-services/checkavailability_oswmcc?application`));
        console.log("availabilityCheckData in undefined");
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
    name: "applyopenspacewmcc",
    beforeInitScreen: (action, state, dispatch) => {
        // clearlocalstorageAppDetails(state);
        setapplicationType("OSUJM");

        const applicationNumber = getQueryArg(
            window.location.href,
            "applicationNumber"
        );
        const tenantId = getQueryArg(window.location.href, "tenantId");
        const businessService = getQueryArg(
            window.location.href,
            "businessService"
        );
        const step = getQueryArg(window.location.href, "step");

        dispatch(
            prepareFinalObject(
                "Booking.bkApplicantName",
                JSON.parse(getUserInfo()).name
            )
        );
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
            prepareDocumentsUploadData(state, dispatch, "apply_OSUJM");
        });

        // Search in case of EDIT flow
        if (applicationNumber !== null) {
            set(
                action.screenConfig,
                "components.div.children.headerDiv.children.header.children.applicationNumber.visible",
                true
            );
            prepareEditFlow(
                state,
                dispatch,
                applicationNumber,
                tenantId,
                businessService
                // fromDate,
                // toDate,
                // venue,
                // locality
            );
        } else {
            // const locality = getQueryArg(window.location.href, "sector");
            // const venue = getQueryArg(window.location.href, "venue");
            // const fromDate = getQueryArg(window.location.href, "fromDate");
            // const toDate = getQueryArg(window.location.href, "toDate");
            // const from = convertDateInYMD(queryfrom);
            // const to = convertDateInYMD(queryto);

            const availabilityCheckData = get(
                state,
                "screenConfiguration.preparedFinalObject.availabilityCheckData"
            );
            if (availabilityCheckData !== undefined) {
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
                dispatch(setRoute(`/egov-services/checkavailability_oswmcc`));
                console.log("availabilityCheckData in undefined");
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

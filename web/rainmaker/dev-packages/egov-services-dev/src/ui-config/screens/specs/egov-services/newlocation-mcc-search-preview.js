import {
    getCommonCard,
    getCommonContainer,
    getCommonHeader,
    getBreak,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    handleScreenConfigurationFieldChange as handleField,
    prepareFinalObject,
    toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
    localStorageGet,
    localStorageSet,
    setapplicationNumber,
    getapplicationNumber,
} from "egov-ui-kit/utils/localStorageUtils";
import {
    getFileUrlFromAPI,
    getQueryArg,
    setBusinessServiceDataToLocalStorage,
} from "egov-ui-framework/ui-utils/commons";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import {
    generageBillCollection,
    generateBill,
} from "../utils";
import { applicantSummary } from "./searchResource/newLocApplicantSummary";
import { openSpaceSummary } from "./searchResource/newLocOpenSpaceSummary";
//import { estimateSummary } from "./searchResource/estimateSummary";
import { documentsSummary } from "./searchResource/newLocDocumentsSummary";
import { remarksSummary } from "./searchResource/newLocRemarksSummary";
import { ImageLocationSummary } from "./summaryResource/imagesOfNewLocationOswmcc";
import { footer } from "./searchResource/citizenFooter";
import {
    footerReviewTop,
} from "./searchResource/footer";
import {
    getLocale,
    getUserInfo,
} from "egov-ui-kit/utils/localStorageUtils";
import {
    getSearchResultsViewForNewLocOswmcc
} from "../../../../ui-utils/commons";
import { httpRequest } from "../../../../ui-utils";

let role_name = JSON.parse(getUserInfo()).roles[0].code;
let bookingStatus = "";

const titlebar = getCommonContainer({
    header: getCommonHeader({
        labelName: "Task Details",
        labelKey: "BK_MY_BK_APPLICATION_DETAILS_HEADER",
    }),
    applicationNumber: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-services",
        componentPath: "ApplicationNoContainer",
        props: {
            number: getapplicationNumber(), //localStorage.getItem('applicationsellmeatNumber')
        },
    }
});

const prepareDocumentsView = async (state, dispatch) => {
    let documentsPreview = [];

    // Get all documents from response
    let bookingDocs = get(
        state,
        "screenConfiguration.preparedFinalObject.BookingDocument",
        {}
    );

    //let fileStoreIdsArray = Object.keys(response.documentMap);

    //let fileStoreIds = fileStoreIdsArray.join();
    let fileStoreIds = bookingDocs.map(e => e.fileStoreId).join(",");

    //let onlyLocationImages = Object.entries(response.documentMap);
    const fileUrlPayload = fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
    let newLocationImagesPreview = [];
    bookingDocs && bookingDocs.forEach((item, index) => {

        newLocationImagesPreview[index] = {
            title: item.fileName ||
                `Document - ${index + 1}`,
            fileStoreId: item.fileStoreId,
            link: Object.values(fileUrlPayload)[index].split(",")[0],
            documentType: item.documentType,

        };

    });
    let documentsAndLocImagesArray = newLocationImagesPreview;
    let onlyDocs = documentsAndLocImagesArray && documentsAndLocImagesArray.filter(item => item.documentType == "IDPROOF");
    onlyDocs[0].linkText = "View";
    dispatch(prepareFinalObject("documentsPreview", onlyDocs));
    let onlyLocationImages = documentsAndLocImagesArray && documentsAndLocImagesArray.filter(item => item.documentType != "IDPROOF");

    dispatch(prepareFinalObject("mccNewLocImagesPreview", onlyLocationImages));

    
    
};

const HideshowFooter = (action, bookingStatus) => {
    // Hide edit Footer
    // console.log("actionnew", action);
    let showFooter = false;
    if (bookingStatus === "PENDINGPAYMENT") {
        showFooter = true;
    }
    // set(
    //     action,
    //     "screenConfig.components.div.children.footer.children.cancelButton.visible",
    //     role_name === "CITIZEN" ? (showFooter === true ? true : false) : false
    // );
    set(
        action,
        "screenConfig.components.div.children.footer.children.submitButton.visible",
        role_name === "CITIZEN" ? (showFooter === true ? true : false) : false
    );
};

const setSearchResponse = async (
    state,
    action,
    dispatch,
    applicationNumber,
    tenantId
) => {
    const response = await getSearchResultsViewForNewLocOswmcc([
        { key: "tenantId", value: tenantId },
        { key: "applicationNumber", value: applicationNumber },
    ]);
    let recData = get(response, "osujmNewLocationModelList", []);
    dispatch(
        prepareFinalObject("Booking", recData.length > 0 ? recData[0] : {})
    );
    dispatch(
        prepareFinalObject("BookingDocument", get(response, "documentList", {}))
    );

    bookingStatus = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.applicationStatus",
        {}
    );
    



     prepareDocumentsView(state, dispatch);

     const CitizenprintCont = footerReviewTop(
        action,
        state,
        dispatch,
        bookingStatus,
        applicationNumber,
        tenantId,
        ""
    );

    set(
        action,
        "screenConfig.components.div.children.headerDiv.children.helpSection.children",
        CitizenprintCont
    )

    
};

const getPaymentGatwayList = async (action, state, dispatch) => {
    try {
        let payload = null;
        payload = await httpRequest(
            "post",
            "/pg-service/gateway/v1/_search",
            "_search",
            [],
            {}
        );
        let payloadprocess = [];
        for (let index = 0; index < payload.length; index++) {
            const element = payload[index];
            let pay = {
                element: element
            }
            payloadprocess.push(pay);
        }

        dispatch(prepareFinalObject("applyScreenMdmsData.payment", payloadprocess));
    } catch (e) {
        console.log(e);
    }
};


const screenConfig = {
    uiFramework: "material-ui",
    name: "booking-search-preview",
    beforeInitScreen: (action, state, dispatch) => {
        const applicationNumber = getQueryArg(
            window.location.href,
            "applicationNumber"
        );
        const tenantId = getQueryArg(
            window.location.href,
            "tenantId"
        );
        const businessService = getQueryArg(
            window.location.href,
            "businessService"
        );
        setapplicationNumber(applicationNumber);
        setSearchResponse(state, action, dispatch, applicationNumber, tenantId);
        //getPaymentGatwayList(action, state, dispatch).then(response => {
        // });
        const queryObject = [
            { key: "tenantId", value: tenantId },
            { key: "businessServices", value: "OSBM" },
        ];
        setBusinessServiceDataToLocalStorage(queryObject, dispatch);

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
                                sm: 8,
                            },
                            ...titlebar,
                        },
                        helpSection: {
                            uiFramework: "custom-atoms",
                            componentPath: "Container",
                            props: {
                                color: "primary",
                                style: { justifyContent: "flex-end" },
                            },
                            gridDefination: {
                                xs: 12,
                                sm: 4,
                                align: "right",
                            },
                        },
                    },
                },
                taskStatus: {
                    uiFramework: "custom-containers-local",
                    componentPath: "WorkFlowContainer",
                    moduleName: "egov-services",
                    //   visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
                    visible: true,
                    //   props: {
                    //     dataPath: "Booking",
                    //     moduleName: "MyBooking",
                    //   },
                },

                body: getCommonCard({
                    //estimateSummary: estimateSummary,
                    applicantSummary: applicantSummary,
                    openSpaceSummary: openSpaceSummary,
                    documentsSummary: documentsSummary,
                    ImageLocationSummary: ImageLocationSummary
                    //remarksSummary: remarksSummary,
                }),
                break: getBreak(),
                footer: footer,
            }
        }
    }
};

export default screenConfig;

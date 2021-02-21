import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { searchResultCitizenApiResponse } from './searchResource/searchResultApiResponse';

const header = getCommonHeader(
    {
        labelName: "My Challans",
        labelKey: "EC_MY_CHALLAN_HEADER"
    },
    {
        classes: {
            root: "common-header-cont"
        }
    }
);

const screenConfig = {
    uiFramework: "material-ui",
    name: "my-challans",
    beforeInitScreen: (action, state, dispatch) => {
        searchResultCitizenApiResponse(action, state, dispatch);
        //fetchData(action, state, dispatch);
        return action;
    },
    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            children: {
                header: header,
                applicationsCard: {
                    uiFramework: "custom-molecules",
                    componentPath: "SingleApplication",
                    visible: true,
                    props: {
                        contents: [
                            {
                                label: "EC_COMMON_TABLE_COL_SI_CHALLAN_NO",
                                jsonPath: "challanId"
                            },
                            {
                                label: "EC_COMMON_TABLE_COL_SI_ITEM_ENCROACHMENT_TYPE",
                                jsonPath: "encroachmentType"
                            },
                            {
                                label: "EC_COMMON_TABLE_COL_SI_VIOLATION_DATE",
                                jsonPath: "violationDate"
                            },
                            {
                                label: "EC_COMMON_TABLE_COL_SI_VIOLATOR_CONTACT_NUMBER",
                                jsonPath: "contactNumber"
                            },
                            {
                                label: "EC_COMMON_TABLE_COL_SI_CHALLAN_STATUS",
                                jsonPath: "status",
                                prefix: "EC_WF_"
                            },

                        ],
                        moduleName: "EGOV-ECHALLAN",
                        homeURL: "/egov-echallan/home"
                    }
                }
            }
        }
    }
};

export default screenConfig;
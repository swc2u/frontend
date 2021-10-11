import React from "react";
import { getCommonHeader,getCommonContainer } from "egov-ui-framework/ui-config/screens/specs/utils";
import { fetchData } from "./citizenSearchResource/citizenFunctions";
import "../utils/index.css";
import PayWnsBillIcon from "../../../../ui-atoms-local/Icons/PayWnsBillIcon/index";
import LinkConnectionsIcon from "../../../../ui-atoms-local/Icons/LinkConnectionsIcon/index";
import MyConnectionsIcon from "../../../../ui-atoms-local/Icons/MyConnectionsIcon/index";
import { getRequiredDocData } from "egov-ui-framework/ui-utils/commons";
import { getLocale,getTenantId,getUserInfo,setModule } from "egov-ui-kit/utils/localStorageUtils";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import {getRequiredDocuments} from "./citizenSearchResource/homehelp"
const header = getCommonHeader({
    labelKey: "WS_COMMON_HEADER"
}, {
    classes: {
        root: "common-header-cont"
    }
});

const cardItems = [
// {
//     label: {
//         labelKey: "WS_COMMON_PAY_WS_BILL_HEADER",
//     },
//     icon: < PayWnsBillIcon />,
//     route: "search"
// },
{
    label: {
        labelKey: "WS_COMMON_APPL_LINK_CONNECTION",
    },
    icon: < LinkConnectionsIcon />,
    route: "link-connection"
},
{
    label: {
        labelKey: "WS_MYCONNECTIONS_HEADER",
    },
    icon: < MyConnectionsIcon />,
    route: "my-connections"
},
{
    label: {
        labelKey: "WS_MONTHLY_WATER_BILL_PAYMENT",
    },
    icon: < PayWnsBillIcon />,
    route: ""
},

];

const usermannulalButton = getCommonContainer({

    downloadcard: {
      uiFramework: "custom-molecules-local",
      moduleName: "egov-wns",
      componentPath: "SampleDownloadForWns",
  
      visible: true,
    },
  
  });

const waterAndSewerageSearchAndResult = {
    uiFramework: "material-ui",
    name: "home",
    moduleName: "egov-wns",
    beforeInitScreen: (action, state, dispatch) => {
    //     setModule("rainmaker-wns");
    // const userInfo = JSON.parse(getUserInfo());
    // const tenantId = process.env.REACT_APP_NAME === "Citizen" ? (userInfo.permanentCity || userInfo.tenantId): getTenantId();
    //   dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
        fetchData(action, state, dispatch);
        const moduleDetails = [
            {
                moduleName: "ws-services-masters",
                masterDetails: [
                    { name: "Documents" }
                ]
            }
        ]
        getRequiredDocData(action, dispatch, moduleDetails)
        return action;
    },
    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            moduleName: "egov-wns",
            props: {
                // className: "common-div-css"
            },
            children: {
                header: header,
                applyCard: {
                    uiFramework: "custom-molecules",
                    componentPath: "LandingPage",
                    moduleName: "egov-wns",
                    props: {
                        items: cardItems,
                        history: {}
                    }
                },
                HelpHome: getRequiredDocuments("WNS"),
                listCard: {
                    uiFramework: "custom-molecules-local",
                    moduleName: "egov-wns",
                    componentPath: "NewConnection",
                    props: {
                        
                    },
                    // props: {
                    //     items: {
                    //         route: {
                    //             screenKey: "home1",
                    //             jsonPath: "components.adhocDialog"
                    //         }
                    //     }                       

                    // }
                },
                
                listCard1: {
                    uiFramework: "custom-molecules-local",
                    moduleName: "egov-wns",
                    componentPath: "MyApplications",
                    props: {}
                },
                // listCard2: {
                //     uiFramework: "custom-molecules-local",
                //     moduleName: "egov-wns",
                //     componentPath: "PastPayments",
                //     props: {
                //         route: "my-connections"
                //     }
                // },
                // listCard4: {
                //     uiFramework: "custom-molecules-local",
                //     moduleName: "egov-wns",
                //     componentPath: "LinkConnection",
                //     props: {
                //         route: "link-connection"
                //     }
                // },
                listCard3: {
                    uiFramework: "custom-molecules-local",
                    moduleName: "egov-wns",
                    componentPath: "HowItWorks",
                }
            }
        },
        usermannulal: usermannulalButton,
        adhocDialog: {
            uiFramework: "custom-containers",
            componentPath: "DialogContainer",
            props: {
                open: false,
                maxWidth: false,
                screenKey: "home1"
            },
            children: {
                popup: {}
            }
        }
    }
};

export default waterAndSewerageSearchAndResult;
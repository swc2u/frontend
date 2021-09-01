import React from "react";
import { getCommonHeader,getCommonContainer,getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { fetchData } from "./citizenSearchResource/citizenFunctions";
import "../utils/index.css";
import PayWnsBillIcon from "../../../../ui-atoms-local/Icons/PayWnsBillIcon/index";
import LinkConnectionsIcon from "../../../../ui-atoms-local/Icons/LinkConnectionsIcon/index";
import MyConnectionsIcon from "../../../../ui-atoms-local/Icons/MyConnectionsIcon/index";
import { getRequiredDocData } from "egov-ui-framework/ui-utils/commons";
import { getLocale,getTenantId,getUserInfo,setModule } from "egov-ui-kit/utils/localStorageUtils";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import {getRequiredDocuments,getConnectionCard} from "./citizenSearchResource/homehelp"

import { getMyConnectionResults, getSWMyConnectionResults } from "../../../../ui-utils/commons";
import {
    handleScreenConfigurationFieldChange as handleField,
    prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
export const fetchCitizenData = async (action, state, dispatch) => {
    let finalResponse = [];
    let queryObject = [
        {
            key: "mobileNumber",
            value: JSON.parse(getUserInfo()).mobileNumber
        },
        // add new property(login user UUID) in api call /ws-services/wc/_search
        {
            key: "connectionUserId",
            value: JSON.parse(getUserInfo()).uuid
        }        
    ]

    const response = await getMyConnectionResults(queryObject, dispatch,action);
    const swResponse = await getSWMyConnectionResults(queryObject, dispatch,action);

    if ((response && response.WaterConnection && response.WaterConnection.length > 0) && (swResponse && swResponse.SewerageConnections && swResponse.SewerageConnections.length > 0)) {
        finalResponse = [...response.WaterConnection, ...swResponse.SewerageConnections];
    } else if (response && response.WaterConnection && response.WaterConnection.length > 0) {
        finalResponse = response.WaterConnection;
    } else {
        if (swResponse && swResponse.SewerageConnections && swResponse.SewerageConnections.length > 0) {
            finalResponse = swResponse.SewerageConnections;
        }
    }
    try {
        /*Mseva 2.0 */
        if (finalResponse && finalResponse.length > 0) {
            const myConnectionResults=finalResponse.filter(item => item.connectionNo !== "NA" && item.connectionNo !== null);
            dispatch(prepareFinalObject("myConnectionResults", myConnectionResults));
            dispatch(prepareFinalObject("myConnectionsCount", myConnectionResults.length));
            
            // dispatch(
            //     handleField(
            //         "my-connections",
            //         "components.div.children.header.children.key",
            //         "props.dynamicArray",
            //         myConnectionResults.length ? [myConnectionResults.length] : [0]
            //     )
            // );
        }
    } catch (error) {
        console.log(error);
    };
}
const header = getCommonHeader({
    labelKey: "WS_COMMON_HEADER"
}, {
    classes: {
        root: "common-header-cont"
    }
});
const setcardList = (state, dispatch) => {
    let mdmsCardList = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData.egpm.cardList",
      []
    );
    let employeeCardList = []
    let roles = JSON.parse(getUserInfo()).roles
    mdmsCardList.map((item, index) => {
      roles.some(r => {
        if (item.roles.includes(r.code)) {
          if (employeeCardList.length > 0) {
            if (!employeeCardList.find((x) => x.code == item.code)) {
              if (JSON.parse(getUserInfo()).type === "CITIZEN") {
                allCardList[index].value.route = item.routeCitizen;
                employeeCardList.push(allCardList[index])
              } else {
                employeeCardList.push(allCardList[index])
              }
            }
          } else {
            if (JSON.parse(getUserInfo()).type === "CITIZEN") {
              allCardList[index].value.route = item.routeCitizen;
              employeeCardList.push(allCardList[index])
            } else {
              employeeCardList.push(allCardList[index])
            }
          }
        }
      })
    });
  
    const cards = employeeCardList.map((item, index) => {
      return item.value
    });
  
    dispatch(
      handleField(
        "home",
        "components.div.children.applyCard",
        "props.items",
        cards
      )
    );
  }

const cardItems = [
// {
//     label: {
//         labelKey: "WS_COMMON_PAY_WS_BILL_HEADER",
//     },
//     icon: < PayWnsBillIcon />,
//     route: "search"
// },
// {
//     label: {
//         labelKey: "WS_MONTHLY_WATER_BILL_PAYMENT",
//     },
//     icon: < PayWnsBillIcon />,
//     route: ""
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
    name: "home1",
    moduleName: "egov-wns",
    beforeInitScreen: (action, state, dispatch) => {
    //     setModule("rainmaker-wns");
    // const userInfo = JSON.parse(getUserInfo());
    // const tenantId = process.env.REACT_APP_NAME === "Citizen" ? (userInfo.permanentCity || userInfo.tenantId): getTenantId();
    //   dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
        fetchData(action, state, dispatch);
        fetchCitizenData(action, state, dispatch);
        const moduleDetails = [
            {
                moduleName: "ws-services-masters",
                masterDetails: [
                    { name: "Documents" }
                ]
            }
        ]
       // getRequiredDocData(action, dispatch, moduleDetails)
       dispatch(prepareFinalObject("searchScreen.DefaultMessage",false));
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
                header: 
                {
                    gridDefination: {
                        xs: 12,
                        sm: 6,
                      },
                    ...header,
                },
               // usermannulal: usermannulalButton,
                // newApplicationButton: {
                //     componentPath: "Button",
                //     gridDefination: {
                //       xs: 12,
                //       sm: 6,
                //       align: "right",
                //     },
                //     visible: false,
                //     props: {
                //       variant: "contained",
                //       color: "primary",
                //       style: {
                //         color: "white",
                //         borderRadius: "2px",
                //         width: "250px",
                //         height: "48px",
                //       },
                //     },
      
                //     children: {
                //       plusIconInsideButton: {
                //         uiFramework: "custom-atoms",
                //         componentPath: "Icon",
                //         props: {
                //           iconName: "add",
                //           style: {
                //             fontSize: "24px",
                //           },
                //         },
                //       },
      
                //       buttonLabel: getLabel({
                //         labelName: "Add Material Indent",
                //         labelKey: "STORE_MATERIAL_INDENT_NOTE_ADD_MATERIAL_INDENT",//
                //       }),
                //     },
                //     onClickDefination: {
                //       action: "condition",
                //      // callBack: createMaterialIndentHandle,
                //     },
                //     roleDefination: {
                //       rolePath: "user-info.roles",
                //       //roles: roles
                //     }
                //   },
                ConnectionList: getConnectionCard("WNS"),
                // applyActivityCard: {
                //     uiFramework: "custom-molecules",
                //     componentPath: "LandingPage",
                //     style: {
                //       paddingTop: "20px",
                //     },
                //     props: {
                //       items: [],
                //       history: {},
                //       module: "PRSCP",
                //       moduleName:'WNS'
                //     }
                //   },
                applyCard: {
                    uiFramework: "custom-molecules",
                    componentPath: "LandingPage",
                    props: {
                        items: cardItems,
                        history: {}
                    }
                },
               // HelpHome: getRequiredDocuments("WNS"),
            //    NestedList: {
            //     uiFramework: "custom-atoms-local",
            //     moduleName: "egov-wns",
            //     componentPath: "NestedList",
            //     props: { number: "NA" },
            //     //visible: false
            //   },
                listCard: {
                    uiFramework: "custom-molecules-local",
                    moduleName: "egov-wns",
                    componentPath: "NewConnectionActivity",// NewConnection
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
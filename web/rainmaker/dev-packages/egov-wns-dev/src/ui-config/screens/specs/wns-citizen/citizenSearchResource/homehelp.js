import {
    getCommonHeader,
    getBreak,
    getCommonCard,
    getCommonTitle,
    getCommonParagraph,
    getCommonContainer,
    getSelectField,
    getLabel
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { getActivityCard } from "../../wns/searchResource/functions";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  const usermannulalButton = getCommonContainer({

    downloadcard: {
      uiFramework: "custom-molecules-local",
      moduleName: "egov-wns",
      componentPath: "SampleDownloadForWns",
  
      visible: true,
    },
  
  });
  const styles = {
    header: {
      color: "gba(0, 0, 0, 0.87)",
      fontFamily: "Roboto",
      fontSize: "14px",
      fontWeight: 500,
      lineHeight: "28px",
      padding: "10px 0px"
      //paddingLeft: "5px"
  
    },
    header1: {
        color: "gba(0, 0, 0, 0.87)",
        fontFamily: "Roboto",
        fontSize: "14px",
        fontWeight: 500,
        lineHeight: "28px",
        padding: "10px 0px",
        textDecoration:"underline"
        //paddingLeft: "5px"
    
      },
    subHeader: {
      color: "gba(0, 0, 0, 0.87)",
      fontFamily: "Roboto",
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: "19px",
      display: "block",
      width: "95%",
    },
    docs: {
      color: "rgba(0, 0, 0, 0.6)",
      fontFamily: "Roboto",
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "17px",
      display: "block",
      width: "95%",
      // paddingBottom: "24px"
    },
    description: {
      fontFamily: "Roboto",
      color: "rgba(0, 0, 0, 0.87)",
      fontSize: "12px",
      fontWeight: 400,
      letterSpacing: "0.6px",
      lineHeight: "14px",
      display: "block",
      width: "95%",
      padding: "10px",
      marginBottom: "0px !important"
    },
  
  };
  
  const header = getCommonHeader(
    {
      labelName: "Undertaking -PET NOC",
      //labelKey: "NOC_REQ_PET_DOCS_HEADER"
      labelKey:"A)  Kindly select 'Link your water connection' above to avail the services mentioned below:"
    },
    {
      style: styles.header
    }
  );
  const headerMain = getCommonHeader(
    {
      labelName: "Undertaking -PET NOC",
      //labelKey: "NOC_REQ_PET_DOCS_HEADER"
      labelKey:"Please Note the following points:"
    },
    {
      style: styles.header1
    }
  );
  const header3 = getCommonHeader(
    {
      labelName: "Undertaking -PET NOC",
     // labelKey: "NOC_REQ_PET_DOCS_HEADER1"
      labelKey: "C) For detailed understanding, refer to the user manual link, else, contact our helpdesk on following number: 0172 278 7200 or write to us on: chd.egov.helpdesk@gmail.com"
    },
    {
      style: styles.header
    }
  );
  const header2 = getCommonHeader(
    {
      labelName: "Undertaking -PET NOC",
     // labelKey: "NOC_REQ_PET_DOCS_HEADER1"
      labelKey: "B) To apply for a new connection, select the following:"
    },
    {
      style: styles.header
    }
  );
  export const getConnectionCard = (type) => {
    return getCommonCard(
      {
        subHeader: getCommonTitle({
          labelKey: "WS_HOME_SEARCH_RESULTS_CONSUMER_NO_LABEL_HOME"
      }),
        ConnectionSearchContainer: getCommonContainer({

          ConnectionList:
          {
            ...getSelectField({
            label: { labelName: "Water connection consumer number", labelKey: "WS_HOME_SEARCH_RESULTS_CONSUMER_NO_LABEL_HOME" },
            placeholder: {
              labelName: "Please Select Your Water Consumer No. To Avail Below Services",
              labelKey: "WS_HOME_SEARCH_RESULTS_CONSUMER_NO_LABEL_HOME_SELECT"
            },
            required: false,
            jsonPath: "searchScreen.connectionNo",
            gridDefination: {
              xs: 12,
              sm: 8
            },
            // style:{
            //   paddingTop:35

            // },
            sourceJsonPath: "myConnectionResults",
            props: {
              optionLabel: "connectionNo",
              optionValue: "connectionNo"
              // hasLocalization: false
            },
            // localePrefix: {
            //   moduleName: "common-masters",
            //   masterName: "Department"
            // }
          }),
          beforeFieldChange: (action, state, dispatch) => {
           // getActivityCard(state,dispatch)
           if(action.value)
           {
            dispatch(prepareFinalObject("searchScreen.DefaultMessage",true));
           }
           else{
            dispatch(prepareFinalObject("searchScreen.DefaultMessage",false));
           }

          },
        },
        usermannulalButton:usermannulalButton,
        // usermannulal: {
        //   gridDefination: {
        //     xs: 12,
        //     sm: 6
        //   },
          
        // }
          // searchButton: {
          //   componentPath: "Button",
          //   gridDefination: { xs: 12, sm: 4 },
          //   props: {
          //     variant: "contained",
          //     visible:false,
          //     style: {
          //       color: "white",
          //       margin: "8px",
          //       backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
          //       borderRadius: "2px",
          //       width: "220px",
          //       height: "48px"
          //     }
          //   },
          //   children: { buttonLabel: getLabel({ labelKey: "WS_SEARCH_CONNECTION_SEARCH_BUTTON" }) },
          //   onClickDefination: {
          //     action: "condition",
          //     callBack: getActivityCard
          //   }
          // },
        }),
        // button: getCommonContainer({
        //   buttonContainer: getCommonContainer({   

             
        //   })
        // })
      }
      
    );
  };
  export const getRequiredDocuments = (type) => {
    return getCommonContainer(
      {
        div2: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          gridDefination: {
            xs: 12,
            sm: 12
          },
          props: {
            style: {
              width: "100%",
              float: "right",
              cursor: "pointer"
            }
          },
          children: {
  
            headermain: {
                uiFramework: "custom-atoms",
                componentPath: "Container",
                children: {
                  headerMain
                },
                break: getBreak(),
              },
            header: {
              uiFramework: "custom-atoms",
              componentPath: "Container",
              children: {
                header
              },
              break: getBreak(),
            },
            subText1: getCommonParagraph({
              labelName: "Apply for change in Tariff Type",
              //labelKey: "SELLMEATNOC_UNDERTAKINGPOINT4"
              labelKey: "1. Apply for change in Tariff Type"
            }),
            subText2: getCommonParagraph({
              labelName: "Apply for change of Defective Meter",
              //labelKey: "SELLMEATNOC_UNDERTAKINGPOINT4"
              labelKey: "2. Apply for change of Defective Meter"
            }),
            subText3: getCommonParagraph({
              labelName: "Apply for change in Consumer Name in Water Bill",
              //labelKey: "SELLMEATNOC_UNDERTAKINGPOINT3",
              labelKey:"3. Apply for change in Consumer Name in Water Bill"
            }),
            subText4: getCommonParagraph({
              labelName: "Apply for temporary disconnection/ NDC of Government houses",
              //labelKey: "SELLMEATNOC_UNDERTAKINGPOINT4"
              labelKey: "4. Apply for temporary disconnection/ NDC of Government houses"
            }),
            subText5: getCommonParagraph({
              labelName: "5. Apply for permanent disconnection",
              //labelKey: "SELLMEATNOC_UNDERTAKINGPOINT4"
              labelKey: "5. Apply for permanent disconnection"
            }),
            subText6: getCommonParagraph({
              labelName: "Apply for extension of temporary connection",
              //labelKey: "SELLMEATNOC_UNDERTAKINGPOINT4"
              labelKey: "6. Apply for extension of temporary connection"
            }),
            subText7: getCommonParagraph({
              labelName: "Apply for change of temporary connection to regular connection",
              //labelKey: "SELLMEATNOC_UNDERTAKINGPOINT4"
              labelKey: "7. Apply for change of temporary connection to regular connection"
            }),
            subText8: getCommonParagraph({
                labelName: "Apply for reconnection",
                //labelKey: "SELLMEATNOC_UNDERTAKINGPOINT4"
                labelKey: "8. Apply for reconnection"
              }),
              subText9: getCommonParagraph({
                labelName: "Apply for reconnection",
                //labelKey: "SELLMEATNOC_UNDERTAKINGPOINT4"
                labelKey: "After linking your water connection by selecting 'Link you water connection', Go to 'My Connections', view your water connection details by selecting 'view details', then select 'take action' and select the necessary service type based upon your requirements."
              }),
           // break: getBreak(),
            header1: {
                uiFramework: "custom-atoms",
                componentPath: "Container",
                children: {
                  header2
                },
                
              },
              subText10: getCommonParagraph({
                labelName: "Apply for reconnection",
                //labelKey: "SELLMEATNOC_UNDERTAKINGPOINT4"
                labelKey: "1. Apply for new water connection (Private & Government)"
              }),
              subText11: getCommonParagraph({
                labelName: "Apply for reconnection",
                //labelKey: "SELLMEATNOC_UNDERTAKINGPOINT4"
                labelKey: "2. Apply for Sewerage Connection"
              }),
              subTex12: getCommonParagraph({
                labelName: "Apply for reconnection",
                //labelKey: "SELLMEATNOC_UNDERTAKINGPOINT4"
                labelKey: "3. Apply for Tube well Connection"
              }),
              header2: {
                uiFramework: "custom-atoms",
                componentPath: "Container",
                children: {
                    header3
                },
                
              },
  
          }
  
        },
       
      },
      {
        style: {
          padding: "0px 10px"
        }
      }
    );
  };
  
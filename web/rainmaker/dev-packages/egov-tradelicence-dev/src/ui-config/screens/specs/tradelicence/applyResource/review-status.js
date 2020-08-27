import {
    getCommonGrayCard,
    getCommonSubHeader,
    getCommonContainer,
    getLabelWithValue,
    getDivider,
    getLabel,
    getTextField
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { changeStep } from "./footer";
  
  import { convertEpochToDate } from "../../utils";
  
  const accessoriesCard = {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "review-trade-search-preview",
      scheama: getCommonGrayCard({
        accessoriesCardContainer: getCommonContainer({
          reviewAccessoryType: getLabelWithValue(
            {
              labelName: "Accesory Type",
              labelKey: "TL_REVIEWACCESSORY_TYPE_LABEL"
            },
            {
              jsonPath:
                "Licenses[0].tradeLicenseDetail.accessories[0].accessoryCategory",
              localePrefix: {
                moduleName: "TRADELICENSE",
                masterName: "ACCESSORIESCATEGORY"
              }
            }
          ),
          reviewAccessoryUOM: getLabelWithValue(
            {
              labelName: "UOM",
              labelKey: "TL_NEW_TRADE_DETAILS_UOM_UOM_PLACEHOLDER"
            },
            { jsonPath: "Licenses[0].tradeLicenseDetail.accessories[0].uom" }
          ),
          reviewAccessoryUOMValue: getLabelWithValue(
            {
              labelName: "UOM Value",
              labelKey: "TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL"
            },
            { jsonPath: "Licenses[0].tradeLicenseDetail.accessories[0].uomValue" }
          ),
          reviewAccessoryCount: getLabelWithValue(
            {
              labelName: "Accessory Count",
              labelKey: "TL_NEW_TRADE_ACCESSORY_COUNT"
            },
            { jsonPath: "Licenses[0].tradeLicenseDetail.accessories[0].count" }
          )
        })
      }),
  
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      sourceJsonPath: "Licenses[0].tradeLicenseDetail.accessories",
      prefixSourceJsonPath:
        "children.cardContent.children.accessoriesCardContainer.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  };
  
  const tradeTypeCard = {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "review-trade-search-preview",
      scheama: getCommonGrayCard({
        tradeTypeCardContainer: getCommonContainer({
          reviewTradeCategory: getLabelWithValue(
            {
              labelName: "Trade Category",
              labelKey: "TL_NEW_TRADE_DETAILS_TRADE_CAT_LABEL"
            },
            {
              jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].tradeType",
              localePrefix: {
                moduleName: "TRADELICENSE",
                masterName: "TRADETYPE"
              },
              callBack: value => {
                return value.split(".")[0];
              }
            }
          ),
          reviewTradeType: getLabelWithValue(
            {
              labelName: "Trade Type",
              labelKey: "TL_NEW_TRADE_DETAILS_TRADE_TYPE_LABEL"
            },
            {
              jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].tradeType",
              localePrefix: {
                moduleName: "TRADELICENSE",
                masterName: "TRADETYPE"
              },
              callBack: value => {
                return value.split(".")[1];
              }
            }
          ),
          reviewTradeSubtype: getLabelWithValue(
            {
              labelName: "Trade Sub-Type",
              labelKey: "TL_NEW_TRADE_DETAILS_TRADE_SUBTYPE_LABEL"
            },
            {
              jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].tradeType",
              localePrefix: {
                moduleName: "TRADELICENSE",
                masterName: "TRADETYPE"
              }
            }
          ),
  
          reviewTradeUOM: getLabelWithValue(
            {
              labelName: "UOM (Unit of Measurement)",
              labelKey: "TL_NEW_TRADE_DETAILS_UOM_LABEL"
            },
            { jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].uom" }
          ),
          reviewTradeUOMValue: getLabelWithValue(
            {
              labelName: "UOM Value",
              labelKey: "TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL"
            },
            { jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].uomValue" }
          )
        })
      }),
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      sourceJsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits",
      prefixSourceJsonPath:
        "children.cardContent.children.tradeTypeCardContainer.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  };
  export const getReviewTradeStatus = (isEditable = true) => {
    return getCommonGrayCard({
      headerDiv: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        props: {
          style: { marginBottom: "10px" }
        },
        children: {
          header: {
            gridDefination: {
              xs: 12,
              sm: 10
            },
            ...getCommonSubHeader({
              labelName: "Trade Details",
              labelKey: "Application Status"
            })
          },
          editSection: {
            componentPath: "Button",
            props: {
              color: "primary"
            },
            visible: isEditable,
            gridDefination: {
              xs: 12,
              sm: 2,
              align: "right"
            },
            children: {
              editIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "edit"
                }
              },
              buttonLabel: getLabel({
                labelName: "Edit",
                labelKey: "TL_SUMMARY_EDIT"
              })
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                changeStep(state, dispatch, "", 0);
              }
            }
          }
        }
      },
      viewOne: getCommonContainer({
        comment: {
            ...getTextField({
              label: {
                labelName: "Name",
                labelKey: "Comment"
              },
              placeholder: {
                labelName: "Enter Employee Name",
                labelKey: "comment"
              }
            })
          },

          ApproveButton: {
            componentPath: "Button",
            props: {
              variant: "contained",
              color: "primary",
              style: {
                minWidth: "200px",
                height: "48px",
                marginRight: "45px",
                background: "green"
              }
            },
            children: {
              nextButtonLabel: getLabel({
                labelName: "CANCEL TRADE LICENSE",
                labelKey: "Approve"
              })
            },
            onClickDefination: {
                action: "condition",
                callBack: callBackForApproval
              },
            visible: true,
          },

          RejectButton: {
            componentPath: "Button",
            props: {
              variant: "contained",
              color: "primary",
              style: {
                minWidth: "200px",
                height: "48px",
                marginRight: "45px",
                background: "red"
              }
            },
            children: {
              nextButtonLabel: getLabel({
                labelName: "CANCEL TRADE LICENSE",
                labelKey: "Reject"
              })
            },
            onClickDefination: {
                action: "condition",
                callBack: callBackForReject
              },
            visible: true,
          }

      }),
      div1: getDivider(),
    });
  };

  export const callBackForReject = (state, dispatch) => {
    console.log(state);
    console.log(dispatch);
    alert("Application Rejected");
    window.location.href = `search`
    
    
  };


  export const callBackForApproval = (state, dispatch) => {
    console.log(state);
    console.log(dispatch);
    alert("Application Approved");
    window.location.href = `search`
    
    
  };



  const onRowClick = rowData => {
    switch (rowData[5]) {
      case "INITIATED":
        window.location.href = `apply?applicationNumber=${rowData[0]}&tenantId=${
          rowData[6]
        }`;
        break;
      default:
        window.location.href = `search-preview?applicationNumber=${
          rowData[0]
        }&tenantId=${rowData[6]}`;
        break;
    }
}
  
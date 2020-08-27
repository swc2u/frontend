import {
    getCommonContainer,
    getCommonGrayCard,
    getCommonSubHeader,
    getLabel,
    getLabelWithValue
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  
  const gotoCreatePage = (state, dispatch) => {
    const createUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
    ? `/egov-ui-framework/egov-store-asset/createpricelist?step=0`
    : `/egov-store-asset/createpricelist?step=0`;
    dispatch(setRoute(createUrl));
  };
  
  const storeCard = {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "review-hr",
      scheama: getCommonGrayCard({
        storeCardContainer: getCommonContainer({
          materialcode: getLabelWithValue(
            {
              labelName: "Material Code",
                labelKey: "STORE_MATERIAL_CODE"
            },
            { jsonPath: "priceLists[0].priceListDetails[0].material.code",          
          }
          ),
          quantity: getLabelWithValue(
            {
              labelName: "quantity",
                    labelKey: "STORE_DETAILS_QUANTITY"
            },
            { jsonPath: "priceLists[0].priceListDetails[0].quantity"
            
           }
          ),
          ratePerUnit: getLabelWithValue(
            { labelName: "Rate",
            labelKey: "STORE_DETAILS_RATE"},
            {
              jsonPath: "priceLists[0].priceListDetails[0].ratePerUnit"
             
            }
          ),
          uomcode: getLabelWithValue(
            {  labelName: "Store Name", labelKey: "STORE_DETAILS_STORE_NAME" },
            {
              jsonPath: "priceLists[0].priceListDetails[0].uom.code",
             
            }
          )
        })
      }),
  
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      sourceJsonPath: "priceLists[0].priceListDetails",
      prefixSourceJsonPath:
        "children.cardContent.children.storeCardContainer.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  };
  export const getStoreDetailsView = (isReview = true) => {
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
              labelName: "Material Map Store Details",
              labelKey: "STORE_MATERIAL_MAP_STORE_DETAILS"
            })
          },
          editSection: {
            componentPath: "Button",
            props: {
              color: "primary"
            },
            visible: isReview,
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
                labelKey: "STORE_SUMMARY_EDIT"
              })
            },
            onClickDefination: {
              action: "condition",
              callBack: gotoCreatePage
            }
          }
        }
      },
      viewOne: storeCard
    });
  };
  
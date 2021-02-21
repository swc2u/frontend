import {
    getCommonContainer,
    getCommonGrayCard,
    getCommonSubHeader,
    getLabel,
    getLabelWithValue
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  
  const gotoCreatePage = (state, dispatch) => {
     const createUrl = `/egov-nulm/create-susv?step=3`;
    dispatch(setRoute(createUrl));
  };
  export const subHeader = getCommonContainer({
    subHeader: getCommonSubHeader({
      labelName:
        "I undertake that in the event of any of the information furnished above being found to be false or incorrect in any respect,the certificate is liable to be cancelled.",
      labelKey: "NULM_SUSV_UNDERTAKING_DECLARATION"
    })
  });
  export const getUnderTakingView = (isReview = true) => {
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
              labelName: "UnderTaking",
              labelKey: "NULM_SUSV_UNDERTAKING_HEADER"
            })
          },
          subHeader: {
            gridDefination: {
              xs: 12,
              sm: 10
            },
            ...subHeader
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
                labelKey: "HR_SUMMARY_EDIT"
              })
            },
            onClickDefination: {
              action: "condition",
              callBack: gotoCreatePage
            }
          }
        }
      },
      viewOne: getCommonContainer({
        place: getLabelWithValue(
          {
            labelName: "Place",
            labelKey: "NULM_SUSV_PLACE"
          },
          { jsonPath: "NulmSusvRequest.place" }
        ),
        date: getLabelWithValue(
          {
            labelName: "Date",
            labelKey: "NULM_SUH_LOG_DATE"
          },
          { jsonPath: "NulmSusvRequest.date" }
        ),
      }),
    });
  };
  
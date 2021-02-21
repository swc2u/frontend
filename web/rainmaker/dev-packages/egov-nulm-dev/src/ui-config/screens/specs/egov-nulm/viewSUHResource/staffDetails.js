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
     const createUrl = `/egov-nulm/create-suh?step=3`;
    dispatch(setRoute(createUrl));
  };
  
  export const getStaffDetailsView = (isReview = true) => {
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
              labelName: "Staff",
              labelKey: "NULM_SUH_STAFF"
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
        isManager: getLabelWithValue(
          {
            labelName: "Manager",
            labelKey: "NULM_SUH_MANAGER"
          },
          { jsonPath: "NulmSuhRequest.suhStaffMaintenance[0].isManager" }
        ),
        managerRemark: getLabelWithValue(
          {
            labelName: "Remarks",
            labelKey: "NULM_SUH_REMARKS"
          },
          { jsonPath: "NulmSuhRequest.suhStaffMaintenance[0].managerRemark" }
        ),
        isSecurityStaff: getLabelWithValue(
            {
              labelName: "Security staff",
              labelKey: "NULM_SUH_SECURITY_STAFF"
            },
            { jsonPath: "NulmSuhRequest.suhStaffMaintenance[0].isSecurityStaff" }
          ),
          securityStaffRemark: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "NULM_SUH_REMARKS"
            },
            { jsonPath: "NulmSuhRequest.suhStaffMaintenance[0].securityStaffRemark" }
          ),
          isCleaner: getLabelWithValue(
            {
              labelName: "Cleaner",
              labelKey: "NULM_SUH_CLEANER"
            },
            { jsonPath: "NulmSuhRequest.suhStaffMaintenance[0].isCleaner" }
          ),
          cleanerRemark: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "NULM_SUH_REMARKS"
            },
            { jsonPath: "NulmSuhRequest.suhStaffMaintenance[0].cleanerRemark" }
          ),
      
      }),
    });
  };
  
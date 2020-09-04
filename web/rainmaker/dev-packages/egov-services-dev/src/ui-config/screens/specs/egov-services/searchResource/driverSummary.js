import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabelWithValue,
} from "egov-ui-framework/ui-config/screens/specs/utils";

export const driverSummary = getCommonGrayCard({
  header: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      props: {
          style: { marginBottom: "10px" },
      },
      children: {
          header: {
              gridDefination: {
                  xs: 8,
              },
              ...getCommonSubHeader({
                  labelName: "Driver Details",
                  labelKey: "BK_MY_BK_DRIVER_DETAILS_HEADER",
              }),
          },
      },
  },
  bookingCaseContainer: {
      uiFramework: "custom-containers",
      componentPath: "MultiItem",
      props: {
          className: "sellmeatapplicant-summary",
          scheama: getCommonGrayCard({
              driverContainer: getCommonContainer({
                  driverName: getLabelWithValue(
                      {
                          labelName: "Driver Name",
                          labelKey: "BK_MY_BK_DRIVER_NAME_LABEL",
                      },
                      {
                          jsonPath: "Booking.bkDriverName",
                      }
                  ),
                  driverMobile: getLabelWithValue(
                      {
                          labelName: "Driver Contact",
                          labelKey: "BK_MY_BK_DRIVER_MOBILE_NO_LABEL",
                      },
                      {
                          jsonPath: "Booking.bkContactNo",
                      }
                  ),
                  approverName: getLabelWithValue(
                      {
                          labelName: "Approver",
                          labelKey: "BK_MY_BK_APPROVER_NAME_LABEL",
                      },
                      {
                          jsonPath: "Booking.bkApproverName",
                          callBack: (value) => {
                            if (value === undefined || value === "" || value === null) {
                               return "NA"
                            } else {
                                return value;
                            }
                        },
                      },
                  )
              }),
          }),
          items: [],
          hasAddItem: false,
          isReviewPage: true,
          sourceJsonPath: "Booking",
      },
      type: "array",
  },
});

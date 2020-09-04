import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue,
  convertEpochToDate,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep } from "../../utils/index";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";

export const applicantSummary = getCommonGrayCard({
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
                  labelName: "Applicant Details",
                  labelKey: "BK_OSWMCC_NEW_LOC_APPLICANT_DETAILS",
              }),
          },
          
      },
  },
  cardOne: {
      uiFramework: "custom-containers",
      componentPath: "MultiItem",
      props: {
          className: "sellmeatapplicant-summary",
          scheama: getCommonGrayCard({
              applicantContainer: getCommonContainer({
                  applicantName: getLabelWithValue(
                      {
                          labelName: "Applicant Name",
                          labelKey: "BK_OSWMCC_NEW_LOC_NAME_LABEL",
                      },
                      {
                          jsonPath: "Booking.applicantName",
                      }
                  ),
                  mailAddress: getLabelWithValue(
                      {
                          labelName: "Email Address",
                          labelKey: "BK_OSWMCC_NEW_LOC_EMAIL_LABEL",
                      },
                      {
                          jsonPath: "Booking.mailAddress",
                      }
                  ),
                  contact: getLabelWithValue(
                      {
                          labelName: "Mobile Number",
                          labelKey: "BK_OSWMCC_NEW_LOC_MOBILE_NO_LABEL",
                      },
                      {
                          jsonPath: "Booking.contact",
                      }
                  ),
                  applicantAddress: getLabelWithValue(
                    {
                        labelName: "Address",
                        labelKey: "BK_OSWMCC_NEW_LOC_ADDRESS_LABEL",
                    },
                    {
                        jsonPath: "Booking.applicantAddress",
                    }
                )
              }),
          }),
          items: [],
          hasAddItem: false,
          isReviewPage: true,
          sourceJsonPath: "Booking",
          prefixSourceJsonPath:
              "children.cardContent.children.applicantContainer.children",
          afterPrefixJsonPath: "children.value.children.key",
      },
      type: "array",
  },
});

import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue,
  convertEpochToDate
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep } from "../../utils/index";
import "./index.css";
export const violatorSummary = getCommonGrayCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 8
        },
        ...getCommonSubHeader({
          labelName: "Violator Details",
          labelKey: "EC_CHALLAN_VIOLATOR_DETAILS_HEADER"
        })
      },
      editSection: {
        componentPath: "Button",
        props: {
          color: "primary",
          style: {
            marginTop: "-10px",
            marginRight: "-18px"
          }
        },
        visible: false,
        gridDefination: {
          xs: 4,
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
            labelKey: "NOC_SUMMARY_EDIT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            gotoApplyWithStep(state, dispatch, 2);
          }
        }
      }
    }
  },
  cardOne: {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "fine-details",
      scheama: getCommonGrayCard({
        voilatorContainer: getCommonContainer({
          nameofVoilator: getLabelWithValue(
            {
              labelName: "Name of Voilator",
              labelKey: "EC_ECHALLAN_NAME_OF_VOILATOR_LABEL"
            },
            {
              jsonPath:
                "eChallanDetail[0].violatorName"
              // callBack: value => {
              //   return value.split(".")[0];
              // }
            }
          ),
          fatherName: getLabelWithValue(
            {
              labelName: "Father Name",
              labelKey: "EC_ECHALLAN_FATHER_NAME_OF_VOILATOR_LABEL"
            },
            {
              jsonPath:
                "eChallanDetail[0].fatherName"
              // callBack: value => {
              //   return value.split(".")[1];
              // }
            }
          ),
          voilatorContactNo: getLabelWithValue(
            {
              labelName: "Contact No",
              labelKey: "EC_ECHALLAN_VOILATOR_CONTACT_NO_LABEL"
            },
            {
              jsonPath:
                "eChallanDetail[0].contactNumber"
            }
          ),
          voilatorEmailId: getLabelWithValue(
            {
              labelName: "Email Id",
              labelKey: "EC_ECHALLAN_VOILATOR_EMAIL_ID_LABEL"
            },
            {
              jsonPath:
                "eChallanDetail[0].emailId"
            }
          ),
          voilatorAddress: getLabelWithValue(
            {
              labelName: "Address",
              labelKey: "EC_ECHALLAN_VOILATOR_ADDRESS_LABEL"
            },
            {
              jsonPath:
                "eChallanDetail[0].address"
            }
          ),

        })
      }),
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      sourceJsonPath: "eChallanDetail",
    },
    type: "array"
  }
});


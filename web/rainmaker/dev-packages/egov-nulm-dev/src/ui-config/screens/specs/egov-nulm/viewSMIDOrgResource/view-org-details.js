import {
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {  checkValueForNA } from "../../utils";

const gotoCreatePage = (state, dispatch) => {
   const createUrl = `/egov-nulm/create-smid-org?step=0`;
  dispatch(setRoute(createUrl));
};

export const getSMIDOrgDetailsView = (isReview = true) => {
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
            labelName: "SMID Details",
            labelKey: "NULM_APPLICATION_FOR_SMID_DETAILS"
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
      name: getLabelWithValue(
        {
          labelName: "SHG Name",
          labelKey: "NULM_SHG_NAME"
        },
        { jsonPath: "NulmShgRequest.name" ,callBack: checkValueForNA }
      ),
      type: getLabelWithValue(
        {
          labelName: "SHG Type",
          labelKey: "NULM_SHG_TYPE"
        },
        { jsonPath: "NulmShgRequest.type" }
      ),
      formendThrough: getLabelWithValue(
        {
          labelName: "SHG formatted through",
          labelKey: "NULM_SHG_FORMATTED_THROUGH"
        },
        { jsonPath: "NulmShgRequest.formendThrough" ,callBack: checkValueForNA}
      ),
      
      address: getLabelWithValue(
        {
          labelName: "SHG Address",
          labelKey: "NULM_SHG_ADDRESS"
        },
        { jsonPath: "NulmShgRequest.address",callBack: checkValueForNA }
      ),

      dateOfFormation: getLabelWithValue(
        {
          labelName: "SHG date of formation",
          labelKey: "NULM_SHG_DATE_OF_FORMATION"
        },
        { jsonPath: "NulmShgRequest.dateOfFormation"  ,callBack: checkValueForNA}
      ),
      contactNo: getLabelWithValue(
        {
          labelName: "Contact Number",
          labelKey: "NULM_SHG_CONTACT_NO"
        },
        { jsonPath: "NulmShgRequest.contactNo" ,callBack: checkValueForNA }
      ),
      accountNo: getLabelWithValue(
        {
          labelName: "SHG Account number",
          labelKey: "NULM_SHG_ACCOUNT_NUMBER"
        },
        { jsonPath: "NulmShgRequest.accountNo" }
      ),
      dateOfOpeningAccount: getLabelWithValue(
        {
          labelName: "Date of opening account",
          labelKey: "NULM_SHG_DATE_OF_OPENING_ACCOUNT"
        },
        { jsonPath: "NulmShgRequest.dateOfOpeningAccount" ,callBack: checkValueForNA }
      ),

      bankName: getLabelWithValue(
        {
          labelName: "SHG Bank Name",
          labelKey: "NULM_SHG_BANK_NAME"
        },
        { jsonPath: "NulmShgRequest.bankName" ,callBack: checkValueForNA }
      ),

      branchName: getLabelWithValue(
        {
          labelName: "SHG Branch Name",
          labelKey: "NULM_SHG_BRANCH_NAME"
        },
        { jsonPath: "NulmShgRequest.branchName",callBack: checkValueForNA }
      ),

      mainAcitivity: getLabelWithValue(
        {
          labelName: "SHG Main Activity",
          labelKey: "NULM_SHG_MAIN_ACTIVITY"
        },
        { jsonPath: "NulmShgRequest.mainAcitivity",callBack: checkValueForNA }
      ),

      groupNominatedBy: getLabelWithValue(
        {
          labelName: "Groups Nominated By",
          labelKey: "NULM_SHG_GROUPS_NOMINATED_BY"
        },
        { jsonPath: "NulmShgRequest.groupNominatedBy",callBack: checkValueForNA }
      ),
    }),
  });
};

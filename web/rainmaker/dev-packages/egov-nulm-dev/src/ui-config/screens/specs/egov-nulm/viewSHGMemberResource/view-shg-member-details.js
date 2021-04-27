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
   const createUrl = `/egov-nulm/create-shg-member?step=0`;
  dispatch(setRoute(createUrl));
};

export const getSHGMemberDetailsView = (isReview = true) => {
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
            labelName: "View SHG Member",
            labelKey: "NULM_SHG_MEMBER_VIEW"
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
      positionLevel: getLabelWithValue(
        {
          labelName: "Position",
          labelKey: "NULM_SHG_MEMBER_POSITION",
        },
        { jsonPath: "NulmShgMemberRequest.positionLevel" ,callBack: checkValueForNA }
      ),
      caste: getLabelWithValue(
        {
          labelName: "Caste of Applicant",
          labelKey: "NULM_SMID_CASTE_OF_APPLICANT",
        },
        { jsonPath: "NulmShgMemberRequest.caste" ,callBack: checkValueForNA }
      ),
      isUrbanPoor: getLabelWithValue(
        {
          labelName: "Urban Poor",
          labelKey: "NULM_SMID_URBAN_POOR"
        },
        { jsonPath: "NulmShgMemberRequest.isUrbanPoor" ,callBack: checkValueForNA }
      ),
      bplNo: getLabelWithValue(
        {
          labelName: "BPL NULM_SMID_BPL_NUMBER",
          labelKey: "NULM_SMID_BPL_NUMBER"
        },
        { jsonPath: "NulmShgMemberRequest.bplNo" ,callBack: checkValueForNA }
      ),
      
      isPwd: getLabelWithValue(
        {
          labelName: "PWD",
          labelKey: "NULM_SMID_PWD"
        },
        { jsonPath: "NulmShgMemberRequest.isPwd" ,callBack: checkValueForNA }
      ),
      name: getLabelWithValue(
        {
          labelName: "Name of Applicant",
          labelKey: "NULM_SMID_NAME_OF_APPLICANT"
        },
        { jsonPath: "NulmShgMemberRequest.name" ,callBack: checkValueForNA }
      ),
      fatherOrHusbandName: getLabelWithValue(
        {
          labelName: "Father/Spouse Name",
          labelKey: "NULM_SMID_FATHER/SPOUSE_NAME"
        },
        { jsonPath: "NulmShgMemberRequest.fatherOrHusbandName" ,callBack: checkValueForNA }
      ),
      qualification: getLabelWithValue(
        {
          labelName: "Qualification",
          labelKey: "NULM_SEP_QUALIFACATION"
        },
        { jsonPath: "NulmShgMemberRequest.qualification" ,callBack: checkValueForNA }
      ),
      dob: getLabelWithValue(
        {
          labelName: "Date Of Birth",
          labelKey: "NULM_SMID_DOB"
        },
        { jsonPath: "NulmShgMemberRequest.dob" ,callBack: checkValueForNA }
      ),

      emailId: getLabelWithValue(
        {
          labelName: "Email Id",
          labelKey: "NULM_SMID_EMAIL_ID"
        },
        { jsonPath: "NulmShgMemberRequest.emailId" ,callBack: checkValueForNA }
      ),

      mobileNo: getLabelWithValue(
        {
          labelName: "Mobile Number",
          labelKey: "NULM_SMID_MOBILE_NUMBER"
        },
        { jsonPath: "NulmShgMemberRequest.mobileNo" ,callBack: checkValueForNA }
      ),
      phoneNo: getLabelWithValue(
        {
          labelName: "Phone Number",
          labelKey: "NULM_SMID_PHONE_NUMBER"
        },
        { jsonPath: "NulmShgMemberRequest.phoneNo"  ,callBack: checkValueForNA}
      ),
      motherName: getLabelWithValue(
        {
          labelName: "Mother Name",
          labelKey: "NULM_SMID_MOTHER_NAME"
        },
        { jsonPath: "NulmShgMemberRequest.motherName",callBack: checkValueForNA }
      ),
      address: getLabelWithValue(
        {
          labelName: "Addrss",
          labelKey: "NULM_SMID_ADDRESS"
        },
        { jsonPath: "NulmShgMemberRequest.address" ,callBack: checkValueForNA }
      ),
      gender: getLabelWithValue(
        {
          labelName: "Gender",
          labelKey: "NULM_SMID_GENDER"
        },
        { jsonPath: "NulmShgMemberRequest.gender" ,callBack: checkValueForNA }
      ),
      isMinority: getLabelWithValue(
        {
          labelName: "Minority",
          labelKey: "NULM_SEP_MINORITY"
        },
        { jsonPath: "NulmShgMemberRequest.isMinority" ,callBack: checkValueForNA }
      ),
      minority: getLabelWithValue(
        {
          labelName: "Minority",
          labelKey: "NULM_SEP_MINORITY_RELIGION"
        },
        { jsonPath: "NulmShgMemberRequest.minority" ,callBack: checkValueForNA }
      ),
      wardNo: getLabelWithValue(
        {
          labelName: "Ward No",
          labelKey: "NULM_SMID_WARD_NO"
        },
        { jsonPath: "NulmShgMemberRequest.wardNo" ,callBack: checkValueForNA }
      ),
      nameAsPerAdhar: getLabelWithValue(
        {
          labelName: "Name as per Adhar",
          labelKey: "NULM_SMID_NAME_AS_PER_ADHAR"
        },
        { jsonPath: "NulmShgMemberRequest.nameAsPerAdhar" ,callBack: checkValueForNA } 
      ),
      adharNo: getLabelWithValue(
        {
          labelName: "Adhar Number",
          labelKey: "NULM_SMID_ADHAR_NUMBER"
        },
        { jsonPath: "NulmShgMemberRequest.adharNo" ,callBack: checkValueForNA}
      ),
      adharAcknowledgementNo: getLabelWithValue(
        {
          labelName: "Adhar Acknowledgement Number",
          labelKey: "NULM_SMID_ADHAR_ACKNOWLEDGEMENT_NUMBER"
        },
        { jsonPath: "NulmShgMemberRequest.adharAcknowledgementNo",callBack: checkValueForNA }
      ),

      isInsurance: getLabelWithValue(
        {
          labelName: "Insurance",
          labelKey: "NULM_SMID_INSURANCE"
        },
        { jsonPath: "NulmShgMemberRequest.isInsurance",callBack: checkValueForNA }
      ),
      insuranceThrough: getLabelWithValue(
        {
          labelName: "Insurance through",
          labelKey: "NULM_SMID_INSURANCE_THROUGH"
        },
        { jsonPath: "NulmShgMemberRequest.insuranceThrough" ,callBack: checkValueForNA}
      ),
      isStreetVendor: getLabelWithValue(
        {
          labelName: "Street vendor",
          labelKey: "NULM_SMID_STREET_VENDOR"
        },
        { jsonPath: "NulmShgMemberRequest.isStreetVendor",callBack: checkValueForNA }
      ),
      isHomeless: getLabelWithValue(
        {
          labelName: "Homeless",
          labelKey: "NULM_SMID_HOMELESS"
        },
        { jsonPath: "NulmShgMemberRequest.isHomeless",callBack: checkValueForNA }
      ),
     
    }),
  });
};

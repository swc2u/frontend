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
     const createUrl = `/egov-nulm/create-alf?step=0`;
    dispatch(setRoute(createUrl));
  };
  
  export const getALFDetailsView = (isReview = true) => {
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
              labelName: "ALF Details",
              labelKey: "NULM_APPLICATION_FOR_ALF_PROGRAM"
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
        applicantname: getLabelWithValue(
          {
            labelName: "Name of Applicant",
            labelKey: "NULM_ALF_NAME_OF_APPLICANT"
          },
          { jsonPath: "NULMALFRequest.name" }
        ),

        dateOfRegistration: getLabelWithValue(
          {
            labelName: "Date of Registration",
            labelKey: "NULM_ALF_DATE_OF_REGISTRATION"
          },
          { jsonPath: "NULMALFRequest.dor",callBack: checkValueForNA }
        ),
        
        dateOfFormation: getLabelWithValue(
          {
            labelName: "Date of Formation",
            labelKey: "NULM_ALF_DATE_OF_FORMATION"
          },
          { jsonPath: "NULMALFRequest.dof",callBack: checkValueForNA }
        ),

        address: getLabelWithValue(
          {
            labelName: "Addrss",
            labelKey: "NULM_ALF_ADDRESS"
          },
          { jsonPath: "NULMALFRequest.address" }
        ),
  
        contactnumber: getLabelWithValue(
          {
            labelName: "Contact Number",
            labelKey: "NULM_ALF_CONTACT_NUMBER"
          },
          { jsonPath: "NULMALFRequest.contact" }
        ),
  
        bankName: getLabelWithValue(
          {
            labelName: "Bank Name(Only in Chandigarh)",
            labelKey: "NULM_ALF_BANK_NAME"
          },
          { jsonPath: "NULMALFRequest.bankName",callBack: checkValueForNA }
        ),

        branchName: getLabelWithValue(
          {
            labelName: "Branch Name",
            labelKey: "NULM_ALF_BRANCH_NAME"
          },
          { jsonPath: "NULMALFRequest.branchName",callBack: checkValueForNA }
        ),

        accountName: getLabelWithValue(
          {
            labelName: "Acount Name",
            labelKey: "NULM_ALF_AC_NAME"
          },
          { jsonPath: "NULMALFRequest.accountName",callBack: checkValueForNA }
        ),

        registrationNumber: getLabelWithValue(
          {
            labelName: "Registration Number",
            labelKey: "NULM_ALF_REGISTRATION_NUMBER"
          },
          { jsonPath: "NULMALFRequest.registrationNo",callBack: checkValueForNA }
        )
      }),
    });
  };
  
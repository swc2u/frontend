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
     const createUrl = `/egov-nulm/create-suh?step=2`;
    dispatch(setRoute(createUrl));
  };
  
  export const getRecordMaintenanceDetailsView = (isReview = true) => {
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
              labelName: "Record Maintenance",
              labelKey: "NULM_SUH_RECORD_MAINTENANCE"
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
        isAssetInventoryRegister: getLabelWithValue(
          {
            labelName: "Asset inventory register",
            labelKey: "NULM_SUH_ASSET_INVENTORY_REGISTER"
          },
          { jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].isAssetInventoryRegister" }
        ),
        assetInventoryRegisterRemark: getLabelWithValue(
          {
            labelName: "Remarks",
            labelKey: "NULM_SUH_REMARKS"
          },
          { jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].assetInventoryRegisterRemark" }
        ),
        isAccountRegister: getLabelWithValue(
            {
              labelName: "Account register/cash book of receipts",
              labelKey: "NULM_SUH_ACCOUNT_REGISTER_CASH_BOOK_OF_RECEIPTS"
            },
            { jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].isAccountRegister" }
          ),
          accountRegisterRemark: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "NULM_SUH_REMARKS"
            },
            { jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].accountRegisterRemark" }
          ),
          isAttendanceRegisterOfStaff: getLabelWithValue(
            {
              labelName: "Attendance register of staff",
              labelKey: "NULM_SUH_ATTENDANCE_REGISTER_OF_STAFF"
            },
            { jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].isAttendanceRegisterOfStaff" }
          ),
          attendanceRegisterOfStaffRemark: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "NULM_SUH_REMARKS"
            },
            { jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].attendanceRegisterOfStaffRemark" }
          ),
          isShelterManagementCommitteeRegister: getLabelWithValue(
            {
              labelName: "Shelter management committee register",
              labelKey: "NULM_SUH_SHELTER_MANAGEMENT_COMMITTEE_REGISTER"
            },
            { jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].isShelterManagementCommitteeRegister" }
          ),
          shelterManagementCommitteeRegisteRemark: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "NULM_SUH_REMARKS"
            },
            { jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].shelterManagementCommitteeRegisteRemark" }
          ),
          isPersonnelAndSalaryRegister: getLabelWithValue(
            {
              labelName: "Personnel register and salary register",
              labelKey: "NULM_SUH_PERSONNEL_REGISTER_AND_SALARY_REGISTER"
            },
            { jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].isPersonnelAndSalaryRegister" }
          ),
          personnelAndSalaryRegisterRemark: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "NULM_SUH_REMARKS"
            },
            { jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].personnelAndSalaryRegisterRemark" }
          ),
          isHousekeepingAndMaintenanceRegister: getLabelWithValue(
            {
              labelName: "Housekeeping and maintenance register",
              labelKey: "NULM_SUH_HOUSEKEEPING_AND_MAINTENANCE_REGISTER"
            },
            { jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].isHousekeepingAndMaintenanceRegister" }
          ),
          housekeepingAndMaintenanceRegisterRemark: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "NULM_SUH_REMARKS"
            },
            { jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].housekeepingAndMaintenanceRegisterRemark" }
          ),
          isComplaintAndSuggestionRegister: getLabelWithValue(
            {
              labelName: "Complaint and suggestion register",
              labelKey: "NULM_SUH_COMPLAINT_AND_SUGGESTION_REGISTER"
            },
            { jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].isComplaintAndSuggestionRegister" }
          ),
          complaintAndSuggestionRegisterRemark: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "NULM_SUH_REMARKS"
            },
            { jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].complaintAndSuggestionRegisterRemark" }
          ),
          isVisitorRegister: getLabelWithValue(
            {
              labelName: "Visitor register",
              labelKey: "NULM_SUH_VISITOR_REGISTER"
            },
            { jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].isVisitorRegister" }
          ),
          visitorRegisterRemark: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "NULM_SUH_REMARKS"
            },
            { jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].visitorRegisterRemark" }
          ),
          isProfileRegister: getLabelWithValue(
            {
              labelName: "Profile register",
              labelKey: "NULM_SUH_PROFILE_REGISTER"
            },
            { jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].isProfileRegister" }
          ),
          profileRegisterRemark: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "NULM_SUH_REMARKS"
            },
            { jsonPath: "NulmSuhRequest.suhRecordMaintenance[0].profileRegisterRemark" }
          ),      
  
      }),
    });
  };
  
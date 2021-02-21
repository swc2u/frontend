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
     const createUrl = `/egov-nulm/create-suh?step=4`;
    dispatch(setRoute(createUrl));
  };
  
  export const getOtherDetailsView = (isReview = true) => {
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
              labelName: "Other Details",
              labelKey: "NULM_SUH_OTHER_DETAILS"
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
        isConstitutionOfShelterManagementCommittee: getLabelWithValue(
          {
            labelName: "Constitution of shelter management committee",
            labelKey: "NULM_SUH_CONSTITUTION_OF_SHELTER_MANAGEMENT_COMMITTEE"
          },
          { jsonPath: "NulmSuhRequest.isConstitutionOfShelterManagementCommittee" }
        ),
        constitutionOfShelterManagementCommitteeRemark: getLabelWithValue(
          {
            labelName: "Remarks",
            labelKey: "NULM_SUH_REMARKS"
          },
          { jsonPath: "NulmSuhRequest.constitutionOfShelterManagementCommitteeRemark" }
        ),
        isSocialAudit: getLabelWithValue(
            {
              labelName: "Social audit of shelter",
              labelKey: "NULM_SUH_SOCIAL_AUDIT_OF_SHELTER"
            },
            { jsonPath: "NulmSuhRequest.isSocialAudit" }
          ),
          socialAuditRemark: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "NULM_SUH_REMARKS"
            },
            { jsonPath: "NulmSuhRequest.socialAuditRemark" }
          ),
          isLinkageToCentralGovtWelfareSchemes: getLabelWithValue(
            {
              labelName: "Linkage to central govt. Welfare schemes eg. Day nulm",
              labelKey: "NULM_SUH_LINKAGE_TO_CENTRAL_GOVT_WELFARE_SCHEMES_EG_DAY_NULM"
            },
            { jsonPath: "NulmSuhRequest.isLinkageToCentralGovtWelfareSchemes" }
          ),
          linkageToCentralGovtWelfareSchemesRemark: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "NULM_SUH_REMARKS"
            },
            { jsonPath: "NulmSuhRequest.linkageToCentralGovtWelfareSchemesRemark" }
          ),
          isLinkageToPublicHealthInitiatives: getLabelWithValue(
            {
              labelName: "Linkage to public health initiatives",
              labelKey: "NULM_SUH_LINKAGE_TO_PUBLIC_HEALTH_INITIATIVES"
            },
            { jsonPath: "NulmSuhRequest.isLinkageToPublicHealthInitiatives" }
          ),
          linkageToPublicHealthInitiativesRemark: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "NULM_SUH_REMARKS"
            },
            { jsonPath: "NulmSuhRequest.linkageToPublicHealthInitiativesRemark" }
          ),
          isLinkageToOtherGovtSchemes: getLabelWithValue(
            {
              labelName: "Linkage to other govt. Schemes on education, swachhata abhiyan etc.",
              labelKey: "NULM_SUH_LINKAGE_TO_OTHER_GOVT_SCHEMES"
            },
            { jsonPath: "NulmSuhRequest.isLinkageToOtherGovtSchemes" }
          ),
          linkageToOtherGovtSchemesRemark: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "NULM_SUH_REMARKS"
            },
            { jsonPath: "NulmSuhRequest.linkageToOtherGovtSchemesRemark" }
          ),
          isLinkageToLocalCommunity: getLabelWithValue(
            {
              labelName: "Linkage to local community ",
              labelKey: "NULM_SUH_LINKAGE_TO_LOCAL_COMMUNITY "
            },
            { jsonPath: "NulmSuhRequest.isLinkageToLocalCommunity" }
          ),
          linkageToLocalCommunityRemark: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "NULM_SUH_REMARKS"
            },
            { jsonPath: "NulmSuhRequest.linkageToLocalCommunityRemark" }
          ),
          isLinkageToSocialWorkersAndPhilanthropists: getLabelWithValue(
            {
              labelName: "Linkage to social workers and philanthropists",
              labelKey: "NULM_SUH_LINKAGE_TO_SOCIAL_WORKERS_AND_PHILANTHROPISTS "
            },
            { jsonPath: "NulmSuhRequest.isLinkageToSocialWorkersAndPhilanthropists" }
          ),
          linkageToSocialWorkersAndPhilanthropistsRemark: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "NULM_SUH_REMARKS"
            },
            { jsonPath: "NulmSuhRequest.linkageToSocialWorkersAndPhilanthropistsRemark" }
          ),
          isUserCharges: getLabelWithValue(
            {
              labelName: "User charges",
              labelKey: "NULM_SUH_USER_CHARGES"
            },
            { jsonPath: "NulmSuhRequest.isUserCharges" }
          ),
          userChargesRemark: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "NULM_SUH_REMARKS"
            },
            { jsonPath: "NulmSuhRequest.userChargesRemark" }
          ),
          isIECAndPromotionalInitiatives: getLabelWithValue(
            {
              labelName: "IEC and promotional initiatives",
              labelKey: "NULM_SUH_IEC_AND_PROMOTIONAL_INITIATIVES"
            },
            { jsonPath: "NulmSuhRequest.isIECAndPromotionalInitiatives" }
          ),
          iecAndPromotionalInitiativesRemark: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "NULM_SUH_REMARKS"
            },
            { jsonPath: "NulmSuhRequest.iecAndPromotionalInitiativesRemark" }
          ),
          isQuarterlyReporting: getLabelWithValue(
            {
              labelName: "Quarterly reporting",
              labelKey: "NULM_SUH_QUARTERLY_REPORTING"
            },
            { jsonPath: "NulmSuhRequest.isQuarterlyReporting" }
          ),
          quarterlyReportingRemark: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "NULM_SUH_REMARKS"
            },
            { jsonPath: "NulmSuhRequest.quarterlyReportingRemark" }
          ),
          isVisits: getLabelWithValue(
            {
              labelName: "Visits by local ward legislative members/administrative officers",
              labelKey: "NULM_SUH_VISITS_BY_LOCAL_WARD_LEGISLATIVE_MEMBERS_ADMINISTRATIVE_OFFICERS"
            },
            { jsonPath: "NulmSuhRequest.isVisits" }
          ),
          visitsRemark: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "NULM_SUH_REMARKS"
            },
            { jsonPath: "NulmSuhRequest.visitsRemark" }
          ),
        
      }),
    });
  };
  
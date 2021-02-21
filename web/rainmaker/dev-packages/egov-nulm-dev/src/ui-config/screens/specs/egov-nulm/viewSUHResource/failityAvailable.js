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
     const createUrl = `/egov-nulm/create-suh?step=1`;
    dispatch(setRoute(createUrl));
  };
  
  export const getFacilityDetailsView = (isReview = true) => {
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
              labelName: "Facilities Available",
              labelKey: "NULM_SUH_FACILITIES_AVAILABLE"
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
        isBedding: getLabelWithValue(
          {
            labelName: "Bedding",
            labelKey: "NULM_SUH_BEDDING"
          },
          { jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isBedding" }
        ),
        beddingRemark: getLabelWithValue(
          {
            labelName: "Remarks",
            labelKey: "NULM_SUH_REMARKS"
          },
          { jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].beddingRemark" }
        ),
        isWashingOfLinen: getLabelWithValue(
            {
              labelName: "Washing of linen",
              labelKey: "NULM_SUH_WASHING_OF_LINEN"
            },
            { jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isWashingOfLinen" }
          ),
          washingOfLinenRemark: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "NULM_SUH_REMARKS"
            },
            { jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].washingOfLinenRemark" }
          ),
          isCleaningOfPremises: getLabelWithValue(
            {
              labelName: "Cleaning of premises on regular basis",
              labelKey: "NULM_SUH_CLEANING_OF_PREMISES_ON_REGULAR_BASIS"
            },
            { jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isCleaningOfPremises" }
          ),
          cleaningOfPremiseRemark: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "NULM_SUH_REMARKS"
            },
            { jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].cleaningOfPremiseRemark" }
          ),
          isRecreationfacilities: getLabelWithValue(
            {
              labelName: "Recreation facilities (television, indoor sports, newspapers, books)",
              labelKey: "NULM_SUH_RECREATION_FACILITIES"
            },
            { jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isRecreationfacilities" }
          ),
          recreationfacilitiesRemark: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "NULM_SUH_REMARKS"
            },
            { jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].recreationfacilitiesRemark" }
          ),
          isDrinkingWater: getLabelWithValue(
            {
              labelName: "Drinking water fridge/camphor/dispenser",
              labelKey: "NULM_SUH_DRINKING_WATER"
            },
            { jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isDrinkingWater" }
          ),
          drinkingWaterRemark: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "NULM_SUH_REMARKS"
            },
            { jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].drinkingWaterRemark" }
          ),
          isMeals: getLabelWithValue(
            {
              labelName: "Meals",
              labelKey: "NULM_SUH_MEALS"
            },
            { jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isMeals" }
          ),
          mealsRemark: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "NULM_SUH_REMARKS"
            },
            { jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].mealsRemark" }
          ),
          isLockerForInmates: getLabelWithValue(
            {
              labelName: "Locker for inmates",
              labelKey: "NULM_SUH_LOCKER_FOR_INMATES"
            },
            { jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isLockerForInmates" }
          ),
          lockerForInmatetRemark: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "NULM_SUH_REMARKS"
            },
            { jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].lockerForInmatetRemark" }
          ),
          isFireSafetyMeasure: getLabelWithValue(
            {
              labelName: "Fire safety measure",
              labelKey: "NULM_SUH_FIRE_SAFETY_MEASURE"
            },
            { jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isFireSafetyMeasure" }
          ),
          fireSafetyMeasureRemark: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "NULM_SUH_REMARKS"
            },
            { jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].fireSafetyMeasureRemark" }
          ),
          isOfficeSetUp: getLabelWithValue(
            {
              labelName: "Office set up",
              labelKey: "NULM_SUH_OFFICE_SET_UP"
            },
            { jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isOfficeSetUp" }
          ),
          officeSetUpRemark: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "NULM_SUH_REMARKS"
            },
            { jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].officeSetUpRemark" }
          ),
          isFirstAidKitAndTrainingToStaff: getLabelWithValue(
            {
              labelName: "First aid kit & training to staff",
              labelKey: "NULM_SUH_FIRST_AID_KIT_TRAINING_TO_STAFF "
            },
            { jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isFirstAidKitAndTrainingToStaff" }
          ),
          firstAidKitAndTrainingToStaffRemark: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "NULM_SUH_REMARKS"
            },
            { jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].firstAidKitAndTrainingToStaffRemark" }
          ),
          isDisplayOfEmergencyNumbers: getLabelWithValue(
            {
              labelName: "Display of emergency numbers",
              labelKey: "NULM_SUH_DISPLAY_OF_EMERGENCY_NUMBERS"
            },
            { jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isDisplayOfEmergencyNumbers" }
          ),
          displayOfEmergencyNumbersRemark: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "NULM_SUH_REMARKS"
            },
            { jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].displayOfEmergencyNumbersRemark" }
          ),
          isToilet: getLabelWithValue(
            {
              labelName: "Toilet",
              labelKey: "NULM_SUH_TOILET"
            },
            { jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].isToilet" }
          ),
          toiletRemark: getLabelWithValue(
            {
              labelName: "Remarks",
              labelKey: "NULM_SUH_REMARKS"
            },
            { jsonPath: "NulmSuhRequest.suhFacilitiesDetails[0].toiletRemark" }
          ),
    
      }),
    });
  };
  
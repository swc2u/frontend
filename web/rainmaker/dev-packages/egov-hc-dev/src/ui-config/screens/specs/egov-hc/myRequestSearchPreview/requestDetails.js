import { getCommonContainer, getCommonGrayCard, getCommonSubHeader, getLabelWithValue } from "egov-ui-framework/ui-config/screens/specs/utils";

export const requestDetails = getCommonGrayCard({
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
          labelName: "SERVICE REQUEST DETAILS",
          labelKey: "HC_SERVICE_REQUEST_DETAILS_HEADER"
        })
      },
      // editSection: {
      //   componentPath: "Button",
      //   props: {
      //     color: "primary",
      //     style: {
      //       marginTop: "-10px",
      //       marginRight: "-18px"
      //     }
      //   },
      //   gridDefination: {
      //     xs: 4,
      //     align: "right"
      //   },
      //   children: {
      //     editIcon: {
      //       uiFramework: "custom-atoms",
      //       componentPath: "Icon",
      //       props: {
      //         iconName: "edit"
      //       }
      //     },
      //     buttonLabel: getLabel({
      //       labelName: "Edit",
      //       labelKey: "NOC_SUMMARY_EDIT"
      //     })
      //   },
      //   onClickDefination: {
      //     action: "condition",
      //     callBack: (state, dispatch) => {
      //       gotoApplyWithStep(state, dispatch, 0);
      //     }
      //   }
      // }
    }
  },
   scheama: getCommonGrayCard({
    body: getCommonContainer({
    typeOfServiceRequest: getLabelWithValue(
      {
        labelName: "Service Request Type",
        labelKey: "HC_SERVICE_REQUEST_TYPE"
      },
      {

        jsonPath: "myRequestDetails.service_type",
        
      }
    ),
    noOfTrees: getLabelWithValue(
      {
        labelName: "Number of Trees for Pruning Removal",
        labelKey: "HC_NUMBER_OF_TREES_FOR_CUTTING_PRUNING_REMOVAL_LABEL"
      },
      {
        // optionLabel: "name",
        // placeholder: {
        //   labelName: "Select Age",
        //   labelKey: "DOG_AGE_LABEL"
        // },
        // sourceJsonPath: "applyScreenMdmsData.egpm.age",
        jsonPath: "myRequestDetails.tree_count",
        required: true,
      }
    ),
    description: getLabelWithValue(
      {
        labelName: "Service Request Additional Details",
        labelKey: "HC_SERVICE_REQUEST_ADDITIONAL_DETAILS_LABEL"
      },
      {
        // optionLabel: "name",
        // placeholder: {
        //   labelName: "Select Sex",
        //   labelKey: "DOG_SEX_LABEL"
        // },
        // sourceJsonPath: "applyScreenMdmsData.egpm.sex",
        jsonPath: "myRequestDetails.description",
        required: true
      }
    ),
    serviceRequestDate: getLabelWithValue(
      {
        labelName: "Service Request Date",
        labelKey:  "HC_SERVICE_REQUEST_DATE_LABEL"
      },
      {
        // optionLabel: "name",
        // placeholder: {
        //   labelName: "Select Breed",
        //   labelKey: "DOG_BREED_LABEL"
        // },
        // sourceJsonPath: "applyScreenMdmsData.egpm.breed",
        //sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
        jsonPath: "myRequestDetails.createdtimes",
        required: true
      }
    ),
    location: getLabelWithValue(
      {
        labelName: "Location",
        labelKey: "HC_LOCATION_LABEL"
      },
      {
        // optionLabel: "name",
        //   placeholder: {
        //     labelName: "Select COLOR",
        //     labelKey: "DOG_COLOR_LABEL"
        //   },
        //   sourceJsonPath: "applyScreenMdmsData.egpm.color",
        // sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
        jsonPath: "myRequestDetails.location",
        required: true
      }
    ),
    locality: getLabelWithValue(
      {
        labelName: "Locality/ Mohalla",
        labelKey: "HC_LOCALITY_MOHALLA_LABEL"
      },
      {
        // placeholder: {
        //   labelName: "Identification Mark",
        //   labelKey: "IDENTIFICATION_MARK_LABEL"
        // },
        // pattern: getPattern("Name"),
        // errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "myRequestDetails.locality",
      }
    ),
    houseNumber: getLabelWithValue(
      {
        labelName: "House Number",
        labelKey: "HC_HOUSE_NO_STREET_NAME_LABEL"
      },
      {
        // placeholder: {
        //   labelName: "Identification Mark",
        //   labelKey: "IDENTIFICATION_MARK_LABEL"
        // },
        // pattern: getPattern("Name"),
        // errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "myRequestDetails.street_name"
      }
    ),
    landmark: getLabelWithValue(
      {
        labelName: "Landmark",
        labelKey: "HC_LANDMARK_LABEL"
      },
      {
        // placeholder: {
        //   labelName: "Identification Mark",
        //   labelKey: "IDENTIFICATION_MARK_LABEL"
        // },
        // pattern: getPattern("Name"),
        // errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "myRequestDetails.landmark"
      }
    )
  })
  })
  
});

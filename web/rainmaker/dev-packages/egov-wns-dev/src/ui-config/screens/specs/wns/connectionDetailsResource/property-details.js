import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";

import { changeStep } from "../viewBillResource/footer";
import { convertEpochToDateAndHandleNA, handlePropertySubUsageType, handleNA } from '../../utils';

const getHeader = label => {
  return {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-wns",
    componentPath: "DividerWithLabel",
    props: {
      className: "hr-generic-divider-label",
      labelProps: {},
      dividerProps: {},
      label
    },
    type: "array"
  };
};

const properyDetailsHeader = getHeader({
  labelKey: "WS_COMMON_PROP_DETAIL_HEADER"
});
const propertyLocationDetailsHeader = getHeader({
  labelKey: "WS_COMMON_PROP_LOC_DETAIL_HEADER"
});

const propertyDetails = getCommonContainer({
  // propertyType: getLabelWithValue(
  //   {
  //     labelKey: "WS_PROPERTY_TYPE_LABEL"
  //   },
  //   {
  //     jsonPath:
  //     "WaterConnection[0].property.propertyType",
  //     localePrefix: {
  //       moduleName: "WS",
  //       masterName: "PROPTYPE"
  //     }
  //   }
  // ),
  propertyUsageType: getLabelWithValue(
    {
      labelKey: "WS_PROPERTY_USAGE_TYPE_LABEL"
    },
    { jsonPath: "WaterConnection[0].property.usageCategory",
    callBack: handleNA,
    localePrefix: {
      moduleName: "WS",
      masterName: "PROPUSGTYPE"
    } 
 }
  ),
  propertysubUsageType: getLabelWithValue(
    {
      labelKey: "WS_PROPERTY_SUB_USAGE_TYPE_LABEL"
    },
    { jsonPath: "WaterConnection[0].property.subusageCategory",
    callBack: handleNA,
    localePrefix: {
      moduleName: "WS",
      masterName: "PROPSUBUSGTYPE"
    }
 }
  ),
  plotSize: getLabelWithValue(
    {
      labelKey: "WS_PROP_DETAIL_PLOT_SIZE_LABEL"
    },
    {
      jsonPath: "WaterConnection[0].property.landArea"
    }
  ),

  reviewCoveredArea: getLabelWithValue(
    {
      labelName: "Covered Area",
      labelKey: "WS_PROP_DETAIL_BUILD_UP_AREA_LABEL_INPUT"
    },
    { jsonPath: "WaterConnection[0].property.superBuiltUpArea",
    callBack: handleNA }
  ),
  reviewNumberOfFloors: getLabelWithValue(
    {
      labelName: "Number Of Floors",
      labelKey: "WS_PROPERTY_NO_OF_FLOOR_LABEL"
    },
    { jsonPath: "WaterConnection[0].property.noOfFloors",
    callBack: handleNA,
    localePrefix: {
      moduleName: "WS",
      masterName: "FLOOR"
    }
   }
  ),
})

// const locationOnMap = WaterConnection[0].property.address.locality.code + WaterConnection[0].property.address.locality.code
// const getPropertyConnectionOtherDetails = {
//   uiFramework: "custom-containers",
//   componentPath: "MultiItem",
//   props: {
//     className: "common-div-css search-preview",
//     scheama: getCommonGrayCard({
//       div2: propertyConnectionDetailsHeader,
//       getPropertyDetailsContainerdet: getCommonContainer(propertyConnectionDetails)
//      // getPropertyDetailsContainerdet: renderService()
//     }),
//     items: [],
//     hasAddItem: false,
//     isReviewPage: true,
//     sourceJsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits",
//     prefixSourceJsonPath:
//       "children.cardContent.children.getPropertyDetailsContainer.children",
//     afterPrefixJsonPath: "children.value.children.key"
//   },
//   type: "array"
// };
export const propertyConnectionDetailsHeader = getHeader({
  labelKey: "WS_COMMON_CONNECTION_DETAILS"
});
 const propertyConnectionDetailsCon= getCommonContainer({

  // reviewpipeSizeCon: getLabelWithValue(
  //   {
  //     labelName: "proposed Pipe Size",
  //     labelKey: "WS_CONN_DETAIL_PIPE_SIZE"
  //   },
  //   {
  //     jsonPath: "WaterConnection[0].proposedPipeSize",
  //     callBack: handleNA,
              
  //   }
  // ),

  reviewwaterApplicationTypeCon: getLabelWithValue(
    {
      labelName: "water Application Type",
      labelKey: "WATER_APPLICATION_TYPE"
    },
    { jsonPath: "WaterConnection[0].waterApplicationType",
      callBack: handleNA,
      localePrefix: {
        moduleName: "WS",
        masterName: "WATER_APPLICATION"
      }
    }
  ),
 })
  



const propertyLocationDetails = getCommonContainer({
  // propertyId: getLabelWithValue(
  //   {
  //     labelKey: "WS_PROPERTY_ID_LABEL"
  //   },
  //   { jsonPath: "WaterConnection[0].property.propertyId" }
  // ),
  city: getLabelWithValue(
    {
      labelKey: "WS_PROP_DETAIL_CITY"
    },
    {
      jsonPath: "WaterConnection[0].property.address.city",
    }
  ),
  plotOrHouseOrSurveyNo: getLabelWithValue(
    {
      labelKey: "WS_PROP_DETAIL_PH_SURVEYNO_LABEL"
    },
    {
      jsonPath: "WaterConnection[0].property.address.doorNo",
    }
  ),
  buildingOrColonyName: getLabelWithValue(
    {
      labelKey: "WS_PROP_DETAIL_BUILD_NAME_LABEL"
    },
    {
      jsonPath: "WaterConnection[0].property.address.buildingName"
    }
  ),
  // streetName: getLabelWithValue(
  //   {
  //     labelKey: "WS_PROP_DETAIL_STREET_NAME"
  //   },
  //   {
  //     jsonPath: "WaterConnection[0].property.address.street"
  //   }
  // ),
  locality: getLabelWithValue(
    {
      labelKey: "WS_PROP_DETAIL_LOCALITY_LABEL"
    },
    {
      jsonPath: "WaterConnection[0].property.address.locality.name",
    }
  ),
  // pincode: getLabelWithValue(
  //   {
  //     labelKey: "WS_PROP_DETAIL_PINCODE"
  //   },
  //   { jsonPath: "WaterConnection[0].property.address.pincode" }
  // ),
  // locationOnMap: getLabelWithValue(
  //   {
  //     labelKey: "WS_PROP_DETAIL_MAP_LOC"
  //   },
  //   {
  //     jsonPath: "WaterConnection[0].property.address.locality.locationOnMap"
  //   }
  // ),
})

export const getPropertyDetails = (isEditable = true) => {
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
            labelKey: "WS_COMMON_PROP_DETAIL_HEADER"
          })
        },
        editSection: {
          componentPath: "Button",
          props: {
            color: "primary"
          },
          visible: isEditable,
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
              labelKey: "TL_SUMMARY_EDIT"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              changeStep(state, dispatch, "", 1);
            }
          }
        }
      }
    },
    // viewOne: propertyDetails,
    // viewTwo: propertyLocationDetails

    viewOne: properyDetailsHeader,
    viewTwo: propertyDetails,
    viewConnectionH: propertyConnectionDetailsHeader,
    viewConnectionDetailsCon:propertyConnectionDetailsCon,
    viewThree: propertyLocationDetailsHeader,
    viewFour: propertyLocationDetails
  });
};



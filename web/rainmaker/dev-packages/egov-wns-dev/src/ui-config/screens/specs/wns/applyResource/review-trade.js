import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getConnectionDetails } from './../applyResource/task-connectiondetails';
import { propertyOwnerDetails } from "../applyResource/task-owner-details";
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

export const propertyDetailsHeader = getHeader({
  labelKey: "WS_COMMON_PROP_DETAIL"
});
export const propertyConnectionDetailsHeader = getHeader({
  labelKey: "WS_COMMON_CONNECTION_DETAILS"
});

export const propertyLocationDetailsHeader = getHeader({
  labelKey: "WS_COMMON_PROP_LOC_DETAIL_HEADER"
});
export const propertyUsageDetailsHeader = getHeader({
  labelKey: "WS_COMMON_PROPERTY_USAGE_HEADER"
});
export const propertyproposedUsageDetailsHeader = getHeader({
  labelKey: "WS_COMMON_PROPERTY_USAGE_HEADER_PROPOSED"
});
//getConnectionBillDetail
export const ConnectionBillDetailHeader = getHeader({
  labelKey: "WS_COMMON_CONNECTION_BILL_INFO_HEADER"
});
export const ConnectionBillDetailExceptionHeader = getHeader({
  labelKey: "WS_COMMON_CONNECTION_BILL_INFO_HEADER"
});

export const connectionDetailsHeader = getHeader({
  labelKey: "WS_COMMON_CONNECTION_DETAILS"
});

export const propertyOwnerDetailsHeader = getHeader({
  labelKey: "WS_TASK_PROP_OWN_HEADER"
});

export const getReviewConnectionDetails = (isEditable = true) => {
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
            labelName: "Connection Details",
            labelKey: "WS_COMMON_CONNECTION_DETAILS"
          })
        },
        editSection: {
          componentPath: "Button",
          props: { color: "primary" },
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
              props: { iconName: "edit" }
            },
            buttonLabel: getLabel({
              labelName: "Edit",
              labelKey: "WS_SUMMARY_EDIT"
            })
          },
          onClickDefination: {
            action: "condition",
            // callBack: (state, dispatch) => {
            //   changeStep(state, dispatch, "", 0);
            // }
          }
        }
      }
    },
    viewOne: getPropertyDetails,
    viewpropertyUsageDetail: getpropertyUsageDetail,
    viewpropertyproposedUsageDetail: getproposedpropertyUsageDetail,
    viewConnection: getPropertyConnectionOtherDetails,
  //  viewConnectionHeader: propertyConnectionDetailsHeader,
  //  viewConnection: renderService(),
    viewTwo: propertyLocationDetails,
    viewThree: ownerDetails,
    //viewFour: getConnectionDetails(),
    viewFive:taskConnHolderDetailsSummary(),
    viewproposedHolderInfo:taskConnHolderDetailsProposedSummary(),
    viewSix:connHolderDetailsSameAsOwnerSummary(),
    viewConnectionBillDetail:getConnectionBillDetail,
    viewConnectionBillDetailException:getConnectionBillDetailException,

  });
};

export const locationDetails={
  reviewCity: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "WS_PROP_DETAIL_CITY"
    },
    {
      jsonPath:
        "WaterConnection[0].property.address.city",
        callBack: handleNA
    }
  ),
  reviewDoorOrHouseNumber: getLabelWithValue(
    {
      labelName: "Door/House No.",
      labelKey: "WS_PROP_DETAIL_DHNO"
    },
    { jsonPath: "WaterConnection[0].property.address.doorNo",
    callBack: handleNA }
  ),
  reviewBuildingOrColonyName: getLabelWithValue(
    {
      labelName: "Building/Colony Name",
      labelKey: "WS_PROP_DETAIL_BUILD_NAME_LABEL"
    },
    { jsonPath: "WaterConnection[0].property.address.buildingName",
    callBack: handleNA }
  ),
  reviewplotNo: getLabelWithValue(
    {
      labelName: "House Name",
      labelKey: "WS_PROP_DETAIL_HOUSE_NAME_LABEL_INPUT"
    },
    { jsonPath: "WaterConnection[0].property.address.plotNo",
    callBack: handleNA }
  ),
  reviewStreetName: getLabelWithValue(
    {
      labelName: "Street Name",
      labelKey: "WS_PROP_DETAIL_STREET_NAME"
    },
    { jsonPath: "WaterConnection[0].property.address.street",
    callBack: handleNA }
  ),
  reviewLocalityOrMohalla: getLabelWithValue(
    {
      labelName: "Locality/Mohalla",
      labelKey: "WS_PROP_DETAIL_LOCALITY_MOHALLA_LABEL"
    },
    { jsonPath: "WaterConnection[0].property.address.locality.name",
    callBack: handleNA }
  ),
  reviewPincode: getLabelWithValue(
    {
      labelName: "Pincode",
      labelKey: "WS_PROP_DETAIL_PINCODE"
    },
    { jsonPath: "WaterConnection[0].property.address.pincode",
    callBack: handleNA }
  ),
}

const propertyLocationDetails = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    className: "common-div-css search-preview",
    scheama: getCommonGrayCard({
      div1: propertyLocationDetailsHeader,
      propertyLocationDetailsContainer: getCommonContainer(locationDetails)
    }),

    items: [],
    hasAddItem: false,
    isReviewPage: true,
    sourceJsonPath: "WaterConnection[0].property.address",
    prefixSourceJsonPath:
      "children.cardContent.children.propertyLocationDetailsContainer.children",
    afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
};

export const propertyDetails={
  // reviewPropertyId: getLabelWithValue(
  //   {
  //     labelName: "Property Id",
  //     labelKey: "WS_PROPERTY_ID_LABEL"
  //   },
  //   {
  //     jsonPath: "WaterConnection[0].property.propertyId",
  //     callBack: handleNA
  //   }
  // ),
  // reviewPropertyType: getLabelWithValue(
  //   {
  //     labelName: "Property Type",
  //     labelKey: "WS_PROPERTY_TYPE_LABEL"
  //   },
  //   {
  //     jsonPath: "WaterConnection[0].property.propertyType",
  //     callBack: handleNA,
  //     localePrefix: {
  //       moduleName: "WS",
  //       masterName: "PROPTYPE"
  //     }
      
  //   }
  // ),
  reviewPropertyUsageType: getLabelWithValue(
    {
      labelName: "Property Usage Type",
      labelKey: "WS_PROPERTY_USAGE_TYPE_LABEL"
    },
    {
      jsonPath: "WaterConnection[0].property.usageCategory",
      callBack: handleNA,
      localePrefix: {
        moduleName: "WS",
        masterName: "PROPUSGTYPE"
      }        
    }
  ),

  reviewPropertySubUsageType: getLabelWithValue(
    {
      labelName: "Property Sub usage type",
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
  reviewPlotSize: getLabelWithValue(
    {
      labelName: "Plot Size (in sq metres)",
      labelKey: "WS_PROP_DETAIL_PLOT_SIZE_LABEL"
    },
    { jsonPath: "WaterConnection[0].property.landArea",
    callBack: handleNA }
  ),
  reviewsuperBuiltUpArea: getLabelWithValue(
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
  // rainwaterHarvestingFacility: getLabelWithValue(
  //   {
  //     labelKey: "WS_SERV_DETAIL_CONN_RAIN_WATER_HARVESTING_FAC",
  //     labelName: "Rain Water Harvesting Facility"
  //   },
  //   { jsonPath: "WaterConnection[0].property.additionalDetails.isRainwaterHarvesting",
  //   callBack: handleNA }
  // )
}
//proposed
export const proposedpropertyUsesDetails={
 
  reviewpropertyproposedUsageCategory: getLabelWithValue(
    {
      labelName: "proposedUsageCategory",
      labelKey: "WS_PROPERTY_USAGE_TYPE_TARRIF_LABEL_INPUT_PROPOSED"
    },
    {
      jsonPath: "WaterConnection[0].proposedUsageCategory",
      callBack: handleNA,
      localePrefix: {
        moduleName: "WS",
        masterName: "TARRIF"
      } 
    }
  ),

}
export const ConnectionBillInfoDetails={
 
  BillInfoPaymentStatus: getLabelWithValue(
    {
      labelName: "Payment Status",
      labelKey: "WS_BILL_PAYMENT_STATUS_LABEL"
    },
    {
      jsonPath: "billGenerationdata.status",
      callBack: handleNA, 
    }
  ),
  BillInfoPaymentDueAmount: getLabelWithValue(
    {
      labelName: "Amount Due",
      labelKey: "WS_BILL_PAYMENT_DUE_AMOUNT_LABEL"
    },
    {
      jsonPath: "billGenerationdata.totalNetAmount",
      callBack: handleNA, 
    }
  ),
  BillInfoPaymentDueDate: getLabelWithValue(
    {
      labelName: "Due Date",
      labelKey: "WS_BILL_PAYMENT_DUE_DATE_LABEL"
    },
    {
      jsonPath: "billGenerationdata.dueDateCash",
      callBack: handleNA, 
    }
  ),

}
export const ConnectionBillInfoDetailsException={
 
  BillInfoPaymentStatus: getLabelWithValue(
    {
      labelName: "Payment Status",
      labelKey: "WS_BILL_PAYMENT_STATUS_LABEL"
    },
    {
      jsonPath: "billGenerationdata.status",
      callBack: handleNA, 
    }
  ),


}
export const propertyUsesDetails={
  reviewpropertyUsageType: getLabelWithValue(
    {
      labelName: "waterProperty",
      labelKey: "WS_PROPERTY_USAGE_TYPE_TARRIF_LABEL_INPUT"
    },
    {
      jsonPath: "WaterConnection[0].waterProperty.usageCategory",
      callBack: handleNA,
      localePrefix: {
        moduleName: "WS",
        masterName: "TARRIF"
      } 
    }
  ),


  reviewpropertySubUsageType: getLabelWithValue(
    {
      labelName: "usage Sub Category",
      labelKey: "WS_PROPERTY_SUB_USAGE_CAT_TYPE_LABEL_INPUT"
    },
    {
      jsonPath: "WaterConnection[0].waterProperty.usageSubCategory",
      callBack: handleNA,
      localePrefix: {
        moduleName: "WS",
        masterName: "SUBUSAGE"
      } 
              
    }
  ),
}
export const propertyConnectionDetails={
  // reviewnumberOfTaps: getLabelWithValue(
  //   {
  //     labelName: "proposed Taps",
  //     labelKey: "WS_CONN_DETAIL_NO_OF_TAPS"
  //   },
  //   {
  //     jsonPath: "WaterConnection[0].proposedTaps",
  //     callBack: handleNA
  //   }
  // ),

  reviewpipeSize: getLabelWithValue(
    {
      labelName: "proposed Pipe Size",
      labelKey: "WS_CONN_DETAIL_PIPE_SIZE"
    },
    {
      jsonPath: "WaterConnection[0].proposedPipeSize",
      callBack: handleNA,
              
    }
  ),

  reviewwaterApplicationType: getLabelWithValue(
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
  reviewcontractValue: getLabelWithValue(
    {
      labelName: "contract Value",
      labelKey: "WS_ADDN_DETAILS_CONTRACT_VALUE"
    },
    { jsonPath: "WaterConnection[0].contractValue",
    callBack: handleNA }
  ),
  reviewferruleSize: getLabelWithValue(
    {
      labelName: "Ferrule Size",
      labelKey: "WS_ADDN_DETAILS_FERRULE_INPUT"
    },
    { jsonPath: "WaterConnection[0].ferruleSize",
    callBack: handleNA }
  ),


}
const getpropertyUsageDetail ={
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    className: "common-div-css search-preview",
    scheama: getCommonGrayCard({
      div2: propertyUsageDetailsHeader,
      getpropertyUsageDetailsHeaderContainer: getCommonContainer(propertyUsesDetails)
    }),
    items: [],
    hasAddItem: false,
    isReviewPage: true,
    sourceJsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits",
    prefixSourceJsonPath:
      "children.cardContent.children.getPropertyDetailsContainer.children",
    afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
};
const getproposedpropertyUsageDetail ={
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    className: "common-div-css search-preview",
    scheama: getCommonGrayCard({
      div2: propertyproposedUsageDetailsHeader,
      getproposedpropertyUsageDetailHeaderContainer: getCommonContainer(proposedpropertyUsesDetails)
    }),
    items: [],
    hasAddItem: false,
    isReviewPage: true,
    sourceJsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits",
    prefixSourceJsonPath:
      "children.cardContent.children.getPropertyDetailsContainer.children",
    afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
};
const getConnectionBillDetail ={
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    className: "common-div-css search-preview",
    scheama: getCommonGrayCard({
      div2: ConnectionBillDetailHeader,
      getConnectionBillDetailHeaderContainer: getCommonContainer(ConnectionBillInfoDetails)
    }),
    items: [],
    hasAddItem: false,
    isReviewPage: true,
    sourceJsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits",
    prefixSourceJsonPath:
      "children.cardContent.children.getPropertyDetailsContainer.children",
    afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
};
const getConnectionBillDetailException ={
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    className: "common-div-css search-preview",
    scheama: getCommonGrayCard({
      div2: ConnectionBillDetailExceptionHeader,
      getConnectionBillDetailExceptionHeaderContainer: getCommonContainer(ConnectionBillInfoDetailsException)
    }),
    items: [],
    hasAddItem: false,
    isReviewPage: true,
    sourceJsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits",
    prefixSourceJsonPath:
      "children.cardContent.children.getPropertyDetailsContainer.children",
    afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
};

const getPropertyDetails = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    className: "common-div-css search-preview",
    scheama: getCommonGrayCard({
      div2: propertyDetailsHeader,
      getPropertyDetailsContainer: getCommonContainer(propertyDetails)
    }),
    items: [],
    hasAddItem: false,
    isReviewPage: true,
    sourceJsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits",
    prefixSourceJsonPath:
      "children.cardContent.children.getPropertyDetailsContainer.children",
    afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
};
const getPropertyConnectionOtherDetails = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    className: "common-div-css search-preview",
    scheama: getCommonGrayCard({
      div2: propertyConnectionDetailsHeader,
      getPropertyDetailsContainerdet: getCommonContainer(propertyConnectionDetails)
     // getPropertyDetailsContainerdet: renderService()
    }),
    items: [],
    hasAddItem: false,
    isReviewPage: true,
    sourceJsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits",
    prefixSourceJsonPath:
      "children.cardContent.children.getPropertyDetailsContainer.children",
    afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
};

export const propertyOwnerDetail={
  mobileNumber: getLabelWithValue(
   {
     labelName: "Mobile Number",
       labelKey: "WS_OWN_DETAIL_MOBILE_NO_LABEL"
   },
   { jsonPath: "WaterConnection[0].property.owners[0].mobileNumber",
   callBack: handleNA }
),
 name: getLabelWithValue(
   {
     labelName: "Name",
     labelKey: "WS_OWN_DETAIL_OWN_NAME_LABEL"
   },
   {
     jsonPath: "WaterConnection[0].property.owners[0].name",
     callBack: handleNA
   }
 ),
 email: getLabelWithValue(
   {
     labelKey: "WS_OWN_DETAIL_OWN_EMAIL_LABEL"
   },
   {
     jsonPath: "WaterConnection[0].property.owners[0].emailId",
     callBack: handleNA
   }
 ),
//  gender: getLabelWithValue(
//    {
//      labelKey: "WS_OWN_DETAIL_GENDER_LABEL"
//    },
//    {
//      jsonPath: "WaterConnection[0].property.owners[0].gender",
//      callBack: handleNA,
//      localePrefix: {
//        moduleName: "COMMON",
//        masterName: "GENDER"
//      }
//    }
//  ),
//  dateOfBirth: getLabelWithValue(
//    {
//      labelName: "Date Of Birth",
//      labelKey: "WS_OWN_DETAIL_DOB_LABEL"
//    },
//    {
//      jsonPath: "WaterConnection[0].property.owners[0].dob",
//      callBack: convertEpochToDateAndHandleNA
//    }
//  ),
 fatherName: getLabelWithValue(
   {
     labelKey: "WS_OWN_DETAIL_FATHER_OR_HUSBAND_NAME"
   },
   { jsonPath: "WaterConnection[0].property.owners[0].fatherOrHusbandName",
   callBack: handleNA }
 ),
//  relationship: getLabelWithValue(
//    {
//      labelKey: "WS_OWN_DETAIL_RELATION_LABEL"
//    },
//    { jsonPath: "WaterConnection[0].property.owners[0].relationship",
//    callBack: handleNA }
//  ),
 correspondenceAddress: getLabelWithValue(
   {
     labelKey: "WS_OWN_DETAIL_CROSADD"
   },
   { jsonPath: "WaterConnection[0].property.owners[0].correspondenceAddress",
   callBack: handleNA }
 ), 
//  aadharCardnumber: getLabelWithValue(
//   {
//     labelKey: "WS_OWN_DETAIL_ADDHAR_NO"
//   },
//   { jsonPath: "WaterConnection[0].aadharNo",
//   callBack: handleNA }
// ),
//  specialApplicantCategory: getLabelWithValue(
//    {
//      labelKey: "WS_OWN_DETAIL_SPECIAL_APPLICANT_LABEL"
//    },
//    {
//      jsonPath: "WaterConnection[0].property.owners[0].ownerType",
//      callBack: handleNA
//    })
}

export const renderService = () => {
  if (service === "WATER") {
    //return getCommonContainer({ reviewConnectionType, reviewNumberOfTaps, reviewWaterSource, reviewWaterSubSource, reviewPipeSize ,reviewccCode, reviewdivision, reviewsubdiv,reviewledgerNo, reviewledgerGroup});
    return getCommonContainer({ reviewnumberOfTaps, 
              reviewsubdiv, 
              reviewBillGroup,              
              reviewPipeSize});
  } else if (service === "SEWERAGE") {
    return getCommonContainer({ reviewConnectionType, reviewWaterClosets })
  }
  // else{
  //   return getCommonContainer({ reviewConnectionType, reviewNumberOfTaps, reviewWaterSource, reviewWaterSubSource, reviewPipeSize });
  // }
}

const ownerDetails = {
      uiFramework: "custom-containers",
      componentPath: "MultiItem",
      props: {
        className: "common-div-css search-preview",
        scheama: getCommonGrayCard({
          div3: propertyOwnerDetailsHeader,
          propertyLocationDetailsContainer: getCommonContainer(propertyOwnerDetail)
        }),

        items: [],
        hasAddItem: false,
        isReviewPage: true,
        sourceJsonPath: "WaterConnection[0].property.owners",
        prefixSourceJsonPath:
          "children.cardContent.children.propertyLocationDetailsContainer.children",
        afterPrefixJsonPath: "children.value.children.key"
      },
      type: "array"
}
const holderHeader = getHeader({
  labelKey: "WS_COMMON_CONNECTION_HOLDER_DETAILS_HEADER",
  labelName: "Connection Holder Details"
})
const proposedholderHeader = getHeader({
  labelKey: "WS_COMMON_CONNECTION_HOLDER_DETAILS_HEADER_PROPOSED",
  labelName: "proposed Connection Holder Details"
})

export const connectionHolderDetails={
  mobileNumber : getLabelWithValue(
     {
       labelKey: "WS_CONN_HOLDER_OWN_DETAIL_MOBILE_NO_LABEL"
     },
     { jsonPath: "WaterConnection[0].connectionHolders[0].mobileNumber", callBack: handleNA }
   ),
    name : getLabelWithValue(
     {
       labelName: "Name",
       labelKey: "WS_CONN_HOLDER_OWN_DETAIL_OWN_NAME_LABEL"
     },
     { jsonPath: "WaterConnection[0].connectionHolders[0].name", callBack: handleNA }
   ),
  //   gender : getLabelWithValue(
  //    {
  //      labelKey: "WS_CONN_HOLDER_OWN_DETAIL_GENDER_LABEL"
  //    },
  //    {
  //      jsonPath: "WaterConnection[0].connectionHolders[0].gender",
  //      callBack: handleNA
  //    }
  //  ),
  //   fatherName : getLabelWithValue(
  //    {
  //      labelKey: "WS_CONN_HOLDER_COMMON_FATHER_OR_HUSBAND_NAME"
  //    },
  //    { jsonPath: "WaterConnection[0].connectionHolders[0].fatherOrHusbandName", callBack: handleNA }
  //  ),
  //   relationship : getLabelWithValue(
  //    {
  //      labelKey: "WS_CONN_HOLDER_OWN_DETAIL_RELATION_LABEL"
  //    },
  //    { jsonPath: "WaterConnection[0].connectionHolders[0].relationship", callBack: handleNA }
  //  ),
    correspondenceAddress :getLabelWithValue(
     {
       labelKey: "WS_CONN_HOLDER_OWN_DETAIL_CROSADD"
     },
     {
       jsonPath: "WaterConnection[0].connectionHolders[0].correspondenceAddress",
       callBack: handleNA
     }
   ),
   aadhaarNumber : getLabelWithValue(
    {
      labelName: "aadhaarNumber",
      labelKey: "WS_OWN_DETAIL_ADDHAR_NO"
    },
    { jsonPath: "WaterConnection[0].connectionHolders[0].aadhaarNumber", callBack: handleNA }
  ),
    holderStatus : getLabelWithValue(
     {
       labelKey: "STATUS"
     },
     {
       jsonPath: "WaterConnection[0].connectionHolders[0].status",
       callBack: handleNA
     }
   )
 };
 export const proposedconnectionHolderDetails={
  proposedMobileNo : getLabelWithValue(
     {
       labelKey: "WS_CONN_HOLDER_OWN_DETAIL_MOBILE_NO_LABEL"
     },
     { jsonPath: "WaterConnection[0].connectionHolders[0].proposedMobileNo", callBack: handleNA }
   ),
   proposedName : getLabelWithValue(
     {
       labelName: "Name",
       labelKey: "WS_CONN_HOLDER_OWN_DETAIL_OWN_NAME_LABEL"
     },
     { jsonPath: "WaterConnection[0].connectionHolders[0].proposedName", callBack: handleNA }
   ),
  //  fatherName : getLabelWithValue(
  //   {
  //     labelKey: "WS_CONN_HOLDER_COMMON_FATHER_OR_HUSBAND_NAME"
  //   },
  //   { jsonPath: "WaterConnection[0].connectionHolders[0].proposedGuardianName", callBack: handleNA }
  // ),
  //   gender : getLabelWithValue(
  //    {
  //      labelKey: "WS_CONN_HOLDER_OWN_DETAIL_GENDER_LABEL"
  //    },
  //    {
  //      jsonPath: "WaterConnection[0].connectionHolders[0].gender",
  //      callBack: handleNA
  //    }
  //  ),
    
  //   relationship : getLabelWithValue(
  //    {
  //      labelKey: "WS_CONN_HOLDER_OWN_DETAIL_RELATION_LABEL"
  //    },
  //    { jsonPath: "WaterConnection[0].connectionHolders[0].relationship", callBack: handleNA }
  //  ),
  proposedCorrespondanceAddress :getLabelWithValue(
     {
       labelKey: "WS_CONN_HOLDER_OWN_DETAIL_CROSADD"
     },
     {
       jsonPath: "WaterConnection[0].connectionHolders[0].proposedCorrespondanceAddress",
       callBack: handleNA
     }
   ),
    // specialApplicantCategory : getLabelWithValue(
    //  {
    //    labelKey: "WS_CONN_HOLDER_OWN_DETAIL_SPECIAL_APPLICANT_LABEL"
    //  },
    //  {
    //    jsonPath: "WaterConnection[0].connectionHolders[0].ownerType",
    //    callBack: handleNA
    //  }
   //)
 };
const taskConnHolderDetailsSummary = () => {
  return ({
    uiFramework: "custom-containers",
    moduleName: "egov-wns",
    componentPath: "MultiItem",
    props: {
      className: "common-div-css search-preview",
      scheama: getCommonGrayCard({
        div4: holderHeader,
        connHoldDetail:getCommonContainer(connectionHolderDetails)
      }),
      items: [],
      hasAddItem: false,
      isReviewPage:true,
      sourceJsonPath: "WaterConnection[0].connectionHolders",
      prefixSourceJsonPath: "children.cardContent.children.connHoldDetail.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  })
}
const taskConnHolderDetailsProposedSummary = () => {
  return ({
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "common-div-css search-preview",
      scheama: getCommonGrayCard({
        div4: proposedholderHeader,
        connHoldDetail:getCommonContainer(proposedconnectionHolderDetails)
      }),
      items: [],
      hasAddItem: false,
      sourceJsonPath: "WaterConnection[0].connectionHolders",
      prefixSourceJsonPath: "children.cardContent.children.connHoldDetail.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  })
}


export const connectionHolderSameAsOwnerDetails={
 sameAsOwnerDetails : getLabelWithValue(
    {
      labelKey: "WS_CONN_HOLDER_SAME_AS_OWNER_DETAILS"
    },
    { jsonPath: "WaterConnection[0].connectionHolders[0].sameAsPropertyAddress" }
  )
} 

const connHolderDetailsSameAsOwnerSummary = () => {
  return ({
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "common-div-css search-preview",
      scheama: getCommonGrayCard({
        div4: holderHeader,
        sameAsOwnerDetails:getCommonContainer(connectionHolderSameAsOwnerDetails),
      }),
      items: [],
      hasAddItem: false,
      sourceJsonPath: "WaterConnection[0].connectionHolders[0].sameAsPropertyAddress",
      prefixSourceJsonPath: "children.cardContent.children.sameAsOwnerDetails.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  })
}

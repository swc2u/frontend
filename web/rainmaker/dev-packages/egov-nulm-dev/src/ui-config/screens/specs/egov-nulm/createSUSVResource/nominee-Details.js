import {
    getCommonCard,
    getCommonGrayCard,
    getCommonTitle,
    getTextField,
    getCommonContainer,
    getPattern
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import get from "lodash/get";
  import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  
  
  const NomineeDetailsCard = {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      scheama: getCommonGrayCard({
        NomineeDetailsCardContainer: getCommonContainer(
          {
            name: {
                ...getTextField({
                  label: {
                    labelName: "Name",
                    labelKey: "NULM_SUH_LOG_NAME",
                  },
                  placeholder: {
                    labelName: "Enter Name",
                    labelKey: "NULM_SUH_LOG_NAME_PLACEHOLDER",
                  },
                  required: true,
                  pattern: getPattern("Name") || null,
                  jsonPath: "NulmSusvRequest.susvApplicationFamilyDetails[0].name",       
                })
              },
              age: {
                ...getTextField({
                  label: {
                    labelName: "age",
                    labelKey: "NULM_SEP_AGE"
                  },
                  placeholder: {
                    labelName: "Enter age",
                    labelKey: "NULM_SEP_AGE_PLACEHOLDER"
                  },
                  required: true,
                  pattern: getPattern("age") || null,
                  jsonPath: "NulmSusvRequest.susvApplicationFamilyDetails[0].age"
                })
              },
              relation: {
                ...getTextField({
                  label: {
                    labelName: "Relation",
                    labelKey: "NULM_SUSV_RELATION"
                  },
                  placeholder: {
                    labelName: "Enter Relation",
                    labelKey: "NULM_SUSV_RELATION_PLACEHOLDER"
                  },
                  required: true,
                  pattern: getPattern("Name") || null,
                  jsonPath: "NulmSusvRequest.susvApplicationFamilyDetails[0].relation"
                })
              },
          },
          {
            style: {
              overflow: "visible"
            }
          }
        )
      }),
      items: [],
      addItemLabel: {
        labelName: "Add Nominee",
        labelKey: "NULM_SUSV_ADD_NOMINEE"
      },
      headerName: "Nominee",
      headerJsonPath:
        "children.cardContent.children.header.children.head.children.Accessories.props.label",
      sourceJsonPath: "NulmSusvRequest.susvApplicationFamilyDetails",
      prefixSourceJsonPath:
        "children.cardContent.children.NomineeDetailsCardContainer.children"
    },
    type: "array"
  };
  
  export const NomineeDetails = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Nominee Details",
        labelKey: "NULM_SUSV_NOMINEE_DETAILS"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    NomineeDetailsCard
  });
  
import {
    getCommonCard,
    getCommonTitle,
    getTextField,
    getDateField,
    getSelectField,
    getCommonContainer,
    getPattern
  } from "egov-ui-framework/ui-config/screens/specs/utils";

  
  export const UnderTaking = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "UnderTaking",
        labelKey: "NULM_SUSV_UNDERTAKING_HEADER"
  
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    UnderTakingContainer: getCommonContainer({
        isUndertaking: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-nulm",
            componentPath: "CheckboxContainer",
            jsonPath: "NulmSusvRequest.isUndertaking",
            gridDefination: {
              xs: 12,
            },
            isFieldValid: true,
            required: false,
  
            props: {
              content: "NULM_SUSV_UNDERTAKING_DECLARATION",
              jsonPath: "NulmSusvRequest.isUndertaking",
              screenName: "create-susv",
              checkBoxPath:
                "components.div.children.formwizardFirstStep.children.formDetail.children.cardContent.children.addStoreDetails.children.active",
            },
          },
        place: {
        ...getTextField({
          label: {
            labelName: "Place",
            labelKey: "NULM_SUSV_PLACE",
          },
          placeholder: {
            labelName: "Enter Place",
            labelKey: "NULM_SUSV_PLACE_PLACEHOLDER",
          },
          required: true,
          pattern: getPattern("Name") || null,
          jsonPath: "NulmSusvRequest.place",       
        })
      },
      date: {
        ...getDateField({
          label: {
            labelName: "Date",
            labelKey: "NULM_SUH_LOG_DATE"
          },
          placeholder: {
            labelName: "Date",
            labelKey: "NULM_SUH_LOG_DATE"
          },
          required: true,
          pattern: getPattern("Date") || null,
          jsonPath: "NulmSusvRequest.date",
          props: {
            inputProps: {
              min:  new Date().toISOString().slice(0, 10),
            }
          }
        })
      },     
    })
  });
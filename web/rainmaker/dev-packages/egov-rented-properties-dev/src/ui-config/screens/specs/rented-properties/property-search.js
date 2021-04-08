import {
    getCommonHeader,
    getLabel,
    getBreak,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
import { searchResults } from "./searchResource/searchResults";
import { rentedPropertyPropertySearch } from "./searchResource/rentedPropertyApplication";

  
  const header = getCommonHeader({
    labelName: "Search Property",
    labelKey: "RP_SEARCH_PROPERTY_HEADER"
  });
  

  
  const citizenRentedPropertiesSearchAndResult = {
    uiFramework: "material-ui",
    name: "property-search",
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Form",
        props: {
          className: "common-div-css",
          id: "search"
        },
        children: {
          headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
            children: {
              header: {
                gridDefination: {
                  xs: 12,
                  sm: 8
                },
                ...header
              },
            }
          },
         rentedPropertyPropertySearch,
          breakAfterSearch: getBreak(),
          searchResults
        }
      }
    }
};
  
  export default citizenRentedPropertiesSearchAndResult;
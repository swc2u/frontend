import { getCommonHeader, getCommonContainer, getLabel, getBreak,getTextField } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { adhocPopup } from "./popup/addpopup"
import "./index.css"
import { searchVendorResultApiResponse, searchVendorResultErrorResponse } from "./searchResource/searchResultApiResponse";
import { serachVendorResultGrid, serachVendorErrorResultGrid, FileUpload, SampleFileDownload } from "./searchResource/serachResultGrid"
import { setapplicationType, getTenantId } from "egov-ui-kit/utils/localStorageUtils/";
import { showHideAdhocPopup, getCommonApplyFooter, clearlocalstorageAppDetails, showHideAdhocPopupVendorError } from "../utils";
import { vendorChooseFile } from "./searchResource/vendorChooseFileUpload";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar, toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";

const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : true;

const header = getCommonHeader({
  labelName: "vendor",
  labelKey: "EC_VENDOR_HEADER"
});

const VENDORSearchAndResult = {
  uiFramework: "material-ui",
  name: "search",
  beforeInitScreen: (action, state, dispatch) => {
    clearlocalstorageAppDetails(state);
    setapplicationType('VENDOR-MASTER');
   // searchVendorResultApiResponse(action, state, dispatch);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "serachVendorResultGrid"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6
              },
              ...header
            },
          }
        },
        vendorChooseFile,

        // viewErrorButton,
        breakAfterSearch: getBreak(),
        //new input
        appDOESearchContainer: getCommonContainer({
          covNo: getTextField({
            label: {
              labelName: "COV Number",
              labelKey: "EC_VENDOR_COMMON_TABLE_COL_COV_NUMBER"
            },
            placeholder: {
              labelName: "COV Number",
              labelKey: "EC_VENDOR_COMMON_TABLE_COL_COV_NUMBER"
            },
            gridDefination: {
              xs: 12,
              sm: 4
            },
            required: false,
           // pattern: /^[a-zA-Z0-9-]*$/i,
            errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
            jsonPath: "searchScreen.covNo"
          }),

        }),
        
      
        button: getCommonContainer({
          buttonContainer: getCommonContainer({
            searchButton: {
              componentPath: "Button",
              gridDefination: {
                xs: 12,
                sm: 6
                // align: "center"
              },
              props: {
                variant: "contained",
                style: {
                  color: "white",
                  margin: "8px",
                  backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
                  borderRadius: "2px",
                  width: "220px",
                  height: "48px"
                }
              },
              children: {
                buttonLabel: getLabel({
                  labelName: "searchdoe",
                  labelKey: "SEARCH"
                })
              },
              onClickDefination: {
                action: "condition",
                //callBack: searchVendorResultApiResponse
                callBack: (state, dispatch) => {
                  searchVendorResultApiResponse(state,dispatch,'')
                }
              }
            }
          })
        }),
        //
        serachVendorResultGrid,
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-echallan",
      componentPath: "PopupContainer",
      props: {
        open: false,
        maxWidth: "xl",
        screenKey: "search"
      },
      children: { 
        // div1: {
        //   uiFramework: "custom-atoms",
        //   componentPath: "Div",
        //   gridDefination: {
        //     xs: 10,
        //     sm: 10
        //   },
        //   props: {
        //     style: {
        //       width: "100%",
        //       float: "right"
        //     }
        //   },
        //   children: {
        //     div: getCommonHeader(
        //       {
        //         labelName: "Error Details",
        //         labelKey: "EC_VENDOR_MASTER_ERROR_DETAILS"
        //       },
        //       {
        //         style: {
        //           fontSize: "20px",
        //           padding: "20px",
        //         }
        //       },
        //       {
        //         classes: {
        //           root: "common-header-cont"
        //         }
        //       }
        //     )
        //   }
        // },
        serachVendorErrorResultGrid,
        div2: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          props: {
            style: {
              width: "100%",
              //textAlign: "right",
              display: "flex"
            }
          },
          children: {
            cancelApplicationButton: {
              componentPath: "Button",
              visible: enableButton,
              props: {
                variant: "outlined",
                color: "primary",
                style: {
                  borderRadius: "2px",
                  minWidth: "180px",
                  height: "48px",
                  marginRight: "16px",
                  marginBottom: "8px",
                  marginTop: "25px"
                }
              },

              children: {
                buttonLabel: getLabel({
                  labelName: "CANCEL",
                  labelKey: "EC_POPUP_SEARCH_RESULTS_CANCEL_APP_BUTTON"
                })
              },
              onClickDefination: {
                action: "condition",
                callBack: (state, dispatch) => {
                  dispatch(
                    handleField("search", "components.adhocDialog", "props.open", false)
                  );
                }
              },
            },

          },
          gridDefination: {
            xs: 12,
            sm: 12
          }
        },
      },
    }
  }
};

export default VENDORSearchAndResult;

import {
  getCommonHeader,
  getLabel,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import { IndentNoteReviewDetails } from "./viewindentIssueNoteResource/indent-note-review";
import { masterViewFooter } from "./viewindentIssueNoteResource/footer";
import { getMaterialIndentData } from "./viewindentIssueNoteResource/functions";
import { showHideAdhocPopup } from "../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import{WorkFllowStatus} from '../../../../ui-utils/sampleResponses'
import { getstoreTenantId } from "../../../../ui-utils/storecommonsapi";
let IsEdit = false;
let Status = getQueryArg(window.location.href, "Status");
let ConfigStatus = WorkFllowStatus().WorkFllowStatus;
ConfigStatus = ConfigStatus.filter(x=>x.code === Status)
if(ConfigStatus.length >0)
IsEdit = true;

export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `View Indent Material Issue Note`,
    labelKey: "STORE_VIEW_INDENT_MATERIAL_ISSUE_NOTE"
  })
});

const createMatrialIndentNoteHandle = async (state, dispatch) => {
  const IndentId = getQueryArg(window.location.href, "IndentId");
  let issueNumber = getQueryArg(window.location.href, "issueNumber");
  dispatch(setRoute(`/egov-store-asset/createMaterialIndentNote?issueNumber=${issueNumber}&&IndentId=${IndentId}`));
};
const creatPOHandle = async (state, dispatch) => {
  let indents = get(
    state.screenConfiguration.preparedFinalObject,
    `materialIssues`,
    []
  );
  let indentNumber = indents[0].indent.indentNumber;
  if(indentNumber)
  dispatch(setRoute(`/egov-store-asset/create-purchase-order?indentNumber=${indentNumber}`));
};
const masterView = IndentNoteReviewDetails(false);
const getMdmsData = async (action, state, dispatch, tenantId) => {
  const tenant = getstoreTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenant,
      moduleDetails: [
        {
          moduleName: "store-asset",
          masterDetails: [
            { name: "Material" }, //filter: "[?(@.active == true)]" },           
            { name: "IndentPurpose"},// filter: "[?(@.active == true)]" },
            
          ],
        },
        {
          moduleName: "egov-hrms",
          masterDetails: [
            {
              name: "DeactivationReason",
              filter: "[?(@.active == true)]"
            }
          ]
        },
        {
          moduleName: "common-masters",
          masterDetails: [
            {
              name: "UOM",
              filter: "[?(@.active == true)]"
            },
            
          ]
        },
        
      ]
    }
  };
  try {
    const payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    dispatch(prepareFinalObject("viewScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "view-indent-note",
  beforeInitScreen: (action, state, dispatch) => {
    let issueNumber = getQueryArg(window.location.href, "issueNumber");
    let tenantId = getQueryArg(window.location.href, "tenantId");
    getMdmsData(action, state, dispatch, tenantId);
    getMaterialIndentData(state, dispatch, issueNumber, tenantId);
   // showHideAdhocPopup(state, dispatch);
   
    IsEdit = false;
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 4,
                md:3,
                lg:3,
                // align: "right",
              },  
              ...header
            },
            newApplicationButton: {
              componentPath: "Button",
              gridDefination: {
                xs: 12,
                sm: 6,
                align: "right",
              },
              visible: true,// enableButton,
              props: {
                variant: "contained",
                color: "primary",
                style: {
                  color: "white",
                  borderRadius: "2px",
                  width: "250px",
                  height: "48px",
                },
              },

              children: {
                plusIconInsideButton: {
                  uiFramework: "custom-atoms",
                  componentPath: "Icon",
                  props: {
                    iconName: "add",
                    style: {
                      fontSize: "24px",
                    },
                  },
                },

                buttonLabel: getLabel({
                  labelName: "Add Material Indent Note",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_ADD",
                }),
              },
              onClickDefination: {
                action: "condition",
                callBack: createMatrialIndentNoteHandle,
              },
            },
            newPOButton: {
              componentPath: "Button",  
              gridDefination: {
                xs: 12,
                sm: 4,
                md:3,
                lg:3,
                // align: "right",
              },            
              visible: true,// enableButton,
              props: {
                variant: "contained",
                color: "primary",
                style: {
                  color: "white",
                  borderRadius: "2px",
                  width: "250px",
                  height: "48px",
                },
              },

              children: {
                plusIconInsideButton: {
                  uiFramework: "custom-atoms",
                  componentPath: "Icon",
                  props: {
                    iconName: "add",
                    style: {
                      fontSize: "24px",
                    },
                  },
                },

                buttonLabel: getLabel({
                  labelName: "Add Purchase Order",
                  labelKey: "STORE_ADD_NEW_PURCHASE_ORDR_BUTTON",
                }),
              },
              onClickDefination: {
                action: "condition",
                callBack: creatPOHandle,
              },
            },
          }
        },
        masterView,
        footer: IsEdit? masterViewFooter():{},
      }
    },
   
    
  }
};

export default screenConfig;

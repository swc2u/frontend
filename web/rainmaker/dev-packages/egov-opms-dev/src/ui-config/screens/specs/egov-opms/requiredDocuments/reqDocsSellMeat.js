import {
  getCommonHeader,
  getBreak,
  getCommonTitle,
  getCommonParagraph,
  getCommonContainer,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getCommonGrayCard, getLabelOnlyValue, showHideAdhocPopups } from "../../utils";
import store from "../../../../../ui-redux/store";

import {
  localStorageGet, localStorageSet, setapplicationNumber, getOPMSTenantId, setapplicationType,
  getAccessToken, getLocale, getUserInfo, getapplicationType, getapplicationNumber
} from "egov-ui-kit/utils/localStorageUtils";

import { footer } from "./footer";
import set from "lodash/set";

import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
const styles = {
  header: {
    color: "gba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
    fontSize: "20px",
    fontWeight: 500,
    lineHeight: "28px",
    padding: "10px 0px"
    //paddingLeft: "5px"

  },
  subHeader: {
    color: "gba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "19px",
    display: "block",
    width: "95%",
  },
  docs: {
    color: "rgba(0, 0, 0, 0.6)",
    fontFamily: "Roboto",
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "17px",
    display: "block",
    width: "95%",
    // paddingBottom: "24px"
  },
  description: {
    fontFamily: "Roboto",
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: "12px",
    fontWeight: 400,
    letterSpacing: "0.6px",
    lineHeight: "14px",
    display: "block",
    width: "95%",
    padding: "10px",
    marginBottom: "0px !important"
  },

};

const header = getCommonHeader(
  {
    labelName: "Conditions for issue of No Objection Certifcate",
    labelKey: "NOC_REQ_SELLMEAT_DOCS_HEADER"
  },
  {
    style: styles.header
  }
);
const generateDocument = item => {
  // Add header to individual grey cards
  let subHeader =
    item.code &&
    getCommonTitle(
      {
        labelKey: getTransformedLocale(`NOC_${item.code}_HEADING`)
      },
      {
        style: styles.subHeader
      }
    );

  // Add documents in individual grey cards
  let docs = {};
  if (item.hasOwnProperty("dropdownData")) {
    docs = item.dropdownData.reduce((obj, doc) => {
      obj[doc.code] = getLabelOnlyValue(
        {
          labelKey: getTransformedLocale(`NOC_${doc.code}_LABEL`)
        },
        {
          style: styles.docs
        }
      );
      return obj;
    }, {});
  } else if (item.hasOwnProperty("options")) {
    docs = item.options.reduce((obj, doc) => {
      obj[doc.code] = getLabelOnlyValue(
        {
          labelKey: getTransformedLocale(`NOC_${doc.code}_LABEL`)
        },
        {
          style: styles.docs
        }
      );
      return obj;
    }, {});
  }

  // Add description to individual grey cards
  let subParagraph = item.description
    ? getCommonParagraph(
      {
        labelKey: getTransformedLocale(`NOC_${item.description}_NOTE`)
      },
      {
        style: styles.description
      }
    )
    : {};

  return getCommonGrayCard({
    subHeader: subHeader,
    break: getBreak(),
    docs: getCommonContainer({ ...docs }),
    subParagraph: subParagraph
  });
};


const setvalueCancel = async (state, dispatch,type) => {
  let pagename = "petnoc_summary";

  if(type ==="SELLMEATNOC")
  {
    pagename = "sellmeatnoc_summary"
  
  }
  else if(type ==="PETNOC")
  {
    pagename = "petnoc_summary"
  
  }

  dispatch(
    handleField(
      //"petnoc_summary",
      pagename,
      "components.div.children.body.children.cardContent.children.undertakingButton1.children.addPenaltyRebateButton1",
      "props.checked",
      false
    )
  );
  // localStorageSet("undertaking", "")
  dispatch(prepareFinalObject("undertaking", false));
  //showHideAdhocPopups(state, dispatch, "petnoc_summary")
  showHideAdhocPopups(state, dispatch, pagename)



}


const setvalue = async (state, dispatch,type) => {
let pagename = "petnoc_summary";

if(type ==="SELLMEATNOC")
{
  pagename = "sellmeatnoc_summary"

}
else if(type ==="PETNOC")
{
  pagename = "petnoc_summary"

}

  dispatch(
    handleField(
      pagename,
      "components.div.children.body.children.cardContent.children.undertakingButton1.children.addPenaltyRebateButton1",
      "props.checked",
      true
    )
  );
  // localStorageSet("undertaking", "accept")
  dispatch(prepareFinalObject("undertaking", true));
  showHideAdhocPopups(state, dispatch, pagename)



}

export const getRequiredDocuments = (type) => {
  return getCommonContainer(
    {
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 12,
          sm: 12
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {

          // closeButton: {
          //   componentPath: "Button",
          //   props: {
          //     style: {
          //       float: "right",
          //       marginRight: "-15",
          //       paddingRight: "0px",
          //       color: "rgba(0, 0, 0, 0.60)"
          //     }
          //   },
          //   children: {
          //     previousButtonIcon: {
          //       uiFramework: "custom-atoms",
          //       componentPath: "Icon",
          //       props: {
          //         iconName: "close"
          //       }
          //     }
          //   },
          //   onClickDefination: {
          //     action: "condition",
          //     callBack: (state, dispatch) => showHideAdhocPopups(state, dispatch, "petnoc_summary")
          //   }
          // },

          header: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
            children: {
              header
            },
            break: getBreak(),
          },
          subText1: getCommonParagraph({
            labelName: "UNDERTAKING1",
            labelKey: "SELLMEATNOC_UNDERTAKING_POINT1"
          }),
          subText2: getCommonParagraph({
            labelName: "UNDERTAKING2",
            labelKey: "SELLMEATNOC_UNDERTAKINGPOINT2"
          }),
          subText3: getCommonParagraph({
            labelName: "UNDERTAKING3",
            labelKey: "SELLMEATNOC_UNDERTAKINGPOINT3"
          }),
          subText4: getCommonParagraph({
            labelName: "UNDERTAKING4",
            labelKey: "SELLMEATNOC_UNDERTAKINGPOINT4"
          }),
          subText5: getCommonParagraph({
            labelName: "UNDERTAKING5",
            labelKey: "SELLMEATNOC_UNDERTAKINGPOINT5"
          }),
          subText6: getCommonParagraph({
            labelName: "UNDERTAKING6",
            labelKey: "SELLMEATNOC_UNDERTAKINGPOINT6"
          }),
          subText7: getCommonParagraph({
            labelName: "UNDERTAKING7",
            labelKey: "SELLMEATNOC_UNDERTAKINGPOINT7"
          }),
          subText8: getCommonParagraph({
            labelName: "UNDERTAKING8",
            labelKey: "SELLMEATNOC_UNDERTAKINGPOINT8"
          }),
          subText9: getCommonParagraph({
            labelName: "UNDERTAKING9",
            labelKey: "SELLMEATNOC_UNDERTAKINGPOINT9"
          }),
          subText10: getCommonParagraph({
            labelName: "UNDERTAKING10",
            labelKey: "SELLMEATNOC_UNDERTAKINGPOINT10"
          }),
          subText11: getCommonParagraph({
            labelName: "UNDERTAKING11",
            labelKey: "SELLMEATNOC_UNDERTAKINGPOINT11"
          }),
          subText12: getCommonParagraph({
            labelName: "UNDERTAKING12",
            labelKey: "SELLMEATNOC_UNDERTAKINGPOINT12"
          }),
          subText13: getCommonParagraph({
            labelName: "UNDERTAKING13",
            labelKey: "SELLMEATNOC_UNDERTAKINGPOINT13"
          }),
          subText14: getCommonParagraph({
            labelName: "UNDERTAKING14",
            labelKey: "SELLMEATNOC_UNDERTAKINGPOINT14"
          }),
          subText15: getCommonParagraph({
            labelName: "UNDERTAKING15",
            labelKey: "SELLMEATNOC_UNDERTAKINGPOINT15"
          }),

        }

      },
      nextButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            minWidth: "180px",
            height: "48px",
            marginRight: "45px"
          }
        },
        children: {
          nextButtonLabel: getLabel({
            labelName: "OK I Agree",
            labelKey: "PM_COMMON_OK_I_AGREE_BUTTON"
          }),
          nextButtonIcon: {
            uiFramework: "custom-atoms",
            componentPath: "Icon",
            // props: {
            //   iconName: "keyboard_arrow_right"
            // }
          }
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            setvalue(state, dispatch,type);

          }
        }
      },
      cancelButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            minWidth: "180px",
            height: "48px",
            marginRight: "45px"
          }
        },
        children: {
          cancelButtonLabel: getLabel({
            labelName: "Cancel",
            labelKey: "PM_COMMON_CANCEL"
          }),
          cancelButtonIcon: {
            uiFramework: "custom-atoms",
            componentPath: "Icon",
            // props: {
            //   iconName: "keyboard_arrow_right"
            // }
          }
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            setvalueCancel(state, dispatch,type);

          }
        }
      },
    },
    {
      style: {
        padding: "0px 10px"
      }
    }
  );
};

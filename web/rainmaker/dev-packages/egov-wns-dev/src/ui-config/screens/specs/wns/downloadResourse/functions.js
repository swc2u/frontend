import get from "lodash/get";
import find from "lodash/find";
import {
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../../ui-utils/commons";
import { getTextToLocalMapping } from "./searchResults";
import { validateFields,downloadAcknowledgementForm } from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { convertEpochToDate, convertDateToEpoch } from "../../utils/index";

export const searchApiCall = async (state, dispatch) => {
  let { localisationLabels } = state.app || {};
 // showHideTable(false, dispatch);
  const tenantId =  getTenantId();
  let queryObject = [
    {
      key: "tenantId",
      value: tenantId,
    },
  ];
  downloadAcknowledgementForm( state,dispatch,"generateBillFile",0,0,'')  
};
export const getDataExchangeFile = async (state, dispatch) => {
  let { localisationLabels } = state.app || {};
 // showHideTable(false, dispatch);
 const isdateValid = validateFields(
  "components.div.children.DownloadDataExchangeFile.children.cardContent.children.searchFormContainer.children",
  state,
  dispatch,
  "download"
);
if(isdateValid)
{
  const tenantId =  getTenantId();
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );
  let Fromdate = convertDateToEpoch(searchScreenObject.fromDate,"dayStart");
  let Todate =convertDateToEpoch(searchScreenObject.toDate,"dayend")
  let doctype =convertDateToEpoch(searchScreenObject.DataTransferType)
  let queryObject = [
    {
      key: "tenantId",
      value: tenantId,
    },
  ];
  downloadAcknowledgementForm( state,dispatch,"getDataExchangeFile",Fromdate,Todate,doctype)  
}
else
  {
    dispatch(
      toggleSnackbar(
        true, {
        labelKey: "WS_FILL_REQUIRED_FIELDS",
        labelName: "Please fill Required details"
      },
        "warning"
      )
    )
  }
};
const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "download",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};

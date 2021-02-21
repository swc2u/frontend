import React from "react";
import { connect } from "react-redux";
import TaskStatusContainer from "../TaskStatusContainer";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { Footer } from "../../ui-molecules-local";
import {
  getQueryArg,
  addWflowFileUrl,
  orderWfProcessInstances,
  getMultiUnits
} from "egov-ui-framework/ui-utils/commons";
import { convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";

import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import get from "lodash/get";
import set from "lodash/set";
import find from "lodash/find";
import {
  localStorageGet,
  getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";
import orderBy from "lodash/orderBy";

const tenant = getQueryArg(window.location.href, "tenantId");

class WorkFlowContainer extends React.Component {
  state = {
    open: false,
    action: ""
  };

  componentDidMount = async () => {
    const { prepareFinalObject, toggleSnackbar } = this.props;
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const queryObject = [
      { key: "businessIds", value: applicationNumber },
      { key: "history", value: true },
      { key: "tenantId", value: tenantId }
    ];
    try {
      const payload = await httpRequest(
        "post",
        "bookings/api/egov-workflow/process/_search",
        "",
        queryObject
      );
      if (payload && payload.ProcessInstances.length > 0) {
        const processInstances = orderWfProcessInstances(
          payload.ProcessInstances
        );
        addWflowFileUrl(processInstances, prepareFinalObject);
      } else {
        toggleSnackbar(
          true,
          {
            labelName: "Workflow returned empty object !",
            labelKey: "WRR_WORKFLOW_ERROR"
          },
          "error"
        );
      }
    } catch (e) {
      toggleSnackbar(
        true,
        {
          labelName: "Workflow returned empty object !",
          labelKey: "WRR_WORKFLOW_ERROR"
        },
        "error"
      );
    }
  };

  

  render() {
    const {
      ProcessInstances,
      prepareFinalObject,
      dataPath,
      moduleName
    } = this.props;

    return (
      <div>
        {ProcessInstances && ProcessInstances.length > 0 && (
          <TaskStatusContainer ProcessInstances={ProcessInstances} />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  const { workflow } = preparedFinalObject;
  const { ProcessInstances } = workflow || [];
  return { ProcessInstances, preparedFinalObject };
};

const mapDispacthToProps = dispatch => {
  return {
    prepareFinalObject: (path, value) =>
      dispatch(prepareFinalObject(path, value)),
    toggleSnackbar: (open, message, variant) =>
      dispatch(toggleSnackbar(open, message, variant)),
    setRoute: route => dispatch(setRoute(route))
  };
};

export default connect(
  mapStateToProps,
  mapDispacthToProps
)(WorkFlowContainer);

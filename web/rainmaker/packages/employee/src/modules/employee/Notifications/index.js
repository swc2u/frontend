import React from "react";
import Label from "egov-ui-kit/utils/translationNode";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { connect } from "react-redux";
import { Card } from "components";
import Icon from "egov-ui-kit/components/Icon";
import get from "lodash/get";
import { Notifications, Screen } from "modules/common";
import { getNotifications } from "egov-ui-kit/redux/app/actions";
import { getAccessToken, getUserInfo,getTenantId } from "egov-ui-kit/utils/localStorageUtils";

import "./index.css";

const items = [
  {
    displayName: "Public Message Broadcast",
    navigationURL: "notifications/search",
    leftIcon: "action:record-voice-over",
  },
  {
    displayName: "Events",
    navigationURL: "events/search",
    leftIcon: "action:date-range",
  },
];

const iconStyle = {
  width: "40px",
  height: "40px",
};



class EmployeeNotification extends React.Component {

  componentDidMount = () => {
    const { getNotifications } = this.props;
  //  const permanentCity = JSON.parse(getUserInfo()).permanentCity;
      let queryObject = [
        {
          key: "tenantId",
          value: getTenantId(),
        },
      ];
      const requestBody = {
        RequestInfo: {
          apiId: "org.egov.pt",
          ver: "1.0",
          ts: 1502890899493,
          action: "asd",
          did: "4354648646",
          key: "xyz",
          msgId: "654654",
          requesterId: "61",
          authToken: getAccessToken(),
        },
      };
      getNotifications(queryObject, requestBody);
  };

  onModuleCardClick = (route) => {
     const {setRoute} = this.props;
     setRoute("/" + route);
  };
  

  render(){
    const { notifications, history, loading ,isSuperUser} = this.props;
    return (
      <div>
        {isSuperUser ?
        <React.Fragment>
        <div style={{ marginLeft: 35, marginTop: 20 }}>
          <Label label="ACTION_TEST_ULB_INFORMATION" color="rgba(0, 0, 0, 0.87)" fontSize="24px" containerStyle={{ marginBottom: 30 }} />
          <Label label="Communication" color="rgba(0, 0, 0, 0.87)" fontSize="16px" />
        </div>
        {items && (
          <div className="inbox-module-container">
            {items.map((item, i) => {
              return (
                <div
                  style={{ marginRight: 20 }}
                  id={`emp-${item.displayName.split(" ")[0]}-card`}
                  onClick={() => this.onModuleCardClick(item.navigationURL)}
                >
                  <Card
                    className="events-card"
                    key={i}
                    textChildren={
                      <div>
                        <div
                          style={{
                            marginTop: 15,
                          }}
                          className="head"
                        >
                          <Icon action={item.leftIcon.split(":")[0]} name={item.leftIcon.split(":")[1]} style={iconStyle} />
                        </div>
                        <div
                          style={{
                            marginTop: 20,
                          }}
                          className="body"
                        >
                          <Label
                            label={`ACTION_TEST_${item.displayName.toUpperCase().replace(/[.:-\s\/]/g, "_")}`}
                            color="rgba(0, 0, 0, 0.87)"
                            className="inbox-card-top-label"
                          />
                        </div>
                      </div>
                    }
                  />
                </div>
              );
            })}
          </div>
        )}
        </React.Fragment>
        :
        <React.Fragment>
          <div style={{ marginLeft: 35, marginTop: 20 }}>
         <Label label="CS_HEADER_NOTIFICATIONS" color="rgba(0, 0, 0, 0.87)" fontSize="24px" containerStyle={{ marginBottom: 30 }} />
          </div>
          <Screen loading={loading} className="notifications-screen-style">
            {/* <Notifications notifications={getTransformedNotifications(notifications)} history={history} />; */}
            {notifications && <Notifications notifications={Object.values(notifications)} history={history} />}
         </Screen>
         </React.Fragment>
        }
      </div>
    );

  }
}
const roleFromUserInfo = (roles = [], role) => {
  const roleCodes = roles.map((role, index) => {
    return role.code;
  });
  return roleCodes && roleCodes.length && roleCodes.indexOf(role) > -1
    ? true
    : false;
};

const mapStateToProps = (state) => {
  const notifications = get(state.app, "notificationObj.notificationsById");
  const loading = get(state.app, "notificationObj.loading");
  const {roles} = state.auth.userInfo; 
  const isSuperUser = roleFromUserInfo(roles , "SUPERUSER");
  console.log("isSuperuser",isSuperUser);
  return { notifications, loading, isSuperUser };
};


const mapDispatchToProps = (dispatch) => {
  return {
    setRoute: (route) => dispatch(setRoute(route)),
    getNotifications: (queryObject, requestBody) => dispatch(getNotifications(queryObject, requestBody)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmployeeNotification);


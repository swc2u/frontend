import React from "react";
import { Notifications, Screen } from "modules/common";
import { Card, CardContent, Grid, Typography, Button,} from "@material-ui/core";
import {
    LabelContainer,  
  } from "egov-ui-framework/ui-containers";
  import { Container } from "egov-ui-framework/ui-atoms";
import get from "lodash/get";
import { connect } from "react-redux";
//import "../index.css";
import { getNotifications } from "egov-ui-kit/redux/app/actions";
import { getAccessToken, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import img from "egov-ui-kit/assets/images/contact.png";
import  ProfileSection from "egov-ui-kit/common/User/components/ProfileSection";
//import {ContactUs} from "egov-ui-kit/common/User/components/ContactUs";
//ContactUs
class HelpSupport extends React.Component {
  componentDidMount = () => {
    const { getNotifications } = this.props;

    let queryObject = [
      {
        key: "tenantId",
        value: JSON.parse(getUserInfo()).permanentCity,
      },
      {
        key: "eventTypes",
        value: "EVENTSONGROUND",
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

  render() {
    // const { notifications, history, loading } = this.props;
    // let eventarray = notifications && Object.values(notifications).filter((item) => item.type === "EVENTSONGROUND" && !item.referenceId);
    return (
        <div>
        <div className="profile-card-container">
          <div>
            <div style={{ padding: 0 }} className="col-xs-12 col-sm-4 col-md-4 col-lg-4 profile-profilesection">
            <ProfileSection img={img} addIconName={true}  />
            </div>
            <div style={{ padding: "0 8px",minHeight:"340px" }} className="col-xs-12 col-sm-8 col-md-8 col-lg-8 profileFormContainer">
            <Grid item xs={12}  style={{ marginTop: 15, paddingRight: 10 ,paddingLeft: 10 }}>
                              <Typography variant="caption">
                              <LabelContainer labelName="In case of any support or query, kindly contact us"  />
                              </Typography>

                            </Grid>
            <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 15, paddingRight: 10 ,paddingLeft: 10 }}>
                              <Typography variant="caption">
                              <LabelContainer labelName="Contact Number" labelKey="CS_HELP_CONTACT_LABLE" />
                              </Typography>
                              <Typography variant="body2">
                              <LabelContainer labelName={"0172 2787200"} />
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                              <Typography variant="caption">
                              <LabelContainer labelName="Email" labelKey="CS_HELP_EMAIL_LABLE" />
                              </Typography>
                              <Typography variant="body2">
                              <LabelContainer labelName={"chd.egov.helpdesk@gmail.com"} />
                              </Typography>
                            </Grid>
            </div>
          </div>
        </div>
  
   
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const notifications = get(state.app, "notificationObj.notificationsById");
  const loading = get(state.app, "notificationObj.loading");
  return { notifications, loading };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getNotifications: (queryObject, requestBody) => dispatch(getNotifications(queryObject, requestBody)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HelpSupport);

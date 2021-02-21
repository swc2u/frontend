import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import Icon from "egov-ui-kit/components/Icon";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Label from "egov-ui-kit/utils/translationNode";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
//import "./index.css";

const styles = (theme) => ({
  webRoot: {
    flexGrow: 1,
    width: "10%",
    padding:"1%"
  },
  mobileRoot: {
    flexGrow: 1,
    padding:'1%',
    width: "25%",
  },
  mobileRoot1: {
    flexGrow: 1,
    padding:'1%',
    width: "33%",
  },
  paper: {
    borderRadius: 0,
    marginTop: 0,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    cursor: "pointer",
  },
  icon: {
    color: "#fe7a51",
  },
  item: {
    padding: 8,
  },
});



class CardContainer extends React.Component {
  state = {
    actionList: [],
  };
  navigationURL = (path) => {   
    window.location.href = path;
  };
  
  render() {
    const { classes, history,menu } = this.props;
    const { actionList } = this.state;
    let list ;
    list = menu && menu.filter((item) => item.url === "pension-card");
    
    return (
      <Grid container>
        <Hidden smUp>
          {list.map((service) => {
            const translatedLabel = service.displayName.toUpperCase().replace(/[.:\-\s]/g, "_");

            return (
              <Grid className={(actionList.length===6 ||actionList.length===5 || actionList.length===9 )? classes.mobileRoot1:classes.mobileRoot } item align="center">
                <Card
                  className={classes.paper}
                  onClick={(e) => {
                    this.navigationURL(service.navigationURL)
                  }}
                >
                  <CardContent classes={{ root: "card-content-style" }}>
                    {/* {service.icon} */}
                    <Icon className="service-icon" action={service.leftIcon.split(":")[0]} name={service.leftIcon.split(":")[1]} />
                    <Label className="service-label-cont" label={translatedLabel} fontSize={12} color="rgba(0, 0, 0, 0.87)" />
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Hidden>

        <Hidden xsDown>
          {list.map((service) => {
            const translatedLabel = service.displayName.toUpperCase().replace(/[.:\-\s]/g, "_");
            return (
              <Grid className={classes.webRoot} item align="center">
                <Card
                  className={`${classes.paper} service-module-style`}
                  onClick={(e) => {
                    this.navigationURL(service.navigationURL)
                    //history.push(service.navigationURL);
                  }}
                >
                  <CardContent classes={{ root: "card-content-style" }}>
                    {/* <div>{service.icon}</div> */}
                    <Icon className="service-icon" action={service.leftIcon.split(":")[0]} name={service.leftIcon.split(":")[1]} >
                      
                    </Icon>
                    <Label className="service-label-cont" label={translatedLabel} fontSize={14} color="rgba(0, 0, 0, 0.87)" />
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Hidden>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  const { auth, app } = state;
  const { menu } = app;
  const { userInfo } = auth;
  const name = auth && userInfo.name;

  return { name, menu };
};
export default withStyles(styles)(
  connect(
    mapStateToProps,
    null
  )(CardContainer)
);

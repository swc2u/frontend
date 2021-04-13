//import React from "react";
//import PropTypes from "prop-types";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import classNames from "classnames";
import Button from "@material-ui/core/Button";
import { LabelContainer } from "../../ui-containers-local";
//import "./index.css";

const styles = {
  whiteCard: {
    maxWidth: 250,
    backgroundColor: "#FFFFFF",
    paddingLeft: 8,
    paddingRight: 0,
    paddingTop: 11,
    paddingBottom: 0,
    marginRight: 10,
    marginTop: 16
  },
  subtext: {
    paddingTop: 7
  },
  body2: {
    wordWrap: "break-word",
	wordBreak: "break-all"
  }
};

const documentTitle = {
  color: "rgba(0, 0, 0, 0.87)",
  fontFamily: "Roboto",
  fontSize: "16px",
  fontWeight: 400,
  letterSpacing: "0.67px",
  lineHeight: "19px",
  wordWrap: "break-word"
	// wordBreak: "break-all"
};

//function MultiCardDownloadGrid(props) {
  class MultiCardDownloadGrid extends Component {
    render() {
  const { classes, data, ...rest } = this.props;
  deleteDocument = remDocIndex => {
    alert('i am at delete')

  }
 
  return (
    <Grid container {...rest}>
      {data && data.length && data.map((item, key) => {
        return (
          <Grid
            item
            container
            xs={12}
            sm={4}
            // className={
            //   props.backgroundGrey
            //     ? classNames(classes.whiteCard, "background-grey")
            //     : classes.whiteCard
            // }
            className={styles.whiteCard}
          >
            <Grid xs={12}>
              <LabelContainer
                labelName={item.title}
                labelKey={item.title}
                style={documentTitle}
              />
            </Grid>
            <Grid container>
              <Grid xs={6} className={styles.subtext}>
                <Typography className={styles.body2}>{item.name}</Typography>
              </Grid>
              <Grid xs={6} align="right">
                <Button href={item.link} color="primary">
                 
				  {/* {item.linkText} */}
                  Download
                </Button>
              </Grid>
              <Grid xs={6} align="right">
              <Button           
            primary={true}
            onClick={(e) => {
              this.deleteDocument();
            }}
          />
              </Grid>
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
    }
}

// MultiCardDownloadGrid.propTypes = {
//   title: PropTypes.string.isRequired,
//   name: PropTypes.string.isRequired,
//   link: PropTypes.array.isRequired,
//   linktext: PropTypes.array.isRequired
// };
MultiCardDownloadGrid.propTypes = {
  classes: PropTypes.object.isRequired
};
const mapStateToProps = state => {
  // const { screenConfiguration } = state;
  // const { moduleName } = screenConfiguration;
  // const documentsUploadRedux = get(
  //   screenConfiguration.preparedFinalObject,
  //   "documentsUploadRedux",
  //   {}
  // );
  const { screenConfiguration } = state;
  const data = ownProps.data
    ? ownProps.data
    : get(screenConfiguration.preparedFinalObject, ownProps.sourceJsonPath, []);
  return { data };
};

const mapDispatchToProps = dispatch => {
  return {
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value))
  };
};

//export default withStyles(styles)(MultiCardDownloadGrid);
export default withStyles(themeStyles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MultiCardDownloadGrid)
);

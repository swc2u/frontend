import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import classNames from "classnames";
import Button from "@material-ui/core/Button";
//import { LabelContainer } from "../../ui-containers";
import { LabelContainer } from "egov-ui-framework/ui-containers"
//import "./index.css";

const styles = {
  whiteCard: {
    maxWidth: 500,
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

const documentType = {

  fontFamily: "Roboto",
  fontSize: "13px",
  fontWeight: 400,
  letterSpacing: "0.67px",
  lineHeight: "19px",
  wordWrap: "break-word"
	// wordBreak: "break-all"
};

function MultiDownloadCardWithDocumentType(props) {
  const { classes, data, ...rest } = props;
  console.log(props, "Nero MultiC Gov MultiDownloadCardWithDocumentType")
  return (
    <Grid container {...rest}>
      {data && data.length && data.map((item, key) => {
        return (
          <Grid
            item
            container
            xs={12}
            sm={12}
            className={
              props.backgroundGrey
                ? classNames(classes.whiteCard, "background-grey")
                : classes.whiteCard
            }
          >
            <Grid container xs={12}
            sm={12}>
            <Grid xs={4} sm={4}>
              <LabelContainer
                labelName={item.title}
                labelKey={item.title}
                style={documentTitle}
              />
            </Grid>
            <span>- </span>
            <Grid xs={4} sm={4}>
              <LabelContainer
                labelName={item.documentType}
                labelKey={item.documentType}
                style={documentType}
              />
            </Grid>
            </Grid>
            <Grid container>
              <Grid xs={6} className={classes.subtext}>
                <Typography className={classes.body2}>{item.name}</Typography>
              </Grid>
              <Grid xs={6} align="right">
                <Button href={item.link} color="primary">

				  {/* {item.linkText} */}
                  Download
                </Button>
              </Grid>
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
}

// MultiDownloadCardWithDocumentType.propTypes = {
//   title: PropTypes.string.isRequired,
//   name: PropTypes.string.isRequired,
//   link: PropTypes.array.isRequired,
//   linktext: PropTypes.array.isRequired,
//   documentType: PropTypes.array.isRequired
// };

export default withStyles(styles)(MultiDownloadCardWithDocumentType);

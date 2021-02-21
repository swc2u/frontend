import React from "react";
import { Grid, Typography, Button } from "@material-ui/core";
import { Container } from "egov-ui-framework/ui-atoms";
import {
  LabelContainer,
  TextFieldContainer,
} from "egov-ui-framework/ui-containers";
import { Dialog, DialogContent } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";
import { UploadMultipleFiles } from "egov-ui-framework/ui-molecules";

import "./index.css";
const styles = theme => ({
  root: {
    marginTop: 24,
    width: "100%"
  }
});

const fieldConfig = {
  comments: {
    label: {
      labelName: "Comments",
      labelKey: "WF_NULM_COMMENTS"
    },
    placeholder: {
      labelName: "Enter Comments",
      labelKey: "WF_NULM_COMMENT_LABEL"
    }
  },
  roleName: {
    label: {
      labelName: "Assignee Name",
      labelKey: "WF_NULM_ASSIGNEE_LABEL"
    },
    placeholder: {
      labelName: "Select Assignee",
      labelKey: "WF_NULM_ASSIGNEE_PLACEHOLDER"
    }
  },
};

class NulmActionDialog extends React.Component {

  state = {
    handleChange: this.props.handleFieldChange,
    path: this.props.dataPath,
    assignee: this.props.state.screenConfiguration.preparedFinalObject[this.props.dataPath]
      ? this.props.state.screenConfiguration.preparedFinalObject[this.props.dataPath] : undefined
  };

  componentDidMount() {

  }
  getButtonLabelName = label => {

    switch (label) {

      case "VERIFY AND FORWARD":
        return "Verify and Forward";
      case "VERIFY AND FORWARD TO SDO":
        return "Verify and Forward to SDO";
      case "REVIEWOFEE":
        return "Forward For Inspection";
      case "INSPECT":
        return "Inspect";
      case "REJECT":
        return "Reject";
      case "REQUEST CLARIFICATION":
        return "Request Clarification";
      case "APPROVE":
        return "APPROVE";
      case "COMPLETE":
        return "Complete";
      default:
        return label;
    }
  };


  getassignee() {
    return this.props.state.screenConfiguration.preparedFinalObject[this.props.dataPath].assignee ? this.props.state.screenConfiguration.preparedFinalObject[this.props.dataPath].assignee[0] : '';
  }

  render() {

    let {
      open,
      onClose,
      dropDownData,
      handleFieldChange,
      onButtonClick,
      dialogData,
      dataPath,

    } = this.props;
    const {
      buttonLabel,
      showEmployeeList,
      dialogHeader,
      moduleName,
      isDocRequired,

      // dispatch
    } = dialogData;
    const { getButtonLabelName } = this;


    let fullscreen = false;
    if (window.innerWidth <= 768) {
      fullscreen = true;
    }
    dataPath = `${dataPath}`;
    return (
      <Dialog
        fullScreen={fullscreen}
        open={open}
        onClose={onClose}
        maxWidth={false}
      // style={{zIndex:2000}}
      >
        <DialogContent
          children={
            <Container
              children={
                <Grid
                  container="true"
                  spacing={12}
                  marginTop={16}
                  className="action-container"
                >
                  <Grid
                    style={{
                      alignItems: "center",
                      display: "flex"
                    }}
                    item
                    sm={10}
                  >
                    <Typography component="h2" variant="subheading">
                      <LabelContainer {...dialogHeader} />
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    sm={2}
                    style={{
                      textAlign: "right",
                      cursor: "pointer",
                      position: "absolute",
                      right: "16px",
                      top: "16px"
                    }}
                    onClick={onClose}
                  >
                    <CloseIcon />
                  </Grid>
                  {/* indents.workflowDetails.assignee */}
                  { (buttonLabel !== "Reassign To Citizen") && showEmployeeList && (
                    <Grid
                      item
                      sm="12"
                      style={{
                        marginTop: 16
                      }}
                    >
                      <TextFieldContainer
                        select={true}
                        style={{ marginRight: "15px", width: "100%" }}
                        label={fieldConfig.roleName.label}
                        placeholder={fieldConfig.roleName.placeholder}
                        data={dropDownData}
                        optionValue="value"
                        optionLabel="label"
                        hasLocalization={false}
                        value={this.getassignee()}
                        onChange={e =>
                          handleFieldChange(
                            `${dataPath}.assignee`,
                            [e.target.value]
                          )
                        }
                        jsonPath={`${dataPath}.assignee[0]`}
                      />
                    </Grid>
                  )}

                  {/* code for comments is just here not anywhere else, after this, button code starts */}
                  <Grid item sm="12">
                    <TextFieldContainer
                      style={{ marginRight: "15px", width: "100%" }}
                      InputLabelProps={{ shrink: true }}
                      label={fieldConfig.comments.label}
                      onChange={e =>
                        handleFieldChange(`${dataPath}.remark`, e.target.value)
                      }
                      jsonPath={`${dataPath}.remark`}
                      placeholder={fieldConfig.comments.placeholder}
                    />
                  </Grid>

                  {/*button and image code starts */}
                  {/*only upload already captured documents, image, PDF */}
                  {(<Grid item sm="12">
                    <Typography
                      component="h3"
                      variant="subheading"
                      style={{
                        color: "rgba(0, 0, 0, 0.8700000047683716)",
                        fontFamily: "Roboto",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "20px",
                        marginBottom: "8px"
                      }}
                    >
                      <div className="rainmaker-displayInline">

                        {isDocRequired && (
                          <span style={{ marginLeft: 5, color: "red" }}>*</span>
                        )}
                      </div>
                    </Typography>
                    <div
                      style={{
                        color: "rgba(0, 0, 0, 0.60)",
                        fontFamily: "Roboto",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "20px"
                      }}
                    >
                      <LabelContainer
                        labelName="Only .jpg and .pdf files. 5MB max file size."
                        labelKey="WF_NULM_UPLOAD"
                      />
                    </div>
                    <UploadMultipleFiles
                      maxFiles={4}
                      inputProps={{
                        accept: "image/*, .pdf, .png, .jpeg"
                      }}
                      buttonLabel={{ labelName: "UPLOAD FILES", labelKey: "NULM_UPLOAD_FILES_BUTTON" }}
                      jsonPath={`${dataPath}.wfDocuments`}
                      maxFileSize={5000}
                    />
                    <LabelContainer
                      labelName="Upload Document Should be less than 5MB"
                      labelKey="NULM_UPLOAD_DOCUMENT_MSG_LABEL"
                    />
                    <Grid sm={12} style={{ textAlign: "right" }} className="bottom-button-container">
                      <Button
                        variant={"contained"}
                        color={"primary"}
                        style={{
                          minWidth: "200px",
                          height: "48px"
                        }}
                        className="bottom-button"
                        onClick={() =>
                          onButtonClick(buttonLabel, isDocRequired)
                        }
                      >
                        <LabelContainer
                          labelName={getButtonLabelName(buttonLabel)}
                          labelKey={
                            moduleName
                              ? `WF_${moduleName.toUpperCase()}_${buttonLabel}`
                              : ""
                          }
                        />
                      </Button>
                    </Grid>
                  </Grid>
                  )}




                </Grid>
              }
            />
          }
        />
      </Dialog>
    );

  }
}
export default withStyles(styles)(NulmActionDialog);

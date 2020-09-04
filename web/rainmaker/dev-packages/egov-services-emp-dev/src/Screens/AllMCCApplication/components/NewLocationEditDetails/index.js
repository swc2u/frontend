import React, { Component } from "react";
import { Card, Image, Icon, Button,TextField } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import "./index.css";
// import HistoryIcon from "@material-ui/icons/History";
// import { LabelContainer } from "egov-ui-framework/ui-containers";
// import DialogContainer from "../../modules/DialogContainer"

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
// import TaskStatusComponents from "../TaskStatusComponents";
// import TaskStatusContainer from "../TaskStatusContainer";
// import Label from "egov-ui-kit/utils/translationNode";

import PropTypes from "prop-types";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Divider from "@material-ui/core/Divider";
// import { getCurrentStatus } from "../TaskStatusComponents";
import { LabelContainer } from "egov-ui-framework/ui-containers";


const styles = (theme) => ({
  root: {
    marginTop: 24,
    width: "100%"
  },
  closeButton: {
    position: 'absolute',
    right: "10px",
    top: "5px"
  }

});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({

}))(MuiDialogContent);



const iconStyle = {
  marginRight: "13px",
  height: "24px",
  width: "24px",
};

const imageStyles = {
  maxHeight: "100px",
  minHeight: "100px",
};

const mapIconStyle = {
  marginRight: "7px",
  height: "12px",
  width: "14px",
  borderRadius: "50%",
};

class BookingDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
       address1: '',
      locality: '',
      areaRequirement: '',
      data: 'sonu'
    };
  };

  componentDidMount = () => {
     const { address } = this.props;
   
      this.setState({address1:address })

  }


  handleClickOpen = () => {

    this.setState({
      open: true
    })

  };
  handleClose = () => {
    this.setState({
      open: false
    })
  };

  navigateToComplaintType = () => {
    this.props.history.push("/complaint-type");
  };
  getImageSource = (imageSource, size) => {
    const images = imageSource.split(",");
    if (!images.length) {
      return null;
    }
    switch (size) {
      case "small":
        imageSource = images[2];
        break;
      case "medium":
        imageSource = images[1];
        break;
      case "large":
      default:
        imageSource = images[0];
    }
    return imageSource || images[0];
  };
  onImageClick = (source) => {
    window.open(this.getImageSource(source, "large"), 'Image');
    
  };

  onApproverNameChange = (e) => {
   

  }
  _handleChangeEvent= (e) => {
   
    
  }

  render() {
    
    
    let { address1 } = this.state
    return (
      <div>

<input type='text' 
                   onChange={()=>{this._handleChangeEvent(this.state.data);}} 
                   defaultValue={this.state.data} />

        <TextField
          id="address-name"
          name="approver-name"
          type="string"
          value ={address1}
          hintText={
            <Label
              label="BK_MYBK_APPROVER_NAME_PLACEHOLDER"
              color="rgba(0, 0, 0, 0.3799999952316284)"
              fontSize={16}
              labelStyle={{
                letterSpacing: "0.7px",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                width: "90%",
                overflow: "hidden"
              }}
            />
          }
          floatingLabelText={
            <Label
              key={0}
              label="BK_MYBK_CREATE_APPROVER_NAME"
              color="rgba(0,0,0,0.60)"
              fontSize="12px"
            />
          } 
          onChange={(e) => this.onApproverNameChange(e)}
          underlineStyle={{ bottom: 7 }}
          underlineFocusStyle={{ bottom: 7 }}
          hintStyle={{ width: "100%" }}
        />
      </div>
    );
  }
}

export default BookingDetails;

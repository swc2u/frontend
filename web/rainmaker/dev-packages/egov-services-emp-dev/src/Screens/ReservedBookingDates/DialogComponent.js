import { Button, TextField } from "components";
import { httpRequest } from "egov-ui-kit/utils/api";
import LoadingIndicator from "egov-ui-kit/components/LoadingIndicator";
import React, { Component } from 'react'
import { Toast } from "components";
import { SortDialog, Screen } from "modules/common";
import CircularProgress from "@material-ui/core/CircularProgress";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { withStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import TextFieldContainer from 'egov-ui-framework/ui-containers/TextFieldContainer'


const styles = theme => ({

  text: {
    " &  .Mui-error": {
      color: "primary"
    }
  },


  dialogStyle: {
    minWidth: '960px',
  },

  root: {
    "& .MuiInput-underline:after": {
      borderBottomColor: " #f44336"
    }
  },

  [theme.breakpoints.down('sm')]: {


    dialogStyle: {
      minHeight: '100%',
      margin: '0px',
      minWidth: '0px',
      maxWidth: '960px'
    }
  }



})



class DialogComponent extends Component {


  // async componentDidMount() {


  //   console.log(this.props, "Nero Props Datassss")
  //   const { preparedFinalObject } = this.props;
  //   // // this.setState({mdmsRes: this.props.mdmsResOsbm})
  //   // // this.props.prepareFinalObject('mdmsRes', this.props.mdmsResOsbm)
  //  // if (preparedFinalObject && preparedFinalObject.PopupDataForHoldDates){
  //     this.setState({
  //       bookingVenue: preparedFinalObject && preparedFinalObject.PopupDataForHoldDates.bookingVenue,
  //       lockedDate: preparedFinalObject && preparedFinalObject.PopupDataForHoldDates.fromDate,
  //       id: preparedFinalObject && preparedFinalObject.PopupDataForHoldDates.id
  //     });
  //  // }


  // }

  // componentWillReceiveProps(nextProps) {
  //   console.log(this.props, "Nero NExtprops")
  // }
  componentDidUpdate(prevProps){

console.log(prevProps, "Nero Prevprops")
      if(this.props.preparedFinalObject.PopupDataForHoldDates !== prevProps.preparedFinalObject.PopupDataForHoldDates){


        this.setState({
          bookingVenue: preparedFinalObject && preparedFinalObject.PopupDataForHoldDates.bookingVenue,
          lockedDate: preparedFinalObject && preparedFinalObject.PopupDataForHoldDates.fromDate,
          id: preparedFinalObject && preparedFinalObject.PopupDataForHoldDates.id
        });
      }

  }



  state = {

    updateData: {},
    errors: {},
    create: true,
    mdmsRes: {},
    setOpen: false,
    bookingVenue: "",
    lockedDate: "",
    id: "",

  }

  async handleSubmit() {
    var reqBody = {


      "commercialGrndAvailabilityLock": [

        {

          id: this.state.id,
          bookingVenue: this.state.updateData.residentialCommercial,
          locked: false,
          fromDate: this.state.lockedDate


        }

      ]
    }
    const responseStatus = await httpRequest(

      "bookings/commercial/ground/updateAvailability/_lock",
      "_search",
      [],
      reqBody
    );
    if (responseStatus.status == '200') {
      this.props.toggleSnackbarAndSetText(
        true,
        {
          labelName: "Date unlocked Successfully",
          labelKey: `Date unlocked Successfully`
        },
        "success"
      );
    } else {
      this.props.toggleSnackbarAndSetText(
        true,
        {
          labelName: "Create Failed.Try Again",
          labelKey: `Create Failed.Try Again`
        },
        "error"
      );
    }

    this.props.handleClose()
  }


  render() {
    const { classes } = this.props


    return (
      //Object.keys(this.state.updateData).length === 0?<div > <CircularProgress style={{position: "fixed" , top: '50%', left: '50%'}} /> </div> :

      <div>
        <Dialog
          classes={{ paper: classes.dialogStyle }}
          minWidth="md"
          open={this.props.open}
          onClose={this.props.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Unlock Reserved Dates</DialogTitle>

          <DialogContent>
            <div className="col-xs-12 col-sm-6">Booking Venue: {this.state && this.state.bookingVenue}</div>
            <div className="col-xs-12 col-sm-6">Locked Date: {this.state && this.state.lockedDate}</div>
          </DialogContent>

          <DialogActions>
            <Button label="Cancel" onClick={() => {
              this.props.handleClose()
              this.setState({ errors: {} })
            }} color="secondary" />

            <Button label="Unlock" onClick={() => { this.handleSubmit() }} primary={true} />

          </DialogActions>
        </Dialog>

      </div>


    )
  }
}






const mapStateToProps = (state, ownProps) => {
  console.log(state, "Nero mapStateProps")
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  return { preparedFinalObject }
}



const mapDispatchToProps = dispatch => {
  return {
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)),

    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),

  };
};


export default (connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(DialogComponent)))
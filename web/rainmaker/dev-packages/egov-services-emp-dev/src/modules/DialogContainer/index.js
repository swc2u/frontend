import React from "react";
import { connect } from "react-redux";
import get from "lodash/get";
import { Dialog, DialogContent } from "@material-ui/core";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  root: {
    margin: 0,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
const DialogTitle = withStyles(styles)((props) => {
	const { children, classes, onClose, ...other } = props;
	return (
		<MuiDialogTitle>
            <Typography variant="h6">{children}</Typography>
			{onClose ? (
				<IconButton aria-label="close" onClick={onClose} className={classes.closeButton} >
					<CloseIcon />
				</IconButton>
			) : null}
		</MuiDialogTitle>
	);
});



class DialogContainer extends React.Component {
  handleClose = () => {
    

  };
  componentDidMount() {
   
  }
  render() {
    const { toggle, maxWidth, children, togglepopup,actionTittle } = this.props;
    return (
      <Dialog open={toggle} maxWidth={maxWidth} onClose={togglepopup} fullWidth={true}>
        <DialogTitle id="customized-dialog-title" onClose= {togglepopup}>
        {actionTittle}
        </DialogTitle>
        <DialogContent children={children} />
      </Dialog>
    );
  }
}
export default DialogContainer;
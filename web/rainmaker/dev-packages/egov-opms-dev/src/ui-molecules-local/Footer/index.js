import React from "react";
import { connect } from "react-redux";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import MenuButton from "egov-ui-framework/ui-molecules/MenuButton";
import isEmpty from "lodash/isEmpty";
import "./index.css";

class Footer extends React.Component {
  state = {
    open: false
  };

  onClose = () => {
    this.setState({
      open: false
    });
  };

  renewTradelicence = () => {
    alert('Inside function')
  };
  render() {

    const downloadMenu = []
    const submitButton = {
      label: "Submit",
      labelKey: "WF_TL_RENEWAL_SUBMIT_BUTTON",
      link: () => {
        this.renewTradelicence();
      }
    };
    downloadMenu && downloadMenu.push(submitButton);
    return (
      <div>
        <Container>
          <Item xs={12} sm={12} className="wf-footer-container">
            <MenuButton data={buttonItems} />
          </Item>
        </Container>
      </div>
    );
  }
}


const buttonItems = {
  label: { labelName: "Take Action", labelKey: "WF_TAKE_ACTION" },
  rightIcon: "arrow_drop_down",
  props: {
    variant: "outlined",
    style: {
      marginRight: 15,
      backgroundColor: "#FE7A51",
      color: "#fff",
      border: "none",
      height: "60px",
      width: "200px"
    }
  },
  menu: downloadMenu
};

const mapStateToProps = state => {
  return { state };
};

const mapDispatchToProps = dispatch => {
  return {
    setRoute: url => dispatch(setRoute(url))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);

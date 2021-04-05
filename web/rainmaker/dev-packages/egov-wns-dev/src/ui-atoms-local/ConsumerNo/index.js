import React from "react";
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import { connect } from "react-redux";
const styles = {
  backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
  color: "rgba(255, 255, 255, 0.8700000047683716)",
  marginLeft: "8px",
  paddingLeft: "19px",
  paddingRight: "19px",
  textAlign: "center",
  verticalAlign: "middle",
  lineHeight: "35px",
  fontSize: "16px"
};

function ConsumerNoContainer(props) {
  const { number } = props;
  //let state = this.state;
  return <div style={styles}><LabelContainer labelKey="WS_COMMON_CONSUMER_NO_LABEL" />: {number} </div>;
}
// class  ConsumerNoContainer extends React.Component {
//   render() {
//     const { preparedFinalObject } = this.props;
//     let number='';
//     if(preparedFinalObject)
//     {
//       const { WaterConnection } = preparedFinalObject;
//       if(WaterConnection && WaterConnection[0])
//       {
//         number =  WaterConnection[0].connectionNo;    
//         return <div style={styles}><LabelContainer labelKey="WS_COMMON_CONSUMER_NO_LABEL" />: {number} </div>;
//       }
      
      

//     }
    
//   }
// }


// const mapStateToProps = state => {
//   const { screenConfiguration } = state;
//   const { preparedFinalObject } = screenConfiguration;
//   return {  preparedFinalObject };
// };
// const mapDispatchToProps = (dispatch) => {
//   return {
//     prepareFinalObject: (path, value) =>
//       dispatch(prepareFinalObject(path, value)),
//     toggleSnackbar: (open, message, variant) =>
//       dispatch(toggleSnackbar(open, message, variant)),
//     setRoute: route => dispatch(setRoute(route))
//   };
// };
//export default  connect(mapStateToProps, mapDispatchToProps)(ConsumerNoContainer) ;
export default ConsumerNoContainer;

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import PlotArea from "./plotArea";
import { withStyles } from "@material-ui/core/styles";
import CC from "./Sector 39_CG1731_Photo.jpg";
import Park from "./park11.jpeg";
const styles = (theme) => ({

  root: {
    "&::-webkit-scrollbar": {
      display: "none"
    }
  }
});

class BookingMedia extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const handleImageLoaded = () => {
      console.log("image loaded");
    };
    const {
      masterDataPCC,
      availabilityCheckData,
      pacc_image_initial_path,
      one,
      changeCalendar,
      handleCalAfterImage,
      mediaStyle
    } = this.props;
    console.log("propsOfMediaFile--", this.props);

    // let
    let pacc_image =
      "No data found in selected Locality. Please select other Locality";
    let masterDataExists = 0;
    if (masterDataPCC.length > 0) {
      masterDataExists = 1;
      pacc_image = pacc_image_initial_path + "/" + masterDataPCC[0].imagePath;
    }

    return (
      <div className="imageMap"  {...mediaStyle}>
        <img
          id="imageMap-pccMaps"
          src={`${pacc_image}`}
          onLoad={handleCalAfterImage}
          // src={`${
          //     availabilityCheckData.bkBookingType === "Parks"
          //         ? "https://zfunds3.s3.ap-south-1.amazonaws.com/park11.jpeg"
          //         : CC
          // }`}
          // src={`https://zfunds3.s3.ap-south-1.amazonaws.com/${masterDataPCC[0].imagePath}`}
          // border="0"
          useMap="#pccMaps"
          alt=""
        />
        <map name="pccMaps" id="pccMaps">
          <PlotArea
            changeCalendar={changeCalendar}
            masterDataPCC={masterDataPCC}
            availabilityCheckData={availabilityCheckData}
          />
        </map>
      </div>
    );
  }
}

export default (withStyles(styles)(BookingMedia));

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import PlotArea from "./plotArea";
import { withStyles } from "@material-ui/core/styles";
import CC from "./Sector 39_CG1731_Photo.jpg";
import Park from "./park11.jpeg";
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import Button from "@material-ui/core/Button";
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

  ZoomIn=()=> {
    this.Zoom(1.1);
  }

  ZoomOut=()=> {
    this.Zoom(0.9);
  }

  Zoom=(amount)=> {
    this.setState({called : true})
    // resize image
    var image = document.getElementById("imageMap-pccMaps");
    image.width =image.width * amount;
    // resize image map
    var map = document.getElementById("pccMaps");
    for (var i = 0; i < map.areas.length; i++) {
      var area = map.areas[i];
      var coords = area.coords.split(",");
      for (var j = 0; j < coords.length; j++) {
        coords[j] = coords[j] * amount;
      }
      area.coords =
        coords[0] +
        "," +
        coords[1] +
        "," +
        coords[2] 
    }
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
          // onLoad={handleCalAfterImage}
          // src={`${
          //     availabilityCheckData.bkBookingType === "Parks"
          //         ? "https://zfunds3.s3.ap-south-1.amazonaws.com/park11.jpeg"
          //         : CC
          // }`}
          // src={`https://zfunds3.s3.ap-south-1.amazonaws.com/${masterDataPCC[0].imagePath}`}
          // border="0"
          useMap="#pccMaps"
          alt=""
          onLoad={()=>{
            handleCalAfterImage()
       
            var image2 = document.getElementById("imageMap-pccMaps");
                        if(window.innerWidth<700){
                          this.Zoom((window.innerWidth-parseInt(50))/image2.naturalWidth)
           
                        }
                        }}
                         />
        <map name="pccMaps" id="pccMaps">
          <PlotArea
            changeCalendar={changeCalendar}
            masterDataPCC={masterDataPCC}
            availabilityCheckData={availabilityCheckData}
          />
        </map>
        <div style={{display : 'flex' ,justifyContent : "flex-end"}}> 
                
                <Button className="zoomButton btn-sm" style={{minWidth :"0px", color : "grey", padding : "4px"}} onClick={() => this.ZoomIn()}><ZoomInIcon  /></Button>
                <Button className="zoomButton btn-sm" style={{minWidth :"0px", color : "grey", padding : "4px"}} onClick={() => this.ZoomOut()}>
                <ZoomOutIcon /></Button>
            </div>
                <style>
                {`
                
                @media only screen and (min-width: 600px) {
                    .zoomButton{
                        
                            visibility: hidden;
                        
                    }
                }
                `}
            </style>
      </div>
    );
  }
}

export default (withStyles(styles)(BookingMedia));

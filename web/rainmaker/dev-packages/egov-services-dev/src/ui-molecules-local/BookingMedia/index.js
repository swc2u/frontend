import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import PlotArea from "./plotArea";
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import Button from "@material-ui/core/Button";
import CC from "./Sector 39_CG1731_Photo.jpg";
import Park from "./park11.jpeg";

import {
    prepareFinalObject,
    toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
class BookingMedia extends React.Component {
    state={
        clickableImage:'100%',
        called : false,
    }
    constructor(props) {

        super(props);
        this.sam= React.createRef()
    }
    
    // componentDidUpdate(){
    //     ImageMap('img[usemap]')
    //     // if(this.props.imageWidth && this.props.imageWidth!== this.state.clickableImage){
    //     //     this.setState({clickableImage : this.props.imageWidth})
    //     //     this.props.prepareFinalObject("imageWidth",'')
    //     //    }
    //      }
         

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
        const { masterDataPCC, availabilityCheckData, pacc_image_initial_path } = this.props;
        let pacc_image = 'No data found in selected Locality. Please select other Locality';
        let masterDataExists = 0;
        if (masterDataPCC.length > 0) {
            masterDataExists = 1;
            pacc_image = pacc_image_initial_path + "/" + masterDataPCC[0].imagePath;
        }
        return (
            <div>
            <div style={{ "overflowX": "auto" }}>
                <div style={{ "textAlign": "center", "fontSize": "large", "marginBottom": "20px" }} >Select venue from below picture</div>
                                
                    <img
                    ref= {this.sam}
                    id="imageMap-pccMaps"
                    src={`${pacc_image

                        }`}
                    // src={`https://zfunds3.s3.ap-south-1.amazonaws.com/${masterDataPCC[0].imagePath}`}
                    // border="0"
                    useMap="#pccMaps"
                    alt=""
                    style={{
                      //  maxWidth : "100%"
                     //  width :this.state.called? "": "100%"
                    }}
                    // style={{
                    //     maxWidth : this.state.clickableImage
                    // }}
                    //onClick={()=>{this.setImageMap()}}
                   // onClick ={()=>{this.setState({clickableImage : "fit-content"})}}
                   onLoad={()=>{
                    var image2 = document.getElementById("imageMap-pccMaps");
                                if(window.innerWidth<700){
                                    this.Zoom((window.innerWidth-parseInt(80))/image2.naturalWidth)
                   
                                }
                                }}
                />
                <map name="pccMaps" id="pccMaps">
                    <PlotArea
                        masterDataPCC={masterDataPCC}
                        availabilityCheckData={availabilityCheckData}
                    />
                </map>
            </div>
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
const mapStateToProps = (state) => {
    if (state.screenConfiguration.preparedFinalObject.applyScreenMdmsData.Booking && state.screenConfiguration.preparedFinalObject.applyScreenMdmsData.Booking.Booking_Config) {
        return {

            pacc_image_initial_path: state.screenConfiguration.preparedFinalObject.applyScreenMdmsData.Booking.Booking_Config[0].Value,
            imageWidth : state.screenConfiguration.preparedFinalObject.imageWidth
        }

    } else {
        return null;
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        prepareFinalObject: (jsonPath, value) =>
            dispatch(prepareFinalObject(jsonPath, value)),
        changeRoute: (path) => dispatch(setRoute(path)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingMedia);

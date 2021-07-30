import React, { Component } from "react";
//import { MultiDownloadCard } from "../../ui-molecules-local";
import { MultiDownloadCard } from "egov-ui-framework/ui-molecules";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import classNames from "classnames";
import Button from "@material-ui/core/Button";
import { LabelContainer } from "../LabelContainer";
import { connect } from "react-redux";
import get from "lodash/get";
import {
  
  getQueryArg,
} from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import  {delectDocument} from "../../ui-utils/commons";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import "./index.scss";

const themeStyles = theme => ({
  iconDiv: {
    display: "flex",
    alignItems: "center"
  },
});
const styles = {
  whiteCard: {
    maxWidth: 250,
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
class DownloadFileContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      photoIndex: 0,
      isOpen: false,
    };
  }

  toggleLightBox = () => {
    this.setState({ isOpen: !this.state.isOpen })
  }

  deleteDocument = async (remDocIndex) => {
    const { prepareFinalObject, documentsUploadRedux , data} = this.props;
   // alert('i am at delete')
    console.log(this.props);
    let service_request_id = getQueryArg(window.location.href, "applicationNumber");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    let payload =[
      {
        service_request_id:service_request_id,
        tenantId:tenantId,
        fileStoreId:remDocIndex.fileStoreId
        // media:[
        //   remDocIndex.fileStoreId
        // ]
      }
    ]
    try{
   const fileUrl = await delectDocument(payload);
  let  data_Temp = data.filter(x=>x.fileStoreId !== remDocIndex.fileStoreId )
   prepareFinalObject("documentsPreview", data_Temp);
    }
    catch (exception) {
      alert('Some Error Occured while Deleting!');
  }
   

  }
  render() {
    const { classes,data, documentData, ...rest } = this.props;
  
    const { photoIndex, isOpen } = this.state;
    // return (
    //   <MultiDownloadCard data={data} documentData={documentData} {...rest} /> 
    // );
    return(
      <div style={{display:"flex"}}>
        {
          data&&(
            data.map((item,i)=>{
              return (
                <Grid
                item ={true}
                container
                xs={12}
                sm={4}
                style={{
                  maxWidth: 250,
                  backgroundColor: "#FFFFFF",
                  paddingLeft: 8,
                  paddingRight: 0,
                  paddingTop: 11,
                  paddingBottom: 0,
                  marginRight: 10,
                  marginTop: 16
                }}
                >
                 
                  <div style={documentTitle}>
                  {item.title}
                  </div>
                 
                  {/* {item.name} */}
                  <div>
                  <Typography style={{wordWrap: "break-word",wordBreak: "break-all", maxWidth: 200,}}>{item.name}</Typography>
                  </div>
                  <div style={{display:"flex"}}>
                    <div><Button href={item.link} color="primary">
                  Download
                </Button></div>

                    {/* Code Change SD */}
                    
                    {/* <img 
                    src={item.link}
                    alt="new"
                    /> */}
                    <div><Button type="button" color="primary" 
                    onClick={this.toggleLightBox}>
                      Preview
                    </Button></div>
                    {isOpen && (
                      <Lightbox
                          // mainSrc={'https://chstage.blob.core.windows.net/fileshare/ch/egov-hc/July/28/1627455070683Screenshot (6).png?sig=zGeiNX8QgWkVZLZF7seEK2tmMg4Sil9Hk5JNQ7Su50o%3D&st=2021-07-28T18%3A54%3A41Z&se=2021-07-29T18%3A54%3A41Z&sv=2016-05-31&sp=r&sr=b'}
                          mainSrc={item.link}
                          // nextSrc={images[(photoIndex + 1) % images.length]}
                          // prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                          onCloseRequest={() => this.setState({ isOpen: false })}
                          // onMovePrevRequest={() =>
                          //   this.setState({
                          //     photoIndex: (photoIndex + images.length - 1) % images.length,
                          //   })
                          // }
                          // onMoveNextRequest={() =>
                          //   this.setState({
                          //     photoIndex: (photoIndex + 1) % images.length,
                          //   })
                          // }
                        />
                    )}
                    <div> 
                      
                      {
                      item.IsDelete &&<Button   onClick={() => this.deleteDocument(item)} color="primary">
                      Delte
                      </Button>
                      }
                      
                
                </div>
                  
                  </div>
                 
                  {/* <Grid xs={12}>
              <LabelContainer
                labelName={item.title}
                labelKey={item.title}
                style={{
                  color: "rgba(0, 0, 0, 0.87)",
                  fontFamily: "Roboto",
                  fontSize: "16px",
                  fontWeight: 400,
                  letterSpacing: "0.67px",
                  lineHeight: "19px",
                  wordWrap: "break-word"
                  // wordBreak: "break-all"
                }}
              />
            </Grid> */}
            {/* <Grid container>
              <Grid xs={6} style={{ paddingTop: 7}}>
                <Typography style={{wordWrap: "break-word",wordBreak: "break-all"}}>{item.name}</Typography>
              </Grid>
              <Grid xs={6} align="right">
                <Button href={item.link} color="primary">
                  Download
                </Button>
              </Grid>
            </Grid> */}
              
                </Grid>
                    
                // <div xs={12}
                // sm={4}>
                //  {item.title}
                //   </div>
              )

            }
            )
          )
        }
        
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { screenConfiguration } = state;
  const data = ownProps.data
    ? ownProps.data
    : get(screenConfiguration.preparedFinalObject, ownProps.sourceJsonPath, []);
  return { data ,screenConfiguration};
};
const mapDispatchToProps = dispatch => {
  return {
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,  
)(DownloadFileContainer);

// export default withStyles(themeStyles)(
//   connect(
//     mapStateToProps,
//    // mapDispatchToProps
//   )(DownloadFileContainer)
// );

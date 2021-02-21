
import { Card, CardContent, Grid, Typography, Button } from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import HistoryIcon from "@material-ui/icons/History";
import { withStyles } from "@material-ui/core/styles";
import {
  LabelContainer,
  TextFieldContainer
} from "egov-ui-framework/ui-containers";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getFileUrlFromAPI,
  handleFileUpload,
  getTransformedLocale
} from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { UploadSingleFile,DocumentDialog } from "../../ui-molecules-local";

const themeStyles = theme => ({
  documentContainer: {
    backgroundColor: "#F2F2F2",
    padding: "16px",
    marginTop: "10px",
    marginBottom: "16px"
  },
  documentCard: {
    backgroundColor: "#F2F2F2",
    padding: "16px",
    marginTop: "10px",
    marginBottom: "16px"
  },
  documentSubCard: {
    backgroundColor: "#F2F2F2",
    padding: "16px",
    marginTop: "10px",
    marginBottom: "10px",
    border: "#d6d6d6",
    borderStyle: "solid",
    borderWidth: "1px"
  },
  documentIcon: {
    backgroundColor: "#FFFFFF",
    borderRadius: "100%",
    width: "36px",
    height: "36px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "rgba(0, 0, 0, 0.8700000047683716)",
    fontFamily: "Roboto",
    fontSize: "20px",
    fontWeight: 400,
    letterSpacing: "0.83px",
    lineHeight: "24px"
  },
  documentSuccess: {
    borderRadius: "100%",
    width: "36px",
    height: "36px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#39CB74",
    color: "white"
  },
  button: {
    margin: theme.spacing.unit,
    padding: "8px 38px"
  },
  input: {
    display: "none"
  },
  iconDiv: {
    display: "flex",
    alignItems: "center"
  },
  descriptionDiv: {
    display: "flex",
    alignItems: "center"
  },
  formControl: {
    minWidth: 250,
    padding: "0px"
  },
  fileUploadDiv: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingTop: "5px"
  }
});

const styles = {
  documentTitle: {
    color: "rgba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
    fontSize: "16px",
    fontWeight: 500,
    letterSpacing: "0.67px",
    lineHeight: "19px",
    paddingBottom: "5px"
  },
  documentName: {
    color: "rgba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
    fontSize: "16px",
    fontWeight: 400,
    letterSpacing: "0.67px",
    lineHeight: "19px"
  },
  dropdownLabel: {
    color: "rgba(0, 0, 0, 0.54)",
    fontSize: "12px"
  }
};

const requiredIcon = (
  <sup style={{ color: "#E54D42", paddingLeft: "5px" }}>*</sup>
);

class DocumentList extends Component {
  state = {
    uploadedDocIndex: 0,
    open: false,
    documentIndex:0
  };
  //for doc history

 

  handleViewHistory = (container) => {
   // alert(index)
   console.log(container)
   console.log("container")
   let index =0
   if(this.props.documentsList)
   {
    index= this.props.documentsList.indexOf(container);
   }
    
this.setState({
  documentIndex:index,
  open:true
});
  //  this.props.documentsList.forEach( element => {
  //   if(element == container){
  //     this.setState({
  //       open: true
  //     });
  //   }
  //   else
  //   {
  //     this.setState({
  //       open: false
  //     });

  //   }
  //})
  //  if(this.props.documentsList[0])
  //  {
    
  //  }
    
  };

  handleDialogClose = () => {
    this.setState({
      open: false
    });
  };

  componentDidMount = () => {
    const {
      documentsList,
      documentsUploadRedux = {},
      prepareFinalObject
    } = this.props;
    let index = 0;
    documentsList.forEach(docType => {
      docType.cards &&
        docType.cards.forEach(card => {
          if (card.subCards) {
            card.subCards.forEach(subCard => {
              let oldDocType = get(
                documentsUploadRedux,
                `[${index}].documentType`
              );
              let oldDocCode = get(
                documentsUploadRedux,
                `[${index}].documentCode`
              );
              let oldDocSubCode = get(
                documentsUploadRedux,
                `[${index}].documentSubCode`
              );
              if (
                oldDocType != docType.code ||
                oldDocCode != card.name ||
                oldDocSubCode != subCard.name
              ) {
                documentsUploadRedux[index] = {
                  documentType: docType.code,
                  documentCode: card.name,
              isDocumentRequired:card.required,
                  documentSubCode: subCard.name
                };
              }
              index++;
            });
          } else {
            let oldDocType = get(
              documentsUploadRedux,
              `[${index}].documentType`
            );
            let oldDocCode = get(
              documentsUploadRedux,
              `[${index}].documentCode`
            );
            if (oldDocType != docType.code || oldDocCode != card.name) {
              documentsUploadRedux[index] = {
                documentType: docType.code,
                documentCode: card.name,
                isDocumentRequired: card.required,
                isDocumentTypeRequired: card.dropdown
                  ? card.dropdown.required
                  : false
              };
            }
          
            index++;
          }
        });
    });
    prepareFinalObject("documentsUploadRedux", documentsUploadRedux);
   
  };

  onUploadClick = uploadedDocIndex => {
    this.setState({ uploadedDocIndex });
  };

  handleDocument = async (file, fileStoreId) => {
    let { uploadedDocIndex } = this.state;
    const { prepareFinalObject, documentsUploadRedux } = this.props;
    const fileUrl = await getFileUrlFromAPI(fileStoreId);

    prepareFinalObject("documentsUploadRedux", {
      ...documentsUploadRedux,
      [uploadedDocIndex]: {
        ...documentsUploadRedux[uploadedDocIndex],
        documents: [
          {
            fileName: file.name,
            fileStoreId,
            fileUrl: Object.values(fileUrl)[0],
            fileIndex:uploadedDocIndex
          }//
        ]
      }
    });
  };

  removeDocument = remDocIndex => {
    const { prepareFinalObject } = this.props;
    prepareFinalObject(
      `documentsUploadRedux.${remDocIndex}.documents`,
      undefined
    );
    this.forceUpdate();
  };

  handleChange = (key, event) => {
    const { documentsUploadRedux, prepareFinalObject } = this.props;
    if(event.target.value.length<=250)
    {   
    prepareFinalObject(`documentsUploadRedux`, {
      ...documentsUploadRedux,
      [key]: {
        ...documentsUploadRedux[key],
        dropdown: { value: event.target.value }
      }
    });
  }
  };

  getUploadCard = (card, key) => {
    const { classes, documentsUploadRedux,ProcessInstances } = this.props;
    let jsonPath = `documentsUploadRedux[${key}].dropdown.value`;
    return (
      //  <div>
      //    {
      // <Card className="">
      //   <CardContent>
      //     <Container
      //       children={
      // <div style={{ width: "100%" }}>
      <Grid container={true}>
        <Grid item={true} xs={2} sm={1} className={classes.iconDiv}>
          {(documentsUploadRedux[key] && documentsUploadRedux[key].documents)||  card.url.length>0 ? (
            <div className={classes.documentSuccess}>
              
              <Icon>
                <i class="material-icons">done</i>
              </Icon>
            </div>
          ) : (
            <div className={classes.documentIcon}>
              <span>{key + 1}</span>
            </div>
          )}
        </Grid>
        
        <Grid item={true} xs={6} sm={6} md={4}>
          {card.documentComment && (
            <TextFieldContainer
            select={false}
            label={{ labelKey: getTransformedLocale("comment") }}
            placeholder={{ labelKey: "comment" }}
            // data={card.dropdown.menu}
            // optionValue="code"
            // optionLabel="label"           
            shrink={true}
            required={false}
            disabled={!card.documentComment}           
            onChange={event => this.handleChange(key, event)}
            jsonPath={jsonPath}
          />
          )}
        </Grid>
       
        <Grid
          item={true}
          xs={12}
          sm={12}
          md={3}
          className={classes.fileUploadDiv}
        >
          <UploadSingleFile
            classes={this.props.classes}
            handleFileUpload={e =>
              handleFileUpload(e, this.handleDocument, this.props)
            }
            uploaded={
              documentsUploadRedux[key] && documentsUploadRedux[key].documents ||!card.documentsUpload
                ? true
                : false
            }
            disabled={!card.documentsUpload}
            removeDocument={() => this.removeDocument(key)}
            documents={
              documentsUploadRedux[key] && documentsUploadRedux[key].documents
            }
            onButtonClick={() => this.onUploadClick(key)}
            inputProps={this.props.inputProps}
            buttonLabel={this.props.buttonLabel}
          />
        </Grid>
        <Grid  item={true}
          xs={12}
          sm={12}
          md={3} align="right">
            {
               card.url.length>0 &&(
                <Button href={card.url} color="primary">
                   <LabelContainer
                          labelName="Download"
                          labelKey="PENSION_DOCUMENT_VIEW_DOWNLOAD"
                          color="#FE7A51"/>
                
              </Button>
              )
            }         
             
               
              </Grid>
             
                 
      </Grid>
      
       
  
    
    );
  };

  render() {
    const { classes, documentsList } = this.props;
    let index = 0;
    return (
      <div>
        {documentsList &&
          documentsList.map((container,index) => {
            return (
              <div>
                <div style={{ width: "100%" }}>
                <Grid container="true" spacing={12} marginTop={16}>
                <Grid
                      style={{ alignItems: "center", display: "flex" }}
                      item
                      sm={6}
                      xs={6}
                    >
                      <Typography component="h2" variant="subheading">
                <LabelContainer
                  labelKey={getTransformedLocale(container.title)}
                  style={styles.documentTitle}
                />
                 {container.required && requiredIcon}
                 </Typography>
                    </Grid>
                    <Grid item sm={6} xs={6} style={{ textAlign: "right" }}>
                 {
              
              <Button color="primary"
               className={classes.button}
               onClick={() => this.handleViewHistory(container)}
             >
               <HistoryIcon className={classes.leftIcon} />
               <LabelContainer
                          labelName="VIEW HISTORY"
                          labelKey="PENSION_DOCUMENT_UPLOAD_VIEW_HISTORY"
                          color="#FE7A51"
                        />
              
             </Button>
           }
           </Grid>
            </Grid>
                 </div>
                 
                <div>
                <Grid  item={true}
          xs={12}
          sm={12}
          md={3} align="right">
                {/* {
                  container.url.length>0 &&
                 (
              <DocumentDialog
              open={this.state.open}
              onClose={this.handleDialogClose}
              history={container.documentAudit}
              //key={index}
            />
                 )
            }  */}
             </Grid>
                  </div>
                  {
                  <DocumentDialog
                  open={this.state.open}
                  documentIndex={this.state.documentIndex}
                  onClose={this.handleDialogClose}
                  history={container} 

                  documentList ={this.props.documentsList}             
                />
                }
                  
                 
                {container.cards.map(card => {
                  return (
                    <div className={classes.documentContainer}>
                      
                      {card.hasSubCards && (
                        <LabelContainer
                          labelKey={card.title}
                          style={styles.documentTitle}
                        />
                       
                        
                      )}
                     
                      {card.hasSubCards &&
                        card.subCards.map(subCard => {
                          return (
                            <div className={classes.documentSubCard}>
                              {this.getUploadCard(subCard, index++)}
                              
                            </div>

                          );
                        })}
                      {!card.hasSubCards && (
                        <div>{this.getUploadCard(card, index++)}</div>
                      )}
                      
                    </div>
                  );
                })}
               
              </div>
            );
          })}
           {/* {
                documentsList &&
                (
             <DocumentDialog
             open={this.state.open}
             onClose={this.handleDialogClose}
             history={documentsList[0]}
            // Idx={index}
             
           />
                )  
              }  */}
      </div>
    );
  }
}

DocumentList.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  const { screenConfiguration } = state;
  const { moduleName } = screenConfiguration;
  const documentsUploadRedux = get(
    screenConfiguration.preparedFinalObject,
    "documentsUploadRedux",
    {}
  );
  return { documentsUploadRedux, moduleName };
};

const mapDispatchToProps = dispatch => {
  return {
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value))
  };
};

export default withStyles(themeStyles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DocumentList)
);

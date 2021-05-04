import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import { withStyles } from "@material-ui/core/styles";
import { Tabs, Card, TextField, Button } from "components";
import {
    LabelContainer,
    TextFieldContainer,
} from "egov-ui-framework/ui-containers";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
    getFileUrlFromAPI,
    handleFileUpload,
    getTransformedLocale,
} from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import Label from "egov-ui-kit/utils/translationNode";
import UploadSingleFile from "../UploadSingleFile";
import "./index.css";

import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
const themeStyles = (theme) => ({
    documentContainer: {
        backgroundColor: "#F2F2F2",
        padding: "16px",
        marginTop: "10px",
        marginBottom: "16px",
    },
    documentCard: {
        backgroundColor: "#F2F2F2",
        padding: "16px",
        marginTop: "10px",
        marginBottom: "16px",
    },
    documentSubCard: {
        backgroundColor: "#F2F2F2",
        padding: "16px",
        marginTop: "10px",
        marginBottom: "10px",
        border: "#d6d6d6",
        borderStyle: "solid",
        borderWidth: "1px",
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
        lineHeight: "24px",
    },
    documentSuccess: {
        borderRadius: "100%",
        width: "36px",
        height: "36px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#39CB74",
        color: "white",
    },
    button: {
        margin: theme.spacing.unit,
        padding: "8px 38px",
    },
    input: {
        display: "none",
    },
    iconDiv: {
        display: "flex",
        alignItems: "center",
    },
    descriptionDiv: {
        display: "flex",
        alignItems: "center",
    },
    formControl: {
        minWidth: 250,
        padding: "0px",
    },
    fileUploadDiv: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingTop: "5px",
    },
    button: {
        margin: theme.spacing.unit,
        padding: "8px 38px"
    },
    input: {
        display: "none !important"
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
        paddingBottom: "5px",
    },
    documentName: {
        color: "rgba(0, 0, 0, 0.87)",
        fontFamily: "Roboto",
        fontSize: "16px",
        fontWeight: 400,
        letterSpacing: "0.67px",
        lineHeight: "19px",
    },
    dropdownLabel: {
        color: "rgba(0, 0, 0, 0.54)",
        fontSize: "12px",
    },
};

const requiredIcon = (
    <sup style={{ color: "#E54D42", paddingLeft: "5px" }}>*</sup>
);

class DocumentList extends Component {

    state = {
        open: false, setOpen: false,
        idProffType:'Discount_Document',
        uploadedDocIndex: 0,
        discountDocumentsUploadRedux: [
            {
                documentCode: "BK_DOC.DOC_DISCOUNT_PICTURE",
                documentType: "DOC",
                isDocumentRequired: false,
                isDocumentTypeRequired: false,
                mendatoryDoc: false,
                mydocstate: false
            }
        ]
    };
    onbookingChange = e => {
        const inputValue = e.target.value;
        this.setState({ idProffType: inputValue });
console.log('this.state.idProffType',this.state.idProffType);
    }

    handleClose = () => {
        this.setState({
          setOpen: false
        })
      };

      handleOpen = () => {
        this.setState({
          setOpen: true
        })
      };

    // docTypeConfig ={"":"","BK_PCC_DISCOUNT_DOCUMENT":"Discount_Document"}

    componentDidMount = () => {
        const {
            documentsList, buttonLabel, description, inputProps, maxFileSize, documentsUploadReduxOld, discountDocumentsUploadRedux, handleChange,
            prepareFinalObject
        } = this.props;
        let index = 0;

        let docTypeConfig ={"":"","BK_PCC_DISCOUNT_DOCUMENT":"Discount_Document"}

        let docTypeDrop = get(discountDocumentsUploadRedux, `[${index}].documentCode`,"");
        this.setState({ idProffType:docTypeConfig[docTypeDrop] });
        console.log("doctyp----",docTypeDrop)

        documentsList.forEach((docType) => {
            console.log("doctyyype----",docType)
            docType.cards &&
                docType.cards.forEach((card) => {
                    if (card.subCards) {
                        card.subCards.forEach((subCard) => {
                            let oldDocType = get(
                                discountDocumentsUploadRedux,
                                `[${index}].documentType`
                            );
                            let oldDocCode = get(
                                discountDocumentsUploadRedux,
                                `[${index}].documentCode`
                            );
                            let oldDocSubCode = get(
                                discountDocumentsUploadRedux,
                                `[${index}].documentSubCode`
                            );
                            let oldDocuments=get(
                                discountDocumentsUploadRedux,
                                `[${index}].documents[0]`
                              );
                            if (
                                oldDocType != docType.code ||
                                oldDocCode != card.name ||
                                oldDocSubCode != subCard.name
                            ) {
                                if(oldDocuments){
                                    let newDocumentData = {
                                        documentType: docType.code,
                                        documentCode: card.name,
                                        isDocumentRequired: card.required,
                                        isDocumentTypeRequired: card.dropdown
                                            ? card.dropdown.required
                                            : false,
                                        mydocstate: false,
                                        documents: [oldDocuments]
                                    };
        
                                    discountDocumentsUploadRedux[index] = { ...newDocumentData };
                                }else{
                                    let newDocumentData = {
                                        documentType: docType.code,
                                        documentCode: card.name,
                                        isDocumentRequired: card.required,
                                        isDocumentTypeRequired: card.dropdown
                                            ? card.dropdown.required
                                            : false,
                                        mydocstate: false
                                    };
        
                                    discountDocumentsUploadRedux[index] = { ...newDocumentData };
                                }
                            }
                            index++;
                        });
                    } else {
                        let oldDocType = get(
                            discountDocumentsUploadRedux,
                            `[${index}].documentType`
                        );
                        let oldDocCode = get(
                            discountDocumentsUploadRedux,
                            `[${index}].documentCode`
                        );
                        let oldDocuments=get(
                            discountDocumentsUploadRedux,
                            `[${index}].documents[0]`
                          );
                        if (
                            oldDocType != docType.code ||
                            oldDocCode != card.name
                        ) {

                            if(oldDocuments){
                                let newDocumentData = {
                                    documentType: docType.code,
                                    documentCode: card.name,
                                    isDocumentRequired: card.required,
                                    isDocumentTypeRequired: card.dropdown
                                        ? card.dropdown.required
                                        : false,
                                    mydocstate: false,
                                    documents: [oldDocuments]
                                };
    
                                discountDocumentsUploadRedux[index] = { ...newDocumentData };
                            }else{
                                let newDocumentData = {
                                    documentType: docType.code,
                                    documentCode: card.name,
                                    isDocumentRequired: card.required,
                                    isDocumentTypeRequired: card.dropdown
                                        ? card.dropdown.required
                                        : false,
                                    mydocstate: false
                                };
    
                                discountDocumentsUploadRedux[index] = { ...newDocumentData };
                            }
                        }
                        index++;
                    }
                });
        });
        prepareFinalObject("discountDocumentsUploadRedux", discountDocumentsUploadRedux);

    };

    onUploadClick = (uploadedDocIndex) => {
        const { fetchUploadedDoc, userInfo } = this.props;
        this.setState({ uploadedDocIndex });
    };

    handleDocument = async (file, fileStoreId) => {
        let { uploadedDocIndex } = this.state;
        let documentMap = {};
        const { prepareFinalObject, discountDocumentsUploadRedux, fetchUploadedDoc, userInfo } = this.props;

        documentMap[`${fileStoreId}`] = file.name;

        this.props.prepareFinalObject(
            "documentMap",
            documentMap
        );

        this.setState({
            documentMap: documentMap
        })
        let documentMap2 = [{ fileStoreId: file.name }]

        const fileUrl = await getFileUrlFromAPI(fileStoreId);
        prepareFinalObject("discountDocumentsUploadRedux", {
            ...discountDocumentsUploadRedux,
            [uploadedDocIndex]: {
                ...discountDocumentsUploadRedux[uploadedDocIndex],
                mydocstate: true,
                documents: [
                    {
                        fileName: file.name,
                        fileStoreId,
                        fileUrl: Object.values(fileUrl)[0],
                        mendatoryDoc: true
                    },
                ],
            },
        });


    };

    removeDocument = (remDocIndex) => {
        const { prepareFinalObject } = this.props;

        this.props.prepareFinalObject(
            "documentMap",
            "Document Not Found"
        );
        prepareFinalObject(
            `discountDocumentsUploadRedux.${remDocIndex}.mydocstate`,
            false
        );
        prepareFinalObject(
            `discountDocumentsUploadRedux.${remDocIndex}.documents`,
            undefined
        );
        this.forceUpdate();
    };

    handleChangeTwo = (key, event) => {

        const { discountDocumentsUploadRedux, prepareFinalObject } = this.props;
        if(discountDocumentsUploadRedux === null){
            prepareFinalObject("newBooking",true)
            window.location.href = `/egov-services/all-applications`
            
          }else{
            prepareFinalObject(`discountDocumentsUploadRedux`, {
                ...discountDocumentsUploadRedux,
                [key]: {
                    ...discountDocumentsUploadRedux[key],
                    dropdown: { value: event.target.value },
                },
            });
          
          }
     
    };

    getUploadCard = (card, key) => {

        let { classes, discountDocumentsUploadRedux } = this.props;
        discountDocumentsUploadRedux.documents = discountDocumentsUploadRedux;
        let jsonPath = `discountDocumentsUploadRedux[${key}].dropdown.value`;
        return (
            <div>
                <div>
                    <Label
                        label="BK_MYBK_REQUIRED_DOC_HEADING"
                        color="#000000"
                        fontSize="21px"
                        alignItems="left"
                        labelClassName={"myDOC"}
                    />
                    <Label label="BK_MYBK_DOCUMENT_VALIDATION_MSG"
                    />
                    <Grid container={true}>
                        <Grid item={true} xs={2} sm={1} className={classes.iconDiv}>
                            {discountDocumentsUploadRedux[key] &&
                                discountDocumentsUploadRedux[key].documents ? (
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
                        <Grid
                            item={true}
                            xs={10}
                            sm={5}
                            md={4}
                            align="left"
                            className={classes.descriptionDiv}
                        >
                            <LabelContainer
                                labelKey={getTransformedLocale(card.name)}
                                style={styles.documentName}
                            />
                            {card.required && requiredIcon}
                        </Grid>
                        <Grid item={true}>
                            {card.dropdown && (
                                <TextFieldContainer
                                    select={true}
                                    label={{
                                        labelKey: getTransformedLocale(
                                            card.dropdown.label
                                        ),
                                    }}
                                    placeholder={{ labelKey: card.dropdown.label }}
                                    data={card.dropdown.menu}
                                    optionValue="code"
                                    optionLabel="label"
                                    onChange={(event) => this.handleChange(key, event),
                                        (event) => this.handleChangeTwo(key, event)
                                    }
                                    jsonPath={jsonPath}
                                />
                            )}
                        </Grid>
                        <Grid item={true} md={4}>

                    <FormControl style={{ width: '100%' }}>
                    <InputLabel shrink style={{ width: '100%' }} id="demo-controlled-open-select-proof">Proof Type</InputLabel>
                    <Select
                      maxWidth={false}
                      labelId="demo-controlled-open-select-proof"
                      id="demo-controlled-open-select-label"
                      open={this.state.SetOpen}
                    //   required={true}
                      displayEmpty
                      onClose={() => this.handleClose()}
                      onOpen={() => this.handleOpen()}
                      value={this.state.idProffType}
                      onChange={(e, value) => this.onbookingChange(e)}
                    >
                    <MenuItem  value="" disabled>Select Document</MenuItem>
                     <MenuItem value="Discount_Document">Discount Document</MenuItem>

                    </Select>
                  </FormControl>
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
                                handleFileUpload={(e) =>
                                    handleFileUpload(e, this.handleDocument, this.props)
                                }
                                uploaded={
                                    discountDocumentsUploadRedux[key] &&
                                        discountDocumentsUploadRedux[key].documents
                                        ? true
                                        : false
                                }
                                removeDocument={() => this.removeDocument(key)}
                                documents={
                                    discountDocumentsUploadRedux[key] &&
                                    discountDocumentsUploadRedux[key].documents
                                }
                                onButtonClick={() => this.onUploadClick(key)}
                                inputProps={this.props.inputProps}
                                buttonLabel={this.props.buttonLabel}

                            />
                        </Grid>
                    </Grid>
                    <Grid container={true}>
                <Grid item={true} xs={2} sm={1} md={1}>
                </Grid>
                <Grid
                        item={true}
                        xs={10}
                        sm={5}
                        md={5}
                        align="left"

                    >
                    <div><h5>Supported Documents: pdf, jpg, png. Max file size: 5MB</h5></div>
                    </Grid>
                </Grid>
                </div>



            </div>
        );
    };

    render() {
        const { classes, documentsList, handleChange } = this.props;

        let index = 0;



        return (
            <div>

                <Card
                    textChildren={
                        <div>
                            {documentsList &&
                                documentsList.map((container) => {
                                    return (
                                        <div>
                                            {container.cards.map((card) => {
                                                return (
                                                    <div
                                                        className={
                                                            classes.documentContainer
                                                        }
                                                    >
                                                        {card.hasSubCards && (
                                                            <LabelContainer
                                                                labelKey={card.name}
                                                                style={styles.documentTitle}
                                                            />
                                                        )}
                                                        {card.hasSubCards &&
                                                            card.subCards.map((subCard) => {
                                                                return (
                                                                    <div
                                                                        className={
                                                                            classes.documentSubCard
                                                                        }
                                                                    >
                                                                        {this.getUploadCard(
                                                                            subCard,
                                                                            index++
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        {!card.hasSubCards && (
                                                            <div>
                                                                {this.getUploadCard(
                                                                    card,
                                                                    index++
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                        </div>
                    }
                />
            </div>
        );
    }
}

DocumentList.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    const { complaints, common, auth, form, screenConfiguration, documentMap } = state;
    const { applicationData } = complaints;
    const { DocumentUploadMap } = complaints;
    const { id } = auth.userInfo;
    const { userInfo } = state.auth;
    const { moduleName } = screenConfiguration;
    const discountDocumentsUploadRedux = get(
        screenConfiguration.preparedFinalObject,
        "discountDocumentsUploadRedux",
        {}
    );
    return { discountDocumentsUploadRedux, moduleName, DocumentUploadMap, userInfo, documentMap };
};

const mapDispatchToProps = (dispatch) => {
    return {
        prepareFinalObject: (jsonPath, value) =>
            dispatch(prepareFinalObject(jsonPath, value)),
    };
};

export default withStyles(themeStyles)(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(DocumentList)
);

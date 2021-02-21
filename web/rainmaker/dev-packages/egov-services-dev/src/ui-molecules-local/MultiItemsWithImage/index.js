import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Label from "egov-ui-framework/ui-containers/LabelContainer";
import { withStyles } from "@material-ui/core/styles";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
    getLocalization,
    getLocale,
} from "egov-ui-kit/utils/localStorageUtils";
import CatAIcon from "../../ui-atoms-local/Icons/Cat-A";
import CatBIcon from "../../ui-atoms-local/Icons/Cat-B";
import CatCIcon from "../../ui-atoms-local/Icons/Cat-C";

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

class MultiItemsWithImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadedDocIndex: 0,
        };
    }

    getMessageFromLocalization = (code) => {
        let messageObject = JSON.parse(
            getLocalization(`localization_${getLocale()}`)
        ).find((item) => {
            return item.code == code;
        });
        return messageObject ? messageObject.message : code;
    };

    generateLabelKey = (content, item) => {
        let LabelKey = `${get(item, content.jsonPath, "")}`;
        return LabelKey;
    };

    render() {
        const { classes, BookingDetails, contents, style } = this.props;
        let bookingData = [BookingDetails];
        return (
            <Card style={style}>
                <CardContent>
                    {bookingData &&
                        bookingData.length > 0 &&
                        bookingData.map((item) => {
                            return (
                                <Grid container>
                                    {contents &&
                                        contents.length > 0 &&
                                        contents.map((content) => {
                                            return content.jsonPath ===
                                                "bkCategory" ? (
                                                <Grid
                                                    item
                                                    sm={3}
                                                    xs={12}
                                                    style={{ marginBottom: 12 }}
                                                >
                                                    <Label
                                                        labelKey={this.getMessageFromLocalization(
                                                            content.label
                                                        )}
                                                        style={{
                                                            // fontSize: 14,
                                                            display: "block",
                                                            // marginBottom: 5,
                                                            color:
                                                                "rgba(0, 0, 0, 0.54)",
                                                            fontSize: 12,
                                                            fontWeight: 400,
                                                            lineHeight:
                                                                "1.375em",
                                                        }}
                                                    />

                                                    <Label
                                                        labelKey={
                                                            this.generateLabelKey(
                                                                content,
                                                                item
                                                            ) === "Cat-A" ? (
                                                                <CatAIcon />
                                                            ) : this.generateLabelKey(
                                                                  content,
                                                                  item
                                                              ) === "Cat-B" ? (
                                                                <CatBIcon />
                                                            ) : (
                                                                <CatCIcon />
                                                            )
                                                        }
                                                        style={{
                                                            color:
                                                                "rgba(0, 0, 0, 0.87)",
                                                            fontSize: 16,
                                                            fontWeight: 400,
                                                            lineHeight: "19px",
                                                            letterSpacing:
                                                                "0.67px",
                                                        }}
                                                    />
                                                </Grid>
                                            ) : (
                                                <Grid
                                                    item
                                                    sm={3}
                                                    xs={12}
                                                    style={{ marginBottom: 12 }}
                                                >
                                                    <Label
                                                        labelKey={this.getMessageFromLocalization(
                                                            content.label
                                                        )}
                                                        style={{
                                                            // fontSize: 14,
                                                            display: "block",
                                                            // marginBottom: 5,
                                                            color:
                                                                "rgba(0, 0, 0, 0.54)",
                                                            fontSize: 12,
                                                            fontWeight: 400,
                                                            lineHeight:
                                                                "1.375em",
                                                        }}
                                                    />
                                                    <Label
                                                        labelKey={this.generateLabelKey(
                                                            content,
                                                            item
                                                        )}
                                                        style={{
                                                            color:
                                                                "rgba(0, 0, 0, 0.87)",
                                                            fontSize: 16,
                                                            fontWeight: 400,
                                                            lineHeight: "19px",
                                                            letterSpacing:
                                                                "0.67px",
                                                        }}
                                                    />
                                                </Grid>
                                            );
                                        })}
                                </Grid>
                            );
                        })}
                </CardContent>
            </Card>
        );
    }
}

MultiItemsWithImage.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    const { screenConfiguration } = state;
    const { moduleName } = screenConfiguration;
    const BookingDetails = get(
        screenConfiguration.preparedFinalObject,
        "Booking",
        {}
    );
    return { BookingDetails, moduleName };
};

const mapDispatchToProps = (dispatch) => {
    return {
        prepareFinalObject: (jsonPath, value) =>
            dispatch(prepareFinalObject(jsonPath, value)),
    };
};

export default withStyles(themeStyles)(
    connect(mapStateToProps, mapDispatchToProps)(MultiItemsWithImage)
);

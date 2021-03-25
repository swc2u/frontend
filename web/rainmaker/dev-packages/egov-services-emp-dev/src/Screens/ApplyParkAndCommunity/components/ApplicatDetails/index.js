import React, { Component } from 'react';
import { Tabs, Card, TextField, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { connect } from "react-redux";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Grid from '@material-ui/core/Grid';
import Footer from "../../../../modules/footer"
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import "./index.css";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import DocumentList from "../DiscountDocumentList";

const styles = (theme) => ({
  cool: {
    "& .MuiFormControlLabel-label": {
      marginBottom: "0px",
    },
  },
  label: {
    marginBottom: "0px !important",
  },
});

class ApplicatInfo extends Component {

  state = {
    NewbkBookingType: "Normal Booking",
    ReasonForDiscount: "",
    documentsContract: [],
    UploadType: [],
    documentOne: "",
  }

  prepareDocumentsUploadData = (documentData, type, documentCode) => {
    this.setState(
      {
        name: "changeName",
      }
    );
    let documents = "";
    if (type == "apply_pcc") {
      documents = documentData;
    }

    documents = documents.filter((item) => {
      return item.active;
    });
    let documentsContract = [];
    let name2 = "vidhushi";
    let tempDoc = {};
    documents.forEach((doc) => {
      let card = {};
      card["code"] = doc.documentType;
      card["title"] = doc.documentType;
      card["cards"] = [];
      tempDoc[doc.documentType] = card;
    });

    documents.forEach((doc) => {

      if (
        doc.code === "BK_DOC_DOC_PICTURE" &&
        doc.hasMultipleRows &&
        doc.options
      ) {
        let buildingsData = get(
          state,
          "screenConfiguration.preparedFinalObject.applyScreenMdmsData.Booking.Documents",
          []
        );

        buildingsData.forEach((building) => {
          let card = {};
          card["name"] = building.name;
          card["code"] = doc.code;
          card["hasSubCards"] = true;
          card["subCards"] = [];
          doc.options.forEach((subDoc) => {
            let subCard = {};
            subCard["name"] = subDoc.code;
            subCard["required"] = subDoc.required ? true : false;
            card.subCards.push(subCard);
          });
          tempDoc[doc.documentType].cards.push(card);
        });
      } else {
        let card = {};
        card["name"] = `BK_${doc.code}`;
        card["code"] = `BK_${doc.code}`;
        card["required"] = doc.required ? true : false;
        if (doc.hasDropdown && doc.dropdownData) {
          let dropdown = {};
          dropdown.label = "BK_SELECT_DOC_DD_LABEL";
          dropdown.required = true;
          dropdown.menu = doc.dropdownData.filter((item) => {
            return item.active;
          });
          dropdown.menu = dropdown.menu.map((item) => {
            return {
              code: item.code,
              label: getTransformedLocale(item.code),
            };
          });
          card["dropdown"] = dropdown;
        }
        tempDoc[doc.documentType].cards.push(card);
      }
    });

    Object.keys(tempDoc).forEach((key) => {
      documentsContract.push(tempDoc[key]);
    });


    this.setState({
      documentsContract: documentsContract,
      UploadType: documentCode
    });
  };

  componentDidMount = async () => {
    let ShowAmountBooking;
    if (this.props.venueType == "Parks") {
      ShowAmountBooking = "Parks"
    }
    if (this.props.venueType == "Community Center") {
      ShowAmountBooking = "Community Center"
    }
    if (ShowAmountBooking !== null && ShowAmountBooking !== undefined) {

      this.props.prepareFinalObject("ShowAmountBooking", ShowAmountBooking)
    }

    let documentData = [
      {
        active: true,
        code: "PCC_DISCOUNT_DOCUMENT",
        description: "PCC_DISCOUNT_DOCUMENT_DESCRIPTION",
        documentType: "DOC",
        dropdownData: [],
        hasDropdown: false,
        required: true,
      },
    ];


    let documentCode = [
      {
        documentCode: "BK_DOC.DOC_DISCOUNT_PICTURE",
        documentType: "DOC",
        isDocumentRequired: false,
        isDocumentTypeRequired: false
      }
    ]

    let type = "apply_pcc";
    this.prepareDocumentsUploadData(documentData, type, documentCode);

  }

  continue = e => {
    let re = /\S+@\S+\.\S+/;
    let mb = /^\d{10}$/;
    let fname = /^[a-zA-Z'-]+$/;
    e.preventDefault();
    // if(this.props.firstName==""||this.props.mobileNo==""||this.props.houseNo=="" ||this.props.DiscountReason==""){
    //   this.props.toggleSnackbarAndSetText(
    //     true,
    //     {
    //       labelName: "Error_Message_For_Water_tanker_Application",
    //       labelKey: `BK_ERROR_MESSAGE_FOR_WATER_TANKER_APPLICATION`
    //     },
    //     "warning"
    //   );
    // }
    if (this.props.firstName == "" || this.props.mobileNo == "" || this.props.houseNo == "") {
      this.props.toggleSnackbarAndSetText(
        true,
        {
          labelName: "Error_Message_For_Water_tanker_Application",
          labelKey: `BK_ERROR_MESSAGE_FOR_WATER_TANKER_APPLICATION`
        },
        "warning"
      );
    }
    if (this.props.discountType !== "General" && this.props.DiscountReason == "") {
      this.props.toggleSnackbarAndSetText(
        true,
        {
          labelName: "Error_Message_For_Water_tanker_Application",
          labelKey: `BK_ERROR_MESSAGE_FOR_WATER_TANKER_APPLICATION`
        },
        "warning"
      );
    }
    else if (!re.test(this.props.email)) {
      this.props.toggleSnackbarAndSetText(
        true,
        {
          labelName: "Please enter valid email address",
          labelKey: `BK_ERROR_MESSAGE_EMAIL_VALIDATION`
        },
        "warning"
      );
    } else if (!mb.test(this.props.mobileNo)) {
      this.props.toggleSnackbarAndSetText(
        true,
        {
          labelName: "Please enter valid mobile number",
          labelKey: `BK_ERROR_MESSAGE_FOR_MOBILE_VALIDATION`
        },
        "warning"
      );

    }
    else { this.props.nextStep(); }

  }
  onCitizenNameChange = e => {

  }

  newBookingType = async (event) => {
    let { prepareFinalObject } = this.props;
    this.setState(
      { NewbkBookingType: event.target.value });
    prepareFinalObject("NewbkBookingTypeApplicant", event.target.value)
  };

  ResonForDiscount = async (event) => {
    let { prepareFinalObject } = this.props;
    this.setState(
      { ReasonForDiscount: event.target.value });
    prepareFinalObject("ReasonForDiscount", event.target.value)
  };

  render() {
    const { firstName, email, mobileNo, DiscountReason, lastName, houseNo, handleChange, discountType, handleChangeDiscount, classes, prepareFinalObject } = this.props;
    const hintTextStyle = {
      letterSpacing: "0.7px",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      width: "90%",
      overflow: "hidden"
    };
    let buttonLabel = {
      labelName: "UPLOAD FILE",
      labelKey: "BK_OSB_DOCUMENT_UPLOAD_BUTTON"
    };

    let description =
      "Only .jpg, .jpeg, .png and .pdf files. 1MB max file size.";


    let inputProps = {
      accept: ".pdf,.png,.jpg,.jpeg",
    };

    let maxFileSize = 5121;
    return (
      <div style={{ float: 'left', width: '100%', padding: '36px 15px' }}>
        <div className="col-xs-12" style={{ background: '#fff', padding: '15px 0' }}>

          <div className="col-sm-6 col-xs-6">
            <TextField
              id="name"
              name="name"
              type="text"
              value={firstName}
              pattern="[A-Za-z]"
              required={true}
              hintText={
                <Label
                  label="BK_MYBK_NAME_CITIZEN_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_CREATE_CITIZEN_NAME"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('firstName')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>

          <div className="col-sm-6 col-xs-6">
            <TextField
              id="email"
              name="email"
              type="string"
              value={email}
              required={true}
              hintText={
                <Label
                  label="BK_MYBK_CITIZEN_EMAIL_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_CREATE_CITIZEN_EMAIL"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('email')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />

          </div>

          <div className="col-sm-6 col-xs-6">
            <TextField
              id="mobile-no"
              name="mobile-no"
              type="text"
              value={mobileNo}
              required={true}
              hintText={
                <Label
                  label="BK_MYBK_CITIZEN_MOBILENO_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_CREATE_CITIZEN_MOBILENO"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('mobileNo')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>

          <div className="col-sm-6 col-xs-6">
            <TextField
              id="houseNo"
              name="houseNo"
              type="text"
              value={houseNo}
              required={true}
              hintText={
                <Label
                  label="BK_MYBK_CITIZEN_HOUSE_NUMBER_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_CREATE_HOUSE_NUMBER"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('houseNo')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>
          {this.props.venueType === "Parks" ?
            <div className="col-sm-12 clearMob" style={{ marginTop: '19px' }}>
              <FormControl component="fieldset">
                <FormLabel component="legend"><Label label="BK_MYBK_CATEGORY_TYPE" /></FormLabel>
                <RadioGroup row aria-label="position" name="gender1" value={discountType} onChange={handleChangeDiscount}>
                  <FormControlLabel classes={{ label: classes.label }} value="General" control={<Radio color="primary" />} label="General" />
                  <FormControlLabel classes={{ label: classes.label }} value="100%" control={<Radio color="primary" />} label="Discount 100%" />
                  <FormControlLabel classes={{ label: classes.label }} value="50%" control={<Radio color="primary" />} label="Discount 50%" />
                  <FormControlLabel classes={{ label: classes.label }} value="20%" control={<Radio color="primary" />} label="Discount 20%" />
                  <FormControlLabel classes={{ label: classes.label }} value="KirayaBhog" control={<Radio color="primary" />} label="Kiraya/Bhog" />
                  <FormControlLabel classes={{ label: classes.label }} value="ReligiousFunction" control={<Radio color="primary" />} label="Religious Function" />
                </RadioGroup>
              </FormControl>
            </div>
            : <div className="col-sm-12 clearMob" style={{ marginTop: '19px' }}>
              <FormControl component="fieldset">
                <FormLabel component="legend"><Label label="BK_MYBK_CATEGORY_TYPE" /></FormLabel>
                <RadioGroup row aria-label="position" name="gender1" value={discountType} onChange={handleChangeDiscount}>
                  <FormControlLabel classes={{ label: classes.label }} value="General" control={<Radio color="primary" />} label="General" />
                  <FormControlLabel classes={{ label: classes.label }} value="100%" control={<Radio color="primary" />} label="Discount 100%" />
                  <FormControlLabel classes={{ label: classes.label }} value="50%" control={<Radio color="primary" />} label="Discount 50%" />
                  <FormControlLabel classes={{ label: classes.label }} value="20%" control={<Radio color="primary" />} label="Discount 20%" />
                  <FormControlLabel classes={{ label: classes.label }} value="KirayaBhog" control={<Radio color="primary" />} label="Kiraya/Bhog" />
                </RadioGroup>
              </FormControl>
            </div>}


          {/*newRequirement*/}
          {/* <div className="col-sm-12" style={{marginTop: '-3%'}}>
            <FormControl component="fieldset">
              <FormLabel component="legend"><Label label="BK_MYBK_TYPES_OF_BOOKING" /></FormLabel>
              <RadioGroup row aria-label="position" name="gender1"  value={this.state.NewbkBookingType} onChange={this.newBookingType}>
                <FormControlLabel className={classes.cool} value="Normal Booking" control={<Radio color="primary" />} label="Normal Booking" />
                <FormControlLabel className={classes.cool} value="Commercial Booking"  control={<Radio color="primary" />} label="Commercial Booking" />
            </RadioGroup>
            </FormControl>
          </div> */}
          {/* {discountType === "100%" || discountType === "50%" || discountType === "20%" || discountType === "KirayaBhog" || discountType ==="ReligiousFunction" ?
<div className="col-sm-6 col-xs-6">
          <TextField
            id="reasonForDiscount"
            name="reasonForDiscount"
            type="text"
            value={this.state.ReasonForDiscount}
            required = {true}
            hintText={
              <Label
                label="Reason For Discount"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="Reason For Discount"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={this.ResonForDiscount}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
        </div>
: ""} */}


          {discountType === "100%" || discountType === "50%" || discountType === "20%" || discountType === "KirayaBhog" || discountType === "ReligiousFunction" ?
            <div>
              <div className="col-sm-6 col-xs-6">
                <TextField
                  id="reasonForDiscount"
                  name="reasonForDiscount"
                  type="text"
                  value={DiscountReason}
                  required={true}
                  hintText={
                    <Label
                      label="Reason For Discount"
                      color="rgba(0, 0, 0, 0.3799999952316284)"
                      fontSize={16}
                      labelStyle={hintTextStyle}
                    />
                  }
                  floatingLabelText={
                    <Label
                      key={0}
                      label="Reason For Discount"
                      color="rgba(0,0,0,0.60)"
                      fontSize="12px"
                    />
                  }
                  onChange={handleChange('DiscountReason')}
                  underlineStyle={{ bottom: 7 }}
                  underlineFocusStyle={{ bottom: 7 }}
                  hintStyle={{ width: "100%" }}
                />


              </div>
              <div className="col-sm-12 col-xs-12">
                {this.state.documentsContract.length > 0 && (
                  <DocumentList
                    documentsList={this.state.documentsContract}
                    documentsUploadRedux={this.state.UploadType}
                    buttonLabel={buttonLabel}
                    description={description}
                    inputProps={inputProps}
                    maxFileSize={maxFileSize}
                    handleChange={handleChange}
                  />
                )}
              </div>
            </div>

            : ""}






          <div className="col-sm-6 col-xs-6">
            <div>

            </div>
          </div>

          <Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={
            <div className="col-sm-12 col-xs-12" style={{ textAlign: 'right' }}>
              <Button
                className="responsive-action-button"
                primary={true}
                label={<Label buttonLabel={true} label="BK_CORE_COMMON_GONEXT" />}
                fullWidth={true}
                onClick={this.continue}
                startIcon={<ArrowForwardIosIcon />}
              />

            </div>
          }></Footer>
        </div>
      </div>
    );
  }
}



const mapStateToProps = state => {
  const { complaints, bookings, common, auth, form } = state;

  // let firstTimeSlotValue = state.screenConfiguration.preparedFinalObject.Booking !== undefined  ?state.screenConfiguration.preparedFinalObject.Booking.timeslots !== undefined ? (state.screenConfiguration.preparedFinalObject.Booking.timeslots[0] !== undefined ? state.screenConfiguration.preparedFinalObject.Booking.timeslots : "notFound") : "notFound") :
  // "notFound"
  let DropDownValue = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.bkBookingData.name : "";
  console.log("DropDownValue--", DropDownValue)

  let venueType = state.screenConfiguration.preparedFinalObject.bkBookingData ? state.screenConfiguration.preparedFinalObject.bkBookingData.venueType : "";
  console.log("venueType--", venueType)
  if (DropDownValue === "HALL FOR 4 HOURS AT COMMUNITY CENTRE SECTOR 39 CHANDIGARH") {
    let firstTimeSlotValue =
      state.screenConfiguration.preparedFinalObject.Booking !== undefined ?
        (state.screenConfiguration.preparedFinalObject.Booking.timeslots !== undefined ? (state.screenConfiguration.preparedFinalObject.Booking.timeslots[0] !== undefined ? state.screenConfiguration.preparedFinalObject.Booking.timeslots[0] : "notFound") : "notFound") :
        "notFound"

    console.log("firstTimeSlotValue-", firstTimeSlotValue)

    if (firstTimeSlotValue !== "notFound") {
      let conJsonfirst = JSON.stringify(firstTimeSlotValue);
      console.log("conJsconJsonfirston--", conJsonfirst)
    }

    // let SecondTimeSlotValue = state.screenConfiguration.preparedFinalObject.Booking.timeslotsTwo !== undefined ? state.screenConfiguration.preparedFinalObject.Booking.timeslotsTwo[0] : "notFound"
    // console.log("SecondTimeSlotValue-",SecondTimeSlotValue)

    let SecondTimeSlotValue =
      state.screenConfiguration.preparedFinalObject.Booking !== undefined ?
        (state.screenConfiguration.preparedFinalObject.Booking.timeslotsTwo !== undefined ? (state.screenConfiguration.preparedFinalObject.Booking.timeslotsTwo[0] !== undefined ? state.screenConfiguration.preparedFinalObject.Booking.timeslotsTwo[0] : "notFound") : "notFound") :
        "notFound"


    if (SecondTimeSlotValue !== "notFound") {

      let conJsonSecond = JSON.stringify(SecondTimeSlotValue);
      console.log("conJsonSecond--", conJsonSecond)

    }
  }


  return {
    state, venueType
  }
}
const mapDispatchToProps = dispatch => {
  return {
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)),
  }
}

export default (connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ApplicatInfo)))

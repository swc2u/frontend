import React, { Component } from "react";
import { TextField, DropDown, DatePicker } from "components";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import Checkbox from "material-ui/Checkbox";
import Grid from '@material-ui/core/Grid';
import AutoComplete from "material-ui/AutoComplete";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import filter from "lodash/filter";
import AutoSuggestDropdown from "egov-ui-kit/components/AutoSuggestDropdown";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";

export default class ShowField extends Component {
  constructor(props) {
    super(props);
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear());
    maxDate.setHours(0, 0, 0, 0);

    this.state = {
      maxDate: maxDate,
    };
  }

  renderFields = (obj) => {
    let des = getLocaleLabels(obj.label, obj.label);
    const {localizationLabels} =this.props;
    let { maxDate } = this.state;
    let description = des;
    let dropDownData = [];

    if (!isEmpty(obj.defaultValue)) {
      dropDownData.push({
        value: "All",
        label: "All",
      });
    }

    if (typeof obj.defaultValue == "object") {
      for (var variable in obj.defaultValue) {
        dropDownData.push({
          value: variable,
          label: obj.defaultValue[variable],
        });
      }
    }

    switch (obj.type) {
      case "epoch":
        return (
          <Grid item xs={12} sm={6} md={6} lg={6} style={{paddingRight: 8,paddingLeft: "20px"}}>
            <DatePicker
              
              id={obj.label.split(".").join("-")}
              autoOk={true}
              fullWidth={true}
              floatingLabelFixed={true}
              maxDate={maxDate}
              
              
              floatingLabelText={
                <div className="rainmaker-displayInline">
                  <Label className="show-field-label" label={description} containerStyle={{ marginRight: "5px" }} />
                  <span style={{ color: "#FF0000" }}>{obj.isMandatory ? " *" : ""}</span>
                </div>
              }
              hintText={<Label label="PT_DATE_HINT_TEXT" />}
              value={obj.value ? obj.value : {}}
              errorText={this.props.dateField ? (obj.name === this.props.dateField ? this.props.dateError : "") : ""}
              formatDate={(date) => {
                let dateObj = new Date(date);
                let year = dateObj.getFullYear();
                let month = dateObj.getMonth() + 1;
                let dt = dateObj.getDate();
                dt = dt < 10 ? "0" + dt : dt;
                month = month < 10 ? "0" + month : month;
                return dt + "-" + month + "-" + year;
              }}
              onChange={(first, object) => {
                let e = { target: { value: object } };
                this.props.handler(e, obj.name, obj.isMandatory ? true : false, "");
              }}
              minDate={obj.minValue}
              maxDate={obj.maxValue}
            />
          </Grid>
        );


      case "boundarylist":
        

      default:
        return <div />;
    }
  };
  render() {
    return this.renderFields(this.props.obj);
  }
}

const getDropdownLabel = (value, data) => {
  const object = filter(data, { value });
  let label = "";
  if (object.length > 0) {
    label = object[0].label;
  }
  return label;
};

import React from "react";
import MUIDataTable from "mui-datatables";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
//import Cities from "./cities";
import set from "lodash/set";
import get from "lodash/get";
import PropTypes from "prop-types";
import cloneDeep from "lodash/cloneDeep";
import { createMuiTheme, MuiThemeProvider, withStyles } from "@material-ui/core/styles";
import "./index.scss";
import { connect } from "react-redux";


const customStyles = {
  PaymentPaidRow: {
    '& td': { backgroundColor: "#64C" }
  },
  NameCell: {
    fontWeight: 900
  },
  "MUIDataTable-responsiveScroll" : {
    scrollMaxHeight:"auto"
  },
};

class CustomizeTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data,
      columns: this.props.columns,
      rowsSelected: [],
      title: this.props.title,
      options: this.props.options,
      customSortOrder: "asc",
      id: this.props.id === "undefined" ? 'mui-table' : this.props.id
    };

  }

  getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MUIDataTableBodyCell: {
          root: {
            "&:nth-child(2)": {
              color: "#2196F3",
              cursor: "pointer"
            }
          }
        },
        MuiTypography: {
          caption: {
            fontSize: "14px"
          }
        },
        MuiFormLabel: {
          root: {
            fontSize: "14px"
          }
        },
        MuiTableCell: {
          body: {
            fontSize: 14
          }
        }
      }
    });

  formatData = (data, columns) => {
    return (
      data &&
      [...data].reduce((acc, curr) => {
        let dataRow = [];
        // Object.keys(columns).forEach(column => {
        columns.forEach(column => {
          // Handling the case where column name is an object with options
          column = typeof column === "object" ? get(column, "name") : column;
          let columnValue = get(curr, `${column}`, "");
          if (get(columns, `${column}.format`, "")) {
            columnValue = columns[column].format(curr);
          }
          dataRow.push(columnValue);
        });
        let updatedAcc = [...acc];
        updatedAcc.push(dataRow);
        return updatedAcc;
      }, [])
    );
  };

  columnLocalisation = (localizationLabels, columns) => {
    const  localisationArray = Object.values(localizationLabels);
    const {columns : stateColumn} = this.state;
    const { title } = this.state;
    let columnName = [];
    let tempColumnName = "";
    columns.forEach(column => {
      // Handling the case where column name is an object with options
      tempColumnName = typeof column === "object" ? get(column, "name") : column;
      const locMessageObj =  localisationArray.find(locMessage => locMessage.code === tempColumnName);
      if (locMessageObj) {
        if (typeof column === "object") {
          const tempObject = {...column,name:locMessageObj.message,label:locMessageObj.message}
          // set(column, "name", locMessageObj.message);
          // set(column, "label", locMessageObj.message);
          columnName.push(tempObject);
        } else {
          columnName.push(locMessageObj.message);
        }
      }
      else{
        columnName.push(column);
      }
    });
    let oldColumnData = [...stateColumn];
    let newColumnData = [...columnName];
    const checkFlag = _.isEqual(newColumnData.sort(), oldColumnData.sort());
    if(!checkFlag){
      this.setState({columns : columnName});
    }
    const locMessageTitleObj = localisationArray.find(locMessage => locMessage.code === title);
    if (title && title != undefined && locMessageTitleObj != undefined) {
      if(locMessageTitleObj.message!=title)
        this.setState({title : locMessageTitleObj.message});
    }
    
  }
  
  
    componentDidUpdate (prevProps, prevState){
    const {localizationLabels} = this.props;
    const { data, columns } = this.props;
    this.columnLocalisation(localizationLabels, columns);
  }

  componentWillReceiveProps(nextProps) {
    const { data, columns, options } = nextProps;
    this.updateTable(data, columns, options);
  }

  componentDidMount() {
    const { data, columns, options } = this.props;
    this.updateTable(data, columns, options);
  }

  updateTable = (data, columns, options) => {
    // const updatedData = this.formatData(data, columns);
    // Column names should be array not keys of an object!
    // This is a quick fix, but correct this in other modules also!
    let fixedColumns = Array.isArray(columns) ? columns : Object.keys(columns);
    const updatedData = data; //this.formatData(data, fixedColumns);
    this.setState({
      data: updatedData,
      // columns: Object.keys(columns)
      columns: fixedColumns,
      options: options
    });
  };

  render() {
    return (
      <MuiThemeProvider theme={this.getMuiTheme()}>
        <MUIDataTable id={this.state.id} title={this.state.title} data={this.state.data} columns={this.state.columns} options={this.state.options} />
      </MuiThemeProvider>
    );

  }
}

const mapStateToProps = (state, ownProps) => {
  let localizationLabels = get(
      state,
      "app.localizationLabels",
      []
  );
  return { localizationLabels };
};

// export default connect(mapStateToProps, null)(CustomizeTable);
// export default withStyles(customStyles)(CustomizeTable);
export default connect(mapStateToProps)((withStyles(customStyles)(CustomizeTable)));


import CircularProgress from "@material-ui/core/CircularProgress";
import { httpRequest } from "egov-ui-kit/utils/api";
import TableUi from './Table'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Paper } from '@material-ui/core';
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button, TextFieldIcon } from "../../components";
import Label from "egov-ui-kit/utils/translationNode";
import DialogComponent from './DialogComponent'
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from "material-ui/svg-icons/action/search";
import { getDateInEpoch, epochToYmd } from "egov-ui-framework/ui-utils/commons"
import { connect } from "react-redux";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
const styles = theme => ({


  addIcon: {
    visibility: 'hidden'
  },
  [theme.breakpoints.only('xs')]: {
    addIcon: {
      visibility: 'visible'
    }
  }
})

class SimpleTable extends React.Component {
  constructor() {
    super();
    this.state = {

      searchValue: '',
      data: {
        rows: [],
        headers: []
      },
      mdmsRes: {},
      sectorList: [],
      page: 0,
      rowsPerPage: 5,
      isLoading: true,
      open: false,
      updateData: {},
      columnHideIndex: [0, 3, 4, 6, 7],
      mdmsResOsbm: {},
      filterfun: {
        fn: (item) => {
          return item;
        }
      },
      validFromDate: ''

    };
  }

  async componentDidMount() {



    this.fetchTableData()


  }


  async fetchTableData() {
    this.setState({ isLoading: true })

    const headers = [
      "Id",
      "Venue name",
      "Dates locked",
      "",
      "",
      "Type",
      "",
      "",
      ""
    ]

    const foundUser = this.props.userInfo && this.props.userInfo.roles.some(el => el.code === 'BK_MCC_HELPDESK_USER');


    let feeResponse = await httpRequest(
      "bookings/commercial/ground/lock/dates/_fetch",
      "_search",
      [], []
    );
    let tableData = {};

    if (feeResponse && feeResponse.data.length > 0) {

      tableData.headers = headers;
      tableData.rows = feeResponse.data;
      this.setState({ data: tableData })
    }
    this.setState({ isLoading: false })
  }

  handleCreateNew = () => {
    console.log("Nero g")
    window.location.href = "/egov-services/reservedates";
    //this.props.history.push(`/egov-services/reservedates`);
  }

  async handleEditClick(row) {
    const headers = [
      "Id",
      "Venue name",
      "Dates locked",
      "",
      "",
      "Action",
      "",
      "",
      ""
    ]

    var reqBody = {


      "commercialGrndAvailabilityLock": [

        {

          id: row.id,
          bookingVenue: row.bookingVenue,
          locked: false,
          fromDate: row.fromDate


        }

      ]
    }
    const responseStatus = await httpRequest(

      "bookings/commercial/ground/updateAvailability/_lock",
      "_search",
      [],
      reqBody
    );
    if (responseStatus.status == '200') {
      this.props.toggleSnackbarAndSetText(
        true,
        {
          labelName: "Date unlocked Successfully",
          labelKey: `Date unlocked Successfully`
        },
        "success"
      );
      //window.location.href = "/egov-services/reservedbookingdates";
      this.setState({ isLoading: true })
      let feeResponse = await httpRequest(
        "bookings/commercial/ground/lock/dates/_fetch",
        "_search",
        [], []
      );
      let tableData = {};

      if (feeResponse && feeResponse.data.length > 0) {

        tableData.headers = headers;
        tableData.rows = feeResponse.data;
        this.setState({ data: tableData })
        this.setState({ isLoading: false })
      }
    } else {
      this.props.toggleSnackbarAndSetText(
        true,
        {
          labelName: "Something went wrong.Try Again",
          labelKey: `Something went wrong.Try Again`
        },
        "error"
      );
    }
    this.setState({ isLoading: false })

  }

  handleSearch(e) {
    const target = e.target;
    let filterfun = this.state.filterfun;
    filterfun.fn = (item) => {
      if (target.value === "") return item;
      else {
        return item.filter(
          (x) =>

          x.bookingVenue.toLowerCase().includes(target.value.toLowerCase()) ||
          x.venueType.toLowerCase().includes(target.value.toLowerCase())

        );
      }
    };
    this.setState({ filterfun: filterfun });
  }

  render() {

    const {classes}= this.props
    return (

      this.state.isLoading === true ? <div > <CircularProgress style={{ position: "fixed", top: '50%', left: '50%' }} /> </div> :
        <div>
          <div align="right"  >
            <Button primary={true} label="Lock Dates" style={{ margin: '15px' }} onClick={this.handleCreateNew} />


          </div>




          <div class="col-xs-12 " style={{ wordBreak: "break-word" }}>

            <Paper style={{ overflowX: 'auto' }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ width: '75%', margin: '10px' }}>
                    <TextFieldIcon
                      textFieldStyle={{ height: "48px", width: '100%' }}
                      inputStyle={{
                        marginTop: "4px",
                        left: 0,
                        position: "absolute",
                      }}
                      iconPosition="after"
                      onChange={(e) => {
                        this.setState({ searchValue: e.target.value })
                        this.handleSearch(e)
                      }}
                      underlineShow={true}
                      fullWidth={false}
                      hintText={<Label label="BK_ADMIN_SEARCH_BUTTON" />}
                      Icon={SearchIcon}
                      value={this.state.searchValue}
                      id="search-mdms"
                      iconStyle={{
                        height: "20px",
                        width: "35px",
                        fill: "#767676",
                      }}
                    />

                  </div>
                  <IconButton style={{ margin: '10px' }} className={classes.addIcon} size="small" aria-label="add" onClick={() => this.handleCreateNew()}>
                    <AddCircleOutlineIcon
                      size="small"
                      style={{ fontSize: "20px" }}
                    />
                  </IconButton>

                </div>

                <TableUi data={this.state.data} columnHideIndex={this.state.columnHideIndex} filterfun={this.state.filterfun} handleEditClick={this.handleEditClick.bind(this)} />
              </div>

            </Paper>

          </div>


        </div>
    );
  }
}





const mapStateToProps = state => {
  console.log('state in all app', state)

  const { userInfo } = state.auth;

  return { userInfo }
};

const mapDispatchToProps = dispatch => {
  return {
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)),
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),


  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps
)(SimpleTable))
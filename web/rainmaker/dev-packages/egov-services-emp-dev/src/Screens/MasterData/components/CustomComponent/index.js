import React from "react";
import { Image, Card, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { getDateFromEpoch } from "egov-ui-kit/utils/commons";
import isEmpty from "lodash/isEmpty";
import "./index.css";
const imageStyles = {
  maxHeight: "100px",
  minHeight: "100px",
};

const callIconStyle = {
  marginLeft: "17px",
  height: "17px",
  width: "17px",
  borderRadius: "50%",
  position: "relative",
  top: "2px",
};

const bottomInfoTemplate = (item, role) => {
  return role !== "citizen" ? (
    <div>
      <div className="employee-bottom-info-cont">
        {(role === "ao" || role === "csr") && (
          <div className="submitted-by-text">
            {item.complaintStatus === "ASSIGNED" && item.assignedTo !== "NA" && (
              <div className="clearfix">
                <div className="inline-Localization-text">
                  <Label containerStyle={{ display: "inline-block" }} fontSize={12} label="ES_ALL_COMPLAINTS_ASSIGNED_TO" />
                  <Label
                    containerStyle={{ display: "inline-block" }}
                    fontSize={12}
                    color="#464646"
                    labelStyle={{ marginLeft: "3px" }}
                    label={item.assignedTo}
                  />
                </div>
                {item.employeePhoneNumber && (
                  <a
                    className="pgr-call-icon"
                    href={`tel:+91${item.employeePhoneNumber}`}
                    style={{ textDecoration: "none", position: "relative", display: "flex", alignItems: "flex-end" }}
                  >
                    <Icon action="communication" name="call" style={callIconStyle} color={"#22b25f"} />
                    <span style={{ marginLeft: "10px", color: "#767676", fontSize: 12, lineHeight: "12px" }}>{`+91 ${
                      item.employeePhoneNumber
                    }`}</span>
                  </a>
                )}
              </div>
            )}
          </div>
        )}
        {(role === "employee" || role === "csr") && (
          <div className="submitted-by-text">
            {item.submittedBy !== "NA" && (
              <div className="clearfix">
                <div className="inline-Localization-text">
                  <Label containerStyle={{ display: "inline-block" }} fontSize={12} label={"ES_COMMON_FILED_BY"} />
                  <Label
                    containerStyle={{ display: "inline-block" }}
                    fontSize={12}
                    color="#464646"
                    labelStyle={{ marginLeft: "3px" }}
                    label={item.submittedBy}
                  />
                </div>
                {item.citizenPhoneNumber && (
                  <a
                    className="pgr-call-icon"
                    href={`tel:+91${item.citizenPhoneNumber}`}
                    style={{ textDecoration: "none", position: "relative", display: "flex", alignItems: "flex-end" }}
                  >
                    <Icon action="communication" name="call" style={callIconStyle} color={"#22b25f"} />
                    <span style={{ marginLeft: "10px", color: "#767676", fontSize: 12, lineHeight: "12px" }}>{`+91 ${item.citizenPhoneNumber}`}</span>
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {item.escalatedTo && role !== "csr" && (
        <div className="submitted-by-text">
          Escalated To: <span style={{ color: "#464646" }}>{item.escalatedTo}</span>
        </div>
      )}
      {item.reassign && role !== "csr" && (
        <div className="employee-bottom-msg rainmaker-displayInline">
          <Label label={role === "ao" ? `${item.reassignRequestedBy}` : "CS_MYCOMPLAINTS_REASSIGN_MESSAGE2"} dark={true} fontSize={12} />
          <Label label={"CS_MYCOMPLAINTS_REASSIGN_MESSAGE1"} dark={true} containerStyle={{ marginLeft: 4 }} fontSize={12} />
        </div>
      )}
    </div>
  ) : null;
};

const getStatusAndChangeColor = (status, assignee) => {
  let statusObj = {
    style: {},
    message: "",
    containerStyle: {},
  };
  switch (status) {
    case "CS_COMMON_OPEN_UCASE":
      statusObj.style = {
        // color: "#f89a3f",
        color: "#ffffff",
      };
      statusObj.message = (
        <div>
          <Label label={"CS_COMMON_COMPLAINT"} />
          <Label className="complaint-status-reassigned" label={`CS_COMMON_RE_ASSIGNED`} />
          <Label label={"CS_MYCOMPLAINTS_TO"} />
          <Label className="complaint-assignee" label={`${assignee}`} />
        </div>
      );
      statusObj.containerStyle = {
        backgroundColor: "red",
      };
      break;
    case "CS_COMMON_CLOSED_UCASE":
      statusObj.style = {
        // color: "#5385a6",
        color: "#ffffff",
      };
      statusObj.message = (
        <div>
          <Label label={"CS_COMMON_COMPLAINT"} />
          <Label className="complaint-status-resolved" label="CS_COMMON_RESOLVED" />
          <Label label={"CS_MYCOMPLAINTS_RATE"} />
        </div>
      );
      statusObj.containerStyle = {
        backgroundColor: "#4CAF50",
      };
      break;
    case "CS_COMMON_REJECTED_UCASE":
      statusObj.style = {
        // color: "#e74c3c",
        color: "#ffffff",
      };
      statusObj.message = (
        <div>
          <Label label={"CS_MYCOMPLAINTS_COMPLAINT_PREFIX"} />
          <Label className="complaint-status-rejected" label={`CS_COMMON_REJECTED`} />
          <Label label={"CS_MYCOMPLAINTS_RATE"} />
        </div>
      );
      statusObj.containerStyle = {
        backgroundColor: "red",
      };
      break;
    default:
      statusObj.style = {
        // color: "#484848",
        color: "#ffffff",
      };
      statusObj.message = `CS_MYCOMPLAINTS_RE_ASSIGNED ${assignee}`;
      statusObj.containerStyle = {
        backgroundColor: "#4CAF50",
      };
  }
  if (status && status.toLowerCase().includes(`overdue`)) {
    statusObj.style = { color: "#e74c3c" };
    statusObj.message = "";
  }
  if (status && status.toLowerCase().includes(`left`)) {
    statusObj.style = { color: "#22b25f" };
    statusObj.message = "";
  }
  if (status && status.includes(`/`)) {
    if (["0", "1", "2", "3"].indexOf(status.split("/")[0]) > -1) {
      statusObj.style = { color: "#e74c3c" };
      statusObj.message = "";
    } else {
      statusObj.style = { color: "#22b25f" };
      statusObj.message = "";
    }
  }
  return statusObj;
};

export default class CustomComplaints extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
     
    }

convertEpochToDate = (dateEpoch) => {
  const dateFromApi = new Date(dateEpoch);
  let month = dateFromApi.getMonth() + 1;
  let day = dateFromApi.getDate();
  let year = dateFromApi.getFullYear();
  month = (month > 9 ? "" : "0") + month;
  day = (day > 9 ? "" : "0") + day;
  return `${day}-${month}-${year}`;
};

    render(){
        const {complaints, complaintLocation, role, onComplaintClick, noComplaintMessage, heightOffset} = this.props
        
        return complaints===null || complaints.length === 0 ? (
          <div className="no-complaints-message-cont" style={heightOffset && { height: `calc(100vh - ${heightOffset})` }}>
            <Label label={noComplaintMessage} dark={true} fontSize={"16px"} labelStyle={{ letterSpacing: "0.7px" }} />
          </div>
        ) : (
          complaints.map((complaint, complaintIndex) => {
          
            const { bkCompleteAddress, bkHouseNo, bkSector, bkAreaRequired, bkEmail } = complaint || "";
            const complaintHeader = complaint.header && "SERVICEDEFS." + complaint.header.toUpperCase();
            return (
              <div id={"complaint-" + complaintIndex} className="complaints-card-main-cont" key={`complaint-${complaintIndex}`}>
                <Card
                  className="complaint-card"
                  textChildren={
                    <div className="complaint-card-wrapper">

                      <div className="complaint-number-cont row application-format">
                        <div className="complaint-number complaint-date">
                          <Label fontSize="12px" className="col-md-6" label={"BK_MYBK_COMMON_APPLICATION_NO"} />
                          {/* <Label fontSize="12px" label={" : "} /> */}
                          <Label fontSize="12px" className="col-md-6" label={complaint.bkApplicationNumber} className="complaint-complaint-number" />
                        </div>
                      </div>

                      <div className="complaint-number-cont row application-format">
                        {/* <div className="complaint-number complaint-date"> */}
                          <Label fontSize="12px" className="col-md-6" label={"MYBK_APPLICATION_DETAILS_CURRENT_STATUS"} />
                          {/* <Label fontSize="12px" label={" : "} /> */}
                          <Label fontSize="12px" className="col-md-6" label={complaint.bkApplicationStatus} className="complaint-complaint-number" />
                        {/* </div> */}
                      </div>
                      <div className="complaint-number-cont row application-format">
                        <div className="complaint-number complaint-date">
                          <Label fontSize="12px" className="col-md-6"   label={"MYBK_APPLICATION_BOOKING_TYPE"} />
                          <Label fontSize="12px" className="col-md-6"   label={complaint.bkBookingType} className="complaint-complaint-number" />
                        </div>
                      </div>
                     
                      <div className="complaint-number-cont row application-format">
                        <div className="complaint-number complaint-date">
                          <Label fontSize="12px" className="col-md-6"   label={"MYBK_APPLICATION_DETAILS_SUBMISSION_DATE"} />
                          <Label fontSize="12px" className="col-md-6"   label= {this.convertEpochToDate(
                      complaint.bkDateCreated,"dayend"
                    )} className="complaint-complaint-number" />
                        {/*label={complaint.bkDateCreated}*/}
                          {/* label= {this.convertEpochToDate(
                      dateCreated,"dayend"
                    )} */}
                        </div>
                      </div>
                   

                      {/* 
                      <div className="complaint-number-cont row">
                        <div className="complaint-number complaint-date">
                          <Label fontSize="12px" className="col-md-6"  label={"MYBK_APPLICANT_SECTOR"} />
                          <Label fontSize="12px" className="col-md-6"  label={complaint.bkSector} className="complaint-complaint-number" />
                        </div>
                      </div> */}

                     <button style={{color:"#FE7A51",border: "none",fontWeight: "500",outline:"none", background: "white"}} onClick={(e) => {
                    onComplaintClick(encodeURIComponent(complaint.bkApplicationNumber),complaint.bkBookingType);
                  }}>VIEW DETAILS</button>
      
                    </div>
                  }
                />
              </div>
            );
          })
        );
    }
}
import React, { Component } from "react";
import { Doughnut, Bar, HorizontalBar, Line, Pie } from 'react-chartjs-2';
import CardContent from '@material-ui/core/CardContent';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css" ;
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Legalindex.css';

import LegalData from './Legal_data.json';
import bgImage from './img/MCC_symbol.jpg';

class DashboardLegal extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        propsLegalData : [],
        graphClicked : -1,
        totalCases : 0,
        judgmentCases : 0,
        impCases : 0,
        hearingCases : 0,
        graphTitle : "",
  
        graphOneLabel : [],
        graphOneData : [],
        graphTwoLabel : [],
        graphTwoData : [],
        graphThirdLabel : [],
        graphThirdData : [],
        graphFourthLabel : [],
        graphFourthData : [],
        dataOne : [],
        dataTwo : [],
        dataThird : [],
        dataFourth : [],
  
        unchangeColumnData : [],
        rowData : [],
        columnData : [],
      }
    }
  
    // PDF function 
    pdfDownload = (e) => {
  
      debugger;
      e.preventDefault();
      var columnData = this.state.unchangeColumnData
      // var columnDataCamelize = this.state.columnData
      var rowData = this.state.rowData
  
      var group = columnData.reduce((r, a) => {
          r[a["show"]] = [...r[a["show"]] || [], a];
          return r;
          }, {});
  
      columnData = group["true"]
      var tableColumnData = []
      var tableColumnDataCamel = []
      for(var i=0; i<columnData.length; i++){
          tableColumnData.push(columnData[i]["accessor"]);
          // tableColumnDataCamel.push(columnDataCamelize[i]["accessor"])
      }
  
      var tableRowData = [];
      for(var i=0; i<rowData.length; i++){
          var rowItem = [];
          for(var j=0; j<tableColumnData.length; j++){
              const demo1 = rowData[i]
              var demo2 = tableColumnData[j].replace(".", ",");
              demo2 = demo2.split(",")
              if(typeof(demo2) === "object"){   
                  if(demo2.length > 1){
                      rowItem.push(rowData[i][demo2[0]][demo2[1]]);
                  }
                  else{
                      rowItem.push(rowData[i][demo2]);
                  }
              }else{
                  rowItem.push(rowData[i][demo2]);
              }
          }
          tableRowData.push(rowItem);
      }
  
      var tableRowDataFinal = []
      for(var i=0; i<tableRowData.length; i++){
          tableRowDataFinal.push(tableRowData[i]);
      }
  
  
      debugger;
      // PDF Code 
      const unit = "pt";
      const size = "A4"; // Use A1, A2, A3 or A4
      const orientation = "portrait"; // portrait or landscape
      const marginLeft = 40;
      const doc = new jsPDF(orientation, unit, size);
  
      var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
      var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
  
      doc.text("Chandigarh Application", pageWidth / 2, 20, 'center');
  
      doc.setFontSize(10);
      const pdfTitle = "Legal Cases Dashboard"
      doc.text(pdfTitle, pageWidth / 2, 40, 'center');
  
      doc.autoTable({ html: '#my-table' });
      doc.setFontSize(5);
  
      doc.autoTable({
          // head: [tableColumnDataCamel],
          head: [tableColumnData],
          theme: "striped",
          styles: {
              fontSize: 7,
          },
          body:tableRowData
      });
  
      doc.save(pdfTitle+".pdf");
  
      }
  
      // Column Unchange Data
      columnUnchange=(e)=>{
          debugger;
          const coldata = e;
          var unchangeData = [];
          for(var i=0;i<coldata.length; i++){
              if(coldata[i]["show"]){
                  unchangeData.push(coldata[i])
              }   
          }
          return unchangeData
  
      }
  
      // CamelCase Column Name 
      camelize = (str) =>  {
      // var res = str.substr(0, 1);
      var res = String(str).substr(0, 1);
      str = str.replaceAll("_", " ")
      return str.replace(res, function(res)
      {
      return res.toUpperCase();
      });
      }
        
      // Hide / Show Column
      showHideColumn = (e) => {
          e.preventDefault();
          debugger;
          var sortColumn = JSON.parse(JSON.stringify(this.state.unchangeColumnData));
          const removeIndex = parseInt(e.target.value);
          // sortColumn.splice(removeIndex, 1)
          sortColumn[removeIndex]["show"] = !(sortColumn[removeIndex]["show"]);
  
          var sortColumn2 = JSON.parse(JSON.stringify(this.state.unchangeColumnData));
          const removeIndex2 = parseInt(e.target.value);
          // sortColumn.splice(removeIndex, 1)
          sortColumn2[removeIndex2]["show"] = !(sortColumn2[removeIndex2]["show"])
  
          this.setState({
              columnData: sortColumn,
              unchangeColumnData: sortColumn2
          })
      }
  
      // Toggle Column 
      toggleColumn = (e) => {
          e.preventDefault();
          debugger;
          const data = this.state.columnData
          this.setState({
              toggleColumnCheck : !this.state.toggleColumnCheck
          })
      }
  
    showDashboard = (e) => {
  
        debugger;
        e.preventDefault();
        var selectedGraph = e;
        selectedGraph = selectedGraph.target.value;
      // Column Data
      const tableData = this.state.propsLegalData[0] ? Object.keys(this.state.propsLegalData[0]) : [];
      var columnData = []
      for(var i=0; i<tableData.length; i++){
          var itemHeader = {}
          itemHeader["Header"] = this.camelize(tableData[i]);
          itemHeader["accessor"] = tableData[i];
          itemHeader["show"] = true;
          columnData.push(itemHeader);
      }
  
      // Column Unchange Data 
      const unchangeColumnData = this.columnUnchange(columnData);
      this.setState({
        columnData : columnData,
        unchangeColumnData : columnData
      })
  
      if(selectedGraph === "totalCases"){
        const data = this.state.dataOne;
        var group = data.reduce((r, a) => {
          r[a["courtName"]] = [...r[a["courtName"]] || [], a];
          return r;
          }, {});
        
        var graphLabel = Object.keys(group);
        var graphData = [];
        for(var i=0; i<graphLabel.length; i++){
          graphData.push(group[graphLabel[i]].length);
        }
  
        this.setState({
          graphOneLabel : graphLabel,
          graphOneData : graphData,
          graphClicked : 0,
          graphTitle : "Total Cases",
          rowData : data
        })
      }
      if(selectedGraph === "judgmentCases"){
        const data = this.state.dataTwo;
        // var group = data.reduce((r, a) => {
        //   r[a["judgmentTypeId"]] = [...r[a["judgmentTypeId"]] || [], a];
        //   return r;
        //   }, {});
        
        var graphLabel = Object.keys(data);
        var graphData = [];
        for(var i=0; i<graphLabel.length; i++){
          graphData.push(data[graphLabel[i]].length);
        }
  
        this.setState({
          graphTwoLabel : graphLabel,
          graphTwoData : graphData,
          graphClicked : 1,
          graphTitle : "judgment Cases",
          rowData : data["null"]
        })
      }
      if(selectedGraph === "impCases"){
        // const data = this.state.dataThird;
        const data = this.state.dataThird["null"];
        var group = data.reduce((r, a) => {
          r[a["concernedBranch"]] = [...r[a["concernedBranch"]] || [], a];
          return r;
          }, {});
        
        var graphLabel = Object.keys(group);
        var graphData = [];
        for(var i=0; i<graphLabel.length; i++){
          graphData.push(group[graphLabel[i]].length);
        }
  
        this.setState({
          graphThirdLabel : graphLabel,
          graphThirdData : graphData,
          graphClicked : 2,
          graphTitle : "Important Cases",
          rowData : data
        })
      }
      if(selectedGraph === "hearingCases"){
        this.setState({
          graphClicked : 3,
          graphTitle : "Hearing of Cases"
        })
      }
    }
  
    componentDidMount(){
  
        debugger;
      const data = LegalData.ResponseBody;
      
      var totalCases = data.length;
      
      var judgmentCases = data.reduce((r, a) => {
        r[a["judgmentTypeId"]] = [...r[a["judgmentTypeId"]] || [], a];
        return r;
        }, {});
  
      var impCases = data.reduce((r, a) => {
        r[a["iscaseImp"]] = [...r[a["iscaseImp"]] || [], a];
        return r;
        }, {});
        
      var hearingCases = data.reduce((r, a) => {
        r[a["caseStatus"]] = [...r[a["caseStatus"]] || [], a];
        return r;
        }, {});;
      
      this.setState({
        dataOne : data,
        dataTwo: judgmentCases,
        dataThird : impCases,
        dataFourth : []
      })
      this.setState({
        totalCases : totalCases,
        judgmentCases : judgmentCases["null"].length,
        impCases : impCases["null"].length,
        hearingCases : hearingCases["HEARING"].length,
        propsLegalData : data
      })
    }
  
    render(){
  
      var graphOneData = {
        labels: this.state.graphOneLabel,
        // labels: ["Label1", "Label2"],
        datasets: [
            {
            label: "",
            fill: false,
            lineTension: 0.1,
            hoverBorderWidth : 12,
            // backgroundColor : this.state.colorRandom,
            backgroundColor : ["#F77C15", "#385BC8","#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
            borderColor: "rgba(75,192,192,0.4)",
            borderCapStyle: "butt",
            barPercentage: 2,
            borderWidth: 5,
            barThickness: 25,
            maxBarThickness: 10,
            minBarLength: 2,
            data: this.state.graphOneData
            // data:[10,20,30]
            }
        ]
      }
      var graphOneOption = {
          responsive : true,
          // aspectRatio : 3,
          maintainAspectRatio: false,
          cutoutPercentage : 0,
          datasets : [
              {
              backgroundColor : "rgba(0, 0, 0, 0.1)",
              weight: 0
              }
          ], 
          legend: {
              display: false,
              position: 'bottom',
              labels: {
              fontFamily: "Comic Sans MS",
              boxWidth: 20,
              boxHeight: 2
              }
          },
          tooltips: {
              enabled: true
          },
          title: {
              display: true,
              text: "Total Cases Dashboard"
          },
          scales: {
              xAxes: [{
                  gridLines: {
                      display:true
                  },
                  scaleLabel: {
                      display: true,
                      labelString: "Court Types"
                      }, 
              }],
              yAxes: [{
                  gridLines: {
                      display:true
                  },
                  ticks: {
                      suggestedMin: 0,
                      // suggestedMax: 100,
                      // stepSize: 5
                  },
                  scaleLabel: {
                      display: true,
                      labelString: "No of Cases"
                      }, 
              }]
          },
          plugins: {
              datalabels: {
                  display: false
              //     color: 'white',
              //     backgroundColor: 'grey',
              //     labels: {
              //         title: {
              //             font: {
              //                 weight: 'bold'
              //             }
              //         }
              //     }}
              }
          },
          onClick: (e, element) => {
              if (element.length > 0) {
                  
                  var ind = element[0]._index;   
                  const selectedVal = this.state.graphOneLabel[ind];
                  // const data = this.state.dataOne[selectedVal];
                  // var graphSorting = this.graphSorting( "BE&AEComparison", this.state.dataOne[selectedVal] );
                  
                  // this.setState({
                  //     graphTwoLabel: graphSorting[0],
                  //     graphTwoData: graphSorting[1],
                  //     dataTwo: graphSorting[2],
                  //     graphClicked: 1,
                  //     rowData: this.state.dataOne[selectedVal]
                  // })
                  
              }
          },
      }
  
      var graphTwoData = {
        labels: this.state.graphTwoLabel,
        // labels: ["Label1", "Label2"],
        datasets: [
            {
            label: "",
            fill: false,
            lineTension: 0.1,
            hoverBorderWidth : 12,
            // backgroundColor : this.state.colorRandom,
            backgroundColor : ["#F77C15", "#385BC8","#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
            borderColor: "rgba(75,192,192,0.4)",
            borderCapStyle: "butt",
            barPercentage: 2,
            borderWidth: 5,
            barThickness: 25,
            maxBarThickness: 10,
            minBarLength: 2,
            data: this.state.graphTwoData
            // data:[10,20,30]
            }
        ]
      }
      var graphTwoOption = {
          responsive : true,
          // aspectRatio : 3,
          maintainAspectRatio: false,
          cutoutPercentage : 0,
          datasets : [
              {
              backgroundColor : "rgba(0, 0, 0, 0.1)",
              weight: 0
              }
          ], 
          legend: {
              display: false,
              position: 'bottom',
              labels: {
              fontFamily: "Comic Sans MS",
              boxWidth: 20,
              boxHeight: 2
              }
          },
          tooltips: {
              enabled: true
          },
          title: {
              display: true,
              text: "Judgment Cases Dashboard"
          },
          scales: {
              xAxes: [{
                  gridLines: {
                      display:true
                  },
                  scaleLabel: {
                      display: true,
                      labelString: "Judgement Type (ID)"
                      }, 
              }],
              yAxes: [{
                  gridLines: {
                      display:true
                  },
                  ticks: {
                      suggestedMin: 0,
                      // suggestedMax: 100,
                      // stepSize: 5
                  },
                  scaleLabel: {
                      display: true,
                      labelString: "No of Cases"
                      }, 
              }]
          },
          plugins: {
              datalabels: {
                  display: false
              //     color: 'white',
              //     backgroundColor: 'grey',
              //     labels: {
              //         title: {
              //             font: {
              //                 weight: 'bold'
              //             }
              //         }
              //     }}
              }
          },
          onClick: (e, element) => {
              if (element.length > 0) {
                  var ind = element[0]._index;
              }
          },
      }
  
      var graphThirdData = {
        labels: this.state.graphThirdLabel,
        // labels: ["Label1", "Label2"],
        datasets: [
            {
            label: "",
            fill: false,
            lineTension: 0.1,
            hoverBorderWidth : 12,
            // backgroundColor : this.state.colorRandom,
            backgroundColor : ["#F77C15", "#385BC8","#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
            borderColor: "rgba(75,192,192,0.4)",
            borderCapStyle: "butt",
            barPercentage: 2,
            borderWidth: 5,
            barThickness: 25,
            maxBarThickness: 10,
            minBarLength: 2,
            data: this.state.graphThirdData
            // data:[10,20,30]
            }
        ]
      }
      var graphThirdOption = {
          responsive : true,
          // aspectRatio : 3,
          maintainAspectRatio: false,
          cutoutPercentage : 0,
          datasets : [
              {
              backgroundColor : "rgba(0, 0, 0, 0.1)",
              weight: 0
              }
          ], 
          legend: {
              display: false,
              position: 'bottom',
              labels: {
              fontFamily: "Comic Sans MS",
              boxWidth: 20,
              boxHeight: 2
              }
          },
          tooltips: {
              enabled: true
          },
          title: {
              display: true,
              text: "Important Cases Dashboard"
          },
          scales: {
              xAxes: [{
                  gridLines: {
                      display:true
                  },
                  scaleLabel: {
                      display: true,
                      labelString: "Concern Branch"
                      }, 
              }],
              yAxes: [{
                  gridLines: {
                      display:true
                  },
                  ticks: {
                      suggestedMin: 0,
                      // suggestedMax: 100,
                      // stepSize: 5
                  },
                  scaleLabel: {
                      display: true,
                      labelString: "No of Cases"
                      }, 
              }]
          },
          plugins: {
              datalabels: {
                  display: false
              //     color: 'white',
              //     backgroundColor: 'grey',
              //     labels: {
              //         title: {
              //             font: {
              //                 weight: 'bold'
              //             }
              //         }
              //     }}
              }
          },
          onClick: (e, element) => {
              if (element.length > 0) {
                  var ind = element[0]._index;               
              }
          },
      }
  
      var graphFourthData = {
        labels: this.state.graphFourthLabel,
        // labels: ["Label1", "Label2"],
        datasets: [
            {
            label: "",
            fill: false,
            lineTension: 0.1,
            hoverBorderWidth : 12,
            // backgroundColor : this.state.colorRandom,
            backgroundColor : ["#F77C15", "#385BC8","#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
            borderColor: "rgba(75,192,192,0.4)",
            borderCapStyle: "butt",
            barPercentage: 2,
            borderWidth: 5,
            barThickness: 25,
            maxBarThickness: 10,
            minBarLength: 2,
            data: this.state.graphFourthData
            // data:[10,20,30]
            }
        ]
      }
      var graphFourthOption = {
          responsive : true,
          // aspectRatio : 3,
          maintainAspectRatio: false,
          cutoutPercentage : 0,
          datasets : [
              {
              backgroundColor : "rgba(0, 0, 0, 0.1)",
              weight: 0
              }
          ], 
          legend: {
              display: false,
              position: 'bottom',
              labels: {
              fontFamily: "Comic Sans MS",
              boxWidth: 20,
              boxHeight: 2
              }
          },
          tooltips: {
              enabled: true
          },
          title: {
              display: true,
              text: "Hearing Cases Dashboard"
          },
          scales: {
              xAxes: [{
                  gridLines: {
                      display:true
                  },
                  scaleLabel: {
                      display: true,
                      labelString: "X label"
                      }, 
              }],
              yAxes: [{
                  gridLines: {
                      display:true
                  },
                  ticks: {
                      suggestedMin: 0,
                      // suggestedMax: 100,
                      // stepSize: 5
                  },
                  scaleLabel: {
                      display: true,
                      labelString: "Y label"
                      }, 
              }]
          },
          plugins: {
              datalabels: {
                  display: false
              //     color: 'white',
              //     backgroundColor: 'grey',
              //     labels: {
              //         title: {
              //             font: {
              //                 weight: 'bold'
              //             }
              //         }
              //     }}
              }
          },
          onClick: (e, element) => {
            if (element.length > 0) {
                var ind = element[0]._index;               
            }
          },
      }
  
      return(
        <div>
          <div className="graphImageContainer">
            <div className="imageDiv" style={{ 
                backgroundImage: `url(${bgImage})` ,
                backgroundRepeat: "no-repeat",
                backgroundSize: "1500px 400px",
                // opacity: "0.7"
              }}
              >
                {/* <img src={bgImage} /> */}
                <div style={{textAlign:"center"}}>
                  <div className="dashboardTitle">
                    Legal Cases Dashboard
                  </div>
                  <div className="content-container">
                        <div className="content">
                          Total No of Cases
                          <p> {this.state.totalCases} </p>
                          <p> <button className="dashboardBtn" value="totalCases" onClick={(e) => {this.showDashboard(e)}}> Click here... </button> </p>
                        </div>
                        <div className="content">
                          No of Judgment
                          <p> {this.state.judgmentCases} </p>
                          <p> <button className="dashboardBtn" value="judgmentCases" onClick={(e) => {this.showDashboard(e)}}> Click here... </button> </p>
                        </div>
                        <div className="content">
                          Important Cases
                          <p> {this.state.impCases} </p>
                          <p> <button className="dashboardBtn" value="impCases" onClick={(e) => {this.showDashboard(e)}}> Click here... </button> </p>
                        </div>
                        {/* <div className="content">
                          Total No of Hearing
                          <p> {this.state.hearingCases} </p>
                          <p> <button className="dashboardBtn" onClick={() => {this.showDashboard("hearingCases")}}> Click here... </button> </p>
                        </div> */}
                  </div>                
                </div>
            </div>
          </div>
  
          {/* <div className="graphTitle"> {this.state.graphTitle} </div> */}
          <center>
          <div>
            {
              this.state.graphClicked === 0 ?
              <div
                className="graphWidth"
                style={{
                  position: "relative",
                  display: "block",
                  overflowX: "auto",
                }}
                >
                  <div className="graphData">
                      <Bar
                          width="900px"
                          height="350px"
                          data={ graphOneData }
                          options={ graphOneOption }                 
                      />
                  </div>
              </div>
              :null
            }
  
            {
              this.state.graphClicked === 1 ?
              <div
                className="graphWidth"
                style={{
                  position: "relative",
                  display: "block",
                  overflowX: "auto",
                }}
                >
                  <div className="graphData">
                      <Bar
                          width="900px"
                          height="350px"
                          data={ graphTwoData }
                          options={ graphTwoOption }                 
                      />
                  </div>
              </div>
              :null
            }
  
            {
              this.state.graphClicked == 2 ?
              <div
                className="graphWidth"
                style={{
                  position: "relative",
                  display: "block",
                  overflowX: "auto",
                }}
                >
                  <div className="graphData">
                      <Bar
                          width="900px"
                          height="350px"
                          data={ graphThirdData }
                          options={ graphThirdOption }                 
                      />
                  </div>
              </div>
              :null
            }
  
            {
              this.state.graphClicked === 3 ?
              <CardContent className="fullGraph" >
                  <React.Fragment>
                      <Bar
                      data={ graphFourthData }
                      options={ graphFourthOption } 
                      />
                  </React.Fragment>
              </CardContent>
              :null
            }
            
          </div>
          
          {/* Table Feature  */}
          <div className="tableContainer">
          {
              this.state.unchangeColumnData.length > 0  ? 
              <div className="tableFeature">
                  <div className="columnToggle-Text"> Download As: </div>
                  <button className="columnToggleBtn" onClick={this.pdfDownload}> PDF </button>
  
                  <button className="columnToggleBtn" onClick={this.toggleColumn}> Column Visibility </button>
              </div>
              :null
          }
          {
             this.state.toggleColumnCheck ?
             <div className="columnVisibilityCard">
              <dl>
                  {
                      this.state.unchangeColumnData.map((data, index)=>{
                          return(
                              <ul className={ this.state.unchangeColumnData[index]["show"] ? "" : "toggleBtnClicked" }><button value={index} className={ this.state.unchangeColumnData[index]["show"] ? "toggleBtn" : "toggleBtnClicked" } onClick={ this.showHideColumn }> { this.state.unchangeColumnData[index]["Header"] } </button></ul> 
                          )
                      })
                  }
              </dl>
              </div> 
             : null
          }
  
          {
              this.state.graphClicked >= 0 ?
              <ReactTable id="customReactTable"
              // PaginationComponent={Pagination}
              data={ this.state.rowData }  
              columns={ this.state.columnData }  
              defaultPageSize = {this.state.rowData.length > 10 ? 10 : this.state.rowData.length}
              pageSize={this.state.rowData.length > 10 ? 10 : this.state.rowData.length}  
              pageSizeOptions = {[20,40,60]}  
              /> 
              :null
          }
          </div>
          
          </center>
          
        </div>
      )
    }
  }

export default DashboardLegal;
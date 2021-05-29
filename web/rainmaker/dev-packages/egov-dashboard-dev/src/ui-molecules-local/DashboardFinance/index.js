import React, { Component } from "react";
import { Doughnut, Bar, HorizontalBar, Line, Pie } from 'react-chartjs-2';
import CardContent from '@material-ui/core/CardContent';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css" ;
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './financeIndex.css';


const isMobile = window.innerWidth < 500
const responsiveSizeHack = isMobile ? window.innerWidth + 400 : window.innerWidth

const containerGraphMobile = {
    position: "relative",
    display: "block",
    overflowX: "auto"
}

class DashboardFinance extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            checkData : [],
            dropdownSelected : "",
            allData: [],
            dataOne: [],
            dataTwo: [],
            dataThree: [],
            dataFour: [],
            dataFive: [],
            dataSix: [],
            dataSeven: [],
            dataEight: [],
            graphOneLabel: [],
            graphTwoLabel: [],
            graphThreeLabel: [],
            graphFourLabel: [],
            graphFiveLabel: [],
            graphSixLabel: [],
            graphSevenLabel: [],
            graphEightLabel: [],
            graphOneData: [],
            graphTwoData: [],
            graphThreeData: [],
            graphFourData: [],
            graphFiveData: [],
            graphSixData: [],
            graphSevenData: [],
            graphEightData: [],
            graphClicked: -1,
            hardJSON: [],
            graphHardOneData : {},
            graphHardTwoData : {},
            rowData: [],
            columnData: [],
            // Feature Table
            toggleColumnCheck: false,
            unchangeColumnData: [],
            colorRandom : [],
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

    var colData = [];
    for(var i=0; i<columnData.length; i++){
        colData.push(columnData[i]["Header"]);
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
    var dropdownVal = this.state.dropdownSelected.replaceAll("expDeptwise", " Expenditure Department Wise");
    dropdownVal = dropdownVal.replaceAll("incomeDeptwise", " Income Department Wise");
    dropdownVal = dropdownVal.replaceAll("budgetHeadwise", " Head Wise");
    
    const pdfTitle = "Finance"+dropdownVal+" Dashboard"
    doc.text(pdfTitle, pageWidth / 2, 40, 'center');

    doc.autoTable({ html: '#my-table' });
    doc.setFontSize(5);

    doc.autoTable({
        // head: [tableColumnDataCamel],
        head: [colData],
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
    
    graphSorting = ( sortBy, data, checkGraph ) => {

        debugger;
        if(sortBy ==="BE&AEComparison"){
            
            debugger;
            var sortNo = null;
            var group = data.reduce((r, a) => {
                r[a["functionCode"]] = [...r[a["functionCode"]] || [], a];
                return r;
                }, {});

            var graphOneLabel = Object.keys(group);
            var graphOneData = []
            var aeData = [];
            var beData = [];
            for(var i=0; i<Object.keys(group).length ; i++){
                var item = group[Object.keys(group)[i]];
                var ae = 0;
                var be = 0;
                for(var j=0; j<item.length; j++){
                    ae = ae + item[j].ae;
                    be = be + item[j].be
                }
                aeData.push(ae);
                beData.push(be);
            }
            graphOneData = [aeData, beData]

            return [ graphOneLabel, graphOneData, group ]
        }
    
    debugger;
    var sortNo = null;
    var group = data.reduce((r, a) => {
        r[a[sortBy]] = [...r[a[sortBy]] || [], a];
        return r;
        }, {});

    var graphOneLabel = Object.keys(group);
    var graphOneData = []
    for(var i=0; i<Object.keys(group).length ; i++){
        graphOneData.push(group[graphOneLabel[i]].length);
    }

    return [ graphOneLabel, graphOneData, group ]
    
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

    dateRange = (startDate, endDate) => {
        var monthJSON = {"01":"JAN","02":"FEB","03":"MAR","04":"APR","05":"MAY","06":"JUN","07":"JUL",
        "08":"AUG","09":"SEP","10":"OCT","11":"NOV","12":"DEC"};
        var start      = startDate.split('-');
        var end        = endDate.split('-');
        var startYear  = parseInt(start[0]);
        var endYear    = parseInt(end[0]);
        var dates      = [];

        for(var i = startYear; i <= endYear; i++) {
            var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
            var startMon = i === startYear ? parseInt(start[1])-1 : 0;
            for(var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j+1) {
            var month = j+1;
            var displayMonth = month < 10 ? '0'+month : month;
            // dates.push([i, displayMonth, '01'].join('-'));
            dates.push([i, monthJSON[displayMonth]].join('-'));
            }
        }
        return dates;
    }

    colorRandom = (data) =>{
        debugger;
        var ict_unit = [];
        var efficiency = [];
        var coloR = [];

        var dynamicColors = function() {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        return "rgb(" + r + "," + g + "," + b + ")";
        };

        for (var i in data) {
        ict_unit.push("ICT Unit " + data[i].ict_unit);
        efficiency.push(data[i].efficiency);
        coloR.push(dynamicColors());
        }
        return coloR
    }

    dateTimeToForma = (frommDT, toDT) => {
        var dt1 = new Date(frommDT); 
        var dateCnt = dt1.getDate() < 10 ? "0"+dt1.getDate() : dt1.getDate();
        var month = dt1.getMonth() < 10 ? "0"+(dt1.getMonth()+1) : dt1.getMonth()+1;
        var year = dt1.getFullYear();
        dt1 = year+"-"+month+"-"+dateCnt
        var dt2 = new Date(toDT);
        dateCnt = dt2.getDate() < 10 ? "0"+dt2.getDate() : dt2.getDate();
        month = dt2.getMonth() < 10 ? "0"+(dt2.getMonth()+1) : dt2.getMonth()+1;
        year = dt2.getFullYear();
        dt2 = year+"-"+month+"-"+dateCnt


        return [dt1, dt2]
    }

    componentDidMount(){
        debugger;
        const propsData = this.props.data;
        this.setState({
            checkData : this.props.data
        })
    }

    componentDidUpdate(){
        debugger;
        const propsData = this.props.data;
        if(JSON.stringify(propsData) !== JSON.stringify(this.state.checkData)){
            // const propSortBy = "budgetHeadwise";
            // const propSortBy = "incomeDeptwise";
            // const propSortBy = "expDeptwise";
            const propSortBy = propsData[1].reportSortBy.value;

            var fromDT = propsData[1].fromDate
            var toDT = propsData[1].toDate

            var dateFormat = this.dateTimeToForma(fromDT, toDT);
            var dateRange = this.dateRange(dateFormat[0], dateFormat[1]);

            var data;
            var monthJSON = {"0":"JAN","1":"FEB","2":"MAR","3":"APR","4":"MAY","5":"JUN","6":"JUL",
            "7":"AUG","8":"SEP","9":"OCT","10":"NOV","11":"DEC"};

            if(propSortBy === "budgetHeadwise"){
                // data = Finance_data.getAllBudgetVarienceReport.ResponseBody;
                data = propsData[0].getAllBudgetVarienceReport.ResponseBody
                
                var group = data.reduce((r, a) => {
                    r[a["departmentName"]] = [...r[a["departmentName"]] || [], a];
                    return r;
                    }, {});
                var graphLabel = Object.keys(group);
                var graphData = [];
                for(var i=0; i<graphLabel.length; i++){
                    if(group[graphLabel[i]]){
                        graphData.push(group[graphLabel[i]].length);
                    }else{
                        graphData.push(0);
                    }
                }

                var colorRandom = this.colorRandom(graphLabel);
                this.setState({
                    graphOneLabel: graphLabel,
                    graphOneData: graphData,
                    dataOne: group,
                    colorRandom : colorRandom
                })

                // Column Data
                const tableData = data[0] ? Object.keys(data[0]) : [];
                var columnData = []
                for(var i=0; i<tableData.length; i++){
                    var itemHeader = {}
                    itemHeader["Header"] = this.camelize(tableData[i]);
                    itemHeader["accessor"] = tableData[i];
                    itemHeader["show"]= true ;
                    columnData.push(itemHeader);
                }

                // Column Unchange Data 
                const unchangeColumnData = this.columnUnchange(columnData);

                this.setState({
                    graphDashboard : 0,
                    graphClicked: 0,
                    columnData: columnData,
                    unchangeColumnData: unchangeColumnData,
                    rowData: data,
                    fromDT : fromDT,
                    toDT : toDT,
                })
            }
            if(propSortBy === "incomeDeptwise"){
                // data = Finance_data.getAllIncomeExpentiureSchedules.ResponseBody.Allschedulelist;
                data = propsData[0].getAllIncomeExpentiureSchedules.ResponseBody.Allschedulelist;

                var group = data.reduce((r, a) => {
                    r[a["type"]] = [...r[a["type"]] || [], a];
                    return r;
                    }, {});
                data = group["Income"];
                debugger;
                var sortedData = [];
                for(var i=0; i<data.length; i++){
                    var sotedJSON = {
                        "glCode": data[i].glCode,
                        "accountName": data[i].accountName,
                        "scheduleNo": data[i].scheduleNo,
                        "budgetAmount": data[i].budgetAmount,
                        "majorCode": data[i].majorCode,
                        "scheduleWiseTotal": "",
                        "netAmount": data[i].netAmount["Municipal (General) Fund"],
                        "previousYearAmount": "",
                        "type": data[i].type,
                        "department_name": data[i].department_name,
                        "auditDetails": data[i].auditDetails["createddate"]
                    };
                    sortedData.push(sotedJSON);
                }
                data = sortedData;
                var group = data.reduce((r, a) => {
                    r[new Date(a["auditDetails"]).getFullYear()+"-"+monthJSON[new Date(a["auditDetails"]).getMonth()]] 
                    = [...r[new Date(a["auditDetails"]).getFullYear()+"-"+monthJSON[new Date(a["auditDetails"]).getMonth()]] || [], a];
                    return r;
                    }, {});

                
                var graphLabel = dateRange;
                var graphData = [];
                for(var i=0; i<graphLabel.length; i++){
                    if(group[graphLabel[i]]){
                        graphData.push(group[graphLabel[i]].length);
                    }else{
                        graphData.push(0);
                    }
                }

                var colorRandom = this.colorRandom(graphLabel);
                this.setState({
                    graphThreeLabel: graphLabel,
                    graphThreeData: graphData,
                    dataThree: group,
                    colorRandom : colorRandom
                })

                // Column Data
                const tableData = data[0] ? Object.keys(data[0]) : [];
                var columnData = []
                for(var i=0; i<tableData.length; i++){
                    var itemHeader = {}
                    itemHeader["Header"] = this.camelize(tableData[i]);
                    itemHeader["accessor"] = tableData[i];
                    itemHeader["show"]= true ;
                    columnData.push(itemHeader);
                }

                // Column Unchange Data 
                const unchangeColumnData = this.columnUnchange(columnData);

                this.setState({
                    graphClicked: 0,
                    columnData: columnData,
                    unchangeColumnData: unchangeColumnData,
                    rowData: data,
                    fromDT : fromDT,
                    toDT : toDT,
                })
            }
            if(propSortBy === "expDeptwise"){
                // data = Finance_data.getAllIncomeExpentiureSchedules.ResponseBody.Allschedulelist;
                data = propsData[0].getAllIncomeExpentiureSchedules.ResponseBody.Allschedulelist;
  
                var group = data.reduce((r, a) => {
                    r[a["type"]] = [...r[a["type"]] || [], a];
                    return r;
                    }, {});
                data = group["Expense"];
                debugger;
                var sortedData = [];
                for(var i=0; i<data.length; i++){
                    var sotedJSON = {
                        "glCode": data[i].glCode,
                        "accountName": data[i].accountName,
                        "scheduleNo": data[i].scheduleNo,
                        "budgetAmount": data[i].budgetAmount,
                        "majorCode": data[i].majorCode,
                        "scheduleWiseTotal": "",
                        "netAmount": data[i].netAmount["Municipal (General) Fund"],
                        "previousYearAmount": "",
                        "type": data[i].type,
                        "department_name": data[i].department_name,
                        "auditDetails": data[i].auditDetails["createddate"]
                    };
                    sortedData.push(sotedJSON);
                }
                data = sortedData;
                var group = data.reduce((r, a) => {
                    r[new Date(a["auditDetails"]).getFullYear()+"-"+monthJSON[new Date(a["auditDetails"]).getMonth()]] 
                    = [...r[new Date(a["auditDetails"]).getFullYear()+"-"+monthJSON[new Date(a["auditDetails"]).getMonth()]] || [], a];
                    return r;
                    }, {});

                
                var graphLabel = dateRange;
                var graphData = [];
                for(var i=0; i<graphLabel.length; i++){
                    if(group[graphLabel[i]]){
                        graphData.push(group[graphLabel[i]].length);
                    }else{
                        graphData.push(0);
                    }
                }

                var colorRandom = this.colorRandom(graphLabel);
                this.setState({
                    graphSixLabel: graphLabel,
                    graphSixData: graphData,
                    dataSix: group,
                    colorRandom : colorRandom
                })

                // Column Data
                const tableData = data[0] ? Object.keys(data[0]) : [];
                var columnData = []
                for(var i=0; i<tableData.length; i++){
                    var itemHeader = {}
                    itemHeader["Header"] = this.camelize(tableData[i]);
                    itemHeader["accessor"] = tableData[i];
                    itemHeader["show"]= true ;
                    columnData.push(itemHeader);
                }

                // Column Unchange Data 
                const unchangeColumnData = this.columnUnchange(columnData);

                this.setState({
                    graphClicked: 0,
                    columnData: columnData,
                    unchangeColumnData: unchangeColumnData,
                    rowData: data,
                    fromDT : fromDT,
                    toDT : toDT,
                })
            }

            this.setState({
                checkData : propsData,
                dropdownSelected : propSortBy
            })
        }
    }

    render() {

      // Dropdown 1
      var graphOneSortedData = {
          labels: this.state.graphOneLabel,
          // labels: ["Label1", "Label2"],
          datasets: [
              {
              label: "Application",
              fill: false,
              lineTension: 0.1,
              hoverBorderWidth : 12,
              backgroundColor : this.state.colorRandom,
              // backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
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
              }
          },
          tooltips: {
              enabled: true
          },
          title: {
              display: true,
              text: "Department Wise Budget Dashboard"
          },
          scales: {
              xAxes: [{
                  gridLines: {
                      display:true
                  },
                  ticks :{
                      fontSize: (this.state.graphOneLabel.length > 10 ? 8 : 12)
                  },
                  scaleLabel: {
                      display: true,
                      labelString: "Department"
                      }, 
              }],
              yAxes: [{
                  gridLines: {
                      display:true
                  },
                  ticks: {
                      suggestedMin: 0,
                      // suggestedMax: 100,
                      stepSize: 5
                  },
                  scaleLabel: {
                      display: true,
                      labelString: "No of Application"
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
                  
                  debugger;
                  var ind = element[0]._index;   
                  const selectedVal = this.state.graphOneLabel[ind];
                  const data = this.state.dataOne[selectedVal];
                  var graphSorting = this.graphSorting( "BE&AEComparison", this.state.dataOne[selectedVal] );
                  
                  this.setState({
                      graphTwoLabel: graphSorting[0],
                      graphTwoData: graphSorting[1],
                      dataTwo: graphSorting[2],
                      graphClicked: 1,
                      graphDashboard : 1,
                      rowData: this.state.dataOne[selectedVal]
                  })
                  
              }
          },
      }

      // Dropdown 1
      var graphTwoSortedData = {
          labels: this.state.graphTwoLabel,
          datasets: [
              {
              label: "AE",
              fill: false,
              lineTension: 0.1,
              hoverBorderWidth : 12,
              backgroundColor : this.state.colorRandom,
              // backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
              borderColor: "rgba(75,192,192,0.4)",
              borderCapStyle: "butt",
              barPercentage: 2,
              borderWidth: 5,
              barThickness: 25,
              maxBarThickness: 10,
              minBarLength: 2,
              data: this.state.graphTwoData[0]
              },
              {
              label: "BE",
              fill: false,
              lineTension: 0.1,
              hoverBorderWidth : 12,
              backgroundColor : this.state.colorRandom,
              // backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
              borderColor: "rgba(75,192,192,0.4)",
              borderCapStyle: "butt",
              barPercentage: 2,
              borderWidth: 5,
              barThickness: 25,
              maxBarThickness: 10,
              minBarLength: 2,
              data: this.state.graphTwoData[1]
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
              text: "Department and Budget Head Wise BE and AE"
          },
          scales: {
              xAxes: [{
                  gridLines: {
                      display:true
                  },
                  scaleLabel: {
                      display: true,
                      labelString: "Department"
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
                      labelString: "No of Application"
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
                  
                  debugger;
                  var ind = element[0]._index;   
                  const selectedVal = this.state.graphTwoLabel[ind];
                  // var graphSorting = this.graphSorting( "agendatype", this.state.dataOne[selectedVal] );
                  
                  this.setState({
                      // graphTwoLabel: graphSorting[0],
                      // graphTwoData: graphSorting[1],
                      // dataTwo: graphSorting[2],
                      graphClicked: 1,
                      rowData: this.state.dataTwo[selectedVal]
                  })
                  
              }
          },
      }

      // Dropdown 2_1
      var graphThreeSortedData = {
          labels: this.state.graphThreeLabel,
          datasets: [
              {
              label: "Application",
              fill: false,
              lineTension: 0.1,
              hoverBorderWidth : 12,
              backgroundColor : this.state.colorRandom,
              // backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
              borderColor: "rgba(75,192,192,0.4)",
              borderCapStyle: "butt",
              barPercentage: 2,
              borderWidth: 5,
              barThickness: 25,
              maxBarThickness: 10,
              minBarLength: 2,
              data: this.state.graphThreeData
              }
          ]
      }
      var graphThreeOption = {
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
              text: "Monthwise Income Dashboard"
          },
          scales: {
              xAxes: [{
                  gridLines: {
                      display:true
                  },
                  scaleLabel: {
                      display: true,
                      labelString: "Months"
                      }, 
              }],
              yAxes: [{
                  gridLines: {
                      display:true
                  },
                  ticks: {
                      suggestedMin: 0,
                      // suggestedMax: 100,
                      stepSize: 5
                  },
                  scaleLabel: {
                      display: true,
                      labelString: "No of Application"
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
                  
                  debugger;
                  var ind = element[0]._index;   
                  const selectedVal = this.state.graphThreeLabel[ind];
                  var graphSorting = this.graphSorting( "department_name", this.state.dataThree[selectedVal] );
                  
                  this.setState({
                      graphFourLabel: graphSorting[0],
                      graphFourData: graphSorting[1],
                      dataFour: graphSorting[2],
                      graphClicked: 1,
                      rowData: this.state.dataThree[selectedVal]
                  })
                  
              }
          },
      }

      // Dropdown 2_2
      var graphFourSortedData = {
          labels: this.state.graphFourLabel,
          datasets: [
              {
              label: "Application",
              fill: false,
              lineTension: 0.1,
              hoverBorderWidth : 12,
              backgroundColor : this.state.colorRandom,
              // backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
              borderColor: "rgba(75,192,192,0.4)",
              borderCapStyle: "butt",
              barPercentage: 2,
              borderWidth: 5,
              barThickness: 25,
              maxBarThickness: 10,
              minBarLength: 2,
              data: this.state.graphFourData
              }
          ]
      }
      var graphFourOption = {
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
              text: "Department Wise Income Dashboard"
          },
          scales: {
              xAxes: [{
                  gridLines: {
                      display:true
                  },
                  scaleLabel: {
                      display: true,
                      labelString: "Department"
                      }, 
              }],
              yAxes: [{
                  gridLines: {
                      display:true
                  },
                  ticks: {
                      suggestedMin: 0,
                      // suggestedMax: 100,
                      stepSize: 5
                  },
                  scaleLabel: {
                      display: true,
                      labelString: "No of Application"
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
                  
                  debugger;
                  var ind = element[0]._index;   
                  const selectedVal = this.state.graphFourLabel[ind];
                  var graphSorting = this.graphSorting( "accountName", this.state.dataFour[selectedVal] );
                  
                  var accountName = graphSorting[0];
                  var data = graphSorting[2];
                  var graphData = [];
                  for(var i=0; i<accountName.length; i++){
                      var amt = 0;
                      for(var j=0; j<data[accountName[i]].length; j++){
                          amt = amt + data[accountName[i]][j].netAmount;
                      }
                      graphData.push(amt);
                  }

                  this.setState({
                      graphFiveLabel: graphSorting[0],
                      graphFiveData: graphData,
                      dataFive: graphSorting[2],
                      graphClicked: 2,
                      rowData: this.state.dataFour[selectedVal]
                  })
                  
              }
          },
      }

      // Dropdown 2_3
      var graphFiveSortedData = {
          labels: this.state.graphFiveLabel,
          datasets: [
              {
              label: "Amount",
              fill: false,
              lineTension: 0.1,
              hoverBorderWidth : 12,
              backgroundColor : this.state.colorRandom,
              // backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
              borderColor: "rgba(75,192,192,0.4)",
              borderCapStyle: "butt",
              barPercentage: 2,
              borderWidth: 5,
              barThickness: 25,
              maxBarThickness: 10,
              minBarLength: 2,
              data: this.state.graphFiveData
              }
          ]
      }
      var graphFiveOption = {
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
              text: "Head Wise Income Dashboard"
          },
          scales: {
              xAxes: [{
                  gridLines: {
                      display:true
                  },
                  scaleLabel: {
                      display: true,
                      labelString: "Account Name"
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
                      labelString: " Amount (INR)"
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
                  
                  debugger;
                  var ind = element[0]._index;   
                  const selectedVal = this.state.graphFiveLabel[ind];
                  // var graphSorting = this.graphSorting( "agendatype", this.state.dataOne[selectedVal] );
                  
                  this.setState({
                      // graphTwoLabel: graphSorting[0],
                      // graphTwoData: graphSorting[1],
                      // dataTwo: graphSorting[2],
                      graphClicked: 3,
                      rowData: this.state.dataFive[selectedVal]
                  })
                  
              }
          },
      }

      // Dropdown 3_1
      var graphSixSortedData = {
          labels: this.state.graphSixLabel,
          datasets: [
              {
              label: "Application",
              fill: false,
              lineTension: 0.1,
              hoverBorderWidth : 12,
              backgroundColor : this.state.colorRandom,
              // backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
              borderColor: "rgba(75,192,192,0.4)",
              borderCapStyle: "butt",
              barPercentage: 2,
              borderWidth: 5,
              barThickness: 25,
              maxBarThickness: 10,
              minBarLength: 2,
              data: this.state.graphSixData
              }
          ]
      }
      var graphSixOption = {
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
              text: "Monthwise Expenditure Dashboard"
          },
          scales: {
              xAxes: [{
                  gridLines: {
                      display:true
                  },
                  scaleLabel: {
                      display: true,
                      labelString: "Months"
                      }, 
              }],
              yAxes: [{
                  gridLines: {
                      display:true
                  },
                  ticks: {
                      suggestedMin: 0,
                      // suggestedMax: 100,
                      stepSize: 5
                  },
                  scaleLabel: {
                      display: true,
                      labelString: "No of Application"
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
                  
                  debugger;
                  var ind = element[0]._index;   
                  const selectedVal = this.state.graphSixLabel[ind];
                  var graphSorting = this.graphSorting( "department_name", this.state.dataSix[selectedVal] );
                  
                  this.setState({
                      graphSevenLabel: graphSorting[0],
                      graphSevenData: graphSorting[1],
                      dataSeven: graphSorting[2],
                      graphClicked: 1,
                      rowData: this.state.dataSix[selectedVal]
                  })
                  
              }
          },
      }

      // Dropdown 3_2
      var graphSevenSortedData = {
          labels: this.state.graphSevenLabel,
          datasets: [
              {
              label: "Application",
              fill: false,
              lineTension: 0.1,
              hoverBorderWidth : 12,
              backgroundColor : this.state.colorRandom,
              // backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
              borderColor: "rgba(75,192,192,0.4)",
              borderCapStyle: "butt",
              barPercentage: 2,
              borderWidth: 5,
              barThickness: 25,
              maxBarThickness: 10,
              minBarLength: 2,
              data: this.state.graphSevenData
              }
          ]
      }
      var graphSevenOption = {
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
              text: "Department Wise Expenditure Dashboard"
          },
          scales: {
              xAxes: [{
                  gridLines: {
                      display:true
                  },
                  scaleLabel: {
                      display: true,
                      labelString: "Department"
                      }, 
              }],
              yAxes: [{
                  gridLines: {
                      display:true
                  },
                  ticks: {
                      suggestedMin: 0,
                      // suggestedMax: 100,
                      stepSize: 5
                  },
                  scaleLabel: {
                      display: true,
                      labelString: "No of Application"
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
                  
                  debugger;
                  var ind = element[0]._index;   
                  const selectedVal = this.state.graphSevenLabel[ind];
                  var graphSorting = this.graphSorting( "accountName", this.state.dataSeven[selectedVal] );
                  
                  var accountName = graphSorting[0];
                  var data = graphSorting[2];
                  var graphData = [];
                  for(var i=0; i<accountName.length; i++){
                      var amt = 0;
                      for(var j=0; j<data[accountName[i]].length; j++){
                          amt = amt + data[accountName[i]][j].netAmount;
                      }
                      graphData.push(amt);
                  }

                  this.setState({
                      graphEightLabel: graphSorting[0],
                      graphEightData: graphData,
                      dataEight: graphSorting[2],
                      graphClicked: 2,
                      rowData: this.state.dataSeven[selectedVal]
                  })
                  
              }
          },
      }

      // Dropdown 3_3
      var graphEightSortedData = {
          labels: this.state.graphEightLabel,
          datasets: [
              {
              label: "Amount",
              fill: false,
              lineTension: 0.1,
              hoverBorderWidth : 12,
              backgroundColor : this.state.colorRandom,
              // backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
              borderColor: "rgba(75,192,192,0.4)",
              borderCapStyle: "butt",
              barPercentage: 2,
              borderWidth: 5,
              barThickness: 25,
              maxBarThickness: 10,
              minBarLength: 2,
              data: this.state.graphEightData
              }
          ]
      }
      var graphEightOption = {
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
              text: "Head Wise Expenditure Dashboard"
          },
          scales: {
              xAxes: [{
                  gridLines: {
                      display:true
                  },
                  scaleLabel: {
                      display: true,
                      labelString: "Account Name"
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
                      labelString: " Amount (INR)"
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
                  
                  debugger;
                  var ind = element[0]._index;   
                  const selectedVal = this.state.graphFiveLabel[ind];
                  // var graphSorting = this.graphSorting( "agendatype", this.state.dataOne[selectedVal] );
                  
                  this.setState({
                      // graphTwoLabel: graphSorting[0],
                      // graphTwoData: graphSorting[1],
                      // dataTwo: graphSorting[2],
                      graphClicked: 3,
                      rowData: this.state.dataFive[selectedVal]
                  })
                  
              }
          },
      }

      return (
          <div>        
          
          {/* Dropdown 1 */}
          {
            this.state.dropdownSelected === "budgetHeadwise" ?
            <div className="graphContainer">
            {
                this.state.graphClicked >= 0 ?
                <div
                style={window.innerWidth < 500 ? containerGraphMobile : containerGraphMobile}
                >
                    <div className="graphData" >
                        <Bar
                            height="350px"
                            data={ graphOneSortedData }
                            options={ graphOneOption }                 
                        />
                    </div>
                </div>
                :null
            }
            
            {
                this.state.graphClicked > 0 ?
                <div
                style={window.innerWidth < 500 ? containerGraphMobile : containerGraphMobile}
                >
                    <div className="graphData" >
                        <Bar
                            height="350px"
                            data={ graphTwoSortedData }
                            options={ graphTwoOption }                 
                        />
                    </div>
                </div>
                :null
            }
            </div>
            
            :null
          }
          {/* Dropdown 2 */}
          {
            this.state.dropdownSelected === "incomeDeptwise" ?
            <div className="graphContainer" >
            {
                this.state.graphClicked >= 0 ?
                <div
                style={window.innerWidth < 500 ? containerGraphMobile : containerGraphMobile}
                >
                    <div className="graphData" >
                        <Bar
                            height="350px"
                            data={ graphThreeSortedData }
                            options={ graphThreeOption }                 
                        />
                    </div>
                </div>
                :null
            }
            
            {
                this.state.graphClicked > 0 ?
                <div
                  style={window.innerWidth < 500 ? containerGraphMobile : containerGraphMobile}
                  >
                      <div className="graphData" >
                          <Bar
                              height="350px"
                              data={ graphFourSortedData }
                              options={ graphFourOption }                 
                          />
                      </div>
                  </div>
                  :null
                }
                </div>
              :null
          }
          {
            this.state.dropdownSelected === "incomeDeptwise" ?
            <div className="graphContainer" >
          {
              this.state.graphClicked >= 2 ?
              <div
                  style={window.innerWidth < 500 ? containerGraphMobile : containerGraphMobile}
                  >
                      <div className="graphData" >
                          <Bar
                              height="350px"
                              data={ graphFiveSortedData }
                              options={ graphFiveOption }                 
                          />
                      </div>
                  </div>
                  :null
              }
              </div>
              :null
          }
          {/* Dropdown 3 */}
          {
            this.state.dropdownSelected === "expDeptwise" ?
            <div className="graphContainer">
            {
                this.state.graphClicked >= 0 ?
                <div
                style={window.innerWidth < 500 ? containerGraphMobile : containerGraphMobile}
                >
                    <div className="graphData" >
                        <Bar
                            height="350px"
                            data={ graphSixSortedData }
                            options={ graphSixOption }                 
                        />
                    </div>
                </div>
                :null
            }
            
            {
                this.state.graphClicked > 0 ?
                <div
                    style={window.innerWidth < 500 ? containerGraphMobile : containerGraphMobile}
                    >
                        <div className="graphData" >
                            <Bar
                                height="350px"
                                data={ graphSevenSortedData }
                                options={ graphSevenOption }                 
                            />
                        </div>
                    </div>
                    :null
                }
                </div>
                :null    
          }
          {
            this.state.dropdownSelected === "expDeptwise" ?
            <div className="graphContainer">
            {
              this.state.graphClicked >= 2 ?
              <div
              style={window.innerWidth < 500 ? containerGraphMobile : containerGraphMobile}
              >
                  <div className="graphData" >
                      <Bar
                          height="350px"
                          data={ graphEightSortedData }
                          options={ graphEightOption }                 
                      />
                  </div>
              </div>
              :null
            }
            </div>
            :null
          }
          {/* Table Feature  */}
          <div className="tableContainer" style={this.state.graphClicked >= 0 ? null : {display:"none"}}>
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
          </div>
      );
      }
}

export default DashboardFinance;
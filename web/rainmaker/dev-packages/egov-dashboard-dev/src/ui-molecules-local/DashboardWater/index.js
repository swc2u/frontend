import React, { Component } from "react";
import { Doughnut, Bar, HorizontalBar, Line, Pie } from 'react-chartjs-2';
import CardContent from '@material-ui/core/CardContent';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css" ;
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './waterIndex.css'

const isMobile = window.innerWidth < 500
const responsiveSizeHack = isMobile ? window.innerWidth + 400 : window.innerWidth

var colorArray = [
    "#b47162", "#66991A", "#4f0f6f", "#1d1d58", "#947002", "#bde052", "#e08c56",
    "#7ad236", "#7260d8", "#1deaa7", "#06f43a", "#823c59", "#e3d94c", "#dc1c06",
    "#f53b2a", "#b46238", "#2dfff6", "#a82b89", "#1a8011", "#436a9f", "#1a806a",
                '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
                '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
                '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
                '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A'];

class WaterDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
        checkData : [],
        dropdownSelected : "",
        allData: [],
        dataOne: [],
        dataTwo: [],
        dataThird : [],
        dataFourth : [],
        dataFifth : [],
        graphOneLabel: [],
        graphOneSHOWLabel: [],
        graphOneData: [],
        graphTwoLabelSHOW : [],
        graphTwoLabel: [],
        graphTwoData: [],
        graphThirdLabel : [],
        graphThirdData : [],
        graphFourthLabel : [],
        graphFourthData : [],
        graphFifthLabel : [],
        graphFifthData : [],
        graphClicked: -1,
        hardJSON: [],
        rowData: [],
        columnData: [],
        // Feature Table
        toggleColumnCheck: false,
        unchangeColumnData: []
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
    const pdfTitle = "Water Dashboard"
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
    
    graphSorting = (data, sortBy, dropdownSelected, selectedDashboard ) => {
        var monthJSON = {"0":"JAN","1":"FEB","2":"MAR","3":"APR","4":"MAY","5":"JUN","6":"JUL",
        "7":"AUG","8":"SEP","9":"OCT","10":"NOV","11":"DEC"};
        if(sortBy === "applicationStatus"){
            var dateRangeData = data;
            var sortBy = sortBy;
            var group = dateRangeData.reduce((r, a) => {
                r[a["applicationStatus"]] = [...r[a["applicationStatus"]] || [], a];
                return r;
                }, {});
            // _.omit(group, "INITIATED")
            delete group["INITIATED"]
            
            var graphLabel = Object.keys(group);
            var graphData = [];
            for(var i=0; i<graphLabel.length; i++){
                graphData.push(group[graphLabel[i]].length);
            }
            return [graphLabel, graphData, group]
        }
        debugger;
        var dateRangeData = data;
        var sortBy = sortBy;
        var group = dateRangeData.reduce((r, a) => {
            r[a[sortBy]] = [...r[a[sortBy]] || [], a];
            return r;
            }, {});
        
        var graphLabel = Object.keys(group);
        var graphData = [];
        for(var i=0; i<graphLabel.length; i++){
            graphData.push(group[graphLabel[i]].length);
        }
        return [graphLabel, graphData, group]

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
            checkData : propsData
        })      
    }

    componentDidUpdate(){
        debugger;
        const propsData = this.props.data;
        if(JSON.stringify(this.state.checkData) !== JSON.stringify(propsData)){

            var monthJSON = {"0":"JAN","1":"FEB","2":"MAR","3":"APR","4":"MAY","5":"JUN","6":"JUL",
            "7":"AUG","8":"SEP","9":"OCT","10":"NOV","11":"DEC"};

            // var fromDT = 1596220200000;
            var fromDT =propsData[1].RequestBody.startDate;
            // var toDT = 1620092755009;
            var toDT = propsData[1].RequestBody.endDate;
            // var dropdownSelected = "applicationStatusReport";
            // var dropdownSelected = "collectionReport";
            var dropdownSelected = propsData[1].reportSortBy.value;
            var data = propsData[0];
            if(data.WaterConnection.length > 0){
                
                if(dropdownSelected === "applicationStatusReport"){
 
                    data = data.WaterConnection;
                    var sortedData = [];
                    for(var i=0; i<data.length; i++){
                        var item = data[i].waterApplicationList;
                        for(var j=0; j<item.length; j++){
                            var parentApplication = data[i];
                            var dataItem = item[j];
                            var dt = new Date(dataItem.auditDetails.lastModifiedTime);
                            var day = dt.getDate() < 10 ? "0"+dt.getDate() : dt.getDate();
                            var dt_Month = dt.getMonth() < 10 ? "0"+dt.getMonth() : dt.getMonth();
                            var dt_Year = dt.getFullYear();
                            dt = dt_Year+"-"+dt_Month+"-"+day;
                            var itemApplication = {
                                "applicationNo" : dataItem.applicationNo,
                                "applicationStatus" : dataItem.applicationStatus,
                                "status" : parentApplication.status,
                                "activityType" : dataItem.activityType,
                                "billGroup" : parentApplication.billGroup,
                                "leagerGroup" : parentApplication.ledgerGroup,
                                "proposedPipeSize" : parentApplication.proposedPipeSize,
                                "subDiv" : parentApplication.subdiv,
                                "plotNo" : parentApplication.waterProperty.plotNo,
                                "sectorNo" : parentApplication.waterProperty.sectorNo,
                                "usageSubCategory" : parentApplication.waterProperty.usageSubCategory,
                                "usageCategory" : parentApplication.waterProperty.usageCategory,
                                "connectionOwnerDetails" : parentApplication.connectionHolders ? parentApplication.connectionHolders[0].name : "",
                                "auditDetails" : dt,
                                "amountPaid" : dataItem.totalAmountPaid
                            };
                            sortedData.push(itemApplication);
                        }
                    }

                    data = sortedData;

                    var graphData = this.graphSorting(data, "activityType", "dropdown_1_One");
                    // Change here for First label change
                    var showOneLabel = [];
                    // for(){

                    // }


                    // Col Data
                    var columnData = [];
                    for(var i=0; i<Object.keys(data[0]).length; i++){
                        var item = {};
                        item["Header"] = this.camelize(Object.keys(data[0])[i]);
                        item["accessor"] = Object.keys(data[0])[i];
                        item["show"] = true;
                        columnData.push(item);
                    }

                    var labelChangeJSON= {
                        "NEW_WS_CONNECTION":"Application for Regular Water connection",
                        "CONNECTION_CONVERSION":"Application to convert tariff type",
                        "APPLY_FOR_TEMPORARY_CONNECTION":"Application for temporary Water Connection",
                        "APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION":"Application for Temporary to temporary Connection",
                        "TEMPORARY_DISCONNECTION":"Application for temporary Disconnection/ NDC for Government houses",
                        "PERMANENT_DISCONNECTION":"Application for permanent disconnection",
                        "UPDATE_CONNECTION_HOLDER_INFO":"Application to update connection holder information",
                        "APPLY_FOR_TEMPORARY_REGULAR_CONNECTION":"Application for Temporary to Regular Connection",
                        "UPDATE_METER_INFO":"Application to change water meter",
                        "NEW_TUBEWELL_CONNECTION":"Application for tubewell Connection",
                        "REACTIVATE_CONNECTION":"Application to Reactivate connection"
                    }
                    var graphOneSHOWLabel = [];
                    for(var i=0; i<graphData[0].length; i++){
                        graphOneSHOWLabel.push(labelChangeJSON[graphData[0][i]]);
                    }

                    this.setState({
                        graphOneSHOWLabel : graphOneSHOWLabel,
                        graphOneLabel : graphData[0],
                        graphOneData : graphData[1],
                        dataOne : graphData[2],
                        rowData: data,
                        columnData: columnData,
                        unchangeColumnData : columnData,
                        graphClicked : 0

                    })
                }
                if(dropdownSelected === "collectionReport"){
                    data = data.WaterConnection;

                    var sortedData = [];
                    for(var i=0; i<data.length; i++){
                        var item = data[i].waterApplicationList;
                        for(var j=0; j<item.length; j++){
                            var parentApplication = data[i];
                            var dataItem = item[j];
                            var dt = new Date(dataItem.auditDetails.lastModifiedTime);
                            var day = dt.getDate() < 10 ? "0"+dt.getDate() : dt.getDate();
                            var dt_Month = dt.getMonth() < 10 ? "0"+dt.getMonth() : dt.getMonth();
                            var dt_Year = dt.getFullYear();
                            dt = dt_Year+"-"+dt_Month+"-"+day;
                            var itemApplication = {
                                "applicationNo" : dataItem.applicationNo,
                                "applicationStatus" : dataItem.applicationStatus,
                                "status" : parentApplication.status,
                                "activityType" : dataItem.activityType,
                                "billGroup" : parentApplication.billGroup,
                                "leagerGroup" : parentApplication.ledgerGroup,
                                "proposedPipeSize" : parentApplication.proposedPipeSize,
                                "subDiv" : parentApplication.subdiv,
                                "plotNo" : parentApplication.waterProperty.plotNo,
                                "sectorNo" : parentApplication.waterProperty.sectorNo,
                                "usageSubCategory" : parentApplication.waterProperty.usageSubCategory,
                                "usageCategory" : parentApplication.waterProperty.usageCategory,
                                "connectionOwnerDetails" : parentApplication.connectionHolders ? parentApplication.connectionHolders[0].name : "",
                                "auditDetails" : dt,
                                "amountPaid" : dataItem.totalAmountPaid
                            };
                            sortedData.push(itemApplication);
                        }
                    }

                    debugger;
                    data = sortedData;
                    var datesFormatted = this.dateTimeToForma(fromDT, toDT);
                    var dataRangeLabel = this.dateRange(datesFormatted[0], datesFormatted[1]);
                    
                    var group = data.reduce((r, a) => {
                        r[new Date(a["auditDetails"]).getFullYear()+"-"+monthJSON[(new Date(a["auditDetails"]).getMonth()+1)]] = 
                        [...r[new Date(a["auditDetails"]).getFullYear()+"-"+monthJSON[(new Date(a["auditDetails"]).getMonth()+1)]] || [], a];
                        return r;
                        }, {});
                    
                    debugger;
                    var graphFifthData = [];
                    for(var i=0; i<dataRangeLabel.length; i++){
                        if(group[dataRangeLabel[i]]){
                            var item = group[dataRangeLabel[i]];
                            var amt = 0 ;
                            for(var j=0; j<item.length; j++){
                                var amount = item[j].amountPaid === null ? 0 : item[j].amountPaid;
                                amt = amt + parseInt(amount);
                            }
                            graphFifthData.push(amt/100000)
                        }else{
                            graphFifthData.push(0)
                        }
                    }
                    // Col Data
                    var columnData = [];
                    for(var i=0; i<Object.keys(data[0]).length; i++){
                        var item = {};
                        item["Header"] = this.camelize(Object.keys(data[0])[i]);
                        item["accessor"] = Object.keys(data[0])[i];
                        item["show"] = true;
                        columnData.push(item);
                    }

                    this.setState({
                        // graphFifthSHOWLabel : graphOneSHOWLabel,
                        graphFifthLabel : dataRangeLabel,
                        graphFifthData : graphFifthData,
                        dataFifth : group,
                        rowData: data,
                        columnData: columnData,
                        unchangeColumnData : columnData,
                        graphClicked : 0
                    })
                }
                this.setState({
                    recordNotFound : "",
                })
            }else{
                this.setState({
                    recordNotFound : "Record Not Found..!",
                    rowData : [],
                    graphClicked : -1
                })
            }
            this.setState({
                dropdownSelected : dropdownSelected,
                fromDT : fromDT,
                toDT : toDT,
            })
            this.setState({
                checkData : propsData,
            })
        }
    }

    render() {
    

    // Dropdown_1 Pie Graph
    var graphOneSortedData = {
        labels: this.state.graphOneSHOWLabel,
        // labels: ["Label1", "Label2"],
        datasets: [
            {
            label: "Application",
            fill: false,
            lineTension: 0.1,
            hoverBorderWidth : 12,
            // backgroundColor : this.state.colorRandom,
            backgroundColor : colorArray,
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
            display: true,
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
            text: "Water Connection Applications"
        },
        // scales: {
        //     xAxes: [{
        //         gridLines: {
        //             display:true
        //         },
        //         scaleLabel: {
        //             display: true,
        //             labelString: "X AXIS"
        //             }, 
        //     }],
        //     yAxes: [{
        //         gridLines: {
        //             display:true
        //         },
        //         ticks: {
        //             suggestedMin: 0,
        //             // suggestedMax: 100,
        //             // stepSize: 1
        //         },
        //         scaleLabel: {
        //             display: true,
        //             labelString: "Y AXIS"
        //             }, 
        //     }]
        // },
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
                var selectedVal = this.state.graphOneLabel[ind];
                var data = this.state.dataOne[selectedVal];
                if(data){
                    var graphData = this.graphSorting(data, "applicationStatus", "dropdown_1_One");
                
                    var graphTwoLabelSHOW = [];
                    for(var i=0; i<graphData[0].length; i++){
                        var show_label = graphData[0][i] ;
                        show_label = show_label.replaceAll("_", " ");
                        show_label = show_label.charAt(0).toUpperCase() + show_label.substring(1).toLowerCase()
                        graphTwoLabelSHOW.push(show_label);
                    }
                    this.setState({
                        graphTwoLabelSHOW : graphTwoLabelSHOW,
                        graphTwoLabel : graphData[0],
                        graphTwoData : graphData[1],
                        dataTwo : graphData[2],
                        graphClicked : 1,
                        rowData : data,
                    })
                }
            }
        },
    }

    // Dropdown_1 Pie Graph
    var graphTwoSortedData = {
        labels: this.state.graphTwoLabelSHOW,
        // labels: ["Label1", "Label2"],
        datasets: [
            {
            label: "SEP",
            fill: false,
            lineTension: 0.1,
            hoverBorderWidth : 12,
            backgroundColor : colorArray,
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
            display: true,
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
            text: "Water Connection Applications Status"
        },
        // scales: {
        //     xAxes: [{
        //         gridLines: {
        //             display:true
        //         },
        //         scaleLabel: {
        //             display: true,
        //             labelString: "X AXIS"
        //             }, 
        //     }],
        //     yAxes: [{
        //         gridLines: {
        //             display:true
        //         },
        //         ticks: {
        //             suggestedMin: 0,
        //             // suggestedMax: 100,
        //             // stepSize: 1
        //         },
        //         scaleLabel: {
        //             display: true,
        //             labelString: "Y AXIS"
        //             }, 
        //     }]
        // },
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
                var selectedVal = this.state.graphTwoLabel[ind];
                var data = this.state.dataTwo[selectedVal];
                if(data){
                    var graphData = this.graphSorting(data, "subDiv", "dropdown_1_SubDivision");
                
                    debugger;
                    var thirdlabel = graphData[0];
                    var thirdData = [0,0,0,0,0];
                    for(var i=0; i<thirdlabel.length; i++){
                        if(thirdlabel[i] === "08"){
                            thirdData[0] = graphData[1][i];
                        }
                        else if(thirdlabel[i] === "09"){
                            thirdData[1] = graphData[1][i];
                        }
                        else if(thirdlabel[i] === "14"){
                            thirdData[2] = graphData[1][i];
                        }
                        else if(thirdlabel[i] === "15"){
                            thirdData[3] = graphData[1][i];
                        }
                        else if(thirdlabel[i] === "20"){
                            thirdData[4] = graphData[1][i];
                        }else{
                            thirdData[5] = graphData[1][i];
                        }
                    }

                    this.setState({
                        // graphThirdLabel : graphData[0],
                        graphThirdLabel : ["Sub-Division 08", "Sub-Division 09", "Sub-Division 14", "Sub-Division 15", "Sub-Division 20"],
                        graphThirdData : thirdData,
                        dataThird : graphData[2],
                        graphClicked : 2,
                        rowData : data,
                    })
                }
            }
        },
    }

    // Dropdown_1 Bar Graph
    var graphThirdSortedData = {
        labels: this.state.graphThirdLabel,
        // labels: ["Label1", "Label2"],
        datasets: [
            {
            label: "No of applcation",
            fill: false,
            lineTension: 0.1,
            hoverBorderWidth : 12,
            // backgroundColor : this.state.colorRandom,
            backgroundColor : ["#9DC4E1", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
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
            text: "Sub-division Wise Appllication Status"
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display:true
                },
                scaleLabel: {
                    display: true,
                    labelString: "Sub-division Wise Water Application"
                    }, 
            }],
            yAxes: [{
                gridLines: {
                    display:true
                },
                ticks: {
                    suggestedMin: 0,
                    // suggestedMax: 100,
                    // stepSize: 1
                },
                scaleLabel: {
                    display: true,
                    labelString: "No of Applications"
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
                var selectedVal = this.state.graphThirdLabel[ind];
                selectedVal = selectedVal.substring(selectedVal.length-2, selectedVal.length)
                var data = this.state.dataThird[selectedVal];
                if(data){
                    var graphData = this.graphSorting(data, "auditDetails", "dropdown_1_One");

                    var fourthLabel = graphData[0];
                    var fourthData = [0,0,0,0,0,0];
                    for(var i=0; i<fourthLabel.length; i++){
                        var dt = new Date(fourthLabel[i]).getMonth();
                        if(dt === 0 || dt === 1){
                            fourthData[0] = fourthData[0] + graphData[1][i];
                        }
                        if(dt === 2 || dt === 3){
                            fourthData[1] = fourthData[1] + graphData[1][i];
                        }
                        if(dt === 4 || dt === 5){
                            fourthData[2] = fourthData[2] + graphData[1][i];
                        }
                        if(dt === 6 || dt === 7){
                            fourthData[3] = fourthData[3] + graphData[1][i];
                        }
                        if(dt === 8 || dt === 9){
                            fourthData[4] = fourthData[4] + graphData[1][i];
                        }
                        if(dt === 10 || dt === 11){
                            fourthData[5] = fourthData[5] + graphData[1][i];
                        }
                    }

                    this.setState({
                        // graphFourthLabel : graphData[0],
                        graphFourthLabel : ["Cycle 1", "Cycle 2", "Cycle 3", "Cycle 4", "Cycle 5", "Cycle 6"],
                        graphFourthData : fourthData,
                        dataFourth : graphData[2],
                        graphClicked : 3,
                        rowData : data,
                    })
                }
            }
        },
    }

    // Dropdown_1 Bar Graph
    var graphFourthSortedData = {
        labels: this.state.graphFourthLabel,
        // labels: ["Label1", "Label2"],
        datasets: [
            {
            label: "No of Application",
            fill: false,
            lineTension: 0.1,
            hoverBorderWidth : 12,
            // backgroundColor : this.state.colorRandom,
            backgroundColor : ["#9DC4E1", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
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
            text: "Billing Cycle Wise Application in Sub-Division"
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display:true
                },
                scaleLabel: {
                    display: true,
                    labelString: "Billing Cycle"
                    }, 
            }],
            yAxes: [{
                gridLines: {
                    display:true
                },
                ticks: {
                    suggestedMin: 0,
                    // suggestedMax: 100,
                    // stepSize: 1
                },
                scaleLabel: {
                    display: true,
                    labelString: "No of Applications"
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
                var selectedVal = this.state.graphFourthLabel[ind];
                // selectedVal = selectedVal.substring(selectedVal.length-1, selectedVal.length)
                var data = this.state.dataFourth;
                
                if(data){
                    var rowData = [];
                    for(var i=0; i<Object.keys(data).length; i++){
                        var dt = new Date(Object.keys(data)[i]).getMonth();
                        if(selectedVal === "Cycle 1"){
                            if(dt === 0 || dt === 1){
                                rowData = rowData.concat(data[Object.keys(data)[i]]);
                            }
                        }
                        if(selectedVal === "Cycle 2"){
                            if(dt === 2 || dt === 3){
                                rowData = rowData.concat(data[Object.keys(data)[i]]);
                            }
                        }
                        if(selectedVal === "Cycle 3"){
                            if(dt === 4 || dt === 5){
                                rowData = rowData.concat(data[Object.keys(data)[i]]);
                            }
                        }
                        if(selectedVal === "Cycle 4"){
                            if(dt === 6 || dt === 7){
                                rowData = rowData.concat(data[Object.keys(data)[i]]);
                            }
                        }
                        if(selectedVal === "Cycle 5"){
                            if(dt === 8 || dt === 9){
                                rowData = rowData.concat(data[Object.keys(data)[i]]);
                            }
                        }
                        if(selectedVal === "Cycle 6"){
                            if(dt === 10 || dt === 11){
                                rowData = rowData.concat(data[Object.keys(data)[i]]);
                            }
                        }
                    }

                    this.setState({
                        // graphFourthLabel : graphData[0],
                        graphClicked : 4,
                        rowData : rowData,
                    })
                }
            }
        },
    }

    // Dropdown_2 Bar Graph
    var graphFifthSortedData = {
        labels: this.state.graphFifthLabel,
        // labels: ["Label1", "Label2"],
        datasets: [
            {
            label: "Amount(In Lakhs)",
            fill: false,
            lineTension: 0.1,
            hoverBorderWidth : 12,
            // backgroundColor : this.state.colorRandom,
            backgroundColor : ["#9DC4E1", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
            borderColor: "rgba(75,192,192,0.4)",
            borderCapStyle: "butt",
            barPercentage: 2,
            borderWidth: 5,
            barThickness: 25,
            maxBarThickness: 10,
            minBarLength: 2,
            data: this.state.graphFifthData
            // data:[10,20,30]
            }
        ]
    }

    var graphFifthOption = {
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
            text: "Collection Report (Water Charges)"
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
                    // stepSize: 1
                },
                scaleLabel: {
                    display: true,
                    labelString: "Rupees (In Lakhs.)"
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
                var selectedVal = this.state.graphFifthLabel[ind];
                const data = this.state.dataFifth[selectedVal];

                if(data){
                    this.setState({
                        rowData : data
                    })
                }
            }
        },
    }

        
    return (
        <div>
        <div>
            { this.state.recordNotFound }
        </div>

        <div style={this.state.rowData.length === 0 ? {display:"none"} : null}>
            {/*  Dropdown One Application Status report */}
            <div className="graphDashboard" style={this.state.dropdownSelected === "collectionReport" ? {display:"none"} :null}>
            

            {
                this.state.graphClicked >= 0 ?
                <CardContent className="halfGraph">
                <div style={{height:"500px"}}>
                        <React.Fragment>
                            <Pie
                            height={responsiveSizeHack}
                            width={responsiveSizeHack}
                            data={ graphOneSortedData }
                            options={ graphOneOption }                 
                            />
                        </React.Fragment>
                    </div>
                </CardContent>
                :null
            }
            {
                this.state.graphClicked > 0 ?
                <CardContent className="halfGraph">
                    <div style={{height:"500px"}}>
                        <React.Fragment>
                            <Pie
                            height={responsiveSizeHack}
                            width={responsiveSizeHack}
                            data={ graphTwoSortedData }
                            options={ graphTwoOption }                 
                            />
                        </React.Fragment>
                    </div>
                </CardContent>
                :null
            }
            </div>
            
            <div className="graphDashboard" style={this.state.dropdownSelected === "collectionReport" || 
            this.state.graphClicked < 2
            ? {display:"none"} :null}>
            {
                this.state.graphClicked > 1 ?
                <CardContent className="halfGraph">
                    <div style={{height:"500px"}}>
                        <React.Fragment>
                            <Bar
                            height={responsiveSizeHack}
                            width={responsiveSizeHack}
                            data={ graphThirdSortedData }
                            options={ graphThirdOption }                 
                            />
                        </React.Fragment>
                    </div>
                </CardContent>
                :null
            }
            {
                this.state.graphClicked > 2 ?
                <CardContent className="halfGraph">
                    <div style={{height:"500px"}}>
                        <React.Fragment>
                            <Bar
                            height={responsiveSizeHack}
                            width={responsiveSizeHack}
                            data={ graphFourthSortedData }
                            options={ graphFourthOption }                 
                            />
                        </React.Fragment>
                    </div>
                </CardContent>
                :null
            }
            </div>
            
            {/*  Dropdown 2 Collection Report Grph */}
            <div className="graphDashboard" style={this.state.dropdownSelected === "applicationStatusReport" ? {display:"none"} :null}>
            
            {
                this.state.graphClicked >= 0 ?
                <CardContent className="fullGraph">
                    <React.Fragment>
                        <Bar
                        data={ graphFifthSortedData }
                        options={ graphFifthOption } 
                        />
                    </React.Fragment>
                </CardContent>
            : null
            }
            </div>

            {/* Table Feature  */}
            <div className="tableContainer" style={this.state.rowData.length === 0 ? {display:"none"} :null}>
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

        </div>
    );
    }
}

export default WaterDashboard;
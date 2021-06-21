import React, { Component } from "react";
import { Doughnut, Bar, HorizontalBar, Line, Pie } from 'react-chartjs-2';
import CardContent from '@material-ui/core/CardContent';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css" ;
import jsPDF from 'jspdf'
import 'jspdf-autotable'
// import Dashboardtable from './Dashboardtable';
// import Pagination from "./Pagination";
import LicensesRenewal_data from './LicensesRenewal_data.json';
import './LicensesRenewalDashboardIndex.css'

class LicensesRenewalDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            dataCheck : [],
            dropdownSelected: "",
        allData: [],
        dataOne: [],
        dataTwo_1 : [],
        dataTwo: [],
        dataThird: [],
        dataFourth : [],
        graphOneLabel: [],
        graphOneData: [],
        graphTwo_1Label: [],
        graphTwo_1Data: [],
        graphTwoLabel: [],
        graphTwoData: [],
        graphThirdLabel:[],
        graphThirdData:[],
        graphFourthLabel:[],
        graphFourthData:[],
        graphClicked: -1,
        hardJSON: [],
        graphHardOneData : {},
        graphHardTwoData : {},
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
    
        doc.text("mChandigarh Application", pageWidth / 2, 20, 'center');
    
        doc.setFontSize(10);
        const pdfTitle = "TradeLicenseDashboard"
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

    if(checkGraph === "MonthWise"){
        debugger;
        var monthJSON = {"0":"JAN","1":"FEB","2":"MAR","3":"APR","4":"MAY","5":"JUN","6":"JUL",
        "7":"AUG","8":"SEP","9":"OCT","10":"NOV","11":"DEC"};
        var dateRange = this.dateRange(sortBy[0], sortBy[1]);
        var graphLabel = dateRange;

        var group = data.reduce((r, a) => {
            r[new Date(a["applicationDate"]).getFullYear()+"-"+monthJSON[new Date(a["applicationDate"]).getMonth()]] =
                [...r[new Date(a["applicationDate"]).getFullYear()+"-"+monthJSON[new Date(a["applicationDate"]).getMonth()]] || [], a];
            return r;
            }, {});

        var graphData = [];
        for(var i=0; i<graphLabel.length; i++){
            if(group[graphLabel[i]]){
                graphData.push(group[graphLabel[i]].length);
            }else{
                graphData.push(0);
            }
        }

        this.setState({
            graphOneLabel: graphLabel,
            graphOneData: graphData,
            graphClicked: 0,
            dataOne: group,
            // columnData: columnData,
            // unchangeColumnData: unchangeColumnData,
            // rowData: data,
            // hardJSON: hardJSON
        })

        return [ graphLabel, graphData, group ]
    }
    if(checkGraph === "Calculation"){
        debugger;
        var sortNo = null;
        var group = data.reduce((r, a) => {
            r[a[sortBy]] = [...r[a[sortBy]] || [], a];
            return r;
            }, {});
    
        var graphOneLabel = Object.keys(group);
        var graphOneData = []
        for(var i=0; i<Object.keys(group).length ; i++){
            var item = group[graphOneLabel[i]];
            var amt = 0;
            for(var j=0; j<item.length; j++){
                var amount = item.calculation ? item.calculation : 0;
                amt = amt + amount;
            }
            graphOneData.push(amt);
        }
    
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

    componentDidMount(){
        debugger;

        const data = this.props.data
        this.setState({
            dataCheck : this.props.data
        })

    }
    
    componentDidUpdate(){
        
        debugger;
        const propData = this.props.data
        if(JSON.stringify(this.state.dataCheck) !== JSON.stringify(this.props.data)){
            var data = this.props.data
            
            var dropdownSelected = data[1].reportSortBy.value;
            var fromDate = data[1].strFromDate;
            var toDate = data[1].strToDate;

            data = data[0].Licenses;

            if(data.length > 0){
                var group = data.reduce((r, a) => {
                    r[a["businessService"]] = [...r[a["businessService"]] || [], a];
                    return r;
                    }, {});
                
                var type1 = [];
                var type2 = []
                for(var i=0; i<Object.keys(group).length; i++){
                    if(Object.keys(group)[i] === "CTL.OLD_BOOK_MARKET"){
                        type1 = type1.concat(group[Object.keys(group)[i]]);
                    }else{
                        type2 = type2.concat(group[Object.keys(group)[i]]);
                    }
                }
                // HARD Data
                var hardData = {
                    "CTL.REHRI": type2,
                    "CTL.OLD_BOOK_MARKET": type1
                }
                data = hardData[dropdownSelected];
                debugger;
                var keys = Object.keys(data[0]);
                var coldata = [];
                for(var i=0; i<Object.keys(data[0]).length; i++){
                    var itemHeader = {}
                    itemHeader["Header"] = this.camelize(keys[i]);
                    itemHeader["accessor"] = keys[i];
                    if(i===3 || i===4 || i===5 || i===7 || i===13 || i===22){
                        itemHeader["show"]= true ; 
                        coldata.push(itemHeader)
                    }
                    
                }
        
                data.forEach(function(a) {
                    var day = new Date(a.applicationDate).getDate() < 10 ? "0"+new Date(a.applicationDate).getDate() : new Date(a.applicationDate).getDate()
                    var month = new Date(a.applicationDate).getMonth()+1 < 10 ? "0"+parseInt(new Date(a.applicationDate).getMonth()+1) : new Date(a.applicationDate).getMonth()+1;
                    var year = new Date(a.applicationDate).getFullYear()
                    a.applicationDate = year+"/"+month+"/"+day;
                    });
        
                this.setState({
                    columnData : coldata,
                    unchangeColumnData : coldata,
                    rowData : data,
                    dropdownSelected: dropdownSelected,
                    recordNotFound : ""
                })
                var graphOneData2 = this.graphSorting( [fromDate, toDate], data, "MonthWise" );
            }else{
                this.setState({
                    recordNotFound : "Record not Found..!",
                    graphClicked : -1,
                    rowData : [],
                    columnData : [],
                    unchangeColumnData : [],
                })
            }
            
            this.setState({
                dataCheck : this.props.data
            })       
        }
        
    }

    render() {
    

        // First Double Bar Graph Graph
        var PIEgraphOneSortedData = {
            labels: this.state.graphOneLabel,
            // labels: ["Label1", "Label2"],
            datasets: [
                {
                label: "Application",
                fill: false,
                lineTension: 0.1,
                hoverBorderWidth : 12,
                // backgroundColor : this.state.colorRandom,
                backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
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
    
        var PIEgraphOneOption = {
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
                text: "Month Wise Trade Applications"
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
                        // suggestedMin: 0,
                        // suggestedMax: 100,
                        stepSize: 1
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
                    var graphSorting = this.graphSorting( "businessService", this.state.dataOne[selectedVal] );
                    // const hardval = this.state.hardJSON[1]
                    // var graphSorting = this.graphSorting( hardval.sortBy, this.state.dataOne[selectedVal] );
                    
                    var graphLabelSHOW = [];
                    for(var i=0; i<graphSorting[0].length; i++){
                        var dt = graphSorting[0][i];
                        dt = dt.substr(4);
                        dt = dt.toLowerCase().split("_")
                        for(var j = 0; j< dt.length; j++){
                        dt[j] = dt[j][0].toUpperCase() + dt[j].slice(1);
                        }
                        dt = dt.join(" ")
                        var sorted_label = dt;
                        graphLabelSHOW.push(sorted_label);
                    }
                    this.setState({
                        graphTwo_1Label_SHOW: graphLabelSHOW,
                        graphTwo_1Label: graphSorting[0],
                        graphTwo_1Data: graphSorting[1],
                        dataTwo_1: graphSorting[2],
                        graphClicked: 1,
                        rowData: this.state.dataOne[selectedVal]
                    })
                    
                }
            },
        }
    
        // Second Horizontal Graph
        var graphTwo_1SortedData = {
            labels: this.state.graphTwo_1Label_SHOW,
            // labels: ["LAbel1", "LAbel2"],
            datasets: [
                {
                label: "Application",
                fill: false,
                lineTension: 5,
                hoverBorderWidth : 12,
                // backgroundColor : this.state.colorRandom,
                backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
                borderColor: "rgba(75,192,192,0.4)",
                borderCapStyle: "butt",
                barPercentage: 2,
                barThickness: 25,
                maxBarThickness: 25,
                minBarLength: 2,
                data: this.state.graphTwo_1Data
                // data: [34, 90]
                }
            ]
        }
    
        var graphTwo_1Option = {
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
                text: "Servie Type Wise Applications"
            },
            onClick: (e, element) => {
                if (element.length > 0) {
                    debugger;
                    var ind = element[0]._index;   
                    const selectedVal = this.state.graphTwo_1Label[ind];
                    var graphSorting = this.graphSorting( "applicationType", this.state.dataTwo_1[selectedVal] );
                    // const hardval = this.state.hardJSON[1]
                    // var graphSorting = this.graphSorting( hardval.sortBy, this.state.dataOne[selectedVal] );
                    
                    this.setState({
                        graphTwoLabel: graphSorting[0],
                        graphTwoData: graphSorting[1],
                        dataTwo: graphSorting[2],
                        graphClicked: 2,
                        rowData: this.state.dataTwo_1[selectedVal]
                    })
                }
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display:true
                    },
                    ticks: {
                        suggestedMin: 0,
                        // suggestedMax: 100,
                        stepSize: 1
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Service Types"
                        }, 
                }],
                yAxes: [{
                    gridLines: {
                        display: true
                    },
                    ticks: {
                        suggestedMin: 0,
                        stepSize: 1
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
                }
        }
    
        // Second Horizontal Graph
        var graphTwoSortedData = {
            labels: this.state.graphTwoLabel,
            // labels: ["LAbel1", "LAbel2"],
            datasets: [
                {
                label: "Application",
                fill: false,
                lineTension: 5,
                hoverBorderWidth : 12,
                // backgroundColor : this.state.colorRandom,
                backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
                borderColor: "rgba(75,192,192,0.4)",
                borderCapStyle: "butt",
                barPercentage: 2,
                barThickness: 25,
                maxBarThickness: 25,
                minBarLength: 2,
                data: this.state.graphTwoData
                // data: [34, 90]
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
                text: "Type Wise Applications"
            },
            onClick: (e, element) => {
                if (element.length > 0) {
                    debugger;
                    var ind = element[0]._index;   
                    const selectedVal = this.state.graphTwoLabel[ind];
                    var graphSorting = this.graphSorting( "licenseType", this.state.dataTwo[selectedVal], "Calculation" );
                    // const hardval = this.state.hardJSON[1]
                    // var graphSorting = this.graphSorting( hardval.sortBy, this.state.dataOne[selectedVal] );
                    
                    this.setState({
                        graphThirdLabel: graphSorting[0],
                        graphThirdData: graphSorting[1],
                        dataThird: graphSorting[2],
                        graphClicked: 3,
                        rowData: this.state.dataTwo[selectedVal]
                    })
                }
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display:true
                    },
                    ticks: {
                        suggestedMin: 0,
                        // suggestedMax: 100,
                        stepSize: 1
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "License Types"
                        }, 
                }],
                yAxes: [{
                    gridLines: {
                        display: true
                    },
                    ticks: {
                        suggestedMin: 0,
                        stepSize: 1
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
                }
        }
    
        // Third Horizontal Graph
        var graphThirdSortedData = {
            labels: this.state.graphThirdLabel,
            // labels: ["LAbel1", "LAbel2"],
            datasets: [
                {
                label: "Amount",
                fill: false,
                lineTension: 5,
                hoverBorderWidth : 12,
                // backgroundColor : this.state.colorRandom,
                backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
                borderColor: "rgba(75,192,192,0.4)",
                borderCapStyle: "butt",
                barPercentage: 2,
                barThickness: 25,
                maxBarThickness: 25,
                minBarLength: 2,
                data: this.state.graphThirdData
                // data: [34, 90]
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
                text: "Status Wise Collection of Applications"
            },
            onClick: (e, element) => {
                if (element.length > 0) {
                    debugger;
                    var ind = element[0]._index;   
                    const selectedVal = this.state.graphThirdLabel[ind];
                    var graphSorting = this.graphSorting( "status", this.state.dataThird[selectedVal] );
                    // const hardval = this.state.hardJSON[1]
                    // var graphSorting = this.graphSorting( hardval.sortBy, this.state.dataOne[selectedVal] );
                    
                    this.setState({
                        graphFourthLabel: graphSorting[0],
                        graphFourthData: graphSorting[1],
                        dataFourth: graphSorting[2],
                        graphClicked: 4,
                        rowData: this.state.dataThird[selectedVal]
                    })
                }
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display:true
                    },
                    ticks: {
                        suggestedMin: 0,
                        // suggestedMax: 100,
                        stepSize: 1
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Status of Application"
                        }, 
                }],
                yAxes: [{
                    gridLines: {
                        display: true
                    },
                    ticks: {
                        suggestedMin: 0,
                        // stepSize: 1
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Amount to be Collected (INR)"
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
                }
        }
    
        // Third Horizontal Graph
        var graphFourthSortedData = {
            labels: this.state.graphFourthLabel,
            // labels: ["LAbel1", "LAbel2"],
            datasets: [
                {
                label: "Application",
                fill: false,
                lineTension: 5,
                hoverBorderWidth : 12,
                // backgroundColor : this.state.colorRandom,
                backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
                borderColor: "rgba(75,192,192,0.4)",
                borderCapStyle: "butt",
                barPercentage: 2,
                barThickness: 25,
                maxBarThickness: 25,
                minBarLength: 2,
                data: this.state.graphFourthData
                // data: [34, 90]
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
                text: this.state.dropdownSelected === "CTL.REHRI" ? "Pedal Rikshaw/Loading Rehri Action taken Dashboard" : "Shop at Old Book Market Action taken Dashboard"
            },
            onClick: (e, element) => {
                if (element.length > 0) {
                    var ind = element[0]._index;
                    debugger;
                    const selectedVal = this.state.graphFourthLabel[ind];
                    
                    this.setState({
                        rowData: this.state.dataFourth[selectedVal]
                    })
                }
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display:true
                    },
                    ticks: {
                        suggestedMin: 0,
                        // suggestedMax: 100,
                        stepSize: 1
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Action taken on Application"
                        }, 
                }],
                yAxes: [{
                    gridLines: {
                        display: true
                    },
                    ticks: {
                        suggestedMin: 0,
                        stepSize: 1
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
                }
        }
    
    
            
        return (
            <div>
                <div style={this.state.recordNotFound === "" ? {display:"none"} : null}>
                    { this.state.recordNotFound }
                </div>
            <div className="graphDashboard" style={this.state.graphClicked >=0 ? null : {display:"none"}}> 
            {
                this.state.graphClicked >= 0 ?
                <CardContent className="halfGraph">
                    <React.Fragment>
                        <Bar
                        data={ PIEgraphOneSortedData }
                        options={ PIEgraphOneOption } 
                        />
                    </React.Fragment>
                </CardContent>
                :null
            }
    
            {
                this.state.graphClicked > 0 ?
                <CardContent className="halfGraph">
                    <React.Fragment>
                        <Bar
                        data={ graphTwo_1SortedData } 
                        options={ graphTwo_1Option } 
                        />
                    </React.Fragment>
                </CardContent> 
                :null
            }
            </div>
            <div className={this.state.graphClicked > 1 ? "graphDashboard" : ""}>
    
            {
                this.state.graphClicked > 1 ?
                <CardContent className="halfGraph">
                    <React.Fragment>
                        <Bar
                        data={ graphTwoSortedData } 
                        options={ graphTwoOption } 
                        />
                    </React.Fragment>
                </CardContent> 
                :null
            }
            {
                this.state.graphClicked > 2 ?
                <CardContent className="halfGraph">
                    <React.Fragment>
                        <Bar
                        data={ graphThirdSortedData } 
                        options={ graphThirdOption } 
                        />
                    </React.Fragment>
                </CardContent> 
                :null
            }
            </div>
    
            <div className={this.state.graphClicked >3 ? "graphDashboard" : ""}>
            {
                // this.state.graphClicked > 3 ?
                // <CardContent className="halfGraph">
                //     <React.Fragment>
                //         <Bar
                //         data={ graphFourthSortedData } 
                //         options={ graphFourthOption } 
                //         />
                //     </React.Fragment>
                // </CardContent> 
                // :null
            }
            </div>
            {/* Table Feature  */}
            <div className="tableContainer" style={this.state.graphClicked >= 0 ?
            null : {display:"none"}}>
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

export default LicensesRenewalDashboard;
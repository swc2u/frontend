import React, { Component } from "react";
import { Doughnut, Bar, HorizontalBar, Line, Pie } from 'react-chartjs-2';
import CardContent from '@material-ui/core/CardContent';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css" ;
import jsPDF from 'jspdf';
import { CSVLink, CSVDownload } from "react-csv";
import 'jspdf-autotable';

import './WorkDashboard.css'
import { nominalTypeHack } from "prop-types";

class WorkDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            recordNotFound: "",
            checkData : [],
            dropdownSelected : "",
            countBoxVal : 0,
            countBoxText : "",
            allData: [],
            dataOne: [],
            dataTwo: [],
            dataThird : [],
            dataFourth : [],
            dataFifth : [],
            graphOneLabel: [],
            graphOneData: [],
            graphTwoLabel: [],
            graphTwoData: [],
            graphThirdLabel: [],
            graphThirdData: [],
            graphFourthLabel: [],
            graphFourthData: [],
            graphFifthLabel: [],
            graphFifthData: [],
            graphSixthLabel: [],
            graphSixthData: [],
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

    doc.text("Chandigarh Application", pageWidth / 2, 20, 'center');

    doc.setFontSize(10);
    const pdfTitle = this.state.dropdownSelected+" Dashboard"
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

        if(checkGraph === "workprogress_Vs_expenditure"){
            debugger;
            var dateRangeData = data;
            var sortBy = sortBy;
            var group = dateRangeData.reduce((r, a) => {
                r[a[sortBy]] = [...r[a[sortBy]] || [], a];
                return r;
                }, {});

            var graphLabel = Object.keys(group);
            var data1 = [];
            var data2 = [];
            var graphData = [];
            for(var i=0; i<graphLabel.length; i++){
                var amt = parseInt(group[graphLabel[i]][0].work_amount)
                if(amt > 100000){
                    amt = parseInt(group[graphLabel[i]][0].work_amount.substring(0,2));
                }
                data1.push(amt);

                var progress = group[graphLabel[i]][0].percentage_completion === null ? 0 : parseInt(group[graphLabel[i]][0].percentage_completion);
                data2.push(progress);
            }
            graphData = [data1, data2]
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
        // const dropdownSelected = "Approval Status of Estimates";
        // const dropdownSelected = "Approval Status of DNIT";
        // const dropdownSelected = "Status of Project Dept wise";
        // var dt = this.dateTimeToForma("2020-01-01", "2021-05-05");
        const data = this.props.data;
        if(this.props.data.length > 0){
            this.setState({
                checkData : this.props.data
            })
        }
    }

    colorRandom = (data) =>{
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

    componentDidUpdate() {
        debugger;
        const repPropsData = this.props.data;
        if(JSON.stringify(repPropsData) !== JSON.stringify(this.state.checkData)){
            const dropdownSelected = this.props.data[1].reportSortBy.value;
            var fromDate = this.props.data[1].startDate;
            var toDate = this.props.data[1].endDate;
            var dt = this.dateTimeToForma(fromDate, toDate);
            var repData = this.props.data[0];

            var fromDT = dt[0];
            var toDT = dt[1];
            var propsData = [];
            if(dropdownSelected === "Approval Status of Estimates"){
                propsData = repData.getAllEstimationPreparation.ResponseBody;
                
                var dateRangeData = []; 
                for(var i=0; i<propsData.length; i++){
                    if(new Date(propsData[i]["createddate"]).getTime() >= new Date(fromDT).getTime() && new Date(propsData[i]["createddate"]).getTime() <= new Date(toDT).getTime()){
                        dateRangeData.push(propsData[i]);
                    }
                }

                if(dateRangeData.length > 0){
                     // Table Column Setting 
                    var headerData = []
                    var column = Object.keys(dateRangeData[0]);
                    for(var i=0; i<column.length; i++){
                        var item = {};
                        item["Header"] = this.camelize(column[i]);
                        item["accessor"] = column[i];
                        item["show"] = true;
                        if(i===3 || i===5 || i===8 || i===24 || i===29 || i===32 || i===46){
                            headerData.push(item);
                        }
                    }
                    
                    var graphSortData = this.graphSorting("status", dateRangeData, dropdownSelected);
                    this.setState({
                        graphOneLabel : graphSortData[0],
                        graphOneData :  graphSortData[1],
                        dataOne : graphSortData[2],
                        graphClicked : 0,
                        columnData : headerData,
                        unchangeColumnData : headerData,
                        rowData : dateRangeData,
                        dropdownSelected : dropdownSelected,
                        countBoxVal : dateRangeData.length,
                        countBoxText : "Total Estimates under approval process",
                    })
                }else{
                    this.setState({
                        recordNotFound : "Record not found..!"
                    })
                }
            }
            if(dropdownSelected === "Approval Status of DNIT"){
                propsData = repData.getAllDnit.ResponseBody;
                
                var dateRangeData = []; 
                for(var i=0; i<propsData.length; i++){
                    if(new Date(propsData[i]["createddate"]).getTime() >= new Date(fromDT).getTime() && new Date(propsData[i]["createddate"]).getTime() <= new Date(toDT).getTime()){
                        dateRangeData.push(propsData[i]);
                    }
                }

                if(dateRangeData.length > 0){
                    // Table Column Setting 
                    var headerData = []
                    var column = Object.keys(dateRangeData[0]);
                    for(var i=0; i<column.length; i++){
                        var item = {};
                        item["Header"] = this.camelize(column[i]);
                        item["accessor"] = column[i];
                        item["show"] = true;
                        if(i===3 || i===5 || i===8 || i===24 || i===29 || i===32 || i===46){
                            headerData.push(item);
                        }
                    }
                    
                    var graphSortData = this.graphSorting("works_wing", dateRangeData, dropdownSelected);
                    this.setState({
                        graphThirdLabel : graphSortData[0],
                        graphThirdData :  graphSortData[1],
                        dataThird : graphSortData[2],
                        columnData : headerData,
                        unchangeColumnData : headerData,
                        rowData : dateRangeData,
                        dropdownSelected : dropdownSelected,
                        countBoxVal : dateRangeData.length,
                        countBoxText : "Total DNIT under approval process",
                    })
                }else{
                    this.setState({
                        recordNotFound : "Record not found..!"
                    })
                }
            }
            if(dropdownSelected === "Status of Project Dept wise"){
                propsData = repData.getAllWorkAgreementByMilestone.ResponseBody;
                
                var dateRangeData = []; 
                for(var i=0; i<propsData.length; i++){
                    if(new Date(propsData[i]["createddate"]).getTime() >= new Date(fromDT).getTime() && new Date(propsData[i]["createddate"]).getTime() <= new Date(toDT).getTime()){
                        dateRangeData.push(propsData[i]);
                    }
                }

                if(dateRangeData.length > 0){
                    // Table Column Setting 
                    var headerData = []
                    var column = Object.keys(dateRangeData[0]);
                    for(var i=0; i<column.length; i++){
                        var item = {};
                        item["Header"] = this.camelize(column[i]);
                        item["accessor"] = column[i];
                        item["show"] = true;
                        if(i===11 || i===23 || i===24 || i===20 || i===25 || i===31 || i===35 || i==41){
                            headerData.push(item);
                        }
                    }
                    
                    var graphSortData = this.graphSorting("executing_department", dateRangeData, dropdownSelected);
                    this.setState({
                        graphFourthLabel : graphSortData[0],
                        graphFourthData :  graphSortData[1],
                        dataFourth : graphSortData[2],
                        columnData : headerData,
                        unchangeColumnData : headerData,
                        rowData : dateRangeData,
                        graphClicked : 0,
                        dropdownSelected : dropdownSelected
                    })
                }else{
                    this.setState({
                        recordNotFound : "Record not found..!"
                    })
                }
            }

            this.setState({
                checkData : this.props.data
            })
        }
        debugger;
    }

    render() {
    
    // Export to excel Data
    const csvData = this.state.rowData;
    
    // First Double Bar Graph Graph
    var graphOneSortedData = {
        labels: this.state.graphOneLabel,
        datasets: [
            {
            label: "Label",
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
            text: "Approval Status of Estimates"
        },
        // scales: {
        //     xAxes: [{
        //         gridLines: {
        //             display:true
        //         },
        //         scaleLabel: {
        //             display: true,
        //             labelString:" this.state.graphHardThirdData.msgX"
        //             }, 
        //     }],
        //     yAxes: [{
        //         gridLines: {
        //             display:true
        //         },
        //         ticks: {
        //             // suggestedMin: 0,
        //             // suggestedMax: 100,
        //             stepSize: 1
        //         },
        //         scaleLabel: {
        //             display: true,
        //             labelString: "this.state.graphHardThirdData.msgY"
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
                const selectedVal = this.state.graphOneLabel[ind];
                var data = this.state.dataOne[selectedVal];
                var graphSortData = this.graphSorting("works_wing", data, "Approval Status of Estimates");
                this.setState({
                    graphTwoLabel : graphSortData[0],
                    graphTwoData :  graphSortData[1],
                    dataTwo : graphSortData[2],
                    graphClicked : 1,
                    rowData : data
                })
                
            }
        },
    }
    

    // Second Horizontal Graph
    var graphTwoSortedData = {
        labels: this.state.graphTwoLabel,
        datasets: [
            {
            label: "Lable",
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
            text: "Approval Status of Estimates Department wise"
        },
        onClick: (e, element) => {
            if (element.length > 0) {
                var ind = element[0]._index;
                debugger;
                const selectedVal = this.state.graphTwoLabel[ind];
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
                    // stepSize: 1
                },
                scaleLabel: {
                    display: true,
                    labelString: "Work Wing (Department)"
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
                    labelString: "No of Estimates"
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
        datasets: [
            {
            label: "Lable",
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
            text: "Approval Status of DNIT Department wise"
        },
        onClick: (e, element) => {
            if (element.length > 0) {
                debugger;
                var ind = element[0]._index;   
                const selectedVal = this.state.graphThirdLabel[ind];
                var data = this.state.dataThird[selectedVal];
                this.setState({
                    rowData : data
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
                    // stepSize: 1
                },
                scaleLabel: {
                    display: true,
                    labelString: "Work Wing (Department)"
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
                    labelString: "No of DNIT"
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

    // Fourth Horizontal Graph
    var graphFourthSortedData = {
        labels: this.state.graphFourthLabel,
        datasets: [
            {
            label: "Lable",
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
            text: "Work Agreement Deptartment wise Dashboard"
        },
        onClick: (e, element) => {
            if (element.length > 0) {
                debugger;
                var ind = element[0]._index;   
                const selectedVal = this.state.graphFourthLabel[ind];
                var data = this.state.dataFourth[selectedVal];
                var graphSortData = this.graphSorting("status", data, "");
                
                var bgColor = this.colorRandom( graphSortData[0] );
                this.setState({
                    graphFifthLabel : graphSortData[0],
                    graphFifthData :  graphSortData[1],
                    dataFifth : graphSortData[2],
                    graphClicked : 5,
                    rowData : data,
                    bgColor : bgColor
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
                    // stepSize: 1
                },
                scaleLabel: {
                    display: true,
                    labelString: "Department"
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
                    labelString: "No of Work Agreement "
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

    // Fifth Horizontal Graph
    var graphFifthSortedData = {
        labels: this.state.graphFifthLabel,
        datasets: [
            {
            label: "Lable",
            fill: false,
            lineTension: 5,
            hoverBorderWidth : 12,
            backgroundColor : this.state.bgColor,
            // backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
            borderColor: "rgba(75,192,192,0.4)",
            borderCapStyle: "butt",
            barPercentage: 2,
            barThickness: 25,
            maxBarThickness: 25,
            minBarLength: 2,
            data: this.state.graphFifthData
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
            text: "Status of Work Agreement Deptartment wise Dashboard"
        },
        onClick: (e, element) => {
            if (element.length > 0) {
                debugger;
                debugger;
                var ind = element[0]._index;   
                const selectedVal = this.state.graphFifthLabel[ind];
                var data = this.state.dataFifth[selectedVal];
                var graphSortData = this.graphSorting("work_agreement_number", data, "workprogress_Vs_expenditure");
                this.setState({
                    graphSixthLabel : graphSortData[0],
                    graphSixthData :  graphSortData[1],
                    dataSixth : graphSortData[2],
                    graphClicked : 6,
                    rowData : data
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
                    // stepSize: 1
                },
                scaleLabel: {
                    display: true,
                    labelString: "Status"
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
                    labelString: "No of Work Agreement"
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

    // Sixth Horizontal Graph
    var graphSixthSortedData = {
        labels: this.state.graphSixthLabel,
        datasets: [
            {
            label: "Expenditure",
            fill: false,
            lineTension: 5,
            hoverBorderWidth : 12,
            // backgroundColor : this.state.colorRandom,
            backgroundColor : ["#F77C15", "#F77C15", "#F77C15", "#F77C15", "#F77C15", "#F77C15", "#F77C15", "#F77C15", "#F77C15", "#F77C15", "#F77C15"],
            borderColor: "rgba(75,192,192,0.4)",
            borderCapStyle: "butt",
            barPercentage: 2,
            barThickness: 25,
            maxBarThickness: 25,
            minBarLength: 2,
            data: this.state.graphSixthData[0]
            },
            {
            label: "Progress",
            fill: false,
            lineTension: 5,
            hoverBorderWidth : 12,
            // backgroundColor : this.state.colorRandom,
            backgroundColor : ["#385BC8", "#385BC8", "#385BC8", "#385BC8", "#385BC8", "#385BC8", "#385BC8", "#385BC8", "#385BC8", "#385BC8", "#385BC8"],
            borderColor: "rgba(75,192,192,0.4)",
            borderCapStyle: "butt",
            barPercentage: 2,
            barThickness: 25,
            maxBarThickness: 25,
            minBarLength: 2,
            data: this.state.graphSixthData[1]
            }
        ]
    }

    var graphSixthOption = {
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
            text: "Work Agreementwise Expenditure Vs. Progress Dashboard"
        },
        onClick: (e, element) => {
            if (element.length > 0) {
                debugger;
                var ind = element[0]._index;   
                const selectedVal = this.state.graphSixthLabel[ind];
                var data = this.state.dataSixth[selectedVal];
                this.setState({
                    rowData : data
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
                    // stepSize: 1
                },
                scaleLabel: {
                    display: true,
                    labelString: "Work Agreemtn No"
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
                    labelString: "Amount(Lakh INR) Progress(%)"
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
            <div style={this.state.rowData.length > 0 ? {display : "none"} :null}>
            { this.state.recordNotFound }
            </div>
        {/* Approval Status of Estimates */}
        <div className="graphDashboard" style={this.state.dropdownSelected !== "Approval Status of Estimates" ? {display : "none"} : {}}>
        {
            this.state.graphClicked >= 0 ?
            <CardContent className="halfGraph">
                <React.Fragment>
                    <Pie
                    data={ graphOneSortedData }
                    options={ graphOneOption } 
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
                    data={ graphTwoSortedData } 
                    options={ graphTwoOption } 
                    />
                </React.Fragment>
            </CardContent> 
            :null
        }
        </div>

        {/* Approval Status of DNIT */}
        <div className="graphDashboard" style={this.state.dropdownSelected !== "Approval Status of DNIT" ? {display : "none"} : {}}>
        {
            // this.state.graphClicked > 0 ?
            <CardContent className="fullGraph">
                <React.Fragment>
                    <Bar
                    data={ graphThirdSortedData } 
                    options={ graphThirdOption } 
                    />
                </React.Fragment>
            </CardContent> 
            // :null
        }
        </div>

        {/* Status of Project Dept wise */}
        <div className="graphDashboard" style={this.state.dropdownSelected !== "Status of Project Dept wise" ? {display : "none"} : {}}>
        {
            // this.state.graphClicked > 0 ?
            <CardContent className="halfGraph">
                <React.Fragment>
                    <Bar
                    data={ graphFourthSortedData } 
                    options={ graphFourthOption } 
                    />
                </React.Fragment>
            </CardContent> 
            // :null
        }
        {
            this.state.graphClicked > 4 ?
            <CardContent className="halfGraph">
                <React.Fragment>
                    <Bar
                    data={ graphFifthSortedData } 
                    options={ graphFifthOption } 
                    />
                </React.Fragment>
            </CardContent> 
            :null
        }
        </div>
        {
            this.state.graphClicked > 5 ?
            <CardContent style={{"height" : "250px"}} >
                <React.Fragment>
                    <Bar
                    data={ graphSixthSortedData } 
                    options={ graphSixthOption } 
                    />
                </React.Fragment>
            </CardContent> 
            :null
        }
        {/* Table Feature  */}
        {
                this.state.graphClicked >=0 ?
        <div className="tableContainer">
                <div className="countBox" style={ this.state.dropdownSelected === "Status of Project Dept wise" ?
                {display : "none"} : null}> {this.state.countBoxText} : {this.state.countBoxVal}</div>
                
 
        {
            this.state.unchangeColumnData.length > 0  ? 
            <div className="tableFeature">
                <div className="columnToggle-Text"> Download As: </div>

                <div className="columnToggleBtn"> 
                <CSVLink data={csvData}
                filename={"Work_dashboard.csv"}
                > Export Excel </CSVLink>
                </div>

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
            // // PaginationComponent={Pagination}
            data={ this.state.rowData }  
            columns={ this.state.columnData }  
            defaultPageSize = {this.state.rowData.length > 10 ? 10 : this.state.rowData.length}
            pageSize={this.state.rowData.length > 10 ? 10 : this.state.rowData.length}  
            pageSizeOptions = {[20,40,60]}  
            /> 
            :null
        }
        </div>
            :null
        }
        </div>
    );
    }
}

export default WorkDashboard;
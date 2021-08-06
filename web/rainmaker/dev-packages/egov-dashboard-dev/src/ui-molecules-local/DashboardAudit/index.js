import React, { Component } from "react";
import { Doughnut, Bar, HorizontalBar, Line, Pie } from 'react-chartjs-2';
import CardContent from '@material-ui/core/CardContent';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css" ;
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './AuditIndex.css'

class DashboardAudit extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            noRecordFound : "",
            checkData:[],
            allData: [],
            dataOne: [],
            dataTwo: [],
            dataThird: [],
            dataFourth: [],
            dataFifth: [],
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
        const pdfTitle = "Audit Dahboard"
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
            const propsData = this.props.data;
            this.setState({
                checkData : propsData
            })
        }
        componentDidUpdate(){
            debugger;
            const propsData = this.props.data;
            if(JSON.stringify(this.state.checkData) !== JSON.stringify(propsData)){
                const dropdownSelected = this.props.data[1].reportSortBy.value;
                // const dropdownSelected = "Post-Audit";
                const fromDT= this.props.data[1].fromDate;
                const toDT = this.props.data[1].toDate;
                var data = this.props.data[0].ResponseBody;

                for(var i=0; i<data.length; i++){
                    var auditSchedule = new Date(data[i].audit_schedule_date);
                    var auditMonth = auditSchedule.getMonth() < 10 ? parseInt("0"+auditSchedule.getMonth()) 
                    : parseInt(auditSchedule.getMonth());
                    var sortdate = auditSchedule.getDate()+"-"+parseInt(auditMonth+1)+"-"
                    +auditSchedule.getFullYear()
                    data[i]["audit_schedule_date"] = sortdate;
                }
                
                var dateRange = this.dateRange(fromDT, toDT);
        
                var group = data.reduce((r, a) => {
                    r[a["audit_type"]] = [...r[a["audit_type"]] || [], a];
                    return r;
                    }, {});
                
                data = group[dropdownSelected] ? group[dropdownSelected] : [];
                
                var monthJSON = {"0":"JAN","1":"FEB","2":"MAR","3":"APR","4":"MAY","5":"JUN","6":"JUL",
                "7":"AUG","8":"SEP","9":"OCT","10":"NOV","11":"DEC"};
                
                if(data.length > 0){
                    var group = data.reduce((r, a) => {
                        r[new Date(a["audit_schedule_date"]).getFullYear()+"-"+monthJSON[new Date(a["audit_schedule_date"]).getMonth()]] 
                        = [...r[new Date(a["audit_schedule_date"]).getFullYear()+"-"+monthJSON[new Date(a["audit_schedule_date"]).getMonth()]] || [], a];
                        return r;
                        }, {});
            
                    var graphData = [];
                    var graphLabel = dateRange;
                    for(var i=0; i<graphLabel.length; i++){
                        if(group[graphLabel[i]]){
                            graphData.push(group[graphLabel[i]].length);
                        }else{
                            graphData.push(0);
                        }
                    }
                    // Graph One Sorting Function 
                    // var graphOneData2 = this.graphSorting( "audit_type", data, dropdownSelected );
            
                    
                    // Column Data
                    const tableData = data[0] ? Object.keys(data[0]) : [];
                    var columnData = []
                    for(var i=0; i<tableData.length; i++){
                        var itemHeader = {}
                        itemHeader["Header"] = this.camelize(tableData[i]);
                        itemHeader["accessor"] = tableData[i];
                        itemHeader["show"]= (i === 0 || i === 1 || i === 2 || i === 3 
                            || i === 5 || i === 6 || i === 7
                            || i === 8 || i === 9 || i === 10 || i === 11
                            || i === 12 ) ? true : false ;
                        columnData.push(itemHeader);
                    }
            
                    // Column Unchange Data 
                    const unchangeColumnData = this.columnUnchange(columnData)
            
                    
                    this.setState({
                        graphOneLabel: graphLabel,
                        graphOneData: graphData,
                        graphClicked: 0,
                        dataOne: group,
                        columnData: columnData,
                        unchangeColumnData: unchangeColumnData,
                        rowData: data,
                        // hardJSON: hardJSON
                    })
                }else{
                    this.setState({
                        noRecordFound : "No Record Found..!",
                        graphOneLabel: [],
                        graphOneData: [],
                        graphClicked: -1,
                        dataOne: [],
                        columnData: [],
                        unchangeColumnData: [],
                        rowData: [],
                    })
                }

                this.setState({
                    checkData : propsData
                })
            }
        }
    
        render() {
        
    
        // First Double Bar Graph Graph
        var graphOneSortedData = {
            labels: this.state.graphOneLabel,
            // labels: ["Label1", "Label2"],
            datasets: [
                {
                label: "Total Task",
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
                text: "Monthwise Task Initiated Audit Dashboard"
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
                        labelString: "No of Task Initiated"
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
                    // var graphSorting = this.graphSorting( this.state.graphHardTwoData.sortBy, this.state.dataOne[selectedVal] );
                    // const hardval = this.state.hardJSON[1]
                    var graphSorting = this.graphSorting( "department", this.state.dataOne[selectedVal] );
                    
                    this.setState({
                        graphTwoLabel: graphSorting[0],
                        graphTwoData: graphSorting[1],
                        dataTwo: graphSorting[2],
                        graphClicked: 1,
                        rowData: this.state.dataOne[selectedVal]
                    })
                    
                }
            },
        }
        
        // Second Horizontal Graph
        var graphTwoSortedData = {
            labels: this.state.graphTwoLabel,
            datasets: [
                {
                label: "Total Task",
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
                text: "Monthly Departmentwise Task Initiated"
            },
            onClick: (e, element) => {
                if (element.length > 0) {
                    debugger;
                    var ind = element[0]._index;   
                    const selectedVal = this.state.graphTwoLabel[ind];
                    var graphSorting = this.graphSorting( "audit_status", this.state.dataTwo[selectedVal] );
                    
                    this.setState({
                        graphThirdLabel: graphSorting[0],
                        graphThirdData: graphSorting[1],
                        dataThird: graphSorting[2],
                        graphClicked: 2,
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
                        labelString: "Depatment"
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
                        labelString: "No of Task Initiated"
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
                // label: this.state.drildownGraphLabel,
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
                text: "Audit Task Status Dashoard"
            },
            onClick: (e, element) => {
                if (element.length > 0) {
                    debugger;
                    var ind = element[0]._index;   
                    const selectedVal = this.state.graphThirdLabel[ind];
                    var graphSorting = this.graphSorting( "rsa_name", this.state.dataThird[selectedVal] );
                    
                    this.setState({
                        graphFourthLabel: graphSorting[0],
                        graphFourthData: graphSorting[1],
                        dataFourth: graphSorting[2],
                        graphClicked: 3,
                        rowData: this.state.dataThird[selectedVal]
                    })
                }
            },
            // scales: {
            //     xAxes: [{
            //         gridLines: {
            //             display:true
            //         },
            //         ticks: {
            //             suggestedMin: 0,
            //             // suggestedMax: 100,
            //             stepSize: 1
            //         },
            //         scaleLabel: {
            //             display: true,
            //             labelString: this.state.graphHardTwoData.msgX
            //             }, 
            //     }],
            //     yAxes: [{
            //         gridLines: {
            //             display: true
            //         },
            //         ticks: {
            //             suggestedMin: 0,
            //             stepSize: 1
            //         },
            //         scaleLabel: {
            //             display: true,
            //             labelString: this.state.graphHardTwoData.msgY
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
                }
        }
    
        // Fourth Horizontal Graph
        var graphFourthSortedData = {
            labels: this.state.graphFourthLabel,
            datasets: [
                {
                // label: this.state.drildownGraphLabel,
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
                text: "RSA wise Audit dashboard"
            },
            onClick: (e, element) => {
                if (element.length > 0) {
                    debugger;
                    var ind = element[0]._index;   
                    const selectedVal = this.state.graphFourthLabel[ind];
                    var graphSorting = this.graphSorting( "auditor_name", this.state.dataFourth[selectedVal] );
                    
                    this.setState({
                        graphFifthLabel: graphSorting[0],
                        graphFifthData: graphSorting[1],
                        dataFifth: graphSorting[2],
                        graphClicked: 4,
                        rowData: this.state.dataFourth[selectedVal]
                    })
                }
            },
            // scales: {
            //     xAxes: [{
            //         gridLines: {
            //             display:true
            //         },
            //         ticks: {
            //             suggestedMin: 0,
            //             // suggestedMax: 100,
            //             stepSize: 1
            //         },
            //         scaleLabel: {
            //             display: true,
            //             labelString: this.state.graphHardTwoData.msgX
            //             }, 
            //     }],
            //     yAxes: [{
            //         gridLines: {
            //             display: true
            //         },
            //         ticks: {
            //             suggestedMin: 0,
            //             stepSize: 1
            //         },
            //         scaleLabel: {
            //             display: true,
            //             labelString: this.state.graphHardTwoData.msgY
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
                }
        }

        // Fifth Horizontal Graph
        var graphFifthSortedData = {
            labels: this.state.graphFifthLabel,
            datasets: [
                {
                // label: this.state.drildownGraphLabel,
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
                text: "Auditor wise Dashboard data"
            },
            onClick: (e, element) => {
                if (element.length > 0) {
                    debugger;
                    var ind = element[0]._index;   
                    const selectedVal = this.state.graphFifthLabel[ind];
                    // var graphSorting = this.graphSorting( "department", this.state.dataFourth[selectedVal] );
                    
                    this.setState({
                        // graphFifthLabel: graphSorting[0],
                        // graphFifthData: graphSorting[1],
                        // dataFifth: graphSorting[2],
                        // graphClicked: 4,
                        rowData: this.state.dataFifth[selectedVal]
                    })
                }
            },
            // scales: {
            //     xAxes: [{
            //         gridLines: {
            //             display:true
            //         },
            //         ticks: {
            //             suggestedMin: 0,
            //             // suggestedMax: 100,
            //             stepSize: 1
            //         },
            //         scaleLabel: {
            //             display: true,
            //             labelString: this.state.graphHardTwoData.msgX
            //             }, 
            //     }],
            //     yAxes: [{
            //         gridLines: {
            //             display: true
            //         },
            //         ticks: {
            //             suggestedMin: 0,
            //             stepSize: 1
            //         },
            //         scaleLabel: {
            //             display: true,
            //             labelString: this.state.graphHardTwoData.msgY
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
                }
        }
    
    
            
        return (
            <div>
            <div className="recordNotFound" 
            style={this.state.rowData.length ===0 ? null : {display:"none"}} >
                Record not Found..!
            </div>
            <div style={this.state.rowData.length ===0 ? {display:"none"} : null}>
            <div className="graphDashboard">
            
    
            {
                this.state.graphClicked >=0 ?
                <CardContent className="halfGraph">
                    <React.Fragment>
                        <Bar
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
            <div className="graphDashboard" style={this.state.graphClicked <= 1 ? {display : "none"} : null}>
            {
                this.state.graphClicked > 1 ?
                <CardContent className="fullGraph">
                    <React.Fragment>
                        <Pie
                        data={ graphThirdSortedData } 
                        options={ graphThirdOption } 
                        />
                    </React.Fragment>
                </CardContent> 
                :null
            }
    
            {
                // this.state.graphClicked > 2 ?
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

            <div className="graphDashboard" style={this.state.graphClicked <= 2 ? {display : "none"} : null}>
            {
                this.state.graphClicked > 2 ?
                <CardContent className="halfGraph">
                    <React.Fragment>
                        <Bar
                        data={ graphFourthSortedData } 
                        options={ graphFourthOption } 
                        />
                    </React.Fragment>
                </CardContent> 
                :null
            }
    
            {
                this.state.graphClicked > 3 ?
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
    
            {/* Table Feature  */}
            <div className={this.state.rowData.length ===0 ? "" : "tableContainer" }>
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

export default DashboardAudit;
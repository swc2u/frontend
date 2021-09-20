import React, { Component } from "react";
import { Doughnut, Bar, HorizontalBar, Line, Pie } from 'react-chartjs-2';
import CardContent from '@material-ui/core/CardContent';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css" ;
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './OSBMIndex.css'

class DashboardOSBM extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      checkData:[],
        bgColcor : [],
        allData: [],
        dataOne: [],
        dataTwo: [],
        dataThird: [],
        dataFourth: [],
        dataFifth: [],
        dataSixth: [],
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
    const pdfTitle = this.state.graphHardOneData.title ? this.state.graphHardOneData.title : "Title"
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
        
        const data = this.state.columnData
        this.setState({
            toggleColumnCheck : !this.state.toggleColumnCheck
        })
    }
    
    graphSorting = ( sortBy, data, checkGraph ) => { 
        
        
        if(sortBy === "dashboard1_bookingVenueType"){
            
            var sortNo = null;
            var group = data.reduce((r, a) => {
                r[a[0]] = [...r[a[0]] || [], a];
                return r;
                }, {});

            var graphLabel = Object.keys(group);
            var graphData = []
            for(var i=0; i<Object.keys(group).length ; i++){
                graphData.push(group[graphLabel[i]].length);
            }

            return [ graphLabel, graphData, group ]
        }
        if(sortBy === "dashboard1_status"){
            
            var sortNo = null;
            var group = data.reduce((r, a) => {
                r[a[12]] = [...r[a[12]] || [], a];
                return r;
                }, {});

            var graphLabel = Object.keys(group);
            var graphData = []
            for(var i=0; i<Object.keys(group).length ; i++){
                graphData.push(group[graphLabel[i]].length);
            }
            return [ graphLabel, graphData, group ]
        }
        if(sortBy === "dashboard2_status"){
            
            var sortNo = null;
            var group = data.reduce((r, a) => {
                r[a[12]] = [...r[a[12]] || [], a];
                return r;
                }, {});

            var graphLabel = Object.keys(group);
            var graphData = []
            for(var i=0; i<Object.keys(group).length ; i++){
                graphData.push(group[graphLabel[i]].length);
            }
            return [ graphLabel, graphData, group ]
        }
        if(sortBy === "dashboard2_sector"){
            
            var sortNo = null;
            var group = data.reduce((r, a) => {
                r[a[3]] = [...r[a[3]] || [], a];
                return r;
                }, {});

            var graphLabel = Object.keys(group);
            var graphData = []
            for(var i=0; i<Object.keys(group).length ; i++){
                graphData.push(group[graphLabel[i]].length);
            }
            return [ graphLabel, graphData, group ]
        }
        if(sortBy === "dashboard3_collectionReport"){
            
            var sortNo = null;
            var group = data.reduce((r, a) => {
                r[a[3]] = [...r[a[3]] || [], a];
                return r;
                }, {});

            var graphLabel = Object.keys(group);
            var graphData = []
            for(var i=0; i<Object.keys(group).length ; i++){
                var amt = 0;
                for(var j=0; j<group[graphLabel[i]].length; j++){
                    amt = amt + group[graphLabel[i]][j][11];
                }
                graphData.push(amt);
            }
            return [ graphLabel, graphData, group ]
        }
        if(sortBy === "dashboard3_bookingVenueType"){
            
            var sortNo = null;
            var group = data.reduce((r, a) => {
                r[a[0]] = [...r[a[0]] || [], a];
                return r;
                }, {});

            var graphLabel = Object.keys(group);
            var graphData = []
            for(var i=0; i<Object.keys(group).length ; i++){
                var amt = 0;
                for(var j=0; j<group[graphLabel[i]].length; j++){
                    amt = amt + group[graphLabel[i]][j][11];
                }
                graphData.push(amt);
            }
            return [ graphLabel, graphData, group ]
        }
        
        
        
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

    hardJSONconfig = (propSortBy) => {

        
        const hardJSON = propSortBy === "bkApplicationStatus" ? [{ 
            "sortBy": "bkApplicationStatus",
            "msgX": "",
            "msgY": "",
            "title": "Booking Application Status"
            },
            { 
            "sortBy": "bkBookingType",
            "msgX": "",
            "msgY": "",
            "title": "Booking Statuswise Application Type"
            }] : propSortBy === "bkBookingType" ? [
            { 
            "sortBy": "bkBookingType",
            "msgX": "",
            "msgY": "",
            "title": "Booking Application Type"
            },
            { 
            "sortBy": "bkApplicationStatus",
            "msgX": "",
            "msgY": "",
            "title": "Booking Typewise Application status"
            }
            ] : []
            
            return hardJSON; 
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

    componentDidMount(){
        
        const data = this.props.data;
        this.setState({
          checkData : data
        })
    }

    componentDidUpdate(){
      
      const propsData = this.props.data;
      if(JSON.stringify(propsData) !== JSON.stringify(this.state.checkData)){

        const propSortBy = this.props.data[1].reportSortBy.value;
        const data = this.props.data[0].reportResponses;
        var reportHeader = data[0].reportHeader;
        var reportData = data[0].reportData;

        // Column Data
        var group = reportHeader.reduce((r, a) => {
          r[a["name"]] = [...r[a["name"]] || [], a];
          return r;
          }, {});
        const tableData = Object.keys(group);
        var columnData = []
        for(var i=0; i<tableData.length; i++){
            var itemHeader = {}
            itemHeader["Header"] = this.camelize(tableData[i]);
            itemHeader["accessor"] = ""+i;
            itemHeader["show"] = true;
            columnData.push(itemHeader);
        }

        // Column Unchange Data 
        const unchangeColumnData = this.columnUnchange(columnData)

        if(propSortBy === "dashboard1_bookingVenueType"){
            // Graph One Sorting Function 
            var graphOneData2 = this.graphSorting( propSortBy, reportData );
            var bgColcor = this.colorRandom( graphOneData2[0] );
            this.setState({
                graphOneLabel: graphOneData2[0],
                graphOneData: graphOneData2[1],
                graphClicked: 0,
                dataOne: graphOneData2[2],
                bgColcor :  bgColcor
            })
        }
        if(propSortBy === "dashboard2_status"){
            // Graph One Sorting Function 
            var graphOneData2 = this.graphSorting( propSortBy, reportData );
            var bgColcor = this.colorRandom( graphOneData2[0] );
            this.setState({
                graphThirdLabel: graphOneData2[0],
                graphThirdData: graphOneData2[1],
                graphClicked: 0,
                dataThird: graphOneData2[2],
                bgColcor :  bgColcor
            })
        }
        if(propSortBy === "dashboard3_collectionReport"){
            // Graph One Sorting Function 
            var graphOneData2 = this.graphSorting( propSortBy, reportData );
            var bgColcor = this.colorRandom( graphOneData2[0] );
            this.setState({
                graphFifthLabel: graphOneData2[0],
                graphFifthData: graphOneData2[1],
                graphClicked: 0,
                dataFifth: graphOneData2[2],
                bgColcor : bgColcor
            })
        }
        
        this.setState({
            columnData: columnData,
            unchangeColumnData: unchangeColumnData,
            rowData: reportData,
            dropddownClicked : propSortBy
        })
        
        this.setState({
          checkData: propsData
        })
      }
      // const propSortBy = "dashboard1_bookingVenueType"; // Dropdown 1
      // const propSortBy = "dashboard2_status";   // Dropdow 2
      // const propSortBy = "dashboard3_collectionReport";   // Dropdow 2
      
      // const data = OSBM_data.reportResponses;

      // var reportHeader = data[0].reportHeader;
      // var reportData = data[0].reportData;
    }

    render() {
    // Dropdown One
    var graphOneSortedData = {
        labels: this.state.graphOneLabel,
        // labels: ["Label1", "Label2"],
        datasets: [
            {
            label: "Total Booking ",
            fill: false,
            lineTension: 0.1,
            hoverBorderWidth : 12,
            backgroundColor : this.state.bgColcor,
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
            boxWidth: 20,
            boxHeight: 2
            }
        },
        tooltips: {
            enabled: true
        },
        title: {
            display: true,
            text: "Type of Request wise OSBM Dashboard"
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display:true
                },
                scaleLabel: {
                    display: true,
                    labelString: "Booking Venue"
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
                    labelString: "No of Booking"
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
                var graphSorting = this.graphSorting( "dashboard1_status", this.state.dataOne[selectedVal] );
                
                this.setState({
                    graphTwoLabel: graphSorting[0],
                    graphTwoData: graphSorting[1],
                    graphClicked: 1,
                    dataTwo: graphSorting[2],
                    rowData: this.state.dataOne[selectedVal]
                })
                
            }
        },
    }
    
    var graphTwoSortedData = {
        labels: this.state.graphTwoLabel,
        datasets: [
            {
            label: "Status",
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
            text: "Statuswise Type of request OSBM Dashboard"
        },
        onClick: (e, element) => {
            if (element.length > 0) {
                var ind = element[0]._index;
                
                const selectedVal = this.state.graphTwoLabel[ind];
                
                this.setState({
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
                    labelString: "Status"
                    }, 
            }],
            yAxes: [{
                gridLines: {
                    display: true
                },
                ticks: {
                    suggestedMin: 0,
                    stepSize: 100
                },
                scaleLabel: {
                    display: true,
                    labelString: "No of Booking request"
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

    // Dropdown Two
    var graphThirdSortedData = {
        labels: this.state.graphThirdLabel,
        // labels: ["Label1", "Label2"],
        datasets: [
            {
            label: "Total",
            fill: false,
            lineTension: 0.1,
            hoverBorderWidth : 12,
            backgroundColor : this.state.bgColcor,
            // backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
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
            text: "Status Report of OSBM Dashboard"
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display:true
                },
                scaleLabel: {
                    display: true,
                    labelString: "Status"
                    }, 
            }],
            yAxes: [{
                gridLines: {
                    display:true
                },
                ticks: {
                    suggestedMin: 0,
                    // suggestedMax: 100,
                    stepSize: 10
                },
                scaleLabel: {
                    display: true,
                    labelString: "No of Bookings"
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
                const selectedVal = this.state.graphThirdLabel[ind];
                var graphSorting = this.graphSorting( "dashboard2_sector", this.state.dataThird[selectedVal] );
                
                this.setState({
                    graphFourthLabel: graphSorting[0],
                    graphFourthData: graphSorting[1],
                    graphClicked: 4,
                    dataFourth: graphSorting[2],
                    rowData: this.state.dataThird[selectedVal]
                })
                
            }
        },
    }

    var graphFouthSortedData = {
        labels: this.state.graphFourthLabel,
        // labels: ["Label1", "Label2"],
        datasets: [
            {
            label: "Total",
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
            data: this.state.graphFourthData
            // data:[10,20,30]
            }
        ]
    }

    var graphFouthOption = {
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
            text: "Sectorwise Status Report"
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display:true
                },
                scaleLabel: {
                    display: true,
                    labelString: "Sector"
                    }, 
            }],
            yAxes: [{
                gridLines: {
                    display:true
                },
                ticks: {
                    suggestedMin: 0,
                    // suggestedMax: 100,
                    stepSize: 10
                },
                scaleLabel: {
                    display: true,
                    labelString: "No of Bookings"
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
                const selectedVal = this.state.graphThirdLabel[ind];
                // var graphSorting = this.graphSorting( "dashboard1_sector", this.state.dataThird[selectedVal] );
                
                this.setState({
                    // graphFourthLabel: graphSorting[0],
                    // graphFourthData: graphSorting[1],
                    graphClicked: 1,
                    // dataFourth: graphSorting[2],
                    rowData: this.state.dataThird[selectedVal]
                })
                
            }
        },
    }
    
    // Dropdown Three
    var graphFifthSortedData = {
        labels: this.state.graphFifthLabel,
        // labels: ["Label1", "Label2"],
        datasets: [
            {
            label: "Total Amt ",
            fill: false,
            lineTension: 0.1,
            hoverBorderWidth : 12,
            backgroundColor : this.state.bgColcor,
            // backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
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
            text: "Sectorwise Collection Report of OSBM Dashboard"
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display:true
                },
                scaleLabel: {
                    display: true,
                    labelString: "Sector"
                    }, 
            }],
            yAxes: [{
                gridLines: {
                    display:true
                },
                ticks: {
                    suggestedMin: 0,
                    // suggestedMax: 100,
                    // stepSize: 1000
                },
                scaleLabel: {
                    display: true,
                    labelString: "Amount (INR)"
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
                const selectedVal = this.state.graphFifthLabel[ind];
                var graphSorting = this.graphSorting( "dashboard3_bookingVenueType", this.state.dataFifth[selectedVal] );
                
                this.setState({
                    graphSixthLabel: graphSorting[0],
                    graphSixthData: graphSorting[1],
                    graphClicked: 1,
                    dataSixth: graphSorting[2],
                    rowData: this.state.dataFifth[selectedVal]
                })
                
            }
        },
    }

    var graphSixthSortedData = {
        labels: this.state.graphSixthLabel,
        // labels: ["Label1", "Label2"],
        datasets: [
            {
            label: "Apani Mandi",
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
            data: this.state.graphSixthData
            // data:[10,20,30]
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
            text: "Collection Report"
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
                
                
                var ind = element[0]._index;   
                const selectedVal = this.state.graphFifthLabel[ind];
                var graphSorting = this.graphSorting( "dashboard1_sector", this.state.dataFifth[selectedVal] );
                
                this.setState({
                    graphSixthLabel: graphSorting[0],
                    graphSixthData: graphSorting[1],
                    graphClicked: 1,
                    dataSixth: graphSorting[2],
                    rowData: this.state.dataFifth[selectedVal]
                })
                
            }
        },
    }
    
    return (
        <div>
        <div className="graphDashboard" style={this.state.dropddownClicked !== "dashboard1_bookingVenueType" ? {display : "none"} : null}>
        

        <CardContent className="halfGraph">
            <React.Fragment>
                <Bar
                data={ graphOneSortedData }
                options={ graphOneOption } 
                />
            </React.Fragment>
        </CardContent>

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

        <div className="graphDashboard" style={this.state.dropddownClicked !== "dashboard2_status" ? {display : "none"} : null}>
                
        <CardContent className="halfGraph">
            <React.Fragment>
                <Bar
                data={ graphThirdSortedData }
                options={ graphThirdOption } 
                />
            </React.Fragment>
        </CardContent>

        {
            this.state.graphClicked > 0 ?
            <CardContent className="halfGraph">
                <React.Fragment>
                    <Bar
                    data={ graphFouthSortedData } 
                    options={ graphFouthOption } 
                    />
                </React.Fragment>
            </CardContent> 
            :null
        }

        </div>

        <div className="graphDashboard" style={this.state.dropddownClicked !== "dashboard3_collectionReport" ? {display : "none"} : null}>
                
        <CardContent className="fullGraph">
            <React.Fragment>
                <Bar
                data={ graphFifthSortedData }
                options={ graphFifthOption } 
                />
            </React.Fragment>
        </CardContent>

        {
            // this.state.graphClicked > 0 ?
            // <CardContent className="halfGraph">
            //     <React.Fragment>
            //         <Pie
            //         data={ graphSixthSortedData } 
            //         options={ graphSixthOption } 
            //         />
            //     </React.Fragment>
            // </CardContent> 
            // :null
        }

        </div>




        {/* Table Feature  */}
        <div className="tableContainer" style={this.state.rowData.length === 0 ? { display : "none"} : null}>
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
            // this.state.graphClicked >= 0 ?
            <ReactTable id="customReactTable"
            // PaginationComponent={Pagination}
            data={ this.state.rowData }  
            columns={ this.state.columnData }  
            defaultPageSize = {this.state.rowData.length > 10 ? 10 : this.state.rowData.length}
            pageSize={this.state.rowData.length > 10 ? 10 : this.state.rowData.length}  
            pageSizeOptions = {[20,40,60]}  
            /> 
            // :null
        }
        </div>
        </div>
    );
    }
}

export default DashboardOSBM;
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
import './RPIndex.css'

class RPCollectionReport extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            checkData :[],
            allGraphData :[],
            allData: [],
            dataOne: [],
            dataTwo: [],
            dataThird :[],
            graphOneLabel: [],
            graphOneData: [],
            graphTwoLabel: [],
            graphTwoData: [],
            graphThirdLabel : [],
            graphThirdData : [],
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
    const pdfTitle = "Rented Property Dashboard"
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
    if(checkGraph === "dashboard 1"){
        debugger;
        var sortNo = null;
        var graphOneData = [];
        var principalDue = [];
        var amt;

        debugger;
        var sortValueNo = sortBy + 4;

        var group = data.reduce((r, a) => {
            r[a[6]] = [...r[a[6]] || [], a];
            return r;
            }, {});

        var graphOneLabel = Object.keys(group);
        var graphOneData = []
        for(var i=0; i<Object.keys(group).length ; i++){
            var amtTotal = 0;
            for(var j=0; j< group[Object.keys(group)[i]].length; j++){
                var amt = group[Object.keys(group)[i]][j];
                amtTotal = amtTotal + parseInt(amt[7]);
            }
            graphOneData.push(amtTotal);
        }
        return [ graphOneLabel, graphOneData, group ]
    }else if(checkGraph === "dashboard 2"){
        debugger;
        var sortNo = null;
        var graphOneData = [];
        var principalDue = [];
        var amt;

        debugger;
        var sortValueNo = sortBy + 4;

        var group = data.reduce((r, a) => {
            r[a[1]] = [...r[a[1]] || [], a];
            return r;
            }, {});

        var graphOneLabel = Object.keys(group);
        var graphOneData = []
        for(var i=0; i<Object.keys(group).length ; i++){
            var amtTotal = 0;
            for(var j=0; j< group[Object.keys(group)[i]].length; j++){
                var amt = group[Object.keys(group)[i]][j][7];
                amtTotal = amtTotal + parseInt(amt);
            }
            graphOneData.push(amtTotal);
        }
        // graphOneData = [];
        // Random Color 
        var dynamicColors = function() {
            var r = Math.floor(Math.random() * 255);
            var g = Math.floor(Math.random() * 255);
            var b = Math.floor(Math.random() * 255);
            return "rgb(" + r + "," + g + "," + b + ")";
        };

        var coloR = [];
        var ict_unit = [];
        var efficiency = [];    
        var labelData = graphOneLabel;
        for (var i in labelData) {
            ict_unit.push("ICT Unit " + labelData[i].ict_unit);
            efficiency.push(labelData[i].efficiency);
            coloR.push(dynamicColors());
        }
        this.setState({
            colorRandom : coloR
        })

        return [ graphOneLabel, graphOneData, group ]

        return [ graphOneLabel, graphOneData, group ]
    }
    else{
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
        const propSortBy = "eventStatus";
        // const propSortBy = "status";
        const data = this.props.data;
        this.setState({
            checkData : this.props.data
        })

        var monthJSON = {"0":"JAN","1":"FEB","2":"MAR","3":"APR","4":"MAY","5":"JUN","6":"JUL",
        "7":"AUG","8":"SEP","9":"OCT","10":"NOV","11":"DEC"};

        const hardJSON = propSortBy === "eventStatus" ? [{ 
            "sortBy": "eventStatus",
            "msgX": "",
            "msgY": "",
            "title": ""
            },
            { 
            "sortBy": "status",
            "msgX": "",
            "msgY": "",
            "title": ""
            }] : []

        var OwnershipTransfer = this.props.data[0].reportResponses[0].reportData;
        var DuplicateCopy = this.props.data[1].reportResponses[0].reportData;
        var PropertyRent = this.props.data[2].reportResponses[0].reportData;
        
        var allGraphData = [OwnershipTransfer, DuplicateCopy, PropertyRent];
        var graphData = [];

        for(var i=0;i<allGraphData.length; i++){
            graphData.push(allGraphData[i].length);
        }
        debugger;
        var allRowData = OwnershipTransfer;
        allRowData = allRowData.concat(DuplicateCopy);
        allRowData = allRowData.concat(PropertyRent);


        // Graph One Sorting Function 
        // var graphOneData2 = this.graphSorting( propSortBy, data, "dashboard 1" );

        
        debugger;
        // Column Data
        const tableData = data[0] ? Object.keys(data[0]) : [];
        const tableDataHeader = ["Receipt Number", "Receipt Issue Date", "Transit Number", "Name", "Mobile No", "Transaction Number",
            "Payment type", "Total"];
        var columnData = []
        for(var i=0; i<tableDataHeader.length; i++){
            var itemHeader = {}
            itemHeader["Header"] = this.camelize(tableDataHeader[i]);
            itemHeader["accessor"] = i.toString();
            itemHeader["show"]=  true;
            columnData.push(itemHeader);
        }

        // var item = {};
        // item["Header"] = Object.values(data["reportHeader"])[i]["label"];
        // item["id"] = i;
        // item["accessor"] = i.toString();
        // item["show"] = true;
        // columnData.push(item)

        // Column Unchange Data 
        // const unchangeColumnData = this.columnUnchange(columnData)
        const unchangeColumnData = columnData

        
        this.setState({
            graphOneLabel: [ "OwnershipTransfer", "DuplicateCopy", "PropertyRent"],
            graphOneData: graphData,
            graphClicked: 0,
            // dataOne: graphOneData2[2],
            columnData: columnData,
            unchangeColumnData: unchangeColumnData,
            rowData: allRowData,
            // hardJSON: hardJSON,
            allGraphData: allGraphData
        })

    }

    componentDidMount(){
        debugger;
        if(JSON.stringify(this.state.checkData) !== JSON.stringify(this.props.data)){
            const propSortBy = "eventStatus";
            // const propSortBy = "status";
            const data = this.props.data;
    
            var monthJSON = {"0":"JAN","1":"FEB","2":"MAR","3":"APR","4":"MAY","5":"JUN","6":"JUL",
            "7":"AUG","8":"SEP","9":"OCT","10":"NOV","11":"DEC"};
    
            const hardJSON = propSortBy === "eventStatus" ? [{ 
                "sortBy": "eventStatus",
                "msgX": "",
                "msgY": "",
                "title": ""
                },
                { 
                "sortBy": "status",
                "msgX": "",
                "msgY": "",
                "title": ""
                }] : []
    
            var OwnershipTransfer = this.props.data[0].reportResponses[0].reportData;
            var DuplicateCopy = this.props.data[1].reportResponses[0].reportData;
            var PropertyRent = this.props.data[2].reportResponses[0].reportData;
            
            var allGraphData = [OwnershipTransfer, DuplicateCopy, PropertyRent];
            var graphData = [];
    
            for(var i=0;i<allGraphData.length; i++){
                graphData.push(allGraphData[i].length);
            }
            debugger;
            var allRowData = OwnershipTransfer;
            allRowData = allRowData.concat(DuplicateCopy);
            allRowData = allRowData.concat(PropertyRent);
    
    
            // Graph One Sorting Function 
            // var graphOneData2 = this.graphSorting( propSortBy, data, "dashboard 1" );
    
            
            debugger;
            // Column Data
            const tableData = data[0] ? Object.keys(data[0]) : [];
            const tableDataHeader = ["Receipt Number", "Receipt Issue Date", "Transit Number", "Name", "Mobile No", "Transaction Number",
                "Payment type", "Total"];
            var columnData = []
            for(var i=0; i<tableDataHeader.length; i++){
                var itemHeader = {}
                itemHeader["Header"] = this.camelize(tableDataHeader[i]);
                itemHeader["accessor"] = i.toString();
                itemHeader["show"]=  true;
                columnData.push(itemHeader);
            }
    
            // var item = {};
            // item["Header"] = Object.values(data["reportHeader"])[i]["label"];
            // item["id"] = i;
            // item["accessor"] = i.toString();
            // item["show"] = true;
            // columnData.push(item)
    
            // Column Unchange Data 
            // const unchangeColumnData = this.columnUnchange(columnData)
            const unchangeColumnData = columnData
    
            
            this.setState({
                graphOneLabel: [ "OwnershipTransfer", "DuplicateCopy", "PropertyRent"],
                graphOneData: graphData,
                graphClicked: 0,
                // dataOne: graphOneData2[2],
                columnData: columnData,
                unchangeColumnData: unchangeColumnData,
                rowData: allRowData,
                // hardJSON: hardJSON,
                allGraphData: allGraphData,
                checkData : this.props.data
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
            text: "Rented Properties Registry Report"
        },
        // scales: {
        //     xAxes: [{
        //         gridLines: {
        //             display:true
        //         },
        //         scaleLabel: {
        //             display: true,
        //             labelString:"msgX"
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
        //             labelString: "msgY"
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
                const data = this.state.allGraphData[ind];

                var graphData = this.graphSorting( 2, data, "" );
                debugger;
                
                this.setState({
                    graphTwoLabel: graphData[0],
                    graphTwoData: graphData[1],
                    dataTwo: graphData[2],
                    graphClicked: 1,
                    rowData: data,
                    // columnData : columnData
                })
                
            }
        },
    }
    

    // Second Graph Colonywise
    var graphTwoSortedData = {
        labels: this.state.graphTwoLabel,
        datasets: [
            {
            label: "Total",
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
            text: "Rented Properties Colonywise Report"
        },
        onClick: (e, element) => {
            if (element.length > 0) {
                var ind = element[0]._index;
                // debugger;
                // const selectedVal = this.state.graphTwoLabel[ind];
                
                // this.setState({
                //     graphClicked: 2,
                //     rowData: this.state.dataTwo[selectedVal]
                // })
                debugger;
                var ind = element[0]._index;   
                const selectedVal = this.state.graphTwoLabel[ind];
                const data = this.state.dataTwo[selectedVal];

                var graphData = this.graphSorting( 10, data, "" );
                debugger;
                
                var selectedData = graphData[2];
                var amtGraphData = [];
                for(var i=0;i<Object.keys(selectedData).length;i++){
                    var amt = 0;
                    for(var j=0;j<selectedData[Object.keys(selectedData)[i]].length;j++){
                        var amtDatd = selectedData[Object.keys(selectedData)[i]][j][11];
                        amt = amt + amtDatd;
                    }
                    amtGraphData.push(amt)
                }
                this.setState({
                    graphThirdLabel: graphData[0],
                    graphThirdData: amtGraphData,
                    dataThird: graphData[2],
                    graphClicked: 2,
                    rowData: data,
                    // columnData : columnData
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
                    labelString: "Colony"
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
                    labelString: "Total Rented Report"
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

    // Third Graph Payment Type
    var graphThirdSortedData = {
        labels: this.state.graphThirdLabel,
        datasets: [
            {
            label: "Total Amt",
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
            text: "Rented Properties Typewise Amount Report"
        },
        onClick: (e, element) => {
            if (element.length > 0) {
                var ind = element[0]._index;
                debugger;
                const selectedVal = this.state.graphThirdLabel[ind];
                
                this.setState({
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
        //             // stepSize: 1
        //         },
        //         scaleLabel: {
        //             display: true,
        //             labelString: "Colony"
        //             }, 
        //     }],
        //     yAxes: [{
        //         gridLines: {
        //             display: true
        //         },
        //         ticks: {
        //             suggestedMin: 0,
        //             // stepSize: 1
        //         },
        //         scaleLabel: {
        //             display: true,
        //             labelString: "Due Amount (in Lakh)"
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
        <div style={this.state.rowData === 0 ? {display : "none"} :null}>
        
        <div className="graphDashboard">
        
        <CardContent className="halfGraph">
            <React.Fragment>
                <Pie
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

        <div className="graphDashboard" style={this.state.graphClicked < 2 ? {display : "none"} :null}>
        
        <CardContent className="fullGraph">
            <React.Fragment>
                <Pie
                data={ graphThirdSortedData }
                options={ graphThirdOption } 
                />
            </React.Fragment>
        </CardContent>
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
        </div>
    );
    }
}

export default RPCollectionReport;
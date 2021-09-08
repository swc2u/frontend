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
import './SewerageIndex.css';

const isMobile = window.innerWidth < 500
const responsiveSizeHack = isMobile ? window.innerWidth + 400 : window.innerWidth

const containerGraphMobile = {
    position: "relative",
    display: "block",
    overflowX: "auto"
}

const containerGraphWeb = {
    position: "relative",
    display: "block",
    width : "700px"
    // overflowX: "auto"
}

class SewerageDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            recordNotFound : "",
            dropdownSelected : "",
            allData: [],
            dataOne: [],
            dataTwo: [],
            dataThird : [],
            graphOneLabel: [],
            graphOneData: [],
            graphTwoLabel: [],
            graphTwoData: [],
            graphThreeLabelSHOW : [],
            graphThreeLabel : [],
            graphThreeData : [],
            graphClicked: -1,
            hardJSON: [],
            graphHardOneData : {},
            graphHardTwoData : {},
            rowData: [],
            columnData: [],
            // Feature Table
            toggleColumnCheck: false,
            unchangeColumnData: [],
            baseUrl : window.location.origin
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
                    if(demo2[0] === "connectionHolders[0]"){
                        rowItem.push(rowData[i]["connectionHolders"][0][demo2[1]]);  
                    }
                    if(demo2[0] === "swProperty"){
                        rowItem.push(rowData[i]["swProperty"][demo2[1]]);  
                    }
                    // rowItem.push(rowData[i][demo2[0]][demo2[1]]);
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

    doc.text("Chandigarh Application", pageWidth / 2, 20, 'center');

    doc.setFontSize(10);
    const pdfTitle = "Sewerage Applications Dashboard"
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
    
    graphSorting = (data, sortBy, dropdownSelected, selectedDashboard ) => {
        var monthJSON = {"0":"JAN","1":"FEB","2":"MAR","3":"APR","4":"MAY","5":"JUN","6":"JUL",
        "7":"AUG","8":"SEP","9":"OCT","10":"NOV","11":"DEC"};
        if(selectedDashboard === "Single Program"){
            
            var dateRange = sortBy;
            var group = data.reduce((r, a) => {
                r[new Date(a["auditDetails"]["lastModifiedTime"]).getFullYear()+"-"+monthJSON[new Date(a["auditDetails"]["lastModifiedTime"]).getMonth()]] =
                    [...r[new Date(a["auditDetails"]["lastModifiedTime"]).getFullYear()+"-"+monthJSON[new Date(a["auditDetails"]["lastModifiedTime"]).getMonth()]] || [], a];
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
            
            var headerData = [];
            var keys = Object.keys(data[0]);

            var itemHeader = {}
            itemHeader["Header"] = this.camelize(keys[3]);
            itemHeader["accessor"] = keys[3];
            itemHeader["show"]= true ;
            itemHeader["Cell"]= row => (
                <div>
                    <a href={"https://egov.chandigarhsmartcity.in/employee/wns/search-preview?applicationNumber="+row.value+"&tenantId=ch.chandigarh&history=true&service=SEWERAGE"}> {row.value} </a>
                </div>
            );
            headerData.push(itemHeader);
            
            var keys = Object.keys(data[0]);
            for(var i=0; i<Object.keys(data[0]).length; i++){
                var itemHeader = {}
                if(dropdownSelected === "Sewerage Dashboard"){
                    if(i === 4 || i === 25 || i === 16 || i=== 38 || i=== 34 || i=== 26 || i === 41){
                        itemHeader["Header"] = this.camelize(keys[i]);
                        itemHeader["accessor"] = keys[i];
                        itemHeader["show"]= true ;
                        headerData.push(itemHeader);
                    }
                    if(i === 5){
                        itemHeader["Header"] = "Name";
                        itemHeader["accessor"] = "connectionHolders[0].name";
                        itemHeader["show"]= true ;
                        headerData.push(itemHeader);
                    }
                    if(i === 11){
                        var itemHeader = {}
                        itemHeader["Header"] = "PlotNo";
                        itemHeader["accessor"] = "swProperty.plotNo";
                        itemHeader["show"]= true ;
                        headerData.push(itemHeader);
                    }
                    if(i === 11){
                        var itemHeader = {}
                        itemHeader["Header"] = "SectorNo";
                        itemHeader["accessor"] = "swProperty.sectorNo";
                        itemHeader["show"]= true ;
                        headerData.push(itemHeader);

                        var itemHeader = {}
                        itemHeader["Header"] = "UsageCategory";
                        itemHeader["accessor"] = "swProperty.usageCategory";
                        itemHeader["show"]= true ;
                        headerData.push(itemHeader);

                        var itemHeader = {}
                        itemHeader["Header"] = "UsageSubCategory";
                        itemHeader["accessor"] = "swProperty.usageSubCategory";
                        itemHeader["show"]= true ;
                        headerData.push(itemHeader);
                    }
                }
            }

            var rowData = data;

            this.setState({
                graphOneLabel : graphLabel,
                graphOneData : graphData,
                dataOne : group,
                columnData : headerData,
                unchangeColumnData : headerData,
                rowData : rowData,
                graphClicked : 0,
                dropdownSelected : dropdownSelected
            })
                
        }if(selectedDashboard === "SEP Program Status"){
            
            var group = data.reduce((r, a) => {
                r[a[sortBy]] = [...r[a[sortBy]] || [], a];
                return r;
                }, {});

            var graphLabel = Object.keys(group);
            var graphData = []
            for(var i=0; i<Object.keys(group).length ; i++){
                graphData.push(group[graphLabel[i]].length);
            } 
            
            var rowData = data;
            var graphLablelDisplay = []
            for(var i=0; i<graphLabel.length; i++){
                if(graphLabel[i].length > 15){
                    var labelSplit = [graphLabel[i].substr(0,10), graphLabel[i].substr(10, 20), graphLabel[i].substr(20, 30)];
                    graphLablelDisplay.push(labelSplit)
                }else{
                    graphLablelDisplay.push(graphLabel[i])
                }
            }

            graphLablelDisplay = [];
            for(var i=0; i<graphLabel.length; i++){
                var show_label = graphLabel[i] ;
                show_label = show_label.replaceAll("_", " ");
                show_label = show_label.charAt(0).toUpperCase() + show_label.substring(1).toLowerCase()
                graphLablelDisplay.push(show_label);
            }

            this.setState({
                graphLabelTwoDisplay : graphLablelDisplay,
                graphTwoLabel : graphLabel,
                graphTwoData : graphData,
                dataTwo : group,
                rowData : rowData,
                graphClicked : 0
            })
        }
        if(selectedDashboard === "All Program"){
            
            var SEP = data.SEP.ResponseBody;
            var SMID = data.SMID.ResponseBody;
            var SUSV = data.SUSV.ResponseBody;
            var SUH = data.SUH.ResponseBody;
            var allData = SEP.concat(SMID).concat(SUSV).concat(SUH)

            var graphLabel = ["SEP", "SMID", "SUSV", "SUH"];
            var graphData = [SEP.length, SMID.length, SUSV.length, SUH.length];
            
            var headerData = []
            // var keys = allData;

            var keys = Object.keys(allData[0]);
            for(var i=0; i<5; i++){
                if(Object.keys(allData[0])[i] === "applicationDocument" || 
                Object.keys(allData[0])[i] === "auditDetails" ||
                Object.keys(allData[0])[i] === "applicationDocument" ||
                Object.keys(allData[0])[i] === "documentAttachemnt" ||
                Object.keys(allData[0])[i] === "susvApplicationFamilyDetails" ||
                Object.keys(allData[0])[i] === "suhFacilitiesDetails" ||
                Object.keys(allData[0])[i] === "addressPicture" ||
                Object.keys(allData[0])[i] === "programPicture" ||
                Object.keys(allData[0])[i] === "documentAttachment"){
                    
                }else{
                    var itemHeader = {}
                    itemHeader["Header"] = keys[i];
                    itemHeader["accessor"] = keys[i];
                    itemHeader["show"]= true ;
                }

                headerData.push(itemHeader);
            }
            var rowData = allData;

            this.setState({
                graphOneLabel : graphLabel,
                graphOneData : graphData,
                dataOne : data,
                columnData : headerData,
                unchangeColumnData : headerData,
                rowData : rowData,
                graphClicked : 0,
            })
            var sortBy =sortBy;
            var dropdownSelected = dropdownSelected;
            var selectedDashboard = selectedDashboard;
        }
        if(selectedDashboard === "AllDataMonthWise"){
            
            var dateRange = sortBy;
            var group = data.reduce((r, a) => {
                r[new Date(a["auditDetails"]["lastModifiedTime"]).getFullYear()+"-"+monthJSON[new Date(a["auditDetails"]["lastModifiedTime"]).getMonth()]] =
                    [...r[new Date(a["auditDetails"]["lastModifiedTime"]).getFullYear()+"-"+monthJSON[new Date(a["auditDetails"]["lastModifiedTime"]).getMonth()]] || [], a];
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

            // var headerData = [];
            // var keys = Object.keys(data[0]);
            // for(var i=0; i<Object.keys(data[0]).length; i++){
            //     var itemHeader = {}
            //     itemHeader["Header"] = keys[i];
            //     itemHeader["accessor"] = keys[i];
            //     if(dropdownSelected === "All Program"){
            //         if(i === 1 || i === 3 || i === 5 || i === 6 || i === 7 || i === 14){
            //             itemHeader["show"]= true ;
            //         }else{
            //             itemHeader["show"]= false ;
            //         }                    
            //     }
            //     headerData.push(itemHeader);
            // }

            var rowData = data;

            this.setState({
                graphTwoLabel : graphLabel,
                graphTwoData : graphData,
                dataTwo : group,
                // columnData : headerData,
                // unchangeColumnData : headerData,
                rowData : rowData,
                graphClicked : 1,
                dropdownSelected : dropdownSelected
            })
        }
        if(selectedDashboard === "Final Dashboard"){
            

            
            var group = data.reduce((r, a) => {
                r[a[sortBy]] = [...r[a[sortBy]] || [], a];
                return r;
                }, {});

            var graphLabel = Object.keys(group);
            var graphData = []
            for(var i=0; i<Object.keys(group).length ; i++){
                var amt = 0;
                for(var j=0; j<group[graphLabel[i]].length; j++){
                    var connection = group[graphLabel[i]][j];
                    var amount = parseInt(group[graphLabel[i]][j].totalAmountPaid);
                    amt = amt + amount;
                }
                // graphData.push(group[graphLabel[i]].length);
                graphData.push(amt/100000);
            } 
            
            var rowData = data;

            var rowData = data;
            var graphLabelSHOW = [];
            for(var i=0; i<graphLabel.length; i++){
                if(graphLabel[i] === "null"){
                    graphLabelSHOW.push("Sub-Division (null)");
                }else{
                    graphLabelSHOW.push("Sub-Division "+graphLabel[i]);
                }
            }

            this.setState({
                graphLabelSHOW : graphLabelSHOW,
                graphThreeLabel : graphLabel,
                graphThreeData : graphData,
                dataThird : group,
                rowData : rowData,
                graphClicked : 3
            })
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
        
        const propsData =  this.props.data;
        this.setState({
            checkData : propsData
        })
    }

    componentDidUpdate(){
        
        const propsData = this.props.data;
        if(JSON.stringify(this.state.checkData) !== JSON.stringify(propsData)){
            var fromDT = this.props.data[1].fromDate;
            var toDT = this.props.data[1].toDate;
            var dates = this.dateTimeToForma(fromDT, toDT)
            var dateRange = this.dateRange(dates[0], dates[1]);
            var dropdownSelected = this.props.data[1].reportSortBy.value;

            var data;
            data = this.props.data[0].SewerageConnections; 
            if(data.length > 0){
                var sortData = this.graphSorting(data, dateRange, dropdownSelected, "Single Program");
            }else{
                this.setState({
                    graphClicked : -1,
                    rowData : [],
                    recordNotFound : "Data Not Found..!"
                })
            }
            this.setState({
                fromDate : "2020-08-01",
                toDate : "2021-05-04",
                dropdownSelected : dropdownSelected,
                recordNotFound : "Record not Found..!"
            })

            this.setState({
                checkData : this.props.data
            })
        }
    }

    render() {
    
    // Export to excel Data
    const csvData = this.state.rowData;

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
            backgroundColor : ["#9DC4E1", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
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
            text: "Month Wise Sewerage Applications"
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display:true
                },
                scaleLabel: {
                    display: true,
                    labelString: this.state.dropdownSelected === "All Program" ? "Programs" : "Months"
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
                    labelString: this.state.dropdownSelected === "All Program" ? "No of Application" : "No of Application"
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
                var data;
                data = this.state.dataOne[selectedVal];
                    if(data){
                        var graphSorting = this.graphSorting(data, "applicationStatus", this.state.dropdownSelected, "SEP Program Status");
                    }else{return 0}
                
                this.setState({
                //     graphTwoLabel: graphSorting[0],
                //     graphTwoData: graphSorting[1],
                //     dataTwo: graphSorting[2],
                    graphClicked: 1,
                //     rowData: this.state.dataOne[selectedVal]
                })
                
            }
        },
    }

    // Second Graph
    var graphTwoSortedData = {
        labels: this.state.graphLabelTwoDisplay,
        // labels: ["Label1", "Label2"],
        datasets: [
            {
            label: "Application",
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
            text: "Sewerage Application Status"
        },
        scales: {
            xAxes: [{
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
                    labelString: "Application Status"
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
                    labelString: "No pf Applications"
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
                const selectedVal = this.state.graphTwoLabel[ind];
                const data = this.state.dataTwo[selectedVal];              
                var graphSorting = this.graphSorting(data, "subdiv", this.state.dropdownSelected, "Final Dashboard");
                
                this.setState({
                    rowData: data,
                    graphClicked : 2
                })
            }
        },
    }

    // Second Graph
    var graphThreeSortedData = {
        labels: this.state.graphLabelSHOW,
        // labels: ["Label1", "Label2"],
        datasets: [
            {
            label: "Amount",
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
            data: this.state.graphThreeData
            // data:[10,20,30]
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
            text: "Sewerage Connection Charges Collected"
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display:true
                },
                scaleLabel: {
                    display: true,
                    labelString:"Sub-Division"
                    }, 
            }],
            yAxes: [{
                gridLines: {
                    display:true
                },
                ticks: {
                    suggestedMin: 0,
                    // suggestedMax: 100,
                    // stepSize: 10
                },
                scaleLabel: {
                    display: true,
                    labelString: "Amount (In Lakh.)"
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
                const selectedVal = this.state.graphThreeLabel[ind];
                const data = this.state.dataThird[selectedVal];              
                this.setState({
                    rowData: data
                })
                
            }
        },
    }


        
    return (
        <div>
        <div style={this.state.rowData.length === 0 ? null : {display:"none"}}>
            { this.state.recordNotFound }
        </div>

        <div className="graphContainer">
            {
                this.state.graphClicked >= 0 ?
                <div
                style={window.innerWidth < 500 ? containerGraphMobile : containerGraphMobile}
                >
                    <div className="graphData">
                        <Bar
                            height="350px"
                            data={ PIEgraphOneSortedData }
                            options={ PIEgraphOneOption }                 
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
                            // width="800px"
                            height="350px"
                            data={ graphTwoSortedData }
                            options={ graphTwoOption }                 
                        />
                    </div>
                </div>
                :null
            }
        </div>
        
        {
            this.state.graphClicked > 1 ?
            <div 
            style={window.innerWidth < 500 ? containerGraphMobile : containerGraphMobile}
            >
                <div className="all-graphData">
                    <Bar
                        width="800px"
                        height="350px"
                        data={ graphThreeSortedData }
                        options={ graphThreeOption }                 
                    />
                </div>
            </div>
            :null
        }

        {/* Table Feature  */}
        <div className="tableContainer" style={this.state.rowData.length === 0 ? 
         {display:"none"} : null}>
        {
            this.state.unchangeColumnData.length > 0  ? 
            <div className="tableFeature">
                <div className="columnToggle-Text"> Download As: </div>
                
                <div className="columnToggleBtn"> 
                <CSVLink data={csvData}
                filename={"Sewerage_dashboard.csv"}
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

export default SewerageDashboard;
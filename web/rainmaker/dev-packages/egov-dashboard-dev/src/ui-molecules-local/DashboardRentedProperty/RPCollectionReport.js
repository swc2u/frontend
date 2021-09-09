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
        rowData1: [],
        columnData1: [],
        rowData2: [],
        columnData2: [],
        
        columnData: [],
        // Feature Table
        toggleColumnCheck: false,
        unchangeColumnData: [],
        unchangeColumnData1 : [],
        unchangeColumnData2 : [],
        typeSelected : ""
        }
      }
    
    
    // PDF function 
    pdfDownload = (e) => {
        
        e.preventDefault();
        var tableDataHeader1 = ["Receipt Number", "Receipt Issue Date", "Colony", "Allotment Number",
             "Allotment Date", "Name", "Mobile Number", "Transaction Number", "Status", "Application Type",
              "Payment Type", "Total Amount"];
        var tableDataHeader2 = ["Receipt Number", "Receipt Issue Date", "Transit Number",
         "Colony",
        "Name", "Mobile Number", "Transaction Number", "Payment Type", "Total Amount"];
        if(this.state.graphClicked === 0){
            
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
                    var demo1 = rowData[i]
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
            var unit = "pt";
            var size = "A4"; // Use A1, A2, A3 or A4
            var orientation = "portrait"; // portrait or landscape
            var marginLeft = 40;
            var doc = new jsPDF(orientation, unit, size);
        
            var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
            var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
        
            doc.text("mChandigarh Application", pageWidth / 2, 20, 'center');
        
            doc.setFontSize(10);
            var pdfTitle = "OwnerShipTransfer Dashboard Data"
            doc.text(pdfTitle, pageWidth / 2, 40, 'center');
        
            doc.autoTable({ html: '#my-table' });
            doc.setFontSize(5);
        
            doc.autoTable({
                // head: [tableColumnDataCamel],
                head: [tableDataHeader1],
                theme: "striped",
                styles: {
                    fontSize: 7,
                },
                body:tableRowData
            });
        
            doc.save(pdfTitle+".pdf");
    
            // Table 2
            var columnData = this.state.unchangeColumnData1
            // var columnDataCamelize = this.state.columnData
            var rowData = this.state.rowData1
        
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
                    var demo1 = rowData[i]
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
            var unit = "pt";
            var size = "A4"; // Use A1, A2, A3 or A4
            var orientation = "portrait"; // portrait or landscape
            var marginLeft = 40;
            var doc = new jsPDF(orientation, unit, size);
        
            var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
            var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
        
            doc.text("Chandigarh Application", pageWidth / 2, 20, 'center');
        
            doc.setFontSize(10);
            var pdfTitle = "Duplicate Copy Dashboard Data"
            doc.text(pdfTitle, pageWidth / 2, 40, 'center');
        
            doc.autoTable({ html: '#my-table' });
            doc.setFontSize(5);
        
            doc.autoTable({
                // head: [tableColumnDataCamel],
                head: [tableDataHeader1],
                theme: "striped",
                styles: {
                    fontSize: 7,
                },
                body:tableRowData
            });
        
            doc.save(pdfTitle+".pdf");
    
            // Table 3
            var columnData = this.state.unchangeColumnData2
            // var columnDataCamelize = this.state.columnData
            var rowData = this.state.rowData2
        
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
                    var demo1 = rowData[i]
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
            var unit = "pt";
            var size = "A4"; // Use A1, A2, A3 or A4
            var orientation = "portrait"; // portrait or landscape
            var marginLeft = 40;
            var doc = new jsPDF(orientation, unit, size);
        
            var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
            var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
        
            doc.text("Chandigarh Application", pageWidth / 2, 20, 'center');
        
            doc.setFontSize(10);
            var pdfTitle = "Rented Property Dashboard Data"
            doc.text(pdfTitle, pageWidth / 2, 40, 'center');
        
            doc.autoTable({ html: '#my-table' });
            doc.setFontSize(5);
        
            doc.autoTable({
                // head: [tableColumnDataCamel],
                head: [tableDataHeader2],
                theme: "striped",
                styles: {
                    fontSize: 7,
                },
                body:tableRowData
            });
        
            doc.save(pdfTitle+".pdf");
        }else{
            var tableDataHeader = [];
            if(this.state.typeSelected === "PropertyRent"){
                tableDataHeader = ["Receipt Number", "Receipt Issue Date", "Transit Number",
                "Colony",
               "Name", "Mobile Number", "Transaction Number", "Payment Type", "Total Amount"];
            }else{
                tableDataHeader = ["Receipt Number", "Receipt Issue Date", "Colony", "Allotment Number",
                "Allotment Date", "Name", "Mobile Number", "Transaction Number", "Status", "Application Type",
                 "Payment Type", "Total Amount"];
            }
            var columnData = this.state.unchangeColumnData
            // var columnDataCamelize = this.state.columnData
            var rowData = this.state.rowData
        
            var group = columnData.reduce((r, a) => {
                r[a["show"]] = [...r[a["show"]] || [], a];
                return r;
                }, {});
        
            columnData = group["true"];
            var tableCol = [];
            for(var i=0; i<columnData.length; i++){
                tableCol.push(columnData[i].Header);
            }
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
                    var demo1 = rowData[i]
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
            var unit = "pt";
            var size = "A4"; // Use A1, A2, A3 or A4
            var orientation = "portrait"; // portrait or landscape
            var marginLeft = 40;
            var doc = new jsPDF(orientation, unit, size);
        
            var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
            var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
        
            doc.text("Chandigarh Application", pageWidth / 2, 20, 'center');
        
            doc.setFontSize(10);
            var pdfTitle = this.state.typeSelected+" Dashboard"
            doc.text(pdfTitle, pageWidth / 2, 40, 'center');
        
            doc.autoTable({ html: '#my-table' });
            doc.setFontSize(5);
        
            doc.autoTable({
                // head: [tableColumnDataCamel],
                head: [tableCol],
                theme: "striped",
                styles: {
                    fontSize: 7,
                },
                body:tableRowData
            });
        
            doc.save(pdfTitle+".pdf");
        }
    
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

    
    if(checkGraph === "dashboard 1"){
        
        var sortNo = null;
        var graphOneData = [];
        var principalDue = [];
        var amt;

        
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
        
        var sortNo = null;
        var graphOneData = [];
        var principalDue = [];
        var amt;

        
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
        
        var allRowData = OwnershipTransfer;
        allRowData = allRowData.concat(DuplicateCopy);
        allRowData = allRowData.concat(PropertyRent);


        // Graph One Sorting Function 
        // var graphOneData2 = this.graphSorting( propSortBy, data, "dashboard 1" );

        
        
        // Column Data 1
        var tableData = data[0] ? Object.keys(data[0]) : [];
        var tableDataHeader = ["Receipt Number", "Receipt Issue Date", "Colony", "Allotment Number",
         "Allotment Date", "Name", "Mobile Number", "Transaction Number", "Status", "Application Type",
          "Payment Type", "Total Amount"];
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
        // var unchangeColumnData = this.columnUnchange(columnData)
        var unchangeColumnData = columnData

        // Column Data 2
        var tableData = data[0] ? Object.keys(data[0]) : [];
        var tableDataHeader = ["Receipt Number", "Receipt Issue Date", "Colony", "Allotment Number",
         "Allotment Date", "Name", "Mobile Number", "Transaction Number", "Status", "Application Type",
          "Payment Type", "Total Amount"];
        var columnData1 = []
        for(var i=0; i<tableDataHeader.length; i++){
            var itemHeader = {}
            itemHeader["Header"] = this.camelize(tableDataHeader[i]);
            itemHeader["accessor"] = i.toString();
            itemHeader["show"]=  true;
            columnData1.push(itemHeader);
        }
        var unchangeColumnData1 = columnData1

        // Column Data 2
        var tableData = data[0] ? Object.keys(data[0]) : [];
        var tableDataHeader = ["Receipt Number", "Receipt Issue Date", "Transit Number", "Colony",
         "Name", "Mobile Number", "Transaction Number", "Payment Type", "Total Amount"];
        var columnData2 = []
        for(var i=0; i<tableDataHeader.length; i++){
            var itemHeader = {}
            itemHeader["Header"] = this.camelize(tableDataHeader[i]);
            itemHeader["accessor"] = i.toString();
            itemHeader["show"]=  true;
            columnData2.push(itemHeader);
        }
        var unchangeColumnData2 = columnData2

        
        this.setState({
            graphOneLabel: [ "PropertyRent", "OwnershipTransfer", "DuplicateCopy"],
            graphOneData: graphData,
            graphClicked: 0,
            // dataOne: graphOneData2[2],
            columnData: columnData,
            unchangeColumnData: unchangeColumnData,
            // rowData: allRowData,
            rowData : DuplicateCopy,
            columnData1: columnData1,
            unchangeColumnData1: unchangeColumnData1,
            // rowData: allRowData,
            rowData1 : PropertyRent,
            columnData2: columnData2,
            unchangeColumnData2: unchangeColumnData2,
            // rowData: allRowData,
            rowData2 : OwnershipTransfer,
            // hardJSON: hardJSON,
            allGraphData: allGraphData,
        })

    }

    componentDidUpdate(){
        
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
            
            var allRowData = OwnershipTransfer;
            allRowData = allRowData.concat(DuplicateCopy);
            allRowData = allRowData.concat(PropertyRent);
    
    
            // Graph One Sorting Function 
            // var graphOneData2 = this.graphSorting( propSortBy, data, "dashboard 1" );
    
            
            
        // Column Data 1
        var tableData = data[0] ? Object.keys(data[0]) : [];
        var tableDataHeader = ["Receipt Number", "Receipt Issue Date", "Colony", "Allotment Number",
         "Allotment Date", "Name", "Mobile Number", "Transaction Number", "Status", "Application Type",
          "Payment Type", "Total Amount"];
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
        // var unchangeColumnData = this.columnUnchange(columnData)
        var unchangeColumnData = columnData

        // Column Data 2
        var tableData = data[0] ? Object.keys(data[0]) : [];
        var tableDataHeader = ["Receipt Number", "Receipt Issue Date", "Colony", "Allotment Number",
         "Allotment Date", "Name", "Mobile Number", "Transaction Number", "Status", "Application Type",
          "Payment Type", "Total Amount"];
        var columnData1 = []
        for(var i=0; i<tableDataHeader.length; i++){
            var itemHeader = {}
            itemHeader["Header"] = this.camelize(tableDataHeader[i]);
            itemHeader["accessor"] = i.toString();
            itemHeader["show"]=  true;
            columnData1.push(itemHeader);
        }
        var unchangeColumnData1 = columnData1

        // Column Data 2
        var tableData = data[0] ? Object.keys(data[0]) : [];
        var tableDataHeader = ["Receipt Number", "Receipt Issue Date", "Transit Number", "Colony",
         "Name", "Mobile Number", "Transaction Number", "Payment Type", "Total Amount"];
        var columnData2 = []
        for(var i=0; i<tableDataHeader.length; i++){
            var itemHeader = {}
            itemHeader["Header"] = this.camelize(tableDataHeader[i]);
            itemHeader["accessor"] = i.toString();
            itemHeader["show"]=  true;
            columnData2.push(itemHeader);
        }
        var unchangeColumnData2 = columnData2
    
            
            this.setState({
                graphOneLabel: [ "PropertyRent", "OwnershipTransfer", "DuplicateCopy"],
            graphOneData: graphData,
            graphClicked: 0,
            // dataOne: graphOneData2[2],
            columnData: columnData,
            unchangeColumnData: unchangeColumnData,
            // rowData: allRowData,
            rowData : DuplicateCopy,
            columnData1: columnData1,
            unchangeColumnData1: unchangeColumnData1,
            // rowData: allRowData,
            rowData1 : PropertyRent,
            columnData2: columnData2,
            unchangeColumnData2: unchangeColumnData2,
            // rowData: allRowData,
            rowData2 : OwnershipTransfer,
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
                    
                    
                    var ind = element[0]._index;   
                    var selectedVal = this.state.graphOneLabel[ind];
                    var data = this.state.allGraphData[ind];
                    var columnData1 = [];
                    var unchangeColumnData1 = [];
                    if(ind === 0){
                        var graphData = this.graphSorting( 3, data, "" );
                        var tableDataHeader = ["Receipt Number", "Receipt Issue Date", "Transit Number", "Colony",
                        "Name", "Mobile Number", "Transaction Number", "Payment Type", "Total Amount"];
    
                        columnData1 = []
                        for(var i=0; i<tableDataHeader.length; i++){
                            var itemHeader = {}
                            itemHeader["Header"] = this.camelize(tableDataHeader[i]);
                            itemHeader["accessor"] = i.toString();
                            itemHeader["show"]=  true;
                            columnData1.push(itemHeader);
                        }
                        unchangeColumnData1 = columnData1
    
                    }else{
                        var graphData = this.graphSorting( 2, data, "" );
                        var tableDataHeader = ["Receipt Number", "Receipt Issue Date", "Colony", "Allotment Number",
                        "Allotment Date", "Name", "Mobile Number", "Transaction Number", "Status", "Application Type",
                        "Payment Type", "Total Amount"];
                        
                        columnData1 = []
                        for(var i=0; i<tableDataHeader.length; i++){
                            var itemHeader = {}
                            itemHeader["Header"] = this.camelize(tableDataHeader[i]);
                            itemHeader["accessor"] = i.toString();
                            itemHeader["show"]=  true;
                            columnData1.push(itemHeader);
                        }
                        unchangeColumnData1 = columnData1
                    }
                    
                    
                    
    
                    this.setState({
                        graphTwoLabel: graphData[0],
                        graphTwoData: graphData[1],
                        dataTwo: graphData[2],
                        graphClicked: 1,
                        rowData: data,
                        columnData : columnData1,
                        unchangeColumnData : unchangeColumnData1,
                        typeSelected : selectedVal
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
                    // 
                    // var selectedVal = this.state.graphTwoLabel[ind];
                    
                    // this.setState({
                    //     graphClicked: 2,
                    //     rowData: this.state.dataTwo[selectedVal]
                    // })
                    
                    var ind = element[0]._index;   
                    var selectedVal = this.state.graphTwoLabel[ind];
                    var data = this.state.dataTwo[selectedVal];
    
                    var selectedData = [];
                    var amtGraphData = [];
                    if(this.state.typeSelected === "PropertyRent"){
                        var graphData = this.graphSorting( 7, data, "" );
    
                        selectedData = graphData[2];
                        for(var i=0;i<Object.keys(selectedData).length;i++){
                            var amt = 0;
                            for(var j=0;j<selectedData[Object.keys(selectedData)[i]].length;j++){
                                var amtDatd = selectedData[Object.keys(selectedData)[i]][j][8];
                                amt = amt + amtDatd;
                            }
                            amtGraphData.push(amt)
                        }
    
                    }else{
                        var graphData = this.graphSorting( 10, data, "" );
                        
                        selectedData = graphData[2];
                        for(var i=0;i<Object.keys(selectedData).length;i++){
                            var amt = 0;
                            for(var j=0;j<selectedData[Object.keys(selectedData)[i]].length;j++){
                                var amtDatd = selectedData[Object.keys(selectedData)[i]][j][11];
                                amt = amt + amtDatd;
                            }
                            amtGraphData.push(amt)
                        }
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
                    
                    var selectedVal = this.state.graphThirdLabel[ind];
                    
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
        <div className="tableBlock">
        <div className="tableContainerRented">
        {
            this.state.unchangeColumnData.length > 0  ? 
            <div className="tableFeature">
                <div className="columnToggle-Text"> Download As: </div>
                <button className="columnToggleBtn" onClick={this.pdfDownload}> PDF </button>

                <button className="columnToggleBtn" style={this.state.graphClicked > 0 ? null : {display : "none"}} onClick={this.toggleColumn}> Column Visibility </button>
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

        <div className="tableData" style={this.state.graphClicked > 0 ? {display:"none"} :null }> Property Type : DuplicateCopy Data </div>
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
        <div className="defaulttableContainer" style={this.state.graphClicked > 0 ? {display:"none"} :null}>
        <div className="tableData"> Property Type : OwnershipTransfer Data </div>
        {
            this.state.graphClicked >= 0 ?
            <ReactTable id="customReactTable"
            // PaginationComponent={Pagination}
            data={ this.state.rowData1 }  
            columns={ this.state.columnData1 }  
            defaultPageSize = {this.state.rowData1.length > 10 ? 10 : this.state.rowData1.length}
            pageSize={this.state.rowData1.length > 10 ? 10 : this.state.rowData1.length}  
            pageSizeOptions = {[20,40,60]}  
            /> 
            :null
        }
        </div>
        <div className="defaulttableContainer" style={this.state.graphClicked > 0 ? {display:"none"} :null}>
        <div className="tableData"> Property Type : PropertyRent Data </div>
        {
            this.state.graphClicked >= 0 ?
            <ReactTable id="customReactTable"
            // PaginationComponent={Pagination}
            data={ this.state.rowData2 }  
            columns={ this.state.columnData2 }  
            defaultPageSize = {this.state.rowData2.length > 10 ? 10 : this.state.rowData2.length}
            pageSize={this.state.rowData2.length > 10 ? 10 : this.state.rowData2.length}  
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

export default RPCollectionReport;
import React, { Component } from "react";
import { Doughnut, Bar, HorizontalBar, Line, Pie } from 'react-chartjs-2';
import CardContent from '@material-ui/core/CardContent';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css" ;
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import './EstateIndex.css'

class DashboardEstate extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            dropdownSelected : "",
            graphOneLabel : [],
            graphOneData : [],
            dataOne: [],
            graphTwoLabel : [],
            graphTwoData : [],
            dataTwo : [],
            graphThirdLabel : [],
            graphThirdData : [],
            dataThird: [],
            graphFourthLabel : [],
            graphFourthData:[],
            dataFourth : [],
            graphFifthLabel : [],
            graphFifthData:[],
            dataFifth : [],
            graphClicked : -1,
            rowData: [],
            columnData: [],
            unchangeColumnData: [],

            columnDataApplication : [],
            unchangeColumnDataApplication : [],
            rowDataApplication : [],
            columnDataPropertyRent : [],
            unchangeColumnDataPropertyRent : [],
            rowDataPropertyRent : [],
            columnDataPropertyPenalty : [],
            unchangeColumnDataPropertyPenalty : [],
            rowDataPropertyPenalty : [],
            columnDataExtensionFee : [],
            unchangeColumnDataExtensionFee : [],
            rowDataExtensionFee : [],
            columnDataSecurityDeposit : [],
            unchangeColumnDataSecurityDeposit : [],
            rowDataSecurityDeposit : [],
        }
    }


    // PDF function 
    pdfDownload = (e) => {
    debugger;
    e.preventDefault();

    if(this.state.graphClicked === 0){
        // alert("ok");

        // Application
        var columnData = this.state.unchangeColumnDataApplication
        // var columnDataCamelize = this.state.columnData
        var rowData = this.state.rowDataApplication

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

        var tableCol = [];
        for(var i=0; i<columnData.length; i++){
            tableCol.push(columnData[i].Header);
        }


        debugger;
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
        var pdfTitle = "Estate Management Dashboard(Application)";
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

        // Property Rent
        var columnData = this.state.unchangeColumnDataPropertyRent;
        // var columnDataCamelize = this.state.columnData
        var rowData = this.state.rowDataPropertyRent;

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

        var tableCol = [];
        for(var i=0; i<columnData.length; i++){
            tableCol.push(columnData[i].Header);
        }


        debugger;
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
        var pdfTitle = "Estate Management Dashboard(Property Rent)";
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

        // Property Penalty
        var columnData = this.state.unchangeColumnDataPropertyPenalty;
        // var columnDataCamelize = this.state.columnData
        var rowData = this.state.rowDataPropertyPenalty;

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

        var tableCol = [];
        for(var i=0; i<columnData.length; i++){
            tableCol.push(columnData[i].Header);
        }


        debugger;
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
        var pdfTitle = "Estate Management Dashboard(Property Penalty)";
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

        // Extension Fee
        var columnData = this.state.unchangeColumnDataExtensionFee;
        // var columnDataCamelize = this.state.columnData
        var rowData = this.state.rowDataExtensionFee;

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

        var tableCol = [];
        for(var i=0; i<columnData.length; i++){
            tableCol.push(columnData[i].Header);
        }


        debugger;
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
        var pdfTitle = "Estate Management Dashboard(Extension Fee)";
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

        // Security Deposit
        var columnData = this.state.unchangeColumnDataSecurityDeposit;
        // var columnDataCamelize = this.state.columnData
        var rowData = this.state.rowDataSecurityDeposit;

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

        var tableCol = [];
        for(var i=0; i<columnData.length; i++){
            tableCol.push(columnData[i].Header);
        }


        debugger;
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
        var pdfTitle = "Estate Management Dashboard(Security Deposit)";
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


    }else if(this.state.graphClicked > 0){
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

        var tableCol = [];
        for(var i=0; i<columnData.length; i++){
            tableCol.push(columnData[i].Header);
        }


        debugger;
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
        var pdfTitle = "Type/Branchwise Estate Management Dashboard"
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
        if(checkGraph[0] === "dashboard_1_Two"){
            var sortNo = null;
            var rowData = data.reportResponses[0].reportData;
            var colData = data.reportResponses[0].reportHeader;
            var group = rowData.reduce((r, a) => {
                r[a[sortBy]] = [...r[a[sortBy]] || [], a];
                return r;
                }, {});
    
            var graphOneLabel = Object.keys(group);
            var graphOneData = []
            for(var i=0; i<Object.keys(group).length ; i++){
                var amt = 0;
                var itemData = group[graphOneLabel[i]];
                for(var j=0; j<itemData.length; j++){
                    if(checkGraph[1] === "Applications"){
                        amt = amt + itemData[j][4];
                    }
                    if(checkGraph[1] === "Property Rent"){
                        amt = amt + itemData[j][5];
                    }
                    if(checkGraph[1] === "Property Penalty"){
                        amt = amt + itemData[j][3];
                    }
                    if(checkGraph[1] === "Extension Fee"){
                        amt = amt + itemData[j][3];
                    }
                    if(checkGraph[1] === "Security Deposit"){
                        amt = amt + itemData[j][3];
                    }
                }
                graphOneData.push(amt);
            }
            
            // Setting Table Data
            // Table Data Application
            var columnData = [];
            var unchangeColumnData = [];
            // var rowData = data[0].reportResponses[0].reportData;
            for(var i=0; i<colData.length; i++){
                var dataItem = colData[i];
                var item ={};
                item["Header"] = this.camelize(dataItem.name);
                item["id"] = i.toString();
                item["accessor"] = i.toString();
                item["show"] = true;
                columnData.push(item);        
            }
            unchangeColumnData = columnData;

            this.setState({
                rowData: rowData,
                columnData: columnData,
                unchangeColumnData: unchangeColumnData,
            })

            return [ graphOneLabel, graphOneData, group ]
        }
        if(checkGraph[0] === "dashboard_2_Two"){
            var sortNo = null;
            // var rowData = data.reportResponses[0].reportData;
            // var colData = data.reportResponses[0].reportHeader;
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
        if(checkGraph[0] === "dashboard_2_Three"){
            var sortNo = null;
            // var rowData = data.reportResponses[0].reportData;
            // var colData = data.reportResponses[0].reportHeader;
            var group = data.reduce((r, a) => {
                r[a[sortBy]] = [...r[a[sortBy]] || [], a];
                return r;
                }, {});
    
            var graphOneLabel = Object.keys(group);
            var graphOneData = []
            for(var i=0; i<Object.keys(group).length ; i++){
                var item = group[graphOneLabel[i]];
                var total_due = 0;
                for(var j=0; j<item.length; j++){
                    total_due = total_due + item[j][11]; 
                }
                graphOneData.push(parseInt(total_due));
            }
            return [ graphOneLabel, graphOneData, group ]
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
        if(JSON.stringify(this.state.checkData) !== JSON.stringify(propsData)){

            // const dropdownSelected = "collectionReport";
            // const dropdownSelected = "dueReport";
            const dropdownSelected = propsData[1].reportSortBy.value
            var data = propsData[0];

            if(dropdownSelected === "collectionReport"){
                data = data.collectionReport;

                var graphOneLabel = ["Applications", "Property Rent", "Property Penalty",
                "Extension Fee", "Security Deposit"];
                
                var applications = data[0];
                var propertyRent = data[1];
                var propertyPenalty = data[2];
                var extensionFee = data[3];
                var secuityDeposit = data[4];

                var graphOneData = [applications.reportResponses[0].reportData.length, 
                propertyRent.reportResponses[0].reportData.length, propertyPenalty.reportResponses[0].reportData.length,
                extensionFee.reportResponses[0].reportData.length, secuityDeposit.reportResponses[0].reportData.length];
                
                var dataJSON = {
                    "Applications" : data[0],
                    "Property Rent" : data[1],
                    "Property Penalty":data[2],
                    "Extension Fee":data[3],
                    "Security Deposit":data[4]
                }

                // Table Data Application
                var columnDataApplication = [];
                var unchangeColumnDataApplication = [];
                var rowDataApplication = data[0].reportResponses[0].reportData;
                for(var i=0; i<data[0].reportResponses[0].reportHeader.length; i++){
                    var dataItem = data[0].reportResponses[0].reportHeader[i];
                    var item ={};
                    item["Header"] = this.camelize(dataItem.name);
                    item["id"] = i.toString();
                    item["accessor"] = i.toString();
                    item["show"] = true;
                    columnDataApplication.push(item);        
                }
                unchangeColumnDataApplication = columnDataApplication

                // Table Data PropertyRent
                var columnDataPropertyRent = [];
                var unchangeColumnDataPropertyRent = [];
                var rowDataPropertyRent = data[1].reportResponses[0].reportData;
                for(var i=0; i<data[1].reportResponses[0].reportHeader.length; i++){
                    var dataItem = data[1].reportResponses[0].reportHeader[i];
                    var item ={};
                    item["Header"] = this.camelize(dataItem.name);
                    item["id"] = i.toString();
                    item["accessor"] = i.toString();
                    item["show"] = true;
                    columnDataPropertyRent.push(item);        
                }
                unchangeColumnDataPropertyRent = columnDataPropertyRent

                // Table Data PropertyPenalty
                var columnDataPropertyPenalty = [];
                var unchangeColumnDataPropertyPenalty = [];
                var rowDataPropertyPenalty = data[2].reportResponses[0].reportData;
                for(var i=0; i<data[2].reportResponses[0].reportHeader.length; i++){
                    var dataItem = data[2].reportResponses[0].reportHeader[i];
                    var item ={};
                    item["Header"] = this.camelize(dataItem.name);
                    item["id"] = i.toString();
                    item["accessor"] = i.toString();
                    item["show"] = true;
                    columnDataPropertyPenalty.push(item);        
                }
                unchangeColumnDataPropertyPenalty = columnDataPropertyPenalty

                // Table Data ExtensionFee
                var columnDataExtensionFee = [];
                var unchangeColumnDataExtensionFee = [];
                var rowDataExtensionFee = data[3].reportResponses[0].reportData;
                for(var i=0; i<data[3].reportResponses[0].reportHeader.length; i++){
                    var dataItem = data[3].reportResponses[0].reportHeader[i];
                    var item ={};
                    item["Header"] = this.camelize(dataItem.name);
                    item["id"] = i.toString();
                    item["accessor"] = i.toString();
                    item["show"] = true;
                    columnDataExtensionFee.push(item);        
                }
                unchangeColumnDataExtensionFee = columnDataExtensionFee

                // Table Data SecurityDeposit
                var columnDataSecurityDeposit = [];
                var unchangeColumnDataSecurityDeposit = [];
                var rowDataSecurityDeposit = data[4].reportResponses[0].reportData;
                for(var i=0; i<data[4].reportResponses[0].reportHeader.length; i++){
                    var dataItem = data[4].reportResponses[0].reportHeader[i];
                    var item ={};
                    item["Header"] = this.camelize(dataItem.name);
                    item["id"] = i.toString();
                    item["accessor"] = i.toString();
                    item["show"] = true;
                    columnDataSecurityDeposit.push(item);        
                }
                unchangeColumnDataSecurityDeposit = columnDataSecurityDeposit

                this.setState({
                    dropdownSelected : dropdownSelected,
                    graphOneLabel : graphOneLabel,
                    graphOneData : graphOneData,
                    dataOne : dataJSON,
                    graphClicked : 0,
                    columnDataApplication : columnDataApplication,
                    unchangeColumnDataApplication : unchangeColumnDataApplication,
                    rowDataApplication : rowDataApplication,

                    columnDataPropertyRent : columnDataPropertyRent,
                    unchangeColumnDataPropertyRent : unchangeColumnDataPropertyRent,
                    rowDataPropertyRent : rowDataPropertyRent,
                    
                    columnDataPropertyPenalty : columnDataPropertyPenalty,
                    unchangeColumnDataPropertyPenalty : unchangeColumnDataPropertyPenalty,
                    rowDataPropertyPenalty : rowDataPropertyPenalty,

                    columnDataExtensionFee : columnDataExtensionFee,
                    unchangeColumnDataExtensionFee : unchangeColumnDataExtensionFee,
                    rowDataExtensionFee : rowDataExtensionFee,

                    columnDataSecurityDeposit : columnDataSecurityDeposit,
                    unchangeColumnDataSecurityDeposit : unchangeColumnDataSecurityDeposit,
                    rowDataSecurityDeposit : rowDataSecurityDeposit,
                })

            }
            if(dropdownSelected === "dueReport"){

                data = data.dueReport.reportResponses[0];
                var colData = data.reportHeader;
                var rowsData = data.reportData;

                var group = rowsData.reduce((r, a) => {
                    r[a[1]] = [...r[a[1]] || [], a];
                    return r;
                    }, {});
                
                var graphThirdLabel = Object.keys(group);
                var graphThirdData = [];
                for(var i=0; i<graphThirdLabel.length; i++){
                    graphThirdData.push(group[graphThirdLabel[i]].length);
                }

                var columnData = [];
                var unchangeColumnData = [];
                for(var i=0; i<colData.length; i++){
                    var dataItem = colData[i];
                    var item ={};
                    item["Header"] = this.camelize(dataItem.name);
                    item["id"] = i.toString();
                    item["accessor"] = i.toString();
                    item["show"] = true;
                    columnData.push(item);        
                }
                unchangeColumnData = columnData;

                this.setState({
                    dropdownSelected : dropdownSelected,
                    graphThirdLabel : graphThirdLabel,
                    graphThirdData : graphThirdData,
                    dataThird : group,
                    graphClicked : 0,
                    columnData : columnData,
                    unchangeColumnData : unchangeColumnData,
                    rowData : rowsData,
                })
            }

            this.setState({
                checkData : this.props.data
            })
        }
    }

    render() {
    

        // First Double Bar Graph Graph
        var graphOneSortedData = {
            labels: this.state.graphOneLabel,
            datasets: [
                {
                label: "Application",
                fill: false,
                lineTension: 0.1,
                hoverBorderWidth : 12,
                backgroundColor : ["#F77C15", "#385BC8", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
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
                text: "Collection Report Estate Dashboard"
            },
            // scales: {
            //     xAxes: [{
            //         gridLines: {
            //             display:true
            //         },
            //         scaleLabel: {
            //             display: true,
            //             labelString: "X LABEL"
            //             }, 
            //     }],
            //     yAxes: [{
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
            //             labelString: "Y LABEL"
            //             }, 
            //     }]
            // },
            plugins: {
                datalabels: {
                    display: false
                }
            },
            onClick: (e, element) => {
                if (element.length > 0) {
                    
                    debugger;
                    var ind = element[0]._index;   
                    const selectedVal = this.state.graphOneLabel[ind];
                    const data = this.state.dataOne[selectedVal];
                    debugger;
                    var graphData;
                    if(selectedVal === "Applications"){
                        graphData = this.graphSorting(0, data, ["dashboard_1_Two",selectedVal]);
                    }else{
                        graphData = this.graphSorting(1, data, ["dashboard_1_Two", selectedVal]);
                    }
    
                    this.setState({
                        graphTwoLabel : graphData[0],
                        graphTwoData:graphData[1],
                        dataTwo : graphData[2],
                        graphClicked : 1
                    })
    
                }
            },
        }
    
        // First Double Bar Graph Graph
        var graphTwoSortedData = {
            labels: this.state.graphTwoLabel,
            datasets: [
                {
                label: "Amount (INR)",
                fill: false,
                lineTension: 0.1,
                hoverBorderWidth : 12,
                backgroundColor : ["#F77C15", "#385BC8", "#FFC300", "#348AE4", "#FF5733",
                 "#9DC4E1", "#3A3B7F", "#0000FF", "#00FF00", "#FF0000", "#00FFFF", "#0000FF", "#FF00FF"],
                borderColor: "rgba(75,192,192,0.4)",
                borderCapStyle: "butt",
                barPercentage: 2,
                borderWidth: 5,
                barThickness: 25,
                maxBarThickness: 10,
                minBarLength: 2,
                data: this.state.graphTwoData
                }
            ]
        }
    
        var graphTwoOption = {
            responsive : true,
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
                text: "Application/Branch Typewise Collection Report Estate Dashboard"
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display:true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Application/Branch Type"
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
                        labelString: "Total Collection (INR)"
                        }, 
                }]
            },
            plugins: {
                datalabels: {
                    display: false
                }
            },
            onClick: (e, element) => {
                if (element.length > 0) {
                    
                    debugger;
                    var ind = element[0]._index;   
                    const selectedVal = this.state.graphTwoLabel[ind];
                    const data = this.state.dataTwo[selectedVal];
    
                    this.setState({
                        rowData : data
                    })
    
                }
            },
        }
    
    
        // Dropdown 2 Due Report
        // First Double Bar Graph Graph
        var graphThirdSortedData = {
            labels: this.state.graphThirdLabel,
            datasets: [
                {
                label: "Application",
                fill: false,
                lineTension: 0.1,
                hoverBorderWidth : 12,
                backgroundColor : ["#F77C15", "#385BC8", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
                borderColor: "rgba(75,192,192,0.4)",
                borderCapStyle: "butt",
                barPercentage: 2,
                borderWidth: 5,
                barThickness: 25,
                maxBarThickness: 10,
                minBarLength: 2,
                data: this.state.graphThirdData
                }
            ]
        }
    
        var graphThirdOption = {
            responsive : true,
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
                text: "Property Due Report Estate Dashboard"
            },
            // scales: {
            //     xAxes: [{
            //         gridLines: {
            //             display:true
            //         },
            //         scaleLabel: {
            //             display: true,
            //             labelString: "X LABEL"
            //             }, 
            //     }],
            //     yAxes: [{
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
            //             labelString: "Y LABEL"
            //             }, 
            //     }]
            // },
            plugins: {
                datalabels: {
                    display: false
                }
            },
            onClick: (e, element) => {
                if (element.length > 0) {
                    
                    debugger;
                    var ind = element[0]._index;   
                    const selectedVal = this.state.graphThirdLabel[ind];
                    const data = this.state.dataThird[selectedVal];
                    debugger;
                    var graphData;
                    graphData = this.graphSorting(2, data, ["dashboard_2_Two",selectedVal]);
                    
                    this.setState({
                        graphFourthLabel : graphData[0],
                        graphFourthData:graphData[1],
                        dataFourth : graphData[2],
                        graphClicked : 1,
                        rowData : data
                    })
    
                }
            },
        }
        
        var graphFourthSortedData = {
            labels: this.state.graphFourthLabel,
            datasets: [
                {
                label: "Application",
                fill: false,
                lineTension: 0.1,
                hoverBorderWidth : 12,
                backgroundColor : ["#F77C15", "#385BC8", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
                borderColor: "rgba(75,192,192,0.4)",
                borderCapStyle: "butt",
                barPercentage: 2,
                borderWidth: 5,
                barThickness: 25,
                maxBarThickness: 10,
                minBarLength: 2,
                data: this.state.graphFourthData
                }
            ]
        }
    
        var graphFourthOption = {
            responsive : true,
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
                text: "Poperty Typewise Due Report"
            },
            // scales: {
            //     xAxes: [{
            //         gridLines: {
            //             display:true
            //         },
            //         scaleLabel: {
            //             display: true,
            //             labelString: "X LABEL"
            //             }, 
            //     }],
            //     yAxes: [{
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
            //             labelString: "Y LABEL"
            //             }, 
            //     }]
            // },
            plugins: {
                datalabels: {
                    display: false
                }
            },
            onClick: (e, element) => {
                if (element.length > 0) {
                    
                    debugger;
                    var ind = element[0]._index;   
                    const selectedVal = this.state.graphThirdLabel[ind];
                    const data = this.state.dataThird[selectedVal];
                    debugger;
                    var graphData;
                    graphData = this.graphSorting(3, data, ["dashboard_2_Three",selectedVal]);
                    
                    this.setState({
                        graphFifthLabel : graphData[0],
                        graphFifthData:graphData[1],
                        dataFifth : graphData[2],
                        graphClicked : 2,
                        rowData : data
                    })
    
                }
            },
        }
    
        var graphFifthSortedData = {
            labels: this.state.graphFifthLabel,
            datasets: [
                {
                label: "Total Due",
                fill: false,
                lineTension: 0.1,
                hoverBorderWidth : 12,
                backgroundColor : ["#F77C15", "#385BC8", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
                borderColor: "rgba(75,192,192,0.4)",
                borderCapStyle: "butt",
                barPercentage: 2,
                borderWidth: 5,
                barThickness: 25,
                maxBarThickness: 10,
                minBarLength: 2,
                data: this.state.graphFifthData
                }
            ]
        }
    
        var graphFifthOption = {
            responsive : true,
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
                text: "Sectorwise Property Estate Due Report"
            },
            // scales: {
            //     xAxes: [{
            //         gridLines: {
            //             display:true
            //         },
            //         scaleLabel: {
            //             display: true,
            //             labelString: "X LABEL"
            //             }, 
            //     }],
            //     yAxes: [{
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
            //             labelString: "Y LABEL"
            //             }, 
            //     }]
            // },
            plugins: {
                datalabels: {
                    display: false
                }
            },
            onClick: (e, element) => {
                if (element.length > 0) {
                    
                    debugger;
                    var ind = element[0]._index;   
                    const selectedVal = this.state.graphFifthLabel[ind];
                    const data = this.state.dataFifth[selectedVal];
                    debugger;
                    var graphData;                
                    this.setState({
                        // graphTwoLabel : graphData[0],
                        // graphTwoData:graphData[1],
                        // dataTwo : graphData[2],
                        graphClicked : 3,
                        rowData : data
                    })
    
                }
            },
        }
        
            
        return (
            <div style={this.state.graphClicked < 0 ? {display:"none"} :null}>            
            <div style={ this.state.dropdownSelected === "dueReport" || this.state.dropdownSelected === "" ? {display:"none"} : null}>
            <div className="graphDashboard">
            
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
            
    
            {/* Table Feature  */}
            <div style={this.state.graphClicked > 0 ?
             {display :"none"} :null}>
                    {/* All Data Table Application  */}
                    <div className="tableContainerEstate">
                    <div className="tanleTitle"> Application Collection Report Data </div>
                    {
                        this.state.unchangeColumnDataApplication.length > 0  ? 
                        <div className="tableFeature">
                            <div className="columnToggle-Text"> Download As: </div>
                            <button className="columnToggleBtn" onClick={this.pdfDownload}> PDF </button>
    
                            {/* <button className="columnToggleBtn" onClick={this.toggleColumn}> Column Visibility </button> */}
                        </div>
                        :null
                    }
                    {
                        // this.state.graphClicked >= 1 ?
                        <ReactTable id="customReactTable"
                        // PaginationComponent={Pagination}
                        data={ this.state.rowDataApplication }  
                        columns={ this.state.columnDataApplication }  
                        defaultPageSize = {this.state.rowDataApplication.length > 10 ? 10 : this.state.rowDataApplication.length}
                        pageSize={this.state.rowDataApplication.length > 10 ? 10 : this.state.rowDataApplication.length}  
                        pageSizeOptions = {[20,40,60]}  
                        /> 
                        // :null
                    }
                    </div>
                    
                    {/* All Data Table PropertyRent  */}
                    <div className="tableContainerEstate">
                    <div className="tanleTitle"> Property Rent Collection Report Data </div>
                    {
                        this.state.unchangeColumnDataPropertyRent.length > 0  ? 
                        <div className="tableFeature">
                            {/* <div className="columnToggle-Text"> Download As: </div> */}
                            {/* <button className="columnToggleBtn" onClick={this.pdfDownload}> PDF </button> */}
    
                            {/* <button className="columnToggleBtn" onClick={this.toggleColumn}> Column Visibility </button> */}
                        </div>
                        :null
                    }
                    {
                        // this.state.graphClicked >= 1 ?
                        <ReactTable id="customReactTable"
                        // PaginationComponent={Pagination}
                        data={ this.state.rowDataPropertyRent }  
                        columns={ this.state.columnDataPropertyRent }  
                        defaultPageSize = {this.state.rowDataPropertyRent.length > 10 ? 10 : this.state.rowDataPropertyRent.length}
                        pageSize={this.state.rowDataPropertyRent.length > 10 ? 10 : this.state.rowDataPropertyRent.length}  
                        pageSizeOptions = {[20,40,60]}  
                        /> 
                        // :null
                    }
                    </div>
    
                    {/* All Data Table PropertyPenalty  */}
                    <div className="tableContainerEstate">
                    <div className="tanleTitle"> PropertyPenalty Collection Report Data </div>
                    {
                        this.state.unchangeColumnDataPropertyPenalty.length > 0  ? 
                        <div className="tableFeature">
                            {/* <div className="columnToggle-Text"> Download As: </div>
                            <button className="columnToggleBtn" onClick={this.pdfDownload}> PDF </button> */}
    
                            {/* <button className="columnToggleBtn" onClick={this.toggleColumn}> Column Visibility </button> */}
                        </div>
                        :null
                    }
                    {
                        // this.state.graphClicked >= 1 ?
                        <ReactTable id="customReactTable"
                        // PaginationComponent={Pagination}
                        data={ this.state.rowDataPropertyPenalty }  
                        columns={ this.state.columnDataPropertyPenalty }  
                        defaultPageSize = {this.state.rowDataPropertyPenalty.length > 10 ? 10 : this.state.rowDataPropertyPenalty.length}
                        pageSize={this.state.rowDataPropertyPenalty.length > 10 ? 10 : this.state.rowDataPropertyPenalty.length}  
                        pageSizeOptions = {[20,40,60]}  
                        /> 
                        // :null
                    }
                    </div>
    
                    {/* All Data Table ExtensionFee  */}
                    <div className="tableContainerEstate">
                    <div className="tanleTitle"> ExtensionFee Collection Report Data </div>
                    {
                        this.state.unchangeColumnDataExtensionFee.length > 0  ? 
                        <div className="tableFeature">
                            {/* <div className="columnToggle-Text"> Download As: </div>
                            <button className="columnToggleBtn" onClick={this.pdfDownload}> PDF </button> */}
    
                            {/* <button className="columnToggleBtn" onClick={this.toggleColumn}> Column Visibility </button> */}
                        </div>
                        :null
                    }
                    {
                        // this.state.graphClicked >= 1 ?
                        <ReactTable id="customReactTable"
                        // PaginationComponent={Pagination}
                        data={ this.state.rowDataExtensionFee }  
                        columns={ this.state.columnDataExtensionFee }  
                        defaultPageSize = {this.state.rowDataExtensionFee.length > 10 ? 10 : this.state.rowDataExtensionFee.length}
                        pageSize={this.state.rowDataExtensionFee.length > 10 ? 10 : this.state.rowDataExtensionFee.length}  
                        pageSizeOptions = {[20,40,60]}  
                        /> 
                        // :null
                    }
                    </div>
    
                    {/* All Data Table SecurityDeposit  */}
                    <div className="tableContainerEstate">
                    <div className="tanleTitle"> SecurityDeposit Collection Report Data </div>
                    {
                        this.state.unchangeColumnDataSecurityDeposit.length > 0  ? 
                        <div className="tableFeature">
                            {/* <div className="columnToggle-Text"> Download As: </div>
                            <button className="columnToggleBtn" onClick={this.pdfDownload}> PDF </button> */}
    
                            {/* <button className="columnToggleBtn" onClick={this.toggleColumn}> Column Visibility </button> */}
                        </div>
                        :null
                    }
                    {
                        // this.state.graphClicked >= 1 ?
                        <ReactTable id="customReactTable"
                        // PaginationComponent={Pagination}
                        data={ this.state.rowDataSecurityDeposit }  
                        columns={ this.state.columnDataSecurityDeposit }  
                        defaultPageSize = {this.state.rowDataSecurityDeposit.length > 10 ? 10 : this.state.rowDataSecurityDeposit.length}
                        pageSize={this.state.rowDataSecurityDeposit.length > 10 ? 10 : this.state.rowDataSecurityDeposit.length}  
                        pageSizeOptions = {[20,40,60]}  
                        /> 
                        // :null
                    }
                    </div>
            </div>
    
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
                this.state.graphClicked >= 1 ?
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
            
            <div style={ this.state.dropdownSelected === "collectionReport" ? {display:"none"} : null}>
            <div className="graphDashboard">
            
            {
                this.state.graphClicked >= 0 ?
                <CardContent className="halfGraph">
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
                this.state.graphClicked > 0 ?
                <CardContent className="halfGraph">
                    <React.Fragment>
                        <Pie
                        data={ graphFourthSortedData } 
                        options={ graphFourthOption } 
                        />
                    </React.Fragment>
                </CardContent> 
                :null
            }
    
            </div>

            <div className="graphDashboard" style={this.state.graphClicked > 1 ? null : {display:"none"}}>
            {
                this.state.graphClicked > 1 ?
                <CardContent className="fullGraph">
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
            </div>
        );
        }
}

export default DashboardEstate;
import React, { Component } from "react";
import { Doughnut, Bar, HorizontalBar, Line, Pie } from 'react-chartjs-2';
import CardContent from '@material-ui/core/CardContent';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css" ;
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import './storeDashboard.css';

class DashboardStoreManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            title : "",
            selectedDropdown : "",
            checkData : [],
            dropdownSelectedGraph: "",
            sortByJSON : null,
            graphClicked : -1,
            rowData : [],
            columnData : [],
            unchangeColumnData: [],
            oneData : [],
            graphOneLabel : [],
            graphOneData : [],
            twoData : [],
            graphTwoLabel : [],
            graphTwoData : [],
            thirdData : [],
            graphThirdLabel : [],
            graphThirdData : [],
            fourthData : [],
            graphFourthLabel : [],
            graphFourthData : [],
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

    doc.text("Chandigarh Application", pageWidth / 2, 20, 'center');

    doc.setFontSize(10);
    const pdfTitle = this.state.title ? this.state.title+"Dashboard Report" : "Store Dashboard Report"
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
    
    graphSorting = ( sortBy, data, sortByJSON ) => {

        if(sortBy === "Material Received at Store"){
            var allData = data.MaterialReceipt;
            var receiptDetails = [];
            var sortedJSONData = []; 
            for(var i=0; i<allData.length; i++){
                const status = allData[i].mrnStatus;
                // receiptDetails.push(allData[i].receiptDetails);
                for(var j=0; j<allData[i].receiptDetails.length; j++){
                    var receiprId = allData[i].receiptDetails[j].id;
                    var materialCode = allData[i].receiptDetails[j].material.code;
                    var materialName = allData[i].receiptDetails[j].material.name;
                    var receivedQty = allData[i].receiptDetails[j].receivedQty;
                    var receiptStatus = status;
                    var demo = {};
                    demo["receiprId"] = receiprId;
                    demo["materialCode"] = materialCode;
                    demo["materialName"] = materialName;
                    demo["receivedQty"] = receivedQty;
                    demo["receiptStatus"] = receiptStatus;
                    sortedJSONData.push(demo);
                }
            }


            var group = sortedJSONData.reduce((r, a) => {
                r[a["materialName"]] = [...r[a["materialName"]] || [], a];
                return r;
                }, {});
            
            var graphLabel = Object.keys(group);
            var graphData = [];
            
            for(var i=0; i<graphLabel.length; i++){
                var totalQty = 0;
                var material = group[graphLabel[i]];
                for(var j=0; j<material.length; j++){
                    var qty = 0;
                    totalQty = totalQty + material[j].receivedQty;
                }
                graphData.push(totalQty);
            }

            // Table Data 
            var headerData = [];

            for(var i=0; i<Object.keys(sortedJSONData[0]).length; i++){
                var itemHeader = {}
                itemHeader["Header"] = this.camelize(Object.keys(sortedJSONData[0])[i]);
                itemHeader["accessor"] = Object.keys(sortedJSONData[0])[i];
                itemHeader["show"]= true ;
                headerData.push(itemHeader);
            }

            var rowData = sortedJSONData;

            this.setState({
                oneData : group,
                graphOneLabel : graphLabel,
                graphOneData : graphData,
                columnData : headerData,
                unchangeColumnData : headerData,
                rowData : rowData,
                sortByJSON : sortByJSON,
            })

        }if(sortBy === "receiptStatusDashboard1"){
            var data = data;

            var group = data.reduce((r, a) => {
                r[a["receiptStatus"]] = [...r[a["receiptStatus"]] || [], a];
                return r;
                }, {});
            
            var graphLabel = Object.keys(group);
            var graphData = [];
            var sortedJSONData = [];
            
            for(var i=0; i<graphLabel.length; i++){
                var totalQty = 0;
                var material = group[graphLabel[i]];
                for(var j=0; j<material.length; j++){
                    var qty = 0;
                    totalQty = totalQty + material[j].receivedQty;
                    sortedJSONData.push(group[graphLabel[i]][j]);
                }
                graphData.push(totalQty);
                // sortedJSONData.push(group[graphLabel[i]]);
            }

            // Table Data 
            var headerData = [];
             
            for(var i=0; i<Object.keys(sortedJSONData[0]).length; i++){
                var itemHeader = {}
                itemHeader["Header"] = this.camelize(Object.keys(sortedJSONData[0])[i]);
                itemHeader["accessor"] = Object.keys(sortedJSONData[0])[i];
                itemHeader["show"]= true ;
                headerData.push(itemHeader);
            }

            var rowData = sortedJSONData;

            this.setState({
                twoData : group,
                graphTwoLabel : graphLabel,
                graphTwoData : graphData,
                columnData : headerData,
                unchangeColumnData : headerData,
                rowData : rowData,
                sortByJSON : sortByJSON
            })

        }if(sortBy === "receiptStatusDashboard2"){
            var data = data;

            var group = data.reduce((r, a) => {
                r[a["receiptStatus"]] = [...r[a["receiptStatus"]] || [], a];
                return r;
                }, {});
            
            var graphLabel = Object.keys(group);
            var graphData = [];
            var sortedJSONData = [];
            
            for(var i=0; i<graphLabel.length; i++){
                var totalQty = 0;
                var material = group[graphLabel[i]];
                for(var j=0; j<material.length; j++){
                    var qty = 0;
                    totalQty = totalQty + material[j].quantityIssued;
                    sortedJSONData.push(group[graphLabel[i]][j]);
                }
                graphData.push(totalQty);
                // sortedJSONData.push(group[graphLabel[i]]);
            }

            // Table Data 
            var headerData = [];
             
            for(var i=0; i<Object.keys(sortedJSONData[0]).length; i++){
                var itemHeader = {}
                itemHeader["Header"] = this.camelize(Object.keys(sortedJSONData[0])[i]);
                itemHeader["accessor"] = Object.keys(sortedJSONData[0])[i];
                itemHeader["show"]= true ;
                headerData.push(itemHeader);
            }

            var rowData = sortedJSONData;

            this.setState({
                twoData : group,
                graphTwoLabel : graphLabel,
                graphTwoData : graphData,
                columnData : headerData,
                unchangeColumnData : headerData,
                rowData : rowData,
                sortByJSON : sortByJSON,
                title: sortByJSON[1].title
            })

        }if(sortBy === "Material Issued from Store"){
            var allData = data.materialIssues;
            var receiptDetails = [];
            var sortedJSONData = []; 
            for(var i=0; i<allData.length; i++){
                const status = allData[i].materialIssueStatus;
                // receiptDetails.push(allData[i].receiptDetails);
                for(var j=0; j<allData[i].materialIssueDetails.length; j++){
                    var receiprId = allData[i].materialIssueDetails[j].id;
                    var materialCode = allData[i].materialIssueDetails[j].material.code;
                    var materialName = allData[i].materialIssueDetails[j].material.name;
                    var quantityIssued = allData[i].materialIssueDetails[j].quantityIssued;
                    var receiptStatus = status;
                    var department = allData[i]["fromStore"]["department"]["name"];
                    var demo = {};
                    demo["receiprId"] = receiprId;
                    demo["materialCode"] = materialCode;
                    demo["materialName"] = materialName;
                    demo["quantityIssued"] = quantityIssued;
                    demo["receiptStatus"] = receiptStatus;
                    demo["department"] = department;
                    sortedJSONData.push(demo);
                }
            }


            var group = sortedJSONData.reduce((r, a) => {
                r[a["materialName"]] = [...r[a["materialName"]] || [], a];
                return r;
                }, {});
            
            var graphLabel = Object.keys(group);
            var graphData = [];
            
            for(var i=0; i<graphLabel.length; i++){
                var totalQty = 0;
                var material = group[graphLabel[i]];
                for(var j=0; j<material.length; j++){
                    var qty = 0;
                    totalQty = totalQty + material[j].quantityIssued;
                }
                graphData.push(totalQty);
            }

            // Table Data 
            var headerData = [];

            for(var i=0; i<Object.keys(sortedJSONData[0]).length; i++){
                var itemHeader = {}
                itemHeader["Header"] = this.camelize(Object.keys(sortedJSONData[0])[i]);
                itemHeader["accessor"] = Object.keys(sortedJSONData[0])[i];
                itemHeader["show"]= true ;
                headerData.push(itemHeader);
            }

            var rowData = sortedJSONData;

            this.setState({
                oneData : group,
                graphOneLabel : graphLabel,
                graphOneData : graphData,
                columnData : headerData,
                unchangeColumnData : headerData,
                rowData : rowData,
                sortByJSON : sortByJSON
            })

        }if(sortBy === "Storewise Department Requisition"){
            // Opening Balance Graph Data
            var openBalanceAllData = data.OpenBalance.printData.OpeningBalanceReport[0].balanceDetails;
            var sortedJSONData = []; 
            for(var i=0; i<openBalanceAllData.length; i++){
                var materialName = openBalanceAllData[i].materialName;
                var totalAmount = openBalanceAllData[i].totalAmount;
                var quantity = openBalanceAllData[i].quantity;
                var materialType = openBalanceAllData[i].materialType;
                var materialCode = openBalanceAllData[i].materialCode;
                var unitRate = openBalanceAllData[i].unitRate;

                var demo = {};
                demo["materialName"] = materialName;
                demo["totalAmount"] = totalAmount;
                demo["quantity"] = quantity;
                demo["materialType"] = materialType;
                demo["receiptStatus"] = materialCode;
                demo["unitRate"] = unitRate;
                sortedJSONData.push(demo);    
            }


            var group1 = sortedJSONData.reduce((r, a) => {
                r[a["materialType"]] = [...r[a["materialType"]] || [], a];
                return r;
                }, {});
            
            var graphLabel = Object.keys(group1);
            var graphData1 = [];
            
            for(var i=0; i<graphLabel.length; i++){
                var totalQty = 0;
                var material = group1[graphLabel[i]];
                for(var j=0; j<material.length; j++){
                    var qty = 0;
                    totalQty = totalQty + material[j].totalAmount;
                }
                graphData1.push(totalQty);
            }

            // Table Data 
            var headerData = [];

            for(var i=0; i<Object.keys(sortedJSONData[0]).length; i++){
                var itemHeader = {}
                itemHeader["Header"] = this.camelize(Object.keys(sortedJSONData[0])[i]);
                itemHeader["accessor"] = Object.keys(sortedJSONData[0])[i];
                itemHeader["show"]= true ;
                headerData.push(itemHeader);
            }

            var rowData1 = sortedJSONData;

            // Closing Balance Graph Data
            var closeBalanceAllData = data.CloseBalance.printData.OpeningBalanceReport[0].balanceDetails;
            var sortedJSONData = []; 
            for(var i=0; i<closeBalanceAllData.length; i++){
                var materialName = closeBalanceAllData[i].materialName;
                var totalAmount = closeBalanceAllData[i].totalAmount;
                var quantity = closeBalanceAllData[i].quantity;
                var materialType = closeBalanceAllData[i].materialType;
                var materialCode = closeBalanceAllData[i].materialCode;
                var unitRate = closeBalanceAllData[i].unitRate;

                var demo = {};
                demo["materialName"] = materialName;
                demo["totalAmount"] = totalAmount;
                demo["quantity"] = quantity;
                demo["materialType"] = materialType;
                demo["receiptStatus"] = materialCode;
                demo["unitRate"] = unitRate;
                sortedJSONData.push(demo);    
            }


            var group2 = sortedJSONData.reduce((r, a) => {
                r[a["materialType"]] = [...r[a["materialType"]] || [], a];
                return r;
                }, {});
            
            var graphLabel = Object.keys(group2);
            var graphData2 = [];
            
            for(var i=0; i<graphLabel.length; i++){
                var totalQty = 0;
                var material = group2[graphLabel[i]];
                for(var j=0; j<material.length; j++){
                    var qty = 0;
                    totalQty = totalQty + material[j].totalAmount;
                }
                graphData2.push(totalQty);
            }

            // Table Data 
            var headerData = [];

            for(var i=0; i<Object.keys(sortedJSONData[0]).length; i++){
                var itemHeader = {}
                itemHeader["Header"] = this.camelize(Object.keys(sortedJSONData[0])[i]);
                itemHeader["accessor"] = Object.keys(sortedJSONData[0])[i];
                itemHeader["show"]= true ;
                headerData.push(itemHeader);
            }

            var rowData2 = sortedJSONData;


            // Both graphData
            var bothGraphData = [graphData1, graphData2];
            var bothData = [group1, group2];
            var allRowData = rowData1.concat(rowData2);

            this.setState({
                thirdData : bothData,
                graphThirdLabel : graphLabel,
                graphThirdData : bothGraphData,
                columnData : headerData,
                unchangeColumnData : headerData,
                rowData : allRowData,
                sortByJSON : sortByJSON
            })

        }if(sortBy === "itemwiseBalanceReportDashboard3"){
            // Opening Balance Report
            var data1 = data[0];

            var group1 = data1.reduce((r, a) => {
                r[a["materialName"]] = [...r[a["materialName"]] || [], a];
                return r;
                }, {});
            
            var graphLabel = Object.keys(group1);
            var graphData1 = [];
            var sortedJSONData = [];
            
            for(var i=0; i<graphLabel.length; i++){
                var totalQty = 0;
                var material = group1[graphLabel[i]];
                for(var j=0; j<material.length; j++){
                    var qty = 0;
                    totalQty = totalQty + material[j].totalAmount;
                    sortedJSONData.push(group1[graphLabel[i]][j]);
                }
                graphData1.push(totalQty);
                // sortedJSONData.push(group[graphLabel[i]]);
            }

            // Table Data 
            var headerData = [];
             
            if(data1.length > 0){
                for(var i=0; i<Object.keys(sortedJSONData[0]).length; i++){
                    var itemHeader = {}
                    itemHeader["Header"] = this.camelize(Object.keys(sortedJSONData[0])[i]);
                    itemHeader["accessor"] = Object.keys(sortedJSONData[0])[i];
                    itemHeader["show"]= true ;
                    headerData.push(itemHeader);
                }
            }

            var rowData1 = sortedJSONData;

            // Cloisng Balance Report
            var data2 = data[1];

            var group2 = data2.reduce((r, a) => {
                r[a["materialName"]] = [...r[a["materialName"]] || [], a];
                return r;
                }, {});
            
            var graphLabel = Object.keys(group2);
            var graphData2 = [];
            var sortedJSONData = [];
            
            for(var i=0; i<graphLabel.length; i++){
                var totalQty = 0;
                var material = group2[graphLabel[i]];
                for(var j=0; j<material.length; j++){
                    var qty = 0;
                    totalQty = totalQty + material[j].totalAmount;
                    sortedJSONData.push(group2[graphLabel[i]][j]);
                }
                graphData2.push(totalQty);
                // sortedJSONData.push(group[graphLabel[i]]);
            }

            // Table Data 
            var headerData = [];
                
            if(data2.length > 0){
                for(var i=0; i<Object.keys(sortedJSONData[0]).length; i++){
                    var itemHeader = {}
                    itemHeader["Header"] = this.camelize(Object.keys(sortedJSONData[0])[i]);
                    itemHeader["accessor"] = Object.keys(sortedJSONData[0])[i];
                    itemHeader["show"]= true ;
                    headerData.push(itemHeader);
                }
            }

            var rowData2 = sortedJSONData;

            // Both graphData
            var bothGraphData = [group1, group2];
            var bothData = [graphData1, graphData2];
            var allRowData = rowData1.concat(rowData2)

            this.setState({
                fourthData : bothGraphData,
                graphFourthLabel : graphLabel,
                graphFourthData : bothData,
                columnData : headerData,
                unchangeColumnData : headerData,
                rowData : allRowData,
                sortByJSON : sortByJSON
            })
        }
        else{
            
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

    componentDidMount(){
        const respData = this.props.data;
        if(JSON.stringify(this.state.checkData) !== JSON.stringify(respData)){
            const selectedDropdown = respData[1].reportSortBy.value;
            this.setState({
                selectedDropdown : selectedDropdown,
                checkData : respData
            }) 
        }
    }
    componentDidUpdate(){
        const respData = this.props.data;
        if(JSON.stringify(this.state.checkData) !== JSON.stringify(respData)){
            const selectedDropdown = respData[1].reportSortBy.value;
            
            // const dropdownStore = "Kumar Store";// API data from this store
            const dropdownSelectedGraph = selectedDropdown;
            // const dropdownSelectedGraph = "Material Received at Store";
            // const dropdownSelectedGraph= "Material Issued from Store";
            // const dropdownSelectedGraph= "Storewise Department Requisition";
            
            var hardJSON ={
                "Material Received at Store" : [
                    {
                        "msgX":"Items",
                        "msgY":"No of Quantity",
                        "title":"Material Received at Store",
                        "sortBy":"Material Received at Store"
                    },
                    {
                        "msgX":"Status of an Item",
                        "msgY":"No of Quantity",
                        "title":"Statuswise Material Received at Store",
                        "sortBy":"receiptStatusDashboard1"
                    }],
                "Material Issued from Store" : [
                    {
                        "msgX":"Items",
                        "msgY":"No of Quantity",
                        "title":"Material Issued from Store",
                        "sortBy":"Material Issued from Store"
                    },
                    {
                        "msgX":"Status of an Item",
                        "msgY":"No of Quantity",
                        "title":"Statuswise Material Issued from Store",
                        "sortBy":"receiptStatusDashboard2"
                    }
                ],
                "Storewise Department Requisition" : [
                    {
                        "msgX":"Departments",
                        "msgY":"Amount in Rs.",
                        "title":"Opening/Closing Balance Report",
                        "sortBy":"Material Issued from Store"
                    },
                    {
                        "msgX":"Items",
                        "msgY":"Amount in Rs.",
                        "title":"Departmentwise Opening/Closing Balance Report",
                        "sortBy":"itemwiseBalanceReportDashboard3"
                    }
                ]
            }

            var sortByJSON = hardJSON[dropdownSelectedGraph];

            var data = respData[0]
            // if(dropdownSelectedGraph === "Material Received at Store"){
            //     data = MRNData;
            // }
            // if(dropdownSelectedGraph === "Material Issued from Store"){
            //     data = IndentIssueData;
            // }
            // if(dropdownSelectedGraph === "Storewise Department Requisition"){
            //     data = OpenCloseBalData;
            // }
            const sortedData = this.graphSorting( dropdownSelectedGraph, data, sortByJSON );
            this.setState({
                title : sortByJSON[0].title,
                dropdownSelectedGraph : dropdownSelectedGraph
            })
            
            this.setState({
                selectedDropdown : selectedDropdown,
                checkData : respData,
                graphClicked : 0,
                title : selectedDropdown
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
            label:  "Label",
            fill: false,
            lineTension: 0.1,
            hoverBorderWidth : 12,
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
        aspectRatio : 3,
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
            text: this.state.sortByJSON ? this.state.sortByJSON[0].title : ""
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display:true
                },
                scaleLabel: {
                    display: true,
                    labelString: this.state.sortByJSON ? this.state.sortByJSON[0].msgX : ""
                    }, 
            }],
            yAxes: [{
                gridLines: {
                    display:true
                },
                ticks: {
                    // suggestedMin: 0,
                    // suggestedMax: 100,
                    beginAtZero: true,
                    // stepSize: 1
                },
                scaleLabel: {
                    display: true,
                    labelString: this.state.sortByJSON ? this.state.sortByJSON[0].msgY : ""
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
                var ind = element[0]._index;   
                const selectedVal = this.state.graphOneLabel[ind];
                const sortedData = this.graphSorting( this.state.sortByJSON[1].sortBy, this.state.oneData[selectedVal], this.state.sortByJSON );
                this.setState({
                    graphClicked : 1
                })
            }
        },
        }

        // Second Horizontal Graph
        var graphTwoSortedData = {
        labels: this.state.graphTwoLabel,
        // labels: ["Label 1", "Label 2"],
        datasets: [
            {
            label: "Label 1",
            fill: false,
            lineTension: 5,
            hoverBorderWidth : 12,
            backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
            borderColor: "rgba(75,192,192,0.4)",
            borderCapStyle: "butt",
            barPercentage: 2,
            barThickness: 25,
            maxBarThickness: 25,
            minBarLength: 2,
            data: this.state.graphTwoData
            // data: [10,20,30]
            }
        ]
        }

        var graphTwoOption = {
        responsive : true,
        aspectRatio : 3,
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
            text: this.state.sortByJSON ? this.state.sortByJSON[1].title : ""
        },
        onClick: (e, element) => {
            if (element.length > 0) {
                var ind = element[0]._index;
                const selectedVal = this.state.graphTwoLabel[ind];
                const data = this.state.twoData[selectedVal];
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
                    // suggestedMin: 0,
                    // suggestedMax: 100,
                    // beginAtZero: true,
                    // stepSize: 1
                },
                scaleLabel: {
                    display: true,
                    labelString: this.state.sortByJSON ? this.state.sortByJSON[1].msgX : ""
                    }, 
            }],
            yAxes: [{
                gridLines: {
                    display: true
                },
                ticks: {
                    // suggestedMin: 0,
                    beginAtZero: true,
                    // stepSize: 1
                },
                scaleLabel: {
                    display: true,
                    labelString: this.state.sortByJSON ? this.state.sortByJSON[1].msgY : ""
                    }, 
            }]
        },
        plugins: {
            datalabels: {
                display: false
            }
        }
        }

        // Opening/Closing Balance
        var balanceReportData = {
            labels: this.state.graphThirdLabel,
            // labels: ["Label 1", "Label 2", "Label 3"],
            datasets: [
                {
                label: "Opening Balance Report",
                fill: false,
                lineTension: 5,
                hoverBorderWidth : 12,
                backgroundColor : ["#F77C15", "#F77C15", "#F77C15", "#F77C15", "#F77C15", "#F77C15", "#F77C15", "#F77C15"],
                borderColor: "rgba(75,192,192,0.4)",
                borderCapStyle: "butt",
                barPercentage: 2,
                borderWidth: 2,
                barThickness: 25,
                maxBarThickness: 15,
                minBarLength: 2,
                data: this.state.graphThirdData[0]
                // data: [10,20,30]
                },
                {
                label: "Closing Balance Report",
                fill: false,
                lineTension: 5,
                hoverBorderWidth : 12,
                backgroundColor : ["#385BC8", "#385BC8", "#385BC8"],
                borderColor: "rgba(75,192,192,0.4)",
                borderCapStyle: "butt",
                barPercentage: 20.0,
                borderWidth: 2,
                barThickness: 25,
                maxBarThickness: 15,
                minBarLength: 2,
                data: this.state.graphThirdData[1]
                // data: [50,60,30]
                }
            ]
            };
        var balanceReportOption = {
            responsive : true,
            aspectRatio : 3,
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
                text: this.state.sortByJSON ? this.state.sortByJSON[0].title : "Open/Close Balance Report"
            },
            onClick: (e, element) => {
                if (element.length > 0) {

                    var ind = element[0]._index;   
                    const selectedVal = this.state.graphThirdLabel[ind];
                    var openBalance = this.state.thirdData[0][selectedVal] ? this.state.thirdData[0][selectedVal] : [];
                    var closeBalance = this.state.thirdData[1][selectedVal] ? this.state.thirdData[1][selectedVal] : [];
                    const sortedData = this.graphSorting( this.state.sortByJSON[1].sortBy, [openBalance,closeBalance], this.state.sortByJSON );
                    this.setState({
                        graphClicked : 1
                    })
                }
            },
            scales: {
                xAxes: [{
                    // barPercentage: 0.9,
                    // categoryPercentage: 0.55,
                    gridLines: {
                        display:true
                    },
                    ticks: {
                        // suggestedMin: 0,
                        // suggestedMax: 100,
                        // beginAtZero: true,
                        // stepSize: 1
                    },
                    scaleLabel: {
                        display: true,
                        labelString: this.state.sortByJSON ? this.state.sortByJSON[0].msgX : "Departments"
                        }, 
                }],
                yAxes: [{
                    gridLines: {
                        display: true
                    },
                    ticks: {
                        // suggestedMin: 0,
                        beginAtZero: true,
                        // stepSize: 1
                    },
                    scaleLabel: {
                        display: true,
                        labelString: this.state.sortByJSON ? this.state.sortByJSON[0].msgY : "Amount"
                        }, 
                }]
            },
            plugins: {
                datalabels: {
                    display: false
                }
            }
            }

        var departmentBalanceReportData = {
            labels: this.state.graphFourthLabel,
            // labels: ["Label 1", "Label 2", "Label 3"],
            datasets: [
                {
                label: "Opening Balance Report",
                fill: false,
                lineTension: 5,
                hoverBorderWidth : 12,
                backgroundColor : ["#F77C15", "#F77C15", "#F77C15",],
                borderColor: "rgba(75,192,192,0.4)",
                borderCapStyle: "butt",
                barPercentage: 20.0,
                borderWidth: 2,
                barThickness: 25,
                maxBarThickness: 15,
                minBarLength: 2,
                data: this.state.graphFourthData[0]
                // data: [10,20,30]
                },
                {
                label: "Closing Balance Report",
                fill: false,
                lineTension: 5,
                hoverBorderWidth : 12,
                backgroundColor : ["#385BC8", "#385BC8", "#385BC8"],
                borderColor: "rgba(75,192,192,0.4)",
                borderCapStyle: "butt",
                barPercentage: 20.0,
                borderWidth: 2,
                barThickness: 25,
                maxBarThickness: 15,
                minBarLength: 2,
                data: this.state.graphFourthData[1]
                // data: [50,60,30]
                }
            ]
            };
        var departmentBalanceReportOption = {
            responsive : true,
            aspectRatio : 3,
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
                text: this.state.sortByJSON ? this.state.sortByJSON[1].title : "Open/Close Balance Report"
            },
            onClick: (e, element) => {
                if (element.length > 0) {
                    var ind = element[0]._index;
                    var selectedVal = this.state.graphFourthLabel[ind];
                    var data = this.state.fourthData;
                    var d1 = data[0][selectedVal];
                    var d2 = data[1][selectedVal];
                    var rowData = d1.concat(d2); 
                    this.setState({
                        rowData : rowData
                    })
                }
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display:true
                    },
                    ticks: {
                        // suggestedMin: 0,
                        // suggestedMax: 100,
                        // beginAtZero: true,
                        // stepSize: 1
                    },
                    scaleLabel: {
                        display: true,
                        labelString: this.state.sortByJSON ? this.state.sortByJSON[1].msgX : "Items"
                        }, 
                }],
                yAxes: [{
                    gridLines: {
                        display: true
                    },
                    ticks: {
                        // suggestedMin: 0,
                        beginAtZero: true,
                        // stepSize: 1
                    },
                    scaleLabel: {
                        display: true,
                        labelString: this.state.sortByJSON ? this.state.sortByJSON[1].msgY : "Amount"
                        }, 
                }]
            },
            plugins: {
                datalabels: {
                    display: false
                }
            }
            }

        return (
            <div>
            <div className="graphDashboard">
            
            {
                this.state.graphClicked >= 0 && this.state.dropdownSelectedGraph !== "Storewise Department Requisition" ?
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
                this.state.graphClicked > 0 && this.state.dropdownSelectedGraph !== "Storewise Department Requisition" ?
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

            {/* {
                this.state.graphClicked >= 0 && this.state.dropdownSelectedGraph === "Storewise Department Requisition" ?
                <CardContent className="halfGraph">
                    <React.Fragment>
                        <Bar
                        data={ balanceReportData }
                        options={ balanceReportOption } 
                        />
                    </React.Fragment>
                </CardContent>
                : null
            }
            
            {
                this.state.graphClicked > 0 && this.state.dropdownSelectedGraph === "Storewise Department Requisition" ?
                <CardContent className="halfGraph">
                    <React.Fragment>
                        <Bar
                        data={ departmentBalanceReportData } 
                        options={ departmentBalanceReportOption } 
                        />
                    </React.Fragment>
                </CardContent> 
                :null
            } */}

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

export default DashboardStoreManagement;
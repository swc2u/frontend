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

class RPDueReport extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
        checkData: [],
        allData: [],
        dataOne: [],
        dataTwo: [],
        graphOneLabel: [],
        graphOneData: [],
        graphTwoLabel: [],
        graphTwoData: [],
        graphClicked: -1,
        hardJSON: [],
        graphHardOneData : {},
        graphHardTwoData : {},
        rowData: [],
        columnData: [],
        // Feature Table
        toggleColumnCheck: false,
        unchangeColumnData: [],
        collectionData: []
    }
  }


    // PDF function 
    pdfDownload = (e) => {

        debugger;
        e.preventDefault();
        var hardJSON = {
            "0":"Transit Number",
            "1":"Colony",
            "2":"Name",
            "3":"Mobile Number",
            "4":"Remaining Principal",
            "5":"Balance Interest",
            "6":"Total Due",
            "7":"Balance Amount"};
        const tableDataHeader = [];
        var columnData = this.state.unchangeColumnData
        // var columnDataCamelize = this.state.columnData
        var rowData = this.state.rowData
    
        var group = columnData.reduce((r, a) => {
            r[a["show"]] = [...r[a["show"]] || [], a];
            return r;
            }, {});
    
        columnData = group["true"]
    
        var tableCol = [];
        for(var i=0; i<columnData.length; i++){
            tableCol.push(columnData[i].Header);
        }
        var tableColumnData = []
        var tableColumnDataCamel = []
        for(var i=0; i<columnData.length; i++){
            tableColumnData.push(columnData[i]["accessor"]);
            tableColumnDataCamel.push(columnData[i]["Header"]);
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
        const pdfTitle = "Rented Due Report"
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

        var group = data.reduce((r, a) => {
            r[a[1]] = [...r[a[1]] || [], a];
            return r;
            }, {});

        graphOneLabel = Object.keys(group);
        for(var i=0; i<graphOneLabel.length; i++){
            var totalAmt = 0;
            for(var j=0; j<group[graphOneLabel[i]].length; j++){
                totalAmt = totalAmt + group[graphOneLabel[i]][j][6];
            }
            graphOneData.push(parseInt(totalAmt));
        }
        return [ graphOneLabel, graphOneData, group ]
    }else if(checkGraph === "dashboard 2"){
        debugger;
        var sortNo = null;
        var graphOneData = [];
        var principalDue = [];
        var amt;

        for(var i=0; i<data.length; i++){
            for(var j=0; j<data[0].length; j++){
                if(j === 4){
                    var prevVal = graphOneData[0] ? graphOneData[0] : 0
                    amt = prevVal + data[i][4];
                    graphOneData[0] = parseInt(amt);
                }else if(j === 5){
                    var prevVal = graphOneData[1] ? graphOneData[1] : 0
                    amt = prevVal + data[i][5];
                    graphOneData[1] = parseInt(amt);
                }else if(j === 6){
                    var prevVal = graphOneData[2] ? graphOneData[2] : 0
                    amt = prevVal + data[i][6];
                    graphOneData[2] = parseInt(amt);
                }else if(j === 7){
                    var prevVal = graphOneData[3] ? graphOneData[3] : 0
                    amt = prevVal + data[i][7];
                    graphOneData[3] = parseInt(amt);
                }
            }
        }

        graphOneLabel = ["Principal Due", "Interest Due", "Total Due", "Account Balance", "Amount Paid"];
        // graphOneLabel = ["Principal Due", "Interest Due", "Total Due", "Account Balance", "Amount Paid"];
        
        
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

        group = data

        debugger;
        
        const collectionData = this.state.collectionData;
        var amtPaid = 0;
        for(var i=0; i<group.length; i++){
            for(var j=0; j<collectionData.length; j++){
                if(group[i][0] === collectionData[j][2]){
                    amtPaid = amtPaid + collectionData[j][8];
                }
            }   
        }

        graphOneData.push(amtPaid);
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

    componentDidMount(){
        debugger;
        const propSortBy = "eventStatus";
        // const propSortBy = "status";
        const data = this.props.data[0][1].reportResponses[0].reportData;
        const collectionData = this.props.data[0][0][0].reportResponses[0].reportData;

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

        // Graph One Sorting Function 
        var graphOneData2 = this.graphSorting( propSortBy, data, "dashboard 1" );

        
        // Column Data
        const tableData = data[0] ? Object.keys(data[0]) : [];
        var columnData = [];
        const tableDataHeader = ["Transit Number","Colony","Name","Mobile Number",
        "Remaining Principal","Balance Interest","Total Due","Balance Amount"];

        for(var i=0; i<tableData.length; i++){
            var itemHeader = {}
            itemHeader["Header"] = this.camelize(tableDataHeader[i]);
            itemHeader["accessor"] = tableData[i];
            itemHeader["show"]= true ;
            columnData.push(itemHeader);
        }

        // Column Unchange Data 
        const unchangeColumnData = this.columnUnchange(columnData)

        
        this.setState({
            graphOneLabel: graphOneData2[0],
            graphOneData: graphOneData2[1],
            graphClicked: 0,
            dataOne: graphOneData2[2],
            columnData: columnData,
            unchangeColumnData: unchangeColumnData,
            rowData: data,
            hardJSON: hardJSON,
            collectionData: collectionData,
            checkData : this.props.data
        })

    }

    componentDidUpdate(){
        debugger;
        const data = this.props.data;
        if(JSON.stringify(data) !== JSON.stringify(this.state.checkData)){
            const data = this.props.data[0][1].reportResponses[0].reportData;
            const collectionData = this.props.data[0][0][0].reportResponses[0].reportData;

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

            // Graph One Sorting Function 
            var graphOneData2 = this.graphSorting( propSortBy, data, "dashboard 1" );

            
            // Column Data
            const tableData = data[0] ? Object.keys(data[0]) : [];
            var columnData = [];
            const tableDataHeader = ["Transit Number","Colony","Name","Mobile Number",
            "Remaining Principal","Balance Interest","Total Due","Balance Amount"];

            for(var i=0; i<tableData.length; i++){
                var itemHeader = {}
                itemHeader["Header"] = this.camelize(tableDataHeader[i]);
                itemHeader["accessor"] = tableData[i];
                itemHeader["show"]= true ;
                columnData.push(itemHeader);
            }

            // Column Unchange Data 
            const unchangeColumnData = this.columnUnchange(columnData)

            
            this.setState({
                graphOneLabel: graphOneData2[0],
                graphOneData: graphOneData2[1],
                graphClicked: 0,
                dataOne: graphOneData2[2],
                columnData: columnData,
                unchangeColumnData: unchangeColumnData,
                rowData: data,
                hardJSON: hardJSON,
                collectionData: collectionData,
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
            label: "RP Due Amount Report",
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
            text: "Rented Properties Due Amount Report"
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
                // var graphSorting = this.graphSorting( this.state.graphHardTwoData.sortBy, this.state.dataOne[selectedVal] );
                const hardval = this.state.hardJSON[1]
                var graphSorting = this.graphSorting( ind, this.state.dataOne[selectedVal], "dashboard 2" );
                
                var sortGraphTwoLabel = [];
                var sortGraphTwoData = [];
                var totalDue =[];
                for(var i=0; i<graphSorting[0].length; i++){
                    if(graphSorting[0][i] === "Total Due"){
                        totalDue.push(graphSorting[0][i]);
                        totalDue.push(graphSorting[1][i]);
                    }else{
                        sortGraphTwoLabel.push(graphSorting[0][i]);
                        sortGraphTwoData.push(graphSorting[1][i]);
                    }
                }
                sortGraphTwoLabel.push(totalDue[0]);
                sortGraphTwoData.push(totalDue[1]);

                this.setState({
                    graphTwoLabel: sortGraphTwoLabel,
                    graphTwoData: sortGraphTwoData,
                    dataTwo: graphSorting[2],
                    graphClicked: 1,
                    rowData: this.state.dataOne[selectedVal]
                })
                
            }
        },
    }
    

    // Second Graph
    var graphTwoSortedData = {
        labels: this.state.graphTwoLabel,
        datasets: [
            {
            label: "RP Due Repot",
            fill: false,
            lineTension: 5,
            hoverBorderWidth : 12,
            backgroundColor : this.state.colorRandom,
            // backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
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
            text: "Rented Properties Colonywise Due Amount Report"
        },
        onClick: (e, element) => {
            if (element.length > 0) {
                var ind = element[0]._index;
                debugger;
                // const selectedVal = this.state.graphTwoLabel[ind];
                
                // this.setState({
                //     graphClicked: 2,
                //     rowData: this.state.dataTwo[selectedVal]
                // })
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
                    labelString: "Due Amount (in Lakh)"
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
        <div style={this.state.rowData === 0 ? {display : "none"} :null}>
        {/* <h2> Rented Properties Due Graph </h2>  */}
        
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
        <div className="tableContainerRented">
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

export default RPDueReport;
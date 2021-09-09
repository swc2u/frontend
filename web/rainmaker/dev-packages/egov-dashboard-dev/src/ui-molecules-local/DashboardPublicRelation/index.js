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
import './PRDashboardIndex.css'

class PublicRelationDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
        recordNotFound : "",
        dropdownSelected : "",
        checkData: [],
        allData: [],
        graphOneLabel : [],
        graphOneData : [],
        dataOne: [],
        graphTwoLabel : [],
        graphTwoData : [],
        dataTwo : [],
        graphThirdLabel : [],
        graphThirdData : [],
        dataThird: [],
        graphClicked : -1,
        rowData: [],
        columnData: [],
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
    const pdfTitle = "Public Relation Dashboard"
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
        // e.preventDefault();
        
        const data = this.state.columnData
        this.setState({
            toggleColumnCheck : !this.state.toggleColumnCheck
        })
    }
    
    graphSorting = ( sortBy, data, checkGraph ) => {
        
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
        
        // const propSortBy = "eventStatus";
        // const propSortBy = "status";
        // const data = SportCulture_data.ResponseBody
        const data = this.props.data.length > 0 ? this.props.data[0].ResponseBody : [];
        const propSortBy = this.props.data.length > 0 ? this.props.data[1].value : [];
        if(data.length > 0){
            this.setState({
                checkData : this.props.data
            })
        }
    }

    componentDidUpdate(){
        
        const data = this.props.data.length > 0 ? this.props.data[0].ResponseBody : [];
        const propSortBy = this.props.data.length > 0 ? this.props.data[1].value : [];
        var recordNotFound = "";
        if(JSON.stringify(this.props.data) !== JSON.stringify(this.state.checkData)){
            var dropdownSelected = propSortBy;
            var group = data.reduce((r, a) => {
                r[a["eventStatus"]] = [...r[a["eventStatus"]] || [], a];
                return r;
                }, {});
            var selectedData = group[dropdownSelected];
            if(selectedData){
                var graphData = this.graphSorting("eventType", selectedData, "checkGraph");
                // Column Data
                var tableData = Object.keys(selectedData[0]);
                var columnData = []
                for(var i=0; i<tableData.length; i++){
                    var itemHeader = {}
                    itemHeader["Header"] = this.camelize(tableData[i]);
                    itemHeader["accessor"] = tableData[i];
                    // itemHeader["show"]= (i === 3 || i === 4 || i === 9 || i === 13 
                    //     || i === 15 || i === 18 || i === 20
                    //     || i === 23 || i === 24 || i === 33 || i === 35 ) ? true : false ;
                    if(i === 3 || i === 4 || i === 9 || i === 13 
                        || i === 15 || i === 18 || i === 20
                        || i === 23 || i === 24 || i === 33 || i === 35 ){
                            itemHeader["show"] = true;
                            columnData.push(itemHeader);
                    }
                    
                }
                
                
        
                // Column Unchange Data 
                const unchangeColumnData = columnData
        
                
                this.setState({
                    graphOneLabel: graphData[0],
                    graphOneData: graphData[1],
                    graphClicked: 0,
                    dataOne: graphData[2],
                    columnData: columnData,
                    unchangeColumnData: unchangeColumnData,
                    rowData: selectedData,
                    // hardJSON: hardJSON,
                    dropdownSelected : dropdownSelected
                })
            }else{
                recordNotFound = "Record not found..!"
            }
            this.setState({
                recordNotFound : recordNotFound,
                checkData : this.props.data
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
                label: "Event",
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
                text: this.state.dropdownSelected === "PUBLISHED" ? "Published Event Statuswise Dashboard" : "Cancelled Event Statuswise Dashboard" 
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display:true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Event"
                        }, 
                }],
                yAxes: [{
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
                        labelString: "No of Event"
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
                    const data = this.state.dataOne[selectedVal];
                    var graphData = this.graphSorting("sector", data, "checkGraph");
            
                    
                    // var graphSorting = this.graphSorting( this.state.graphHardTwoData.sortBy, this.state.dataOne[selectedVal] );
                    // const hardval = this.state.hardJSON[1]
                    // var graphSorting = this.graphSorting( hardval.sortBy, this.state.dataOne[selectedVal] );
                    
                    this.setState({
                        graphTwoLabel: graphData[0],
                        graphTwoData: graphData[1],
                        dataTwo: graphData[2],
                        graphClicked: 1,
                        rowData: this.state.dataOne[selectedVal]
                    })
                    
                }
            },
        }
        
    
        // Second Horizontal Graph
        var graphTwoSortedData = {
            labels: this.state.graphTwoLabel,
            // labels: ["Label1", "Label2"],
            datasets: [
                {
                label: "Event",
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
                // data: [10,20]
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
                text: this.state.dropdownSelected === "PUBLISHED" ? "Published Events Sectorwise Dashboard" : "Cancelled Events Sectorwise Dashboard"
            },
            onClick: (e, element) => {
                if (element.length > 0) {
                    
                    var ind = element[0]._index;   
                    const selectedVal = this.state.graphTwoLabel[ind];
                    const data = this.state.dataTwo[selectedVal];
                    var graphData = this.graphSorting("area", data, "checkGraph");
            
                    
                    // var graphSorting = this.graphSorting( this.state.graphHardTwoData.sortBy, this.state.dataOne[selectedVal] );
                    // const hardval = this.state.hardJSON[1]
                    // var graphSorting = this.graphSorting( hardval.sortBy, this.state.dataOne[selectedVal] );
                    
                    this.setState({
                        graphThirdLabel: graphData[0],
                        graphThirdData: graphData[1],
                        dataThird: graphData[2],
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
                        labelString: "Event Sector"
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
                        labelString: "No of Events"
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
            // labels: ["Label1", "Label2"],
            datasets: [
                {
                label: "Event",
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
                // data: [10,20]
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
                text: this.state.dropdownSelected === "PUBLISHED" ? "Published Event Areawise Dashboard" : "Cancelled Event Areawise Dashboard"
            },
            onClick: (e, element) => {
                if (element.length > 0) {
                    
                    // var ind = element[0]._index;   
                    // const selectedVal = this.state.graphTwoLabel[ind];
                    // const data = this.state.dataTwo[selectedVal];
                    // var graphData = this.graphSorting("area", data, "checkGraph");
            
                    // 
                    // // var graphSorting = this.graphSorting( this.state.graphHardTwoData.sortBy, this.state.dataOne[selectedVal] );
                    // // const hardval = this.state.hardJSON[1]
                    // // var graphSorting = this.graphSorting( hardval.sortBy, this.state.dataOne[selectedVal] );
                    
                    // this.setState({
                    //     graphThirdLabel: graphData[0],
                    //     graphThirdData: graphData[1],
                    //     dataThird: graphData[2],
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
                        stepSize: 1
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Area"
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
                        labelString: "No of Events"
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
            <div className="graphDashboard">

            <div> {this.state.recordNotFound} </div> 
    
            {
                this.state.graphClicked >=0 ?
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
                        data={ graphTwoSortedData } 
                        options={ graphTwoOption } 
                        />
                    </React.Fragment>
                </CardContent> 
                :null
            }
    
            </div>
            {
                this.state.graphClicked > 1 ?
                <CardContent style={{"height": "350px"}}>
                    <React.Fragment>
                        <Bar
                        data={ graphThirdSortedData } 
                        options={ graphThirdOption } 
                        />
                    </React.Fragment>
                </CardContent> 
                :null
            }
    
            {/* Table Feature  */}
            <div className={this.state.graphClicked >=0 ? "tableContainer" : ""}>
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

export default PublicRelationDashboard;
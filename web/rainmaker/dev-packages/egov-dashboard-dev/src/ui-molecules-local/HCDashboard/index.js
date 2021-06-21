import React, { Component } from "react";
import { Doughnut, Bar, HorizontalBar, Line, Pie } from 'react-chartjs-2';
import CardContent from '@material-ui/core/CardContent';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css" ;
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './index.css'

class HCDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
        title : "",
        allData: [],
        dataOne: [],
        dataTwo: [],
        dataThird: [],
        graphOneLabel: [],
        graphOneData: [],
        graphTwoLabel: [],
        graphTwoData: [],
        graphThirdLabel: [],
        graphThirdData: [],
        graphClicked: -1,
        hardJSON: [],
        graphHardOneData : {},
        graphHardTwoData : {},
        graphHardThirdData : {},
        rowData: [],
        columnData: [],
        unchangeColumnData : [],
        checkData : []
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
    const pdfTitle = this.state.title;
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

    graphSorting = ( sortBy, data ) => {

    // //debugger;
    // passing sortBy, data
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
        
        // debugger;
        const propsData = this.props.data 
        if(JSON.stringify(propsData) !== JSON.stringify(this.state.checkData)){
            const propSortBy = "service_request_status";
            // const propSortBy = "service_type";
            // const propSortBy = "locality";
            
            const data = propsData.services
        
            // Graph One Sorting Function 
            var graphOneData = this.graphSorting( propSortBy, data );
        
            // Graph Hard JSON Create :: 
            var hardJSON = propSortBy === "service_request_status" ? [
                {
                "sortBy": "service_request_status",
                "msgX": "Status",
                "msgY": "No of Request",
                "title": "Statuswise Horticulture Report",
                }, 
                {
                "sortBy": "service_type",
                "msgX": "No of Request",
                "msgY": "",
                "title": "Service Type wise Horticulture Status Report",
                },
                { 
                "sortBy": "locality",
                "msgX": "Location",
                "msgY": "No of Request",
                "title": "Locationwise Horticulture Status Report",
                }
            ] : 
            propSortBy === "service_type" ? [
                {
                "sortBy": "service_type",
                "msgX": "Types of Service",
                "msgY": "No of Complaints",
                "title": "Typewise Horticulture Report",
                }, 
                {
                "sortBy": "service_request_status",
                "msgX": "No of Complaints",
                "msgY": "Status",
                "title": "Typewise Horticulture Service Type Report",
                },
                { 
                "sortBy": "locality",
                "msgX": "Location",
                "msgY": "No of Request",
                "title": "Typewise Horticulture Service Type Report",
                }
            ] : 
            propSortBy === "locality" ? [
                {
                "sortBy": "locality",
                "msgX": "Location",
                "msgY": "No of Request",
                "title": "Locationwise Horticulture Report",
                }, 
                {
                "sortBy": "service_request_status",
                "msgX": "No of Complaints",
                "msgY": "Status",
                "title": "Statuswise Horticulture Location Report",
                },
                { 
                "sortBy": "service_type",
                "msgX": "Service Type",
                "msgY": "No of Complaints",
                "title": "Service Typewise Horticulture Location Report",
                }
            ] : "";
        
            // Table Data Header 
            //debugger;
            const tableData = data.length>0 ? Object.keys(data[0]) : [];
            var columnData = []
            for(var i=0; i<tableData.length; i++){
                var itemHeader = {}
                itemHeader["Header"] = this.camelize(tableData[i]);
                itemHeader["accessor"] = tableData[i];
                if(i === 1 || i === 2 || i === 3 || i === 4 || i === 6 || i === 8 ){
                    itemHeader["show"] = true;
                    columnData.push(itemHeader);
                }
            }
        
            //debugger;
            this.setState({
                allData: data,
                graphOneLabel: graphOneData[0],
                graphOneData: graphOneData[1],
                hardJSON: hardJSON,
                graphHardOneData : hardJSON[0],
                graphHardTwoData : hardJSON[1],
                graphHardThirdData : hardJSON[2],
                graphClicked: 0,
                dataOne: graphOneData[2],
                columnData: columnData,
                unchangeColumnData : columnData,
                rowData: data,
                checkData: propsData,
                title : hardJSON[0].title
            })
        }
    }

    componentDidUpdate(){

        // debugger;
        const propsData = this.props.data 
        if(JSON.stringify(this.state.checkData) !== JSON.stringify(propsData)){
            console.log("OK");
            // const propSortBy = "service_request_status";
            // const propSortBy = "service_type";
            // const propSortBy = "locality";
            
            const data = propsData[0].services
            const propSortBy = propsData[1]
        
            // Graph One Sorting Function 
            var graphOneData = this.graphSorting( propSortBy, data );
        
            // Graph Hard JSON Create :: 
            var hardJSON = propSortBy === "service_request_status" ? [
                {
                "sortBy": "service_request_status",
                "msgX": "Status",
                "msgY": "No of Request",
                "title": "Statuswise Horticulture Report",
                }, 
                {
                "sortBy": "service_type",
                "msgX": "No of Request",
                "msgY": "",
                "title": "Service Type wise Horticulture Status Report",
                },
                { 
                "sortBy": "locality",
                "msgX": "Location",
                "msgY": "No of Request",
                "title": "Locationwise Horticulture Status Report",
                }
            ] : 
            propSortBy === "service_type" ? [
                {
                "sortBy": "service_type",
                "msgX": "Types of Service",
                "msgY": "No of Complaints",
                "title": "Typewise Horticulture Report",
                }, 
                {
                "sortBy": "service_request_status",
                "msgX": "No of Complaints",
                "msgY": "Status",
                "title": "Typewise Horticulture Service Type Report",
                },
                { 
                "sortBy": "locality",
                "msgX": "Location",
                "msgY": "No of Request",
                "title": "Typewise Horticulture Service Type Report",
                }
            ] : 
            propSortBy === "locality" ? [
                {
                "sortBy": "locality",
                "msgX": "Location",
                "msgY": "No of Request",
                "title": "Locationwise Horticulture Report",
                }, 
                {
                "sortBy": "service_request_status",
                "msgX": "No of Complaints",
                "msgY": "Status",
                "title": "Statuswise Horticulture Location Report",
                },
                { 
                "sortBy": "service_type",
                "msgX": "Service Type",
                "msgY": "No of Complaints",
                "title": "Service Typewise Horticulture Location Report",
                }
            ] : "";
        
            // Table Data Header 
            //debugger;
            const tableData = data.length>0 ? Object.keys(data[0]) : [];
            var columnData = []
            for(var i=0; i<tableData.length; i++){
                var itemHeader = {}
                itemHeader["Header"] = this.camelize(tableData[i]);
                itemHeader["accessor"] = tableData[i];
                if(i === 1 || i === 2 || i === 3 || i === 4 || i === 6 || i === 8 ){
                    itemHeader["show"] = true;
                    columnData.push(itemHeader);
                }
            }
        
            //debugger;
            this.setState({
                allData: data,
                graphOneLabel: graphOneData[0],
                graphOneData: graphOneData[1],
                hardJSON: hardJSON,
                graphHardOneData : hardJSON[0],
                graphHardTwoData : hardJSON[1],
                graphHardThirdData : hardJSON[2],
                graphClicked: 0,
                dataOne: graphOneData[2],
                columnData: columnData,
                unchangeColumnData : columnData,
                rowData: data,
                checkData: propsData,
                title : hardJSON[0].title
            })
        }
    }

    render() {

        // First Bar Graph
        var graphOneSortedData = {
        labels: this.state.graphOneLabel,
        datasets: [
            {
            // label:  this.state.graphLabel,
            fill: false,
            lineTension: 0.1,
            hoverBorderWidth : 12,
            // backgroundColor : this.state.colorRandom,
            backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
            borderColor: "rgba(75,192,192,0.4)",
            borderCapStyle: "butt",
            barPercentage: 2,
            barThickness: 25,
            maxBarThickness: 25,
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
        // circumference : 12,
        onClick: (e, element) => {
            if (element.length > 0) {
                var ind = element[0]._index;
                //debugger;
                const selectedVal = this.state.graphOneLabel[ind];
                var graphSorting = this.graphSorting( this.state.graphHardTwoData.sortBy, this.state.dataOne[selectedVal] );
                
                this.setState({
                    graphTwoLabel: graphSorting[0],
                    graphTwoData: graphSorting[1],
                    dataTwo: graphSorting[2],
                    graphClicked: 1,
                    rowData: this.state.dataOne[selectedVal]
                })
                // alert(ind)
            }
        },
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
            text: this.state.graphHardOneData.title,
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display:true
                },
                scaleLabel: {
                    display: true,
                    labelString: this.state.graphHardOneData.msgX,
                    },
            }],
            yAxes: [{
                gridLines: {
                    display:true
                },
                scaleLabel: {
                    display: true,
                    labelString: this.state.graphHardOneData.msgY,
                    },  
                ticks: {
                stepSize: 1
                },
            }],
        },
        plugins: {
            datalabels: {
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

        // First Bar Graph
        var PIEgraphOneSortedData = {
        labels: this.state.graphOneLabel,
        datasets: [
            {
            // label:  this.state.graphLabel,
            fill: false,
            lineTension: 0.1,
            hoverBorderWidth : 12,
            // backgroundColor : this.state.colorRandom,
            backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
            borderColor: "rgba(75,192,192,0.4)",
            borderCapStyle: "butt",
            barPercentage: 2,
            barThickness: 25,
            maxBarThickness: 25,
            minBarLength: 2,
            data: this.state.graphOneData
            }
        ]
        }
            
        var PIEgraphOneOption = {
        responsive : true,
        // aspectRatio : 3,
        maintainAspectRatio: false,
        cutoutPercentage : 0,
        // circumference : 12,
        onClick: (e, element) => {
            if (element.length > 0) {
                var ind = element[0]._index;
                //debugger;
                const selectedVal = this.state.graphOneLabel[ind];
                var graphSorting = this.graphSorting( this.state.graphHardTwoData.sortBy, this.state.dataOne[selectedVal] );
                
                // Copy CLone array
                var graphlabel = graphSorting[0].map((item) => item);
                
                for(var i=0; i<graphlabel.length; i++){
                    if(graphlabel[i].length > 30){
                        var labelSlice = [];
                        labelSlice.push(graphlabel[i].substring(0,30));
                        labelSlice.push(graphlabel[i].substring(30,));
                        graphlabel[i] = labelSlice;
                    }
                }
                
                this.setState({
                    graphTwoShowlabel : graphlabel,
                    graphTwoLabel: graphSorting[0],
                    graphTwoData: graphSorting[1],
                    dataTwo: graphSorting[2],
                    graphClicked: 1,
                    rowData: this.state.dataOne[selectedVal]
                })
                // alert(ind)
            }
        },
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
            text: this.state.graphHardOneData.title,
        },
        // scales: {
        //     xAxes: [{
        //         gridLines: {
        //             display:true
        //         },
        //         scaleLabel: {
        //             display: true,
        //             labelString: this.state.graphHardOneData.msgX,
        //             },
        //     }],
        //     yAxes: [{
        //         gridLines: {
        //             display:true
        //         },
        //         scaleLabel: {
        //             display: true,
        //             labelString: this.state.graphHardOneData.msgY,
        //             },  
        //         ticks: {
        //         stepSize: 1
        //         },
        //     }],
        // },
        plugins: {
            datalabels: {
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

        // Second Horizontal Graph
        var graphTwoSortedData = {
            labels: this.state.graphTwoShowlabel,
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
                boxWidth: 15,
                boxHeight: 2
                }
            },
            tooltips: {
                enabled: true
            },
            title: {
                display: true,
                text: this.state.graphHardTwoData.title
            },
            onClick: (e, element) => {
                if (element.length > 0) {
                    var ind = element[0]._index;
                    //debugger;
                    const selectedVal = this.state.graphTwoLabel[ind];
                    var graphSorting = this.graphSorting( this.state.graphHardThirdData.sortBy, this.state.dataTwo[selectedVal] );
                    
                    this.setState({
                        graphThirdLabel: graphSorting[0],
                        graphThirdData: graphSorting[1],
                        dataThird: graphSorting[2],
                        graphClicked: 2,
                        rowData: this.state.dataTwo[selectedVal]
                    })
                    // alert(ind)
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
                        labelString: this.state.graphHardTwoData.msgX
                    }, 
                }],
                yAxes: [{
                    gridLines: {
                        display: true
                    },
                    ticks: {
                        suggestedMin: 0,
                        stepSize: 1,
                        // fontSize: 10
                    },
                    scaleLabel: {
                        display: true,
                        labelString: this.state.graphHardTwoData.msgY
                    }, 
                }]
            },
            plugins: {
                legend: {
                    labels: {
                        // This more specific font property overrides the global property
                        font: {
                            size: 10
                        }
                    }
                }
                }
        }

        // Third Line Graph
        var graphThirdSortedData = {
            labels: this.state.graphThirdLabel,
            datasets: [
                {
                // label: "Module Raised Complaints",
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
                text: this.state.graphHardThirdData.title
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display:true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: this.state.graphHardThirdData.msgX
                    }, 
                }],
                yAxes: [{
                    gridLines: {
                        display:true
                    },
                    ticks: {
                        // suggestedMin: 0,
                        // suggestedMax: 100,
                        stepSize: 1
                    },
                    scaleLabel: {
                        display: true,
                        labelString: this.state.graphHardThirdData.msgY
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

                    //debugger;
                    var ind = element[0]._index;   
                    const selectedVal = this.state.graphThirdLabel[ind];
                    
                    this.setState({
                        graphClicked: 3,
                        rowData: this.state.dataThird[selectedVal]
                    })
                }
            },
        }

        // Table Data
        const data = [{  
        name: 'Ayaan',  
        age: 26  
        },{  
        name: 'Ahana',  
        age: 22  
        },{  
        name: 'Peter',  
        age: 40   
        },{  
        name: 'Virat',  
        age: 30  
        },{  
        name: 'Rohit',  
        age: 32  
        },{  
        name: 'Dhoni',  
        age: 37  
        }]

        const columns = [{  
        Header: 'Complaint Header',  
        accessor: 'name',
        },{  
        Header: 'Complaint Count',  
        accessor: 'age'  
        },
        {  
        Header: 'Complaint Count',  
        accessor: 'age'  
        },
        {  
        Header: 'Complaint Header',  
        accessor: 'name',
        }] 
        
        return (
        <div>

            <div className="graphDashboard">
            {/* <CardContent style={{width:"40%", borderStyle: "ridge"}}>
                <React.Fragment>
                    <Bar
                    data={ graphOneSortedData }
                    options={ graphOneOption } 
                    />
                </React.Fragment>
            </CardContent> */}

            {
                this.state.graphClicked >= 0 ?
                <CardContent className="halfGraph-40">
                    <React.Fragment>
                        <Pie style = {{"display": "block","width": "317px","height": "462px"}}
                        data={ PIEgraphOneSortedData }
                        options={ PIEgraphOneOption } 
                        />
                    </React.Fragment>
                </CardContent>
                :null
            }
            
            {
                this.state.graphClicked > 0 ?
                <CardContent className="halfGraph-60">
                    <React.Fragment>
                        <HorizontalBar style={{"display": "block","width": "623px","height": "454px"}}
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
                <CardContent style={{width:"100%", height:"400px",borderStyle: "ridge"}}>
                    <React.Fragment>
                        <Line
                        data={ graphThirdSortedData }
                        options={ graphThirdOption } 
                        />
                    </React.Fragment>
                </CardContent>
            :null
            }

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
                <ReactTable
                // PaginationComponent={Pagination}
                data={ this.state.rowData }  
                columns={ this.state.columnData }  
                defaultPageSize = {10}  
                pageSizeOptions = {[20,40,60]}  
                /> 
                :null
            }
            </div>
        </div>
        );
    }
}

export default HCDashboard;
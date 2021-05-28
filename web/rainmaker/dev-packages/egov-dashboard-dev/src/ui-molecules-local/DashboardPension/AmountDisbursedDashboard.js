import React, { Component } from "react";
import { Doughnut, Bar, HorizontalBar, Line, Pie } from 'react-chartjs-2';
import CardContent from '@material-ui/core/CardContent';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css" ;
import jsPDF from 'jspdf'
import 'jspdf-autotable';
import './pension.css';

class AmountDisbursedDashboard extends React.Component {
  constructor(props) {
    super(props);
        this.state ={
            addData : [],
            graphOneLabel: [],
            graphOneData: [],
            graphClicked: -1,
            dataOne: [],

            rowData: [],
            columnData: [],
            // Feature Table
            toggleColumnCheck: false,
            unchangeColumnData: []
        }
    }

    componentDidMount(){
        debugger;
        const data = this.props.data;
        var month = {1:"JAN", 2:"FEB", 3:"MAR", 4:"APR", 5:"MAY", 6:"JUN", 7:"JUL", 8:"AUG", 9:"SEP", 10:"OCT", 11:"NOV", 12:"DEC"}
        var allGraphlabel = Object.keys(data[0]);
        var graphData = [];
        var graphlabel = [];
        for(var i=0; i<allGraphlabel.length - 1; i++){
            var amt = 0;
            graphlabel.push(month[parseInt(allGraphlabel[i])+1]);
            for(var j=0; j<data[0][allGraphlabel[i]].length; j++){
                amt = amt + data[0][allGraphlabel[i]][j][6]
            }
            graphData.push(amt);
        }
        var graphDataOne = data[0];

        this.setState({
            allData : data,
            graphOneLabel: graphlabel,
            graphOneData: graphData,
            graphClicked: 0,
            dataOne: graphDataOne
        })
    }

    componentDidUpdate(){
        debugger;
        const data = this.props.data;
        if(true){
             
        }
    }

    render() {
       
        // First Double Bar Graph Graph
    var graphOneSortedData = {
        labels: this.state.graphOneLabel,
        // labels: ["Label1", "Label2"],
        datasets: [
            {
            label: "",
            fill: false,
            lineTension: 0.1,
            hoverBorderWidth : 12,
            // backgroundColor : this.state.colorRandom,
            backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
            borderColor: "rgba(75,192,192,0.4)",
            borderCapStyle: "butt",
            barPercentage: 2,
            borderWidth: 1,
            barThickness: 25,
            maxBarThickness: 25,
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
            text: "Month wise Pension Amount Disbursed"
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display:true
                },
                scaleLabel: {
                    display: true,
                    labelString: "Month"
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
                    labelString: "Pension Amount (INR)"
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
                // var graphSorting = this.graphSorting( hardval.sortBy, this.state.dataOne[selectedVal] );
                
                // this.setState({
                //     graphTwoLabel: graphSorting[0],
                //     graphTwoData: graphSorting[1],
                //     dataTwo: graphSorting[2],
                //     graphClicked: 1,
                //     rowData: this.state.dataOne[selectedVal]
                // })
                
            }
        },
    }

    return (
        <div>
        {/* <h2> Pension Amount Disbursed Dashboard Graph </h2>  */}

        <div className="graphDashboard">
        

        <CardContent style ={{
            "width": "100%", 
            "borderStyle": "ridge"
        }}>
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
                    {/* <Pie
                    data={ graphTwoSortedData } 
                    options={ graphTwoOption } 
                    /> */}
                </React.Fragment>
            </CardContent> 
            :null
        }

        </div>

        {/* Table  */}

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

export default AmountDisbursedDashboard;
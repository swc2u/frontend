import React, { Component } from "react";
import { Doughnut, Bar, HorizontalBar, Line, Pie } from 'react-chartjs-2';
import CardContent from '@material-ui/core/CardContent';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css" ;
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './apniMandi.css';

const isMobile = window.innerWidth < 500
const responsiveSizeHack = isMobile ? window.innerWidth + 400 : window.innerWidth

var colorArray = [
    "#b47162", "#66991A", "#4f0f6f", "#1d1d58", "#947002", "#bde052", "#e08c56",
    "#7ad236", "#7260d8", "#1deaa7", "#06f43a", "#823c59", "#e3d94c", "#dc1c06",
    "#f53b2a", "#b46238", "#2dfff6", "#a82b89", "#1a8011", "#436a9f", "#1a806a",
                '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
                '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
                '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
                '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A'];

class DashboardApniMandi extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
        checkData : [],
        graphTitle : "",
        recordMotFound : "",
        fromDate : "",
        toDate : "",
        dropdownSelected : "",
        allData: [],
        dataOne: [],
        dataTwo: [],
        dataThird : [],
        dataFourth : [],
        dataFifth : [],
        graphOneLabel: [],
        graphOneSHOWLabel: [],
        graphOneData: [],
        graphTwoLabelSHOW : [],
        graphTwoLabel: [],
        graphTwoData: [],
        graphThirdLabel : [],
        graphThirdData : [],
        graphFourthLabel : [],
        graphFourthData : [],
        graphFifthLabel : [],
        graphFifthData : [],
        graphClicked: -1,
        hardJSON: [],
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
        const pdfTitle = this.state.graphTitle;
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

        var group = sortColumn.reduce((r, a) => {
            r[a["show"]] = [...r[a["show"]] || [], a];
            return r;
            }, {});

        if(!group["true"]){
            return;
        }
        var sortColumn2 = JSON.parse(JSON.stringify(this.state.unchangeColumnData));
        const removeIndex2 = parseInt(e.target.value);
        // sortColumn.splice(removeIndex, 1)
        sortColumn2[removeIndex2]["show"] = !(sortColumn2[removeIndex2]["show"]);

        if(group["true"].length <= 5){
            this.setState({
                columnData: sortColumn,
                unchangeColumnData: sortColumn2
            })
        }
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
        
        
        var dateRangeData = data;
        var sortBy = sortBy;
        var group = dateRangeData.reduce((r, a) => {
            r[a[sortBy]] = [...r[a[sortBy]] || [], a];
            return r;
            }, {});
        
        var graphLabel = Object.keys(group);
        var graphData = [];
        for(var i=0; i<graphLabel.length; i++){
            graphData.push(group[graphLabel[i]].length);
        }
        return [graphLabel, graphData, group]

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
        
        const propsData = this.props.data;
        this.setState({
            checkData : this.props.data
        })
    }

    componentDidUpdate(){
        
        const propsData = this.props.data;
        if(JSON.stringify(propsData) !== JSON.stringify(this.state.checkData)){
            
            var graphTitle = "";
            var monthJSON = {"0":"JAN","1":"FEB","2":"MAR","3":"APR","4":"MAY","5":"JUN","6":"JUL",
            "7":"AUG","8":"SEP","9":"OCT","10":"NOV","11":"DEC"};
            var data = propsData[0];
            // const dropdownSelected = "dayMarketCollection";
            // const dropdownSelected = "allMarketCollection";
            const dropdownSelected = propsData[1].reportSortBy.value;
            // var fromDate = "2020-01-01";
            var fromDate = propsData[1].fromDate;
            // var toDate = "2021-12-31";
            var toDate = propsData[1].toDate;
            var dates = this.dateTimeToForma(fromDate, toDate);
            var dateRange = this.dateRange(dates[0], dates[1]);
            if(dropdownSelected === "dayMarketCollection"){
                data = data.dayMarketCollection.ResponseBody.data;
                if(data.length > 0){
                    var group = data.reduce((r, a) => {
                        r[new Date(a["collectionDate"]).getFullYear()+"-"+monthJSON[new Date(a["collectionDate"]).getMonth()]] = 
                        [...r[new Date(a["collectionDate"]).getFullYear()+"-"+monthJSON[new Date(a["collectionDate"]).getMonth()]] || [], a];
                        return r;
                        }, {});
                    
                    
                    
                    var graphLabel = dateRange;
                    var graphData = [];
                    for(var i=0; i<graphLabel.length; i++){
                        
                        if(group[graphLabel[i]]){
                            var amt = 0;
                            for(var j=0; j<group[graphLabel[i]].length; j++){
                                amt = amt + group[graphLabel[i]][j].totalAmount;
                            }
                            graphData.push(amt);
                        }else{
                            graphData.push(0);
                        }
                    }
                    var colData = [];
    
                    for(var i=0; i<Object.keys(data[0]).length; i++){
                        var item = {};
                        item["Header"] = this.camelize(Object.keys(data[0])[i]);
                        item["accessor"] = Object.keys(data[0])[i];
                        // item["show"] = true;
                        item["show"] = i<5 ? true : false;
                        colData.push(item);
                    }
    
    
                    this.setState({
                        graphClicked : 0,
                        graphOneLabel : graphLabel,
                        graphOneData : graphData,
                        dataOne : group,
                        rowData :data,
                        columnData : colData,
                        unchangeColumnData : colData,
                        recordMotFound : ""
                    })
                }else{
                   this.setState({
                    graphClicked : -1,
                    recordMotFound : "Record Not Found...!"
                   }) 
                }

            }else if(dropdownSelected === "allMarketCollection" ){
                data = data.getAllMarketCollection.ResponseBody.data;
                if(data.length > 0){
                    var group = data.reduce((r, a) => {
                        r[new Date(a["collectionDate"]).getFullYear()+"-"+monthJSON[new Date(a["collectionDate"]).getMonth()]] = 
                        [...r[new Date(a["collectionDate"]).getFullYear()+"-"+monthJSON[new Date(a["collectionDate"]).getMonth()]] || [], a];
                        return r;
                        }, {});
                    
                    
                    
                    var graphLabel = dateRange;
                    var graphData = [];
                    for(var i=0; i<graphLabel.length; i++){
                        
                        if(group[graphLabel[i]]){
                            var amt = 0;
                            for(var j=0; j<group[graphLabel[i]].length; j++){
                                amt = amt + group[graphLabel[i]][j].totalAmount;
                            }
                            graphData.push(amt);
                        }else{
                            graphData.push(0);
                        }
                    }
                    var colData = [];
    
                    for(var i=0; i<Object.keys(data[0]).length; i++){
                        var item = {};
                        item["Header"] = this.camelize(Object.keys(data[0])[i]);
                        item["accessor"] = Object.keys(data[0])[i];
                        // item["show"] = true;
                        item["show"] = i<5 ? true : false;
                        colData.push(item);
                    }
    
    
                    this.setState({
                        graphClicked : 0,
                        graphOneLabel : graphLabel,
                        graphOneData : graphData,
                        dataOne : group,
                        rowData :data,
                        columnData : colData,
                        unchangeColumnData : colData,
                        recordMotFound : ""
                    })
                }else{
                    this.setState({
                        graphClicked : -1,
                        recordMotFound : "Record Not Found...!"
                    }) 
                }
            }

            if(dropdownSelected === "dayMarketCollection"){
                graphTitle = "Day Wise Collection Dashboard";
            }else if(dropdownSelected === "allMarketCollection"){
                graphTitle = "Market Collection Dashboard";
            }
            this.setState({
                graphTitle : graphTitle,
                fromDate : fromDate,
                toDate : toDate,
                dropdownSelected : dropdownSelected,
                checkData : this.props.data
            })
        }
    }

    render() {
    

        // Dropdown_1 Pie Graph
        var graphOneSortedData = {
            labels: this.state.graphOneLabel,
            // labels: ["Label1", "Label2"],
            datasets: [
                {
                label: "Amount",
                fill: false,
                lineTension: 0.1,
                hoverBorderWidth : 12,
                // backgroundColor : this.state.colorRandom,
                backgroundColor : colorArray,
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
                text: this.state.graphTitle
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display:true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Months"
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
                    var selectedVal = this.state.graphOneLabel[ind];
                    var data = this.state.dataOne[selectedVal];
                    
                    if(data){
                        this.setState({
                            rowData : data,
                        })
                    }
                }
            },
        }
    
            
        return (
            <div>
            <div>
                { this.state.recordMotFound }
            </div>
            {/*  Dropdown One Application Status report */}
            <div className="graphDashboard">
            {
                this.state.graphClicked >= 0 ?
                <CardContent className="fullGraph">
                <div style={{height:"500px"}}>
                        <React.Fragment>
                            <Bar
                            height={responsiveSizeHack}
                            width={responsiveSizeHack}
                            data={ graphOneSortedData }
                            options={ graphOneOption }                 
                            />
                        </React.Fragment>
                    </div>
                </CardContent>
                :null
            }
            </div>
            
            {/* Table Feature  */}
            <div className="tableContainer" style={this.state.graphClicked >= 0 ? null : {display:"none"}}>
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

export default DashboardApniMandi;
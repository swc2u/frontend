import React, { Component } from "react";
import { Doughnut, Bar, HorizontalBar, Line, Pie } from 'react-chartjs-2';
import CardContent from '@material-ui/core/CardContent';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ReactTable from "react-table-6";  
// import $ from 'jquery'; 
import "react-table-6/react-table.css" ;
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Legalindex.css';
import { httpRequest, BaseUrl } from "../../ui-utils/api";
// import { getLegalDashboardData } from "../../../../../ui-utils/commons";

// import LegalData from './Legal_data.json';
// import bgImage from './img/MCC_symbol.jpg';

class DashboardLegal extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
        checkData : [],
        toggleTable : true,
        totalCase : [],
        next7DaysData :[],
        next15DaysData : [],
        impCaseData : [],
        contemptCaseData : [],

        sortedTest : [],

        unchangeColumnData : [],
        rowData : []
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

    var colData = ["Sr No", "Case No", "Brief Matter", "Petitioner", "Department",
     "Other Department", "Nodal Officer", "Next Date", "Status", "Reply Filed", "File No."];
    // for(var i=0; i<columnData.length; i++){
    //     colData.push(columnData[i]["Header"]);
    // }

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


    ;
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
    const pdfTitle = "Title"
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

    exportPDF = (e) => {
        e.preventDefault();
        var dt = new Date();
        var doc = new jsPDF();
        doc.setFontSize(7);
        doc.text("Case Summary", 10, 10);
        doc.text(dt.toISOString().substring(0,10), 175, 10);
        doc.setFontSize(14);
        doc.text("SUPREME COURT CASES", 100, 15, "center");
            
        doc.autoTable({ html: '#tableContent',
        theme: "grid",
        margin: { top : 22, right: 2, left : 2 },
        styles : {
            overflow : "linebreak",
            fontSize : 7,
        },
        // columnStyles: { 0: { halign: 'center', fillColor: [0, 255, 0] } },
        })
        doc.save('legalDashboardReport.pdf');
    }

    XLExport = (e) => {
        e.preventDefault();
        var tab_text = "<table border='2px'><tr bgcolor='#87AFC6'>";
        var textRange;
        var j = 0;
        var tab = document.getElementById("tableContent");
        for (j = 0 ; j < tab.rows.length ; j++) {
            tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
        }
        tab_text = tab_text + "</table>";
        tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
        tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
        tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // remove input params
        // var sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
        // return (sa);

        var a = document.createElement('a');
        var data_type = 'data:application/vnd.ms-excel';
        var table_div = document.getElementById('element-to-print');
        // var table_html = table_div.outerHTML.replace(/ /g, '%20');
        a.href = data_type + ', ' + encodeURIComponent(tab_text);
        //setting the file name
        a.download = 'legalDashboardReport' + '.xls';
        //triggering the function
        a.click();
        //just in case, prevent default behaviour
        e.preventDefault();
    }

    // Column Unchange Data
    columnUnchange=(e)=>{
        ;
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
        ;
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
        ;
        const data = this.state.columnData
        this.setState({
            toggleColumnCheck : !this.state.toggleColumnCheck
        })
    }
    
    graphSorting = (data, sortBy, dropdownSelected, selectedDashboard ) => {
        var monthJSON = {"0":"JAN","1":"FEB","2":"MAR","3":"APR","4":"MAY","5":"JUN","6":"JUL",
        "7":"AUG","8":"SEP","9":"OCT","10":"NOV","11":"DEC"};
        if(selectedDashboard === "Single Program"){
            ;
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

            ;
            var headerData = [];
            var keys = Object.keys(data[0]);
            for(var i=0; i<Object.keys(data[0]).length; i++){
                var itemHeader = {}
                if(dropdownSelected === "Sewerage Dashboard"){
                    if(i === 3 || i === 4 || i === 25 || i === 16 || i=== 38 || i=== 34 || i=== 26 || i === 41){
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
            ;
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
            ;
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
            ;
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
            ;

            ;
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
                    var amount = group[graphLabel[i]][j].totalAmountPaid;
                    amt = amt + amount;
                }
                // graphData.push(group[graphLabel[i]].length);
                graphData.push(amt);
            } 
            
            ;
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

    getAPIDAta = async () => {

        const data = BaseUrl;
        const DescriptionReport = await httpRequest(
            "get",
            data+"/services/EGF/legalcase/getLegalCase",
            "",
            [],
            {}
            );
        var response = [DescriptionReport, []]
        
        
        return response;
    }
    componentDidMount(){
        

        var requestBody = {
            "tenantId": "",
            "moduleCode": "PR",
            "eventDetailUuid": "",
            "eventTitle": "",
            "eventStatus": "",
            "status": "",
            "fromDate": "",
            "toDate": "",
            "eventId": "",
            "defaultGrid": false,
            "reportSortBy": ""
            };
        
        var res = this.getAPIDAta();
        

        this.setState({
            // totalCase : totalCase,
            // next7DaysData :next7DaysData,
            // next15DaysData : next15DaysData,
            // impCaseData : impCaseData,
            // contemptCaseData : contemptCaseData,
            // unchangeColumnData : unchangeColumnData,
            checkData : res
        })
        

    }

    componentDidUpdate(){
      
      if(this.props.data.length > 0 && (
          JSON.stringify(this.props.data) !== JSON.stringify(this.state.checkData)
      )){
        const data = this.props.data[0].ResponseBody;
        // const data = LegalData.ResponseBody;

        var totalCase = data.reduce((r, a) => {
        r[a["courtName"]] = [...r[a["courtName"]] || [], a];
        return r;
        }, {});

        const checkTodayDt = new Date().getTime();
        const checkNext7Days = new Date(checkTodayDt + (86400000 * 7)).getTime();
        const checkNext15Days = new Date(checkTodayDt + (86400000 * 15)).getTime();
        var next7DaysData = [];
        var next15DaysData = [];
        var contemptCaseData = [];
        var impCaseData = [];
        for(var i=0; i<data.length; i++){
            if( data[i].hearingDate === null ){
                contemptCaseData.push(data[i])
            }else if( data[i].hearingDate <= checkNext7Days ){
                next7DaysData.push(data[i])
            }else if( data[i].hearingDate <= checkNext15Days ){
                next15DaysData.push(data[i])
            }
            // Code forimp case add here...
            else if( data[i].iscaseImp === true ){
                impCaseData.push(data[i])
            }
        }
        
        next7DaysData = next7DaysData.reduce((r, a) => {
        r[a["courtName"]] = [...r[a["courtName"]] || [], a];
        return r;
        }, {});

        next15DaysData = next15DaysData.reduce((r, a) => {
        r[a["courtName"]] = [...r[a["courtName"]] || [], a];
        return r;
        }, {});

        impCaseData = impCaseData.reduce((r, a) => {
        r[a["courtName"]] = [...r[a["courtName"]] || [], a];
        return r;
        }, {});
        
        contemptCaseData = contemptCaseData.reduce((r, a) => {
        r[a["courtName"]] = [...r[a["courtName"]] || [], a];
        return r;
        }, {});

        ;
        var unchangeColumnData = [];

        for(var i=0; i<Object.keys(data[0]).length; i++){
            var item = {}
            item["Header"] = "Column Name";
            item["accessor"] = Object.keys(data[0])[i];
            if(i===0 || i===12 || i===11 || i===13 || i===9 || i===30 || i===17
               || i===1){
                item["show"] = true;
                unchangeColumnData.push(item);
            }
        }

        this.setState({
            totalCase : totalCase,
            next7DaysData :next7DaysData,
            next15DaysData : next15DaysData,
            impCaseData : impCaseData,
            contemptCaseData : contemptCaseData,
            unchangeColumnData : unchangeColumnData,
            checkData : this.props.data
        })
      }
    }

    tableClicked = (data, caseClicked) => {

        ;
        var sortedTest = [];
        if(caseClicked === "totalCase"){
            sortedTest = this.state.totalCase[data]
        }else if(caseClicked === "next7Days"){
            sortedTest = this.state.next7DaysData[data]
        }else if(caseClicked === "next15Days"){
            sortedTest = this.state.next15DaysData[data]
        }else if(caseClicked === "iscaseImp"){
            sortedTest = this.state.impCaseData[data]
        }else if(caseClicked === "contempCase"){
            sortedTest = this.state.contemptCaseData[data]
        }

        var unchangeColumnData = [];

        this.setState({
            toggleTable : !this.state.toggleTable,
            sortedTest : sortedTest,
            rowData : sortedTest
        })
    }

    rowData = (data) =>{
        return(
            <tr>
                <td className=""> { data } </td>
                <td className="grab"> <button onClick={ () => this.tableClicked(data, "totalCase")}> { this.state.totalCase[data].length } </button> </td>
                <td className="grab"> <button onClick={ () => this.tableClicked(data, "next7Days")}> { this.state.next7DaysData[data] ? this.state.next7DaysData[data].length : 0 } </button> </td>
                <td className="grab"> <button onClick={ () => this.tableClicked(data, "next15Days")}> { this.state.next15DaysData[data] ? this.state.next15DaysData[data].length : 0 } </button> </td>
                {/* <td className="grab"> Not Updated </td> */}
                <td className={this.state.impCaseData[data] ? this.state.impCaseData[data].length > 0 ? "grab2" : "grab": "grab"}> <button onClick={ () => this.tableClicked(data, "iscaseImp")}> { this.state.impCaseData[data] ? this.state.impCaseData[data].length : 0 } </button> </td>
                <td className="grab"> <button onClick={ () => this.tableClicked(data, "contempCase")}> { this.state.contemptCaseData[data] ? this.state.contemptCaseData[data].length : 0 } </button> </td>
            </tr>
        );
    }

    rowData2 = (data, index) =>{
        ;
        var hearingDate = "";
        var nextDate = <p></p>;
        if(data.hearingDate !== null && data.hearingDate !== undefined){
            hearingDate = new Date(data.hearingDate);
            hearingDate = parseInt(hearingDate.getMonth()+1)+"/"+hearingDate.getDate()+"/"+hearingDate.getFullYear();
            var dt = new Date();
            nextDate = new Date(hearingDate) > dt ? <p>{hearingDate}</p> : <p style={{"color":"red"}}>{hearingDate}</p>;
        }
        return(
            <tr>
                <td> { index + 1 } </td>
                <td style={{"color": "Maroon"}}> { data.caseNumber } </td>
                <td> { data.caseTitle } </td>
                <td> { data.petName } </td>
                <td style={{"color":"green"}}> { data.concernedBranch } </td>
                {/* <td> <p style={{"color":"red"}}> "_Blank" </p> </td> */}
                {/* <td> "Nodal officer Pending API" </td> */}
                <td>  {nextDate}  </td>
                <td> { data.caseStatus === "CLOSED" ? "No further order of listing." : data.caseStatus } </td>
                {/* <td> { "----" } </td> */}
                <td> { data.lcNumber } </td>
            </tr>
        );
    }

    render() {



    return (
        <div>

        {
            this.state.toggleTable ? 
            <div className="legal-table-container" style={{overflowX:"auto"}}>
                <table id="tableContent2" className="legal-table">
                    {/* <tr>
                        <th>  </th>
                        <th>  </th>
                        <th>  </th>
                        <th>  </th>
                        <th>  </th>
                        <th>  </th>
                    </tr> */}
                    <tr>
                        <th> Court </th>
                        <th> Total Cases </th>
                        <th> Next 7 Days </th>
                        <th> Next 15 Days </th>
                        <th> Important Cases </th>
                        <th> Contempt Cases </th>
                    </tr>
                    {Object.keys(this.state.totalCase).map((data, index) => this.rowData(data))}
                </table>
            </div>
            :
            <div>
                <div style={{margin : "15px"}}>
                <button onClick={this.exportPDF}><p class=""><a href="exceldoc.pdf"></a></p> Export PDF </button>
                <button onClick={this.XLExport}><p class=""><a href="exceldoc.xlsx"></a></p> Export Excel </button>
                
                {/* <button onClick={this.XLExport}><p class=""></p> Export Excel </button> */}
                

                <button onClick={ () => this.tableClicked("", "")}> Back </button>
                </div>
                <div className="legal-table-container" style={{overflowX:"auto"}}>
                <div style={{"textAlign":"center"}}>
                    <p style={{"color": "red"}}>
                    * Cases Which Are NOT UPDATED Shown in RED Colour
                    </p>
                </div>
                    <table id="tableContent" className="legal-table">
                        <tr>
                            <th> Sr No </th>
                            <th> Case No </th>
                            <th> Brief Subject </th>
                            <th> Petitioner </th>
                            <th> Concern Branch </th>
                            {/* <th> Other Department </th> */}
                            {/* <th> Nodal Officer </th> */}
                            <th> Next Date </th>
                            <th> Status </th>
                            {/* <th> Reply Filed </th> */}
                            <th> File No </th>
                        </tr>
                        {this.state.sortedTest.map((data, index) => this.rowData2(data, index))}
                    </table>
                </div>
            </div>
        }

        </div>
    );
    }
  }

export default DashboardLegal;
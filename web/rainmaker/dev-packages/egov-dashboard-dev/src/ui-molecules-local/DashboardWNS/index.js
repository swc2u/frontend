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
// import Water_data from './WNS_data.json';
import './Water.css'
import WNSDashboardOne from './WNSDashboardOne';
import WNSDashboardTwo from './WNSDashboardTwo';

class WNSDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
        propSortBy: "",
        data : [],
        Water_data: [],
        BillData: []
    }
  }

    componentDidMount(){
               
    }

    componentDidUpdate(){
        
        const data = this.props.data
          
        if(this.props.data.length > 0 && JSON.stringify(this.state.data) !== JSON.stringify(data)){
            this.setState({
                propSortBy: this.props.data[2].value,
                data : data,
                Water_data: this.props.data[0],
                BillData: this.props.data[1]
            }) 
        }     
    }

    render() {

    return (
        <div>
        {/* <h2> WNS Dashboard Route </h2>  */}
        {
            this.state.propSortBy === "dashboardType1" ?
            <WNSDashboardOne data = {[this.state.Water_data, []]} />
            : this.state.propSortBy === "dashboardType2" ?
            <WNSDashboardTwo data = {[this.state.Water_data, this.state.BillData]} />
            : null
        }
        </div>
    );
    }
}

export default WNSDashboard;
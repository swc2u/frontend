import React, { Component } from "react";
import { Doughnut, Bar, HorizontalBar, Line, Pie } from 'react-chartjs-2';
import CardContent from '@material-ui/core/CardContent';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css" ;
import jsPDF from 'jspdf'
import 'jspdf-autotable';
import './OPMSIndex.css'

import DashboardOPMSStatus from './DashboardOPMSStatus';
import DashboardOPMSCollection from './DashboardOPMSCollection';

class DashboardOPMS extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
        checkdata : [],
        sortBy : "",
        statusPayload : []
    }
  }
    componentDidMount(){
        
        var propData = this.props.data
        if(propData.length){
            var statusPayload = propData[2] ? propData[2] : [];
            this.setState({
                checkdata : propData,
                sortBy : propData[1].value,
                statusPayload : statusPayload
            })
        }
    }

    componentDidUpdate(){
        
        var propData = this.props.data;
        if(JSON.stringify(this.state.checkdata) !== JSON.stringify(propData)){
            var statusPayload = propData[2] ? propData[2] : [];
            this.setState({
                checkdata : propData,
                sortBy : propData[1].value,
                statusPayload : statusPayload
            })
        }
        
    }

    render() {

        
    return (
        <div>
            {
                this.state.sortBy === "statusReport" ?
                <DashboardOPMSStatus 
                statsPayload ={ this.state.statusPayload}
                sortBy = {this.state.sortBy} 
                data = {this.state.checkdata[0]} />
                : this.state.sortBy === "collectionReport" ?
                <DashboardOPMSCollection 
                sortBy = {this.state.sortBy} 
                data = {this.state.checkdata[0]} />
                :null
            }
        </div>
    );
    }
}

export default DashboardOPMS;
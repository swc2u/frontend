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

import RetiredStatusDashboard from './RetiredStatusDashboard';
import AmountDisbursedDashboard from './AmountDisbursedDashboard';


class PensionDashbaord extends React.Component {
  constructor(props) {
    super(props);
        this.state ={
            propData: {}
        }
    }

    componentDidMount(){

        const data = this.props.data;
        if(data.length > 0){
            this.setState({
                propData: data
            })
        }
        
    }

    componentDidUpdate(){
        
        debugger;
        const data = this.props.data;
        if(JSON.stringify(data) !== JSON.stringify(this.state.propData)){
            this.setState({
                propData: data
            })
        }
        
    }

    render() {
        
    return (
        <div>
        {/* <h2> Pension Dashboard Graph </h2>  */}
        {
            this.props.data.length > 0 ? 
                this.props.data[1].value === "amountDisbursed" ?
                <AmountDisbursedDashboard data = {this.props.data} />
                :this.props.data[1].value === "retireStatus" ?
                <RetiredStatusDashboard data = {this.props.data} />
                : null
            : null
        }        
        </div>
    );
    }
}

export default PensionDashbaord;
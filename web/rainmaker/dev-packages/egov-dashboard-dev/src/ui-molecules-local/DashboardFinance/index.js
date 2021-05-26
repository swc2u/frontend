import React, { Component } from "react";
import { Doughnut, Bar, HorizontalBar, Line, Pie } from 'react-chartjs-2';
import CardContent from '@material-ui/core/CardContent';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css" ;
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import './financeIndex.css'

class DashboardFinance extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
        
    }
  }

  componentDidMount(){
      debugger;
      const propsData = this.props.data;
  }

  componentDidUpdate(){
      debugger;
      const propsData = this.props.data;
  }

  render(){

    return(
        <div>
            Finance Dashboard
        </div>
    )
  }
}

export default DashboardFinance;
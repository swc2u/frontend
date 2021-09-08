import React, { Component } from "react";
import { Doughnut, Bar, HorizontalBar, Line, Pie } from 'react-chartjs-2';
import CardContent from '@material-ui/core/CardContent';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css" ;
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import './RPIndex.css'

import RPCollectionReport from './RPCollectionReport';
import RPDueReport from './RPDueReport';

class RentedPropertyDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
        checkData : [],
        sortByRP : ""
    }
  }

  componentDidMount(){
      
      const propsData = this.props.data;
      if(propsData.length > 0){
        this.setState({
            // checkData: propsData,
            // sortByRP : propsData[1].reportSortBy.value
        });
      }
  }

  componentDidUpdate(){
    
    const propsData = this.props.data;
    if(JSON.stringify(this.state.checkData) !== JSON.stringify(propsData)){
        this.setState({
        checkData: propsData,
        sortByRP : propsData[1].reportSortBy.value
        });
    }
  }

    render() {
        return (
            <div>
                {/* <h2> Rented Properties Due Graph </h2> */}

                {
                    this.state.sortByRP === "collectionReport" ?
                    <RPCollectionReport 
                    sortBy = {this.state.sortByRP} 
                    data = {this.state.checkData[0][0]}
                    />
                    : this.state.sortByRP === "dueReport" ?
                    <RPDueReport 
                    sortBy = {this.state.sortByRP} 
                    data = {this.state.checkData} 
                    />
                    :null
                } 
            </div>
        );
    }
}

export default RentedPropertyDashboard;
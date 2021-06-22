import React from 'react';
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

// const dataSet1 = [
//     {
//         name: "Johson",
//         amount: 30000,
//         sex: 'M',
//         is_married: true
//     },
//     {
//         name: "Monika",
//         amount: 355000,
//         sex: 'F',
//         is_married: false
//     },
//     {
//         name: "John",
//         amount: 250000,
//         sex: 'M',
//         is_married: false
//     },
//     {
//         name: "Josef",
//         amount: 450500,
//         sex: 'M',
//         is_married: true
//     }
// ];

class ExportExcel extends React.Component{

    constructor(props) {
        super(props);
        this.state ={
            dataSet1 : []
        }
    }
    componentDidMount(){
        debugger;
        const data = this.props.data;
        this.setState({
            dataSet1 : data
        })

    }
    exportdata = (e) => {
        debugger;
        e.preventDefault();
        // return 
    }
    render(){
        return(
            <ExcelFile filename="Water_connection_application_data" 
            element={<button 
                onClick={this.exportdata}
                className="columnToggleBtn">
                Export Excel</button>}>
                <ExcelSheet data={this.state.dataSet1} name="Employees">
                    <ExcelColumn label="Application No" value="applicationNo"/>
                    <ExcelColumn label="Application Status" value="applicationStatus"/>
                    <ExcelColumn label="Status" value="status"/>
                    <ExcelColumn label="Activity Type" value="activityType"/>
                    <ExcelColumn label="Bill Group" value="billGroup"/>
                    <ExcelColumn label="Leager group" value="leagerGroup"/>
                    <ExcelColumn label="Pipe Size" value="proposedPipeSize"/>
                    <ExcelColumn label="Sub Division" value="subDiv"/>
                    <ExcelColumn label="Plot No" value="plotNo"/>
                    <ExcelColumn label="Sector No" value="sectorNo"/>
                    <ExcelColumn label="Usage Sub Category" value="usageSubCategory"/>
                    <ExcelColumn label="Usage Category" value="usageCategory"/>
                    <ExcelColumn label="Connection Owner" value="connectionOwnerDetails"/>
                    <ExcelColumn label="Application Date" value="auditDetails"/>
                </ExcelSheet>
            </ExcelFile>
        );
    };
};

export default ExportExcel;
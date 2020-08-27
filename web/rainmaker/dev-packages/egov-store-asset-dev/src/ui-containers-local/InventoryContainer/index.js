import { convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import MenuButton from "egov-ui-framework/ui-molecules/MenuButton";
import { connect } from "react-redux";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import set from "lodash/set";
import Label from "egov-ui-kit/utils/translationNode";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";
class InventoryContainer extends Component {

  state = {
    open: false,
    action: ""
  };
    render() {
        const {  ProcessInstances,
          state,
          InventoryData,         
          moduleName } = this.props;
           const stepsData = [
            { action: "PENSION_SEQUENCE_EMPLOYEE_DETAILS", navigationURL: "pms/home" }, ];
            console.log(InventoryData)
          //   if(InventoryData)
          //  let InventoryHeaderData = InventoryData.InventoryHeaderData;
            
      //       const downloadMenu = ActionItem.map((obj, index) => {
      //   return {
      //     // labelName: obj.action,
      //     // labelKey: `PENSION_${obj.action.toUpperCase().replace(/[._:-\s\/]/g, "_")}`,         
      //     // link: () =>  this.wfSwitchAction(obj.action,moduleName,pageName,Accesslable)
      //   }
      // })   

     
        return  ( <div>
         {
           InventoryData&&InventoryData.InventoryHeaderData&&(
             <table  id="reportTable"
             style={{
               width: "100%",
             }}
             className="table table-striped table-bordered">
             <thead>

<tr className="report-table-header">
  {
      InventoryData.InventoryHeaderData&&InventoryData.InventoryHeaderData[0].Rowdata.map((item, i) => {
        
          return (
            <th key={i} className="report-header-cell">
              <Label
                className="report-header-row-label"
                labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold" }}
                label={item.value}
              />
              {/* <table style={{width:"100%", }}>
                      <thead>
                      <tr className="report-table-header"> */}
              {
                
                item.data&& item.data.map((item,i)=>{
                  return(
                    
                        <th> 
                          {item.value}
                           {/* <Label
                className="report-header-row-label"
                labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold" }}
                label={item.value}
              /> */}
              </th>
                      
                 )
                }

                )
              }
              {/* </tr>
              </thead>
                    </table> */}
            </th>
          );
        
           })

  }
</tr>
             </thead>
             </table>
           )
           
          //  InventoryHeaderData&&InventoryHeaderData[0].map((row, i) => {
          //   return(
          //     <th key={"S. No."} className="report-header-cell">
          //     S. No
          //   </th>
          //   )
          //  })
            

         }
           
           </div>);
      }
  }
  const mapStateToProps = state => {
    const { auth, app } = state;
    const { menu } = app;
    const { userInfo } = auth;
    const name = auth && userInfo.name;
    let InventoryData = get(
      state,
      "screenConfiguration.preparedFinalObject.InventoryData",
      []
    );
    return { name, menu,state,InventoryData };
  };


  const mapDispacthToProps = dispatch => {
    return {
      prepareFinalObject: (path, value) =>
        dispatch(prepareFinalObject(path, value)),
      toggleSnackbar: (open, message, variant) =>
        dispatch(toggleSnackbar(open, message, variant)),dispatch
    };
  };
  export default connect(
    mapStateToProps,
    mapDispacthToProps
    
  )(InventoryContainer);
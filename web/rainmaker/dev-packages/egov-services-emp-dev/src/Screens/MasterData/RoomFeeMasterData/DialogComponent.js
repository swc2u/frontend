import { Button,  TextField } from "components";
import { httpRequest } from "egov-ui-kit/utils/api";
import LoadingIndicator from "egov-ui-kit/components/LoadingIndicator";
import React, { Component } from 'react'
import { Toast } from "components";
import { SortDialog, Screen } from "modules/common";
import CircularProgress from "@material-ui/core/CircularProgress";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { withStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import TextFieldContainer from 'egov-ui-framework/ui-containers/TextFieldContainer'


const styles= theme=>({
  
  text : {
    " &  .Mui-error": {
      color: "primary"
    }
  }, 

 
  dialogStyle: {
    minWidth: '960px',
  },
 
  root: {
    "& .MuiInput-underline:after": {
      borderBottomColor: " #f44336"
    }
  }, 
  
  [theme.breakpoints.down('sm')]: {
    
   
    dialogStyle: {
      minHeight: '100%', 
      margin : '0px',
      minWidth: '0px',
      maxWidth: '960px'
    }
  }



})



class DialogComponent extends Component {


    async componentDidMount(){
    
      
        this.getCCName()
        this.setState({mdmsRes: this.props.mdmsRes})
        this.props.prepareFinalObject('mdmsRes', this.props.mdmsRes)
     
     
        this.props.prepareFinalObject('roomType', [{code : 'AC'}, {code : 'NON-AC'}])
    }

    componentDidUpdate(prevProps){
    
        
        if(this.props.updateMasterData !== prevProps.updateMasterData){
            this.getCCName()
                
            this.setState({mdmsRes: this.props.mdmsRes})
            this.props.prepareFinalObject('mdmsRes', this.props.mdmsRes)
            
            this.setState({updateData: this.props.updateMasterData, errors: {}})
            this.props.prepareFinalObject('updateData', this.props.updateMasterData)

            this.props.prepareFinalObject('roomType', [{code : 'AC' , value  : 'AC'}, {code : 'NON-AC' , value : 'NON-AC'}])

            if(Object.keys(this.props.updateMasterData).length === 0){
                this.setState({create: true})
            }else{
                this.setState({create: false})
            }
        }

    }
    

    getCCName= async ()=> {
     let {data} = await httpRequest(  
        "bookings/master/communityCenter/name/_fetch",
         );
     let ccNameList = Object.values(data)
     console.log('ccNameList :>> ', ccNameList);
     let ccSectors = ccNameList.map((item) => {
      return { code: item, name: item }
       })
     this.props.prepareFinalObject('ccNameList', ccSectors) 
      
    }
    state={

        updateData: {}, 
        errors: {},
        create: true, 
        mdmsRes: {}, 
        setOpen : false
    }


    validate (){
        let temp= {}
        const submitData= this.state.updateData
        temp.sectorName=submitData.sectorName? false: true
        temp.totalNumberOfRooms=submitData.totalNumberOfRooms? false: true
        temp.typeOfRoom=submitData.typeOfRoom? false: true
        temp.rentForOneDay=submitData.rentForOneDay? false: true
        temp.rentFor3Hrs=submitData.rentFor3Hrs? false: true
        temp.rentFor6Hrs=submitData.rentFor6Hrs? false: true
        temp.communityCenterName=submitData.communityCenterName? false: true
        temp.rentFor9Hrs=submitData.rentFor9Hrs? false: true
        temp.fromDate=submitData.fromDate? false: true

        this.setState({errors: temp})

        return Object.values(temp).every(x => x=="")
    }

    async handleSubmit  (){
        if(this.validate()){

           if(this.state.create===true)
           {
             
          
            let today = new Date();
            let time =
              today.getHours() +
              ":" +
              today.getMinutes() +
              ":" +
              today.getSeconds();


            var reqBody =  {
              
              
              "CommunityCenterRoomFeeDetails": [

                {
                  
                  "sector":  this.state.updateData.sectorName,
                  "fromDate" : `${this.state.updateData.fromDate} ${time}`, 
                  "totalNumberOfRooms":  this.state.updateData.totalNumberOfRooms,
                  "typeOfRoom":  this.state.updateData.typeOfRoom,
                  "rentForOneDay": this.state.updateData.rentForOneDay,
                  "rentFor3Hrs":  this.state.updateData.rentFor3Hrs,
                  "rentFor6Hrs":  this.state.updateData.rentFor6Hrs,
                  "rentFor9Hrs":  this.state.updateData.rentFor9Hrs,
                  "communityCenterName": this.state.updateData.communityCenterName

              
                }
               
               ]
              }
            const responseStatus = await httpRequest(
                  
              "bookings/master/communitycenter/room/fee/_create",
              "_search",
              [],
              reqBody
            );
            if(responseStatus.status== '200'){
              this.props.toggleSnackbarAndSetText(
                true,
                {labelName: "Created Successfully",
                labelKey: `Created Successfully`} ,
                "success"
              );
              }else{
              this.props.toggleSnackbarAndSetText(
                true,
                {labelName: "Create Failed.Try Again",
                labelKey: `Create Failed.Try Again`} ,
                "error"
              );
              }
              
              this.props.handleClose()

            console.log(responseStatus, "createresponse")
          
              

    
           }
           else
           
           {
            let today = new Date();
            let time =
              today.getHours() +
              ":" +
              today.getMinutes() +
              ":" +
              today.getSeconds();

              var reqBody =  {
              
                "CommunityCenterRoomFeeDetails": [

                  {

                    "id": this.state.updateData.id,
                    "sector":  this.state.updateData.sectorName,
                    "fromDate" : `${this.state.updateData.fromDate} ${time}`, 
                    "totalNumberOfRooms":  this.state.updateData.totalNumberOfRooms,
                    "typeOfRoom":  this.state.updateData.typeOfRoom,
                    "rentForOneDay": this.state.updateData.rentForOneDay,
                    "rentFor3Hrs":  this.state.updateData.rentFor3Hrs,
                    "rentFor6Hrs":  this.state.updateData.rentFor6Hrs,
                    "rentFor9Hrs":  this.state.updateData.rentFor9Hrs,
                    "communityCenterName": this.state.updateData.communityCenterName
  
                  }
                 
                 ]
                }
              const responseStatus = await httpRequest(
                    
                "bookings/master/communitycenter/room/fee/_update",
                "_search",
                [],
                reqBody
              );
              if(responseStatus.status== '200'){
              this.props.toggleSnackbarAndSetText(
                true,
                {labelName: "Updated Successfully",
                labelKey: `Updated Successfully`} ,
                "success"
              );
              }else{
              this.props.toggleSnackbarAndSetText(
                true,
                {labelName: "Update Failed.Try Again",
                labelKey: `Update Failed.Try Again`} ,
                "error"
              );
              }
              
              this.props.handleClose()
              console.log(responseStatus, "createresponse")
            }
  
           
        }
        else{
          this.props.toggleSnackbarAndSetText(
            true,
            {labelName: "Please Fill All Required Fields",
            labelKey: `Please Fill All Required Fields`} ,
            "warning"
          );
        }
        
    }

    
    render() {
    
       
        const {classes,prepareFinalObject} =this.props
        return (

      
        Object.keys(this.state.mdmsRes).length === 0?<div > <CircularProgress style={{position: "fixed" , top: '50%', left: '50%'}} /> </div> :
        <div>
        <Dialog
            classes={{ paper :classes.dialogStyle}}
            minWidth="md"
            open={this.props.open}
            onClose={this.props.handleClose}
            aria-labelledby="form-dialog-title"
         >
        <DialogTitle id="form-dialog-title">Edit Open Space Fee Master</DialogTitle>
        <DialogContent style={{overflow : 'auto'}}>
          {/* <DialogContentText style={{margin : '15px '}}>
            Please fill the form to update fee master of OSBM
          </DialogContentText> */}

          <div className="col-xs-12 col-sm-12">
          <div className="col-xs-12 col-sm-6">
          <TextFieldContainer 
            error={this.state.errors.sectorName }
            select="true"
            optionValue="code"
            optionLabel="code"
            label={{
                labelName : "Sector",
                labelKey: "Sector",
            }}
            placeholder= {{
                labelName: "Sector",
                labelKey: "Sector",
            }}
            onChange={(e, key, value)=> { 
            
              let updateData =this.state.updateData
              updateData.sectorName= e.target.value
              let errors= {...this.state.errors}
              errors.sectorName=""
              this.setState({updateData: updateData, errors: errors})
              prepareFinalObject('updateData.sectorName', e.target.value)
              
            }}
            required= "true" 
            sourceJsonPath= "mdmsRes.Sector"
            jsonPath="updateData.sectorName"
             
            gridDefination= {{
                xs: 12,
                sm: 6
            }}
         />
         
          </div>
          <div className="col-xs-12 col-sm-6">
          <TextFieldContainer
            error={this.state.errors.totalNumberOfRooms }
            label={{
              labelName : "Total Number Of Rooms",
              labelKey: "Total Number Of Rooms",
              }}
            onChange={(e, value) => {
              
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.totalNumberOfRooms=""
              updateData.totalNumberOfRooms= e.target.value
              this.setState({updateData:updateData, errors:errors})
               prepareFinalObject('updateData.totalNumberOfRooms', e.target.value)
            }}
            
            fullWidth="true"
            placeholder= {{
              labelName: "Total Number Of Rooms",
              labelKey: "Total Number Of Rooms",
            }}
            
            jsonPath="updateData.totalNumberOfRooms"
             
            InputLabelProps={{
            shrink: true,
           }}
          /> 
          </div>
          </div>
          <div className="col-xs-12 col-sm-12">
          <div className="col-xs-12 col-sm-6">
          <TextFieldContainer 
            error={this.state.errors.typeOfRoom }
            select="true"
            optionValue="code"
            optionLabel="code"
            label={{
                labelName : "Type Of Room",
                labelKey: "Type Of Room",
            }}
            placeholder= {{
                labelName: "Type Of Room",
                labelKey: "Type Of Room",
            }}
            onChange={(e, key, value)=> { 
            
              let updateData =this.state.updateData
              updateData.typeOfRoom= e.target.value
              let errors= {...this.state.errors}
              errors.typeOfRoom=""
              this.setState({updateData: updateData, errors: errors})
              prepareFinalObject('updateData.typeOfRoom', e.target.value)
              
            }}
            required= "true" 
            sourceJsonPath= "roomType"
            jsonPath="updateData.typeOfRoom"
             
            gridDefination= {{
                xs: 12,
                sm: 6
            }}
         />
         
          </div>
          <div className="col-xs-12 col-sm-6">
            
          <TextFieldContainer 
            error={this.state.errors.communityCenterName }
            select="true"
            optionValue="code"
            optionLabel="code"
            label={{
                labelName : "Community Center Name",
                labelKey: "Community Center Name",
            }}
            placeholder= {{
                labelName: "Community Center Name",
                labelKey: "Community Center Name",
            }}
            onChange={(e, key, value)=> { 
            
              let updateData =this.state.updateData
              updateData.communityCenterName= e.target.value
              let errors= {...this.state.errors}
              errors.communityCenterName=""
              this.setState({updateData: updateData, errors: errors})
              prepareFinalObject('updateData.communityCenterName', e.target.value)
              
            }}
            required= "true" 
            sourceJsonPath= "ccNameList"
            jsonPath="updateData.communityCenterName"
             
            gridDefination= {{
                xs: 12,
                sm: 6
            }}
         />
         
          </div>
          </div>
          <div className="col-xs-12 col-sm-12">
          <div className="col-xs-12 col-sm-6">
          <TextFieldContainer
            error={this.state.errors.rentForOneDay }
            label={{
              labelName : "Rent For One Day",
              labelKey: "Rent For One Day",
              }}
            onChange={(e, value) => {
              
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.rentForOneDay=""
              updateData.rentForOneDay= e.target.value
              this.setState({updateData:updateData, errors:errors})
               prepareFinalObject('updateData.rentForOneDay', e.target.value)
            }}
            
            fullWidth="true"
            placeholder= {{
              labelName: "Rent For One Day",
              labelKey: "Rent For One Day",
            }}
            
            jsonPath="updateData.rentForOneDay"
             
            InputLabelProps={{
            shrink: true,
           }}
          />  
         </div>
          <div className="col-xs-12 col-sm-6">
          <TextFieldContainer
            error={this.state.errors.rentFor3Hrs }
            label={{
              labelName : "Rent For 3Hrs",
              labelKey: "Rent For 3Hrs",
              }}
            onChange={(e, value) => {
              
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.rentFor3Hrs=""
              updateData.rentFor3Hrs= e.target.value
              this.setState({updateData:updateData, errors:errors})
               prepareFinalObject('updateData.rentFor3Hrs', e.target.value)
            }}
            
            fullWidth="true"
            placeholder= {{
              labelName: "Rent For 3Hrs",
              labelKey: "Rent For 3Hrs",
            }}
            
            jsonPath="updateData.rentFor3Hrs"
             
            InputLabelProps={{
            shrink: true,
           }}
          />  
          </div>
          </div>
          <div className="col-xs-12 col-sm-12">
          <div className="col-xs-12 col-sm-6">
          <TextFieldContainer
            error={this.state.errors.rentFor6Hrs }
            label={{
              labelName : "Rent For 6Hrs",
              labelKey: "Rent For 6Hrs",
              }}
            onChange={(e, value) => {
              
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.rentFor6Hrs=""
              updateData.rentFor6Hrs= e.target.value
              this.setState({updateData:updateData, errors:errors})
               prepareFinalObject('updateData.rentFor6Hrs', e.target.value)
            }}
            
            fullWidth="true"
            placeholder= {{
              labelName: "Rent For 6Hrs",
              labelKey: "Rent For 6Hrs",
            }}
            
            jsonPath="updateData.rentFor6Hrs"
             
            InputLabelProps={{
            shrink: true,
           }}
          />  
          </div>
          <div className="col-xs-12 col-sm-6">
          <TextFieldContainer
            error={this.state.errors.rentFor9Hrs }
            label={{
              labelName : "Rent For 9Hrs",
              labelKey: "Rent For 9Hrs",
              }}
            onChange={(e, value) => {
              
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.rentFor9Hrs=""
              updateData.rentFor9Hrs= e.target.value
              this.setState({updateData:updateData, errors:errors})
               prepareFinalObject('updateData.rentFor9Hrs', e.target.value)
            }}
            
            fullWidth="true"
            placeholder= {{
              labelName: "Rent For 9Hrs",
              labelKey: "Rent For 9Hrs",
            }}
            
            jsonPath="updateData.rentFor9Hrs"
             
            InputLabelProps={{
            shrink: true,
           }}
          />  
          </div>
          </div>
          
          <div className="col-xs-12 col-sm-12">
          <div className="col-xs-12 col-sm-6">
          <TextFieldContainer 
            error={this.state.errors.fromDate }
            
            optionValue="code"
            optionLabel="code"
            label={{
                labelName : "From Date",
                labelKey: "BK_OSBM_ADMIN_FROM_DATE_LABEL",
            }}
            placeholder= {{
                labelName: "From Date",
                labelKey: "BK_OSBM_ADMIN_FROM_DATE_LABEL",
            }}
            type= "date"
            onChange={(e, key, value)=> { 

              
              
              let date = new Date(e.target.value);
              let oldDate = new Date(this.props.validFromDate)
              if (date.getTime() > oldDate.getTime()) {
                
                
                let updateData =this.state.updateData
                updateData.fromDate= e.target.value
                
                let errors= {...this.state.errors}
                errors.fromDate=""
                this.setState({updateData: updateData, errors: errors})
                prepareFinalObject('updateData.fromDate', e.target.value)

              } else {
                if(this.state.create===true){
                  this.props.toggleSnackbarAndSetText(
                    true,
                    {labelName: "Valid From Date Should Be Greater then Today",
                    labelKey: `Valid From Date Should Be Greater then Today`} ,
                    "error"
                  );
                }else{
                  this.props.toggleSnackbarAndSetText(
                    true,
                    {labelName: "New Valid From Date Should Be Greater then Selected Date",
                    labelKey: `New Valid From Date Should Be Greater then Selected Date`} ,
                    "error"
                  );
                }
               
              

                }
              
            }}
            required= "true" 
            
            jsonPath="updateData.fromDate"
            gridDefination= {{
                xs: 12,
                sm: 6
            }}
         />
          </div> 
          </div>
        </DialogContent>
                 <DialogActions>
          <Button label="Cancel" onClick={()=>{ this.props.handleClose()
            this.setState({errors : {}})}} color="secondary"/>
           
          <Button label={this.state.create===true? "Create":"Update"} onClick={()=>{ this.handleSubmit() }} primary={true} />
            
        </DialogActions>
    
      </Dialog>
                
    </div>
        
        
   )
 }
}






const mapStateToProps = (state, ownProps) => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  return {preparedFinalObject}
}



const mapDispatchToProps = dispatch => {
  return {
    prepareFinalObject: (jsonPath, value) =>
    dispatch(prepareFinalObject(jsonPath, value)),
   
    toggleSnackbarAndSetText: (open, message, error) =>
    dispatch(toggleSnackbarAndSetText(open, message, error)),
    
  };
};


export default (connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)( DialogComponent) ))
import React from "react";
import { Card, CardContent, Grid, Typography, Button,} from "@material-ui/core";
import {
  getQueryArg,
  
} from "egov-ui-framework/ui-utils/commons";
import { Container } from "egov-ui-framework/ui-atoms";
import {
  LabelContainer,
  TextFieldContainer
} from "egov-ui-framework/ui-containers";
import {

  getTransformedLocale
} from "egov-ui-framework/ui-utils/commons";
import Divider from "@material-ui/core/Divider";
import { convertEpochToDate } from "egov-ui-framework/ui-config/screens/specs/utils";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import get from "lodash/get";
import set from "lodash/set";
import { connect } from "react-redux";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
//import "./index.css";
const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    color: "#FE7A51"
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  }
});

class PensionReviewDataContainer extends React.Component {

  // Construcor(props){
  //   super(props)
  //   this.state ={ open:false}
  //   this.onEditClick = this.onEditClick.bind(this)
  // }
  state = {
    open: false,
    EditOpen:false,
   AddOpen:false,
    Index:0,
    currentObjUpdate: 0,
    value:[]
  };
  handleChange = (key, event,keyvalue) => {
    const { prepareFinalObject, toggleSnackbar, state, ProcessInstances } = this.props;
    const { value} = this.state; 
    //alert(event.target.value);
    if(keyvalue ==='remarks') 
    {
      prepareFinalObject(`ProcessInstances[0].pensionRevision[${this.state.Index}].${keyvalue}`,event.target.value)
    } 
    else{  
    if(Number(event.target.value) || event.target.value ==="")
    { 
    
    if(keyvalue ==='effectiveStartYear')
    {
      
      if(event.target.value.length<=4)
      {
        // var year = new Date().getFullYear()();
        // if(Number(event.target.value) >=year)
        // {
          //prepareFinalObject(`ProcessInstances[0].pensionRevision[${this.state.Index}].${keyvalue}`,Number(event.target.value))
          prepareFinalObject(`ProcessInstances[0].pensionRevision[${this.state.Index}].PensionRevisionYear`,[Number(event.target.value)])



            0
        //}
        // else{
        //   prepareFinalObject(`ProcessInstances[0].pensionRevisionadd[0].${keyvalue}`,0)
        // }
      }
    }
    else if(keyvalue ==='effectiveStartMonth')
    {
      if(event.target.value.length<=2)
      {
        
        if(Number(event.target.value)<=12)
        {
          //if(Number(event.target.value) >=month)
          prepareFinalObject(`ProcessInstances[0].pensionRevision[${this.state.Index}].${keyvalue}`,Number(event.target.value))
        }
        
      }
      
    
    }
    else {
      switch(keyvalue){

        case keyvalue:
          
          prepareFinalObject(`ProcessInstances[0].pensionRevision[${this.state.Index}].${keyvalue}`,Number(event.target.value))
      } 
    
    }
    
     
    }
  }
};

handleChangeadd = (key, event,keyvalue) => {
  const { prepareFinalObject, toggleSnackbar, state, ProcessInstances } = this.props;
  const { value} = this.state; 
  //alert(key)
  if(keyvalue ==='remarks') 
  {
    prepareFinalObject(`ProcessInstances[0].pensionRevisionadd[0].${keyvalue}`,event.target.value)
  } 
  else{ 
if(Number(event.target.value) || event.target.value ==="")
{ 

if(keyvalue ==='effectiveStartYear')
{
  
  if(event.target.value.length<=4)
  {
    // var year = new Date().getFullYear()();
    // if(Number(event.target.value) >=year)
    // {
      prepareFinalObject(`ProcessInstances[0].pensionRevisionadd[0].${keyvalue}`,Number(event.target.value))
    //}
    // else{
    //   prepareFinalObject(`ProcessInstances[0].pensionRevisionadd[0].${keyvalue}`,0)
    // }
  }
}
else if(keyvalue ==='effectiveStartMonth')
{
  if(event.target.value.length<=2)
  {
    
    if(Number(event.target.value)<=12)
    {
      //if(Number(event.target.value) >=month)
      prepareFinalObject(`ProcessInstances[0].pensionRevisionadd[0].${keyvalue}`,Number(event.target.value))
    }
    
  }
  

}
else {
  switch(keyvalue){
    case keyvalue:
      
      prepareFinalObject(`ProcessInstances[0].pensionRevisionadd[0].${keyvalue}`,Number(event.target.value))
  } 

}

 
}
  }
};

 
onEditSaveClick=async()=>{  
  const { prepareFinalObject, toggleSnackbar, state,ProcessInstances } = this.props;
  const {open, EditOpen, AddOpen, Index} = this.state; 
  try {  
    let Yearsystem = Number(new Date().getFullYear());
    let YearsMonth = Number(new Date().getMonth());
    let Year = 0
    let config =(ProcessInstances[1].configuration.pension.PensionConfig);
    let configDayMonth = 0;
    let Month = 0
    let ValidyearMonth = false;
    for (let index = 0; index < config.length; index++) {
      const element = config[index].key;
      if(config[index].key ==="DAY_OF_MONTHLY_PENSION_REGISTER_GENERATION")
      {
        configDayMonth= Number(config[index].value)
        break;
      }
    } 
    if(EditOpen)
    {
      Year = ProcessInstances[0].pensionRevision[Index].effectiveStartYear
    Month = ProcessInstances[0].pensionRevision[Index].effectiveStartMonth
    }
    else{
      Year = ProcessInstances[0].pensionRevisionadd[0].effectiveStartYear
      Month = ProcessInstances[0].pensionRevisionadd[0].effectiveStartMonth

    }
    //alert(Year+'_Month'+Month +'_'+Yearsystem)
    if(Year!== null)
    {
  if(Year >= Yearsystem)
  {
    // if( Year  >= Yearsystem ) 
    // {
      if(Month!== null)
      {
        
      if(Year  === Yearsystem && Month < YearsMonth +1)
      {
      // invalid current yeat previous month
      toggleSnackbar(
        true,
        {
        labelName: "Workflow returned empty object !",
        labelKey: "PENSION_INVALID_CURRENT_YEAR_PREVIOUS_MONTH"
        },
        "warning"
        );

      }
      else if(Year  === Yearsystem && Month === YearsMonth +1)
      {
        if(new Date().getDay() >= configDayMonth)
        {
          // invalid submssion date as 
          toggleSnackbar(
            true,
            {
            labelName: "Revesion data can't be update on or after dat of monthly pension register generation!",
            labelKey: "PENSION_INVALID_SUBMMISION_DATE"
            },
            "warning"
            );
        }
        else 
        {
          ValidyearMonth = true;
        }

      }
      else{
        ValidyearMonth = true;

      }
      if(ValidyearMonth)
      {
        // call api
        let response =[];    
        if(EditOpen)
      {
        response = await httpRequest(
          "post",
          "/pension-services/v1/_updateRevisedPension",
          "",
          [],
          { ProcessInstances: [
    
            {
              tenantId:ProcessInstances[0].tenantId, 
              pensioner:ProcessInstances[0].pensioner,         
              pensionRevision:[ProcessInstances[0].pensionRevision[Index]]
            }
          ] 
          
          }
          );    
      }
      else{
        
        response = await httpRequest(
          "post",
          "/pension-services/v1/_createRevisedPension",
          "",
          [],
          { ProcessInstances: [
    
            {
              tenantId:ProcessInstances[0].tenantId,
              pensioner:ProcessInstances[0].pensioner,
              pensionRevision:[ProcessInstances[0].pensionRevisionadd[0]]
            }
          ] 
          
          }
          );   
        
      }
      console.log(response)
      toggleSnackbar(
        true,
        {
        labelName: "Pension Revesion add edit success meaasge!",
        labelKey: "PENSION_ADD_EDIT_SUCCESS_MESSAGE"
        },
        "success"
        );

      }
    }
    else{
      toggleSnackbar(
        true,
        {
        labelName: "Input Valid month!",
        labelKey: "PENSION_MONTH_ISNULL"
        },
        "warning"
        );

    }
      

   // }
  }
else{
  //alert('qw34')
  toggleSnackbar(
    true,
    {
    labelName: "Invalid Year !",
    labelKey: "PENSION_INVALID_REVESION_CURRENT_YEAR"
    },
    "warning"
    );
  }
    }
else{
  toggleSnackbar(
    true,
    {
    labelName: "Input Valid Year !",
    labelKey: "PENSION_REVESION_YEAR_NULL"
    },
    "warning"
    );

}

  }
  catch (e) {
  console.log(e)
  toggleSnackbar(
  true,
  {
  labelName: "Workflow returned empty object !",
  labelKey: "PENSION_ERROR_REVISED_PENSION_ADD_EDIT"
  },
  "error"
  );
  }

  }
  
    onAddSaveClick=async()=>{
      const { prepareFinalObject, toggleSnackbar, state,ProcessInstances } = this.props;
      try {  
        const tenantId = getQueryArg(window.location.href, "tenantId");
        let queryObject = [
        {
        key: "tenantId",
        value: tenantId
        }];     
        let response = await httpRequest(
        "post",
        "/pension-services/v1/_createRevisedPension",
        "",
        [],
        { 
          ProcessInstances: [
                              {
                              tenantId:ProcessInstances[0].tenantId,
                              pensioner:ProcessInstances[0].pensioner,
                              revisedPension:[
                                
                                ProcessInstances[0].pensionRevisionadd[0]
                              ]
                              }
                            ] 
        }
        );
        console.log(response);
  
      }
      catch (e) {
      console.log(e)
      toggleSnackbar(
      true,
      {
      labelName: "Workflow returned empty object !",
      labelKey: "WRR_WORKFLOW_ERROR"
      },
      "error"
      );
      }
    }
    onAddClick= async()=>{
    
    const {open, EditOpen} = this.state;   
    const { prepareFinalObject, toggleSnackbar, state,ProcessInstances } = this.props;
    this.setState( { AddOpen:true}) 
    this.setState( { EditOpen:false})  
        prepareFinalObject("ProcessInstances[0].pensionRevisionadd[0].effectiveStartYear",0)
        prepareFinalObject("ProcessInstances[0].pensionRevisionadd[0].effectiveStartMonth",0)
        prepareFinalObject("ProcessInstances[0].pensionRevisionadd[0].pensionArrear",0)
        prepareFinalObject("ProcessInstances[0].pensionRevisionadd[0].fma",0)
        prepareFinalObject("ProcessInstances[0].pensionRevisionadd[0].miscellaneous",0)
        prepareFinalObject("ProcessInstances[0].pensionRevisionadd[0].overPayment",0)
        prepareFinalObject("ProcessInstances[0].pensionRevisionadd[0].incomeTax",0)
        prepareFinalObject("ProcessInstances[0].pensionRevisionadd[0].cess",0)
        prepareFinalObject("ProcessInstances[0].pensionRevisionadd[0].basicPension",0)
        prepareFinalObject("ProcessInstances[0].pensionRevisionadd[0].additionalPension",0)
        prepareFinalObject("ProcessInstances[0].pensionRevisionadd[0].commutedPension",0)
        prepareFinalObject("ProcessInstances[0].pensionRevisionadd[0].netDeductions",0)
        prepareFinalObject("ProcessInstances[0].pensionRevisionadd[0].finalCalculatedPension",0)
        prepareFinalObject("ProcessInstances[0].pensionRevisionadd[0].interimRelief",0)
        prepareFinalObject("ProcessInstances[0].pensionRevisionadd[0].da",0)
        prepareFinalObject("ProcessInstances[0].pensionRevisionadd[0].totalPension",0)
        prepareFinalObject("ProcessInstances[0].pensionRevisionadd[0].pensionDeductions",0)
        prepareFinalObject("ProcessInstances[0].pensionRevisionadd[0].woundExtraordinaryPension",0)
        prepareFinalObject("ProcessInstances[0].pensionRevisionadd[0].attendantAllowance",0)
        prepareFinalObject("ProcessInstances[0].pensionRevisionadd[0].remarks","")
    
    
    
    }
    onDiscontinuationClick = async()=>{
      const { prepareFinalObject, toggleSnackbar, state,ProcessInstances } = this.props;
      try {  
        const tenantId = getQueryArg(window.location.href, "tenantId");
        let queryObject = [
        {
        key: "tenantId",
        value: tenantId
        }];     
        let response = await httpRequest(
        "post",
        "/pension-services/v1/_pensionerPensionDiscontinuation",
        "",
        [],
        { 
          ProcessInstances: [
                              {
                              tenantId:ProcessInstances[0].tenantId,
                              pensioner:{
                                pensionerNumber:ProcessInstances[0].pensioner.pensionerNumber,
                              }
                              
                              }
                            ] 
        }
        );
        console.log(response);
        toggleSnackbar(
          true,
          {
          labelName: "Pension is discontineou of this pensioner from next month!",
          labelKey: "PENSION_REVIEW_PENSIONER_DISCONTINUATION_SUCCESS_MESSAGE"
          },
          "success"
          );
  
      }
      catch (e) {
      console.log(e)
      toggleSnackbar(
      true,
      {
      labelName: "Workflow returned empty object !",
      labelKey: "PENSION_API_EXCEPTION_ERROR"
      },
      "error"
      );
      }

    }
    onCalculateClick=async()=>{
    const { prepareFinalObject, toggleSnackbar, state,ProcessInstances } = this.props;
    const {open, EditOpen, AddOpen, Index} = this.state; 
    // alert(EditOpen)
    // alert(AddOpen)
    try {  
      const tenantId = getQueryArg(window.location.href, "tenantId");
      let queryObject = [
      {
      key: "tenantId",
      value: tenantId
      }];  
      let pensionRevision = null;
      if(EditOpen)
      {
        pensionRevision = ProcessInstances[0].pensionRevision[Index];
      }
      else{
        pensionRevision = ProcessInstances[0].pensionRevisionadd[0];

      }
      let response = await httpRequest(
      "post",
      "/pension-calculator/v1/_calculateRevisedPension",
      "",
      [],
      { 
        ProcessInstances: [
                            {
                            tenantId:ProcessInstances[0].tenantId,
                            pensionRevision:[pensionRevision]
                            }
                          ] 
      }
      );
      
      let payload_= get(
        response,
        "ProcessInstances[0].pensionRevision",
        []
      );
      console.log(payload_);
      if(EditOpen)
      {
        prepareFinalObject(`ProcessInstances[0].pensionRevision[${Index}]`,payload_[0])

      }
      else{
        prepareFinalObject("ProcessInstances[0].pensionRevisionadd[0]",payload_[0])

      }
    }
    catch (e) {
    console.log(e)
    toggleSnackbar(
    true,
    {
    labelName: "Workflow returned empty object !",
    labelKey: "WRR_WORKFLOW_ERROR"
    },
    "error"
    );
    }
  
    }
  onEditClick = async (data,key) => {
    // const { prepareFinalObject, toggleSnackbar, state } = this.props;
    // this.currentObjUpdate = data;
    const {open, EditOpen} = this.state;   
    this.currentObjUpdate = data 
    this.setState( { open:true})
    this.setState( { EditOpen:true}) 
    this.setState( { AddOpen:false})   
    this.setState( { Index:key})    
    
 
  };
  componentDidMount = async () => {
    const { prepareFinalObject, toggleSnackbar } = this.props;
    
  };

  render() {
    

    //Alert.alert(date + '-' + month + '-' + year);
    
    const { classes, ProcessInstances ,preparedFinalObject,applyScreenMdmsData,  handleFieldChange} = this.props;
    const { currentObjUpdate, onEditClick } = this;
    const currentObj =
    ProcessInstances && ProcessInstances[0];
    let currentObjE = currentObj//[];
    console.log(ProcessInstances)
    console.log("ProcessInstances")
    let DOE_INFO_VISIBLE = false;
    let  PensionRevisionYear = [

      {
        value:"2020",
        label:"2021"
      },
      {
        value:"2021",
        label:"2021"
      }
    ];//ProcessInstances && ProcessInstances[1].configuration.pension.PensionRevisionYear;
    if(!this.state.EditOpen)
    {
       currentObjE = 
      ProcessInstances && ProcessInstances[0];

    }
let businessService = get(ProcessInstances[0], 'pensioner.businessService')
//alert(businessService)
if(businessService !=="RRP_SERVICE")
{
    DOE_INFO_VISIBLE = true;
}
    prepareFinalObject("ProcessInstances[0].pensionRevisiontemp[0]",currentObj)
      let showFooter=process.env.REACT_APP_NAME === "Citizen" ? false : false;
      let index = 0;
     // let jsonPath = `ProcessInstances[0].pensionRevision[${index}].dropdown.value`;
    return (
     
      <div>
        
        <Card className="">
          <CardContent>
            <Container
              children={
                <div style={{ width: "100%" }}>
                  <Grid container="true" spacing={12} marginTop={16}>
                    <Grid
                      style={{ alignItems: "center", display: "flex" }}
                      item
                      sm={6}
                      xs={6}
                    >
                      <Typography component="h2" variant="subheading">
                        <LabelContainer
                          labelName="EMPLOYEE SERVICE DATA"
                          labelKey="PENSION_EMPLOYEE_SERVICE_DATA"
                        />
                      </Typography>
                    </Grid>
                   
                    
                  </Grid>

                  <Grid
      container={true}
      spacing={12}
      style={{ paddingLeft: 10, paddingBottom: 2 }}
    >
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        lg={2}
        style={{ marginTop: 10, paddingRight: 20 }}
      >
        <Typography variant="caption">
          <LabelContainer labelName="pensionerName" labelKey="PENSION_PENSIONER_NAME" />
        </Typography>
        <Typography variant="body2">
        <LabelContainer labelName={get(currentObj, "pensioner.name")} />
        </Typography>
      </Grid>
     
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        lg={2}
        style={{ marginTop: 10, paddingRight: 20 }}
      >
        <Typography variant="caption">
          <LabelContainer
            labelName="pensionerNumber"
            labelKey="PENSION_PENSIONER_NUMBER"
          />
        </Typography>
        <Typography
          variant="body2"
          classes={{
            body2: "body2-word-wrap"
          }}
        >
          <LabelContainer labelName={get(currentObj, "pensioner.pensionerNumber")} /> 
        </Typography>
      </Grid>
      
     
    </Grid>
    <Divider className={classes.root} />
      <div style={{ width: "100%" }}>
                  <Grid container="true" spacing={12} marginTop={16}>
                    <Grid
                      style={{ alignItems: "center", display: "flex" }}
                      item
                      sm={6}
                      xs={6}
                    >
                      <Typography component="h2" variant="subheading">
                        <LabelContainer
                          labelName="Pension Calculation Update Details"
                          labelKey="PENSION_PENSION_REVISION_VERIFIED_DATA_DETAILS"
                        />
                      </Typography>
                      <br/>
                    </Grid>
                    </Grid>
                     <Grid container="true" spacing={12} marginTop={16}>
                    <br/>
                    <Grid item xs={12} sm={6} md={4}lg={2} style={{ marginTop: 10, paddingRight: 20 }}>
                      <Typography variant="caption">
                      <LabelContainer labelName="basicPensionVerified" labelKey="PENSION_EMPLOYEE_PENSION_BP_V" />
                      </Typography>
                      <Typography variant="body2">
                      <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.basicPension")} />
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}lg={2} style={{ marginTop: 10, paddingRight: 20 }}>
                      <Typography variant="caption">
                      <LabelContainer labelName="pensionDeductionsVerified" labelKey="PENSION_EMPLOYEE_PENSION_PD_V" />
                      </Typography>
                      <Typography variant="body2">
                      <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.pensionDeductions")} />
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}lg={2} style={{ marginTop: 10, paddingRight: 20 }}>
                      <Typography variant="caption">
                      <LabelContainer labelName="additionalPensionVerified" labelKey="PENSION_EMPLOYEE_PENSION_AP_V" />
                      </Typography>
                      <Typography variant="body2">
                      <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.additionalPension")} />
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}lg={2} style={{ marginTop: 10, paddingRight: 20 }}>
                      <Typography variant="caption">
                      <LabelContainer labelName="commutedPensionVerified" labelKey="PENSION_EMPLOYEE_PENSION_CP_V" />
                      </Typography>
                      <Typography variant="body2">
                      <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.commutedPension")} />
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}lg={2} style={{ marginTop: 10, paddingRight: 20 }}>
                      <Typography variant="caption">
                      <LabelContainer labelName="commutedValueVerified" labelKey="PENSION_EMPLOYEE_PENSION_CV_V" />
                      </Typography>
                      <Typography variant="body2">
                      <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.commutedValue")} />
                      </Typography>
                    </Grid>
                    {
                        DOE_INFO_VISIBLE&&(
                            <Grid item xs={12} sm={6} md={4}lg={2} style={{ marginTop: 10, paddingRight: 20 }}>
                      <Typography variant="caption">
                      <LabelContainer labelName="familyPensionIVerified" labelKey="PENSION_EMPLOYEE_PENSION_AFP1_V" />
                      </Typography>
                      <Typography variant="body2">
                      <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.familyPensionI")} />
                      </Typography>
                    </Grid>
                        )                            
                    }
                    {
                        DOE_INFO_VISIBLE&&(
                    <Grid item xs={12} sm={6} md={4}lg={2} style={{ marginTop: 10, paddingRight: 20 }}>
                      <Typography variant="caption">
                      <LabelContainer labelName="familyPensionIIVerified" labelKey="PENSION_EMPLOYEE_PENSION_AFP2_V" />
                      </Typography>
                      <Typography variant="body2">
                      <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.familyPensionII")} />
                      </Typography>
                    </Grid>
                        )}
                    <Grid item xs={12} sm={6} md={4}lg={2} style={{ marginTop: 10, paddingRight: 20 }}>
                      <Typography variant="caption">
                      <LabelContainer labelName="dcrgVerified" labelKey="PENSION_EMPLOYEE_PENSION_DCRG_V" />
                      </Typography>
                      <Typography variant="body2">
                      <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.dcrg")} />
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}lg={2} style={{ marginTop: 10, paddingRight: 20 }}>
                      <Typography variant="caption">
                      <LabelContainer labelName="finalCalculatedPensionVerified" labelKey="PENSION_EMPLOYEE_PENSION_FINAL_CALCULATION_V" />
                      </Typography>
                      <Typography variant="body2">
                      <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.finalCalculatedPension")} />
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}lg={2} style={{ marginTop: 10, paddingRight: 20 }}>
                      <Typography variant="caption">
                      <LabelContainer labelName="interimReliefVerified" labelKey="PENSION_EMPLOYEE_PENSION_IR_V" />
                      </Typography>
                      <Typography variant="body2">
                      <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.interimRelief")} />
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}lg={2} style={{ marginTop: 10, paddingRight: 20 }}>
                      <Typography variant="caption">
                      <LabelContainer labelName="daVerified" labelKey="PENSION_EMPLOYEE_PENSION_DA_V" />
                      </Typography>
                      <Typography variant="body2">
                      <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.da")} />
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}lg={2} style={{ marginTop: 10, paddingRight: 20 }}>
                      <Typography variant="caption">
                      <LabelContainer labelName="nqsYearVerified" labelKey="PENSION_EMPLOYEE_PENSION_NQS_YEAR_V" />
                      </Typography>
                      <Typography variant="body2">
                      <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.nqsYear")} />
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}lg={2} style={{ marginTop: 10, paddingRight: 20 }}>
                      <Typography variant="caption">
                      <LabelContainer labelName="nqsMonthVerified" labelKey="PENSION_EMPLOYEE_PENSION_NQS_MONTH_V" />
                      </Typography>
                      <Typography variant="body2">
                      <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.nqsMonth")} />
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}lg={2} style={{ marginTop: 10, paddingRight: 20 }}>
                      <Typography variant="caption">
                      <LabelContainer labelName="nqsDayVerified" labelKey="PENSION_EMPLOYEE_PENSION_NQS_DAY_V" />
                      </Typography>
                      <Typography variant="body2">
                      <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.nqsDay")} />
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}lg={2} style={{ marginTop: 10, paddingRight: 20 }}>
                      <Typography variant="caption">
                      <LabelContainer labelName="compassionatePensionVerified" labelKey="PENSION_EMPLOYEE_PENSION_COMP_V" />
                      </Typography>
                      <Typography variant="body2">
                      <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.compassionatePension")} />
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}lg={2} style={{ marginTop: 10, paddingRight: 20 }}>
                      <Typography variant="caption">
                      <LabelContainer labelName="compensationPensionVerified" labelKey="PENSION_EMPLOYEE_PENSION_COM_P_S" />
                      </Typography>
                      <Typography variant="body2">
                      <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.compensationPension")} />
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}lg={2} style={{ marginTop: 10, paddingRight: 20 }}>
                      <Typography variant="caption">
                      <LabelContainer labelName="terminalBenefitVerified" labelKey="PENSION_EMPLOYEE_PENSION_TB_V" />
                      </Typography>
                      <Typography variant="body2">
                      <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.terminalBenefit")} />
                      </Typography>
                    </Grid><Grid item xs={12} sm={6} md={4}lg={2} style={{ marginTop: 10, paddingRight: 20 }}>
                      <Typography variant="caption">
                      <LabelContainer labelName="finalCalculatedGratuityVerified" labelKey="PENSION_EMPLOYEE_PENSION_FCG_V" />
                      </Typography>
                      <Typography variant="body2">
                      <LabelContainer labelName={get(currentObj, "pensionerFinalCalculatedBenefitDetails.finalCalculatedGratuity")} />
                      </Typography>
                    </Grid>
                    
                  </Grid>
                  </div>
            
    <Divider className={classes.root} />
    <Grid container="true" spacing={12} marginTop={16}>
      <div>
         <div style={{ width: "100%" }}>
                  <Grid container="true" spacing={12} marginTop={16}>
                    <Grid
                      style={{ alignItems: "center", display: "flex" }}
                      item
                      sm={6}
                      xs={6}
                    >
                      <Typography component="h2" variant="subheading">
                        <LabelContainer
                          labelName="pension Revision Details"
                          labelKey="PENSION_PENSION_REVISION_DATA_DETAILS"
                        />
                      </Typography>
                    </Grid>
                    <Grid style={{ alignItems: "right", display: "flex" }}
                      item
                      sm={6}
                      xs={6}
                    >
                    <Button  color="primary"  onClick={() => this.onAddClick()} style={{ alignItems: "right"}}>
                  <LabelContainer
                           labelName="ADD"
                          labelKey="PENSION_ADD"
                          color="#FE7A51"/> </Button>
                          <Button  color="primary"  onClick={() => this.onDiscontinuationClick()} style={{ alignItems: "right"}}>
                  <LabelContainer
                           labelName="ADD"
                          labelKey="PENSION_DISCONTINUATION"
                          color="#FE7A51"/> </Button>
                    </Grid>
                  

                  
                    
                  </Grid>
                  </div>
                  <div style={{ width: "100%" }}>
      
       
       
      {currentObjE&& currentObjE.pensionRevision.map((row, i) => {
                return (
                  <CardContent>
                    <Container style={{backgroundColor: "rgb(242, 242, 242)",  boxShadow: "none",borderRadius: 0, overflow: "visible"}}
              children={
               
                   <Grid container="true" spacing={12} marginTop={16}>
                     <Grid item xs={12} sm={6} md={4}lg={12} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                        
                        </Grid>
                     {
                       row.isEditEnabled &&( <Grid item xs={12} sm={6} md={4}lg={12} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                        <Button  color="primary" onClick={() => this.onEditSaveClick(i)}  style={{ alignItems: "right"}}>
                                     <LabelContainer
                                             labelName="SAVE"
                                             labelKey="PENSION_SAVE"
                                             color="#FE7A51"/> </Button>
                                             <Button  color="primary" onClick={() => this.onCalculateClick()}  style={{ alignItems: "right"}}>
                                     <LabelContainer
                                             labelName="ADD"
                                             labelKey="PENSION_REVISION_CALCULATE"
                                             color="#FE7A51"/> </Button>
                        </Grid>)
                     }

                    
                     <Grid item xs={12} sm={6} md={4}lg={6} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                     <TextFieldContainer
                      select={true}
                      label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_ESY") }}
                      disabled={!row.isEditEnabled}
                      data ={PensionRevisionYear}
                      optionValue="value"
                      optionLabel="label"
                    
                      //sourceJ[];//sonPath={"ProcessInstances[1].configuration.pension.PensionRevisionYear"}
                      placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_ESY" }}
                      //onChange={event => this.handleChange(index++, event,'effectiveStartYear')}
                      onChange={e =>
                        handleFieldChange(
                          `ProcessInstances[0].pensionRevision[${i}].PensionRevisionYear`,
                          [e.target.value]
                        )
                      }
                      onKeyPress={event => this.onKeyPress(event)}
                      pattern='/^[0-9\b]+$/'
                      //jsonPath="ProcessInstances[0].pensionRevision[0].effectiveStartYear"
                      //jsonPath={`ProcessInstances[0].configuration.pension.PensionRevisionYear[0]`}
                     jsonPath={`ProcessInstances[0].pensionRevision[${i}].PensionRevisionYear[0]`}
                      />
                     </Grid>
                     <Grid item xs={12} sm={6} md={4}lg={6} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                     <TextFieldContainer
                      select={false}
                      disabled={!row.isEditEnabled}
                      label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_ESM") }}
                      placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_ESM" }}
                      onChange={event => this.handleChange(index++, event,'effectiveStartMonth')}
                      pattern='/^[0-9\b]+$/'
                      //jsonPath={`ProcessInstances[0].pensionRevision[${i}].effectiveStartMonth`}
                      jsonPath={`ProcessInstances[0].pensionRevision[${i}].effectiveStartMonth`}
                      />
                     </Grid>
                     <Grid item xs={12} sm={6} md={4}lg={6} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                     <TextFieldContainer
                      select={false}
                      disabled={!row.isEditEnabled}
                      label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_BP_R") }}
                      placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_BP_R" }}
                      onChange={event => this.handleChange(index++, event,'basicPension')}
                      pattern='/^[0-9\b]+$/'
                      //jsonPath={`ProcessInstances[0].pensionRevision[${i}].basicPension`}
                      jsonPath={`ProcessInstances[0].pensionRevision[${i}].basicPension`}
                      />
                     </Grid>
                     <Grid item xs={12} sm={6} md={4}lg={6} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                     <TextFieldContainer
                      select={false}
                      disabled={!row.isEditEnabled}
                      label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_TP_R") }}
                      placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_TP_R" }}
                      onChange={event => this.handleChange(index++, event,'totalPension')}
                      disabled={true}
                      pattern='/^[0-9\b]+$/'
                      //jsonPath={`ProcessInstances[0].pensionRevision[${i}].totalPension`}
                      jsonPath={`ProcessInstances[0].pensionRevision[${i}].totalPension`}
                      />
                     </Grid>
                     <Grid item xs={12} sm={6} md={4}lg={6} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                     <TextFieldContainer
                      select={false}
                      disabled={!row.isEditEnabled}
                      label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_DA_R") }}
                      placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_DA_R" }}
                      onChange={event => this.handleChange(index++, event,'da')}
                      pattern='/^[0-9\b]+$/'
                      //jsonPath={`ProcessInstances[0].pensionRevision[${i}].da`}
                      jsonPath={`ProcessInstances[0].pensionRevision[${i}].da`}
                      />
                     </Grid>
                     <Grid item xs={12} sm={6} md={4}lg={6} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                     <TextFieldContainer
                      select={false}
                      disabled={!row.isEditEnabled}
                      label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_OVER_PAYMENT_R") }}
                      placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_OVER_PAYMENT_R" }}
                      onChange={event => this.handleChange(index++, event,'overPayment')}
                      pattern='/^[0-9\b]+$/'
                      //jsonPath={`ProcessInstances[0].pensionRevision[${i}].overPayment`}
                      jsonPath={`ProcessInstances[0].pensionRevision[${i}].overPayment`}
                      />
                     </Grid>
                     <Grid item xs={12} sm={6} md={4}lg={6} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                     <TextFieldContainer
                      select={false}
                      disabled={!row.isEditEnabled}
                      label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_COMMMUTED_PEENSION_R") }}
                      placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_COMMMUTED_PEENSION_R" }}
                      onChange={event => this.handleChange(index++, event,'commutedPension')}
                      pattern='/^[0-9\b]+$/'
                      //jsonPath={`ProcessInstances[0].pensionRevision[${i}].commutedPension`}
                      jsonPath={`ProcessInstances[0].pensionRevision[${i}].commutedPension`}
                      />
                     </Grid>
                     <Grid item xs={12} sm={6} md={4}lg={6} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                     <TextFieldContainer
                      select={false}
                      disabled={!row.isEditEnabled}
                      label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_INCOMETAX_R") }}
                      placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_INCOMETAX_R" }}
                      onChange={event => this.handleChange(index++, event,'incomeTax')}
                      pattern='/^[0-9\b]+$/'
                      //jsonPath={`ProcessInstances[0].pensionRevision[${i}].incomeTax`}
                      jsonPath={`ProcessInstances[0].pensionRevision[${i}].incomeTax`}
                      />
                     </Grid>
                     <Grid item xs={12} sm={6} md={4}lg={6} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                     <TextFieldContainer
                      select={false}
                      disabled={!row.isEditEnabled}
                      label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_AP_R") }}
                      placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_AP_R" }}
                      onChange={event => this.handleChange(index++, event,'additionalPension')}
                      pattern='/^[0-9\b]+$/'
                      //jsonPath={`ProcessInstances[0].pensionRevision[${i}].additionalPension`}
                      jsonPath={`ProcessInstances[0].pensionRevision[${i}].additionalPension`}
                      />
                     </Grid>
                     <Grid item xs={12} sm={6} md={4}lg={6} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                     <TextFieldContainer
                      select={false}
                      disabled={!row.isEditEnabled}
                      label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_CESS_R") }}
                      placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_CESS_R" }}
                      onChange={event => this.handleChange(index++, event,'cess')}
                      pattern='/^[0-9\b]+$/'
                      //jsonPath={`ProcessInstances[0].pensionRevision[${i}].cess`}
                      jsonPath={`ProcessInstances[0].pensionRevision[${i}].cess`}
                      />
                     </Grid>
                     <Grid item xs={12} sm={6} md={4}lg={6} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                     <TextFieldContainer
                      select={false}
                      disabled={!row.isEditEnabled}
                      label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_IR_R") }}
                      placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_IR_R" }}
                      onChange={event => this.handleChange(index++, event,'interimRelief')}
                      pattern='/^[0-9\b]+$/'
                      //jsonPath={`ProcessInstances[0].pensionRevision[${i}].interimRelief`}
                      jsonPath={`ProcessInstances[0].pensionRevision[${i}].interimRelief`}
                      />
                     </Grid>
                     <Grid item xs={12} sm={6} md={4}lg={6} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                     <TextFieldContainer
                      select={false}
                      disabled={!row.isEditEnabled}
                      label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_PD_R") }}
                      placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_PD_R" }}
                      onChange={event => this.handleChange(index++, event,'pensionDeductions')}
                      pattern='/^[0-9\b]+$/'
                      jsonPath={`ProcessInstances[0].pensionRevision[${i}].pensionDeductions`}
                      //jsonPath="ProcessInstances[0].pensionRevision[${i}].pensionDeductions"
                      />
                     </Grid>
                     <Grid item xs={12} sm={6} md={4}lg={6} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                     <TextFieldContainer
                      select={false}
                      disabled={!row.isEditEnabled}
                      label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_MR_R") }}
                      placeholder={{ labelKey: "PENSION_EMPLOYEE_MR_R" }}
                      onChange={event => this.handleChange(index++, event,'fma')}
                      pattern='/^[0-9\b]+$/'
                      jsonPath={`ProcessInstances[0].pensionRevision[${i}].fma`}
                      //jsonPath="ProcessInstances[0].pensionRevision[${i}].fma"
                      />
                     </Grid>
                     <Grid item xs={12} sm={6} md={4}lg={6} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                     <TextFieldContainer
                      select={false}

                      label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_NET_DEDUCTION_R") }}
                      placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_NET_DEDUCTION_R" }}
                      onChange={event => this.handleChange(index++, event,'netDeductions')}
                      disabled={true}
                      pattern='/^[0-9\b]+$/'
                      jsonPath={`ProcessInstances[0].pensionRevision[${i}].netDeductions`}
                      //jsonPath="ProcessInstances[0].pensionRevision[${i}].netDeductions"
                      />
                      </Grid>
                     <Grid item xs={12} sm={6} md={4}lg={6} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                     <TextFieldContainer
                      select={false}
                      disabled={!row.isEditEnabled}
                      label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_MISCELLENOUS_R") }}
                      placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_MISCELLENOUS_R" }}
                      onChange={event => this.handleChange(index++, event,'miscellaneous')}
                      pattern='/^[0-9\b]+$/'
                      jsonPath={`ProcessInstances[0].pensionRevision[${i}].miscellaneous`}
                      //jsonPath="ProcessInstances[0].pensionRevision[${i}].miscellaneous"
                      />
                     </Grid>
                     <Grid item xs={12} sm={6} md={4}lg={6} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                     <TextFieldContainer
                      select={false}
                      label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_FINAL_DEDUCTION_R") }}
                      placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_FINAL_DEDUCTION_R" }}
                      onChange={event => this.handleChange(index++, event,'finalCalculatedPension')}
                      pattern='/^[0-9\b]+$/'
                      disabled={true}
                      jsonPath={`ProcessInstances[0].pensionRevision[${i}].finalCalculatedPension`}
                      //jsonPath="ProcessInstances[0].pensionRevision[0].finalCalculatedPension"
                      />
                     </Grid>
                     <Grid item xs={12} sm={6} md={4}lg={6} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                     <TextFieldContainer
                      select={false}
                      label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_WOUNDED_PENSION_R") }}
                      placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_WOUNDED_PENSION_R" }}
                      onChange={event => this.handleChange(index++, event,'woundExtraordinaryPension')}
                      pattern='/^[0-9\b]+$/'
                      //jsonPath={`ProcessInstances[0].pensionRevisionadd[${i}].woundExtraordinaryPension`}
                      jsonPath={`ProcessInstances[0].pensionRevision[${i}].woundExtraordinaryPension`}
                      />
                     </Grid>
                     <Grid item xs={12} sm={6} md={4}lg={6} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                     <TextFieldContainer
                      select={false}
                      label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_FINAL_TEN_ALLOWANCE_R") }}
                      placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_FINAL_TEN_ALLOWANCE_R" }}
                      onChange={event => this.handleChange(index++, event,'attendantAllowance')}
                      pattern='/^[0-9\b]+$/'
                      disabled={!row.isEditEnabled}
                      //jsonPath={`ProcessInstances[0].pensionRevisionadd[${i}].attendantAllowance`}
                      jsonPath={`ProcessInstances[0].pensionRevision[${i}].attendantAllowance`}
                      />
                     </Grid>
                     <Grid item xs={12} sm={6} md={4}lg={6} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                     <TextFieldContainer
                      select={false}
                      disabled={!row.isEditEnabled}
                      label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_REMARKS_R") }}
                      placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_REMARKS_R" }}
                      onChange={event => this.handleChange(index++, event,'remarks')}
                      pattern='/^[0-9\b]+$/'
                      //jsonPath={`ProcessInstances[0].pensionRevisionadd[${i}].remarks`}
                      jsonPath={`ProcessInstances[0].pensionRevision[${i}].remarks`}
                      />
                     </Grid>
                     

</Grid>
               
              }
              /> </CardContent>
    
                )
      })
    }
    </div>
    </div> 
           
    </Grid>
    <Divider className={classes.root} />
   {
     this.state.EditOpen&& <div>
     
     {

<table  style={{ width:"-webkit-fill-available" }}>
<tr>
<td> 
<TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_ESY") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_ESY" }}
onChange={event => this.handleChange(index++, event,'effectiveStartYear')}
//onKeyPress={event => this.onKeyPress(event)}
pattern='/^[0-9\b]+$/'
//jsonPath="ProcessInstances[0].pensionRevision[0].effectiveStartYear"
jsonPath={`ProcessInstances[0].pensionRevision[${this.state.Index}].effectiveStartYear`}
/>
</td>
<td> <TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_ESM") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_ESM" }}
onChange={event => this.handleChange(index++, event,'effectiveStartMonth')}
pattern='/^[0-9\b]+$/'
//jsonPath={`ProcessInstances[0].pensionRevision[${this.state.Index}].effectiveStartMonth`}
jsonPath={`ProcessInstances[0].pensionRevision[${this.state.Index}].effectiveStartMonth`}
/></td></tr>

<tr>

<td> 
<TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_BP_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_BP_R" }}
onChange={event => this.handleChange(index++, event,'basicPension')}
pattern='/^[0-9\b]+$/'
//jsonPath={`ProcessInstances[0].pensionRevision[${this.state.Index}].basicPension`}
jsonPath={`ProcessInstances[0].pensionRevision[${this.state.Index}].basicPension`}
/>
</td>
<td>
<TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_TP_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_TP_R" }}
onChange={event => this.handleChange(index++, event,'totalPension')}
disabled={true}
pattern='/^[0-9\b]+$/'
//jsonPath={`ProcessInstances[0].pensionRevision[${this.state.Index}].totalPension`}
jsonPath={`ProcessInstances[0].pensionRevision[${this.state.Index}].totalPension`}
/>
</td>
  </tr>

  <tr>
      <td> <TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_DA_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_DA_R" }}
onChange={event => this.handleChange(index++, event,'da')}
pattern='/^[0-9\b]+$/'
//jsonPath={`ProcessInstances[0].pensionRevision[${this.state.Index}].da`}
jsonPath={`ProcessInstances[0].pensionRevision[${this.state.Index}].da`}
/></td>
<td> <TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_OVER_PAYMENT_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_OVER_PAYMENT_R" }}
onChange={event => this.handleChange(index++, event,'overPayment')}
pattern='/^[0-9\b]+$/'
//jsonPath={`ProcessInstances[0].pensionRevision[${this.state.Index}].overPayment`}
jsonPath={`ProcessInstances[0].pensionRevision[${this.state.Index}].overPayment`}
/></td>
  </tr>
  <tr><td> <TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_COMMMUTED_PEENSION_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_COMMMUTED_PEENSION_R" }}
onChange={event => this.handleChange(index++, event,'commutedPension')}
pattern='/^[0-9\b]+$/'
//jsonPath={`ProcessInstances[0].pensionRevision[${this.state.Index}].commutedPension`}
jsonPath={`ProcessInstances[0].pensionRevision[${this.state.Index}].commutedPension`}
/></td>
<td> <TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_INCOMETAX_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_INCOMETAX_R" }}
onChange={event => this.handleChange(index++, event,'incomeTax')}
pattern='/^[0-9\b]+$/'
//jsonPath={`ProcessInstances[0].pensionRevision[${this.state.Index}].incomeTax`}
jsonPath={`ProcessInstances[0].pensionRevision[${this.state.Index}].incomeTax`}
/></td>
  </tr>
  <tr> <td><TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_AP_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_AP_R" }}
onChange={event => this.handleChange(index++, event,'additionalPension')}
pattern='/^[0-9\b]+$/'
//jsonPath={`ProcessInstances[0].pensionRevision[${this.state.Index}].additionalPension`}
jsonPath={`ProcessInstances[0].pensionRevision[${this.state.Index}].additionalPension`}
/></td>
<td><TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_CESS_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_CESS_R" }}
onChange={event => this.handleChange(index++, event,'cess')}
pattern='/^[0-9\b]+$/'
//jsonPath={`ProcessInstances[0].pensionRevision[${this.state.Index}].cess`}
jsonPath={`ProcessInstances[0].pensionRevision[${this.state.Index}].cess`}
/></td>
</tr>
  <tr><td> 
  <TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_IR_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_IR_R" }}
onChange={event => this.handleChange(index++, event,'interimRelief')}
pattern='/^[0-9\b]+$/'
//jsonPath={`ProcessInstances[0].pensionRevision[${this.state.Index}].interimRelief`}
jsonPath={`ProcessInstances[0].pensionRevision[${this.state.Index}].interimRelief`}
/>
</td>
<td><TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_PD_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_PD_R" }}
onChange={event => this.handleChange(index++, event,'pensionDeductions')}
pattern='/^[0-9\b]+$/'
jsonPath={`ProcessInstances[0].pensionRevision[${this.state.Index}].pensionDeductions`}
//jsonPath="ProcessInstances[0].pensionRevision[${this.state.Index}].pensionDeductions"
/></td>
  </tr>
  <tr><td><TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_MR_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_MR_R" }}
onChange={event => this.handleChange(index++, event,'fma')}
pattern='/^[0-9\b]+$/'
jsonPath={`ProcessInstances[0].pensionRevision[${this.state.Index}].fma`}
//jsonPath="ProcessInstances[0].pensionRevision[${this.state.Index}].fma"
/> </td>
<td><TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_NET_DEDUCTION_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_NET_DEDUCTION_R" }}
onChange={event => this.handleChange(index++, event,'netDeductions')}
disabled={true}
pattern='/^[0-9\b]+$/'
jsonPath={`ProcessInstances[0].pensionRevision[${this.state.Index}].netDeductions`}
//jsonPath="ProcessInstances[0].pensionRevision[${this.state.Index}].netDeductions"
/> </td>
  </tr>
        
  <tr><td> <TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_MISCELLENOUS_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_MISCELLENOUS_R" }}
onChange={event => this.handleChange(index++, event,'miscellaneous')}
pattern='/^[0-9\b]+$/'
jsonPath={`ProcessInstances[0].pensionRevision[${this.state.Index}].miscellaneous`}
//jsonPath="ProcessInstances[0].pensionRevision[${this.state.Index}].miscellaneous"
/></td>
<td><TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_FINAL_DEDUCTION_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_FINAL_DEDUCTION_R" }}
onChange={event => this.handleChange(index++, event,'finalCalculatedPension')}
pattern='/^[0-9\b]+$/'
disabled={true}
jsonPath={`ProcessInstances[0].pensionRevision[${this.state.Index}].finalCalculatedPension`}
//jsonPath="ProcessInstances[0].pensionRevision[0].finalCalculatedPension"
/> </td>
  </tr>
  <tr><td> <TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_WOUNDED_PENSION_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_WOUNDED_PENSION_R" }}
onChange={event => this.handleChange(index++, event,'woundExtraordinaryPension')}
pattern='/^[0-9\b]+$/'
//jsonPath={`ProcessInstances[0].pensionRevisionadd[${this.state.Index}].woundExtraordinaryPension`}
jsonPath={`ProcessInstances[0].pensionRevision[${this.state.Index}].woundExtraordinaryPension`}
/></td>
<td><TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_FINAL_TEN_ALLOWANCE_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_FINAL_TEN_ALLOWANCE_R" }}
onChange={event => this.handleChange(index++, event,'attendantAllowance')}
pattern='/^[0-9\b]+$/'
disabled={false}
//jsonPath={`ProcessInstances[0].pensionRevisionadd[${this.state.Index}].attendantAllowance`}
jsonPath={`ProcessInstances[0].pensionRevision[${this.state.Index}].attendantAllowance`}
/> </td>
  </tr>
  <tr><td> <TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_REMARKS_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_REMARKS_R" }}
onChange={event => this.handleChange(index++, event,'remarks')}
pattern='/^[0-9\b]+$/'
//jsonPath={`ProcessInstances[0].pensionRevisionadd[${this.state.Index}].remarks`}
jsonPath={`ProcessInstances[0].pensionRevision[${this.state.Index}].remarks`}
/></td>
<td> </td>
  </tr>

<tr>
  <td></td>
  <td><Button  color="primary" onClick={() => this.onEditSaveClick()}  style={{ alignItems: "right"}}>
                                    <LabelContainer
                                            labelName="SAVE"
                                            labelKey="PENSION_SAVE"
                                            color="#FE7A51"/> </Button>

<Button  color="primary" onClick={() => this.onCalculateClick()}  style={{ alignItems: "right"}}>
                                    <LabelContainer
                                            labelName="ADD"
                                            labelKey="PENSION_REVISION_CALCULATE"
                                            color="#FE7A51"/> </Button>
                                            </td>
  


  </tr>



</table>

       }
     </div>
   }
   {
     this.state.AddOpen&& <div>
     {

<table  style={{ width:"-webkit-fill-available" }}>
<tr>
<td> 
<TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_ESY") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_ESY" }}
onChange={event => this.handleChangeadd(index++, event,'effectiveStartYear')}
//onKeyPress={event => this.onKeyPress(event)}
//jsonPath="ProcessInstances[0].pensionRevisionadd[0].effectiveStartYear"
jsonPath={`ProcessInstances[0].pensionRevisionadd[0].effectiveStartYear`}

/>
</td>
<td> <TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_ESM") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_ESM" }}
onChange={event => this.handleChangeadd(index++, event,'effectiveStartMonth')}

pattern='/^[0-9\b]+$/'
//jsonPath={`ProcessInstances[0].pensionRevisionadd[${this.state.Index}].effectiveStartMonth`}
jsonPath="ProcessInstances[0].pensionRevisionadd[0].effectiveStartMonth"
/></td></tr>

<tr>

<td> 
<TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_BP_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_BP_R" }}
onChange={event => this.handleChangeadd(index++, event,'basicPension')}
pattern='/^[0-9\b]+$/'
//jsonPath={`ProcessInstances[0].pensionRevisionadd[${this.state.Index}].basicPension`}
jsonPath="ProcessInstances[0].pensionRevisionadd[0].basicPension"
/>
</td>
<td>
<TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_TP_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_TP_R" }}
onChange={event => this.handleChangeadd(index++, event,'totalPension')}
disabled={true}
pattern='/^[0-9\b]+$/'
//jsonPath={`ProcessInstances[0].pensionRevisionadd[${this.state.Index}].totalPension`}
jsonPath="ProcessInstances[0].pensionRevisionadd[0].totalPension"
/>
</td>
  </tr>

  <tr>
      <td> <TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_DA_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_DA_R" }}
onChange={event => this.handleChangeadd(index++, event,'da')}
pattern='/^[0-9\b]+$/'
//jsonPath={`ProcessInstances[0].pensionRevisionadd[${this.state.Index}].da`}
jsonPath="ProcessInstances[0].pensionRevisionadd[0].da"
/></td>
<td> <TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_OVER_PAYMENT_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_OVER_PAYMENT_R" }}
onChange={event => this.handleChangeadd(index++, event,'overPayment')}
pattern='/^[0-9\b]+$/'
//jsonPath={`ProcessInstances[0].pensionRevisionadd[${this.state.Index}].overPayment`}
jsonPath="ProcessInstances[0].pensionRevisionadd[0].overPayment"
/></td>
  </tr>
  <tr><td> <TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_COMMMUTED_PEENSION_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_COMMMUTED_PEENSION_R" }}
onChange={event => this.handleChangeadd(index++, event,'commutedPension')}
pattern='/^[0-9\b]+$/'
//jsonPath={`ProcessInstances[0].pensionRevisionadd[${this.state.Index}].commutedPension`}
jsonPath="ProcessInstances[0].pensionRevisionadd[0].commutedPension"
/></td>
<td> <TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_INCOMETAX_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_INCOMETAX_R" }}
onChange={event => this.handleChangeadd(index++, event,'incomeTax')}
pattern='/^[0-9\b]+$/'
//jsonPath={`ProcessInstances[0].pensionRevisionadd[${this.state.Index}].incomeTax`}
jsonPath="ProcessInstances[0].pensionRevisionadd[0].incomeTax"
/></td>
  </tr>
  <tr> <td><TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_AP_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_AP_R" }}
onChange={event => this.handleChangeadd(index++, event,'additionalPension')}
pattern='/^[0-9\b]+$/'
//jsonPath={`ProcessInstances[0].pensionRevisionadd[${this.state.Index}].additionalPension`}
jsonPath="ProcessInstances[0].pensionRevisionadd[0].additionalPension"
/></td>
<td><TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_CESS_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_CESS_R" }}
onChange={event => this.handleChangeadd(index++, event,'cess')}
pattern='/^[0-9\b]+$/'
//jsonPath={`ProcessInstances[0].pensionRevisionadd[${this.state.Index}].cess`}
jsonPath="ProcessInstances[0].pensionRevisionadd[0].cess"
/></td>
</tr>
  <tr><td> 
  <TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_IR_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_IR_R" }}
onChange={event => this.handleChangeadd(index++, event,'interimRelief')}
pattern='/^[0-9\b]+$/'
//jsonPath={`ProcessInstances[0].pensionRevisionadd[${this.state.Index}].interimRelief`}
jsonPath="ProcessInstances[0].pensionRevisionadd[0].interimRelief"
/>
</td>
<td><TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_PD_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_PD_R" }}
onChange={event => this.handleChangeadd(index++, event,'pensionDeductions')}
pattern='/^[0-9\b]+$/'
//jsonPath={`ProcessInstances[0].pensionRevisionadd[${this.state.Index}].pensionDeductions`}
jsonPath="ProcessInstances[0].pensionRevisionadd[0].pensionDeductions"
/></td>
  </tr>
  <tr><td><TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_MR_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_MR_R" }}
onChange={event => this.handleChangeadd(index++, event,'fma')}
pattern='/^[0-9\b]+$/'
//jsonPath={`ProcessInstances[0].pensionRevisionadd[${this.state.Index}].fma`}
jsonPath="ProcessInstances[0].pensionRevisionadd[0].fma"
/> </td>
<td><TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_NET_DEDUCTION_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_NET_DEDUCTION_R" }}
onChange={event => this.handleChangeadd(index++, event,'netDeductions')}
disabled={true}
pattern='/^[0-9\b]+$/'
//jsonPath={`ProcessInstances[0].pensionRevisionadd[${this.state.Index}].netDeductions`}
jsonPath="ProcessInstances[0].pensionRevisionadd[0].netDeductions"
/> </td>
  </tr>
        
  <tr><td> <TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_MISCELLENOUS_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_MISCELLENOUS_R" }}
onChange={event => this.handleChangeadd(index++, event,'miscellaneous')}
pattern='/^[0-9\b]+$/'
//jsonPath={`ProcessInstances[0].pensionRevisionadd[${this.state.Index}].miscellaneous`}
jsonPath="ProcessInstances[0].pensionRevisionadd[0].miscellaneous"
/></td>
<td><TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_FINAL_DEDUCTION_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_FINAL_DEDUCTION_R" }}
onChange={event => this.handleChangeadd(index++, event,'finalCalculatedPension')}
pattern='/^[0-9\b]+$/'
disabled={true}
//jsonPath={`ProcessInstances[0].pensionRevisionadd[${this.state.Index}].finalCalculatedPension`}
jsonPath="ProcessInstances[0].pensionRevisionadd[0].finalCalculatedPension"
/> </td>
  </tr>
  <tr><td> <TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_WOUNDED_PENSION_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_WOUNDED_PENSION_R" }}
onChange={event => this.handleChangeadd(index++, event,'woundExtraordinaryPension')}
pattern='/^[0-9\b]+$/'
//jsonPath={`ProcessInstances[0].pensionRevisionadd[${this.state.Index}].woundExtraordinaryPension`}
jsonPath="ProcessInstances[0].pensionRevisionadd[0].woundExtraordinaryPension"
/></td>
<td><TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_FINAL_TEN_ALLOWANCE_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_FINAL_TEN_ALLOWANCE_R" }}
onChange={event => this.handleChangeadd(index++, event,'attendantAllowance')}
pattern='/^[0-9\b]+$/'
disabled={false}
//jsonPath={`ProcessInstances[0].pensionRevisionadd[${this.state.Index}].attendantAllowance`}
jsonPath="ProcessInstances[0].pensionRevisionadd[0].attendantAllowance"
/> </td>
  </tr>
  <tr><td> <TextFieldContainer
select={false}
label={{ labelKey: getTransformedLocale("PENSION_EMPLOYEE_PENSION_REMARKS_R") }}
placeholder={{ labelKey: "PENSION_EMPLOYEE_PENSION_REMARKS_R" }}
onChange={event => this.handleChangeadd(index++, event,'remarks')}
pattern='/^[0-9\b]+$/'
//jsonPath={`ProcessInstances[0].pensionRevisionadd[${this.state.Index}].remarks`}
jsonPath="ProcessInstances[0].pensionRevisionadd[0].remarks"
/></td>
<td> </td>
  </tr>

<tr>
  <td></td>
  <td><Button  color="primary" onClick={() => this.onEditSaveClick()}  style={{ alignItems: "right"}}>
                                    <LabelContainer
                                            labelName="SAVE"
                                            labelKey="PENSION_SAVE"
                                            color="#FE7A51"/> </Button>

<Button  color="primary" onClick={() => this.onCalculateClick()}  style={{ alignItems: "right"}}>
                                    <LabelContainer
                                            labelName="ADD"
                                            labelKey="PENSION_REVISION_CALCULATE"
                                            color="#FE7A51"/> </Button>
                                            </td>
  


  </tr>



</table>

       }
     </div>
   }
    
     </div>}  
            />
          </CardContent>
        </Card>
       
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { screenConfiguration } = state;
  const { preparedFinalObject ,applyScreenMdmsData} = screenConfiguration;
  const ProcessInstances = get(
    screenConfiguration.preparedFinalObject,
    "ProcessInstances",
    {})
  //const { workflow } = preparedFinalObject;
  //const { ProcessInstances } = workflow || [];

  return {
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)), ProcessInstances,applyScreenMdmsData
  };
  //return {  state,preparedFinalObject ,ProcessInstances};
  
};
const mapDispatchToProps = dispatch => {
  return {
    prepareFinalObject: (path, value) =>
      dispatch(prepareFinalObject(path, value)),
    toggleSnackbar: (open, message, variant) =>
      dispatch(toggleSnackbar(open, message, variant))
  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PensionReviewDataContainer)
);

//export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PensionReviewDataContainer))
//export default withStyles(styles)(PensionReviewDataContainer);
//
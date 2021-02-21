import {
  getBreak,
  getCommonCard,
  getCommonGrayCard,
  getCommonTitle,
  getCommonSubHeader,
  getTextField,
  
  getDateField,
  getSelectField,
  getCommonContainer,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  furnishNocResponse,
  getSearchResults
} from "../../../../../ui-utils/commons";
import {
  
  objectToDropdown
  
} from "../../utils";


import {
  prepareFinalObject as pFO,
  
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
export const empDetails = (data) => {
const leaveUnitcard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    
    scheama: getCommonGrayCard({
      header: getCommonSubHeader(
        {
          labelName: "Leave  ",
          labelKey: "PENSION_EMPLOYEE_LEAVE"
        },
        {
          style: {
            marginBottom: 18
          }
        }
      ),
      leaveUnitcardContainer: getCommonContainer(
        {
          leaveType: {
            ...getSelectField({
              label: {
                labelName: "Leave Type",
                labelKey: "PENSION_LEAVE_TYPE"
              },
              placeholder: {
                labelName: "Select Leave Type",
                labelKey: "PENSION_LEAVE_TYPE"
              },
              required: true,
             
              jsonPath: "ProcessInstances[0].leaves[0].leaveType",
              localePrefix: {
                moduleName: "egov-PENSION",
               masterName: "LEAVETYPE"
              },
              props: {
                jsonPathUpdatePrefix: "ProcessInstances[0].leaves",
                setDataInField: true,
                disabled: data[2].employeeLeaveUpdate,  
                className:"applicant-details-error"
              },
              sourceJsonPath:
              "applyScreenMdmsData.pension.EmployeeLeaveType",
             
            }),
            // beforeFieldChange: (action, state, dispatch) => {
            //   alert('select')
            //   try {
            //     dispatch(
            //       pFO(
            //         "applyScreenMdmsData.pension.EmployeeLeaveType",
            //         objectToDropdown(
            //           get(
            //             state.screenConfiguration.preparedFinalObject,
            //             `applyScreenMdmsData.pension.EmployeeLeaveType.${
            //               action.value
            //             }`,
            //             []
            //           )
            //         )
            //       )
            //     );
            //     let componentPath = action.componentJsonpath.split(".");

            //     let index = action.componentJsonpath
            //       .split("[")[1]
            //       .split("]")[0];
            //     componentPath.pop();
            //     componentPath.push("EmployeeLeaveType");
            //     componentPath = componentPath.join(".");
            //     dispatch(
            //       handleField(
            //         "rrpDetails",
            //         componentPath,
            //         "props.data",
            //         objectToDropdown(
            //           get(
            //             state.screenConfiguration.preparedFinalObject,
            //             `applyScreenMdmsData.pension.EmployeeLeaveType.${
            //               action.value
            //             }`,
            //             []
            //           )
            //         )
            //       )
            //     );
            //     let tradeCat = get(
            //       state.screenConfiguration.preparedFinalObject,
            //       `ProcessInstances[0].leaves[${parseInt(index)}].leaveType`
            //     );
            //     if (tradeCat != action.value) {
            //       dispatch(
            //         pFO(
            //           `ProcessInstances[0].leaves[${parseInt(
            //             index
            //           )}].tradeSubType`,
            //           ""
            //         )
            //       );
            //       dispatch(
            //         pFO(
            //           `Licenses[0].tradeLicenseDetail.tradeUnits[${parseInt(
            //             index
            //           )}].leaveType`,
            //           ""
            //         )
            //       );
            //     }
            //   } catch (e) {
            //     console.log(e);
            //   }
            // }
          },
         
         
          leaveCount: getTextField({
          label: {
            labelName: "leaveCount",
            labelKey: "PENSION_EMPLOYEE_LEAVECOUNT"
          },
          placeholder: {
            labelName: "leaveCount",
            labelKey: "PENSION_EMPLOYEE_LEAVECOUNT"
          },
          required: true,
          props: {
            disabled: data[2].employeeLeaveUpdate,
            setDataInField: true,
            jsonPath: "ProcessInstances[0].leaves[0].leaveCount"
          },
          jsonPath: "ProcessInstances[0].leaves[0].leaveCount",
           
          }),
          leavefrom: {
          ...getDateField({
            label: {
              labelName: "leave From",
              labelKey: "PENSION_LEAVE_FROM"
            },
            placeholder: {
              labelName: "leave From",
              labelName: "PENSION_LEAVE_FROM"
            },
            required: true,
           
            pattern: getPattern("Date"),
            jsonPath: "ProcessInstances[0].leaves[0].leaveFrom",
            props: {
              disabled: data[2].employeeLeaveUpdate,  
              className:"applicant-details-error",
              
            }
          }),
          visible: true
        },
        leaveTo: {
          ...getDateField({
            label: {
              labelName: "leave TO",
              labelKey: "PENSION_LEAVE_TO"
            },
            placeholder: {
              labelName: "leave TO",
              labelName: "PENSION_LEAVE_TO"
            },
            required: true,
           
            pattern: getPattern("Date"),
            jsonPath: "ProcessInstances[0].leaves[0].leaveTo",
            props: {
              disabled: data[2].employeeLeaveUpdate,  
              className:"applicant-details-error",
              
            }
          }),
          visible: true
        },
        },
        {
          style: {
            overflow: "visible"
          }
        }
      )
    }),
    items: [],
    addItemLabel: {
      labelName: "ADD LEAVE",
      labelKey: "PENSION_ADD_LEAVE"
    },
    props: {
      disabled: data[2].employeeLeaveUpdate,      
    },
    headerName: "TradeUnits",
    headerJsonPath:
      "children.cardContent.children.header.children.head.children.Accessories.props.label",
    sourceJsonPath: "ProcessInstances[0].leaves",
    prefixSourceJsonPath:
      "children.cardContent.children.leaveUnitcardContainer.children",
    onMultiItemAdd: (state, muliItemContent) => {
      return setFieldsOnAddItem(state, muliItemContent);
    }
  },
  type: "array"
};
const setFieldsOnAddItem = (state, multiItemContent) => {
  const preparedFinalObject = JSON.parse(
    JSON.stringify(state.screenConfiguration.preparedFinalObject)
  );
  
 
  for (var variable in multiItemContent) {
    const value = get(
      preparedFinalObject,
      multiItemContent[variable].props.jsonPath
    );
  
    if (multiItemContent[variable].props.setDataInField && value) {
      if (
        multiItemContent[variable].props.jsonPath.split(".")[0] ===
          "ProcessInstances[0]" &&
        multiItemContent[variable].props.jsonPath.split(".").pop() ===
          "leaveType"
      ) {
        const leaveTypeData = get(
          preparedFinalObject,
          `applyScreenMdmsData.pension.EmployeeLeaveType`,
          []
        );
        
        const tradeTypeDropdownData =
          leaveTypeData &&
          leaveTypeData.leaveType &&
          Object.keys(leaveTypeData.leaveType).map(item => {
            
            return { code: item, active: true };
          });
          
        multiItemContent[variable].props.data = tradeTypeDropdownData;
        const data = leaveTypeData[value];
        
        //console.log(data)
        //console.log(multiItemContent["EmployeeLeaveType"].props.data)
        //alert("leave")
        if (data) {
          multiItemContent["EmployeeLeaveType"].props.data = this.objectToDropdown(
            data
          );
        }
      } else if (
        multiItemContent[variable].props.jsonPath.split(".").pop() ===
        "EmployeeLeaveType"
      ) {
        const data = get(
          preparedFinalObject,
          `applyScreenMdmsData.pensionleaveType.${value.split(".")[0]}.${
            value.split(".")[1]
          }`
        );
        if (data) {
          multiItemContent[variable].props.data = data;
        }
      } else if (
        multiItemContent[variable].props.jsonPath.split(".").pop() ===
          "uomValue" &&
        value > 0
      ) {
        multiItemContent[variable].props.disabled = false;
        multiItemContent[variable].props.required = true;
      }
    }
    if (
      multiItemContent[variable].props.setDataInField &&
      multiItemContent[variable].props.disabled
    ) {
      if (
        multiItemContent[variable].props.jsonPath.split(".").pop() ===
        "uomValue"
      ) {
        const disabledValue = get(
          state.screenConfiguration.screenConfig["rrpDetails"],
          `${multiItemContent[variable].componentJsonpath}.props.disabled`,
          true
        );
        multiItemContent[variable].props.disabled = disabledValue;
      }
    }
  }
  return multiItemContent;
};
return getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Employee Details",
      labelKey: "PENSION_SEQUENCE_EMPLOYEE_DETAILS"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  break: getBreak(),
  employeedetails: getCommonContainer({
   
   
    employeename: getTextField({
      label: {
        labelName: "Employee Name",
        labelKey: "PENSION_EMPLOYEE_NAME"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "Employee Name",
        labelKey: "PENSION_EMPLOYEE_NAME"
      },
      required: false,
      props: {
        disabled: true,       
      },
      pattern: getPattern("name"),
      jsonPath: "ProcessInstances[0].employee.user.name"
    }),
    employeecode: getTextField({
      label: {
        labelName: "Employee Code",
        labelKey: "PENSION_EMPLOYEE_CODE"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "Employee Code",
        labelKey: "PENSION_EMPLOYEE_CODE"
      },
      required: false,
      props: {
        disabled: true,       
      },
      pattern: getPattern("name"),
      jsonPath: "ProcessInstances[0].employee.code"
    }),
    designation: getTextField({
      label: {
        labelName: "Designation",
        labelKey: "PENSION_EMPLOYEE_DESIGNATION"
      },
      props:{
        className:"applicant-details-error"
      },
      placeholder: {
        labelName: "Designation",
        labelKey: "PENSION_EMPLOYEE_DESIGNATION"
      },
      required: false,
      props: {
        disabled: true,       
      },
      pattern: getPattern("name"),
      jsonPath: "ProcessInstances[0].employee.assignments[0].designation"
    }),
    department: getTextField({
      label: {
        labelName: "department",
        labelKey: "PENSION_EMPLOYEE_DEPARTMENT"
      },
      props:{
        className:"applicant-details-error"
      },
      placeholder: {
        labelName: "department",
        labelKey: "PENSION_EMPLOYEE_DEPARTMENT"
      },
      required: false,
      props: {
        disabled: true,       
      },
      pattern: getPattern("name"),
      jsonPath: "ProcessInstances[0].employee.assignments[0].department"
    }),
    mobileNumber: getTextField({
      label: {
        labelName: "mobileNumber",
        labelKey: "PENSION_EMPLOYEE_MOBILE_NUMBER"
      },
      props:{
        className:"applicant-details-error"
      },
      placeholder: {
        labelName: "mobileNumber",
        labelKey: "PENSION_EMPLOYEE_MOBILE_NUMBER"
      },
      required: false,
      props: {
        disabled: true,       
      },
      pattern: getPattern("name"),
      jsonPath: "ProcessInstances[0].employee.user.mobileNumber"
    }),
    gender: getTextField({
      label: {
        labelName: "gender",
        labelKey: "PENSION_EMPLOYEE_GENDER"
      },
      props:{
        className:"applicant-details-error"
      },
      placeholder: {
        labelName: "gender",
        labelKey: "PENSION_EMPLOYEE_GENDER"
      },
      required: false,
      props: {
        disabled: true,       
      },
      pattern: getPattern("name"),
      jsonPath: "ProcessInstances[0].employee.user.gender"
    }),
    fatherhusbandname: getTextField({
      label: {
        labelName: "father/husband name",
        labelKey: "PENSION_EMPLOYEE_FATHER_HUSBAND_NAME"
      },
      props:{
        className:"applicant-details-error"
      },
      placeholder: {
        labelName: "father/husband name",
        labelKey: "PENSION_EMPLOYEE_FATHER_HUSBAND_NAME"
      },
      required: false,
      props: {
        disabled: true,       
      },
      pattern: getPattern("name"),
      jsonPath: "ProcessInstances[0].employee.user.fatherOrHusbandName"
    }),
    employeeType: getTextField({
      label: {
        labelName: "Employee Type",
        labelKey: "PENSION_EMPLOYEE_TYPE"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "Employee Type",
        labelKey: "PENSION_EMPLOYEE_TYPE"
      },
      required: false,
      props: {
        disabled: true,       
      },
      pattern: getPattern("name"),
      jsonPath: "ProcessInstances[0].employee.employeeType"
    }),
    dob: {
      ...getDateField({
        label: {
          labelName: "Date of Birth",
          labelKey: "PENSION_DOB"
        },
        placeholder: {
          labelName: "Date of Birth",
          labelName: "PENSION_DOB"
        },
        required: false,
        
        pattern: getPattern("Date"),
        jsonPath: "ProcessInstances[0].employee.user.dob",
        props: {
          className:"applicant-details-error",
          disabled:true
        }
      }),
      visible: true
    },
    dateOfAppointment: {
      ...getDateField({
        label: {
          labelName: "Date of Appointment",
          labelKey: "PENSION_DOJ"
        },
        placeholder: {
          labelName: "Date of Appointment",
          labelName: "PENSION_DOJ"
        },
        required: false,
       
        pattern: getPattern("Date"),
        jsonPath: "ProcessInstances[0].employee.dateOfAppointment",
        props: {
          className:"applicant-details-error",
          disabled:true
        }
      }),
      visible: true
    },
    dateOfRetirement: {
      ...getDateField({
        label: {
          labelName: "Date of Retirement",
          labelKey: "PENSION_DOR"
        },
        placeholder: {
          labelName: "Date of Retirement",
          labelName: "PENSION_DOR"
        },
        required: false,
       
        pattern: getPattern("Date"),
        jsonPath: "ProcessInstances[0].employee.dateOfRetirement",
        props: {
          className:"applicant-details-error",
          disabled:true
        }
      }),
      visible: true
    },
   
   
    // permanentAddress: getTextField({
    //   label: {
    //     labelName: "permanent Address",
    //     labelKey: "PENSION_EMPLOYEE_PENSION_RESIDENTIAL_ADDRESS"
    //   },
    //   props:{
    //     className:"applicant-details-error"
    //   },
    //   placeholder: {
    //     labelName: "Enter permanent Address",
    //     labelKey: "PENSION_EMPLOYEE_PENSION_RESIDENTIAL_ADDRESS"
    //   },
    //   required: false,
    //   props: {
    //     disabled: true,       
    //   },
    //   pattern: getPattern("Name"),
    //   jsonPath: "ProcessInstances[0].employee.user.permanentAddress"
    // }),
    // permanentCity: getTextField({
    //   label: {
    //     labelName: "City",
    //     labelKey: "PENSION_EMPLOYEE_PENSION_CITY"
    //   },
    //   props:{
    //     className:"applicant-details-error"
    //   },
    //   placeholder: {
    //     labelName: "Enter City",
    //     labelKey: "PENSION_EMPLOYEE_PENSION_CITY"
    //   },
    //   required: false,
    //   props: {
    //     disabled: true,       
    //   },
    //   pattern: getPattern("Name"),
    //   jsonPath: "ProcessInstances[0].employee.user.permanentCity"
    // }),
    // permanentPinCode: getTextField({
    //   label: {
    //     labelName: "permanent Pin Code",
    //     labelKey: "PENSION_EMPLOYEE_PENSION_PINCODE"
    //   },
    //   props:{
    //     className:"applicant-details-error"
    //   },
    //   placeholder: {
    //     labelName: "Enter Pin Code",
    //     labelKey: "PENSION_EMPLOYEE_PENSION_PINCODE"
    //   },
    //   required: false,
    //   props: {
    //     disabled: true,       
    //   },
    //   pattern: getPattern("Pincode"),
    //   jsonPath: "ProcessInstances[0].employee.user.permanentPinCode"
    // }),
    correspondenceAddress: getTextField({
      label: {
        labelName: "correspondence Address",
        labelKey: "PENSION_EMPLOYEE_PENSION_CA"
      },
      props:{
        className:"applicant-details-error"
      },
      placeholder: {
        labelName: "Enter correspondence Address",
        labelKey: "PENSION_EMPLOYEE_PENSION_CA"
      },
      required: false,
      props: {
        disabled: true,       
      },
      pattern: getPattern("Name"),
      jsonPath: "ProcessInstances[0].employee.user.correspondenceAddress"
    }),
    // correspondenceCity: getTextField({
    //   label: {
    //     labelName: "City",
    //     labelKey: "PENSION_EMPLOYEE_PENSION_CITY"
    //   },
    //   props:{
    //     className:"applicant-details-error"
    //   },
    //   placeholder: {
    //     labelName: "Enter City",
    //     labelKey: "PENSION_EMPLOYEE_PENSION_CITY"
    //   },
    //   required: false,
    //   props: {
    //     disabled: true,       
    //   },
    //   pattern: getPattern("Name"),
    //   jsonPath: "ProcessInstances[0].employee.user.correspondenceCity"
    // }),
    // correspondencePinCode: getTextField({
    //   label: {
    //     labelName: "Pin Code",
    //     labelKey: "PENSION_EMPLOYEE_PENSION_PINCODE"
    //   },
    //   props:{
    //     className:"applicant-details-error"
    //   },
    //   placeholder: {
    //     labelName: "Enter Pin Code",
    //     labelKey: "PENSION_EMPLOYEE_PENSION_PINCODE"
    //   },
    //   required: false,
    //   props: {
    //     disabled: true,       
    //   },
    //   pattern: getPattern("Pincode"),
    //   jsonPath: "ProcessInstances[0].employee.user.correspondencePinCode"
    // }),
   
  }),
  //leaveUnitcard,
  
});
}


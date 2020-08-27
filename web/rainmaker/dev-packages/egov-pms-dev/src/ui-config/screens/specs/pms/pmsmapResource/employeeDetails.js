import {
    getBreak,
    getCommonCard,
    getCommonGrayCard,
    getCommonTitle,
    getCommonSubHeader,
    getTextField,
    getLabel,
    getDateField,
    getSelectField,
    getCommonContainer,
    getLabelWithValue,
    getPattern
  } from "egov-ui-framework/ui-config/screens/specs/utils";
export const empDetails = () => {
   
  
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
          jsonPath: "ProcessInstancestemp[0].name"
        }),
        code: getTextField({
            label: {
              labelName: "Code",
              labelKey: "PENSION_EMPLOYEE_CODE"
            },
            props:{
              className:"applicant-details-error"
            },
            placeholder: {
              labelName: "Code",
              labelKey: "PENSION_EMPLOYEE_CODE"
            },
            required: false,
            props: {
              disabled: true,       
            },
            pattern: getPattern("name"),
            jsonPath: "ProcessInstancestemp[0].code"
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
            jsonPath: "ProcessInstancestemp[0].dob",
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
            jsonPath: "ProcessInstancestemp[0].dateOfRetirement",
            props: {
              className:"applicant-details-error",
              disabled:true
            }
          }),
          visible: true
        },
       
       
        
       
      }),
     
     
      
    });
    }
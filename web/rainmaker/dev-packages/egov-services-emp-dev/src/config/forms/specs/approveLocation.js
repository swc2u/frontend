const formConfig = {
    name: "approveLocation",
    fields: {
      comments: {
        id: "comments-reopen",
        jsonPath: "NewLocationDetails.comments",
      },
      applicationNumber: {
        id: "application-number",
        jsonPath: "NewLocationDetails.applicationNumber",
        value:''
      },
      businessService: {
        id: "booking-type",
        jsonPath: "NewLocationDetails.businessService",
        value:''
      },
      assignee: {
        id: "booking-type",
        jsonPath: "NewLocationDetails.assignee",
        value:''
      },
     
        // createdBy: {
        //   id: "createdby",
        //   jsonPath: "NewLocationDetails.Remarks[0].bkCreatedBy",
        //   value:''
        // },
        // createdOn: {
        //   id: "application-number",
        //   jsonPath: "NewLocationDetails.Remarks[0].bkCreatedOn",
        //   value:''
        // },
        remarks: {
          id: "application-number",
          jsonPath: "NewLocationDetails.remarks",
          value:''
        }
     ,
      tenantId: {
        id: "tenantId",
        jsonPath: "NewLocationDetails.tenantId",
        value:''
      },
      textarea: {
        id: "textarea",
        hintText: "CS_COMMON_COMMENTS_PLACEHOLDER",
      },
      action: {
        id: "action",
        jsonPath: "NewLocationDetails.action",
        value: "",
      },
    },
    submit: {
      type: "submit",
      label: "CS_COMMON_SUBMIT",
      id: "reopencomplaint-submit-action",
    },
    action: "_update",
    redirectionRoute: "/egov-services/newLocation-approved",
    saveUrl: "/bookings/newLocation/_update",
  };
  
  export default formConfig;
  
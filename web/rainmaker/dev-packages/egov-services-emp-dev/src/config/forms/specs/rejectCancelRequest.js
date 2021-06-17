const formConfig = {
    name: "rejectCancelRequest",
    fields: {
      comments: {
        id: "comments-reopen",
        jsonPath: "Booking.comments",
      },
      applicationNumber: {
        id: "application-number",
        jsonPath: "Booking.bkApplicationNumber",
        value:''
      },
      businessService: {
        id: "Booking-type",
        jsonPath: "Booking.businessService",
        value:''
      },
      assignee: {
        id: "Booking-type",
        jsonPath: "Booking.assignee",
        value:''
      },
     
        // createdBy: {
        //   id: "createdby",
        //   jsonPath: "Booking.Remarks[0].bkCreatedBy",
        //   value:''
        // },
        // createdOn: {
        //   id: "application-number",
        //   jsonPath: "Booking.Remarks[0].bkCreatedOn",
        //   value:''
        // },
        remarks: {
          id: "application-number",
          jsonPath: "Booking.bkRemarks",
          value:''
        }
     ,
      tenantId: {
        id: "tenantId",
        jsonPath: "Booking.tenantId",
        value:''
      },
      textarea: {  
        id: "textarea",
        hintText: "CS_COMMON_COMMENTS_PLACEHOLDER",
      },
      BookingType: {
        id: "Booking-BookingType",
        jsonPath: "Booking.BookingType",
        value:''
      },
      applicationStatus: {
        id: "Booking-applicationStatus",
        jsonPath: "Booking.applicationStatus",
        value:''
      },
      ApplicantMobileNum:{
        id: "Booking-ApplicantMobileNum",
        jsonPath: "Booking.ApplicantMobileNum",
        value:''
      },
      ApplicantName:{
        id: "Booking-ApplicantName",
        jsonPath: "Booking.ApplicantName",
        value:''
      },
      fatherName:{
        id: "Booking-fatherName",
        jsonPath: "Booking.fatherName",
        value:''
      },
      bkEmail:{
        id: "Booking-bkEmail",
        jsonPath: "Booking.bkEmail",
        value:''
      },
      bkCompleteAddress:{
        id: "Booking-bkCompleteAddress",
        jsonPath: "Booking.bkCompleteAddress",
        value:'' 
      },
      bkCategory:{
        id: "Booking-bkCategory",
        jsonPath: "Booking.bkCategory",
        value:'' 
      },
      bkBookingPurpose:{
        id: "Booking-bkBookingPurpose",
        jsonPath: "Booking.bkBookingPurpose",
        value:'' 
      },
      bkFromDate:{
        id: "Booking-bkFromDate",
        jsonPath: "Booking.bkFromDate",
        value:'' 
      },
      bkNomineeName:{
        id: "Booking-bkNomineeName",
        jsonPath: "Booking.bkNomineeName",
        value:'' 
      },
      bkStatusUpdateRequest:{
        id: "Booking-bkStatusUpdateRequest",
        jsonPath: "Booking.bkStatusUpdateRequest",
        value:'' 
      },
      timeslots:{
        id: "Booking-timeslots",
        jsonPath: "Booking.timeslots",
        value:'' 
      },
      bkLocationPictures:{
        id: "Booking-bkLocationPictures",
        jsonPath: "Booking.bkLocationPictures",
        value:'' 
      },
      cardNumber:{
        id: "Booking-cardNumber",
        jsonPath: "Booking.cardNumber",
        value:'' 
      },
      bkToDate:{
        id: "Booking-bkToDate",
        jsonPath: "Booking.bkToDate",
        value:'' 
      },
      bkBankAccountNumber:{
        id: "Booking-bkBankAccountNumber",
        jsonPath: "Booking.bkBankAccountNumber",
        value:'' 
      },
      bkBankName:{
        id: "Booking-bkBankName",
        jsonPath: "Booking.bkBankName",
        value:'' 
      },
      bkIfscCode:{
        id: "Booking-bkIfscCode",
        jsonPath: "Booking.bkIfscCode",
        value:''
      },
      bkAccountType:{
        id: "Booking-bkAccountType",
        jsonPath: "Booking.bkAccountType",
        value:''
      },
      bkBankAccountHolder:{
        id: "Booking-bkBankAccountHolder",
        jsonPath: "Booking.bkBankAccountHolder",
        value:''
      },
      bkBookingVenue:{
        id: "Booking-bkBookingVenue",
        jsonPath: "Booking.bkBookingVenue",
        value:''
      },
      action: {
        id: "action",
        jsonPath: "Booking.bkAction",
        value: "REJECT",
      },
    },
    submit: {
      type: "submit",
      label: "CS_COMMON_SUBMIT",
      id: "reopencomplaint-submit-action",
    },
    action: "_update",
    redirectionRoute: "/egov-services/application-rejected",
    saveUrl: "/bookings/park/community/_update",
  };
  
  export default formConfig;
  
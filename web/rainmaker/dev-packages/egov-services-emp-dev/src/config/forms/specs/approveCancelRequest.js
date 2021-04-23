const formConfig = {
  name: "approveCancelRequest",
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
    CancelStatus: {
      id: "Booking-Status",
      jsonPath: "Booking.bkStatus",
      value:''
    },
    editableRefundAmount: {
      id: "Booking-editableRefundAmount",
      jsonPath: "Booking.refundableSecurityMoney",
      value:''
    },
    assignee: {
      id: "Booking-type",
      jsonPath: "Booking.assignee",
      value:''
    },
    applicationStatus: {
      id: "Booking-applicationStatus",
      jsonPath: "Booking.bkApplicationStatus",
      value:''
    },
    ApplicantMobileNum: {
      id: "Booking-ApplicantMobileNum",
      jsonPath: "Booking.bkMobileNumber",
      value:''
    },
    ApplicantName: {
      id: "Booking-ApplicantName",
      jsonPath: "Booking.bkApplicantName",
      value:''
    },
    BookingType: {
      id: "Booking-BookingType",
      jsonPath: "Booking.bkBookingType",
      value:''
    },
      fatherName: {
        id: "Booking-fatherName",
        jsonPath: "Booking.bkFatherName",
        value:''
      },
      bkEmail: {
        id: "Booking-type",
        jsonPath: "Booking.bkEmail",
        value:''
      },
      bkCompleteAddress: {
        id: "Booking-type",
        jsonPath: "Booking.bkCompleteAddress",
        value:''
      },
      bkCategory: {
        id: "Booking-type",
        jsonPath: "Booking.bkCategory",
        value:''
      },
      bkBookingPurpose: {
        id: "Booking-type",
        jsonPath: "Booking.bkBookingPurpose",
        value:''
      },
      bkFromDate: {
        id: "Booking-type",
        jsonPath: "Booking.bkFromDate",
        value:''
      },
      bkToDate: {
        id: "Booking-type",
        jsonPath: "Booking.bkToDate",
        value:''
      },
      bkBankAccountNumber: {
        id: "Booking-type",
        jsonPath: "Booking.bkBankAccountNumber",
        value:''
      },
      bkBankName: {
        id: "Booking-type",
        jsonPath: "Booking.bkBankName",
        value:''
      },
      bkIfscCode: {
        id: "Booking-type",
        jsonPath: "Booking.bkIfscCode",
        value:''
      },
      bkAccountType: {
        id: "Booking-type",
        jsonPath: "Booking.bkAccountType",
        value:''
      },
      bkBankAccountHolder: {
        id: "Booking-type",
        jsonPath: "Booking.bkBankAccountHolder",
        value:''
      },
      bkBookingVenue: {
        id: "Booking-type",
        jsonPath: "Booking.bkBookingVenue",
        value:''
      },
      remarks: {
        id: "application-number",
        jsonPath: "Booking.remarks",
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
    action: {
      id: "action",
      jsonPath: "Booking.bkAction",
      value: "",
    },
  },
  submit: {
    type: "submit",
    label: "CS_COMMON_SUBMIT",
    id: "reopencomplaint-submit-action",
  },
  action: "_update",
  redirectionRoute: "/egov-services/DataSubmitted",
  saveUrl: "/bookings/park/community/_update",
};

export default formConfig;

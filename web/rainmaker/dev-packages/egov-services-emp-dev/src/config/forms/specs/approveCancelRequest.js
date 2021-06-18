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
      id: "Booking-assignee",
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
        id: "Booking-bkEmail",
        jsonPath: "Booking.bkEmail",
        value:''
      },
      bkCompleteAddress: {
        id: "Booking-bkCompleteAddress",
        jsonPath: "Booking.bkCompleteAddress",
        value:''
      },
      bkCategory: {
        id: "Booking-bkCategory",
        jsonPath: "Booking.bkCategory",
        value:''
      },
      bkBookingPurpose: {
        id: "Booking-bkBookingPurpose",
        jsonPath: "Booking.bkBookingPurpose",
        value:''
      },
      bkFromDate: {
        id: "Booking-bkFromDate",
        jsonPath: "Booking.bkFromDate",
        value:''
      },
      bkToDate: {
        id: "Booking-bkToDate",
        jsonPath: "Booking.bkToDate",
        value:''
      },
      bkBankAccountNumber: {
        id: "Booking-bkBankAccountNumber",
        jsonPath: "Booking.bkBankAccountNumber",
        value:''
      },
      bkBankName: {
        id: "Booking-bkBankName",
        jsonPath: "Booking.bkBankName",
        value:''
      },
      bkNomineeName: {
        id: "Booking-bkNomineeName",
        jsonPath: "Booking.bkNomineeName",
        value:''
      },
      bkIfscCode: {
        id: "Booking-bkIfscCode",
        jsonPath: "Booking.bkIfscCode",
        value:''
      },
      bkAccountType: {
        id: "Booking-bkAccountType",
        jsonPath: "Booking.bkAccountType",
        value:''
      },
      bkStatusUpdateRequest: {
        id: "Booking-bkStatusUpdateRequest",
        jsonPath: "Booking.bkStatusUpdateRequest",
        value:''
      },
      bkLocationPictures: {
        id: "Booking-bkLocationPictures",
        jsonPath: "Booking.bkLocationPictures",
        value:''
      },
      bkBankAccountHolder: {
        id: "Booking-bkBankAccountHolder",
        jsonPath: "Booking.bkBankAccountHolder",
        value:''
      },
      bkBookingVenue: {
        id: "Booking-bkBookingVenue",
        jsonPath: "Booking.bkBookingVenue",
        value:''
      },
      remarks: {
        id: "application-number",
        jsonPath: "Booking.remarks",
        value:''
      }
   ,
   timeslots: {
    id: "Booking-timeslots", 
    jsonPath: "Booking.timeslots",
    value:''
  },
  cardNumber: {
    id: "Booking-cardNumber",
    jsonPath: "Booking.cardNumber",
    value:''
  },
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

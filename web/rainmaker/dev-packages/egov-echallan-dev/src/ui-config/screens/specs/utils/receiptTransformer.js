import get from "lodash/get";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import store from "../../../../ui-redux/store";
import { getMdmsData, getReceiptData, getFinancialYearDates } from "../utils";
import {
  getLocalization,
  getLocale
} from "egov-ui-kit/utils/localStorageUtils";
import {
  getUlbGradeLabel,
  getTranslatedLabel,
  transformById,
  getTransformedLocale,
  getUserDataFromUuid
} from "egov-ui-framework/ui-utils/commons";
import { getSearchResults } from "../../../../ui-utils/commons";

const ifNotNull = value => {
  return !["", "NA", "null", null].includes(value);
};

const nullToNa = value => {
  return ["", "NA", "null", null].includes(value) ? "NA" : value;
};

const createAddress = (doorNo, buildingName, street, locality, city) => {
  let address = "";
  address += ifNotNull(doorNo) ? doorNo + ", " : "";
  address += ifNotNull(buildingName) ? buildingName + ", " : "";
  address += ifNotNull(street) ? street + ", " : "";
  address += locality + ", ";
  address += city;
  return address;
};

const epochToDate = et => {
  if (!et) return null;
  var date = new Date(Math.round(Number(et)));
  var formattedDate =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  return formattedDate;
};

export const getMessageFromLocalization = code => {
  let messageObject = JSON.parse(getLocalization("localization_en_IN")).find(
    item => {
      return item.code == code;
    }
  );
  return messageObject ? messageObject.message : code;
};

export const loadUlbLogo = tenantid => {
  var img = new Image();
  img.crossOrigin = "Anonymous";
  img.onload = function () {
    var canvas = document.createElement("CANVAS");
    var ctx = canvas.getContext("2d");
    canvas.height = this.height;
    canvas.width = this.width;
    ctx.drawImage(this, 0, 0);
    store.dispatch(
      prepareFinalObject("base64UlbLogoForPdf", canvas.toDataURL())
    );
    canvas = null;
  };
  img.src = `/pb-egov-assets/${tenantid}/logo.png`;
};

export const loadApplicationData = async (applicationNumber, tenant) => {
  
  let data = {};
  let RequestBody = {
    searchtext: applicationNumber,
    tenantId: tenant,
    action: '',
  }
  
  let response = await getSearchResults(RequestBody);
  
  let encorachmentvalue = '';
  
  if (response && response.ResponseBody && response.ResponseBody.length > 0) {
    data.serialNo = nullToNa(
      get(response, "ResponseBody[0].challanId", "NA")
    );
    data.status = get(response, "ResponseBody[0].status");
    data.violationDate = nullToNa(
      //epochToDate(
      get(response, "ResponseBody[0].violationDate", "NA")
      //)
    );
    data.violationTime = nullToNa(
      //epochToDate(
      get(response, "ResponseBody[0].violationTime", "NA")
      //)
    );

    data.encroachmentType = nullToNa(
      get(response, "ResponseBody[0].encroachmentType", "NA")
    );
    switch (data.encroachmentType) {
      case "Unauthorized/Unregistered Vendor":
        encorachmentvalue = "unregisteredEchallan"
        break;
      default:
        break;
    }

    data.provisionalNocNumber = nullToNa(
      get(response, "ResponseBody[0].provisionFireNOCNumber", "NA")
    );


    // Certificate Data

    // Property Location

    // Applicant Details
    data.violatorName = nullToNa(
      get(response, "ResponseBody[0].violatorName", "NA")
    );

    data.fatherName = nullToNa(
      get(response, "ResponseBody[0].fatherName", "NA")
    );

    data.address = nullToNa(
      get(response, "ResponseBody[0].address", "NA")
    );

    // data.contactNumber = nullToNa(
    //   get(response, "ResponseBody[0].contactNumber", "NA")
    // );
    // data.emailId = nullToNa(
    //   get(response, "ResponseBody[0].emailId", "NA")
    // );

    // data.siName = nullToNa(
    //   get(response, "ResponseBody[0].siName", "NA")
    // );
    let violationitemList = get(response, "ResponseBody[0].violationItem", [])
    for (let index = 0; index < violationitemList.length; index++) {
      const element = violationitemList[index];
      let articleobj = "article" + [index + 1];
      data[articleobj] = element.itemName + " - " + element.quantity + " - " + element.remark;
    }


    data.placeTime = nullToNa(
      get(response, "ResponseBody[0].sector", "NA")) + " " + nullToNa(
        get(response, "ResponseBody[0].violationTime", "NA")
      );


    // Documents

    // User Data
    //loadUserNameData(get(response, "ResponseBody[0].auditDetails.lastModifiedBy"));
  }
  
  store.dispatch(prepareFinalObject('applicationDataForPdf', data));
};

export const loadReceiptData = async (consumerCode, tenant) => {
  let data = {};
  let queryObject = [
    {
      key: "tenantId",
      value: tenant
    },
    {
      key: "consumerCodes",
      value: consumerCode
    }
  ];
  let response = await getReceiptData(queryObject);

  if (response && response.Receipt && response.Receipt.length > 0) {
    data.receiptNumber = nullToNa(
      get(response, "Receipt[0].Bill[0].billDetails[0].receiptNumber", "NA")
    );
    data.amountPaid = get(
      response,
      "Receipt[0].Bill[0].billDetails[0].amountPaid",
      0
    );
    data.totalAmount = get(
      response,
      "Receipt[0].Bill[0].billDetails[0].totalAmount",
      0
    );
    data.amountDue = data.totalAmount - data.amountPaid;
    data.paymentMode = nullToNa(
      get(response, "Receipt[0].instrument.instrumentType.name", "NA")
    );
    data.transactionNumber = nullToNa(
      get(response, "Receipt[0].instrument.transactionNumber", "NA")
    );
    data.bankName = get(response, "Receipt[0].instrument.bank.name", "NA");
    data.branchName = get(response, "Receipt[0].instrument.branchName", null);
    data.bankAndBranch = nullToNa(
      data.bankName && data.branchName
        ? data.bankName + ", " + data.branchName
        : get(data, "bankName", "NA")
    );
    data.paymentDate = nullToNa(
      epochToDate(
        get(response, "Receipt[0].Bill[0].billDetails[0].receiptDate", 0)
      )
    );
    data.g8ReceiptNo = nullToNa(
      get(
        response,
        "Receipt[0].Bill[0].billDetails[0].manualReceiptNumber",
        "NA"
      )
    );
    data.g8ReceiptDate = nullToNa(
      epochToDate(
        get(response, "Receipt[0].Bill[0].billDetails[0].manualReceiptDate", 0)
      )
    );
    /** START NOC Fee, Adhoc Penalty/Rebate Calculation */
    let nocAdhocPenalty = 0,
      nocAdhocRebate = 0;
    response.Receipt[0].Bill[0].billDetails[0].billAccountDetails.map(item => {
      let desc = item.taxHeadCode ? item.taxHeadCode : "";
      if (desc === "FIRENOC_FEES") {
        data.nocFee = item.amount;
      } else if (desc === "FIRENOC_ADHOC_PENALTY") {
        nocAdhocPenalty = item.amount;
      } else if (desc === "FIRENOC_ADHOC_REBATE") {
        nocAdhocRebate = item.amount;
      } else if (desc === "FIRENOC_TAXES") {
        data.nocTaxes = item.amount;
      }
    });
    data.nocPenaltyRebate = "NA";
    data.nocAdhocPenaltyRebate = nocAdhocPenalty + nocAdhocRebate;
    /** END */
  }
  store.dispatch(prepareFinalObject("receiptDataForPdf", data));
};

export const loadMdmsData = async tenantid => {
  let localStorageLabels = JSON.parse(
    window.localStorage.getItem(`localization_${getLocale()}`)
  );
  let localizationLabels = transformById(localStorageLabels, "code");
  let data = {};
  let queryObject = [
    {
      key: "tenantId",
      value: `${tenantid}`
    },
    {
      key: "moduleName",
      value: "tenant"
    },
    {
      key: "masterName",
      value: "tenants"
    }
  ];
  let response = await getMdmsData(queryObject);

  if (
    response &&
    response.MdmsRes &&
    response.MdmsRes.tenant.tenants.length > 0
  ) {
    let ulbData = response.MdmsRes.tenant.tenants.find(item => {
      return item.code == tenantid;
    });
    /** START Corporation name generation logic */
    const ulbGrade = get(ulbData, "city.ulbGrade", "NA")
      ? getUlbGradeLabel(get(ulbData, "city.ulbGrade", "NA"))
      : "MUNICIPAL CORPORATION";

    const cityKey = `TENANT_TENANTS_${get(ulbData, "code", "NA")
      .toUpperCase()
      .replace(/[.]/g, "_")}`;

    data.corporationName = `${getTranslatedLabel(
      cityKey,
      localizationLabels
    ).toUpperCase()} ${getTranslatedLabel(ulbGrade, localizationLabels)}`;

    /** END */
    data.corporationAddress = get(ulbData, "address", "NA");
    data.corporationContact = get(ulbData, "contactNumber", "NA");
    data.corporationWebsite = get(ulbData, "domainUrl", "NA");
    data.corporationEmail = get(ulbData, "emailId", "NA");
  }
  store.dispatch(prepareFinalObject("mdmsDataForPdf", data));
};

export const loadUserNameData = async uuid => {
  let data = {};
  let bodyObject = {
    uuid: [uuid]
  };
  let response = await getUserDataFromUuid(bodyObject);

  if (response && response.user && response.user.length > 0) {
    data.auditorName = get(response, "user[0].name", "NA");
  }
  store.dispatch(prepareFinalObject("userDataForPdf", data));
};

/** Data used for creation of receipt is generated and stored in local storage here */
export const loadPdfGenerationData = (applicationNumber, tenant) => {
  /** Logo loaded and stored in local storage in base64 */
  loadUlbLogo(tenant);
  
  loadApplicationData(applicationNumber, tenant); //PB-FN-2019-06-14-002241

  //loadReceiptData(applicationNumber, tenant); //PB-FN-2019-06-14-002241
  //loadMdmsData(tenant);
};

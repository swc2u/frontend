import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { validate } from "egov-ui-framework/ui-redux/screen-configuration/utils";
import { getUserInfo, getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import {
  getQueryArg,
  getTransformedLocalStorgaeLabels,
  getLocaleLabels
} from "egov-ui-framework/ui-utils/commons";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "../../../../ui-utils/api";
import isUndefined from "lodash/isUndefined";
import {
  getCommonCard,
  getCommonValue,
  getCommonCaption,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { sampleGetBill, ApplicationConfiguration } from "../../../../ui-utils/sampleResponses";
import axios from 'axios';
//import {  getFileUrlFromAPI } from "egov-ui-framework/ui-utils/commons";
export const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    gridDefination: {     
      align: "right"
    },
    props: {
      className: "apply-wizard-footer",
      // display:"flex",
      // flexflow:"nowrap",flex-direction: row-reverse;
      style:{
         display:"flex",
        // flexdirection:"rowreverse",  
        placeContent: "flex-end",
      }

    },
    children
  };
};

export const transformById = (payload, id) => {
  return (
    payload &&
    payload.reduce((result, item) => {
      result[item[id]] = {
        ...item
      };

      return result;
    }, {})
  );
};

export const getTranslatedLabel = (labelKey, localizationLabels) => {
  let translatedLabel = null;
  if (localizationLabels && localizationLabels.hasOwnProperty(labelKey)) {
    translatedLabel = localizationLabels[labelKey];
    if (
      translatedLabel &&
      typeof translatedLabel === "object" &&
      translatedLabel.hasOwnProperty("message")
    )
      translatedLabel = translatedLabel.message;
  }
  return translatedLabel || labelKey;
};

export const validateFields = (
  objectJsonPath,
  state,
  dispatch,
  screen 
) => {
  const fields = get(
    state.screenConfiguration.screenConfig[screen],
    objectJsonPath,
    {}
  );
  let isFormValid = true;
  for (var variable in fields) {
    if (fields.hasOwnProperty(variable)) {
      if (
        fields[variable] &&
        fields[variable].props &&
        (fields[variable].props.disabled === undefined ||
          !fields[variable].props.disabled) &&
        !validate(
          screen,
          {
            ...fields[variable],
            value: get(
              state.screenConfiguration.preparedFinalObject,
              fields[variable].jsonPath
            )
          },
          dispatch,
          true
        )
      ) {
        isFormValid = false;
      }
    }
  }
  return isFormValid;
};

export const convertDateToEpoch = (dateString, dayStartOrEnd = "dayend") => {
  //example input format : "2018-10-02"
  try {
    const parts = dateString.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    const DateObj = new Date(Date.UTC(parts[1], parts[2] - 1, parts[3]));
    DateObj.setMinutes(DateObj.getMinutes() + DateObj.getTimezoneOffset());
    if (dayStartOrEnd === "dayend") {
      DateObj.setHours(DateObj.getHours() + 24);
      DateObj.setSeconds(DateObj.getSeconds() - 1);
    }
    return DateObj.getTime();
  } catch (e) {
    return dateString;
  }
};

export const getEpochForDate = date => {
  const dateSplit = date.split("/");
  return new Date(dateSplit[2], dateSplit[1] - 1, dateSplit[0]).getTime();
};

export const sortByEpoch = (data, order) => {
  if (order) {
    return data.sort((a, b) => {
      return a[a.length - 1] - b[b.length - 1];
    });
  } else {
    return data.sort((a, b) => {
      return b[b.length - 1] - a[a.length - 1];
    });
  }
};

export const ifUserRoleExists = role => {
  let userInfo = JSON.parse(getUserInfo());
  const roles = get(userInfo, "roles");
  const roleCodes = roles ? roles.map(role => role.code) : [];
  if (roleCodes.indexOf(role) > -1) {
    return true;
  } else return false;
};

export const convertEpochToDate = dateEpoch => {
  const dateFromApi = new Date(dateEpoch);
  let month = dateFromApi.getMonth() + 1;
  let day = dateFromApi.getDate();
  let year = dateFromApi.getFullYear();
  month = (month > 9 ? "" : "0") + month;
  day = (day > 9 ? "" : "0") + day;
  return `${day}/${month}/${year}`;
};
export const epochToYmd = et => {
  // Return null if et already null
  if (!et) return null;
  // Return the same format if et is already a string (boundary case)
  if (typeof et === "string") return et;
  let date = new Date(et);
  let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  let month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  // date = `${date.getFullYear()}-${month}-${day}`;
  var formatted_date = date.getFullYear() + "-" + month + "-" + day;
  return formatted_date;
};
export const getCurrentFinancialYear = () => {
  var today = new Date();
  var curMonth = today.getMonth();
  var fiscalYr = "";
  if (curMonth > 3) {
    var nextYr1 = (today.getFullYear() + 1).toString();
    fiscalYr = today.getFullYear().toString() + "-" + nextYr1;
  } else {
    var nextYr2 = today.getFullYear().toString();
    fiscalYr = (today.getFullYear() - 1).toString() + "-" + nextYr2;
  }
  return fiscalYr;
};

export const getFinancialYearDates = (format, et) => {
  /** Return the starting date and ending date (1st April to 31st March)
   *  of the financial year of the given date in ET. If no ET given then
   *  return the dates for the current financial year */
  var date = !et ? new Date() : new Date(et);
  var curMonth = date.getMonth();
  var financialDates = { startDate: "NA", endDate: "NA" };
  if (curMonth > 3) {
    switch (format) {
      case "dd/mm/yyyy":
        financialDates.startDate = `01/04/${date.getFullYear().toString()}`;
        financialDates.endDate = `31/03/${(date.getFullYear() + 1).toString()}`;
        break;
      case "yyyy-mm-dd":
        financialDates.startDate = `${date.getFullYear().toString()}-04-01`;
        financialDates.endDate = `${(date.getFullYear() + 1).toString()}-03-31`;
        break;
    }
  } else {
    switch (format) {
      case "dd/mm/yyyy":
        financialDates.startDate = `01/04/${(
          date.getFullYear() - 1
        ).toString()}`;
        financialDates.endDate = `31/03/${date.getFullYear().toString()}`;
        break;
      case "yyyy-mm-dd":
        financialDates.startDate = `${(
          date.getFullYear() - 1
        ).toString()}-04-01`;
        financialDates.endDate = `${date.getFullYear().toString()}-03-31`;
        break;
    }
  }
  return financialDates;
};

export const gotoApplyWithStep = (state, dispatch, step) => {
  const applicationNumber = getQueryArg(
    window.location.href,
    "applicationNumber"
  );
  const applicationNumberQueryString = applicationNumber
    ? `&applicationNumber=${applicationNumber}`
    : ``;
  const applyUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
      ? `/egov-ui-framework/fire-noc/apply?step=${step}${applicationNumberQueryString}`
      : `/fire-noc/apply?step=${step}${applicationNumberQueryString}`;
  dispatch(setRoute(applyUrl));
};

export const showHideAdhocPopup = (state, dispatch, screenKey) => {
  let toggle = get(
    state.screenConfiguration.screenConfig[screenKey],
    "components.adhocDialog.props.open",
    false
  );
  dispatch(
    handleField(screenKey, "components.adhocDialog", "props.open", !toggle)
  );
};

export const getCommonGrayCard = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    children: {
      body: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          ch1: getCommonCard(children, {
            style: {
              backgroundColor: "rgb(242, 242, 242)",
              boxShadow: "none",
              borderRadius: 0,
              overflow: "visible"
            }
          })
        },
        gridDefination: {
          xs: 12
        }
      }
    },
    gridDefination: {
      xs: 12
    }
  };
};
export const objectToDropdown = object => {
  let dropDown = [];
  for (var variable in object) {
    if (object.hasOwnProperty(variable)) {
      dropDown.push({ code: variable });
    }
  }
  return dropDown;
};
export const getLabelOnlyValue = (value, props = {}) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    gridDefination: {
      xs: 6,
      sm: 4
    },
    props: {
      style: {
        marginBottom: "16px"
      },
      ...props
    },
    children: {
      value: getCommonCaption(value)
    }
  };
};

export const convertDateTimeToEpoch = dateTimeString => {
  //example input format : "26-07-2018 17:43:21"
  try {
    const parts = dateTimeString.match(
      /(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/
    );
    return Date.UTC(+parts[3], parts[2] - 1, +parts[1], +parts[4], +parts[5]);
  } catch (e) {
    return dateTimeString;
  }
};

export const getDetailsForOwner = async (state, dispatch, fieldInfo) => {
  try {
    const cardIndex = fieldInfo && fieldInfo.index ? fieldInfo.index : "0";
    const ownerNo = get(
      state.screenConfiguration.preparedFinalObject,
      `FireNOCs[0].fireNOCDetails.applicantDetails.owners[${cardIndex}].mobileNumber`,
      ""
    );
    if (!ownerNo.match(getPattern("MobileNo"))) {
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Incorrect Number!",
            labelKey: "ERR_MOBILE_NUMBER_INCORRECT"
          },
          "error"
        )
      );
      return;
    }
    const owners = get(
      state.screenConfiguration.preparedFinalObject,
      `FireNOCs[0].fireNOCDetails.applicantDetails.owners`,
      []
    );
    //owners from search call before modification.
    const oldOwnersArr = get(
      state.screenConfiguration.preparedFinalObject,
      "FireNOCs[0].fireNOCDetails.applicantDetails.owners",
      []
    );
    //Same no search on Same index
    if (ownerNo === owners[cardIndex].userName) {
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Owner has been added already!",
            labelKey: "ERR_OWNER_ALREADY_ADDED_TOGGLE_MSG"
          },
          "error"
        )
      );
      return;
    }

    //Same no search in whole array
    const matchingOwnerIndex = owners.findIndex(
      item => item.userName === ownerNo
    );
    if (matchingOwnerIndex > -1) {
      if (
        !isUndefined(owners[matchingOwnerIndex].userActive) &&
        owners[matchingOwnerIndex].userActive === false
      ) {
        //rearrange
        dispatch(
          prepareFinalObject(
            `FireNOCs[0].fireNOCDetails.applicantDetails.owners[${matchingOwnerIndex}].userActive`,
            true
          )
        );
        dispatch(
          prepareFinalObject(
            `FireNOCs[0].fireNOCDetails.applicantDetails.owners[${cardIndex}].userActive`,
            false
          )
        );
        //Delete if current card was not part of oldOwners array - no need to save.
        if (
          oldOwnersArr.findIndex(
            item => owners[cardIndex].userName === item.userName
          ) == -1
        ) {
          owners.splice(cardIndex, 1);
          dispatch(
            prepareFinalObject(
              `FireNOCs[0].fireNOCDetails.applicantDetails.owners`,
              owners
            )
          );
        }
      } else {
        dispatch(
          toggleSnackbar(
            true,
            {
              labelName: "Owner already added!",
              labelKey: "ERR_OWNER_ALREADY_ADDED_1"
            },
            "error"
          )
        );
      }
      return;
    } else {
      //New number search only
      let payload = await httpRequest(
        "post",
        "/user/_search?tenantId=pb",
        "_search",
        [],
        {
          tenantId: "pb",
          userName: `${ownerNo}`
        }
      );
      if (payload && payload.user && payload.user.hasOwnProperty("length")) {
        if (payload.user.length === 0) {
          dispatch(
            toggleSnackbar(
              true,
              {
                labelName: "This mobile number is not registered!",
                labelKey: "ERR_MOBILE_NUMBER_NOT_REGISTERED"
              },
              "info"
            )
          );
        } else {
          const userInfo =
            payload.user &&
            payload.user[0] &&
            JSON.parse(JSON.stringify(payload.user[0]));
          if (userInfo && userInfo.createdDate) {
            userInfo.createdDate = convertDateTimeToEpoch(userInfo.createdDate);
            userInfo.lastModifiedDate = convertDateTimeToEpoch(
              userInfo.lastModifiedDate
            );
            userInfo.pwdExpiryDate = convertDateTimeToEpoch(
              userInfo.pwdExpiryDate
            );
          }
          let currOwnersArr = get(
            state.screenConfiguration.preparedFinalObject,
            "FireNOCs[0].fireNOCDetails.applicantDetails.owners",
            []
          );

          currOwnersArr[cardIndex] = userInfo;
          // if (oldOwnersArr.length > 0) {
          //   currOwnersArr.push({
          //     ...oldOwnersArr[cardIndex],
          //     userActive: false
          //   });
          // }
          dispatch(
            prepareFinalObject(
              `FireNOCs[0].fireNOCDetails.applicantDetails.owners`,
              currOwnersArr
            )
          );
        }
      }
    }
  } catch (e) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: e.message, labelKey: e.message },
        "info"
      )
    );
  }
};

export const getReceiptData = async queryObject => {
  try {
    const response = await httpRequest(
      "post",
      "collection-services/payments/_search",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getMdmsData = async queryObject => {
  try {
    const response = await httpRequest(
      "post",
      "egov-mdms-service/v1/_get",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getBill = async queryObject => {
  try {
    const response = await httpRequest(
      "post",
      "/firenoc-calculator/v1/_getbill",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const searchBill = async (dispatch, applicationNumber, tenantId) => {
  try {
    let queryObject = [
      {
        key: "tenantId",
        value: tenantId
      },
      {
        key: "consumerCodes",
        value: applicationNumber
      }
    ];

    // Get Receipt
    let payload = await httpRequest(
      "post",
      "/collection-services/payments/_search",
      "",
      queryObject
    );

    // Get Bill
    const response = await getBill([
      {
        key: "tenantId",
        value: tenantId
      },
      {
        key: "applicationNumber",
        value: applicationNumber
      }
    ]);

    // If pending payment then get bill else get receipt
    let billData = get(payload, "Receipt[0].Bill") || get(response, "Bill");

    if (billData) {
      dispatch(prepareFinalObject("ReceiptTemp[0].Bill", billData));
      const estimateData = createEstimateData(billData[0]);
      estimateData &&
        estimateData.length &&
        dispatch(
          prepareFinalObject(
            "applyScreenMdmsData.estimateCardData",
            estimateData
          )
        );
    }
  } catch (e) {
    console.log(e);
  }
};

export const createEstimateData = billObject => {
  const billDetails = billObject && billObject.billDetails;
  let fees =
    billDetails &&
    billDetails[0].billAccountDetails &&
    billDetails[0].billAccountDetails.map(item => {
      return {
        name: { labelName: item.taxHeadCode, labelKey: item.taxHeadCode },
        value: item.amount,
        info: { labelName: item.taxHeadCode, labelKey: item.taxHeadCode }
      };
    });
  return fees;
};


export const createBill = async (queryObject,dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/billing-service/bill/v2/_fetchbill",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    console.log(error,'fetxh');
  }
};

export const generateBill = async (dispatch, applicationNumber, tenantId) => {
  try {
    if (applicationNumber && tenantId) {
      const queryObj = [
        {
          key: "tenantId",
          value: tenantId
        },
        {
          key: "consumerCode",
          value: applicationNumber
        },
        { key: "services", value: "FIRENOC" }
      ];
      const payload = await createBill(queryObj,dispatch);
      // let payload = sampleGetBill();
      if (payload && payload.Bill[0]) {
        dispatch(prepareFinalObject("ReceiptTemp[0].Bill", payload.Bill));
        const estimateData = createEstimateData(payload.Bill[0]);
        estimateData &&
          estimateData.length &&
          dispatch(
            prepareFinalObject(
              "applyScreenMdmsData.estimateCardData",
              estimateData
            )
          );
      }
    }
  } catch (e) {
    console.log(e);
  }
};

export const resetFields = (state, dispatch) => {
  dispatch(
    handleField(
      "search",
      "components.div.children.NOCApplication.children.cardContent.children.appNOCAndMobNumContainer.children.NOCNo",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.NOCApplication.children.cardContent.children.appNOCAndMobNumContainer.children.applicationNo",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.NOCApplication.children.cardContent.children.appNOCAndMobNumContainer.children.ownerMobNo",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.NOCApplication.children.cardContent.children.appStatusAndToFromDateContainer.children.applicationNo",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.NOCApplication.children.cardContent.children.appStatusAndToFromDateContainer.children.fromDate",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.NOCApplication.children.cardContent.children.appStatusAndToFromDateContainer.children.toDate",
      "props.value",
      ""
    )
  );
};

export const getRequiredDocData = async (action, state, dispatch) => {
  let tenantId =
    process.env.REACT_APP_NAME === "Citizen" ? JSON.parse(getUserInfo()).permanentCity : getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "FireNoc",
          masterDetails: [{ name: "Documents" }]
        }
      ]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    dispatch(prepareFinalObject("searchScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};
export const getLocalizationCodeValue =lable =>{
  const localisationLabels = getTransformedLocalStorgaeLabels();
  return getLocaleLabels(
    lable,
    lable,
    //"PENSION_COMMON_TABLE_COL_EMMPLOYEE_NAME",
    localisationLabels
  );

}
export const getTextToLocalMapping = label => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    // case "Designation":
    //   return getLocaleLabels(
    //     "Designation",
    //     "HR_COMMON_TABLE_COL_DESG",
    //     localisationLabels
    //   );
    case "Department":
      return getLocaleLabels(
        "Department",
        "HR_COMMON_TABLE_COL_DEPT",
        localisationLabels
      );
    /// for recomputation
    case "recomputedBusinessId":
      return getLocaleLabels(
      "recomputedBusinessId",
      "PENSION_EMPLOYEE_RECOMPUTATION_APPLICATION",
      localisationLabels
      );
    case "pensionerNumber":
      return getLocaleLabels(
      "pensionerNumber",
      "PENSION_EMPLOYEE_PENSIONER_NUMBER",
      localisationLabels
      );
      case "businessService":
        return getLocaleLabels(
        "businessService",
        "PENSION_PENSION_BUSINESS_SERVICE",
        localisationLabels
        );
      case "applicationDate":
      return getLocaleLabels(
      "applicationDate",
      "PENSION_PENSION_APPLICATION_DATE",
      localisationLabels
      );
      case "lastModifiedDate":
      return getLocaleLabels(
      "lastModifiedDate",
      "PENSION_PENSION_LASTMODIFIED_DATE",
      localisationLabels
      );
      case "Search Results for Close Application":
      return getLocaleLabels(
      "Search Results for Close Application",
      "PENSION_PENSION_CLOSE_APPLICATION",
      localisationLabels
      );
    case "Code":
      return getLocaleLabels(
        "Action",
        "PENSION_EMPLOYEE_CODE",
        //"PENSION_COMMON_TABLE_COL_EMMPLOYEE_NAME",
        localisationLabels
      );
    case "Action":
      return getLocaleLabels(
        "Action",
        "ACTION",
        //"PENSION_COMMON_TABLE_COL_EMMPLOYEE_NAME",
        localisationLabels
      );
    case "Name":
      return getLocaleLabels(
        "Name",
        "PENSION_EMPLOYEE_NAME",
        //"PENSION_COMMON_TABLE_COL_EMMPLOYEE_NAME",
        localisationLabels
      );

    case "Date Of Birth":
      return getLocaleLabels(
        "Date Of Birth",
        "PENSION_DOB",
        //"PENSION_COMMON_TABLE_COL_DOB",
        localisationLabels
      );
      case "Date Of Birth":
      return getLocaleLabels(
        "pensionerNumber",
        "PENSION_PENSIONER_NUMBER",
        //"PENSION_COMMON_TABLE_COL_DOB",
        localisationLabels
      );

    case "Retirement Date":
      return getLocaleLabels(
        "Retirement Date", 
        "PENSION_DOR", 
      //"PENSION_COMMON_TABLE_COL_RETIREMENT_DATE", 
      localisationLabels);
    case "Designation":
      return getLocaleLabels(
        "Designation",
        "PENSION_EMPLOYEE_DESIGNATION",
        //"PENSION_COMMON_TABLE_COL_DEGIGNATION",
        localisationLabels
      );
      case "gender":
      return getLocaleLabels(
        "gender",
        "PENSION_EMPLOYEE_GENDER",
        //"PENSION_COMMON_TABLE_COL_DEGIGNATION",
        localisationLabels
      );
      case "employee Status":
      return getLocaleLabels(
        "employeeStatus",
        "PENSION_EMPLOYEE_STATUS",
        //"PENSION_COMMON_TABLE_COL_DEGIGNATION",
        localisationLabels
      );
      case "employee Type":
      return getLocaleLabels(
        "employeeType",
        "PENSION_EMPLOYEE_TYPE",
        //"PENSION_COMMON_TABLE_COL_DEGIGNATION",
        localisationLabels
      );
      case "Appointment Date":
      return getLocaleLabels(
        "Appointment Date",
        "PENSION_DOJ_EMPLOYEE",
        //"PENSION_COMMON_TABLE_COL_DEGIGNATION",
        localisationLabels
      );
      case "Application Number":
        return getLocaleLabels(
          "Application Number",
          "PENSION_APPLICATION_NUMBER",
          //"PENSION_COMMON_TABLE_COL_DEGIGNATION",
          localisationLabels
        );
        case "Date of Submission":
          return getLocaleLabels(
            "Date of Submission",
            "PENSION_APPLICATION_DOS",
            //"PENSION_COMMON_TABLE_COL_DEGIGNATION",
            localisationLabels
          );
          case "Date of Joining":
            return getLocaleLabels(
              "Date of Joining",
              "PENSION_DOJ_EMPLOYEE",
              //"PENSION_COMMON_TABLE_COL_DEGIGNATION",
              localisationLabels
            );

    case "Application Date":
      return getLocaleLabels(
        "Application Date",
        "NOC_COMMON_TABLE_COL_APP_DATE_LABEL",
        localisationLabels
      );

    case "Status":
      return getLocaleLabels(
        "Status",
        "PENSION_COMMON_TABLE_COL_STATUS",
        localisationLabels
      );

    case "INITIATED":
      return getLocaleLabels("Initiated,", "NP_INITIATED", localisationLabels);
    case "APPLIED":
      getLocaleLabels("Applied", "NOC_APPLIED", localisationLabels);
    case "PAID":
      getLocaleLabels("Paid", "WF_NEWTL_PENDINGAPPROVAL", localisationLabels);

    case "APPROVED":
      return getLocaleLabels("Approved", "NOC_APPROVED", localisationLabels);
    case "REJECTED":
      return getLocaleLabels("Rejected", "NOC_REJECTED", localisationLabels);
    case "CANCELLED":
      return getLocaleLabels("Cancelled", "NOC_CANCELLED", localisationLabels);
    case "PENDINGAPPROVAL ":
      return getLocaleLabels(
        "Pending for Approval",
        "WF_FIRENOC_PENDINGAPPROVAL",
        localisationLabels
      );
    case "PENDINGPAYMENT":
      return getLocaleLabels(
        "Pending payment",
        "WF_FIRENOC_PENDINGPAYMENT",
        localisationLabels
      );
    case "DOCUMENTVERIFY":
      return getLocaleLabels(
        "Pending for Document Verification",
        "WF_FIRENOC_DOCUMENTVERIFY",
        localisationLabels
      );
    case "FIELDINSPECTION":
      return getLocaleLabels(
        "Pending for Field Inspection",
        "WF_FIRENOC_FIELDINSPECTION",
        localisationLabels
      );

    case "Search Results for Employee":
      return getLocaleLabels(
        "Search Results for Employee",
        "Search Results for Employee",
        localisationLabels
      );
      case "Search Results for Pensioner":
        return getLocaleLabels(
          "Search Results for Pensioner",
          "Search Results for Pensioner",
          localisationLabels

        );

    case "MY_APPLICATIONS":
      return getLocaleLabels(
        "My Applications",
        "TL_MY_APPLICATIONS",
        localisationLabels
      );
      // localization for pensioner search page
      case "MY_APPLICATIONS":
      return getLocaleLabels(
        "My Applications",
        "TL_MY_APPLICATIONS",
        localisationLabels
      );
      case "MY_APPLICATIONS":
      return getLocaleLabels(
        "My Applications",
        "TL_MY_APPLICATIONS",
        localisationLabels
      );
      case "MY_APPLICATIONS":
      return getLocaleLabels(
        "My Applications",
        "TL_MY_APPLICATIONS",
        localisationLabels
      );
      case "MY_APPLICATIONS":
      return getLocaleLabels(
        "My Applications",
        "TL_MY_APPLICATIONS",
        localisationLabels
      );
      case "MY_APPLICATIONS":
      return getLocaleLabels(
        "My Applications",
        "TL_MY_APPLICATIONS",
        localisationLabels
      );
      case "MY_APPLICATIONS":
      return getLocaleLabels(
        "My Applications",
        "TL_MY_APPLICATIONS",
        localisationLabels
      );
      case "MY_APPLICATIONS":
      return getLocaleLabels(
        "My Applications",
        "TL_MY_APPLICATIONS",
        localisationLabels
      );
      case "effectiveYear":
        return getLocaleLabels(
        "effectiveYear",
        "PENSION_EMPLOYEE_PENSION_ESY",
        localisationLabels
        );
        case "effectiveMonth":
        return getLocaleLabels(
        "effectiveMonth",
        "PENSION_MONTH",
        localisationLabels
        );
        case "pensionArrear":
        return getLocaleLabels(
        "pensionArrear",
        "PENSION_EMPLOYEE_PENSION_ESY",
        localisationLabels
        );
        case "fma":
        return getLocaleLabels(
        "fma",
        "PENSION_EMPLOYEE_MR_R",
        localisationLabels
        );
        case "miscellaneous":
        return getLocaleLabels(
        "miscellaneous",
        "PENSION_EMPLOYEE_PENSION_MISCELLENOUS_R",
        localisationLabels
        );
        case "overPayment":
        return getLocaleLabels(
        "overPayment",
        "PENSION_EMPLOYEE_PENSION_OVER_PAYMENT_R",
        localisationLabels
        );
        case "incomeTax":
        return getLocaleLabels(
        "incomeTax",
        "PENSION_EMPLOYEE_PENSION_INCOMETAX_R",
        localisationLabels
        );
        case "cess":
        return getLocaleLabels(
        "cess",
        "PENSION_EMPLOYEE_PENSION_CESS_R",
        localisationLabels
        );
        case "Search Results for Pensioner Monthly Data":
          return getLocaleLabels(
          "Search Results for Pensioner Monthly Data",
          "Search Results for Pensioner Monthly Data",
          localisationLabels
          );
        case "effectiveStartYear":
          return getLocaleLabels(
          "effectiveStartYear",
          "PENSION_EMPLOYEE_PENSION_ESY",
          localisationLabels
          );
          case "effectiveStartMonth":
            return getLocaleLabels(
            "effectiveStartMonth",
            "PENSION_EMPLOYEE_PENSION_ESM",
            localisationLabels
            );
        case "basicPension":
        return getLocaleLabels(
        "basicPension",
        "PENSION_EMPLOYEE_PENSION_BP_R",
        localisationLabels
        );
        case "additionalPension":
        return getLocaleLabels(
        "additionalPension",
        "PENSION_EMPLOYEE_PENSION_AP_R",
        localisationLabels
        );
        case "commutedPension":
        return getLocaleLabels(
        "commutedPension",
        "PENSION_EMPLOYEE_PENSION_COMMMUTED_PEENSION_R",
        localisationLabels
        );
        case "netDeductions":
        return getLocaleLabels(
        "netDeductions",
        "PENSION_EMPLOYEE_PENSION_NET_DEDUCTION_R",
        localisationLabels
        );
        case "finalCalculatedPension":
        return getLocaleLabels(
        "finalCalculatedPension",
        "PENSION_EMPLOYEE_PENSION_FINAL_DEDUCTION_R",
        localisationLabels
        );
        case "interimRelief":
        return getLocaleLabels(
        "interimRelief",
        "PENSION_EMPLOYEE_PENSION_IR_R",
        localisationLabels
        );
        case "da":
        return getLocaleLabels(
        "da",
        "PENSION_EMPLOYEE_PENSION_DA_R",
        localisationLabels
        );
        case "totalPension":
        return getLocaleLabels(
        "totalPension",
        "PENSION_EMPLOYEE_PENSION_TP_R",
        localisationLabels
        );
        case "pensionDeductions":
        return getLocaleLabels(
        "pensionDeductions",
        "PENSION_PENSION_REVISION_TD",
        localisationLabels
        );

  }
};
export const INITIATEDOP = () => {
}
export const downloadAcknowledgementForm = (Application,key, isConfig, mode="download") => {
 
if(isConfig)
{


   let ConfigValue = ApplicationConfiguration() 
  // ConfigValue= key;
  let tenantId = getQueryArg(window.location.href, "tenantId");
  // if(ConfigValue.IsRequiredValiadtion)
  // {
  //   if(tenantId.includes("."))
  // {
 
  //   var vStr = tenantId.split('.');

  //   tenantId = vStr[0];
  // }

  // }
 
  const queryStr = [
    { key: "key", value: key },
    { key: "tenantId", value: tenantId }
  ]
  const DOWNLOADRECEIPT = {
    GET: {
      URL: "/pdf-service/v1/_create",
      ACTION: "_get",
    },
  };
  try {
    
    httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, { ApplicationDetails:Application }, { 'Accept': 'application/json' }, { responseType: 'arraybuffer' })
      .then(res => {
        res.filestoreIds[0]
        if (res && res.filestoreIds && res.filestoreIds.length > 0) {
          res.filestoreIds.map(fileStoreId => {
            downloadReceiptFromFilestoreID(fileStoreId,mode,tenantId)
          })
        } else {
          console.log("Error In Acknowledgement form Download");
        }
      });
  } catch (exception) {
    alert('Some Error Occured while downloading Acknowledgement form!');
  }
}
}
export const downloadAcknowledgementLetter = (Application,key, isConfig,mode="download") => {
  if(isConfig)
  {

  let ConfigValue = ApplicationConfiguration() 
 // ConfigValue= key;
 let tenantId = getQueryArg(window.location.href, "tenantId");
//  if(ConfigValue.IsRequiredValiadtion)
//  {
//    if(tenantId.includes("."))
//  {

//    var vStr = tenantId.split('.');

//    tenantId = vStr[0];
//  }

//  }

 const queryStr = [
   { key: "key", value: key },
   { key: "tenantId", value: tenantId }
 ]
 const DOWNLOADRECEIPT = {
   GET: {
     URL: "/pdf-service/v1/_create",
     ACTION: "_get",
   },
 };
 try {
   httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, { PaymentDetails:Application }, { 'Accept': 'application/json' }, { responseType: 'arraybuffer' })
     .then(res => {
       res.filestoreIds[0]
       if (res && res.filestoreIds && res.filestoreIds.length > 0) {
         res.filestoreIds.map(fileStoreId => {
           downloadReceiptFromFilestoreID(fileStoreId,mode,tenantId)
         })
       } else {
         console.log("Error In Acknowledgement form Download");
       }
     });
 } catch (exception) {
   alert('Some Error Occured while downloading Acknowledgement form!');
 }
}
}

// for file store id
export const getFileUrlFromAPI = async (fileStoreId,tenantId) => {
  const queryObject = [
  	{ key: "tenantId", value: tenantId },
   // { key: "tenantId", value: tenantId || commonConfig.tenantId.length > 2 ? commonConfig.tenantId.split('.')[0] : commonConfig.tenantId },
    { key: "fileStoreIds", value: fileStoreId }
  ];
  try {
    const fileUrl = await httpRequest(
      "get",
      "/filestore/v1/files/url",
      "",
      queryObject
    );
    return fileUrl;
  } catch (e) {
    console.log(e);
  }
};
export const downloadReceiptFromFilestoreID=(fileStoreId,mode,tenantId)=>{
  getFileUrlFromAPI(fileStoreId,tenantId).then(async(fileRes) => {
    if (mode === 'download') {
      var win = window.open(fileRes[fileStoreId], '_blank');
      if(win){
        win.focus();
      }
    }
    else {
     // printJS(fileRes[fileStoreId])
      var response =await axios.get(fileRes[fileStoreId], {
        //responseType: "blob",
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf"
        }
      });
      console.log("responseData---",response);
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      var myWindow = window.open(fileURL);
      if (myWindow != undefined) {
        myWindow.addEventListener("load", event => {
          myWindow.focus();
          myWindow.print();
        });
      }
    
    }
  });
  
}

export const checkValueForNA = value => {
  return value ? value : "NA";
};

export const checkValueForNotAsigned = value => {
  return value ? value : getLocalizationCodeValue("PENSION_WORKFLOW_NOT_ASSIGNED");
};
export const epochToYmdDate = et => {
  if (!et) return null;
  if (typeof et === "string") return et;
  let d = new Date(et),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};
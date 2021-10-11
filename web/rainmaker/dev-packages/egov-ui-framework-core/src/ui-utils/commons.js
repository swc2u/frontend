import isEmpty from "lodash/isEmpty";
import { httpRequest, uploadFile } from "./api.js";
import cloneDeep from "lodash/cloneDeep";
import {
  localStorageSet,
  localStorageGet,
  getLocalization,
  getLocale,
  getTenantId,
  getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";
import { toggleSnackbar, toggleSpinner, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import orderBy from "lodash/orderBy";
import get from "lodash/get";
import set from "lodash/set";
import commonConfig from "config/common.js";
import { validate } from "egov-ui-framework/ui-redux/screen-configuration/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getRequiredDocuments } from "egov-ui-framework/ui-containers/RequiredDocuments/reqDocs";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import store from "redux/store";

export const addComponentJsonpath = (components, jsonPath = "components") => {
  for (var componentKey in components) {
    if (components.hasOwnProperty(componentKey)) {
      if (components[componentKey].children) {
        components[
          componentKey
        ].componentJsonpath = `${jsonPath}.${componentKey}`;
        const childJsonpath = `${components[componentKey].componentJsonpath}.children`;
        addComponentJsonpath(components[componentKey].children, childJsonpath);
      } else {
        components[
          componentKey
        ].componentJsonpath = `${jsonPath}.${componentKey}`;
      }
    }
  }
  return components;
};

export const getQueryArg = (url, name) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

export const addQueryArg = (url, queries = []) => {
  const urlParts = url.split("?");
  const path = urlParts[0];
  let queryParts = urlParts.length > 1 ? urlParts[1].split("&") : [];
  queries.forEach(query => {
    const key = query.key;
    const value = query.value;
    const newQuery = `${key}=${value}`;
    queryParts.push(newQuery);
  });
  const newUrl = path + "?" + queryParts.join("&");
  return newUrl;
};

export const isFieldEmpty = field => {
  if (field === undefined || field === null) {
    return true;
  }
  if (typeof field !== "object") {
    field = field.toString().trim();
    return isEmpty(field);
  }
  return false;
};

export const slugify = term => {
  return term.toLowerCase().replace(/\s+/, "-");
};

export const persistInLocalStorage = obj => {
  Object.keys(obj).forEach(objKey => {
    const objValue = obj[objKey];
    localStorageSet(objKey, objValue);
  }, this);
};

export const ifUserRoleExists = role => {
  let userInfo = JSON.parse(getUserInfo());
  const roles = get(userInfo, "roles");
  const roleCodes = roles ? roles.map(role => role.code) : [];
  if (roleCodes.indexOf(role) > -1) {
    return true;
  } else return false;
};

export const fetchFromLocalStorage = key => {
  return localStorageGet(key) || null;
};

export const trimObj = obj => {
  if (!Array.isArray(obj) && typeof obj !== "object") return obj;
  for (var key in obj) {
    obj[key.trim()] =
      typeof obj[key] === "string" ? obj[key].trim() : trimObj(obj[key]);
    if (key === "") delete obj[key];
  }
  return obj;
};

export const getDateInEpoch = () => {
  return new Date().getTime();
};

export const getImageUrlByFile = file => {
  return new Promise(resolve => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = e => {
      const fileurl = e.target.result;
      resolve(fileurl);
    };
  });
};

export const getFileSize = fileSize => {
  const size = parseFloat(fileSize / 1024).toFixed(2);
  return size;
};

export const isFileValid = (file, acceptedFiles) => {
  const mimeType = file["type"];
  return (
    (mimeType &&
      acceptedFiles &&
      acceptedFiles.indexOf(mimeType.split("/")[1]) > -1) ||
    false
  );
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

export const getTransformedLocalStorgaeLabels = () => {
  const localeLabels = JSON.parse(
    getLocalization(`localization_${getLocale()}`)
  );
  return transformById(localeLabels, "code");
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

export const getLocaleLabels = (label, labelKey, localizationLabels) => {
  if (!localizationLabels)
    localizationLabels = transformById(
      JSON.parse(getLocalization(`localization_${getLocale()}`)),
      "code"
    );
  if (labelKey) {
    let translatedLabel = getTranslatedLabel(labelKey, localizationLabels);
    if (!translatedLabel || labelKey === translatedLabel) {
      return translatedLabel;
    } else {
      return translatedLabel;
    }
  } else {
    return label;
  }
};

export const replaceStrInPath = (inputString, search, replacement) => {
  String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, "g"), replacement);
  };
  return inputString.replaceAll(search, replacement);
};

export const getFileUrlFromAPI = async (fileStoreId,tenantId) => {

  if(process.env.REACT_APP_NAME !== "Citizen")
  {
    if(tenantId === undefined || tenantId === null)
    tenantId = tenantId || commonConfig.tenantId.length > 2 ? commonConfig.tenantId.split('.')[0] : commonConfig.tenantId
  }
  else{
    tenantId = tenantId || commonConfig.tenantId.length > 2 ? commonConfig.tenantId.split('.')[0] : commonConfig.tenantId
  }
  const queryObject = [
  	//{ key: "tenantId", value: tenantId||commonConfig.tenantId },
    { key: "tenantId", value: tenantId },
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

const getAllFileStoreIds = async ProcessInstances => {
  return (
    ProcessInstances &&
    ProcessInstances.reduce((result, eachInstance) => {
      if (eachInstance.documents) {
        let fileStoreIdArr = eachInstance.documents.map(item => {
          return item.fileStoreId;
        });
        result[eachInstance.id] = fileStoreIdArr.join(",");
      }
      return result;
    }, {})
  );
};


export const getFileUrl = (linkText="") => {
  const linkList = linkText.split(",");
  let fileURL = '';
  linkList&&linkList.map(link => {
    if (!link.includes('large') && !link.includes('medium') && !link.includes('small')) {
      fileURL = link;
    }
  })
  return fileURL;
}

export const setDocuments = async (
  payload,
  sourceJsonPath,
  destJsonPath,
  dispatch,
  businessService
) => {
    const uploadedDocData = get(payload, sourceJsonPath);
    if(!!uploadedDocData && uploadedDocData.length && uploadedDocData[0] != null){
    const fileStoreIds =
      uploadedDocData &&
      uploadedDocData
        .map(item => {
          return item.fileStoreId;
        })
        .join(",");
    const fileUrlPayload =
      fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
    const reviewDocData =
      uploadedDocData &&
      uploadedDocData.map((item, index) => {
        return {
          title: !!businessService ? `${businessService}_${item.documentType}` : item.documentType || "",
          link:
            (fileUrlPayload &&
              fileUrlPayload[item.fileStoreId] &&
              getFileUrl(fileUrlPayload[item.fileStoreId])) ||
            "",
          linkText: "Download",
          name:
            (fileUrlPayload &&
              fileUrlPayload[item.fileStoreId] &&
              decodeURIComponent(
                getFileUrl(fileUrlPayload[item.fileStoreId])
                  .split("?")[0]
                  .split("/")
                  .pop()
                  .slice(13)
              )) ||
            `Document - ${index + 1}`
        };
      });
    reviewDocData && dispatch(prepareFinalObject(destJsonPath, reviewDocData));
  }
  
};


export const addWflowFileUrl = async (ProcessInstances, prepareFinalObject) => {
  const fileStoreIdByAction = await getAllFileStoreIds(ProcessInstances);
  const fileUrlPayload = await getFileUrlFromAPI(
    Object.values(fileStoreIdByAction).join(",")
  );
  const processInstances = cloneDeep(ProcessInstances);
  processInstances.map(item => {
    if (item.documents && item.documents.length > 0) {
      item.documents.forEach(i => {
        if (i.fileStoreId && fileUrlPayload[i.fileStoreId]) {
          i.link = getFileUrl(fileUrlPayload[i.fileStoreId]);
          i.title = `${i.documentType}`;
          i.name = decodeURIComponent(
            getFileUrl(fileUrlPayload[i.fileStoreId])
              .split("?")[0]
              .split("/")
              .pop()
              .slice(13)
          );
          i.linkText = "View";
        }
      });
    }
  });
  prepareFinalObject("workflow.ProcessInstances", processInstances);
};

export const setBusinessServiceDataToLocalStorage = async (
  queryObject,
  dispatch
) => {
  try {
    dispatch(toggleSpinner());
    const payload = await httpRequest(
      "post",
      "egov-workflow-v2/egov-wf/businessservice/_search",
      "_search",
      queryObject
    );
    if (
      payload &&
      payload.BusinessServices &&
      payload.BusinessServices.length > 0
    ) {
      localStorageSet(
        "businessServiceData",
        JSON.stringify(get(payload, "BusinessServices"))
      );
    } else {
      // dispatch(
      //   toggleSnackbar(
      //     true,
      //     {
      //       labelName: "Business Service returned empty object",
      //       labelKey: "ERR_NOT_AUTHORISED_BUSINESS_SERVICE"
      //     },
      //     "error"
      //   )
      // );
    }
    dispatch(toggleSpinner());
  } catch (e) {
    dispatch(toggleSpinner());
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Not authorized to access Business Service!",
          labelKey: "ERR_NOT_AUTHORISED_BUSINESS_SERVICE"
        },
        "error"
      )
    );
  }
};

export const acceptedFiles = acceptedExt => {
  const splitExtByName = acceptedExt.split(",");
  const acceptedFileTypes = splitExtByName.reduce((result, curr) => {
    if (curr.includes("image")) {
      result.push("image");
    }
	 else if (curr.includes("vnd.ms-excel")) {
      result.push("vnd.ms-excel");
    }
	 else if (curr.includes("ms-excel")) {
      result.push("ms-excel");
    }
    else if (curr.includes("audio")) {
      result.push("audio");
    }	
    else if (curr.includes("video")) {
      result.push("video");
    } else {
      result.push(curr.split(".")[1]);
    }
    return result;
  }, []);
  return acceptedFileTypes;
};

export const handleFileUpload = (event, handleDocument, props) => {
  const S3_BUCKET = {
    endPoint: "filestore/v1/files"
  };
  let uploadDocument = true;
  const { inputProps, maxFileSize, moduleName, documents, maxFiles,pageName } = props;
  const input = event.target;
  if (input.files && input.files.length > 0) {
    const files = input.files;
    // validate double file extension
    let valid = ((files[0].name.toLowerCase().indexOf(".txt") !== -1)
                      || (files[0].name.toLowerCase().indexOf(".php") !== -1)
                      || (files[0].name.toLowerCase().indexOf(".exe") !== -1)
                      || (files[0].name.toLowerCase().indexOf(".json") !== -1))//extension.includes(file.name);
            if(!valid)
            {
    let existingfileSize = 0
    if (moduleName === 'egov-echallan' && maxFiles > 1) {
      documents && documents.forEach(doc => {
        existingfileSize += parseFloat(doc.fileSize);
      });
    }
    setTimeout(() => {
      
    
    Object.keys(files).forEach(async (key, index) => {
      const file = files[key];
      let fileValid = isFileValid(file, acceptedFiles(inputProps.accept));
      let isSizeValid = 0;
      if (moduleName === 'egov-echallan' && maxFiles > 1) {
        existingfileSize += parseFloat(file.size)
        isSizeValid = getFileSize(existingfileSize) <= maxFileSize;
      } 
      
      
      else {
        isSizeValid = getFileSize(file.size) <= maxFileSize;
      }
      if (moduleName === 'egov-opms') {
       fileValid = isFileValid(file, inputProps.accept);
      }
	  
      if(pageName !== undefined)
      {
        if(pageName ==='egov-wns-upload')
        {
        const file_ = files[key];
        //fileValid = isFileValid(file_, acceptedFiles(inputProps.accept));
       // if(file_.name.indexOf("xlsx")>1 || file_.name.indexOf("xls")>1)
        if(file_.name.indexOf("csv")>1)
        {
          fileValid = true
        }
        existingfileSize += parseFloat(file.size)
        if(existingfileSize<=maxFileSize)
        {
          isSizeValid = true
        }
      }
        
      }
      if (localStorageGet("modulecode") === "PR" || localStorageGet("modulecode") === "SCP") {
        if (localStorage.getItem("libdocindex") != null && localStorage.getItem("libdocindex") != 'undefined') {
          switch (localStorage.getItem("libdocindex")) {
              case "0" :
                 fileValid = isFileValid(file, ["pdf","jpg","jpeg","png"]);
              break;
              case "1" :
                fileValid = isFileValid(file, ["pdf","jpg","jpeg","png"]);
              break;
              case "2" :
                fileValid = isFileValid(file, ["pdf","jpg","jpeg","png"]);
              break;
              case "3" :
                fileValid = isFileValid(file, ["pdf","jpg","jpeg","png"]);
              break;
              case "4" :
              fileValid = isFileValid(file, ["pdf","jpg","jpeg","png"]);
              break;
              case "5" :
              fileValid = isFileValid(file, ["WAV", "wav", "AIFF", "aiff", "AU", "au", "PCM", "pcm", "BWF", "bwf", "mp3", "mpeg", "mp4", "M4P", "m4p", "m4v", "M4V", "MPG", "mpg", "mp2", "MP2", "MPE", "mpe", "MPV", "mpv", "MOV", "mov", "qt", "QT","quicktime","ogg","basic",]);
              break;
              default :
              break;
            }
        }
      }
	  
    if (!fileValid) {
        if (localStorageGet("modulecode") === "PR" || localStorageGet("modulecode") === "SCP") {
        var msg=`File type not supported`
        store.dispatch(toggleSnackbar(true, { labelName:msg}, "warning"));
        uploadDocument = false;
    
      } 
        else {
          if(file.type !==inputProps.accept){
            var msg=`File type not supported`
       store.dispatch(toggleSnackbar(true, { labelName:msg}, "warning"));
        uploadDocument = false;
          }
          else{
          if (file.type.match(/^image\//) || file.type.match(/^pdf\//)) {
        var msg=`Only image or pdf files can be uploaded`
        store.dispatch(toggleSnackbar(true, { labelName:msg}, "warning"));
        uploadDocument = false;

  }
          else {
       var msg=`File type not supported`
       store.dispatch(toggleSnackbar(true, { labelName:msg}, "warning"));
        uploadDocument = false;
      } 
    }
      }  
    }
     
    if (!isSizeValid) {
       var msg=`Maximum file size can be ${Math.round(maxFileSize / 1000)} MB`
       store.dispatch(toggleSnackbar(true, { labelName:msg}, "warning"));
       uploadDocument = false;
     }
      if (uploadDocument) {
        if (file.type.match(/^image\//)) {
          const fileStoreId = await uploadFile(
            S3_BUCKET.endPoint,
            moduleName === undefined?(pageName !== undefined?(pageName ==='wns'?"egov-wns":moduleName):moduleName):moduleName,
            file,
            commonConfig.tenantId
          );
          handleDocument(file, fileStoreId);
        } else {
          const fileStoreId = await uploadFile(
            S3_BUCKET.endPoint,
            moduleName === undefined?"egov-wns":moduleName,
            file,
            commonConfig.tenantId
          );
          handleDocument(file, fileStoreId);
        }
      }
    });
  }, 1000);
  }
  else{
    // dispatch(
    //   toggleSnackbar(
    //     true,
    //     {
    //       labelName: "Please select valid file!",
    //       labelKey: "CORE_COMMON_INVALID_FILE_EXTENSION"
    //     },
    //     "warning"
    //   )
    // );
    store.dispatch(toggleSnackbar(true, { labelName: "Please select valid file!",
    labelKey: "CORE_COMMON_INVALID_FILE_EXTENSION"}, "warning"));
   // toggleSnackbarAndSetText(true, { labelName: "The file is not a valid image", labelKey: "CORE_COMMON_INVALID_IMAGE_FILE" }, "warning");
  }
  

  }
};

//localizations
export const getTransformedLocale = label => {
  return label && label.toUpperCase().replace(/[.:-\s\/]/g, "_");
};

export const appendModulePrefix = (value, localePrefix) => {
  const { moduleName, masterName } = localePrefix;

  const transformedValue = `${getTransformedLocale(
    moduleName
  )}_${getTransformedLocale(masterName)}_${getTransformedLocale(value)}`;
  return transformedValue;
};

export const orderWfProcessInstances = processInstances => {
  processInstances = orderBy(
    processInstances,
    "auditDetails.lastModifiedTime",
    "asc"
  );
  let initiatedFound = false;
  const filteredInstances = processInstances.reverse().reduce((acc, item) => {
    if (item.action == "INITIATE" && !initiatedFound) {
      initiatedFound = true;
      acc.push(item);
    } else if (item.action !== "INITIATE") {
      acc.push(item);
    }
    return acc;
  }, []);
  return filteredInstances.reverse();
};

export const getSelectedTabIndex = paymentType => {
  switch (paymentType) {
    case "Cash":
      return {
        selectedPaymentMode: "cash",
        selectedTabIndex: 0,
        fieldsToValidate: ["payeeDetails"]
      };
    case "Cheque":
      return {
        selectedPaymentMode: "cheque",
        selectedTabIndex: 1,
        fieldsToValidate: ["payeeDetails", "chequeDetails"]
      };
    case "DD":
      return {
        selectedPaymentMode: "demandDraft",
        selectedTabIndex: 2,
        fieldsToValidate: ["payeeDetails", "demandDraftDetails"]
      };
    case "Card":
      return {
        selectedPaymentMode: "card",
        selectedTabIndex: 3,
        fieldsToValidate: ["payeeDetails", "cardDetails"]
      };
    default:
      return {
        selectedPaymentMode: "cash",
        selectedTabIndex: 0,
        fieldsToValidate: ["payeeDetails"]
      };
  }
};
export const getMultiUnits = multiUnits => {
  let hasTradeType = false;
  let hasAccessoryType = false;

  let mergedUnits =
    multiUnits &&
    multiUnits.reduce((result, item) => {
      hasTradeType = item.hasOwnProperty("tradeType");
      hasAccessoryType = item.hasOwnProperty("accessoryCategory");
      if (item && item !== null && (hasTradeType || hasAccessoryType)) {
        if (item.hasOwnProperty("id")) {
          if (item.hasOwnProperty("active") && item.active) {
            if (item.hasOwnProperty("isDeleted") && !item.isDeleted) {
              set(item, "active", false);
              result.push(item);
            } else {
              result.push(item);
            }
          }
        } else {
          if (!item.hasOwnProperty("isDeleted")) {
            result.push(item);
          }
        }
      }
      return result;
    }, []);

  return mergedUnits;
};

export const getUlbGradeLabel = ulbGrade => {
  if (ulbGrade) {
    let ulbWiseHeaderName = ulbGrade.toUpperCase();
    if (ulbWiseHeaderName.indexOf(" ") > 0) {
      ulbWiseHeaderName = ulbWiseHeaderName.split(" ").join("_");
    }
    return "ULBGRADE" + "_" + ulbWiseHeaderName;
  }
};

export const findItemInArrayOfObject = (arr, conditionCheckerFn) => {
  for (let i = 0; i < arr.length; i++) {
    if (conditionCheckerFn(arr[i])) {
      return arr[i];
    }
  }
};

export const validateFields = (
  objectJsonPath,
  state,
  dispatch,
  screen = "apply"
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

export const downloadPDFFileUsingBase64 = (receiptPDF, filename) => {
  if (typeof mSewaApp === "undefined") {
    // we are running in browser
    receiptPDF.download(filename);
  } else {
    // we are running under webview
    receiptPDF.getBase64(data => {
      mSewaApp.downloadBase64File(data, filename);
    });
  }
};

if (window) {
  window.downloadPDFFileUsingBase64 = downloadPDFFileUsingBase64;
}
// Get user data from uuid API call
export const getUserDataFromUuid = async bodyObject => {
  try {
    const response = await httpRequest(
      "post",
      "/user/_search",
      "",
      [],
      bodyObject
    );
    return response;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getCommonPayUrl = (dispatch, applicationNo, tenantId) => {
  const url = `/egov-common/pay?consumerCode=${applicationNo}&tenantId=${tenantId}`;
  dispatch(setRoute(url));
};


export const getTodaysDateInYMD = () => {
  let date = new Date();
  //let month = date.getMonth() + 1;
  let month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  date = `${date.getFullYear()}-${month}-${day}`;
  return date;
};

export const isPublicSearch = () => {
  return location && location.pathname && location.pathname.includes("/withoutAuth");
}

export const getStatusKey = (status) => {
  switch (status) {
    case "ACTIVE":
      return { labelName: "Active", labelKey: "ACTIVE" };
    case "INACTIVE":
      return { labelName: "Inactive", labelKey: "INACTIVE" };
    case "INITIATED":
      return { labelName: "Initiated", labelKey: "INITIATED" };
    case "APPLIED":
      return { labelName: "Applied", labelKey: "APPLIED" };
    case "PAID":
      return { labelName: "Paid", labelKey: "PAID" };

    case "APPROVED":
      return { labelName: "Approved", labelKey: "APPROVED" };
    case "REJECTED":
      return { labelName: "Rejected", labelKey: "REJECTED" };
    case "CANCELLED":
      return { labelName: "Cancelled", labelKey: "CANCELLED" };
    case "PENDINGAPPROVAL ":
      return {
        labelName:
          "Pending for Approval",
        labelKey:
          "PENDINGAPPROVAL"
      };
    case "PENDINGPAYMENT":
      return {
        labelName:
          "Pending payment",
        labelKey:
          "PENDINGPAYMENT"
      };
    case "DOCUMENTVERIFY":
      return {
        labelName:
          "Pending for Document Verification",
        labelKey: "DOCUMENTVERIFY"
      };
    case "FIELDINSPECTION":
      return {
        labelKey:
          "FIELDINSPECTION", labelName:
          "Pending for Field Inspection"
      };
    default:
      return {
        labelName: status, labelKey: status
      }

  }
}

export const getRequiredDocData = async (action, dispatch, moduleDetails) => {
  let tenantId =
    process.env.REACT_APP_NAME === "Citizen" ? JSON.parse(getUserInfo()).permanentCity : getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: moduleDetails[0].moduleName === "ws-services-masters" ? commonConfig.tenantId : tenantId,
      moduleDetails: moduleDetails
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
    const moduleName = moduleDetails[0].moduleName;
    let documents = get(
      payload.MdmsRes,
      `${moduleName}.Documents`,
      []
    );

    if (moduleName === "PropertyTax") {
      payload.MdmsRes.tenant.tenants = payload.MdmsRes.tenant.citymodule[1].tenants;
    }
    const reqDocuments = getRequiredDocuments(documents, moduleName, footerCallBackForRequiredDataModal(moduleName));
    set(
      action,
      "screenConfig.components.adhocDialog.children.popup",
      reqDocuments
    );
    dispatch(prepareFinalObject("searchScreenMdmsData", payload.MdmsRes));
    return payload;
  } catch (e) {
    console.log(e);
  }
};

const footerCallBackForRequiredDataModal = (moduleName) => {
  switch (moduleName) {
    case "FireNoc":
      return (state, dispatch) => {
        dispatch(prepareFinalObject("FireNOCs", []));
        dispatch(prepareFinalObject("documentsUploadRedux", {}));
        const applyUrl =
          process.env.REACT_APP_SELF_RUNNING === "true" ? `/egov-ui-framework/fire-noc/apply` : `/fire-noc/apply`;
        dispatch(setRoute(applyUrl));
      };
    case "PropertyTax":
      return (state, dispatch) => {
        dispatch(prepareFinalObject("documentsUploadRedux", {}));
        const applyUrl = `/property-tax/assessment-form`;
        dispatch(setRoute(applyUrl));
      };
    case "ws-services-masters":
      return (state, dispatch) => {
        dispatch(prepareFinalObject("WaterConnection", []));
        dispatch(prepareFinalObject("SewerageConnection", []));
        dispatch(prepareFinalObject("applyScreen", {}));
        dispatch(prepareFinalObject("searchScreen", {}));
      // const url = `/pt-common-screens/propertySearch?redirectUrl=/wns/apply`;
       const url = `/wns/apply`;
        const applyUrl = process.env.REACT_APP_NAME === "Citizen" ? url : url
        dispatch(setRoute(applyUrl));
      };
  }
}
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

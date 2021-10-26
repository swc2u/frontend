
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getFileUrlFromAPI, getMultiUnits, getQueryArg, getTransformedLocale, setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
import { getapplicationNumber, getapplicationType, getOPMSTenantId, getUserInfo, setapplicationNumber, lSRemoveItemlocal, lSRemoveItem, localStorageGet, setapplicationMode, localStorageSet } from "egov-ui-kit/utils/localStorageUtils";

import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import store from "redux/store";
import { convertDateToEpoch, getCheckBoxJsonpath, getCurrentFinancialYear, getHygeneLevelJson, getLocalityHarmedJson, getSafetyNormsJson, getTradeTypeDropdownData, getTranslatedLabel, ifUserRoleExists, setFilteredTradeTypes, updateDropDowns, searchBill, fetchBill, searchdemand, createDemandForAdvNOC, checkForRole } from "../ui-config/screens/specs/utils";
import { httpRequest } from "./api";
import { toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";

import { setRoute } from "egov-ui-framework/ui-redux/app/actions";


const role_name = JSON.parse(getUserInfo()).roles[0].code


export const getSearchResults = async queryObject => {

  let data = {
    "tenantId": getOPMSTenantId(),
    "applicationType": getapplicationType(),
    "applicationStatus": "INITIATED",
    "dataPayload": {
      "createdBy": JSON.parse(getUserInfo()).uuid,
      "applicationType": getapplicationType()
    }
  };
  try {
    const response = await httpRequest(
      "post",
      "/pm-services/noc/_get",
      "",
      [],
      data
    );
    return response;

  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }

};

//view
export const getSearchResultsView = async queryObject => {
  try {
    const response = await httpRequest(
      "post", "/pm-services/noc/_view", "",
      [],
      {
        "tenantId": queryObject[0]["value"],
        "applicationId": queryObject[1]["value"],
        "applicationType": getapplicationType(),
        "dataPayload": {
          "createdBy": JSON.parse(getUserInfo()).uuid,
          "applicationType": getapplicationType()
        }
      }
    );
    return response;

  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true, { labelName: error.message, labelCode: error.message }, "error"
      )
    );
  }
};

export const preparepopupDocumentsUploadData = (state, dispatch, applicationtype = 'PETNOC') => {
  let documents = get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.PetNOC.RemarksDocuments",
    []
  );
  // }	
  documents = documents.filter(item => {
    return item.active;
  });
  let documentsContract = [];
  let tempDoc = {};
  documents.forEach(doc => {
    let card = {};
    card["code"] = doc.documentType;
    card["title"] = doc.documentType;
    card["cards"] = [];
    tempDoc[doc.documentType] = card;
  });

  documents.forEach(doc => {
    if (doc.code === "PET.REMARK_DOCUMENT_SI" && doc.hasMultipleRows && doc.options) {
      let buildingsData = get(state,
        "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.buildings",
        []
      );

      buildingsData.forEach(building => {
        let card = {};
        card["name"] = building.name;
        card["code"] = doc.code;
        card["hasSubCards"] = true;
        card["subCards"] = [];
        doc.options.forEach(subDoc => {
          let subCard = {};
          subCard["name"] = subDoc.code;
          subCard["required"] = subDoc.required ? true : false;
          card.subCards.push(subCard);
        });
        tempDoc[doc.documentType].cards.push(card);
      });
    } else {
      let card = {};
      card["name"] = doc.code;
      card["code"] = doc.code;
      card["required"] = doc.required ? true : false;
      if (doc.hasDropdown && doc.dropdownData) {
        let dropdown = {};
        dropdown.label = "NOC_SELECT_DOC_DD_LABEL";
        dropdown.required = true;
        dropdown.menu = doc.dropdownData.filter(item => {
          return item.active;
        });
        dropdown.menu = dropdown.menu.map(item => {
          return { code: item.code, label: getTransformedLocale(item.code) };
        });
        card["dropdown"] = dropdown;
      }
      tempDoc[doc.documentType].cards.push(card);
    }
  });

  Object.keys(tempDoc).forEach(key => {
    documentsContract.push(tempDoc[key]);
  });

  dispatch(prepareFinalObject("documentsContract", documentsContract));
};

export const preparepopupDocumentsADVUploadData = (state, dispatch, applicationtype = 'ADVERTISEMENTNOC') => {
  let documents = get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.AdvertisementNOC.AdvertisementNOCRemarksDocuments",
    []
  );
  documents = documents.filter(item => {
    return item.active;
  });
  let documentsContract = [];
  let tempDoc = {};
  documents.forEach(doc => {
    let card = {};
    card["code"] = doc.documentType;
    card["title"] = doc.documentType;
    card["cards"] = [];
    tempDoc[doc.documentType] = card;
  });

  documents.forEach(doc => {
    if (doc.code === "AdvertisementNOC.REMARK_DOCUMENT" && doc.hasMultipleRows && doc.options) {
      let buildingsData = get(state,
        "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.buildings",
        []
      );

      buildingsData.forEach(building => {
        let card = {};
        card["name"] = building.name;
        card["code"] = doc.code;
        card["hasSubCards"] = true;
        card["subCards"] = [];
        doc.options.forEach(subDoc => {
          let subCard = {};
          subCard["name"] = subDoc.code;
          subCard["required"] = subDoc.required ? true : false;
          card.subCards.push(subCard);
        });
        tempDoc[doc.documentType].cards.push(card);
      });
    } else {
      let card = {};
      card["name"] = doc.code;
      card["code"] = doc.code;
      card["required"] = doc.required ? true : false;
      if (doc.hasDropdown && doc.dropdownData) {
        let dropdown = {};
        dropdown.label = "NOC_SELECT_DOC_DD_LABEL";
        dropdown.required = true;
        dropdown.menu = doc.dropdownData.filter(item => {
          return item.active;
        });
        dropdown.menu = dropdown.menu.map(item => {
          return { code: item.code, label: getTransformedLocale(item.code) };
        });
        card["dropdown"] = dropdown;
      }
      tempDoc[doc.documentType].cards.push(card);
    }
  });

  Object.keys(tempDoc).forEach(key => {
    documentsContract.push(tempDoc[key]);
  });

  dispatch(prepareFinalObject("documentsContract", documentsContract));
};

export const preparepopupDocumentsSellMeatUploadData = (state, dispatch, applicationtype = 'SELLMEATNOC') => {

  let documents = get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.SellMeatNOC.SellMeatNOCRemarksDocuments",
    []
  );
  documents = documents.filter(item => {
    return item.active;
  });
  let documentsContract = [];
  let tempDoc = {};
  documents.forEach(doc => {
    let card = {};
    card["code"] = doc.documentType;
    card["title"] = doc.documentType;
    card["cards"] = [];
    tempDoc[doc.documentType] = card;
  });

  documents.forEach(doc => {
    if (doc.code === "SellMeatNOC.REMARK_DOCUMENT" && doc.hasMultipleRows && doc.options) {
      let buildingsData = get(state,
        "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.buildings",
        []
      );

      buildingsData.forEach(building => {
        let card = {};
        card["name"] = building.name;
        card["code"] = doc.code;
        card["hasSubCards"] = true;
        card["subCards"] = [];
        doc.options.forEach(subDoc => {
          let subCard = {};
          subCard["name"] = subDoc.code;
          subCard["required"] = subDoc.required ? true : false;
          card.subCards.push(subCard);
        });
        tempDoc[doc.documentType].cards.push(card);
      });
    } else {
      let card = {};
      card["name"] = doc.code;
      card["code"] = doc.code;
      card["required"] = doc.required ? true : false;
      if (doc.hasDropdown && doc.dropdownData) {
        let dropdown = {};
        dropdown.label = "NOC_SELECT_DOC_DD_LABEL";
        dropdown.required = true;
        dropdown.menu = doc.dropdownData.filter(item => {
          return item.active;
        });
        dropdown.menu = dropdown.menu.map(item => {
          return { code: item.code, label: getTransformedLocale(item.code) };
        });
        card["dropdown"] = dropdown;
      }
      tempDoc[doc.documentType].cards.push(card);
    }
  });

  Object.keys(tempDoc).forEach(key => {
    documentsContract.push(tempDoc[key]);
  });

  dispatch(prepareFinalObject("documentsContract", documentsContract));
};
export const preparepopupDocumentsRoadCutUploadData = (state, dispatch, applicationtype = 'ROADCUTNOC') => {
  let documents = get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.RoadCutNOC.RoadCutNOCRemarksDocuments",
    []
  );
  documents = documents.filter(item => {
    return item.active;
  });
  let documentsContract = [];
  let tempDoc = {};
  documents.forEach(doc => {
    let card = {};
    card["code"] = doc.documentType;
    card["title"] = doc.documentType;
    card["cards"] = [];
    tempDoc[doc.documentType] = card;
  });

  documents.forEach(doc => {
    // Handle the case for multiple muildings
    if (doc.code === "RoadCutNOC.REMARK_DOCUMENT" && doc.hasMultipleRows && doc.options) {
      let buildingsData = get(state,
        "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.buildings",
        []
      );

      buildingsData.forEach(building => {
        let card = {};
        card["name"] = building.name;
        card["code"] = doc.code;
        card["hasSubCards"] = true;
        card["subCards"] = [];
        doc.options.forEach(subDoc => {
          let subCard = {};
          subCard["name"] = subDoc.code;
          subCard["required"] = subDoc.required ? true : false;
          card.subCards.push(subCard);
        });
        tempDoc[doc.documentType].cards.push(card);
      });
    } else {
      let card = {};
      card["name"] = doc.code;
      card["code"] = doc.code;
      card["required"] = doc.required ? true : false;
      if (doc.hasDropdown && doc.dropdownData) {
        let dropdown = {};
        dropdown.label = "NOC_SELECT_DOC_DD_LABEL";
        dropdown.required = true;
        dropdown.menu = doc.dropdownData.filter(item => {
          return item.active;
        });
        dropdown.menu = dropdown.menu.map(item => {
          return { code: item.code, label: getTransformedLocale(item.code) };
        });
        card["dropdown"] = dropdown;
      }
      tempDoc[doc.documentType].cards.push(card);
    }
  });

  Object.keys(tempDoc).forEach(key => {
    documentsContract.push(tempDoc[key]);
  });

  dispatch(prepareFinalObject("documentsContract", documentsContract));
};

export const prepareDocumentsUploadData = async (state, dispatch, type) => {
  let documents = '';
  if (type == "popup_pet") {
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.applyScreenMdmsData.PetNOC.RemarksDocuments",
      []
    );
  }
  else if (type == "popup_adv") {
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.applyScreenMdmsData.AdvertisementNOC.AdvertisementNOCRemarksDocuments",
      []
    );
  }
  else if (type == "popup_sellmeat") {
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.applyScreenMdmsData.SellMeatNOC.SellMeatNOCRemarksDocuments",
      []
    );
  }
  else if (type == "popup_rodcut") {
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.applyScreenMdmsData.RoadCutNOC.RoadCutNOCRemarksDocuments",
      []
    );
  }
  else if (type == "apply_pet") {
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.applyScreenMdmsData.PetNOC.Documents",
      []
    );
  }
  else if (type == "apply_sellmeat") {
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.applyScreenMdmsData.SellMeatNOC.SellMeatDocuments",
      []
    );
  }
  else if (type == "apply_Advt") {
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.applyScreenMdmsData.AdvNOC.AdvNOCDocuments",
      []
    );
  }
  else if (type == "apply_roadcut") {
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.applyScreenMdmsData.RoadCutNOC.RoadCutDocuments",
      []
    );
  }
  else {
    documents = get(
      state,
      "screenConfiguration.preparedFinalObject.applyScreenMdmsData.PetNOC.Documents",
      []
    );
  }

  documents = documents.filter(item => {
    return item.active;
  });
  let documentsContract = [];
  let tempDoc = {};
  documents.forEach(doc => {
    let card = {};
    card["code"] = doc.documentType;
    card["title"] = doc.documentType;
    card["cards"] = [];
    tempDoc[doc.documentType] = card;
  });

  documents.forEach(doc => {
    // Handle the case for multiple muildings
    if (doc.code === "PET.PET_PICTURE" && doc.hasMultipleRows && doc.options) {
      let buildingsData = get(state,
        "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.buildings",
        []
      );

      buildingsData.forEach(building => {
        let card = {};
        card["name"] = building.name;
        card["code"] = doc.code;
        card["hasSubCards"] = true;
        card["subCards"] = [];
        doc.options.forEach(subDoc => {
          let subCard = {};
          subCard["name"] = subDoc.code;
          subCard["required"] = subDoc.required ? true : false;
          card.subCards.push(subCard);
        });
        tempDoc[doc.documentType].cards.push(card);
      });
    }
    else if (doc.code === "PET.REMARK_DOCUMENT_SI" && doc.hasMultipleRows && doc.options) {

      let buildingsData = get(state,
        "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.buildings",
        []
      );

      buildingsData.forEach(building => {
        let card = {};
        card["name"] = building.name;
        card["code"] = doc.code;
        card["hasSubCards"] = true;
        card["subCards"] = [];
        doc.options.forEach(subDoc => {
          let subCard = {};
          subCard["name"] = subDoc.code;
          subCard["required"] = subDoc.required ? true : false;
          card.subCards.push(subCard);
        });
        tempDoc[doc.documentType].cards.push(card);
      });
    }
    else if (doc.code === "ADV.ADV_PHOTOCOPY_HOARDING" && doc.hasMultipleRows && doc.options) {

      let buildingsData = get(state,
        "screenConfiguration.preparedFinalObject.AdvNOC.AdvNOCDocuments",
        []
      );

      buildingsData.forEach(building => {
        let card = {};
        card["name"] = building.name;
        card["code"] = doc.code;
        card["hasSubCards"] = true;
        card["subCards"] = [];
        doc.options.forEach(subDoc => {
          let subCard = {};
          subCard["name"] = subDoc.code;
          subCard["required"] = subDoc.required ? true : false;
          card.subCards.push(subCard);
        });
        tempDoc[doc.documentType].cards.push(card);
      });
    }
    else if (doc.code === "SellMeatNOC.REMARK_DOCUMENT" && doc.hasMultipleRows && doc.options) {

      let buildingsData = get(state,
        "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.buildings",
        []
      );

      buildingsData.forEach(building => {
        let card = {};
        card["name"] = building.name;
        card["code"] = doc.code;
        card["hasSubCards"] = true;
        card["subCards"] = [];
        doc.options.forEach(subDoc => {
          let subCard = {};
          subCard["name"] = subDoc.code;
          subCard["required"] = subDoc.required ? true : false;
          card.subCards.push(subCard);
        });
        tempDoc[doc.documentType].cards.push(card);
      });
    }
    else if (doc.code === "RoadCutNOC.REMARK_DOCUMENT" && doc.hasMultipleRows && doc.options) {

      let buildingsData = get(state,
        "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.buildings",
        []
      );

      buildingsData.forEach(building => {
        let card = {};
        card["name"] = building.name;
        card["code"] = doc.code;
        card["hasSubCards"] = true;
        card["subCards"] = [];
        doc.options.forEach(subDoc => {
          let subCard = {};
          subCard["name"] = subDoc.code;
          subCard["required"] = subDoc.required ? true : false;
          card.subCards.push(subCard);
        });
        tempDoc[doc.documentType].cards.push(card);
      });
    }
    else if (doc.code === "AdvertisementNOC.REMARK_DOCUMENT" && doc.hasMultipleRows && doc.options) {

      let buildingsData = get(state,
        "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.buildings",
        []
      );

      buildingsData.forEach(building => {
        let card = {};
        card["name"] = building.name;
        card["code"] = doc.code;
        card["hasSubCards"] = true;
        card["subCards"] = [];
        doc.options.forEach(subDoc => {
          let subCard = {};
          subCard["name"] = subDoc.code;
          subCard["required"] = subDoc.required ? true : false;
          card.subCards.push(subCard);
        });
        tempDoc[doc.documentType].cards.push(card);
      });
    }
    else if (doc.code === "SELLMEAT.PROOF_POSSESSION_RENT_AGREEMENT" && doc.hasMultipleRows && doc.options) {

      let buildingsData = get(state,
        "screenConfiguration.preparedFinalObject.applyScreenMdmsData.SellMeatNOC.SellMeatDocuments",
        []
      );

      buildingsData.forEach(building => {
        let card = {};
        card["name"] = building.name;
        card["code"] = doc.code;
        card["hasSubCards"] = true;
        card["subCards"] = [];
        doc.options.forEach(subDoc => {
          let subCard = {};
          subCard["name"] = subDoc.code;
          subCard["required"] = subDoc.required ? true : false;
          card.subCards.push(subCard);
        });
        tempDoc[doc.documentType].cards.push(card);
      });

    }
    else {
      let card = {};
      card["name"] = doc.code;
      card["code"] = doc.code;
      card["required"] = doc.required ? true : false;
      if (doc.hasDropdown && doc.dropdownData) {
        let dropdown = {};
        dropdown.label = "NOC_SELECT_DOC_DD_LABEL";
        dropdown.required = true;
        dropdown.menu = doc.dropdownData.filter(item => {
          return item.active;
        });
        dropdown.menu = dropdown.menu.map(item => {
          return { code: item.code, label: getTransformedLocale(item.code) };
        });
        card["dropdown"] = dropdown;
      }
      tempDoc[doc.documentType].cards.push(card);
    }
  });

  Object.keys(tempDoc).forEach(key => {
    documentsContract.push(tempDoc[key]);
  });

  dispatch(prepareFinalObject("documentsContract", documentsContract));

};
const getStatus = (status) => {
  switch (status) {
    case "DRAFT": return {
      "dataPayload": {},
      "currentState": "DRAFT"
    };
      break;
    case "REASSIGN":
      return {
        "dataPayload": {},
        "currentState": "REASSIGN"
      };
      break;
    case "RESENTTOADM":
      return {
        "dataPayload": {},
        "currentState": "REASSIGN"
      };
      break;
    case "INITIATED":
      return {
        "dataPayload": {},
        "currentState": "DRAFT"
      };
      break;
    case "INITIATED_TELECOM":
    return {
      "dataPayload": {},
      "currentState": "DRAFT"
    };
    break;
    case "INITIATEDEXC":
      return {
        "dataPayload": {},
        "currentState": "DRAFT"
      };
      break;
    case "RESENT":
      return {
        "dataPayload": {},
        "currentState": "REASSIGN"
      };
      break;
    case "EDITEDATJE":
      return {
        "dataPayload": {},
        "currentState": "REVIEWOFJE"
      };
      break;
  }
}

export const updateAppStatus = async (state, dispatch, status) => {
  let response = '';
  let response_updatestatus = '';
  try {
    setapplicationMode(status);
    response_updatestatus = await httpRequest("post", "/pm-services/noc/_updateappstatus", "", [], getStatus(status));
    if (response_updatestatus.ResponseInfo.status == "success") {
      return { status: "success" };
    } else {
      return { status: "fail" };
    }
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
  }
};

export const createUpdateNocApplication = async (state, dispatch, status) => {
  let response = '';
  let response_updatestatus = '';
  let nocId = getapplicationNumber() === 'null' ? '' : getapplicationNumber(); // get(state, "screenConfiguration.preparedFinalObject.PETNOC.applicationId");
  let method = nocId ? "UPDATE" : "CREATE";
  try {
    let payload = get(state.screenConfiguration.preparedFinalObject, "PETNOC", []);
    let reduxDocuments = get(state, "screenConfiguration.preparedFinalObject.documentsUploadRedux", {});
    // Set owners & other documents
    let ownerDocuments = [];
    let otherDocuments = [];
    let Remarks = "";

    payload.hasOwnProperty("immunizationClinicNo") === false ? set(payload, "immunizationClinicNo", "") : ''
    payload.hasOwnProperty("immunizationContactDetail") === false ? set(payload, "immunizationContactDetail", "") : ''
    payload.hasOwnProperty("veterinaryCouncilRegistrationNo") === false ? set(payload, "veterinaryCouncilRegistrationNo", "") : ''
    payload.hasOwnProperty("immunizationNameVeterinaryDoctor") === false ? set(payload, "immunizationNameVeterinaryDoctor", "") : ''
    payload.hasOwnProperty("immunizationSector") === false ? set(payload, "immunizationSector", "") : ''


    set(payload, "remarks", Remarks);
    console.log('payload : ', payload)
    setapplicationMode(status);

    if (method === "CREATE") {
      let otherDocuments_pet = [
        ...otherDocuments,
        {

          fileStoreId: reduxDocuments[0].documents[0].fileStoreId
        }
      ];
      let otherDocuments_Vaccine = [
        ...otherDocuments,
        {
          fileStoreId: reduxDocuments[1].documents[0].fileStoreId
        }
      ];
      let ownerIdProof = [
        ...otherDocuments,
        {
          fileStoreId: reduxDocuments[2].documents[0].fileStoreId
        }
      ];

      set(payload, "uploadVaccinationCertificate", otherDocuments_Vaccine);
      set(payload, "uploadPetPicture", otherDocuments_pet);
      set(payload, "ownerIdProof", ownerIdProof);
      set(payload, "idName", getIdName(state, "PETNOC", get(payload, null)));
      response = await httpRequest("post", "/pm-services/noc/_create", "", [], { dataPayload: payload });
      console.log('pet response : ', response)

      if (response.applicationId !== 'null' || response.applicationId !== '') {
        setapplicationNumber(response.applicationId);
        dispatch(prepareFinalObject("PETNOC", response));
        setApplicationNumberBox(state, dispatch);
        await searchdemand(dispatch, response.applicationId, getOPMSTenantId());
        return { status: "success", message: response };
      } else {
        return { status: "fail", message: response };
      }
    } else if (method === "UPDATE") {
      let otherDocuments_pet = []
      let otherDocuments_Vaccine = []
      let ownerIdProof = []

      jp.query(reduxDocuments, "$.*").forEach(doc => {
        if (doc.documents && doc.documents.length > 0) {

          if (doc.documents[0].title === "VACCINATION_CERTIFIACTE") {
            ownerDocuments = [
              ...ownerDocuments,
              {
                fileStoreId: doc.documents[0].fileStoreId
              }
            ];

            set(payload, "uploadVaccinationCertificate", ownerDocuments);
          }
          else if (doc.documents[0].title === "PET_PICTURE") {
            // SKIP BUILDING PLAN DOCS
            otherDocuments = [
              ...otherDocuments,
              {
                fileStoreId: doc.documents[0].fileStoreId
              }
            ];
            set(payload, "uploadPetPicture", otherDocuments);
          }         
          else {
            otherDocuments_pet = [
              {

                fileStoreId: reduxDocuments[0].documents[0].fileStoreId
              }
            ];
            otherDocuments_Vaccine = [
              {
                fileStoreId: reduxDocuments[1].documents[0].fileStoreId
              }
            ];
            ownerIdProof = [
              {
                fileStoreId: reduxDocuments[2].documents[0].fileStoreId
              }
            ];
            set(payload, "uploadVaccinationCertificate", otherDocuments_Vaccine);
            set(payload, "uploadPetPicture", otherDocuments_pet);
            set(payload, "ownerIdProof", ownerIdProof);
         

          }
        }
      });
      set(payload, "idName", getIdName(state,"PETNOC",get(payload, null)));
      response = await httpRequest("post", "/pm-services/noc/_update", "", [], { dataPayload: payload });
      setapplicationNumber(response.applicationId);
      dispatch(prepareFinalObject("PETNOC", response));
      return { status: "success", message: response };
    }

  } catch (error) {
    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));

    // Revert the changed pfo in case of request failure
    let NocData = get(
      state,
      "screenConfiguration.preparedFinalObject.PETNOC",
      []
    );
    dispatch(prepareFinalObject("PetNOC", NocData));

    return { status: "failure", message: error };
  }
};

export const setDocsForEditFlow = async (state, dispatch) => {

  const applicationDocuments = get(
    state.screenConfiguration.preparedFinalObject,
    "SELLMEATNOC.uploadDocuments",
    []
  );
  let uploadedDocuments = {};
  let fileStoreIds =
    applicationDocuments &&
    applicationDocuments.map(item => item.fileStoreId).join(",");
  const fileUrlPayload =
    fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
  applicationDocuments &&
    applicationDocuments.forEach((item, index) => {
      uploadedDocuments[index] = [
        {
          fileName:
            (fileUrlPayload &&
              fileUrlPayload[item.fileStoreId] &&
              decodeURIComponent(
                fileUrlPayload[item.fileStoreId]
                  .split(",")[0]
                  .split("?")[0]
                  .split("/")
                  .pop()
                  .slice(13)
              )) ||
            `Document - ${index + 1}`,
          fileStoreId: item.fileStoreId,
          fileUrl: Object.values(fileUrlPayload)[index],
          documentType: item.documentType,
          tenantId: item.tenantId,
          id: item.id
        }
      ];
    });
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

export const getFileSize = file => {
  const size = parseFloat(file.size / 1024).toFixed(2);
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


export const furnishNocResponse = response => {
  // Handle applicant ownership dependent dropdowns
  let refurnishresponse = {};
  let applicationdetail = response.nocApplicationDetail[0].applicationdetail.length > 0 ? JSON.parse(response.nocApplicationDetail[0].applicationdetail) : '';

  //set(refurnishresponse, "applicationId", response.nocApplicationDetail[0].nocnumber);
  set(refurnishresponse, "applicantName", response.nocApplicationDetail[0].applicantname);
  set(refurnishresponse, "sector", response.nocApplicationDetail[0].sector);

  set(refurnishresponse, "nameOfPetDog", applicationdetail.nameOfPetDog);
  set(refurnishresponse, "age", applicationdetail.age);
  set(refurnishresponse, "sex", applicationdetail.sex);
  set(refurnishresponse, "breed", applicationdetail.breed);
  set(refurnishresponse, "color", applicationdetail.color);

  set(refurnishresponse, "identificationMark", applicationdetail.identificationMark);
  set(refurnishresponse, "immunizationNameVeterinaryDoctor", applicationdetail.immunizationNameVeterinaryDoctor);
  set(refurnishresponse, "veterinaryCouncilRegistrationNo", applicationdetail.veterinaryCouncilRegistrationNo);
  set(refurnishresponse, "immunizationContactDetail", applicationdetail.immunizationContactDetail);
  set(refurnishresponse, "immunizationClinicNo", applicationdetail.immunizationClinicNo);
  set(refurnishresponse, "immunizationSector", applicationdetail.immunizationSector);
  set(refurnishresponse, "uploadVaccinationCertificate", applicationdetail.uploadVaccinationCertificate);
  set(refurnishresponse, "uploadPetPicture", applicationdetail.uploadPetPicture);
  set(refurnishresponse, "ownerIdProof", applicationdetail.ownerIdProof);
  set(refurnishresponse, "uploadPetPicture", applicationdetail.uploadPetPicture);
  set(refurnishresponse, "houseNo", response.nocApplicationDetail[0].housenumber);
  set(refurnishresponse, "applieddate", applicationdetail.applieddate);
  set(refurnishresponse, "remarks", response.nocApplicationDetail[0].remarks);


  return refurnishresponse;
};

export const furnishSellMeatNocResponse = (state,response, step) => {
  // Handle applicant ownership dependent dropdowns
  let refurnishresponse = {};

  let applicationdetail = response.nocApplicationDetail[0].applicationdetail.length > 0 ? JSON.parse(response.nocApplicationDetail[0].applicationdetail) : '';

  set(refurnishresponse, "applicantName", response.nocApplicationDetail[0].applicantname);
  set(refurnishresponse, "houseNo", response.nocApplicationDetail[0].housenumber);
  set(refurnishresponse, "sector", response.nocApplicationDetail[0].sector);
  set(refurnishresponse, "mobileNumber", applicationdetail.mobileNumber);

  set(refurnishresponse, "fatherHusbandName", applicationdetail.fatherHusbandName);
  set(refurnishresponse, "division", applicationdetail.division);
  set(refurnishresponse, "shopNumber", applicationdetail.shopNumber);
  set(refurnishresponse, "ward", applicationdetail.ward);

  var array1 = response.nocApplicationDetail[0].remarks;
  var found = array1.find(element => element.applicationstatus === "PAID" );

  
  let mdmsDataForNocSought = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData.egpm.nocSought", []);
  let nocSoughtFinalData = [];
  applicationdetail.nocSought.split(",").map(item => { 
    
    if (mdmsDataForNocSought.find(str => str.code == item.trim())) {
      nocSoughtFinalData.push({
        value: mdmsDataForNocSought.find(str => str.code == item.trim()).code,
        label:mdmsDataForNocSought.find(str => str.code == item.trim()).name
      });
    }
  });
  // set(refurnishresponse, "nocSought", nocSoughtFinalData);
  // if(parseInt(step) === 0){
  //   set(refurnishresponse, "nocSought", "");
  // }else{
  //   set(refurnishresponse, "nocSought", nocSoughtFinalData);
  // }

  if(found){
    set(refurnishresponse, "nocSought", nocSoughtFinalData);
    // set(refurnishresponse, "statusPAID", true);
  }else{
    //  set(refurnishresponse, "nocSought", applicationdetail.nocSought);
  }

  var checkStatus = response.nocApplicationDetail[0].applicationstatus;
  if(checkStatus === "REASSIGN"){
    // set(refurnishresponse, "statusPAID", false);
  }
  
  set(refurnishresponse, "uploadDocuments", applicationdetail.uploadDocuments);
  set(refurnishresponse, "idProof", applicationdetail.idProof);
  set(refurnishresponse, "remarks", applicationdetail.remarks);

  return refurnishresponse;
};

export const furnishRoadcutNocResponse =  (state,response) => {
  // Handle applicant ownership dependent dropdowns
  let refurnishresponse = {};

  let applicationdetail = response.nocApplicationDetail[0].applicationdetail.length > 0 ? JSON.parse(response.nocApplicationDetail[0].applicationdetail) : '';

  set(refurnishresponse, "applicantName", response.nocApplicationDetail[0].applicantname);
  set(refurnishresponse, "sector", response.nocApplicationDetail[0].sector);
  // set(refurnishresponse, "roadCutType", applicationdetail.roadCutType);
  set(refurnishresponse, "mobileNumber", applicationdetail.mobileNumber);
  set(refurnishresponse, "typeOfApplicant", applicationdetail.typeOfApplicant);
  set(refurnishresponse, "length", applicationdetail.length);
  set(refurnishresponse, "ward", applicationdetail.ward);
  set(refurnishresponse, "requestedLocation", applicationdetail.requestedLocation);
  set(refurnishresponse, "landmark", applicationdetail.landmark);
  set(refurnishresponse, "purposeOfRoadCutting", applicationdetail.purposeOfRoadCutting);
  set(refurnishresponse, "division", applicationdetail.division);
  set(refurnishresponse, "uploadDocuments", applicationdetail.uploadDocuments);
  set(refurnishresponse, "remarks", applicationdetail.remarks);
  set(refurnishresponse, "gstin", applicationdetail.gstin);

  let mdmsDataForRoadCutType = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData.egpm.roadCutType", []);
  let roadCutTypeFinalData = [];
  applicationdetail.roadCutType.split(",").map(item => { 

  if (mdmsDataForRoadCutType.find(str => str.code == item.trim())) {
    roadCutTypeFinalData.push({
    value: mdmsDataForRoadCutType.find(str => str.code == item.trim()).code,
    label:mdmsDataForRoadCutType.find(str => str.code == item.trim()).name
    });
  }
  });


  set(refurnishresponse, "roadCutType", roadCutTypeFinalData);
  return refurnishresponse;
};

export const furnishAdvertisementNocResponse = response => {
  // Handle applicant ownership dependent dropdowns
  let refurnishresponse = {};

  let applicationdetail = response.nocApplicationDetail[0].applicationdetail.length > 0 ? JSON.parse(response.nocApplicationDetail[0].applicationdetail) : '';

  set(refurnishresponse, "applicantName", response.nocApplicationDetail[0].applicantname);
  set(refurnishresponse, "typeOfApplicant", applicationdetail.typeOfApplicant);
  set(refurnishresponse, "tan", applicationdetail.tan);
  set(refurnishresponse, "pan", applicationdetail.pan);
  set(refurnishresponse, "cin", applicationdetail.cin);
  set(refurnishresponse, "gstin", applicationdetail.gstin);
  set(refurnishresponse, "applicantAddress", applicationdetail.applicantAddress);
  set(refurnishresponse, "applicantLandmark", applicationdetail.applicantLandmark);
  set(refurnishresponse, "applicantDivision", applicationdetail.applicantDivision);
  set(refurnishresponse, "applicantWard", applicationdetail.applicantWard);
  set(refurnishresponse, "sector", response.nocApplicationDetail[0].sector);
  set(refurnishresponse, "applicantVillageSuSector", applicationdetail.applicantVillageSuSector);
  set(refurnishresponse, "mobileNo", applicationdetail.mobileNo);
  set(refurnishresponse, "emailId", applicationdetail.emailId);
  set(refurnishresponse, "typeOfAdvertisement", applicationdetail.typeOfAdvertisement);
  set(refurnishresponse, "subTypeOfAdvertisement", applicationdetail.subTypeOfAdvertisement);
  set(refurnishresponse, "fromDateToDisplay", applicationdetail.fromDateToDisplay);
  set(refurnishresponse, "toDateToDisplay", applicationdetail.toDateToDisplay);
  set(refurnishresponse, "duration", applicationdetail.duration);
  set(refurnishresponse, "locationOfAdvertisement", applicationdetail.locationOfAdvertisement);
  set(refurnishresponse, "advertisementLandmark", applicationdetail.advertisementLandmark);
  set(refurnishresponse, "advertisementSector", applicationdetail.advertisementSector);
  set(refurnishresponse, "advertisementVillageSubSector", applicationdetail.advertisementVillageSubSector);
  set(refurnishresponse, "advertisementMatterDescription", applicationdetail.advertisementMatterDescription);
  set(refurnishresponse, "space", applicationdetail.space);
  set(refurnishresponse, "date", applicationdetail.date);
  set(refurnishresponse, "exemptedCategory", applicationdetail.exemptedCategory);
  set(refurnishresponse, "uploadDocuments", applicationdetail.uploadDocuments);
  set(refurnishresponse, "remarks", applicationdetail.remarks);

  return refurnishresponse;
};


export const setApplicationNumberBox = (state, dispatch) => {

  let applicationNumber = get(state, "state.screenConfiguration.preparedFinalObject.PETNOC.applicationId", null);

  if (applicationNumber) {
    dispatch(
      handleField(
        "apply",
        "components.div.children.headerDiv.children.header.children.applicationNumber",
        "visible",
        true
      )
    );
    dispatch(
      handleField(
        "apply",
        "components.div.children.headerDiv.children.header.children.applicationNumber",
        "props.number",
        applicationNumber
      )
    );
  }
};

export const findItemInArrayOfObject = (arr, conditionCheckerFn) => {
  for (let i = 0; i < arr.length; i++) {
    if (conditionCheckerFn(arr[i])) {
      return arr[i];
    }
  }
};





export const getCitizenGridData = async () => {

  let queryObject = [];
  var requestBody = {
    "tenantId": `${getOPMSTenantId()}`,
    "applicationType": 'PETNOC',

    "dataPayload": {
      "applicationType": 'PETNOC',
      "applicationStatus": JSON.parse(getUserInfo()).roles[0].code == 'SI' ? 'INITIATED,REASSIGNTOSI,PAID,RESENT' : JSON.parse(getUserInfo()).roles[0].code == "MOH" ? 'FORWARD' : ''

    }

  }

  try {
    const payload = await httpRequest(
      "post",
      "/pm-services/noc/_get",
      "",
      queryObject,
      requestBody
    );
    return payload;
  } catch (error) {
  }




};

export const getSearchResultsForNocCretificate = async queryObject => {

  try {
    const response = await httpRequest("post", get(queryObject[3], "value"), "", [], get(queryObject[2], "value"));
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

export const getSearchResultsForNocCretificateDownload = async queryObject => {

  try {
    let filestoreIds = get(queryObject[2], "value");

    const response = await httpRequest(
      "get",
      get(queryObject[3], "value") + filestoreIds,
      "",
      []
    );
    return response;

  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};


export const getGridDataAdvertisement1 = async () => {
  let queryObject = [];
  var requestBody = {
    "tenantId": `${getOPMSTenantId()}`,
    "applicationType": 'ADVERTISEMENTNOC',

    "dataPayload": {
      "applicationType": 'ADVERTISEMENTNOC',
      "applicationStatus": JSON.parse(getUserInfo()).roles[0].code == 'SI' ? 'INITIATE,REASSIGNTOSI,PAID,RESENT' : JSON.parse(getUserInfo()).roles[0].code == "MOH" ? 'FORWARD' : ''

    }

  }
  try {
    const payload = await httpRequest(
      "post",
      "/pm-services/noc/_get",
      "",
      queryObject,
      requestBody
    );
    return payload;
  } catch (error) {
  }
};

export const getGridDataForSearchFilter = async (data) => {
  let queryObject = [];
  var requestBody = {
    "tenantId": `${getOPMSTenantId()}`,
    "applicationType": getapplicationType(),

    "dataPayload": data
  }
  try {
    const payload = await httpRequest(
      "post",
      "/pm-services/noc/_get",
      "",
      queryObject,
      requestBody
    );
    return payload;
  } catch (error) {
  }
};


export const getGridDataRoadcut1 = async () => {
  let queryObject = [];
  var requestBody = {

    "tenantId": `${getOPMSTenantId()}`,
    "applicationType": 'ROADCUTNOC',

    "dataPayload": {
      "applicationType": 'ROADCUTNOC',
      "applicationStatus": JSON.parse(getUserInfo()).roles[0].code == 'SI' ? 'INITIATE,REASSIGNTOSI,PAID,RESENT' : JSON.parse(getUserInfo()).roles[0].code == "MOH" ? 'FORWARD' : ''

    }

  }
  try {
    const payload = await httpRequest(
      "post",
      "/pm-services/noc/_get",
      "",
      queryObject,
      requestBody
    );
    return payload;
  } catch (error) {
  }
};


export const getBusinessServiceData = async (businessService) => {
  let queryObject = [
    {
      key:"businessServices",value:businessService
    },
    {
      key:"tenantId",value:getOPMSTenantId()
    }
  ];
  try {
      const payload = await httpRequest(
        "post",
        "/egov-workflow-v2/egov-wf/businessservice/_search",
        "",
        queryObject,
        {}
      );
    return payload;
  } catch (error) {

  }
};

export const getGridDataSellMeat1 = async () => {
  let queryObject = [];
  var requestBody = {

    "tenantId": `${getOPMSTenantId()}`,
    "applicationType": 'SELLMEATNOC',

    "dataPayload": {
      "applicationType": 'SELLMEATNOC',
      "applicationStatus": JSON.parse(getUserInfo()).roles[0].code == 'SI' ? 'INITIATE,REASSIGNTOSI,PAID,RESENT' : JSON.parse(getUserInfo()).roles[0].code == "MOH" ? 'FORWARD' : ''

    }

  }
  try {
    const payload = await httpRequest(
      "post",
      "/pm-services/noc/_get",
      "",
      queryObject,
      requestBody
    );
    return payload;
  } catch (error) {
  }
};

export const UpdateMasterPrice = async (
  state, dispatch,
  queryObject,
  code
) => {

  try {
    const response = await httpRequest("post", "/pm-services/noc/_updatepricebook", "", [], code);

    if (response.ResposneInfo.status === 'SUCCESS') {
      store.dispatch(
        toggleSnackbar(
          true,
          { labelName: 'Price Updated Successfully', labelCode: 'Price Updated Successfully' },
          "success"
        ),
        dispatch(setRoute(`/egov-opms/masterAdvertisement?purpose=updated`))
      );
      return response
    }
    else {
      store.dispatch(
        toggleSnackbar(
          true, { labelName: response.ResponseInfo.msgId, labelCode: response.ResponseInfo.msgId }, "error")
      );
    }
  } catch (error) {

  }
};

export const createUpdateSellMeatNocApplication = async (state, dispatch, status) => {
  let response = '';
  let response_updatestatus = '';
  let nocId = getapplicationNumber() === 'null' ? '' : getapplicationNumber();
  let method = nocId ? "UPDATE" : "CREATE";

  try {
    let payload = get(state.screenConfiguration.preparedFinalObject, "SELLMEATNOC", []);
    let tenantId = get(state.screenConfiguration.preparedFinalObject, "", getOPMSTenantId());
    let nocSought = payload.nocSought;
    let reduxDocuments = get(state, "screenConfiguration.preparedFinalObject.documentsUploadRedux", {});


    // Set owners & other documents
    let ownerDocuments = [];
    let idProof = [];
    let Remarks = "";

    // jp.query(reduxDocuments, "$.*").forEach(doc => {
    //   if (doc.documents && doc.documents.length > 0) {
    //     ownerDocuments = [
    //       ...ownerDocuments,
    //       {
    //         fileStoreId: doc.documents[0].fileStoreId
    //       }
    //     ];
    //   }
    // });
    ownerDocuments = [
      {
        fileStoreId: reduxDocuments[0].documents[0].fileStoreId
      }
    ];

    idProof = [
      {
        fileStoreId: reduxDocuments[1].documents[0].fileStoreId
      }
    ];

    payload.hasOwnProperty("division") === false ? set(payload, "division", "") : ''
    payload.hasOwnProperty("ward") === false ? set(payload, "ward", "") : ''

    set(payload, "uploadDocuments", ownerDocuments);
    set(payload, "idProof", idProof);

    set(payload, "remarks", Remarks);
    let str = "";
    if (typeof(nocSought) !=="string") { 
      nocSought.map(item => {
        str = str + ", "+item.value;
      })
    }
    
    console.log('nocsought : ', str.slice(2))
    set(payload, "nocSought", str.slice(2));
    console.log('payload : ', payload)
    let response = '';
    setapplicationMode(status);

    if (method === "CREATE") {
      set(payload, "idName", getIdName(state,"SELLMEATNOC",get(payload, null)));

      response = await httpRequest("post", "/pm-services/noc/_create", "", [], { dataPayload: payload });
      console.log('pet response : ', response)
      if (response.applicationId !== 'null' || response.applicationId !== '') {
        dispatch(prepareFinalObject("SELLMEATNOC", response));
        setapplicationNumber(response.applicationId);
        setApplicationNumberBox(state, dispatch);
        await searchdemand(dispatch, response.applicationId, getOPMSTenantId());
        return { status: "success", message: response };
      } else {
        return { status: "fail", message: response };
      }
    } else if (method === "UPDATE") {
      set(payload, "idName", getIdName(state, "SELLMEATNOC", get(payload, null)));
      response = await httpRequest("post", "/pm-services/noc/_update", "", [], { dataPayload: payload });
      setapplicationNumber(response.applicationId);
      dispatch(prepareFinalObject("SELLMEATNOC", response));
      return { status: "success", message: response };
    }

  } catch (error) {
    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));

    // Revert the changed pfo in case of request failure
    let sellMeatNocData = get(
      state,
      "screenConfiguration.preparedFinalObject.SELLMEATNOC",
      []
    );
    dispatch(prepareFinalObject("SELLMEATNOC", sellMeatNocData));

    return { status: "failure", message: error };
  }
};

export const getIdName = (state, typeName, key) => { 
  
  let applicationTypeList = get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.egpm.applicationType",
    []
  );
  // const locMessageObj =  localisationArray.find(locMessage => locMessage.code === tempColumnName);
  const applicationType = applicationTypeList.find(item => item.code === typeName);
  let idName  = typeof applicationType['idName'] === "object" ? get(applicationType, `idName[${key}]`) : get(applicationType, `idName`);
  return idName

}

export const createUpdateRoadCutNocApplication = async (state, dispatch, status) => {
  let response = '';
  let response_updatestatus = '';
  let nocId = getapplicationNumber() === 'null' ? '' : getapplicationNumber();

  let method = nocId ? "UPDATE" : "CREATE";
  try {
    let payload = get(state.screenConfiguration.preparedFinalObject, "ROADCUTNOC", []);
    /// let reduxDocuments = get(state, "screenConfiguration.preparedFinalObject.documentsUploadRedux", {});
    let reduxDocuments = get(state, "screenConfiguration.preparedFinalObject.RoadCutDocuments", {});
    let roadCutType = payload.roadCutType;

    // Set owners & other documents
    let ownerDocuments = [];
    let otherDocuments = [];
    let roadcutdocuments = [];
    let Remarks = "";

    jp.query(reduxDocuments, "$.*").forEach(doc => {
      if (doc.documents && doc.documents.length > 0) {
        ownerDocuments = [
          ...ownerDocuments,
          {
            fileStoreId: doc.documents[0].fileStoreId
          }
        ];
      }
      else {
        let temp = { "fileStoreId": doc.fileStoreId }
        roadcutdocuments.push(temp)
      }
    });

    payload.hasOwnProperty("roadCutType") === false ? set(payload, "roadCutType", "") : ''
    payload.hasOwnProperty("requestedLocation") === false ? set(payload, "requestedLocation", "") : ''
    payload.hasOwnProperty("ward") === false ? set(payload, "ward", "") : ''
    payload.hasOwnProperty("gstin") === false ? set(payload, "gstin", "") : ''
    set(payload, "uploadDocuments", roadcutdocuments);
    set(payload, "remarks", Remarks);

    let str = "";
    if (typeof(roadCutType) !=="string") { 
      roadCutType.map(item => {
        str = str + ", "+item.value;
      })
    }
    
    console.log('roadCutType : ', str.slice(2))
    set(payload, "roadCutType", str.slice(2));
    console.log('payload : ', payload)

    console.log('Road CUt payload : ', payload)
    setapplicationMode(status);

    if (method === "CREATE") {
      set(payload, "idName", getIdName(state,"ROADCUTNOC",get(payload, "division")));
      response = await httpRequest("post", "/pm-services/noc/_create", "", [], { dataPayload: payload });
      console.log('pet response : ', response)
      if (response.applicationId !== 'null' || response.applicationId !== '') {
        dispatch(prepareFinalObject("ROADCUTNOC", response));
        setapplicationNumber(response.applicationId);
        setApplicationNumberBox(state, dispatch);

        return { status: "success", message: response };
      } else {
        return { status: "fail", message: response };
      }
    } else if (method === "UPDATE") {
      set(payload, "idName", getIdName(state,"ROADCUTNOC",get(payload, "division")));
      response = await httpRequest("post", "/pm-services/noc/_update", "", [], { dataPayload: payload });
      setapplicationNumber(response.applicationId);
      dispatch(prepareFinalObject("ROADCUTNOC", response));
      return { status: "success", message: response };
    }

  } catch (error) {
    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));

    let NocData = get(state, "screenConfiguration.preparedFinalObject.ROADCUTNOC", []);
    dispatch(prepareFinalObject("ROADCUTNOC", NocData));

    return { status: "failure", message: error };
  }
};

export const createUpdateADVNocApplication = async (state, dispatch, status) => {
  let response = '';
  let response_updatestatus = '';
  let nocId = getapplicationNumber() === 'null' ? '' : getapplicationNumber();
  let method = nocId ? "UPDATE" : "CREATE";
  //let method = "CREATE";
  try {
    let payload = get(state.screenConfiguration.preparedFinalObject, "ADVERTISEMENTNOC", []);
    let reduxDocuments = get(state, "screenConfiguration.preparedFinalObject.documentsUploadRedux", {});
    // Set owners & other documents
    let ownerDocuments = [];
    let Remarks = "";
    jp.query(reduxDocuments, "$.*").forEach(doc => {
      if (doc.documents && doc.documents.length > 0) {

        ownerDocuments = [
          ...ownerDocuments,
          {
            fileStoreId: doc.documents[0].fileStoreId
          }
        ];
      }
      // }
    });
    set(payload, "uploadDocuments", ownerDocuments);
    set(payload, "remarks", Remarks);
    setapplicationMode(status);
    let responsecreateDemand = '';
    if (method === "CREATE") {
      //specially for calculating service
      set(payload, "idName", getIdName(state,"ADVERTISEMENTNOC",get(payload, null)));
      dispatch(prepareFinalObject("ADVTCALCULATENOC", payload));

      response = await httpRequest("post", "/pm-services/noc/_create", "", [], { dataPayload: payload });
      if (response.applicationId !== 'null' || response.applicationId !== '') {
        dispatch(prepareFinalObject("ADVERTISEMENTNOC", response));
        setapplicationNumber(response.applicationId);
        setApplicationNumberBox(state, dispatch);
        //calculate service called
        responsecreateDemand = await createDemandForAdvNOC(state, dispatch);
        //calculate search Bill called

        responsecreateDemand.Calculations[0].taxHeadEstimates[0].estimateAmount > 0 ?
          await fetchBill([
            { key: "tenantId", value: getOPMSTenantId() },
            { key: "consumerCode", value: getapplicationNumber() },
            { key: "businessService", value: "OPMS.ADVERTISEMENTNOC" }
          ], dispatch) : '';

        lSRemoveItem(`exemptedCategory`);
        lSRemoveItemlocal(`exemptedCategory`);
        return { status: "success", message: response, createDemand: responsecreateDemand };
      } else {
        return { status: "fail", message: response, createDemand: responsecreateDemand };
      }
    } else if (method === "UPDATE") {
      dispatch(prepareFinalObject("ADVTCALCULATENOC", payload));

      set(payload, "idName", getIdName(state,"ADVERTISEMENTNOC",get(payload, null)));
      response = await httpRequest("post", "/pm-services/noc/_update", "", [], { dataPayload: payload });
      if (status !== 'REASSIGN') {
        responsecreateDemand = await createDemandForAdvNOC(state, dispatch);
        await fetchBill([
          { key: "tenantId", value: getOPMSTenantId() },
          { key: "consumerCode", value: getapplicationNumber() },
          { key: "businessService", value: "OPMS.ADVERTISEMENTNOC" }
        ], dispatch)
      }

      setapplicationNumber(response.applicationId);
      setApplicationNumberBox(state, dispatch);
      dispatch(prepareFinalObject("ADVERTISEMENTNOC", response));
      return { status: "success", message: response };
    }
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));

    return { status: "failure", message: error };
  }
};


export const getUpdatePriceBook1 = async (pricebookid) => {
  let queryObject = [];
  var requestBody = {

    "tenantId": getOPMSTenantId(),
    "applicationType": "ADVERTISEMENTNOC",
    "applicationStatus": "UPDATE",
    "dataPayload": {
      "priceBookId": pricebookid
    }
  }
  try {
    const payload = await httpRequest(
      "post",
      "/pm-services/noc/_viewPriceBook",
      "",
      queryObject,
      requestBody
    );
    return payload;
  } catch (error) {
    store.dispatch(toggleSnackbar(true, error.message, "error"));
  }
};
export const getCategory1 = async () => {
  let queryObject = [];
  var requestBody = {
    "MdmsCriteria": { "tenantId": getOPMSTenantId(), "moduleDetails": [{ "moduleName": "egpm", "masterDetails": [{ "name": "typeOfAdvertisement" }] }] }
  }
  try {
    const payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "",
      queryObject,
      requestBody
    );
    return payload;
  } catch (error) {
    store.dispatch(toggleSnackbar(true, error.message, "error"));
  }
};

export const getSubCategory1 = async () => {
  let queryObject = [];
  var requestBody = {

    "MdmsCriteria": { "tenantId": getOPMSTenantId(), "moduleDetails": [{ "moduleName": "egpm", "masterDetails": [{ "name": "subTypeOfAdvertisement" }] }] }
  }
  try {
    const payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "",
      queryObject,
      requestBody
    );
    return payload;
  } catch (error) {
    store.dispatch(toggleSnackbar(true, error.message, "error"));
  }
};


export const getMasterGridData1 = async () => {

  let queryObject = [];
  var requestBody = {


    "tenantId": getOPMSTenantId(),
    "applicationType": "ADVERTISEMENTNOC",
    "applicationStatus": "UPDATE",
    "dataPayload": {
      "priceBookId": ""
    }
  }

  try {
    const payload = await httpRequest(
      "post",
      "/pm-services/noc/_viewPriceBook",
      "",
      queryObject,
      requestBody
    );
    return payload;
  } catch (error) {
    store.dispatch(toggleSnackbar(true, error.message, "error"));
  }




};

export const getMISSummaryReport = async data => {
  try {
    const response = await httpRequest(
      "post",
      "/report/pm-services/MISSummaryReport/_get",
      "",
      [],
      data
    );
    return response;

  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }

};

export const getMISApplicationTypeReport = async data => {
  try {
    const response = await httpRequest(
      "post",
      "/report/pm-services/RevenueCollectionReportApplicationTypeWise/_get",
      "",
      [],
      data
    );
    return response;

  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }

};

export const getMISSectorReport = async data => {
  try {
    const response = await httpRequest(
      "post",
      "/report/pm-services/RevenueCollectionReportSectorWise/_get",
      "",
      [],
      data
    );
    return response;

  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }

};

export const getSectordata1 = async () => {
  let queryObject = [];
  var requestBody = {
    "MdmsCriteria": {
      "tenantId": getOPMSTenantId(),
      "moduleDetails": [
        {
          "moduleName": "egpm",
          "masterDetails": [
            {
              "name": "sector"
            }
          ]
        }
      ]
    }
  }
  try {
    const payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "",
      queryObject,
      requestBody
    );
    return payload;
  } catch (error) {
    store.dispatch(toggleSnackbar(true, error.message, "error"));
  }
};

export const getrepotforproccessingTime1 = async () => {
  let data = {
    "tenantId": getOPMSTenantId(),
    "reportName": "ApplicationProcessingTimeReport"
  }
  try {
    const response = await httpRequest(
      "post",
      "/report/pm-services/ApplicationProcessingTimeReport/_get",
      "",
      [],
      data
    );
    return response;

  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }

};
export const getMonthwiseReport = async data => {
  try {
    const response = await httpRequest(
      "post",
      "/report/pm-services/RevenueCollectionReportMonthWise/_get",
      "",
      [],
      data
    );
    return response;

  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }

};

export const getMonth1 = async () => {
  let queryObject = [];
  var requestBody = {

    "MdmsCriteria": {
      "tenantId": getOPMSTenantId(),
      "moduleDetails": [
        {
          "moduleName": "egpm",
          "masterDetails": [
            {
              "name": "reportMonth"
            }
          ]
        }
      ]
    }
  }
  try {
    const payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "",
      queryObject,
      requestBody
    );
    return payload;
  } catch (error) {
    store.dispatch(toggleSnackbar(true, error.message, "error"));
  }
};

export const getYear1 = async () => {
  let queryObject = [];
  var requestBody = {

    "MdmsCriteria": {
      "tenantId": getOPMSTenantId(),
      "moduleDetails": [
        {
          "moduleName": "egpm",
          "masterDetails": [
            {
              "name": "reportYear"
            }
          ]
        }
      ]
    }
  }
  try {
    const payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "",
      queryObject,
      requestBody
    );
    return payload;
  } catch (error) {
    store.dispatch(toggleSnackbar(true, error.message, "error"));
  }
};

export const callBackForRefund = async (state,dispatch,data) => {
  try {
    let nocApplicationDetail = get(state.screenConfiguration.preparedFinalObject, "nocApplicationDetail[0].applicationdetail", {});
    let amount = JSON.parse(nocApplicationDetail)['withdrawapprovalamount'];
    let taxAmount = JSON.parse(nocApplicationDetail)['withdrawapprovaltaxamount'];
    let finalAmount = Number(amount) + Number(taxAmount);
    const transactionResponse = await httpRequest(
      "post",
      "pg-service/transaction/v1/_search",
      "",
      [{ key: "consumerCode", value: data.applicationId },
      { key:"tenantId",value: data.tenantId }]
    );
    if (transactionResponse) {
      const refundPayload = {
        "RefundTransaction": {
          "tenantId": data.tenantId,
          "txnId": transactionResponse.Transaction[0].txnId,
          "refundAmount":finalAmount,
          "gateway": transactionResponse.Transaction[0].gateway,
          "user": transactionResponse.Transaction[0].user
        }
      };
      const response1 = await httpRequest(
        "post",
        "pg-service/transaction/v1/_refund",
        "",
        [],
        refundPayload
      );
      return response1;
    }
  } catch (error) {
    dispatch(toggleSpinner());
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }

};

const callPMUpdateStatusAPI = async (code,url,dispatch) => {
  try {
    const response = await httpRequest(
      "post", "/pm-services/noc/_updateappstatus", "", [], code
    );
    if (response.ResponseInfo.status == "success") {
      dispatch(toggleSpinner());
      // dispatch(setRoute('/inbox'))
      dispatch(setRoute(`/egov-opms/acknowledgement-workflow?purpose=${code.applicationStatus}&applicationNumber=${code.applicationId}&tenantId=${code.tenantId}`))
    }
    else {
      dispatch(toggleSpinner());
      dispatch(toggleSnackbar(
        true,
        { labelName: response.ResponseInfo.msgId, labelCode: response.ResponseInfo.msgId },
        "warning"
      ))
    }
  } catch (error) {
    dispatch(toggleSpinner());
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
}


export const getWFStatus = (actions, state) => {
  let processInstances = get(state, "screenConfiguration.preparedFinalObject.workflow.ProcessInstances", []);
  let length = processInstances.length;
  let currentState = processInstances[length-1].state
  // let currentState = processInstances.pop().state
  let status = "";
  let roles = JSON.parse(getUserInfo()).roles
  currentState.actions.map(item => {
    if (actions.indexOf(item.action) != -1) {
      roles.some(r => {
        if (item.roles.includes(r.code)) {
          status = item.action
        }
      })
    }
  });
  return status;
}

export const checkVisibility = async (state, actions, button, action, buttonPath, extraCondtion) => {
  let processInstanceData = get(state, "screenConfiguration.preparedFinalObject.OPMS.WF.ProcessInstanceData", []);
  if (processInstanceData.length != 0) {
    let currentState = processInstanceData.ProcessInstances[0];
    let found = false;
    let roles = JSON.parse(getUserInfo()).roles

    currentState.nextActions.map(item => {
      if (actions.split(',').indexOf(item.action) != -1) {
        roles.some(r => {
          if (item.roles.includes(r.code)) {
            found = true
            let wfstatus = get(state, "screenConfiguration.preparedFinalObject.WFStatus", [])
            wfstatus.push({ "buttonName": button, "status": item.action })
            set(state, 'screenConfiguration.preparedFinalObject.WFStatus', wfstatus);
          }
        })
      }
    });
    if (getapplicationType() == "ADVERTISEMENTNOC" && currentState.state.state == "PENDINGAPPROVAL") {
      let wfstatus = get(state, "screenConfiguration.preparedFinalObject.WFStatus", [])
      if (localStorageGet('pms_iswithdrawn') === "yes") {
        wfstatus.push({ "buttonName": "approve", "status": "APPROVEFORWITHDRAW" })
        wfstatus.push({ "buttonName": "reject", "status": "REJECTEFORWITHDRAW" })
      }
      wfstatus = wfstatus.filter(function (obj) {
        return obj.buttonName !== 'reassign';
      });
      wfstatus.push({ "buttonName": "reassign", "status": getReassignStatus(processInstanceData) })
      set(state, 'screenConfiguration.preparedFinalObject.WFStatus', wfstatus);
    }
    if (extraCondtion != null) {
      set(
        action,
        buttonPath,
        extraCondtion && found
      );
    } else {
      set(
        action,
        buttonPath,
        found
      );
    }
  }
}

const getReassignStatus = (processInstanceData) => {
  let data = processInstanceData.ProcessInstances[1];
  let status = "";
  switch (data.state.state) {
    case "REVIEWOFJC":
      status = "REASSIGNTOJC";
      break;
    case "REVIEWOFAC":
      status = "REASSIGNTOAC";
      break;
    case "REVIEWOFSC":
      status = "REASSIGNTOSC";
      break;
    case "REVIEWOFSEC":
      status = "REASSIGNTOSEC";
      break;
    default: break;
  }

  return status;
}

// export const checkVisibility = async (state, actions, button, action, buttonPath, extraCondtion) => {
//   
//   let currentState = await getCurrentWFState();
//   let found = false;
//   //alert(JSON.stringify(currentState))
//   let roles = JSON.parse(getUserInfo()).roles

//   currentState.nextActions.map(item => {
//     if (actions.split(',').indexOf(item.action) != -1) {
//       roles.some(r => {
//         if (item.roles.includes(r.code)) {
//           found = true
//           let wfstatus = get(state, "screenConfiguration.preparedFinalObject.WFStatus", [])
//           wfstatus.push({ "buttonName": button, "status": item.action })
//           set(state, 'screenConfiguration.preparedFinalObject.WFStatus', wfstatus);
//         }
//       })
//     }
//   });
//   if (extraCondtion != null) {
//     set(
//       action,
//       buttonPath,
//       extraCondtion && found
//     );
//   } else {
//     set(
//       action,
//       buttonPath,
//       found
//     );
//   }
//   return found;
//   //take current state
//   //check for actions
//   //check for role
//   //set visbility
// }

const getCurrentWFState = async () => {
  try {
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const queryObject = [
      { key: "businessIds", value: applicationNumber },
      { key: "history", value: true },
      { key: "tenantId", value: tenantId }
    ];

    const payload = await httpRequest(
      "post",
      "egov-workflow-v2/egov-wf/process/_search",
      "",
      queryObject
    );
    if (payload && payload.ProcessInstances.length > 0) {
      return payload.ProcessInstances[0]

    } else {
      toggleSnackbar(
        true,
        {
          labelName: "Workflow returned empty object !",
          labelKey: "WRR_WORKFLOW_ERROR"
        },
        "error"
      );
    }
  } catch (e) {
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

export const getEmployeeList = async (state,dispatch,actionToCheck) => {
  try {
    
    let wfstatuslist = get(state, "screenConfiguration.preparedFinalObject.WFStatus", [])
    let wfstatus = "";
    wfstatus = wfstatuslist.find(item => {
      return item.buttonName == actionToCheck ;
    });
    

    let nextActions = get(state, 'screenConfiguration.preparedFinalObject.OPMS.WF.ProcessInstanceData.ProcessInstances[0].nextActions', []);
    let actiontoGet = nextActions.find(action => action.action == wfstatus.status);
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    
    let stateData = businessServiceData[0].states.find(state => state.uuid == actiontoGet.nextState)
    
    let roles = []
    stateData.actions.map(item => {
      item.roles.map(role => { 
        if (!roles.includes(role)) { 
          roles.push(role)
        }
      })
    })

    const tenantId = getQueryArg(window.location.href, "tenantId");
    const queryObject = [
      { key: "roles", value: roles.join() },
      { key: "tenantId", value: tenantId }
    ];

    const payload = await httpRequest(
      "post",
      "/egov-hrms/employees/_search",
      "",
      queryObject
    );
    let employeeList =
    payload &&
    payload.Employees.map((item, index) => {
      const name = get(item, "user.name");
      return {
        code: item.uuid,
        name: name
      };
    });
    
    set(state, 'screenConfiguration.preparedFinalObject.OPMS.assigneeList', employeeList);
    dispatch(
      handleField(
        "roadcutnoc-search-preview",
        "components.adhocDialogForward.children.popup.children.adhocRebateCardSeRoadCutForward.children.ContainerSeRoadCutForward.children.assigneeList",
        "props.data",
        employeeList
      )
    );
  } catch (e) {
    toggleSnackbar(
      true,
      {
        labelName: "Employee Service Error !",
        labelKey: "EMP_SERVICE_ERROR"
      },
      "error"
    );
  }

}
export const setCurrentApplicationProcessInstance = async (state) => {
  try {
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const queryObject = [
      { key: "businessIds", value: applicationNumber },
      { key: "history", value: true },
      { key: "tenantId", value: tenantId }
    ];

    const payload = await httpRequest(
      "post",
      "egov-workflow-v2/egov-wf/process/_search",
      "",
      queryObject
    );
    if (payload && payload.ProcessInstances.length > 0) {
      set(state, 'screenConfiguration.preparedFinalObject.OPMS.WF.ProcessInstanceData', payload);
    } else {
      toggleSnackbar(
        true,
        {
          labelName: "Workflow returned empty object !",
          labelKey: "WRR_WORKFLOW_ERROR"
        },
        "error"
      );
    }
  } catch (e) {
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
const getCurrentWFStateNameForCitizen = (state) => {
  let processInstanceData = get(state, "screenConfiguration.preparedFinalObject.OPMS.WF.ProcessInstanceData", []);
  let currentState = processInstanceData.ProcessInstances[0].state.state;
  return currentState;
}


export const UpdateStatus = async (state, dispatch, url, queryObject, code) => {
  try {
    //    dispatch(toggleSpinner());
    let processInstances = get(state, "screenConfiguration.preparedFinalObject.workflow.ProcessInstances", []);
    let length = processInstances.length;
    code.currentState = checkForRole(JSON.parse(getUserInfo()).roles, 'CITIZEN') ? getCurrentWFStateNameForCitizen(state) : processInstances[length - 1].state.state;
    if (code.applicationStatus == "APPROVEFORWITHDRAW") {
      let response1 = await callBackForRefund(state,dispatch,code);
      if (response1 && response1.ResponseInfo.status == "SUCCESSFUL")
        callPMUpdateStatusAPI(code, url,dispatch)
    }
    else {
      callPMUpdateStatusAPI(code,url,dispatch)
    }
  } catch (error) {
    dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};
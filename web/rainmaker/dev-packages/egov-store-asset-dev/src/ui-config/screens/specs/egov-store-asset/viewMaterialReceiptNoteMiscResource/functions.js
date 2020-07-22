import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
  prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import {
  creatreceiptnotes,
  getmaterialissuesSearchResults,
  getPriceListSearchResults,
  updatereceiptnotes
} from "../../../../../ui-utils/storecommonsapi";
import {
  convertDateToEpoch,
  epochToYmdDate,
  showHideAdhocPopup,
  validateFields
} from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {  
  samplematerialsSearch,
  
  } from "../../../../../ui-utils/sampleResponses";
// SET ALL SIMPLE DATES IN YMD FORMAT
const setDateInYmdFormat = (obj, values) => {
  values.forEach(element => {
    set(obj, element, epochToYmdDate(get(obj, element)));
  });
};





const returnEmptyArrayIfNull = value => {
  if (value === null || value === undefined) {
    return [];
  } else {
    return value;
  }
};

export const setRolesList = (state, dispatch) => {
  let rolesList = get(
    state.screenConfiguration.preparedFinalObject,
    `Employee[0].user.roles`,
    []
  );
  let furnishedRolesList = rolesList.map(item => {
    return " " + item.label;
  });
  dispatch(
    prepareFinalObject(
      "hrms.reviewScreen.furnishedRolesList",
      furnishedRolesList.join()
    )
  );
};





export const furnishindentData = (state, dispatch) => {
  let materialReceipt = get(
    state.screenConfiguration.preparedFinalObject,
    "materialReceipt",
    []
  );
   setDateInYmdFormat(materialReceipt[0], ["receiptDate", ]);

  // setAllYears(materialReceipt[0], [
  //   { object: "education", values: ["yearOfPassing"] },
  //   { object: "tests", values: ["yearOfPassing"] }
  // ]);
  // setRolesData(materialReceipt[0]);
  // setRolesList(state, dispatch);
  dispatch(prepareFinalObject("materialReceipt", materialReceipt));
};

export const handleCreateUpdateMaterialReceiptMisc = (state, dispatch) => {
  let id = get(
    state.screenConfiguration.preparedFinalObject,
    "materialReceipt[0].id",
    null
  );
  if (id) {
    
    createUpdateMR(state, dispatch, "UPDATE");
  } else {
    createUpdateMR(state, dispatch, "CREATE");
  }
};

export const createUpdateMR = async (state, dispatch, action) => {
  const pickedTenant = get(
    state.screenConfiguration.preparedFinalObject,
    "materialReceipt[0].tenantId"
  );
  const tenantId =  getTenantId();
  let queryObject = [
    {
      key: "tenantId",
      value: tenantId
    }
  ];
 
  let materialReceipt = get(
    state.screenConfiguration.preparedFinalObject,
    "materialReceipt",
    []
  );
  set(materialReceipt[0], "tenantId", tenantId);
  // get set date field into epoch

  let receiptDate =
  get(state, "screenConfiguration.preparedFinalObject.materialReceipt[0].receiptDate",0) 
  receiptDate = convertDateToEpoch(receiptDate);
  set(materialReceipt[0],"receiptDate", receiptDate);
  let supplierBillDate =
  get(state, "screenConfiguration.preparedFinalObject.materialReceipt[0].supplierBillDate",0) 
  supplierBillDate = convertDateToEpoch(supplierBillDate);
  set(materialReceipt[0],"supplierBillDate", supplierBillDate);
  let challanDate =
  get(state, "screenConfiguration.preparedFinalObject.materialReceipt[0].challanDate",0) 
  challanDate = convertDateToEpoch(challanDate);
  set(materialReceipt[0],"challanDate", challanDate);
  let inspectionDate =
  get(state, "screenConfiguration.preparedFinalObject.materialReceipt[0].inspectionDate",0) 
  inspectionDate = convertDateToEpoch(inspectionDate);
  set(materialReceipt[0],"inspectionDate", inspectionDate);


  // set date to epoch in  price list material name
  let receiptDetails = returnEmptyArrayIfNull(
    get(materialReceipt[0], "receiptDetails[0].receiptDetailsAddnInfo", [])
  );
  for (let i = 0; i < receiptDetails.length; i++) {
    set(
      materialReceipt[0],
      `receiptDetails[${i}].receiptDetailsAddnInfo[0].manufactureDate`,
      convertDateToEpoch(
        get(materialReceipt[0], `receiptDetails[${i}].receiptDetailsAddnInfo[0].manufactureDate`),
        "dayStart"
      )
    );
    set(
      materialReceipt[0],
      `receiptDetails[${i}].receiptDetailsAddnInfo[0].expiryDate`,
      convertDateToEpoch(
        get(materialReceipt[0], `receiptDetails[${i}].receiptDetailsAddnInfo[0].expiryDate`),
        "dayStart"
      )
    );
  }

  

  //set defailt value
  let id = get(
    state.screenConfiguration.preparedFinalObject,
    "materialReceipt[0].id",
    null
  );
  if(id === null)
  {
    // set(materialReceipt[0],"indentNumber", "");
    // set(materialReceipt[0],"indentType", "Indent");
    // set(materialReceipt[0],"materialHandOverTo", "Test");
    // set(materialReceipt[0],"designation", "");
  }
 
  



  if (action === "CREATE") {
    try {
      console.log(queryObject)
      console.log("queryObject")
      let response = await creatreceiptnotes(
        queryObject,        
        materialReceipt,
        dispatch
      );
      if(response){
        let mrnNumber = response.materialReceipt[0].mrnNumber
        dispatch(setRoute(`/egov-store-asset/acknowledgement?screen=MATERIALRECEIPT&mode=create&code=${mrnNumber}`));
       }
    } catch (error) {
      furnishindentData(state, dispatch);
    }
  } else if (action === "UPDATE") {
    try {
      let response = await updatereceiptnotes(
        queryObject,
        materialReceipt,
        dispatch
      );
      if(response){
        let mrnNumber = response.materialReceipt[0].mrnNumber
        dispatch(setRoute(`/egov-store-asset/acknowledgement?screen=MATERIALRECEIPT&mode=update&code=${mrnNumber}`));
       }
    } catch (error) {
      furnishindentData(state, dispatch);
    }
  }

};

export const getMaterialIndentData = async (
  state,
  dispatch,
  code,
  tenantId
) => {
  let queryObject = [
    {
      key: "code",
      value: code
    },
    {
      key: "tenantId",
      value: tenantId
    }
  ];

 let response = await getmaterialissuesSearchResults(queryObject, dispatch);
// let response = samplematerialsSearch();
  dispatch(prepareFinalObject("materialReceipt", get(response, "materialReceipt")));
  dispatch(
    handleField(
      "create",
      "components.div.children.headerDiv.children.header.children.header.children.key",
      "props",
      {
        labelName: "Edit Material Indent",
        labelKey: "STORE_EDITMATERIAL_MASTER_INDENT_HEADER"
      }
    )
  );
  furnishindentData(state, dispatch);
};

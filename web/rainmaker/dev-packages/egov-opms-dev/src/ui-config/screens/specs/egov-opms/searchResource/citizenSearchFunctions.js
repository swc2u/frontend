import { getSearchResults } from "../../../../../ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getCitizenGridData, getCategory1, getYear1, getMonth1, getrepotforproccessingTime1, getSectordata1, getSubCategory1, getUpdatePriceBook1, getMasterGridData1, getGridDataSellMeat1, getGridDataRoadcut1, getGridDataAdvertisement1 } from "../../../../../ui-utils/commons";
import { convertEpochToDate, convertDateToEpoch } from "../../utils/index";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { textToLocalMapping } from "./searchResults";
import { validateFields, getTextToLocalMapping } from "../../utils";
import get from "lodash/get";
import set from "lodash/set";
import { getPageName } from "./EmployeeSearchForm";
export const fetchData = async (action, state, dispatch,applicationType="") => {
  const response = await getSearchResults();
  try {

    if (response.nocApplicationDetail.length > 0) {
      if (applicationType == "SELLMEATNOC") {
      response.nocApplicationDetail.map(item => {
          let nocSoughtFromAPI = item.nocSought;
          let mdmsDataForNocSought = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData.egpm.nocSought", []);
          let nocSoughtFinalData = "";
          nocSoughtFromAPI.split(",").map(item => {
            
            if (mdmsDataForNocSought.find(str => str.code == item.trim())) {
              nocSoughtFinalData = nocSoughtFinalData + " , " + mdmsDataForNocSought.find(str => str.code == item.trim()).name;
            }
          });
          // dispatch(prepareFinalObject("nocApplicationDetail[0].nocSoughtFinalData",nocSoughtFinalData.slice(2) ));
          item.nocSought = nocSoughtFinalData.slice(2);
        })
    }
      dispatch(prepareFinalObject("searchResults", response.nocApplicationDetail));
      dispatch(
        prepareFinalObject("myApplicationsCount", response.nocApplicationDetail.length)
      );

    }
  } catch (error) {
    console.log(error);
  }
};

export const getGridData = async (action, state, dispatch) => {
  const response = await getCitizenGridData();
  try {
    if (response && response.nocApplicationDetail && response.nocApplicationDetail.length > 0) {
      // dispatch(prepareFinalObject("gridData",response.nocApplicationDetail));

      //   localStorage.setItem('data',JSON.stringify(response.nocApplicationDetail))

      //  dispatch(prepareFinalObject("gridData",response.nocApplicationDetail ));

      //   dispatch(
      //     prepareFinalObject("gridDataCount",response.nocApplicationDetail.length)
      //   );




      let data = response.nocApplicationDetail.map(item => ({
        // alert(item)
        [getTextToLocalMapping("Application No")]:
          item.applicationId || "-",
        [getTextToLocalMapping("Application Status")]: getTextForPetNoc(item.applicationStatus) || "-",
        [getTextToLocalMapping("Applicant Name")]:
          item.applicantName || "-",


      }));

      dispatch(
        handleField(
          "search",
          "components.div.children.searchResults",
          "props.data",
          data
        )
      );

      showHideTable(true, dispatch);















    }
  } catch (error) {
    console.log(error);
  }
};


export const getGridDataSellMeat = async (action, state, dispatch) => {
  const response = await getGridDataSellMeat1();

  try {
    if (response && response.nocApplicationDetail && response.nocApplicationDetail.length > 0) {
      // setgrid(response.nocApplicationDetail)
      // //alert(getgrid)
      //   localStorage.setItem('dataSellMeat',JSON.stringify(response.nocApplicationDetail))
      //   //alert(localStorage.getItem('data')
      // //)
      //   dispatch(prepareFinalObject("gridData",response.nocApplicationDetail ));

      //   dispatch(
      //     prepareFinalObject("gridDataCount",response.nocApplicationDetail.length)
      //   );

      let data = response.nocApplicationDetail.map(item => ({
        // alert(item)
        [getTextToLocalMapping("Application No")]:
          item.applicationId || "-",
        [getTextToLocalMapping("Application Status")]: getTextForSellMeatNoc(item.applicationStatus) || "-",
        [getTextToLocalMapping("Applicant Name")]:
          item.applicantName || "-",


      }));

      dispatch(
        handleField(
          "sellmeat-search",
          "components.div.children.searchResultsSellmeat",
          "props.data",
          data
        )
      );

      showHideTableSellmeat(true, dispatch);




    }
  } catch (error) {
    console.log(error);
  }
};

export const getGridDataRoadcut = async (action, state, dispatch) => {
  const response = await getGridDataRoadcut1();

  try {
    if (response && response.nocApplicationDetail && response.nocApplicationDetail.length > 0) {
      // setgrid(response.nocApplicationDetail)
      // //alert(getgrid)
      //   localStorage.setItem('dataRoadcut',JSON.stringify(response.nocApplicationDetail))
      //   //alert(localStorage.getItem('data')
      // //)
      //   dispatch(prepareFinalObject("gridData",response.nocApplicationDetail ));

      //   dispatch(
      //     prepareFinalObject("gridDataCount",response.nocApplicationDetail.length)
      //   );


      let data = response.nocApplicationDetail.map(item => ({
        // alert(item)
        [getTextToLocalMapping("Application No")]:
          item.applicationId || "-",
        [getTextToLocalMapping("Application Status")]: getTextForRoadCuttNoc(item.applicationStatus) || "-",
        [getTextToLocalMapping("Applicant Name")]:
          item.applicantName || "-",


      }));
      dispatch(
        handleField(
          "roadcut-search",
          "components.div.children.searchResultsRoadcut",
          "props.data",
          data
        )
      );

      showHideTableRoadCut(true, dispatch);

    }
  } catch (error) {
    console.log(error);
  }
};




export const getGridDataAdvertisement = async (action, state, dispatch) => {
  const response = await getGridDataAdvertisement1();

  try {
    if (response && response.nocApplicationDetail && response.nocApplicationDetail.length > 0) {
      // setgrid(response.nocApplicationDetail)
      // //alert(getgrid)
      //   localStorage.setItem('dataAdvertisement',JSON.stringify(response.nocApplicationDetail))
      //   //alert(localStorage.getItem('data')
      // //)
      //   dispatch(prepareFinalObject("gridData",response.nocApplicationDetail ));

      //   dispatch(
      //     prepareFinalObject("gridDataCount",response.nocApplicationDetail.length)
      //   );
      //   let data = response.nocApplicationDetail.map(item => ({
      // alert(item)
      //    [getTextToLocalMapping("Application No")]:
      //    item.applicationId || "-",
      //    [getTextToLocalMapping("Application Status")]: item.applicationStatus || "-",
      //    [getTextToLocalMapping("Applicant Name")]:
      //      item.applicantName || "-",


      //}));

      let data = response.nocApplicationDetail.map(item => ({
        [getTextToLocalMapping("Application No")]:
          item.applicationId || "-",
        [getTextToLocalMapping("Application Status")]: getTextAdvertisement(item.applicationStatus, item.Withdraw) || "-",
        [getTextToLocalMapping("Applicant Name")]:
          item.applicantName || "-",


      }));

      dispatch(
        handleField(
          "advertisement-search",
          "components.div.children.searchResultsAdvertisement",
          "props.data",
          data
        )
      );

      showHideTableADV(true, dispatch);

    }

  } catch (error) {
    console.log(error);
  }
};






export const getMasterGridData = async (action, state, dispatch) => {
  const response = await getMasterGridData1();
  try {
    if (response && response.nocApplicationDetail && response.nocApplicationDetail.length > 0) {
      // dispatch(prepareFinalObject("gridData",response.nocApplicationDetail));

      //   localStorage.setItem('Matserdata',JSON.stringify(response.nocApplicationDetail))

      //  dispatch(prepareFinalObject("Matserdata",response.nocApplicationDetail ));

      //   dispatch(
      //     prepareFinalObject("MatserdataCount",response.nocApplicationDetail.length)
      //   );

      let category = get(
        state,
        "screenConfiguration.preparedFinalObject.category",

      );

      let Subcategory = get(
        state,
        "screenConfiguration.preparedFinalObject.subcategory",
      );
      //alert(JSON.stringify(Subcategory))
      //screenConfiguration.preparedFinalObject.subcategory

      for (let i = 0; i < response.nocApplicationDetail.length; i++) {
        for (let j = 0; j < category.length; j++) {
          if (response.nocApplicationDetail[i].categoryId == category[j].id) {

            //obj['categoryName']=category[j].name
            response.nocApplicationDetail[i]['categoryName'] = category[j].name
            response.nocApplicationDetail[i]['duration'] = category[j].duration
            response.nocApplicationDetail[i]['calculationType'] = category[j].calculationType


          }
        }

      }
      for (let i = 0; i < response.nocApplicationDetail.length; i++) {
        for (let j = 0; j < Subcategory.length; j++) {
          if (response.nocApplicationDetail[i].subCategoryId == Subcategory[j].id) {

            //obj['categoryName']=category[j].name
            response.nocApplicationDetail[i]['subcategoryName'] = Subcategory[j].name
          }
        }

      }
      console.log(response.nocApplicationDetail)


      let data = response.nocApplicationDetail.map(item => ({
        // alert(item)

        [getTextToLocalMapping("Price Book Id")]:
          item.priceBookId || "-",
        [getTextToLocalMapping("categoryId")]:
          item.categoryName || "-",
        [getTextToLocalMapping("subCategoryId")]: item.subcategoryName || "-",
        [getTextToLocalMapping("perDayPrice")]:
          item.perDayPrice,
        [getTextToLocalMapping("perWeekPrice")]:
          item.perWeekPrice,
        [getTextToLocalMapping("perMonthPrice")]:
          item.perMonthPrice,
        [getTextToLocalMapping("annualPrice")]:
          item.annualPrice,
        [getTextToLocalMapping("effectiveFromDate")]:
          item.effectiveFromDate.split(" ")[0] || "-",
        [getTextToLocalMapping("effectiveToDate")]:
          item.effectiveToDate === null ? "-" : item.effectiveToDate.split(" ")[0] || "-",

      }));

      dispatch(
        handleField(
          "masterAdvertisement",
          "components.div.children.searchResultsMaser",
          "props.data",
          data
        )
      );

      showHideTableMaster(true, dispatch);





    }
  } catch (error) {
    console.log(error);
  }
};

export const getUpdatePriceBook = async (action, state, dispatch, pricebookid) => {
  const response = await getUpdatePriceBook1(pricebookid);
  try {
    if (response && response.nocApplicationDetail && response.nocApplicationDetail.length > 0) {
      // dispatch(prepareFinalObject("gridData",response.nocApplicationDetail));

      // localStorage.setItem('Matserdata',JSON.stringify(response.nocApplicationDetail))
      // screenConfiguration.preparedFinalObject.category
      let category = get(
        state,
        "screenConfiguration.preparedFinalObject.category"

      );
      // alert(JSON.stringify(category))
      let Subcategory = get(
        state,
        "screenConfiguration.preparedFinalObject.subcategory"
      );

      // for(let i=0;i<response.nocApplicationDetail.length;i++)
      // {
      for (let j = 0; j < category.length; j++) {
        if (response.nocApplicationDetail[0].categoryId == category[j].id) {
          //let data=[]
          let cat = category[j].duration
          // alert(cat)
          // data.push(cat)
          //obj['categoryName']=category[j].name
          // response.nocApplicationDetail[i]['categoryName']=category[j].name
          response.nocApplicationDetail[0]['duration'] = category[j].duration
          response.nocApplicationDetail[0]['calculationType'] = category[j].calculationType
          let cat1 = JSON.stringify(cat)
          // alert(cat1.includes("annual"))
          set(
            state,
            "screenConfiguration.preparedFinalObject.masterScreen.duration",
            cat1
          );

          if (cat1.includes("day") === true) {
            set(
              action,
              "screenConfig.components.div.children.NOCApplication2.children.cardContent.children.masterContainer.children.perDay.props.disabled",
              false
            );
            set(
              action,
              "screenConfig.components.div.children.NOCApplication2.children.cardContent.children.masterContainer.children.perDay.required",
              true
            );
          }

          if (cat1.includes("week") === true) {

            set(
              action,
              "screenConfig.components.div.children.NOCApplication2.children.cardContent.children.masterContainer.children.perWeek.props.disabled",
              false
            );
            set(
              action,
              "screenConfig.components.div.children.NOCApplication2.children.cardContent.children.masterContainer.children.perWeek.required",
              true
            );
          }
          if (cat1.includes("month") === true) {
            set(
              action,
              "screenConfig.components.div.children.NOCApplication2.children.cardContent.children.masterContainer.children.perMonth.props.disabled",
              false
            );
            set(
              action,
              "screenConfig.components.div.children.NOCApplication2.children.cardContent.children.masterContainer.children.perMonth.required",
              true
            );
          }
          if (cat1.includes("annual") === true) {
            set(
              action,
              "screenConfig.components.div.children.NOCApplication2.children.cardContent.children.masterContainer.children.anual.props.disabled",
              false
            );
            set(
              action,
              "screenConfig.components.div.children.NOCApplication2.children.cardContent.children.masterContainer.children.anual.required",
              true
            );

          }






          localStorage.setItem('duration', JSON.stringify(cat))
          //alert(localStorage.getItem('duration').includes("annual"))

        }

      }

      // }

      let date = convertEpochToDate(response.nocApplicationDetail[0].effectiveFromDate)
      let data = response.nocApplicationDetail[0]

      date = date.split('/')
      date = date[2] + '-' + date[1] + '-' + date[0]
      // Matserdata[0].effectiveFromDate

      data['effectiveFromDate'] = date
      //  alert(JSON.stringify(data))
      dispatch(prepareFinalObject("Matserdata", response.nocApplicationDetail));

      dispatch(
        prepareFinalObject("MatserdataCount", response.nocApplicationDetail.length)
      );
    }
  } catch (error) {
    console.log(error);
  }
};
export const getCategory = async (action, state, dispatch, pricebookid) => {
  const response = await getCategory1();
  try {
    if (response) {

      dispatch(prepareFinalObject("category", response.MdmsRes.egpm.typeOfAdvertisement));

      dispatch(
        prepareFinalObject("categorycount", response.MdmsRes.egpm.typeOfAdvertisement.length)
      );
    }
  } catch (error) {
    console.log(error);
  }
};
export const getSubCategory = async (action, state, dispatch, pricebookid) => {
  const response = await getSubCategory1();
  try {
    if (response) {
      // dispatch(prepareFinalObject("gridData",response.nocApplicationDetail));

      // localStorage.setItem('Matserdata',JSON.stringify(response.nocApplicationDetail))

      dispatch(prepareFinalObject("subcategory", response.MdmsRes.egpm.subTypeOfAdvertisement));

      dispatch(
        prepareFinalObject("subcategorycount", response.MdmsRes.egpm.subTypeOfAdvertisement.length)
      );
    }
  } catch (error) {
    console.log(error);
  }
};

export const getSectordata = async (action, state, dispatch, pricebookid) => {
  const response = await getSectordata1();
  try {
    if (response) {
      // dispatch(prepareFinalObject("gridData",response.nocApplicationDetail));

      // localStorage.setItem('Matserdata',JSON.stringify(response.nocApplicationDetail))
      response.MdmsRes.egpm.sector.unshift({ name: "ALL", code: "ALL" });
      dispatch(prepareFinalObject("SectorData", response.MdmsRes.egpm.sector));

      dispatch(
        prepareFinalObject("SectorDataLen", response.MdmsRes.egpm.sector.length)
      );
    }
  } catch (error) {
    console.log(error);
  }
};



export const getrepotforproccessingTime = async (action, state, dispatch) => {
  const response = await getrepotforproccessingTime1();
  try {
    if (response) {
      // dispatch(prepareFinalObject("gridData",response.nocApplicationDetail));

      // localStorage.setItem('Matserdata',JSON.stringify(response.nocApplicationDetail))

      //  dispatch(prepareFinalObject("SectorData",response.MdmsRes.egpm.sector));

      //   dispatch(
      //     prepareFinalObject("SectorDataLen",response.MdmsRes.egpm.sector.length)
      //   );






      let data = response.reportResponses[0].reportData.map(item => ({
        // alert(item)
        [getTextToLocalMapping("applcationType")]:
          item[0] || "-",
        [getTextToLocalMapping("avgTimeTakenToProcessRequest")]: item[1] || "-",
        [getTextToLocalMapping("pendingMoreThan10AndLessThan30Days")]:
          item[3] || "-",
        [getTextToLocalMapping("pendingMoreThan30Days")]:
          item[2] || "-",

      }));

      dispatch(
        handleField(
          "reportForProcessingTime",
          "components.div.children.searchResultsReports4",
          "props.data",
          data
        )
      );

      showHideTable4(true, dispatch);



    }
  } catch (error) {
    console.log(error);
  }
};

const showHideTable4 = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "reportForProcessingTime",
      "components.div.children.searchResultsReports4",
      "visible",
      booleanHideOrShow
    )
  );
};


export const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "search",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};


export const showHideTableSellmeat = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "sellmeat-search",
      "components.div.children.searchResultsSellmeat",
      "visible",
      booleanHideOrShow
    )
  );
};

export const showHideTableADV = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "advertisement-search",
      "components.div.children.searchResultsAdvertisement",
      "visible",
      booleanHideOrShow
    )
  );
};

export const showHideTableRoadCut = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "roadcut-search",
      "components.div.children.searchResultsRoadcut",
      "visible",
      booleanHideOrShow
    )
  );
};




export const getYear = async (action, state, dispatch, pricebookid) => {
  const response = await getYear1();
  try {
    if (response) {
      // dispatch(prepareFinalObject("gridData",response.nocApplicationDetail));

      // localStorage.setItem('Matserdata',JSON.stringify(response.nocApplicationDetail))

      dispatch(prepareFinalObject("reportYear", response.MdmsRes.egpm.reportYear));


    }
  } catch (error) {
    console.log(error);
  }
};



export const getMonth = async (action, state, dispatch, pricebookid) => {
  const response = await getMonth1();
  try {
    if (response) {
      // dispatch(prepareFinalObject("gridData",response.nocApplicationDetail));

      // localStorage.setItem('Matserdata',JSON.stringify(response.nocApplicationDetail))

      dispatch(prepareFinalObject("reportMonth", response.MdmsRes.egpm.reportMonth));


    }
  } catch (error) {
    console.log(error);
  }
};


export const getTextForPetNoc = label => {
  switch (label) {
    case "FORWARD":
      return 'Pending for Approval'
    case "PAID":
      return 'Paid'
    case "REASSIGNTOSI":
      return 'Reassigned To SI'
    case "RESENT":
      return 'Resent'
    case "APPROVED":
      return 'Approved'
    case "REASSIGN":
      return 'Application Reassigned To Citizen'
    case "INITIATED":
      return 'Initiated'
    case "PENDINGAPPROVAL":
      return 'Pending Approval'
    case "REJECTED":
      return "Rejected"
    case "DRAFT":
      return "Draft"

    default:
      return '-'
  }
}

export const getTextForSellMeatNoc = label => {
  switch (label) {
    case "INITIATED":
      return 'Initiated'
    case "PENDINGAPPROVAL":
      return 'Pending Approval'
    case "PAID":
      return 'Paid'
    case "REASSIGNTOSI":
      return 'Reassign To SI'
    case "RESENT":
      return 'Resent'
    case "APPROVED":
      return 'Approved'
    case "REVIEWOFSUPERINTENDENT":
      return 'Review Of Superintendent'
    case "REASSIGNTOSUPERINTENDENT":
      return 'Reassign To Superintendent'
    case "REJECTED":
      return "Rejected"
    case "REASSIGN":
      return 'Reassigned To Citizen'
    case "DRAFT":
      return "Draft"

    default:
      return '-'
  }
}

export const getTextAdvertisement = (label, isWithdrawn) => {

  switch (label) {
    case "INITIATED":
      return 'Initiated'
    case "INITIATEDEXC":
      return 'Initiated'
    case "PAID":
      return 'Paid'
    case "REVIEWOFSUPERINTENDENT":
      return 'Review Of Superintendent'
    case "REVIEWOFSPAFTERWITHDRAW":
      return 'Withdraw Request';
    case "REVIEWOFOSD":
      return isWithdrawn === "0" ? 'Review Of OSD' : 'Withdraw Request';
    case "WITHDRAWAPPROVAL":
      return 'Withdraw Approval';
    case "WITHDRAWREJECTED":
      return 'Withdraw Rejected';
    case "APPROVEFORWITHDRAW":
      return 'Withdraw Approval';
    case "REJECTEFORWITHDRAW":
      return 'Withdraw Rejected';
    case "WITHDRAWAFTERAPRROVAL":
      return 'Withdraw Request';
    case "WITHDRAW":
      return 'Withdraw';
    case "PENDINGAPPROVAL":
      return isWithdrawn === "0" ? 'Pending Approval' : 'Withdraw Request';
    case "PENDINGAPPROVALFORWITHDRAW":
      return 'Withdraw Request';
    case "REJECTED":
      return 'Rejected'
    case "RESENT":
      return 'Resent'
    case "REASSIGN":
      return 'Reassign'
    case "APPROVED":
      return 'Approved'
    case "REASSIGNTOJEX":
      return isWithdrawn === "0" ? 'Reassign To JEX' : 'Withdraw Request';
    case "REASSIGNTOSUPERINTENDENT":
      return isWithdrawn === "0" ? 'Reassign To Superintendent' : 'Withdraw Request';
    case "REASSIGNTOOSD":
      return isWithdrawn === "0" ? 'Reassign To OSD' : 'Withdraw Request';
    case "PAYMENTPENDING":
      return 'Payment Pending'
    case "REVIEWOFJC":
      return 'Review Of JC';
    case "REVIEWOFAC":
      return 'Review Of AC';
    case "REVIEWOFSC":
      return 'Review Of SC';
    case "REVIEWOFSEC":
      return 'Review Of SEC';
    case "REASSIGNTOJC":
      return isWithdrawn === "0" ? 'Reassigned Of JC' : 'Withdraw Request';
    case "REASSIGNTOAC":
      return isWithdrawn === "0" ? 'Reassigned Of AC' : 'Withdraw Request';
    case "REASSIGNTOSC":
      return isWithdrawn === "0" ? 'Reassigned Of SC' : 'Withdraw Request';
    case "REASSIGNTOSEC":
      return isWithdrawn === "0" ? 'Reassigned Of SEC' : 'Withdraw Request';
    case "REVIEWOFJCFORWITHDRAW":
      return 'Withdraw Request';
    case "REVIEWOFACFORWITHDRAW":
      return 'Withdraw Request';
    case "REVIEWOFSCFORWITHDRAW":
      return 'Withdraw Request';
    case "REVIEWOFSECFORWITHDRAW":
      return 'Withdraw Request';
    case "DRAFT":
      return 'Draft';
    default:
      return '-'
  }
}




export const getTextForRoadCuttNoc = label => {
  switch (label) {
    case "INITIATED":
      return 'Initiated'
    case "RESENTTOADM":
      return 'Resent to ADM'
    case "INITIATED_TELECOM":
      return 'Initiated'
    case "REVIEWOFEE L1":
      return 'Review of EE L1'
    case "REASSIGNTOADM":
      return 'Reassign to ADM'
    case "EDITEDATJE":
      return 'Edited at JE'
    case "REVIEWOFJE":
      return 'Review To JE'
    case "REASSIGNTOJE":
      return 'Reassign To JE'
    case "RESENT":
      return 'Resent'
    case "REASSIGNTOSDE L2":
      return 'Reassign To SDE'
    case "REVIEWSDE L1":
      return 'Review Of SDE'
    case "REVIEWSDE L2":
      return 'Review Of SDE L2'
    case "REVIEWOFSE L1":
      return 'Review of SE'
    case "REVIEWOFEE L2":
      return 'Review of EE L2'
    case "REVIEWOFEE L3":
      return 'Review Approval of EE'
    case "REJECTED":
      return 'Rejected'
    case "REASSIGN":
      return 'Reassign'
    case "APPROVED BY EE":
      return 'Approved By EE'
    case "APPROVED BY SE":
      return 'Approved By SE'
    case "APPROVED BY CE":
      return 'Approved By CE'
    case "PAID":
      return 'Paid'
    case "PENDINGAPPROVAL":
      return 'Pending Approval'
    case "REASSIGNTOEE":
      return 'Reassign To EE'
    case "PAYMENTPENDING":
      return 'Payment Pending'
    case "VERIFYHDMEE L1":
      return 'Verification Of HDMEE L1'
    case "VERIFYHDMEE L2":
      return 'Verification Of HDMEE L2'
    case "VERIFYDMEE":
      return 'Verification Of DMEE'
    case "REASSIGNTOHDMEE":
      return 'Reassign Of HDMEE'
    case "VERIFYCHDSE L1":
      return 'Verification Of CHDSE L1'
    case "VERIFYCHDSE L2":
      return 'Verification Of CHDSE L2'
    case "VERIFYDMSE":
      return 'Verification Of DMSE'
    case "REASSIGNTOCHDSE":
      return 'Reassign Of CHDSE'
    case "VERIFYCHDCE L1":
      return 'Verification Of CHDCE L1'
    case "VERIFYDMCE":
      return 'Verification Of DMCE'
    case "VERIFYCHDCE L2":
      return 'Verification Of CHDCE L2'
    case "REASSIGNTOCHDCE":
      return 'Reassign Of CHDCE'
    case "REVIEWOFEE L3":
      return 'Review Of EE'
    case "REVIEWOFSE L2":
      return 'Review Approval Of SE'
    case "REASSIGNTOEE L3":
      return 'Reassigned To EE'
    case "REASSIGNTOSE L2":
      return 'Reassigned To SE'
    case "REVIEWOFCE L1":
      return 'Review of CE'
    case "REVIEWOFWD":
      return 'Review of WD'
    case "REASSIGNTOWD":
      return 'Reassign of WD'
    case "VERIFY FOR COMPLETION":
      return 'Verify For Completion'
    case "VERIFY AFTER APPROVAL L1":
      return 'Verification After Approval L1'
    case "VERIFY AFTER APPROVAL L2":
      return 'Verification After Approval L2'
    case "VERIFY AFTER APPROVAL L3":
      return 'Pending for Payment'
    case "REASSIGNTODMEE":
      return 'Reassign To DMEE'
    case "REASSIGNTODMSE":
      return 'Reassign To DMSE'
    case "REASSIGNTODMCE":
      return 'Reassign To DMCE'
    case "REVIEWOFSDEHQ":
      return 'Review Of SDEHQ'
    case "REASSIGNTOSDEHQ":
      return 'Reassign To SDEHQ'
    case "COMPLETE":
      return 'Completed'
    case "DRAFT":
      return 'Draft'
    case "EDITEDATDMEE":
      return 'Edited at DMEE'
    default:
    return '-'
  }
}

const showHideTableMaster = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "masterAdvertisement",
      "components.div.children.searchResultsRoadcut",
      "visible",
      booleanHideOrShow
    )
  );
};

export const resetFieldsForEmployeeFilter = (state, dispatch) => {
  //resetting servicerequeststatus using below 2 lines  of dispatch

  try {
    var serviceRequestStatusPlaceholder = get(state, `screenConfiguration.screenConfig.${getPageName()}.components.div.children.SearchFormForEmployee.children.cardContent.children.StatusLocalityAndFromToDateContainer.children.ServiceRequestStatus.props.placeholder`, {})
    dispatch(
      handleField(
        getPageName(),
        "components.div.children.SearchFormForEmployee.children.cardContent.children.StatusLocalityAndFromToDateContainer.children.ServiceRequestStatus",
        "props.value",
        serviceRequestStatusPlaceholder.labelKey
      )
    );
  }
  catch (e) {
    dispatch(
      handleField(
        getPageName(),
        "components.div.children.SearchFormForEmployee.children.cardContent.children.StatusLocalityAndFromToDateContainer.children.ServiceRequestStatus",
        "props.value",
        undefined
      )
    );
  }



  //resetting from date
  dispatch(
    handleField(
      getPageName(),
      "components.div.children.SearchFormForEmployee.children.cardContent.children.StatusLocalityAndFromToDateContainer.children.fromDate",
      "props.value",
      ""
    )
  );
  //resetting to date
  dispatch(
    handleField(
      getPageName(),
      "components.div.children.SearchFormForEmployee.children.cardContent.children.StatusLocalityAndFromToDateContainer.children.toDate",
      "props.value",
      ""
    )
  );
  //resetting serviceRequestID
  dispatch(
    handleField(
      getPageName(),
      "components.div.children.SearchFormForEmployee.children.cardContent.children.StatusLocalityAndFromToDateContainer.children.ServiceRequestId",
      "props.value",
      ""
    )
  );

  set(state, "screenConfiguration.preparedFinalObject.OPMS.searchFilter", {});
};
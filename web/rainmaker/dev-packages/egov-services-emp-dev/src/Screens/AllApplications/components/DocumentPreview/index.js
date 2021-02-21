
import jp from "jsonpath";
import {
  getQueryArg,
  setBusinessServiceDataToLocalStorage,
  getFileUrlFromAPI,
  setDocuments
} from "egov-ui-framework/ui-utils/commons";

const prepareDocumentsView = async (state, dispatch) => {
  let documentsPreview = [];

  // Get all documents from response
  let bookingDocs = get(
    state,
    "screenConfiguration.preparedFinalObject.BookingDocument",
    {}
  );

  

    if (bookingDocs !== "") {
      let keys = Object.keys(bookingDocs); 
      let values = Object.values(bookingDocs); 
      let id = keys[0], 
          fileName = values[0]; 

      documentsPreview.push({
        title: "DOC_DOC_PICTURE",
        fileStoreId: id,
        linkText: "View",
      });
      let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
      let fileUrls =
        fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};
        
      documentsPreview = documentsPreview.map(function (doc, index) {
        doc["link"] =
          (fileUrls &&
            fileUrls[doc.fileStoreId] &&
            fileUrls[doc.fileStoreId].split(",")[0]) ||
          "";
        //doc["name"] = doc.fileStoreId;
        doc["name"] =
          (fileUrls[doc.fileStoreId] &&
            decodeURIComponent(
              fileUrls[doc.fileStoreId]
                .split(",")[0]
                .split("?")[0]
                .split("/")
                .pop()
                .slice(13)
            )) ||
          `Document - ${index + 1}`;
        return doc;
      });
      dispatch(prepareFinalObject("documentsPreview", documentsPreview));
    }
};
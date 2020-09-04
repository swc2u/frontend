import {
  getBreak,
  getCommonCard,
  getCommonParagraph,
  getCommonTitle,
  getCommonSubHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";

const contract = {

  uploadBoxData: { jsonPath: "" },

};
export const documentDetailsImagesNewLoc = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Required Documents",
      labelKey: "BK_OSWMCC_HEADER_STEP_3",
  
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  upload: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        marginLeft: 8
      }
    },
    required: false,
    children: {
      uploadFileHeader: getCommonSubHeader(
        {
          labelName: "Supporting Documents",
          labelKey: "BK_SUPPORTING_DOCUMENTS_LABEL"
        },
        {
          style: { marginTop: 15, width: "100%" }
        }
      ),
      uploadFileInfo: getCommonParagraph(
        {
          labelName: "Only .jpg and .pdf files. 5MB max file size."
        },
        {
          style: {
            fontSize: 12,
            marginBottom: 0,
            marginTop: 5,
            width: "100%",
            color: "rgba(0, 0, 0, 0.6000000238418579)"
          }
        }
      ),
      uploadButton: {
        uiFramework: "custom-molecules",
        componentPath: "UploadMultipleFiles",
        props: {
          maxFiles: 4,
          jsonPath: contract.uploadBoxData.jsonPath,
          inputProps: {
            accept: "image/*, .pdf, .png, .jpeg"
          },
          buttonLabel: { labelName: "UPLOAD FILES", labelKey: "BK_UPLOAD_BUTTON_LABEL" },
          maxFileSize: 5000,
          moduleName: "NLUJM",
          hasLocalization: false
        }
      }
    }
  },
  subText: getCommonParagraph({
    labelName:
      "Only one file can be uploaded for one document. If multiple files need to be uploaded then please combine all files in a pdf and then upload",
    labelKey: "BK_OSWMCC_DOCUMENT_SUBTEXT"
  }),
  break: getBreak()
  
});

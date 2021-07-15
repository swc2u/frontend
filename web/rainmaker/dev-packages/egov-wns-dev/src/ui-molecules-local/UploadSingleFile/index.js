import React from "react";
import get from "lodash/get";
import { UploadFile, UploadedDocument } from "egov-ui-framework/ui-atoms";
import {
  localStorageGet,
  getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";
const UploadSingleFile = ({
  uploaded,
  classes,
  handleFileUpload,
  documents,
  pagename,
  removeDocument,
  onButtonClick,
  inputProps,
  buttonLabel,
  id
}) => {
  let UploadRequired = true;
    if(process.env.REACT_APP_NAME !== "Citizen")
    {
      let role = 'WS_BILL_UPLOAD'
           let userInfo = JSON.parse(getUserInfo());
           const roles = get(userInfo, "roles");
           const roleCodes = roles ? roles.map(role => role.code) : [];
           if (roleCodes.indexOf(role) > -1) {
            UploadRequired = true
           } else
           {
            UploadRequired = false
           } 

    

    }
  return (
    <div>
      {!uploaded && UploadRequired && (
     // {!uploaded &&  (pagename !=="wns" ) && (
        <UploadFile
          buttonProps={{
            variant: "outlined",
            color: "primary",
            onClick: onButtonClick
          }}
          id={id}
          handleFileUpload={handleFileUpload}
          inputProps={{ multiple: false, ...inputProps }}
          classes={classes}
          buttonLabel={buttonLabel}
        />
      )}
      {uploaded && (
        <div>
          {documents &&
            documents.map((document, documentIndex) => {
              return (
                <div key={documentIndex}>
                  {document && (
                    <UploadedDocument
                      document={document}
                      removeDocument={removeDocument}
                      moduleName="wns"
                      pagename={pagename}
                    />
                  )}
                  {
                    UploadRequired &&(<p style={{paddingTop: "10px", textAlign: "right"}} > Size : { document.fileSize } Kb. </p>)
                  }
				
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default UploadSingleFile;

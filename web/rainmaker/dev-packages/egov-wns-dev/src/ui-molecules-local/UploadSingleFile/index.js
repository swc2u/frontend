import React from "react";
import { UploadFile, UploadedDocument } from "egov-ui-framework/ui-atoms";

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
  return (
    <div>
      {!uploaded && (
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
				<p style={{paddingTop: "10px", textAlign: "right"}} > Size : { document.fileSize } Kb. </p>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default UploadSingleFile;

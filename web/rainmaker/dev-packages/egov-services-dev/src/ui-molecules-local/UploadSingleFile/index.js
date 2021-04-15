import React from "react";
import { UploadFile, UploadedDocument } from "egov-ui-framework/ui-atoms";

const UploadSingleFile = ({
  id ,
  uploaded,
  classes,
  handleFileUpload,
  documents,
  removeDocument,
  onButtonClick,
  inputProps,
  buttonLabel
}) => {
  console.log('cool :>> ', inputProps);
  return (
    <div>
      {!uploaded && (
        <UploadFile
          id={id}
          buttonProps={{
            variant: "outlined",
            color: "primary",
            onClick: onButtonClick
          }}
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
                  <UploadedDocument
                    document={document}
                    removeDocument={removeDocument}
                  />
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default UploadSingleFile;

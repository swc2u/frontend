// import React, { Component,useState } from "react";
// import { withStyles } from "@material-ui/core/styles";
// import { DocumentList } from "../../ui-molecules-local";
// import { connect } from "react-redux";
// import get from "lodash/get";
// import '@react-pdf-viewer/core/lib/styles/index.css';
// import '@react-pdf-viewer/default-layout/lib/styles/index.css';
// import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'; // install this library
// import { Viewer } from '@react-pdf-viewer/core'; // install this library
// import { Worker } from '@react-pdf-viewer/core'; // install this library
// import axios from 'axios';
// import "./index.css";


// const styles = theme => ({
//   button: {
//     margin: theme.spacing.unit,
//     padding: "8px 38px"
//   },
//   input: {
//     display: "none !important"
//   }
// });

// // Create new plugin instance
// const defaultLayoutPluginInstance = defaultLayoutPlugin();
  
// // for onchange event
// const [pdfFile, setPdfFile]=useState(null);
// const [pdfFileError, setPdfFileError]=useState('');

// // for submit event
// const [viewPdf, setViewPdf]=useState(null);

// // onchange event
// const fileType=['application/pdf'];
// const handlePdfFileChange= async(e)=>{
//     debugger;
//     var response =await axios.get("https://chstage.blob.core.windows.net/fileshare/ch/pdfgen/April/24/1619240796604shopkeeper-ec-1619240796452.pdf?sig=2IarLlOT5%2BjfSM5U7AsqVHRR6d%2BqiF3IHsVeqY%2FOcMw%3D&st=2021-04-24T05%3A06%3A37Z&se=2021-04-25T05%3A06%3A37Z&sv=2016-05-31&sp=r&sr=b", {
//         //responseType: "blob",
//         responseType: "arraybuffer",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/pdf"
//         }
//       });
//     let blob = new Blob([response.data], {type: 'application/pdf'});
    
    
//     const url = URL.createObjectURL(blob);
//     // const fileURl = "";


//     let selectedFile=url//e.target.files[0];
//     // let selectedFile = blob;
//     if(selectedFile){
//       if(selectedFile&&fileType.includes(selectedFile.type)){
//         let reader = new FileReader();
//         debugger;
//             reader.readAsDataURL(selectedFile);
//             debugger;
//             reader.onload = (e) =>{
//               debugger;
//               setPdfFile(e.target.result);
//               setPdfFileError('');
//             }
//       }
//       else{
//         setPdfFile(null);
//         setPdfFileError('Please select valid pdf file');
//       }
//     }
//     else{
//       console.log('select your file');
//     }
//   }
//    // form submit
//    const handlePdfFileSubmit= async (e)=>{
//     e.preventDefault();
//     debugger;

//     // var fileStoreID = "c4adb57b-a081-4154-9d32-20516e3dad1e"
//     // var response =await axios.get(fileStoreID, {
//     //   //responseType: "blob",
//     //   responseType: "arraybuffer",
//     //   headers: {
//     //     "Content-Type": "application/json",
//     //     Accept: "application/pdf"
//     //   }
//     // });

//     if(pdfFile!==null){
//       setViewPdf(pdfFile);
//     }
//     else{
//       setViewPdf(null);
//     }
//   }

// class previewContainner extends Component {
//   render() {
//     const { uploadedDocuments, ...rest } = this.props;
//     return (
//         <div className='container'>
    
//         <br></br>
        
//           <form className='form-group' onSubmit={handlePdfFileSubmit}>
//             <input type="file" className='form-control'
//               required onChange={handlePdfFileChange}
//             />
//             {pdfFileError&&<div className='error-msg'>{pdfFileError}</div>}
//             <br></br>
//             <button type="submit" className='btn btn-success btn-lg'>
//               UPLOAD
//             </button>
//           </form>
//           <br></br>
    
//           <h4>View PDF</h4>
//           <div className='pdfContainer'>
//             {/* show pdf conditionally (if we have one)  */}
//             {viewPdf&&<Worker workerUrl="https://unpkg.com/pdfjs-dist@2.5.207/build/pdf.worker.min.js">
//               <Viewer fileUrl={viewPdf}
//                 plugins={[defaultLayoutPluginInstance]} />
//           </Worker>}
    
//           {/* if we dont have pdf or viewPdf state is null */}
//           {/* {!viewPdf&&No pdf file selected} */}
//           </div>
//         </div>
//       )
//   }
// }

// const mapStateToProps = state => {
//   let documentsList = get(state, "screenConfiguration.preparedFinalObject.documentsContract", []);
//   const documents = get(state.screenConfiguration.preparedFinalObject, "applyScreen.documents", []);
//   const uploadedDocuments = get(state.screenConfiguration.preparedFinalObject, "displayDocs");
//   return { documentsList, uploadedDocuments, documents };
// };

// export default withStyles(styles)(
//   connect(
//     mapStateToProps,
//     null
//   )(previewContainner)
// );
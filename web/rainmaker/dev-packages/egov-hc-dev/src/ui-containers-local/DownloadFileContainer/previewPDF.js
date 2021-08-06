// import React, { Component } from 'react';
// // import { PDFViewer } from 'react-view-pdf';

// export default class PdfPreviewExample extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       photoIndex: 0,
//       isPreviewPDFOpen: false,
//     };
//   }

//   render() {
//     const { photoIndex, isPreviewPDFOpen } = this.state;

//     console.log("LightBox", this.props)

//     return (
//       <div>
//         <button type="button" onClick={() => this.setState({ isPreviewPDFOpen: true })}>
//           Open PDF Preview
//         </button>

//         <div>
//         {
//         isPreviewPDFOpen ?
//             <div>
//                 {/* //   <PDFViewer url={this.props.imageURL} /> */}
//             </div>
//         :
//         null
//         }
//         </div>

//       </div>
//     );
//   }
// }

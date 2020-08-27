export const getWFConfig = (module,businessService,taskId) => {
  console.log("module", module);
  switch (module.toUpperCase()) {
    case "TL-SERVICES":
      return {
        INITIATED: "/tradelicence/apply",
        DEFAULT: "/tradelicence/search-preview",
      };
    case "WS-SERVICES":
      return {
        INITIATED: "/wns/search-preview",
        DEFAULT: "/wns/search-preview",
      };
    case "SW-SERVICES":
      return {
        INITIATED: "/wns/search-preview",
        DEFAULT: "/wns/search-preview",
      };
    case "FIRENOC":
    } else if (businessService == "PETNOC") {
      return {
        INITIATED: "/fire-noc/apply",
        DEFAULT: "/fire-noc/search-preview",
      };
      case "BOOKING-SERVICES":
    }

  }
else if (businessService == "Engineering" || businessService == "IT" || businessService == "Caretaker" || businessService == "MOH") {
    if (taskId.includes('MRNIN')) {
      return {
        INITIATED: "/egov-store-asset/view-non-indent-issue-note",
        DEFAULT: "/egov-store-asset/view-non-indent-issue-note",
      };
    } else if (taskId.includes('MRNIW')) {
      return {
        INITIATED: "/egov-store-asset/view-indent-inword",
        DEFAULT: "/egov-store-asset/view-indent-inword",
      };
    }
    else if (taskId.includes('MRIN')) {
      return {
        INITIATED: "/egov-store-asset/view-indent-note",
        DEFAULT: "/egov-store-asset/view-indent-note",
      };
    } else if (taskId.includes('IND')) {
      return {
        INITIATED: "/egov-store-asset/view-indent",
        DEFAULT: "/egov-store-asset/view-indent",
      };

    } else if (taskId.includes('PO')) {
      return {
        INITIATED: "/egov-store-asset/view-purchase-order",
        DEFAULT: "/egov-store-asset/view-purchase-order",
      };

    } else if (taskId.includes('MMRN')) {
      return {
        INITIATED: "/egov-store-asset/view-material-receipt-note-misc",
        DEFAULT: "/egov-store-asset/view-material-receipt-note-misc",
      };

    } else if (taskId.includes('TRIN')) {
      return {
        INITIATED: "/egov-store-asset/view-indent-transfer",
        DEFAULT: "/egov-store-asset/view-indent-transfer",
      };

    }
    else if (taskId.includes('MRN')) {
      return {
        INITIATED: "/egov-store-asset/view-material-receipt-note",
        DEFAULT: "/egov-store-asset/view-material-receipt-note",
      };

    }
    else if (taskId.includes('MROW')) {
      return {
        INITIATED: "/egov-store-asset/view-indent-outword",
        DEFAULT: "/egov-store-asset/view-indent-outword",
      };

    }

  }
  else {
    switch (module.toUpperCase()) {
      case "TL-SERVICES":
        return {
          INITIATED: "/tradelicence/apply",
          DEFAULT: "/tradelicence/search-preview",
        };
     case "WS-SERVICES":
      return {
        INITIATED: "/wns/search-preview",
        DEFAULT: "/wns/search-preview",
      };
    case "SW-SERVICES":
      return {
        INITIATED: "/wns/search-preview",
        DEFAULT: "/wns/search-preview",
      };
      case "FIRENOC":
        return {
          // INITIATED: "/fire-noc/apply",
          DEFAULT: "/egov-services/application-details",
        };
	case "WATER-TANKER-SERVICES":
      return {
        DEFAULT: "/egov-services/bwt-application-details",
      };
    case "BPA-SERVICES":
      return {
        INITIATED: "/egov-bpa/search-preview",
        DEFAULT: "/egov-bpa/search-preview",
      };
    case "BPAREG":
      return {
        DEFAULT: "/bpastakeholder/search-preview",
      };
    case "PT-SERVICES":
      return {
        INITIATED: "/property-tax/application-preview",
        DEFAULT: "/property-tax/application-preview",
      };
    case "PT":
      if(businessService=="PT.CREATE"){
        
        case "HORTICULTURE":
          return {
            INITIATED: "/egov-hc/search-preview",
            DEFAULT: "/egov-hc/search-preview",
          };
      case "BPA-SERVICES":
        return {
          INITIATED: "/egov-bpa/search-preview",
          DEFAULT: "/egov-bpa/search-preview",
        };
      case "BPAREG":
        return {
          DEFAULT: "/bpastakeholder/search-preview",
        };
      case "PT-SERVICES":
        return {
          INITIATED: "/property-tax/application-preview",
          DEFAULT: "/property-tax/application-preview",
        }; 
      }else{
        return {
          INITIATED: "/pt-mutation/search-preview",
          DEFAULT: "/pt-mutation/search-preview",
        }; 
      }
      // new module rediraection for case "RRP_SERVICE ,DOE_SERVICE, DOP_SERVICE":
      case "RRP_SERVICE":
        return {
          INITIATED: "/pms/pmsmap",
          DEFAULT: "/pms/pmsmap",
        };
        case "DOE_SERVICE":
          return {
            INITIATED: "/pms/pmsmap",
            DEFAULT: "/pms/pmsmap",
          };
          case "DOP_SERVICE":
          return {
            INITIATED: "/pms/pmsmap",
            DEFAULT: "/pms/pmsmap",
          };
      
        }
  // new module rediraection for case "RRP_SERVICE ,DOE_SERVICE, DOP_SERVICE":
      case "RRP_SERVICE":
        return {
          INITIATED: "/pms/pmsmap",
          DEFAULT: "/pms/pmsmap",
        };
        case "DOE_SERVICE":
          return {
            INITIATED: "/pms/pmsmap",
            DEFAULT: "/pms/pmsmap",
          };
          case "DOP_SERVICE":
          return {
            INITIATED: "/pms/pmsmap",
            DEFAULT: "/pms/pmsmap",
          };

    }
};

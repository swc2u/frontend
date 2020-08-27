import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import "./index.css";

export const estimateSummary = getCommonGrayCard({
  estimateCard: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-echallan",
    componentPath: "EstimateCardContainer",
    props: {
      estimate: {
        header: { labelName: "Fine Estimate", labelKey: "NOC_SUMMARY_FINE_EST" },
        fees: [{ name: "ASD", value: 123 }],        
      }
    }
  }
});

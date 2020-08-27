import { getCommonGrayCard } from "egov-ui-framework/ui-config/screens/specs/utils";

const estimate = getCommonGrayCard({
  estimateCard: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-echallan",
    componentPath: "EstimateCardContainer",
    props: {
      estimate: {
        header: { labelName: "Fee Estimate", labelKey: "NOC_SUMMARY_FEE_EST" },
        fees: [{ name: "ASD", value: 123 }],
      }
    }
  }
});

export default estimate;

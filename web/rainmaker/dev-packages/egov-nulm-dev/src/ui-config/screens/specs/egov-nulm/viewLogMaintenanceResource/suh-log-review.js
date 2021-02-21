import { getCommonCard } from "egov-ui-framework/ui-config/screens/specs/utils";
import {getSUHLogDetailsView} from './view-log-details'
import { poCommonFooter } from "./footer";

export const SUHLogMaintenanceDetails = isReview => {
  const viewSUHLogDetails = getSUHLogDetailsView(isReview);
  const footer = isReview ? poCommonFooter() : {};
  return getCommonCard({
    viewSUHLogDetails,
    footer
  });
};

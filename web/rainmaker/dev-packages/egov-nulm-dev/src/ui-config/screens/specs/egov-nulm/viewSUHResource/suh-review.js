import { getCommonCard } from "egov-ui-framework/ui-config/screens/specs/utils";

import { getSuhDetailsView } from "./view-suh-details";
import {reviewDocuments} from "./reviewDocuments";
import {getFacilityDetailsView} from './failityAvailable';
import {getRecordMaintenanceDetailsView} from './recordMaintenance';
import {getStaffDetailsView} from './staffDetails';
import {getOtherDetailsView} from './otherDetails';
import { poCommonFooter } from "./footer";

export const SUHReviewDetails = isReview => {
  const viewSuhDetails = getSuhDetailsView(isReview);
  const viewFacilityDetails = getFacilityDetailsView(isReview);
  const viewRecordMaintenanceDetails = getRecordMaintenanceDetailsView(isReview);
  const viewStaffDetails = getStaffDetailsView(isReview);
  const viewOtherDetails = getOtherDetailsView(isReview);
  const viewDocuments = reviewDocuments(isReview);
  const footer = isReview ? poCommonFooter() : {};
  return getCommonCard({
    viewSuhDetails,
    viewFacilityDetails,
    viewRecordMaintenanceDetails,
    viewStaffDetails,
    viewOtherDetails,
    viewDocuments,
    footer
  });
};

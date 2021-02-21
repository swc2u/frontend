import { getCommonCard } from "egov-ui-framework/ui-config/screens/specs/utils";

import { getSUSVDetailsView } from "./view-susv-details";
import {getNomineeDetailsView} from './viewNominee';
import {reviewDocuments} from "./reviewDocuments";
import {getUnderTakingView} from './viewUnderTaking';
import { poCommonFooter } from "./footer";

export const SUSVReviewDetails = isReview => {
  const viewSUSVDetails = getSUSVDetailsView(isReview);
  const viewNomineeDetails  = getNomineeDetailsView(isReview);
  const viewDocuments = reviewDocuments(isReview);
  const viewUnderTaking = getUnderTakingView(isReview);
  const footer = isReview ? poCommonFooter() : {};
  return getCommonCard({
    viewSUSVDetails,
    viewNomineeDetails,
    viewDocuments,
    viewUnderTaking,
    footer
  });
};

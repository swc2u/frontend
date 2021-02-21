import { getCommonCard } from "egov-ui-framework/ui-config/screens/specs/utils";

import { getTransactionDetailsView } from "./view-transaction-details";
import {reviewDocuments} from "./reviewDocuments"
import { poCommonFooter } from "./footer";

export const SUSVTransactionReviewDetails = isReview => {
  const viewTransactionDetails = getTransactionDetailsView(isReview);
  const viewDocuments = reviewDocuments(isReview);
  const footer = isReview ? poCommonFooter() : {};
  return getCommonCard({
    viewTransactionDetails,
    viewDocuments,
    footer
  });
};

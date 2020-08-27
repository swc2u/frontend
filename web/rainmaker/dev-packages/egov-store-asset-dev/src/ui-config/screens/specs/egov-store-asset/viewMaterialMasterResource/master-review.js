import { getCommonCard } from "egov-ui-framework/ui-config/screens/specs/utils";

import { getMasterDetailsView } from "./view-master-details"
import { getStoreDetailsView } from "./view-store-details"
import { getOtherDetailsView } from "./view-other-details";
import { masterCommonFooter } from "./footer";

export const MasterReviewDetails = isReview => {
  const viewMaterialDetails = getMasterDetailsView(isReview);
   const viewStoreDetails = getStoreDetailsView(isReview); 
  const viewOtherDetails = getOtherDetailsView(isReview);
  const footer = isReview ? masterCommonFooter() : {};
  return getCommonCard({
    viewMaterialDetails, 
    viewStoreDetails,   
    viewOtherDetails,
    footer
  });
};

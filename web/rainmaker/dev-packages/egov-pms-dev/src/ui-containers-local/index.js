import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "egov-ui-framework/ui-atoms/LinearSpinner";

const Loading = () => <LinearProgress />;

const CustomTabContainer = Loadable({
  loader: () => import("./CustomTabContainer"),
  loading: () => <Loading />
});
const LabelContainer = Loadable({
  loader: () => import("./LabelContainer"),
  loading: () => <Loading />
});

const CheckboxContainer = Loadable({
  loader: () => import("./CheckboxContainer"),
  loading: () => <Loading />
});
const DownloadFileContainer = Loadable({
  loader: () => import("./DownloadFileContainer"),
  loading: () => <Loading />
});
const EstimateCardContainer = Loadable({
  loader: () => import("./EstimateCardContainer"),
  loading: () => <Loading />
});
const AutosuggestContainer = Loadable({
  loader: () => import("./AutosuggestContainer"),
  loading: () => <Loading />
});
const DocumentListContainer = Loadable({
  loader: () => import("./DocumentListContainer"),
  loading: () => <Loading />
});
const PaymentRedirectPage = Loadable({
  loader: () => import("./PaymentRedirectPage"),
  loading: () => <Loading />
});

const DialogContainer = Loadable({
  loader: () => import("./DialogContainer"),
  loading: () => <Loading />
});

const ViewBreakupContainer = Loadable({
  loader: () => import("./ViewbreakupDialogContainer"),
  loading: () => <Loading />
});
const TaskStatusContainer = Loadable({
  loader: () => import("./TaskStatusContainer"),
  loading: () => <Loading />
});

const WorkFlowContainer = Loadable({
  loader: () => import("./WorkFlowContainer"),
  loading: () => <Loading />
});

const EmployeeServiceContainer = Loadable({
  loader: () => import("./EmployeeServiceContainer"),
  loading: () => <Loading />
});
const CardContainer = Loadable({
  loader: () => import("./CardContainer"),
  loading: () => <Loading />
});
const DropdownButton = Loadable({
  loader: () => import("./DropdownButton"),
  loading: () => <Loading />
});
const PensionReviewContainer = Loadable({
  loader: () => import("./PensionReviewContainer"),
  loading: () => <Loading />
});
const GridContainer = Loadable({
  loader: () => import("./GridContainer"),
  loading: () => <Loading />
});
const PensionBasicContainer = Loadable({
  loader: () => import("./PensionBasicContainer"),
  loading: () => <Loading />
});

export {
  CustomTabContainer,
  LabelContainer,
  CheckboxContainer,
  DownloadFileContainer,
  EstimateCardContainer,
  AutosuggestContainer,
  DocumentListContainer,
  PaymentRedirectPage,
  ViewBreakupContainer,
  DialogContainer,
  TaskStatusContainer,
 WorkFlowContainer,
 EmployeeServiceContainer,
 CardContainer,
 DropdownButton,
 PensionReviewContainer,
 GridContainer,
 PensionBasicContainer

};

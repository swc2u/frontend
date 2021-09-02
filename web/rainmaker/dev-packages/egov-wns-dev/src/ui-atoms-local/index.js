import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "egov-ui-framework/ui-atoms/LinearSpinner";

const Loading = () => <LinearProgress />;
const TestAtoms = Loadable({
  loader: () => import("./TestAtoms"),
  loading: () => <Loading />
});

const ApplicationNoContainer = Loadable({
  loader: () => import("./ApplicationNo"),
  loading: () => <Loading />
});
const ApplicationHeaderContainer = Loadable({
  loader: () => import("./ApplicationHeader"),
  loading: () => <Loading />
});
const ApplicationHeaderApplyContainer = Loadable({
  loader: () => import("./ApplicationHeaderApply"),
  loading: () => <Loading />
});

const Checkbox = Loadable({
  loader: () => import("./Checkbox"),
  loading: () => <Loading />
});

const MapLocation = Loadable({
  loader: () => import("./MapLocation"),
  loading: () => <Loading />
});

const AutoSuggest = Loadable({
  loader: () => import("./AutoSuggest"),
  loading: () => <Loading />
});

const Asteric = Loadable({
  loader: () => import("./Asteric"),
  loading: () => <Loading />
});

const MenuButton = Loadable({
  loader: () => import("./MenuButton"),
  loading: () => <Loading />
});

const MyConnectionsIcon = Loadable({
  loader: () => import("./Icons/MyConnectionsIcon"),
  loading: () => <Loading />
});
const LinkConnectionsIcon = Loadable({
  loader: () => import("./Icons/LinkConnectionsIcon"),
  loading: () => <Loading />
});

const PayWnsBillIcon = Loadable({
  loader: () => import("./Icons/PayWnsBillIcon"),
  loading: () => <Loading />
});

const ConsumerNoContainer = Loadable({
  loader: () => import("./ConsumerNo"),
  loading: () => <Loading />
});

const BreadCrumbs = Loadable({
  loader: () => import("./BreadCrumbs"),
  loading: () => <Loading />
});

const AddLinkForProperty = Loadable({
  loader: () => import("./PropertyLink"),
  loading: () => <Loading />
});

export {
  TestAtoms,
  ApplicationNoContainer,
  ApplicationHeaderContainer,
  ApplicationHeaderApplyContainer,
  Checkbox,
  MapLocation,
  AutoSuggest,
  Asteric,
  MenuButton,
  MyConnectionsIcon,
  LinkConnectionsIcon,
  PayWnsBillIcon,
  ConsumerNoContainer,
  BreadCrumbs,
  AddLinkForProperty
};

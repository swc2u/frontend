import { refreshTokenRequest } from "egov-ui-kit/redux/auth/actions";
import { USER_SEARCH_SUCCESS } from "./actionTypes";
import { getAccessToken, getTenantId ,localStorageGet} from "egov-ui-kit/utils/localStorageUtils";
import { getNotificationCount, getNotifications,  } from "../app/actions";
import get from "lodash/get"
import { logout} from "./actions"

const roleFromUserInfo = (roles = [], role) => {
  const roleCodes = roles.map((role, index) => {
    return role.code;
  });
  return roleCodes && roleCodes.length && roleCodes.indexOf(role) > -1
    ? true
    : false;
};

const auth = (store) => (next) => (action) => {
  const { type } = action;
  const state = store.getState();
  const notifications = get(state.app, "notificationObj.notificationsById");
  const lastLoginTime = new Date().getTime();
  const lastlogintime = localStorageGet("last-login-time");
  const LoginDifferent = lastLoginTime-lastlogintime
  // console.log(lastLoginTime-lastlogintime)
  // const dateFromApi = new Date(lastLoginTime);
  // let month = dateFromApi.getMonth() + 1;
  // let day = dateFromApi.getDate();
  // let year = dateFromApi.getFullYear();
  // let Hour = dateFromApi.getHours();
  // let Minutes = dateFromApi.getMinutes();
  // let Seconds = dateFromApi.getSeconds();
  // month = (month > 9 ? "" : "0") + month;
  // day = (day > 9 ? "" : "0") + day;
  // const dateFromApi_c = new Date(parseIntlastlogintime);
  // let month_c = dateFromApi_c.getMonth() + 1;
  // let day_c = dateFromApi_c.getDate();
  // let year_c = dateFromApi_c.getFullYear();
  // let Hour_c = dateFromApi_c.getHours();
  // let Minutes_c = dateFromApi_c.getMinutes();
  // let Seconds_c = dateFromApi_c.getSeconds();
  // month_c = (month_c > 9 ? "" : "0") + month_c;
  // day_c = (day_c > 9 ? "" : "0") + day_c;
  // console.log(`${Seconds}/${Minutes}/${Hour}/${day}/${month}/${year}`)
  // console.log(`${Seconds_c}/${Minutes_c}/${Hour_c}/${day_c}/${month_c}/${year_c}`)
  // console.log('pritam')
  //if(LoginDifferent<=120000)
  if(true)
  {
  let isSuperUser = false;
  if(state && state.auth && state.auth.userInfo){
    const {roles} = state.auth.userInfo; 
    isSuperUser = roleFromUserInfo(roles , "SUPERUSER");
  }
  
  if (type === USER_SEARCH_SUCCESS && !isSuperUser) {
    if (process.env.REACT_APP_NAME === "Citizen" || process.env.REACT_APP_NAME === "Employee") {
      const permanentCity = action.user && action.user.permanentCity;
      const queryObject = [
        {
          key: "tenantId",
          value: permanentCity ? permanentCity : getTenantId(),
        },
      ];
      const requestBody = {
        RequestInfo: {
          apiId: "org.egov.pt",
          ver: "1.0",
          ts: 1502890899493,
          action: "asd",
          did: "4354648646",
          key: "xyz",
          msgId: "654654",
          requesterId: "61",
          authToken: getAccessToken(),
        },
      };
      if ((window.location.pathname === "/" || window.location.pathname === "/inbox" || window.location.pathname === "/citizen/" || window.location.pathname === "/employee/inbox")) {
        store.dispatch(getNotifications(queryObject, requestBody));
        store.dispatch(getNotificationCount(queryObject, requestBody));
      }
    }
  }

  if (/(_ERROR|_FAILURE)$/.test(type) && action.error === "INVALID_TOKEN") {
    store.dispatch(refreshTokenRequest());
  } else {
    next(action);
  }
}
else{
  //store.dispatch(logout());
  logout();
 // window.location.replace(`${window.basename}/user/login`);
}
};

export default auth;

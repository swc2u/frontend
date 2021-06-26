import { prepareFinalObject,handleScreenConfigurationFieldChange as handleField, } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { getMyConnectionResults, getSWMyConnectionResults } from '../../../../../ui-utils/commons';
import get from "lodash/get";
export const fetchData = async (action, state, dispatch) => {
  let queryObject = [{ key: "mobileNumber", value: JSON.parse(getUserInfo()).mobileNumber }]
  let responseWater = [], responseSewerage = [];
  try { responseWater = await getMyConnectionResults(queryObject, dispatch,action); } catch (error) { responseWater = []; console.log(error) }
  try { responseSewerage = await getSWMyConnectionResults(queryObject, dispatch,action); } catch (error) { responseSewerage = []; console.log(error) }
  try {
    let water = (responseWater && responseWater.WaterConnection)?responseWater.WaterConnection:[]
    const sewerage = (responseSewerage && responseSewerage.SewerageConnections)?responseSewerage.SewerageConnections:[]
    //let finalResponse = water
    if (water.length > 0) {
      for (let i = 0; i < water.length; i++) {
          // push if WaterConnection.waterapplicationList 
          let waterApplicationList = get(water[i],'waterApplicationList',[])
          waterApplicationList = waterApplicationList.filter(x=>x.applicationNo !== water[i].applicationNo)
          for (let j = 0; j < waterApplicationList.length; j++) {
            water.push(
                  {
                      service:water[i].service,
                      activityType:waterApplicationList[j].activityType,
                      applicationNo:waterApplicationList[j].applicationNo,
                      property:water[i].property,
                      applicationStatus:waterApplicationList[j].applicationStatus,
                      due:water[i].due,

                  }
              )
          }
          

      }
  }
    const finalArray = water.concat(sewerage);
    
    if (finalArray !== undefined && finalArray !== null) {
      const myConnectionsResult=finalArray.filter(item => item.connectionNo !== "NA" && item.connectionNo !== null);  
      dispatch(prepareFinalObject("myApplicationsCount", myConnectionsResult.length));
      dispatch(
        handleField(
            "home",
            "components.div.children.listCard1.props",
              "Count",
              finalArray.length?finalArray.length:0
        )
    );

     }
  }
  catch (error) { console.log(error); }
}

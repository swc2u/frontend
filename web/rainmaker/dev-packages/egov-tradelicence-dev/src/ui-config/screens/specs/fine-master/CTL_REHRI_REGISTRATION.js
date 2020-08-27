import { RC_PEDAL_RICKSHAW_LOADING_REHRI, REHRI_REGISTRATION } from "../../../../ui-constants";
import {getFineMasterList, dialogContainer} from './list'

const fineMasterList = {
    uiFramework: "material-ui",
    name: REHRI_REGISTRATION,
    beforeInitScreen: (action, state, dispatch) => {
        getFineMasterList(state, dispatch, RC_PEDAL_RICKSHAW_LOADING_REHRI, REHRI_REGISTRATION)
        return action;
    },
    components: {
        div: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          props: {
            className: "common-div-css"
          }
        },
        adhocDialog: dialogContainer(REHRI_REGISTRATION)
      }
}

export default fineMasterList
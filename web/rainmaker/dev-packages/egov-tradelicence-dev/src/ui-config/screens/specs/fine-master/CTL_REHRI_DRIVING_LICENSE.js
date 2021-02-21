import { DL_PEDAL_RICKSHAW_LOADING_REHRI, REHRI_DRIVING } from "../../../../ui-constants";
import {getFineMasterList, dialogContainer} from './list'

const fineMasterList = {
    uiFramework: "material-ui",
    name: REHRI_DRIVING,
    beforeInitScreen: (action, state, dispatch) => {
        getFineMasterList(state, dispatch, DL_PEDAL_RICKSHAW_LOADING_REHRI, REHRI_DRIVING)
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
        adhocDialog: dialogContainer(REHRI_DRIVING)
      }
}

export default fineMasterList
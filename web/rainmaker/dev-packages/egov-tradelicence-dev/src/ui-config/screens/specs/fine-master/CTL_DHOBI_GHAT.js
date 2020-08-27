import { LICENSE_DHOBI_GHAT, DHOBI_GHAT } from "../../../../ui-constants";
import {getFineMasterList, dialogContainer} from './list'

const fineMasterList = {
    uiFramework: "material-ui",
    name: DHOBI_GHAT,
    beforeInitScreen: (action, state, dispatch) => {
        getFineMasterList(state, dispatch, LICENSE_DHOBI_GHAT, DHOBI_GHAT)
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
        adhocDialog: dialogContainer(DHOBI_GHAT)
      }
}

export default fineMasterList
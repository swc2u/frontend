import { RENEWAL_RENT_DEED_SHOP, OLD_BOOK_MARKET } from "../../../../ui-constants";
import {getFineMasterList, dialogContainer} from './list'

const fineMasterList = {
    uiFramework: "material-ui",
    name: OLD_BOOK_MARKET,
    beforeInitScreen: (action, state, dispatch) => {
        getFineMasterList(state, dispatch, RENEWAL_RENT_DEED_SHOP, OLD_BOOK_MARKET)
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
        adhocDialog: dialogContainer(OLD_BOOK_MARKET)
      }
}

export default fineMasterList
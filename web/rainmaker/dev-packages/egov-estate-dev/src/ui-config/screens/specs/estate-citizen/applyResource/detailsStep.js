import { getCommonCard, getCommonHeader, getCommonContainer, getPattern, getTextField, getSelectField, getDateField, getCommonGrayCard,getTimeField } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getLocaleLabels, getTodaysDateInYMD } from "egov-ui-framework/ui-utils/commons";
import {viewFour} from './review'
import {getOptions} from '../dataSources'
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { convertDateToEpoch,getYesterdaysDateInYMD } from "../../utils";
import { setFieldProperty } from './afterFieldChange'
import { get, set } from "lodash";
import {handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import commonConfig from "config/common.js";
const _getPattern = (type) => {
  switch(type) {
    case "Percentage": 
        return /^[1-9][0-9]?$|^100$/i
    case "MobileNo": 
        return /^[6789][0-9]{9}$/i;
    case "Amount":
        return /^[0-9]{0,9}$/i;
    case "numeric-only":
        return /^[0-9]*$/i;
    case "address":
        return /^([\s\S]){1,150}$/i;
        case "alphabet":  
      return /^[a-zA-Z ]{1,150}$/i;
      case "alphaNumeric":
          return /^[a-zA-Z0-9]{1,100}$/i;
          case "violationdetails":
              return /^([\s\S]){5,150}$/i;
              case "area":
                  return /^[1-9][0-9]{1,5}$/i;
                  case "file-number-no-firstdigit-zero":
                    return /^[1-9a-zA-Z][0-9a-zA-Z]{0,49}$/i;
                    case "areaSqFeet":
                  return /^([1-9][0-9]{1,14})(\.\d{1,2})?$/i;
                  case "houseno":
                    return /^((\w+)\-(\d+))$/;
  }
}
let village=[
  {
    name: "Burail",
    code: "VILLAGE.BURAIL",
    house:"BUR-"
  },
  {
    name: "Manimajra ",
    code: "VILLAGE.MANIMAJRA",
    house:"MAN-"
  },
  {
    name: "Attawa",
    code: "VILLAGE.ATTAVA",
    house:"ATT-"
  },
  {
    name: "Buterla ",
    code: "VILLAGE.BURTELA",
    house:"BUT-"
  },
  {
    name: "Badheri",
    code: "VILLAGE.BADHERI",
    house:"BAD-"
  },
  {
    name: "Maloya ",
    code: "VILLAGE.MALOYA",
    house:"MAL-"
  },
  {
    name: "Kajheri",
    code: "VILLAGE.KAJHERI",
    house:"KAJ-"
  },
  {
    name: "Hallomajra",
    code: "VILLAGE.HALLOMAJRA",
    house:"HAL-"
  },
  {
    name: "Dadumajra",
    code: "VILLAGE.DADUMAJRA",
    house:"DAD-"
  },
  {
    name: "Palsora",
    code: "VILLAGE.PALSORA",
    house:"PAL-"
  },
  {
    name: "Raipur Kalan ",
    code: "VILLAGE.RAIPUR_KALAN",
    house:"RKA-"
  },
  {
    name: "Makhan Majra",
    code: "VILLAGE.MAKHAN_MAJRA",
    house:"MAM-"
  },
  {
    name: "Maulijagaran",
    code: "VILLAGE.MAULIJAGARAN",
    house:"MAU-"
  },
  {
    name: "Daria",
    code: "VILLAGE.DARIA",
    house:"DAR-"
  },
  {
    name: "Kishangarh",
    code: "VILLAGE.KISHANGARH",
    house:"KIS-"
  },
  {
    name: "Srangpur",
    code: "VILLAGE.SRANGPUR",
    house:"SAR-"
  },
  {
    name: "Kaimbala",
    code: "VILLAGE.KAIMBALA",
    house:"KAI-"
  },
  {
    name: "Khudda Lahora",
    code: "VILLAGE.KHUDDA_LAHORA",
    house:"KHL-"
  },
  {
    name: "Khudda Jassu",
    code: "VILLAGE.KHUDDA_JASSU",
    house:"KHJ-"
  },
  {
    name: "Khudda Alisher",
    code: "VILLAGE.KHUDDA_ALISHER",
    house:"KHA-"
  },
  {
    name: "Dhanas",
    code: "VILLAGE.DHANNAS",
    house:"DHA-"
  },
  {
    name: "Behlana",
    code: "VILLAGE.BEHLANA",
    house:"BEH-"
  },
  {
    name: "Raipur Khurd",
    code: "VILLAGE.RAIPUR_KHURD",
    house:"RKH-"
  }
]
let residentialcategory=[
  
    {
        label: "SUBCAT.HOUSE",
        code: "SUBCAT.HOUSE"
    },
    {
        label: "SUBCAT.DWELLINGS",
        code: "SUBCAT.DWELLINGS"
    },
    {
        label: "SUBCAT.FLAT",
        code: "SUBCAT.FLAT"
    }
]
let commercialcategory=[
  
  {
      label: "SCF",
      code: "SUBCAT.SCF"
  },
  {
      label: "SCO",
      code: "SUBCAT.SCO"
  },
  {
      label: "Booth",
      code: "SUBCAT.BOOTH"
  },
  {
    label: "Shop",
    code: "SUBCAT.SHOP"
}
]
let residentialcategorycumcommercialcategory= [
  {
    label: "House cum Shop",
    code: "SUBCAT.HOUSECUMSHOP"
  }
]
let _conf = {};
let pendingFieldChanges = [];
const onFieldChange = (action, state, dispatch) => {
  updateReadOnlyForAllFields(action, state, dispatch);
}

const evaluate = ({application, property, owners, selectedOwner, selectedPurchaser, purchasers, applicationDetails, formula, defaultValue}) => {
  try {
    return eval(formula);
  } catch (e) {
    return defaultValue;
  }
}

export const updateReadOnlyForAllFields = (action, state, dispatch) => {
  let category= get(
    state.screenConfiguration.preparedFinalObject,
    "Applications[0].applicationDetails.property.category"
)
let branch= get(
  state.screenConfiguration.preparedFinalObject,
  "Applications[0].branchType"
)
let localisedvalue = residentialcategory.map(datum => ({...datum, label: getLocaleLabels(datum.label, datum.label)}))
let localisedCommercialvalue = commercialcategory.map(datum => ({...datum, label: getLocaleLabels(datum.label, datum.label)}))
let localisedBothvalue = residentialcategorycumcommercialcategory.map(datum => ({...datum, label: getLocaleLabels(datum.label, datum.label)}))
if(branch==="BuildingBranch"){
  if (category == "CAT.RESIDENTIAL") {
    dispatch(
        handleField(
            "_apply",
            "components.div.children.formwizardFirstStep.children.ES_PROPERTY_DETAILS_HEADER_NOC.children.cardContent.children.details_container.children.ES_SUB_CATEGORY_LABEL",
            "visible",
            true
        )
    );

    dispatch(
        handleField(
            "_apply",
            "components.div.children.formwizardFirstStep.children.ES_PROPERTY_DETAILS_HEADER_NOC.children.cardContent.children.details_container.children.ES_SUB_CATEGORY_LABEL",
            "props.data",
            localisedvalue
        )
    )
}
else if (category == "CAT.COMMERCIAL") {
  dispatch(
      handleField(
          "_apply",
          "components.div.children.formwizardFirstStep.children.ES_PROPERTY_DETAILS_HEADER_NOC.children.cardContent.children.details_container.children.ES_SUB_CATEGORY_LABEL",
          "visible",
          true
      )
  );

  dispatch(
      handleField(
          "_apply",
          "components.div.children.formwizardFirstStep.children.ES_PROPERTY_DETAILS_HEADER_NOC.children.cardContent.children.details_container.children.ES_SUB_CATEGORY_LABEL",
          "props.data",
          localisedCommercialvalue
      )
  )
}
else if (category == "CAT.RESIDENTIALCUMCOMMERCIAL") {
  dispatch(
      handleField(
          "_apply",
          "components.div.children.formwizardFirstStep.children.ES_PROPERTY_DETAILS_HEADER_NOC.children.cardContent.children.details_container.children.ES_SUB_CATEGORY_LABEL",
          "visible",
          true
      )
  );

  dispatch(
      handleField(
          "_apply",
          "components.div.children.formwizardFirstStep.children.ES_PROPERTY_DETAILS_HEADER_NOC.children.cardContent.children.details_container.children.ES_SUB_CATEGORY_LABEL",
          "props.data",
          localisedBothvalue
      )
  )
}
else {
  dispatch(
    handleField(
        "_apply",
        "components.div.children.formwizardFirstStep.children.ES_PROPERTY_DETAILS_HEADER_NOC.children.cardContent.children.details_container.children.ES_SUB_CATEGORY_LABEL",
        "visible",
        false
    )
);
}
}
  // Update readonly
  // For each field. get the field config, get componentJsonPath, 
  // dispatch new Value

  /**
   * Parameters for evaluating conditions.
   */
  const property = get(state, "screenConfiguration.preparedFinalObject.property")
  const application = get(state, "screenConfiguration.preparedFinalObject.Applications[0]") || {};
  const owners = get(state, "screenConfiguration.preparedFinalObject.property.propertyDetails.owners") || [];
  const applicationDetails = get(application, "applicationDetails")

  const selectedOwner = !!applicationDetails && (!!applicationDetails.transferor || !!applicationDetails.owner) ? owners.find(item => !!applicationDetails.transferor ? item.id === applicationDetails.transferor.id : item.id === applicationDetails.owner.id) : {}
  let purchasers = !!applicationDetails && !!applicationDetails.transferor ? owners.filter(item => item.id !== applicationDetails.transferor.id) : owners;
  const selectedPurchaser = !!applicationDetails && !!applicationDetails.transferee ? purchasers.find(item => item.id === applicationDetails.transferee.id) : {}
  purchasers = purchasers.map(item => ({
    code: item.id,
    label: item.ownerDetails.ownerName
  }))


  /**
   * Extracts fields from config.
   */
  const objectValues = Object.values(_conf);
  const fields = objectValues.reduce((prev, curr) => {
    let fieldItems = {}
    if(!!curr.children && curr.componentPath !== "Div") {
      fieldItems =  !!curr.children.cardContent.children.details_container.children.multiContainer ? curr.children.cardContent.children.details_container.children.multiContainer.children.multiInfo.props.scheama.children.cardContent.children.multiCard.children : curr.children.cardContent.children.details_container.children;
    }
    prev = [...prev, ...Object.values(fieldItems)]
    return prev
  }, []).filter(item => item.componentPath !== "Div")

  /**
   * Get the fields whose value just changed.
   */
  const findField = fields.find(item => item.componentJsonpath === action.componentJsonpath && !!item.errorMessage)

  let actionDefiniton = fields.reduce((prev, curr) => {
    const propValues = [
      {value: "visibility", property: "visible", defaultValue: curr.visible}, 
      {value: "disability", property: "props.disabled", defaultValue: curr.props.disabled}, 
      {value: "prefillValue", property: "props.value", defaultValue: ""}, 
      {value: "dataValue", property: "props.data"},
      {value: "errorMessage", property: "props.errorMessage"}
    ];

    const actions = propValues.reduce((prevValue, currValue) => {
      let evalParams = {application, property, owners, selectedOwner, selectedPurchaser, purchasers, applicationDetails, formula: curr[currValue.value]} //evaluate params

      evalParams = currValue.hasOwnProperty("defaultValue") ? {...evalParams, defaultValue: currValue.defaultValue} : evalParams //passing defaultvalue param if needed

      let actionItem = []; 

      if(!!curr.hasOwnProperty(currValue.value)) { //if propValue exists return array of actions
        if(currValue.value === "prefillValue" && action.componentJsonpath !== curr.componentJsonpath) {
          /*
           * removing error message if the field is not changed by the user
           */
          actionItem = [{path: curr.componentJsonpath, property: currValue.property, value: evaluate(evalParams)}, {path: curr.componentJsonpath, property: "props.error", value: !!curr.props.error && !!curr.props.disabled?false:!!curr.props.error?curr.props.error:false}]
        } 
        else if(currValue.value === "disability" && curr.componentPath === "RadioGroupContainer") {
          /*
           * If the field is radio button and property is disability
           */
          actionItem = [{path: curr.componentJsonpath, property: "props.buttons[0].disabled", value: evaluate(evalParams)}, {path: curr.componentJsonpath, property: "props.buttons[1].disabled", value: evaluate(evalParams)}]
        } 
        else {
          actionItem = [{path: curr.componentJsonpath, property: currValue.property, value: evaluate(evalParams)}]
        }
      }
      return [...prevValue, ...actionItem]
    }, [])
    return [...prev, ...actions]
  }, [])

  /*
  adding error message to the changed field
  */ 

  actionDefiniton = !!findField ? [...actionDefiniton, {path: findField.componentJsonpath, property: "props.errorMessage", value: eval(findField.errorMessage)}] : actionDefiniton 

  /* 
  search in pendingFieldChanges if action item already exists (find index)
  */

  const isAlreadyExists = pendingFieldChanges.findIndex(item => item.path === action.componentJsonpath && item.property === action.property && item.value === action.value) 

  if(isAlreadyExists !== -1) { 
    /*
     * if already exist remove from pending field changes
     */
    pendingFieldChanges = [...pendingFieldChanges.slice(0, isAlreadyExists), ...pendingFieldChanges.slice(isAlreadyExists + 1)]
  } else {
    /*
     * not exist set field property
     */
    pendingFieldChanges = [...pendingFieldChanges, ...actionDefiniton]
    setFieldProperty({dispatch, actionDefiniton})
  }
  dispatch(
    handleField(
      "_apply",
      "components.div.children.formwizardFirstStep.children.ES_PURCHASER_DETAILS_HEADER.children.cardContent.children.details_container.children.ES_DOB_LABEL",
      "props.inputProps.max",
      getYesterdaysDateInYMD()
    )
  )
  dispatch(
    handleField(
      "_apply",
      "components.div.children.formwizardFirstStep.children.ES_LEGAL_BENEFICIARY_DETAILS.children.cardContent.children.details_container.children.ES_DOB_LABEL",
      "props.inputProps.max",
      getYesterdaysDateInYMD()
    )
  )
  dispatch(
    handleField(
      "_apply",
      "components.div.children.formwizardFirstStep.children.ES_LEGAL_HEIR_DETAILS_HEADER.children.cardContent.children.details_container.children.ES_LEGAL_HEIR_DOB_LABEL",
      "props.inputProps.max",
      getYesterdaysDateInYMD()
    )
  )
  dispatch(
    handleField(
      "_apply",
      "components.div.children.formwizardFirstStep.children.ES_TRANSFEREE_DETAILS_HEADER.children.cardContent.children.details_container.children.ES_DOB_LABEL",
      "props.inputProps.max",
      getYesterdaysDateInYMD()
    )
  )
}

const headerObj = value => {
    return getCommonHeader({
        labelName: value,
        labelKey: value
    })
}

export const getRelationshipRadioButton = {
    uiFramework: "custom-containers",
    componentPath: "RadioGroupContainer",
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 6
    },
    type: "array"
  };

  const arrayReduce = async function(arr, cb, initial) {
    var result = initial;
      for(var i = 0; i < arr.length; i++) {
        result = await cb(result, arr[i]);
      }
      return result
  }

const getField = async (item, fieldData = {}, state) => {
    let {label: labelItem, placeholder, type, pattern, disabled = false, ...rest } = item;
    const {required = false, validations = []} = fieldData
    const minMaxValidation = validations.find(item => item.type === "length")
    const minMaxValue = validations.find(item => item.type === "minmax")
    let fieldProps = {
      label : {
        labelName: labelItem,
        labelKey: labelItem
      },
       placeholder : {
        labelName: placeholder,
        labelKey: placeholder
      },
       gridDefination : {
        xs: 12,
        sm: 6
      },
      props: { disabled },
      required
    }
  
    fieldProps = !!pattern ? {...fieldProps, pattern: _getPattern(pattern)} : fieldProps
    if(!!required) {
      fieldProps = !!minMaxValidation ? {...fieldProps, minLength: minMaxValidation.params.min, maxLength: minMaxValidation.params.max} : fieldProps
      fieldProps = !!minMaxValue ? {...fieldProps, minValue: minMaxValue.params.min, maxValue: minMaxValue.params.max} : fieldProps
    }

    rest = {...rest, afterFieldChange : onFieldChange }
    switch(type) {
      case "TEXT_FIELD": {
        return getTextField({
          ...fieldProps,
          ...rest
      })
      }
      case "TIME_FIELD": {
        return getTimeField({
          ...fieldProps,
          ...rest
      })
      }
      case "DROP_DOWN": {
        let values = !!item.dataSource ? await getOptions(item.dataSource) : []
        values = values.map(datum => ({...datum, label: getLocaleLabels(datum.label, datum.label)}))
        return {...getSelectField({
          ...fieldProps,
          ...rest,
          data:values,
          optionValue: "code",
          optionLabel: "label",
        }), beforeFieldChange: (action, state, dispatch) => {
          const field = action.componentJsonpath.split(".").pop()
          switch(field){
            case "ES_VILLAGE_LABEL":{
              console.log(village)
              const findItem = village.find(item => item.code === action.value)
              let currentvillage=get(state.screenConfiguration.preparedFinalObject,"Applications[0].applicationDetails.property.propertyDetails.village")?
              get(state.screenConfiguration.preparedFinalObject,"Applications[0].applicationDetails.property.propertyDetails.village"):""
              if(action.value !== currentvillage){
                dispatch(
                        handleField(
                         "_apply",
                         "components.div.children.formwizardFirstStep.children.ES_PROPERTY_DETAILS_HEADER_NOC.children.cardContent.children.details_container.children.ES_HOUSE_NO_LABEL",
                          "props.value",
                          findItem.house
                        )
                      )
            }
              break;
            }
          }
          // dispatch(prepareFinalObject(
          //   rest.jsonPath, convertDateToEpoch(action.value)
          // ))
          // onFieldChange(action, state, dispatch)
        }}
      }
      case "AUTO_SUGGEST": {
        let values = !!item.dataSource ? await getOptions(item.dataSource) : []
        values = values.map(datum => ({...datum, label: getLocaleLabels(datum.label, datum.label)}))
        console.log(values)
        // return getSelectField({
        //   ...fieldProps,
        //   ...rest,
        //   data:values,
        //   optionValue: "code",
        //   optionLabel: "label",
        // })
        return {
          moduleName: "egov-estate",
          uiFramework: "custom-containers-local",
          componentPath: "AutosuggestContainer",
          gridDefination: {
            xs: 12,
            sm: 12,
            md: 6
          },
          props: {
            label: {
              labelName: labelItem,
              labelKey: labelItem
            },
            placeholder: {
              labelName: placeholder,
              labelKey: placeholder
            },
            data:values,
            jsonPath: rest.jsonPath,
            required:rest.required,
            labelsFromLocalisation: true,
        inputLabelProps: {
          shrink: true
        },
          },
          ...rest
        }
      }
      case "DATE_FIELD": {
        const {minDate, maxDate = true} = item
        const inputProps = !!minDate && !maxDate ? {
          min: getTodaysDateInYMD()
      } : {
        max: getTodaysDateInYMD()
      }
        return {...getDateField({
          ...fieldProps,
          ...rest,
          props: {...fieldProps.props, inputProps
        },
          // pattern: getPattern("Date")
        }),
        afterFieldChange: (action, state, dispatch) => {
          dispatch(prepareFinalObject(
            rest.jsonPath, convertDateToEpoch(action.value)
          ))
          onFieldChange(action, state, dispatch)
        }
      }
      }
      case "TEXT_AREA": {
        return getTextField({
          ...fieldProps,
          ...rest,
          props:{
            ...fieldProps.props,
            multiline: true,
            rows: "2"
          }
        })
      }
      case "RADIO_BUTTON": {
          const findItem = validations.find(validation => validation.type === "enum")
          const isLocalizationFlag = findItem.isLocalization;
          let buttons;
          
          if(isLocalizationFlag === false){
            buttons = !!findItem && !!findItem.params && !!findItem.params.values ? findItem.params.values.map(value => 
              ({
                  labelName: `ES_${value}_YES_NO`,
                  labelKey: `ES_${value}_YES_NO`,
                  value
              })
              ) : []
          }
          else{
            buttons = !!findItem && !!findItem.params && !!findItem.params.values ? findItem.params.values.map(value => 
              ({
                  labelName: `ES_${value}`,
                  labelKey: `ES_${value}`,
                  value
              })
              ) : []
          }  
          return {
              ...getRelationshipRadioButton,
              jsonPath: rest.jsonPath,
              required:rest.required,
              props: {
                  label: {
                      name: labelItem,
                      key: labelItem
                  },
                  buttons,
                  jsonPath: rest.jsonPath,
                  required:rest.required
              },
              ...rest
          }
      }
      case "MULTI_SELECT": {
        const options = !!item.dataSource ? await getOptions(item.dataSource) : []
        return {
          moduleName: "egov-estate",
          uiFramework: "custom-containers-local",
          componentPath: "MultiSelectContainer",
          gridDefination: {
            xs: 12,
            sm: 12,
            md: 6
          },
          props: {
            label: {
              name: labelItem,
              key: labelItem
            },
            placeholder: {
              name: placeholder,
              key: placeholder
            },
            options,
            jsonPath: rest.jsonPath,
            required,
          },
          ...rest
        }
      }
      default: return getTextField({
        ...fieldProps,
        ...rest
    })
    }
  }

const commonMultiCard = async (section, data_config, state) => {
  const multiCard = await getDetailsContainer(section, data_config, state)
  return getCommonGrayCard({multiCard})
}

const getSubDetailsContainer = async (section, data_config, state) => {
  const {buttonLabel, sourceJsonPath} = section
  const scheama = await commonMultiCard(section, data_config, state)
  const detailsContainer = getCommonContainer({
    multiContainer: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: {
          width: "100%"
        }
      },
      children: {
        multiInfo: {
          uiFramework: "custom-containers-local",
          moduleName: "egov-estate",
          componentPath: "MultiItem",
          props: {
            scheama,
            items: [],
            addItemLabel: {
              labelName: buttonLabel,
              labelKey: buttonLabel
            },
            sourceJsonPath,
            prefixSourceJsonPath: "children.cardContent.children.multiCard.children",
            afterPrefixJsonPath: "children.value.children.key",
          },
          type: "array"
        }
      }
    }
  })
  return detailsContainer;
}

const getDetailsContainer = async (section, data_config, state) => {
    const {fields = []} = section;
    const values = await arrayReduce(fields, async (acc, field) => {
      const findFieldData = data_config.find(item => item.path === field.path)
      const fieldConfig = await getField(field, findFieldData, state)
      return {...acc, [field.label]: fieldConfig}
    }, {})
    return getCommonContainer(values);
}

const expansionSection = (section) => {
  const {fields =[], path, valueJsonPath, sourceJsonPath, header} = section;
  return {
    uiFramework: "custom-containers-local",
    moduleName: "egov-estate",
    componentPath: "ExpansionPanelContainer",
    props: {
      sourceJsonPath,
      jsonPath: path,
      valueJsonPath,
      contents: fields,
      header
    }
  }
}

const tableSection = (section, state) => {
  const {fields =[], sourceJsonPath, header} = section;
  let data = get(state.screenConfiguration.preparedFinalObject, sourceJsonPath) || [];
  data = data.map(datum => {
    return fields.reduce((prevField, currField) => {
      return {...prevField, [getLocaleLabels(currField.label, currField.label)]: get(datum, currField.jsonPath)}
    }, {})
  })
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    children: {
    middleDiv: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: { height: 20 }
    }
    }, 
    table: {
    uiFramework: "custom-containers-local",
    componentPath: "Table",
    moduleName: "egov-estate",
    visible: !!data.length,
    props: {
      columns: fields.map(item => getLocaleLabels(item.label, item.label)),
      options: {
          filter: false,
          download: false,
          responsive: "stacked",
          selectableRows: false,
          hover: true,
          pagination:false,
          print:false,
          search:false,
          viewColumns: false,
        onRowClick: (row, index) => {
        },
        },
        customSortColumn: {
        },
        title: getLocaleLabels(header, header),
        hideHorizontalScroll: true,
        data
    }
  }
  }
  }
}

export const setFirstStep = async (state, dispatch, {data_config, format_config}) => {
    const {sections = []} = format_config
    const propertyData = get(state.screenConfiguration.preparedFinalObject, "property");
    const owners = get(state, "screenConfiguration.preparedFinalObject.property.propertyDetails.owners") || [];
    const uiConfig = await arrayReduce(sections, async (acc, section) => {
        const section_header = section.type === "TABLE" ? tableSection(section, state) : section.type === "EXPANSION_DETAIL" ? expansionSection(section) : getCommonCard({
          header: headerObj(section.header),
          details_container: section.type === "CARD_DETAIL" ? viewFour(section) : section.subType === "ARRAY" ? await getSubDetailsContainer(section, data_config, state) : await getDetailsContainer(section, data_config, state),
        })
        return {
        ...acc, 
        [section.header]: {
          ...section_header,
          visible: section.visibility ? eval(section.visibility) : true
        }
    }
    }, {})

    _conf = uiConfig;
    return uiConfig;
}
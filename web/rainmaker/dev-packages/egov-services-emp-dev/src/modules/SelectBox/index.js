import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import { withStyles } from "@material-ui/core/styles";


const styles = {
    root: {
      color: "#FE7A51",
      "&$checked": {
        color: "#FE7A51"
      }
    }
}

// const useStyles = makeStyles((theme) => ({
//     button: {
//         display: 'block',
//         marginTop: theme.spacing(2),
//     },
//     formControl: {
//         margin: theme.spacing(1),
//         minWidth: 120,
//     },
// }));

// export default function ControlledOpenSelect(props) {
    class ControlledOpenSelect extends React.Component {
      state = {
        open:false,
        setOpen:false
      };
     
    

     handleChange = (event) => {
        // setAge(event.target.value);
        // props.setSelectValue(event.target.value);
    };

     handleClose = () => {
      this.setState({setOpen:false})
    };

     handleOpen = () => {
      this.setState({setOpen:true})
    };

    
     getSelectBoxOptions = () =>{
      const {selectBoxOptions} = this.props;
      
        let options = [];
        for(let i = 0; i<selectBoxOptions.length; i++){
            options.push(<MenuItem value={selectBoxOptions[i]}>{selectBoxOptions[i]}</MenuItem>);
        }
        

        return options;
    }
    render() {
      const {selectBoxOptions} = this.props;

    return (
        <div>
         
            <FormControl style={{width: '100%'}}>
                <InputLabel style={{width: '100%'}} id="demo-controlled-open-select-label">Car</InputLabel>
                <Select
                    labelId="demo-controlled-open-select-label"
                    id="demo-controlled-open-select"
                    open={this.state.open}
                    onClose={this.handleClose}
                    onOpen={this.handleOpen}
                    // value={age}
                    // onChange={handleChange}
                >
                      {/* {selectBoxOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))} */}
                      <MenuItem value= "" disabled>Bokking Type</MenuItem>
                      <MenuItem value='OSBM'>Open Space To Store Building Material</MenuItem>
                      <MenuItem value='WATER_TANKERS'>Water Tankers</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
    }
}
export default withStyles(styles)(ControlledOpenSelect);

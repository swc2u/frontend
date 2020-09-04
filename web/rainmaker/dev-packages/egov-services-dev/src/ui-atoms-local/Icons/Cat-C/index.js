import React from "react";
import CatC from './cat-c.jpeg';
import "../index.css";

class CatCIcon extends React.Component {
    render() {
        return <img src={CatC} alt="Cat-A" width={160}/>
	}
}

export default CatCIcon;
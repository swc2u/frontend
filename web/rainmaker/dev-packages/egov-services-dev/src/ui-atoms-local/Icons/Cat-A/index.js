import React from "react";
import CatA from './cat-a.jpeg';
import "../index.css";

class CatAIcon extends React.Component {
    render() {
        return <img src={CatA} alt="Cat-A" width={160}/>
	}
}

export default CatAIcon;

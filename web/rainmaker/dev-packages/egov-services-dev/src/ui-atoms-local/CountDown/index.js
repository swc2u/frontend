import React, { Component } from 'react'
import './index.css'
export default class index extends Component {
    
   
    componentDidMount() {
        this.countdown( 10, 0 );
    }
    state={
        displayTime:""  
    }
    
    countdown=(  minutes, seconds )=>
    {
    var element, endTime, hours, mins, msLeft, time;

     let twoDigits=( n )=>
    {
        return (n <= 9 ? "0" + n : n);
    }

    let updateTimer=()=>
    {
        msLeft = endTime - (+new Date);
        if ( msLeft < 1000 ) {
            this.setState({
                displayTime : "Time is up!"
            }) ;
        } else {
            time = new Date( msLeft );
            hours = time.getUTCHours();
            mins = time.getUTCMinutes();
            this.setState({
                displayTime : (hours ? hours + ':' + twoDigits( mins ) : mins) + ':' + twoDigits( time.getUTCSeconds() )
            }) ;
            setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );
        }
    }
    endTime = (+new Date) + 1000 * (60*minutes + seconds) + 500;
    updateTimer();
    }

    

    render() {
        return (
            <div id="countdown">
            <div id="countdown-number">{this.state.displayTime}</div>
            <svg>
                <circle r="18" cx="20" cy="20"></circle>
            </svg>
            </div>
            // <div className ="timeContainer">
            //   <div className="displayTime">{this.state.displayTime}</div>
            // </div>
        )
    }
}



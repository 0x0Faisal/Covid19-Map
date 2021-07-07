import React from "react";

import Map from "./Map.jsx";
import LoadData from "./LoadData.js";

class Covid19 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            loading: true,
        }
    }

    handleData = (data) => {
        this.setState({
            data: data,
        });
    }
    removeLoader = () => {
        var l = document.getElementById("covid-loader");
        (l ?
            l.parentNode.removeChild(l)
            :
            console.log("Not found")
        )
    }

    componentDidMount() {
        const loader = new LoadData();
        loader.load(this.handleData)
        .then(() => console.log("Done mount"));
    }

    render() {
        if(!this.state.data) {
            return null;
        }
        else {
            this.removeLoader();
        }
       return (
             <div className="main-theme">
                <div className="main-header">
                    Covid19
                </div>
                <Map data={this.state.data} />
            </div>
        );
    }
}

export default Covid19;

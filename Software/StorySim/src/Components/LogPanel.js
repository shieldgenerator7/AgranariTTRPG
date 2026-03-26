"use strict";

import Log from "../Data/Log";
import LogEntryFrame from "./LogEntryFrame";
import React from "react";

class LogPanel extends React.Component {
    constructor(props) {
        super(props);
        this.panel = React.createRef();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let div = this.panel.current;
        div.scrollTop = div.scrollHeight;
    }

    render() {
        
        return (
            <div className="logPanel"
                ref={this.panel}
            >
                {
                    this.props.logList.map((entry, i) => (
                        <LogEntryFrame
                            entry={entry}
                            key={`log_entry_${i}`}
                        ></LogEntryFrame>
                    ))
                }
            </div>
        );
    }
}
export default LogPanel;

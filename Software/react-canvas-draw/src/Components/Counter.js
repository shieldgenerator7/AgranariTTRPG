"use strict";

import React from 'react';
import { clamp, isNumber } from "../Utility/Utility";

function Counter({ value, setValue, allowNegative = false, inline = false, max = 99, increment = 1, label = "" , showEditField = false}) {
    //input checking
    if (!(increment > 0)) {
        console.error("Invalid increment value!", increment, "(resetting to default increment)");
        increment = 1;//set to default so it can still function
    }
    //
    function valueAcceptable(v) {
        //
        if (isNumber(v)) { return true; }
        if (isNaN(v)) { return false; }
        //
        const regex = /[0-9]*/;
        return [...v].map(c => {
            return regex.test(c);
        }).every(c => c);
    }
    //
    const set = (v) => {
        let newValue = v ?? 0;
        if (!allowNegative) {
            newValue = Math.max(0, newValue);
        }
        if (max) {
            newValue = clamp(newValue, -max, max);
        }
        setValue(newValue);
    };
    //
    return (
        <div className={`counter ${(inline) ? "inline" : ""}`}>
            {showEditField &&
                <input type="text" inputMode="numeric" className={"editNumber"} onChange={(e) => {
                    let v = e.target.value * 1;
                    if (!valueAcceptable(v)) { return; }
                    set(v);
                }}
                    value={`${value}`}></input>
            }
            <button className="plusMinus"
                onClick={(e) => {
                    set((value * 1) + increment);
                }}
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    set((value * 1) - increment);
                }}
            >
                {label || "+ -"}
            </button>
        </div>
    );
}
export default Counter;

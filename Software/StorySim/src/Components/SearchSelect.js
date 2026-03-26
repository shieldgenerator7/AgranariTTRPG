"use strict";

import { useState } from "react";

function SearchSelect({ options, option, setOption, id }) {
    let searchStr = "";
    let setSearchStr = (str) => searchStr = str;
    [searchStr, setSearchStr] = useState();

    return (
        <select id={id ?? ""} value={option ?? options[0]}
            className="searchSelect"
            onChange={(e) => {
                let option = e.target.value;
                setOption(option);
            }}
        >
            {options
                .filter(o => !searchStr || o.includes(searchStr))
                .map((o, i) => {
                    return (
                        <option value={o} key={i}
                            onClick={(e) => { setOption(o); }}
                        >{o}</option>
                    );
                })
            }
        </select>
    );
}
export default SearchSelect;

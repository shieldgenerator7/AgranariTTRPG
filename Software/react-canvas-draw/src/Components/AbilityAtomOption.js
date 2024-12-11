"use strict";

import { TYPE_PARAM_NUMBER_FRACTION, TYPE_PARAM_NUMBER_WHOLE, TYPE_PARAM_STRING } from "../Data/Ability/AbilityConstants";
import { ensureQuotes } from "../Utility/Utility";
import Counter from "./Counter";
import SearchSelect from "./SearchSelect";

function AbilityAtomOption({ optionName, type, option, optionList, setOption }) {
    let keyName = `_ability_line_${optionName}`;
    let useCounter = type == TYPE_PARAM_NUMBER_WHOLE;
    let useCounterFraction = type == TYPE_PARAM_NUMBER_FRACTION;
    let useText = type == TYPE_PARAM_STRING;
    let useSelect = ![useCounter, useCounterFraction, useText].some(b => b);
    return (
        <span className="abilityAtomOption bufferOnRight">
            <div>{`${optionName}:`}</div>
            <div>
                {useCounter && (
                    <Counter
                        key={keyName}
                        value={option ?? 0}
                        setValue={(v) => setOption(v)}
                        inline={true}
                    ></Counter>
                )}
                {useCounterFraction && (
                    <Counter
                        key={keyName}
                        value={option ?? 0.1}
                        setValue={(v) => setOption(v)}
                        inline={true}
                        max={1}
                        increment={0.01}
                    ></Counter>
                )}
                {useText && (
                    <input
                        className="field inline multiline"
                        value={option ?? ""}
                        onChange={(e) => {
                            let txt = e.target.value || "";
                            setOption(ensureQuotes(txt));
                        }}
                    ></input>
                )}
                {useSelect && (
                    <SearchSelect
                        key={keyName}
                        option={option ?? optionList[0]}
                        options={optionList}
                        setOption={(o) => setOption(o)}
                    ></SearchSelect>
                )}
            </div>
        </span>
    );
}
export default AbilityAtomOption;

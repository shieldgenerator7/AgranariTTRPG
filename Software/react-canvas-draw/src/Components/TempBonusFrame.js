"use strict";

import Counter from "./Counter";
import Field from "./Field";

function TempBonusFrame({ tempBonus, updateFunc }) {
    return (
        <div className="attributeFrameEdit">
            {tempBonus.editing &&
                <>
                <Counter
                    value={tempBonus.amount}
                    setValue={(v) => {
                        tempBonus.amount = v;
                        updateFunc();
                    }}
                    min={-1000}
                    max={1000}
                    inline={true}
                    label={`${(tempBonus.amount > 0) ? "+" : ""}${tempBonus.amount}`}
                    showEditField={true}
                    ></Counter>
                    <Field
                        name={"Filter"}
                        value={tempBonus.filter}
                        setValue={(v) => {
                            tempBonus.filter = v ?? "";
                            updateFunc();
                        }}
                        className={"editText"}
                    ></Field>
                    <button className="plusMinus"
                        onClick={(e) => {
                            tempBonus.editing = false;
                            updateFunc();
                        }}
                    >
                        Save
                    </button>
                </>
            }
            {!tempBonus.editing &&
                <>
                    {(tempBonus.amount > 0) ? "+" : ""}{tempBonus.amount} {tempBonus.filter}
                </>
            }
        </div>
    );
}
export default TempBonusFrame;
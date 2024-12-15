"use strict";

import Counter from "./Counter";
import Field from "./Field";

function TempBonusFrame({ tempBonus, updateFunc }) {
    return (
        <div className="attributeFrameEdit">
            {tempBonus.editing &&
                <>
                    {tempBonus.bonus}
                    <Counter
                        value={tempBonus.bonus}
                        setValue={(v) => {
                            tempBonus.bonus = v;
                            updateFunc();
                        }}
                        min={-100}
                        max={100}
                        inline={true}
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
                    <button
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
                    {(tempBonus.bonus > 0) ? "+" : ""}{tempBonus.bonus} {tempBonus.filter}
                </>
            }
        </div>
    );
}
export default TempBonusFrame;
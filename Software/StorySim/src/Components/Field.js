"use strict";

function Field({ name, value, setValue, className, placeHolder }) {
    return (
        <span className="field">
            <label>{name}</label>
            <input type="text" className={className}
                placeholder={placeHolder}
                onChange={(e) => {
                    let v = e.target.value;
                    setValue(v);
                }}
                value={value}
            ></input>
        </span>
    );
}
export default Field;
"use strict";

function SuggestionList({ suggestionList, onSuggestionTaken, maxShown = 5 }) {
    let list = suggestionList;
    if (list.length > maxShown) {
        list = list.slice(0, maxShown);
    }
    return (
        <div>
            {
                list.map((suggestion, i) => (
                    <button className="action notwide" key={`suggestion_${i}`}
                        onClick={(e) => onSuggestionTaken(suggestion)}
                    >
                        {suggestion}
                    </button>
                ))
            }
        </div>
    );
}
export default SuggestionList;

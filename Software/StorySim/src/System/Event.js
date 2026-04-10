import { arrayRemove, arraySort, between, copy} from "../Utility/Utility";

export const RESERVED_KEY_WORDS = [
    "timestamp",
];

/**
 * This describes an event in a timeline, such as a character moving, taking an action, gaining exp, etc
 * This is for recording events that have already happened, and not for queuing actions that will take place in the future
 */
export class Event{
    constructor(timestamp, characterName, actionName) {

        //saved data
        this.timestamp = timestamp ?? 0;//in milliseconds relative to start of scene
        this.characterName = characterName ?? "";//the character that created this event
        this.actionName = actionName ?? "";//the action that created this event
        this.duration = 0;//in milliseconds
        /** keyframe is an "any" object,
        * it can have any variables in it.
        * every keyframe needs at least a timestamp (relative to event timestamp).
        * key frames need to be in order by timestamp.
        * only put interpolatable variables in here (numbers).
        * assumes all key frames have all the same variables.
        */
        this.keyFrameList = [
            //ex: move to the right
            // {
            //     timestamp: 0,
            //     x: 0,
            // },
            // {
            //     timestamp: 1,
            //     x: 10,
            // },
        ];
        /**
         * a diff happens in an instant at the designated timestamp.
         * a diff can have any variables in it
         * diff has a timestamp (relative to event timestamp) (milliseconds)
         * diffs need to be in order by timestamp
         */
        this.diffList = [
            //ex: increase Strength by 2
            // {
            //     timestamp: 0.5,
            //     Strength: 2,
            // },
        ];

        //cached variables        
        this._keyList = [];//list of variable names that can be interpolated
    }

    /** sets up all the cached variables */
    init() {
        //TODO: error check key frame list having null values
        //TODO: error check key frames being in order by timestamp
        const kf1 = this.keyFrameList[0];
        this._keyList = Object.keys(kf1);
        RESERVED_KEY_WORDS.forEach(word => {            
            arrayRemove(this._keyList, word);
        });
        //TODO: error check key frames not having same values
        //TODO: error check all key variables are numbers

        //set the duration if necessary
        if (this.duration < this.keyFrameList[-1].timestamp) {
            this.duration = this.keyFrameList[-1].timestamp;
        }
    }

    addDiff(timestamp, varname, value) {
        const diff = {
            timestamp: timestamp,
        };
        diff[varname] = value;
        this.diffList.push(diff);

        this._compute();
    }

    _compute() {
        arraySort(this.diffList, diff => diff.timestamp);
    }

    /**
     * Retrieves the frame at the given scene time
     * @param {number} timestamp Timestamp relative to start of scene
     * @returns The frame for the character that contains what the values should be set to
     */
    getFrame(timestamp) {
        if (timestamp < this.timestamp) {
            return null;
        }
        const TIMESTAMP = timestamp - this.timestamp;
        for (let i = 0; i < this.keyFrameList.length; i++){
            const kf1 = this.keyFrameList[i];
            if (kf1.timestamp == TIMESTAMP) {
                return copy(kf1);
            }
            if (!kf2) {
                break;
            }
            const kf2 = this.keyFrameList[i + 1];
            if (kf2.timestamp == TIMESTAMP) {
                return copy(kf2);
            }
            //found lower and upper bound, interpolate
            if (between(TIMESTAMP, kf1.timestamp, kf2.timestamp)) {
                //percent = partial duration / full duration
                const percent = (TIMESTAMP - kf1.timestamp) / (kf2.timestamp - kf1.timestamp);
                const kf = {};
                this._keyList.forEach(k => {
                    kf[k] = (kf2[k] - kf1[k]) * percent;
                });
                return kf;
            }
        }
    }

    getDiffList(timestamp) {        
        if (timestamp < this.timestamp) {
            return null;
        }
        const TIMESTAMP = timestamp - this.timestamp;
        return this.diffList.filter(diff => diff.timestamp <= TIMESTAMP);
    }
}

export function inflateEvent(event){
    Object.setPrototypeOf(event, Event.prototype);
    
    event.init();
}
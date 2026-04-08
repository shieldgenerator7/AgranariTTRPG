import { inflateCharacter } from "../Data/Character";
import { between, copy, inflateArray, isNumber } from "../Utility/Utility";



/**
 * This describes an event in a timeline, such as a character moving, taking an action, gaining exp, etc
 */
class Event{
    constructor(timestamp, characterName) {

        //saved data
        this.timestamp = timestamp ?? 0;//in milliseconds since start of in-universe time
        this.characterName = characterName ?? "";//the character the event acts upon
        this.duration = 1;//in milliseconds
        //keyframe is an "any" object
        // it can have any variables in it
        //every keyframe needs at least a timestamp
        //key frames need to be in order by timestamp
        //only put interpolatable variables in here (numbers)
        //assumes all key frames have all the same variables
        this.keyFrameList = [];

        //cached variables        
        this._keyList = [];//list of variable names that can be interpolated
    }

    /** sets up all the cached variables */
    init() {
        //TODO: error check key frame list having null values
        //TODO: error check key frames not having same values
        const kf1 = this.keyFrameList[0];
        this._keyList = Object.keys(kf1);
    }

    getFrame(timestamp) {
        for (let i = 0; i < keyFrameList.length; i++){
            const kf1 = this.keyFrameList[i];
            if (kf1.timestamp == timestamp) {
                return copy(kf1);
            }
            if (!kf2) {
                break;
            }
            const kf2 = this.keyFrameList[i + 1];
            if (kf2.timestamp == timestamp) {
                return copy(kf2);
            }
            //found lower and upper bound, interpolate
            if (between(timestamp, kf1.timestamp, kf2.timestamp)) {
                //percent = partial duration / full duration
                const percent = (timestamp - kf1.timestamp) / (kf2.timestamp - kf1.timestamp);
                const kf = {};
                this._keyList.forEach(k => {
                    kf[k] = (kf2[k] - kf1[k]) * percent;
                });
                return kf;
            }
        }
    }
}

export function inflateEvent(event){
    Object.setPrototypeOf(event, Event.prototype);
    
    event.init();
}
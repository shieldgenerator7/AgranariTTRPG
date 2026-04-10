
import { clamp } from "../Utility/Utility";
import { Event } from "./Event";


class SceneController{
    constructor(scene) {
        //NOTHING gets saved here, scene controller is NOT serializable!

        this.scene = scene;
        /**
         * time (milliseconds) relative to the start of the scene
         * set this to change the current time (ex: to go back in time)
         */
        this.timeCursor = 0;
        this.characterInstructions = {
            char1: ["moveTo char2"],//TODO: make it actual instruction objects?
            char2: ["read book"],
        };

        //computed vars
        this._maxTime = 0;//the max allowed time the timeCursor can go to, usually set to the edge of recorded events
    }

    init() {
        this._timeline = this.scene.timeline;
    }

    //Records an action into the timeline
    recordAction(character, action, timestamp) {
        timestamp ??= this.timeCursor;
        //if already ongoing event for this action for this character, retrieve it
        let event = this._timeline.getEvent(character.name, action.name, timestamp);
        //else, make new event for this action at this timestamp
        if (!event) {
            event = new Event(timestamp, character.name, action.name);
            event.duration = action.windup + action.endlag;
        }
        //TODO: process keyframes and diffs
    }

    /**
     * Go back in time or forward in time
     * @param {*} timestamp Between 0 and max time, relative to start of scene (milliseconds)
     */
    goToTime(timestamp) {
        const TIMESTAMP = clamp(timestamp, 0, this._maxTime);
        //processing
    }

    changeVariable(character, statName, oldValue, newValue, timestamp) {
        timestamp ??= this.timeCursor;
        const event = new Event(timestamp, character.name, "edit");
        event.addDiff(0, statName, (newValue - oldValue));
        this._timeline.addEvent(event);
    }

    setCharacterInstruction() {
        
    }

    processCharacterInstruction() {
        
    }


}
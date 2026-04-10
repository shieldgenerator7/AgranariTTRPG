
import { Event } from "./Event";


class SceneController{
    constructor(scene) {
        this.scene = scene;
    }

    init() {
        this._timeline = this.scene.timeline;
    }

    recordAction(character, action, timestamp) {
        let event;
        //if already ongoing event for this action for this character, retrieve it
        event = this._timeline.getEvent(character.name, action.name, timestamp);
        //else, make new event for this action at this timestamp
        if (!event) {
            event = new Event(timestamp, character.name, action.name);
            event.duration = action.windup + action.endlag;
        }
        //TODO: process keyframes and diffs
    }
}
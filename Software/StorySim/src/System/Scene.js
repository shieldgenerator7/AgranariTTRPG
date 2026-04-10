import Vector2 from "../Data/Vector2";
import { Timeline } from "./Timeline";

export const SCENE_DURATION_MAX = Number.MAX_SAFE_INTEGER;

export class Scene {
    constructor(timestamp, origin) {

        //saved variables
        this.timestamp = timestamp ?? 0;
        this.coordinate = origin ?? new Vector2(0, 0);
        this.timeline = new Timeline();

        //cached only
        this.characterList = [];
    }
}
import Vector2 from "../Data/Vector2";

export const SCENE_DURATION_MAX = Number.MAX_SAFE_INTEGER;

class Scene {
    constructor() {

        //saved variables
        this.timestamp = 0;
        this.coordinate = new Vector2(0, 0);
        this.timeline = new Timeline();

        //cached only
        this.characterList = [];
    }
}
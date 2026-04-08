import Vector2 from "../Data/Vector2";



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
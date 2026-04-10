import Character, { inflateCharacter } from "../Data/Character";
import Stat from "../Data/Stat";
import Vector2 from "../Data/Vector2";
import { Event } from "../System/Event";
import { Scene } from "../System/Scene";
import { copy } from "../Utility/Utility";


export function testTimeline (){
    console.log("test timeline");

    //Setup: Character
    const char1 = new Character("test");
    const stat = new Stat("Strength", 20);
    stat.XP = 100;
    stat.XPVariance = 250;
    char1.statList.push(stat);

    //Setup: Scene
    const scene = new Scene(0, new Vector2(0, 0));
    scene.characterList.push(char1);

    //Setup: Timeline
    const timeline = scene.timeline;
    const event = new Event(1, "test", "buff");
    event.addDiff(0, "Strength", 2);
    timeline.eventList.push(event);
    console.log("scene", copy(scene));

    //Pre Output
    console.log("Char1", copy(char1), char1.statList[0].Stat);

    //Change
    const char2 = timeline.fastForward(char1, 2);
    inflateCharacter(char2);

    //Post Output
    console.log("Char2", copy(char2), char2.statList[0].Stat);
};
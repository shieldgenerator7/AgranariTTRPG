import Character from "../Data/Character";
import Stat from "../Data/Stat";
import { copy } from "../Utility/Utility";


export function testTimeline (){
    console.log("test timeline");

    //Setup
    const char1 = new Character("test");
    const stat = new Stat("Strength", 20);
    stat.XP = 100;
    stat.XPVariance = 250;
    char1.statList.push(stat);

    //Pre Output
    console.log(copy(char1), char1.statList[0].Stat);

    //Change
    stat.XP = 145;

    //Post Output
    console.log(copy(char1), char1.statList[0].Stat);
};
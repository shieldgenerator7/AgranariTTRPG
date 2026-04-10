import { inflateCharacter } from "../Data/Character";
import { copy } from "../Utility/Utility";
import { RESERVED_KEY_WORDS } from "./Event";



export class Timeline{
    constructor() {
        this.eventList = [];
    }

    /**
     * Returns a copy of the given character that is fast forwarded
     * @param {Character} character The character object to fast forward.
     * @param {number} timestamp The time since the start of the scene (milliseconds)
     */
    fastForward(character, timestamp) {
        const char0 = copy(character);
        inflateCharacter(char0);
        for (let i = 0; i < this.eventList.length; i++){
            const event = this.eventList[i];
            //early exit: events that hadnt happened yet
            if (event.timestamp > timestamp) {
                break;
            }
            //

            //TODO: keyframes

            //diffs
            const diffList = event.getDiffList(timestamp);
            diffList.forEach(diff => {
                Object.entries(diff).forEach(([k, v]) => {
                    //early exit: non stat
                    if (RESERVED_KEY_WORDS.includes(k)) {
                        return;
                    }
                    //
                    const stat = char0.getStat(k);
                    stat.acceptBonus(event.actionName, v);
                });
            });
        }
        return char0;
    }
}
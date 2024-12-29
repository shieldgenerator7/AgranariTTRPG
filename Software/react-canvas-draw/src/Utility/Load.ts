"use strict";
import * as Fetch from "../Utility/Fetch";

export function loadFile(
    url: string,
    // setStory: (story: Story, callback?: Function) => void,
    // setStoryInfo: (storyInfo: StoryInfo, callback?: Function) => void
) {
    if (url) {
        Fetch.fetchFile(url, (text: string) => {
            if (url.endsWith(".md")) {
                // processMD(text, setStory);
            } else if (url.endsWith(".json")) {
                // processJSON(text, url, setStoryInfo);
            }
        });
    }
}

export function processMD(
    text: string,
    // setStory: (story: Story, callback?: Function) => void
) {
    // let story = new Story(text);
    // setStory(story);

    //
    //2023-08-23: TEST
    //
    const _global = window as any;
    // _global.story = story;
    //
}

export function processJSON(
    text: string,
    url: string,
    // setStoryInfo: (storyInfo: StoryInfo, callback?: Function) => void
) {
    // let storyInfo = new StoryInfo();
    let urls = JSON.parse(text);
    let baseURL = url.substring(0, url.lastIndexOf("/")) + "/";
    Fetch.fetchFile(baseURL + urls.story, (txt: string) => {
        // storyInfo.story = new Story(txt);
        // storyInfo.analyze();
        // setStoryInfo?.(storyInfo);
    });
    if (urls.characters) {
        Fetch.fetchFile(baseURL + urls.characters, (txt: string) => {
            // storyInfo.characters = JSON.parse(txt);
            // storyInfo.characters.forEach((character: Character) => {
            //     Object.setPrototypeOf(character, Character.prototype);
            //     if (character.portrait) {
            //         character.portraitURL = baseURL + character.portrait;
            //     }
            // });
            // storyInfo.analyze();
            // setStoryInfo?.(storyInfo);
        });
    }
    // storyInfo.title = urls.title;
    // storyInfo.author = urls.author;
    // storyInfo.year = urls.year;
    // storyInfo.lastupdated = urls.lastupdated;
    // setStoryInfo?.(storyInfo);
    //
    //2023-08-19: TEST
    //
    const _global = window as any;
    // _global.storyInfo = storyInfo;
    //
}

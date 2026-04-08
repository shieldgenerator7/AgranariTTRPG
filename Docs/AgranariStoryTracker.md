# Agranari Simulator Game

This is based on the Agranari Story Sim idea, but because that idea has two modes, I want to focus on one of them: the playable version, that you can play with your friends. Because it’s probably easier to implement and can be played more like a game, whereas the (re-)simulator is more of a tool to see likely outcomes. This version will look like a game and be a VTT like Roill 20 or Fantasy Grounds.

It might be more complicated than those tho, because Agranari TTRPG is pretty complicated. Thus, it needs a VTT to be able to played at any sort of reasonable speed.

# Timeline

In this game, there is a timeline that shows all the actions all the players and NPCs took, and all the changes that happened. This is so you can rewind and go back to any point in time to change things if need be. Each event will record the change that occurred, so so if you change things in the past, things in the future can still effect things the way they should, and you can see how certain changes make certain futures impossible, or make certain events not happen correctly, and you can decide to delete the old future or try and keep it. This makes it still useful as a tool for seeing how plausible certain story events are and how things might play out, while also useful for gameplay with friends because sometimes you forget about certain abilities and stuff.

Each event has a timestamp, recorded in game time. So that means you have to know the year, month, day, hour, minute, second etc in-game of the event. Alternatively, you can use the unique millisecond timestamp. It’ll probably be recorded internally as the millisecond timestamp, but can be displayed anyway you want.

This also makes it easier to tell when certain events occur relative to each other, if theyre simluatenous but in different areas, etc.

It might be that you know the year, but not the exact date, or maybe you don’t even know when this scene takes place in your story, and you want to move it around. That can be done.

# Scene

Each scene is a way to encapsulate a timeline, usually for an important moment, like a battle, a chase scene, or a conversation. Each scene has a starting timestamp, and every event in the timeline is relative to that. So changing the scene’s timestamp automatically changes every timestamp in the timeline.

Each scene has a starting coordinate within the world, and all coordinates for movement within the scene are relative to that coordinate. So if you don’t know where exactly the scene takes place, you can change the relative coordinate later and it auto-updates all the coordinates in the scene.

Characters levelup all the time, so different scenes have the same characters at different places in their personal journeys, with different stats. Scenes don’t store the characters stats, but when a scene is loaded, each character gets their starting stats cached for the scene.

If the game’s data gets unlocked and a characters stats get edited, then those changed stats get saved to the scene, to say the character has to start with these stats for the scene to work. A scene can say that a characters stats don’t align with what they should have based on prior events in the UI, so that the author knows where incongruencies are when they rearrange scenes.

# Ongoing Leveling (Timeskip)

Sometimes things happen overtime outside of scenes. Like one scene is 1 year in the past, and the next scene is 1 year in the future. In that time, the characters probably leveled up. But you don’t capture that in scenes. Its just floating timestamp stuff.

Im going to call it timeskip, because that’s what its called in stories and tv shows and stuff.

During a timeskip, a character levels up overtime. Its basically a scene, I guess, but it has ways to track stat changes over time.

The first is to say what the stats are after the timeskip, and you can enter the stats at the start or you can let it auto-detect the stats at the start based on prior events. Then, at any point during the timeskip, you can see what the character’s stats are using linear interpolation. So if you make a new scene during that timeskip, you know how strong the character is.

You can have a scene split a timeskip, making the timeskip into two separate timeskips, or you can have the scene run simultaneously during a timeskip.

The second way to define a timeskip is to say how the stats improve over time, so if you change the end point of the timeskip, the ending stats change as well.

# Overall Story Timeline

There’s an overall story timeline that shows all the events of the story over the entire length of it, which could span several campaigns / books / season etc. And you can go to any point and see what happened at those points.

Any changes you make to the timeline will be processed and reflected in future events, and the UI can show you how your changes effect future events and where it makes story conflicts later.

Here, you can also see floating scenes that you haven’t placed in the timeline yet. It can suggest to you where they should go to best line up with character’s stats based on points in time.

# Undo System

Most programs have an undo system so you can undo mistakes you made, or undo something you didn’t quite like. This program also \*should\* have an undo system, but it might make the system too complex, so I think it wont have one. It will, however, output a human-readable data file so you can use version control like GitHub to control versions like that.

# Information

Some characters learn something new and that changes things in the story. Im not really sure how to track that, exactly. I guess every character could have a knowledge section of each character sheet.

# Playback

Because it tracks everything, you watch a realtime playback of the events of the story. Sure, itll be from a 2D topdown perspective, but still, that’s pretty cool, right?

In fact, you can watch a full playback of everything that happens in the story, from the beginning to the end, going through each scene. Timeskips would be skipped, of course.

So you can watch a battle playout the way it did during the session, or how you decided it would play out. Complete with any visual effects that were added, and player comments.

Maybe even voiceline recordings, too. If it can record that kind of thing for in-character moments.

So conversation scenes can also be played back.

# Conversations

Some scenes are mostly all talk, and little action takes place. It’s hard to say how much time passes here, so you can timestamp each line of dialogue, and it will do its best to figure out how long each thing will take to say. Then each line of dialogue will appear in the timeline, complete with its starting point and duration. You can change both, so you can have it take place during another character’s dialogue (interrupting them), and have them speaker faster or slower. This is useful for figuring out how long the conversation lasts, if that matters. I imagine that for most conversations, the actual time it takes doesn’t matter at all. But some conversations or dialogue happens during time-sensitive moments, and how long it takes actually matters.

# Exports

With all this information, the tool can export into several formats. It can export as a video, showing all the important scenes and how they play out. It can export as a story, narrating everything that happens. It can also export as an audiobook, which is basically the story but with sound.

Of course, none of these exports are going to be \*good\*. You wouldn’t be able to make professional level stuff with this. But it could be a good starting point for a story or so.

# Abilities and Actions

Every character has abilities and actions they gain throughout the story. You can even add them at anytime mid scene. This is useful if the character wants to do something creative with their tools that you didn’t expect, so you can give them a mechanical ability to describe how that tool usage works in game.

## Hotbars

Each character has a lot of actions they can do, but most actions only happen in certain contexts, and each character needs easy access to actions they do a lot, so this is where hotbars come into play.

Each hotbar is specific to a character, but can be copied between characters. Copying a hotbar to another character doesn’t give that character any new abilities / actions they didn’t already have.

Each character can have multiple hotbars they can switch between.

Each button on a hotbar has a keyboard shortcut they can use to activate that action quickly, and it can be assigned to any key on the keyboard, not just 1-9.

## Ongoing Actions

Lots of actions have durations, and for that duration, they are active, and changing stats of characters and objects.

So each action has a start timestamp, and either an end timestamp with the stat changes at the end (to be linearly interpolated in the middle), or it has a list of what the stats will be at certain times. Or it will say how stats change over time, so if the endpoint changes, you know what the stats will be at that time.

This is similar to timeskips work, I see.

One example is movement. When the character takes the move action, the action has a start timestamp and an end timestamp, with where they were when they started, and where they were when the time ended. Then, in the timeline, you can change the duration of the movement to say how fast they went. Ideally, when you use the move action, you also can say how fast they move, or you have various move actions for different speeds.

## Windup

Some actions have a windup, then do something. Attacking, for example. After the attack windup, the attack goes through, and says to do some rolls that calculate damage.

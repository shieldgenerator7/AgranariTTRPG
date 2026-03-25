# Agranari Story Sim

So I made a web app to simulate battles for the Agranari TTRPG. The thing is, its so complex it really cant be played as a tabletop game. And I really don’t like the turn based nature of DnD and other TTRPGs, at least for the purposes of this sim. So I’m thinking about making a sim that does a lot of things for you, and processes things faster.

I don’t want it to be real time like videogames like LoL, but I want to be faster than DnD combat.

When controlling a character, you input what you want the character to do next: where to move, who to attack or target with a spell, whether to dodge, etc. And then the sim processes the next step.

Now a “step” might not be the same everytime. It skips to the next time someone can do something. Like, every character has a limited attack speed. And a step would be the next time an attack can be processed. Or if characters are far apart, maybe the next step would be 5 seconds when a spell is finished.

Now this system would only be this detailed during a combat scene, but in days and weeks when nothing major happens, it doesn’t process things that deeply. For each day, it tracks how much xp each character gets and in what areas.

Another important thing is being able to play out the battle, and then if you don’t like the outcome, you can rewind the sim and change a result of a certain attack to change if it misses or hits, and change any variable mid-combat to manually process certain character abilities that aren’t coded into the system yet.

Also, character abilities should be easy to create and use.

There could be another mode, where you don’t control any character, and instead set up a scene, with each character having settings for what they do in certain situations, and then play it out in real time or just process it all at once and show the result. And maybe you could have it process it 100 or 1000 times and it could show you the percentange chance of each side winning, and the percentage chance of each character surviving or dying.

I also want it to be modular, so it can be used for things outside of Agranari.

# Characters

Each character is made up of a bunch of stats. Each stat has a:

-   base value
-   die roll
-   willpower multiplier

Base value is how much this stat rolls for, minimum. It’s equivalent to things like attack bonus in DnD.

Die roll is how much extra the roll can be, for example: d6. But it can be any number, not limited to physical dice.

Willpower multiplayer is much it multiplies the willpower by. When you spend willpower to increase a roll for this stat, the willpower multiplier is used.

Some stats, like Max HP, only have a base value and not a die roll or willpower multiplier.

Stats are usually things like arm strength, move speed, etc. But some can be very specific, like “spotting rabbits in a bush”. When a certain situation calls for a roll, the character’s stat for that roll is used. If a character has no stat for that yet, then they gain that stat at its default values, possibly plus or minus any bonuses they have from similar stats.

For example, when baking cookies, but they’ve never done that before, they gain a new stat called “cookie baking”, and it starts at the default stat value, which I believe will be 0+d1, which is almost a guaranteed failure. But they could have a higher starting base value and die roll, if they have other relevant stats like “brownie baking”. How similar those things are determines how much it transfers. Let’s say the character has 127+d34 in “brownie baking”, and the two skills are 90% similar. Then the character would start with 114+d31 in “cookie baking”.

When gaining experience points in a stat, they choose to put that exp into the base value, die roll, or willpower multiplier for that stat. Normally, the die roll is easier to increase, and the base value only increases with a lot of practice. The willpower multiplier is usually only increased if the character uses willpower a lot for beating challenges with the stat.

Characters normally get their exp distributed automatically by the system based on what they did that day. But they may choose to spend it differently if they so choose.

Automatically, when a stat is increased, the die roll is increased if they were trying something new. If they were doing the same thing over and over again, the base value is increased instead.

Also, theres not a 1:1 ratio between exp and increase of die roll, base value, or willpower multiplier. The conversion is usually less than 100% effective, and its usually a system-wide thing, but it might be dependent on species and specific genes of the character, or other factors. For example, a bunny might have an increased exp-to-basevalue factor for jump height than a turtle.

Stats can have decimals or not, depending on preference. By default, the decimals are there but not all shown on screen.

## Abilities

Characters have abilities on top of stats. These are different. When a character swings a sword, you just make an attack roll with the character’s sword stats.

The ability part is that the character has a button “attack (with sword)”.

### Attacks

When a character holds a sword, they have an ability “attack with sword” that can target a character within a range of 1 meter, makes a sword accuracy roll, compares that value to the target’s dodge roll, and if successful, makes a damage roll and reduces the target’s health resource by that amount.

Then, the target has a passive that listens for the health resource getting reduced. It makes a resistance roll, and reduces the damage based on that amount.

Then, the damage that does get through, there’s another passive that kicks in afterwards. It makes a pain resistance roll, and if it fails, the character is winced for a duration (the duration of which is calculated using more rolls).

### ===

Abilities are things the player can make the character do. Some abilities become available when the character holds a certain thing or is in a certain context. For example, “attack with sword” only becomes available when the character is holding a sword.

Other abilities could be something like “howl” where a character makes a howl roll, and all characters in a certain radius make a “hear” roll to be able to determine where the howling character is.

Another example: “focus”, where the character gains bonus points to their attack accuracy stat and their attack damage stat (any combination of base value, die roll, and/or willpower multiplier). And this can be set to last for a certain amount of time, or until a certain thing happens, like them getting hit, them missing, or them deciding to do something non-hostile.

Abilities can also add passives to characters. These passives might be a key way of implementing things like abilities that turn off automatically or things like poison effects. Diseases and wounds will probably also be implemented as passives.

Abilities can also be based on other abilities. For example, “attack with sword” is based on “attack”. This can be done by making a copy of the ability then editing it, or making a subtype of the ability, with switching out certain stats for other stats, For example, switching out the general “attack damage” stat with the “sword attack damage” stat. When you make a subtype, you can specify which stats get replaced.

An item might give you multiple abilities, like “sword stab” and “sword swipe”, in this case, the difference is that stab does piercing damage to one target, whereas swipe does slashing damage to potentially multiple targets. It might also be that the character gains the ability by gaining experience with the item, and the item doesn’t automatically grant the ability.

### Hotbars

I really like terraria’s hotbar, where you can cycle between tools and resources, and use 1-9 to jump to a specific tool, and you can easily switch out which tools are in the hotbar.

This is going to mimic that, but in addition, you will have multiple hotbars, and you can switch out the hotbars. This is useful because different situations call for different set of actions. For example, when baking, you want to have things like “measure”, “pour”, “stir”, etc, but for battle, you want things like “attack”, “dodge”, and “block”. Most likely, you will not be doing both combat and baking at the same time, so it doesn’t make sense to have actions for both in your hotbar at the same time. But switching actions out in the hotbar constantly will be a pain, so to solve that, there will be multiple hotbars. And you can choose which hotbar to switch into depending on the situation.

Of course, hotbars are really only for the mode where you control a certain character.

### Passives

Some abilities are passives, meaning they listen for events and updates stats and resources according to their rules.

So, about abilities, actions and passives, I think it makes sense to separate into actions and passives. Actions are things you have to decide to do, whereas passives are things that automatically happen when triggered.

And you can have actions and passives without an ability, but abilities are made up of actions and passives.

Maybe actions and passives are the same thing, except actions can only be triggered manually, whereas passives are triggered automatically. So conceptually, there is really no difference. But abilities still consist of (potentially) multiple actions and passives.

# Music

2026-03-24: This thought stream was made while listening to some music, looping the playlist (I removed some songs from the playlist, these are the ones still there at the end):

-   <https://youtu.be/Tgj3wXQGg44>
-   <https://youtu.be/F3iIU6LjXhs>
-   <https://youtu.be/5lCPa7B7Cdo>
-   <https://youtu.be/FnudllBQBL4>
-   <https://youtu.be/XDrkrKdvV2w>

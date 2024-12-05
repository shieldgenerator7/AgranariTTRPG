# Agranari TTRPG

This is heavily inspired by DnD. Unlike other TTRPGs like Daggerheart that are made to be simple and easy to play on paper, this TTRPG aims to solve issues I have with DnD related to the systems feeling too basic. This game will be near impossible to play with only paper, and will require an app or at least an excel spreadsheet. It’s kind of hard to call it a “table top” RPG at all.

One good thing about divorcing it from pen & paper is that you’re not limited to the classic dice sets: d4, d6, d8, d10, d12, d20, d100. You can have “dice” values of any number you want.

## Design Philosophy

There’s a few rules about how to create rules in this game.

### Stats should be positively framed

This means that all stats should be better when at higher values. Example: max health, attack damage, attack rate.

Stats that are negatively framed are ones that are better at lower values. Example: ability cooldown. These stats are discouraged, and should be reframed to be positively framed. Ex: ability cooldown -\> ability haste.

### Dice rolls should be positively framed

No matter what the roll is, a higher value should always be better than a lower roll. Example: when attacking, a higher attack roll is more likely to succeed than a lower attack roll.

The exception to this is when rolling on a table for a random effect.

# Character Stats

Each character has various stats, that don’t align 1-to-1 with DnD stats.

Trainable Stats

-   Max Health
-   Damage Resistance (per type)
-   Armor
-   Attack Accuracy\* (per weapon)
-   Attack Damage Variance (per weapon)
-   Dodge\*
-   Pain Tolerance\*
-   Durability\*
-   Strength\*
-   Willpower
-   Willpower Factor
-   Constitution\*
-   Speed\*
-   …and lots more

\*This stat also has a paired Variance stat. Ex: Speed and Speed Variance

Characters are going to have A LOT of stats. A character’s species and background, and even their skills might give them additional stats they can train. Some characters even have trainable stats specific to them based on their unique history, experiences, and abilities.

I know this sounds like a lot, and it is. But it’s the granularity like this that I’m going for.

## Max Health

Max health is calculated from your character’s age and weight as outlined in their species info. Common formula:

MaxHP = age \* 10 + weight \* 2

This will very often start adult characters off with health pools of 100+.

## Armor & Resistances

I confess, I stole this from League of Legends.

Every character has a resistance value to each damage type, default 0. For example, resistance to slashing damage. At 100 Slashing Resistance, your character’s health pool is effectively increased by 100% against slashing damage, meaning you essentially have twice the health pool. The great thing about this is that you can have 100k+ resistance to a damage type and still take damage from the damage type. It’ll a while, but given enough time, someone could still kill you with a damage type youre resistant too, even if it would take a while.

Armor is shorthand stat for the combined resistance to slashing, piercing, and bludgeoning damage.

By default, all characters start at 0 resistance to all damage types. Some species might have resistance formulas. Example:

Bear Slashing Resistance = (Age – 20) \* 20

Yes, you can have negative resistance, which means you take more damage from that type.

This is more of damage reduction than attack blocking, so it’s not really like AC from DnD, and thus doesn’t really have an equivalent.

## Attacks

Trainable Stats

-   Accuracy
-   Accuracy Variance
-   Damage Variance
-   Crit Factor

Each character has a varying proficiency with each kind of weapon. The more they use that weapon, the more proficient they are with it. By default, every character starts with 0 proficiency in every weapon.

When a player is at least passably proficient with a weapon, they gain two stats: Accuracy and Accuracy Variance. Accuracy is a flat value that increases the chance to hit. Accuracy Variance is a die roll, usually similar in value to Accuracy.

Example: A cat fighter is proficient with a sword, with 37 Accuracy and 27 Accuracy Variance. They roll a 1d27 and roll a 13. Their total attack accuracy for that attack is a 50. This means that the lowest value they can get is 38, and the highest value is 64.

Damage is determined by the weapon mostly, with its Damage stat. Each character will also have a Damage Variance stat to add to that, one for each weapon.

If a player rolls an Accuracy value at least twice as high as the enemy’s Dodge value, they crit. When they crit, their damage is multiplied by their Crit Factor for that weapon.

As a character improves their mastery with a weapon, they get points to spend on their stats for that weapon.

| Stat              | Point Cost |
|-------------------|------------|
| Accuracy          | 7          |
| Accuracy Variance | 2          |
| Damage Variance   | 4          |
| Crit Factor       | 2          |

I haven’t quite figured out yet how these skill upgrade points are awarded.

## Defense

Players have a chance to dodge all attacks and negate all negative effects on them, through various stats.

### Dodge

Players have a Dodge and Dodge variance stat that help them dodge attacks. Both start at 0 by default. Through training, players can upgrade their dodge stats. This means that spellcasters are likely to have lower dodge stats and fighters are likely to have higher dodge stats.

It’s similar to Dexterity and AC in DnD.

## Combat

When making a melee attack, you roll your Accuracy Variance and add it to your Accuracy, to get your total accuracy value for the attack. The defender rolls their Dodge Variance and adds it to their Dodge stat to get their total dodge value. If your accuracy value is greater than their dodge value, you hit. If their dodge value is greater than or equal to your accuracy value, you miss.

If you hit, roll your Damage Variance for your equipped weapon and add it to the weapon’s Damage stat to get your damage value. If the defender has (positive) resistance in your weapon’s damage type, it reduces the damage value. The reduced damage value is then deducted from the defender’s health pool.

When you lose hp, it means your character has been hurt and/or injured. If the damage is enough, it might even give you a wound that can negatively effect your combat performance. On the bright side, if you survive, it’ll heal and become a cool scar.

When you take damage, if the damage amount is greater than your Durability value, you gain a Wound and have to roll for Pain Tolerance. If the damage amount is greater than your Pain Tolerance value, you next action becomes hindered.

## Pain Tolerance

This stat is how much pain a character can withstand at once, 0 by default. When a character takes damage, if it is above their pain tolerance, they wince in pain, possibly missing their next turn, or getting a disadvantage on their next action. They also have a Pain Tolerance Variance. If they have a Pain Tolerance Variance, they may roll each time they take damage to see if it effects them.

It’s similar to Constitution in DnD.

## Durability

This stat is how much damage a character can take at once without getting seriously injured, 0 by default. When you take damage with a value greater than your durability, you receive an injury, typically a scar.

These injuries are called Wounds. Each wound has a wound value, that is subtracted from a certain stat. Wounds are worst right after they happen, but overtime their wound value can be decreased so they effect you less. Typically, wounds can’t be completely erased, and their wound value cant go below 10% of their initial wound value. Often, decreasing wounds gains you max hp.

It’s similar to Constitution in DnD.

## Strength

How many pounds can a character comfortably pick up. Players can often pick up more than their strength stat if they roll high enough on their Strength Variance, but the Strength stat is baseline. In order to be proficient with a weapon, its weight must be less than your Strength stat. You don’t want to have to roll for strength every time you want to swing your great sword.

It defaults to 0, and by default is equal to your age, but can be trained further. Strength Variance defaults to also be equal to your age, and can also be trained further.

Each limb applies your strength stat individually. If you try to lift something with both hands, you can lift up to double your strength stat, and roll for your strength variance twice for really heavy objects.

This is obviously similar to Strength in DnD.

## Willpower

How much willpower a character can exert to achieve what they want, 0 by default. Willpower is a resource; each character has a Max Willpower stat, that they can train; and a Current Willpower stat, that they can spend. Whenever a player makes a roll and doesn’t roll high enough, they can spend willpower to increase the roll by the amount of willpower spent. They can also train their Willpower Factor, which multiplies the spent willpower when converting it to the other stat. Willpower Factor can be trained, but is hard to do so.

It's kind of similar to Charisma and Inspiration in DnD.

## Constitution

Unlike in DnD, you don’t fall unconscious when you drop to 0 health. At that point, you’re already dead. You fall unconscious when your missing hp is greater than your Constitution. By default, your constitution starts at 0 and increases by 2 every time you age up.

Constitution = Age \* 5

Since max health is usually Age \* 10, this means that most people will fall unconscious when they get below half health. By training this stat, you can stay conscious even when at low values, like 20% hp.

You can also train Constitution Variance. If you have Constitution Variance, every time you take damage and would fall unconscious, you can roll for Constitution Variance and possibly not fall unconscious.

This is kind of similar to Constitution and Death Saves in DnD.

## Speed

How far a character can move in 1 turn. Typically measured in meters. Default formula:

Speed = Age \* 0.3, rounded up

Speed can be trained. Speed Variance can also be trained. Whenever you want to move further in one turn than your speed, roll your speed variance and add it to your speed for your total speed value. You can then move up to that many meters this turn.

## Senses

Each character has a sense stat for

-   Vision
-   Hearing
-   Smell
-   Taste
-   Touch
-   Temperature
-   Direction
-   Wind (Speed & Direction)

As well as a variance stat for each.

These stats are randomly rolled at character creation, and generally cannot be trained. However, you can get equipment to train them. For example, you can get glasses to increase your Vision value when you make a Vision check.

Each species might add additional senses. For example, cats can sense air pressure and changes in air pressure.

This is essentially similar to Wisdom in DnD.

# Equipment Stats

## Weapons

Weapons have Attack Damage, and that’s about it. This stat can’t be trained, but a player can take their weapon to a black smith to improve it for a cost.

## Armor

Armor does not typically increase Dodge or Dodge Variance, in fact, some armors are heavy enough to give a penalty to it. They do however, grant armor and possibly other resistances.

Example:

-   Leather Armor: +20 Armor (resistance to slashing, piercing, bludgeoning)

# Creating a Character

The first step in creating a character is choosing a species and background. The species gives your character many additional stats, as well as improvements on some of your base stats. It also largely determines which backgrounds are available to you. Your background then gives you advantages on rolling initial stats, as well as some abilities.

Then you choose a location for your character to be from. This might also give you stats and abilities.

Then you have some points to spend, maybe 100 by default. You can spend these points to train stats that you want. You can dump it all into one stat like durability, or spread them evenly between any number of stats, like Max Health, Pain Tolerance, and Attack Accuracy Variance. Note that you train stats and their variance stat separately. For example, you don’t automatically get more Speed Variance when you train Speed.

# Combat

When combat starts, time starts at 0, and each combatant declares what they want to do first. The combatant whose actions takes least time goes first, and then their time variable is set to the current time + that action’s time cost. Then each combatant takes their turn.

Once every combatant has done their first action, the time jumps to the lowest time value among the combatants, and it becomes their turn again.

There are no actions, bonus actions, and reactions like in DnD. It’s actions and their time cost. More specifically, actions per limb you can act with. If you can swing a dagger in your left hand and “cast a spell” with your right hand, you can do both simultaneously. This effectively means that each limb you can do things with separately has its own initiative time in the timeline.

Movement can happen each second, however, to keep things simple, you can only move when its your turn (maybe?). Each time you have a turn in the timeline, you can move the whole amount, provided it’s been at least a second since the last turn in which you moved.

Some actions are very quick, like weapon attacks. Melee weapon attacks typically cost 1 second to do. You can swing 1 dagger in each hand at the same time. But you cant swing a great sword twice with each hand in the same turn, unless youre somehow strong enough to duel wield 2 great swords.

“Spells” typically cost more time, upwards of ten seconds or more.

If two or more players are tied for lowest next time point, the player who least recently took an action goes, and if still tied, the player whose next action costs the least amount of time.

There’s no such thing as opportunity attacks, so move around the battle field at your heart’s content! But do be aware that some characters might be able to react to that.

## Interrupts

If you leave a hand free, you can interrupt someone else’s action. Typically this is so you can make another attack while they leave, or parry an attack that they make.

Interrupt actions must have a time cost of 1 second or less. If they have more than 1 second time cost, then you can’t do that action as an interrupt.

## Actions

## Attacking

Most melee weapon attacks cost 1 second to do. Most ranged weapon attacks cost 1 second to shoot, and 1 second to reload, as separate actions that cannot be done simultaneously.

## Sensing

Most attacks can be dodged with no question. However, if the attack comes from behind, or from a creature that’s hidden, or some other way that questions whether or not the target is aware of the attack, they must make a sense check using the appropriate sense. If they succeed, they can detect the attack and try to dodge it. If they fail, they do not detect the attack and their dodge value is 0. Note that this doesn’t mean the attack automatically hits, it just means they can’t consciously put any effort into it.

### Crits

Crits don’t really happen in this TTRPG all that much. In order to crit, your attack accuracy value has to be at least twice as high as the defender’s dodge value. When you crit, you double your attack damage value.

## Leg Actions

By default, running doesn’t cost any extra actions and can be done while doing other actions. The exception is if you decide to use your legs for something other than moving. For example, you could stay in place so you can trip an incoming enemy. Or you could lift your knee to steady your crossbow to increase your accuracy for that shot. You can also kick with your leg. Note that standing is considered a leg action. Meaning if you kick with one leg, the other leg has to stand. Unless you can somehow float on the air or something. If you try to kick with both legs, you’ll end up on the ground.

If you do a leg action, you can usually only do 1 at a time, and it usually means you cant move for that turn. If you move during a turn, you can’t do a leg action.

### Moving

This is the default leg action when moving. It requires both legs to do.

### Stand

This is the default leg action when not moving. It requires at least 1 leg to do. Standing happens by default unless you intentionally move, so you are free to do other leg actions if you’ve just been standing with both legs.

### Trip

Attempt to cause an enemy to fall. Make an attack with your leg as your weapon and the defender makes a dodge check. If you beat the dodge, deal no damage, but you hit. Then make a contested strength check. If you win, you trip them and they become prone. If the target of the trip is moving or moved during their last turn, they gain a bonus to the dodge check equal to their speed check (if they did one), and get a penalty to their strength check equal to their weight.

### Kick

Standard weapon attack, but with your feet. Useful for getting some extra damage in.

### Grappling

You can attempt to grab another creature. Make an attack roll, and they make a dodge roll. If you hit, you don’t do damage, but do grab the creature.

While grappling a creature, you can attempt to move them or prevent them from moving. When you do, you make a strength roll and they make a contested strength roll. Whichever one is higher wins.

While grappling a creature, you can inhibit their dodging. Whenever the grappled creature makes a dodge check, you may roll strength to keep them still. They make a contested strength check. If your strength check is higher than their strength check, their dodge value is decreased by the difference in your strength values. You can also inhibit their ability to make attacks in the same way, by decreasing their Attack Accuracy value.

Naturally, grappling a creature with two hands is going to be more effective than grappling with only one. While grappling a creature, that hand can’t take actions other than to move the creature. If you grapple with both hands, you can’t take any actions except to move the creature. By default, you must be within 1 meter of a creature to grapple them, and you must be able to move them in order to move yourself.

A grappled creature can also attempt to drag you along with it when it moves. If that happens, do a contested strength check to see who wins.

A grappled creature can also grapple another creature and can also grapple its grappler.

## Other Limbs

### Tail

Most species have a tail and thus a tail action. For example, wolves have a strong tail and can do a tail swipe attack. Peacocks have the Silver Eye that they can use to “cast spells”. Cats with Heart Fire can make a fire attack with their tail.

If doing the tail action requires spinning around to face the opposite direction, players can do that even if they already spent their leg actions.

### Jaw

Some species have special actions they can do with their mouth. For example, wolves have a strong jaw they can use to make melee attacks and grapple attacks. Beavers have large teeth they can use to chew through trees.

A creature can make a jaw action even if they already used actions for both their hands, leg, and tail.

# Conditions

Players can be in various states.

## Prone

On the ground. Basically the same as in DnD. Enemies have advantage on attacks within 1 meter of you, and disadvantage on ranged attacks. You also have disadvantage on attacks.

## Unconscious

The player can’t move or take any actions. They automatically fail Dodge checks and Strength checks. They don’t have to roll for Pain Tolerance.

## Grappled

Grappled is not really a condition. The grappler has to be more or less actively trying to effect your movements for this to do anything.

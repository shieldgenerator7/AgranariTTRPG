# Agranari Spells

Magic isn’t really a thing in this game like it is in DnD. Instead, each species has a species ability that has multiple applications, and there’s heirlooms, which are essentially magic items. This document lists known applications of species abilities.

Each of these spells has a Proficiency stat and Proficiency Variance stat tied to it, that is trainable and increases the spell’s individual effectiveness. Both of these stats start at 0. Spells refer to both these stats as simply “Proficiency” to refer to a standard stat check for that spell’s Proficiency.

If a spell has a target, you must be able to sense the target in someway.

These spells have a time cost. This is how many seconds it takes for the spell to take effect. The spell effect only happens at the end of the casting time.

# aDirada’s Lie

Here are the spells for aDirada’s Lie, called lies.

Each lie requires a certain amount of fibs to be complete. The effects of the lie are usually visible as it is happening, even before it is complete. Interrupting the lie does not end the effects already made. If the target moves out of range before the lie is complete, the lie is interrupted, and the hoof clipping falls off automatically.

Each lie’s time cost is essentially its fib count, assuming a rate of 1 fib per second. If you can do more fibs per second, then the time cost of the spell is less.

Most spells don’t mention Proficiency, because Proficiency for each spell usually just increases the Lie Speed for that spell.

Lie Speed Increase = (0.1 \* Proficiency)

## Mend

Fibs: Area of the gaps in cm

Focus on something broken and warp the parts that are still there to fill in the gaps.

## Heal

Fibs: Healing - (0.1 \* Lie Power)

Heal any amount of health points of target creature.

# Heart Fire

Here are the spells for Heart Fire. When you cast a Heart Fire spell, you can spend any number of Fire Points on it, and the effectiveness of the spell is determined by how many points you spend.

Keep in mind that these spells are bound by your Ignite Range. The target of these spells must be within your Ignite Range for the spell to take effect. If your Ignite Range is 0, you must be touching the target.

If you sense a target, but don’t know what it’s made out of, and cast a spell on it that doesn’t effect it, nothing happens. For example: casting Heat Metal on paper does nothing.

## Heat Metal

Time Cost: 3

Focus on a metal object. Increase its temperature by a few degrees. The temperature increase formula:

Temperature Increase = Fire Points \* Fire Power \* 0.2 \* (1 + Proficiency)

## Ignite

Time Cost: 10

Focus on a dry, combustible material. It ignites into flames. The time cost is reduced by Fire Points \* (0.25 \* Proficiency + 0.10 \* Fire Power).

The area that ignites into flames is no bigger than a few centimeters. Area:

Ignite Area = Fire Power + (0.1 \* Proficiency) cm

## Flaming Weapon

Time Cost: 60

Focus on a weapon. Flames engulf the damaging part, increasing the weapon’s damage. Formula:

Bonus Damage = Fire Points \* Fire Power \* (0.05 + Proficiency)

## Warm Up

Time Cost: 9

Focus on a creature. You increase their internal temperature by a few degrees. Formula:

Temperature Increase = Fire Points \* Fire Power \* 0.2 \* (1 + Proficiency)

## Cauterize

Time Cost: 5

Focus on a wound. You burn it closed, stopping any bleeding and restoring some amount of hp. Healing formula:

Healing = Fire Points \* (0.5 \* Fire Power + 1 \* Proficiency)

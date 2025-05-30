# Adirada’s Lie

Adirada-Do, the Deer Goddess of Truth and Nature, was a normal deer who was granted the extraordinary ability to bend reality. She passed on her gift to her descendants, who now know it as Adirada’s Lie.

Those who have the power of Adirada’s Lie have a blemish on their hoof hands: the middle hoof finger is disproportionately bigger than the other hoof fingers. This is the source of their power.

# Magic System

While a deer casts a spell, their middle hoof grows. When they stop casting the spell, the middle hoof stops growing. Then they can clip the extra bit off to make a hoof clipping. The hoof clipping holds the spell in place. The spell lasts as long as the hoof clipping does. If the hoof clipping breaks, gets destroyed, or decomposes, then the spell it holds reverts to its original form, if possible. This means that deer spells are effectively permanent, as long as the hoof clipping remains intact.

Deer spells take a long time to fully cast. Instead of being “complete” at the end, they are cast overtime, and they effect their target gradually over time. Meaning that if a spell is interrupted, it still has some level of completion that is held by the hoof clipping.

## Spell Ease

Every spell has a stat called “[Spell Name] Ease” specifically for that spell. The more you cast a spell, the easier it is to cast, and the less time it takes to cast. You can put XP into this ease stat for each spell to decrease its time cost.

## Parent Spells

Some spells have a parent spell. A spell’s parent spell is a spell that is a prerequisite for being able to cast this spell, as it is usually a more complex version of the parent spell. The spell will list the parent spell as a requirement to be able to cast this spell.

Additionally, having ease in the parent spell makes it easier to cast the spell. Every spell that has a parent spell has an additional stat (not listed), called “[Spell Name] Parent Ease Factor”. This stat starts at 0, but you can spend XP to increase it. When calculating the time cost of a spell, multiply the parent spell’s ease with this ease factor stat, and add the result to your total ease for this casting.

If the parent spell also has a parent spell, you can include that parent’s spell ease as well, using the parent spell’s parent ease factor stat. And thusly up the chain.

You can cast any spell, even if you don’t know the parent spell. But casting it without knowing the parent spell greatly increases the time cost of the spell, to the point of being impractical.

## Materials

Each material has its own resistance to being bended. This resistance is more or less consistent across all things of the same material.

Each spell says what material that it is intended to bend. This is not a restriction or requirement. You can bend materials with a spell other than the one listed, but then you have to modify the time cost for that other material. If you bend the intended material, then you don’t have to modify the time cost.

## Willful Resistance

In addition to the raw material itself resisting your bending, biological organisms can willfully resist being changed.

If a creature is unaware that they’re being bended, or simply don’t care, their willful resistance is 0. Their willful resistance goes up if they don’t want to be bended, and their willful resistance goes down if they do want to be bended. Willful targets can meaningfully speed up the spell casting.

## Overcasting

Spells can be overcast. Because spells are cast overtime, they can have partial effects before the time is complete. Likewise, if they are cast for longer than their time cost, they can have effects stronger than their base power. It scales based on time.

## Area of Effect

You can choose how big of an area your target is, and it does not have to be contiguous. You can target multiple characters, a wide area of dirt, or several apples in a crate. The bigger the area of effect, and/or the larger number of targets, the slower the spell will be, and the longer it will take to cast. Most spells specify how big of an area the time cost is calculated for. If you choose a bigger area, adjust the time up cost accordingly. And if you choose a smaller area, adjust the time cost down accordingly. Targeting double the area makes it take double the time. Targeting half the area makes it take half the time.

## Character Stats

Every character that can use Adirada’s Lie has several stats that govern how well they can use it.

**Hoof Growth Rate (cm/sec):** How fast the middle hoof grows while channeling a spell.

**Max Hoof Length (cm):** The max hoof length of a middle hoof before the hoof clipping falls off by itself. This does not break the hoof clipping.

**Cast Range (m):** The soft range you can cast spells. Beyond this range, spells quickly take so long that it becomes impractical. Spells cast closer than this range take significantly less time to cast. Spells cast at touch range may take hardly any time at all. This stat is actually a formula that returns a value similar to spell ease. The higher the value, the less time the spell costs.

## Factor Summary

A spell’s time cost can vary depending on a lot of different factors:

-   Spell ease (spell ease)
-   Range (spell ease)
-   Target area (scale factor)
-   Material resistance (spell ease)
-   Willful resistance (spell ease)

The factors marked with “spell ease” add/subtract to the spell’s ease to influence the time cost. The factors marked with “scale factor” scale the resulting time cost afterwards to influence the time cost, using a multiplier for the scaling.

# Spells

A non-exhaustive list of possible spells. I want to stress this. These are a sample of what can be done in this magic system, to give you an idea of what is possible with it. It is by no means a complete list of everything you can do with it. You can make your own spells, and you can use these spells as a reference to figure out what the time cost of your spells would be.

## Bark Snack

Bend Wood

Time cost: 30 sec (for a 1 square dm piece of tree bark)

The target piece of tree bark peels off the tree.

## Bestow Heirloom

Bend Bone

Time cost: 10 days

Copy effect from original antler heirloom to target antler heirloom.

The original heirloom is not effected.

If the target heirloom already had an heirloom effect, the previous effect is suppressed.

While the spell is only partially complete, the target still has its previous effect, but reduced proportional to the spell’s completion percent. The target has the new effect as well, but only partially effective, proportional to the spell’s completion percent.

## Bioluminate

Bend Fur

Time cost: 1 min (for a humanoid target 1.5m in height)

Make the target’s fur glow. The light is dim, and cannot blind.

When calculating time cost, scale it based on the target’s height.

Parent spell: Change Fur Color

## Carnivorate

Bend Bone

Time cost: 5 min

The target grows long sharp teeth and gains the Bite action. The target gains additional damage on their bite attack, equal to your Carnivorate Damage stat.

If they already have sharp teeth, they grow more teeth and/or the ones they already have grow longer.

Stats:

-   Carnivorate Damage: 1 + d1

## Camouflage

Bend Fur

Time cost: 3 min (for a humanoid target 1.5m in height)

Requirements:

-   Change Fur Pattern: 100
-   Sight: 50

Change the target’s fur pattern to match that of their surroundings. When you start casting this spell, make a Sight stat check. When you finish casting this spell, the target gets a bonus to their Stealth checks equal to the result of your Sight check multiplied by your Camouflage Stealth Factor stat.

The target only keeps this Stealth bonus while in an area for which they were camouflaged.

When calculating time cost, scale it based on the target’s height.

Stats:

-   Camouflage Stealth Factor: 0.1x

Parent Spell: Change Fur Pattern

## Craft Tool

Bend Stone

Time cost: 5 min (for a 1 cube dm block of stone)

The target bends into the shape you want.

## Detach Limb

Bend Fur, Bend Skin, Bend Flesh, Bend Bone

Time cost: 10 min

The target’s limb becomes disconnected from their body and falls off. The target still retains full control of the limb, and still maintains all feeling in the limb. Moving the limb far away doesn’t prevent this.

The opening where the disconnection happened seems to be completely open, but does bleed. Blood flows like normal from the target to its detached limb and back, and cutting the limb still makes it bleed.

When the hoof clipping breaks, the limb flies in a straight line back to the target, if able.

## Diggy Hole

Bend Dirt

Time cost: 5 sec (for a 1 cube dm block of dirt)

The target area of dirt compresses down or to the side, creating a hole in the ground.

## Octopus Camouflage

Bend Fur, Bend Skin

Time cost: 5 min (for a humanoid target 1.5m in height)

Requirements:

-   Camouflage: 100
-   Sight: 50
-   Touch: 50

Change the texture and finer shape of the target’s skin, further blending them into their environment. When you start casting this spell, make a Sight stat check and a Touch stat check. When you finish casting this spell, the target gets a bonus to their Stealth checks equal to the result of your Sight check multiplied by your Camouflage Stealth Factor stat, plus the result of your Touch check multiplied by your Octopus Camouflage Stealth Factor stat.

The target only keeps this Stealth bonus while in an area for which they were camouflaged.

When calculating time cost, scale it based on the target’s height.

Stats:

• Octopus Camouflage Stealth Factor: 0.1x

Parent spell: Camouflage

## Change Eye Color

Bend Gell

Time cost: 5 sec

The target’s eye color changes to whatever color you want. The color can be natural or not.

## Change Head Shape

Bend Bone, Bend Flesh, Bend Skin

Time cost: 30 min

The target’s head changes to the shape you want. This includes eyes, ears, nose, mouth and teeth, and fur placement. Fur pattern remains the same as much as possible.

The target loses actions they could do with their old head form and gain actions they can do with their new head form.

## Change Fur Color

Bend Fur

Time cost: 1 min (for a humanoid target 1.5m in height)

Change the color of the target’s fur to any solid color you want. The color can be a realistic fur color or not.

When calculating time cost, scale it based on the target’s height.

## Change Fur Pattern

Bend Fur

Time cost: 2 min (for a humanoid target 1.5m in height)

Requirements:

-   Change Fur Color Ease: 20

Change the color of the target’s fur in any pattern you want. The colors can be realistic fur colors or not.

When calculating time cost, scale it based on the target’s height.

Parent spell: Change Fur Color

## Graft Limb

Bend Bone, Bend Flesh, Bend Fur

Time cost: 4 min

Take a severed limb and graft it onto the target. The target gains full control of the limb.

The limb does not have to be originally from the target, and it does not need to be grafted in the place it’s “supposed to go”.

## Grass Chains

Bend Leaf

Time cost: 1 min

The target blade of grass grows 10x its length and increases in strength. As it grows, you may have it wrap around something within its range. The grass has increased strength equal to your Grass Chains Strength stat.

Stats:

-   Grass Chains Strength: 1+d1

## Grave

Bend Dirt

Time cost: 7.5 hrs (for a grave 2.5m x 1m x 2m)

Requirements:

-   Diggy Hole: 20

The target area of dirt recedes into the ground and to the sides, leaving enough room for the grave.

Breaking the hoof clipping is usually sufficient to bury its contents, as the dirt comes back from the walls of the grave instead of from the ground.

This spell will ignore non-dirt matter, such as stones, roots, and worms that may be in the target area.

Parent spell: Diggy Hole

## Grow Antlers

Bend Bone

Time cost: 5 min

The target grows a set of antlers in any shape or configuration you want. The target gains the Antler Stab action, with damage equal to your Grow Antlers Damage stat.

If the target already has antlers, you can bend the existing antlers. Their Antler Stab damage is increased by your Grow Antlers Damage stat.

Stats:

-   Grow Antlers Damage: 0 +d0

## Heal Scar

Bend Skin

Time cost: 30 sec

## Heal Wound

Bend Flesh

Time cost: 1 min (for a wound 1dm x 1dm)

The target wound seals up, preventing further bleeding. Additionally, the target heals for an amount of health equal to your Heal Wound Heal stat.

Stats:

-   Heal Wound Heal: 0+d0

## Mental Carving

Bend Wood

Time cost: 3 min (for a 1 cube dm block of wood)

The target block morphs in shape to any shape you want.

## Leaf Cloth

Bend Leaf

Time cost: 1 min

Expand the target leaf to be big enough to use as a piece of cloth. The leaf cloth will be 10x the size of the leaf’s original size.

## Remove Blemish

Bend Skin

Time cost: 5 sec

[DEV NOTE: “Blemish” is the name for the physical indication that a person has their species ability!]

## Remove Birthmark

Bend Skin

Time cost: 10 sec

## Enlarge Size

Difficulty: 10

Increase your size by up to 10%.

Spell Bend:

-   (Difficulty +10): Increase the percentage by up to an additional 10%.

## Reduce Size

Difficulty: 10

Reduce your size by up to 10%.

Spell Bend:

-   (Difficulty +10): Increase the percentage by up to an additional 10%.

## Change Species

Difficulty: 50

Requirements: You must have seen the species at least once.

You become a member of another Agranari species. You become a regular-proportioned member of that species with about your same size. Your fur pattern and overall physique stays the same as much as possible.

You gain the stats of your new form, higher or lower, and you gain their physical abilities. However, you don’t automatically adjust to your new form. If you’re not familiar with your new form, you need time to adjust and get experience in it before you can use it to its full effectiveness.

If your new form has a Blemish, make a History check and an Arcana check. If you pass both, your new Blemish is functional and you gain the species ability that comes with the Blemish.

When you cast this spell, you can choose whether or not to bend your Bending Hoof too. If you do bend your Bending Hoof, the hoof clipping immediately falls off.

## Copy Appearance

Difficulty: 25

Change your appearance to mimic that of another individual, who is the same species as you. You must have seen them at least once. Make a History ability check, the result of which determines how successful you are at mimicking them. If you are looking at them while casting the spell, you get Advantage x3 on this check.

Spell Bend

-   Copy Species (Difficulty +75): You may mimic an individual who is a different species than you. This follows the transformation rules outlined in the “Change Species” spell.
-   Copy Blemish (Difficulty +50): Make a History and Arcana check. If you pass both, you may copy their Blemish stats for your new form. If you are looking at them while casting the spell, you get Advantage x3 on this History check.

## Mind Meld

Bend Skin

Time cost: 15 min

The target’s hand hoof tips becomes connected to the deer they are touching. The target can read the other deer’s thoughts and embed thoughts of their own.

## Modify Limb

Difficulty: 25

Transform one of your limbs into that of another species.

## Modify Sense

Difficulty: 30

Gain one of the following: Darkvision (60ft), Keen Smell, Keen Hearing, Blindsight (10ft), or Tremorsense (30ft). If you already have the chosen sense, its range increases.

Alternatively, you can reduce the range on a ranged sense, or remove a sense if it has no range or its range is equal to or less than 10ft.

Spell Bend

-   (Difficulty +35): Gain an additional sense.

## Modify Skin

Difficulty: 15

Increase the toughness of your skin. Gain a Soft AC Bonus of +1, and a Soft AC Damage Reduction of +1.

Spell Bend

-   (Difficulty +10): Increase the bonus by an additional +1.
-   (Difficulty +10): Increase the damage reduction by an additional +1.

## Muscular Limb

Difficulty: 20

Increase the muscles in one of your limbs. You get +5 to Strength ability checks and saving throws made with that limb. If both of your legs have increased muscles, gain +5 movement speed.

Spell Bend

-   Extra limb (Difficulty +15): Apply this effect to 1 additional limb.
-   Extra muscles (Difficulty +18): Increase the Strength bonus by +5 and the movement speed bonus by +5.

## Atrophy Limb

Difficulty: 20

Alternatively, you can decrease your muscles, with the same rules, but with a -5 Strength bonus and a -5 movement speed bonus. The movement speed “bonus” applies if at least one of your legs has this effect. The spell bending options can also alternatively be negative.

Spell Bend

-   Extra limb (Difficulty +15): Apply this effect to 1 additional limb.
-   Extra muscles (Difficulty +18): Increase the Strength bonus by +5 and the movement speed bonus by +5.

## Ornate Fur

Bend Fur

Time cost: 2 min (for a humanoid target 1.5m in height)

Requirements:

-   Change Fur Pattern: 20

Create a special intricate pattern on the target that identifies them as a figure of importance, such as a noble, leader, or king; or that is a uniform of a certain profession, such as medic or firefighter.

You must have knowledge of the specific pattern you want and the requirements of it.

Parent spell: Change Fur Pattern

## Paint Rock

Bend Stone

Time cost: 1 min

The target rock changes color.

## Shut Up

Bend Skin

Time cost: 2 min

The target’s lips seal shut, effectively preventing them from talking. It does not stop them from breathing through their nose or other non-mouth breathing method. They can still mumble incoherently.

## Silent Step

Bend Fur

Time cost: 3 min

Requirements:

-   Stealth: 50

Modify the target’s hooves to not make any noise when traversing terrain. The target gains a bonus to Stealth checks equal to your Silent Step Stealth stat.

Stats:

-   Silent Step Stealth: 1 +d1

## Steel Bones

Bend Bone

Time cost: 3 days (for a humanoid target 1.5m in height)

The target’s bones change to steel, increasing their durability. The target gains durability equal to your Steel Bones Durability stat.

Stats:

-   Steel Bones Durability: 0+d0

## Stretch Limb

Bend Flesh, Bend Bone, Bend Skin, Bend Fur

Time cost: 2 min

The target’s limb grows in length, allowing them to reach things they couldn’t before. The length is their original limb length multiplied by one plus your Stretch Limb Factor.

Stats:

-   Stretch Limb Factor: 0.1x

## Tastenate

Bend Leaf

Time cost: 30 sec (for a piece of fruit 1dm x 1dm x 1dm, or a collection of fruit of the same size)

The target fruit becomes imbued with the taste of another fruit or food.

## Telepathic Tongue

Bend Flesh

Time cost: 2 min

The target’s tongue becomes a conduit for their brain. When two telepathic tongues touch, they can communicate telepathically.

## Thick Skin

Bend Skin

Time cost: 3 min (for a humanoid target 1.5m in height)

The target’s skin becomes thicker and more resistant to attacks. The target gains armor equal to your Thick Skin Armor stat.

Stats:

-   Thick Skin Armor: 1

## Tree Hug

Bend Wood

Time cost: 2 min (for a tree branch 1dm in diameter)

The target branch bends around, allowing it hug someone that is touching it.

## Wandering Eye

Bend Gel

Time cost: 10 min

The target’s eye dislodges from its socket, grows a layer of skin, and sprouts legs, wings, and/or other appendages. The target can control the movement of the eye. The eye has unlimited range. The target can still see everything the eye sees, and can feel everything the eye’s limbs touch.

When the hoof clipping is destroyed, if the eye is not in its socket, it still reverts to its normal eye shape, and flies back in a straight line to its socket, as much as it can.

## Worldly Shackles

Bend Dirt

Time cost: 1 minute (for 2 blocks of dirt 2dm x 3dm x 1dm each)

The target area of dirt comes up and fastens around the feet of whoever is standing above it. The shackles have a strength equal to your Worldly Shackles Strength stat.

Stats:

-   Worldly Shackles Strength: 1+d1

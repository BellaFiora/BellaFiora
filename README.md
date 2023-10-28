# BETA !

Developed by Pupariaa in JavaScript, this bot primarily uses Bancho's IRC and the Osu! v1 API.


# **Directly DM the Osu! account Pupariaa**
## Features
The Osu! bot provides the following commands:

### Command !missed
The !missed command allows you to get a map recommendation to play. It searches among the top ranks of the command executor for a map where they have achieved 3 misses or fewer.

Example usage:

`!missed`

Result: The bot returns a map from the command executor's top ranks with a high performance (3 misses or fewer).

### Command !bm (beatmap)
The !bm command allows you to get a map recommendation to play. It searches among the top ranks of players with a +/- 100pp difference from the command executor for a map that the executor has never played.

Example usage:

`!bm`

Result: The bot returns a map from the top ranks of players with a +/- 100pp difference from the command executor that they have never played.

### Command !lu (level up)
This command is similar to! bm, except that it will give you a map slightly higher than your average, or people of your level. Unlike! bm, which gives you a map to play without really any particular expectation! read gives you a map that will make you progress, gain rankcount or pp

Example usage:

`!lu`

Result: Gives a random map present in player toprank higher level than you
## Filters
You can apply filters to your query. 
You can add almost any parameter to an Osu! beatmap:
AR, CS, HP, OD CS. The duration will be available in a future update. 

Of course, there must be a minimum and a maximum, but don't worry, just enter the smallest parameter you want (e.g. ar9.2) and Farbot will return a beatmap with an ar between 9.2 and 9.7.

> AR`1`-`10` | max : + 0.5 of the value entered 

> AR>`1`-`10` | _AR larger than_  | **Reserved for! bm**

> AR<`1`-`10` | _AR smaller than_  | **Reserved for! bm**

> CS`1`-`10` | max : + 0.25 of the value entered

> CS>`1`-`10` | _CS larger than_ | **Reserved for! bm**

> CS<`1`-`10` | _CS smaller than_ | **Reserved for! bm**

> OD`1`-`10` | max : + 0.5 of the value entered 

> OD>`1`-`10` | _OD larger than_ | **Reserved for! bm**

> OD<`1`-`10` | _OD smaller than_ | **Reserved for! bm**

> HP`1`-`10` | max : + 0.5 of the value entered 

> HP>`1`-`10` | _HP larger than_ | **Reserved for! bm**

> HP<`1`-`10` | _HP smaller than_ | **Reserved for! bm**

> SR`0`-`15` | max : + 0.25 of the value entered 

> SR>`1`-`10` | _SR larger than_ | **Reserved for! bm**

> SR<`1`-`10` | _SR smaller than_ | **Reserved for! bm**

> mapper:`mapper.pseudo` | (replace space to .) | **Reserved for! bm**

> PP`0`-∞ | **Reserved for! bm**

> ACC`0`-`100` | **Reserved for! bm**

> BPM`0`-∞ | **Reserved for! bm**


Example usage:
`!bm ar9.1 HP7 CS4 SR5.5 mapper:sotarks`

Result: result of !bm command with filters AR between 9.1 and 9.6, HP between 7 and 7.5, CS between 4 and 4.25 and Star rating between 5.5 and 5.75 ★ that was mapped by sotarks. 

## Specifications
The bot's features are only available for the standard Osu! game mode.

You cannot add two operators to the! bm command.
e.g: !bm ar<9.4 ar>9.8 | **Is not possible**

The bot uses the Osu! v1 API to retrieve information about maps and players' performances.
Over time, the bot improves the accuracy of recommendations based on player statistics and performances.

For the mapper filter, if ever the mapper pseudo contains a space, simply replace it with a dot. By the way, the nickname is not case sensitive. You are therefore not obliged to respect capital letters and miniscules. The ID does not work, and if you are wrong and the nickname does not exist, you will be notified.

For the PP filter, this will give you a map with the minimum of PP you entered.

For the ACC filter, I agree that it is not too necessary but has been much requested. 
Enter a target accuracy. A map based on a score with an accuracy equal to or greater than what you entered. 

BPM allows you to set a target BPM. A map with an identical or higher BPM within the limit of 20 extra will be given


## In Development
The bot is in its early stages. It is intended to be improved, more accurate, and responsive.
New commands may be added over time, along with additional recommendations.

## Copyright
The bot is open source. You can use it to develop your own bot if desired.

**HOWEVER: It is prohibited to copy and paste the code without modification and create an identical copy.**

## Support me
Support me : [Paypal.me/pupsBot](https://paypal.me/pupsBot) ♥♥♥

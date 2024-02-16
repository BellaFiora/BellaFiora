# Commands

## `!help [command]`

Shows the help of the given command.

If no command is given, shows the available commands.

## `!ping`

Answer pong.

## `!echo <message>`

Answer back the given message.

## `!info <user>`

Shows all public informations on `<user>`.

## `!roll [options...] [lower] [upper]`

Roll a dice and answer a random number between `<lower>` (default to 1) and `<upper>` (default to 1000).

The limit for both is ±2147483648.

If you give only one argument, it will be considered as the upper limit.

### Options

- `-modulo <m>`
	- The random number will be modulo `<m>`.

## `!bm [options...] [patterns...]`

Suggest a beatmap for the player.

### Options

- `-od <od>` `-hp <hp>` `-cs <cs>` `-sr <sr>` `-pp <pp>` `-bpm <bpm>`
	- OD/HP/CS/SR/PP/BPM of the desired beatmap.
- `-mapper <mapper>`
	- Mapper of the desired beatmap.
	- Non-case sensitive.
	- Multiple mappers can be specified separated by commas, example: `-mapper Sotarks,HiroSheap`.
- `-status <status>`
	- Ranking status of the desired beatmap.
	- Non-case sensitive.
	- Multiple ranking status can be specified separated by commas, example: `-status graveyard,Approved`.
	- Valid ranking status are: `Graveyard`, `WIP`, `Ranked`, `Approved`, `Qualified`, `Loved`.
- `-save <command_alias>`
	- Saves the command and sets its alias to `<command_alias>`.
	- View saved commands using `!bm saved`.
	- Use a saved command using `!bm saved <command_alias> [options/arguments to overwrite in this command only...]`.
	- Save a command from a given player using `!bm saved <player>/<command_alias>`.
	- Rename a `<command_alias>` using `!bm saved rename <old_command_alias> <new_command_alias>`.
	- Edit a saved command with the provided options and arguments using `!bm saved edit <command_alias> [options/arguments to overwrite...]`.
	- Delete a saved command using `!bm saved delete <command_alias>`.
- `-played`
	- Specifies whether to get an already played beatmap.
- `-mod <mod>`
	- Mods to be applied to the desired beatmap
	- Non-case sensitive
	- Multiple mods can be specified separated by commas, example: `-mod DT,hd`
	- Valid mods are: `EZ`, `NF`, `HT`, `HR`, `SD`, `DT` or `NC`, `HD`, `FL`

For all options up to BPM, modifiers apply to ease the use. The `OD` option will be used as an example:

- `-od 9` <=> `OD == 9`
- `-od <9` <=> `OD < 9`
- `-od <=9` <=> `OD <= 9`
- `-od >9` <=> `OD > 9`
- `-od >=9` <=> `OD >= 9`
- `-od 9:.5` or `-od 9:0.5` <=> `8.5 <= OD <= 9.5`
- `-od 9:1` <=> `8 <= OD <= 10`

Specifying no option will use the defaults that you can set using:

- `!bm default <option> <value>`

You can also see your defaults using:

- `!bm defaults`

For example:

- `!bm default od 5`
- `!bm default mapper HiroshEAp`

### Arguments

Specify desired patterns/skillsets, example:

- `!bm stream jump` for a stream and jump beatmap.

You can specify weights using the colon modifier, example:

- `!bm stream:50 jump:80` for a ~50% stream and a ~80% jump beatmap.

This kind of distribution makes no sense of course, it's rebalanced using the following formula:

weights[i] = (weights[i] / sum of the weights)

In this example, stream will have a weight of ~38% and jump ~62%.

Not specifying them automatically apply equal ones.

- `!bm stream jump tech` <=> `!bm stream:0.33 jump:0.33 tech:0.33`.

Valid patterns are `alt`, `jump`, `speed`, `stream`, `tech`.

Valid skillsets are `aim`, `flowaim`, `memory`, `read`, `rhythm` or `accuracy`, `stamina`.

All are explained in the beatmap_manager README.

## `!room [room id] <action> [arguments...]`

Apply `<action>` to the given room that you must create beforehand and run `!addref Bella Fiora` in so that it can manage the room.

If you own only one, specifying the room id is optional. Note that you can only own one room. If you want to manage more than one, ask a Tournament manager from the [osu! team](https://osu.ppy.sh/wiki/en/People/osu%21_team) or [Team members](https://osu.ppy.sh/wiki/en/People/Global_Moderation_Team#team-members).

The room id will be given after doing the `!addref Bella Fiora` command, and will be automatically mapped to the real room id.

Valid actions include the default ones. Use `!mp help` in game to see them or visit the [wiki page](https://osu.ppy.sh/wiki/en/osu%21_tournament_client/osu%21tourney/Tournament_management_commands).

Examples:

`!room invite lavtoancia`

`!room 0 size 3`

Valid actions also include all options from the `!bm` command, along with all their modifiers.

These actions enforce the given beatmap properties to the maps being picked.

The `save` action will save all settings of the room.

You can see all your saved room settings using `!room saved`.

You can set a room saved settings using `!room [room id] saved <room_alias>`.

Examples:

`!room sr 6:1` <=> Only maps that are between 5.0* and 7.0* will be accepted (both included).

`!room played` <=> Only maps that you own will be accepted.

Valid actions also include `type` and take one argument:

- `rotate` (default)
	- Host rotates down automatically.
- `bot`
	- Bella Fiora automatically pick beatmaps that are suitable for the players in the room.
- `tournament`
	- You are in full control of the room.
	- Set the room to private.
	- Set a generated password. Reply the generated password.
	- Set the room scoremode to Score v2.

Example:

`!room type tournament`

# Commands

## `!bm`

### Options

- `od <od>`
	- OD of the desired map
- `hp <hp>`
	- HP of the desired map
- `cs <cs>`
	- CS of the desired map
- `sr <sr>`
	- SR of the desired map
- `pp <pp>`
	- PP of the desired map
- `bpm <bpm>`
	- BPM of the desired map
- `mapper <mapper>`
	- Mapper of the desired map
- `status <status>`
	- Ranking status of the desired map
	- Valid arguments: `Graveyard`, `WIP`, `Ranked`, `Approved`, `Qualified`, `Loved`
	- Non-case sensitive
	- Multiple arguments can be specified separated by commas, e.g., `--status graveyard,approved`

- `save <command_name>`
	- Saves the command and sets its alias to `<command_name>`
	- View saved commands using: `!bm saved`
	- Use a saved command using: `!bm saved <command_name>`

- `played`
	- Specifies whether to get an already played map 

For all options up to bpm, special modifiers apply to ease the use.

The od option will be used as an example.

- `--od 9` ⇔ `OD == 9`
- `--od <9` ⇔ `OD < 9`
- `--od <=9` ⇔ `OD <= 9`
- `--od >9` ⇔ `OD > 9`
- `--od >=9` ⇔ `OD >= 9`
- `--od 9:.5` or `--od 9:0.5` ⇔ `8.5 <= OD <= 9.5`
- `--od 9:1` ⇔ `8 <= OD <= 10`

Note: Specifying no option will use the defaults that you can set using:
`!bm default <option> <value>`
For example:
- `!bm default od 5`
- `!bm default mapper Hirosheap`

### Arguments

- Specify desired patterns, e.g.:
  `!bm stream jump` for stream and jump maps
- Specify weights using the : modifier, e.g.:
  `!bm stream:.5 jump:0.8` for a 50% stream map and an 80% jump map

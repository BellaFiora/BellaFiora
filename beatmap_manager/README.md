HTTP/WS server that manages .osu files and their associated audio in the background.

It is built with performance in mind.

It fetches beatmaps from osu.ppy.sh and keeps them up to date.

# Endpoints

## `/beatmap_infos`

### Queries

- `id`
	- Beatmap's id.

## `/beatmapset_infos`

### Queries

Same queries as `/beatmap_infos`.

## `/beatmaps_infos`

### Queries

- `ids`
	- Comma separated beatmaps' ids list.
- `ar` `bpm` `cs` `hp` `od` `pp` `sr`
	- Beatmaps' AR/BPM/CS/HP/OD/PP/SR.
	- Non-case sensitive.
	- Uses same modifiers as described in the osu! bot.
- `mappers`
	- Comma separated Beatmaps' mappers list.
	- Non-case sensitive.
- `statuses`
	- Comma separated Beatmaps' statuses list.
	- Non-case sensitive.
	- Valid ranking status are: `Graveyard`, `WIP`, `Ranked`, `Approved`, `Qualified`, `Loved`.
- `patterns`
	- Comma separated Beatmaps' patterns list.
	- Non-case sensitive.
	- Valid patterns are `alt`, `jump`, `speed`, `stream`, `tech`.
- `skillsets`
	- Comma separated Beatmaps' skillsets list.
	- Non-case sensitive.
	- Valid skillsets are `aim`, `flowaim`, `memory`, `read`, `rhythm` or `accuracy`, `stamina`.

## `/beatmapsets_infos`

### Queries

Same queries as `/beatmaps_infos`.

---

For all endpoints above, the response consists of a comma separated list of beatmap/beatmapset ids.

It sends at most 1000 ids.

The first id is not an id, it's a boolean telling if it sent all ids matching the request.

Request example:

`/beatmapsets_infos?statuses=ranked,loved&mappers=seamob&sr=7:.5&ar=10&skillsets=aim,flowaim&patterns=tech`

Response example:

`1,1031991,2331986,2135813,4289418`

---

This section explains in detail how patterns and skillsets are computed solely from the .osu file of a beatmap.

# Patterns

## alt



## jump



## speed



## stream



## tech



# Skillsets

## aim



## flowaim



## memory



## read

Insights:

Read involves notes spacial and temporal density in proportion to AR and CS.

In short, the better the match the easier the read.

A low AR on an easy map is easy to read, whereas the same AR on a harder map is harder to read.

## rhythm



## stamina



## QNA:

### Why not consider mappers' combos?

This is moslty because most of the beatmaps are Graveyard. Even then, doing so makes it independant from the mapper's style of placing combos.

### How about using beatmaps' SR?

This makes these computations independant from what the game thinks a beatmap is worth overall. SR is also computed from the .osu files, all information it provides are contained within.

### I d'ont see BPM being used, why?

BPM information is contained within the time difference between each note. BPM is redundant information, though it contains overall beatmap's feel much like SR. BPM alone also needs context, 150BPM could be very slow streams or 300BPM jumps if the notes are far appart.

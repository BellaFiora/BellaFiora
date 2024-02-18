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
- `od` `hp` `cs` `sr` `pp` `bpm`
	- Beatmaps' OD/HP/CS/SR/PP/BPM.
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

`/beatmapsets_infos?statuses=ranked,loved&mappers=seamob&sr=7:.5&skillsets=aim,flowaim&patterns=tech`

Response example:

`1,1031991,2331986,2135813,4289418`

---

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



## rhythm



## stamina



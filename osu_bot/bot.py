import osu_irc, re
from osu_irc.Utils.regex import *
from commands import *
from users import *


class BellaFiora(osu_irc.Client):
	async def onReady(self) -> None:
		self.prefix = "!"
		await self.joinChannel("#osu")
		print(f"{self.nickname} connected and joined channel #osu")

	async def unknownCommand(self, username: str, command: str) -> None:
		response = unknown_command(command)
		await self.sendContent(f"PRIVMSG {username} :{response}\r\n")

	async def helpCommand(self, username: str, command: str) -> None:
		response = help_command(command)
		await self.sendContent(f"PRIVMSG {username} :{response}\r\n")

	async def pingCommand(self, username: str, command: str) -> None:
		response = ping_command(command)
		await self.sendContent(f"PRIVMSG {username} :{response}\r\n")

	async def echoCommand(self, username: str, command: str) -> None:
		response = echo_command(command)
		await self.sendContent(f"PRIVMSG {username} :{response}\r\n")

	async def bmCommand(self, username: str, command: str) -> None:
		response = bm_command(command)
		await self.sendContent(f"PRIVMSG {username} :{response}\r\n")
		# await self.sendPM(username, response)

	async def onCommand(self, username: str, command: str) -> None:

		if command.startswith("!help"):
			await self.helpCommand(username, command)
		elif command.startswith("!ping"):
			await self.pingCommand(username, command)
		elif command.startswith("!echo"):
			await self.echoCommand(username, command)
		elif command.startswith("!bm"):
			await self.bmCommand(username, command)
		else:
			await self.unknownCommand(username, command)

	async def onRaw(self, raw: bytes) -> None:
		string = str(raw, encoding="utf-8")
		match = re.search(ReAll, string)
		if not match:
			return
		username = match.group(1)
		code = match.group(2)
		content = match.group(3)
		if code == "PRIVMSG Bella_Fiora":
			# private messages to Bella_Fiora
			# update_user(username)
			if content.startswith("\x01ACTION"):
				# is an action
				match = re.search(ReActionNp, content)
				if match:
					# is a np action
					url = match.group(1)
					artist = match.group(2)
					title = match.group(3)
					print(
						f'received np action "{url}" ({artist} - {title}) from {username}'
					)
			else:
				# is not an action
				print(f'received pm "{content}" from {username}')
				await self.onCommand(username, content)


def main() -> None:
	nickname = "Bella_Fiora"
	token = ""
	with open(".token", "r") as f:
		token = f.read()
	bot = BellaFiora(nickname=nickname, token=token)
	# define_macros()
	load_commands_options()
	# load_apikeys()
	# load_users_infos()
	# start_update_beatmapsets_thread()
	bot.run()


if __name__ == "__main__":
	main()

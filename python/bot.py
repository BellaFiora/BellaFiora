import osu_irc, re
from osu_irc.Utils.regex import *
from commands import *

class BellaFiora(osu_irc.Client):
    async def onReady(self):
        self.prefix = '!'
        await self.joinChannel("#osu")
        print(f'{self.nickname} connected and joined channel #osu')

    async def helpCommand(self, pseudo:str, command:str) -> None:
        response = help_command(command)
        await self.sendContent(f"PRIVMSG {pseudo} :{response}\r\n")

    async def pingCommand(self, pseudo:str, command:str) -> None:
    	response = ping_command(command)
    	await self.sendContent(f"PRIVMSG {pseudo} :{response}\r\n")
    
    async def echoCommand(self, pseudo:str, command:str) -> None:
        response = echo_command(command)
        await self.sendContent(f"PRIVMSG {pseudo} :{response}\r\n")
    
    async def bmCommand(self, pseudo:str, command:str) -> None:
        response = bm_command(command)
        await self.sendContent(f"PRIVMSG {pseudo} :{response}\r\n")
        # await self.sendPM(pseudo, response)

    async def onCommand(self, pseudo:str, command:str) -> None:
        if command.startswith('!help'):
            await self.helpCommand(pseudo, command)
        elif command.startswith('!ping'):
            await self.pingCommand(pseudo, command)
        elif command.startswith('!echo'):
            await self.echoCommand(pseudo, command)
        elif command.startswith('!bm'):
            await self.bmCommand(pseudo, command)
        else:
            await self.helpCommand(pseudo, command)

    async def onRaw(self, raw:bytes) -> None:
        string = str(raw, encoding='utf-8')
        match = re.search(ReAll, string)
        if not match: return
        pseudo = match.group(1)
        code = match.group(2)
        content = match.group(3)
        if code == "PRIVMSG Bella_Fiora":
            # private messages to Bella_Fiora
            if content.startswith("\x01ACTION"):
                # is an action
                match = re.search(ReActionNp, content)
                if match:
                    # is a np action
                    url = match.group(1)
                    artist = match.group(2)
                    title = match.group(3)
                    print(f"received np action \"{url}\" ({artist} - {title}) from {pseudo}")
            else:
                # is not an action
                print(f"received pm \"{content}\" from {pseudo}")
                await self.onCommand(pseudo, content)

def main():
    nickname = 'Bella_Fiora'
    token = ''
    with open('.token', 'r') as f:
        token = f.read()
    bot = BellaFiora(nickname=nickname, token=token)
    load_commands()
    bot.run()

if __name__ == "__main__":
    main()

import os, threading, platform, io, sys, asyncio
from python_utils.utils.print import cprint

def from_windows():
	return platform.system() == 'Windows'

def split_path(path):
	return os.path.split(path)

def run(func, delay):
	timer = threading.Timer(delay, func)
	timer.start()
	return timer

def read_file(path, mode='r'):
	r = None
	if os.path.exists(path):
		try:
			with open(path, mode) as f:
				r = f.read()
		except:
			cprint('read_file: failed tp read '+path, 'red')
	return r

# source: ChatGPT
# returns what func printed to the console if it did, otherwise its return value
def capture_console_output(func, *args):
	output_buffer = io.StringIO()
	original_stdout = sys.stdout
	try:
		sys.stdout = output_buffer
		return_value = func(*args)
	finally:
		sys.stdout = original_stdout
	captured_output = output_buffer.getvalue()
	output_buffer.close()
	if captured_output:
		return captured_output
	else:
		return return_value

async def check_loop(check_func, timeout, *args):
	wait = 0
	while wait < timeout:
		r = await check_func(*args)
		if r: return True
		await asyncio.sleep(1)
		wait += 1
	return False

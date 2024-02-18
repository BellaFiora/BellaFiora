import os, threading, platform, io, sys, asyncio, time
from .print import cprint
from .constants import measure_time


def from_windows():
	return platform.system() == "Windows"


def split_path(path):
	return os.path.split(path)


def run(func, delay):
	timer = threading.Timer(delay, func)
	timer.start()
	return timer


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
		if r:
			return True
		await asyncio.sleep(1)
		wait += 1
	return False


class TimeIt:
	def __init__(self):
		self.time = 0
		self.measured = 0

	def timeit(self, func, *args):
		st = time.time()
		r = func(*args)
		self.time += time.time() - st
		self.measured += 1
		return r

	def time_spent_measuring(self):
		return measure_time * self.measured

	def time_spent_waiting(self):
		return self.time - self.time_spent_measuring()

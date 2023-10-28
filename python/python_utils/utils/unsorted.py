import re
try:
	from bs4 import BeautifulSoup
except:
	os.system('pip install beautifulsoup4')
	from bs4 import BeautifulSoup

# allows for indent_width with BeautifulSoup.prettify
# source : https://stackoverflow.com/a/15513483
orig_prettify = BeautifulSoup.prettify
r = re.compile(r'^(\s*)', re.MULTILINE)
def prettify(self, encoding=None, formatter="minimal", indent_width=4):
	return r.sub(r'\1' * indent_width, orig_prettify(self, encoding, formatter))
BeautifulSoup.prettify = prettify
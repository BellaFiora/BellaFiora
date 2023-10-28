class str(str):
	def finds(self, substring):
		start = 0
		indices = []
		while True:
			index = self.find(substring, start)
			if index == -1:
				break
			indices.append(index)
			start = index + len(substring)
		return indices
	def to_octal(self):
		r = ''
		for c in self:
			r += '\\'+oct(ord(c))[2:]
		return r
	def to_int(self):
		try:
			return int(self)
		except:
			return None
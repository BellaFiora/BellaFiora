# user defined
CC=gcc
CFLAGS=-Wall -Wextra
LDLIBS=-lcurl -lpthread #-lodbc
SRC_DIRS=src c_utils/src jansson-2.14/src beatmap_parser/src
O_DIR=obj
EXE=bin/bm_manager

# automatic
C_FILES=$(foreach dir,$(SRC_DIRS),$(wildcard $(dir)/*.c))
O_FILES=$(C_FILES:%.c=$(O_DIR)/%.o)
$(shell mkdir -p bin)
$(shell mkdir -p obj)

# rules for main and test binaries
bin: obj/main.o $(O_FILES)
	$(CC) $(CFLAGS) -o $(EXE) $^ $(LDLIBS)
test: obj/test.o $(O_FILES)
	$(CC) $(CFLAGS) -o $(EXE) $^ $(LDLIBS)

# rules for main and test src files
$(O_DIR)/main.o: main.c
	$(CC) $(CFLAGS) -c -o $@ $<
$(O_DIR)/test.o: test.c
	$(CC) $(CFLAGS) -c -o $@ $<

# rules for src files
$(O_DIR)/%.o: %.c
	@mkdir -p $(shell dirname $@)
	$(CC) $(CFLAGS) -c -o $@ $<

clean:
	rm -rf obj bin

.PHONY: bin test clean

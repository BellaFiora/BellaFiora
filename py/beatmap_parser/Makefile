# user defined
CC=gcc
CFLAGS=-Wall -Wextra -Wno-unused-parameter
C_DIR=src
O_DIR=obj
LIB_C_FILES=../c_utils/src/list.c
EXE=bin/bm_parser.exe

# automatic
SRC_FILES=$(wildcard $(C_DIR)/*.c)
SRC_FILES_FILENAMES=$(basename $(notdir $(filter %.c,$(SRC_FILES))))
C_FILES=$(SRC_FILES_FILENAMES:%=$(C_DIR)/%.c)
C_FILES+=$(LIB_C_FILES)
O_FILES=$(SRC_FILES_FILENAMES:%=$(O_DIR)/%.o)
LIB_FILES_FILENAMES=$(basename $(notdir $(filter %.c,$(LIB_C_FILES))))
O_FILES+=$(LIB_FILES_FILENAMES:%=$(O_DIR)/libs/%.o)
$(shell mkdir -p bin)
$(shell mkdir -p obj/libs)

# rules for main and test binaries
bin: obj/main.o $(O_FILES)
	$(CC) $(CFLAGS) -o $(EXE) $^
test: obj/test.o $(O_FILES)
	$(CC) $(CFLAGS) -o $(EXE) $^

# rules for main and test src files
obj/main.o: main.c
	$(CC) $(CFLAGS) -c $< -o $@
obj/test.o: test.c
	$(CC) $(CFLAGS) -c $< -o $@

# rules for src and lib src files
obj/%.o: src/%.c
	$(CC) $(CFLAGS) -c $< -o $@
obj/libs/%.o: $(sort $(dir $(LIB_C_FILES)))/%.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -rf obj bin

.PHONY: bin test clean
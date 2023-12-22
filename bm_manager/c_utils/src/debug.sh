# Duplicate source file
fo1="debug.c"
f1="_$fo1"
pat1="^([a-zA-Z_*]+ ?[a-zA-Z_* ]*) ([^_][^
 (]+)\(const char\* name, ([^{]*)\)[
 ]*\{"
pat2="^(.*)printf\((.*), name(.*)$"
start1=12
head -n "$start1" "$f1" | tail -n +4 - > "$fo1" && echo -e "#ifdef DBG_VAR_NAME /* ---------- WITH VARIABLE NAME IN DBG_PREFIX  ----------*/\n" >> "$fo1" && tail -n +"$(($start1+1))" "$f1" | head -n -2 - >> "$fo1" && echo -e "\n#else /* ---------- WITHOUT VARIABLE NAME IN DBG_PREFIX  ----------*/" >> "$fo1"
sub=""
while IFS='' read -r line; do
    if [[ "$line" =~ $pat1 ]]; then
        sub+="${BASH_REMATCH[1]} ${BASH_REMATCH[2]}(${BASH_REMATCH[3]}) {
"
    elif [[ "$line" =~ $pat2 ]]; then
        sub+="${BASH_REMATCH[1]}printf(${BASH_REMATCH[2]}${BASH_REMATCH[3]}
"
    else
        sub+="$line
"
    fi
done <<< $(tail -n +"$start1" "$f1")
echo -n "$sub" >> "$fo1"

# Duplicate header file
fo2="debug.h"
f2="_$fo2"
pat1="^([a-zA-Z_*]+ ?[a-zA-Z_* ]*) ([^_][^
 (]+)\(const char\* name, ([^;]*)\);$"
pat2="^(.*)default: (.+)\)\((.*)\)$"
start2=15
head -n "$start2" "$f2" | tail -n +4 - > "$fo2" && echo -e "#ifdef DBG_VAR_NAME /* ---------- WITH VARIABLE NAME IN DBG_PREFIX  ----------*/\n" >> "$fo2" && tail -n +"$(($start2+1))" "$f2" | head -n -3 - >> "$fo2" && echo "#else /* ---------- WITHOUT VARIABLE NAME IN DBG_PREFIX  ----------*/" >> "$fo2"
sub=""
while IFS='' read -r line; do
    if [[ "$line" =~ $pat1 ]]; then
        sub+="${BASH_REMATCH[1]} ${BASH_REMATCH[2]}(${BASH_REMATCH[3]});
"
    elif [[ "$line" =~ $pat2 ]]; then
        args=$(echo "${BASH_REMATCH[3]}" | cut -f2- -d\ )
        sub+="${BASH_REMATCH[1]}default: ${BASH_REMATCH[2]})($args)
"
    else
        sub+="$line
"
    fi
done <<< $(tail -n +"$start2" "$f2")
echo -n "$sub" >> "$fo2"

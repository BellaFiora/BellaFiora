find . -type f -name *.c -exec clang-format -i {} ;
find . -type f -name *.h -exec clang-format -i {} ;
find . -type f -name *.js -exec clang-format -i {} ;
black . -t py312
for /r %%f in (*.py) do (
    unexpand --first-only -t 4 "%%f" > tmp && move /y tmp "%%f"
)
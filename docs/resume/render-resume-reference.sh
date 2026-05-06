#!/bin/zsh
set -euo pipefail

input_file=${1:-daniel-j-haight-resume-v3-complete.md}
output_file=${2:-${input_file:r}.pdf}

pandoc "$input_file" \
  -o "$output_file" \
  --pdf-engine=xelatex \
  --lua-filter=resume-reference-style.lua \
  --include-in-header=resume-reference-style.tex \
  -V documentclass=extarticle \
  -V classoption=8pt \
  -V colorlinks=false \
  -V papersize=letter
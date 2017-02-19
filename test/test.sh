#!/bin/sh
#
# kjolley
# squalor heights, ca, usa
# !date
#
me=$( basename "${0}" )

host="127.0.0.1"
port="8889"
#host="randomcountry.jamulheavyindustries.com"
#port="https"

dir=$( dirname "${0}" )
head="${dir}/${me}.head"
body="${dir}/${me}.body"

BODYBYTES="$(wc -c < "${body}"|sed 's/$/-1/'|bc)"

cat "${head}" "${body}"                   \
| sed -e "s/__BODYBYTES__/${BODYBYTES}/"  \
      -e "s/__HOST__/${host}/"            \
| nc "${host}" "${port}"

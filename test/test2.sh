#!/bin/sh
#
# kjolley
# squalor heights, ca, usa
# !date
#
me=$( basename "${0}" | tr -d "2" )

host="127.0.0.1"
port="8889"
#host="randomcountry.jamulheavyindustries.com"
#port="https"
post="alexa"

#tomorrow="$(echo "$(date -j -f "%a %b %d %T %Z %Y" "$(date)" "+%s") + 24*60*60"|bc)"

dir="$( dirname "${0}" )"
head="${dir}/${me}.head"
body="${dir}/${me}.body"
cert="$( awk '/^SignatureCertChainUrl:/{print $2}' ${body} )"

#curl -d "@${body}" -E "${cert}" "http://${host}:${port}/${post}"

curl  -H "Content-Type: application/json"                                                 \
      -H "SignatureCertChainUrl: https://s3.amazonaws.com/echo.api/echo-api-cert-2.pem"   \
      -H "Signature: OMEN68E8S0H9vTHRBVQMmWxeXLV8hpQoodoU6NdLAUB12BjGVvOAgCq7LffPDKCW7zXI6wRc3dx0pklYWqZHXbNsMfx8xSN3lqJTYw6zLZGwt2MgcjajHa1AnMbTnZOjrq9WPZuFG0pyJj9ucKB0w/k4r123vOLzVI0pEISo3WTIDsfKMycIpGiNcDHdJIc2LQGG5Bum9TFJuUllpt5c5LQC9g1rKIS2nj55QCQ8a3EeeqDe3N85Sw6OT7k7oPkKVLPee5fAWfkQQqW1fmA7sGIWKDpVTi1Jq46I2MiJM+48m+rxOVEPXky3j8u8+lPWg6vOnKogoXTb52foAurmAA==" \
      -X "POST" -d "@${body}" "http://${host}:${port}/${post}"

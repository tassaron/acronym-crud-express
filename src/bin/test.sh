# Some simple tests of the /acronym endpoint

GET () {
    curl $1
}


POST200 () {
    curl --header "Content-Type: application/json" -s \
    --request POST \
    --data "$1" \
    127.0.0.1:3000/acronym | jq -r .id
}


POST400 () {
    curl --header "Content-Type: application/json" \
    --request POST \
    --data '{ "acronym": 200, "definition": "this! is! bad data!" }' \
    127.0.0.1:3000/acronym
}


PATCH200 () {
    curl --header "Content-Type: application/json" \
    --request PATCH \
    --data '{ "acronym": "LOL", "definition": "laugh out loud" }' \
    127.0.0.1:3000/acronym/$1
}


newline () {
    echo -e "\n----\n\n"
}


main () {
    echo "GET 127.0.0.1:3000/acronym"
    GET 127.0.0.1:3000/acronym
    newline
    echo "GET 127.0.0.1:3000/acronym?search=LOL"
    GET "127.0.0.1:3000/acronym?search=LOL"
    newline
    echo "POST 127.0.0.1:3000/acronym [Add LOL acronym (400)]"
    POST400
    newline
    echo "POST 127.0.0.1:3000/acronym [Add LOL acronym (200)]"
    uuid=$(POST200 '{ "acronym": "LOL", "definition": "lots of love" }')
    newline
    echo "GET 127.0.0.1:3000/acronym?search=LOL"
    GET "127.0.0.1:3000/acronym?search=LOL"
    newline
    echo "PATCH 127.0.0.1:3000/acronym/$uuid [Patch LOL acronym (200)]"
    PATCH200 $uuid
    newline
    echo "GET 127.0.0.1:3000/acronym?search=LOL"
    GET "127.0.0.1:3000/acronym?search=LOL"
    newline
    echo "DELETE 127.0.0.1:3000/acronym/$uuid [Delete LOL acronym (200)]"
    curl -X "DELETE" 127.0.0.1:3000/acronym/$uuid
    newline
    echo "GET 127.0.0.1:3000/acronym?search=LOL"
    GET "127.0.0.1:3000/acronym?search=LOL"
    newline
    echo "Adding 3 more acronyms..."
    POST200 '{ "acronym": "2B", "definition": "to be" }' > /dev/null
    POST200 '{ "acronym": "2EZ", "definition": "too easy" }' > /dev/null
    POST200 '{ "acronym": "2G2BT", "definition": "too good to be true" }' > /dev/null
    newline
    echo "GET 127.0.0.1:3000/acronym?search=2B&page=2&limit=2 [return 1 result]"
    GET "127.0.0.1:3000/acronym?search=2&page=2&limit=2"
    newline
    echo "GET 127.0.0.1:3000/acronym?search=2&page=1&limit=2 [return 2 results]"
    GET "127.0.0.1:3000/acronym?search=2&page=1&limit=2"
    newline
    echo "GET 127.0.0.1:3000/acronym?search=2&limit=1 [return 1 result]"
    GET "127.0.0.1:3000/acronym?search=2&limit=1"
    newline
    echo "GET 127.0.0.1:3000/acronym?search=2&limit=1 [return 1 result]"
    GET "127.0.0.1:3000/acronym?search=2&limit=1"
    newline
    echo "GET 127.0.0.1:3000/acronym?search=2B [return 2 results]"
    GET "127.0.0.1:3000/acronym?search=2B"
    newline
    echo "GET 127.0.0.1:3000/acronym?search=2 [return 3 results]"
    GET "127.0.0.1:3000/acronym?search=2"
    newline
}


main
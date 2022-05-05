# Some simple tests of the /acronym endpoint

GET () {
    curl $1
}


POST200 () {
    curl --header "Content-Type: application/json" \
    --request POST \
    --data '{ "acronym": "LOL", "definition": "lots of love" }' \
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
    uuid=$(POST200)
    echo $uuid
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
    POST200; POST200; POST200
    echo "GET 127.0.0.1:3000/acronym?search=LOL&page=2&limit=2"
    GET "127.0.0.1:3000/acronym?search=LOL&page=2&limit=2"
    newline
    echo "GET 127.0.0.1:3000/acronym?search=LOL&page=1&limit=2"
    GET "127.0.0.1:3000/acronym?search=LOL&page=1&limit=2"
    newline
    echo "GET 127.0.0.1:3000/acronym?search=LOL&limit=1"
    GET "127.0.0.1:3000/acronym?search=LOL&limit=1"
    newline
}


main
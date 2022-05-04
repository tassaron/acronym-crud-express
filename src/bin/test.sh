# Some simple tests of the /acronym endpoint

GET () {
    curl $1
}


POST200 () {
    curl --header "Content-Type: application/json" \
    --request POST \
    --data '{ "acronym": "LOL", "definition": "lots of love" }' \
    127.0.0.1:3000/acronym
}


POST400 () {
    curl --header "Content-Type: application/json" \
    --request POST \
    --data '{ "acronym": 200, "definition": "this! is! bad data!" }' \
    127.0.0.1:3000/acronym
}


newline () {
    echo -e "\n----\n\n"
}


main () {
    echo "GET 127.0.0.1:3000/acronym"
    GET 127.0.0.1:3000/acronym
    newline
    echo "POST 127.0.0.1:3000/acronym [Add LOL acronym (200)]"
    POST200
    newline
    echo "POST 127.0.0.1:3000/acronym [Add LOL acronym (400)]"
    POST400
    newline
}


main
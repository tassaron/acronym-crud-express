# Acronym CRUD REST API LOL
Create, read, update, delete acronym definitions using a simple ExpressJS REST API.

Uses ES6 modules and a flatfile "database" made of JSON files (with adaptor layer so it can upgraded later).

# Dependencies
* Unix system
* Node
* npm
* ExpressJS

## Dev dependencies
* Babel
* Jest
* **To run test shell script:**
  * Bash
  * curl
  * jq

## Development
* `npm run dev` to clean, build, and run the server one time
* `npm run watch` to develop while watching source code for changes
* `npm test` to run test suite using Jest
* `npm test-sh` to build & start server, then run a few simple tests with curl

## Production
* `npm start` to start the server in production mode
* This is alpha/example software, not really for production

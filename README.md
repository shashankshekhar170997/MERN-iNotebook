This is MERN project iNoteBook Where any user can store their personal info onto the cloud

Created one more folder of Backend in same file.

- install express - Node js web framework for creating Apis and setup middleware
- install mongoose - for database
- index.js is entry file.
- db.js file for connection with data base
  (in db file first i will import mongoos then set URI of mongoDB after i will create a function to make a connection for DB, their is a method mongoose.connect(it will take mongoDB URI and handle the function with promises)).
  now export it module.export = nameofFunction()

  - in index.js import that function (const nameofFunction = require("./db))
  - then call this function nameofFuction()
  - now configure express js code for end point setup.

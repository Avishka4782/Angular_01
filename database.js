var sqlite3 = require('sqlite3').verbose()
var md5 = require('ts-md5')

const DBSOURCE = "db.sqlite"


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQlite database.')
        db.run(`CREATE TABLE customer (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            address text,
            email text,
            dateOfBirth text,
            gender text,
            age INTEGER,
            cardHolderName text,
            cardNumber INTEGER,
            expireDate text,
            cvv INTEGER,
            timeStamp TEXT DEFAULT (datetime('now', 'localtime'))
            )`, (err) => {
            if (err) {
                // Table already created
            } else {
                // Table just created, creating some rows
                var insert = 'INSERT INTO customer (name, address, email, dateOfBirth, gender, age, cardHolderName, cardNumber, expireDate, cvv) VALUES (?,?,?,?,?,?,?,?,?,?)'
                db.run(insert, ["A.D.Lakith Dharmasiri", "No 324/A Ra De Mel Road, Colombo", "lakith@gmail.com", "1991.02.25", "female", 28, "A.D.L.Dharamasiri", 102445217895, "12/2022", 246])
            }
        })

    }
})

module.exports = db
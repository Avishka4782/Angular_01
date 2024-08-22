var express = require("express");
var app = express();
var db = require("./database.js");
var bodyParser = require("body-parser");
const { request, response } = require("express");
const res = require("express/lib/response");
var validator = require("validator");

app.use(bodyParser.json());

let HTTP_PORT = 8080;

app.listen(HTTP_PORT, () => {
    console.log("Server is running on %PORT%".replace("%PORT%", HTTP_PORT))
});

app.post("/api/customer/", (req, res, next) => {

    try {
        var errors = []

        if (!req.body) {
            errors.push("An invalid input");
        }

        

        const { name,
            address,
            email, 
            dateOfBirth, 
            gender, 
            age, 
            cardHolderName, 
            cardNumber, 
            expireDate,
            cvv
        } = req.body;

        if (!validator.isEmail(email)) {
            errors.push("Invalid email address");
        }

        if (!validator.isLength(cardNumber, { min: 12, max: 12 }) || !validator.isNumeric(cardNumber)) {
            errors.push("Invalid card number. It should be 12 digits.");
        }

        if (errors.length) {
            res.status(400).json({ "error": errors.join(", ") });
            return;
        }

        var sql = `INSERT INTO customer (name, address, email, dateOfBirth, gender, age, cardHolderName, cardNumber, expireDate, cvv) VALUES (?,?,?,?,?,?,?,?,?,?)`;
        var params = [name, address, email, dateOfBirth, gender, age, cardHolderName, cardNumber, expireDate, cvv];
        db.run(sql, params, function (err, result) {

            if (err) {
                res.status(400).json({ "error": err.message })
                return;
            } else {
                var customerId = this.lastID;
                db.get(`SELECT * FROM customer WHERE id = ?`, [customerId], (err, row) => {
                    if (err) {
                        res.status(400).json({ "error": err.message });
                        return;
                    }
                    res.status(201).json({
                        "message": `customer ${name} has registered`,
                        "customerId": customerId
                    });
                });
            }

        });
    } catch (E) {
        res.status(400).send(E);
    }
});

app.get("/api/customer", (req, res, next) => {

    try {
        var sql = "select * from customer"
        var params = []
        db.all(sql, params, (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": rows
            })
        });
    } catch (E) {
        res.status(400).send(E);
    }
});

app.put("/api/customer/", (req, res, next) => {
    const {
        name,
        address,
        email, 
        dateOfBirth, 
        gender, 
        age, 
        cardHolderName, 
        cardNumber, 
        expireDate, 
        cvv,
        id
    } = req.body;

    db.run(`UPDATE customer set name = ?, address = ?, email = ?, dateOfBirth = ?,gender=?,age=?,cardHolderName=?,cardNumber=?,expireDate=?,cvv=?, timeStamp = datetime('now', 'localtime')  WHERE id = ?`,
        [name, address, email, dateOfBirth, gender, age, cardHolderName, cardNumber, expireDate, cvv, id],
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.status(200).json({ updated: this.changes });
        });
});

app.delete("/api/customer/delete/:id", (req, res, next) => {
    try {
        db.run('DELETE FROM customer WHERE id = ?',
            req.params.id,
            function (err, result) {
                if (err) {
                    res.status(400).json({ "error": res.message })
                    return;
                }
                res.json({ "message": "deleted", rows: this.changes })
            });
    } catch (E) {
        res.status(400).send(E)
    }

});

module.exports = app
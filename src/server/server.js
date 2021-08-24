const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const server = http.createServer(app);
const { Server } = require("socket.io")
const io = new Server(server)

const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://MarcLavergne:VyqKQWJUJs7Bdlh6@cluster0.muktw.mongodb.net/CipherDB?retryWrites=true&w=majority"
const mongo = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let dbo;

const fs = require("fs");
const jwt = require("jsonwebtoken"); //Using jwt for persistent login info
const secret = fs.readFileSync(path.join(__dirname, "secret.key"), "utf8");

MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    dbo = db.db("CipherDB");
    //let userObject = { name: "admin", email: "Marc_Lavergne@houston.nae.school", hash: "d82494f05d6917ba02f7aaa29689ccb444bb73f20380876cb05d1f37537b7892" };
    //dbo.collection("users").insertOne(userObject);
});

const port = 3000;

app.use(express.static("src/frontend/public"));

io.on("connection", (socket) => {
    console.log("connection");

    socket.on("login", (userData) => {
        dbo.collection("users").findOne({ name: userData.username }, (err, res) => { //find database entry with the same username as supplied
            if (res) { //Check if user exists
                if (res.hash == userData.hash) { //check if hashes match
                    let token = jwt.sign({ username: res.name }, secret, { expiresIn: "7d" }); //Create jwt for identification, logins only last 7 days

                    socket.emit("successful login", token);
                }
            }
        });
    });

    socket.on("verify token", (token) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                socket.emit("invalid token");
                console.log(token)
            }
            else {
                socket.emit("valid token", decoded)
            }
        });
    })
})


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/login.html"));
})

server.listen(port, () => {
    console.log(`Running on http://localhost:${port}`)
});
const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const server = http.createServer(app);
const { Server } = require("socket.io")
const io = new Server(server)

const fs = require("fs");
const jwt = require("jsonwebtoken"); //Using jwt for persistent login info
const secret = fs.readFileSync(path.join(__dirname, "secret.key"), "utf8");

const sanitizeHTML = require("sanitize-html");

const { MongoClient, ObjectId } = require("mongodb");
const uri = "mongodb+srv://MarcLavergne:VyqKQWJUJs7Bdlh6@cluster0.muktw.mongodb.net/CipherDB?retryWrites=true&w=majority"
const mongo = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let dbo;

MongoClient.connect(uri, function(err, db) { //Establish connection with DB
    if (err) throw err;
    dbo = db.db("CipherDB");
});

const port = 80;

app.use(express.static("/app/src/frontend/public"));

io.on("connection", (socket) => {
    console.log("Connection from", socket.handshake.address);

    socket.on("login", (userData) => {
        dbo.collection("users").findOne({ name: sanitizeHTML(userData.username) }, (err, res) => { //find database entry with the same username as supplied
            if (res) { //Check if user exists
                if (res.hash == userData.hash) { //check if hashes match
                    let token = jwt.sign({ username: sanitizeHTML(res.name) }, secret, { expiresIn: "7d" }); //Create jwt for identification, logins only last 7 days

                    socket.emit("successful login", token); //Give frontend the token
                }
            }
            console.log(err);
        });
    });

    socket.on("register", ({ name, email, hash}) => {
        dbo.collection("users").findOne({ name: sanitizeHTML(name) }, (err, res) => { //Res will be undefined if this user does not exist
            if (res != undefined) {
                console.log("tried to register account that already exists")
                socket.emit("invalid registration");
            }
            else { //Res was undefined, we can register this new user.
                dbo.collection("users").insertOne({ name: sanitizeHTML(name), email, hash}, (err, res) => {
                    console.log(name)
                    let token = jwt.sign({username: sanitizeHTML(name)}, secret, {expiresIn: "7d"});
                    socket.emit("successful login", token);
                })
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
    socket.on("submit new challenge", (challenge) => {
        dbo.collection("posts").insertOne(challenge, (err,res) => {
            if (err != undefined) {
                console.log(err)
            }
            else {
                socket.emit("load new post", challenge)
            }
        })
    })
    socket.on("load posts", () => {
        posts = []
        //https://stackoverflow.com/a/60323406/7320708
        dbo.collection("posts").find({}).toArray(function(err, result) {
            socket.emit("posts", result)
          });
    })
    socket.on("solved cipher", (id) => {
        dbo.collection("posts").deleteOne({"_id":ObjectId(id)}, (err, result) => {
            if (err) console.log(err)
            console.log(result)
          });
    })
})


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/register.html"));
});

server.listen(port, () => {
    console.log(`Running on http://localhost:${port}`)
});
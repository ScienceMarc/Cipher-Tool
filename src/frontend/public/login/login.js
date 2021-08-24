let socket = io();

socket.on("successful login", (token) => {
    window.localStorage.setItem("login", JSON.stringify(token));
    window.location.href = "../"
})

const app = Vue.createApp({
    data() {
        return {
            username: "",
            //email: "",
            password: ""
        }
    },
    methods: {
        submit () {
            let hash = sha256(this.username + this.password);
            //console.log(hash);
            socket.emit("login", {username: this.username, hash})
        }
    }
});
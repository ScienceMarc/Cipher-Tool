let socket = io();

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
            socket.emit("login", {username: this.username, hash})
        }
    },
    mounted() {
        socket.on("successful login", (token) => {
            window.localStorage.setItem("login", JSON.stringify(token));
            window.location.href = "../"
        })
    }
});
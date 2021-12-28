let socket = io();

const app = Vue.createApp({
    data() {
        return {
            username: "Not logged in",
            viewingCipherShare: false
        }
    },
    mounted() {
        socket.on("valid token", (decoded) => {
            this.username = decoded.username;
        });

        let login = window.localStorage.getItem("login");
        if (login) {
            let token = JSON.parse(login);

            socket.emit("verify token", token);

        }
    }
});
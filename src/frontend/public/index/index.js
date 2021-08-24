let socket = io();

const app = Vue.createApp({
    data() {
        return {
            username: "Not logged in"
        }
    },
    mounted() {
        let login = window.localStorage.getItem("login")
        if (login) {
            token = JSON.parse(login);

            console.log(token)
            socket.emit("verify token", token);

        }
    }
});

socket.on("valid token", (decoded) => {
    mountedApp.username = decoded.username;
})
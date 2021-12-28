app.component('cipher-share', {
    data() {
        return {
            loggedIn: false,
            username: "Hello"
        }
    },
    mounted() {
        socket.on("valid token", (decoded) => {
            this.username = decoded.username;
            this.loggedIn = true;


        });
        let login = window.localStorage.getItem("login");
        if (login) {
            let token = JSON.parse(login);

            socket.emit("verify token", token);

        }
    },
    template: /*html*/
    `
        <button>Create Post</button>
    `
})
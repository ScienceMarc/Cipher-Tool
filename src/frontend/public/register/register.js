let socket = io();


const app = Vue.createApp({
    data() {
        return {
            username: "",
            email: "",
            password: "",
            usernameTaken: false
        }
    },
    methods: {
        submit () {
            
            let hash = sha256(this.username + this.password);
            socket.emit("register", {name: this.username, email: this.email, hash})
        }
    },
    computed: {
        invalidEmail() {
            if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.email)) {
                return true;
            }
            else {
                return false;
            }
        }
    },
    mounted() {
        socket.on("successful login", (token) => {
            window.localStorage.setItem("login", JSON.stringify(token));
            window.location.href = "../"
        });

        socket.on("invalid registration", () => {
            this.usernameTaken = true;
            this.username = ""
        })
        
    }
});
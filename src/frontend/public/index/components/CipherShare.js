app.component('cipher-share', {
    data() {
        return {
            loggedIn: false,
            username: "test",
            posts: [
                {author:"Alice", time:0, ciphertext:"BCD", answer:"ABC", userAnswer:"", cipher: {name:"Caesar", shift:1, alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ"}},
                {author:"Bob", time:0, ciphertext:"ACB", answer:"ABC", userAnswer:"", cipher: {name:"Rail", rails: 2}},
                {author:"Carol", time:0, ciphertext:"LFO", answer:"ABC", userAnswer:"", cipher: {name:"Vigenère", key: "LEMON"}},
            ]

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
    methods: {
        getTimeSince(t) {
            let diff = new Date()
            diff = diff.getTime() - t;


            //couldn't think of a better way of approaching this short of using an external time library.
            if (diff < 1000 * 60) {
                return Math.floor(diff/(1000)) + " seconds"
            }
            if (diff < 1000 * 60 * 60) {
                return Math.floor(diff/(1000*60)) + " minutes"
            }
            if (diff < 1000*60*60*24) {
                return Math.floor(diff/(1000*60*60)) + " hours"
            }
            if (diff < 1000*60*60*24*7) {
                return Math.floor(diff/(1000*60*60*24)) + " days"
            }
            if (diff < 1000*60*60*24*30.437) {
                return Math.floor(diff/(1000*60*60*24)) + " weeks"
            }
            if (diff < 1000*60*60*24*365.2425) {
                return Math.floor(diff/(1000*60*60*24)) + " months"
            }

            return Math.floor(diff/(1000*60*60*24*365.2425)) + " years"
        },
        submit(answer) {
            alert(answer)
        } 
    },
    template: /*html*/
    `
        <div>
            <button class="full-button" v-if="loggedIn">Create Post</button>
            <div v-for="post in posts" class="post"> <!--Probably should be a seperate component-->
                <div v-if="post.cipher.name == 'Caesar'">
                    <div>Cipher: Caesar</div>
                    <div>Ciphertext: {{post.ciphertext}}</div>
                    <div>Alphabet: {{post.cipher.alphabet}}</div>
                    <div>Shift: {{post.cipher.shift}}</div>
                </div>
                <div v-if="post.cipher.name == 'Rail'">
                    <div>Cipher: Rail</div>
                    <div>Ciphertext: {{post.ciphertext}}</div>
                    <div>Rail count: {{post.cipher.rails}}</div>
                </div>
                <div v-if="post.cipher.name == 'Vigenère'">
                    <div>Cipher: Vigenère</div>
                    <div>Ciphertext: {{post.ciphertext}}</div>
                    <div>Key: {{post.cipher.key}}</div>
                </div>
                <div>Answer <input type="text" v-model="post.userAnswer"> <button @click="submit(post)">Submit</button></div>
                <div style="text-align: right;font-size: 0.8ch;position: absolute;bottom: 0;right: 0;">posted by {{post.author}} {{getTimeSince(post.time)}} ago</div>
            </div>
        </div>
    `
})
app.component('cipher-share', {
    data() {
        return {
            loggedIn: false,
            username: "test",
            posts: [ //Examples of each cipher. If the user sees these that means either the database or socket aren't working properly.
                {author:"Alice", time:0, ciphertext:"BCD", answer:"ABC", userAnswer:"", cipher: {name:"Caesar", shift:1, alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ"}},
                {author:"Bob", time:0, ciphertext:"ACB", answer:"ABC", userAnswer:"", cipher: {name:"Rail", rails: 2}},
                {author:"Carol", time:0, ciphertext:"LFO", answer:"ABC", userAnswer:"", cipher: {name:"Vigenère", key: "LEMON"}},
            ],
            showCreatePostMenu: false,
            newPost: {ciphertext:"", answer:"",cipher:{name:""}}

        }
    },
    mounted() {
        let login = window.localStorage.getItem("login");
        if (login) {
            let token = JSON.parse(login);

            socket.emit("verify token", token);
        }
        socket.on("valid token", (decoded) => {
            this.username = decoded.username;
            this.loggedIn = true;
        });
        socket.on("posts", posts => {
            this.posts = []
            for (let p of posts) {
                p.userAnswer = ""
                this.posts.push(p)
            }
            this.posts.sort((a,b) => (a.time < b.time) ? 1 : -1) //Sort posts in ascending age order
        })
        socket.emit("load posts")
        socket.on("load new post", post => {
            post.userAnswer = ""
            this.posts.push(post)
            this.posts.sort((a,b) => (a.time < b.time) ? 1 : -1) //Sort posts in ascending age order
        })
        socket.on("solved cipher", id => {
            for (let i = 0; i < this.posts.length; i++) {
                if (this.posts[i]._id == id) {
                    this.posts[i].cipher.name = "solved"
                    setTimeout(()=>{ //Removes the post after 5 seconds
                        this.posts.splice(i, 1);
                    }, 5000)
                }
            }
        })
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
        submitAnswer(answer) {
            if (answer.userAnswer == answer.answer) {
                socket.emit("solved cipher", answer._id)
                answer.cipher.name = "solved" //Simplest way to congradulate the user that I could think of
            }
        },
        submitNewPost(np) {
            np.author = this.username
            np.time = new Date().getTime()
            socket.emit("submit new challenge",np)
            this.posts.push(np)
            //clear and erase post creation window upon submission
            this.newPost = {ciphertext:"", answer:"",cipher:{name:""}}
            this.showCreatePostMenu = false
        },
    },
    template: /*html*/
    `
        <div>
            <!--TODO: work out if a post is valid. Not enough time to implement something like that-->
            <button class="full-button" v-if="loggedIn" @click="showCreatePostMenu = !showCreatePostMenu">Create Post</button>
            <div v-show="showCreatePostMenu">
                Plain text <input v-model="newPost.answer"> <br>
                Cipher text <input v-model="newPost.ciphertext"> <br>
                <label for="ciphers">Cipher </label>
                <select v-model="newPost.cipher.name" id="ciphers">
                    <option value="Caesar">Caesar</option>
                    <option value="Rail">Rail</option>
                    <option value="Vigenère">Vigenère</option>
                </select>
                <div v-if="newPost.cipher.name == 'Caesar'">
                    Shift amount <input v-model="newPost.cipher['shift']" type="number" min='0' max='25'>
                    Alphabet <input v-model="newPost.cipher['alphabet']" type="text">
                </div>
                <div v-if="newPost.cipher.name == 'Rail'">
                    Rails <input v-model="newPost.cipher['rails']" type="number" min='2' max='20'>
                </div>
                <div v-if="newPost.cipher.name == 'Vigenère'">
                    Key <input v-model="newPost.cipher['key']" type="text">
                </div>
                <!--This button has a monsterous condition that should be moved somewhere else-->
                <button v-if="((typeof newPost.cipher.shift == 'number') && newPost.cipher.alphabet != undefined) || newPost.cipher.rails || newPost.cipher.key" @click="submitNewPost(newPost)">Submit</button>
            </div>
            
            
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
                <div v-if="post.cipher.name == 'solved'">
                    <h1>Solved</h1>
                </div>
                <div>Answer <input type="text" v-model="post.userAnswer"> <button @click="submitAnswer(post)">Submit</button></div>
                <div style="text-align: right;font-size: 0.8ch;position: absolute;bottom: 0;right: 0;">posted by {{post.author}} {{getTimeSince(post.time)}} ago</div>
            </div>
        </div>
    `
})
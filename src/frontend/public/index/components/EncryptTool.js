app.component('encrypt-tool', {
    data() {
        return {
            step: 0,
            inputText: "Sphinx of black quartz, judge my vow",
            outputText: "",
            algos: ["Caesar", "Rail", "Vigenère"],
            algo: "Vigenère",
            isAnimating: false,
            skip: false,
            isComplete: false,

            caesar: { currentLetter: 0, shift: 25, alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" },
            rail: { railCount: 3 },
            vigenere: { alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", key: "lemon"}
        }
    },
    methods: {
        resetCipher() {
            //General variables
            this.step = 0;
            this.isAnimating = false;
            this.outputText = "";
            this.isComplete = false
            this.skip = false

            //Cipher specific settings.
            this.caesar = { currentLetter: 0, shift: 25, alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" }
            this.rail = { railCount: 3 }
            this.vigenere = { alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", key: "lemon"}
        }
    },
    mounted() {
        let that = this; //This confusing variable is the recommended way to fix a bug in the ES6 JavaScript standard to do with changes in scope
        const script = function (p5) { //Using p5.js for canvas control.
            t = 0;
            let animationTriggered = false;
            p5.setup = () => {
                p5.createCanvas(p5.windowWidth / 2 - 20, (p5.windowWidth / 2 - 20) * 0.7);
                p5.textAlign(p5.CENTER);
                p5.textSize(16);
            }
            p5.draw = () => {
                if (that.isAnimating) {
                    if (Math.floor(p5.millis() / 100) % 5 == 0) { //Auto stepping with play button 
                        if (!animationTriggered) {
                            that.step++;
                            animationTriggered = true;
                        }
                    }
                    else {
                        animationTriggered = false;
                    }
                }

                if (that.skip && !that.isComplete) { //The fast forward butten moves one step per frame
                    that.step++;
                }

                p5.background("azure");
                
                if (that.algo == "Caesar") {
                    caesar(that, p5);
                }
                else if (that.algo == "Rail") {
                    rail(that, p5);
                }
                else if (that.algo == "Vigenère") {
                    vigenere(that, p5);
                }

                p5.text("Output text: " + that.outputText, p5.width / 2, p5.height * 0.95)
            }
            p5.windowResized = () => {
                p5.createCanvas(p5.windowWidth / 2 - 20, (p5.windowWidth / 2 - 20) * 0.7);
            }
        }
        new p5(script)

    },
    template: /*html*/
        `
    <div>
        <div class="float-child">
            <main></main>
            <!--playback controls-->
            <div class="controls">
                <button @click="resetCipher()"><i class="material-icons">fast_rewind</i></button>
                <button @click="isAnimating = !isAnimating"><i class="material-icons">{{isAnimating ? 'pause' : 'play_arrow'}}</i></button>
                <button><i class="material-icons" @click="step+= !isComplete">arrow_right</i></button> <!--Kind of a hack-->
                <button><i class="material-icons" @click="skip = true">fast_forward</i></button>
            </div>
        </div>
        <div class="float-child">
            Cipher: 
            <select v-model="algo" @change="resetCipher()">
                <option v-for="a in algos">{{a}}</option>
            </select><br>
            Input text: <input v-model="inputText" placeholder="Input any text" :style="{ width:inputText.length + 1 + 'ch'}" class="textInput" @change="resetCipher()">
            <div v-show="algo">{{algo}} cipher options:<br>
                <div v-if="algo == 'Caesar'">
                    Shift amount: <input v-model="caesar.shift" type="number" min="0" :max="caesar.alphanumeric ? 36-1 : 26-1"><br>
                    Alphabet: <input v-model="caesar.alphabet" :style="{ width:caesar.alphabet.length + 1 + 'ch'}" class="textInput">
                </div>
                <div v-if="algo == 'Rail'">
                    Rail count: <input v-model="rail.railCount" type="number" min="2" max="10"><br>
                </div>
                <div v-if="algo == 'Vigenère'">
                    Key: <input v-model='vigenere.key' :style="{ width:Math.max(5, vigenere.key.length + 1) + 'ch'}" class="textInput">
                </div>
            Output: <pre>{{outputText}}</pre>
            </div>
        </div>
    </div>
    `
})
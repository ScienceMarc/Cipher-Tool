app.component('encrypt-tool', {
    data() {
        return {
            step: 0,
            inputText: "",
            outputText: "",
            algos: ["Caesar", "Rail", "Morse"],
            algo: "Caesar",
            isAnimating: false,

            caesar: { currentLetter: 0, shift: 0, numeric: false }
        }
    },
    methods: {
        resetCipher() {
            this.step = 0;
            this.isAnimating = false;
            this.outputText = "";
        }
    },
    mounted() {
        let that = this; //This line of code broke me. It's necessary because what 'this' refers to changes on the next line.
        const script = function (p5) { //Using p5.js for canvas control.
            let t = 0;
            let animationTriggered = false;
            p5.setup = () => {
                p5.createCanvas(p5.windowWidth / 2 - 20, (p5.windowWidth / 2 - 20) * 0.7);
                p5.textAlign(p5.CENTER);
                p5.textSize(16);
            }
            p5.draw = () => {
                if (that.isAnimating) {
                    if (p5.second() % 3 == 0) {
                        if (!animationTriggered) {
                            that.step++; 
                            animationTriggered = true;
                        }
                    }
                    else {
                        animationTriggered = false;
                    }
                }

                p5.background("darkgray");
                p5.text("Input text: " + that.inputText, p5.width / 2, p5.height * 0.1)

                if (that.algo == "Caesar") {
                    p5.push();
                    p5.textSize(10);

                    p5.push()
                    p5.textAlign(p5.RIGHT);
                    p5.text("Step " + (that.step + 1), p5.width - 5, 15);
                    p5.pop()

                    alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    switch (that.step % 3) {
                        case 0:
                            for (let i = 0; i < alpha.length; i++) {
                                p5.rect((i) * (p5.width / alpha.length), p5.height * 0.4 - 12, (p5.width / alpha.length), 15)
                                p5.text(alpha[i], (i + 0.5) * (p5.width / alpha.length), p5.height * 0.4);
                            }
                            for (let i = 0; i < alpha.length * 2; i++) {
                                p5.rect((i) * (p5.width / alpha.length), p5.height * 0.4 + 3, (p5.width / alpha.length), 15)
                                p5.text(alpha[i % alpha.length], (i + 0.5) * (p5.width / alpha.length), p5.height * 0.4 + 15);
                            }
                            break;
                        case 1:
                            for (let i = 0; i < alpha.length; i++) {
                                p5.rect((i) * (p5.width / alpha.length), p5.height * 0.4 - 12, (p5.width / alpha.length), 15)
                                p5.text(alpha[i], (i + 0.5) * (p5.width / alpha.length), p5.height * 0.4);
                            }
                            for (let i = 0; i < alpha.length * 2; i++) {
                                p5.rect((i - t) * (p5.width / alpha.length), p5.height * 0.4 + 3, (p5.width / alpha.length), 15)
                                p5.text(alpha[i % alpha.length], (i - t + 0.5) * (p5.width / alpha.length), p5.height * 0.4 + 15);
                            }
                            if (t < that.caesar.shift) {
                                t += 0.1;
                            }
                    }
                    p5.pop();
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
            <!--controls-->
            <div class="controls">
                <button><i class="material-icons">fast_rewind</i></button>
                <button><i class="material-icons">arrow_left</i></button>
                <button @click="isAnimating = !isAnimating"><i class="material-icons">{{isAnimating ? 'pause' : 'play_arrow'}}</i></button>
                <button><i class="material-icons" @click="step++">arrow_right</i></button>
                <button><i class="material-icons">fast_forward</i></button>
            </div>
        </div>
        <div class="float-child">
            Input text: <input v-model="inputText" placeholder="Input any text">
            Cipher: 
            <select v-model="algo">
                <option v-for="a in algos">{{a}}</option>
            </select>
            <div v-show="algo">{{algo}} cipher options:<br>
                <div v-if="algo == 'Caesar'">
                    Shift amount: <input v-model="caesar.shift" type="number" min="0" :max="caesar.alphanumeric ? 36-1 : 26-1"><br>
                    Shift numbers? <input v-model="caesar.numeric" type="checkbox"><br>
                </div>
            </div>
        </div>
    </div>
    `
})
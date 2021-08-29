app.component('encrypt-tool', {
    data() {
        return {
            step: 0,
            inputText: "",
            algos: ["Caesar", "Rail", "Morse"],
            algo: ""
        }
    },
    mounted() {
        let that = this; //This line of code broke me. It's necessary because what 'this' refers to changes on the next line.
        const script = function(p5) { //Using p5.js for canvas control.
            p5.setup = () => {
                p5.createCanvas(500,350);
                console.log(that)
            }
            p5.draw = () => {
                p5.background("darkgray");
                p5.text(that.inputText,p5.width/2,50)
            }
        }
        new p5(script)

    },
    template: /*html*/
    `
    <main class="float-child"></main>
    <div class="float-child">
        Input text: <input v-model="inputText" placeholder="Input any text">
        Cipher: 
        <select v-model="algo">
            <option v-for="a in algos">{{a}}</option>
        </select>
    </div>
    `
})
//TODO: Add support for numbers
//TODO: Lock inputs so that the algorithm doesn't do strange things.
function caesar(that, p5) {
    p5.text("Input text: " + that.inputText, p5.width / 2, p5.height * 0.1)
    p5.push();
    p5.textSize(10);

    p5.push()
    p5.textAlign(p5.RIGHT);
    p5.text("Step " + (that.step + 1), p5.width - 5, 15);
    p5.pop()
    let alpha = that.caesar.alphabet.toUpperCase();

    //The caesar cipher was not designed for non alphabetical characters, therefore I am removing them.
    that.inputText = that.inputText.toUpperCase();
    for (let i = 0; i < that.inputText.length; i++) {
        if (!alpha.includes(that.inputText[i])) {
            that.inputText = that.inputText.replace(that.inputText[i],'');
        }
    }

    if (that.step == 0) {
        t = 0;
        for (let i = 0; i < alpha.length; i++) {
            //These p5.rect and p5.text functions are being used to draw the text boxes for the ciphers
            //Due to the unknown size of the cipher window, relative positions must be used with a lot fine tuned values.
            p5.rect((i) * (p5.width / alpha.length), p5.height * 0.4 - 12, (p5.width / alpha.length), 15)
            p5.text(alpha[i], (i + 0.5) * (p5.width / alpha.length), p5.height * 0.4);
        }
        for (let i = 0; i < alpha.length * 2; i++) {
            p5.rect((i) * (p5.width / alpha.length), p5.height * 0.4 + 3, (p5.width / alpha.length), 15)
            p5.text(alpha[i % alpha.length], (i + 0.5) * (p5.width / alpha.length), p5.height * 0.4 + 15);
        }
    }
    else if (that.step == 1) {
        for (let i = 0; i < alpha.length; i++) {
            p5.rect((i) * (p5.width / alpha.length), p5.height * 0.4 - 12, (p5.width / alpha.length), 15)
            p5.text(alpha[i], (i + 0.5) * (p5.width / alpha.length), p5.height * 0.4);
        }
        for (let i = 0; i < alpha.length * 2; i++) {
            p5.rect((i - t) * (p5.width / alpha.length), p5.height * 0.4 + 3, (p5.width / alpha.length), 15)
            p5.text(alpha[i % alpha.length], (i - t + 0.5) * (p5.width / alpha.length), p5.height * 0.4 + 15);
        }
        if (t < that.caesar.shift) { //The t variable controls the animation movement
            t += 0.25;
        }
        else { //Hide floating point errors
            t = Math.round(t);
        }
    }
    else if (that.caesar.currentLetter != that.inputText.length) {
        p5.push();
        p5.textSize(20)
        for (let i = 0; i < that.inputText.length; i++) {
            p5.push()
            if (that.caesar.currentLetter == i) { p5.fill('red') } //Highlight current letter red
            p5.rect((i - that.inputText.length / 2 - 0.5) * 18 + p5.width / 2, p5.height * 0.3 - 16, 18, 20);
            p5.pop()
            p5.text(that.inputText[i], (i - that.inputText.length / 2) * 18 + p5.width / 2, p5.height * 0.3);
        }
        p5.pop();
        //These loops are essentially linear searches through the alphabet and inputText strings
        for (let i = 0; i < alpha.length; i++) {
            p5.push();
            //This complicated condition was the best I could come up with due to the unknowable nature of the number of steps.
            if (that.inputText[that.caesar.currentLetter].toUpperCase() == alpha[i] && (that.step - 2) % 4 >= 1) {
                p5.fill('red');
            }

            p5.rect((i) * (p5.width / alpha.length), p5.height * 0.4 - 12, (p5.width / alpha.length), 15)
            p5.pop();

            p5.text(alpha[i], (i + 0.5) * (p5.width / alpha.length), p5.height * 0.4);
        }
        let selectedLetter = ""
        for (let i = 0; i < alpha.length * 2; i++) {
            p5.push();
            if (that.inputText[that.caesar.currentLetter].toUpperCase() == alpha[i - that.caesar.shift] && (that.step - 2) % 4 >= 2) {
                p5.fill('red');
                selectedLetter = alpha[i % alpha.length];
            }
            p5.rect((i - that.caesar.shift) * (p5.width / alpha.length), p5.height * 0.4 + 3, (p5.width / alpha.length), 15)
            p5.pop()

            p5.text(alpha[i % alpha.length], (i - that.caesar.shift + 0.5) * (p5.width / alpha.length), p5.height * 0.4 + 15);
        }
        if ((that.step - 2) % 4 == 3 && that.outputText.length < (that.step - 4) / 4) {
            that.outputText += selectedLetter;
            that.caesar.currentLetter++;
            that.step++;
            
        }
    }
    else {
        that.isComplete = true;
        p5.push();
        p5.textSize(20);
        p5.text("Finished", p5.width / 2, p5.height / 2);
        p5.pop();
    }
    p5.pop();

}
//TODO: Lock inputs
function vigenere(that, p5) {
    p5.push();
    p5.textSize(10);
    
    p5.push()
    p5.textAlign(p5.RIGHT);
    p5.text("Step " + (that.step + 1), p5.width - 5, 15);
    p5.pop()
    that.vigenere.key = that.vigenere.key.toUpperCase().replace(/[^A-Z]/, "");
    that.inputText = that.inputText.toUpperCase().replace(/[^A-Z]/, "");
    let key = that.vigenere.key;
    let input = that.inputText;
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
    //This square variable is used as a unit for all aspects related to the grids
    let square = (p5.width / alphabet.length) * 0.5;

    if (that.step == 0) {
        p5.textSize(square);

        highlightKey(-1, p5, alphabet, key)
        highlightInput(-1, p5, input)
        p5.translate(p5.width * 0.4, p5.height * 0.2);

        for (let i = 0; i < alphabet.length; i++) {
            p5.push();
            p5.fill("gray");
            // Figuring out the right combination of values for these rectangles was mostly trial and error
            p5.rect(-1 * square, -square + i * square + 2, square);
            p5.rect(i * square, -square + -1 * square + 2, square);
            p5.pop();
            p5.text(alphabet[i], (-1 + 0.5) * square, i * square);
            p5.text(alphabet[i], (i + 0.5) * square, -1 * square);
            //This loop creates the 'tabula recta' grid used by the cipher
            for (let j = 0; j < alphabet.length; j++) {
                p5.rect(j * square, -square + i * square + 2, square);
                p5.text(alphabet[(j + i) % 26], (j + 0.5) * square, i * square);
            }
        }
    }
    else if (that.step <= input.length) {
        p5.textSize(square);

        highlightKey((that.step - 1) % key.length, p5, alphabet, key)
        highlightInput((that.step - 1), p5, input)
        p5.translate(p5.width * 0.4, p5.height * 0.2);

        for (let i = 0; i < alphabet.length; i++) {
            p5.push();
            p5.fill("gray");
            p5.rect(-1 * square, -square + i * square + 2, square);
            p5.rect(i * square, -square + -1 * square + 2, square);
            p5.pop();
            p5.text(alphabet[i], (-1 + 0.5) * square, i * square);
            p5.text(alphabet[i], (i + 0.5) * square, -1 * square);
            for (let j = 0; j < alphabet.length; j++) {
                p5.push()

                if (input[that.step - 1] == alphabet[j % alphabet.length]) {
                    p5.fill("green")
                }
                else if (key[(that.step - 1) % key.length] == alphabet[i % alphabet.length]) {
                    p5.fill("red")
                }
                if (input[that.step - 1] == alphabet[j % alphabet.length] && key[(that.step - 1) % key.length] == alphabet[i % alphabet.length]) {
                    //Highlight the intersection point yellow, overwriting the color set by previous two ifs
                    p5.fill("yellow")
                    if (that.outputText.length < that.step) {
                        that.outputText += alphabet[(j + i) % 26]
                    }
                }
                //This square inherits the color set by the p5.fill() in the ifs above.
                p5.rect(j * square, -square + i * square + 2, square);
                p5.pop()
                p5.text(alphabet[(j + i) % 26], (j + 0.5) * square, i * square);
            }
        }
    }
    else {
        that.isComplete = true;
        p5.push();
        p5.textAlign(p5.CENTER);
        p5.textSize(20);
        p5.text("Finished", p5.width / 2, p5.height / 2);
        p5.pop();
    }



    p5.pop();
}

//Helper function, highlights the appropriate letter in the key
function highlightKey(index, p5, alphabet, key) {
    let square = (p5.width / alphabet.length) * 0.5;
    p5.push()
    p5.translate(square * 2, p5.height / 4)
    p5.text("Key: ", 0, 0)
    for (let i = 0; i < key.length; i++) {
        p5.push()
        if (i == index) {
            p5.fill("red")
        }
        p5.rect((i + 1) * square, -square + 1, square, square);
        p5.pop()
        p5.text(key[i], (i + 1.5) * square, 0);
    }
    p5.pop()
}

//Helper function, highlights the appropriate letter in the input text
function highlightInput(index, p5, input) {
    let square = (p5.width / 26) * 0.5;
    p5.push()
    p5.translate(square * 3, p5.height / 9)
    p5.text("Input text: ", 0, 0)

    for (let i = 0; i < input.length; i++) {
        p5.push()
        if (i == index) {
            p5.fill("green")
        }
        p5.rect((i + 3) * square, -square + 1, square, square);
        p5.pop()
        p5.text(input[i], (i + 3.5) * square, 0);
    }
    p5.pop()
}
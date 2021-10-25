function rail(that, p5) {
    p5.text("Input text: " + that.inputText, p5.width / 2, p5.height * 0.1)
    p5.push();
    p5.textSize(10);

    p5.push();
    p5.textAlign(p5.RIGHT);
    p5.text("Step " + (that.step + 1), p5.width - 5, 15);
    p5.pop();

    p5.translate(0, p5.height * 0.3);
    let screenScaler = (p5.height * 0.6) / (that.rail.railCount);
    for (let i = 0; i < that.rail.railCount + 1 && !that.isComplete; i++) {

        p5.line(0, screenScaler * (i - 0.5) - 4, p5.width, screenScaler * (i - 0.5) - 4);
    }

    if (that.step == 0) {
        t = 0;
        for (let i = 0; i < that.inputText.length; i++) {
            p5.rect((i) * (p5.width / that.inputText.length), -12, (p5.width / that.inputText.length), 15);
            p5.text(that.inputText[i], (i + 0.5) * (p5.width / that.inputText.length), 0);
        }
    }
    else if (that.step == 1) {
        if (t < 1) {
            t += 0.02;
        }
        for (let i = 0; i < that.inputText.length; i++) {
            p5.rect((i) * (p5.width / that.inputText.length), -12 + railDistribution(i, that.rail.railCount) * t * screenScaler * (that.rail.railCount - 1), (p5.width / that.inputText.length), 15);
            p5.text(that.inputText[i], (i + 0.5) * (p5.width / that.inputText.length), railDistribution(i, that.rail.railCount) * t * screenScaler * (that.rail.railCount - 1));
        }

    }
    else if (that.step == 2) {
        if (t < 2) {
            t += 0.02;
        }
        //I have to keep track for each character how far along in its row it is.
        let rows = Array(that.rail.railCount).fill(1);
        rows[0] -=1; //The first row is special because its first character is already in position
        for (let i = 0; i < that.inputText.length; i++) {
            let squish = 0;
            let row = x => Math.round(railDistribution(x, that.rail.railCount) * (that.rail.railCount - 1));
            for (let j = i - 1; j > 0; j--) {
                if (row(i) == row(j)) {
                    break;
                }
                squish++;
            }
            rows[row(i)] += squish
            p5.rect((i - rows[row(i)]*(t-1)) * (p5.width / that.inputText.length), -12 + railDistribution(i, that.rail.railCount) * screenScaler * (that.rail.railCount - 1), (p5.width / that.inputText.length), 15);
            p5.text(that.inputText[i], (i + 0.5 - rows[row(i)]*(t-1)) * (p5.width / that.inputText.length), railDistribution(i, that.rail.railCount) * screenScaler * (that.rail.railCount - 1));
        }
    }
    else if (that.step >= 3 && (that.step - 3) < that.rail.railCount) {
        //convert everything to a 2d array rather than a fancy translation of the string.
        let rows = Array(that.rail.railCount).fill("");
        
        let row = x => Math.round(railDistribution(x, that.rail.railCount) * (that.rail.railCount - 1));
        for (let i = 0; i < that.inputText.length; i++) {
            rows[row(i)] += that.inputText[i];
        }
        let totalLength = 0;
        for (let i = 0; i < that.rail.railCount; i++) {
            if ((that.step - 3) % that.rail.railCount >= i) {
                totalLength += rows[i].length;
            }
            for (let j = 0; j < rows[i].length; j++) {
                p5.push();
                if ((that.step - 3) % that.rail.railCount == i) {
                    p5.fill("red");
                    if (that.outputText.length < totalLength) {
                        that.outputText += rows[i];
                    }
                }
                p5.rect((j) * (p5.width / that.inputText.length), -12 + i/(that.rail.railCount - 1) * screenScaler * (that.rail.railCount - 1), (p5.width / that.inputText.length), 15);
                p5.pop();
                p5.text(rows[i][j], (j + 0.5) * (p5.width / that.inputText.length), i/(that.rail.railCount - 1) * screenScaler * (that.rail.railCount - 1));
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
}

function railDistribution(x, railCount) {
    x = x / (railCount - 1) * Math.PI; //Rescale x to go between 0 and Pi.
    return (Math.acos(Math.cos(x))) / Math.PI; //Triangle wave function from https://math.stackexchange.com/questions/1578241/ways-to-generate-triangle-wave-function
}
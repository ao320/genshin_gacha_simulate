function getValues() {
    const numSimulations = Number(document.getElementById("number1").value);
    const numPulls = Number(document.getElementById("number2").value);
    const startPityCounter = Number(document.getElementById("number3").value);
    const guaranteedNextDesired = Number(document.getElementById("boolean").checked);
    const { desiredStar5Counts, totalStar5Counts } = simulateGacha(
        numSimulations,
        numPulls,
        startPityCounter,
        0.5,
        guaranteedNextDesired
    );
    const averageDesiredStar5Count = desiredStar5Counts.reduce((a, b) => a + b, 0) / Number(numSimulations);
    const averageTotalStar5Count = totalStar5Counts.reduce((a, b) => a + b, 0) / Number(numSimulations);
    const result = `${numSimulations}回のシミュレーションで，ガチャを${numPulls}回引いた時，限定星5キャラは平均${averageDesiredStar5Count.toFixed(2)}体出ます．
                    ${numSimulations}回のシミュレーションで，ガチャを${numPulls}回引いた時，星5キャラは平均${averageTotalStar5Count.toFixed(2)}体出ます．
                    `;
    document.getElementById("result").innerText = result;
}

function gachaSimulation(
    numPulls,
    startPityCounter = 0,
    desired5StarRate = 0.5,
    guaranteedNextDesired = false
) {
    const results = [];
    let pityCounter = startPityCounter;
    const softPityStart = 76;
    const hardPity = 90;

    for (let pull = 0; pull < numPulls; pull++) {
        pityCounter += 1;

        let star5Probability;
        if (pityCounter < softPityStart) {
            star5Probability = 0.006;
        } else if (pityCounter < hardPity) {
            star5Probability = 0.006 + 0.06 * (pityCounter - softPityStart);
        } else {
            star5Probability = 1.0;
        }

        if (Math.random() < star5Probability) {
            if (guaranteedNextDesired) {
                results.push(1); // Desired 5-star character
                guaranteedNextDesired = false;
            } else {
                if (Math.random() < desired5StarRate) {
                    results.push(1); // Desired 5-star character
                } else {
                    results.push(5); // Other 5-star character
                    guaranteedNextDesired = true;
                }
            }
            pityCounter = 0; // Reset pity counter after a 5-star character
        } else {
            results.push(0); // No 5-star character
        }
    }

    return results;
}

function simulateGacha(
    numSimulations,
    numPulls,
    startPityCounter = 0,
    desired5StarRate = 0.5,
    guaranteedNextDesired = false
) {
    const desiredStar5Counts = [];
    const totalStar5Counts = [];

    for (let i = 0; i < numSimulations; i++) {
        const results = gachaSimulation(
            numPulls,
            startPityCounter,
            desired5StarRate,
            guaranteedNextDesired
        );
        const desiredStar5Count = results.filter((result) => result === 1).length;
        const totalStar5Count = results.filter(
            (result) => result === 1 || result === 5
        ).length;
        desiredStar5Counts.push(desiredStar5Count);
        totalStar5Counts.push(totalStar5Count);
    }

    return { desiredStar5Counts, totalStar5Counts };
}
document.getElementById('calculateButton').addEventListener('click', () => {
    try {
        // Retrieve input values from the DOM
        const def = parseInt(document.getElementById('def').value);
        const leadSkill = parseInt(document.getElementById('leadSkill').value);
        const defPass = parseInt(document.getElementById('defPass').value) + parseInt(document.getElementById('defSupport').value);
        const defPLinks = parseInt(document.getElementById('defPLinks').value);
        const defFLinks = parseInt(document.getElementById('defFLinks').value);
        const buDefPass = parseInt(document.getElementById('buDefPass').value);
        const attackDefense = parseInt(document.getElementById('attackDefense').value);
        const saDefense = parseInt(document.getElementById('saDefense').value);
        const saDefense2 = parseInt(document.getElementById('saDefense2').value);
        const saTimes = parseInt(document.getElementById('saTimes').value);

        if (saTimes === 0) {
            alert("Number of Supers per Turn cannot be 0");
            return;
        }

        // Perform calculations
        const sotDef = Math.floor((def * (leadSkill + 100) / 100) * ((defPass + 100) / 100) * ((defPLinks + 100) / 100));
        const fullBuiltDef = Math.floor(sotDef * (100 + buDefPass) / 100);
        let maxDef = Math.floor(fullBuiltDef * (100 + attackDefense) / 100);
        let currentDef = maxDef;
        const staticDef = maxDef;

        const superDefs = [];
        for (let i = 0; i < saTimes; i++) {
            if (i === 0) {
                currentDef = Math.floor(staticDef * (100 + saDefense) / 100);
            } else if (saDefense2 > 0) {
                currentDef = Math.floor(staticDef * (100 + saDefense + (saDefense2 * i)) / 100);
            } else {
                currentDef = Math.floor(staticDef * (100 + saDefense * (i + 1)) / 100);
            }
            superDefs.push(currentDef);
        }

        // Display results in the DOM
        document.getElementById('sotDefLabel').innerText = "SoT Defense: " + sotDef;
        document.getElementById('fullBuiltDefLabel').innerText = "Fully Built-up SoT Defense: " + fullBuiltDef;

        const superDefPanel = document.getElementById('superDefPanel');
        superDefPanel.innerHTML = '';
        superDefs.forEach((def, index) => {
            const p = document.createElement('p');
            p.innerText = `Defense after ${index + 1} Super(s): ${def}`;
            superDefPanel.appendChild(p);
        });

        // Calculate and display Max Possible Defense after all supers
        maxDef = superDefs[superDefs.length - 1];
        const maxDefLabel = document.createElement('p');
        maxDefLabel.innerText = "Max Possible Defense: " + maxDef;
        superDefPanel.appendChild(maxDefLabel);

    } catch (error) {
        alert("An error occurred: " + error.message);
    }
});

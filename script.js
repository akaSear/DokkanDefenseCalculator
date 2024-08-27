document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('calculateButton').addEventListener('click', () => {
        try {
            // Retrieve input values from the DOM
            const def = parseInt(document.getElementById('def').value) || 0;
            const leadSkill = parseInt(document.getElementById('leadSkill').value) || 0;
            const defPass = parseInt(document.getElementById('defPass').value) || 0;
            const defSupport = parseInt(document.getElementById('defSupport').value) || 0;
            const defPLinks = parseInt(document.getElementById('defPLinks').value) || 0;
            const actSkill = parseInt(document.getElementById('actSkill').value) || 0;
            const buDefPass = parseInt(document.getElementById('buDefPass').value) || 0;
            const attackDefense = parseInt(document.getElementById('attackDefense').value) || 0;
            const saDefense = parseInt(document.getElementById('saDefense').value) || 0;
            const saDefense2 = parseInt(document.getElementById('saDefense2').value) || 0;
            const saTimes = parseInt(document.getElementById('saTimes').value) || 0;

            if (saTimes === 0) {
                alert("Number of Supers per Turn cannot be 0");
                return;
            }

            // Perform calculations
            const def1 = Math.floor(def * (leadSkill + 100) / 100);
            const def2 = Math.floor(def1 * (defPass + defSupport + 100) / 100);
            const sotDef = Math.floor(def2 * (defPLinks + 100) / 100);

            const actDef = Math.floor(sotDef * (actSkill + 100) / 100);

            const fullBuiltDef = Math.floor(actDef * (100 + buDefPass) / 100);
            let maxDef = Math.floor(fullBuiltDef * (100 + attackDefense) / 100);
            const staticDef = maxDef;

            const superDefs = [];
            for (let i = 0; i < saTimes; i++) {
                let currentDef;
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
});

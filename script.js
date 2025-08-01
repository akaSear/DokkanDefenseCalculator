document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('calculateButton').addEventListener('click', () => {
        try {
            // Retrieve input values
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
            const saTimes = parseInt(document.getElementById('saTimes').value) || 1;
            const pastSupers = parseInt(document.getElementById('pastSupers').value) || 0;

            if (saTimes === 0) {
                alert("Number of Supers per Turn cannot be 0");
                return;
            }

            // Base calculations (unchanged)
            const def1 = Math.floor(def * (leadSkill + 100) / 100);
            const def2 = Math.floor(def1 * (defPass + defSupport + 100) / 100);
            const sotDef = Math.floor(def2 * (defPLinks + 100) / 100);
            const actDef = Math.floor(sotDef * (actSkill + 100) / 100);
            const fullBuiltDef = Math.floor(actDef * (100 + buDefPass) / 100);
            const staticDef = Math.floor(fullBuiltDef * (100 + attackDefense) / 100);

            // Calculate stacks from past supers
            const pastStacks = pastSupers > 0 ? 
                (saDefense2 > 0 ? 
                    // For varying stacks (30% + 50% + 70% etc)
                    saDefense + saDefense2 * (pastSupers - 1) : 
                    // For linear stacks (30% each)
                    saDefense * pastSupers
                ) : 0;

            // Calculate current turn's supers
            const superDefs = [];
            for (let i = 0; i < saTimes; i++) {
                let currentStack;
                if (i === 0) {
                    currentStack = saDefense;
                } else if (saDefense2 > 0) {
                    currentStack = saDefense + (saDefense2 * i);
                } else {
                    currentStack = saDefense * (i + 1);
                }
                
                const totalStacks = pastStacks + currentStack;
                superDefs.push(Math.floor(staticDef * (100 + totalStacks) / 100));
            }

            // Display results (unchanged format)
            document.getElementById('sotDefLabel').innerText = "SoT Defense: " + sotDef.toLocaleString();
            document.getElementById('fullBuiltDefLabel').innerText = "Fully Built-up SoT Defense: " + fullBuiltDef.toLocaleString();

            const superDefPanel = document.getElementById('superDefPanel');
            superDefPanel.innerHTML = '';
            
            superDefs.forEach((def, index) => {
                const p = document.createElement('p');
                p.innerText = `Defense after ${index + 1} Super(s): ${def.toLocaleString()}`;
                superDefPanel.appendChild(p);
            });

            // Show total stacks (new)
            const totalStacksUsed = pastStacks + 
                (saDefense2 > 0 ? 
                    saDefense + saDefense2 * (saTimes - 1) : 
                    saDefense * saTimes
                );
            
            const stackInfo = document.createElement('p');
            stackInfo.innerText = `Total Stacks Applied: ${totalStacksUsed}%`;
            superDefPanel.appendChild(stackInfo);

        } catch (error) {
            alert("An error occurred: " + error.message);
        }
    });
});

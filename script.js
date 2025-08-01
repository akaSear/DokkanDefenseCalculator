document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('calculateButton').addEventListener('click', () => {
        try {
            // Retrieve all input values
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
            const teamStackerBuff = parseInt(document.getElementById('teamStacker').value) || 0;
            const teamStackerCount = parseInt(document.getElementById('teamStackerCount').value) || 0;
            const defOnReceiving = parseInt(document.getElementById('defOnReceiving').value) || 0;

            if (saTimes === 0) {
                alert("Number of Supers per Turn cannot be 0");
                return;
            }

            // Base defense calculations
            const def1 = Math.floor(def * (leadSkill + 100) / 100);
            const def2 = Math.floor(def1 * (defPass + defSupport + 100) / 100);
            const sotDef = Math.floor(def2 * (defPLinks + 100) / 100);
            const actDef = Math.floor(sotDef * (actSkill + 100) / 100);
            const fullBuiltDef = Math.floor(actDef * (100 + buDefPass) / 100);
            const staticDef = Math.floor(fullBuiltDef * (100 + attackDefense) / 100);

            // Stack calculations
            const teamStacks = teamStackerBuff * teamStackerCount;
            const pastStacks = pastSupers > 0 ? 
                (saDefense2 > 0 ? 
                    saDefense + saDefense2 * (pastSupers - 1) : 
                    saDefense * pastSupers
                ) : 0;

            // Calculate defense for each super
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
                
                const totalStacks = pastStacks + currentStack + teamStacks;
                let finalDef = Math.floor(staticDef * (100 + totalStacks) / 100);
                
                if (defOnReceiving > 0) {
                    finalDef = Math.floor(finalDef * (100 + defOnReceiving) / 100);
                }
                
                superDefs.push({
                    value: finalDef,
                    base: Math.floor(staticDef * (100 + totalStacks) / 100),
                    buffAmount: defOnReceiving > 0 ? 
                        Math.floor(finalDef - (finalDef / (1 + defOnReceiving/100))) : 0
                });
            }

            // Display results
            document.getElementById('sotDefLabel').innerText = "SoT Defense: " + sotDef.toLocaleString();
            document.getElementById('fullBuiltDefLabel').innerText = "Fully Built-up SoT Defense: " + fullBuiltDef.toLocaleString();

            // NEW: Calculate Defense After Receiving Hit (Before SA)
            let preSuperDef = staticDef;
            if (defOnReceiving > 0) {
                preSuperDef = Math.floor(staticDef * (100 + defOnReceiving) / 100);
            }
            document.getElementById('preSuperDefLabel').innerText =
                "Defense After Receiving Hit (Before SA): " + preSuperDef.toLocaleString();

            const superDefPanel = document.getElementById('superDefPanel');
            superDefPanel.innerHTML = '';
            
            superDefs.forEach((def, index) => {
                const p = document.createElement('p');
                let defText = `Defense after ${index + 1} Super(s): <strong>${def.value.toLocaleString()}</strong>`;
                
                if (defOnReceiving > 0) {
                    defText += `<span class="breakdown">
                        (Base: ${def.base.toLocaleString()} + 
                        ${defOnReceiving}% when attacked: +${def.buffAmount.toLocaleString()})
                    </span>`;
                }
                
                p.innerHTML = defText;
                superDefPanel.appendChild(p);
            });

            // Show total stacks if any
            const totalStacksUsed = pastStacks + 
                (saDefense2 > 0 ? 
                    saDefense + saDefense2 * (saTimes - 1) : 
                    saDefense * saTimes
                ) + teamStacks;
            
            if (totalStacksUsed > 0) {
                const stackInfo = document.createElement('p');
                stackInfo.innerHTML = `Total Stacks Applied: <strong>${totalStacksUsed}%</strong>`;
                superDefPanel.appendChild(stackInfo);
            }

        } catch (error) {
            alert("An error occurred: " + error.message);
        }z
    });
});

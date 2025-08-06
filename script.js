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

            // Base defense calculations (Dokkan-style: floor at each step EXCEPT links)
            const def1 = Math.floor(def * (leadSkill + 100) / 100);
            const def2 = Math.floor(def1 * (defPass + defSupport + 100) / 100);
            const sotDef = def2 * (defPLinks + 100) / 100; // NO floor here!
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
            const rarity = document.getElementById('rarity').value;
            const superDefs = [];
            let thisTurnStacks = 0;
            for (let i = 0; i < saTimes; i++) {
                let stackThisSuper;
                if (rarity === "LR") {
                    stackThisSuper = (i === 0) ? saDefense : saDefense2;
                } else {
                    stackThisSuper = saDefense;
                }
                thisTurnStacks += stackThisSuper;

                const totalStacks = pastStacks + thisTurnStacks + teamStacks;
                let finalDef = staticDef * (100 + totalStacks) / 100; // NO floor here!
                if (defOnReceiving > 0) {
                    finalDef = finalDef * (100 + defOnReceiving) / 100; // NO floor here!
                }
                finalDef = Math.floor(finalDef); // Only floor at the end!
                superDefs.push({
                    value: finalDef,
                    base: Math.floor(staticDef * (100 + totalStacks) / 100), // This is fine, as base is before "when attacked"
                    buffAmount: defOnReceiving > 0 ?
                        finalDef - Math.floor(finalDef / (1 + defOnReceiving / 100)) : 0
                });
            }

            // Display results
            document.getElementById('sotDefLabel').innerText = "SoT Defense: " + sotDef.toLocaleString(undefined, { maximumFractionDigits: 0 });
            document.getElementById('fullBuiltDefLabel').innerText = "Fully Built-up SoT Defense: " + fullBuiltDef.toLocaleString(undefined, { maximumFractionDigits: 0 });

            if (document.getElementById('preSuperDefLabel')) {
                document.getElementById('preSuperDefLabel').innerText =
                    "Defense After Receiving Hit (Before SA): " + preSuperDef.toLocaleString(undefined, { maximumFractionDigits: 0 });
            }

            const superDefPanel = document.getElementById('superDefPanel');
            superDefPanel.innerHTML = '';

            superDefs.forEach((def, index) => {
                const p = document.createElement('p');
                let defText = `Defense after ${index + 1} Super(s): <strong>${def.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>`;
                defText += `<span class="breakdown">
                    (Base: ${def.base.toLocaleString(undefined, { maximumFractionDigits: 0 })} + 
                    ${defOnReceiving}% when attacked: +${def.buffAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })})
                </span>`;
                p.innerHTML = defText;
                superDefPanel.appendChild(p);
            });

            // Show total stacks if any
            let totalStacksUsed = pastStacks + teamStacks;
            if (rarity === "LR") {
                // LR: first super uses saDefense, others use saDefense2 (even if 0)
                totalStacksUsed += saDefense; // first super
                if (saTimes > 1) {
                    totalStacksUsed += saDefense2 * (saTimes - 1); // additional supers
                }
            } else {
                // TUR: all supers use saDefense
                totalStacksUsed += saDefense * saTimes;
            }

            if (totalStacksUsed > 0) {
                const stackInfo = document.createElement('p');
                stackInfo.innerHTML = `Total Stacks Applied: <strong>${Math.floor(totalStacksUsed).toLocaleString()}%</strong>`;
                superDefPanel.appendChild(stackInfo);
            }

        } catch (error) {
            alert("An error occurred: " + error.message);
        }
    });

    // Export Inputs
    document.getElementById('exportButton').addEventListener('click', () => {
        const inputIds = [
            'def', 'leadSkill', 'defPass', 'defSupport', 'defPLinks', 'actSkill', 'buDefPass',
            'defOnReceiving', 'attackDefense', 'saDefense', 'saDefense2', 'saTimes',
            'pastSupers', 'teamStacker', 'teamStackerCount', 'rarity'
        ];
        const data = {};
        inputIds.forEach(id => {
            const el = document.getElementById(id);
            data[id] = el ? el.value : '';
        });
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "dokkan_defense_inputs.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Import Inputs
    document.getElementById('importButton').addEventListener('click', () => {
        document.getElementById('importFile').click();
    });

    document.getElementById('importFile').addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                Object.keys(data).forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.value = data[id];
                });
            } catch (err) {
                alert("Invalid file format.");
            }
        };
        reader.readAsText(file);
    });
});

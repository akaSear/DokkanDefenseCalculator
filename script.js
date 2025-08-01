document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('calculateButton').addEventListener('click', () => {
        try {
            // Input collection
            const getValue = id => parseInt(document.getElementById(id).value) || 0;
            
            const def = getValue('def');
            const leadSkill = getValue('leadSkill');
            const defPass = getValue('defPass');
            const defSupport = getValue('defSupport');
            const defPLinks = getValue('defPLinks');
            const actSkill = getValue('actSkill');
            const buDefPass = getValue('buDefPass');
            const attackDefense = getValue('attackDefense');
            const saDefense = getValue('saDefense');
            const saDefense2 = getValue('saDefense2');
            const saTimes = getValue('saTimes');
            const pastSupers = getValue('pastSupers');
            const defOnReceiving = getValue('defOnReceiving');

            if (saTimes < 1) {
                alert("Number of Supers must be at least 1");
                return;
            }

            // Base calculations
            const sotDef = Math.floor(def * (leadSkill + 100) / 100 * (defPass + defSupport + 100) / 100 * (defPLinks + 100) / 100);
            const fullBuiltDef = Math.floor(sotDef * (actSkill + 100) / 100 * (100 + buDefPass) / 100);
            const preSuperDef = Math.floor(fullBuiltDef * (100 + attackDefense) / 100);
            const preSuperDefWithBuff = defOnReceiving > 0 
                ? Math.floor(fullBuiltDef * (100 + attackDefense + defOnReceiving) / 100)
                : preSuperDef;

            // Display base stats
            document.getElementById('sotDefLabel').innerText = `SoT Defense: ${sotDef.toLocaleString()}`;
            
            let builtUpText = `Fully Built-up Defense: ${fullBuiltDef.toLocaleString()}`;
            if (defOnReceiving > 0) {
                builtUpText += ` <span class="buff-note">(When Attacked: ${preSuperDefWithBuff.toLocaleString()})</span>`;
            }
            document.getElementById('fullBuiltDefLabel').innerHTML = builtUpText;

            // Calculate super attack defenses
            const pastStacks = pastSupers > 0 
                ? (saDefense2 > 0 
                    ? saDefense + saDefense2 * (pastSupers - 1) 
                    : saDefense * pastSupers)
                : 0;

            const superDefs = [];
            for (let i = 0; i < saTimes; i++) {
                const currentStack = i === 0 
                    ? saDefense 
                    : (saDefense2 > 0 
                        ? saDefense + (saDefense2 * i) 
                        : saDefense * (i + 1));
                
                const totalStacks = pastStacks + currentStack;
                const baseDef = Math.floor(preSuperDef * (100 + totalStacks) / 100);
                const finalDef = defOnReceiving > 0
                    ? Math.floor(baseDef * (100 + defOnReceiving) / 100)
                    : baseDef;
                
                superDefs.push({
                    value: finalDef,
                    base: baseDef,
                    buffAmount: defOnReceiving > 0 ? finalDef - baseDef : 0
                });
            }

            // Display results
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

        } catch (error) {
            alert("An error occurred: " + error.message);
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('calculateButton').addEventListener('click', () => {
        try {
            // 1. Collect all inputs
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

            // 2. Calculate defense stages
            const def1 = Math.floor(def * (leadSkill + 100) / 100);
            const def2 = Math.floor(def1 * (defPass + defSupport + 100) / 100);
            const sotDef = Math.floor(def2 * (defPLinks + 100) / 100);
            const actDef = Math.floor(sotDef * (actSkill + 100) / 100);
            const fullBuiltDef = Math.floor(actDef * (100 + buDefPass) / 100);
            const preSuperDef = Math.floor(fullBuiltDef * (100 + attackDefense) / 100);
            const preSuperDefWithBuff = defOnReceiving > 0 
                ? Math.floor(fullBuiltDef * (100 + attackDefense + defOnReceiving) / 100)
                : null;

            // 3. Display base stats
            document.getElementById('sotDefLabel').innerText = 
                `Start of Turn Defense: ${sotDef.toLocaleString()}`;
            
            let fullBuiltText = `Fully Built-up Defense: ${fullBuiltDef.toLocaleString()}`;
            if (preSuperDefWithBuff) {
                fullBuiltText += ` <span class="when-attacked">(When Attacked: ${preSuperDefWithBuff.toLocaleString()})</span>`;
            }
            document.getElementById('fullBuiltDefLabel').innerHTML = fullBuiltText;

            // 4. Calculate super attack defenses
            const teamStacks = teamStackerBuff * teamStackerCount;
            const pastStacks = pastSupers > 0 ? 
                (saDefense2 > 0 ? 
                    saDefense + saDefense2 * (pastSupers - 1) : 
                    saDefense * pastSupers
                ) : 0;

            const superDefs = [];
            for (let i = 0; i < saTimes; i++) {
                let currentStack = i === 0 ? saDefense : 
                    (saDefense2 > 0 ? saDefense + (saDefense2 * i) : saDefense * (i + 1));
                
                const totalStacks = pastStacks + currentStack + teamStacks;
                superDefs.push(Math.floor(preSuperDef * (100 + totalStacks) / 100));
            }

            // 5. Display results
            const superDefPanel = document.getElementById('superDefPanel');
            superDefPanel.innerHTML = '';
            
            superDefs.forEach((def, index) => {
                const p = document.createElement('p');
                p.innerHTML = `Defense after ${index + 1} Super(s): <strong>${def.toLocaleString()}</strong>`;
                superDefPanel.appendChild(p);
            });

        } catch (error) {
            alert("An error occurred: " + error.message);
        }
    });
});

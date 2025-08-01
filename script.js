document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('calculateButton').addEventListener('click', () => {
        try {
            // Input collection (unchanged from your original)
            const def = parseInt(document.getElementById('def').value) || 0;
            // ... (all other inputs)

            // Defense calculations
            const sotDef = Math.floor(def * (leadSkill + 100) / 100 * (defPass + defSupport + 100) / 100 * (defPLinks + 100) / 100);
            const fullBuiltDef = Math.floor(sotDef * (actSkill + 100) / 100 * (100 + buDefPass) / 100);
            const preSuperDef = Math.floor(fullBuiltDef * (100 + attackDefense) / 100);
            
            // Display (cleaner version)
            document.getElementById('sotDefLabel').innerText = `SoT Defense: ${sotDef.toLocaleString()}`;
            
            let builtUpText = `Fully Built-up: ${fullBuiltDef.toLocaleString()}`;
            if (defOnReceiving > 0) {
                const whenAttackedDef = Math.floor(fullBuiltDef * (100 + attackDefense + defOnReceiving) / 100);
                builtUpText += ` | When Attacked: ${whenAttackedDef.toLocaleString()}`;
            }
            document.getElementById('fullBuiltDefLabel').innerText = builtUpText;

            // Super attack calculations
            const superDefs = [];
            for (let i = 0; i < saTimes; i++) {
                const stacks = /*...your stacking logic...*/;
                superDefs.push(Math.floor(preSuperDef * (100 + stacks) / 100));
            }

            // Results display (your original clean style)
            const superDefPanel = document.getElementById('superDefPanel');
            superDefPanel.innerHTML = superDefs.map((def, i) => 
                `<p>Defense after ${i+1} Super(s): ${def.toLocaleString()}</p>`
            ).join('');

        } catch (error) {
            alert("Error: " + error.message);
        }
    });
});

// 1. THE LANGUAGE TRANSLATOR ENGINE
let isEnglish = true;
const langBtn = document.getElementById('lang-btn');

langBtn.addEventListener('click', () => {
    isEnglish = !isEnglish;
    
    // Toggle Button Text
    langBtn.innerText = isEnglish ? "EN | A-अ (Hinglish)" : "A-अ | EN (English)";
    
    // Translate all elements with data-en and data-hi tags
    document.querySelectorAll('[data-en]').forEach(el => {
        if (el.tagName === 'OPTION') {
            el.text = isEnglish ? el.getAttribute('data-en') : el.getAttribute('data-hi');
        } else {
            el.innerText = isEnglish ? el.getAttribute('data-en') : el.getAttribute('data-hi');
        }
    });
});

// 2. THE EXERCISE DICTIONARY (Data Matrix)
const exerciseProtocols = {
    beginner: [
        { name: "Goblet Squat", reps: "3 Sets x 10-12 Reps", tipEn: "Keep dumbbell close to chest. Push hips back.", tipHi: "Dumbbell chest se laga kar rakhein. Hips peeche push karein." },
        { name: "Glute Bridge", reps: "3 Sets x 15 Reps", tipEn: "Push through heels. Squeeze glutes at top.", tipHi: "Eediyon se push karein. Upar aakar glutes squeeze karein." },
        { name: "Incline Push-ups", reps: "3 Sets x 8-10 Reps", tipEn: "Keep elbows tucked at 45 degrees. Core tight.", tipHi: "Elbows body ke paas rakhein (45°). Core tight." },
        { name: "Seated Cable Row", reps: "3 Sets x 12 Reps", tipEn: "Pull shoulders back and down. Squeeze back.", tipHi: "Kandho ko peeche khinchein. Back squeeze karein." }
    ],
    intermediate: [
        { name: "Bulgarian Split Squat", reps: "3 Sets x 10 Reps/Leg", tipEn: "Lean slightly forward to target glutes.", tipHi: "Glutes target karne ke liye upper body thoda aage jhukayein." },
        { name: "Romanian Deadlift (RDL)", reps: "3 Sets x 12 Reps", tipEn: "Push hips to the wall behind you.", tipHi: "Ye squat nahi hai, hips peeche deewar ki taraf push karein." },
        { name: "Flat DB Press", reps: "3 Sets x 10 Reps", tipEn: "Maintain a slight arch in your back.", tipHi: "Back mein natural arch banaye rakhein." },
        { name: "Lat Pulldown", reps: "3 Sets x 10-12 Reps", tipEn: "Pull to your upper chest. Control the weight.", tipHi: "Bar ko upper chest tak layein. Dheere chodein." }
    ]
};

// 3. THE CORE CALCULATOR & POSTER GENERATOR
document.getElementById('generate-btn').addEventListener('click', () => {
    
    // Get all user inputs
    const age = parseFloat(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const activity = parseFloat(document.getElementById('activity').value);
    const experience = document.getElementById('experience').value;
    const goal = document.getElementById('goal').value;
    const budget = parseFloat(document.getElementById('budget').value);

    // Basic Validation
    if(!age || !weight || !height || !budget) {
        alert(isEnglish ? "Please fill all the details!" : "Kripaya saari details fill karein!");
        return;
    }

    // --- BIOLOGICAL MATH ENGINE ---
    let bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    let tdee = bmr * activity;
    
    let finalCalories = goal === 'fat-loss' ? (tdee - 400) : (tdee - 100);
    if(finalCalories < 1200) finalCalories = 1200; 
    
    let protein = weight * 1.8;
    if(protein > 130) protein = 130; 
    let fats = weight * 1.0; 
    let carbs = (finalCalories - (protein * 4) - (fats * 9)) / 4;
    
    finalCalories = Math.round(finalCalories);
    protein = Math.round(protein);
    fats = Math.round(fats);
    carbs = Math.round(carbs);

// --- GROCERY MATH ENGINE (Smart Shopping Cart) ---
    const foodDB = {
        veg: [
            { name: "Soya Chunks", cost: 5, protein: 26, unit: "50g" }, 
            { name: "Moong Dal", cost: 6, protein: 12, unit: "50g" }, 
            { name: "Kala Chana", cost: 5, protein: 7.5, unit: "50g" }, 
            { name: "Soya Paneer (Tofu)", cost: 40, protein: 15, unit: "100g" },
            { name: "Raw Peanuts", cost: 5, protein: 7.5, unit: "30g" }
        ],
        egg: [
            { name: "Whole Eggs", cost: 14, protein: 12, unit: "2 pcs" }, 
            { name: "Soya Chunks", cost: 5, protein: 26, unit: "50g" },
            { name: "Moong Dal", cost: 6, protein: 12, unit: "50g" }
        ],
        nonveg: [
            { name: "Chicken Breast", cost: 40, protein: 31, unit: "100g" }, 
            { name: "Whole Eggs", cost: 14, protein: 12, unit: "2 pcs" },
            { name: "Soya Chunks", cost: 5, protein: 26, unit: "50g" }
        ]
    };

    const dietType = document.getElementById('diet').value;
    let availableFoods = foodDB[dietType] || foodDB['veg']; 
    
    // Lock the home food trace protein to a realistic 15g
    const homeFoodProtein = 15;
    let targetProteinFromStack = protein - homeFoodProtein;
    
    let totalCost = 0;
    let stackProtein = 0;
    let cart = {}; 

    // The 'Greedy' Loop: Keep buying food until target protein is met or budget is dead
    let loopSafety = 0; 
    while (stackProtein < targetProteinFromStack && loopSafety < 100) {
        let boughtSomething = false;
        
        for (let item of availableFoods) {
            // Check if we have money and still need protein
            if (totalCost + item.cost <= budget && stackProtein < targetProteinFromStack) {
                if (!cart[item.name]) {
                    cart[item.name] = { count: 0, cost: item.cost, protein: item.protein, unit: item.unit };
                }
                cart[item.name].count += 1;
                totalCost += item.cost;
                stackProtein += item.protein;
                boughtSomething = true;
            }
        }
        if (!boughtSomething) break; // Budget is too low to buy anything else
        loopSafety++;
    }

    // Build the Stack UI
    let stackHTML = '';
    for (let key in cart) {
        let item = cart[key];
        
        // THE UI FIX: Multiply base quantity by count (e.g., 2 x 50g = 100g)
        let baseQty = parseFloat(item.unit); // Extracts number (50) from "50g"
        let unitType = item.unit.replace(baseQty, '').trim(); // Extracts text ("g" or "pcs")
        let totalQty = baseQty * item.count; 
        
        let displayQty = `${totalQty}${unitType}`; 
        if (unitType === 'pcs') displayQty = `${totalQty} pcs`; // Add space for eggs

        let itemTotalCost = item.count * item.cost;
        let itemTotalProtein = item.count * item.protein;
        
        stackHTML += `
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #333; font-size: 0.85rem;">
                <span style="color: #eaeaea;">${displayQty} ${key}</span>
                <span style="color: #dfa8a6;">₹${itemTotalCost.toFixed(1)} <span style="color: #888; font-size: 0.7rem;">(${itemTotalProtein.toFixed(1)}g P)</span></span>
            </div>
        `;
    }

    // Inject the locked Home Food
    stackHTML += `
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #333; font-size: 0.85rem;">
            <span style="color: #eaeaea;">Home Food (Normal Roti/Dal)</span>
            <span style="color: #dfa8a6;">~₹0 <span style="color: #888; font-size: 0.7rem;">(${homeFoodProtein.toFixed(1)}g P)</span></span>
        </div>
    `;

    // Add a Warning if the user's budget was too low to hit the protein target
    if ((stackProtein + homeFoodProtein) < protein - 5) {
        stackHTML += `
            <div style="color: #ff5252; background: rgba(255, 82, 82, 0.1); padding: 8px; border-radius: 4px; font-size: 0.75rem; text-align: center; margin-top: 10px; border: 1px solid rgba(255, 82, 82, 0.3);">
                ⚠️ Budget of ₹${budget} is too low to hit ${protein}g protein! Increase budget or use whey.
            </div>
        `;
    }

    // --- GENERATE PROTOCOL DATA (Workout Loop) ---
    const protocol = exerciseProtocols[experience];
    let workoutHTML = '';
    protocol.forEach(ex => {
        workoutHTML += `
            <div style="background: #1a1a1a; padding: 10px; border-radius: 6px; margin-bottom: 8px; border-left: 2px solid #dfa8a6;">
                <strong style="color: #fff; font-size: 0.9rem;">${ex.name} (${ex.reps})</strong><br>
                <span style="color: #888; font-size: 0.75rem;">💡 Tip: ${isEnglish ? ex.tipEn : ex.tipHi}</span>
            </div>
        `;
    });

    // --- RENDER THE RESULT POSTER ---
    const resultBox = document.getElementById('result-poster');
    
    const titleText = isEnglish ? "YOUR RATIONAL BLUEPRINT" : "AAPKA RATIONAL BLUEPRINT";
    const phaseText = isEnglish ? "Phase 1: 3-Day Full Body Protocol" : "Phase 1: 3-Din ka Full Body Workout";
    const warnText = isEnglish 
        ? "⚠️ Coach's Note: Do not train 6 days a week. Muscles tone during rest (48hr recovery)." 
        : "⚠️ Coach's Note: Hafte mein 6 din workout na karein. Muscle rest ke dauran tone hote hain.";

    resultBox.innerHTML = `
        <div id="capture-area" style="padding: 10px; background-color: #111; border-radius: 8px;">
            <h3 style="text-align: center; color: #dfa8a6; margin-bottom: 15px; font-weight: 800; letter-spacing: 1px;">${titleText}</h3>
            
            <div style="display: flex; justify-content: space-between; text-align: center; background: #1a1a1a; padding: 15px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #333;">
                <div>
                    <div style="font-size: 0.7rem; color: #888; letter-spacing: 1px;">CALORIES</div>
                    <div style="font-size: 1.2rem; font-weight: bold; color: #fff;">${finalCalories}</div>
                </div>
                <div>
                    <div style="font-size: 0.7rem; color: #888; letter-spacing: 1px;">PROTEIN</div>
                    <div style="font-size: 1.2rem; font-weight: bold; color: #fff;">${protein}g</div>
                </div>
                <div>
                    <div style="font-size: 0.7rem; color: #888; letter-spacing: 1px;">CARBS</div>
                    <div style="font-size: 1.2rem; font-weight: bold; color: #fff;">${carbs}g</div>
                </div>
                <div>
                    <div style="font-size: 0.7rem; color: #888; letter-spacing: 1px;">FATS</div>
                    <div style="font-size: 1.2rem; font-weight: bold; color: #fff;">${fats}g</div>
                </div>
            </div>

            <h4 style="color: #fff; font-size: 0.9rem; margin-bottom: 10px; border-left: 3px solid #dfa8a6; padding-left: 8px;">🛒 SagarXFit Optimal Stack (Under ₹${budget})</h4>
            <div style="background: #1a1a1a; padding: 10px 15px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #333;">
                ${stackHTML}
                <div style="display: flex; justify-content: space-between; padding-top: 10px; font-weight: bold; font-size: 0.9rem;">
                    <span style="color: #fff;">Estimated Base Cost:</span>
                    <span style="color: #dfa8a6;">₹${totalCost.toFixed(1)} / day</span>
                </div>
            </div>

            <h4 style="color: #fff; font-size: 0.9rem; margin-bottom: 10px; border-left: 3px solid #00e676; padding-left: 8px;">🌱 Hormone & Blood Health Add-ons</h4>
            <div style="background: rgba(0, 230, 118, 0.05); border: 1px solid rgba(0, 230, 118, 0.2); padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 0.8rem; color: #ccc;">
                <div style="margin-bottom: 8px;"><strong style="color: #00e676;">🩸 Iron Focus:</strong> Add 1 bowl of Spinach (Palak) or Kala Chana daily. <br><em>(Squeeze lemon on it to increase iron absorption by 300%)</em>.</div>
                <div style="margin-bottom: 8px;"><strong style="color: #00e676;">🧬 Hormonal Balance:</strong> Eat 10g (1 spoon) of Flaxseeds (Alsi) daily. It naturally balances estrogen and supports healthy periods.</div>
                <div><strong style="color: #00e676;">🦴 Bone Density:</strong> Include 1 serving of Curd (Dahi) or Ragi daily for natural calcium to prevent joint pain.</div>
            </div>

            <h4 style="color: #fff; font-size: 0.9rem; margin-bottom: 10px; border-left: 3px solid #dfa8a6; padding-left: 8px;">🏋️‍♀️ ${phaseText}</h4>
            <div style="background-color: rgba(223, 168, 166, 0.1); color: #dfa8a6; padding: 10px; border-radius: 8px; font-size: 0.75rem; margin-bottom: 15px; border: 1px solid rgba(223, 168, 166, 0.3);">
                ${warnText}
            </div>
            
            <div id="workout-list">
                ${workoutHTML}
            </div>
        </div>

        <button id="download-btn" style="width: 100%; background-color: #00e676; color: #0f0f0f; border: none; padding: 15px; font-size: 1rem; font-weight: 800; border-radius: 6px; cursor: pointer; margin-top: 20px; letter-spacing: 1px; transition: 0.3s;">
            📸 DOWNLOAD TO GALLERY
        </button>
    `;
    
    resultBox.style.display = "block";
    resultBox.scrollIntoView({ behavior: 'smooth' });

    // --- NEW: THE HTML2CANVAS EXPORT LOGIC ---
    document.getElementById('download-btn').addEventListener('click', function() {
        this.style.display = 'none'; // Hide button before screenshot
        
        // Capture only the 'capture-area' div so the button is fully excluded
        html2canvas(document.getElementById('capture-area'), {
            backgroundColor: "#111",
            scale: 2 
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'SagarXFit_Womens_Blueprint.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            this.style.display = 'block'; // Show button again
        });
    });
});
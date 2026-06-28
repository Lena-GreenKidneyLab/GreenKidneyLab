// GreenKidneyLab Website Scripts

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Router
  initRouter();

  // Initialize Quiz
  initQuiz();

  // Initialize Lab Library
  initLabLibrary();

  // Initialize Plant Library
  initPlantLibrary();

  // Initialize Free Checklist
  initChecklist();

  // Initialize Modals
  initModals();
});

/* ==========================================================================
   1. VIEW ROUTER (SPA navigation with URL Hash)
   ========================================================================== */
function initRouter() {
  const navLinks = document.querySelectorAll('nav a, .arrow-link, .hero-actions .btn');
  const sections = document.querySelectorAll('.view-section');

  function handleRoute() {
    let hash = window.location.hash || '#home';
    
    // Smooth scroll to top on section switch
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Deactivate all sections and navigation links
    sections.forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('nav li').forEach(li => li.classList.remove('active'));

    // Activate the correct section
    const activeSection = document.querySelector(hash);
    if (activeSection) {
      activeSection.classList.add('active');
    } else {
      // Fallback
      document.querySelector('#home').classList.add('active');
      hash = '#home';
    }

    // Activate current menu item
    const activeMenuLink = document.querySelector(`nav a[href="${hash}"]`);
    if (activeMenuLink) {
      activeMenuLink.parentElement.classList.add('active');
    }
  }

  // Intercept links to trigger route
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        // Let hashchange event handle the routing
      }
    });
  });

  window.addEventListener('hashchange', handleRoute);
  
  // Initial load routing
  handleRoute();
}


/* ==========================================================================
   2. KIDNEY HEALTH ASSESSMENT QUIZ
   ========================================================================== */
const QUIZ_QUESTIONS = [
  {
    question: "How much water or pure fluid do you typically drink per day?",
    options: [
      { text: "Less than 4 cups (1 liter)", score: 1, tip: "Dehydration strains the kidneys. Try adding an extra glass of water to your morning routine." },
      { text: "4 to 8 cups (1-2 liters)", score: 2, tip: "Moderate hydration is good, but aim to keep your urine pale yellow unless restricted by a doctor." },
      { text: "More than 8 cups (2+ liters)", score: 3, tip: "Excellent hydration level! Keep choosing pure water over sugary beverages." }
    ]
  },
  {
    question: "Do you actively monitor or limit your daily sodium (salt) intake?",
    options: [
      { text: "No, I rarely check nutrition labels for sodium", score: 1, tip: "High sodium drives blood pressure up, stressing kidneys. Aim for under 1500-2000mg daily." },
      { text: "Sometimes, I try to limit adding table salt", score: 2, tip: "Great start, but remember 70%+ of dietary sodium comes from processed and restaurant foods!" },
      { text: "Yes, I cook fresh and check food labels diligently", score: 3, tip: "Fantastic job. Cooking fresh herbs and spices is the best way to flavor food without salt." }
    ]
  },
  {
    question: "How often do you consume processed foods or dark carbonated sodas?",
    options: [
      { text: "Daily or multiple times a week", score: 1, tip: "Processed meats and dark sodas contain artificial phosphorus additives, which are highly taxing to kidneys." },
      { text: "A few times a month", score: 2, tip: "Occasional indulgences are fine, but replacing dark sodas with sparkling water infused with lemon is highly beneficial." },
      { text: "Rarely or never", score: 3, tip: "Outstanding! Avoiding artificial phosphorus additives prevents vascular calcification and kidney overload." }
    ]
  },
  {
    question: "What is your main source of dietary protein?",
    options: [
      { text: "Primarily red meat, poultry, and animal products", score: 1, tip: "Animal protein increases kidney workload (hyperfiltration) and dietary acid load compared to plant proteins." },
      { text: "A mix of animal products and plant-based protein", score: 2, tip: "Try incorporating 'plant-based days' to give your kidneys a rest from high acid-load foods." },
      { text: "Primarily beans, grains, tofu, and organic vegetables", score: 3, tip: "Excellent. Plant protein reduces renal acid load and is associated with slower CKD progression." }
    ]
  }
];

function initQuiz() {
  let currentStep = 0;
  const answers = [];

  const quizBox = document.getElementById('quiz-box');
  if (!quizBox) return;

  function renderStep() {
    if (currentStep < QUIZ_QUESTIONS.length) {
      const q = QUIZ_QUESTIONS[currentStep];
      const progressPercent = (currentStep / QUIZ_QUESTIONS.length) * 100;

      quizBox.innerHTML = `
        <div class="quiz-progress">
          <div class="quiz-progress-bar" style="width: ${progressPercent}%"></div>
        </div>
        <div class="quiz-question-container">
          <div class="quiz-question">${q.question}</div>
          <div class="quiz-options">
            ${q.options.map((opt, idx) => `
              <button class="quiz-option" data-idx="${idx}">${opt.text}</button>
            `).join('')}
          </div>
        </div>
        <div class="quiz-controls">
          <button class="btn btn-secondary" id="quiz-prev" ${currentStep === 0 ? 'disabled' : ''}>Previous</button>
          <button class="btn btn-primary" id="quiz-next" disabled>Next</button>
        </div>
      `;

      // Set selection handlers
      const options = quizBox.querySelectorAll('.quiz-option');
      options.forEach(btn => {
        btn.addEventListener('click', () => {
          options.forEach(o => o.classList.remove('selected'));
          btn.classList.add('selected');
          quizBox.querySelector('#quiz-next').disabled = false;
        });
      });

      // Navigation button events
      quizBox.querySelector('#quiz-next').addEventListener('click', () => {
        const selectedOpt = quizBox.querySelector('.quiz-option.selected');
        const optIdx = parseInt(selectedOpt.getAttribute('data-idx'));
        answers[currentStep] = q.options[optIdx];
        currentStep++;
        renderStep();
      });

      quizBox.querySelector('#quiz-prev').addEventListener('click', () => {
        if (currentStep > 0) {
          currentStep--;
          renderStep();
        }
      });

    } else {
      // Render results
      const totalScore = answers.reduce((sum, ans) => sum + ans.score, 0);
      const maxScore = QUIZ_QUESTIONS.length * 3;
      let scoreCategory = "Wellness Explorer";
      let summaryText = "Your habits show a solid curiosity about plant-based wellness, but there's room to further support your kidneys!";

      if (totalScore >= 10) {
        scoreCategory = "Green Kidney Champion";
        summaryText = "Incredible work! Your habits are highly supportive of kidney longevity and filtration health. Keep up the clean, plant-rich lifestyle.";
      } else if (totalScore >= 6) {
        scoreCategory = "Kidney-Conscious Practitioner";
        summaryText = "You are on the right path! Implementing small, consistent plant-focused modifications will yield excellent results for your vitality.";
      }

      quizBox.innerHTML = `
        <div class="quiz-results">
          <h3>Your Assessment Result</h3>
          <span class="quiz-score-badge">${scoreCategory} (${totalScore}/${maxScore} pts)</span>
          <p style="margin-bottom: 1.5rem; font-weight: 500; color: var(--primary);">${summaryText}</p>
          <h4 style="font-size: 1.1rem; margin-bottom: 0.75rem; color: var(--primary-dark);">Customized Botanical & Lifestyle Tips:</h4>
          <ul style="list-style: none; margin-bottom: 2rem;">
            ${answers.map(ans => `
              <li style="position: relative; padding-left: 1.5rem; margin-bottom: 0.75rem; font-size: 0.92rem; color: var(--text-muted);">
                <span style="position: absolute; left: 0; color: var(--secondary);">✦</span>
                ${ans.tip}
              </li>
            `).join('')}
          </ul>
          <button class="btn btn-primary" id="quiz-reset" style="width: 100%">Retake Assessment</button>
        </div>
      `;

      quizBox.querySelector('#quiz-reset').addEventListener('click', () => {
        currentStep = 0;
        answers.length = 0;
        renderStep();
      });
    }
  }

  renderStep();
}


/* ==========================================================================
   3. LAB LIBRARY (Searchable markers)
   ========================================================================== */
const LAB_MARKERS = [
  {
    abbreviation: "eGFR",
    name: "Estimated Glomerular Filtration Rate",
    category: "Filtration Rate",
    description: "The primary gauge of how well your kidneys are filtering wastes. Higher numbers indicate better function.",
    normalRange: "> 90 mL/min/1.73m²",
    significance: "Under 60 for three months indicates chronic kidney disease (CKD). Calculated using your blood creatinine level, age, and biological sex.",
    colorClass: "green"
  },
  {
    abbreviation: "Creatinine",
    name: "Serum Creatinine",
    category: "Waste Product",
    description: "A chemical waste product generated from muscle metabolism. Healthy kidneys filter it out completely.",
    normalRange: "0.6 – 1.2 mg/dL",
    significance: "Elevated serum levels suggest kidneys are struggling to filter. Plant-based diets reduce excessive creatinine inputs.",
    colorClass: "terracotta"
  },
  {
    abbreviation: "BUN",
    name: "Blood Urea Nitrogen",
    category: "Waste Product",
    description: "Measures the amount of nitrogen in your blood that comes from the waste product urea (made from protein breakdown).",
    normalRange: "7 – 20 mg/dL",
    significance: "High BUN can indicate kidney issues or dehydration. High dietary animal protein significantly drives BUN upward.",
    colorClass: "terracotta"
  },
  {
    abbreviation: "UACR",
    name: "Urine Albumin-to-Creatinine Ratio",
    category: "Protein Leakage",
    description: "Checks for tiny amounts of the protein albumin leaking through the kidney filters into the urine.",
    normalRange: "< 30 mg/g",
    significance: "Levels between 30 and 300 indicate microalbuminuria (early damage). Plant foods lower systemic inflammation to support filter integrity.",
    colorClass: "terracotta"
  },
  {
    abbreviation: "Serum Potassium",
    name: "Potassium Level",
    category: "Electrolyte",
    description: "Crucial electrolyte for nerve and muscle function, especially the heart. Balance is strictly managed by kidneys.",
    normalRange: "3.5 – 5.0 mEq/L",
    significance: "Both high (hyperkalemia) and low potassium can be dangerous. Advanced stages of kidney disease require mindful plant selection.",
    colorClass: "green"
  },
  {
    abbreviation: "Serum Phosphorus",
    name: "Mineral Balance",
    category: "Mineral",
    description: "A mineral essential for bone health. Excess phosphorus in the blood pulls calcium out of bones, weakening them.",
    normalRange: "2.5 – 4.5 mg/dL",
    significance: "Inorganic phosphorus additives in processed foods are absorbed at 100%, whereas organic plant phosphorus is only 30-50% absorbed.",
    colorClass: "green"
  }
];

function initLabLibrary() {
  const grid = document.getElementById('library-grid');
  const searchInput = document.getElementById('library-search');
  if (!grid || !searchInput) return;

  function renderMarkers(filteredList) {
    if (filteredList.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
          <p>No markers found matching your search. Try searching for "GFR", "BUN", or "Protein".</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filteredList.map(marker => `
      <div class="library-card">
        <div class="library-card-content">
          <span class="library-card-badge">${marker.category}</span>
          <h3 style="margin-bottom: 0.25rem;">${marker.abbreviation}</h3>
          <h4 style="font-size: 0.95rem; font-style: italic; color: var(--text-muted); margin-bottom: 1rem; font-family: 'Inter', sans-serif; font-weight: 500;">
            ${marker.name}
          </h4>
          <p>${marker.description}</p>
          <div style="background-color: var(--bg-soft); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem; font-size: 0.9rem;">
            <strong>Significance:</strong> ${marker.significance}
          </div>
          <div class="library-marker-box">
            <span class="library-marker-label">Optimal Range:</span>
            <span class="library-marker-value" style="color: ${marker.colorClass === 'terracotta' ? 'var(--accent-terracotta)' : 'var(--secondary)'}">
              ${marker.normalRange}
            </span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Listen to search inputs
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = LAB_MARKERS.filter(m => 
      m.abbreviation.toLowerCase().includes(query) ||
      m.name.toLowerCase().includes(query) ||
      m.category.toLowerCase().includes(query) ||
      m.description.toLowerCase().includes(query)
    );
    renderMarkers(filtered);
  });

  // Initial render
  renderMarkers(LAB_MARKERS);
}


/* ==========================================================================
   4. PLANT LIBRARY (Dynamic filters & metrics)
   ========================================================================== */
const PLANT_ITEMS = [
  {
    name: "Red Bell Pepper",
    scientific: "Capsicum annuum",
    image: "https://images.unsplash.com/photo-1563565088-933420be5394?w=600&auto=format&fit=crop&q=60",
    description: "Low in potassium and packed with vitamins C, A, and B6. They also contain lycopene, an antioxidant that protects against cell damage.",
    potassium: "Low",
    phosphorus: "Low",
    sodium: "Low",
    benefit: "Excellent low-potassium base for stir-fries and salads."
  },
  {
    name: "Cauliflower",
    scientific: "Brassica oleracea var. botrytis",
    image: "https://images.unsplash.com/photo-1568584711271-6c929fb49b60?w=600&auto=format&fit=crop&q=60",
    description: "An incredibly versatile cruciferous vegetable. Rich in indoles, glucosinolates, and tissue-cleansing fiber. Makes a great low-potassium alternative to potatoes.",
    potassium: "Low",
    phosphorus: "Low",
    sodium: "Low",
    benefit: "Perfect mash substitute to lower potassium and carbohydrate load."
  },
  {
    name: "Blueberries",
    scientific: "Vaccinium corymbosum",
    image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=600&auto=format&fit=crop&q=60",
    description: "The ultimate kidney superfood. Loaded with antioxidants called anthocyanins, which reduce systemic inflammation and support cardiovascular health.",
    potassium: "Low",
    phosphorus: "Low",
    sodium: "Low",
    benefit: "High antioxidant count with very low glycemic and potassium index."
  },
  {
    name: "Garlic",
    scientific: "Allium sativum",
    image: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=600&auto=format&fit=crop&q=60",
    description: "Provides a delicious, pungent flavor profile that reduces the need for table salt. Rich in allicin, a compound with potent anti-inflammatory properties.",
    potassium: "Low",
    phosphorus: "Low",
    sodium: "Low",
    benefit: "Natural anti-hypertensive and excellent sodium substitute."
  },
  {
    name: "Arugula",
    scientific: "Eruca vesicaria",
    image: "https://images.unsplash.com/photo-1589135763071-85b46e3fb242?w=600&auto=format&fit=crop&q=60",
    description: "Unlike spinach or chard, which are extremely high in potassium and oxalates, arugula is a kidney-safe leafy green. Rich in nitrates to lower blood pressure.",
    potassium: "Low",
    phosphorus: "Low",
    sodium: "Low",
    benefit: "Protects filtration units by substituting high-oxalate spinach."
  },
  {
    name: "Red Grapes",
    scientific: "Vitis vinifera",
    image: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&auto=format&fit=crop&q=60",
    description: "Contains resveratrol, a flavonoid linked to improved kidney tissue markers and cardiovascular health. High water content assists hydration.",
    potassium: "Low",
    phosphorus: "Low",
    sodium: "Low",
    benefit: "Anti-inflammatory and supportive of endothelial cell health."
  },
  {
    name: "Cranberries",
    scientific: "Vaccinium macrocarpon",
    image: "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=600&auto=format&fit=crop&q=60",
    description: "Prevents bacteria from sticking to the urinary tract walls, protecting both the bladder and the kidneys from painful infections.",
    potassium: "Low",
    phosphorus: "Low",
    sodium: "Low",
    benefit: "Aids urinary tract health and contains unique proanthocyanidins."
  },
  {
    name: "Cabbage",
    scientific: "Brassica oleracea var. capitata",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=60",
    description: "Affordable, crunchy, and loaded with vitamin K, vitamin C, and fiber. Very low in potassium and phosphorus, making it an ideal staple.",
    potassium: "Low",
    phosphorus: "Low",
    sodium: "Low",
    benefit: "High fiber promotes bowel regularity, reducing uremic toxins."
  }
];

function initPlantLibrary() {
  const grid = document.getElementById('plant-grid');
  const tabs = document.querySelectorAll('.filter-tab');
  if (!grid || tabs.length === 0) return;

  function renderPlants(filter) {
    let filtered = PLANT_ITEMS;
    if (filter !== 'all') {
      // Currently, all our curated items are Low Potassium/Phosphorus/Sodium,
      // but let's simulate filter behavior for demo purposes.
      if (filter === 'low-potassium') {
        filtered = PLANT_ITEMS.filter(p => p.potassium === 'Low');
      } else if (filter === 'low-phosphorus') {
        filtered = PLANT_ITEMS.filter(p => p.phosphorus === 'Low');
      } else if (filter === 'low-sodium') {
        filtered = PLANT_ITEMS.filter(p => p.sodium === 'Low');
      }
    }

    grid.innerHTML = filtered.map(plant => `
      <div class="plant-card">
        <div class="plant-card-image">
          <img src="${plant.image}" alt="${plant.name}" onerror="this.src='https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=60'">
        </div>
        <div class="plant-card-content">
          <h3 style="margin-bottom: 0.15rem;">${plant.name}</h3>
          <span class="plant-scientific">${plant.scientific}</span>
          <p>${plant.description}</p>
          <div style="background-color: var(--accent-light); border: 1px solid var(--accent); padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: 0.88rem; margin-bottom: 1.5rem; color: #78350f;">
            <strong>Therapeutic benefit:</strong> ${plant.benefit}
          </div>
          <div class="plant-metrics">
            <div class="plant-metric-item">
              <span class="plant-metric-label">Potassium</span>
              <span class="plant-metric-val low">${plant.potassium}</span>
            </div>
            <div class="plant-metric-item">
              <span class="plant-metric-label">Phosphorus</span>
              <span class="plant-metric-val low">${plant.phosphorus}</span>
            </div>
            <div class="plant-metric-item">
              <span class="plant-metric-label">Sodium</span>
              <span class="plant-metric-val low">${plant.sodium}</span>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.getAttribute('data-filter');
      renderPlants(filter);
    });
  });

  // Initial render
  renderPlants('all');
}


/* ==========================================================================
   5. FREE DAILY CHECKLIST TRACKER
   ========================================================================== */
const CHECKLIST_ITEMS = [
  { id: 'water', text: "Drank 2.0 to 2.5 liters of pure water (unless fluid restricted by nephrologist)" },
  { id: 'veggies', text: "Ate 3+ servings of low-potassium/low-oxalates greens or veggies (bell pepper, arugula, etc.)" },
  { id: 'sodium', text: "Kept sodium intake below 1500mg (avoided added table salt and processed food)" },
  { id: 'phosphorus', text: "Read food labels and avoided items containing 'PHOS' additives (inorganic phosphates)" },
  { id: 'movement', text: "Completed 30 minutes of restorative movement (walking, stretching, yoga)" },
  { id: 'mindfulness', text: "Practiced 10 minutes of stress-relieving deep breathing or meditation" }
];

function initChecklist() {
  const itemsContainer = document.getElementById('checklist-items');
  const barFill = document.getElementById('checklist-bar');
  const progressTextVal = document.getElementById('checklist-progress-text-val');
  const printBtn = document.getElementById('print-checklist');
  const resetBtn = document.getElementById('reset-checklist');
  
  if (!itemsContainer) return;

  // Retrieve saved state from LocalStorage
  let savedState = JSON.parse(localStorage.getItem('greenKidneyChecklist')) || {};

  function updateProgress() {
    const total = CHECKLIST_ITEMS.length;
    const checkedCount = Object.values(savedState).filter(val => val === true).length;
    const percent = Math.round((checkedCount / total) * 100);

    barFill.style.width = `${percent}%`;
    progressTextVal.textContent = `${checkedCount} of ${total} completed (${percent}%)`;
    
    // Save to LocalStorage
    localStorage.setItem('greenKidneyChecklist', JSON.stringify(savedState));
  }

  function renderChecklist() {
    itemsContainer.innerHTML = CHECKLIST_ITEMS.map(item => {
      const isChecked = savedState[item.id] === true;
      return `
        <label class="checklist-item ${isChecked ? 'checked' : ''}" data-id="${item.id}">
          <div class="checklist-checkbox-wrapper">
            <input type="checkbox" id="chk-${item.id}" ${isChecked ? 'checked' : ''}>
            <span class="checklist-custom-checkbox"></span>
          </div>
          <span class="checklist-text">${item.text}</span>
        </label>
      `;
    }).join('');

    // Setup toggle listeners
    const checkboxes = itemsContainer.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(chk => {
      chk.addEventListener('change', (e) => {
        const parentLabel = chk.closest('.checklist-item');
        const id = parentLabel.getAttribute('data-id');
        const isChecked = e.target.checked;
        
        savedState[id] = isChecked;
        if (isChecked) {
          parentLabel.classList.add('checked');
        } else {
          parentLabel.classList.remove('checked');
        }
        updateProgress();
      });
    });

    updateProgress();
  }

  // Print button action
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Reset button action
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      savedState = {};
      localStorage.removeItem('greenKidneyChecklist');
      renderChecklist();
    });
  }

  renderChecklist();
}


/* ==========================================================================
   6. MODAL DIALOGS
   ========================================================================== */
function initModals() {
  const modal = document.getElementById('download-modal');
  const triggers = document.querySelectorAll('.trigger-download-modal');
  const closeBtn = document.querySelector('.close-modal');
  const form = document.getElementById('download-form');

  if (!modal || !closeBtn) return;

  function openModal(e) {
    if (e) e.preventDefault();
    modal.classList.add('active');
  }

  function closeModal() {
    modal.classList.remove('active');
    if (form) form.reset();
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('click', openModal);
  });

  closeBtn.addEventListener('click', closeModal);

  // Close when clicking outside content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const nameInput = form.querySelector('input[type="text"]');
      
      if (emailInput.value) {
        alert(`Thank you, ${nameInput.value || 'Friend'}! The Kidney-Friendly Starter Checklist & Guide has been sent to ${emailInput.value}.`);
        closeModal();
      }
    });
  }
}

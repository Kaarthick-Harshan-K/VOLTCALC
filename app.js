/**
 * VoltCalc TN - Main Application Logic
 * Interactive UI, Electric Effects, Theme Toggle, and Real-time Tariff Rendering
 * Updated according to the latest "TAMILNADU ELECTRICITY BILL - NEW TARIFF" schedule.
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const themeToggleBtn = document.getElementById('theme-toggle');
    const unitsInput = document.getElementById('units-input');
    const btnCalculate = document.getElementById('btn-calculate');
    const presetChips = document.querySelectorAll('.preset-chip');
    
    // Output Elements
    const billAmountEl = document.getElementById('bill-amount');
    const tierBadgeEl = document.getElementById('tier-badge');
    const avgRateEl = document.getElementById('avg-rate');
    const freeUnitsEl = document.getElementById('free-units');
    const freeUnitsSubEl = document.getElementById('free-units-sub');
    const billableUnitsEl = document.getElementById('billable-units');
    const thresholdAlertEl = document.getElementById('threshold-alert');
    const thresholdMessageEl = document.getElementById('threshold-message');
    
    // Distribution Toggle & Container
    const btnToggleDist = document.getElementById('btn-toggle-distribution');
    const distContainer = document.getElementById('distribution-container');
    const distTableBody = document.getElementById('dist-table-body');
    const distTotalUnitsEl = document.getElementById('dist-total-units');
    const distTotalCostEl = document.getElementById('dist-total-cost');
    const distCategoryBadge = document.getElementById('dist-category-badge');

    // Reference Accordion
    const btnToggleRef = document.getElementById('btn-toggle-reference');
    const refContent = document.getElementById('reference-content');

    // Canvas for Electrical Spark/Energy Aura
    initElectricCanvas();

    // 1. Theme Toggle System
    initTheme();

    function initTheme() {
        const savedTheme = localStorage.getItem('voltcalc_theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else {
            // Default to dark theme for electric ambience
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('voltcalc_theme', newTheme);
            triggerElectricFlash();
        });
    }

    // 2. Preset Chips Click Handlers
    presetChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const val = chip.getAttribute('data-units');
            unitsInput.value = val;
            presetChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            updateBillCalculation();
        });
    });

    // 3. Units Input Listeners
    unitsInput.addEventListener('input', () => {
        syncPresetChips(unitsInput.value);
        updateBillCalculation();
    });

    unitsInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            updateBillCalculation();
            triggerElectricFlash();
        }
    });

    btnCalculate.addEventListener('click', () => {
        updateBillCalculation();
        triggerElectricFlash();
    });

    // 3b. Stepper Arrow Buttons Handlers (Situated right before the SI units badge)
    const btnUnitInc = document.getElementById('btn-unit-inc');
    const btnUnitDec = document.getElementById('btn-unit-dec');

    if (btnUnitInc) {
        btnUnitInc.addEventListener('click', () => {
            const current = parseFloat(unitsInput.value) || 0;
            unitsInput.value = Math.max(0, current + 1);
            syncPresetChips(unitsInput.value);
            updateBillCalculation();
            triggerElectricFlash();
        });
    }

    if (btnUnitDec) {
        btnUnitDec.addEventListener('click', () => {
            const current = parseFloat(unitsInput.value) || 0;
            unitsInput.value = Math.max(0, current - 1);
            syncPresetChips(unitsInput.value);
            updateBillCalculation();
            triggerElectricFlash();
        });
    }

    function syncPresetChips(currentValue) {
        presetChips.forEach(chip => {
            if (chip.getAttribute('data-units') === String(currentValue).trim()) {
                chip.classList.add('active');
            } else {
                chip.classList.remove('active');
            }
        });
    }

    // 4. Requirement 7: Dedicated Distribution Details Toggle Button
    let isDistributionVisible = false;
    btnToggleDist.addEventListener('click', () => {
        isDistributionVisible = !isDistributionVisible;
        if (isDistributionVisible) {
            distContainer.classList.add('visible');
            btnToggleDist.classList.add('active');
            btnToggleDist.querySelector('.toggle-text').textContent = 'Hide Slab Distribution Details';
            // Smoothly scroll down slightly to bring the table into view
            setTimeout(() => {
                distContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        } else {
            distContainer.classList.remove('visible');
            btnToggleDist.classList.remove('active');
            btnToggleDist.querySelector('.toggle-text').textContent = '⚡ View Slab Distribution Details';
        }
    });

    // 5. Official Tariff Reference Accordion Toggle
    let isRefVisible = false;
    if (btnToggleRef && refContent) {
        btnToggleRef.addEventListener('click', () => {
            isRefVisible = !isRefVisible;
            if (isRefVisible) {
                refContent.classList.add('visible');
                btnToggleRef.querySelector('.ref-toggle-icon').style.transform = 'rotate(180deg)';
            } else {
                refContent.classList.remove('visible');
                btnToggleRef.querySelector('.ref-toggle-icon').style.transform = 'rotate(0deg)';
            }
        });
    }

    // 6. Calculation and UI Rendering
    function updateBillCalculation() {
        const val = unitsInput.value.trim();
        const units = parseFloat(val);

        if (isNaN(units) || units < 0) {
            renderEmptyState();
            return;
        }

        const result = calculateEBBill(units);
        renderBillResult(result);
    }

    function renderEmptyState() {
        billAmountEl.textContent = '0.00';
        avgRateEl.textContent = '₹ 0.00 / unit';
        freeUnitsEl.textContent = '0 Units';
        if (freeUnitsSubEl) freeUnitsSubEl.textContent = '1 to 200 units free (upto 500U)';
        billableUnitsEl.textContent = '0 Units';
        tierBadgeEl.className = 'slab-badge tier-subsidized';
        tierBadgeEl.textContent = 'Consumption Upto 500 Unit';
        thresholdAlertEl.classList.add('hidden');
        distTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 18px; color: var(--text-muted);">Enter units to see slab distribution</td></tr>`;
        distTotalUnitsEl.textContent = '0 Units';
        distTotalCostEl.textContent = '₹ 0.00';
    }

    function renderBillResult(result) {
        // Animate counter for hero bill amount
        animateAmountValue(result.totalAmount);

        // Tier Badge
        tierBadgeEl.className = `slab-badge ${result.tierClass}`;
        tierBadgeEl.textContent = result.tierBadge;

        // Metric Tiles
        avgRateEl.textContent = `${result.avgCostFormatted} / unit`;
        freeUnitsEl.textContent = `${result.freeUnits} Units`;
        if (freeUnitsSubEl) {
            freeUnitsSubEl.textContent = result.isAbove500 
                ? '1 to 100 units free (above 500U)' 
                : '1 to 200 units free (upto 500U)';
        }
        billableUnitsEl.textContent = `${result.billableUnits} Units`;

        // 500 Unit Threshold Alert with New Tariff Dynamics
        if (result.units >= 480 && result.units <= 500) {
            thresholdAlertEl.classList.remove('hidden');
            thresholdMessageEl.innerHTML = `<strong>Attention:</strong> You are currently at <strong>${result.units} units</strong>. Under <em>Consumption Upto 500 Unit</em>, your first <strong>200 units are 100% Free</strong> (Bill = ₹${result.totalAmount.toFixed(2)}). Crossing 500 units reduces your free quota to 100 units and charges units 101–400 at ₹4.70!`;
        } else if (result.units > 500 && result.units <= 530) {
            thresholdAlertEl.classList.remove('hidden');
            thresholdMessageEl.innerHTML = `<strong>Tariff Shift Notice:</strong> At <strong>${result.units} units</strong>, you fall under <em>Consumption Above 500 Unit</em>. Only the first 100 units are free (101–400 units are charged at ₹4.70/unit).`;
        } else {
            thresholdAlertEl.classList.add('hidden');
        }

        // Render Distribution Table
        distCategoryBadge.textContent = result.tierCategory;
        distTotalUnitsEl.textContent = `${result.units} Units`;
        distTotalCostEl.textContent = result.totalAmountFormatted;

        distTableBody.innerHTML = '';
        result.breakdown.forEach((slab, index) => {
            const tr = document.createElement('tr');
            if (slab.active) {
                tr.classList.add('active-row');
            }

            const isFree = slab.rate === 0;
            const rateBadge = isFree 
                ? `<span style="color: var(--electric-green); font-weight:700;">₹ 0.00 (Free)</span>`
                : `₹ ${slab.rate.toFixed(2)}`;

            tr.innerHTML = `
                <td>
                    <div style="font-weight: 600; color: var(--text-primary);">${index + 1}. ${slab.range}</div>
                    <div class="slab-meter-bar">
                        <div class="slab-meter-fill" style="width: ${slab.percentageOfTotal}%;"></div>
                    </div>
                </td>
                <td>
                    <span style="font-weight: ${slab.units > 0 ? '700' : '400'}; color: ${slab.units > 0 ? 'var(--text-primary)' : 'var(--text-muted)'};">
                        ${slab.units} Units
                    </span>
                    ${slab.units > 0 ? `<div style="font-size: 0.74rem; color: var(--text-muted);">${slab.percentageOfTotal.toFixed(1)}% of total</div>` : ''}
                </td>
                <td class="rate-col">${rateBadge}</td>
                <td class="cost-col">${slab.costFormatted}</td>
            `;
            distTableBody.appendChild(tr);
        });
    }

    // Number roll animation
    let animationFrameId = null;
    function animateAmountValue(targetVal) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        const startVal = parseFloat(billAmountEl.textContent.replace(/,/g, '')) || 0;
        const duration = 380;
        const startTime = performance.now();

        function updateStep(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = startVal + (targetVal - startVal) * easeOut;
            billAmountEl.textContent = currentVal.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(updateStep);
            } else {
                billAmountEl.textContent = targetVal.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            }
        }
        animationFrameId = requestAnimationFrame(updateStep);
    }

    // Visual Spark effect on calculate
    function triggerElectricFlash() {
        const card = document.querySelector('.bill-hero-box');
        if (card) {
            card.style.transition = 'box-shadow 0.15s ease';
            card.style.boxShadow = '0 0 35px rgba(0, 242, 254, 0.7), inset 0 0 25px rgba(0, 242, 254, 0.3)';
            setTimeout(() => {
                card.style.boxShadow = 'inset 0 0 20px rgba(0, 242, 254, 0.05)';
            }, 350);
        }
    }

    // 7. Ambient Electric Spark Canvas
    function initElectricCanvas() {
        const canvas = document.getElementById('electric-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const particleCount = 28;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8 - 0.3,
                radius: Math.random() * 2 + 1,
                alpha: Math.random() * 0.6 + 0.2,
                sparkLife: Math.random() * 80 + 40
            });
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.sparkLife--;

                if (p.sparkLife <= 0 || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
                    p.x = Math.random() * width;
                    p.y = Math.random() * height;
                    p.sparkLife = Math.random() * 80 + 40;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 242, 254, ${p.alpha})`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#00f2fe';
                ctx.fill();
            }

            requestAnimationFrame(draw);
        }
        draw();
    }

    // Initial calculation with 350 units
    updateBillCalculation();
});

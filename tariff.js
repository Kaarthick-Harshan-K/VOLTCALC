/**
 * TNEB Electricity Bill Calculator Engine (Updated Tariff Slabs)
 * Matches precisely with "TAMILNADU ELECTRICITY BILL - NEW TARIFF"
 */

const TARIFF_DATA = {
    tierBelow500: {
        title: "Consumption Upto 500 Unit",
        subtitle: "Concessional Domestic Slab (First 200 Units Free)",
        slabs: [
            { id: 1, range: "1 to 200 units", min: 0, max: 200, rate: 0.00, label: "₹ 0.00 (Free)" },
            { id: 2, range: "201 to 400 units", min: 200, max: 400, rate: 4.70, label: "₹ 4.70" },
            { id: 3, range: "401 to 500 units", min: 400, max: 500, rate: 6.30, label: "₹ 6.30" }
        ]
    },
    tierAbove500: {
        title: "Consumption Above 500 Unit",
        subtitle: "Standard High-Usage Slab (First 100 Units Free)",
        slabs: [
            { id: 1, range: "1 to 100 units", min: 0, max: 100, rate: 0.00, label: "0 (Free)" },
            { id: 2, range: "101 to 400 units", min: 100, max: 400, rate: 4.70, label: "₹ 4.70" },
            { id: 3, range: "401 to 500 units", min: 400, max: 500, rate: 6.30, label: "₹ 6.30" },
            { id: 4, range: "501 to 600 units", min: 500, max: 600, rate: 8.40, label: "₹ 8.40" },
            { id: 5, range: "601 to 800 units", min: 600, max: 800, rate: 9.45, label: "₹ 9.45" },
            { id: 6, range: "801 to 1000 units", min: 800, max: 1000, rate: 10.50, label: "₹ 10.50" },
            { id: 7, range: "Above 1000 Units", min: 1000, max: Infinity, rate: 11.55, label: "₹ 11.55" }
        ]
    }
};

/**
 * Calculates bill breakdown for given units consumed in 2 months.
 * @param {number} units - Bimonthly electricity units consumed
 * @returns {object} calculation results
 */
function calculateEBBill(units) {
    const rawUnits = Number(units);
    if (isNaN(rawUnits) || rawUnits < 0) {
        return {
            isValid: false,
            units: 0,
            totalAmount: 0,
            avgCostPerUnit: 0,
            tier: null,
            breakdown: [],
            freeUnits: 0,
            billableUnits: 0
        };
    }

    const totalUnits = Math.round(rawUnits * 100) / 100;
    const isAbove500 = totalUnits > 500;
    const tierConfig = isAbove500 ? TARIFF_DATA.tierAbove500 : TARIFF_DATA.tierBelow500;
    const slabs = tierConfig.slabs;

    let totalAmount = 0;
    let accumulatedUnits = 0;
    const breakdown = [];

    for (const slab of slabs) {
        const slabCapacity = slab.max === Infinity ? Infinity : (slab.max - slab.min);
        let unitsInThisSlab = 0;

        if (totalUnits > slab.min) {
            if (slab.max === Infinity) {
                unitsInThisSlab = totalUnits - slab.min;
            } else {
                unitsInThisSlab = Math.min(totalUnits - slab.min, slabCapacity);
            }
        }

        const slabCost = Math.round(unitsInThisSlab * slab.rate * 100) / 100;
        totalAmount += slabCost;
        accumulatedUnits += unitsInThisSlab;

        breakdown.push({
            id: slab.id,
            range: slab.range,
            rate: slab.rate,
            rateFormatted: slab.rate === 0 ? "₹ 0.00 (Free)" : `₹ ${slab.rate.toFixed(2)}`,
            units: unitsInThisSlab,
            cost: slabCost,
            costFormatted: `₹ ${slabCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            active: unitsInThisSlab > 0,
            percentageOfTotal: totalUnits > 0 ? ((unitsInThisSlab / totalUnits) * 100) : 0
        });
    }

    totalAmount = Math.round(totalAmount * 100) / 100;
    const avgCostPerUnit = totalUnits > 0 ? (totalAmount / totalUnits) : 0;
    
    // In new tariff: 0-500 category gets 200 free units; >500 category gets 100 free units
    const freeUnitsMax = isAbove500 ? 100 : 200;
    const freeUnits = Math.min(totalUnits, freeUnitsMax);
    const billableUnits = Math.max(0, totalUnits - freeUnitsMax);

    return {
        isValid: true,
        units: totalUnits,
        totalAmount: totalAmount,
        totalAmountFormatted: `₹ ${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        avgCostPerUnit: avgCostPerUnit,
        avgCostFormatted: `₹ ${avgCostPerUnit.toFixed(2)}`,
        tierCategory: isAbove500 ? "Consumption Above 500 Unit" : "Consumption Upto 500 Unit",
        tierBadge: isAbove500 ? "Above 500 Units Slab" : "Upto 500 Units (200 Free Units)",
        tierClass: isAbove500 ? "tier-high" : "tier-subsidized",
        breakdown: breakdown,
        freeUnits: freeUnits,
        freeUnitsMax: freeUnitsMax,
        billableUnits: billableUnits,
        isAbove500: isAbove500
    };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculateEBBill, TARIFF_DATA };
}

function simulateHit ({chanceToHit, minDamage, maxDamage, criticalChancePercents, criticalDamagePercents}) {
    //crit chance and crit damage = direct % from stats
    //example : 91, 200, 300 , 7, 150
    const averageDam = (minDamage+maxDamage)/2;

    const isHit = Math.random()<(chanceToHit/100);
    if (!isHit) return 0;

    let isHitCritical = Math.random()<(criticalChancePercents/100);
    /*if (!isHitCritical) {
        isHitCritical = Math.random()<(criticalChancePercents/100)
    }*/
    const isCriticalHitLanded = Math.random()<(chanceToHit/100);

    if (isHitCritical && isCriticalHitLanded) {
        return averageDam*criticalDamagePercents/100;
    }

    return averageDam;
}

function calculateDps(options) {
    let totalDamage = 0;
    for (let i=0; i<options.simulationNumber; i++) {
        totalDamage += simulateHit(options);
    }
    return Math.round(totalDamage/options.simulationNumber*options.attackSpeed)
}

//crit now - 144%; 250 multi

const dpsNow = calculateDps({
    chanceToHit: 100,
    attackSpeed: 4.1,
    minDamage: 2438,
    maxDamage: 8337,
    criticalChancePercents: 23.1,
    criticalDamagePercents: 269,
    simulationNumber: 1000000
});

const dpsOpus = calculateDps({
    chanceToHit: 90,
    attackSpeed: 4.1*0.8,
    minDamage: 2438*(450/330),
    maxDamage: 8337*(450/340),
    criticalChancePercents: 24.55*1.48,
    criticalDamagePercents: 269,
    simulationNumber: 1000000
});


//and 4% boost from mine

window.onload = function () {
    document.body.innerHTML = `tornado dps now is ${dpsNow}
  <br>tornado dps increase is ${dpsOpus}; it's ${dpsOpus/dpsNow} boost`;
};


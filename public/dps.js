function simulateHit ({chanceToHit, minDamage, maxDamage, criticalChancePercents, criticalDamagePercents}) {
    //crit chance and crit damage = direct % from stats
    //example : 91, 200, 300 , 7, 150
    const averageDam = (minDamage+maxDamage)/2;

    const isHit = Math.random()<(chanceToHit/100);
    if (!isHit) return 0;

    const isHitCritical = Math.random()<(criticalChancePercents/100);
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

const tornadoDps = calculateDps({
    chanceToHit: 91,
    attackSpeed: 2,
    minDamage: 571,
    maxDamage: 1412,
    criticalChancePercents: 34.4,
    criticalDamagePercents: 369,
    simulationNumber: 1000000
});

const tornadoDpsWithoutMisses = calculateDps({
    chanceToHit: 100,
    attackSpeed: 2,
    minDamage: 571,
    maxDamage: 1412,
    criticalChancePercents: 34.4,
    criticalDamagePercents: 369,
    simulationNumber: 1000000
});


//and 4% boost from mine

window.onload = function () {
  document.body.innerHTML = `tornado dps now is ${tornadoDps}
  <br>tornado dps increase is ${tornadoDpsWithoutMisses}; it's ${tornadoDpsWithoutMisses/tornadoDps} boost`;
};
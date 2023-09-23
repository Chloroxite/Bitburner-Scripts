/** @param {NS} ns */
//Starting script for every world. Will pretty much always be the first script you run in a new world.
export async function main(ns) {
	//Settings
	const target = "foodnstuff";
	const moneyThreshold = ns.getServerMaxMoney(target) * 0.75;
	const secThreshold = ns.getServerMinSecurityLevel(target) * 1.2;
	const minSec = ns.getServerMinSecurityLevel(target);
	const maxMoney = ns.getServerMaxMoney(target);

	//Makes target hackable
	ns.nuke(target);

	//Once target is hackable, begin running a cycle where the target is weakened to below the security level threshold.
	//When below the threshold, begin growing target's money to above the money threshold.
	//When all conditions are met, hack. This will extract money, and raise the security.
	//The script will moderate the security and money levels as needed.
	while (true) {
		if (ns.getServerSecurityLevel(target) >= secThreshold) {
			while (ns.getServerSecurityLevel(target) > minSec) {
				await ns.weaken(target);
			}
		}
		else if (ns.getServerMoneyAvailable(target) <= moneyThreshold) {
			while (ns.getServerMoneyAvailable(target) < maxMoney) {
				await ns.grow(target);
			}
		}
		else
			await ns.hack(target);
	}
}
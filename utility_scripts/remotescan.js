/** @param {NS} ns */
//This script is designed to obtain more information from a target (directly from home) that would not otherwise
//be obtainable. command is as follows:
//run remotescan.js <target>
//
//or, using an alias
//remotescan <target>
export async function main(ns) {
	const target = ns.args[0];
	if(target == null){
		ns.tprint("Invalid arguments. \nUsage: remotescan <target>");
		ns.exit();
	}

	let targetMaxMoney = ns.getServerMaxMoney(target);
	let targetMoney = ns.getServerMoneyAvailable(target);
	let targetGrowth = ns.getServerGrowth(target);
	let targetRam = ns.getServerMaxRam(target);
	let targetMinSec = ns.getServerMinSecurityLevel(target);
	let targetCurSec = ns.getServerSecurityLevel(target);
	let targetPortsReq = ns.getServerNumPortsRequired(target);
	let targetHackReq = ns.getServerRequiredHackingLevel(target);

	ns.tprint(`\n#==================================#` +
			  `\nTarget: ${target} ` +
			  `\nMax money: ${Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", compactDisplay: "long" }).format(targetMaxMoney)}` +
			  `\nCurrent money: ${Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", compactDisplay: "long" }).format(targetMoney)}` +
			  `\nGrowth amount: ${targetGrowth}` +
			  `\nRam: ${targetRam}GB` +
			  `\nMinimum security level: ${targetMinSec}` +
			  `\nCurrent security level: ${targetCurSec}` +
			  `\nOpen ports required to hack: ${targetPortsReq}` +
			  `\nRequired hacking level: ${targetHackReq}`);
}
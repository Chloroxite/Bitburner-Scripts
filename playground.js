/** @param {NS} ns */
//Mostly a sandbox for testing new mechanics and concepts. Nothing here serves a purpose in production.
import { scanNetwork } from "/utility_scripts/scanapi.js";
import Server from "/utility_scripts/scanapi.js";
import User from "/utility_scripts/userlib.js";
export async function main(ns) {
	let member = ns.gang.getAscensionResult("Quartz");
	let gangs = ns.gang.getOtherGangInformation();
	ns.tprint("growth percent: " + ns.formulas.hacking.growPercent(ns.getServer("ecorp"), 1000, ns.getPlayer()));
	let val1 = ns.formulas.hacking.growPercent(ns.getServer("ecorp"), 1, ns.getPlayer());
	let val2 = ns.formulas.hacking.growPercent(ns.getServer("ecorp"), 2, ns.getPlayer());
	let val3 = val2 - val1;

	ns.tprint("change per thread: " + val3);

	ns.tprint("change per thread using growthAnalyze: " + ns.growthAnalyze("ecorp", 2));
	//ns.tprint(member);
}
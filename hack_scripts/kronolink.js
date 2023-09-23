/** @param {NS} ns */
//Part of the old kronos hacking system. Designed to automatically hack and deliver hacking scripts to targets.
//Slave hosts will then target a host designated by kronoscontrol.

import * as scanapi from "utility_scripts/scanapi.js";

export async function main(ns) {
	//Obtain network information
	const network = await scanapi.scanNetwork(ns);
	network.shift();	

	//Scan hosts
	for(let host in network){
		let ramUsage = ns.getScriptRam("/hack_scripts/kronosminer.js", "home");
		let targetRam = ns.getServerMaxRam(network[host]) - ns.getServerUsedRam(network[host]);
		let threads = Math.floor(targetRam/ramUsage);

		//We don't want to infect ourselves.
		if(host == "home")
			continue;

		//Attempt to gain root access if we don't have it.
		if(!ns.hasRootAccess(network[host])){
			if(ns.fileExists("brutessh.exe"))
				ns.brutessh(network[host]);
			if(ns.fileExists("ftpcrack.exe"))
				ns.ftpcrack(network[host]);
			if(ns.fileExists("relaysmtp.exe"))
				ns.relaysmtp(network[host]);
			if(ns.fileExists("httpworm.exe"))
				ns.httpworm(network[host]);
			if(ns.fileExists("sqlinject.exe"))
				ns.sqlinject(network[host]);
			try{	
				ns.nuke(network[host]);
			}
			catch{
				ns.tprint("Unable to nuke: not enough open ports.");
			}
		}

		//If the server is not a dud and we have root access, dump the scripts onto it and execute them. Log execution.
		if(threads > 0 && ns.hasRootAccess(network[host])){
			ns.scp("/hack_scripts/kronosminer.js", network[host]);
			ns.exec("/hack_scripts/kronosminer.js", network[host], threads);
			ns.tprint(`Script /hack_scripts/kronosminer.js executed on host ${network[host]} with ${threads} threads.`);
		}
		//Elsewise, fail. Log failure.
		else
			ns.tprint(`Execute failed on host ${network[host]}. Device not rooted or incompatible.`);
			
		//Required to prevent runaway.
		await ns.sleep(10);
	} 
}
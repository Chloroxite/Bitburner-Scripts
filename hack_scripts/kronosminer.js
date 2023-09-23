/** @param {NS} ns */
//Old hacking script, replaced with the kronoslink-slavemaster system. Requires preparations to be made manually.
//No delivery system. behaves much like foodnstuff.js
export async function main(ns) {	
	while (true) {
		const port = ns.getPortHandle(1);
		if(port.empty())
			await port.nextWrite();

		let target = ns.peek(1);
		
			
		if(target == "terminate"){
			ns.tprint(`Miner on host ${ns.getHostname()} terminated.`);
			ns.exit();
		}

		let moneyThreshold = ns.getServerMaxMoney(target) * 0.90;
		let secThreshold = ns.getServerMinSecurityLevel(target) * 1.1;		
		if (ns.getServerSecurityLevel(target) >= secThreshold) {	
			await ns.weaken(target);
		}
		else if (ns.getServerMoneyAvailable(target) <= moneyThreshold) {			
			await ns.grow(target);	
		}
		else{
			await ns.hack(target);	
		}
	}
}
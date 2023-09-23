/** @param {NS} ns */
//Script designed to automatically create a set of custom hosts with maxed(?) out stats. These servers can be 
//used as powerful slave hosts with the slavemaster script.
import {scanNetwork} from "/utility_scripts/scanapi.js";
import Server from "/utility_scripts/scanapi.js";
export async function main(ns) {
	//Settings
	const amount = 25;
	const ram = 2048;
	const servername = "slavebot";
	const regEx = /^slavebot/;

	//Begin script
	const hostnames = await scanNetwork(ns);
	let servers = [];

	//Search for any sharebot servers already bought.
	for (let host of hostnames){
		if(regEx.test(host)){
			let thing = new Server(ns, host);
			servers.push(thing);
			ns.tprint("Server " + thing.hostname + " already bought.");
		}
		await ns.sleep(100);
	}

	//next, create any servers that don't already exist.
	if(servers.length < amount){
		for(let i = 0; i < (amount - servers.length); i++){
			let host = ns.purchaseServer(servername, ram);
			if(host == ""){
				ns.tprint("You do not have enough money to complete this operation. End of script.");
				return;
			}
			else
				ns.tprint(`Server ${host} purchased.`);	
		}
	}
}
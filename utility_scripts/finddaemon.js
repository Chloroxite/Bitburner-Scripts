/** @param {NS} ns */
//Script used to locate the world daemon when it appears once requirements are met. Will print out the network path.

export async function main(ns) {
	let daemon = await locateDaemon(ns, "home");
	ns.tprint("\n" + daemon);
}

async function locateDaemon(ns, host){
	let newhost = host;
	let nearby = ns.scan(newhost);
	let string;

	if(newhost == "w0r1d_d43m0n") { return newhost; }	
	if(newhost != "home") { nearby.shift(); }

	for (let nextHost of nearby){
		//ns.tprint("Checking " + nextHost);
		if (nextHost != null) { string = `${newhost} > ` + await locateDaemon(ns, nextHost); }
		else { string = ''; }

		if(/w0r1d_d43m0n/.test(string) == true) { break; }
		//await ns.sleep(10);
	}
	//await ns.sleep(10);
	return string;
}
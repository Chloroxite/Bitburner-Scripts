/** @param {NS} ns */
//Newer hacking script. Fully automatic: regularly scans the network for new systems to hack and controls all slave
//scripts. Modulates hacking in "blocks" of hack-grow-weaken commands in order to optimize money gain.
//Alternatively, can run in "farming mode", where instead of focusing on money, slavemaster will instead focus
//all slave host resources on empty growth in order to maximize hacking exp gains. Access this mode by running
//slavemaster.js with arg "farm".
import {scanNetwork} from "/utility_scripts/scanapi.js";
import User from "/utility_scripts/userlib.js";
import Server from "/utility_scripts/scanapi.js";

//Settings
const hRatio = 0.10; //Ratio of threads to dedicate to hacking (for high-power mode)
const gRatio = 0.70; //Ratio of threads to dedicate to growing (for high-power mode)
const wRatio = 0.10; //Ratio of threads to dedicate to weaken (for high-power mode)
const wThreshold = 1.1; //Threshold for switching to weaken (for low-power mode)
const gThreshold = 0.9; //Threshold for switching to grow (for low-power mode)
const lvlRange = 100; //Sets the range of acceptible level values for target finding algorithm.
const threadReq = 10;
const highThreadReq = 572; //Minimum requirements for extreme power mode.	
const spacer = 40;

export async function main(ns) {
	const player = new User(ns); // Not really a setting, just making this global.
	while(true){
		//Begin script	
		let servers = await refreshServers(ns);	

		//First, prepare the slaves servers.
		for(let s of servers)
			ns.scp(["/hack_scripts/slv.hk.js", "/hack_scripts/slv.gr.js", "/hack_scripts/slv.wk.js", "sharescript.js"], s.hostname);

		//Select and enter the main loop function.
		if(ns.args[0] == "farm")
			await farmLoop(ns, servers, player);	
		else if(player.inventory.formulas)
			await smartLoop(ns, servers, player);
		else
			await dumbLoop(ns, servers, player);
	}	
}

export async function refreshServers(ns){
	const hostnames = await scanNetwork(ns);
	let servers = [];
	for (let host of hostnames){
		let thing = new Server(ns, host);
		servers.push(thing);
		ns.tprint("Connection to " + thing.hostname + " established.");
		await ns.sleep(100);
	}
	servers.shift();

	return servers;
}

export async function dumbLoop(ns, servers, player){
	while(!player.inventory.formulas){
		//Automatically locate next target,
		let target = servers[0];
		let maxLvl = (player.skill.hack/2) + lvlRange;	
		for(let s of servers){
			if(s.level <= maxLvl && s.money.max > target.money.max && s.admin === true)
				target = s;
		}
		//ns.tprint(target);,
		//Target decided. Begin coordinating attacks.
		for(let s of servers){
			//If a server is not yet rooted, attempt, to root it.
			if(target.admin){
				if(s.admin){
					if(s.maxThreadCount(1.75) >= 1){
						//Determine what threadcount the server is capable of running.	
						if(s.maxThreadCount(1.75) >= threadReq){
							//High power will do protobatching
							ns.exec("/hack_scripts/slv.wk.js", s.hostname, Math.floor(s.maxThreadCount(1.75) * (wRatio*2)), target.hostname);
							ns.exec("/hack_scripts/slv.gr.js", s.hostname, Math.floor(s.maxThreadCount(1.75) * gRatio), target.hostname);
							if(target.money.available >= target.money.max)
								ns.exec("/hack_scripts/slv.hk.js", s.hostname, Math.floor(s.maxThreadCount(1.75) * hRatio), target.hostname);	
						}	
						else{
							//Low-power servers will focus all power on one operation
							if(target.security.level > target.security.min)
								ns.exec("/hack_scripts/slv.wk.js", s.hostname, s.maxThreadCount(1.75), target.hostname);
							else if(target.money.available < target.money.max)
								ns.exec("/hack_scripts/slv.gr.js", s.hostname, s.maxThreadCount(1.75), target.hostname);
							else
								ns.exec("/hack_scripts/slv.hk.js", s.hostname, s.maxThreadCount(1.75), target.hostname);
						}
					}
					//otherwise, skip.
				}
				else
					s.sudo();
			}
			else
				target.sudo();
			await ns.sleep(500);
		}
	}
	return;
}

export async function smartLoop(ns, servers, player){
	while(player.inventory.formulas){
		//Automatically locate next target,
		let target = servers[0];
		let maxLvl = (player.skill.hack/2) + lvlRange;	
		for(let s of servers){
			if(s.level <= maxLvl && s.money.max > target.money.max && s.admin === true)
				target = s;
		}
		let idiot = new Server(ns, "joesguns");
		//ns.tprint(target);,
		//Target decided. Begin coordinating attacks.
		for(let s of servers){
			//If a server is not yet rooted, attempt, to root it.
			if(target.admin){
				if(s.admin){
					if(s.maxThreadCount(1.75) >= 1){
						//Determine what threadcount the server is capable of running.	
						if(s.maxThreadCount(1.75) >= highThreadReq){
							//High power will do batching for money gen.
							//Preping
							if(target.security.level > target.security.min || target.money.available < target.money.max){
								ns.scriptKill("hack_scripts/slv.hk.js", s.hostname); //halt all hack scripts on this host. Anti-crash measure.
								ns.exec("/hack_scripts/slv.wk.js", s.hostname, Math.floor(s.maxThreadCount(1.75) * wRatio), target.hostname)
								ns.exec("/hack_scripts/slv.gr.js", s.hostname, Math.floor(s.maxThreadCount(1.75) * gRatio), target.hostname)
							}
							else{
								let growtime;
								let hacktime;
								let weaktime;
								let wDelay;
								let w2Delay;
								let gDelay;
								let hDelay;

								//try{
									growtime = ns.formulas.hacking.growTime(target.data, ns.getPlayer());
									hacktime = ns.formulas.hacking.hackTime(target.data, ns.getPlayer());
									weaktime = ns.formulas.hacking.weakenTime(target.data, ns.getPlayer());
									wDelay = 0;
									w2Delay = spacer * 2;
									gDelay = weaktime + spacer - growtime;
									hDelay = (weaktime - hacktime - spacer);
									//If there isn't already a batch deployed, deploy one.
									if(!ns.scriptRunning("/hack_scripts/slv.wk.js", s.hostname) && !ns.scriptRunning("/hack_scripts/slv.gr.js", s.hostname)){	
										ns.exec("/hack_scripts/slv.wk.js", s.hostname, Math.floor(s.maxThreadCount(1.75) * wRatio), target.hostname, wDelay);
										ns.exec("/hack_scripts/slv.wk.js", s.hostname, Math.floor(s.maxThreadCount(1.75) * wRatio), target.hostname, w2Delay);
										ns.exec("/hack_scripts/slv.gr.js", s.hostname, Math.floor(s.maxThreadCount(1.75) * gRatio), target.hostname, gDelay);
										ns.exec("/hack_scripts/slv.hk.js", s.hostname, Math.floor(s.maxThreadCount(1.75) * hRatio), target.hostname, hDelay);
									}
								//}catch{ ns.tprint("You do not currently have Formulas.exe"); continue; }
							}

						}	
						else{
							//Low-power servers will focus on farming hack xp
							if(idiot.security.level > idiot.security.min)
								ns.exec("/hack_scripts/slv.wk.js", s.hostname, s.maxThreadCount(1.75), "joesguns");
							else
								ns.exec("/hack_scripts/slv.gr.js", s.hostname, s.maxThreadCount(1.75), "joesguns");	
						}
					}
					//otherwise, skip.
				}
				else
					s.sudo();
			}
			else
				target.sudo();
			await ns.sleep(500);
		}
	}
	return;
}

export async function farmLoop(ns, servers, player){
	let target = new Server(ns, "joesguns");
	while(true){
		for(let s of servers){
			if(s.admin){
				if(target.admin){
					if(s.maxThreadCount(1.75) >= 1){
						if(target.security.level > target.security.max)
							ns.exec("/hack_scripts/slv.wk.js", s.hostname, s.maxThreadCount(1.75), "joesguns");
						else
							ns.exec("/hack_scripts/slv.gr.js", s.hostname, s.maxThreadCount(1.75), "joesguns");
					}
				}else s.sudo();
			}else s.sudo();
			await ns.sleep(100);
		}
	}
}
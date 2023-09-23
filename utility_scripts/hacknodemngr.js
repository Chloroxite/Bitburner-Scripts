/** @param {NS} ns */
//Simple script designed to automatically manage hacknetnodes. Will put a set percentage of money towards upgrades
//regularly.
export async function main(ns) {
	const host = "home";
	const percent = 0.05;

	while (true) {
		let currMoney = ns.getServerMoneyAvailable(host);
		let nodeCost = ns.hacknet.getPurchaseNodeCost();

		for (let index = 0; index < ns.hacknet.numNodes(); index++) {	
			currMoney = ns.getServerMoneyAvailable(host);			
			let nodeLvlCost = ns.hacknet.getLevelUpgradeCost(index, 1);
			let nodeRCost = ns.hacknet.getRamUpgradeCost(index, 1);
			let nodeCCost = ns.hacknet.getCoreUpgradeCost(index, 1);

			if (nodeLvlCost <= percent * currMoney && nodeLvlCost != Infinity){
				ns.hacknet.upgradeLevel(index, 1);
			}
			else if(nodeRCost <= percent * currMoney && nodeRCost != Infinity){
				ns.hacknet.upgradeRam(index, 1);
			}
			else if(nodeCCost <= percent * currMoney && nodeCCost != Infinity){
				ns.hacknet.upgradeCore(index, 1);
			}
			
			await ns.sleep(10);
		}

		currMoney = ns.getServerMoneyAvailable(host);	
		if(nodeCost <= percent * currMoney && nodeCost != Infinity)
			ns.hacknet.purchaseNode();

		await ns.sleep(10);
	}
}
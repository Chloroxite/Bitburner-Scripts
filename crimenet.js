/** @param {NS} ns */
//Utilizes ganglib.js to manage a gang automatically. Members will be recruited until member pool is maxed out.
//Then members will be trained until they meet a stats threshold at which point they will engage in 
//territory warfare. Once most of the territory is obtained, the gang members will all be focused 
//on human trafficking to maximize profit.
import { Gang } from "utility_scripts/ganglib.js"
import { GangMember } from "utility_scripts/ganglib.js"
export async function main(ns) {
	//Settings
	const wantedThresh = 1000;
	const maxMembers = 12;
	const lvlThresh = 4000;
	const ascThresh = 1.5;
	const maxVigils = 3;
	const names = [
		"Alex", "Aleph", "Alice",
		"Barry", "Ben", "Byf",
		"Connor", "Cinder", "Cassey",
		"Dickson", "David", "Dendrick",
		"Eve", "Eric", "Elijah",
		"Falco", "Finn", "Faith",
		"George", "Grover", "Gabriel",
		"Henry", "Harper", "Hayden",
		"Isaiah", "Isabelle", "Ian",
		"Jacob", "Jordan", "Jackson",
		"Kai", "Kinsley", "Kennedy",
		"Leslie", "Larry", "Leo",
		"Mary", "Marcus", "Morbius",
		"Noah", "Nora", "Nolan",
		"Olivia", "Owen", "Oscar",
		"Perry", "Peyton", "Pheonix",
		"Qadir", "Quartz", "Qasim",
		"Riley", "Ryan", "River",
		"Sophia", "Sebastian", "Samuel",
		"Theodore", "Thomas", "Terry",
		"Uriel", "Uriah", "Umar",
		"Victoria", "Violet", "Vincent",
		"Wyatt", "William", "Weston",
		"Xavier", "Ximena", "Xavion",
		"Yusuf", "Yehuda", "Yasmin",
		"Zachary", "Zoey", "Zuri"
	]

	//Begin script
	let gang = new Gang(ns);
	let members = gang.memberObjects;
	let cooling = false;

	//Enter main command loop

	//Block revision done by Chansu
	while (true) {
		members = gang.memberObjects; //Refresh this list, in case new members are added.
		if (gang.members.amount == maxMembers || !gang.members.canRecruit) {
			//Send out commands
			for (let m of members) {
				if(cooling && gang.wanted.level <= 1) { cooling = false; }
				if (m.stat.hack < lvlThresh) {
					//Train hacking.
					//ns.tprint(m.ascension.hack > ascThresh);
					if (m.ascension.hack > ascThresh) { m.ascend() }
					m.newTask("Train Hacking")
				}

				else if (m.stat.avgcom < lvlThresh) {
					//Train combat.
					if (m.ascension.avgcom > ascThresh) { m.ascend() }
					m.newTask("Train Combat")
				}

				else if (m.stat.cha < lvlThresh) {
					//Train charisma.
					if (m.ascension.cha > ascThresh) { m.ascend() }
					m.newTask("Train Charisma")
				}
				else if (gang.members.amount < maxMembers && !cooling) { m.newTask("Terrorism"); }

				else if (gang.wanted.level > wantedThresh && gang.countTasks("Vigilante Justice") < maxVigils) { 
					m.newTask("Vigilante Justice"); cooling = false; 
				}

				else if (gang.territory.val >= 1 && !cooling) { m.newTask("Human Trafficking") }	

				else { m.newTask("Territory Warfare") }
			}
			if (gang.countTasks("Territory Warfare") >= maxMembers * 0.9 && gang.power >= gang.highestComp() * 1.2) { 
				ns.gang.setTerritoryWarfare(true); 
			}
			
			else { ns.gang.setTerritoryWarfare(false); }
		}
		else {
			//Recruit members    
			for (let i = gang.members.amount; i < maxMembers; i++)
				ns.gang.recruitMember(names[Math.floor(Math.random() * names.length)]);
		}

		await ns.sleep(200);
	}
}
/** @param {NS} ns */
//Class meant to make the handling of gang member data significantly easier. 
//Pulls data from ns.gang.getMemberInformation.
export class GangMember{
	constructor(ns, member){
		this.ns = ns;
		this._id = member;
	}

	get id() { return this._id; }
	get	data() { return this.ns.gang.getMemberInformation(this.id); }
	get name() { return this.data.name; }
	get stat() { return {
		hack: this.data.hack,
		str: this.data.str,
		def: this.data.def,
		dex: this.data.dex,
		agi: this.data.agi,
		cha: this.data.cha,
		avgcom: (this.data.str + this.data.def + this.data.dex + this.data.agi) / 4
	}}
	get multi() { return {
		hack: this.data.hack_asc_mult,
		str: this.data.str_asc_mult,
		def: this.data.def_asc_mult,
		dex: this.data.dex_asc_mult,
		agi: this.data.agi_asc_mult,
		cha: this.data.cha_asc_mult,
		avgcom: (this.data.str_asc_mult + this.data.def_asc_mult + this.data.dex_asc_mult + this.data.agi_asc_mult) / 4
	}}
	get ascensionData() { return this.ns.gang.getAscensionResult(this.data.name) ?? { "hack":0, "str":0, "dex":0, "agi":0, "cha":0 }; } 
	get ascension() { return{
		hack: this.ascensionData.hack,
		str: this.ascensionData.str,
		def: this.ascensionData.def,
		dex: this.ascensionData.dex,
		agi: this.ascensionData.agi,
		cha: this.ascensionData.cha,
		avgcom: (this.ascensionData.str + this.ascensionData.def + this.ascensionData.dex + this.ascensionData.agi) / 4
	}}
	get upgrades() { return this.data.upgrades; }
	get augments() { return this.data.augmentations; }
	get respect() { return {
		gain: this.data.respectGain,
		val: this.data.earnedRespect
	}}
	get task() { return this.data.task; }

	newTask(task = ""){
		this.ns.gang.setMemberTask(this.data.name, task)
	}
	ascend() {
		this.ns.gang.ascendMember(this.data.name);
	}

	//{"name":"justin","task":"Human Trafficking",
	//"earnedRespect":65728.63417584087,
	//"hack":89,"str":807,"def":807,"dex":1018,"agi":716,"cha":93,
	//"hack_exp":7853.514201647418,"str_exp":25401.604478556354,"def_exp":25395.96268958133,"dex_exp":67953.52181263074,
	//"agi_exp":16842.074505698685,"cha_exp":8971.487024075344,
	//"hack_mult":1,"str_mult":1,"def_mult":1,"dex_mult":1,"agi_mult":1,"cha_mult":1,
	//"hack_asc_mult":1,"str_asc_mult":6.448389100760391,"def_asc_mult":6.446956890028836,
	//"dex_asc_mult":6.515246515087871,"agi_asc_mult":6.376975002819907,
	//"cha_asc_mult":1,"hack_asc_points":1297.7915668873898,"str_asc_points":83163.4439896108,
	//"def_asc_points":83126.50628378056,"dex_asc_points":84896.87430472931,"agi_asc_points":81331.6203731799,
	//"cha_asc_points":0,"upgrades":[],"augmentations":[],"respectGain":4.988701405057828,
	//"wantedLevelGain":0.04827465137672348,"moneyGain":35689.949905274334}
	 
}

export class Gang{
	constructor(ns){
		this.ns = ns;
	}
	
	get data() { return this.ns.gang.getGangInformation(); }
	get faction() { return this.data.faction; }
	get members() { return {
		names: this.ns.gang.getMemberNames(),
		amount: this.ns.gang.getMemberNames().length,
		canRecruit: this.ns.gang.canRecruitMember()
	}}
	get memberObjects() {
		let members = [];
		let names = this.members.names;
		for(let n of names)
			members.push(new GangMember(this.ns, n));
		return members;
	}
	get type() { 
		let isHacking = this.data.isHacking;
		let type;
		switch(isHacking){
			case true:
				type = "hacking";
			case false:
				type = "combat";
		}
		return type;
	}
	get power() { return this.data.power; }
	get respect() { return {
		val: this.data.respect,
		rate: this.data.respectGainRate
	}}
	get territory() { return {
		val: this.data.territory,
		clash: this.data.territoryClashChance,
		engaged: this.data.territoryWarfareEngaged
	}}
	get wanted() { return {
		level: this.data.wantedLevel,
		gain: this.data.wantedLevelGainRate,
		penalty: this.data.wantedPenalty
	}}
	countTasks(task) {
		let members = this.memberObjects;
		let count = 0;
		for(let m of members){ if(m.task == task) count++; }
		return count;
	}
	highestComp() {
		let gangs = this.ns.gang.getOtherGangInformation();
		let highestPower = 0;
		for(let g in gangs) {
			if(g.power > highestPower) { highestPower = g.power; }
		}
		
		return highestPower;
	}
//{"faction":"Slum Snakes","isHacking":false,"moneyGainRate":0,
//"power":1,"respect":1,"respectGainRate":0,"territory":0.14285714285714465,
//"territoryClashChance":0,"territoryWarfareEngaged":false,"wantedLevel":397.6975035466304,
//"wantedLevelGainRate":0,"wantedPenalty":0.0025081671971970178}	
}
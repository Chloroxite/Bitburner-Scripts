/** @param {NS} ns */
//Class meant to store detailed user data. Makes managing player stats significantly easier.
export default class User{
	constructor(ns){
		this.ns = ns;
	}

	get data(){ return this.ns.getPlayer(); }
	get hp(){ return {
		val: this.data.hp.current,
		max: this.data.hp.max
	}}
	get money(){ return this.data.money; }
	get skill(){ return {
		hack: this.data.skills.hacking,
		str: this.data.skills.strength,
		def: this.data.skills.defense,
		dex: this.data.skills.dexterity,
		agi: this.data.skills.agility,
		cha: this.data.skills.charisma,
		int: this.data.skills.intelligence
	}}

	get inventory(){ return {
		brute: this.ns.fileExists("BruteSSH.exe", "home"),
		ftp: this.ns.fileExists("FTPCrack.exe", "home"),
		smtp: this.ns.fileExists("relaySTMP.exe", "home"),
		http: this.ns.fileExists("HTTPWorm.exe", "home"),
		sql: this.ns.fileExists("SQLInject.exe", "home"),
		formulas: this.ns.fileExists("Formulas.exe", "home")
	}}
}
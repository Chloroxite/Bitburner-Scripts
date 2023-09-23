/** @param {NS} ns */
//Library file meant to make the management of network data significantly easier. Allows
//for a full networkscan, and storing of detailed information for individual hosts.
export async function scanNetwork(ns){	
	let hostnames = ["home"];	

	for(let host of hostnames){
		let results = ns.scan(host);

		for(let item of results){
			if(hostnames.indexOf(item) == -1)
				hostnames.push(item);	
		}
	}

	return hostnames;
}

export default class Server{
	constructor(ns, hostname){
		this.ns = ns;
		this._id = hostname;
	}

	get id() { return this._id; }
    get data() { return this.ns.getServer(this.id); }
    get updated_at() { return new Date().valueOf(); }
    get hostname() { return this.data.hostname; }
    get admin() { return this.data.hasAdminRights; }
    get level() { return this.data.requiredHackingSkill; }
    get purchased() { return (this.data.purchasedByPlayer && this.data.hostname !== "home"); }
    get backdoored() { return this.data.backdoorInstalled; }
    get cores() { return this.data.cpuCores; }
    get ram() { return {
        used: this.data.ramUsed,
        max: this.data.maxRam,
        free: this.data.maxRam - this.data.ramUsed
    }}
    get organization() { return this.data.organizationName; }
    get isHome() { return (this.data.hostname === "home"); }
    get ports() { return {
        required: this.data.numOpenPortsRequired,
        open: this.data.openPortCount,
        ftp: this.data.ftpPortOpen,
        http: this.data.httpPortOpen,
        smtp: this.data.smtpPortOpen,
        sql: this.data.sqlPortOpen,
        ssh: this.data.sshPortOpen
    }}
    get security() { return {
        level: this.data.hackDifficulty,
        min: this.data.minDifficulty
    }}
    get money() { return {
        available: this.data.moneyAvailable,
        max: this.data.moneyMax,
        growth: this.data.serverGrowth
    }}

    threadCount(scriptRam, reserved = 0) {
        let threads = 0;
        threads = (this.ram.free - (this.ram.free * reserved)) / scriptRam;
        return Math.floor(threads);
	}

    maxThreadCount(scriptRam, reserved = 0) {
        let threads = 0;
        threads = (this.ram.max - (this.ram.max * reserved)) / scriptRam;
        return Math.floor(threads);
    }

    sudo(){
        try { this.ns.brutessh(this._id); } catch {}
        try { this.ns.ftpcrack(this._id); } catch {}
        try { this.ns.relaysmtp(this._id); } catch {}
        try { this.ns.httpworm(this._id); } catch {}
        try { this.ns.sqlinject(this._id); } catch {}
        try { this.ns.nuke(this._id); } catch {}
    }
}
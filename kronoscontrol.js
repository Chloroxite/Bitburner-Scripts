/** @param {NS} ns */
//Kronoscontrol is the control command for managing all instances of kronos and aiming them at a target.
export async function main(ns) {
	const argument = ns.args[0];

	if(argument == "terminate"){
		ns.tprint("Kill signal sent.");
		ns.clearPort(1);
		ns.writePort(1, argument);
		ns.exit();
	}
	if(argument == "clear")
		ns.clearPort(1);
	else if(!ns.serverExists(argument)){
		ns.tprint("Hostname not found.\nUsage: kronoscontrol <hostname|'terminate'>");
		ns.exit();
	}	
	else{
		ns.tprint("Command sent.");
		ns.clearPort(1);
		ns.writePort(1, argument);
	}	
}
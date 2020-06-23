var abilities = require('./Abilities.js').placeholder;  
var accents = require('./Accent.js').placeholder;  
var appearances = require('./Appearance.js').placeholder;  
var classes = require('./Class.js').placeholder;  
var equipment = require('./Equipment.js').placeholder;  
var names = require('./Name.js').placeholder; 
var personalities = require('./Personality.js').placeholder;  
var races = require('./Race.js').placeholder;

logsOn = false;

export default function generate(settings){
	//create character sheet components
	var charSheet = {};
	charSheet.properties = [];
	charSheet.abilities = [];
	charSheet.equipment = [];
	charSheet.level = settings.Level;
	//generate a random stat block 
	charSheet.stats = getStats(settings);
	charSheet.file = "";

	//this will cause a chain reaction for the rest of the "gets" 
	getName(charSheet, settings);
	
	return charSheet.file;
}



//================================================ Helper Functions


//use to lookup a class for settings optimizations
function lookupClass(name){
	for(var i in classes){
		if(classes[i].Name == name){
			return classes[i]
		}
	}
	
	return null;
}

//use to lookup a race for settings optimizations
function lookupRace(name){
	for(var i in races){
		if(races[i].Name == name){
			return races[i]
		}
	}
	
	return null;
}

//make sure we dont get the same random multiple times
//length is size we want the random to be 
//object is the (inititally empty) object for each function
function randomRecorder(object, length){
	var ran = Math.floor(Math.random()*length);
	while(object[ran]){
		ran = Math.floor(Math.random()*length);
	}
	object[ran] = true;
	return ran;
}


function passedStats(myStats, reqStats){
	if (reqStats.S) {
		if(myStats.S < reqStats.S){
			return false;
		}
	}
	if (reqStats.E) {
		if(myStats.E < reqStats.E){
			return false;
		}
	}
	if (reqStats.D) {
		if(myStats.D < reqStats.D){
			return false;
		}
	}
	if (reqStats.W) {
		if(myStats.W < reqStats.W){
			return false;
		}
	}
	if (reqStats.I) {
		if(myStats.I < reqStats.I){
			return false;
		}
	}
	if (reqStats.C) {
		if(myStats.C < reqStats.C){
			return false;
		}
	}
	
	return true; 
					
}


function containsAny(myProps, anyProps){
	for(var i in anyProps){
		if(myProps.includes(anyProps[i])){
			return true;
		}
	}
	
	return false;
}



function equipmentRequirements(charSheet, reqs){
	if(reqs.Stats){
		var bool = passedStats(charSheet.stats, reqs.Stats);
		if(!bool){
			return false;
		}
	}
	if(reqs.Properties){
		var bool = containsAny(charSheet.properties, reqs.Properties);
		if(!bool){
			return false;
		}
	}
	if(reqs.Level){
		if(charSheet.level < reqs.Level){
			return false;
		}
	}
	return true;
}


function containsAnyText(list, entry){
	if(list.length > 0){
		for(var i in list){
			if(list[i].includes(entry)){
				return true;
			}
		}
	}
	
	return false;
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


//==================== get a random stat block =======================
function getStats(settings){
	//set all stats to 0
	var stats = {"S": 0, "C": 0, "D": 0, "W":0, "E": 0, "I": 0, "AC":0};
	
	//randomize all stats once 
	var randomStat = function(){
		return Math.floor(Math.random()*14)+3
	};
	
	var randomizeStats = function(){
		stats.S = randomStat();
		stats.C = randomStat();
		stats.D = randomStat();
		stats.W = randomStat();
		stats.I = randomStat();
		stats.E = randomStat();
	}
	
	randomizeStats();
	
	// if their level is above 0, randomize the stats again until 
	// at least 1 is 14+, another that's 12+, and none are less than 6
	if(settings.Level > 0){
		var hasHighStats = function(){
			var retMe = false;
			var retMe2 = false;
			var hasAnother = "";
			
			if(stats.S>=14) {
				retMe = true;
				hasAnother = "S";
			}
			if(stats.C>=14) {
				retMe = true;
				hasAnother = "C";
			}
			if(stats.D>=14) {
				retMe = true;
				hasAnother = "D";
			}
			if(stats.W>=14) {
				retMe = true;
				hasAnother = "W";
			}
			if(stats.I>=14) {
				retMe = true;
				hasAnother = "I";
			}
			
			if(stats.S>=14) {
				retMe = true;
				hasAnother = "S";
			}
			if(stats.C>=14) {
				retMe = true;
				hasAnother = "C";
			}
			if(stats.D>=14) {
				retMe = true;
				hasAnother = "D";
			}
			if(stats.W>=14) {
				retMe = true;
				hasAnother = "W";
			}
			if(stats.I>=14) {
				retMe = true;
				hasAnother = "I";
			}
			
			if(stats.S>=12 && (hasAnother == "C" || hasAnother == "W")) retMe2 = true;
			if(stats.C>=12 && (hasAnother == "S" || hasAnother == "W")) retMe2 = true;
			if(stats.D>=12 && (hasAnother == "C" || hasAnother == "I")) retMe2 = true;
			if(stats.W>=12 && (hasAnother == "D" || hasAnother == "I")) retMe2 = true;
			if(stats.I>=12 && (hasAnother == "D" || hasAnother == "C")) retMe2 = true;
			if(stats.E>=12 && hasAnother == "S") retMe2 = true;
			
			if(stats.S<6) retMe = false;
			if(stats.C<6) retMe = false;
			if(stats.D<6) retMe = false;
			if(stats.W<6) retMe = false;
			if(stats.I<6) retMe = false;
			if(stats.E<6) retMe = false;
			
			if(stats.I+stats.S+stats.C+stats.D+stats.W+stats.E>80) retMe = false;
			
			return retMe && retMe2;
		}
		
		//we also have to test that they pass the selected class's stats if the user set one 
		var hasClassStats = function() {
			if(settings.Class == 'Any') return true;
			else{
				var classReq = lookupClass(settings.Class);
				
				return passedStats(stats, classReq.Stat_Requirements);
			}
		}
	
		while(!hasHighStats() || !hasClassStats()){
			randomizeStats();
		}
	}
	
	//done
	if(logsOn) console.log(JSON.stringify(stats));
	return stats;
}



//==================== get a random name ===============================
function getName(charSheet, settings){
	//pick 2 random names
	var random = Math.floor(Math.random()*names.length);
	var random2 = Math.floor(Math.random()*names.length);
	var data1 = capitalizeFirstLetter(names[random]);
	var data2 = capitalizeFirstLetter(names[random2]);
		
	charSheet.file = charSheet.file + 'Name:    '+data1+' '+data2;
	getRace(charSheet, settings);
}


//==================== get a random race and modify stats ===========
function getRace(charSheet, settings){
	var randomObj = {};
	
	var randomRace = function(){
		var data;
		
		//pick our preset race
		if(settings.Race != 'Any'){
			data = lookupRace(settings.Race);
		}
		
		else{
			//pick a random race 
			var random = randomRecorder(randomObj, races.length);
			if(logsOn) console.log(random);
			data = races[random]
			if(logsOn) console.log(data);
		}

		//reroll for race if we random lower than the reroll odds, and we're choosing a 'any' race
		if(Math.random() < data.Reroll && settings.Race == 'Any'){
			randomRace();
		}
		else{
			//concat the properties and abiltiies we read
			charSheet.properties = charSheet.properties.concat(data.Properties);
			charSheet.abilities = charSheet.abilities.concat(data.Abilities);
					
			//update our stats based on race state bonuses
			if (data.Stats.S) charSheet.stats.S += data.Stats.S;
			if (data.Stats.E) charSheet.stats.E += data.Stats.E;
			if (data.Stats.D) charSheet.stats.D += data.Stats.D;
			if (data.Stats.W) charSheet.stats.W += data.Stats.W;
			if (data.Stats.I) charSheet.stats.I += data.Stats.I;
			if (data.Stats.C) charSheet.stats.C += data.Stats.C;
			if (data.Stats.AC) charSheet.stats.AC += data.Stats.AC;
					
			//add the race name to our character sheet
			charSheet.file = charSheet.file + '\n\n\nRace:    '+data.Name;
			//get a class
			getClass(charSheet, settings);
		}
	};
		
	//call the initial race roll 
	randomRace();
}



//==================== get a random class based off of stats ===========
function getClass(charSheet, settings){
	var randomObj = {};
	
	var randomClass = function(){
		var data;
		
		//pick our preset class
		if(settings.Class != 'Any'){
			data = lookupClass(settings.Class);
		}
		
		else{
			//pick a random class 
			var random = randomRecorder(randomObj, classes.length);
			if(logsOn) console.log(random);
			data = classes[random];
			if(logsOn) console.log(data);
		}
			
		//they don't get a class, the "none" class is index 8
		if(charSheet.level == 0){
			data = classes[7];
		}
		
		//reroll for class if we random lower than the reroll odds 
		if(charSheet.level > 0 && Math.random() < data.Reroll && settings.Class == 'Any'){
			randomClass();
		}
		//reroll if we don't meet class stat requirements
		else if(!passedStats(charSheet.stats, data.Stat_Requirements)){
			randomClass();
		}
		else{
			//concat the properties and abiltiies we read
			charSheet.properties = charSheet.properties.concat(data.Properties);
					
			//add ability, random selection incase more than 1
			if(data.Abilities.length > 0){
				var ran = Math.floor(Math.random()*data.Abilities.length);
				charSheet.abilities.push(data.Abilities[ran]);
			}
					
			//add additional abilities for monk and barbarian
			if(data.AdditionalAbilities){
				charSheet.abilities = charSheet.abilities.concat(data.AdditionalAbilities);
			}
					
			if(data.Equipment.length>0){
				//pick a random equipment for the class to add
				charSheet.equipment.push(data.Equipment[Math.floor(Math.random()*data.Equipment.length)]);
			}
					
			if(data.EquipmentSecond.length>0){
				//pick a random second equipment for the class to add
				charSheet.equipment.push(data.EquipmentSecond[Math.floor(Math.random()*data.EquipmentSecond.length)]);
			}
					
					
			//add the class name to our character sheet
			charSheet.file = charSheet.file + '\n\n\nClass:    '+data.Name;
			//get an accent
			getAccent(charSheet, settings);
		}
	};
		
	//call the initial class roll 
	randomClass();
}



//==================== get a random accent ===============================
function getAccent(charSheet, settings){
	//pick a random accent
	var random = Math.floor(Math.random()*accents.length);
	if(logsOn) console.log(random);
	var data = accents[random];
	if(logsOn) console.log(data);
	
	//add the accent name to our character sheet
	charSheet.file = charSheet.file + '\n\n\nAccent:    '+data;
				
	//get alignment
	getAlignment(charSheet, settings);
}


//==================== get a random alignment ===============================
function getAlignment(charSheet, settings){
	//pick a random goodness
	var random = Math.random();
	var goodness = "";
	if(random > 0.8){
		goodness = "Evil";
	}
	else if(random > 0.4){
		goodness = "Neutral";
	}
	else {
		goodness = "Good";
	}
	
	charSheet.properties.push(goodness);
	
	//pick a random lawfulness
	random = Math.random();
	var lawfulness = "";
	if(random > 0.8){
		lawfulness = "Chaotic";
	}
	else if(random > 0.4){
		lawfulness = "Neutral";
	}
	else {
		lawfulness = "Lawful";
	}
	
	charSheet.properties.push(lawfulness);
	
	//add the accent name to our character sheet
	charSheet.file = charSheet.file + '\n\n\nAlignment:    '+lawfulness+"-"+goodness;	
	
	//get appearance
	getAppearance(charSheet, settings);
}



//==================== get 3 random appearance ===============================
function getAppearance(charSheet, settings){
	var charAppearances = [];
	var randomObj = {};
	
	var randomAppearance = function(){
		//pick a random appearance
		var random = randomRecorder(randomObj, appearances.length);
		if(logsOn) console.log(random);
		var data = appearances[random];
		if(logsOn) console.log(data);
		
		//reroll if we random lower than the reroll odds 
		if(Math.random() < data.Reroll){
			randomAppearance();
		}
		//see if its incompatible 
		else if(containsAny(charSheet.properties, data.Incompatible)){
			randomAppearance();
		}
		else{
			//we can add this appearance, append its properties too
			charSheet.properties = charSheet.properties.concat(data.Properties);
			charAppearances.push(data.Description);
					
			//add another random appearance until we have the amount desired
			if(charAppearances.length < settings.Appearance){
				randomAppearance();
			}
			else{
				//write to our character sheet
				
				//if they dont want any appearance, dont write the title
				if(settings.Appearance > 0){
					charSheet.file = charSheet.file + '\n\n\nAppearance:';
				}
				
				//write each one 
				for(var i =0; i < settings.Appearance; i++){
					charSheet.file = charSheet.file + '\n                        ' + charAppearances[i];
				}
				
				//get Equipment
				getEquipment(charSheet, settings);
			}
		}
	};
	
	//first call
	randomAppearance();
}



//==================== get 2-3 random equipment ===============================
function getEquipment(charSheet, settings){
	var randomObj = {};
	
	var randomEquipment = function(){
		//pick a random Equipment
		var random = randomRecorder(randomObj, equipment.length);
		if(logsOn) console.log(random);
		var data = equipment[random];
		if(logsOn) console.log(data);
		
		//reroll if we random lower than the reroll odds 
		if(Math.random() < data.Reroll){
			randomEquipment();
		}
		//see if we meet the requirements 
		else if(!equipmentRequirements(charSheet, data.Requirements)){
			randomEquipment();
		}
		//see if we already have this equipment
		else if(containsAnyText(charSheet.equipment, data.Incompatible)){
			randomEquipment();
		}
		else{
			//we can add this Equipment, append its properties too
			charSheet.equipment.push(data.Description);

			//add another random Equipment until we have at least 3 + level
			if(charSheet.equipment.length < settings.Equipment){
				randomEquipment();
			}
			else{
				//write to our character sheet
				
				//if they dont want any Equipment, dont write the title
				if(settings.Equipment > 0){
					charSheet.file = charSheet.file + '\n\nEquipment:';
				}
				
				//write each one 
				for(var i =0; i < settings.Equipment; i++){
					charSheet.file = charSheet.file + '\n                      ' + charSheet.equipment[i];
				}
				
				//get personality
				getPersonality(charSheet, settings);
			}
		}
	};
		
	//first call
	randomEquipment();
}



//==================== get 2 random personality ===============================
function getPersonality(charSheet, settings){
	var personality = [];
	var randomObj = {};
	
	var randomPersonality = function(){
		//pick a random Personality
		var random = randomRecorder(randomObj, personalities.length);
		if(logsOn) console.log(random);
		var data = personalities[random];
		if(logsOn) console.log(data);
		
		//reroll if we random lower than the reroll odds 
		if(Math.random() < data.Reroll){
			randomPersonality();
		}
		//see if its incompatible 
		else if(containsAny(charSheet.properties, data.Incompatible)){
			randomPersonality();
		}
		else{
			//we can add this Personality, append its properties too
			charSheet.properties = charSheet.properties.concat(data.Properties);
			personality.push(data.Description);
					
			//add another random Personality until we have 2
			if(personality.length < settings.Personality){
				randomPersonality();
			}
			else{
				
				//write to our character sheet
				
				//if they dont want any Personality, dont write the title
				if(settings.Personality > 0){
					charSheet.file = charSheet.file + '\n\nPersonality:';
				}
				
				//write each one 
				for(var i =0; i < settings.Personality; i++){
					charSheet.file = charSheet.file + '\n                      ' + personality[i];
				}
				
				
				//record the stats next
				getAbilities(charSheet, settings);
			}
		}
	};
		
	//first call
	randomPersonality();
}


//==================== get 1-2 random abilities ===============================
function getAbilities(charSheet, settings){
	//remember this for counting later
	var previousAbilities = charSheet.abilities.length;
	var randomObj = {};
	
	var randomAbility = function(){
		//pick a random Abilities
		var random = randomRecorder(randomObj, abilities.length);
		if(logsOn) console.log(random);
		var data = abilities[random];
		if(logsOn) console.log(data);
		
		//reroll if we random lower than the reroll odds 
		if(Math.random() < data.Reroll){
			randomAbility();
		}
		//see if we meet the requirements 
		else if(!equipmentRequirements(charSheet, data.Requirements)){
			randomAbility();
		}
		//see if we already have this abilities
		else if(containsAny(charSheet.properties, data.Incompatible)){
			randomAbility();
		}
		else{
			//we can add this abilities, append its properties too
			var done = true;
					
			//first, if we're level 0, do we really want this ability? random chance 
			if(charSheet.level == 0){
				//ok yeah we want it
				if(Math.random() > 0.65){
					charSheet.abilities.push(data.Description);
					charSheet.properties = charSheet.properties.concat(data.Properties);
				}
						
			}
			//if not level 0, they get it auto, maybe more
			else {
				charSheet.abilities.push(data.Description);
				charSheet.properties = charSheet.properties.concat(data.Properties);
					
				//add another random abilities until we have at least 1+level
				if(charSheet.abilities.length < 1 + previousAbilities + charSheet.level){
					randomAbility();
					done = false;
				}
			}
			if(done){
				//write to our character sheet
				var string = "";
				
				if(charSheet.abilities.length > 0){
					string = '\n\nAbilities:';
				}
				
				for(var i in charSheet.abilities){
					string += '\n                *'+charSheet.abilities[i]
				}
						
				//abilities need to come after stats in the string, but calculated before so we know what to mod. use this as a placeholder
				charSheet.fileAbilities = string;
				
				writeStats(charSheet, settings);
			}
		}
	};
		
	//first call
	randomAbility();
}




//=========================== write stat block to file =======================
function writeStats(charSheet, settings){
	//mod stats
	
	if(charSheet.properties.includes("bloody cough")){
		charSheet.stats.D -= 2;
		charSheet.stats.E -= 2;
		charSheet.stats.S -= 2;
		charSheet.stats.C -= 2;
		charSheet.stats.W -= 2;
		charSheet.stats.I -= 2;
	}
	
	if(charSheet.properties.includes("Athlete Feat")){
		charSheet.stats.S += 1;
	}
	
	if(charSheet.properties.includes("Wicked Skill")){
		charSheet.stats.D += 2;
	}
	
	console.log("stats: " +JSON.stringify(charSheet.stats))
	charSheet.sMOD = Math.floor((charSheet.stats.S - 10)/2)
	charSheet.eMOD = Math.floor((charSheet.stats.E - 10)/2)
	charSheet.cMOD = Math.floor((charSheet.stats.C - 10)/2)
	charSheet.iMOD = Math.floor((charSheet.stats.I - 10)/2)
	charSheet.wMOD = Math.floor((charSheet.stats.W - 10)/2)
	charSheet.dMOD = Math.floor((charSheet.stats.D - 10)/2)
	
	var plusS = " ";
	if(charSheet.sMOD >= 0) plusS = "+";

	var plusE = " ";
	if(charSheet.eMOD >= 0) plusE = "+";
	
	var plusC = " ";
	if(charSheet.cMOD >= 0) plusC = "+";
	
	var plusD = " ";
	if(charSheet.dMOD >= 0) plusD = "+";
	
	var plusI = " ";
	if(charSheet.iMOD >= 0) plusI = "+";
	
	var plusW = " ";
	if(charSheet.wMOD >= 0) plusW = "+";
	
	
	
	//order stats first
	var arr = [];
	arr.push([plusS+charSheet.sMOD, "   STR"]);
	arr.push([plusE+charSheet.eMOD, "   CON"]);
	arr.push([plusD+charSheet.dMOD, "   DEX"]);
	arr.push([plusC+charSheet.cMOD, "   CHA"]);
	arr.push([plusW+charSheet.wMOD, "   WIS"]);
	arr.push([plusI+charSheet.iMOD, "   INT"]);
	arr.sort(function(a, b){return b[0] - a[0]});
	
	//make stat string
	var string = '\n\nStats:';
	for(var i in arr){
		string += '\n          '+arr[i][0]+arr[i][1];
	}
	
	charSheet.file = charSheet.file + string;
	
	//abilities writing is delayed to here
	charSheet.file = charSheet.file + charSheet.fileAbilities;
	
	writeCombatStats(charSheet, settings);
}


function writeCombatStats(charSheet, settings){	
	//calculate HP
	var hp = 0;
	var conMod = charSheet.cMOD;
	if(charSheet.level == 0) hp = 6 + conMod;
	if(charSheet.properties.includes("wizard")) hp = 6+conMod+((charSheet.level-1)*(4+conMod));
	if(charSheet.properties.includes("sorcerer")) hp = 6+conMod+((charSheet.level-1)*(4+conMod));
	if(charSheet.properties.includes("bard")) hp = 8+conMod+((charSheet.level-1)*(5+conMod));
	if(charSheet.properties.includes("cleric")) hp = 8+conMod+((charSheet.level-1)*(5+conMod));
	if(charSheet.properties.includes("druid")) hp = 8+conMod+((charSheet.level-1)*(5+conMod));
	if(charSheet.properties.includes("warlock")) hp = 8+conMod+((charSheet.level-1)*(5+conMod));
	if(charSheet.properties.includes("druid")) hp = 8+conMod+((charSheet.level-1)*(5+conMod));
	if(charSheet.properties.includes("monk")) hp = 8+conMod+((charSheet.level-1)*(5+conMod));
	if(charSheet.properties.includes("artificer")) hp = 8+conMod+((charSheet.level-1)*(5+conMod));
	if(charSheet.properties.includes("rogue")) hp = 8+conMod+((charSheet.level-1)*(5+conMod));
	if(charSheet.properties.includes("ranger")) hp = 10+conMod+((charSheet.level-1)*(6+conMod));
	if(charSheet.properties.includes("fighter")) hp = 10+conMod+((charSheet.level-1)*(6+conMod));
	if(charSheet.properties.includes("paladin")) hp = 10+conMod+((charSheet.level-1)*(6+conMod));
	if(charSheet.properties.includes("barbarian")) hp = 12+conMod+((charSheet.level-1)*(7+conMod));
	
	if(charSheet.properties.includes("Durable Feat")) hp += 10;
	
	
	//calculate ac
	var dexMod = charSheet.dMOD;
	var ac = charSheet.stats.AC + 10 + dexMod;
	//this calculation is for medium armor
	var dexModMax2 = Math.sign(dexMod)*(Math.min(Math.abs(dexMod), 2));
	
	if(charSheet.properties.includes("monk")) ac += 2;
	if(charSheet.properties.includes("barbarian")) ac += 2;
	if(charSheet.equipment.includes("Shield")) ac += 2;
	if(charSheet.equipment.includes("Wood Shield")) ac += 2;
	if(charSheet.equipment.includes("Padded Armor")) ac += 1;
	if(charSheet.equipment.includes("Leather Armor")) ac += 1;
	if(charSheet.equipment.includes("Studded Leather Armor")) ac += 2;
	if(charSheet.equipment.includes("Hide Armor")) ac += 2 - dexMod + dexModMax2;
	if(charSheet.equipment.includes("Chain Shirt Armor")) ac += 3 - dexMod + dexModMax2;
	if(charSheet.equipment.includes("Scale Mail Armor")) ac += 4 - dexMod + dexModMax2;
	if(charSheet.equipment.includes("Breastplate Armor")) ac += 4 - dexMod + dexModMax2;
	if(charSheet.equipment.includes("Half Plate Armor")) ac += 5 - dexMod + dexModMax2;
	if(charSheet.equipment.includes("Ring Mail Armor")) ac += 4 - dexMod;
	if(charSheet.equipment.includes("Chain Mail Armor")) ac += 6 - dexMod;
	if(charSheet.equipment.includes("Splint Armor")) ac += 7 - dexMod;
	if(charSheet.equipment.includes("Plate Armor")) ac += 8 - dexMod;
	if(charSheet.properties.includes("defensestyle")) ac += 1;
	
	
	//calculate proficiency
	var prof = charSheet.level > 0? 2 : 0;
	if(charSheet.properties.includes("proficient")) prof++;
	
	//append to string
	var string = '\n\nHP:     '+hp;
	string += '\nAC:     '+ac;
	string += '\nProficiency:     '+prof;
	
	
	charSheet.file = charSheet.file + string;
}
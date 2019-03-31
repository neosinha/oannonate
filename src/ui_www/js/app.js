
//var ui = new Framework7UI();
//var server = new SDomus();
//var mqttCom = SDomusComm();

var prompt = 'wbash# '; 

function initApp() {
	var dt = new Date(); 
	
}



function clearTerm() {
	var term = document.getElementById('console');
	term.innerHTML = ''; 
}

function appendTerm(text) {
	var term = document.getElementById('console');
	var htmlx = term.value;
	htmlx = htmlx + text; 
	term.value = htmlx; 
	term.scrollTop = term.scrollHeight;
}

function displayMessage(msgObj) {
	console.log('Displaying msg: '+ msgObj['end']);
	//appendTerm(msgObj['cmd']);
	//appendTerm('\n'); 
	appendTerm(msgObj['resp']);
	appendTerm('\n'+prompt); 
}

var buffx = '';
var obuffx = ''; 
var startIdx = 0; 
var startCap = 1;
var lastKey = ''; 
function handleConsole() {
	var consolex = document.getElementById('console');
	var txt = consolex.value; 
	if (startCap) {
		
	}
	var key = window.event.key; 
	var keycode = window.event.keyCode;
	console.log(key);
	
	if (keycode === 13) {
		console.log("CR found. Sending: "+ buffx + "/Len: "+ buffx.length);
		if (buffx.length > 0) {
			sendCommand(buffx);
			startCap = 0; 
			buffx = ''; 
		} else {
			appendTerm('\n'+prompt);
		}
    } else if ((keycode === 8)||(keycode === 46) ) {
    	//backspace
    	lastidx = buffx.length; 
    	buffxs = ''; 
    	console.log('BSP: '+ buffx);
    	for (i=0; i < buffx.length-1; i++) {
    		buffxs = buffxs + buffx[i]; 
    	}
    	buffx = buffxs; 
    	console.log('BSP: '+ buffx);
	} else {
    	buffx = buffx + key; 
    }
	
}

function sendCommand(cmd) {
	mqclient.publish(mqttSession+'/cmd', cmd);
}






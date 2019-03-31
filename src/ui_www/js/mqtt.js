
reconnectTimeout = 2000;
mqclient = null; 
var mqttConnection = false;
var mqttUserName = 'iotdevice'; 
var mqttPasswd = 'iot'; 
var mqttSession = '2345'; 
var connected= false; 

	/**
	 * @method 
	 * @memberof SDomusComm
	 */
	function getEpoch() {
		var d = new Date();
		now = d.getTime(); 
		return now; 
	}; 
	

	function mqttConnect () {
		console.log("MQTT Server connection attempt");
		//Connect to the client
		mqclient.connect( {
						timeout : 10,
						cleanSession: true,
						useSSL: false, 
						onSuccess:onConnect, 
						onFailure: onFailure, 
						userName: mqttUserName, 
						password: mqttPasswd
					});
	
	}; 

	/**
	 * @method
	 * @memberof SDomusComm
	 */
	function onConnect() {
		console.log('MQTT Server connection established.');
		//console.log('Subscribing to Device:'+x+ ': '+ mqttch);
		//2345/rsp
		mqclient.subscribe(mqttSession+'/rsp');
		mqclient.publish(mqttSession+'/cmd', 'date');
	
	}; 

	/**
	 * @method
	 * @memberof SDomusComm
	 */
	function onFailure (errorCode) {
		var err = JSON.stringify(errorCode);
		console.log('MQTT Server connection lost.'+err);
		//alert('Connection Lost: '+ errorCode);
		//setTimeout(mqttConnect, reconnectTimeout);
	}; 



	/**
	 * @method
	 * @memberof SDomusComm
	 */
	function onConnectionLost (responseObject) {
		if (responseObject.errorCode !== 0) {
			console.log("onConnectionLost:"+responseObject.errorMessage);
			
			//Connect to the client
			setTimeout(mqttInit, 2*reconnectTimeout);
		}
	}; 


	/**
	 * Called when a message arrives
	 * @method
	 * @memberof SDomusComm
	 */
	function onMessageArrived (message) {
		var d = new Date();
		lastmsg = d.getTime(); 

		console.log("onMessageArrived:"+message.destinationName +"==>"+message.payloadString);
		var msg = JSON.parse(message.payloadString); 
		displayMessage(msg);
	}; 
	

function mqttInit() {
	var clientid = "sdc"+Date.now(); 
	console.log('ClientID: '+ clientid);
	mqclient = new Paho.MQTT.Client("mqtt.sinhamobility.com", Number(8830), 
							"", clientid);
	mqclient.startTrace();
	mqclient.onConnectionLost = onConnectionLost;
	mqclient.onMessageArrived = onMessageArrived; 
	
	mqclient.connect( {
		timeout : 600,
		cleanSession: true,
		useSSL: false, 
		onSuccess: onConnect, 
		onFailure: onFailure, 
		userName: 'iotdevice', 
		password: 'iot'
	});

	
}







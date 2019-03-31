
/**
 * 
 * @class SDomus 
 */
var SDomus = function () {
	
	var usermodel = {} ;
	
	/**
	 * @method auth
	 * @param username
	 * @param password
	 * @param callback
	 */
	this.auth = function(username, password, callback) {
		var params = 'accountid='+username.trim()+'&password='+ md5(password.trim()); 
		params = params + '&service=smartdomus'; 
		url = "https://api.sinhallc.com/webservices/authaccount?"; 
		urlx = url + params;
		var xhttp = new XMLHttpRequest();
		
		view.showPreloader();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				resp = JSON.parse(this.responseText);
				//console.log("==>"+ this.responseText);
				
				if (resp['accountinfo']){
					usermodel = {'id' : resp['id'], 
								'auth' : resp['auth'], 
								'created' : resp['created'], 
								'username' : resp['username']};  
				}
				callback();
				
			}
		};
		xhttp.open("POST", urlx);
		xhttp.send();
	}
	
	/**
	 * 
	 */
	this.getUserModel = function() {
		return usermodel;
	}
	
	/**
	 * 
	 */
	this.devicelist = function(accountid, callback) {
		var params = 'accountid='+accountid.trim(); 
		url = "https://smartdom.us/api/getdevices?"; 
		urlx = url + params;
		var xhttp = new XMLHttpRequest();
		
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				resp = JSON.parse(this.responseText);
				//console.log(this.responseText)
				callback(this.responseText);
			}
		};
		xhttp.open("POST", urlx);
		xhttp.send();
	}
	
}; 
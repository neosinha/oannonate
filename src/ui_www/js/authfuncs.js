/**
 * 
 */



function authProceed (username, password) {
		if ((username !== "") & (password !== "")) {
			f7engine.closeModal();
			server.auth(username, password, this.authCallback);
		} else {
			view.appInit();
		}
	}

	/**
	 * @method
	 * @memberof AuthHandler
	 * 
	 **/
function authCallback() {
			console.log(JSON.stringify(server.getUserModel()));
			accountid = server.getUserModel()['id']; 
			server.devicelist(accountid, deviceListCallback);
			f7engine.hidePreloader();
	}
	
	/**
	 * @method 
	 * @memberof AuthHandler
	 * 
	 * @param username
	 * @param password
	 * @returns none
	 **/
function authCancel (username, password) {
		view.appInit();
	};




/**
 * @class AuthHandler
 * 
 */
var AuthHandler = function () {
	
	/**
	 * Function which accepts username, password from UI and fires off to the sever class after some validation
	 * @method
	 * @memberof AuthHandler
	 * @param username
	 * @param password
	 * @returns none
	 */
	this.authProceed = function(username, password) {
		if ((username !== "") & (password !== "")) {
			f7engine.closeModal();
			server.auth(username, password, this.authCallback);
		} else {
			view.appInit();
		}
	}

	/**
	 * @method
	 * @memberof AuthHandler
	 * 
	 **/
	this.authCallback = function() {
			console.log(JSON.stringify(server.getUserModel()));
			accountid = server.getUserModel()['id']; 
			server.devicelist(accountid, deviceListCallback);
	}
	
	/**
	 * @method 
	 * @memberof AuthHandler
	 * 
	 * @param username
	 * @param password
	 * @returns none
	 **/
	this.authCancel = function (username, password) {
		view.appInit();
	}


} ; 

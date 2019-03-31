


var AppView = function (auth) {
	
	
	this.authHandler = auth; 
	
	/**
	 * @method
	 * @memberof AppView
	 */
	this.appInit = function() {
		ui.clearView();
		this.loginView();
	}
	
	this.sdomusSwitch = function () {
		
	}
	
	this.setThemes = function() {
		pgcnt = document.getElementById('pagecontent');
		pgcnt.setAttribute('class', 'page-content bg-gray');
		
		var bd = document.getElementsByTagName("BODY")[0];
		//body.style = "-web";
	} 
	

	/**
	 * @method
	 * @memberof Appview
	 */
	this.loginView = function() {
		f7engine.modalLogin("SmartDomus", 
				"<img src=\"img/smart-lock64.png\">", 
				authProceed, 
				authCancel );
	}
	
	
	/**
	 * @method
	 * @memberof Appview
	 */
	this.createAppView = function() {
		rt = ui.f7icon('reload_round');
		ui.navbarRight(rt); 
		ui.navbar('', 'Smart Domus', rt);
		btabs = Array(); 
		
		btabs.push({'flaticon': 'technology', 'label' : 'Home', 'content' : [ ui.p(null,'Test Page 3')] });
		btabs.push({'flaticon': 'smart-home-5', 'label' : 'Device', 'content' : this.sdomusLandingView() });
		btabs.push({'f7icon': 'person', 'label' : 'Account', 'content' : [ui.p(null,'Test Page 2') ]});
		//ui.bottomToolbar({'tabFunc': 'view.presentTabView'}, btabs);
		tabs = ui.tabView('bottomTab', btabs);
		
		//this.sdomusLandingView();
	}
	

	/**
	 * @method
	 * @memberof Appview
	 */
	this.mqttServerOffline = function(){
		//tabviewcontent0
		el = document.getElementById('tabviewcontent1');
		//classx = el.setAttribute('class', 'content-block-inner bg-orange');
	}


	/**
	 * @method
	 * @memberof Appview
	 */
	this.mqttServerConnected = function(){
		el = document.getElementById('tabviewcontent1');
		classx = el.setAttribute('class', 'content-block-inner bg-gray');
	}

	
	this.showPreloader = function() {
		f7engine.showPreloader('Please Wait.. <BR><img src="img/smart-lock64.png"/>\
								<span class="progressbar-infinite color-multi"></span>');	
	}
	
	/**
	 * DeviceList Handler
	 * 
	 * @method
	 * @memberof AppView
	 */
	this.sdomusLandingView = function() {
		buttons = this.loadDevices('color-gray');
		//cb = ui.contentBlock('contentblock1', buttons);
		//ui.appendToView(cb);
		//cntblk = document.getElementById('contentblockcontentblock1');
		//cntblk.setAttribute('class', 'content-block-inner bg-gray');
		return buttons; 
	}
	
	/**
	 * Load Devices
	 * @method
	 * @memberof AppView
	 * 
	 **/
	this.loadDevices = function(state) {
		
		var cards = Array(); 
		for (i in devices) {
			var rdevice = devices[i];
			var hdr = 'Relay'+i;
			var rcount = parseInt(rdevice['config']['dcount']); 
			console.log("Card ==>"+ JSON.stringify(rdevice));
			var divx = ui.element('div', null);
			
			var buttons = Array();
			var lElements = new Array();
			
			var lFuncs = {'title' : 'changeDeviceState', 'after' : 'timer' };
			for (var x=0; x < rcount; x++) {
				id = 'relaycard-tableview-'+i+'-listel-'+x;
				device = getDeviceById(id);
				el = '<div class="chip"><div class="chip-label">'+device['name']+'</div></div>';
				lElements.push({'title' : 'Switch'+(x+1), 'media' : 'bolt_round', 'after': '<i class="f7-icons">timer</i>'});
				
			}
			var tblView = ui.listView('relaycard-tableview-'+i, 
									  {'blockname' : '', 'listFunction' : lFuncs}, 
									  lFuncs, 
									  lElements);
			
			var card = ui.card('relaycard-'+i, {'header' : 'Relay'+i+'<div id=relaycard-'+i+'-icon'+'><i class="f7-icons">settings</i></div>' , 
												'content' : tblView, 'footer': ''} );
			
			cards.push(card);
		}
			
		
		
		return cards; 
	}
	
	
	/**
	 * @method
	 * @memberof AppView
	 */
	this.offlineView = function() {
		for (x in devices) {
			devx = devices[x]; 
			elx = docoument.getElementById('button'+x);
			elx.setAttribute('class', 'button button-fill color-green');
		}
	}
	
	/**
	 * @memberof AppView
	 * @method
	 * @param vNumber
	 */
	this.presentTabView = function(vNumber) {
		for (el in document.getElementsByClassName('tab-link')) {
			console.log("===>"+ el);
			el.setAttribute('class', 'tab-link');
			if (el.id == 'tabitem'+vNumber) {
				el.setAttribute('class', 'tab-link active');
			}
		}
		
		if (vNumber == 0) {
			this.sdomusLandingView();
			
		} else if (vNumber == 1) {
			ui.clearView();
		}
	}
	
	
	/**
	 * @method
	 * @memberof AppView
	 */
	this.scheduler = function(relayName, sensorName) {
		inpx = new Array(); 

		inpx.push({'label' : "Email", 
			'type' : "datetime-local", 
			'name' : 'schedulertime',
			'id'   : 'schedulertime',
			'content': new Date().toISOString()});
		
		/*inpx.push({'label' : "Password", 
			'type' : "password", 
			'name' : 'rpasswdx',
			'id'   : 'rpasswdx',
			'placeholder': "Password"}); 
		
		*/
		
		actions = new Array();
		actions.push({'text': 'Confirm', 'close' : true, 'onClick' : dispatchScheduler});
		actions.push({'text': 'Cancel', 'close' : true});
		schformel = ui.form('scheduler', inpx, 'schedulerPush');
		
		var sch = f7engine.modal( { 'title' : 'Scheduler for '+ relayName + "/"+sensorName, 
								    'text'  : '<div id="schedulerform"></div>', 
								    'buttons': actions
								    } );
	
		schform = document.getElementById('schedulerform');
		schform.appendChild(schformel);
		console.log('Modal...');
	}
	
	
	
	
	
}; 
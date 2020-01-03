
var serverLocation = location.host; 
var server = "http://" + serverLocation ;
console.log("Location: "+ server); 
var appglobals = {'classlist': null};

//This is the app Init function
function appInit() {
	appNavBar();
	loadLandingView(); 
    createDataSetStructure();
    loadInitials();
	//addImageCol();
	//addButtonCol();
	//initUpload();
}

function loadInitials() {
    var urlx = 'http://' + server + '/getimageclasses';
	console.log('Sys: '+ urlx);
	appglobals['classlist'] = null;
    ajaxLoad(imageClassCallBack, urlx);
}

var serialnum = null; 
var clock;


function updateClock() {
	var dt = new Date();
	//$('#clock').html( dt.toLocaleString());
}

function updatePerSecond() {
	updateClock();
	setTimeout(updatePerSecond, 1000);
}



function loadLandingView() {
		
		var h1x = ui.h3(null, '', [{'name' : 'class', 'value' : 'mainlogo text-center' }]);
		var jum = ui.jumbotron('view1', h1x,' bg-basic'); 
		
        var brow = ui.addRowCol('buttonrow', 1);

          //create tab area
		var tabs = new Array();
		tabs.push({'name' : "Datasets" , 'content' : loadDatasets() });
		tabs.push({'name' : "Upload" ,'content' : uploadDatasets() });
		navtabs= ui.navtabs('tabbed', 'justified bg-basic text-warning', tabs);


		var resultarea = ui.createElement('div', 'results');
		var notifyarea = ui.createElement('div', 'notify');
		

        //jum.appendChild(brow);
       // jum.appendChild(crow);
		jum.appendChild(resultarea);
		
		//jum.appendChild(xmlarea);
		jum.appendChild(notifyarea);
		
		ui.addSubViewToMain([navtabs]);
		ui.addSubViewToMain([jum]);

		$('#modalheader').html(''); 
		$('#modalbody').html('uuuu'); 
		$('#modalfooter').html(''); 
		
}

/**
Creates Update Structure scaffolding
**/
function uploadDatasets() {
    var divx = ui.createElement('div', 'uploaddataset');
    //make 2 columns
    var upcols =  ui.addRowCol('buttonrow', 2);
    divx.appendChild(upcols);

    return divx;
}


//function to populate the scaffolding in Data Structure
function createDataSetStructure() {
    var divx = document.getElementById('buttonrow-col1');
    var img = ui.createElement('img', 'oimg1');
    img.setAttribute('class', 'col-img');
    img.setAttribute('src', 'img/folder.png');
    divx.appendChild(img);
    divx.appendChild(addButtonCol());


}

function loadDatasets() {
    var divx = ui.createElement('div', 'datasetload');
    var row1 = ui.addRowCol('datasetrow', 2);
    divx.appendChild(row1);



    return divx;
}

function fileUploadRow() {

  var inpgrp = ui.createElement('div', 'fileupload');
  inpgrp.setAttribute('class', 'input-group image-preview');
  var inp1 = ui.createElement('input', '');
  inp1.setAttribute('type', 'text');
  inp1.setAttribute('class', 'form-control image-preview-filename');
  inp1.setAttribute('disabled', 'disabled');
  inpgrp.appendChild(inp1);

  var spanx = ui.createElement('span', '');
  spanx.setAttribute('class', 'input-group-btn');
  inp1.appendChild(spanx);

  var prvbtn = ui.createElement('button', 'prvbtn');
  prvbtn.setAttribute('class', 'btn btn-default image-preview-clear');
  prvbtn.setAttribute('style', "display:none;");


  var prvIcon = ui.createElement('span', '');
  prvIcon.setAttribute('class', 'glyphicon glyphicon-remove');
  prvbtn.appendChild(prvIcon);

  spanx.appendChild(prvbtn);

  var prvinpt = ui.createElement('div', 'img-prv-input');
  prvinpt.setAttribute('class', 'btn btn-default image-preview-input');
  var spanf = ui.createElement('span', '');
  spanf.setAttribute('class', 'glyphicon glyphicon-folder-open');
  prvinpt.appendChild(spanf);

  var spant = ui.createElement('span', '');
  spant.setAttribute('class', 'image-preview-input-title');
  spant.innerText = 'Browse';
  prvinpt.appendChild(spant);

  var inpt = ui.createElement('input', 'uploadimg');
  inpt.setAttribute('type', 'file');
  inpt.setAttribute('accept', 'image/png, image/jpeg');
  inpt.setAttribute('accept', '.zip, .gz, .tar.gz');
  inpt.setAttribute('name', 'input-file-preview');
  prvinpt.appendChild(inpt);

  spanx.appendChild(prvinpt);


  return inpgrp;

   /*var btn = document.getElementById('buttonrow-col0');
   btn.innerHTML = '';
   btn.appendChild(inpgrp);
    */
}

function addButtonCol() {

    var upbtn = ui.createElement('a', 'upload');
    upbtn.setAttribute('class', 'btn btn-block btn-warning fileUpload');
    upbtn.setAttribute('onchange' , 'readFile(this);');
    var spanx = ui.createElement('span');
    spanx.innerHTML = 'Upload Image';
    upbtn.appendChild(spanx);

    var fl = ui.createElement('input', 'imgfile');
    fl.setAttribute('type', 'file');
    fl.setAttribute('class', 'upload');
    fl.setAttribute('name', 'upfile');

    upbtn.appendChild(fl);

    var icon = ui.createElement('span', 'uploadicon');
    icon.setAttribute('class', 'glyphicon glyphicon-cloud-upload');
    upbtn.appendChild(icon);

    var btn = document.getElementById('buttonrow-col0');
    var formx = ui.createElement('form', 'imgform');
    formx.setAttribute('enctype', "multipart/form-data");

    formx.setAttribute('onsubmit', "uploadTrigger();");

    var flupld = ui.createElement('div', 'uploadiv');
    flupld.setAttribute('class', 'fileUpload btn btn-danger btn-block');
    var spanx = ui.createElement('span');
    spanx.innerHTML = 'Upload ZIP/TARGZ  ';


    flupld.appendChild(spanx);
    flupld.appendChild(icon);

    var fl = ui.createElement('input', 'imgfile');
    fl.setAttribute('type', 'file');
    fl.setAttribute('class', 'upload');
    fl.setAttribute('name', 'upfile');
    fl.setAttribute('onchange' , 'readFile(this);');
    flupld.appendChild(fl);

    var img = ui.createElement('img', 'inst');
    img.setAttribute('src', 'img/onnotate-flow.png');
    img.setAttribute('class', 'flow');

    formx.appendChild(flupld);
    formx.appendChild(ui.br());

    //btn.appendChild(img);
    //btn.appendChild(formx);

    /*var txtarea = ui.createElement('textarea', 'classlist');
    txtarea.setAttribute('class', 'classlist');
    var col2 = document.getElementById('buttonrow-col0');
    col2.appendChild(txtarea);*/

    //var imcol = document.getElementById('buttonrow-col0');
    //imcol.appendChild(img);

    return formx;
}

function readFile(input) {
    console.log('Read File:');
    if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#rawimage').attr('src', e.target.result);
                    $('#pxlimage').attr('src', e.target.result);
                    $('#pxlimage').attr('class', 'imcenter imageblur');
                    uploadTrigger();
                };

                reader.readAsDataURL(input.files[0]);
    }

}

function uploadTrigger() {
    console.log('Upload Trigger');
    progressModal();
    //$('#appmodal').modal('show');

    var fd = new FormData();
    var fileSelection = document.getElementById('imgfile');
    var files = fileSelection.files;
    var upfile = files[0];
    fd.append('upfile', upfile, upfile.name);
    addNotification('warning', 'Uploading '+ upfile.name);
    for (idx=0; idx < files.length; idx++) {
        console.log('==> '+ files[idx].name);
    }
    $.ajax({
            url: '/imgupload',
            type: 'post',
            data: fd,
            contentType: false,
            processData: false,
            success: function(response){
                if(response != 0){
                    console.log('File uploaded ...');
                    console.log(response);
                    updateImages(response);
                }else{
                    alert('file not uploaded');
                }
            },
      });
}


function updateImages(msg) {
    var resp = JSON.parse(msg);
    removeNotification();
    /*var urlx = 'http://' + server + '/getimageclasses';
	console.log('Sys: '+ urlx);
    ajaxLoad(imageClassCallBack, urlx);
    */
    location.reload();
}

function imageClassCallBack(response) {
    console.log(response);
    appglobals['classlist'] = JSON.parse(response);
    var tbldata = new Array();
    for (i=0; i < appglobals['classlist'].length; i++) {
        var clsnx = appglobals['classlist'][i];
        console.log("Class: "+ JSON.stringify(clsnx)) ;
        tbldata.push([clsnx['name'], clsnx['count'], 'A total of '+clsnx['count']+ 'images(s) belonging to class '+ clsnx['name']+ '. These were downloaded from Google.']);
    }

    var hdr = ['Class Name', 'Count', 'Description'];
    var tbl = ui.table('classtable', 'striped', hdr, tbldata);
    var tblel = document.getElementById('datasetload');
    tblel.innerHTML = '';
    tblel.appendChild(tbl);


}


function progressModal() {

 var mcnt = document.getElementById('modalcontent');
    mcnt.innerHTML = '';
    var img = ui.createElement('img', 'pcontent');
    img.setAttribute('src', 'img/file_uploading.gif');
    img.setAttribute('class', 'imcenter');
}

function addNotification(alertType, msg) {
    removeNotification();
    var msg = ui.createNotification(alertType, msg);
    var notify = document.getElementById('notify');
    notify.appendChild(msg);
}

function removeNotification() {
    var notify = document.getElementById('notify');
    notify.innerHTML = '';
}

function addImageCol() {
  var rawimg = ui.createElement('img', 'rawimage');
  rawimg.setAttribute('src', 'img/example/abba-1.png');
  rawimg.setAttribute('class', 'imcenter');
  var col0 = document.getElementById('imagerow-col0');
  var attr = col0.getAttribute('class');
  //col0.setAttribute('class', attr + ' well');
  col0.appendChild(rawimg);
  col0.appendChild(ui.hr());


  var pxlimg = ui.createElement('img', 'pxlimage');
  pxlimg.setAttribute('src', 'img/example/abba-1-pxltd.JPG');
  pxlimg.setAttribute('class', 'imcenter');

  var col1 = document.getElementById('imagerow-col1');
  var attr = col1.getAttribute('class');
  //col1.setAttribute('class', attr + ' well');
  col1.appendChild(pxlimg);
  col1.appendChild(ui.hr());

}



var systemModel = null; 
var networkObj = null; 

function getsystem_callback(respx) {
	console.log(respx);
	systemModel = JSON.parse(respx); 
	networkObj = systemModel['network'];
	drawView();
}



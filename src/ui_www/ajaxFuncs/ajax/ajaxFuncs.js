var xhr = null;

function callAjax(url) {
    try {
        xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.send();
        return xhr.responseText;
    } catch (err) {

        return "Error"; 
    }
}


function ajaxPost(url, params) {
    try {
        xhr = new XMLHttpRequest();
        xhr.open('POST', url, false);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(params);
        return xhr.responseText;
    } catch (err) {

        return "Error"; 
    }
}

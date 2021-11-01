//Onload get the image of today
//Assign background and sunset timer to watch for calendar changes 
//function to get day and set sunset and image
//function get the image and data from each api
//probably just load image as it's grabbed
window.onload = dateSelected();

function dateSelected(){
    console.log("dateSelected() called");
    const NASA_URL = "https://api.nasa.gov/planetary/apod?";
    let NASA_KEY = "xodsnbtiJqcWwR7hiMvBfyeABMAV3yWMIUamfg4f";
    let url = NASA_URL + "api_key=" + NASA_KEY;
    //Update UI
    console.log(url);
    getData(url);
}
//Actually get the url
function getData(url){
    //1 new XHR object
    let xhr = new XMLHttpRequest();
    //2 set onload handler
    xhr.onload = dataLoaded;
    //3 set onerror handler
    xhr.onerror = dataError;
    //4 get open and sent request
    xhr.open("GET", url);
    xhr.send();
}

function dataLoaded(e){
    //5 event.target is the xhr object
    let xhr = e.target;
    //6 xhr.responseText is the file downloaded
    console.log(xhr.responseText);
    //7 turn text into Javascript object
    let obj = JSON.parse(xhr.responseText);
    //8 if no response print and return
    if(!obj.date || obj.date == 0){
        document.querySelector("#pod").innerHTML = "<b>No results found for '" +  + "'</b>";
        return;
    }
    else{
        let image = document.se
    }
}

function dataError(e){
    console.log("An error occurred");
}
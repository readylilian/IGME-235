//Onload get the image of today
//Assign background and sunset timer to watch for calendar changes 
//function to get day and set sunset and image
//function get the image and data from each api
//probably just load image as it's grabbed
let day = returnToday();
let locationText;
let lat;
let long;
let calendar;
let calInput;
//window.addEventListener("load", findLocation());
window.addEventListener("load", function(){dateSelected(day)});
//calendar = document.querySelector("#inputCal");
//
window.addEventListener("load", createCal);
//
//

//button.onclick = findLocation();
location.onload = findLocation();


function findLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position);
    }
}
function position(pos){
    lat = pos.coords.latitude;
    long = pos.coords.longitude
    locationInformation(day);
}
function returnToday(){
    let formDate = "";
    let date = new Date();
    let day = date.getDay();
    formDate += `${date.getFullYear()}-${date.getMonth() + 1}-${day}`;
    console.log(formDate);
    return formDate;
}

function locationInformation(date){
    const SUN_URL = "https://api.sunrise-sunset.org/json?";
    let sun_url = SUN_URL+ "lat=" + lat + "&lng=" + long + "&date="+date;
    console.log(sun_url);
    locationText = document.querySelector("#location");
    getSunData(sun_url);
}

function dateSelected(date){
   
    console.log("dateSelected() called");
    const NASA_URL = "https://api.nasa.gov/planetary/apod?";
    let NASA_KEY = "xodsnbtiJqcWwR7hiMvBfyeABMAV3yWMIUamfg4f";
    let nasa_url = NASA_URL + "api_key=" + NASA_KEY + "&date=" + date;
    //Update UI
    console.log(nasa_url);
    getImgData(nasa_url);
    
}
//Actually get the url
function getImgData(url){
    //1 new XHR object
    let xhr = new XMLHttpRequest();
    //2 set onload handler
    xhr.onload = imgDataLoaded;
    //3 set onerror handler
    xhr.onerror = dataError;
    //4 get open and sent request
    xhr.open("GET", url);
    xhr.send();
}

function getSunData(url){
    //1 new XHR object
    let xhr = new XMLHttpRequest();
    //2 set onload handler
    xhr.onload = sunDataLoaded;
    //3 set onerror handler
    xhr.onerror = dataError;
    //4 get open and sent request
    xhr.open("GET", url);
    xhr.send();
}

function imgDataLoaded(e){
    //5 event.target is the xhr object
    let xhr = e.target;
    //6 xhr.responseText is the file downloaded
    console.log(xhr.responseText);
    //7 turn text into Javascript object
    let obj = JSON.parse(xhr.responseText);

    let body = document.querySelector('body');
    //8 if no response print and return
    if(!obj.date || obj.date == 0){
        document.querySelector("#pod").innerHTML = "<b>No results found for '" +  + "'</b>";
        return;
    }
    else{
        image = "<img";
        //get the hd version
        image += ` src = '${obj.hdurl}' alt = '${obj.title}'/> `;
        document.querySelector('#pod').innerHTML = image;
        
        //add description
        document.querySelector('#description').innerHTML = `<h2>${obj.title}</h2><p>${obj.explanation}</p>`;

         //make background
        body.style.background = `#03122b url(${obj.hdurl}) no-repeat center center fixed`;
        body.style.backgroundSize = "200rem 200rem";
        //body.style.opacity = "1";
        
    }
}
function sunDataLoaded(e){
    let xhr = e.target;
    //6 xhr.responseText is the file downloaded
    console.log(xhr.responseText);
    //7 turn text into Javascript object
    let obj = JSON.parse(xhr.responseText);
    //8 if no response print and return
    if(!obj.results.sunrise || obj.results.sunrise == 0){
        locationText.innerHTML = "No times found for your location";
        return;
    }
    else{

        locationText.innerHTML = `Your location is: '${long}','${lat}'<br>Sunrise is at: '${obj.results.sunrise}' Sunset is at: '${obj.results.sunset}'`
        //locationText.innerHTML = ;
        
    }
}
function dataError(e){
    console.log("An error occurred");
}


//Cal seup
function createCal()
{
    calendar = document.querySelector('#calendar');
    let calSetup = '<input type="date" id="inputCal">';
    calendar.innerHTML += calSetup;
    calInput = document.querySelector('#inputCal');
    calInput.addEventListener("change", function(){dateSelected(calInput.value)},false);
    return calendar;
}
//let cal = document.querySelector('inputCal');
//cal.addEventListener("change", dateSelected(cal.value));
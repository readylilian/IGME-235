//Onload get the image of today
//Assign background and sunset timer to watch for calendar changes 
//function to get day and set sunset and image
//function get the image and data from each api
//probably just load image as it's grabbed
let today = returnToday();
let day;
let locationText;
let lat;
let long;
let calendar;
let calInput;

window.addEventListener("load", createCal);
window.addEventListener("load", createButton);
window.addEventListener("load", checkDate);


function findLocation(){
    console.log("Trying to find location");
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
    let day = date.getDate();
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
        document.querySelector('#pod').innerHTML += image;
        
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

        locationText.innerHTML = `Your location is: '${long}','${lat}'<br>Sunrise is at: '${obj.results.sunrise}' UTC Sunset is at: '${obj.results.sunset}' UTC`
        //locationText.innerHTML = ;
        
    }
}
function dataError(e){
    console.log("An error occurred");
}
function prevDay(){
    let yesterday = new Date(`${day} 00:00`);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let formDate = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-`;
    
    if(yesterday.getDate()<10)
    {
        formDate += `0${yesterday.getDate()}`;
    }
    else{formDate += `${yesterday.getDate()}`;}
    calInput.value = formDate;
    day = calInput.value;
    checkDate();
    //dateSelected(day);
    locationInformation(day);
}
function nextDay(){
    let tomorrowCheck = new Date(`${day} 00:00`);
    tomorrowCheck.setDate(tomorrowCheck.getDate() + 1);

    let formDate = `${tomorrowCheck.getFullYear()}-${tomorrowCheck.getMonth() + 1}-`;
    if(tomorrowCheck.getDate()<10)
    {
        formDate += `0${tomorrowCheck.getDate()}`;
    }
    else{formDate += `${tomorrowCheck.getDate()}`;}
    calInput.value = formDate;
    day = calInput.value;
    checkDate();
    //dateSelected(day);
    locationInformation(day);
}
//Date validation
function checkDate(){
    //Is tomorrow past today? If yes, no next button only previous
    //let prev = ;
    document.querySelector('#pod').innerHTML ="";
    let pod = document.querySelector('#pod');
    let prevButton = document.createElement("button");
    prevButton.innerHTML = "Previous";
    prevButton.setAttribute("onclick", "prevDay()");
    pod.appendChild(prevButton);


    let tomorrowCheck = new Date(`${day} 00:00`);
    tomorrowCheck.setDate(tomorrowCheck.getDate() + 1);

    if(tomorrowCheck>new Date()){
        //Don't have an option to go to the next day, only have back
        console.log("Not valid");
    }
    else{
        //Do have a next day button
        let nextButton = document.createElement("button");
        nextButton.innerHTML = "Next";
        nextButton.setAttribute("onclick", "nextDay()");
        pod.appendChild(nextButton);
        
        console.log("Valid");
    }

    createButton();
    dateSelected(calInput.value);
}

//Cal seup
function createCal()
{
    calendar = document.querySelector('#calendar');
    let calSetup = `<input type="date" id="inputCal" value="${today}"  min="1995-6-16" max = "${today}">`;
    day = today;
    calendar.innerHTML += calSetup;
    calInput = document.querySelector('#inputCal');
    calInput.addEventListener("change", function(){
        day = calInput.value;
        checkDate();
    },false);
    return calendar;
}
function createButton()
{
    let locInfo = document.querySelector("#location");
    locInfo.innerHTML = "<button id='locButton'>Get Location?</button>";
    locInfo.innerHTML += "Sunrise: N/A, Sunset: N/A";
    document.querySelector("#locButton").onclick = findLocation;
}

//Keep drawings onscreen

function clamp(val, min, max){
    return val < min ? min : (val > max ? max : val);
}

function getWord(){
    const RAND_URL = "https://random-word-form.herokuapp.com/random/noun";
    //Actually get the url
    //1 new XHR object
    let xhr = new XMLHttpRequest();
    //2 set onload handler
    xhr.onload = wordLoaded;
    //3 set onerror handler
    xhr.onerror = dataError;
    //4 get open and sent request
    xhr.open("GET", RAND_URL);
    xhr.send();
}
function wordLoaded(e){
    let xhr = e.target;
    console.log(xhr.responseText);
    let obj = JSON.parse(xhr.responseText)
    let word = document.querySelector("#word");
    word.innerHTML = "Your word is: " + obj;
    currentWord = obj;
}
function dataError(e){
    console.log("An error occurred");
}
function clearWord(){
    let word = document.querySelector("#word");
    word.innerHTML = "";
}
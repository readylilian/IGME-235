//Keep drawings onscreen by keeping the values within range
function clamp(val, min, max){
    return val < min ? min : (val > max ? max : val);
}
//Throw a console log error message when something goes wrong
function dataError(e){
    console.log("An error occurred");
}
//get rid of whatever word is up right now
function clearWord(){
    let word = document.querySelector("#word");
    word.innerHTML = "";
}
//pull a random noun from the random word api
//kind of janky but works for now and is better than the others i've found
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
//if the word loads put the word up at the top of the screen
function wordLoaded(e){
    let xhr = e.target;
    let obj = JSON.parse(xhr.responseText)
    let word = document.querySelector("#word");
    word.innerHTML = "Your word is: " + obj;
    currentWord = obj;
}
//changes the brush type
function changeActiveBrush(e)
{
    brushType = e.target.value;
    switchSound.play();
}
//changes the brush size
function changeActiveSize(e){
    brushSize = e.target.value;
    switchSound.play();
}
//change the brush color
function changeActiveColor(e){
    brushColor = e.target.value;
    switchSound.play();
}
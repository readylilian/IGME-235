// 1
window.onload = (e) => {document.querySelector("#search").onclick = searchButtonClicked};
	
// 2
let displayTerm = "";

// 3
function searchButtonClicked(){
    console.log("searchButtonClicked() called");
    //1
    const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";
    //2
    let GIPHY_KEY = "dc6zaTOxFJmzC";
    //3 Build URL string
    let url = GIPHY_URL;
    url += "api_key=" + GIPHY_KEY;
    //4 parse the user entered term we wish to search
    let term = document.querySelector("#searchterm").value;
    displayTerm = term;

    //5 get rid of spaces
    term = term.trim();
    //6 encode special characters and middle spaces
    term = encodeURIComponent(term);
    //7 if there's no term to search then bail out of the function (return)
    if(term.length < 1) return;
    //8 append search term to URL
    url += "&q=" + term;
    //9 grab user limit
    let limit = document.querySelector("#limit").value;
    url += "&limit=" + limit;
    //10 update UI
    document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</br>";
    //11 see what url is
    console.log(url);
    //12 request data
    getData(url);
}

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

//Callback functions
function dataLoaded(e){
    //5 event.target is the xhr object
    let xhr = e.target;
    //6 xhr.responseText is the file downloaded
    console.log(xhr.responseText);
    //7 turn text into Javascript object
    let obj = JSON.parse(xhr.responseText);
    //8 if no response print and return
    if(!obj.data || obj.data.length == 0){
        document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>";
        return;
    }
    //9 build html string to display
    let results = obj.data;
    console.log("results.length = " + results.length);
    let bigString = "";
    //10 loop through results
    for (let i=0;i<results.length;i++){
        let result = results[i];
        //11 get the URL to the GIF
        let smallURL = result.images.fixed_width_downsampled.url;
        if (!smallURL) smallURL = "images/no-image-found.png";
        let rating = (result.rating ? result.rating : "NA").toUpperCase();
        //12 get the URL to the GIPHY page
        let url = result.url;
        //13 Build div for each result
        let line = `<div class = 'result'><img src='${smallURL}' title= '${result.id}' />`;
        line += `<span><a target='_blank' href='${url}'>View on Giphy</a>`;
        line +=`<p>Rating: ${rating}</p></span></div>`;
        //14 Add div to bigString and loop
        bigString +=line;
    }
    //16 show to user
    document.querySelector("#content").innerHTML = bigString;
    //17 update status
    document.querySelector("#status").innerHTML = "<b>Success!</b><p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";
}

function dataError(e){
    console.log("An error occurred");
}
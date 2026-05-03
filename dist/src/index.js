// handles main page n stuff

let mainhtml = document.getElementById("main");
let games;
let mainloaded = true;

gamesbutton.onclick = function() {
    document.getElementById("main").textContent = "";

    document.getElementById("gaming").innerHTML = `
        <button id="mainbutton">Main page</button>
        <h1>W games for W people</h1>
        <p>heres some games:</p>
        <!-- games go here -->
    `;
    console.log("Games Loaded");
};
mainbutton.onclick = function() {
    document.getElementById("games").textContent = "";
    
    document.getElementById("main").innerHTML = `${mainhtml}`;
    console.log(mainhtml);
}



var seconds = 0;
var Interval ;

let clue_ep_count = 5;
let clue_devil_fruit_count = 7;

let ep_show = false;
let df_show = false;

var reveal_ep = document.getElementById("hidden-epsiode");
var reveal_df = document.getElementById("hidden-devilfruit");

var hidden_clue_devilfruit = document.querySelector("#clue-devilfruit");
var hidden_clue_episode = document.querySelector("#clue-episode");

var play_button = document.querySelector("#playbutton");
var pause_button = document.querySelector("#pausebutton");
var compModeCounter =  document.querySelector("#compModeCounter");
var comp_mode_button = document.querySelector("#compModeButton");

pause_button.style.display = "none";
compModeCounter.style.display = "none";
compModeCounter.style.fontSize = "30px";


document.addEventListener("DOMContentLoaded", function () {
    let charactersData = [];  
    let searchInput = document.getElementById("search-bar");
    let searchResults = document.getElementById("search-results");
    let submitbutton = document.querySelector("#guess-button");
    let givenchar = [];
    let filteredCharacters = []; 
    let clue_first_app = "";
    let clue_devil_fruit = "";



    
    fetch(`/api/character-list/?index=${encodeURIComponent(selectedIndex)}`, {
        headers: { "X-Requested-With": "XMLHttpRequest" }  
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Veri yüklenemedi!");
        }
        return response.json();
    })
    .then(data => {
        console.log("Karakter verileri alındı.");
        charactersData = data.characters;  
        givenchar = data.random_character; 
        filteredCharacters = [...charactersData];
        console.log(givenchar);

        clue_devil_fruit = givenchar.devil_fruit;
        clue_first_app = givenchar.episode;

        console.log(clue_devil_fruit);
        console.log(clue_first_app);

        hidden_clue_devilfruit.innerHTML =`
        ${clue_devil_fruit}
        `;

        hidden_clue_episode.innerHTML =`
        ${clue_first_app}
        `;
    })
    .catch(error => console.error("Hata:", error));

    
    searchInput.addEventListener("input", function () {
        let query = this.value.toLowerCase();
        searchResults.innerHTML = ""; 

        if (query.length === 0) {
            searchResults.style.display = "none";
            return;
        }

        
        let searchResultsList = filteredCharacters
            .filter(char => char.name.toLowerCase().includes(query)) 
            

        if (searchResultsList.length === 0) {
            searchResults.innerHTML = `<div class="search-item">Sonuç bulunamadı</div>`;
        } else {
            searchResultsList.forEach(char => {
                let item = document.createElement("div");
                item.classList.add("search-item");

                
                item.innerHTML = `
                    <img src="/media/OnePiece/${char.image_name}" alt="${char.name}">
                    <div>
                        <strong>${char.name}</strong>
                    </div>
                `;

                
                item.addEventListener("click", function () {
                    searchInput.value = char.name;
                    searchResults.style.display = "none";

                    
                    
                });

                searchResults.appendChild(item);
            });
        }

        searchResults.style.display = "block"; 
    });

    submitbutton.addEventListener("click", function (e) {
        console.log(searchInput.value);
        let selected_char ;
        let real_char;
        
        let index = charactersData.findIndex(char => char.name === searchInput.value);
    
        selected_char = charactersData[index];
        real_char = givenchar;

        compare_and_show(selected_char,real_char)
        filteredCharacters = filteredCharacters.filter(c => c.name !== selected_char.name);
        searchInput.value = "";
    });


    

    
    document.addEventListener("click", function (e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = "none";
        }
    });
});





function compare_and_show(selected_char, real_char) {
    let resultContainer = document.querySelector(".result-values"); 
    let resultRow = document.createElement("div");
    resultRow.classList.add("result-row");

    let delay = 0; 
    let correct_count = 0;

    function createItem(value, status) {
        let item = document.createElement("div");
        item.classList.add("result-item");

        
        let bgImage;
        let is_image = false;
        switch (status) {
            case "equal":
                bgImage = "/media/correct.png"; 
                correct_count += 1;
                break;
            case "higher":
                bgImage = "/media/red_arrow_up.png"; 
                break;
            case "lower":
                bgImage = "/media/red_arrow_down.png";
                break;
            case "image":
                bgImage = `/media/OnePiece/${selected_char.image_name}`; 
                is_image = true;
                break;
            default:
                bgImage = "/media/red.png"; 
        }

        item.style.backgroundImage = `url(${bgImage})`; 
        item.style.backgroundSize = "cover";
        item.style.color = "#fff"; 
        item.style.fontWeight = "bold";
        item.style.display = "flex";
        item.style.alignItems = "center";
        item.style.justifyContent = "center";
        item.style.fontFamily = "PixelGame";

        if(value == "X"){
            item.textContent = value;
            item.style.fontSize = "30px";
        }else if(is_image){
            item.textContent = "";
        }else{
            item.textContent = value;
            item.style.fontSize = "16px";
        }
        

        
        item.style.opacity = "0"; 
        item.style.transform = "rotateY(90deg)"; 
        setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = "rotateY(0deg)"; 
        }, delay);

        delay += 500; 
        resultRow.appendChild(item);
    }

    // Compare Name or image this line doesnt matter
    createItem(selected_char.name, "image");

    // Compare Gender
    createItem(selected_char.gender, selected_char.gender === real_char.gender ? "equal" : "wrong");

    // Compare Affiliation
    createItem(selected_char.affiliation, selected_char.affiliation === real_char.affiliation ? "equal" : "wrong");

    // Compare Devil Fruit
    createItem(selected_char.devil_fruit ? selected_char.devil_fruit : "Yok", 
               selected_char.devil_fruit === real_char.devil_fruit ? "equal" : "wrong");

    // Compare Haki
    let hakiEmoji;
    if(selected_char.haki == "All"){
        hakiEmoji = "👑👁️💪"
    }else if(selected_char.haki == "Obs"){
        hakiEmoji = "👁️"
    }else if(selected_char.haki == "Arm"){
        hakiEmoji = "💪"
    }else if(selected_char.haki == "ArmObs" ){
        hakiEmoji = "👁️💪"
    }else{
        hakiEmoji = selected_char.haki
    }
    createItem(hakiEmoji, 
               selected_char.haki === real_char.haki ? "equal" : "wrong");


    // Compare Bounty
    let selectedBounty = Number(selected_char.last_bounty);
    let realBounty = Number(real_char.last_bounty);
    let bountyStatus = selectedBounty === realBounty ? "equal" : (selectedBounty < realBounty ? "higher" : "lower");
    let fixedBounty = selectedBounty;

    if (selectedBounty >= 1_000_000_000){
        fixedBounty = String(selectedBounty/1_000_000_000)+ " B";
    }else if(selectedBounty >= 1_000_000){
        fixedBounty = String(selectedBounty/1_000_000)+ " M";
    }else{
        fixedBounty = String(selectedBounty);
    }
    createItem(fixedBounty, bountyStatus);



    // Compare Age
    let selectedAge = Number(selected_char.age);
    let realAge = Number(real_char.age);
    let ageStatus = selectedAge === realAge ? "equal" : (selectedAge < realAge ? "higher" : "lower");
    createItem(selectedAge, ageStatus);

    // Compare Debut
    let selectedArcIndex = Number(selected_char.debut_arc_index);
    let realArcIndex = Number(real_char.debut_arc_index);
    let arcStatus = selectedArcIndex === realArcIndex ? "equal" : (selectedArcIndex < realArcIndex ? "higher" : "lower");
    createItem(selected_char.debut_arc, arcStatus);

    // Add Results
    resultContainer.prepend(resultRow);
    console.log("Kıyaslama yapıldı.");
    console.log(correct_count);

    if(correct_count == 7){
        clearInterval(Interval);
    }else{
        clue_ep_count -=1
        clue_devil_fruit_count -= 1
        if(clue_ep_count <= 0){
            reveal_ep.innerHTML = `
        🔍 Episode
                `;
            ep_show = true;
            }
        else{
            reveal_ep.innerHTML = `
        ${clue_ep_count} Remaining Try to Reveal First Appearance 🔍
                `;
        }


        if(clue_devil_fruit_count <= 0){
            reveal_df.innerHTML = `
        ❦ Devil Fruit
                `;
            df_show = true;
            }
        else{
            reveal_df.innerHTML = `
        ${clue_devil_fruit_count} Remaining Try to Reveal Devil Fruit Type ❦
                `;
        }


        
    }

}


//MEMORIES
var audio = document.getElementById("myAudio");

function playAudio(){
    audio.play();
    audio.volume = 0.3;
    play_button.style.display = "none";
    pause_button.style.display = "inline";

}
function pauseAudio(){
    audio.pause();
    audio.volume = 0.3;

    play_button.style.display = "inline";
    pause_button.style.display = "none";
}


function reveal_episode(){
    var hidden_clue_episode = document.querySelector("#clue-episode")

    if(ep_show){

        if (hidden_clue_episode.style.display === "none") {
            hidden_clue_episode.style.display = "block";
            hidden_clue_devilfruit.style.display = "none";
        } else {
            hidden_clue_episode.style.display = "none";
        }
}

}

function reveal_devilfruit(){
    var hidden_clue_devilfruit = document.querySelector("#clue-devilfruit")

    if(df_show){
    
        if (hidden_clue_devilfruit.style.display === "none") {
            hidden_clue_episode.style.display = "none";
            hidden_clue_devilfruit.style.display = "block";
        } else {
            hidden_clue_devilfruit.style.display = "none";
        }
    }
    else{

    }

}

//Comp Mode
function compMode(){
    Interval = setInterval(startTimer, 1000);
}
//Timer
function startTimer () {
    seconds++;
    compModeCounter.style.display = "inline";
    comp_mode_button.style.display = "none";
    compModeCounter.innerHTML = `${seconds}`;
}



const urlParams = new URLSearchParams(window.location.search);
const selectedIndex = urlParams.get("index") || "Egghead"; 


function fetchCharacterData(arcName) {
    fetch(`/api/character-list/?index=${encodeURIComponent(arcName)}`, {
        headers: { "X-Requested-With": "XMLHttpRequest" }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Veri yüklenemedi!");
        }
        return response.json();
    })
    .then(data => {
        console.log("Karakter verileri alındı.");
        charactersData = data.characters;
        givenchar = data.random_character;
        filteredCharacters = [...charactersData];
        clue_devil_fruit = givenchar.devil_fruit;
        clue_first_app = givenchar.episode;

        hidden_clue_devilfruit.innerHTML = `${clue_devil_fruit}`;
        hidden_clue_episode.innerHTML = `${clue_first_app}`;
    })
    .catch(error => console.error("Hata:", error));
}


fetchCharacterData(selectedIndex);
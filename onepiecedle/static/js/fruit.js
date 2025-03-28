var seconds = 0;
var Interval ;

let clue_devil_type_count = 5;
let clue_devil_translate_count = 7;
let clue_devil_description_count = 13;

let type_show = false;
let translate_show = false;
let description_show = false;

var reveal_type = document.getElementById("hidden-type");
var reveal_translate = document.getElementById("hidden-translate");
var reveal_description = document.getElementById("hidden-description");

var hidden_clue_type = document.querySelector("#clue-type");
var hidden_clue_translate = document.querySelector("#clue-translate");
var hidden_clue_description = document.querySelector("#clue-description");
var display_fruit_name = document.querySelector("#display-fruit-name");

var play_button = document.querySelector("#playbutton");
var pause_button = document.querySelector("#pausebutton");
var compModeCounter =  document.querySelector("#compModeCounter");
var comp_mode_button = document.querySelector("#compModeButton");

pause_button.style.display = "none";
compModeCounter.style.display = "none";
compModeCounter.style.fontSize = "30px";


document.addEventListener("DOMContentLoaded", async function () {
    let charactersData = [];
    let filteredCharacters = [];
    let searchInput = document.getElementById("search-bar");
    let searchResults = document.getElementById("search-results");
    let submitButton = document.querySelector("#guess-button");
    let givenchar = null; 
    let clue_type = "";
    let clue_translation = "";
    let clue_description = "";
    let fruit_name = "";

//api/fruit-list/
    submitButton.disabled = true;

    async function fetchCharacters() {
        try {
            let response = await fetch('api/fruit-list/', {
                headers: { "X-Requested-With": "XMLHttpRequest" }
            });

            if (!response.ok) throw new Error("Veri yüklenemedi!");

            let data = await response.json();

            console.log("Karakter verileri başarıyla yüklendi.");
            charactersData = data.characters;
            givenchar = data.random_character;
            filteredCharacters = [...charactersData];
            console.log(givenchar)

            clue_type = givenchar.type;
            clue_translation = givenchar.translation;
            clue_description = givenchar.usage;
            fruit_name = givenchar.fruit_name;

            hidden_clue_type.innerHTML =`${clue_type}`;
            hidden_clue_translate.innerHTML =`${clue_translation}`;
            hidden_clue_description.innerHTML =`${clue_description}`;
            display_fruit_name.innerHTML = `Who &nbsp; ate &nbsp;  this &nbsp;  fruit  &nbsp; -->  &nbsp;         ${fruit_name}`;





            console.log("Rastgele seçilen karakter:", givenchar);

            
            submitButton.disabled = false;

        } catch (error) {
            console.error("Hata:", error);
        }
    }

    await fetchCharacters(); 

   
    searchInput.addEventListener("input", function () {
        let query = this.value.toLowerCase();
        searchResults.innerHTML = "";

        if (query.length === 0) {
            searchResults.style.display = "none";
            return;
        }

        let searchResultsList = filteredCharacters.filter(char => char.user.toLowerCase().includes(query));

        if (searchResultsList.length === 0) {
            searchResults.innerHTML = `<div class="search-item">Sonuç bulunamadı</div>`;
        } else {
            searchResultsList.forEach(char => {
                let item = document.createElement("div");
                item.classList.add("search-item");
                item.innerHTML = `
                    <img src="/media/OnePiece/${char.image_name}" alt="${char.user}">
                    <div><strong>${char.user}</strong></div>
                `;

                
                item.addEventListener("click", function () {
                    searchInput.value = char.user;
                    searchResults.style.display = "none";
                });

                searchResults.appendChild(item);
            });
        }

        searchResults.style.display = "block";
    });

    
    submitButton.addEventListener("click", function () {

        let selected_char;
        

        let index = charactersData.findIndex(char => char.user === searchInput.value);

        selected_char = charactersData[index];
        let real_char = givenchar;

        console.log(selected_char);
        console.log(real_char);

        if (!selected_char || !real_char) {
            console.error("Hata: Karakter verisi eksik!");
            return;
        }

        compare_and_show(selected_char, real_char);

       
        filteredCharacters = filteredCharacters.filter(c => c.user !== selected_char.user);
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

        if (value === "X") {
            item.textContent = value;
            item.style.fontSize = "30px";
        } else if (is_image) {
            item.textContent = "";
        } else {
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

    createItem(selected_char.user, "image");
    createItem(selected_char.fruit_name, selected_char.fruit_name === real_char.fruit_name ? "equal" : "wrong");

    resultContainer.prepend(resultRow);
    console.log("Kıyaslama yapıldı.");

    if(correct_count == 1){
        clearInterval(Interval);
    }else{
        clue_devil_type_count -= 1;
        clue_devil_translate_count -= 1;
        clue_devil_description_count -= 1;

        if(clue_devil_type_count <= 0){
            reveal_type.innerHTML = `
        🔍 Episode
                `;
            type_show = true;
            }
        else{
            reveal_type.innerHTML = `
         ${clue_devil_type_count} Remaining Try to Reveal Type 🔍❦
                `;
        }


        if(clue_devil_translate_count <= 0){
            reveal_translate.innerHTML = `
        ❦ Devil Fruit
                `;
            translate_show = true;
            }
        else{
            reveal_translate.innerHTML = `
        ${clue_devil_translate_count} Remaining Try to Reveal Translation 🔄
                `;
        }

        if(clue_devil_description_count <= 0){
            reveal_description.innerHTML = `
        ❦ Devil Fruit
                `;
            description_show = true;
            }
        else{
            reveal_description.innerHTML = `
        ${clue_devil_description_count} Remaining Try to Reveal Description 📖
                `;
        }



        
    }
}


var audio = document.getElementById("myAudio");

function playAudio() {
    audio.play();
    audio.volume = 0.3;
}

function pauseAudio() {
    audio.pause();
    audio.volume = 0.3;
}


function reveal_type_f(){
    var hidden_clue_type = document.querySelector("#clue-type")

    if(type_show){

        if (hidden_clue_type.style.display === "none") {
            hidden_clue_type.style.display = "block";

            hidden_clue_description.style.display = "none";
            hidden_clue_translate.style.display = "none";
        } else {
            hidden_clue_type.style.display = "none";
        }
}

}

function reveal_translate_f(){
    var hidden_clue_translate = document.querySelector("#clue-translate")

    if(translate_show){
    
        if (hidden_clue_translate.style.display === "none") {
            hidden_clue_translate.style.display = "block";

            hidden_clue_description.style.display = "none";
            hidden_clue_type.style.display = "none";
        } else {
            hidden_clue_translate.style.display = "none";
        }
    }
    else{

    }

}

function reveal_description_f(){
    var hidden_clue_description = document.querySelector("#clue-description")

    if(description_show){
    
        if (hidden_clue_description.style.display === "none") {
            hidden_clue_translate.style.display = "none";
            hidden_clue_type.style.display = "none";

            hidden_clue_description.style.display = "block";
        } else {
            hidden_clue_description.style.display = "none";
        }
    }
    else{

    }

}

function compMode(){
    Interval = setInterval(startTimer, 1000);
}

function startTimer () {
    seconds++;
    compModeCounter.style.display = "inline";
    comp_mode_button.style.display = "none";
    compModeCounter.innerHTML = `${seconds}`;
}


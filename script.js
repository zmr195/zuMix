const fromText = document.querySelector(".from-text"),
toText = document.querySelector(".to-text"),
selectTag = document.querySelectorAll("select"),
exchangeIcon = document.querySelector(".exchange"),
translateBtn = document.querySelector("button"),
icons = document.querySelectorAll(".row i");

selectTag.forEach((tag, id) => {
    for (const country_code in countries) {
        // selecting English by default as FROM language and Hindi has TO language 
        let selected;
        if(id == 0 && country_code == "en-US"){
            selected = "selected";
        }else if(id == 1 && country_code == "ta-IN"){
            selected = "selected";
        }
        let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option); //adding options tag inside select tag

    }
});

exchangeIcon.addEventListener('click', () => {
    let tempText = fromText.value,
    tempLang = selectTag[0].value;
    fromText.value = toText.value;
    selectTag[0].value = selectTag[1].value;
    toText.value = tempText;
    selectTag[1].value = tempLang;
});

translateBtn.addEventListener("click" , () => {
    let text = fromText.value,
    translateFrom = selectTag[0].value, //getting fromSelect tag value
    translateTo = selectTag[1].value; //getting toSelect tag value
    if(!text) return;
    toText.setAttribute("placeholder", "Translating...");
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}!&langpair=${translateFrom}|${translateTo}`;
    //fletching api response annd returning it with parsing into js obj
    //and in another then method reciewing that obj
    fetch(apiUrl).then(res => res.json()).then(data => {
    
        toText.value = data.responseData.translatedText;
        toText.setAttribute("placeholder", "Translation");
    });

})

icons.forEach(icon => {
    icon.addEventListener("click", ({target}) => {
        // If clicked icon has "fa-copy" class, copy the respective textarea value
        if (target.classList.contains("fa-copy")) {
            if (target.id == "from") {
                navigator.clipboard.writeText(fromText.value);
            } else {
                navigator.clipboard.writeText(toText.value);
            }
        } else {
            let utterance;
            if (target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value; // Setting utterance language to fromSelect tag value
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value; // Setting utterance language to toSelect tag value
            }
            // Corrected SpeechSynthesis API call
            window.speechSynthesis.speak(utterance);
        }
    });
});
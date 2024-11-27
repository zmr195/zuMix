const fromText = document.querySelector(".from-text"),
    toText = document.querySelector(".to-text"),
    selectTag = document.querySelectorAll("select"),
    exchangeIcon = document.querySelector(".exchange"),
    translateBtn = document.querySelector("button"),
    icons = document.querySelectorAll(".icons i");

// Populating the select dropdowns with language options
selectTag.forEach((tag, id) => {
    for (const country_code in countries) {
        let selected;
        // Default languages: English as FROM and Tamil as TO
        if (id === 0 && country_code === "en-US") {
            selected = "selected";
        } else if (id === 1 && country_code === "ta-IN") {
            selected = "selected";
        }
        let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>;`
        tag.insertAdjacentHTML("beforeend", option); // Adding options inside the select tag
    }
});

// Exchange icon functionality
exchangeIcon.addEventListener("click", () => {
    let tempText = fromText.value,
        tempLang = selectTag[0].value;
    fromText.value = toText.value;
    toText.value = tempText;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
});

// Translate button functionality
translateBtn.addEventListener("click", () => {
    let text = fromText.value.trim(),
        translateFrom = selectTag[0].value, // Getting value of the FROM language
        translateTo = selectTag[1].value; // Getting value of the TO language

    if (!text) return; // If input is empty, stop execution

    toText.setAttribute("placeholder", "Translating...");
    let apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
    )}&langpair=${translateFrom}|${translateTo}`;

    // Fetch API response and display the translated text
    fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
            toText.value = data.responseData.translatedText || "Translation not available";
            toText.setAttribute("placeholder", "Translation");
        })
        .catch((err) => {
            toText.value = "Error in translation";
            console.error("Translation Error:", err);
        });
});

// Icon functionalities: Copy and Speak
icons.forEach((icon) => {
    icon.addEventListener("click", ({ target }) => {
        // Copy functionality
        if (target.classList.contains("fa-copy")) {
            if (target.id === "from-speak") {
                navigator.clipboard.writeText(fromText.value);
            } else if (target.id === "to-speak") {
                navigator.clipboard.writeText(toText.value);
            }
        } 
        // Speech functionality
        else {
            let utterance;
            if (target.id === "from-speak") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value; // Language from FROM select tag
            } else if (target.id === "to-speak") {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value; // Language from TO select tag
            }
            // Trigger the speech synthesis
            if (utterance) {
                window.speechSynthesis.speak(utterance);
            }
        }
    });
});
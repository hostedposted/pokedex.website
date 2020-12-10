document.getElementById("searchbut2").addEventListener("click", function() {
    const searcher2 = document.getElementById("search2").value.toLowerCase()
    for (const pokeman of moves) {
        document.getElementById(pokeman.name).style.display = ""
    }
    for (const pokeman of moves) {
        if (!pokeman.name.startsWith(searcher2)) {
            document.getElementById(pokeman.name).style.display = "none"
        }
    }
});



document.getElementById("clearbut2").addEventListener("click", function() {
    document.getElementById("search2").value = "";
    document.getElementById("searchbut2").click();
});

var input = document.getElementById("search2");


input.addEventListener("keyup", function(event) {
    for (i = 0; i < 226; i++) {
        if (event.keyCode === i) {

            event.preventDefault();

            document.getElementById("searchbut2").click();
        };
    };
});


const pokedex2 = document.getElementById('pokedex2');

let moves;


const fetchPokemon2 = () => {
    const promises = [];
    for (let i = 1; i <= 784; i++) {
        const url2 = `/move/${i}/index.json`;
        promises.push(fetch(url2).then((res) => res.json()));
    }

    Promise.all(promises).then((results) => {
        moves = results.map((result) => ({
            name: result.name,
            pp: result.pp,
            accuracy: result.accuracy || "Never Fails",
            priority: result.priority,
            power: result.power || 0,
            effect: result.effect_entries.map((short_effect) => short_effect.short_effect).join(', ').replace('$effect_chance', result.effect_chance).replace('$effect_chance', result.effect_chance),
            effect_chance: result.effect_chance,
            type: result.type.name,
            id: result.id,
        }));
        displayPokemon2(moves);
    });
};

const colors = {
    "ground": "#CC9F4F",
    "fire": "#EA7A3C",
    "grass": "#71C558",
    "fairy": "#E397D1",
    'normal': "#AAB09F",
    'fighting': "#CB5F48",
    'ice': "#70CBD4",
    'electric': "#E5C531",
    'flying': "#7DA6DE",
    'poison': "#B468B7",
    'bug': "#94BC4A",
    'dark': "#736C75",
    'water': "#539AE2",
    'psychic': "#E5709B",
    "rock": "#B2A061",
    "ghost": "#846AB6",
    "dragon": "#6A7BAF",
    "steel": "#B7B7CE",
}

const displayPokemon2 = (moves) => {
    const pokemonHTMLString = moves
        .map(
            (pokeman) => `
                                <li class="move" id = "${pokeman.name}" style = "background-color: ${colors[pokeman.type]};">
                                    <h2 class="card-title">${pokeman.name}</h2>
                                    <p class="move-subtitle">PP: ${pokeman.pp} <br> Accuracy: ${pokeman.accuracy} <br> Priority: ${pokeman.priority} <br> Power: ${pokeman.power} <br> Effect: ${pokeman.effect} <br> Move type: ${pokeman.type}</p>
                                </li>
                            `
        )
        .join('');
    pokedex2.innerHTML = pokemonHTMLString;
};

fetchPokemon2();
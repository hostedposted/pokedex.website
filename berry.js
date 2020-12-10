document.getElementById("searchbut1").addEventListener("click", function() {
    const searcher1 = document.getElementById("search1").value.toLowerCase()
    for (const pokeman of berries) {
        document.getElementById(pokeman.name).style.display = ""
    }
    for (const pokeman of berries) {
        if (!pokeman.name.startsWith(searcher1)) {
            document.getElementById(pokeman.name).style.display = "none"
        }
    }
});



document.getElementById("clearbut1").addEventListener("click", function() {
    document.getElementById("search1").value = "";
    document.getElementById("searchbut1").click();
});

var input = document.getElementById("search1");


input.addEventListener("keyup", function(event) {
    for (i = 0; i < 226; i++) {
        if (event.keyCode === i) {

            event.preventDefault();

            document.getElementById("searchbut1").click();
        };
    };
});

const pokedex1 = document.getElementById('pokedex1');

let berries;

const fetchPokemon1 = () => {
    const promises = [];
    for (let i = 1; i <= 64; i++) {
        const url1 = `https://pokeapi.co/api/v2/berry/${i}`;
        promises.push(fetch(url1).then((res) => res.json()));
    }
    Promise.all(promises).then((results) => {
        berries = results.map((result) => ({
            name: result.name,
            firmness: result.firmness.name,
            natural_gift_type: result.natural_gift_type.name,
            natural_gift_power: result.natural_gift_power,
            id: result.id,
            effect_chance: result.effect_chance,
        }))
        displayPokemon1(berries);
    });
};

const displayPokemon1 = (pokemon) => {
    const pokemonHTMLString = pokemon
        .map(
            (pokeman) => `
                           <li class="card" id = "${pokeman.name}">
                               <img class="card-image" src="https://raw.githubusercontent.com/hostedposted/Pokedex-data/main/${pokeman.id}.png"/>
                               <h2 class="card-title">${pokeman.name}</h2>
                               <p class="card-subtitle">Firmness: ${pokeman.firmness} <br> Natural Gift Type: ${pokeman.natural_gift_type} <br> Natural Gift Power: ${pokeman.natural_gift_power} </p>
                           </li>
                       `
        )
        .join('');
    pokedex1.innerHTML = pokemonHTMLString;
};

fetchPokemon1();
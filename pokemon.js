document.getElementById("searchbut").addEventListener("click", function() {
    const searcher = document.getElementById("search").value.toLowerCase()
    for (const pokeman of pokemon) {
        document.getElementById(pokeman.name).style.display = ""
    }
    for (const pokeman of pokemon) {
        if (!pokeman.name.startsWith(searcher)) {
            document.getElementById(pokeman.name).style.display = "none"
        }
    }
});



document.getElementById("clearbut").addEventListener("click", function() {
    document.getElementById("search").value = "";
    document.getElementById("searchbut").click();
});

var input = document.getElementById("search");

var i;

input.addEventListener("keyup", function(event) {
    for (i = 0; i < 226; i++) {
        if (event.keyCode === i) {

            event.preventDefault();

            document.getElementById("searchbut").click();
        };
    };
});




const pokedex = document.getElementById('pokedex');
const cachedPokemon = {};
const cachedEvolution = {};
let pokemon
const fetchPokemon = () => {
    const url = 'info.json'
    fetch(url).then((res) => res.json()).then((results) => {
        const url = "gen8.json";
        fetch(url).then((res) => res.json()).then((gen8pokemon) => {
            results.sort((a, b) => (a.id - b.id))
            pokemon = results.map((result) => ({
                name: result.name,
                image: `/pokemon/${result.id}.png`,
                type: result.types.map((type) => type.type.name).join(', '),
                id: result.id,
                ability: result.abilities.map((ability) => ability.ability.name).join(', ') || gen8pokemon[result.id - 808].abilities.join(', '),
            }));
            displayPokemon(pokemon);
        });
    });
};

const colors = {
    "ground": "#CC9F4F",
    "fire": "#EA7A3C",
    "grass": "#71C558",
    "fairy": "#D685AD",
    'normal': "#AAB09F",
    'fighting': "#CB5F48",
    'ice': "#70CBD4",
    'electric': "#E5C531",
    'flying': "#7DA6DE",
    'poison': "#B468B7",
    'bug': "#A6B91A",
    'dark': "#736C75",
    'water': "#539AE2",
    'psychic': "#F95587",
    "rock": "#B2A061",
    "ghost": "#846AB6",
    "dragon": "#7038F8",
    "steel": "#B7B7CE",
}

function getStyle(pokeman) {
    if (pokeman.type.indexOf(',') < 0) {
        // This pokemon only has one type
        return `background: ${colors[pokeman.type]};`
    } else {
        const types = pokeman.type.split(', ')
        const color1 = colors[types[0]]
        const color2 = colors[types[1]]
        return `background: linear-gradient(to right, ${color1} 50%, ${color2} 50%);`
    }
   }
   

const displayPokemon = (pokemon) => {
    const pokemonHTMLString = pokemon
        .map(
            (pokeman) => `
            <li class="card" id = "${pokeman.name}" onclick = "selectPokemon(${pokeman.id})" style="${getStyle(pokeman)}">
                <img class="card-image" src="${pokeman.image}"/>
                <h2 class="card-title">${pokeman.id}. ${pokeman.name}</h2>
                <p class="card-subtitle">Type: ${pokeman.type} <br> Ability: ${pokeman.ability} </p>
            </li>
        `
        )
        .join('');
    pokedex.innerHTML = pokemonHTMLString;
};

fetchPokemon();

const selectPokemon = async(id) => {
    if (!cachedPokemon[id]) {
        const url = `pokemon/${id}/index.json`;
        const res = await fetch(url);
        const pokeman = await res.json();
        const urlf = `/pokemon-species/${id}/index.json`;
        const resf = await fetch(urlf);
        const pokemanf = await resf.json();
        const evoU = `/api/v2/evolution-chain/${pokemanf.evolution_chain.url.replace("/api/v2/evolution-chain/", "").replace("/", "/index.json")}`;
        const rese = await fetch(evoU);
        const evolution = await rese.json();
        cachedPokemon[id] = pokeman;
        cachedEvolution[id] = evolution;
        displayPokemanPopup(pokeman, evolution);
    } else {
        displayPokemanPopup(cachedPokemon[id], cachedEvolution[id]);
    }
};

function getStyleP(pokeman) {
    if (pokeman.types.map((type) => type.type.name).join(', ').indexOf(',') < 0) {
        // This pokemon only has one type
        return `background: ${colors[pokeman.types.map((type) => type.type.name).join(', ')]};`
    } else {
        const types = pokeman.types.map((type) => type.type.name).join(', ').split(', ')
        const color1 = colors[types[0]]
        const color2 = colors[types[1]]
        return `background: linear-gradient(to right, ${color1} 50%, ${color2} 50%);`
    }
   }

function displayMove(url) {
    fetch(url).then((res) => res.json()).then((move) => {
        const htmlString = move.effect_entries.map((short_effect) => short_effect.short_effect).join(', ').replace('$effect_chance', move.effect_chance).replace('$effect_chance', move.effect_chance);
        const popmove = document.getElementById(move.name)
        if (popmove.innerHTML != '') {
            popmove.innerHTML = ''
        } else {
            popmove.innerHTML = htmlString + popmove.innerHTML
        }

    });
}


const displayPokemanPopup = (pokeman, evolution) => {
        const url = "gen8.json";
        fetch(url).then((res) => res.json()).then((gen8pokemon) => {
                    document.body.style.overflow = 'hidden';
                    const url7 = "pokedex.json";
                    fetch(url7).then((res) => res.json()).then((desc) => {
                                const type = pokeman.types.map((type) => type.type.name).join(', ');
                                const stats = pokeman.stats.map((stat) =>
                                    `${stat.stat.name}: ${stat.base_stat}`
                                ).join('<br>');
                                const movers = pokeman.id < 808 ?
                                    `Moves ${pokeman.name} can learn are: <br> ${pokeman.moves.map((move) =>
                `${move.move.name} <button id="details" type="button" onclick="displayMove('${move.move.url.replace("/api/v2/move/", "move").replace("/", "/index.json").replace("move", "move/")}')">Details</button><div id = "${move.move.name}"></div>`
            ).join('')}` :  ``

        const ability = pokeman.abilities.map((ability) => ability.ability.name).join(', ') || gen8pokemon[pokeman.id-808].abilities.join(', ')
        const description = pokeman.id < 808 ?
            `Description: <br>${desc[pokeman.id-1].description}` : pokeman.id < 891 ?
            `Description: <br>${gen8pokemon[pokeman.id-808].description}` : ``
        const species = pokeman.id < 810 ?
                `Species: <br>${desc[pokeman.id-1].species}<br>` : ``
        const evolchain = evolution.chain.evolves_to[0] == undefined ?
            `Evolution chain: ${evolution.chain.species.name}` : evolution.chain.evolves_to[0].evolves_to[0] == undefined ?
            `Evolution chain: ${evolution.chain.species.name}, ${evolution.chain.evolves_to[0].species.name}` : `Evolution chain: ${evolution.chain.species.name}, ${evolution.chain.evolves_to[0].species.name}, ${evolution.chain.evolves_to[0].evolves_to[0].species.name}`
        const htmlString = `
            <div class="popup">
                <button id="closeBtn" onclick="closePopup()">Close</button>
                <div class="card" style="${getStyleP(pokeman)}">
                    <img class="card-image" src="/pokemon/${pokeman.id}.png"/>
                    <img class="card-image" src="/pokemon/shiny/${pokeman.id}.png"/>
                    <h2 class="card-title">${pokeman.id}. ${pokeman.name}</h2>
                    <p>Type: ${type} <br>Height in decimetres: ${pokeman.height}<br> Weight in hectograms: ${
            pokeman.weight
        }<br> Abilities: ${ability}<br> Base Stats: <br>${stats}<br>${species}${description}<br>${evolchain}<br>${movers}</p>
                </div>
            </div>
        `;
        pokedex.innerHTML = htmlString + pokedex.innerHTML;
        })
        })
    };
    
    const closePopup = () => {
        document.body.style.overflow = '';
        const popup = document.querySelector('.popup');
        popup.parentElement.removeChild(popup);
    };

    fetchPokemon();
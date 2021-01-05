const pokedex = document.getElementById('pokedex');
const cachedPokemon = {};

document.getElementById("searchbut").addEventListener("click", function() {
    var input, filter, ul, li, a, i, value;
    input = document.getElementById('search');
    filter = input.value.toUpperCase();
    ul = pokedex;
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
       a = li[i].getElementsByTagName("t")[0];
       value = a.textContent || a.innerText;
       if (value.toUpperCase().indexOf(filter) == 0) {
          li[i].style.display = "";
       } else {
          li[i].style.display = "none";
       }
    }
});

var input = document.getElementById("search");

input.addEventListener("keyup", function(event) {
    event.preventDefault();

    document.getElementById("searchbut").click();
});



document.getElementById("clearbut").addEventListener("click", function() {
    document.getElementById("search").value = "";
    document.getElementById("searchbut").click();
});


const colors = {
    "normal": "#A8A878",
    "fighting": "#C03028",
    "flying": "#A890F0",
    "poison": "#A040A0",
    "ground": "#E0C068",
    "rock": "#B8A038",
    "bug": "#A8B820",
    "ghost": "#705898",
    "steel": "#B8B8D0",
    "fire": "#F08030",
    "water": "#6890F0",
    "grass": "#78C850",
    "electric": "#F8D030",
    "psychic": "#F85888",
    "ice": "#98D8D8",
    "dragon": "#7038F8",
    "dark": "#705848",
    "fairy": "#EE99AC",
}

const selectPokemon = async(id) => {
    if (!cachedPokemon[id]) {
        const url = `pokemon/${id}/index.json`;
        const res = await fetch(url);
        const pokeman = await res.json();
        cachedPokemon[id] = pokeman;
        displayPokemanPopup(pokeman);
    } else {
        displayPokemanPopup(cachedPokemon[id]);
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
        const htmlString = `PP: ${move.pp} <br>Accuracy: ${move.accuracy || "Never Fails"} <br> Priority: ${move.priority} <br>Type: ${move.type.name}<br>Power: ${move.power || 0} <br>Description: ${move.effect_entries.map((short_effect) => short_effect.short_effect).join(', ').replace('$effect_chance', move.effect_chance).replace('$effect_chance', move.effect_chance)}`
        const popmove = document.getElementById(move.name)
        if (popmove.innerHTML != '') {
            popmove.innerHTML = ''
        } else {
            popmove.innerHTML = htmlString + popmove.innerHTML
        }

    });
}


const displayPokemanPopup = (pokeman) => {
        const url = "gen8.json";
        fetch(url).then((res) => res.json()).then((gen8pokemon) => {
            const urls = "evolution.json";
            fetch(urls).then((res) => res.json()).then((pokemans) => {
                const urlE = `${pokemans[pokeman.id-1].evolution_chain.url}index.json`
                fetch(urlE).then((res) => res.json()).then((evolution) => {
                    const urlt = "types.json";
                    fetch(urlt).then((res) => res.json()).then((type_chart) => {
                                document.body.style.overflow = 'hidden';
                                const url7 = "pokedex.json";
                                fetch(url7).then((res) => res.json()).then((desc) => {
                                            const type = pokeman.types.map((type) => type.type.name).join(', ');
                                            const stats = pokeman.stats.map((stat) =>
                                                `${stat.stat.name}: ${stat.base_stat}`
                                            ).join('<br>');

                                            const type_list = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy']
                                            const type_dict = {
                                                0: [],
                                                0.25: [],
                                                0.5: [],
                                                1: [],
                                                2: [],
                                                4: []
                                            }

                                            for (let i = 0; i < type_list.length; i++) {
                                                const attack_type = type_list[i]
                                                const multiplier = type_chart[pokeman.id - 1][attack_type]
                                                type_dict[multiplier].push(attack_type)
                                            }
                                            var types = "";
                                            ([0, 0.25, 0.5, 1, 2, 4]).forEach(multiplier => {
                                                const type_damage = type_dict[multiplier].join(", ")
                                                if (type_damage != "") {
                                                    types = types + " Takes " + multiplier + " times damage from " + type_damage + ".<br>"
                                                }
                                            });
                                            const movers = pokeman.id < 808 ?
                                                `Moves ${pokeman.name} can learn are: <br> ${pokeman.moves.map((move) =>
                `${move.move.name} <button id="details" type="button" onclick="displayMove('${move.move.url.replace("/api/v2/move/", "move").replace("/", "/index.json").replace("move", "move/")}')">Details</button><div id = "${move.move.name}"></div>`
            ).join('')}` :  
            `Level Up Moves ${pokeman.name} can learn are: <br> ${gen8pokemon[pokeman.id-808].level_up_moves.map((move) => 
                `${move[1]} can be learned at level ${move[0]}`
            ).join(', <br>')}`
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
            <div class="popup" style="background-color: ${document.getElementById('inp').value}">
                <button id="closeBtn" onclick="closePopup()">Close</button>
                <div class="card" style="${getStyleP(pokeman)}">
                    <img class="card-image" src="/pokemon/${pokeman.id}.png"/>
                    <img class="card-image" src="/pokemon/shiny/${pokeman.id}.png"/>
                    <h2 class="card-title">${pokeman.id}. ${pokeman.name}</h2>
                    <p>Type: ${type} <br>Height in decimetres: ${pokeman.height}<br> Weight in hectograms: ${
            pokeman.weight
        }<br> Abilities: ${ability}<br> Base Stats: <br>${stats}<br>${species}${description}<br>${evolchain}<br>${types}<br><br>${movers}</p>
                </div>
            </div>
        `;
        pokedex.innerHTML = htmlString + pokedex.innerHTML;
        })
        })
    })
})
    })
    };
    
    const closePopup = () => {
        document.body.style.overflow = '';
        const popup = document.querySelector('.popup');
        popup.parentElement.removeChild(popup);
    };
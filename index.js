let filterInput = document.getElementById("filter");
let pokemonsContainer = document.getElementById("pokemons");
let data = []; //Dados dos pokémons que serão recuperados da api

async function getPokemon() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1400", {
    method: "GET",
  });
  if (response.ok) {
    const results = await response.json();
    return results.results;
  }
}

//recebe parâmetro data, um []
//limpa o conteúdo que já existe
//itera dados para gerar elementos HTML

function renderPokemons(data) {
  pokemonsContainer.innerHTML = "";
  const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));

  sortedData.forEach((item) => {
    let card = document.createElement("div");
    card.className = "pokemonCard";
    card.textContent = item.name;
    pokemonsContainer.appendChild(card);

    card.addEventListener("click", function () {
      getPokemonDetails(item.name);
    });
  });
}
async function getPokemonDetails(name) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, {
    method: "GET",
  });

  if (response.ok) {
    const details = await response.json();
    document.getElementById("pokemonModalLabel").textContent = details.name; //exemplo de título
    const modalBody = document.querySelector(".modal-body");

    modalBody.innerHTML = `
    <div class="someItems">
        <div class="pokemonInfo">
            <p>Altura: ${details.height}</p>
            <p>Peso: ${details.weight}</p>
        </div>
        <div class="pokemonPhoto">
            <img class="imgContent" src="${
              details.sprites.other["official-artwork"].front_default
            }" alt="${details.name}"/>
        </div>
    </div>
    <div class="infoContainer">
    <div class="pokemonContent">
        <div class="infoCollapse">
            <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseExample1" aria-expanded="false" aria-controls="collapseExample1">
                Status do Pokémon
            </button>
            <div class="collapse" id="collapseExample1">
                <div class="card card-body">
                ${details.stats
                  .map(
                    (item) =>
                      `<li class="statsList">${item.stat.name}: ${item.base_stat}</li>`
                  )
                  .join("")}
                </div>
            </div>
        </div>
    </div>
    <div class="pokemonContent">
        <div class="infoCollapse">
            <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseExample2" aria-expanded="false" aria-controls="collapseExample2">
                Todas as Fotos
            </button>
            <div class="collapse" id="collapseExample2">
                <div class="card card-body" id="divImage">
                    ${Object.entries(details.sprites)
                      .map(([key, value]) => {
                        if (typeof value === "string" && value) {
                          return `<img class="miniImage" src="${value}" alt="${details.name}" />`;
                        }
                      })
                      .join("")}
                </div>
            </div>
        </div>
    </div>
    <div class="pokemonContent">
        <div class="infoCollapse">
            <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseExample3" aria-expanded="false" aria-controls="collapseExample3">
                Habilidades
            </button>
            <div class="collapse" id="collapseExample3">
                <div class="card card-body">
                    ${details.abilities
                      .map(
                        (item) =>
                          `<li class="statsList">${item.ability.name}</li>`
                      )
                      .join("")}
                </div>
            </div>
        </div>
    </div>
    </div>

    `;
    $("#pokemonModal").modal("show");
  }
}

filterInput.addEventListener("input", function () {
  let filter = data.filter((item) => {
    return item.name.toLowerCase().includes(filterInput.value.toLowerCase());
  });
  renderPokemons(filter);
});

document.addEventListener("DOMContentLoaded", async function () {
  data = await getPokemon();
  renderPokemons(data);
});

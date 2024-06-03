import React, { useEffect, useState } from "react";
import "./style.css";

const Pokeinfo = ({ data }) => {
  const [currentPokemon, setCurrentPokemon] = useState(data);
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [clicked, setClicked] = useState(false);

  const getPokemonData = async (pokemonId) => {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`
    );
    return response.json();
  };

  const getSpeciesData = async (speciesUrl) => {
    const response = await fetch(speciesUrl);
    return response.json();
  };

  const getEvolutionChainData = async (evolutionChainUrl) => {
    const response = await fetch(evolutionChainUrl);
    return response.json();
  };

  const getEvolutionImages = async (pokemonId) => {
    const pokemonData = await getPokemonData(pokemonId);
    const speciesUrl = pokemonData.species.url;
    const speciesData = await getSpeciesData(speciesUrl);
    const evolutionChainUrl = speciesData.evolution_chain.url;
    const evolutionChainData = await getEvolutionChainData(evolutionChainUrl);

    let evolutionDetails = [];
    let currentEvolution = evolutionChainData.chain;

    do {
      const speciesName = currentEvolution.species.name;
      const speciesUrl = currentEvolution.species.url;
      const speciesData = await getSpeciesData(speciesUrl);
      const spriteUrl = speciesData.varieties[0].pokemon.url;

      evolutionDetails.push({ name: speciesName, spriteUrl });

      currentEvolution = currentEvolution.evolves_to[0];
    } while (currentEvolution && currentEvolution.hasOwnProperty("evolves_to"));

    const evolutionImages = await Promise.all(
      evolutionDetails.map(async (evolution) => {
        const pokemonData = await getPokemonData(
          evolution.spriteUrl.split("/").slice(-2, -1)[0]
        );
        return {
          name: evolution.name,
          imageUrl: pokemonData.sprites.front_default,
        };
      })
    );

    return evolutionImages;
  };

  useEffect(() => {
    const fetchEvolutionChain = async () => {
      if (data && data.id) {
        const evolutionImages = await getEvolutionImages(data.id);
        setEvolutionChain(evolutionImages);
      }
    };

    fetchEvolutionChain();
  }, [data]);

  useEffect(() => {
    setCurrentPokemon(data);
  }, [data]);

  const handleEvolutionClick = async (pokemonName) => {
    const newPokemonData = await getPokemonData(pokemonName);
    setCurrentPokemon(newPokemonData);
  };

  if (!currentPokemon) {
    return null;
  }

  return (
    <div
      onClick={() => setClicked(!clicked)}
      className={`pokeinfo-container ${clicked ? "clicked" : ""}`}
    >
      {!currentPokemon ? (
        ""
      ) : (
        <>
          <h1>{currentPokemon.name}</h1>
          <div className="Info">
            <img
              src={currentPokemon.sprites.front_default}
              alt=""
              className="pokimg"
            />
            <div className="group-Info">
              <div className="sub-G">
                <h2 className="head">Info</h2>
              </div>
              <div className="group-Info"></div>
              <div className="sub-sub-G">
                <div className="sub-G">
                  <h3>Weight</h3>
                  <p className="infoValue">{currentPokemon.weight / 10} kg</p>
                </div>
                <div className="sub-G">
                  <h3>Height</h3>
                  <p className="infoValue">{currentPokemon.height / 10} m</p>
                </div>
              </div>
              <div className="sub-sub-G">
                <div className="sub-G">
                  <h3>Category</h3>
                  <p className="infoValue">{currentPokemon.height}</p>
                </div>
                <div className="sub-G">
                  <h3>Abilities</h3>
                  {currentPokemon.abilities.map((pokes, index) => {
                    return (
                      <p key={index} className="infoValue">
                        {pokes.ability.name},
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="Pbar">
            <div className="heading">
              <h2>Basic Stats</h2>
            </div>
            <div className="ProgressBar">
              <div className="Basic-stats">
                {currentPokemon.stats.map((poke, index) => {
                  const value = poke.base_stat;
                  let name;
                  if (poke.stat.name === "attack") {
                    name = "ATTACK";
                  }
                  if (poke.stat.name === "hp") {
                    name = "HP";
                  }
                  if (poke.stat.name === "defense") {
                    name = "DEFENCE";
                  }
                  if (poke.stat.name === "special-attack") {
                    name = "SP-ATTACK";
                  }
                  if (poke.stat.name === "special-defense") {
                    name = "SP-DEFENSE";
                  }
                  if (poke.stat.name === "speed") {
                    name = "SPEED";
                  }

                  return (
                    <div key={index} className="stats-item">
                      <div className="stats-info">
                        <div className="itemdata">
                          <p className="data">{name}</p>
                        </div>
                        <p className="value">{value}</p>
                      </div>
                      <div className="progress-line" data-percent="90%">
                        <span
                          style={{ width: `${(value / 225) * 90}%` }}
                        ></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="Evolution">
            <div className="EvolHead">
              <h2>Evolution</h2>
            </div>
            <div className="version">
              <div className="generation">
                {evolutionChain.map((pokemon, index) => (
                  <div
                    key={index}
                    className="pokemon"
                    onClick={() => handleEvolutionClick(pokemon.name)}
                  >
                    <p>{pokemon.name}</p>
                    <img src={pokemon.imageUrl} alt={pokemon.name} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Pokeinfo;

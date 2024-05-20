// import React from "react";
import React, { useEffect, useState } from 'react';

const Pokeinfo = ({ data }) =>{
  let name;
  const [evolutionChain, setEvolutionChain] = useState([]);

  const getPokemonData = async (pokemonId) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
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
    } while (currentEvolution && currentEvolution.hasOwnProperty('evolves_to'));

    const evolutionImages = await Promise.all(
      evolutionDetails.map(async (evolution) => {
        const pokemonData = await getPokemonData(evolution.spriteUrl.split('/').slice(-2, -1)[0]);
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

  if (!data) {
    return null;
  }
  

  return (
    <>
      {!data ? (
        ""
      ) : (
        <>
          <h1>{data.name}</h1>
          <div className="Info">
            {" "}
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${data.id}.svg`}
              alt=""
              className="pokimg"
            />

            
            <div className="group-Info">
                  <div className="sub-G">
                    
                    <h2 className="head">Info</h2>
                  </div>
                  <div className="group-Info">
                     
                  </div>
                <div className="sub-sub-G">
              <div className="sub-G">
              <h3>Weight</h3>
              <p  className="infoValue">{data.weight}</p>
              </div>
              <div className="sub-G">
              <h3>Height</h3> 
              <p className="infoValue">{data.base_experience}</p>
              </div>
                </div>
                <div className="sub-sub-G">
                
              <div className="sub-G">
              <h3>Category</h3>
              <p className="infoValue">{data.height}</p>
              </div>
              <div className="sub-G">
                <h3>Abilities</h3>
                {
                  data.abilities.map(pokes=>{
                    return(
                      <>
    
                     <p className="infoValue">{pokes.ability.name},</p>
                      </>
                    )
                  })
                }
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
                    {
                      data.stats.map(poke =>{
                        const value   = poke.base_stat;
                        if(poke.stat.name === "attack"){
                          name = "ATTACK";
                        }
                        if(poke.stat.name==="hp"){
                          name ="HP";
                        }
                        if(poke.stat.name==="defense"){
                          name = "DEFENCE";
                        }
                        if(poke.stat.name ==="special-attack"){
                          name ="SP-ATTACK";
                        }
                        if(poke.stat.name ==="special-defense"){
                          name= "SP-DEFENSE"
                        }
                        if(poke.stat.name==="speed"){
                          name ="SPEED";
                        }
                        
                        return(
                          <>
                         
                       <div className="stats-item">
                       <div className="stats-info">
                       <div className="itemdata">
                       <p className="data">{name}</p>
                      </div>
                       <p className="value">{value}</p>
                      </div>
                      <div className="progress-line" data-percent =  "90%">
                      <span style={{width : value }}></span>  
                     
                        
                      </div>
                     </div>
                   </>
                      )
                      })
                    }
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
              <div key={index} className="pokemon">
                <p>{pokemon.name}</p>
                <img src={pokemon.imageUrl} alt={pokemon.name} />
              </div>
            ))}
                    
                    </div>
                    
                  </div>
                  
                </div>
        </>
      )}
    </>
  );
};

export default Pokeinfo;


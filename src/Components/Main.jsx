
import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Card";
import Pokeinfo from "./Pokeinfo";


const Main = () => {
  const [pokeData, setPokeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon/");
  const [nextUrl, setNextUrl] = useState();
  const [prevUrl, setPrevUrl] = useState();
  const [pokeDex, setPokeDex] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  
  
  
  
  
  const pokeFun = async () => {
    setLoading(true);
    const res = await axios.get(url);
    setNextUrl(res.data.next);
    setPrevUrl(res.data.previous);
    getPokemon(res.data.results);
    setLoading(false);
  };
  
  const getPokemon = async (res) => {
    const promises = res.map(async (item) => {
      const result = await axios.get(item.url);
      return result.data;
    });
    const results = await Promise.all(promises);
    setPokeData(results.sort((a, b) => (a.id > b.id ? 1 : -1)));
  };
  
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery) {
      setLoading(true);
      try {
        const result = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchQuery.toLowerCase()}`);
        setPokeData([result.data]);
      } catch (error) {
        console.error("No Pokémon found!");
        setPokeData([]);
      }
      setLoading(false);
    } else {
      pokeFun(); // If search query is empty, reload the initial list
    }
  };
  
  useEffect(() => {
    pokeFun();
  }, [url]);

  return (
    <>
    <div className="BigContainer">
          <div className="search">

          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search Pokémon....."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
          </div>
          </div>
      <div className="container">
        <div className="left-content">
          <Card pokemon={pokeData} loading={loading} infoPokemon={(poke) => setPokeDex(poke)} />

          <div className="btn-group">
            {nextUrl && (
              <button
                onClick={() => {
                  setPokeData([]);
                  setUrl(nextUrl);
                }}
              >
                Next
              </button>
            )}
          </div>
          <div className="btn1-group">
            {prevUrl && (
              <button
                onClick={() => {
                  setPokeData([]);
                  setUrl(prevUrl);
                }}
              >
                Previous
              </button>
            )}
          </div>
        </div>
        <div className="right-content">
          <Pokeinfo data={pokeDex} />
        </div>
      </div>
     
    </>
  );
};

export default Main;





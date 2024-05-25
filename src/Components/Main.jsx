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
  const [searched, setSearched] = useState(false);

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
      setSearched(true); // Set search active
      try {
        const result = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${searchQuery.toLowerCase()}`
        );
        setPokeData([result.data]);
      } catch (error) {
        console.error("No Pokémon found!");
        setPokeData([]);
      }
      setLoading(false);
    } else {
      setSearched(false);
      pokeFun();
    }
  };

  useEffect(() => {
    pokeFun();
  }, [url]);

  return (
    <>
      {/* Search bar*/}
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
        {/* Individual Pokemon data*/}
        <div className="left-content">
          <Card
            pokemon={pokeData}
            loading={loading}
            infoPokemon={(poke) => setPokeDex(poke)}
          />
        </div>

        {/* The upper buttons */}
        {!searched && (
          <div className="btn-group">
            {prevUrl && (
              <button
                onClick={() => {
                  setPokeData([]);
                  setUrl(prevUrl);
                }}
                disabled={loading}
              >
                Previous
              </button>
            )}
            {nextUrl && (
              <button
                onClick={() => {
                  setPokeData([]);
                  setUrl(nextUrl);
                }}
                disabled={loading}
              >
                Next
              </button>
            )}
          </div>
        )}

        {/* Pokemon tabloids */}
        <div className="right-content">
          <Pokeinfo data={pokeDex} />
        </div>
      </div>
    </>
  );
};

export default Main;

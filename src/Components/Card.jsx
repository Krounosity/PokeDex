import React from "react";
const Card = ({ pokemon, loading, infoPokemon }) => {
  // console.log({pokemon , loading});
  return (
    <>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        pokemon.map((item) => {
          return (
            <>
              <div
                className="card"
                key={item.id}
                onClick={() => infoPokemon(item)}
              >
                <h2 className="num">{item.id}</h2>
                <h2 className="charimg ">{item.name}</h2>
                <img src={item.sprites.front_default} alt="" />
              </div>
            </>
          );
        })
      )}
    </>
  );
};
export default Card;

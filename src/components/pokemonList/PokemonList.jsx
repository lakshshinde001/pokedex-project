import { useState, useEffect } from "react";
import  axios  from "axios";
import './pokemonList.css'
import Pokemon from '../pokemon/Pokemon'
function PokemonList(){
    const [pokemonList, setPokemonList] = useState([]);
    const [isLoading, setisLoading] = useState(true);

    const POKEDEX_URL = 'https://pokeapi.co/api/v2/pokemon';

    async function downloadPokemons(){
        const response = await axios.get(POKEDEX_URL);      //this download list of pokemon 
        const pokemonResult = response.data.results;       //we get the array of pokemons from results 
         
        console.log(response.data);

        // iterating over the array of pokemons, and using their url, to create an array of promises  that will download those 20 pokemons 
        const pokemonResultsPromise = pokemonResult.map((pokemon) => axios.get(pokemon.url));

        // passing that promises array to axios.all
        const pokemonData = await axios.all(pokemonResultsPromise);  // array of 20 pokemons detailed data 

        console.log(pokemonData);

        // now iterating over the data of each pokemons, and extracting id, name and image 

        const pokelistResults = pokemonData.map((pokeData) => {
            const pokemon = pokeData.data;
            return {
                id : pokemon.id,
                name : pokemon.name,
                image : (pokemon.sprites.other) ? pokemon.sprites.other.dream_world.front_default : pokemon.sprites.front_shiny,
                types : pokemon.types
            }
        });
        console.log(pokelistResults);
        setPokemonList(pokelistResults);
        setisLoading(false);
    }

    useEffect( ()=>{
        downloadPokemons(); 
    },[]); 
    
    return(
        <div className="pokemon-list-wrapper">
            <div> Pokemon List</div> 
                {(isLoading) ? "loading...." : 
                    pokemonList.map((p) => 
                        <Pokemon name = {p.name} image = {p.image} key = {p.id}/>
                    )
                    
                }
        </div>
    )

}
export default PokemonList;
const express = require('express');
const axios = require('axios');


const app = express();
const port = process.env.PORT || 3000;
const pokemonURL = 'https://pokeapi.co/api/v2';
const count = 0;


app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));


// Fetch all Pokémon from the API
const fetchPokemon = async () => {
    const pokemon = await axios.get(`${pokemonURL}/pokemon?limit=1025`);

    const promises = pokemon.data.results.map(async (pokemon) => {
        const pokemonDetail = await axios.get(pokemon.url);
        return {
            name: pokemon.name,
            sprite: pokemonDetail.data.sprites.front_default,
            types: pokemonDetail.data.types.map(typeInfo => typeInfo.type.name)
        };
    });
    const pokemonDetailList = await Promise.all(promises);

    const type = await axios.get(`${pokemonURL}/type`);
    return {
        pokemons: pokemonDetailList,
        types: type.data.results,   
    };
};


app.get('/', async (req, res) => {
    const {pokemons, types} = await fetchPokemon();
    const page = parseInt(req.query.page) || 1;
    let limit = 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const fetched = pokemons.slice(startIndex, endIndex);
    const max = pokemons.length;
    if (limit > max) {
        limit = max;
    }

    res.render('index', {pokemons: fetched, types, page, totalPages: Math.ceil(pokemons.length / limit), limit, max, selectedTypes: []});
});


app.get('/filter', async (req, res) => {
    const {pokemons, types} = await fetchPokemon();
    const selectedTypes = req.query.type ? [].concat(req.query.type) : [];
    const page = parseInt(req.query.page) || 1;
    let limit = 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const filteredPokemons = selectedTypes.length > 0 
        ? pokemons.filter(pokemon => selectedTypes.every(type => pokemon.types.includes(type)))
        : pokemons;
    const filtered = filteredPokemons.slice(startIndex, endIndex);
    const max = filteredPokemons.length;
    if (limit > max) {
        limit = max;
    }

    res.render('index', {pokemons: filtered, types, page, totalPages: Math.ceil(filteredPokemons.length / limit), limit, max, selectedTypes});
});


app.get('/:name', async (req, res) => {
    const pokemonName = req.params.name;
    const detail = await axios.get(`${pokemonURL}/pokemon/${pokemonName}`);
    res.render('pokeDetail', {pokemon: detail.data});
});


app.listen(port, () => {
    console.log("Listening on port "+ port);
});
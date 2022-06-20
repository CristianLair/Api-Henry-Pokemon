const axios = require('axios');
const db = require('../db.js');

const { Pokemon, Type } = require('../db.js')

const pokemonApi = async () => {
  try {
      let arrPokemon = []; // me creo un array donde pushear data pokemon
      let pokemon = await axios.get("https://pokeapi.co/api/v2/pokemon"); // me guardo los primero 20
      let dataPokemon = pokemon.data.results.map(el => axios.get(el.url)); // accedo al url de cada pokemon
      let otrosPokemon = await axios.get(pokemon.data.next) // me guardo los otros 20 para el total de 40 (readme)
      let dataOtros = otrosPokemon.data.results.map(el => axios.get(el.url)) // accedo al url de cada pokemon
      let allPokemon = dataPokemon.concat(dataOtros) // concateno ambas info para tenerlos juntos
      let result = await Promise.all(allPokemon).then(el => { 
          el.map(p => { // mapeo para solo traer la info que me interesa
              arrPokemon.push({ // pusheo la data al array creado
                  id: p.data.id,
                  name: p.data.name,
                  hp: p.data.stats[0].base_stat,
                  attack: p.data.stats[1].base_stat,
                  defense: p.data.stats[2].base_stat,
                  speed: p.data.stats[5].base_stat,
                  height: p.data.height,
                  weight: p.data.weight,
                  types: p.data.types.map(el => el.type),
                  image: p.data.sprites.front_default,
                  createdInDb : false
              })
          })
          return arrPokemon;
      })
      //console.log('RESULT: ', result);   
      return result;
  } catch(e) {
      console.log(e)
  }  
}

// traigo los pokemons de la db
const getDbInfo = async () => {
  try {
  return await Pokemon.findAll({
      attributes: ['id', 'name', 'height', 'weight', 'hp', 'attack', 'defense', 'speed', 'image', 'createdInDb'],
      include: {
          model: Type,
          attributes: ['name'],
          through: {
              attributes: []
          }
      }
  })
} catch(e) {
  console.log(e)
}  
}

// concateno los pokemons de la api y los de la db
const getAllInfo = async () => {
  try {
      const apiInfo = await pokemonApi();
      const dbInfo = await getDbInfo();
      const infoTotal = apiInfo.concat(dbInfo)
      //console.log('INFO TOTAL: ', infoTotal)
      return infoTotal;
  } catch(e) {
          console.log(e)
      }  
}

module.exports = {
  getDbInfo,
  getAllInfo,
}


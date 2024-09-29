require('dotenv').config();
const axios = require('axios');
const readline = require('readline');

const chaveApi = process.env.API_KEY;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const obterCoordenadas = async (cidade) => {
  try {
    const resposta = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        q: cidade,
        appid: chaveApi,
        lang: 'pt_br'
      }
    });

    const dados = resposta.data;
    console.log(`As coordenadas de ${dados.name} são:`);
    console.log(`Latitude: ${dados.coord.lat}`);
    console.log(`Longitude: ${dados.coord.lon}`);

    // Chamar a função para obter as condições atuais
    obterCondicoesAtuais(dados.coord.lat, dados.coord.lon);

  } catch (erro) {
    console.error('Erro ao buscar os dados climáticos:', erro.message);
  }
};

const obterCondicoesAtuais = async (lat, lon) => {
  try {
    const resposta = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        lat: lat,
        lon: lon,
        appid: chaveApi,
        lang: 'pt_br',
        units: 'metric' // Serve para puxar a temperatura em graus Celsius
      }
    });

    const dados = resposta.data;
    console.log(`Sensação térmica: ${dados.main.feels_like}ºC`);
    console.log(`Descrição: ${dados.weather[0].description}`);
  } catch (erro) {
    console.error('Erro ao buscar as condições climáticas atuais:', erro.message);
  }
};

rl.question('Digite o nome de uma cidade: ', (cidade) => {
  obterCoordenadas(cidade);
  rl.close();
});
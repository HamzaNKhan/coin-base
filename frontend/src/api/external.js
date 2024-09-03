import axios from "axios";

const NEWS_API_KEY = process.env.NEWS_API_KEY
const NEWS_API_ENDPOINT = `https://newsapi.org/v2/everything?q=crypto&sortBy=publishedAt&language=en&apiKey=8398b8619e424a3fafff8b3577b29d51`;
// const NEWS_API_ENDPOINT = `https://newsapi.org/v2/everything?q=business AND blockchain&sortBy=publishedAt&&language=en&apiKey=${NEWS_API_KEY}`;

// const NEWS_API_ENDPOINT = "https://saurav.tech/NewsAPI/top-headlines/category/business/us.json";

const CRYPTO_API_ENDPOINT = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=en`;

export const getNews = async() => {
    let response;

    console.log(NEWS_API_ENDPOINT);

    try {
        response = await axios.get(NEWS_API_ENDPOINT);   
        response = response.data.articles.slice(0,15);
        
    } catch (error) {
        return error;
    }

    return response;
}

export const getCrypto = async()=>{
    let response;

    try {
        response = await axios.get(CRYPTO_API_ENDPOINT)

        response = response.data;

        
    } catch (error) {
        return error;
        
    }
    return response;
}
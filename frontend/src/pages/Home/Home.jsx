import { useState, useEffect } from "react";
import { getNews } from "../../api/external";
import styles from './Home.module.css';
import Loader from "../../components/Loader/Loader";

function Home(){
    const [articles, setArticles] = useState([]);

    useEffect(()=>{
// An IIFE, which stands for Immediately Invoked Function Expression, is a JavaScript function that is defined and executed immediately after its creation. 
        (async function newsApiCall(){
            const response = await getNews();
            setArticles(response);

            // console.log(response);
        })();

        //cleanup function

        setArticles([]);

        //[] means useEffect will be called once the page is rendered
    }, []);

    const handleCardClick = (url) => {
        window.open(url, "_blank");
      };

      if (articles.length==0){
        return <Loader text="homepage"/>
      }

    else return(
        <>
            <div className={styles.header}>Latest Articles</div>
            <div className={styles.grid}>
                {articles.map((article)=>(
                    <div className={styles.card} key={article.url}
                    onClick={() => handleCardClick(article.url)}>
                        <img src={article.urlToImage}/>
                        <h3>{article.title}</h3>

                    </div>
                ))}
            </div>
        </>
    )
}

export default Home;
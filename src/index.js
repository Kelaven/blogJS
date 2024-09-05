import "./assets/scripts/topbar.js";
import "./assets/styles/styles.scss";
import "./index.scss";


const articleContainerElement = document.querySelector(".articles-container");

const createArticles = (articles) => {
    const articlesDOM = articles.map(article => {
        const articleDOM = document.createElement('div');
        articleDOM.classList.add("article");
        articleDOM.innerHTML = `
<img src="${article.img}" alt="profile-img">
<h2>${article.title}</h2>
<p class="article-author">${article.author} - ${article.category}</p>
<p class="article-content">${article.content}</p>
<div class="article-actions">
  <button class="btn btn-danger" data-id=${article.id}>Supprimer</button>
</div>`
        return articleDOM
    });
    articleContainerElement.innerHTML = '';
    articleContainerElement.append(...articlesDOM);
};

// Récupérer la liste de nos articles : 
const fetchArticles = async () => {
    try {
        const response = await fetch("https://restapi.fr/api/articles");
        const articles = await response.json();
        console.log(articles);

        // transformer le json en élément du DOM :
        createArticles(articles);
    } catch (e) {
        console.log(('e : ', e));
    }

};
fetchArticles();
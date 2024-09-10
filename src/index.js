import "./assets/scripts/topbar.js";
import "./assets/styles/styles.scss";
import "./index.scss";

const articleContainerElement = document.querySelector(".articles-container");



const createArticles = (articles) => {
    const articlesDOM = articles.map((article) => {
        const articleDOM = document.createElement('div');
        articleDOM.classList.add("article");
        articleDOM.innerHTML = `
<img src="${article.img}" alt="profile-img">
<h2>${article.title}</h2>
<p class="article-author">${article.author} - ${(new Date(article.createdAt)).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })}</p>
<p class="article-content">${article.content}</p>
<div class="article-actions">
  <button class="btn btn-danger" data-id=${article._id}>Supprimer</button>
  <button class="btn btn-primary" data-id=${article._id}>Modifier</button>
</div>`
        return articleDOM;
    });
    if (articleContainerElement) {
        articleContainerElement.innerHTML = '';
        articleContainerElement.append(...articlesDOM);
        const deleteButtons = articleContainerElement.querySelectorAll('.btn-danger');
        const editButtons = articleContainerElement.querySelectorAll('.btn-primary');

        editButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                const target = e.target;
                const articleID = target.dataset.id;
                location.assign(`/form/form.html?id=${articleID}`); // rediriger vers le form, pour la modification, avec l'id dans l'url
            })
        });

        deleteButtons.forEach(button => {
            button.addEventListener("click", async event => {
                try {
                    const target = event.target;
                    const articleID = target.dataset.id;
                    const response = await fetch(`https://restapi.fr/api/articles/${articleID}`, {
                        method: "DELETE"
                    });
                    const body = await response.json();
                    // quand on supprime un article, on relance l'affichage de la liste des articles mis à jour :
                    fetchArticles();
                } catch (error) {
                    console.log('e : ', error);
                }
            })
        })
    }
};

// Récupérer la liste de nos articles : 
const fetchArticles = async () => {
    try {
        const response = await fetch("https://restapi.fr/api/articles");
        let articles = await response.json();
        // Restapi retourne un objet s'il n'y a qu'un seul article, nous devons donc le transformer en tableau :
        if (!Array.isArray(articles)) {
            articles = [articles];
        }
        // transformer le json en élément du DOM :
        createArticles(articles);
    } catch (e) {
        console.log(('e : ', e));
    }

};
fetchArticles();
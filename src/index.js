import "./assets/scripts/topbar.js";
import "./assets/styles/styles.scss";
import "./index.scss";

const articleContainerElement = document.querySelector(".articles-container");
const categoriesContainerElement = document.querySelector(".categories");


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


const createMenuCategories = (articles) => { // reduce permet de parcourir un tableau (dans ce cas, un tableau d’articles) et de réduire ce tableau à une seule valeur, qui dans cet exemple est un objet où chaque clé est une catégorie et chaque valeur est le nombre d’articles dans cette catégorie.
    const categories = articles.reduce((acc, article) => { // à chaque itération on utilise article
        // on défini le nom de la clé avec [article.category] :
        if (acc[article.category]) { // si il y a une valeur autre que 0 à l'intérieur, on incrémente la valeur
            acc[article.category]++;
        } else {
            acc[article.category] = 1;
        }
        return acc; // NB : il faut tjs retourner l'acc
    }, {}) // l'acc est un objet vide


    // Maintenant à partir de notre objet on va créer un tableau : 
    // // const categoriesArr = Object.keys(categories);
    // Après on fait un map (on itère sur tous les éléments du tableau et on peut retourner une nouvelle valeur pour cette itération ) :
    const categoriesArr = Object.keys(categories).map((category) => { // on veut retourner un nouveau tableau mais avec 2 valeurs : les noms des catégories (comme on les a déjà dans categoriesArr) mais aussi le nombre d'articles de cette catégorie (que l'on a perdu quand on est passé de l'objet au tableau) :
        return [category, categories[category]]; // je reprends category qui fonctionnait déjà et j'y ajoute categories[category] où categories est l'objet créé précédement 
    })

    displayMenuCategories(categoriesArr);
    console.log(categoriesArr);
}

// Maintenant on peut utiliser categoriesArr pour afficher dynamiquement nos catégories : 
const displayMenuCategories = (categoriesArr) => {
    const liElements = categoriesArr.map(categoriesElem => {
        const li = document.createElement('li');
        li.innerHTML = `<li>${categoriesElem[0]} ( <b>${categoriesElem[1]}</b> )</li>`;
        return li;
    })

    categoriesContainerElement.innerHTML = ''; // on le réinitialise
    categoriesContainerElement.append(...liElements); // on affiche le contenu dynamique. Le spread operator décompose le tableau pour insérer chaque élément du tableau liElements individuellement dans le DOM. 
    console.log(liElements);
}

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
        // créer le menu catégories : 
        createMenuCategories(articles);
    } catch (e) {
        console.log(('e : ', e));
    }

};
fetchArticles();




// ! NB : 

// * Le spread operator (...) est un opérateur JavaScript qui permet de “décomposer” un tableau ou un objet itérable en éléments séparés. Par exemple, si tu as un tableau [1, 2, 3] et que tu utilises ..., cela devient 1, 2, 3.
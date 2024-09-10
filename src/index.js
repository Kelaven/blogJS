import "./assets/scripts/topbar.js";
import "./assets/styles/styles.scss";
import "./index.scss";

const articleContainerElement = document.querySelector(".articles-container");
const categoriesContainerElement = document.querySelector(".categories");
let filter;
let articles; // on manipule une variable appelée articles, qui contient la liste des articles récupérés depuis l'API (grâce à 'articles = await response.json();"'). Cette variable est initialisée globalement, en dehors des fonctions. Cela signifie que toutes les fonctions dans le script ont accès à cette variable, sans avoir besoin de la passer comme paramètre à chaque fois. Les fonctions comme createMenuCategories() peuvent donc l’utiliser directement sans avoir à la leur passer.

const createArticles = () => {
    const articlesDOM = articles.filter((article) => {
        if (filter) { // s'il y a un filtre. Cette fonction est utilisée pour pouvoir filtrer les articles au click sur leur catégorie correspondante
            return article.category === filter;
        } else {
            return true;
        }
    }).map((article) => {
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


const createMenuCategories = () => { // reduce permet de parcourir un tableau (dans ce cas, un tableau d’articles) et de réduire ce tableau à une seule valeur, qui dans cet exemple est un objet où chaque clé est une catégorie et chaque valeur est le nombre d’articles dans cette catégorie.
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
    }).sort((c1, c2) => c1[0].localeCompare(c2[0]));

    displayMenuCategories(categoriesArr);
    console.log(categoriesArr);
}

// Maintenant on peut utiliser categoriesArr pour afficher dynamiquement nos catégories : 
const displayMenuCategories = (categoriesArr) => {
    const liElements = categoriesArr.map(categoriesElem => {
        const li = document.createElement('li');
        li.addEventListener("click", () => { // filtrer au click
            // ajouter une classe pour que l'élément reste en vert :
            if (filter === categoriesElem[0]) {
                filter = null;
                li.classList.remove("active");
                createArticles();
            } else {
                filter = categoriesElem[0];
                liElements.forEach(liEl => {
                    liEl.classList.remove("active");
                })
                li.classList.add("active");
                createArticles();
            }

        })
        li.innerHTML = `${categoriesElem[0]} ( <b>${categoriesElem[1]}</b> )`;
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
        articles = await response.json();
        // Restapi retourne un objet s'il n'y a qu'un seul article, nous devons donc le transformer en tableau :
        if (!Array.isArray(articles)) {
            articles = [articles];
        }
        // transformer le json en élément du DOM :
        createArticles();
        // créer le menu catégories : 
        createMenuCategories();
    } catch (e) {
        console.log(('e : ', e));
    }

};
fetchArticles();




// ! NB : 

// * Le spread operator (...) est un opérateur JavaScript qui permet de “décomposer” un tableau ou un objet itérable en éléments séparés. Par exemple, si tu as un tableau [1, 2, 3] et que tu utilises ..., cela devient 1, 2, 3.
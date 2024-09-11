import { openModal } from "./assets/scripts/modal.js";
import "./assets/styles/styles.scss";
import "./index.scss";

const articleContainerElement = document.querySelector(".articles-container");
const categoriesContainerElement = document.querySelector(".categories");
const selectElement = document.querySelector("select");
let filter;
let articles; // on manipule une variable appelée articles, qui contient la liste des articles récupérés depuis l'API (grâce à 'articles = await response.json();"'). Cette variable est initialisée globalement, en dehors des fonctions. Cela signifie que toutes les fonctions dans le script ont accès à cette variable, sans avoir besoin de la passer comme paramètre à chaque fois. Les fonctions comme createMenuCategories() peuvent donc l’utiliser directement sans avoir à la leur passer.
let sortBy = 'desc';


selectElement.addEventListener("change", (event) => { // pour le tri par dates
    sortBy = selectElement.value;
    fetchArticles();
})


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
                openModal(`Êtes-vous sûr de vouloir supprimer votre article ?`)
                // if (result === true) {
                //     try {
                //         const target = event.target;
                //         const articleID = target.dataset.id;
                //         const response = await fetch(`https://restapi.fr/api/articles/${articleID}`, {
                //             method: "DELETE"
                //         });
                //         const body = await response.json();
                //         // quand on supprime un article, on relance l'affichage de la liste des articles mis à jour :
                //         fetchArticles();
                //     } catch (error) {
                //         console.log('e : ', error);
                //     }
                // }
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
    }).sort((c1, c2) => c1[0].localeCompare(c2[0])); // trier les catégories par ordre

    displayMenuCategories(categoriesArr);
    console.log(categoriesArr);
}

// Maintenant on peut utiliser categoriesArr pour afficher dynamiquement nos catégories : 
const displayMenuCategories = (categoriesArr) => {
    const liElements = categoriesArr.map(categoriesElem => {
        const li = document.createElement('li');
        li.innerHTML = `${categoriesElem[0]} ( <b>${categoriesElem[1]}</b> )`;
        if (categoriesElem[0] === filter) { // pour garder la catégorie active quand on est dessus et qu'on trie
            li.classList.add("active");
        }
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
        return li;
    })

    categoriesContainerElement.innerHTML = ''; // on le réinitialise
    categoriesContainerElement.append(...liElements); // on affiche le contenu dynamique. Le spread operator décompose le tableau pour insérer chaque élément du tableau liElements individuellement dans le DOM. 
    console.log(liElements);
}

// Récupérer la liste de nos articles : 
const fetchArticles = async () => {
    try {
        // const response = await fetch("https://restapi.fr/api/articles");
        const response = await fetch(`https://restapi.fr/api/articles?sort=createdAt:${sortBy}`); // pour trier par dates, la règle "GET api/posts?sort=createdAt:-1" étant donnée par l'API
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


// * Il est important d’inclure une promesse avec await dans certaines fonctions, en particulier celles qui effectuent des opérations asynchrones, comme des requêtes réseau ou des actions qui prennent du temps, pour plusieurs raisons :

    // * 1. Gestion des opérations asynchrones :
     // * Quand tu fais une requête réseau (par exemple, une requête pour supprimer un article avec fetch), tu ne sais pas combien de temps cela prendra avant que le serveur réponde. Cette opération est asynchrone, ce qui signifie qu’elle se produit en arrière-plan pendant que le reste de ton code continue à s’exécuter.
     // * Si tu n’utilises pas await, ton programme ne “patientera” pas pour obtenir la réponse de cette requête avant de continuer. Cela pourrait poser des problèmes, car tu pourrais essayer d’exécuter des actions (comme rafraîchir l’affichage des articles) avant même d’avoir reçu la confirmation que l’article a bien été supprimé.

     // * 2. Rendre le code plus lisible et séquentiel :
     // * Le mot-clé await est utilisé dans une fonction asynchrone pour “attendre” que la promesse soit résolue (terminée avec succès ou échouée) avant de passer à l’instruction suivante. Cela rend le code plus lisible et plus facile à comprendre, car il ressemble davantage à du code synchrone, qui s’exécute ligne par ligne.

    // * 3. Éviter les erreurs liées à des actions incomplètes :
    // * Si tu n’attends pas que l’opération asynchrone soit terminée, il se peut que le code s’exécute dans un ordre inattendu. Par exemple, si tu essaies de rafraîchir la liste des articles juste après avoir envoyé la requête de suppression sans utiliser await, l’article supprimé pourrait encore apparaître dans la liste, car la suppression n’a pas encore eu lieu côté serveur.

    // * 4. Gérer les erreurs correctement :
    // * Lorsque tu utilises await, tu peux gérer les erreurs de manière plus propre avec un bloc try/catch. Cela te permet d’attraper et de gérer des erreurs comme une requête qui échoue, un serveur non disponible, etc., et d’afficher des messages d’erreur pertinents à l’utilisateur.

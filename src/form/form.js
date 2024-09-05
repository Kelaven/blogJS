import "../assets/scripts/topbar.js";
import "./form.scss";
import "../assets/styles/styles.scss";

const form = document.querySelector("form");
const errorElement = document.getElementById("errors");
let errors = [];

form.addEventListener("submit", async event => {
    event.preventDefault();

    // formdata pour récupérer tous les input et textarea plutôt que que tout sélectionner à la main : 
    const formData = new FormData(form);
    const entries = formData.entries(); // retourne un iterateur permettant d'accéder aux paires clefs/valeurs contenues dans cet objet


    const article = Array.from(entries).reduce((acc, value) => {
        acc[value[0]] = value[1];
        return acc;
    }, {}); // Array.from permet de créer une nouvelle instance d'Array (une copie superficielle) à partir d'un objet itérable. On va utiliser reduce pour transformer le tableau obtenu en objet Javascript (et ainsi pouvoir partager les données). Voir plus en bas. 
    // ? NB : on peut optimiser et obtenir exactement le même résultat avec const article = Object.fromEntries(entries);

    // Vérifier si notre contenu n'a pas d'erreur avant de l'envoyer au serveur : 
    if (formIsValid(article)) {

        try {
            // Maintenant que l'on a notre objet qui contient nos data, on peut facilement le transformer en JSON : 
            const json = JSON.stringify(article); // stringify pour convertir un objet JS en json, parse pour l'inverse

            // Maintenant on est prêt à envoyer notre donnée au serveur:
            const response = await fetch('https://restapi.fr/api/articles', {
                method: "POST",
                body: json, // les données
                headers: { // format sur lequel on va envoyer l'information
                    'Content-Type': "application/json"
                }
            });
            const body = await response.json()
            console.log(body);
        } catch (error) {
            console.error('e : ', e);
        }


    }





})


const formIsValid = (article) => {
    // Réinitialiser le tableau d'erreurs avant chaque validation
    errors = [];

    if (!article.author || !article.category || !article.content || !article.img || !article.title) { // si jamais un des champs n'est pas défini, on rempli le tableau d'erreurs
        errors.push('Vous devez renseigner tous les champs.');
    }

    if (errors.length) { // si la longueur de errors est supérieure à 0
        let errorHTML = '';
        errors.forEach(error => {
            errorHTML += `<li>${error}</li>`
        });
        errorElement.innerHTML = errorHTML;
        return false;
    } else {
        errorElement.innerHTML = '';
        return true;
    }
}





// ! Voir plus

// * reduce()
    // En fait, reduce() est une méthode utilisée pour “réduire” un tableau à une seule valeur, en parcourant tous les éléments du tableau et en appliquant une fonction pour les combiner.
    // Syntaxe de reduce() :
        // array.reduce((accumulateur, valeurCourante) => {
             // corps de la fonction
        // }, valeurInitiale);
    // Dans notre utilisation, acc est un objet que l'on remplit à chaque itération. value est une paire clé-valeur (comme ['author', 'Jean']). Voici ce qu'il se passe exactement :
        // •	Initialisation : L’accumulateur (acc) commence par {} (un objet vide).
	    // •	Première itération : value = ['author', 'Jean']. Tu ajoutes la clé 'author' et sa valeur 'Jean' dans l’objet : acc = {author: 'Jean'}.
	    // •	Deuxième itération : value = ['category', 'Technologie']. Tu ajoutes 'category': 'Technologie' : acc = {author: 'Jean', category: 'Technologie'}.
    // donc en écrivant acc[value[0]] = value[1], tu es en train d’ajouter une nouvelle propriété à l’objet acc, où la clé est value[0] et la valeur associée est value[1]. Par exemple :
	    // •	Si value[0] vaut 'author' et value[1] vaut 'Jean', alors tu fais : acc['author'] = 'Jean'.
	    // •	Lors de la prochaine itération, si value[0] vaut 'category' et value[1] vaut 'Technologie', alors tu fais : acc['category'] = 'Technologie'.

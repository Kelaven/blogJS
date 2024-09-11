const body = document.querySelector("body");
let calc;
let modal;
let cancel;
let confirm;

const createCalc = () => {
    calc = document.createElement('div');
    calc.classList.add("calc");
}

const createModal = question => {
    modal = document.createElement("div");
    modal.classList.add("modal");

    // Empêche le clic sur la modal elle-même de fermer la fenêtre :
    modal.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    modal.innerHTML =
        `
    <p>${question}</p>
    `;
    cancel = document.createElement("button");
    cancel.innerText = "Annuler";
    cancel.classList.add("btn", "btn-secondary");
    confirm = document.createElement("button");
    confirm.innerText = "Confirmer";
    confirm.classList.add("btn", "btn-primary");
    modal.append(cancel, confirm);
}

export function openModal(question) {
    createCalc();
    createModal(question);

    calc.append(modal);
    body.append(calc);

    return new Promise((resolve, reject) => { // voir détails en bas
        calc.addEventListener("click", () => {
            resolve(false);
            calc.remove();
        });

        cancel.addEventListener("click", () => {
            resolve(false);
            calc.remove();
        })
        confirm.addEventListener("click", () => {
            resolve(true);
            calc.remove();
        })

    });
};





// ! NB : 

// * openModal() : le cœur de l’interaction
    // * Cette fonction est très importante, car elle gère l’affichage de la modal et utilise une promesse pour obtenir une réponse de l’utilisateur (soit “confirmer”, soit “annuler”). Expliquons cela plus en détail.

// *     Pourquoi utiliser une promesse ?
    // * Une promesse en JavaScript est une manière de gérer des opérations asynchrones, c’est-à-dire des choses qui prennent du temps et qui ne se produisent pas immédiatement, comme attendre une réponse de l’utilisateur.
    // * Dans ton cas, tu veux que le programme attende la réponse de l’utilisateur (confirmer ou annuler) avant de continuer le reste du code. La promesse est parfaite pour cela, car elle “promet” de renvoyer un résultat (vrai ou faux) une fois que l’utilisateur a pris sa décision.

//*      Le fonctionnement de la promesse dans openModal() :
    // * return new Promise((resolve, reject) => {
    //  *   •	Une promesse est un objet qui va effectuer une action future. Elle a deux résultats possibles :
    //  *	•	resolve : Si l’action est un succès, la promesse est “résolue” et retourne un résultat. Ici, ça signifie que l’utilisateur a cliqué sur “Confirmer” ou “Annuler”.
    //  *	•	reject : Si l’action échoue (ce qui ne se produit pas dans ce cas), la promesse est “rejetée”.

    // * Les trois cas où la promesse est “résolue” :
        // * •	Quand on clique sur l’arrière-plan (calc) :
        // * calc.addEventListener("click", () => {
        // *     resolve(false);
        // *     calc.remove();
        // * });
        // * Si l’utilisateur clique sur l’arrière-plan (en dehors de la modal), la promesse est “résolue” avec la valeur false (car l’utilisateur n’a pas confirmé l’action), et la fenêtre modal est fermée (calc.remove()).
        // * •	Quand on clique sur “Annuler” (cancel) :
        // * cancel.addEventListener("click", () => {
        // *     resolve(false);
        // *     calc.remove();
        // * });
        // * Si l’utilisateur clique sur “Annuler”, la promesse est également résolue avec false, car l’action n’est pas confirmée, et la modal est fermée.
        // * •	Quand on clique sur “Confirmer” (confirm) :
        // * confirm.addEventListener("click", () => {
        // *     resolve(true);
        // *     calc.remove();
        // * });
        // * Si l’utilisateur clique sur “Confirmer”, la promesse est résolue avec la valeur true, car l’utilisateur a validé l’action, et la modal est fermée.


    // * Pourquoi utiliser resolve() ?
    // * Le resolve() est crucial ici, car il permet de renvoyer un résultat une fois que l’utilisateur a pris une décision. Ce résultat sera soit true (action confirmée) soit false (action annulée). La promesse permet d’attendre cette décision avant de passer à la suite du programme.

    // * Que fait la fonction une fois la promesse résolue ?
    // * Lorsque la promesse est “résolue”, le programme qui a appelé la fonction openModal() peut ensuite agir en fonction du résultat. Par exemple :
    // * openModal("Voulez-vous vraiment supprimer cet article ?")
    // * .then((result) => {
    // *     if (result) {
    // *         console.log("Action confirmée");
    // *     } else {
    // *         console.log("Action annulée");
    // *     }
    // * });
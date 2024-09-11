const body = document.querySelector("body");
let calc;
let modal;

const createCalc = () => {
    calc = document.createElement('div');
    calc.classList.add("calc");
    calc.addEventListener("click", () => {
        calc.remove();

    })
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
    const cancel = document.createElement("button");
    cancel.innerText = "Annuler";
    cancel.classList.add("btn", "btn-secondary");
    const confirm = document.createElement("button");
    confirm.innerText = "Confirmer";
    confirm.classList.add("btn", "btn-primary");
    modal.append(cancel, confirm);
}

export function openModal(question) {
    createCalc();
    createModal(question);

    calc.append(modal);
    body.append(calc);

    return;
};
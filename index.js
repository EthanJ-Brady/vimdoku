class Gameboard {
    constructor(element) {
        this.element = element;
        this.addHouses();
        this.addCells();
    }

    addHouses() {
        for (let i = 0; i < 9; i++) {
            this.element.appendChild(
                createHtmlElement(
                    `<div class="house" id="house-${i}"></div>`
                )
            );
        }
    }

    addCells() {
        for (const e of this.element.children) {
            for (let i = 0; i < 9; i++) {
                const cell = createHtmlElement(
                    `<div class="cell" id="cell-${i}"></div>`
                )
                cell.addEventListener("click", (e) => {
                    cell.classList.toggle("cell--active");
                })
                e.appendChild(cell)
            }
        }
    }
}

function createHtmlElement(elementString) {
    const div = document.createElement("div");
    div.innerHTML = elementString;
    return div.firstChild;
}

const gameboard = new Gameboard(document.getElementById("gameboard"))


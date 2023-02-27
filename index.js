function main() {
    const body = document.body;
    const gameboard = new Gameboard();
    body.appendChild(gameboard.element);
    gameboard.addActive(0,0);
    gameboard.addActive(1,5);
    gameboard.addActive(2,3);
    gameboard.addActive(3,1);
    console.log(gameboard.activeCells);
    gameboard.removeActive(0,0);
    console.log(gameboard.activeCells);


    
}

class Cell {
    constructor(id) {
        this.element = this.#creatElement()
    }

    #creatElement() {
        let cell = createHtmlElement(
            `<div class="cell"></div>`
        );
        return cell;
    }

    setActive() {
        this.element.classList.add("cell--active");
    }

    removeActive() {
        this.element.classList.remove("cell--active");
    }

    toggleActive() {
        this.element.classList.toggle("cell--active");
    }
}

class House {
    constructor(id) {
        this.cells = [];
        this.#addCells();
        this.element = this.#creatElement();
    }

    #creatElement() {
        let house = createHtmlElement(
            `<div class="house"></div>`
        );
        for (const cell of this.cells) {
            house.appendChild(cell.element)
        }
        return house;
    }

    #addCells() {
        for (let i = 0; i < 9; i++) {
            this.cells.push(new Cell())
        }
    }
}

class Gameboard {
    constructor() {
        this.houses = []
        this.#addHouses()
        this.element = this.#createElement() 
        this.activeCells = []
    }

    #createElement() {
        let gameboard = createHtmlElement(
            `<div id="gameboard"></div>`
        );
        for (const house of this.houses) {
            gameboard.appendChild(house.element)
        }
        return gameboard;
    }

    #addHouses() {
        
        for (let i = 0; i < 9; i++) {
            this.houses.push(new House())
        }
    }

    getCell(houseNumber, cellNumber) {
        return this.houses[houseNumber].cells[cellNumber]
    }

    addActive(houseNumber, cellNumber) {
        this.getCell(houseNumber, cellNumber).setActive()
        this.activeCells.push([houseNumber, cellNumber])
    }

    removeActive(houseNumber, cellNumber) {
        this.getCell(houseNumber, cellNumber).removeActive()
        for (const i in this.activeCells) {
            if (this.activeCells[i][0] == houseNumber && this.activeCells[i][1] == cellNumber) {
                this.activeCells.splice(i, 1);
                break;
            }
        }
    }

    clearActive() {
        
    }

}

function createHtmlElement(elementString) {
    const div = document.createElement("div");
    div.innerHTML = elementString;
    return div.firstChild;
}

main();

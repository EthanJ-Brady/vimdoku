function main() {
    const body = document.body;
    const gameboard = new Gameboard();
    
    body.appendChild(gameboard.element);
    const inputHandler = new InputHandler(gameboard);
}

class CellNote {
    constructor(digit) {
        this.element = this.#createElement(digit);
    }

    #createElement(digit) {
        let cellNote = createHtmlElement(
            `<div class="cell-note">${digit}</div>`
        );
        return cellNote;
    }

    add() {
        this.element.classList.add("cell-note--visible");
    }

    remove() {
        this.element.classList.remove("cell-note--visible");
    }

    toggle() {
        this.element.classList.toggle("cell-note--visible");
    }
}

class Cell {
    constructor() {
        this.element = this.#creatElement();
        this.notes = [];
        this.#initializeNotes();
        this.#setCellType("noted");
    }

    #creatElement() {
        let cell = createHtmlElement(
            `<div class="cell"></div>`
        );
        return cell;
    }
    
    #initializeNotes() {
        for (let i = 0; i < 9; i++) {
            this.notes.push(new CellNote(i + 1))
        }
    }

    #setCellType(type) {
        this.cellType = type;
        if (type == "selected") {
            this.element.classList.remove("cell--noted");
        }
        if (type == "noted") {
            this.element.classList.add("cell--noted");
            this.element.innerHTML = "";
            for (const note of this.notes) {
                this.element.appendChild(note.element);
            }
        }
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
        
    selectDigit(num) {
        this.#setCellType("selected")
        this.element.innerHTML = num;
    }

    getCellNote(num) {
        return this.notes[num - 1]
    }

    toggleNote(num) {
        if (this.cellType != "noted") {
            this.#setCellType("noted")
        }
        this.getCellNote(num).toggle();
    }

    clear() {
        console.log("cleared")
        this.element.innerHTML = "";
        for (const note of this.notes) {
            note.remove();
        }
    }
}

class House {
    constructor() {
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
        this.houses = [];
        this.#addHouses();
        this.element = this.#createElement();
        this.activeCells = [];
        this.setCursor(new HouseCellCoords(0, 0));
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

    getCell(hcCoords) {
        return this.houses[hcCoords.house].cells[hcCoords.cell]
    }

    addActive(hcCoords) {
        this.getCell(hcCoords).setActive()
        this.activeCells.push(hcCoords)
    }

    removeActive(hcCoords) {
        this.getCell(hcCoords).removeActive()
        for (const i in this.activeCells) {
            if (this.activeCells[i].house == hcCoords.house && this.activeCells[i].cell == hcCoords.cell) {
                this.activeCells.splice(i, 1);
                break;
            }
        }
    }

    clearActive() {
        const activeCellList = structuredClone(this.activeCells);
        for (const activeCell of activeCellList) {
            this.removeActive(activeCell);
        } 
    }

    getCursor() {
        return this.cursor;
    }

    setCursor(hcCoords) {
        this.cursor = hcCoords;
        this.clearActive();
        this.addActive(hcCoords);
    }

    moveCursor(horiz, vert) {
        const rowColCursor = this.cursor.toColRow();
        const rowColmoveTo = new ColRowCoords(rowColCursor.col + horiz, rowColCursor.row + vert);
        if (rowColmoveTo.isValid()) {
            this.setCursor(rowColmoveTo.toHouseCell());
        }
    }

    toggleNote(hcCoords, num) {
        this.getCell(hcCoords).toggleNote(num);
    }

    selectDigit(hcCoords, num) {
        this.getCell(hcCoords).selectDigit(num);
    }

    clearCell(hcCoords) {
        this.getCell(hcCoords).clear();
    }
}

class InputHandler {
    constructor(gameboard) {
        this.mode = "note"
        this.gameboard = gameboard;
        this.setDownKey("j");
        this.setUpKey("k");
        this.setLeftKey("h");
        this.setRightKey("l");
        this.setInsertKey("i");
        this.setNoteKey("n");
        this.setClearKey("x");
        this.bindNumbers();

    }

    bindKey(key, action) {
        document.addEventListener("keypress", (e) => {
            if (e.key == key) {
                action()  
            }
        })
    }

    bindNumbers() {
        document.addEventListener("keypress", (e) => {
            if (this.mode == "note") {
                if (parseInt(e.key) > 0) {
                    for (const cell of this.gameboard.activeCells) {
                        this.gameboard.toggleNote(cell, e.key);
                    }
                }
            }
            if (this.mode == "insert") {
                if (parseInt(e.key) > 0) {
                    this.gameboard.selectDigit(this.gameboard.getCursor(), e.key);
                }    
            }
        })
    }

    setDownKey(key) {
        this.bindKey(key, () => {
            this.gameboard.moveCursor(0, 1)
        })
    }

    setUpKey(key) {
        this.bindKey(key, () => {
            this.gameboard.moveCursor(0, -1)
        })
    }

    setLeftKey(key) {
        this.bindKey(key, () => {
            this.gameboard.moveCursor(-1, 0)
        })
    }

    setRightKey(key) {
        this.bindKey(key, () => {
            this.gameboard.moveCursor(1, 0)
        })
    }

    setInsertKey(key) {
        this.bindKey(key, () => {
            this.mode = "insert";
        })
    }

    setNoteKey(key) {
        this.bindKey(key, () => {
            this.mode = "note";
        })
    }

    setClearKey(key) {
        this.bindKey(key, () => {
            for (const cell of this.gameboard.activeCells) {
                this.gameboard.clearCell(cell);
            }
        })
    }
}

class ColRowCoords {
    constructor(col, row) {
        this.col = col;
        this.row = row;
    }

    toHouseCell() {
        const houseRow = Math.floor(this.row / 3);
        const cellRow = this.row % 3;

        const houseCol = Math.floor(this.col / 3);
        const cellCol = this.col % 3;

        const house = houseRow * 3 + houseCol;
        const cell = cellRow * 3 + cellCol;

        return new HouseCellCoords(house, cell); 
    }

    isValid() {
        if (!Number.isInteger(this.col) || !Number.isInteger(this.row)) {
            return false;
        }
        else if (this.col > 8 || this.col < 0) {
            return false;
        }
        else if (this.row > 8 || this.row < 0) {
            return false;
        }
        else {
            return true;
        }
    }
}

class HouseCellCoords {
    constructor(house, cell) {
        this.house = house;
        this.cell = cell;
    }

    toColRow() {
        const cell_row = Math.floor(this.cell / 3);
        const cell_col = this.cell % 3;

        const house_row = Math.floor(this.house / 3);
        const house_col = this.house % 3;

        const row = house_row * 3 + cell_row;
        const col = house_col * 3 + cell_col;

        return new ColRowCoords(col, row)
    }

    isValid() {
        if (!Number.isInteger(this.house) || !Number.isInteger(this.cell)) {
            return false;
        }
        else if (this.house > 8 || this.house < 0) {
            return false;
        }
        else if (this.cell > 8 || this.cell < 0) {
            return false;
        }
        else {
            return true;
        } 
    }
}

function createHtmlElement(elementString) {
    const div = document.createElement("div");
    div.innerHTML = elementString;
    return div.firstChild;
}

main();


const btn = document.getElementById("btn")
const reset = document.getElementById("reset")

// document.documentElement.style.setProperty("--grid-row-num", 50)
let ROW_NUM = getComputedStyle(document.documentElement).getPropertyValue("--grid-row-num")
let COL_NUM = getComputedStyle(document.documentElement).getPropertyValue("--grid-col-num")

const generation = document.getElementById("generation")
const life = document.getElementById("life")
life.textContent = 0;
generation.textContent = 0;

let MAP; // new Array(ROW_NUM)


function initMap() {
    MAP = new Array(ROW_NUM);
    for (let i = 0; i < ROW_NUM; i++) {
        MAP[i] = []
    }
}


const container = document.getElementById("grid-container")
createGrid()
initMap()

window.addEventListener("resize", e => {
    let row = getComputedStyle(document.documentElement).getPropertyValue("--grid-row-num")
    let col = getComputedStyle(document.documentElement).getPropertyValue("--grid-col-num")

    if (col !== COL_NUM || row !== ROW_NUM) {
        ROW_NUM = row
        COL_NUM = col
        createGrid()
        initMap()
    }

})
const grids = document.querySelectorAll(".grid")

let start = false
let time;

let cancelFlag = false


if (!("ontouchstart" in document.documentElement)) {
    container.addEventListener("click", e => {

        e.stopPropagation()
        if (!start && e.target.matches(".grid")) {
            if (generation.textContent > 0) {
                generation.textContent = 0
            }
            e.target.classList.toggle("exist")
            updateLife()
        }
    })
}
else {

    container.addEventListener("touchstart", e => {

        if (e.touches.length > 1)
            cancelFlag = true
    })

    container.addEventListener("touchmove", e => {
        if (!cancelFlag)
            cancelFlag = true
    })

    container.addEventListener("touchend", e => {

        if (!start && e.target.matches(".grid")) {
            if (!cancelFlag) {
                if (generation.textContent > 0) {
                    generation.textContent = 0
                }
                e.target.classList.toggle("exist")
                updateLife()
            } else {
                if (e.touches.length === 0) {
                    cancelFlag = false
                }
            }
        }
    })
    document.body.classList.add("mobile")
    window.oncontextmenu = e => {
        e.preventDefault()
        e.stopPropagation()
        return false
    }
}


btn.addEventListener("click", e => {

    if (start)
        return stop()

    start = true
    container.classList.add("start")
    btn.textContent = "STOP"
    btn.classList.add("stop")

    time = new Date().getTime()
    animate()
    e.stopPropagation()
})

reset.addEventListener("click", e => {
    [...document.getElementsByClassName("exist")].forEach(life => life.classList.remove("exist"))
    life.textContent = 0;
    generation.textContent = 0
    stop()
    e.stopPropagation()
})


function animate() {

    if (new Date().getTime() - time >= 500) {
        refreshMap()
        lifeCycle()
        time = new Date().getTime()
    }

    if (isOver()) {
        return stop()
    }

    requestAnimationFrame(animate)
}


function createGrid() {
    container.replaceChildren();
    for (let i = 0; i < ROW_NUM; ++i) {
        const row = document.createElement("div")
        row.className = "grid-row"
        container.append(row)
        for (let j = 0; j < COL_NUM; ++j) {
            const col = document.createElement("div")
            col.className = "grid"
            row.append(col)
        }
    }
}



function updateLife() {
    life.textContent = document.getElementsByClassName("exist").length;
}

function lifeCycle() {
    for (let i = 0; i < ROW_NUM; ++i) {
        for (let j = 0; j < COL_NUM; ++j) {
            const total = countNeighbor({ i, j })
            const grid = grids[i * COL_NUM + j]
            const exist = grid.matches(".exist")

            if (exist && (total < 2 || total > 3) || !exist && total === 3)
                grids[i * COL_NUM + j].classList.toggle("exist")

        }
    }
    generation.textContent = Number(generation.textContent) + 1
    updateLife()

}



function countNeighbor(grid) {

    let total = 0

    let ii = grid.i === 0 ? 0 : -1;
    let jj = grid.j === 0 ? 0 : -1;

    let I = grid.i === ROW_NUM - 1 ? 0 : 1;
    let J = grid.j === COL_NUM - 1 ? 0 : 1;


    for (let i = ii; i <= I; ++i) {
        for (let j = jj; j <= J; ++j) {
            if (MAP[grid.i + i][grid.j + j]) {
                ++total
            }
        }
    }

    return MAP[grid.i][grid.j] ? total - 1 : total;
}



function refreshMap() {
    for (let i = 0; i < ROW_NUM; i++) {
        const base = i * COL_NUM
        for (let j = 0; j < COL_NUM; j++) {
            MAP[i][j] = grids[base + j].matches(".exist")
        }
    }
}

function countLife() {
    let total = 0;
    grids.forEach(grid => {
        if (grid.matches(".exist"))
            ++total
    })
    return total
}

function isOver() {
    return !start || !document.getElementsByClassName("exist").length
}

function stop() {
    start = false
    btn.textContent = "START"
    btn.classList.remove("stop")
    container.classList.remove("start")
}


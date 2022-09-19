
const btn = document.getElementById("btn")
const ROW_NUM = getComputedStyle(document.documentElement).getPropertyValue("--grid-row-num")
const COL_NUM = getComputedStyle(document.documentElement).getPropertyValue("--grid-col-num")
const generation = document.getElementById("generation")

const map = new Array(ROW_NUM);
for (let i = 0; i < ROW_NUM; i++) {
    map[i] = []
}


const container = document.querySelector(".grid-container")
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

const grids = document.querySelectorAll(".grid")

let start = false

document.addEventListener("click", e => {

    if (e.target.matches(".grid")) {
        if (G > 0) {
            G = 0
            generation.textContent = 0
        }
        e.target.classList.toggle("exist")
    }
})

let time
btn.addEventListener("click", e => {

    if (start) {
        start = false
        btn.textContent = "START"
        return
    }

    start = true
    btn.textContent = "STOP"
    time = new Date().getTime()
    animate()

})


function animate() {

    if (new Date().getTime() - time >= 500) {
        initMap()
        lifeCycle()
        time = new Date().getTime()
    }

    if (!isOver()) {
        requestAnimationFrame(animate)
    } else {
        start = false
        btn.textContent = "START"

    }
}



let G = 0
generation.textContent = 0;
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
    generation.textContent = ++G
}



function countNeighbor(grid) {

    let total = 0

    let ii = grid.i === 0 ? 0 : -1;
    let jj = grid.j === 0 ? 0 : -1;

    let I = grid.i === ROW_NUM - 1 ? 0 : 1;
    let J = grid.j === COL_NUM - 1 ? 0 : 1;
    let r = { ii, I, jj, J }

    for (let i = ii; i <= I; ++i) {
        for (let j = jj; j <= J; ++j) {
            if (map[grid.i + i][grid.j + j]) {
                ++total
            }
        }
    }

    return map[grid.i][grid.j] ? total - 1 : total;
}



function initMap() {
    for (let i = 0; i < ROW_NUM; i++) {
        const base = i * COL_NUM
        for (let j = 0; j < COL_NUM; j++) {
            map[i][j] = grids[base + j].matches(".exist")
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
}
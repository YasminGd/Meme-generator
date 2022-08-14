'use strict'
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']
let gFirstPos = null

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
    const pos = getEvPos(ev)
    if (gTouchEvs.includes(ev.type)) {
        pos.y -= 50
    }
    if (!lineIsClicked(pos)) removeActiveLine()
    document.body.style.cursor = 'grabbing'
    gFirstPos = pos
    renderMeme()
    changeElTxt()
}

function onMove(ev) {
    const meme = getMeme()
    if (meme.clickedLine === null) return
    const pos = getEvPos(ev)
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        pos.y -= 50
    }
    changeClickedLinePos(pos, gFirstPos)
    gFirstPos = pos
    renderMeme()
}

function onUp() {
    removeClickedLine()
    gFirstPos = null
    document.body.style.cursor = 'grab'
    renderMeme()
}


'use strict'

let gElCanvas
let gCtx

function init() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')

    addEventListeners()
    renderGallery()
    renderFilterKeywords()
}

function addEventListeners() {
    addMouseListeners()
    addTouchListeners()

    window.addEventListener('keydown', (e) => {
        const elEditor = document.querySelector('.editor')
        if (elEditor.style.display === 'none') return
        if (document.querySelector('#line-input') === document.activeElement) return
        if (!properKeyStroke(e.key)) return
        onAddToLineTxt(e.key)
    })

    window.addEventListener('resize', () => {
        const elEditor = document.querySelector('.editor')
        if (!elEditor) return
        resizeCanvas()
        renderMeme()
    })
}

function getCanvas() {
    return gElCanvas
}

function renderMeme() {
    const meme = getMeme()
    const lines = meme.lines

    const img = new Image()
    img.src = `img/${meme.selectedImgId}.jpg`
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        drawText(lines)
    }
}

function renderFilterKeywords() {
    const elKeywords = document.querySelector('.keywords')
    const keywords = getKeywords()
    let keywordsHTML = []

    for (let keyword in keywords) {
        keywordsHTML.push(
            `<a onclick="onSetFilter(this.innerText, true)" style="font-size:${keywords[keyword] * 2 + 10}px">
                ${keyword}
            </a>`
        )
    }

    elKeywords.innerHTML = keywordsHTML.join('')
}

function drawText(lines) {

    lines.forEach((line, idx) => {
        gCtx.beginPath()
        gCtx.textBaseline = 'middle'
        gCtx.textAlign = line.position
        gCtx.lineWidth = 4
        gCtx.font = `${line.size}px ${line.font}`
        gCtx.fillStyle = line.color.fill
        gCtx.strokeStyle = line.color.stroke
        gCtx.shadowColor = "black"
        gCtx.shadowBlur = 4
        gCtx.strokeText(line.txt, line.x, line.y)
        gCtx.fillText(line.txt, line.x, line.y)
        gCtx.closePath()

        if (getMeme().selectedLineIdx === idx) {
            const txtWidth = gCtx.measureText(line.txt).width
            const rectTopX = calcRectX(line, txtWidth)
            const rectTopY = line.y - line.size / 2

            drawRect(rectTopX, rectTopY, txtWidth, line.size)
        }
    })

}

function drawRect(x, y, xRigth, yDown) {
    gCtx.beginPath()
    gCtx.shadowBlur = 0
    gCtx.rect(x - 10, y - 5, xRigth + 20, yDown + 10)
    gCtx.strokeStyle = 'orange'
    gCtx.stroke()
    gCtx.closePath()
}

//Input from keyBoard when on canvas
function onAddToLineTxt(txt) {
    addToLine(txt)
    renderMeme()
    changeElTxt()
}

//Input from the input box
function onChangeLineTxt(txt) {
    changeLineTxt(txt)
    renderMeme()
}

function onSetFillColor(color) {
    setFillColor(color)
    renderMeme()
}

function onSetStrokeColor(color) {
    setStrokeColor(color)
    renderMeme()
}

function onChangeLineSize(value) {
    setLineSize(value)
    renderMeme()
}

function onSwitchLine() {
    setCurrLine()
    renderMeme()
    changeElTxt()
}

function onAlignTxt(pos) {
    alignTxt(pos)
    renderMeme()
}

function onChangeHeight(value) {
    changeHeight(value)
    renderMeme()
}

function resizeCanvas() {
    const elCanvasSizer = document.querySelector('.canvas-size-determine')
    const id = getId()

    const img = new Image()
    img.src = `img/${id}.jpg`

    const imgWidth = img.width
    const imgHeight = img.height

    gElCanvas.width = elCanvasSizer.offsetWidth
    gElCanvas.height = (gElCanvas.width * imgHeight) / imgWidth
}

function onDownloadMeme(elLink) {
    const data = gElCanvas.toDataURL()

    elLink.href = data
    elLink.download = 'my-meme'
}

function onAddLine(sticker = null) {
    addLine(sticker)
    changeElTxt()
    renderMeme()
}

function onRemoveLine() {
    removeLine()
    changeElTxt()
    renderMeme()
}

function onSetFont(font) {
    setFont(font)
    renderMeme()
}

function onShare() {
    uploadImg(gElCanvas)
}


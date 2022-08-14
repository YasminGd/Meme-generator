'use strict'

const gKeywordSearchCountMap = {
    'woman': 12,
    'cat': 10,
    'baby': 2,
    'funny': 3,
    'man': 4,
    'politics': 1,
    'evil': 13,
    'dog': 12,
    'cute': 5,
    'tv': 6,
    'bros': 3
}
const gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['woman'] },
    { id: 2, url: 'img/2.jpg', keywords: ['man', 'politics'] },
    { id: 3, url: 'img/3.jpg', keywords: ['dog', 'cute'] },
    { id: 4, url: 'img/4.jpg', keywords: ['baby', 'evil'] },
    { id: 5, url: 'img/5.jpg', keywords: ['dog', 'cute', 'baby'] },
    { id: 6, url: 'img/6.jpg', keywords: ['cat'] },
    { id: 7, url: 'img/7.jpg', keywords: ['man', 'tv'] },
    { id: 8, url: 'img/8.jpg', keywords: ['man', 'tv'] },
    { id: 9, url: 'img/9.jpg', keywords: ['baby', 'evil'] },
    { id: 10, url: 'img/10.jpg', keywords: ['man', 'tv'] },
    { id: 11, url: 'img/11.jpg', keywords: ['baby', 'funny'] },
    { id: 12, url: 'img/12.jpg', keywords: ['man', 'tv'] },
    { id: 13, url: 'img/13.jpg', keywords: ['man', 'politics'] },
    { id: 14, url: 'img/14.jpg', keywords: ['baby', 'funny'] },
    { id: 15, url: 'img/15.jpg', keywords: ['dog', 'cute'] },
    { id: 16, url: 'img/16.jpg', keywords: ['man', 'politics'] },
    { id: 17, url: 'img/17.jpg', keywords: ['man', 'bros'] },
    { id: 18, url: 'img/18.jpg', keywords: ['man', 'tv'] },
    { id: 19, url: 'img/19.jpg', keywords: ['man', 'funny'] },
    { id: 20, url: 'img/20.jpg', keywords: ['man', 'tv'] },
    { id: 21, url: 'img/21.jpg', keywords: ['man', 'tv'] },
    { id: 22, url: 'img/22.jpg', keywords: ['woman', 'tv'] },
    { id: 23, url: 'img/23.jpg', keywords: ['man', 'tv'] },
    { id: 24, url: 'img/24.jpg', keywords: ['man', 'politics'] },
    { id: 25, url: 'img/25.jpg', keywords: ['funny', 'tv'] },
]
const KEY = 'memesDB'
const gSavedMemes = loadFromStorage(KEY) || []

let gMeme = {}
let gFilter = ''



function getMemes() {
    const regex = new RegExp(gFilter, 'i')
    const imgs = gImgs.filter(img => img.keywords.some(keyword => regex.test(keyword)))
    return imgs
}

function getMeme() {
    return gMeme
}

function getKeywords() {
    return gKeywordSearchCountMap
}

function setMeme(id) {
    gMeme = {
        selectedImgId: id,
        selectedLineIdx: 0,
        lines: [
            {
                txt: 'I broke my finger last week',
                color: {
                    fill: 'white',
                    stroke: 'black'
                },
                position: 'center',
                font: 'impact'
            },
            {
                txt: 'On the other hand, I\'m okay.',
                color: {
                    fill: 'white',
                    stroke: 'black'
                },
                position: 'center',
                font: 'impact'
            }
        ],
        savedId: null,
        clickedLine: null,
    }

}

function setSavedMeme(savedId) {
    const meme = JSON.parse(JSON.stringify(gSavedMemes.find(meme => meme.savedId === savedId)))
    gMeme = meme
}

function getCurrLine() {
    return gMeme.lines[gMeme.selectedLineIdx]
}

function changeLineTxt(txt) {
    getCurrLine().txt = txt
}

function addToLine(txt) {
    const line = getCurrLine()

    if (line.txt === 'Change Text') {
        if (txt === 'Backspace') {
            line.txt = ''
        } else {
            changeLineTxt(txt)
        }
    } else if (txt === 'Backspace') {
        line.txt = line.txt.slice(0, -1)
    } else {
        line.txt += txt
    }
}

function setFillColor(color) {
    getCurrLine().color.fill = color
}

function setStrokeColor(color) {
    getCurrLine().color.stroke = color
}

function setLineSize(value) {
    getCurrLine().size += value
}

function setCurrLine() {
    gMeme.selectedLineIdx = gMeme.selectedLineIdx + 1 < gMeme.lines.length ? gMeme.selectedLineIdx + 1 : 0
}

function decideLineSize(canvas) {
    const size = canvas.width / 15
    gMeme.lines.forEach(line => line.size = size)
}

function relocateLines(canvas) {
    gMeme.lines[0].y = gMeme.lines[0].size
    gMeme.lines[0].x = canvas.width / 2
    gMeme.lines[1].y = canvas.height - gMeme.lines[1].size
    gMeme.lines[1].x = canvas.width / 2
}

function alignTxt(pos) {
    const canvas = getCanvas()

    const currLine = getCurrLine()
    currLine.position = pos

    switch (pos) {
        case 'center':
            currLine.x = canvas.width / 2
            break
        case 'left':
            currLine.x = 10
            break
        case 'right':
            currLine.x = canvas.width - 10
            break
    }
}

function removeActiveLine() {
    gMeme.selectedLineIdx = null
}

function changeHeight(value) {
    const line = getCurrLine()
    const canvas = getCanvas()
    const { y, size } = line
    if (y + value + size / 2 > canvas.height || y + value - size / 2 < 0) return

    line.y += value
}

function addLine(sticker) {
    const canvas = getCanvas()

    const line = {
        txt: sticker ? sticker : 'Change Text',
        size: sticker ? canvas.width / 7 : canvas.width / 15,
        color: {
            fill: 'white',
            stroke: 'black'
        },
        position: 'center',
        x: canvas.width / 2,
        font: 'impact',
    }

    if (gMeme.lines.length === 0 || (gMeme.lines.length === 1 && gMeme.lines[0].y !== gMeme.lines[0].size)) {
        line.y = line.size
    } else if (gMeme.lines.length === 1 && gMeme.lines[0].y === gMeme.lines[0].size) {
        line.y = canvas.height - line.size
    } else {
        line.y = canvas.height / 2
    }

    gMeme.lines.push(line)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function removeLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    setCurrLine()
}

function getSavedMemes() {
    return gSavedMemes
}

function saveMeme() {
    const meme = JSON.parse(JSON.stringify(gMeme))
    removeActiveLine()
    renderMeme(getImgForSave)

    function getImgForSave(img) {
        meme.memeImg = img

        if (!gMeme.savedId) {
            meme.savedId = makeId()
            gSavedMemes.push(meme)
        } else {
            const idx = gSavedMemes.findIndex(meme => meme.savedId === gMeme.savedId)
            gSavedMemes[idx] = meme
        }
    }
    saveToStorage(KEY, gSavedMemes)
}

function deleteMeme() {
    const idx = gSavedMemes.findIndex(meme => meme.savedId === gMeme.savedId)
    gSavedMemes.splice(idx, 1)
    saveToStorage(KEY, gSavedMemes)
}

function lineIsClicked(pos) {
    for (let i = 0; i < gMeme.lines.length; i++) {
        const line = gMeme.lines[i]
        changeGCtxFont(line)
        const txtWidth = gCtx.measureText(line.txt).width
        const rectY = line.y - line.size / 2
        const rectX = calcRectX(line, txtWidth)

        if (pos.x > rectX && pos.x < rectX + txtWidth && pos.y > rectY && pos.y < rectY + line.size) {
            gMeme.clickedLine = i
            gMeme.selectedLineIdx = i
            return true
        }
    }
    return false
}

function removeClickedLine() {
    gMeme.clickedLine = null
}

function changeClickedLinePos(pos, gStartPos) {
    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y

    gMeme.lines[gMeme.clickedLine].x += dx
    gMeme.lines[gMeme.clickedLine].y += dy
}

function setFilter(filter) {
    gFilter = filter
}

function setFont(font) {
    getCurrLine().font = font
}

function getId() {
    return gMeme.selectedImgId
}

function addToKeywordsCount(filter) {
    if (gKeywordSearchCountMap[filter] + 1 < 17) gKeywordSearchCountMap[filter]++
}

function resetFilter() {
    gFilter = ''
}



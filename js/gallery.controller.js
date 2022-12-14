'use strict'

function renderGallery() {
    const memes = getMemes()
    const memesHTML = memes.map(meme =>
        `
            <img src="${meme.url}" class="meme" onclick="onImgSelect(${meme.id})" />
        `
    )

    const elGallery = document.querySelector('.gallery')
    elGallery.innerHTML = memesHTML.join('')

    const elEditor = document.querySelector('.editor')
    const elFilter = document.querySelector('.filter')


    elEditor.style.display = 'none'
    elGallery.style.display = 'grid'
    elFilter.style.display = 'grid'

    if (document.querySelector('#nav').checked) document.querySelector('#nav').checked = false
}

function onImgSelect(id) {
    setMeme(id)
    renderEditor()
    decideLineSize(getCanvas())
    relocateLines(getCanvas())
    renderMeme()
}

function renderEditor() {
    const elEditor = document.querySelector('.editor')
    const elFilter = document.querySelector('.filter')
    const elGallery = document.querySelector('.gallery')


    elEditor.style.display = 'flex'
    elGallery.style.display = 'none'
    elFilter.style.display = 'none'

    changeElTxt()
    renderButtons()
    resizeCanvas()
}

function renderButtons() {
    const meme = getMeme()
    document.querySelector('.delete').style.display = meme.savedId ? 'block' : 'none'
}

function toggleNav() {
    const elNavButton = document.querySelector('.nav-btn')
    if (elNavButton.style.display === 'none') return

    const elNav = document.querySelector('ul')
    elNav.classList.toggle('hide')

    if (elNavButton.innerText === 'X') {
        elNavButton.style.color = 'black'
        elNavButton.innerText = '☰'
    } else {
        elNavButton.style.color = 'white'
        elNavButton.innerText = 'X'
    }
}

function changeElTxt() {
    const elTxt = document.querySelector('#line-input')
    const elFont = document.querySelector('#font-input')

    const currLine = getCurrLine()

    if (currLine) {
        elTxt.placeholder = currLine.txt === 'Change Text' ? 'Change Text' : ''
        elTxt.value = currLine.txt === 'Change Text' ? '' : currLine.txt
        elFont.value = currLine.font
    } else {
        elTxt.placeholder = ''
        elTxt.value = ''
        elFont.value = ''
    }
}

function onSetFilter(filter, isClicked = false) {
    setFilter(filter)
    renderGallery()
    if (isClicked) {
        addToKeywordsCount(filter)
        renderFilterKeywords()
        document.querySelector('#filter').value = filter
    }
}

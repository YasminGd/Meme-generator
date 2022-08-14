'use strict'

function renderSavedMemes() {
    const memes = getSavedMemes()

    const memesHTML = memes.map(meme =>
        `
        <img src="${meme.memeImg}" class="meme" onclick="onSavedMemeSelect('${meme.savedId}')" />
        `
    )

    const elFilter = document.querySelector('.filter')
    const elEditor = document.querySelector('.editor')
    const elGallery = document.querySelector('.gallery')

    elFilter.style.display = 'none'
    elEditor.style.display = 'none'

    elGallery.innerHTML = memesHTML.length ? memesHTML.join('') : '<h2 class="no-saved-memes-h2">No saved memes for now</h2>'
    elGallery.style.display = 'grid'

    if (document.querySelector('#nav').checked) document.querySelector('#nav').checked = false
}

function onSavedMemeSelect(savedId) {
    setSavedMeme(savedId)
    renderEditor()
    renderMeme()
}

function onSaveMeme() {
    saveMeme()
    showModal('Meme Saved')
}

function showModal(txt) {
    const elModal = document.querySelector('.modal')
    elModal.innerText = txt
    elModal.classList.add('show')

    setTimeout(() => elModal.classList.remove('show'), 1500)
}

function onDeleteMeme() {
    deleteMeme()
    renderSavedMemes()
    showModal('Meme Deleted')
}


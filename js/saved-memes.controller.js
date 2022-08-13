'use strict'

function renderSavedMemes(isFromNav = false) {
    const memes = getSavedMemes()

    const memesHTML = memes.map(meme =>
        `
        <img src="img/${meme.selectedImgId}.jpg" class="meme" onclick="onSavedMemeSelect('${meme.savedId}')" />
        `
    )

    const elFilter = document.querySelector('.filter')
    const elEditor = document.querySelector('.editor')
    const elGallery = document.querySelector('.gallery')

    elFilter.style.display = 'none'
    elEditor.style.display = 'none'

    elGallery.innerHTML = memesHTML.length ? memesHTML.join('') : '<h2 style="grid-column: span 2; font-size:30px">No saved memes for now<h2/>'
    elGallery.style.display = 'grid'

    if (isFromNav) toggleNav()
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
    console.log(elModal);

    setTimeout(() => elModal.classList.remove('show'), 1500)
}

function onDeleteMeme() {
    deleteMeme()
    renderSavedMemes()
    showModal('Meme Deleted')
}


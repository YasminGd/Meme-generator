'use strict'

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    const touchEvs = ['touchstart', 'touchmove', 'touchend']
    if (touchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft,
            y: ev.pageY - ev.target.offsetTop
        }
    }
    return pos
}

function makeId(length = 5) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    var txt = ''
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function calcRectX(line, txtWidth) {
    let x
    switch (line.position) {
        case 'center':
            x = line.x - txtWidth * 0.5
            break
        case 'left':
            x = line.x
            break
        case 'right':
            x = line.x - txtWidth
            break
    }
    return x
}

function properKeyStroke(txt) {
    const keys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ' ', 'backspace', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '_' , '-' , '+', '=', '\\' , '|' , '/' ,'.' , ',']
    return keys.includes(txt.toLowerCase())
}
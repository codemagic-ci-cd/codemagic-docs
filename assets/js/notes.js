md = window.markdownit()

let notifications = []
let notificationsLoaded = false
let fetchError = false
const loadingHeader = document.querySelector('[data-js-notes-loading]')
const fetchNotifications = async () => {
    await fetch('https://strapi.codemagic.io/notifications', {
        mode: 'cors',
        headers: { Accept: 'application/json' },
    })
        .then((res) => {
            res.json()
                .then((data) => {
                    const toc = document.querySelector('[data-js-toc] #TableOfContents')
                    renderNotifications(data, toc)
                })
                .catch((err) => {
                    loadingHeader.innerText = 'Failed to load release notes. Please refresh the page and try again.'
                    console.error('data error', err)
                })
        })
        .catch((err) => {
            loadingHeader.innerText = 'Failed to load release notes. Please refresh the page and try again.'
            console.error('data error', err)
        })
}
fetchNotifications()

const notificationTemplate = ({ description, reference, start, title }) => {
    const el = document.createElement('div')
    el.classList.add('note')
    const date = new Date(start)
    el.innerHTML = `
            <h2 id="${idFormat(reference)}" class="note__title">${title}</h2>
            <div class="note__timestamp">${months[date.getMonth()]} ${getOrdinalNum(
        date.getDate(),
    )} ${date.getFullYear()}</div>
            <div class="note__description">${md.render(description.replace('</intro>', ''))}</div>
        `
    return el
}
const tocItemtemplate = ({ reference, title }) => {
    const el = document.createElement('li')
    el.innerHTML = `<a href="#${idFormat(reference)}">${title}</a>`
    return el
}
const renderNotifications = (notifications, toc) => {
    loadingHeader.style.display = 'none'
    toc.innerHTML = '<ul></ul>'
    const wrap = document.querySelector('[data-js-notifications-wrap]')
    const tocWrap = toc.querySelector('ul')
    notifications
        .sort((a, b) => new Date(b.start) - new Date(a.start))
        .forEach((item) => {
            wrap.appendChild(notificationTemplate(item))
            tocWrap.appendChild(tocItemtemplate(item))
        })
    createTableOfContents()
    copyLinkFromTitles()
}
const idFormat = (text) => {
    return text
        .toString() // Convert to string
        .normalize('NFD') // Change diacritics
        .replace(/[\u0300-\u036f]/g, '') // Remove illegal characters
        .replace(/\s+/g, '-') // Change whitespace to dashes
        .toLowerCase() // Change to lowercase
        .replace(/&/g, '-and-') // Replace ampersand
        .replace(/[^a-z0-9\-]/g, '') // Remove anything that is not a letter, number or dash
        .replace(/-+/g, '-') // Remove duplicate dashes
        .replace(/^-*/, '') // Remove starting dashes
        .replace(/-*$/, '') // Remove trailing dashes
}
const getOrdinalNum = (d) => {
    return d + (31 == d || 21 == d || 1 == d ? 'st' : 22 == d || 2 == d ? 'nd' : 23 == d || 3 == d ? 'rd' : 'th')
}
const months = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December',
}

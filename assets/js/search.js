const algolia = algoliasearch('27CIRMYZIB', '7e88305c04e90188508daa6c89e5f4df').initIndex('codemagic_docs')

const getBreadcrumbsHtml = (path, title) => {
    const parts = path.slice(1, -1).split('/')
    const breadcrumbs = []

    const humanizeStr = (str) => {
        const result = str.toLowerCase().replace(/[_-]+/g, ' ').trim()
        return result.charAt(0).toUpperCase() + result.slice(1)
    }

    parts.forEach((part, i) => {
        if (i < parts.length - 1) {
            if (part.includes('flutter')) breadcrumbs.push('Workflow Editor')
            else if (part.includes('yaml')) breadcrumbs.push('.YAML')
            if (part !== 'flutter' && part !== 'yaml') {
                const categoryName = document.querySelector(`[data-category-id="${part}"]`)?.innerText
                breadcrumbs.push(categoryName ?? humanizeStr(part))
            }
        } else {
            breadcrumbs.push(title ?? humanizeStr(part))
        }
    })

    return breadcrumbs.reduce((acc, cur) => `${acc}<span>${cur}</span>`, '')
}

const initSearchEvents = () => {
    const search = document.querySelector('[js-search')
    const searchInput = document.querySelector('[js-search-input')

    const closeSearch = () => {
        // mousedown is before blur, 'click' wouldn't work because after blur the icon disappears
        updateFromInput(null)
    }

    document.querySelector('[js-search-icon]').addEventListener('click', searchInput.focus)
    document.querySelector('[js-search-clear-icon]').addEventListener('mousedown', closeSearch)

    window.addEventListener('click', closeSearch)
    search.addEventListener('click', (e) => e.stopPropagation())

    searchInput.addEventListener('change keyup input', (event) => {
        if (event.target.value.trim().length) search.classList.add('search--active')
        else search.classList.remove('search--active')
    })
    searchInput.addEventListener('focusin', () => search.classList.add('search--active'))
    searchInput.addEventListener('focusout', (event) => {
        if (!event.target.value) search.classList.remove('search--active')
    })
    searchInput.addEventListener('keyup', (event) => {
        if (event.keyCode === 27) {
            // ESC
            updateFromInput(null)
            event.stopImmediatePropagation()
        }
    })
    searchInput.addEventListener(
        'keyup',
        debounce((event) => updateFromInput(event.target.value), 250),
    )

    updateFromUrl()
    window.addEventListener('popstate', updateFromUrl)
}

const updateFromInput = (query) => {
    updateUrl(query)
    updateInput(query)
    window.setTimeout(() => updateResults(query))
}

const updateFromUrl = () => {
    const query = decodeURIComponent((window.location.search || '').slice(3)) || null
    if (window.location.search.indexOf('utm_') < 0) {
        updateInput(query)
        window.setTimeout(() => updateResults(query))
    }
}

const updateUrl = (query) =>
    window.history.pushState(
        '',
        document.title,
        window.location.toString().substring(0, window.location.toString().indexOf('?')) +
            (query ? '?q=' + encodeURIComponent(query) : ''),
    )

const updateResults = async (query) => {
    let result
    try {
        result = await getResults(query)
    } catch (error) {
        result = error
    }
    const searchResultsElement = document.getElementById('search-results')
    searchResultsElement.innerHTML = ''
    if (result) searchResultsElement.append(getResultHtml(result, query))
}

const updateInput = (query) => {
    const searchInput = document.querySelector('[js-search-input]')
    searchInput.value = query
    if (query === null) searchInput.blur()
    else if (query) document.querySelector('[js-search]').classList.add('search--active')
}

const createHtmlElement = (tag, props, children) => {
    const element = document.createElement(tag)
    if (props)
        Object.entries(props).forEach(([key, value]) => {
            element[key] = value
        })
    if (children) children.forEach((child) => element.appendChild(child))
    return element
}

const getResultHtml = (algoliaResultList, query) => {
    if (!algoliaResultList) return null

    if (algoliaResultList instanceof Error)
        return createHtmlElement('div', {
            className: 'no-results-message',
            innerText: 'Invalid search query: ' + algoliaResultList.message,
        })

    const preferredConfiguration = localStorage.getItem('preferred-configuration') || defaultPreferredConfiguration

    algoliaResultList = algoliaResultList.filter((result) => {
        let resultConfiguration = null
        preferredConfigurations.some((configuration) => {
            if (result.uri.startsWith(`/${configuration}`)) {
                resultConfiguration = configuration
                return true
            }
        })
        return !resultConfiguration || resultConfiguration === preferredConfiguration
    })

    if (!algoliaResultList.length)
        return createHtmlElement('div', {
            className: 'no-results-message',
            innerText: `No results matching "${query}"`,
        })

    const results = algoliaResultList.map((result) =>
        createHtmlElement('li', null, [
            createHtmlElement('a', { href: result.uri }, [
                createHtmlElement('p', { innerHTML: result._highlightResult.title.value, className: 'title' }),
                createHtmlElement('p', { innerHTML: result._highlightResult.subtitle.value, className: 'subtitle' }),
                createHtmlElement('p', {
                    innerHTML: getBreadcrumbsHtml(result.uri, result.title),
                    className: 'breadcrumbs',
                }),
                createHtmlElement('p', { innerHTML: result._snippetResult.content.value }),
            ]),
        ]),
    )

    return createHtmlElement('ul', null, results)
}

const getResults = (query) =>
    query
        ? algolia
              .search(`'${query}`, {
                  highlightPreTag: '<mark data-markjs="true">',
                  highlightPostTag: '</mark>',
              })
              .then((result) => result.hits)
        : null

const debounce = (func, wait, immediate) => {
    let timeout

    return function () {
        const context = this
        const args = arguments
        const callNow = immediate && !timeout

        clearTimeout(timeout)

        timeout = setTimeout(() => {
            timeout = null
            if (!immediate) func.apply(context, args)
        }, wait)

        if (callNow) func.apply(context, args)
    }
}

document.addEventListener('DOMContentLoaded', initSearchEvents, false)

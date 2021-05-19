
const algolia = algoliasearch("27CIRMYZIB", "7e88305c04e90188508daa6c89e5f4df").initIndex("codemagic_docs");

$(document).ready(() => {
    initSearchEvents()
})

const initSearchEvents = () => {
    $('.search__icon--search').on('click', () => {
        $(this).closest('.search').find('.search__input').trigger('focus')
    })
    $('.search__icon--clear').on('mousedown', () => {
        // mousedown is before blur, 'click' wouldn't work because after blur the icon disappears
        updateFromInput(null)
    })

    $('.search__input')
        .bind('focus focusin', () => {
            $('.search').addClass('search--active')
        })
        .bind('blur focusout', (event) => {
            if (event.target.value) {
                return
            }
            $('.search').removeClass('search--active')
        })
        .on('keyup', (event) => {
            if (event.keyCode === 27) {
                // ESC
                updateFromInput(null)
                event.stopImmediatePropagation()
            }
        })
        .on(
            'keyup',
            debounce((event) => {
                updateFromInput(event.target.value)
            }, 250),
        )

    updateFromUrl()

    window.addEventListener('popstate', () => updateFromUrl())
}

const updateFromInput = (query) => {
    updateUrl(query)
    updateInputs(query)
    window.setTimeout(() => updateResults(query))
}

const updateFromUrl = () => {
    const query = decodeURIComponent((window.location.search || '').slice(3)) || null
    if (window.location.search.indexOf('utm_') < 0) {
        updateInputs(query)
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
    $('#search-results').html(getResultHtml(result, query))
}

const updateInputs = (query) => {
    var $inputs = $('.search__input')
    $inputs.val(query)
    query === null ? $inputs.trigger('blur') : query && $('.search').addClass('search--active')
}

const getResultHtml = (algoliaResultList, query) => {
    if (!algoliaResultList) return null

    if (algoliaResultList instanceof Error) {
        return $('<div>', {
            class: 'no-results-message',
            text: 'Invalid search query: ' + algoliaResultList.message,
        })
    }

    if (!algoliaResultList.length) {
        return $('<div>', {
            class: 'no-results-message',
            text: 'No results matching "' + query + '"',
        })
    }

    return $('<ul>', {
        html: algoliaResultList.map((result) => {
            return $('<li>', {
                html: [
                    $('<a>', { html: result._highlightResult.title.value, href: result.uri }),
                    $('<p>', { html: result._highlightResult.subtitle.value }),
                    $('<p>', { html: result._snippetResult.content.value}),
                ],
            })
        }),
    })
}

const getResults = (query) =>
    query
        ? algolia
            .search(`'${query}`, {
                highlightPreTag: '<mark data-markjs="true">',
                highlightPostTag: '</mark>',
            }).then((result) => {
                return result.hits;
            })
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
            if (!immediate) {
                func.apply(context, args)
            }
        }, wait)

        if (callNow) func.apply(context, args)
    }
}

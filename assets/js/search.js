let fuse

const algolia = algoliasearch("27CIRMYZIB", "7e88305c04e90188508daa6c89e5f4df").initIndex("codemagic_docs");

const fuseOptions = {
    includeMatches: true,
    findAllMatches: true,
    includeScore: true,
    threshold: 0,
    ignoreLocation: true,
    maxPatternLength: 32,
    minMatchCharLength: 3,
    useExtendedSearch: true,
    keys: [
        {
            name: 'title',
            weight: 15,
        },
        {
            name: 'subtitle',
            weight: 10,
        },
        {
            name: 'content',
            weight: 5,
        },
    ],
}

$(document).ready(() => {
    $.getJSON('/index.json', (data) => {
        fuse = new Fuse(data, fuseOptions)
        initSearchEvents()
    })
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

// TODO - Remove fuse or algolia search after deciding which to keep
const updateResults = async (query) => {
    let result, algoliaResult
    try {
        result = getResults(query)
        console.log("fuse: ", result)
        algoliaResult = await getAlgoliaResults(query)
        console.log("algolia: ", algoliaResult)
    } catch (error) {
        result = error
    }
    // $('#search-results').html(getResultHtml(result, query))
    $('#search-results').html(getAlgoliaResultHtml(algoliaResult, query))
}

const updateInputs = (query) => {
    var $inputs = $('.search__input')
    $inputs.val(query)
    query === null ? $inputs.trigger('blur') : query && $('.search').addClass('search--active')
}

const getResultHtml = (resultList, query) => {
    if (!resultList) return null

    if (resultList instanceof Error) {
        return $('<div>', {
            class: 'no-results-message',
            text: 'Invalid search query: ' + resultList.message,
        })
    }

    if (!resultList.length) {
        return $('<div>', {
            class: 'no-results-message',
            text: 'No results matching "' + query + '"',
        })
    }

    const orderByStartPosition = (a, b) => a.start - b.start

    const collectSnippetPositions = (contentLength, all, p) => {
        const charsBefore = 30
        const charsAfter = 30
        const maxSnippetLength = 200

        const start = Math.max(p.start - charsBefore, 0)
        const end = Math.min(p.start + p.length + charsAfter, contentLength)

        const prev = all[all.length - 1]
        const isOverlappingWithPrevious = prev && prev.start + prev.length > start
        if (isOverlappingWithPrevious) {
            const newLength = end - prev.start
            if (newLength > maxSnippetLength) {
                return all
            }
            prev.length = newLength
            prev.keywords.push({ start: p.start - prev.start, length: p.length })
        } else {
            all.push({
                start: start,
                length: end - start,
                keywords: [{ start: p.start - start, length: p.length }],
            })
        }

        return all
    }

    const getSnippet = (content, s) => {
        let c = content.substr(s.start, s.length + 1)
        const m = c.match(new RegExp('|', 'g'))

        const isStartOfContent = s.start === 0
        const firstKw = s.keywords[0]
        const start = isStartOfContent ? 0 : Math.min(firstKw.start, m ? c.indexOf(m[0]) + m[0].length : 0)
        const lastKw = s.keywords[s.keywords.length - 1]

        const isEndOfContent = s.start + s.length === content.length
        const end = isEndOfContent
            ? c.length + 1
            : Math.max(lastKw.start + lastKw.length, m ? c.lastIndexOf(m[m.length - 1]) : c.length + 1)

        c = c.substring(start, end)

        return Object.assign({}, s, {
            content: c,
            isStart: isStartOfContent,
            isEnd: isEndOfContent,
            keywords: s.keywords.map((k) => {
                return { start: k.start - start, length: k.length }
            }),
        })
    }

    const getContentSnippets = (contentPositions, content) => {
        content = (content || '').trim()

        return contentPositions
            ? contentPositions
                  .sort(orderByStartPosition)
                  .reduce(collectSnippetPositions.bind(null, content.length), [])
                  .map(getSnippet.bind(null, content))
                  .slice(0, 3)
            : [
                  {
                      isFirst: true,
                      isLast: false,
                      content: content.substring(0, 100),
                      keywords: contentPositions,
                  },
              ]
    }

    return $('<ul>', {
        html: resultList.map((result) => {
            const snippets = getContentSnippets(result.positions.content, result.item.content)

            return $('<li>', {
                html: [
                    $('<a>', { text: result.item.title, href: result.item.uri }).markRanges(result.positions.title),
                    $('<p>', { text: result.item.subtitle }),
                    snippets
                        ? $('<p>', {
                              html: snippets.map((s) => {
                                  return $('<span>', {
                                      class: [s.isStart ? 'start' : '', s.isEnd ? 'end' : ''].join(' '),
                                      text: s.content,
                                  }).markRanges(s.keywords)
                              }),
                          })
                        : null,
                ],
            })
        }),
    })
}

const getResults = (query) =>
    query
        ? fuse
              // ' is a token for extended search needed to find items that include the value
              // it prevents fuzzy search
              .search(`'${query}`, {
                  limit: 16,
              })
              .map((result) => {
                  let positions = { title: [], subtitle: [], content: [] }
                  result.matches.map((match) => {
                      match.indices.map((index) => {
                          positions[match.key].push({
                              length: index[1] - index[0] + 1,
                              start: index[0],
                          })
                      })
                  })
                  return {
                      ...result,
                      positions,
                  }
              })
        : null

const getAlgoliaResultHtml = (algoliaResultList, query) => {
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

const getAlgoliaResults = (query) =>
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

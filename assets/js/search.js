function initSearch(indexURL) {
  $.getJSON(indexURL)
    .then(getSearchIndex)
    .then(initSearchEvents)
}

function initSearchEvents(index) {
  $('.search__icon--search').on('click', function() {
    $(this)
      .closest('.search')
      .find('.search__input')
      .trigger('focus')
  })
  $('.search__icon--clear').on('mousedown', function() {
    // mousedown is before blur, 'click' wouldn't work because after blur the icon disappears
    updateFromInput(index, null)
  })

  $('.search__input')
    .bind('focus focusin', function() {
      $('.search').addClass('search--active')
    })
    .bind('blur focusout', function(event) {
      if (event.target.value) {
        return
      }
      $('.search').removeClass('search--active')
    })
    .on('keyup', function(event) {
      if (event.keyCode === 27) {
        // ESC
        updateFromInput(index, null)
        event.stopImmediatePropagation()
      }
    })
    .on(
      'keyup',
      debounce(function(event) {
        updateFromInput(index, event.target.value)
      }, 250)
    )

  updateFromUrl(index)

  window.addEventListener('popstate', function() {
    updateFromUrl(index)
  })
}

function updateFromInput(index, query) {
  updateUrl(query)
  updateInputs(query)
  window.setTimeout(function() {
    updateResults(index, query)
  })
}

function updateFromUrl(index) {
  var query =
    decodeURIComponent((window.location.search || '').slice(3)) || null
  updateInputs(query)
  window.setTimeout(function() {
    updateResults(index, query)
  })
}

function updateUrl(query) {
  window.history.pushState(
    '',
    document.title,
    window.location
      .toString()
      .substring(0, window.location.toString().indexOf('?')) +
      (query ? '?q=' + encodeURIComponent(query) : '')
  )
}

function updateResults(index, query) {
  var result
  try {
    result = getResults(index, query)
  } catch (error) {
    result = error
  }

  $('#search-results').html(getResultHtml(result, query))
}

function updateInputs(query) {
  var $inputs = $('.search__input')

  $inputs.val(query)
  if (query === null) {
    $inputs.trigger('blur')
  } else {
    if (query) {
      $('.search').addClass('search--active')
    }
  }
}

function prunePlugins (builder) {
  builder.pipeline.remove(lunr.stemmer)
  builder.pipeline.remove(lunr.trimmer)
  builder.pipeline.remove(lunr.stopWordFilter)
  builder.searchPipeline.remove(lunr.stemmer)
}

function trimmerDashSupport (builder) {
  var pipelineFunction = function(token) {
    return token.update(function (str) {
      return str.replace(/[^A-Za-z0-9_\-\$]+/, '').replace(/[^A-Za-z0-9_]+$/, '')
    })
  }
  lunr.Pipeline.registerFunction(pipelineFunction, 'trimmer-dash-support')
  builder.pipeline.add(pipelineFunction)
}

function addPositionMetadata(builder) {
  var pipelineFunction = function(token) {
    var p = token.metadata.position
    token.metadata.positionObject = { start: p[0], length: p[1] }
    return token
  }
  lunr.Pipeline.registerFunction(pipelineFunction, 'position-metadata')
  builder.pipeline.add(pipelineFunction)
  builder.metadataWhitelist.push('positionObject')
}

function splitSearchWords(builder) {
  var pipelineFunction = function (token) {
    words = token.toString().split(' ')
    tokens = Array(words.length).fill().map(function(x, i) {
      return token.clone(function (str) {
        return words[i]
      })
    })
    return tokens
  }
  lunr.Pipeline.registerFunction(pipelineFunction, 'split-search-words')
  builder.searchPipeline.add(pipelineFunction)
}

function lowerCaseSearchPipeline (builder) {
  var pipelineFunction = function (token) {
    return token.update(function (str) {
      return str.toLowerCase()
    })
  }
  lunr.Pipeline.registerFunction(pipelineFunction, 'lower-case-search-pipeline')
  builder.searchPipeline.add(pipelineFunction)
}

function removeLeadingDot(builder) {
  var pipelineFunction = function(query) {
    query.str = query.str.replace(/^\./, '')
    return query
  }
  lunr.Pipeline.registerFunction(pipelineFunction, 'remove-leading-dot')
  builder.searchPipeline.add(pipelineFunction)
}

function edgeNgramTokenizer(builder) {
  var pipelineFunction = function(token) {
    tokens = Array(token.toString().length).fill().map(function(x, i) {
      return token.clone(function(str) {
        return str.slice(0, i + 1)
      })
    })
    return tokens
  }
  lunr.Pipeline.registerFunction(pipelineFunction, 'edge-ngram-tokenizer')
  builder.pipeline.add(pipelineFunction)
}

function getSearchIndex(pages) {
  lunr.tokenizer.separator = /[\s]+/
  var lunrIndex = lunr(function() {
    this.ref('uri')
    this.field('title', { boost: 15 })
    this.field('content', { boost: 5 })

    this.use(prunePlugins)
    this.use(trimmerDashSupport)
    this.use(edgeNgramTokenizer)
    this.use(addPositionMetadata)

    this.use(splitSearchWords)
    this.use(lowerCaseSearchPipeline)
    this.use(removeLeadingDot)

    this.k1(0.5)

    pages.forEach(this.add, this)
  })
  var pageIndex = pages.reduce(function(all, page) {
    all[page.uri] = page
    return all
  }, {})
  return { pageIndex: pageIndex, lunrIndex: lunrIndex }
}

function getResultHtml(resultList, query) {
  if (!resultList) {
    return null
  }

  if (resultList instanceof Error) {
    return $('<div>', {
      class: 'no-results-message',
      text: 'Invalid search query: ' + resultList.message
    })
  }

  if (!resultList.length) {
    return $('<div>', {
      class: 'no-results-message',
      text: 'No results matching "' + query + '"'
    })
  }

  function orderByStartPosition(a, b) {
    return a.start - b.start
  }

  function collectSnippetPositions(contentLength, all, p) {
    var charsBefore = 30
    var charsAfter = 30
    var maxSnippetLength = 200

    var start = Math.max(p.start - charsBefore, 0)
    var end = Math.min(p.start + p.length + charsAfter, contentLength)

    var prev = all[all.length - 1]
    var isOverlappingWithPrevious = prev && prev.start + prev.length > start
    if (isOverlappingWithPrevious) {
      var newLength = end - prev.start
      if (newLength > maxSnippetLength) {
        return all
      }
      prev.length = newLength
      prev.keywords.push({ start: p.start - prev.start, length: p.length })
    } else {
      all.push({
        start: start,
        length: end - start,
        keywords: [{ start: p.start - start, length: p.length }]
      })
    }

    return all
  }

  function getSnippet(content, s) {
    var c = content.substr(s.start, s.length + 1)
    var m = c.match(new RegExp(lunr.tokenizer.separator, 'g'))

    var isStartOfContent = s.start === 0
    var firstKw = s.keywords[0]
    var start = isStartOfContent
      ? 0
      : Math.min(firstKw.start, m ? c.indexOf(m[0]) + m[0].length : 0)
    var lastKw = s.keywords[s.keywords.length - 1]

    var isEndOfContent = s.start + s.length === content.length
    var end = isEndOfContent
      ? c.length + 1
      : Math.max(
          lastKw.start + lastKw.length,
          m ? c.lastIndexOf(m[m.length - 1]) : c.length + 1
        )

    c = c.substring(start, end)

    return Object.assign({}, s, {
      content: c,
      isStart: isStartOfContent,
      isEnd: isEndOfContent,
      keywords: s.keywords.map(function(k) {
        return { start: k.start - start, length: k.length }
      })
    })
  }

  function getContentSnippets(contentPositions, content) {
    var content = (content || '').trim()

    if (contentPositions) {
      return contentPositions
        .sort(orderByStartPosition)
        .reduce(collectSnippetPositions.bind(null, content.length), [])
        .map(getSnippet.bind(null, content))
        .slice(0, 3)
    } else {
      return [
        {
          isFirst: true,
          isLast: false,
          content: content.substring(0, 100),
          keywords: contentPositions
        }
      ]
    }
  }

  return $('<ul>', {
    html: resultList.map(function(result) {
      var snippets = getContentSnippets(
        result.positions.content,
        result.content
      )

      return $('<li>', {
        html: [
          $('<a>', { text: result.title, href: result.uri }).markRanges(
            result.positions.title
          ),
          snippets
            ? $('<p>', {
                html: snippets.map(function(s) {
                  return $('<span>', {
                    class: [
                      s.isStart ? 'start' : '',
                      s.isEnd ? 'end' : ''
                    ].join(' '),
                    text: s.content
                  }).markRanges(s.keywords)
                })
              })
            : null
        ]
      })
    })
  })
}

function getResults(index, query) {
  if (!query) {
    return null
  }

  return index.lunrIndex
    .query(function (lunrQuery) {
      lunrQuery.term(query)
    })
    .slice(0, 16)
    .map(function(result) {
      var positions = { title: [], content: [] }
      $.each(result.matchData.metadata, function(_, termMetaData) {
        $.each(termMetaData, function(field, data) {
          positions[field].push.apply(positions[field], data.positionObject)
        })
      })
      return Object.assign({}, index.pageIndex[result.ref], {
        positions: positions
      })
    })
}

function debounce(func, wait, immediate) {
  var timeout

  return function() {
    var context = this
    var args = arguments

    var callNow = immediate && !timeout

    clearTimeout(timeout)

    timeout = setTimeout(function() {
      timeout = null

      if (!immediate) {
        func.apply(context, args)
      }
    }, wait)

    if (callNow) func.apply(context, args)
  }
}

// Category toggle open
var navCategory = $('#docs-menu li')
navCategory.each(function() {
  $('.category-name', this).on('click', function() {
    var $parent = $(this).parent()

    $parent.find('.category-posts').slideToggle(150, function complete() {
      $parent.toggleClass('open')
    })
  })
})
// Menu toggle
var menuToggle = $('#menu-toggle')
menuToggle.on('click', function(e) {
  $(this).toggleClass('open')
  $('#docs-menu').toggleClass('open')
})

// Create permalinks
function createTableOfContents() {
  var tocLinks = $('#TableOfContents a')
  tocLinks.each(function() {
    var $link = $(this)
    var hrefAttr = $link.attr('href')
    var $heading = $(hrefAttr)
    var href = $link.prop('href')
    $heading.append(
      '<i class="ctc fas fa-link" data-target-link="' +
        href +
        '" title="Copy link to section to clipboard"></i>'
    )
  })
  hashScroll()
}
// Scroll to heading from url
function hashScroll() {
  var target = window.location.hash
  var hashElement = $('' + target + '')
  if (hashElement.offset()) {
    var scrollTarget = hashElement.offset().top - 40
    $('html, body').animate({ scrollTop: scrollTarget }, 300)
    history.pushState(
      '',
      document.title,
      window.location.pathname + window.location.search
    )
  }
}
// Scroll to selected heading on click
$(document).on('click', 'a[href^="#"]', function(event) {
  event.preventDefault()
  var scrollTarget = $($.attr(this, 'href')).offset().top - 40
  $('html, body').animate({ scrollTop: scrollTarget }, 300)
})

// Copy section link to clipboard
$('h1, h2, h3, h4, h5, h6').on('click', 'i.ctc', function() {
  var link = $(this).attr('data-target-link')
  var $temp = $('<input>')
  $('body').append($temp)
  $temp.val(link).select()
  document.execCommand('copy')
  $temp.remove()
  alert('Copied to clipboard')
})

$(document).ready(function() {
  createTableOfContents()
  // Wrap tables for responsiveness
  var contentTable = $('#main-content main table')
  contentTable.each(function() {
    $(this).wrap('<div class="table-wrap"></div>')
  })
})

// Table of content

let lastScrollPosition = 0

$(document).ready(function () {
    elementsTopPosition()
})
$(window).on('load scroll resize', function () {
    elementsTopPosition()
})
$(window).on('scroll', function () {
    const currentScrollPosition = $(window).scrollTop()
    window.scrollingDown = currentScrollPosition > lastScrollPosition
    lastScrollPosition = currentScrollPosition
})

// Adjust elements positions depending on content shown
function elementsTopPosition() {
  const windowHeight = $(window).height()
  const topOfWindow = $(window).scrollTop()
  const footerPosition = $('#footer').offset().top
  const toc = $('#toc')
  const progress = (topOfWindow / (footerPosition - windowHeight)) * 100

  if (toc.length) {
      const tableOfContentHeight = $('#TableOfContents').height()
      let contentTablePull = 0
      if (tableOfContentHeight > windowHeight * 0.9) {
          heightDifference = tableOfContentHeight - windowHeight * 0.8
          contentTablePull = heightDifference * progress / 100
      }
      const tableOfContentTop = 30 - contentTablePull
      toc.css('top', tableOfContentTop)
  }
}

function isOnScreen(elem) {
    if (elem.length === 0) {
        return;
    }
    const viewportTop = $(window).scrollTop()
    const viewportHeight = $(window).height()
    const viewportBottom = viewportTop + viewportHeight
    const top = $(elem).offset().top
    const height = $(elem).height()
    const bottom = top + height

    return (top >= viewportTop && top < viewportBottom) ||
        (bottom > viewportTop && bottom <= viewportBottom) ||
        (height > viewportHeight && top <= viewportTop && bottom >= viewportBottom)
}

function setContentTableHeaderActive(id) {
    $('#TableOfContents ul li a').removeClass('active');
    $(`#TableOfContents ul li a[href="#${id}"]`).addClass('active');
}

// Sidemenu scroll spy
$(window).ready(function () {
    const observer = new IntersectionObserver(function (entries) {
        headers = Array.from($('#main-content h2, #main-content h3'))
        headersOnScreen = headers.filter(h => isOnScreen(h))
        if (headersOnScreen.length) {
            setContentTableHeaderActive(headersOnScreen[0].id)
        } else if (entries[0].intersectionRatio == 0 && !window.scrollingDown) {
            currentIndex = headers.findIndex(header => header.id === entries[0].target.getAttribute('id'))
            previousHeader = currentIndex ? currentIndex - 1 : 0
            setContentTableHeaderActive(headers[previousHeader].id)
        }
    });
    document.querySelectorAll('#main-content h2, #main-content h3').forEach(function (header) {
        observer.observe(header);
    });
});
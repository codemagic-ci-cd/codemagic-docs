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

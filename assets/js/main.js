const desktopScreenWidth = 1001;

// Category toggle open
var navCategory = $('[data-js-docs-menu-item]')
navCategory.each(function() {
  $('[data-js-category-name]', this).on('click', function() {
    var $parent = $(this).parent()

    $parent.find('[data-js-category-posts]').slideToggle(150, function complete() {
      $parent.toggleClass('open')
    })
  })
})
// Menu toggle
$('[data-js-docs-menu-toggle]').on('click', function(e) {
  $(this).toggleClass('open')
  $('[data-js-docs-menu]').toggleClass('open')
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

$(document).ready(function() {

  window.userRequest = fetchUser()

  // Fetch user
  async function fetchUser() {
      const url = '{{ site.Param "backendURL" }}/user'
      const timeout = 3000

      const controller = new AbortController()
      const signal = controller.signal

      setTimeout(() => controller.abort(), timeout)

      try {
          const response = await fetch(url, {
              mode: 'cors',
              credentials: 'include',
              headers: { Accept: 'application/json' },
              signal,
          })
          try {
              return { response, json: await response.json() }
          } catch (error) {
              return { response, error }
          }
      } catch (error) {
          return { error }
      }
  }

  // Menu toggle
  $('[data-js-header-menu-toggle]').on('click', function() {
      $(this).toggleClass('open')
      const visible = $('[data-js-header-menu-wrap]').is(':visible')
      if (visible) {
          $('[data-js-header-menu-wrap]').slideUp(200)
      } else {
          $('[data-js-header-menu-wrap]').slideDown(200)
      }
  })

  // Open extenral links in new tab
  $('a').each(function() {
      var hostName = window.location.hostname
      var href = $(this).attr('href')
      if (href && !href.includes(hostName) && !href.startsWith('/') && !href.startsWith('#')) {
          $(this).attr('target', '_blank')
      }
  })

  authenticateUser()

  // Log user in
  async function authenticateUser() {
    const { response, json } = await window.userRequest
    window.auth = { loaded: true }

    if (response && response.ok && json && json.user) {
        Object.assign(window.auth, json.user.user)
        if (json.user.ok) {
            window.loggedIn = true
            window.auth._id = json.user._id
            $('#header-auth-user').addClass('transition-in')
            $('#header-user-avatar').html('<img src="' + auth.avatarUrl + '" alt=""/>')
            activeUserChanges()
        } else {
            window.loggedIn = false
            $('#header-auth-visitor').addClass('transition-in')
            visitorChanges()
        }
    } else {
        window.loggedIn = false
        $('#header-auth-visitor').addClass('transition-in')
        visitorChanges()
    }
    $('#header-auth-loading').addClass('transition-out')
    setTimeout(function() {
        $('#header-auth-loading .grey-line').hide()
    }, 1000)
  }

  $('#header-auth-logout').on('click', userLogout)
  // Log user out
  async function userLogout() {
    $('#header-authentication').addClass('loading')
    $('#header-auth-loading')
        .removeClass('transition-out')
        .addClass('transition-in')
    $('#header-auth-loading .grey-line').show()
    if ($(window).innerWidth() < 841) {
        $('[data-js-header-menu-toggle]').removeClass('open')
        $('#header-menu-wrap').slideUp(200)
    }
    $('#header-menu-wrap').slideUp(200)

    const url = '{{ site.Param "backendURL" }}/logout'
    const options = {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: { Accept: 'application/json' },
    }
    try {
        await fetch(url, options)
        $('#header-auth-user')
            .removeClass('transition-in')
            .addClass('transition-out')
        setTimeout(function() {
            $('#header-auth-loading .grey-line').hide()
            $('#header-auth-visitor')
                .removeClass('transition-out')
                .addClass('transition-in')
        }, 1000)
        visitorChanges()
    } catch (error) {
        location.reload()
    } finally {
        auth = { loaded: true }
        window.loggedIn = false
        $('#header-authentication').removeClass('loading')
        $('#header-auth-loading')
            .removeClass('transition-in')
            .addClass('transition-out')
    }
  }

  function activeUserChanges() {
    $(document).ready(function() {
        $('[ad-type*="product"]').hide()
    })
    $('#footer-cta .btn')
        .text('Return to app')
        .attr('href', '{{ site.Param "appURL" }}/apps')
  }
  function visitorChanges() {
    $(document).ready(function() {
        $('[ad-type*="product"]').show()
    })
    $('#footer-cta .btn')
        .text('Get Started Now')
        .attr('href', '{{ site.Param "appURL" }}/signup')
  }
})

let lastScrollPosition = 0
const sidebar = $('[data-js-sidebar]')
const header = $('[data-js-header]')
const docsMenu = $('[data-js-docs-menu]')
const contentWrap = $('[data-js-content-wrap]')

if ($(window).scrollTop() === 0) {
  header.css('top', 0)
  sidebar.css('top', header.innerHeight())
}

$(window).on('scroll', function() {
    const currentScrollPosition = $(window).scrollTop()
    window.scrollingDown = currentScrollPosition > lastScrollPosition
    lastScrollPosition = currentScrollPosition
})

$(window).on('load scroll resize', function() {
  const headerHeight = header.innerHeight()
  const sidebarHeight = sidebar.innerHeight()
  if (window.innerWidth < desktopScreenWidth) {
    if (window.scrollingDown) {
      sidebar.css('top', 0)
      header.css('top', -headerHeight)
      docsMenu.css('top', sidebarHeight)
      contentWrap.css('paddingTop', 0)
    } else {
      header.css('top', 0)
      sidebar.css('top', headerHeight)
      docsMenu.css('top', headerHeight + sidebarHeight)
      contentWrap.css('paddingTop', headerHeight)
    }
  } else {
    docsMenu.css('top', 90)
  }
})
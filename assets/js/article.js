let lastScrollPosition = 0
const tocContent = document.querySelector('#TableOfContents')
const showToc = toc && tocContent.innerHTML.length > 0

// Update scroll position
const updateScrollPosition = () => {
    const currentScrollPosition = window.scrollY
    // do not consider scrolling bounce effect as scrolling
    if (
        currentScrollPosition >= 0 &&
        currentScrollPosition <= document.body.getBoundingClientRect().height - window.innerHeight
    ) {
        window.scrollingDown = currentScrollPosition > lastScrollPosition
        lastScrollPosition = currentScrollPosition
    }
}

// Create permalinks
const createTableOfContents = () => {
    const tocLinks = document.querySelectorAll('#TableOfContents a')

    tocLinks.forEach((link) => {
        var heading = document.getElementById(link.href.split('#')[1])
        if (heading) {
            heading.insertAdjacentHTML(
                'beforeend',
                `<i class="ctc fas fa-link" data-target-link="${link.href}" title="Copy link to section to clipboard"></i>`,
            )
        }
    })
    hashScroll()
}

// Scroll to heading from url
const hashScroll = () => {
    const { hash, pathname, search } = window.location
    if (hash) {
        const target = document.querySelector(hash)
        scrollToAnchor(target)
        history.pushState('', document.title, pathname + search)
    }
}

// Smooth scroll
const scrollToY = (target, duration) => {
    const currentPosition = window.scrollY
    const toScroll = target - currentPosition
    let step = toScroll > 0 ? Math.round(toScroll / duration) : Math.round(Math.abs(toScroll) / duration)
    let scrolled = 0

    if (step < 1) step = 1

    const scroll = setInterval(() => {
        const stepTarget = toScroll > 0 ? window.scrollY + step : window.scrollY - step

        if (Math.abs(toScroll) - scrolled <= step) {
            clearInterval(scroll)
            window.scrollTo(0, target)
        } else {
            scrolled = scrolled + step
            window.scrollTo(0, stepTarget)
        }
    }, 1)
}

// Create anchor scroller
const scrollToAnchor = (target) => {
    const headerHeight = document.querySelector('[js-header]').offsetHeight
    const targetMarginTop = 30
    const offsetTop = window.scrollY + target.getBoundingClientRect().top
    let offset = headerHeight + targetMarginTop

    scrollToY(offsetTop - offset, 100)
}

// Scroll to target on hash links
const hashLinkClick = (e) => {
    const links = document.querySelectorAll('a[href^="#"]')
    const inList = Array.from(links).find((node) => node === e.target)
    if (inList) {
        e.preventDefault()
        const target = document.getElementById(e.target.href.split('#')[1])
        scrollToAnchor(target)
    }
}

// Copy section link to clipboard
const copyLinkFromTitles = (e) => {
    const copyIcons = document.querySelectorAll('i.ctc')
    const inList = Array.from(copyIcons).find((node) => node === e.target)

    if (inList) {
        const textarea = document.createElement('textarea')
        textarea.value = e.target.dataset.targetLink
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        alert('Copied to clipboard')
    }
}

// Define shared data for sticky elements
const getDataForSticky = () => {
    const article = document.querySelector('[js-article]')
    const header = document.querySelector('[js-header]')
    const sidebar = document.querySelector('[js-sidebar]')
    const wrap = document.querySelector('[js-content-wrap]')
    const toc = document.querySelector('[js-toc')

    const windowHeight = window.innerHeight
    const windowWidth = window.innerWidth

    const wrapBottom = wrap.getBoundingClientRect().bottom - windowHeight
    const bottom = wrapBottom > 0 ? 0 : Math.abs(wrapBottom)

    return { article, bottom, header, sidebar, windowWidth, wrap, toc }
}

// Handle docs menu positioning
const handleSidebarPosition = () => {
    const menu = document.querySelector('[js-docs-menu]')
    const headerContent = document.querySelector('[js-header-content]')
    const { bottom, header, sidebar, wrap } = getDataForSticky()

    if (window.showDesktop) {
        sidebar.style.top = `${header.getBoundingClientRect().height}px`
        sidebar.style.left = `${wrap.getBoundingClientRect().x}px`
        sidebar.style.bottom = `${bottom}px`
    } else {
        const menuOpen = menu.classList.contains('open')
        sidebar.removeAttribute('style')
        sidebar.style.transition = 'bottom 200ms ease-in-out'
        sidebar.style.top = `${
            headerContent.getBoundingClientRect().height + headerContent.getBoundingClientRect().top
        }px`
        sidebar.style.bottom = menuOpen ? '0px' : window.innerHeight - header.getBoundingClientRect().height + 'px'
    }
}

// Handle Table of Contents positioning
const handleTOCPositon = () => {
    const { article, bottom, header, windowWidth, toc } = getDataForSticky()
    const articleRight = windowWidth - article.getBoundingClientRect().right
    const tocWidth = 300
    const articleRightPadding = articleRight - tocWidth < 0 ? Math.abs(articleRight - tocWidth) : 0

    if (window.showDesktop) {
        toc.style.top = `${header.getBoundingClientRect().height}px`
        toc.style.left = `${article.getBoundingClientRect().right + 50 - articleRightPadding}px`
        toc.style.bottom = `${bottom}px`
        article.style.paddingRight = `${articleRightPadding}px`
    } else {
        toc.removeAttribute('style')
        article.removeAttribute('style')
    }
}

// Handle header contents positioning
const positionHeaderContents = () => {
    const header = document.querySelector('[js-header]')
    const headerContent = document.querySelector('[js-header-content]')
    const headerMenu = document.querySelector('[js-header-menu-wrap]')

    if (headerContent) {
        if (window.showDesktop) {
            header.removeAttribute('style')
            headerContent.removeAttribute('style')
        } else {
            headerContent.style.top = `${header.getBoundingClientRect().height}px`
            if (window.scrollingDown && !headerMenu.classList.contains('open')) {
                header.style.top = `-${header.getBoundingClientRect().height}px`
            } else {
                header.style.top = '0px'
            }
        }
    }
    if (headerMenu) {
        if (window.showDesktop) {
            headerMenu.removeAttribute('style')
        } else {
            headerMenu.style.top = `${header.getBoundingClientRect().height}px`
        }
    }
}

// Toggle docs menu open
const handleDocsToggle = ({ target }) => {
    const menu = document.querySelector('[js-docs-menu]')

    if (target.hasAttribute('js-docs-menu-toggle')) {
        target.classList.toggle('open')
        menu.classList.toggle('open')
        handleSidebarPosition()
    }
}

// Scroll docs & toc menu to active item
const scrollMenuToActive = (selector, smooth) => {
    const menu = document.querySelector(selector)
    const activeItem = menu.querySelector('a.active')

    if (activeItem) {
        if (smooth) {
            menu.scrollTo({
                top: activeItem.offsetTop - 10,
                behaviour: 'smooth',
            })
        } else menu.scrollTop = activeItem.offsetTop - 10
    }
}

// Set TOC item active
const setTocItemActive = (id) => {
    const active = document.querySelector('[js-toc] a.active')
    if (active) active.classList.remove('active')
    document.querySelector(`[js-toc] a[href="#${id}"`).classList.add('active')
}

// Check if element is in viewport
const isOnScreen = (el) => {
    if (!el) return
    var top = el.offsetTop
    var height = el.offsetHeight

    while (el.offsetParent) {
        el = el.offsetParent
        top += el.offsetTop
    }

    return top < window.pageYOffset + window.innerHeight && top + height > window.pageYOffset
}

// Observe headers position change for TOC menu
const observeHeaders = () => {
    const headersSelector = document.querySelectorAll('#main-content h2, #main-content h3')
    const observer = new IntersectionObserver((entries) => {
        headers = Array.from(headersSelector)
        headersOnScreen = headers.filter((h) => isOnScreen(h))

        if (headersOnScreen.length > 0) {
            setTocItemActive(headersOnScreen[0].id)
            scrollMenuToActive('[js-toc]', true)
        } else if (entries[0].intersectionRatio === 0 && !window.scrollingDown) {
            currentIndex = headers.findIndex((header) => header.id === entries[0].target.getAttribute('id'))
            previousHeader = currentIndex ? currentIndex - 1 : 0
            setTocItemActive(headers[previousHeader].id)
            scrollMenuToActive('[js-toc]', true)
        }
    })
    headersSelector.forEach((header) => observer.observe(header))
}

// Handle default preference
const setInitialPreference = () => {
    let configuration = window.localStorage.getItem('preferred-configuration')
    if (!configuration) configuration = 'yaml'

    const option = document.querySelector(`[data-js-preference-option="${configuration}"]`)
    changePreference(option)
}
// Handle preference change
const changePreference = (target) => {
    let currentPageConfiguration = null
    const info = document.querySelector('[js-configuration-info]')

    if (target.hasAttribute('data-js-preference-option')) {
        const bg = document.querySelector('[js-preference-bg]')
        const active = document.querySelector('[data-js-preference-option].active')
        const yamlLinks = document.querySelectorAll(
            '[data-js-configuration-category="yaml"], [data-js-platform-specific="yaml"]',
        )
        const flutterLinks = document.querySelectorAll(
            '[data-js-configuration-category="flutter"], [data-js-platform-specific="flutter"',
        )
        active.classList.remove('active')
        target.classList.add('active')
        bg.style.left = target.offsetLeft + 'px'
        window.localStorage.setItem('preferred-configuration', target.dataset.jsPreferenceOption)

        window.preferredConfigurations.some((configuration) => {
            if (window.location.pathname.startsWith(`/${configuration}`)) {
                currentPageConfiguration = configuration
                return true
            }
        })
        if (
            currentPageConfiguration &&
            target.dataset.jsPreferenceOption &&
            currentPageConfiguration !== target.dataset.jsPreferenceOption &&
            info
        ) {
            window.slideDown(info)
        } else if (info) {
            window.slideUp(info)
        }
        if (target.dataset.jsPreferenceOption === 'flutter') {
            yamlLinks.forEach((link) => (link.style.display = 'none'))
            flutterLinks.forEach((link) => (link.style.display = 'block'))
        } else {
            yamlLinks.forEach((link) => (link.style.display = 'block'))
            flutterLinks.forEach((link) => (link.style.display = 'none'))
        }
    }
}

// Handle closing configuration info
const closeConfigurationInfo = ({ target }) => {
    if (target.hasAttribute('js-close-configuration-info')) {
        window.slideToggle(document.querySelector('[js-configuration-info]'))
    }
}

// Handle category toggle
const toggleCategory = ({ target }) => {
    if (target.hasAttribute('js-category-toggle')) {
        const parent = target.parentNode
        const category = parent.querySelector('[js-category-posts]')
        target.classList.toggle('open')
        category.classList.toggle('open')
        window.slideToggle(category, 200)
    }
}

// On ready
handleSidebarPosition()
scrollMenuToActive('[js-docs-menu]')
positionHeaderContents()
setInitialPreference()

if (showToc) {
    createTableOfContents()
    observeHeaders()
    handleTOCPositon()
} else {
    document.querySelector('[js-toc]').style.display = 'none'
}

// On click
document.addEventListener('click', (e) => {
    hashLinkClick(e)
    handleDocsToggle(e)
    changePreference(e.target)
    closeConfigurationInfo(e)
    toggleCategory(e)

    if (showToc) {
        copyLinkFromTitles(e)
    }
})

// On scroll
window.addEventListener('scroll', () => {
    handleSidebarPosition()
    updateScrollPosition()
    positionHeaderContents()

    if (showToc) {
        handleTOCPositon()
    }
})

// On resize
window.addEventListener('resize', () => {
    handleSidebarPosition()
    positionHeaderContents()

    if (showToc) {
        handleTOCPositon()
    }
})

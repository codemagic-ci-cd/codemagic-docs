window.desktopScreenWidth = 1001
window.preferredConfigurations = ['yaml', 'flutter']
window.defaultPreferredConfiguration = preferredConfigurations[0]

// UI animation functions
window.slideUp = (target, duration = 500) => {
    target.style.transitionProperty = 'height, margin, padding'
    target.style.transitionDuration = duration + 'ms'
    target.style.boxSizing = 'border-box'
    target.style.height = target.offsetHeight + 'px'
    target.offsetHeight
    target.style.overflow = 'hidden'
    target.style.height = 0
    target.style.paddingTop = 0
    target.style.paddingBottom = 0
    target.style.marginTop = 0
    target.style.marginBottom = 0

    window.setTimeout(() => {
        target.style.display = 'none'
        target.style.removeProperty('height')
        target.style.removeProperty('padding-top')
        target.style.removeProperty('padding-bottom')
        target.style.removeProperty('margin-top')
        target.style.removeProperty('margin-bottom')
        target.style.removeProperty('overflow')
        target.style.removeProperty('transition-duration')
        target.style.removeProperty('transition-property')
    }, duration)
}
window.slideDown = (target, duration = 500) => {
    target.style.removeProperty('display')
    let display = window.getComputedStyle(target).display

    if (display === 'none') display = 'block'

    target.style.display = display
    let height = target.offsetHeight
    target.style.overflow = 'hidden'
    target.style.height = 0
    target.style.paddingTop = 0
    target.style.paddingBottom = 0
    target.style.marginTop = 0
    target.style.marginBottom = 0
    target.offsetHeight
    target.style.boxSizing = 'border-box'
    target.style.transitionProperty = 'height, margin, padding'
    target.style.transitionDuration = duration + 'ms'
    target.style.height = height + 'px'
    target.style.removeProperty('padding-top')
    target.style.removeProperty('padding-bottom')
    target.style.removeProperty('margin-top')
    target.style.removeProperty('margin-bottom')

    window.setTimeout(() => {
        target.style.removeProperty('height')
        target.style.removeProperty('overflow')
        target.style.removeProperty('transition-duration')
        target.style.removeProperty('transition-property')
    }, duration)
}
window.slideToggle = (target, duration = 500) => {
    if (window.getComputedStyle(target).display === 'none') {
        return slideDown(target, duration)
    } else {
        return slideUp(target, duration)
    }
}

// Fetch user
const fetchUser = async () => {
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

// Authenticate user
const authenticateUser = async () => {
    const { response, json } = await window.userRequest
    window.auth = { loaded: true }

    if (response && response.ok && json && json.user) {
        Object.assign(window.auth, json.user.user)

        if (json.user.ok) {
            window.loggedIn = true
            window.auth._id = json.user._id
            document.querySelector('[js-header-auth-user]').classList.add('transition-in')
            document.querySelector('[js-header-user-avatar]').innerHTML = '<img src="' + auth.avatarUrl + '" alt=""/>'
            setAnalyticsEvents()
        } else {
            window.loggedIn = false
            document.querySelector('[js-header-auth-visitor]').classList.add('transition-in')
        }
    } else {
        window.loggedIn = false
        document.querySelector('[js-header-auth-visitor]').classList.add('transition-in')
    }
    document.querySelector('[js-header-auth-loading]').classList.add('transition-out')
    setTimeout(() => {
        document.querySelector('[js-header-auth-loading-grey-line]').style.display = 'none'
    }, 1000)
}

// Set up analytics
const setAnalyticsEvents = async () => {
    const sendEvent = async (eventName) => {
        try {
            await fetch('{{ site.Param "backendURL" }}/analytics', {
                mode: 'cors',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    site: window.location.host,
                    page_url: window.location.pathname,
                    event_name: eventName,
                }),
            })
        } catch (error) {
            console.error(error)
        }
    }
    await sendEvent('page_viewed')
    document.addEventListener('copy', async () => await sendEvent('text_copied'))
}

// Log user out
async function userLogout() {
    document.querySelector('[js-header-authentication]').classList.add('loading')
    document.querySelector('[js-header-auth-loading]').classList.remove('transition-out')
    document.querySelector('[js-header-auth-loading]').classList.add('transition-in')
    document.querySelector('[js-header-auth-loading-grey-line]').style.display = 'block'
    if (window.innerWidth < 841) {
        document.querySelector('[js-header-menu-toggle]').classList.remove('open')
    }

    const url = '{{ site.Param "backendURL" }}/logout'
    const options = {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: { Accept: 'application/json' },
    }
    try {
        await fetch(url, options)
        document.querySelector('[js-header-auth-user]').classList.remove('transition-in')
        document.querySelector('[js-header-auth-user]').classList.add('transition-out')

        setTimeout(() => {
            document.querySelector('[js-header-auth-loading-grey-line]').style.display = 'none'
            document.querySelector('[js-header-auth-visitor]').classList.remove('transition-out')
            document.querySelector('[js-header-auth-visitor]').classList.add('transition-in')
        }, 1000)
    } catch (error) {
        location.reload()
    } finally {
        auth = { loaded: true }
        window.loggedIn = false
        document.querySelector('[js-header-authentication]').classList.remove('loading')
        document.querySelector('[js-header-auth-loading]').classList.remove('transition-in')
        document.querySelector('[js-header-auth-loading]').classList.add('transition-out')
    }
}

// Open external links in new tab
const handleExternalLinks = (e) => {
    const hostName = window.location.hostname
    const href = e.target.href

    if (href && !href.includes(hostName) && !href.startsWith('/') && !href.startsWith('#')) {
        e.preventDefault()
        window.open(href, '_blank').focus()
    }
}

// Set show desktop elements
const showDesktopElements = () => {
    const windowWidth = window.innerWidth
    window.showDesktop = windowWidth >= window.desktopScreenWidth
}

// Handle menu toggle
const handleMenuToggle = ({ target }) => {
    const menuWrap = document.querySelector('[js-header-menu-wrap]')
    if (target.hasAttribute('js-header-menu-toggle')) {
        target.classList.toggle('open')
        menuWrap.classList.toggle('open')
    }
}

// On ready
window.userRequest = fetchUser()
authenticateUser()
showDesktopElements()

// On click
document.addEventListener('click', (e) => {
    handleExternalLinks(e)
    handleMenuToggle(e)
})

// On resize
window.addEventListener('resize', () => {
    showDesktopElements()
})

// Logout listner
document.querySelector('[js-header-auth-logout]').addEventListener('click', userLogout)

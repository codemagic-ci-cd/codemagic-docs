window.desktopScreenWidth = 1001
window.preferredConfigurations = ['yaml', 'flutter']
window.defaultPreferredConfiguration = preferredConfigurations[0]

const svgCopy =
    '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" transform="rotate(90)" data-view-component="true"><path fill-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path><path fill-rule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path></svg>'
const svgCheck =
    '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"><path fill-rule="evenodd" fill="rgb(76, 212, 76)" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>'

const addCopyButtons = (clipboard) => {
    document.querySelectorAll('pre > code').forEach((codeBlock) => {
        const clipboardContainer = document.createElement('div')
        clipboardContainer.className = 'clipboard-container'
        const button = document.createElement('button')
        button.className = 'clipboard-button'
        button.type = 'button'
        button.innerHTML = svgCopy

        button.addEventListener('click', () => {
            clipboard.writeText(codeBlock.innerText).then(
                () => {
                    button.blur()
                    button.innerHTML = svgCheck
                    setTimeout(() => (button.innerHTML = svgCopy), 2000)
                },
                (error) => (button.innerHTML = 'Error'),
            )
        })

        const pre = codeBlock.parentNode

        pre.parentNode.insertBefore(clipboardContainer, pre)
        clipboardContainer.appendChild(button)
        clipboardContainer.appendChild(pre)
    })
}

const initCopyButtons = () => {
    if (navigator && navigator.clipboard) {
        addCopyButtons(navigator.clipboard)
    } else {
        const script = document.createElement('script')
        script.src = 'js/clipboard-polyfill.js'
        script.onload = () => addCopyButtons(clipboard)
        document.body.appendChild(script)
    }
}

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
            document.querySelector('[data-js-header-auth-user]').classList.add('transition-in')
            document.querySelector('[data-js-header-user-avatar]').innerHTML = '<img src="' + auth.avatarUrl + '" alt=""/>'
            setAnalyticsEvents()
        } else {
            window.loggedIn = false
            document.querySelector('[data-js-header-auth-visitor]').classList.add('transition-in')
        }
    } else {
        window.loggedIn = false
        document.querySelector('[data-js-header-auth-visitor]').classList.add('transition-in')
    }
    document.querySelector('[data-js-header-auth-loading]').classList.add('transition-out')
    setTimeout(() => {
        document.querySelector('[data-js-header-auth-loading-grey-line]').style.display = 'none'
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
    document.querySelector('[data-js-header-authentication]').classList.add('loading')
    document.querySelector('[data-js-header-auth-loading]').classList.remove('transition-out')
    document.querySelector('[data-js-header-auth-loading]').classList.add('transition-in')
    document.querySelector('[data-js-header-auth-loading-grey-line]').style.display = 'block'
    if (window.innerWidth < 841) {
        document.querySelector('[data-js-header-menu-toggle]').classList.remove('open')
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
        document.querySelector('[data-js-header-auth-user]').classList.remove('transition-in')
        document.querySelector('[data-js-header-auth-user]').classList.add('transition-out')

        setTimeout(() => {
            document.querySelector('[data-js-header-auth-loading-grey-line]').style.display = 'none'
            document.querySelector('[data-js-header-auth-visitor]').classList.remove('transition-out')
            document.querySelector('[data-js-header-auth-visitor]').classList.add('transition-in')
        }, 1000)
    } catch (error) {
        location.reload()
    } finally {
        auth = { loaded: true }
        window.loggedIn = false
        document.querySelector('[data-js-header-authentication]').classList.remove('loading')
        document.querySelector('[data-js-header-auth-loading]').classList.remove('transition-in')
        document.querySelector('[data-js-header-auth-loading]').classList.add('transition-out')
    }
}
// Logout listner
document.querySelector('[data-js-header-auth-logout]').addEventListener('click', userLogout)

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
    const menuWrap = document.querySelector('[data-js-header-menu-wrap]')
    if (target.hasAttribute('data-js-header-menu-toggle')) {
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

window.addEventListener('load', function () {
    // store tabs variable

    const onTabClick = (event, pane, tabId) => {
        event.preventDefault()

        for (let i = 0; i < pane.children.length; i++) {
            const tab = pane.children[i]
            const active = tab.id == tabId

            if (active) {
                tab.classList.add('active')
            } else {
                tab.classList.remove('active')
            }
        }

        const content = document.querySelector('#' + pane.id + '-content')
        for (let i = 0; i < content.children.length; i++) {
            const tabContent = content.children[i]
            const active = tabContent.id + '-tab' == tabId

            if (active) {
                tabContent.classList.add('active')
            } else {
                tabContent.classList.remove('active')
            }
        }
    }

    const tabPanes = document.querySelectorAll('[data-js-tabs-nav]')
    tabPanes.forEach((pane) => {
        pane.children[0].classList.add('active')
        for (let i = 0; i < pane.children.length; i++) {
            const tab = pane.children[i]
            tab.addEventListener('click', (event) => onTabClick(event, pane, tab.id))
        }
    })

    initCopyButtons()
})

const editableFields = document.querySelectorAll('[data-js-editable-field]')
let editing = false 

editableFields.forEach(field => {
    const input = document.createElement('input')
    const container =  field.parentElement

    field.addEventListener('click', (event) => {
        event.stopPropagation()

        if (editing) return 
    
        container.insertBefore(input, field)
        container.removeChild(field)
        input.value = field.innerText

        editing = true 
    })

    input.addEventListener('click', (event) => {
        event.stopPropagation()
    })

    input.addEventListener('input', (event) => {
        Array.from(editableFields).filter(f => f.getAttribute('editable-id') === field.getAttribute('editable-id')).forEach(f => {
            f.innerText = event.target.value
        })
    })

    document.addEventListener('click', () => {
        if (!container.contains(input)) return 
    
        container.insertBefore(field, input)
        container.removeChild(input)

        editing = false;
    })

    document.addEventListener('keypress', (event) => {
        if (event.key === "Enter") {
            event.stopPropagation();

            container.insertBefore(field, input)
            container.removeChild(input)

            editing = false;
        }
    })
})

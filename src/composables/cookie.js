// Cookie utilities (plain functions, not React hooks)
export const setCookie = (cname, cvalue, exdays) => {
  const date = new Date()
  date.setTime(date.getTime() + exdays * 24 * 60 * 60 * 1000)
  let expires = 'expires=' + date.toUTCString()
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
}

export const getCookie = (cname) => {
  let name = cname + '='
  let ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}

export const removeCookie = (name) => {
  setCookie(name, '', 0)
}

// useCookie hook (factory pattern matching Vue's composable)
export const useCookie = () => ({
  set: setCookie,
  get: getCookie,
  remove: removeCookie
})

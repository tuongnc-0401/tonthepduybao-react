export const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

export const normalize = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '')
    .replaceAll('đ', 'd')
}

export const downloadFromResponse = (headers, data) => {
  const fileName = headers['content-disposition'].replace('attachment;filename=', '')

  const href = URL.createObjectURL(data)
  const link = document.createElement('a')
  link.href = href
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  URL.revokeObjectURL(href)
}

export const customFilter = (inputValue, option) =>
  normalize(option.label.toLowerCase()).includes(normalize(inputValue.trim().toLowerCase()))

export const windowPrint = (printContent) => {
  var win = window.open('', 'PrintWindow')
  win.document.write(printContent)

  setTimeout(function () {
    win.document.close()
    win.focus()
    win.print()
    win.close()
  }, 500)
}

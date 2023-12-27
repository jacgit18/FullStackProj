export const formatDateLong = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export const formatDateLongWithTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const formatDate = (startDate, endDate) => {
  const sDate = new Date(startDate)
  const dateFormat = {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }
  const shortFormat = {
    month: "2-digit",
    day: "2-digit",
  }
  if (endDate) {
    const eDate = new Date(endDate)
    const sFormatted = sDate.toLocaleDateString(
      "en-US",
      sDate.getFullYear() === eDate.getFullYear() ? shortFormat : dateFormat
    )
    const eFormatted = eDate.toLocaleDateString("en-US", dateFormat)
    return `${sFormatted}-${eFormatted}`
  }

  return sDate.toLocaleDateString("en-US", dateFormat)
}

export const formatMoney = (amount, notRounded) => {
  let options = {
    style: "currency",
    currency: "USD",
  }
  if (notRounded) {
    options.maximumSignificantDigits = 5
  }
  const formatter = new Intl.NumberFormat("en-US", options)

  return formatter.format(amount)
}

export const formatPhone = (phoneString) => {
  const cleaned = ("" + phoneString).replace(/\D/g, "")
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    var intlCode = match[1] ? "+1 " : ""
    return `${intlCode} (${match[2]}) ${match[3]}-${match[4]}`
  }
  return null
}

export const bytesToSize = (bytes, suffix, decimals = 2) => {
  if (bytes === 0) return "0 Bytes"

  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  let i
  if (suffix) i = sizes.findIndex((suff) => suff === suffix)
  else i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export const toBase64 = (file) => {
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

const axios = require('axios')

const formData = url => ({
  url: url,
  headers: {
    'x-custom-key': 'string'
  },
  refresh: false,
  incognito: false,
  ipAddress: '32.4.2.223',
  language: 'en'
})

const convertReceiptFromURL = async url => {
  console.log('converting receipt')


  const taggun = axios.create({
    baseURL: 'https://api.taggun.io/api/',
    headers: { apikey: process.env.TAGKEY }
  })
  const body = formData(url)

  try {
    const response = await taggun.post('/receipt/v1/verbose/url', body)
    const dataObj = response.data
    // console.log('receipt converted', dataObj)
    return dataObj
  } catch (err) {
    console.log(err)
  }
}

//console.log(convertReceiptFromURL('https://www.thebillfold.com/wp-content/uploads/2016/04/1af7r52mmXsEGqlpeM0mhiQ.jpeg'))

module.exports = {convertReceiptFromURL}

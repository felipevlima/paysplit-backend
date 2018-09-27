const axios = require('axios');

module.exports = function(app) {

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

  const convertingReceiptFromURL = async url => {
    console.log('converting receipt')

    const Key = process.env.TAGKEY
    const taggun = axios.create({
      baseURL: 'https://api.taggun.io/api/',
      headers: { apikey: Key}
    })
    const body = formData(url)

    try {
      const response = await taggun.post('/receipt/v1/verbose/url', body)
      const dataObj = response.data
      console.log('receipt converted', dataObj)
      return dataObj
    } catch(err) {
      console.log(err)
    }
  }
  //console.log(convertingReceiptFromURL('https://www.thebillfold.com/wp-content/uploads/2016/04/1af7r52mmXsEGqlpeM0mhiQ.jpeg'))
}

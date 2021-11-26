import culture from '../culture.js'
import distance from '../經緯度間距離.js'
import location from '../template/location.js'
import cheerio from 'cheerio'
import axios from 'axios'

export default async (event) => {
  const replies = []
  try {
    for (let i = 0; i < culture.length; i++) {
      if (distance(event.message.latitude, event.message.longitude, culture[i].Latitude, culture[i].Longitude, 'K') < 10) {
        replies.push({
          Caption: culture[i].Caption,
          DetailUrl: culture[i].DetailUrl,
          Venue: culture[i].Venue,
          EndDateVM: {
            Date: culture[i].EndDateVM.Date,
            Week: culture[i].EndDateVM.Week,
            Time: culture[i].EndDateVM.Time
          }
        })
        console.log(replies)
      }
    }
    for (let i = 0; i < 5; i++) {
      const { data } = await axios.get(`https://cultureexpress.taipei/${replies[i].DetailUrl}`)
      const $ = cheerio.load(data)
      location.contents[i].hero.url = `https://cultureexpress.taipei/${$('#block').find('img').eq(0).attr('src')}`
      location.contents[i].body.contents[0].text = replies[i].Caption
      location.contents[i].body.contents[1].contents[0].contents[0].text = replies[i].Venue
      location.contents[i].body.contents[2].contents[1].contents[0].text = `${replies[i].EndDateVM.Date}${replies[i].EndDateVM.Week}${replies[i].EndDateVM.Time}`
    }
    event.reply('123')
  } catch (error) {
    console.log(error)
    event.reply('錯誤')
  }
}
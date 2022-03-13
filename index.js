const axios = require('axios')
const WasteOfSession = require("wasteof-client")
const pass = process.env['password']
const username = 'art'
const apiKey = process.env['api-keyy']
const imgbbUploader = require("imgbb-uploader");
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send(`this is a webserver to ensure replit doesn't shut down the bot. <br> <a href="https://wasteof.money/@${username}">page for the bot</a>`));

app.listen(port, () => console.log(`Example app listening`));

let wasteof = new WasteOfSession(username, pass)
  wasteof.login()
    .then(data => {
      wasteof.setBio(`This is a bot that posts a random work of art from the Metropolitan Museum Of Art 4 times a day. @jeffalo please don't ban me`)
    })

async function postWorkOfArt() {
  await getRandomArt(handleArt);
}
function handleArt(imageData, museumData) {
  const postData = `<b>${museumData.artistDisplayName}.</b> <i><b>"${museumData.title}"</b></i> <i>${museumData.medium}, ${museumData.objectDate}</i> <i>${museumData.culture}.</i> <p>${museumData.creditLine}. ${museumData.objectURL}</p> ${imageData.img}`
  let wasteof = new WasteOfSession(username, pass)
  wasteof.login()
    .then(data => {
      wasteof.postAndLove(postData, null)
      console.log('posted successfully')
    })
}
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function getRandomArt(callback) {
  axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects`)
    .then(res => {
      const ids = res.data.objectIDs
      const randomId = ids[Math.floor(Math.random()*ids.length)];
      axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${randomId}`)
        .then(res => {
          uploadImage(res.data, callback)
        })
    })
    .catch(function(err) {
      console.log(res.data)
    })
}
function uploadImage(urlData, callback) {
  if (urlData.primaryImage.length === 0) {
    if (urlData.primaryImageSmall.length === 0) {
      postWorkOfArt()
    } else {
      const options = {
        apiKey: process.env['api-keyy'],
        imageUrl: urlData.primaryImageSmall,
      };
      imgbbUploader(options)
        .then((response) => {
          response.img = `<img src="${response.url}">`
          callback(response, urlData)
        })
        .catch((error) => console.log(error));
    }
  } else {
    const options = {
      apiKey: process.env['api-keyy'],
      imageUrl: urlData.primaryImage,
    };
    imgbbUploader(options)
      .then((response) => {
        response.img = `<img src="${response.url}">`
        callback(response, urlData)
      })
      .catch((error) => console.log(error));
  }
}
postWorkOfArt()
setInterval(postWorkOfArt, 86400000);

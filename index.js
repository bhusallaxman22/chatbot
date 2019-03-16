var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'Laxman_copy_pasting') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})


// API End Point - added by Stefan

app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            if (text === 'hi') {
                sendGenericMessage(sender)
                continue
            }
            sendTextMessage(sender, "parrot: " + text.substring(0, 200))
        }
        if (event.postback) {
            text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
})

var token = " enter token here"

// function to echo back messages - added by Stefan

function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


// Send an test message back as two cards.

function sendGenericMessage(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Laxman Chatbot",
                    "subtitle": "FOllow on Social medias",
                    "image_url": "https://scontent.fktm8-1.fna.fbcdn.net/v/t1.0-9/36137114_2074089609525326_2968567376498393088_n.jpg?_nc_cat=111&_nc_ht=scontent.fktm8-1.fna&oh=4f5813edcb66a672871a34f1c72212ef&oe=5D04CB20",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.facebook.com/l.b057",
                        "title": "Facebook"
                    }, {
                        "type": "web_url",
                        "url": "https://www.instagram.com/lakshman.22/",
                        "title": "Instagram"
                    },{
                        "type": "web_url",
                        "url": "https://twitter.com/laxmanbhusal22",
                        "title": "Twitter"
                    }],
                }, {
                    "title": "About Me",
                    "subtitle": "Aking the Deep Questions",
                    "image_url": "https://images.tech.co/wp-content/uploads/2018/05/04124009/What-Is-The-Deep-Web.jpg",
                    "buttons": [{
                        "type": "postback",
                        "title": "Who are you?",
                        "payload": "Not a ghost obviously. A intellectual individual. Enthusiast Developer. Music Lover,Watches a lot of Tv Series.",
                    },{
                        "type": "postback",
                        "title": "What can you do?",
                        "payload": "A lots of things. I can make interactive website using html, css and javascript.I have intermediate knowlwdge of python,Golang and React.",
                    }, {
                        "type": "postback",
                        "title": "Contact Me",
                        "payload": "I am not a social guy i don't feel comfortable stranger contacting me.",
                    }],
                },  {
                    "title": "Learning More",
                    "subtitle": "Aking the Deep Questions",
                    "image_url": "http://www.brandknewmag.com/wp-content/uploads/2015/12/cortana.jpg",
                    "buttons": [{
                        "type": "postback",
                        "title": "Reach me",
                        "payload": "Spread your Hands,you will know i'm beyond law. Also, my email is Laxmanbhusal612@gmail.com",
                    },{
                        "type": "postback",
                        "title": "Machine Learning",
                        "payload": "Use python to teach your maching in 16D space in 15min",
                    }, {
                        "type": "postback",
                        "title": "Announcement",
                        "payload": "Stop Bullying.",
                    }],
                }]  
            } 
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


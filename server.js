const path = require('path');
const express = require('express')
const app = express()
const cors = require('cors');

const {bots, playerRecord} = require(path.join(__dirname, 'data'));
const {shuffleArray} = require(path.join(__dirname, 'utils'));

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: 'c0dbddc6e6a04b5e893f08c2e345ac6b',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

app.use(cors());
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/robots', (req, res) => {
    try {
        res.status(200).send(botsArr)
    } catch (error) {
        console.log('ERROR GETTING BOTS', error)
        res.sendStatus(400)
    }
})

app.get('/api/robots/five', (req, res) => {
    try {
        let shuffled = shuffleArray(bots)
        let choices = shuffled.slice(0, 5)
        let compDuo = shuffled.slice(6, 8)
        res.status(200).send({choices, compDuo})
    } catch (error) {
        console.log('ERROR GETTING FIVE BOTS', error)
        res.sendStatus(400)
    }
})

app.post('/api/duel', (req, res) => {
    try {
        // getting the duos from the front end
        let {compDuo, playerDuo} = req.body

        // adding up the computer player's total health and attack damage
        let compHealth = compDuo[0].health + compDuo[1].health
        let compAttack = compDuo[0].attacks[0].damage + compDuo[0].attacks[1].damage + compDuo[1].attacks[0].damage + compDuo[1].attacks[1].damage
        
        // adding up the player's total health and attack damage
        let playerHealth = playerDuo[0].health + playerDuo[1].health
        let playerAttack = playerDuo[0].attacks[0].damage + playerDuo[0].attacks[1].damage + playerDuo[1].attacks[0].damage + playerDuo[1].attacks[1].damage
        
        // calculating how much health is left after the attacks on each other
        let compHealthAfterAttack = compHealth - playerAttack
        let playerHealthAfterAttack = playerHealth - compAttack

        // comparing the total health to determine a winner
        if (compHealthAfterAttack > playerHealthAfterAttack) {
            playerRecord.losses++
            res.status(200).send('You lost!')
        } else {
            playerRecord.losses++
            res.status(200).send('You won!')
        }
    } catch (error) {
        console.log('ERROR DUELING', error)
        res.sendStatus(400)
    }
})

app.get('/api/player', (req, res) => {
    try {
        res.status(200).send(playerRecord)
    } catch (error) {
        console.log('ERROR GETTING PLAYER STATS', error)
        res.sendStatus(400)
    }
})



app.post('/api/duel', (req, res) => {
    try {
    } catch (error) {
      console.log('ERROR DUELING', error);
      rollbar.error(error);
      res.sendStatus(400);
    }
  });

app.get('/api/robots', async (req, res) => {
    try {
      const bots = await getBots();
      res.status(200).send(bots);
    } catch (error) {
      console.log('ERROR GETTING BOTS', error);
      rollbar.warning('Slow response time for /api/robots');
      res.sendStatus(400);
    }
});

app.get('/api/player', (req, res) => {
    try {
      res.status(200).send(playerRecord);
      rollbar.info('/api/player called');
    } catch (error) {
      console.log('ERROR GETTING PLAYER STATS', error);
      rollbar.error(error);
      res.sendStatus(400);
    }
});

process.on('uncaughtException', (err) => {
    console.error(err);
    rollbar.critical(err);
    process.exit(1);
});

app.listen(4000, () => {
    console.log(`Listening on 4000`)
  })
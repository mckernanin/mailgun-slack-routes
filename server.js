const express = require('express');
const bodyParser = require('body-parser');
const Slack = require('node-slack');

const slack = new Slack(process.env.SLACK_URL);
const app = express();
const port = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/email', (req, res) => {
  res.render('email');
});

app.post('/email', (req, res) => {
  const mail = req.body;
  if (mail.subject) {
    slack.send({
      text: mail.subject,
      icon_emoji: ':envelope:',
      username: mail.recipient,
      attachments: [
        {
          fallback: `Incoming email from ${mail.sender} titled ${mail.subject}`,
          color: 'good',
          fields: [
            {
              title: 'Sender',
              value: mail.sender,
            },
            {
              title: 'Subject',
              value: mail.subject,
            },
          ],
        },
        {
          fallback: 'Email content',
          text: mail['body-plain'],
        },
      ],
    });
  }
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Our app is running on http://localhost:${port}`);
});

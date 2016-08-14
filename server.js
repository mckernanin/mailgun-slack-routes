var express = require('express');
var bodyParser = require('body-parser');
var Slack = require('node-slack');
var slack = new Slack(process.env.SLACK_URL);
var app     = express();
var port    = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', function(req, res) {
	console.log(req.query);
	res.render('index');
});

app.post('/email', function(req, res) {
	var mail = req.body;
	slack.send({
		text: 'Email',
		icon_emoji: ':envelope:',
		username: mail.recipient,
		attachments: [
			{
				fallback: 'Incoming email from ' + mail.sender + ' titled ' + mail.subject,
				color: 'good',
				fields: [
					{
						title: 'Sender',
						value: mail.sender
					},
					{
						title: 'Subject',
						value: mail.subject
					},
				],
			},
			{
				fallback: 'Email content',
				text: mail['body-plain']
			},
		],

	});
	res.sendStatus(200);
});

app.listen(port, function() {
	console.log('Our app is running on http://localhost:' + port);
});

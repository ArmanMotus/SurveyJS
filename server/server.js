const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors({
    origin: 'https://motustest.netlify.app', // Replace with your Netlify domain
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.static(path.join(__dirname, '../public')));

app.post('/submit-survey', (req, res) => {
    const { responses, demographicResponses } = req.body;

    console.log('Received responses:', responses);
    console.log('Received demographic responses:', demographicResponses);

    if (!responses || !Array.isArray(responses)) {
        return res.status(400).json({ error: 'Invalid responses' });
    }

    if (!demographicResponses || !Array.isArray(demographicResponses)) {
        return res.status(400).json({ error: 'Invalid demographic responses' });
    }

    try {
        fs.writeFileSync(path.join(__dirname, 'responses.json'), JSON.stringify(responses, null, 2));
        fs.writeFileSync(path.join(__dirname, 'demographicResponses.json'), JSON.stringify(demographicResponses, null, 2));
        res.status(200).json({ message: 'Responses saved successfully' });
    } catch (error) {
        console.error('Error saving responses:', error);
        res.status(500).json({ error: 'Failed to save responses' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

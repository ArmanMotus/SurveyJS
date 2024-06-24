const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.post('/submit-survey', (req, res) => {
    const responses = req.body.responses;
    const demographicResponses = req.body.demographicResponses;

    if (!responses || !Array.isArray(responses)) {
        return res.status(400).json({ error: 'Invalid responses' });
    }

    if (!demographicResponses || !Array.isArray(demographicResponses)) {
        return res.status(400).json({ error: 'Invalid demographic responses' });
    }

    // Save the responses to a file (for simplicity, we use JSON files)
    fs.writeFileSync('responses.json', JSON.stringify(responses, null, 2));
    fs.writeFileSync('demographicResponses.json', JSON.stringify(demographicResponses, null, 2));

    res.status(200).json({ message: 'Responses saved successfully' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

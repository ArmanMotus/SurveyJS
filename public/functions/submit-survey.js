const { writeFile, readFile } = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    try {
        const data = JSON.parse(event.body);
        const responsesPath = path.resolve(__dirname, 'responses.json');
        
        // Read the existing responses
        let existingResponses = [];
        try {
            const fileContents = await readFile(responsesPath, 'utf8');
            existingResponses = JSON.parse(fileContents);
        } catch (error) {
            // If file does not exist, continue with an empty array
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }

        // Add the new response
        existingResponses.push(data);

        // Write the updated responses back to the file
        await writeFile(responsesPath, JSON.stringify(existingResponses, null, 2));

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Responses saved successfully' }),
        };
    } catch (error) {
        console.error('Error processing submission', error);
        return {
            statusCode: 500,
            body: 'Internal Server Error',
        };
    }
};

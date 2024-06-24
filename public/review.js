document.addEventListener('DOMContentLoaded', () => {
    const responseContainer = document.getElementById('response-container');
    const demographicContainer = document.getElementById('demographic-container');
    const responses = JSON.parse(localStorage.getItem('responses'));
    const demographicResponses = JSON.parse(localStorage.getItem('demographicResponses'));

    if (responses) {
        const responseHeading = document.createElement('h2');
        responseHeading.textContent = 'Survey Responses';
        responseContainer.appendChild(responseHeading);

        responses.forEach((response, index) => {
            const responseBlock = document.createElement('div');
            responseBlock.className = 'response-block';
            const questionHeading = document.createElement('h3');
            questionHeading.textContent = `Question Set ${index + 1}`;
            responseBlock.appendChild(questionHeading);

            Object.entries(response).forEach(([key, value]) => {
                if (key !== 'taskSetIndex') {
                    const responseItem = document.createElement('p');
                    responseItem.textContent = `${key}: ${value}`;
                    responseBlock.appendChild(responseItem);
                }
            });

            responseContainer.appendChild(responseBlock);
        });
    }

    if (demographicResponses) {
        const demographicHeading = document.createElement('h2');
        demographicHeading.textContent = 'Demographic Responses';
        demographicContainer.appendChild(demographicHeading);

        Object.entries(demographicResponses).forEach(([key, value]) => {
            const demographicItem = document.createElement('p');
            demographicItem.textContent = `${key}: ${value}`;
            demographicContainer.appendChild(demographicItem);
        });
    }

    document.getElementById('done-button').addEventListener('click', () => {
        window.location.href = 'thank-you.html';
    });
});

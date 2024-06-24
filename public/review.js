document.addEventListener('DOMContentLoaded', () => {
    const responses = JSON.parse(localStorage.getItem('responses'));

    const reviewContainer = document.getElementById('review-container');
    reviewContainer.innerHTML = '<pre>' + JSON.stringify(responses, null, 2) + '</pre>';

    document.getElementById('submit-button').addEventListener('click', () => {
        const demographicResponses = []; // Add logic to collect demographic responses if needed

        console.log('Submitting responses:', responses);
        console.log('Submitting demographic responses:', demographicResponses);

        fetch('http://localhost:3000/submit-survey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ responses, demographicResponses }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            window.location.href = 'thank-you.html';
        })
        .catch(error => console.error('Error:', error));
    });
});

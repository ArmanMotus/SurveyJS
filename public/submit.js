document.addEventListener('DOMContentLoaded', () => {
    const responses = JSON.parse(localStorage.getItem('responses'));
    const demographicResponses = JSON.parse(localStorage.getItem('demographicResponses'));

    console.log('Submitting responses:', responses);
    console.log('Submitting demographic responses:', demographicResponses);

    fetch('http://localhost:3000/submit-survey', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responses, demographicResponses: [demographicResponses] }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        window.location.href = 'review.html';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an issue submitting your responses. Please try again.');
    });
});

document.getElementById('final-submit-button').addEventListener('click', () => {
    // Retrieve responses from localStorage
    const responses = JSON.parse(localStorage.getItem('responses'));

    // Check if responses exist
    if (!responses) {
        alert('No responses found. Please complete the survey first.');
        return;
    }

    // Submit the responses to the server
    fetch('http://localhost:3000/submit-survey', {  // Replace with your server URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(responses),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Navigate to the thank you page
        window.location.href = 'thank-you.html';
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('There was an error submitting your responses.');
    });
});

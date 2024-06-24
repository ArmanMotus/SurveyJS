let currentDemographicIndex = 0;
let demographicQuestions = [];
const demographicResponses = {};

document.addEventListener('DOMContentLoaded', () => {
    fetch('demographics.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            demographicQuestions = data;
            console.log('Loaded demographic questions:', demographicQuestions);
            loadDemographicQuestion(currentDemographicIndex);
        })
        .catch(error => console.error('Error loading demographic questions:', error));

    document.getElementById('next-question-button').addEventListener('click', () => {
        console.log('Next button clicked');
        const questionContainer = document.getElementById('question-container');
        const input = questionContainer.querySelector('input, select, div');
        console.log('Current input:', input);

        if (!input) {
            alert('There is an issue with loading the question input. Please try again.');
            return;
        }

        if (input.tagName === 'DIV') {
            const selectedOption = input.querySelector('input[type="radio"]:checked');
            if (!selectedOption) {
                alert('This question is mandatory.');
                return;
            }
            demographicResponses[input.dataset.name] = selectedOption.value;
        } else if (!input.value) {
            alert('This question is mandatory.');
            return;
        } else {
            demographicResponses[input.name] = input.value;
        }

        console.log('Current demographic responses:', demographicResponses);

        currentDemographicIndex++;
        if (currentDemographicIndex < demographicQuestions.length) {
            loadDemographicQuestion(currentDemographicIndex);
        } else {
            localStorage.setItem('demographicResponses', JSON.stringify(demographicResponses));
            window.location.href = 'submit.html';
        }
    });
});

function loadDemographicQuestion(index) {
    console.log('Loading demographic question:', index);
    const questionContainer = document.getElementById('question-container');
    const questionData = demographicQuestions[index];
    questionContainer.innerHTML = '';

    const label = document.createElement('label');
    label.textContent = questionData.question;
    questionContainer.appendChild(label);

    let input;
    if (questionData.type === 'select') {
        input = document.createElement('select');
        input.name = questionData.name;
        questionData.options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            input.appendChild(optionElement);
        });
    } else if (questionData.type === 'radio') {
        input = document.createElement('div');
        input.className = 'radio-group';
        input.dataset.name = questionData.name;
        questionData.options.forEach(option => {
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = questionData.name;
            radio.value = option;
            const radioLabel = document.createElement('label');
            radioLabel.textContent = option;
            input.appendChild(radio);
            input.appendChild(radioLabel);
        });
    } else {
        input = document.createElement('input');
        input.type = questionData.type;
        input.name = questionData.name;
    }
    questionContainer.appendChild(input);
    console.log('Question loaded:', questionData);
}

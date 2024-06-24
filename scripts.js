let currentTaskSetIndex = 0;
let taskSets = [];
const responses = [];
const demographicResponses = [];
let demographicQuestions = [];
let currentDemographicIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    // Load demographic questions from the JSON file
    fetch('demographics.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Demographic questions loaded:', data); // Debugging statement
            demographicQuestions = data;
            loadDemographicQuestion(currentDemographicIndex);
        })
        .catch(error => console.error('Error loading demographic questions:', error));

    document.getElementById('demographic-next-button').addEventListener('click', () => {
        const form = document.getElementById('demographic-form');
        const formData = new FormData(form);
        const response = {};
        formData.forEach((value, key) => {
            response[key] = value;
        });
        demographicResponses.push(response);

        currentDemographicIndex++;
        if (currentDemographicIndex < demographicQuestions.length) {
            loadDemographicQuestion(currentDemographicIndex);
        } else {
            // Hide demographic container and show maxdiff container
            document.getElementById('demographic-container').style.display = 'none';
            document.getElementById('maxdiff-container').style.display = 'block';
            loadTaskSet(currentTaskSetIndex);
        }
    });

    document.getElementById('next-button').addEventListener('click', () => {
        const mostSelected = document.querySelector('input[name="most"]:checked');
        const leastSelected = document.querySelector('input[name="least"]:checked');

        if (!mostSelected || !leastSelected) {
            alert('Please select both the highest and lowest priority items.');
            return;
        }

        if (mostSelected.value === leastSelected.value) {
            alert('The highest and lowest priority items cannot be the same.');
            return;
        }

        // Create a response object for the current task set
        const response = { taskSetIndex: currentTaskSetIndex + 1 };

        taskSets[currentTaskSetIndex].attributes.forEach((item, index) => {
            if (index === parseInt(mostSelected.value)) {
                response[item] = "1";
            } else if (index === parseInt(leastSelected.value)) {
                response[item] = "-1";
            } else {
                response[item] = "0";
            }
        });

        // Store the response for the current task set
        responses.push(response);

        // Load the next task set
        currentTaskSetIndex++;
        if (currentTaskSetIndex < taskSets.length) {
            loadTaskSet(currentTaskSetIndex);
        } else {
            // Save responses to localStorage and navigate to the submit page
            localStorage.setItem('responses', JSON.stringify(responses));
            window.location.href = 'submit.html';
        }
    });

    document.getElementById('submit-button').addEventListener('click', () => {
        // Save responses to localStorage and navigate to the submit page
        localStorage.setItem('responses', JSON.stringify(responses));
        window.location.href = 'submit.html';
    });

    // Load MaxDiff tasks from the JSON file
    fetch('tasks.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Tasks loaded:', data); // Debugging statement
            taskSets = data;
        })
        .catch(error => console.error('Error loading tasks:', error));
});

function loadDemographicQuestion(index) {
    const questionContainer = document.getElementById('demographic-container');
    const questionElement = document.getElementById('demographic-question');
    const inputElement = document.getElementById('demographic-input');
    questionContainer.style.display = 'block';

    const question = demographicQuestions[index];
    questionElement.innerText = question.question;

    let inputHTML = '';
    if (question.type === 'text') {
        inputHTML = `<input type="text" name="${question.name}" required>`;
    } else if (question.type === 'radio') {
        question.options.forEach(option => {
            inputHTML += `
                <label>
                    <input type="radio" name="${question.name}" value="${option}" required>
                    ${option}
                </label><br>
            `;
        });
    } else if (question.type === 'select') {
        inputHTML = `<select name="${question.name}" required>`;
        question.options.forEach(option => {
            inputHTML += `<option value="${option}">${option}</option>`;
        });
        inputHTML += '</select>';
    }

    inputElement.innerHTML = inputHTML;
}

function loadTaskSet(index) {
    const surveyContainer = document.getElementById('survey');
    const pagination = document.querySelector('.pagination span');
    surveyContainer.innerHTML = ''; // Clear previous task set
    const taskSet = taskSets[index];

    taskSet.attributes.forEach((item, i) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="radio" name="most" value="${i}"></td>
            <td>${item}</td>
            <td><input type="radio" name="least" value="${i}"></td>
        `;
        surveyContainer.appendChild(row);
    });

    document.querySelectorAll('input[name="most"]').forEach(radio => {
        radio.addEventListener('change', () => {
            document.querySelectorAll('input[name="least"]').forEach(leastRadio => {
                if (leastRadio.value === radio.value) {
                    leastRadio.checked = false;
                }
            });
        });
    });

    document.querySelectorAll('input[name="least"]').forEach(radio => {
        radio.addEventListener('change', () => {
            document.querySelectorAll('input[name="most"]').forEach(mostRadio => {
                if (mostRadio.value === radio.value) {
                    mostRadio.checked = false;
                }
            });
        });
    });

    // Update the pagination text
    pagination.textContent = `${index + 1}/${taskSets.length}`;
}

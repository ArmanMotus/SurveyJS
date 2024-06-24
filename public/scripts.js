let currentTaskSetIndex = 0;
let taskSets = [];
const responses = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch('tasks.json')
        .then(response => response.json())
        .then(data => {
            taskSets = data;
            loadTaskSet(currentTaskSetIndex);
        })
        .catch(error => console.error('Error loading tasks:', error));

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

        responses.push(response);

        currentTaskSetIndex++;
        if (currentTaskSetIndex < taskSets.length) {
            loadTaskSet(currentTaskSetIndex);
        } else {
            localStorage.setItem('responses', JSON.stringify(responses));
            window.location.href = 'demographic.html';
        }
    });
});

function loadTaskSet(index) {
    const surveyContainer = document.getElementById('survey');
    const pagination = document.querySelector('.pagination span');
    surveyContainer.innerHTML = '';
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

    pagination.textContent = `${index + 1}/${taskSets.length}`;
}

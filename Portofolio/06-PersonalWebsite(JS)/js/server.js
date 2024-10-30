
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const table = document.querySelector('#Schedule table'); 

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const date = document.getElementById('date').value;
        const startTime = document.getElementById('start-time').value;
        const endTime = document.getElementById('end-time').value;
        const activity = document.getElementById('activity').value;
        const place = document.getElementById('place').value;
        const type = document.getElementById('type').value;
        const notes = document.getElementById('notes').value;
        const flag = document.getElementById('flag').value;
        const status = document.getElementById('status').checked ? 'Busy' : 'Free';

        const newRow = document.createElement('tr');
        newRow.innerHTML = `<td>${date}</td><td>${startTime}</td><td>${endTime}</td><td>${activity}</td><td>${place}</td><td>${type}</td><td>${notes}</td><td style="background-color: ${flag}">${status}</td>`;

        table.appendChild(newRow);

        form.reset();
    });
});

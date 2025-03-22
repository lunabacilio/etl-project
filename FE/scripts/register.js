const form = document.getElementById('new-request-form');
// Listen for the form submit event
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form behavior

    // Get the values from the inputs
    const name = document.getElementById('nombreDataset').value.trim();
    const descript = document.getElementById('descripcion').value.trim();
    const fuentes = ['fuente1', 'fuente2', 'fuente3']
        .filter(id => document.getElementById(id).checked)
        .map(id => document.getElementById(id).value)
        .join(', ');
    const inputOther = document.getElementById('otro').value.trim();
    const inputFreq = document.getElementById('frecuencia').value;
    const inputPrior = document.getElementById('prioridad').value;

    // Validate required fields
    if (!name || !descript || !fuentes || inputFreq === 'Selecciona la frecuencia de actualización' || inputPrior === 'Prioridad') {
        alert('Please fill in all required fields.');
        return; // Stop form submission
    }

    // Create the data object to send to the server
    const data = {
        name: name,
        descript: descript,
        fuentes: fuentes,
        other: inputOther,
        frec: inputFreq,
        prior: inputPrior
    };

    console.log('Sending data:', data); // Debug the data being sent

    // Send the data to the server using fetch
    fetch('../BE/requests_api.php', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('Server response:', response); // Debug the server response
        if (!response.ok) {
            throw new Error('Error sending the request');
        }
        return response.json();
    })
    .then(result => {
        const successAlert = document.getElementById('success-alert');
        successAlert.style.display = 'block'; // Show the success message
        setTimeout(() => {
            successAlert.style.display = 'none'; // Hide the message after 3 seconds
            form.reset(); // Reset the form
        }, 3000);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error registering the request.');
    });
});
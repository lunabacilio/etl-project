document.addEventListener('DOMContentLoaded', function() {
    // Fetch all requests when the page loads
    fetchRequests();

    // Set up the clear all button handler
    document.querySelector('.btn-danger').addEventListener('click', function() {
        clearAllRequests();
    });
});

// Function to fetch all requests from the API
function fetchRequests() {
    fetch('../BE/requests_api.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener las solicitudes');
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            console.error('API Error:', data.error);
            document.getElementById('list').innerHTML = '<tr><td colspan="7" class="text-center">No hay solicitudes disponibles</td></tr>';
        } else {
            // Render the requests in the table
            renderRequestsTable(data);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('list').innerHTML = '<tr><td colspan="7" class="text-center">Error al cargar las solicitudes</td></tr>';
    });
}

// Function to render the requests in the table
function renderRequestsTable(requests) {
    const tableBody = document.getElementById('list');
    
    // Clear existing table content
    tableBody.innerHTML = '';
    
    if (requests.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center">No hay solicitudes registradas</td></tr>';
        return;
    }
    
    // Add each request to the table
    requests.forEach(request => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${request.name}</td>
            <td>${request.descript}</td>
            <td>${request.fuentes}</td>
            <td>${request.other || '-'}</td>
            <td>${request.frec}</td>
            <td>${request.prior}</td>
            <td>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${request.id}">
                    Eliminar
                </button>
            </td>
        `;
        tableBody.appendChild(row);
        
        // Add event listener to the delete button
        row.querySelector('.delete-btn').addEventListener('click', function() {
            deleteRequest(request.id);
        });
    });
    
    // Initialize DataTable if needed (after populating data)
    if ($.fn.DataTable.isDataTable('#requestsTable')) {
        $('#requestsTable').DataTable().destroy();
    }
    
    $('#requestsTable').DataTable({
        pageLength: 5,
        lengthChange: false,
        lengthMenu: [5, 10, 15, 20],
        dom: '<"row"<"col-sm-12"f>>rt<"row"<"col-sm-6"i><"col-sm-6"p>>',
        language: {
            search: "Buscar:",
            info: "Mostrando _START_ a _END_ de _TOTAL_ solicitudes",
            infoEmpty: "Mostrando 0 a 0 de 0 solicitudes",
            infoFiltered: "(filtrado de _MAX_ solicitudes totales)",
            zeroRecords: "No se encontraron solicitudes",
            paginate: {
                first: "Primero",
                last: "Último",
                next: "Siguiente",
                previous: "Anterior"
            }
        }
    });
}

// Function to delete a single request
function deleteRequest(id) {
    // Show deletion alert
    const deleteAlert = document.getElementById('delete-req-alert');
    deleteAlert.style.display = 'block';
    
    fetch(`../BE/requests_api.php?id=${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar la solicitud');
        }
        return response.json();
    })
    .then(result => {
        console.log('Server response:', result);
        
        // Hide the alert after 2 seconds
        setTimeout(() => {
            deleteAlert.style.display = 'none';
            // Refresh the table
            fetchRequests();
        }, 2000);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al eliminar la solicitud');
        deleteAlert.style.display = 'none';
    });
}

// Function to clear all requests
function clearAllRequests() {
    // Show the delete alert
    const deleteAlert = document.getElementById('delete-alert');
    deleteAlert.style.display = 'block';
    
    // Ask for confirmation
    if (confirm('¿Está seguro que desea eliminar todas las solicitudes?')) {
        // In a real implementation, you would create an API endpoint to delete all requests
        // For now, we'll delete each request individually
        fetch('../BE/requests_api.php', {
            method: 'GET',
        })
        .then(response => response.json())
        .then(requests => {
            if (!requests.error) {
                // Create a promise chain to delete all requests
                let deletePromises = requests.map(request => 
                    fetch(`../BE/requests_api.php?id=${request.id}`, {
                        method: 'DELETE'
                    })
                );
                
                Promise.all(deletePromises)
                .then(() => {
                    // Hide the alert after all deletions complete
                    setTimeout(() => {
                        deleteAlert.style.display = 'none';
                        // Refresh the table
                        fetchRequests();
                    }, 2000);
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            deleteAlert.style.display = 'none';
        });
    } else {
        deleteAlert.style.display = 'none';
    }
}
<?php
header('Content-Type: application/json');

// Database connection configuration
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'reqdev';

// Create connection
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(array('error' => 'Connection failed: ' . $conn->connect_error)));
}

// Handle different HTTP methods
$request_method = $_SERVER['REQUEST_METHOD'];

switch ($request_method) {
    case 'GET':
        $sql = 'SELECT id, name, descript, fuentes, other, frec, prior, created_at FROM requests';
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $requests = array();
            while ($row = $result->fetch_assoc()) {
                $requests[] = $row;
            }
            echo json_encode($requests);
        } else {
            echo json_encode(array('error' => 'No requests found'));
        }
        break;

    // POST request - Insert a request
    case 'POST':
        //get the data sent from the backend
        $data = json_decode(file_get_contents('php://input'), true);

        // validate that the fields are not empty and are correct
        if (!empty($data['name']) && !empty($data['descript']) && !empty($data['fuentes']) && !empty($data['frec']) && !empty($data['prior'])) {
            // SQL query to insert the data
            $sql = "INSERT INTO requests (name, descript, fuentes, other, frec, prior) VALUES ('" . $data['name'] . "', '" . $data['descript'] . "', '" . $data['fuentes'] . "', '" . $data['other'] . "', '" . $data['frec'] . "', '" . $data['prior'] . "')";
            if ($conn->query($sql) === TRUE) {
                echo json_encode(array('message' => 'Request added successfully'));
            } else {
                echo json_encode(array('error' => 'Error: ' . $sql . '<br>' . $conn->error));
            }
        } else {
            // If required data is missing
            http_response_code(400);
            echo json_encode(array('error' => 'Missing required fields'));
        }
        break;

    // DELETE request - Delete a request
    case 'DELETE':
        // Get the request ID from the URL
        $id = intval($_GET['id']);

        //check that the ID is valid
        if ($id > 0) {
            // SQL query to delete the request with the specified ID
            $sql = "DELETE FROM requests WHERE id = $id";
            if ($conn->query($sql) === TRUE) {
                // Send a success response
                echo json_encode(array('message' => 'User successfully deleted'));
            } else {
                // Send an error message if the delete operation failed
                echo json_encode(array('error' => 'Error deleting the user: ' . $conn->error));
            }
        } else {
            // Send an error message if the ID is invalid
            http_response_code(400);
            echo json_encode(array('error' => 'Invalid ID'));
        }
        break;

    default:
        // Method not allowed
        http_response_code(405);
        echo json_encode(array('error' => 'Method not allowed'));
        break;
}

$conn->close();
?>
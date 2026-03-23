<?php
header('Content-Type: application/json');

// Get the raw POST data from the AJAX request
$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

if ($_SERVER["REQUEST_METHOD"] == "POST" && $data) {
    
    // Sanitize inputs
    $name = strip_tags(trim($data["name"]));
    $email = filter_var(trim($data["email"]), FILTER_SANITIZE_EMAIL);
    $phone = strip_tags(trim($data["phone"]));
    $subject_input = strip_tags(trim($data["subject"]));
    $message = trim($data["message"]);
    
    // Get target email from JS payload (See Security Note below)
    $to = filter_var(trim($data["targetEmail"]), FILTER_SANITIZE_EMAIL);

    // Validation
    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($to)) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Veuillez remplir tous les champs correctement."]);
        exit;
    }

    // Email setup
    $subject = "Nouveau message de: $name - $subject_input";
    $email_content = "Nom: $name\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Téléphone: $phone\n\n";
    $email_content .= "Message:\n$message\n";

    $email_headers = "From: $name <$email>";

    // Send the email
    if (mail($to, $subject, $email_content, $email_headers)) {
        http_response_code(200);
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Erreur du serveur lors de l'envoi de l'email."]);
    }

} else {
    http_response_code(403);
    echo json_encode(["success" => false, "error" => "Méthode non autorisée."]);
}
?>
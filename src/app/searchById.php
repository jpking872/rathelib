<?php
$isTest = false;

if (!$isTest) {

    if (!isset($_SERVER['HTTP_ORIGIN'])) {
        echo "Invalid cross-domain request";
        exit;
    }

    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
    header('Access-Control-Allow-Methods: GET, POST, PUT');

    $con = mysqli_connect("localhost", "test", "test", "test");
    if (mysqli_connect_errno())
    {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }
} else {
    $con = mysqli_connect("localhost", "testerguy2", "tester", "rathe");
    if (mysqli_connect_errno())
    {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }
}

    $results = null;
    if (!$isTest) {
        $id = $_GET['bookid'];
    }

    $sql = "SELECT * FROM `Bind_Title_Intake` WHERE `FirebaseTitleID` = '" . mysqli_real_escape_string($con, $id) . "'";
        $result = mysqli_query($con, $sql);
        if ($row = mysqli_fetch_array($result)) {
            $results = $row;
        }

echo json_encode($results);

<?php

if (!isset($_SERVER['HTTP_ORIGIN'])) {
        echo "Invalid cross-domain request";
    exit;
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header('P3P: CP="CAO PSA OUR"'); // cookies

if ($_SERVER['REQUEST_METHOD'] === "POST") {

    $results = array();

    $title = $_POST['title'];
    $author = $_POST['author'];
    $keywords = $_POST['keywords'];
    $recent = isset($_POST['recent']) && $_POST['recent'] == "yes" ? true : false;

    $con = mysqli_connect("localhost", "test", "test", "test");
    if (mysqli_connect_errno())
    {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }


    $ids = array();

    if ($recent) {
        $sql = "SELECT * FROM `Bind_Title_Intake` ORDER BY `AddDate` DESC LIMIT 5";
        $result = mysqli_query($con, $sql);
        while ($row = mysqli_fetch_array($result)) {
            $results[] = $row;
        }
    } elseif (!$title && !$author && !$keywords) {
        $sql = "SELECT * FROM `Bind_Title_Intake` ORDER BY `AddDate` DESC";
        $result = mysqli_query($con, $sql);
        while ($row = mysqli_fetch_array($result)) {
            $results[] = $row;
        }

    }

    else {

        if ($title) {

            $sql = "SELECT `ID` FROM `Bind_Title_Intake` WHERE `TitleName` LIKE '%" . mysqli_real_escape_string($con, $title) . "%'";
            $result = mysqli_query($con, $sql);
            while ($row = mysqli_fetch_array($result)) {
                if (!in_array($row['ID'], $ids)) {
                    $ids[] = $row['ID'];
                }
            }


        }

        if ($author) {

            $sql = "SELECT `ID` FROM `Bind_Title_Intake` WHERE `TitlePersona` LIKE '%" . mysqli_real_escape_string($con, $author) . "%' OR `AuthorBio` LIKE '%" . mysqli_real_escape_string($con, $author) . "%'";
            $result = mysqli_query($con, $sql);
            while ($row = mysqli_fetch_array($result)) {
                if (!in_array($row['ID'], $ids)) {
                    $ids[] = $row['ID'];
                }
            }

        }

        if ($keywords) {

            $aKeywords = preg_split('/[\ \,]+/', $keywords);
            for ($i = 0; $i < count($aKeywords); $i++) {
                $sql = "SELECT `ID` FROM `Bind_Title_Intake` WHERE `TitleKeywords` LIKE '%" . mysqli_real_escape_string($con, $aKeywords[$i]) . "%' OR `TitleHookLine` LIKE '%" . mysqli_real_escape_string($con, $aKeywords[$i]) . "%' OR `TitleDescription` LIKE '%" . mysqli_real_escape_string($con, $aKeywords[$i]) . "%' ";
                $result = mysqli_query($con, $sql);
                while ($row = mysqli_fetch_array($result)) {
                    if (!in_array($row['ID'], $ids)) {
                        $ids[] = $row['ID'];
                    }
                }
            }
        }

        $inArray = "'" . implode("', '", $ids) . "'";
        $sql = "SELECT * FROM `Bind_Title_Intake` WHERE `ID` IN (" . $inArray . ") ORDER BY `AddDate` DESC";
        $result = mysqli_query($con, $sql);
        while ($row = mysqli_fetch_array($result)) {
            $results[] = $row;
        }

    }

    }

    //echo "Title: " . $title . " Author: " . $author . " Keywords: " . $keywords . "<br/>";
    echo json_encode($results);

    /*
    if (count($results) == 0) {
        echo "No results";
    } else { ?>
        <pre><?php print_r($results) ?></pre>
    <?php } ?>
    */
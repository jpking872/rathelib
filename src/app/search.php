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
if ($_SERVER['REQUEST_METHOD'] === "POST") {
    $results = array();
    if (!$isTest) {
        $keywords = $_POST['keywords'];
        $recent = $_POST['recent'] == "true" ? true : false;
        $magic = $_POST['magic'];
        $start = $_POST['start'];
        $size = $_POST['size'];
    }

    $startIndex = $start * $size;

    /*$sql = "SELECT COUNT(*) as numrows FROM `Bind_Title_Intake`";
    $result = mysqli_query($con, $sql);
    if ($row = mysqli_fetch_array($result)) {
        $numrows = $row['numrows'];
    }*/

    $ids = array();
    if ($recent) {
        $sql = "SELECT * FROM `Bind_Title_Intake` ORDER BY `AddDate` DESC LIMIT 3";
        $result = mysqli_query($con, $sql);
        while ($row = mysqli_fetch_array($result)) {
            $results[] = $row;
        }
    } elseif (!$magic && !$keywords) {
        $sql = "SELECT * FROM `Bind_Title_Intake` ORDER BY `AddDate` DESC LIMIT " . $startIndex . ", " . $size;
        $result = mysqli_query($con, $sql);
        while ($row = mysqli_fetch_array($result)) {
            $results[] = $row;
        }
    }
    else {
        if ($keywords) {
            $aKeywords = preg_split('/[\ \,]+/', $keywords);
            for ($i = 0; $i < count($aKeywords); $i++) {
                $sql = "SELECT `ID` FROM `Bind_Title_Intake` WHERE 
                                `TitleKeywords` LIKE '%" . mysqli_real_escape_string($con, $aKeywords[$i]) . "%' OR 
                                `TitleHookLine` LIKE '%" . mysqli_real_escape_string($con, $aKeywords[$i]) . "%' OR 
                                `TitleDescription` LIKE '%" . mysqli_real_escape_string($con, $aKeywords[$i]) . "%' OR
                                `TitleName` LIKE '%" . mysqli_real_escape_string($con, $aKeywords[$i]) . "%' OR
                                `TitlePersona` LIKE '%" . mysqli_real_escape_string($con, $aKeywords[$i]) . "%'";
                $result = mysqli_query($con, $sql);
                while ($row = mysqli_fetch_array($result)) {
                    if (!in_array($row['ID'], $ids)) {
                        $ids[] = $row['ID'];
                    }
                }
            }
        }
        if ($magic) {
            for ($i = 0; $i < count($magic); $i++) {
                $sMagic = $magic[$i];
                $sql = "SELECT `ID` FROM `Bind_Title_Intake` WHERE 
                                `TitleMagic` LIKE '%" . mysqli_real_escape_string($con, $sMagic) . "%'";
                $result = mysqli_query($con, $sql);
                while ($row = mysqli_fetch_array($result)) {
                    if (!in_array($row['ID'], $ids)) {
                        $ids[] = $row['ID'];
                    }
                }

            }
        }

        $inArray = "'" . implode("', '", $ids) . "'";
        $sql = "SELECT * FROM `Bind_Title_Intake` WHERE `ID` IN (" . $inArray . ") ORDER BY `AddDate` DESC LIMIT " . $startIndex . ", " . $size;
        $result = mysqli_query($con, $sql);
        while ($row = mysqli_fetch_array($result)) {
            $results[] = $row;
        }
    }
}
//echo "Keywords: " . $keywords . " Magic Words: " . $magic . "<br/>";
//echo json_encode(array('recent' => print_r($recent, true), 'keywords' => print_r($keywords, true), 'magic' => print_r($magic, true)) );
echo json_encode($results);
/*
if (count($results) == 0) {
    echo "No results";
} else { ?>
    <pre><?php print_r($results) ?></pre>
<?php } ?>
*/

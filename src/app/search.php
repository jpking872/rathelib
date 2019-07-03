    <html>
    <head></head><body>
    <h1>Test Search Form</h1>
    <form method="post" action="" id="search">
        <p>Title: <input type="text" name="title"></p>
        <p>Author: <input type="text" name="author"></p>
        <p>Keywords: <input type="text" name="keywords"></p>
        <p>Recent: <input type="checkbox" name="recent" value="yes"></p>
        <p><input type="submit"></p>

    </form>

<?php

$results = array();

if ($_SERVER['REQUEST_METHOD'] === "POST") {

    $title = $_POST['title'];
    $author = $_POST['author'];
    $keywords = $_POST['keywords'];
    $recent = isset($_POST['recent']) && $_POST['recent'] == "yes" ? true : false;

    $con = mysqli_connect("localhost", "testerguy2", "tester", "rathe");

    $ids = array();

    if ($recent) {
        $sql = "SELECT * FROM `bind_title_intake` ORDER BY `AddDate` DESC LIMIT 5";
        $result = mysqli_query($con, $sql);
        while ($row = mysqli_fetch_array($result)) {
            $results[] = $row;
        }
    } elseif (!$title && !$author && !$keywords) {
        $sql = "SELECT * FROM `bind_title_intake` ORDER BY `AddDate` DESC";
        $result = mysqli_query($con, $sql);
        while ($row = mysqli_fetch_array($result)) {
            $results[] = $row;
        }

    }

    else {

        if ($title) {

            $sql = "SELECT `ID` FROM `bind_title_intake` WHERE `TitleName` LIKE '%" . mysqli_real_escape_string($con, $title) . "%'";
            $result = mysqli_query($con, $sql);
            while ($row = mysqli_fetch_array($result)) {
                if (!in_array($row['ID'], $ids)) {
                    $ids[] = $row['ID'];
                }
            }


        }

        if ($author) {

            $sql = "SELECT `ID` FROM `bind_title_intake` WHERE `TitlePersona` LIKE '%" . mysqli_real_escape_string($con, $author) . "%' OR `AuthorBio` LIKE '%" . mysqli_real_escape_string($con, $author) . "%'";
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
                $sql = "SELECT `ID` FROM `bind_title_intake` WHERE `TitleKeywords` LIKE '%" . mysqli_real_escape_string($con, $aKeywords[$i]) . "%' OR `TitleHookLine` LIKE '%" . mysqli_real_escape_string($con, $aKeywords[$i]) . "%' OR `TitleDescription` LIKE '%" . mysqli_real_escape_string($con, $aKeywords[$i]) . "%' ";
                $result = mysqli_query($con, $sql);
                while ($row = mysqli_fetch_array($result)) {
                    if (!in_array($row['ID'], $ids)) {
                        $ids[] = $row['ID'];
                    }
                }
            }
        }

        $inArray = "'" . implode("', '", $ids) . "'";
        $sql = "SELECT * FROM `bind_title_intake` WHERE `ID` IN (" . $inArray . ") ORDER BY `AddDate` DESC";
        $result = mysqli_query($con, $sql);
        while ($row = mysqli_fetch_array($result)) {
            $results[] = $row;
        }

    }

    }

    if (count($results) == 0) {
        echo "No results";
    } else { ?>
        <pre><?php print_r($results) ?></pre>
    <?php } ?>



    </body>
    </html>

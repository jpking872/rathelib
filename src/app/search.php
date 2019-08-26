<?php
$isTest = false;

class DB {
    protected static $instance;

    protected function __construct() {

    }

    public static function getInstance($isTest) {

        if ($isTest) {
            $dbServer = 'localhost';
            $dbPort = '3306';
            $dbName = 'rathe';
            $dbUser = 'testerguy2';
            $dbPass = 'tester';
        } else {
            $dbServer = 'localhost';
            $dbPort = '3306';
            $dbName = 'dev_db';
            $dbUser = 'picnic';
            $dbPass = 'loving10XG';
        }

        if(empty(self::$instance)) {

            $options = [
                PDO::ATTR_EMULATE_PREPARES   => false, // turn off emulation mode for "real" prepared statements
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, //turn on errors in the form of exceptions
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, //make the default fetch be an associative array
                //PDO::ATTR_PERSISTENT => true, // make connection persistent
            ];

            try {
                self::$instance = new PDO("mysql:host=". $dbServer.';port='. $dbPort .';dbname='. $dbName, $dbUser, $dbPass, $options);
                self::$instance->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                self::$instance->query('SET NAMES utf8mb4');
                self::$instance->query('SET CHARACTER SET utf8mb4');
            } catch(PDOException $error) {
                echo $error->getMessage();
            }
        }
        return self::$instance;
    }


    public static function setCharsetEncoding() {
        if (self::$instance == null) {
            self::connect();
        }
        self::$instance->exec(
            "SET NAMES 'utf8mb4';
			SET character_set_connection=utf8mb4;
			SET character_set_client=utf8mb4;
			SET character_set_results=utf8mb4");
    }
}

if (!$isTest) {

    if (!isset($_SERVER['HTTP_ORIGIN'])) {
        echo "Invalid cross-domain request";
        exit;
    }

}

    if (!$isTest) {
        header('Access-Control-Allow-Origin: https://rathe.app');
    } else {
        header('Access-Control-Allow-Origin: *');
    }

    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
    header('Access-Control-Allow-Methods: GET, POST, PUT');

    if ($_SERVER['REQUEST_METHOD'] === "POST") {

        $dbh = DB::getInstance($isTest);
        DB::setCharsetEncoding();

        if (!$isTest) {
            $keywords = $_POST['keywords'];
            $recent = $_POST['recent'] == "true" ? true : false;
            $magic = $_POST['magic'];
            $start = $_POST['start'];
            $size = $_POST['size'];
        }

        $startIndex = $start * $size;

        $results = array();
        $ids = array();
        $selectFields = "CoverArtLink, TitleName, BioPhotoLink, TitlePersona, TitleHookLine, AddDate, Acknowledgment, Dedication, AuthorBio";
        if ($recent) {
            $stmt = $dbh->prepare("SELECT $selectFields FROM `Bind_Title_Intake` ORDER BY `AddDate` DESC LIMIT 5");
            $stmt->execute();
            $results = $stmt->fetchAll();

        } elseif (!$magic && !$keywords) {
            $stmt = $dbh->prepare("SELECT $selectFields FROM `Bind_Title_Intake` ORDER BY `AddDate` DESC LIMIT :start, :size");
            $stmt->bindParam(':start', $startIndex, PDO::PARAM_INT);
            $stmt->bindParam(':size', $size, PDO::PARAM_INT);
            $stmt->execute();
            $results = $stmt->fetchAll();

        } else {
            if ($keywords) {
                $aKeywords = preg_split('/[\ \,]+/', $keywords);
                for ($i = 0; $i < count($aKeywords); $i++) {
                    $tmpKeyword = str_replace(" ", "", $aKeywords[$i]);
                    $sql = "SELECT `ID` FROM `Bind_Title_Intake` WHERE ";
                    $sql .= "REPLACE(`TitleKeywords`, ' ', '') LIKE concat('%', :tmpKeyword1, '%') OR ";
                    $sql .= "REPLACE(`TitleHookLine`, ' ', '') LIKE concat('%', :tmpKeyword2, '%') OR ";
                    $sql .= "REPLACE(`TitleDescription`, ' ', '') LIKE concat('%', :tmpKeyword3, '%') OR ";
                    $sql .= "REPLACE(`TitleName`, ' ', '') LIKE concat('%', :tmpKeyword4, '%') OR ";
                    $sql .= "REPLACE(`TitlePersona`, ' ', '') LIKE concat('%', :tmpKeyword5, '%')";

                    $stmt = $dbh->prepare($sql);
                    $stmt->bindParam(':tmpKeyword1', $tmpKeyword, PDO::PARAM_STR);
                    $stmt->bindParam(':tmpKeyword2', $tmpKeyword, PDO::PARAM_STR);
                    $stmt->bindParam(':tmpKeyword3', $tmpKeyword, PDO::PARAM_STR);
                    $stmt->bindParam(':tmpKeyword4', $tmpKeyword, PDO::PARAM_STR);
                    $stmt->bindParam(':tmpKeyword5', $tmpKeyword, PDO::PARAM_STR);
                    $stmt->execute();
                    $result = $stmt->fetchAll();
                    for ($i = 0; $i < count($result); $i++) {
                        if (!in_array($result[$i]['ID'], $ids)) {
                            $ids[] = $result[$i]['ID'];
                        }
                    }

                }
            }
            if ($magic) {
                for ($i = 0; $i < count($magic); $i++) {
                    $sMagic = $magic[$i];
                    $sql = "SELECT `ID` FROM `Bind_Title_Intake` WHERE `TitleMagic` LIKE concat('%', :magic, '%')";
                    $stmt = $dbh->prepare($sql);
                    $stmt->bindParam(':magic', $sMagic, PDO::PARAM_STR);
                    $stmt->execute();
                    $result = $stmt->fetchAll();
                    for ($i = 0; $i < count($result); $i++) {
                        if (!in_array($result[$i]['ID'], $ids)) {
                            $ids[] = $result[$i]['ID'];
                        }
                    }

                }
            }

            $inArray = "'" . implode("', '", $ids) . "'";
            $sql = "SELECT $selectFields FROM `Bind_Title_Intake` WHERE `ID` IN (" . $inArray . ") ORDER BY `AddDate` DESC LIMIT " . $startIndex . ", " . $size;
            $stmt = $dbh->prepare($sql);
            $stmt->execute();
            $results = $stmt->fetchAll();

        }
    }

    echo json_encode($results);

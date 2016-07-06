<?php

 //Get data from POST
$dataBvp = $_POST["bvp"];

$dataGsr = $_POST["gsr"];

$dataIbi = $_POST["ibi"];

foreach($_POST as $key => $value){
	
	if($key == "bvp"){
		file_put_contents('text/bvpData.txt', $dataBvp . "," . "\n", FILE_APPEND);
	}
	else if($key == "gsr"){
		file_put_contents('text/gsrData.txt', $dataGsr . "," . "\n", FILE_APPEND);
	}
	else if($key == "ibi"){
		file_put_contents('text/ibiData.txt', $dataIbi . "," . "\n", FILE_APPEND);
	}
}

$bvpArray = array('bvp'=>$dataBvp);

echo json_encode($bvpArray);



//Store data in a database
// $mysqli = new mysqli('localhost', 'username', 'password', 'dbname'); //Connect to the database
//   
// $stmt = $mysqli->prepare("INSERT INTO data_dump(data) VALUES (?)"); //Create an INSERT statement
// $stmt->bind_param('s', $data);
// $stmt->execute();
//   
// $newId = $stmt->insert_id;  //Get the id of the newly inserted row
// $stmt->close();
//   
// echo $newId; //print the id
//   
// //Get data from database
// $result = $mysqli->query("SELECT * FROM data_dump ORDER BY id DESC LIMIT 3");
//   
// $latest = array();
// while ($row = $result->fetch_object()){
//   //row
//   $latest[] = $row->data;
// }
//   
// echo " - " . implode(",", $latest);

?>

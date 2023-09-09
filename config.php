<?php 
   $host = 'localhost';
   $user = 'localhost';
   $password = 'testpass';
   $database = 'testdata';

   // устанавливаем соединение с базой данных
   $link = mysqli_connect($host, $user, $password, $database);

   // проверяем успешность соединения
   if (!$link) {
       die('Ошибка соединения: ' . mysqli_connect_error());
   }
?>


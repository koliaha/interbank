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
      console.log("Form is valid, proceeding to submission...");
    } else {
      //   alert(errorMessage);
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

  // Использование customAlert вместо стандартного alert
});

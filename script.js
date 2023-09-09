document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".form");
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

  // Обработка изменения типа документа
  docType.addEventListener("change", function () {
    docNumber.value = "";
  });

  // Валидация и фильтрация при вводе
  docNumber.addEventListener("input", function () {
    let value = this.value;
    let pattern;
    switch (docType.value) {
      case "DNI":
        pattern = /^[0-9]*$/;
        maxLength = 8;
        break;
      case "Pasaporte":
      case "CE":
        pattern = /^[a-zA-Z0-9]*$/;
        break;
      default:
        pattern = /^.*$/;
        break;
    }
    // Обрезать значение по максимальной длине
    if (value.length > maxLength) {
      value = value.slice(0, maxLength);
    }
    if (!pattern.test(value)) {
      this.value = value.replace(/[^a-zA-Z0-9]/g, "");
    }
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
      alert(errorMessage);
    }
  });
});

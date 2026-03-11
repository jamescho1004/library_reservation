const form = document.getElementById("registerForm");
const formError = document.getElementById("formError");
const userIdEl = document.getElementById("userId");
const passwordEl = document.getElementById("password");
const nameEl = document.getElementById("name");
const phoneEl = document.getElementById("phone");
const registerBtn = document.getElementById("registerBtn");

function clearFieldError(inputEl, errorElId) {
  inputEl.classList.remove("is-invalid");
  document.getElementById(errorElId).textContent = "";
}

function setFieldError(inputEl, errorElId, message) {
  inputEl.classList.add("is-invalid");
  document.getElementById(errorElId).textContent = message;
}

function clearFormErrors() {
  formError.classList.add("d-none");
  formError.textContent = "";

  clearFieldError(userIdEl, "userIdError");
  clearFieldError(passwordEl, "passwordError");
  clearFieldError(nameEl, "nameError");
  clearFieldError(phoneEl, "phoneError");
}

function validateForm() {
  let isValid = true;
  clearFormErrors();

  const userId = userIdEl.value.trim();
  const password = passwordEl.value;
  const name = nameEl.value.trim();
  const phone = phoneEl.value.trim();

  if (!userId) {
    setFieldError(userIdEl, "userIdError", "Please enter your user ID");
    isValid = false;
  }

  if (!password) {
    setFieldError(passwordEl, "passwordError", "Please enter your password");
    isValid = false;
  } else if (password.length < 4) {
    setFieldError(
      passwordEl,
      "passwordError",
      "Password must be at least 4 characters",
    );
    isValid = false;
  }

  if (!name) {
    setFieldError(nameEl, "nameError", "Please enter your name");
    isValid = false;
  }

  if (!phone) {
    setFieldError(phoneEl, "phoneError", "Please enter your phone number");
    isValid = false;
  }

  return isValid;
}
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  // 여기서부터는 valid
  registerBtn.disabled = true;

  try {
    const payload = {
      userId: userIdEl.value.trim(),
      password: passwordEl.value,
      name: nameEl.value.trim(),
      phone: phoneEl.value.trim(),
    };

    const res = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if ((data.field = "userId")) {
        setFieldError(userIdEl, "userIdError", data.error);
      } else {
        formError.textContent = data.error || "Registration failed";
        formError.classList.remove("d-none");
      }
      registerBtn.disabled = false;
      return;
    }

    location.href = "/login";
  } catch (err) {
    formError.textContent = "A network error occurred";
    formError.classList.remove("d-none");
    registerBtn.disabled = false;
  }
});

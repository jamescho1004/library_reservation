const formError = document.getElementById("formError");
const form = document.getElementById("loginForm");
const userIdEl = document.getElementById("userId");
const passwordEl = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");

function clearFieldError(inputEl, errorElId) {
  inputEl.classList.remove("is-invalid");
  document.getElementById(errorElId).textContent = "";
}

function setFieldError(inputEl, errorElId, message) {
  inputEl.classList.add("is-invalid");
  document.getElementById(errorElId).textContent = message;
}

function clearErrors() {
  formError.classList.add("d-none");
  formError.textContent = "";

  clearFieldError(userIdEl, "userIdError");
  clearFieldError(passwordEl, "passwordError");
}

function validateForm() {
  let isValid = true;
  clearErrors();

  const userId = userIdEl.value.trim;
  const password = passwordEl.value;

  if (!userId) {
    setFieldError(userIdEl, "userIdError", "Please enter your user ID");
    isValid = false;
  }
  if (!password) {
    setFieldError(passwordEl, "passwordError", "Please enter your password");
    isValid = false;
  }
  return isValid;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  loginBtn.disabled = true;

  try {
    const payload = {
      userId: userIdEl.value.trim(),
      password: passwordEl.value,
    };

    const res = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (data.field === "userId") {
        setFieldError(userIdEl, "userIdError", data.error);
      } else if (data.field === "password") {
        setFieldError(passwordEl, "passwordError", data.error);
      } else {
        formError.textContent = data.error || "Login failed";
        formError.classList.remove("d-none");
      }
      loginBtn.disabled = false;
      return;
    }

    location.href = "/";
  } catch (err) {
    formError.textContent = "A network error occurred";
    formError.classList.remove("d-none");
    loginBtn.disabled = false;
  }
});

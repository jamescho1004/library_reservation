window.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/logout", {
        method: "POST",
      });

      if (!res.ok) {
        alert("Logout failed");
        return;
      }

      location.href = "/";
    } catch (err) {
      alert("A network error occurred");
    }
  });
});

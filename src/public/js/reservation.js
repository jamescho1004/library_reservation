function toISO(date, time) {
  const d = new Date(`${date}T${time}:00`);
  return d.toISOString();
}

window.addEventListener("DOMContentLoaded", () => {
  const q = window.__RES_Q__;
  const btn = document.getElementById("confirmBtn");
  const msg = document.getElementById("msg");

  btn.addEventListener("click", async () => {
    msg.textContent = "";
    btn.disabled = true;

    try {
      const payload = {
        seatId: q.seatId,
        startTime: toISO(q.date, q.startTime),
        endTime: toISO(q.date, q.endTime),
      };

      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        msg.textContent = data.error || "Reservation failed";
        btn.disabled = false;
        return;
      }

      const qs = new URLSearchParams({
        zone: q.zone,
        number: q.number,
        date: q.date,
        startTime: q.startTime,
        endTime: q.endTime,
      });
      location.href = `/confirm?${qs.toString()}`;
    } catch (e) {
      msg.textContent = "A network error occurred";
      btn.disabled = false;
    }
  });
});

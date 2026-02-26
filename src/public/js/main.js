const seatWrap = document.getElementById("seats");
const zoneEl = document.getElementById("zone");
const dateEl = document.getElementById("date");
const startEl = document.getElementById("startTime");
const endEl = document.getElementById("endTime");
const loadBtn = document.getElementById("loadBtn");

function pad(n) {
  return String(n).padStart(2, "0");
}

function buildTimeOptions(selectEl) {
  selectEl.innerHTML = "";
  for (let h = 0; h < 24; h++) {
    for (let m of [0, 30]) {
      const time = `${pad(h)}:${pad(m)}`;
      const opt = document.createElement("option");
      opt.value = time;
      opt.textContent = time;
      selectEl.appendChild(opt);
    }
  }
}

function toISO(date, time) {
  const ISO = new Date(`${date}T${time}:00`);
  return ISO.toISOString();
}

function seatBgClass(available) {
  if (available == null) return "seat-unknown";
  return available ? "seat-available" : "seat-unavailable";
}

function renderSeats(seats) {
  seatWrap.innerHTML = "";

  const group = {};

  seats.forEach((seat) => {
    if (!group[seat.zone]) group[seat.zone] = [];
    group[seat.zone].push(seat);
  });

  const zoneOrder = ["A", "B", "C", "D"];
  zoneOrder.forEach((zone) => {
    if (!group[zone]) return;

    const title = document.createElement("div");
    title.className = "zone-title";
    title.textContent = `Zone ${zone}`;
    seatWrap.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "d-flex flex-wrap";

    group[zone]
      .sort((a, b) => a.number - b.number)
      .forEach((seat) => {
        const div = document.createElement("div");
        div.className = `seat-box p-2 text-center border rounded text-white ${seatBgClass(seat.available)}`;
        div.textContent = seat.number;

        grid.appendChild(div);
      });

    seatWrap.appendChild(grid);
  });
}

async function loadInitialSeats() {
  const res = await fetch("/api/seats");
  const seats = await res.json();

  if (!res.ok) {
    alert("Failed to search seats");
    return;
  }

  const graySeats = seats.map((s) => ({
    _id: s._id,
    zone: s.zone,
    number: s.number,
    available: null,
  }));

  renderSeats(graySeats);
}

async function loadStatus() {
  const zone = zoneEl.value;
  const date = dateEl.value;
  const startTime = startEl.value;
  const endTime = endEl.value;

  if (!date) return alert("Please select date");
  if (!startTime || !endTime) return alert("Please select time");
  if (startTime >= endTime)
    return alert("The end time must be later than the start time");

  const startISO = toISO(date, startTime);
  const endISO = toISO(date, endTime);

  const params = new URLSearchParams({ startTime: startISO, endTime: endISO });
  if (zone) params.set("zone", zone);

  const res = await fetch(`/api/seats/status?${params.toString()}`);
  const seats = await res.json();

  if (!res.ok) {
    alert("Failed to search seats");
    return;
  }

  renderSeats(seats);
}

window.addEventListener("DOMContentLoaded", () => {
  buildTimeOptions(startEl);
  buildTimeOptions(endEl);

  dateEl.value = new Date().toISOString().split("T")[0];
  startEl.value = "10:00";
  endEl.value = "12:00";

  loadInitialSeats();
});

loadBtn.addEventListener("click", loadStatus);

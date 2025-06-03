const refs = {
  startBtn: document.querySelector('[data-start]'),
  input: document.querySelector('#datetime-picker'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let selectedDate = null;
let timerId = null;

refs.startBtn.disabled = true;

flatpickr(refs.input, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    selectedDate = selectedDates[0];
    if (selectedDate <= new Date()) {
      iziToast.error({
        message: "Please choose a date in the future",
        position: "topRight",
      });
      refs.startBtn.disabled = true;
    } else {
      refs.startBtn.disabled = false;
    }
  },
});

refs.startBtn.addEventListener('click', () => {
  refs.startBtn.disabled = true;
  refs.input.disabled = true;

  timerId = setInterval(() => {
    const delta = selectedDate - new Date();
    if (delta <= 0) {
      clearInterval(timerId);
      updateClockFace({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }
    updateClockFace(convertMs(delta));
  }, 1000);
});

function updateClockFace({ days, hours, minutes, seconds }) {
  refs.days.textContent = addLeadingZero(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor((ms % hour) / minute);
  const seconds = Math.floor((ms % minute) / second);

  return { days, hours, minutes, seconds };
}
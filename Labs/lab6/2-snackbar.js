document.querySelector('.form').addEventListener('submit', event => {
  event.preventDefault();

  const delay = Number(event.target.elements.delay.value);
  const state = event.target.elements.state.value;

  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  })
  .then(d => {
    iziToast.success({
      message: `Fulfilled promise in ${d}ms`,
      position: 'topRight'
    });
  })
  .catch(d => {
    iziToast.error({
      message: `Rejected promise in ${d}ms`,
      position: 'topRight'
    });
  });
});

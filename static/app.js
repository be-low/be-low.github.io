if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(reg => {
    if (reg.installing) {
      console.log('Service worker installing');
    } else if (reg.waiting) {
      console.log('Service worker installed');
    } else if (reg.active) {
      console.log('Service worker active');
    }

  }).catch(error => {
    console.log('Registration failed with ' + error);
  });
}

window.addEventListener('load', () => {
  if (navigator.standalone) {
    console.log('Launched: Installed (iOS)');
  } else if (matchMedia('(display-mode: standalone)').matches) {
    console.log('Launched: Installed');
  } else {
    console.log('Launched: Browser Tab');
  }
});

(function () {
  function isStandaloneMode() {
    return window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      window.navigator.standalone === true;
  }

  function getInstallInstructions() {
    var ua = navigator.userAgent || '';
    var platform = navigator.platform || '';
    var maxTouchPoints = navigator.maxTouchPoints || 0;
    var isIOS = /iPad|iPhone|iPod/i.test(ua) || (platform === 'MacIntel' && maxTouchPoints > 1);
    var isAndroid = /Android/i.test(ua);

    if (isIOS) {
      return {
        intro: 'Recommended for iPhone/iPad:',
        steps: ['iPhone (Safari): Tap the Share button (box with arrow) ➔ select Add to Home Screen.']
      };
    }
    if (isAndroid) {
      return {
        intro: 'Recommended for Android:',
        steps: ['Android (Chrome): Tap the three dots (⋮) ➔ select Install app (or Add to Home screen).']
      };
    }
    return {
      intro: 'Choose the steps for your device:',
      steps: [
        'iPhone (Safari): Tap the Share button (box with arrow) ➔ select Add to Home Screen.',
        'Android (Chrome): Tap the three dots (⋮) ➔ select Install app (or Add to Home screen).'
      ]
    };
  }

  function showInstallPrompt() {
    if (isStandaloneMode()) return;
    if (document.getElementById('install-prompt')) return;

    var info = getInstallInstructions();
    var wrap = document.createElement('div');
    wrap.className = 'install-prompt';
    wrap.id = 'install-prompt';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'false');
    wrap.setAttribute('aria-labelledby', 'install-prompt-title');

    var stepsHtml = info.steps.map(function (s) { return '<li>' + s + '</li>'; }).join('');
    wrap.innerHTML =
      '<div class="install-prompt-card">' +
      '<button class="install-prompt-close" id="install-prompt-close" aria-label="Dismiss install instructions">&times;</button>' +
      '<h2 id="install-prompt-title">Add it to your device</h2>' +
      '<p class="install-prompt-intro">' + info.intro + '</p>' +
      '<div class="install-prompt-steps"><ol>' + stepsHtml + '</ol></div>' +
      '</div>';

    document.body.appendChild(wrap);
    var closeBtn = document.getElementById('install-prompt-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () { wrap.remove(); });
    }
  }

  function schedule() {
    if (isStandaloneMode()) return;
    setTimeout(function () {
      if (isStandaloneMode()) return;
      showInstallPrompt();
    }, 3500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }
})();

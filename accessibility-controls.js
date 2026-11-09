/* Shared preferences for every Zeroth page. Load before network.js. */
(() => {
  'use strict';
  if (window.ZerothAccessibility) return;
  const KEY = 'zeroth.accessibility.v1';
  const root = document.documentElement;
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  let preferences = { stopAnimation: false, easyRead: false };
  let storageAvailable = true;
  let panel, stopInput, easyInput, note, activeTrigger;
  const triggers = [];

  function readPreferences() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(KEY) || 'null');
      return { stopAnimation: saved?.stopAnimation === true, easyRead: saved?.easyRead === true };
    } catch (_) {
      storageAvailable = false;
      return { stopAnimation: false, easyRead: false };
    }
  }
  preferences = readPreferences();

  function getState() {
    return Object.freeze({
      ...preferences,
      reducedMotion: query.matches,
      animationStopped: preferences.stopAnimation || preferences.easyRead || query.matches
    });
  }

  function apply(persist = false) {
    if (persist) {
      try {
        window.localStorage.setItem(KEY, JSON.stringify(preferences));
        storageAvailable = true;
      } catch (_) { storageAvailable = false; }
    }
    const state = getState();
    root.dataset.animationStopped = String(state.animationStopped);
    root.dataset.easyRead = String(state.easyRead);
    root.dataset.reducedMotion = String(state.reducedMotion);
    if (stopInput) {
      stopInput.checked = state.animationStopped;
      stopInput.disabled = state.reducedMotion || state.easyRead;
      easyInput.checked = state.easyRead;
      note.textContent = state.reducedMotion
        ? 'Animation is stopped to respect your device’s reduced-motion setting.'
        : state.easyRead
          ? 'Animation is stopped while Easy-read mode is on.'
          : 'Stop the background drawing and text glow.';
      document.getElementById('accessibility-storage-note').textContent = storageAvailable
        ? 'Your choices are saved in this browser and apply across this site.'
        : 'Your choices apply on this page. This browser is not allowing them to be saved.';
    }
    window.dispatchEvent(new CustomEvent('zeroth:accessibilitychange', { detail: state }));
  }

  function setStopAnimation(value) { preferences.stopAnimation = Boolean(value); apply(true); }
  function setEasyRead(value) { preferences.easyRead = Boolean(value); apply(true); }
  window.ZerothAccessibility = Object.freeze({ getState, setStopAnimation, setEasyRead });
  apply(); // Set root flags before the drawing starts, including stored choices.

  function close(restoreFocus = true) {
    if (!panel || panel.hidden) return;
    panel.hidden = true;
    triggers.forEach(trigger => trigger.setAttribute('aria-expanded', 'false'));
    if (restoreFocus && activeTrigger?.isConnected) activeTrigger.focus({ preventScroll: true });
  }

  function init() {
    triggers.push(...document.querySelectorAll('[data-accessibility-trigger]'));
    if (!triggers.length) return;
    panel = document.createElement('section');
    panel.id = 'accessibility-controls';
    panel.className = 'accessibility-panel';
    panel.hidden = true;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'false');
    panel.setAttribute('aria-labelledby', 'accessibility-heading');
    panel.innerHTML = `
      <div class="accessibility-panel-heading">
        <h2 id="accessibility-heading">Accessibility</h2>
        <button class="accessibility-close" type="button" aria-label="Close accessibility settings">Close <span aria-hidden="true">×</span></button>
      </div>
      <label class="accessibility-option" for="accessibility-stop">
        <input id="accessibility-stop" type="checkbox" aria-describedby="accessibility-motion-note">
        <span>Stop animation</span>
      </label>
      <p id="accessibility-motion-note"></p>
      <label class="accessibility-option" for="accessibility-easy">
        <input id="accessibility-easy" type="checkbox" aria-describedby="accessibility-easy-note">
        <span>Easy-read mode</span>
      </label>
      <p id="accessibility-easy-note">Larger, clearer text and fewer visual distractions. The same content and links.</p>
      <p id="accessibility-storage-note" class="accessibility-storage-note"></p>`;
    document.body.append(panel);
    stopInput = panel.querySelector('#accessibility-stop');
    easyInput = panel.querySelector('#accessibility-easy');
    note = panel.querySelector('#accessibility-motion-note');
    stopInput.addEventListener('change', () => setStopAnimation(stopInput.checked));
    easyInput.addEventListener('change', () => setEasyRead(easyInput.checked));
    panel.querySelector('.accessibility-close').addEventListener('click', () => close());
    triggers.forEach(trigger => {
      trigger.setAttribute('type', 'button');
      trigger.setAttribute('aria-controls', panel.id);
      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.addEventListener('click', () => {
        if (!panel.hidden && activeTrigger === trigger) { close(); return; }
        activeTrigger = trigger;
        panel.hidden = false;
        triggers.forEach(item => item.setAttribute('aria-expanded', String(item === trigger)));
        // Close is always enabled, even when reduced motion locks Stop animation.
        panel.querySelector('.accessibility-close').focus({ preventScroll: true });
      });
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !panel.hidden) {
        event.preventDefault();
        close();
      }
    });
    // Non-modal: users may Tab into the rest of the page without a focus trap.
    document.addEventListener('click', event => {
      if (!panel.hidden && !panel.contains(event.target) && !triggers.some(trigger => trigger.contains(event.target))) close(false);
    });
    apply();
    if(location.hash==='#accessibility'&&triggers[0])triggers[0].click();
  }

  if (query.addEventListener) query.addEventListener('change', () => apply());
  else query.addListener(() => apply());
  window.addEventListener('storage', event => {
    if (event.key !== KEY && event.key !== null) return;
    preferences = readPreferences();
    apply();
  });
  // Reconcile persisted state when a page returns from the back/forward cache.
  window.addEventListener('pageshow', event => {
    if (event.persisted && storageAvailable) { preferences = readPreferences(); apply(); }
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();

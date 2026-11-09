/* Progressive archive discovery: static article links work without this script. */
(() => {
  'use strict';
  const form = document.getElementById('archive-filters');
  if (!form) return;
  const search = document.getElementById('archive-search');
  const year = document.getElementById('archive-year');
  const topic = document.getElementById('archive-topic');
  const status = document.getElementById('archive-status');
  const empty = document.getElementById('archive-empty');
  const tagBrowser = document.getElementById('tags');
  const normalize = text => text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/[‐‑–—-]/g, ' ');
  const entries = [...document.querySelectorAll('[data-archive-entry]')].map(element => ({
    element,
    year: element.dataset.year,
    topic: element.dataset.topic,
    tags: JSON.parse(element.dataset.tags),
    text: normalize(element.dataset.search)
  }));
  const groups = [...document.querySelectorAll('[data-archive-year]')];
  const tagButtons = [...document.querySelectorAll('[data-archive-tag]')];
  const validYears = new Set(entries.map(entry => entry.year));
  const validTopics = new Set(entries.map(entry => entry.topic));
  const validTags = new Set(entries.flatMap(entry => entry.tags));
  let exactTag = '';

  function writeState() {
    // Only the fragment contains search text. No request or external service is used.
    const params = new URLSearchParams();
    if (search.value.trim()) params.set('q', search.value.trim());
    if (year.value) params.set('year', year.value);
    if (topic.value) params.set('topic', topic.value);
    if (exactTag) params.set('tag', exactTag);
    const url = new URL(window.location.href);
    url.searchParams.delete('year');
    url.searchParams.delete('topic');
    url.hash = params.toString();
    try { window.history.replaceState(window.history.state, '', url); } catch (_) { /* Filtering still works without history access. */ }
  }

  function applyFilters(save = true) {
    const words = normalize(search.value).trim().split(/\s+/).filter(Boolean);
    const counts = new Map();
    let count = 0;
    entries.forEach(entry => {
      const visible = (!year.value || entry.year === year.value)
        && (!topic.value || entry.topic === topic.value)
        && (!exactTag || entry.tags.includes(exactTag))
        && words.every(word => entry.text.includes(word));
      entry.element.hidden = !visible;
      if (visible) { count += 1; counts.set(entry.year, (counts.get(entry.year) || 0) + 1); }
    });
    groups.forEach(group => {
      const count = counts.get(group.dataset.archiveYear) || 0;
      group.hidden = count === 0;
      group.querySelector('[data-year-count]').textContent = `${count} ${count === 1 ? 'article' : 'articles'}`;
    });
    empty.hidden = count !== 0;
    const filtered = search.value.trim() || year.value || topic.value || exactTag;
    status.textContent = filtered
      ? `${count} of ${entries.length} articles${exactTag ? ` tagged “${exactTag}”` : ''}`
      : `${entries.length} articles, newest first`;
    tagButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.archiveTag === exactTag)));
    if (save) writeState();
  }

  function readState(initial = false) {
    const hash = window.location.hash.slice(1);
    const fragment = new URLSearchParams(hash);
    const query = new URLSearchParams(window.location.search);
    const yearAnchor = /^year-(\d{4})$/.exec(hash);
    const isFilterHash = ['q', 'year', 'topic', 'tag'].some(key => fragment.has(key));
    if (hash === 'tags') tagBrowser.open = true;
    // Ordinary anchors only navigate; they must not clear a reader's filters.
    if (!initial && hash && !yearAnchor && !isFilterHash) return;
    const fallback = yearAnchor || isFilterHash ? new URLSearchParams() : query;
    const requestedYear = yearAnchor?.[1] || fragment.get('year') || fallback.get('year');
    const requestedTopic = fragment.get('topic') || fallback.get('topic');
    search.value = fragment.get('q') || '';
    year.value = validYears.has(requestedYear) ? requestedYear : '';
    topic.value = validTopics.has(requestedTopic) ? requestedTopic : '';
    exactTag = validTags.has(fragment.get('tag')) ? fragment.get('tag') : '';
    if (hash === 'tags' || exactTag) tagBrowser.open = true;
    applyFilters(false);
  }

  function clearFilters() {
    search.value = ''; year.value = ''; topic.value = ''; exactTag = '';
    applyFilters();
  }

  // Attach every handler before revealing the optional search controls.
  form.addEventListener('submit', event => { event.preventDefault(); applyFilters(); });
  form.addEventListener('reset', event => { event.preventDefault(); clearFilters(); search.focus(); });
  search.addEventListener('input', () => { exactTag = ''; applyFilters(); });
  year.addEventListener('change', () => applyFilters());
  topic.addEventListener('change', () => applyFilters());
  document.getElementById('archive-empty-clear').addEventListener('click', () => { clearFilters(); search.focus(); });
  tagButtons.forEach(button => {
    button.addEventListener('click', () => {
      const wasSelected = exactTag === button.dataset.archiveTag;
      search.value = ''; year.value = ''; topic.value = '';
      exactTag = wasSelected ? '' : button.dataset.archiveTag;
      applyFilters();
    });
  });
  document.querySelectorAll('[data-archive-year-link]').forEach(link => {
    link.addEventListener('click', () => {
      // Preserve native in-page navigation and no-JS year anchors.
      search.value = ''; topic.value = ''; exactTag = ''; year.value = link.dataset.archiveYearLink;
      applyFilters(false);
    });
  });
  window.addEventListener('hashchange', () => readState());
  window.addEventListener('popstate', () => readState());
  window.addEventListener('pageshow', event => { if (event.persisted) readState(true); });
  readState(true);
  form.hidden = false;
  tagBrowser.hidden = false;
})();

/* @ds-bundle: {"format":4,"namespace":"Aurum","components":[{"name":"Button"},{"name":"IconButton"},{"name":"Icon"},{"name":"TextField"},{"name":"AmountInput"},{"name":"Select"},{"name":"Checkbox"},{"name":"Switch"},{"name":"SegmentedControl"},{"name":"Card"},{"name":"Section"},{"name":"Badge"},{"name":"Avatar"},{"name":"Alert"},{"name":"ProgressBar"},{"name":"EmptyState"},{"name":"Dialog"},{"name":"Sidebar"},{"name":"BottomNav"},{"name":"Amount"},{"name":"StatCard"},{"name":"StatStrip"},{"name":"Delta"},{"name":"TransactionRow"},{"name":"BudgetBar"},{"name":"AllocationBar"},{"name":"Sparkline"}]} */
(function () {
  var R = window.React;
  var h = R.createElement;

  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function omit(o, keys) { var r = {}; for (var k in o) { if (Object.prototype.hasOwnProperty.call(o, k) && keys.indexOf(k) < 0) r[k] = o[k]; } return r; }
  function useControlled(value, initial) {
    var s = R.useState(initial); var isCtl = value !== undefined;
    return [isCtl ? value : s[0], function (v) { if (!isCtl) s[1](v); }];
  }

  /* ---------------- Icons: 24 grid, 1.5 stroke, round caps ---------------- */
  function P(d) { return ['path', { d: d }]; }
  function C(cx_, cy, r) { return ['circle', { cx: cx_, cy: cy, r: r }]; }
  function D(cx_, cy) { return ['circle', { cx: cx_, cy: cy, r: 1.25, fill: 'currentColor', stroke: 'none' }]; }
  var ICONS = {
    'home': [P('M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z')],
    'wallet': [P('M19 7.5V6a1.5 1.5 0 0 0-1.5-1.5H6A2.5 2.5 0 0 0 3.5 7v10A2.5 2.5 0 0 0 6 19.5h12.5A1.5 1.5 0 0 0 20 18v-9A1.5 1.5 0 0 0 18.5 7.5H6A2.5 2.5 0 0 1 3.5 5'), P('M16.5 13.5h.01')],
    'bar-chart': [P('M5 20v-7'), P('M10 20V9'), P('M15 20V4'), P('M20 20v-9')],
    'pie-chart': [P('M20.5 14A8.5 8.5 0 1 1 10 3.5'), P('M13.5 3.5a7 7 0 0 1 7 7h-7z')],
    'trending-up': [P('M3.5 16.5l6-6 4 4 7-7'), P('M15 7.5h5.5V13')],
    'trending-down': [P('M3.5 7.5l6 6 4-4 7 7'), P('M15 16.5h5.5V11')],
    'arrow-up-right': [P('M7 17 17 7'), P('M8.5 7H17v8.5')],
    'arrow-down-left': [P('M17 7 7 17'), P('M15.5 17H7V8.5')],
    'arrows-swap': [P('M4 8h15'), P('M15.5 4.5 19 8l-3.5 3.5'), P('M20 16H5'), P('M8.5 12.5 5 16l3.5 3.5')],
    'plus': [P('M12 5v14'), P('M5 12h14')],
    'minus': [P('M5 12h14')],
    'search': [C(11, 11, 6.5), P('M20 20l-4.4-4.4')],
    'bell': [P('M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 2h-14z'), P('M10 20.5a2 2 0 0 0 4 0')],
    'sliders': [P('M4 7h9'), P('M17 7h3'), C(15, 7, 2), P('M4 17h3'), P('M11 17h9'), C(9, 17, 2)],
    'calendar': [['rect', { x: 3.5, y: 5, width: 17, height: 15.5, rx: 2.5 }], P('M3.5 10h17'), P('M8 3v4'), P('M16 3v4')],
    'check': [P('M5 12.5l4.5 4.5L19 7.5')],
    'x': [P('M6.5 6.5l11 11'), P('M17.5 6.5l-11 11')],
    'chevron-right': [P('M9.5 6l6 6-6 6')],
    'chevron-left': [P('M14.5 6l-6 6 6 6')],
    'chevron-down': [P('M6 9.5l6 6 6-6')],
    'more': [D(6, 12), D(12, 12), D(18, 12)],
    'credit-card': [['rect', { x: 3, y: 5.5, width: 18, height: 13, rx: 2.5 }], P('M3 10h18'), P('M7 15h3')],
    'shopping-bag': [P('M5.5 8h13l-1 12h-11z'), P('M9 10V7.5a3 3 0 0 1 6 0V10')],
    'utensils': [P('M7 3v18'), P('M4.5 3v5a2.5 2.5 0 0 0 5 0V3'), P('M17.5 21V3c-2.2 1.5-3 4-3 7.5V13h3')],
    'bus': [['rect', { x: 5, y: 3.5, width: 14, height: 14, rx: 3 }], P('M5 11h14'), P('M8 17.5V20'), P('M16 17.5V20'), D(8.5, 14.25), D(15.5, 14.25)],
    'briefcase': [['rect', { x: 3, y: 7, width: 18, height: 13, rx: 2.5 }], P('M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7'), P('M3 12.5h18')],
    'building': [P('M4 20.5h16'), P('M6 20.5V8l6-4 6 4v12.5'), P('M10 20.5v-4h4v4'), P('M10 11h.01'), P('M14 11h.01')],
    'heart-pulse': [P('M12 19.5S4 15 4 9.5A4 4 0 0 1 12 8a4 4 0 0 1 8 1.5c0 5.5-8 10-8 10z')],
    'target': [C(12, 12, 8.5), C(12, 12, 5), C(12, 12, 1.5)],
    'piggy': [P('M5 11.5a6 5 0 0 1 6-5h2.5a6 5 0 0 1 5.6 3.3H20.5v4h-1.6a6 5 0 0 1-2.4 2.4V19h-2.5v-1.6h-4V19H7.5v-2.3A5 5 0 0 1 5 12.5'), P('M5 11.5c-1 0-1.5-.8-1.5-1.5'), P('M15.5 10.5h.01')],
    'alert-circle': [C(12, 12, 8.5), P('M12 7.5v5'), P('M12 16h.01')],
    'info': [C(12, 12, 8.5), P('M12 11v5'), P('M12 8h.01')],
    'eye': [P('M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z'), C(12, 12, 3)],
    'eye-off': [P('M4 4l16 16'), P('M10 6a10 10 0 0 1 2-.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.6 3.4'), P('M6.6 7.6A16 16 0 0 0 2.5 12S6 18.5 12 18.5a9 9 0 0 0 4.3-1.1'), P('M9.9 9.9a3 3 0 0 0 4.2 4.2')],
    'filter': [P('M4 6.5h16'), P('M7 12h10'), P('M10 17.5h4')],
    'download': [P('M12 4v11'), P('M7.5 10.5 12 15l4.5-4.5'), P('M5 20h14')],
    'repeat': [P('M16.5 3.5 19.5 6.5l-3 3'), P('M4.5 11.5v-1a4 4 0 0 1 4-4h11'), P('M7.5 20.5l-3-3 3-3'), P('M19.5 12.5v1a4 4 0 0 1-4 4h-11')],
    'tag': [P('M3.5 12.1V4.5a1 1 0 0 1 1-1h7.6a1 1 0 0 1 .7.3l8 8a1 1 0 0 1 0 1.4l-7.6 7.6a1 1 0 0 1-1.4 0l-8-8a1 1 0 0 1-.3-.7z'), C(8, 8, 1.5)],
    'user': [C(12, 8.5, 4), P('M4.5 20.5a7.5 7.5 0 0 1 15 0')],
    'settings': [C(12, 12, 3), P('M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8')],
    'log-out': [P('M14 4.5h3.5a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H14'), P('M10 8l-4 4 4 4'), P('M6 12h9')]
  };

  function Icon(p) {
    var size = p.size || 20;
    var parts = ICONS[p.name] || [];
    return h('svg', {
      className: cx('bs-icon', p.className), width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
      stroke: 'currentColor', strokeWidth: p.strokeWidth || 1.5, strokeLinecap: 'round', strokeLinejoin: 'round',
      'aria-hidden': p.label ? undefined : true, role: p.label ? 'img' : undefined, 'aria-label': p.label, style: p.style
    }, parts.map(function (pt, i) { return h(pt[0], Object.assign({ key: i }, pt[1])); }));
  }
  Icon.names = Object.keys(ICONS);

  /* ---------------- Money helpers ---------------- */
  function moneyParts(value, o) {
    o = o || {};
    var dec = o.decimals == null ? 2 : o.decimals;
    var nf = new Intl.NumberFormat(o.locale || 'pt-BR', { style: 'currency', currency: o.currency || 'BRL', minimumFractionDigits: dec, maximumFractionDigits: dec });
    var parts = nf.formatToParts(Math.abs(Number(value) || 0));
    var cur = '', main = '', frac = '', curAfter = false, seenNum = false;
    parts.forEach(function (pt) {
      if (pt.type === 'currency') { cur = pt.value; curAfter = seenNum; }
      else if (pt.type === 'integer' || pt.type === 'group') { main += pt.value; seenNum = true; }
      else if (pt.type === 'decimal' || pt.type === 'fraction') { frac += pt.value; }
    });
    return { cur: cur, main: main, frac: frac, curAfter: curAfter };
  }
  function formatMoney(value, o) {
    o = o || {};
    var m = moneyParts(value, o);
    var n = m.main + m.frac;
    var s = m.curAfter ? n + ' ' + m.cur : m.cur + ' ' + n;
    var v = Number(value) || 0;
    if (o.signed && v > 0) return '+ ' + s;
    if (v < 0) return '− ' + s;
    return s;
  }
  function formatPercent(v, o) {
    o = o || {};
    var nf = new Intl.NumberFormat(o.locale || 'pt-BR', { minimumFractionDigits: o.decimals == null ? 1 : o.decimals, maximumFractionDigits: o.decimals == null ? 1 : o.decimals });
    return nf.format(Math.abs(v)) + '%';
  }

  /* ---------------- Amount ---------------- */
  function Amount(p) {
    var v = Number(p.value) || 0;
    var size = p.size || 'md';
    var tone = p.tone || 'auto';
    if (tone === 'auto') tone = v > 0 ? 'income' : v < 0 ? 'expense' : 'neutral';
    var signMode = p.sign || 'auto';
    var sign = '';
    if (signMode !== 'never') {
      if (v < 0) sign = '−';
      else if (v > 0 && (signMode === 'always' || (signMode === 'auto' && (p.tone || 'auto') === 'auto'))) sign = '+';
    }
    var o = { locale: p.locale, currency: p.currency, decimals: p.decimals };
    var full = (sign ? sign + ' ' : '') + formatMoney(Math.abs(v), o);
    var cls = cx('bs-amount', 'bs-amount--' + size, 'bs-tone-' + tone, p.hidden && 'bs-amount--hidden', p.className);
    if (p.hidden) return h('span', { className: cls }, h('span', { 'aria-hidden': true }, '••••••'), h('span', { className: 'bs-sr' }, p.hiddenLabel || 'Hidden amount'));
    var m = moneyParts(v, o);
    return h('span', { className: cls },
      h('span', { className: 'bs-sr' }, full),
      sign && h('span', { className: 'bs-amount__sign', 'aria-hidden': true }, sign),
      !m.curAfter && h('span', { className: 'bs-amount__cur', 'aria-hidden': true }, m.cur),
      h('span', { className: 'bs-amount__int', 'aria-hidden': true }, m.main),
      m.frac && h('span', { className: 'bs-amount__frac', 'aria-hidden': true }, m.frac),
      m.curAfter && h('span', { className: 'bs-amount__cur bs-amount__cur--after', 'aria-hidden': true }, m.cur));
  }

  /* ---------------- Button / IconButton ---------------- */
  function Button(p) {
    var variant = p.variant || 'primary', size = p.size || 'md';
    var is = size === 'sm' ? 16 : 18;
    var rest = omit(p, ['variant', 'size', 'icon', 'iconRight', 'block', 'loading', 'className', 'children']);
    return h(p.href ? 'a' : 'button', Object.assign(p.href ? {} : { type: 'button' }, rest, {
      className: cx('bs-btn', 'bs-btn--' + variant, 'bs-btn--' + size, p.block && 'bs-btn--block', p.className),
      disabled: p.disabled || p.loading, 'aria-busy': p.loading || undefined
    }),
      p.loading ? h('span', { className: 'bs-spinner', 'aria-hidden': true }) : (p.icon && h(Icon, { name: p.icon, size: is })),
      p.children != null && h('span', null, p.children),
      p.iconRight && h(Icon, { name: p.iconRight, size: is }));
  }

  function IconButton(p) {
    var variant = p.variant || 'ghost', size = p.size || 'md';
    var rest = omit(p, ['variant', 'size', 'icon', 'label', 'dot', 'className']);
    return h(p.href ? 'a' : 'button', Object.assign(p.href ? {} : { type: 'button' }, rest, {
      className: cx('bs-iconbtn', 'bs-iconbtn--' + variant, 'bs-iconbtn--' + size, p.className), 'aria-label': p.label, title: p.label
    }), h(Icon, { name: p.icon, size: size === 'sm' ? 16 : size === 'lg' ? 22 : 20 }), p.dot && h('span', { className: 'bs-iconbtn__dot', 'aria-hidden': true }));
  }

  /* ---------------- Fields ---------------- */
  function FieldShell(id, p, control) {
    var msg = p.error || p.hint;
    return h('div', { className: cx('bs-field', p.error && 'is-error', p.className) },
      p.label && h('label', { className: 'bs-field__label', htmlFor: id }, p.label),
      control,
      msg && h('p', { id: id + '-msg', className: 'bs-field__hint' }, msg));
  }

  function TextField(p) {
    var auto = R.useId(); var id = p.id || auto;
    var rest = omit(p, ['label', 'hint', 'error', 'icon', 'prefix', 'suffix', 'trailing', 'pill', 'className', 'id']);
    var input = h('input', Object.assign({ type: 'text' }, rest, { id: id, 'aria-invalid': p.error ? true : undefined, 'aria-describedby': (p.error || p.hint) ? id + '-msg' : undefined }));
    return FieldShell(id, p, h('div', { className: cx('bs-input', p.pill && 'bs-input--pill', p.disabled && 'is-disabled') },
      p.icon && h(Icon, { name: p.icon, size: 18 }),
      p.prefix && h('span', { className: 'bs-input__affix' }, p.prefix),
      input,
      p.suffix && h('span', { className: 'bs-input__affix' }, p.suffix),
      p.trailing));
  }

  function AmountInput(p) {
    var auto = R.useId(); var id = p.id || auto;
    var kind = p.kind || 'neutral';
    var rest = omit(p, ['label', 'hint', 'error', 'kind', 'currencySymbol', 'className', 'id']);
    return FieldShell(id, p, h('div', { className: cx('bs-amountin', 'bs-amountin--' + kind) },
      h('span', { className: 'bs-amountin__cur', 'aria-hidden': true }, (kind === 'expense' ? '− ' : kind === 'income' ? '+ ' : '') + (p.currencySymbol || 'R$')),
      h('input', Object.assign({ inputMode: 'decimal', placeholder: '0,00', autoComplete: 'off' }, rest, { id: id, 'aria-invalid': p.error ? true : undefined, 'aria-describedby': (p.error || p.hint) ? id + '-msg' : undefined }))));
  }

  function Select(p) {
    var auto = R.useId(); var id = p.id || auto;
    var rest = omit(p, ['label', 'hint', 'error', 'options', 'placeholder', 'className', 'id']);
    var opts = (p.options || []).map(function (o) { o = typeof o === 'string' ? { value: o, label: o } : o; return h('option', { key: o.value, value: o.value, disabled: o.disabled }, o.label); });
    if (p.placeholder) opts.unshift(h('option', { key: '__ph', value: '', disabled: true }, p.placeholder));
    return FieldShell(id, p, h('div', { className: 'bs-select' },
      h('select', Object.assign({}, rest, { id: id, 'aria-invalid': p.error ? true : undefined }), opts),
      h(Icon, { name: 'chevron-down', size: 18 })));
  }

  function Checkbox(p) {
    var ref = R.useRef(null);
    R.useEffect(function () { if (ref.current) ref.current.indeterminate = !!p.indeterminate; }, [p.indeterminate]);
    var rest = omit(p, ['label', 'indeterminate', 'className']);
    return h('label', { className: cx('bs-check', p.disabled && 'is-disabled', p.className) },
      h('input', Object.assign({ type: 'checkbox' }, rest, { ref: ref })),
      h(Icon, { name: p.indeterminate ? 'minus' : 'check', size: 16, strokeWidth: 2.25, className: 'bs-check__mark' }),
      p.label && h('span', null, p.label));
  }
  function Switch(p) {
    var rest = omit(p, ['label', 'className']);
    return h('label', { className: cx('bs-switch', p.className) },
      h('input', Object.assign({ type: 'checkbox', role: 'switch' }, rest)),
      p.label && h('span', null, p.label));
  }

  function SegmentedControl(p) {
    var st = useControlled(p.value, p.defaultValue !== undefined ? p.defaultValue : ((p.options || [])[0] || {}).value);
    return h('div', { role: 'radiogroup', 'aria-label': p.label, className: cx('bs-seg', p.block && 'bs-seg--block', p.className) },
      (p.options || []).map(function (o) {
        var on = o.value === st[0];
        return h('button', {
          key: o.value, type: 'button', role: 'radio', 'aria-checked': on, className: 'bs-seg__opt',
          onClick: function () { st[1](o.value); if (p.onChange) p.onChange(o.value); }
        }, o.icon && h(Icon, { name: o.icon, size: 16 }), o.label);
      }));
  }

  /* ---------------- Layout & display ---------------- */
  function Card(p) {
    var variant = p.variant || 'raised';
    var head = (p.title || p.action) && h('div', { className: 'bs-card__head' },
      h('div', null, p.title && h('h3', { className: 'bs-card__title' }, p.title), p.subtitle && h('p', { className: 'bs-card__sub' }, p.subtitle)),
      p.action);
    return h('section', { className: cx('bs-card', variant === 'flat' && 'bs-card--flat', variant === 'sunken' && 'bs-card--sunken', p.className), style: p.style },
      head, h('div', { className: cx('bs-card__body', p.flush && 'bs-card__body--flush') }, p.children));
  }

  function Section(p) {
    var hasHead = p.title || p.subtitle || p.eyebrow || p.actions;
    return h('section', { className: cx('bs-section', p.divided && 'bs-section--divided', p.className), style: p.style, 'aria-label': typeof p.title === 'string' ? p.title : undefined },
      hasHead && h('div', { className: 'bs-section__head' },
        h('div', { className: 'bs-section__titles' },
          p.eyebrow && h('p', { className: 'bs-section__eyebrow' }, p.eyebrow),
          p.title && h('h2', { className: 'bs-section__title' }, p.title),
          p.subtitle && h('p', { className: 'bs-section__sub' }, p.subtitle)),
        p.actions && h('div', { className: 'bs-section__actions' }, p.actions)),
      p.children,
      p.footer && h('div', { className: 'bs-section__foot' }, p.footer));
  }

  function Badge(p) {
    return h('span', { className: cx('bs-badge', p.tone && p.tone !== 'neutral' && 'bs-badge--' + p.tone, p.className) },
      p.dot && h('span', { className: 'bs-badge__dot', 'aria-hidden': true }),
      p.icon && h(Icon, { name: p.icon, size: 14 }), p.children);
  }

  function initials(name) { return String(name || '?').trim().split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join(''); }
  function Avatar(p) {
    var size = p.size || 'md';
    return h('span', { className: cx('bs-avatar', 'bs-avatar--' + size, p.tone && 'bs-avatar--t' + p.tone, p.className), title: p.name, 'aria-label': p.name, role: 'img' },
      p.src ? h('img', { src: p.src, alt: '' }) : initials(p.name));
  }

  var ALERT_ICON = { info: 'info', success: 'check', warning: 'alert-circle', danger: 'alert-circle' };
  function Alert(p) {
    var tone = p.tone || 'info';
    return h('div', { role: tone === 'danger' ? 'alert' : 'status', className: cx('bs-alert', 'bs-alert--' + tone, p.className) },
      h(Icon, { name: p.icon || ALERT_ICON[tone], size: 20, className: 'bs-alert__icon' }),
      h('div', { className: 'bs-alert__main' }, p.title && h('p', { className: 'bs-alert__title' }, p.title), p.children && h('p', { className: 'bs-alert__text' }, p.children)),
      p.onClose && h(IconButton, { icon: 'x', label: p.closeLabel || 'Dismiss', size: 'sm', onClick: p.onClose }));
  }

  function ProgressBar(p) {
    var max = p.max || 100, v = Math.max(0, Math.min(Number(p.value) || 0, max));
    var pct = (v / max) * 100;
    return h('div', { className: cx('bs-progress', p.className) },
      (p.label || p.showValue) && h('div', { className: 'bs-progress__row' },
        h('span', { className: 'bs-progress__label' }, p.label),
        p.showValue && h('span', { className: 'bs-progress__value' }, p.valueText || Math.round(pct) + '%')),
      h('div', { className: cx('bs-progress__track', p.size === 'sm' && 'bs-progress__track--sm'), role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': max, 'aria-valuenow': v, 'aria-label': p.label },
        h('div', { className: cx('bs-progress__fill', p.tone && p.tone !== 'primary' && 'bs-progress__fill--' + p.tone), style: { width: pct + '%' } })));
  }

  function EmptyState(p) {
    return h('div', { className: cx('bs-empty', p.className) },
      h('div', { className: 'bs-empty__icon' }, h(Icon, { name: p.icon || 'wallet', size: 22 })),
      h('p', { className: 'bs-empty__title' }, p.title),
      p.description && h('p', { className: 'bs-empty__text' }, p.description),
      p.action && h('div', { className: 'bs-empty__action' }, p.action));
  }

  function Dialog(p) {
    var auto = R.useId();
    R.useEffect(function () {
      if (!p.open || p.inline || !p.onClose) return;
      function onKey(e) { if (e.key === 'Escape') p.onClose(); }
      document.addEventListener('keydown', onKey);
      return function () { document.removeEventListener('keydown', onKey); };
    }, [p.open, p.inline, p.onClose]);
    if (!p.open) return null;
    var box = h('div', { role: 'dialog', 'aria-modal': p.inline ? undefined : true, 'aria-labelledby': auto + '-t', className: cx('bs-dialog', p.inline && 'bs-dialog--inline', p.className) },
      h('div', { className: 'bs-dialog__head' },
        h('div', null, h('h2', { id: auto + '-t', className: 'bs-dialog__title' }, p.title), p.description && h('p', { className: 'bs-dialog__desc' }, p.description)),
        p.onClose && h(IconButton, { icon: 'x', label: p.closeLabel || 'Close', onClick: p.onClose })),
      p.children && h('div', { className: 'bs-dialog__body' }, p.children),
      p.actions && h('div', { className: 'bs-dialog__actions' }, p.actions));
    if (p.inline) return box;
    return h('div', { className: 'bs-scrim', onMouseDown: function (e) { if (e.target === e.currentTarget && p.onClose) p.onClose(); } }, box);
  }

  /* ---------------- Navigation ---------------- */
  function ScopeSwitch(p) {
    var st = useControlled(p.value, p.defaultValue !== undefined ? p.defaultValue : (p.scopes[0] || {}).id);
    var os = R.useState(false), open = os[0], setOpen = os[1];
    var ref = R.useRef(null);
    var lid = R.useId();
    R.useEffect(function () {
      if (!open) return;
      function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
      function onKey(e) { if (e.key === 'Escape') setOpen(false); }
      document.addEventListener('mousedown', onDoc); document.addEventListener('keydown', onKey);
      return function () { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
    }, [open]);
    function avs(o) {
      var people = o.people || [{ initials: o.initials, tone: o.tone }];
      return h('span', { className: 'bs-scope__avs', 'aria-hidden': true }, people.map(function (m, i) {
        return h('span', { key: i, className: cx('bs-avatar', 'bs-avatar--xs', m.tone && 'bs-avatar--t' + m.tone) }, m.initials); }));
    }
    function pick(o) { st[1](o.id); setOpen(false); if (p.onChange) p.onChange(o.id); }
    var label = p.label || 'Viewing';
    if (p.compact) {
      var cur = p.scopes.filter(function (o) { return o.id === st[0]; })[0] || p.scopes[0];
      return h('div', { className: 'bs-scope bs-scope--compact', ref: ref },
        h('button', { type: 'button', className: 'bs-scope__current', 'aria-haspopup': 'menu', 'aria-expanded': open, 'aria-label': label + ': ' + cur.label, 'data-tip': open ? undefined : label + ': ' + cur.label,
          onClick: function () { setOpen(!open); } }, avs(cur)),
        open && h('div', { className: 'bs-scope__menu', role: 'menu', 'aria-label': label },
          h('div', { className: 'bs-scope__menu-title' }, label),
          p.scopes.map(function (o) {
            var on = o.id === st[0];
            return h(o.href ? 'a' : 'button', { key: o.id, href: o.href, type: o.href ? undefined : 'button', role: 'menuitemradio', 'aria-checked': on, className: 'bs-scope__item',
              onClick: function () { pick(o); } },
              avs(o), h('span', { className: 'bs-scope__item-name' }, o.label), on && h(Icon, { name: 'check', size: 16 }));
          })));
    }
    return h('div', { className: 'bs-scope' },
      h('span', { className: 'bs-scope__label', id: lid }, label),
      h('div', { className: 'bs-scope__opts', role: 'radiogroup', 'aria-labelledby': lid },
        p.scopes.map(function (o) {
          var on = o.id === st[0];
          return h(o.href ? 'a' : 'button', { key: o.id, href: o.href, type: o.href ? undefined : 'button', role: 'radio', 'aria-checked': on, className: 'bs-scope__opt', title: o.title || o.label,
            onClick: function () { pick(o); } }, avs(o), h('span', { className: 'bs-scope__name' }, o.label));
        })));
  }

  function Sidebar(p) {
    var st = useControlled(p.active, p.defaultActive);
    var cs = useControlled(p.collapsed, !!p.defaultCollapsed);
    var collapsed = !!cs[0];
    var scopeTop = p.scopePlacement === 'top';
    var scope = p.scopes && p.scopes.length > 0 && h(ScopeSwitch, { scopes: p.scopes, value: p.scope, defaultValue: p.defaultScope, onChange: p.onScopeChange, label: p.scopeLabel, compact: collapsed });
    var toggleLabel = collapsed ? (p.expandLabel || 'Expand menu') : (p.collapseLabel || 'Collapse menu');
    var toggle = p.collapsible && h('button', { type: 'button', className: 'bs-nav__toggle', 'aria-expanded': !collapsed, 'aria-label': toggleLabel, 'data-tip': collapsed ? toggleLabel : undefined,
      onClick: function () { cs[1](!collapsed); if (p.onCollapsedChange) p.onCollapsedChange(!collapsed); } },
      h(Icon, { name: collapsed ? 'chevron-right' : 'chevron-left', size: 18 }), h('span', { className: 'bs-nav__label' }, toggleLabel));
    var bottom = (!scopeTop && scope) || p.footer || toggle;
    var initOpen = {};
    (p.items || []).forEach(function (it, i) { if (it.section && it.collapsible) initOpen[i] = it.defaultOpen !== false; });
    var secS = R.useState(initOpen), secOpen = secS[0], setSecOpen = secS[1];
    var hiddenUntil = -1, groupOpen = true;
    return h('nav', { className: cx('bs-nav', p.variant && p.variant !== 'surface' && 'bs-nav--' + p.variant, p.size === 'lg' && 'bs-nav--lg', collapsed && 'bs-nav--collapsed', p.className), 'aria-label': p.label || 'Main' },
      p.brand && h('div', { className: 'bs-nav__brand' }, p.brandMark && h('span', { className: 'bs-nav__brand-mark', 'aria-hidden': true }, p.brandMark), h('span', { className: 'bs-nav__brand-name' }, p.brand)),
      scopeTop && scope,
      h('div', { className: 'bs-nav__items' }, (p.items || []).map(function (it, i) {
        if (it.section) {
          groupOpen = !it.collapsible || collapsed || !!secOpen[i];
          if (!it.collapsible) return h('div', { key: 's' + i, className: 'bs-nav__section' }, h('span', { className: 'bs-nav__section-text' }, it.section));
          var isOpen = !!secOpen[i];
          return h('button', { key: 's' + i, type: 'button', className: 'bs-nav__section bs-nav__section--toggle', 'aria-expanded': isOpen,
            onClick: function () { var n = Object.assign({}, secOpen); n[i] = !isOpen; setSecOpen(n); } },
            h('span', { className: 'bs-nav__section-text' }, it.section), h(Icon, { name: 'chevron-down', size: 14, className: 'bs-nav__section-chev' }));
        }
        if (!groupOpen) return null;
        var on = it.id === st[0];
        return h(it.href ? 'a' : 'button', { key: it.id, type: it.href ? undefined : 'button', href: it.href, className: 'bs-nav__item', 'data-tip': collapsed ? it.label : undefined, 'aria-current': on ? 'page' : undefined,
          onClick: function () { st[1](it.id); if (p.onSelect) p.onSelect(it.id); } },
          it.icon && h(Icon, { name: it.icon, size: p.size === 'lg' ? 22 : 20 }),
          h('span', { className: 'bs-nav__label' }, it.label),
          it.count != null && h('span', { className: cx('bs-nav__count', it.countTone === 'attention' && 'bs-nav__count--attention') }, it.count));
      })),
      bottom && h('div', { className: 'bs-nav__bottom' }, !scopeTop && scope, p.footer && h('div', { className: 'bs-nav__footer' }, p.footer), toggle));
  }

  function BottomNav(p) {
    var st = useControlled(p.active, p.defaultActive);
    return h('nav', { className: cx('bs-bnav', p.className), 'aria-label': p.label || 'Main' },
      (p.items || []).map(function (it) {
        var on = it.id === st[0];
        if (it.primary) return h(it.href ? 'a' : 'button', { key: it.id, type: it.href ? undefined : 'button', href: it.href, className: 'bs-bnav__item', 'aria-label': it.label, onClick: function () { if (p.onSelect) p.onSelect(it.id); } },
          h('span', { className: 'bs-bnav__fab' }, h(Icon, { name: it.icon || 'plus', size: 22 })));
        return h(it.href ? 'a' : 'button', { key: it.id, type: it.href ? undefined : 'button', href: it.href, className: 'bs-bnav__item', 'aria-current': on ? 'page' : undefined, onClick: function () { st[1](it.id); if (p.onSelect) p.onSelect(it.id); } },
          h(Icon, { name: it.icon, size: 22 }), h('span', null, it.label), h('span', { className: 'bs-bnav__pip', 'aria-hidden': true }));
      }));
  }

  /* ---------------- Finance ---------------- */
  function Sparkline(p) {
    var data = p.data || [], w = p.width || 120, ht = p.height || 36, pad = 3;
    if (data.length < 2) return null;
    var min = Math.min.apply(null, data), max = Math.max.apply(null, data), span = max - min || 1;
    var pts = data.map(function (d, i) { return [pad + (i / (data.length - 1)) * (w - pad * 2), pad + (1 - (d - min) / span) * (ht - pad * 2)]; });
    var line = pts.map(function (q, i) { return (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join(' ');
    var area = line + ' L' + pts[pts.length - 1][0].toFixed(1) + ' ' + ht + ' L' + pts[0][0].toFixed(1) + ' ' + ht + ' Z';
    var last = pts[pts.length - 1];
    return h('svg', { className: cx('bs-spark', p.tone && 'bs-spark--' + p.tone, p.className), width: w, height: ht, viewBox: '0 0 ' + w + ' ' + ht, role: p.label ? 'img' : undefined, 'aria-label': p.label, 'aria-hidden': p.label ? undefined : true },
      p.area !== false && h('path', { className: 'bs-spark__area', d: area, opacity: 0.7 }),
      h('path', { className: 'bs-spark__line', d: line }),
      h('circle', { className: 'bs-spark__end', cx: last[0], cy: last[1], r: 3 }));
  }

  function Delta(p) {
    var d = Number(p.value);
    if (p.value == null || isNaN(d)) return null;
    var good = p.invert ? d < 0 : d > 0;
    var cls = d === 0 ? '' : (good ? 'bs-dtext--good' : 'bs-dtext--bad');
    return h('span', { className: cx('bs-dtext', p.className) },
      h('span', { className: cx('bs-dtext__val', cls) },
        h(Icon, { name: d >= 0 ? 'arrow-up-right' : 'arrow-down-left', size: 14, strokeWidth: 2 }),
        h('span', { className: 'bs-sr' }, d >= 0 ? 'Up ' : 'Down '), formatPercent(d, { locale: p.locale })),
      p.label && h('span', { className: 'bs-dtext__label' }, p.label));
  }

  function compactMoney(v, o) {
    try { return new Intl.NumberFormat((o && o.locale) || 'pt-BR', { style: 'currency', currency: (o && o.currency) || 'BRL', notation: 'compact', maximumFractionDigits: 1 }).format(v); }
    catch (e) { return formatMoney(v, o); }
  }
  function Breakdown(p) {
    if (!p.items || !p.items.length) return null;
    return h('div', { className: 'bs-parts' }, p.items.map(function (it, i) {
      return h('span', { key: i, className: 'bs-parts__item', title: it.label },
        h('span', { className: cx('bs-avatar', 'bs-avatar--xs', it.tone && 'bs-avatar--t' + it.tone), 'aria-hidden': true }, it.initials || String(it.label || '?').charAt(0)),
        h('span', { className: 'bs-sr' }, it.label + ': '),
        h('span', { className: 'bs-parts__v' }, compactMoney(it.value, p.format)));
    }));
  }

  function StatIcon(p) {
    return h('span', { className: cx('bs-sicon', 'bs-sicon--' + (p.variant || 'soft'), p.shape === 'circle' && 'bs-sicon--circle', p.large && 'bs-sicon--lg', p.highlight && 'bs-sicon--hl'), 'aria-hidden': true },
      h(Icon, { name: p.name, size: p.large ? 24 : 18 }));
  }

  function StatCard(p) {
    var o = { locale: p.locale, currency: p.currency, decimals: p.decimals };
    var side = p.layout === 'side';
    var ico = p.icon && h(StatIcon, { name: p.icon, variant: p.iconVariant || 'outline', shape: p.iconShape, highlight: p.highlight, large: side });
    var amount = h(Amount, Object.assign({ value: p.value, size: 'kpi', tone: 'neutral', sign: 'never', hidden: p.hidden }, o));
    var row = (p.delta != null || p.sparkline) && h('div', { className: 'bs-stat__row' },
      h(Delta, { value: p.delta, invert: p.invertDelta, label: p.deltaLabel, locale: p.locale }),
      p.sparkline && h(Sparkline, { data: p.sparkline, tone: p.tone === 'primary' ? undefined : p.tone, width: 96, height: 28 }));
    if (side) {
      return h('div', { className: cx('bs-stat', 'bs-stat--side', p.plain && 'bs-stat--plain', p.className) },
        h('div', { className: 'bs-stat__side' }, ico,
          h('div', { className: 'bs-stat__txt' }, h('span', { className: 'bs-stat__label' }, p.label), amount)),
        (row || p.footer || p.breakdown) && h('div', { className: 'bs-stat__below' }, row,
          h(Breakdown, { items: p.breakdown, format: o }),
          p.footer && h('div', { className: 'bs-stat__note' }, p.footer)));
    }
    return h('div', { className: cx('bs-stat', p.plain && 'bs-stat--plain', p.className) },
      h('div', { className: 'bs-stat__head' },
        h('span', { className: 'bs-stat__label' }, p.label), ico),
      amount, row, h(Breakdown, { items: p.breakdown, format: o }),
      p.footer && h('div', { className: 'bs-stat__foot' }, p.footer));
  }

  function StatStrip(p) {
    var items = p.items || [];
    var o = { locale: p.locale, currency: p.currency, decimals: p.decimals };
    var side = p.layout === 'side';
    return h('div', { className: cx('bs-strip', side && 'bs-strip--side', p.className), style: Object.assign({ gridTemplateColumns: 'repeat(' + items.length + ', minmax(0, 1fr))' }, p.style) },
      items.map(function (it, i) {
        var ico = it.icon && h(StatIcon, { name: it.icon, variant: p.iconVariant || 'soft', shape: p.iconShape, highlight: it.highlight, large: side });
        var label = h('span', { className: 'bs-stat__label' }, it.label);
        var amount = h(Amount, Object.assign({ value: it.value, size: 'kpi', tone: 'neutral', sign: 'never', hidden: p.hidden }, o));
        var delta = h(Delta, { value: it.delta, invert: it.invertDelta, label: it.deltaLabel, locale: p.locale });
        return h('div', { key: i, className: 'bs-strip__item' },
          side ? h('div', { className: 'bs-stat__side' }, ico, h('div', { className: 'bs-stat__txt' }, label, amount))
               : h('div', { className: 'bs-strip__head' }, ico, label),
          side ? null : amount,
          delta, h(Breakdown, { items: it.breakdown, format: o }));
      }));
  }

  var KIND_ICON = { income: 'arrow-down-left', expense: 'arrow-up-right', transfer: 'arrows-swap', investment: 'trending-up' };
  function TransactionRow(p) {
    var v = Number(p.amount) || 0;
    var kind = p.kind || (v >= 0 ? 'income' : 'expense');
    var tone = v >= 0 ? 'income' : 'expense';
    var cat = p.category != null ? String(p.category) : null;
    var o = { locale: p.locale, currency: p.currency, decimals: p.decimals };
    var Tag = p.onClick ? 'button' : 'div';
    return h(Tag, { type: p.onClick ? 'button' : undefined, onClick: p.onClick, className: cx('bs-txn', p.onClick && 'bs-txn--action', p.className) },
      h('span', { className: cx('bs-txn__tile', cat && 'bs-txn__tile--c' + cat), style: p.categoryColor ? { color: p.categoryColor, background: p.categorySoft || 'var(--surface-sunken)' } : undefined }, h(Icon, { name: p.icon || KIND_ICON[kind], size: 20 }),
        p.owner && h('span', { className: cx('bs-txn__owner', p.ownerTone && 'bs-avatar--t' + p.ownerTone), title: p.ownerLabel || p.owner, 'aria-label': p.ownerLabel || p.owner, role: 'img' }, p.owner)),
      h('div', { className: 'bs-txn__main' },
        h('p', { className: 'bs-txn__title' }, p.title, p.recurring && h(Icon, { name: 'repeat', size: 14, label: 'Recurring', style: { color: 'var(--ink-subtle)' } }), p.tag && h('span', { className: 'bs-txn__tag' }, p.tag)),
        p.meta && h('p', { className: 'bs-txn__meta' }, p.meta)),
      h('div', { className: 'bs-txn__end' },
        h(Amount, Object.assign({ value: v, tone: tone, sign: 'always', hidden: p.hidden }, o)),
        p.pending ? h(Badge, { tone: 'warning' }, p.pendingLabel || 'Pending') : (p.date && h('span', { className: 'bs-txn__date' }, p.date))));
  }

  function BudgetBar(p) {
    var spent = Number(p.spent) || 0, limit = Number(p.limit) || 0;
    var ratio = limit > 0 ? spent / limit : 0;
    var warnAt = p.warnAt == null ? 0.8 : p.warnAt;
    var state = ratio > 1 ? 'over' : ratio >= warnAt ? 'warning' : 'ok';
    var o = { locale: p.locale, currency: p.currency, decimals: p.decimals };
    var left = limit - spent;
    return h('div', { className: cx('bs-budget', p.className) },
      h('div', { className: 'bs-budget__row' },
        h('span', { className: 'bs-budget__label' }, p.icon && h(Icon, { name: p.icon, size: 18, style: { color: 'var(--ink-muted)' } }), p.label),
        h('span', { className: cx('bs-budget__pct', state === 'warning' && 'bs-budget__pct--warning', state === 'over' && 'bs-budget__pct--over') },
          state === 'over' && h(Icon, { name: 'alert-circle', size: 14, style: { marginRight: 4, verticalAlign: '-2px' } }), Math.round(ratio * 100) + '%')),
      h('div', { className: 'bs-progress__track', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': limit, 'aria-valuenow': spent, 'aria-label': p.label },
        h('div', { className: cx('bs-progress__fill', state === 'over' ? 'bs-progress__fill--expense' : state === 'warning' ? 'bs-progress__fill--warning' : null), style: { width: Math.min(ratio, 1) * 100 + '%' } })),
      h('div', { className: 'bs-budget__sub' },
        h('span', null, formatMoney(spent, o) + ' ' + (p.ofLabel || 'of') + ' ' + formatMoney(limit, o)),
        h('span', null, left >= 0 ? formatMoney(left, o) + ' ' + (p.leftLabel || 'left') : formatMoney(-left, o) + ' ' + (p.overLabel || 'over'))));
  }

  function AllocationBar(p) {
    var items = p.items || [];
    var total = items.reduce(function (s, it) { return s + (Number(it.value) || 0); }, 0) || 1;
    var o = { locale: p.locale, currency: p.currency, decimals: p.decimals };
    function color(it, i) { return it.color || 'var(--chart-' + ((i % 6) + 1) + ')'; }
    return h('div', { className: cx('bs-alloc', p.className) },
      h('div', { className: 'bs-alloc__bar', role: 'img', 'aria-label': items.map(function (it) { return it.label + ' ' + formatPercent(it.value / total * 100, { locale: p.locale }); }).join(', ') },
        items.map(function (it, i) { return h('div', { key: i, className: 'bs-alloc__seg', style: { flexGrow: it.value, flexBasis: 0, background: color(it, i) } }); })),
      p.legend !== false && h('ul', { className: 'bs-alloc__legend' },
        items.map(function (it, i) {
          return h('li', { key: i, className: 'bs-alloc__item' },
            h('span', { className: 'bs-alloc__sw', style: { background: color(it, i) } }),
            h('span', { className: 'bs-alloc__name' }, it.label),
            p.showAmounts && h('span', { className: 'bs-alloc__amt' }, formatMoney(it.value, o)),
            h('span', { className: 'bs-alloc__pct' }, formatPercent(it.value / total * 100, { locale: p.locale })));
        })));
  }

  var api = {
    Button: Button, IconButton: IconButton, Icon: Icon, TextField: TextField, AmountInput: AmountInput, Select: Select,
    Checkbox: Checkbox, Switch: Switch, SegmentedControl: SegmentedControl, Card: Card, Section: Section, Badge: Badge, Avatar: Avatar,
    Alert: Alert, ProgressBar: ProgressBar, EmptyState: EmptyState, Dialog: Dialog, Sidebar: Sidebar, BottomNav: BottomNav,
    Amount: Amount, StatCard: StatCard, StatStrip: StatStrip, Delta: Delta, TransactionRow: TransactionRow, BudgetBar: BudgetBar, AllocationBar: AllocationBar,
    Sparkline: Sparkline, formatMoney: formatMoney, formatPercent: formatPercent
  };
  window.Aurum = Object.assign(window.Aurum || {}, api);
})();

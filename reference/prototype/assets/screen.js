/* Mounts <x-import> elements as Aurum React components. */
(function () {
  class DCLogic { constructor() { this.props = {}; } }
  var codeEl = document.querySelector('script[type="text/x-dc"]');
  var code = codeEl ? codeEl.textContent : 'class Component extends DCLogic { renderVals() { return {}; } }';
  var Component = new Function('DCLogic', code + '\nreturn Component;')(DCLogic);
  var vals = new Component().renderVals();
  var camel = function (s) { return s.replace(/-([a-z])/g, function (m, c) { return c.toUpperCase(); }); };
  var styleObj = function (s) { var o = {}; s.split(';').forEach(function (d) { var i = d.indexOf(':'); if (i > 0) o[camel(d.slice(0, i).trim())] = d.slice(i + 1).trim(); }); return o; };
  var h = React.createElement;
  Array.prototype.slice.call(document.querySelectorAll('x-import')).reverse().forEach(function (el) {
    var name = el.getAttribute('component-from-global-scope').split('.')[1];
    var props = {};
    Array.prototype.forEach.call(el.attributes, function (a) {
      if (a.name === 'component-from-global-scope') return;
      var m = /^\{\{([\w.]+)\}\}$/.exec(a.value);
      var v = m ? vals[m[1]] : a.value;
      if (a.name === 'style' && typeof v === 'string') v = styleObj(v);
      props[camel(a.name)] = v;
    });
    var kids = el.textContent.trim();
    var box = document.createElement('div');
    box.className = 'x-import-box';
    el.replaceWith(box);
    if (!window.Aurum[name]) { box.textContent = '[missing ' + name + ']'; return; }
    ReactDOM.createRoot(box).render(h(window.Aurum[name], props, kids || undefined));
  });
})();

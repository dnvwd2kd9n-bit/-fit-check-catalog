/* ============================================================
   monetize.js — партнёрский слой каталога fit-check
   ============================================================
   КАК ВКЛЮЧИТЬ ЗАРАБОТОК (нужны только ваши регистрации):

   1) Зарегистрируйтесь в партнёрской сети, например Admitad
      (admitad.com) — там есть офферы ЦУМа, Lamoda, Wildberries
      и других магазинов из каталога. После подтверждения
      вам дадут партнёрский формат ссылок.

   2) Ниже в AFFILIATE_MAP впишите свои шаблоны ссылок.
      Ключ — домен магазина, значение — шаблон, где {url}
      заменяется на ссылку товара из каталога.

      Пример для Admitad:
      "www.tsum.ru": "https://ad.admitad.com/g/ВАШ_ID/?ulp={url}",

   3) Магазины, которых нет в карте, останутся с прямыми
      ссылками — сайт работает корректно в любом случае.

   4) Для аналитики подключите Яндекс.Метрику: создайте счётчик
      на metrika.yandex.ru и вставьте его сниппет в <head>
      index.html (место помечено комментарием ANALYTICS SLOT).
   ============================================================ */

const AFFILIATE_MAP = {
  // "www.tsum.ru":        "https://ad.admitad.com/g/ВАШ_ID/?ulp={url}",
  // "www.lamoda.ru":      "https://ad.admitad.com/g/ВАШ_ID/?ulp={url}",
  // "kixbox.ru":          "https://ad.admitad.com/g/ВАШ_ID/?ulp={url}",
  // "www.wildberries.ru": "https://ad.admitad.com/g/ВАШ_ID/?ulp={url}",
  // "www.ozon.ru":        "https://ad.admitad.com/g/ВАШ_ID/?ulp={url}",
  // "www.nike.com":       "https://ad.admitad.com/g/ВАШ_ID/?ulp={url}",
  // "bape.com":           "https://ad.admitad.com/g/ВАШ_ID/?ulp={url}",
};

(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function () {
    // Партнёрские и покупательные ссылки: кнопки «Купить» и ссылки
    // в колонке «Где купить» таблиц каталога.
    var links = document.querySelectorAll('a.buy, td a[href^="http"]');
    links.forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href || /^tel:|^mailto:/.test(href)) return;
      var u;
      try { u = new URL(href); } catch (e) { return; }
      // 1) Партнёрский редирект, если для домена задан шаблон
      var tpl = AFFILIATE_MAP[u.hostname];
      if (tpl) {
        a.setAttribute('href', tpl.replace('{url}', encodeURIComponent(href)));
        a.setAttribute('data-affiliate', u.hostname);
        return;
      }
      // 2) UTM-метки — чтобы в статистике партнёрок и Метрики
      //    было видно, что покупатель пришёл из каталога
      if (/\.ru$|\.com$|\.app$/.test(u.hostname)) {
        u.searchParams.set('utm_source', 'fit-check');
        u.searchParams.set('utm_medium', 'catalog');
        a.setAttribute('href', u.toString());
      }
    });
  });
})();

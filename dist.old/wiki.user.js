// ==UserScript==
// @name        Battle Cats Wiki Copy
// @description Copy data about units from banner's wiki pages
// @version     1.0
// @namespace   https://github.com/vtvz/bc-godfat-qol
// @author      vtvz
// @match       https://battle-cats.fandom.com/wiki/*
// @updateURL   https://raw.githubusercontent.com/vtvz/bc-godfat-qol/master/dist/wiki.user.js
// @downloadURL https://raw.githubusercontent.com/vtvz/bc-godfat-qol/master/dist/wiki.user.js
// ==/UserScript==
const title = document.querySelector("h1");

if (title) {
  title.style.cursor = "pointer";
  title.onclick = () => {
    const unitNames = [...document.querySelectorAll("tr th:nth-child(1)")]
      .filter((_) => _.textContent.includes("Normal: "))
      .map((_) => _.querySelector("a").textContent.trim());

    const rares = [...document.querySelectorAll("tr td b a")]
      .filter((el) => {
        const href = el.href;
        return href.includes("Super_Rare_Cat") || href.includes("Rare_Cat");
      })
      .map((el) => el.textContent.trim());

    if (rares.length > 0) {
      rares.unshift("// others");
    }

    const content = {
      title: title.textContent.replace(/\(.*?\)/, "").trim(),
      link: window.location.href,
      units: [...unitNames, ...rares],
    };

    navigator.clipboard.writeText(JSON.stringify(content));

    if (content.units.length == 0) {
      alert("Nothing copied really");
    } else {
      alert("Content Copied " + content.units.length);
    }
  };
}

import Banners from "./Banners";
import TierLabels from "./TierLabels";
import TierList from "./TierList";
import UnitsRarity from "./UnitsRarity";

export default class HtmlInjector {
  tierList: TierList;
  unitToBanners: Banners;
  tierLabels: TierLabels;
  unitsRarity: UnitsRarity;

  constructor(
    tierList: TierList,
    unitToBanners: Banners,
    tierLabels: TierLabels,
    unitsRarity: UnitsRarity,
  ) {
    this.tierList = tierList;
    this.unitToBanners = unitToBanners;
    this.tierLabels = tierLabels;
    this.unitsRarity = unitsRarity;
  }

  renderBigBanner() {
    const notice = document.querySelector(".information");
    if (!notice) {
      return;
    }

    const banner = document.createElement("div");
    const tierDesc = Array.from(this.tierLabels.labels)
      .map(([_, [tier, desc]]) => `<b><sup>[${tier}]</sup></b> ${desc}`)
      .join("</li><li>");

    banner.id = "vtvz-big-banner";
    banner.innerHTML = `
      <p>
        You're using <a href="https://github.com/vtvz/bc-godfat-qol/">Battle Cats GodFat QoL Tools</a> created by <a href="https://github.com/vtvz">vtvz</a>
      </p>

      <details>
	      <summary>Here is "documentation" of tags</summary>
        <ul>
          <li>${tierDesc}</li>
          <li>Sell all <b>duplicate</b> Ubers, Legend rares and all Nenekos for NP</li>
        </ul>
      </details>

      <details>
	      <summary>Sources</summary>
        <ul>
          <li>
            <a href="https://docs.google.com/document/u/0/d/10jGnHCqKcaVoQ6uPxohy57YKhQUjo20H_ddVXzSot3I">Tier Lists</a>

            <ul>
              <li>
                <a href="https://docs.google.com/document/d/183G17wJFQL8Ur3AjXEPWZiuhTJBbPwKY7G54pb4htig/edit?tab=t.0">Synced with 10/17/24 doc update</a>
              </li>
            </ul>
          </li>
          <li><a href="https://imgur.com/a/np-charts-9rAfl93">NP Charts</a></li>
        </ul>
      </details>

      <details>
	      <summary>Credits</summary>
        <ul>
          <li><a href="https://www.reddit.com/user/XskullBC/">XskullBC</a> for NP Charts and Tier lists</li>
          <li><a href="https://github.com/vtvz">vtvz</a> for code</li>
        </ul>
      </details>
    `;

    notice.insertAdjacentElement("afterend", banner);
  }

  inject() {
    this.renderBigBanner();

    const elms = document.querySelectorAll(
      ".cat a:first-child, .found_cats a:first-child, .cats label span",
    );

    const missed = new Set();

    for (const el of elms) {
      const unitName = el.textContent;
      const tiers = this.renderTiers(unitName);

      if (tiers) {
        el.innerHTML += tiers;
      } else {
        missed.add(unitName);
      }

      const elParent = el.parentElement;

      const unitBanners = this.renderBanners(
        unitName,
        !!el.closest(".found_cats"),
      );

      if (unitBanners) {
        elParent.innerHTML += unitBanners;
      }

      if (elParent.classList.contains("cat")) {
        elParent.classList.add("vtvz-" + this.unitsRarity.getRarity(unitName));
      }
    }

    console.log("missed", missed);

    this.injectStyle();
  }

  renderTiers(unitName: string): string {
    const tiers = this.tierList.asArray(unitName);

    if (!tiers) {
      return;
    }

    const htmlTiers = tiers
      .map((tier) => this.tierLabels.findByTier(tier))
      .map(({ tier, label }) => `<span title="${label}">[${tier}]</span>`);

    return `<sup><b>${htmlTiers.join(" ")}</b></sup>`;
  }

  renderBanners(unitName: string, isInline: boolean): string {
    const unitBanners = this.unitToBanners.asArray(unitName);
    if (!unitBanners) {
      return;
    }

    const links = unitBanners.map(
      (banner) =>
        `<a href="${banner.link}">${banner.title.replace("/Gacha Drop", "").replace(/Collaboration Event.*/, "")}</a>`,
    );

    const el = isInline ? "span" : "div";

    return `<${el} class="vtvz-banners">${links.join(" | ")}</${el}>`;
  }

  injectStyle() {
    var style = document.createElement("style");
    const styleText = `
      .owned {
        background-color: #34aeae !important;
      }

      .vtvz-banners {
        max-width: 350px;
        font-size: 14px;
      }

      .vtvz-legend:not(.legend) {
        # border-top: 25px solid darkviolet;
        background-color: darkviolet !important;
        color: #d8a56f !important;
      }

      .vtvz-legend:not(.legend) a {
        color: #d8a56f !important;
      }

      .vtvz-uber:not(.uber) {
        # border-top: 25px solid red;
        background-color: red !important;
      }

      .vtvz-super:not(.supa) {
        # border-top: 25px solid gold;
        background-color: gold !important;
      }

      .vtvz-rare {
      }

      .vtvz-special {
      }

      .vtvz-normal {
      }

      #vtvz-big-banner {
        border: 1px solid black;
        padding: 10px;
        margin-bottom: 10px;
        max-width: 1000px;
        display: inline-block;
      }

      #vtvz-big-banner ul {
        margin-bottom: 0;
      }

      #vtvz-big-banner summary {
        cursor: pointer;
      }
    `;

    style.appendChild(document.createTextNode(styleText));

    document.getElementsByTagName("head")[0].appendChild(style);
  }
}

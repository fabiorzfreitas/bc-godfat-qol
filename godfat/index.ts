import {
  descriptionsDataRaw,
  npChartRaw,
  tierListRaw,
  bannersRaw,
  unitsRarityRaw,
} from "./data";
import TierList from "./TierList";
import DescriptionData from "./DescriptionData";
import Banners from "./Banners";
import TierLabels from "./TierLabels";
import UnitsRarity from "./UnitsRarity";
import HtmlInjector from "./HtmlInjector";

const descriptionData = new DescriptionData().parse(descriptionsDataRaw);

const tierLabels = new TierLabels().npChart(npChartRaw);

const tierList = new TierList(descriptionData)
  .parse(tierListRaw)
  .npChart(npChartRaw);

const unitToBanners = new Banners().parse(bannersRaw);

for (const fullName of descriptionData.fullNames) {
  if (!tierList.asArray(fullName)) {
    console.log(`${fullName} is not found in tierlist`);
  }
}

if (typeof window !== "undefined") {
  new HtmlInjector(
    tierList,
    unitToBanners,
    tierLabels,
    new UnitsRarity(unitsRarityRaw),
  ).inject();
}

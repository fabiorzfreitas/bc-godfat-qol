import { NpChartItems } from "./data/npChartRaw";
import DescriptionData from "./DescriptionData";

export default class TierList {
  descriptionData: DescriptionData;
  tierList: Map<string, Set<string>> = new Map();

  constructor(descriptionData: DescriptionData) {
    this.descriptionData = descriptionData;
  }

  addItem(key: string, value: string) {
    if (!this.tierList[key]) {
      this.tierList[key] = new Set();
    }
    this.tierList[key].add(value);
  }

  asArray(key: string): string[] {
    const val = this.tierList[key];
    if (!val) {
      return;
    }

    return [...val];
  }

  parse(tierListRaw: string[]): TierList {
    for (const item of tierListRaw) {
      const [tier, unitsRaw] = item.split(" - ");

      const units = unitsRaw.replaceAll("’", "'").split(", ");

      for (const unit of units) {
        let unitName = unit;
        let unitTier = tier;

        const withCond = unit.match(new RegExp("(.*) \\((.*)\\)"));
        if (withCond) {
          let [, unitNameParsed, unitTierCond] = withCond;

          unitName = unitNameParsed;
          unitTier = `${unitTier}-${unitTierCond}`;
        }

        const fullName = this.descriptionData.nameToFullName[unitName];

        if (!fullName) {
          console.log("don't have full name in desc", unitName);

          this.addItem(unitName, unitTier);

          continue;
        }
        this.addItem(fullName, unitTier);
      }
    }

    return this;
  }

  npChart(npChart: NpChartItems): TierList {
    for (const npKey in npChart) {
      for (const fullName of npChart[npKey].units) {
        this.addItem(fullName, "NP-" + npKey.toUpperCase());
      }
    }
    return this;
  }
}

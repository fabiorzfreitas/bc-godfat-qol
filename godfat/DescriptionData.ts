export default class DescriptionData {
  fullNames: string[] = [];

  nameToFullName: { [key: string]: string } = {
    Siege: "Mighty Kat-A-Pult",
    Ice: "Ice Cat",
    Issun: "Issun Boshi",
    "Prof Abyss": "Doktor Heaven",
    Shishilan: "Togeluga",
    Ushi: "Ushiwakamaru",
    Emperor: "Emperor Cat",
    Akuma: "Akuma",
    Dartanyan: "D'artanyan",
    Sirius: "Goddess of Light Sirius",
  };

  parse(data: string[]): DescriptionData {
    const names = [];

    for (const index in data) {
      const item = data[index];
      if (parseInt(index) % 2 == 0) {
        const name = item
          .replaceAll("’", "'")
          .split(" - ")[0]
          .replace(/\(.*?\)/, "") // The case for Busters
          .trim();

        names.push(name);
      } else {
        const [, realName] = item.match(new RegExp(".*/(.*)_\\(.*?\\)"));
        this.fullNames.push(
          decodeURI(realName.replaceAll("_", " ")).replaceAll("’", "'"),
        );
      }
    }

    for (const index in names) {
      this.nameToFullName[names[index]] = this.fullNames[index];
      this.nameToFullName[this.fullNames[index]] = this.fullNames[index];
    }

    return this;
  }
}

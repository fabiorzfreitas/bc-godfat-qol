export default class DescriptionData {
  fullNames: string[] = [];

  nameToFullName: { [key: string]: string } = {
    "Siege": "Mighty Kat-A-Pult",
    "Ice": "Ice Cat",
    "Issun": "Issun Boshi",
    "Shishilan": "Togeluga",
    "Ushi": "Ushiwakamaru",
    "Emperor": "Emperor Cat",
    "Akuma": "Akuma",
    "Dartanyan": "D'artanyan",
    "Sirius": "Goddess of Light Sirius",
    "Amazing Catman": "The Amazing Catman",
    "Angel Twinstars": "Snow Angel Twinstars",
    "Aquablaster Saki": "Squirtgun Saki",
    "Axel": "Mech Patrol Axel",
    "Bikiniluga": "Summerluga",
    "Bride Balaluga": "Betrothed Balaluga",
    "Butler Vigler": "White Butler Vigler",
    "Chocoladite": "Sweet Aphrodite",
    "Coast Kaguya": "Kaguya of the Coast",
    "Coastal Kanna": "Coastal Explorer Kanna",
    "Dark Luna": "Netherworld Nymph Lunacia",
    "Dark Lunos": "Lone Moon Lunos",
    "Empress": "Princess Cat",
    "Everbloom Kamukura": "Blooming Kamukura",
    "Gunhauzer": "Mighty Morta-Loncha",
    "Kat-A-Pult": "Mighty Kat-A-Pult",
    "Kotaro": "Fuma Kotaro",
    "Lil Valkyrie Dark": "Li'l Valkyrie Dark",
    "Lil Valkyrie": "Li'l Valkyrie",
    "Lilith": "Lilith Cat",
    "Lovestruck Demon": "Lovestruck Lesser Demon",
    "Luna": "Celestial Child Luna",
    "Lunos": "Squire Luno",
    "Mekako,": "Mekako Saionji",
    "Moonshade Kaworu": "Kaworu & Cat",
    "Music Thundia": "Music Fest Thundia",
    "Phonoa": "Child of Destiny Phono",
    "Psychoduck": "Bunny & Canard",
    "Sidmi": "Sorceress Sidmi",
    "Skanda": "Victorious Skanda",
    "Skull Vars": "Skull Rider Vars",
    "Blizana": "Bliza",
    "Trixi": "Trixi the Merc",
    "Winter Kaihime": "Winter General Kaihime",
    "Staal": "Agent Staal",
    "Bride Chronos": "Chronos the Bride",
    "Sweet Mekako": "Sweet Love Mekako",
    "Arctic Bloom": "Frozen Rose Cat",
    "Beach Lilin": "Night Beach Lilin",
    "Warlock": "Warlock and Pierre",
    "Diabolosa": "Mighty Deth-Troy-R",
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

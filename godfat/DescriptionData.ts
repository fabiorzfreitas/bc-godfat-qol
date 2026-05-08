export default class DescriptionData {
  fullNames: string[] = [];

  nameToFullName: { [key: string]: string } = {
    "Siege": "Mighty Kat-A-Pult",
    "Ice": "Ice Cat",
    "Issun": "Issun Boshi",
    "Prof Abyss": "Doktor Heaven",
    "Shishilan": "Togeluga",
    "Ushi": "Ushiwakamaru",
    "Emperor": "Emperor Cat",
    "Akuma": "Akuma",
    "Dartanyan": "D'artanyan",
    "Sirius": "Goddess of Light Sirius",
    "Amazing Catman": "The Amazing Catman",
    "Angel Twinstars": "Snow Angel Twinstars",
    "Aquablaster Saki": "Squirtgun Saki",
    "Arctic Cat": "Arctic Bloom Cat",
    "Axel": "Mech Patrol Axel",
    "Bahamut": "Bahamut Cat",
    "Bikiniluga": "Summerluga",
    "Bride Balaluga": "Betrothed Balaluga",
    "Butler Vigler": "White Butler Vigler",
    "Cat God 2": "Cat God the Great",
    "Chocoladite": "Sweet Aphrodite",
    "Coast Kaguya": "Kaguya of the Coast",
    "Coastal Kanna": "Coastal Explorer Kanna",
    "Dark Luna": "Netherworld Nymph Lunacia",
    "Dark Lunos": "Lone Moon Lunos",
    "Darwin": "Master of Selection Darvin",
    "Doron": "Elder Mask Doron",
    "Everbloom Kamukura": "Blooming Kamukura",
    "Filibuster": "Filibuster Cat X",
    "Gunhauzer": "Mighty Morta-Loncha",
    "Hermit": "Hermit Cat",
    "Idi": "Idi:N",
    "Jagando": "Jagando Jr.",
    "Kat-A-Pult": "Mighty Kat-A-Pult",
    "Klay": "Warlock and Pierre",
    "Kotaro": "Fuma Kotaro",
    "Lilith": "Lilith Cat",
    "Lovestruck Demon": "Lovestruck Lesser Demon",
    "Luna": "Celestial Child Luna",
    "Lunos": "Squire Luno",
    "Luza": "Ancient Egg: N000",
    "Mecha Bun": "Mecha-Bun",
    "Mekako,": "Mekako Saionji",
    "Mina": "Red Riding Mina",
    "Moonshade Kaworu": "Kaworu & Cat",
    "Music Thundia": "Music Fest Thundia",
    "Naala": "Elder Beast Naala",
    "Newton": "Master of Logic Newton",
    "Night Lilin": "Night Beach Lilin",
    "Nova": "Master of Life Dr. Nova",
    "Phonoa": "Child of Destiny Phono",
    "Psychoduck": "Bunny & Canard",
    "Sidmi": "Sorceress Sidmi",
    "Skanda": "Victorious Skanda",
    "Skull Vars": "Skull Rider Vars",
    "Socrates": "Master of Mind Soractes",
    "Blizana": "Bliza",
    "Tropical Kalisa": "",
    "Uril": "Master Uril",
    "Urs": "Urs & Fenrir",
    "Ururun": "Ururun Wolf",
    "Valkyrie": "Valkyrie Cat",
    "Winter Kaihime": "Winter General Kaihime",
    "Yulala": "Masked Yulala"
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

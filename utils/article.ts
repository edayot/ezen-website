interface LanguageData {
  name: string;
  place: string;
  desc: string;
}

export interface PlantData {
  latin_name: string;
  image: string;
  image_filename: string;
  fr: LanguageData;
  en: LanguageData;
  it: LanguageData;
  date: number;
}

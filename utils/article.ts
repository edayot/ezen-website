interface LanguageData {
  name: string;
  place: string;
  desc: string;
}

interface Position {
  x: number;
  y: number;
}


export interface PlantData {
  latin_name: string;
  image: string;
  image_filename: string;
  image_height: number;
  image_width: number;
  fr: LanguageData;
  en: LanguageData;
  it: LanguageData;
  date: number;
  position?: Position;
  disable_map_position: boolean;
  disable_in_search: boolean;
  map_marker?: string ;
  protected?: boolean;
}

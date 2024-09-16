interface LanguageData {
  name: string;
  place: string;
  desc: string;
}

interface Position {
  x: number;
  y: number;
}

export const markers = ["bush", "tree1", "tree2"]

export interface PlantData {
  latin_name: string;
  image: string;
  image_filename: string;
  fr: LanguageData;
  en: LanguageData;
  it: LanguageData;
  date: number;
  position?: Position;
  disable_map_position: boolean;
  disable_in_search: boolean;
  map_marker?: (typeof markers)[number] ;
  protected?: boolean;
}

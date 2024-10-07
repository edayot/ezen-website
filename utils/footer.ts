import { locales } from "./langs";

export type TranslatedValue = Record<(typeof locales)[number], string>

export interface FooterData {
    tooltip?: TranslatedValue;
    icon: string;
    url: string;
    protected?: boolean;
}
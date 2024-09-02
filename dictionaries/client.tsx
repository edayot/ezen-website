"use client";

import {createProxy} from "./proxy"

let temp = {
    dict: {}
}




export function useTranslation() : any {
    return createProxy(temp.dict)
}

export function TranslationComponent({dict, children}: {dict: any, children: React.ReactNode}) {
    temp.dict = dict
    return <>
        {children}
    </>
}
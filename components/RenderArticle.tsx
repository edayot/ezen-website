"use client";





import Markdown from 'react-markdown'
import {Image} from "@nextui-org/react";




export default function RenderArticle(
    {data, lang}: {data: any, lang: string}
) {
    let name = `${data[lang].name} (${data.latin_name})`
    return (
    <div className="flex flex-row min-h-screen justify-center">
      <div className="w-5/6 max-w-xl">
        <div className='flex flex-col gap-2 w-full'>
            <div className='flex justify-center items-center'>
                <Image src={data.image} alt={name}/>
            </div>
            <h1>{name}</h1>
            <h2>{data[lang].place}</h2>
            <Markdown className=" space-y-5">{data[lang].desc}</Markdown>
        </div>
      </div>
    </div>
    );
}


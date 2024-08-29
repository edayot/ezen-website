





import Markdown from 'react-markdown'




export default function RenderArticle(
    {name, latin_name, place, desc, image}: {name: string, latin_name: string, place: string, desc: string, image: string}
) {
    return (
        <div className='flex flex-col gap-2 w-full'>
            <h1>{name}</h1>
            <h2>{latin_name}</h2>
            <h3>{place}</h3>
            <img src={image}/>
            <Markdown>{desc}</Markdown>
        </div>
    );
}


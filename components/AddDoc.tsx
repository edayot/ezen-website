"use client";

import { db } from '@/utils/firebase';
import { collection, addDoc } from "firebase/firestore"; 

import {Textarea, Input, image} from "@nextui-org/react";
import RenderArticle from './RenderArticle';
import { useDropzone } from 'react-dropzone';






function CreateInput({all, setAll, lang}: {all: any, setAll: (value: any) => void, lang: string}) {
    
    return (
        <>
        
    <div className='flex flex-col gap-2 w-full'>
    <div>
        {lang}
    </div>
    <Input
        className='w-1/2'
        label="Name"
        placeholder={lang}
        value={all[lang].name}
        onChange={(e) => {
            let newAll = {...all};
            newAll[lang] = {...newAll[lang], name: e.target.value};
            setAll(newAll);
        }}
    />
    <Input
        className='w-2/3'
        label="Place"
        placeholder={lang}
        value={all[lang].place}
        onChange={(e) => {
            let newAll = {...all};
            newAll[lang] = {...newAll[lang], place: e.target.value};
            setAll(newAll);
        }}
    />
    <Textarea
        label="Desc"
        placeholder={lang}
        value={all[lang].desc}
        onChange={(e) => {
            let newAll = {...all};
            newAll[lang] = {...newAll[lang], desc: e.target.value};
            setAll(newAll);
        }}
        minRows={15}
        maxRows={15}
    />
    
    </div>
    </>);
}


function CreateGlobalInput({all, setAll, lang}: {all: any, setAll: (value: any) => void, lang: string}) {
    const onDrop = (acceptedFiles: any) => {
        // convert to base64 and set to state
        const reader = new FileReader();
        reader.onload = () => {
            setAll({...all, image: reader.result});
        };
        reader.readAsDataURL(acceptedFiles[0]);
      };
      const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false });
        return (
        <div className='flex flex-col gap-2 w-full'>
        <Input
            className='w-1/2'
            label="Latin Name"
            placeholder={lang}
            value={all.latin_name}
            onChange={(e) => setAll({...all, latin_name: e.target.value})}
        />
        <div {...getRootProps()} className="dropzone-container">
            <input {...getInputProps()}/>
            <div className="dropzone border">
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>


        </div>
        </div>);
}



function AddItem({all, setAll}: {all: any, setAll: (value: any) => void}) {

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            let timestamp = (new Date()).getTime()
            const docRef = await addDoc(collection(db, "articles"), all);
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    return (
        <>
        <form onSubmit={handleSubmit}>
            <div className='flex flex-col gap-2'>
                <div className="flex flex-row justify-center">
                    <div className="w-5/6 max-w-xl">
                        <CreateGlobalInput all={all} setAll={setAll} lang='(global)'/>
                    </div>
                </div>
                <div className=' flex flex-row gap-2 border'> 
                    <CreateInput all={all} setAll={setAll} lang='fr'/>
                    <CreateInput all={all} setAll={setAll} lang='en'/>
                    <CreateInput all={all} setAll={setAll} lang='it'/>
                </div>
            </div>
            <button type="submit">Add Item</button>
        </form>

        </>
    );
};

export default AddItem;

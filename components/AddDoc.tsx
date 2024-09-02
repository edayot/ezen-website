"use client";

import { useState } from 'react';
import { db } from '@/utils/firebase';
import { collection, addDoc } from "firebase/firestore"; 

import {Textarea, Input, image} from "@nextui-org/react";
import RenderArticle from './RenderArticle';






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
        value={all.name}
        onChange={(e) => setAll({...all, name: e.target.value})}
    />
    <Input
        className='w-2/3'
        label="Place"
        placeholder={lang}
        value={all.place}
        onChange={(e) => setAll({...all, place: e.target.value})}
    />
    <Textarea
        label="Desc"
        placeholder={lang}
        value={all.desc}
        onChange={(e) => setAll({...all, desc: e.target.value})}
        minRows={15}
        maxRows={15}
    />
    
    </div>
    </>);
}


function CreateGlobalInput({all, setAll, lang}: {all: any, setAll: (value: any) => void, lang: string}) {
        return (
        <div className='flex flex-col gap-2 w-full'>
        <Input
            className='w-1/2'
            label="Latin Name"
            placeholder={lang}
            value={all.latin_name}
            onChange={(e) => setAll({...all, latin_name: e.target.value})}
        />
        <Input
            className='w-2/3'
            label="Image"
            placeholder={lang}
            value={all.image}
            onChange={(e) => setAll({...all, image: e.target.value})}
        />
        </div>);
}



function AddItem() {
    const [all, setAll] = useState({
        latin_name: '',
        image: '',

    });
    const [allFR, setAllFR] = useState({
        name: '',
        desc: '',
        place: '',
    });
    const [allEN, setAllEN] = useState({
        name: '',
        desc: '',
        place: '',
    });
    const [allIT, setAllIT] = useState({
        name: '',
        desc: '',
        place: '',
    });

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            let timestamp = (new Date()).getTime()
            const docRef = await addDoc(collection(db, "articles"), {
                latin_name: all.latin_name,
                image: all.image,
                fr: allFR,
                en: allEN,
                it: allIT,
                date: timestamp

            });
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
                    <CreateInput all={allFR} setAll={setAllFR} lang='(fr)'/>
                    <CreateInput all={allEN} setAll={setAllEN} lang='(en)'/>
                    <CreateInput all={allIT} setAll={setAllIT} lang='(it)'/>
                </div>
            </div>
            <button type="submit">Add Item</button>
        </form>

        <br />

        <RenderArticle 
            name={allFR.name}
            latin_name={all.latin_name}
            place={allFR.place}
            desc={allFR.desc}
            image={all.image}
        />

        </>
    );
};

export default AddItem;

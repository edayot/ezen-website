"use client";

import {Textarea, Input, Image, Card, CardBody} from "@nextui-org/react";
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';






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
        // convert to base64 and set to state + set filename
        const reader = new FileReader();
        reader.onload = () => {
            setAll({...all, image_filename: acceptedFiles[0].name, image: reader.result});
        };
        reader.readAsDataURL(acceptedFiles[0]);
      };
      let upload_text = 'Drop or click to upload your image';
        if (all.image_filename) {
            upload_text = `Click to change image, current: ${all.image_filename}`;
        }
      const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false });
        return (
        <div className='flex flex-col gap-2 w-full justify-center items-center'>
            <Input
                className='w-1/2'
                label="Latin Name"
                placeholder={lang}
                value={all.latin_name}
                onChange={(e) => setAll({...all, latin_name: e.target.value})}
            />
            <div {...getRootProps()} className="dropzone-container">
                <input {...getInputProps()}/>
                <div className="dropzone">
                    <Card className='w-40 h-30'>
                        <CardBody>
                            <div className='flex flex-col justify-center items-center gap-6 text-center'>
                                <FiUpload size={50}/>
                                <p>{upload_text}</p>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>);
}



function AddItem({all, setAll}: {all: any, setAll: (value: any) => void}) {

    return (
        <>
        <div className='flex flex-col gap-2'>
            <div className="flex flex-row justify-center">
                <div className="w-5/6 max-w-xl">
                    <CreateGlobalInput all={all} setAll={setAll} lang='(global)'/>
                </div>
            </div>
            <div className=' flex flex-row gap-2'> 
                <CreateInput all={all} setAll={setAll} lang='fr'/>
                <CreateInput all={all} setAll={setAll} lang='en'/>
                <CreateInput all={all} setAll={setAll} lang='it'/>
            </div>
        </div>

        </>
    );
};

export default AddItem;

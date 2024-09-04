"use client";
import {Tabs, Tab, Card, CardBody, Button} from "@nextui-org/react";
import AddDoc from '@/components/AddDoc'
import { useState } from "react";
import { Element } from "./ArticleCard";
import RenderArticle from "./RenderArticle";
import { db } from '@/utils/firebase';
import { collection, addDoc } from "firebase/firestore"; 
import { PlantData } from "@/utils/article";
import { locales } from "@/langs";



export function NewArticleView({lang}: {lang: typeof locales[number]}) {
    const [data, setData] = useState<PlantData>({
        latin_name: '',
        image: '',
        image_filename: '',
        date: 0,
        fr: {
            name: '',
            place: '',
            desc: ''
        },
        en: {
            name: '',
            place: '',
            desc: ''
        },
        it: {
            name: '',
            place: '',
            desc: ''
        },
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        try {
            let timestamp = (new Date()).getTime()
            const docRef = await addDoc(collection(db, "articles"), {...data, date: timestamp});
            console.log("Document written with ID: ", docRef.id);
        } catch (e: any) {
            console.error("Error adding document: ", e);
            setError(e.message);
        }
        setLoading(false);
    };
    return (
      <div className="flex flex-col">
        <div className="flex justify-end items-center">
          <Button 
            color="primary"
            className="w-1/5"
            onClick={handleSubmit} 
            isLoading={loading}
          >
            Add to database
          </Button>
        </div>
        <Tabs aria-label="Options" className=" justify-center">
            <Tab key="form" title="Form">
              <Card>
                <CardBody>
                    <AddDoc all={data} setAll={setData}/>
                </CardBody>
              </Card>  
            </Tab>
            <Tab key="card" title="Small preview">
              <Card>
                <CardBody>
                  <div className='justify-center'>
                    <Element data={data} lang={lang} id="1"/>
                  </div>
                </CardBody>
              </Card>  
            </Tab>
            <Tab key="full" title="Full Article">
                <RenderArticle data={data} lang={lang}/>
            </Tab>
          </Tabs>
      </div>
    )
}
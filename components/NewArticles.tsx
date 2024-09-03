"use client";
import {Tabs, Tab, Card, CardBody} from "@nextui-org/react";
import AddDoc from '@/components/AddDoc'
import { useState } from "react";
import { Element } from "./ArticleCard";
import RenderArticle from "./RenderArticle";



export function NewArticleView({lang}: {lang: string}) {
    const [data, setData] = useState({
        latin_name: '',
        image: '',
        image_filename: '',
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
    return (
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
    )
}
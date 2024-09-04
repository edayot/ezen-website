"use client";
import { Tabs, Tab, Card, CardBody, Button } from "@nextui-org/react";
import AddDoc from "@/components/AddDoc";
import { useState } from "react";
import { Element } from "./ArticleCard";
import RenderArticle from "./RenderArticle";
import { db } from "@/utils/firebase";
import { collection, setDoc, doc, addDoc } from "firebase/firestore";
import { PlantData } from "@/utils/article";
import { locales } from "@/langs";

export function ArticleEditor({
  lang,
  initData = {
    latin_name: "",
    image: "",
    image_filename: "",
    date: 0,
    fr: {
      name: "",
      place: "",
      desc: "",
    },
    en: {
      name: "",
      place: "",
      desc: "",
    },
    it: {
      name: "",
      place: "",
      desc: "",
    },
  },
  id = undefined,
}: {
  lang: (typeof locales)[number];
  initData?: PlantData;
  id?: string | undefined;
}) {
  const [data, setData] = useState<PlantData>(initData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      let timestamp = new Date().getTime();
      const colRef = collection(db, "articles");
      if (id) {
        const docRef = doc(colRef, id);
        await setDoc(docRef, { ...data, date: timestamp });
        console.log("Document edited with ID: ", docRef.id);
      } else {
        const docRef = await addDoc(colRef, { ...data, date: timestamp });
        console.log("Document written with ID: ", docRef.id);
      }
    } catch (e: any) {
      console.error("Error adding document: ", e);
      setError(e.message);
    }
    setLoading(false);
  };
  return (
    <div className="flex flex-col">
      <div className="flex flex-col justify-end items-end">
        <Button
          color="primary"
          className="w-52"
          onClick={handleSubmit}
          isLoading={loading}
        >
          Save to database
        </Button>
        <div className="text-red-500">{error}</div>
      </div>
      <br />
      <Tabs aria-label="Options" className=" justify-center">
        <Tab key="form" title="Form">
          <Card>
            <CardBody>
              <AddDoc all={data} setAll={setData} />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="card" title="Small preview">
          <Card>
            <CardBody>
              <div className="justify-center">
                <Element data={data} lang={lang} id="1" />
              </div>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="full" title="Full Article">
          <RenderArticle data={data} lang={lang} />
        </Tab>
      </Tabs>
    </div>
  );
}

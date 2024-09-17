"use client";
import { Tabs, Tab, Card, CardBody, Button, Tooltip } from "@nextui-org/react";
import AddDoc from "@/components/AddDoc";
import { useState } from "react";
import { Element } from "./ArticleCard";
import RenderArticle from "./RenderArticle";
import { collectionRef } from "@/utils/firebase";
import { collection, setDoc, doc, addDoc } from "firebase/firestore";
import { PlantData } from "@/utils/article";
import { locales } from "@/langs";
import { FiCheck, FiSave } from "react-icons/fi";
import { EditMap } from "./map/EditMap";
import { SelectMarker } from "./map/MarkerSelector";
import { useTranslation } from "@/dictionaries/client";

export function ArticleEditor({
  lang,
  initData,
  id = undefined,
}: {
  lang: (typeof locales)[number];
  initData?: PlantData;
  id?: string | undefined;
}) {
  const initDataPlaceHolder: PlantData = {
    disable_in_search: false,
    disable_map_position: false,
    latin_name: "",
    image: "",
    image_filename: "",
    image_height: -1,
    image_width: -1,
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
  }

  const [data, setData] = useState<PlantData>({...initDataPlaceHolder, ...initData});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const t = useTranslation();
  let saveIcon = <FiSave size={25} />;
  if (success) {
    saveIcon = <FiCheck size={25} />;
  }
  const [error, setError] = useState("");
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      let timestamp = new Date().getTime();
      if (id) {
        const docRef = doc(collectionRef, id);
        await setDoc(docRef, { ...data, date: timestamp });
        console.log("Document edited with ID: ", docRef.id);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 1000);
      } else {
        const docRef = await addDoc(collectionRef, { ...data, date: timestamp });
        console.log("Document written with ID: ", docRef.id);
        setSuccess(true);
        setData(initDataPlaceHolder);
        setTimeout(() => {
          setSuccess(false);
        }, 1000);
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
        <Tooltip content={t["articles.new.global.save"]}>
          <Button
            color="primary"
            variant="bordered"
            onClick={handleSubmit}
            isIconOnly
            isLoading={loading}
          >
            {saveIcon}
          </Button>
        </Tooltip>
        <div className="text-red-500">{error}</div>
      </div>
      <br />
      <Tabs aria-label="Options" className=" justify-center">
        <Tab key="form" title={t["articles.new.tabs.form"]}>
          <Card>
            <CardBody>
              <AddDoc all={data} setAll={setData} locale={lang} />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="map" title={t["articles.new.tabs.set_map_position"]}>
          <div className="flex flex-row">
            <SelectMarker all={data} setAll={setData}/>
            <div className="flex items-center justify-center grow">
              <div className="w-full h-72">
                <EditMap all={data} setAll={setData} />
              </div>
            </div>
          </div>
        </Tab>
        <Tab key="card" title={t["articles.new.tabs.small_preview"]}>
          <Card>
            <CardBody>
              <div className="justify-center">
                <Element data={data} lang={lang} id="1" className="w-[15rem]" />
              </div>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="full" title={t["articles.new.tabs.full_article"]}>
          <RenderArticle data={data} lang={lang} />
        </Tab>
      </Tabs>
    </div>
  );
}

"use client";
import { Element } from "@/components/ArticleCard";
import FormEditor from "@/components/FormEditor";
import { LangSwitch } from "@/components/NavBar";
import RenderArticle from "@/components/RenderArticle";
import { useTranslation } from "@/dictionaries/client";
import { PlantData } from "@/utils/article";
import { articlesRef } from "@/utils/firebase";
import { locales } from "@/utils/langs";
import {
  Button,
  Card,
  CardBody,
  Code,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tab,
  Tabs,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { addDoc, doc, setDoc } from "firebase/firestore";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { lazy, useState } from "react";
import { FiCheck, FiInfo, FiSave } from "react-icons/fi";
import { Bounce, toast } from "react-toastify";

const EditMap = lazy(() =>
  import("@/components/map/EditMap").then((mod) => ({ default: mod.EditMap })),
);
const SelectMarker = lazy(() =>
  import("@/components/map/MarkerSelector").then((mod) => ({
    default: mod.SelectMarker,
  })),
);
const UploadMarker = lazy(() =>
  import("@/components/map/UploadMarkerComponent").then((mod) => ({
    default: mod.UploadMarker,
  })),
);

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
    es: {
      name: "",
      place: "",
      desc: "",
    },
    de: {
      name: "",
      place: "",
      desc: "",
    },
  };

  const [data, setData] = useState<PlantData>({
    ...initDataPlaceHolder,
    ...initData,
  });
  const [articleLang, setArticleLang] = useState(lang);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const t = useTranslation();
  const router = useRouter();
  const { theme } = useTheme();

  let saveIcon = <FiSave size={25} />;
  if (success) {
    saveIcon = <FiCheck size={25} />;
  }

  const toastError = (message: string) => {
    toast.error(message, {
      position: "bottom-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition: Bounce,
      theme: theme,
    });
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!data.latin_name) {
      toastError("Latin name is required to save the article");
      return;
    }
    setLoading(true);
    try {
      let timestamp = new Date().getTime();
      if (id) {
        const docRef = doc(articlesRef, id);
        await setDoc(docRef, { ...data, date: timestamp });
        console.log("Document edited with ID: ", docRef.id);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 1000);
      } else {
        const docRef = await addDoc(articlesRef, {
          ...data,
          date: timestamp,
        });
        console.log("Document written with ID: ", docRef.id);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 1000);
        if (!id) {
          router.push(`/article/${docRef.id}`);
        }
      }
    } catch (e: any) {
      console.error("Error adding document: ", e);
      toastError(e.message);
    }
    setLoading(false);
  };
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-center">
        <div className="flex flex-row justify-start w-full gap-3 items-center">
          {t["articles.new.global.change_article_lang"].replace(
            "%s",
            t[`navbar.lang_switch.${articleLang}`],
          )}
          <LangSwitch
            size={20}
            lang={articleLang}
            handleClick={(lang: string) =>
              setArticleLang(lang as (typeof locales)[number])
            }
          />
        </div>
        <div className="flex flex-row justify-end w-full gap-2">
          <MarkdownCheatSheetButton />
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
        </div>
      </div>
      <br />
      <Tabs aria-label="Options" className=" justify-center">
        <Tab key="form" title={t["articles.new.tabs.form"]}>
          <Card>
            <CardBody>
              <FormEditor all={data} setAll={setData} locale={lang} />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="map" title={t["articles.new.tabs.set_map_position"]}>
          <div className="flex flex-row gap-4">
            <div className="min-w-36">
              <SelectMarker all={data} setAll={setData} />
              <UploadMarker all={data} setAll={setData} />
            </div>
            <div className="flex items-center justify-center grow">
              <div className="w-full h-96">
                <EditMap all={data} setAll={setData} />
              </div>
            </div>
          </div>
        </Tab>
        <Tab key="card" title={t["articles.new.tabs.small_preview"]}>
          <br />
          <div className="justify-center items-center flex">
            <Element
              data={data}
              lang={articleLang}
              id="1"
              className="w-[15rem]"
            />
          </div>
        </Tab>
        <Tab key="full" title={t["articles.new.tabs.full_article"]}>
          <RenderArticle data={data} lang={articleLang} />
        </Tab>
      </Tabs>
    </div>
  );
}

function MarkdownCheatSheetButton() {
  const stringExample = `
# Pluto

**Pluto** (minor-planet designation: *134340 Pluto*)
is a
[dwarf planet](https://en.wikipedia.org/wiki/Dwarf_planet)
in the
[Kuiper belt](https://en.wikipedia.org/wiki/Kuiper_belt).

## History

In the 1840s,
[Urbain Le Verrier](https://wikipedia.org/wiki/Urbain_Le_Verrier)
used Newtonian mechanics to predict the position of the
then-undiscovered planet
[Neptune](https://wikipedia.org/wiki/Neptune)
after analyzing perturbations in the orbit of
[Uranus](https://wikipedia.org/wiki/Uranus).

***

Just a link: www.nasa.gov.

* Lists
* [ ] todo
* [x] done

A table:

| a | b |
| - | - |

<details><summary>Show example</summary>

\`\`\`js
console.log('Hi pluto!')
\`\`\`

</details>  
`;
  // create <p> for each line and <br> for each \n\n

  const component = stringExample.split("\n").map((line, i) => {
    if (line === "") {
      return <br key={i} />;
    } else {
      return <p key={i}>{line}</p>;
    }
  });

  const t = useTranslation();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        scrollBehavior="outside"
      >
        <ModalContent>
          <ModalHeader>
            {t["articles.new.global.markdown_cheat_sheet_title"]}
          </ModalHeader>
          <ModalBody>
            <Code>{component}</Code>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Tooltip content={t["articles.new.global.markdown_cheat_sheet"]}>
        <Button color="primary" onClick={onOpen} isIconOnly>
          <FiInfo size={25} />
        </Button>
      </Tooltip>
    </>
  );
}

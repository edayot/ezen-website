"use client";

import {
  Textarea,
  Input,
  Image,
  Card,
  CardBody,
  CardFooter,
  Button,
  Divider,
  Switch,
} from "@nextui-org/react";
import { useDropzone } from "react-dropzone";
import { FiUpload, FiCopy } from "react-icons/fi";
import { PlantData } from "@/utils/article";
import { locales } from "@/langs";
import { useState } from "react";

function CreateImageMarkdown() {
  const [image, setImage] = useState<string | null>(null);
  const [filename, setFilename] = useState("");
  const [alt, setAlt] = useState("");

  const onDrop = (acceptedFiles: any) => {
    // convert to base64 and set to state + set filename
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setFilename(acceptedFiles[0].name);
    };
    reader.readAsDataURL(acceptedFiles[0]);
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });

  let upload_text = "Drop or click to create a markdown image";
  if (image) {
    upload_text = `Click to change image, current: ${filename}`;
  }

  const onClipboardCopy = () => {
    navigator.clipboard.writeText(`![${alt}](${image})`);
  };

  return (
    <div className="flex justify-center items-center flex-col">
      <h3>Create an image in the text</h3>
      <br />
      <div className="flex justify-center items-center flex-col">
        <div {...getRootProps()} className="dropzone-container">
          <input {...getInputProps()} />
          <div className="dropzone">
            <Card className="w-64 h-30">
              <CardBody>
                <div className="flex flex-col justify-center items-center gap-6 text-center">
                  <FiUpload size={50} />
                  <p>{upload_text}</p>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
          <div className="flex gap-2 justify-center items-center">
            <Input value={alt} onValueChange={setAlt} />
            <Button
              className="text-tiny "
              variant="flat"
              color="primary"
              radius="lg"
              size="sm"
              onPress={onClipboardCopy}
            >
              <FiCopy size={20} />
            </Button>
          </div>
        </CardFooter>
      </div>
    </div>
  );
}

function CreateInput({
  all,
  setAll,
  lang,
}: {
  all: PlantData;
  setAll: (value: any) => void;
  lang: (typeof locales)[number];
}) {
  return (
    <>
      <div className="flex flex-col gap-2 w-full">
        <div>{lang}</div>
        <Input
          className="w-1/2"
          label="Name"
          placeholder={lang}
          value={all[lang].name}
          onChange={(e) => {
            let newAll = { ...all };
            newAll[lang] = { ...newAll[lang], name: e.target.value };
            setAll(newAll);
          }}
        />
        <Input
          className="w-2/3"
          label="Place"
          placeholder={lang}
          value={all[lang].place}
          onChange={(e) => {
            let newAll = { ...all };
            newAll[lang] = { ...newAll[lang], place: e.target.value };
            setAll(newAll);
          }}
        />
        <Textarea
          label="Desc"
          placeholder={lang}
          value={all[lang].desc}
          onChange={(e) => {
            let newAll = { ...all };
            newAll[lang] = { ...newAll[lang], desc: e.target.value };
            setAll(newAll);
          }}
          minRows={15}
          maxRows={15}
        />
      </div>
    </>
  );
}

function CreateGlobalInput({
  all,
  setAll,
  lang,
}: {
  all: PlantData;
  setAll: (value: any) => void;
  lang: string;
}) {
  const onDrop = (acceptedFiles: any) => {
    // convert to base64 and set to state + set filename
    const reader = new FileReader();
    reader.onload = () => {
      setAll({
        ...all,
        image_filename: acceptedFiles[0].name,
        image: reader.result,
      });
    };
    reader.readAsDataURL(acceptedFiles[0]);
  };
  let upload_text = "Drop or click to upload the primary image";
  if (all.image_filename) {
    upload_text = `Click to change image, current: ${all.image_filename}`;
  }
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });
  return (
    <div className="flex flex-col gap-2 w-full justify-center items-center">
      <h3>Global inputs</h3>
      <Input
        className="w-1/2"
        label="Latin Name"
        placeholder={lang}
        value={all.latin_name}
        onChange={(e) => setAll({ ...all, latin_name: e.target.value })}
      />
      <div {...getRootProps()} className="dropzone-container">
        <input {...getInputProps()} />
        <div className="dropzone">
          <Card className="w-64 h-30">
            <CardBody>
              <div className="flex flex-col justify-center items-center gap-6 text-center">
                <FiUpload size={50} />
                <p>{upload_text}</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DisableOption({
  all,
  setAll,
  lang,
}: {
  all: PlantData;
  setAll: (value: any) => void;
  lang: string;
}) {
  return (
    <>
    <Switch isSelected={all.disable_map_position} onValueChange={(e) => setAll({ ...all, disable_map_position: Boolean(!all.disable_map_position) })} >
      Disable map postion
    </Switch>
    <Divider orientation="vertical" />
    <Switch isSelected={all.disable_in_search} onValueChange={(e) => setAll({ ...all, disable_in_search: Boolean(!all.disable_in_search) })} >
      Disable article search
    </Switch>
    <Switch isSelected={all.protected} onValueChange={(e) => setAll({ ...all, protected: Boolean(!all.protected) })} >
      Protect article from delete
    </Switch>
    </>
  ) 
}

function AddItem({
  all,
  setAll,
  locale,
}: {
  all: PlantData;
  setAll: (value: any) => void;
  locale: string;
}) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-center items-center gap-2">
          <DisableOption all={all} setAll={setAll} lang={locale}/>
        </div>
        <div className="flex flex-row justify-center">
          <div className="w-5/6 max-w-3xl flex flex-row gap-4 justify-center items-center">
            <div className="w-96">
              <CreateGlobalInput all={all} setAll={setAll} lang="(global)" />
            </div>
            <Divider orientation="vertical" />
            <div className="w-96">
              <CreateImageMarkdown />
            </div>
          </div>
        </div>
        <div className=" flex flex-row gap-2">
          <CreateInput all={all} setAll={setAll} lang="fr" />
          <CreateInput all={all} setAll={setAll} lang="en" />
          <CreateInput all={all} setAll={setAll} lang="it" />
        </div>
      </div>
    </>
  );
}

export default AddItem;

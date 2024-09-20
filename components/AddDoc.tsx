"use client";

import {
  Textarea,
  Input,
  Image as NextImage,
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
import { storage } from "@/utils/firebase";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  CircularProgress,
} from "@nextui-org/react";
import { useTranslation } from "@/dictionaries/client";

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
  const t = useTranslation();
  return (
    <>
      <div className="flex flex-col gap-2 w-full">
        <div>{lang}</div>
        <Input
          className="w-2/3"
          label={t["articles.new.local_input.label.name"]}
          placeholder={t["articles.new.local_input.placeholder.name"]}
          value={all[lang].name}
          onChange={(e) => {
            let newAll = { ...all };
            newAll[lang] = { ...newAll[lang], name: e.target.value };
            setAll(newAll);
          }}
        />
        <Input
          className="w-2/3"
          label={t["articles.new.local_input.label.place"]}
          placeholder={t["articles.new.local_input.placeholder.place"]}
          value={all[lang].place}
          onChange={(e) => {
            let newAll = { ...all };
            newAll[lang] = { ...newAll[lang], place: e.target.value };
            setAll(newAll);
          }}
        />
        <Textarea
          label={t["articles.new.local_input.label.desc"]}
          placeholder={t["articles.new.local_input.placeholder.desc"]}
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
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [error, setError] = useState("");

  const onDrop = (acceptedFiles: any) => {
    onOpen();
    const timestamp = new Date().getTime();
    const file = acceptedFiles[0];

    // Create an image object to get the dimensions
    const img = new Image();
    img.onload = () => {
      const { width, height } = img;

      // Upload image to Firebase storage
      const storageRef = ref(storage, `images/${file.name}_${timestamp}`);
      uploadBytes(storageRef, file)
        .then((snapshot) => {
          console.log("Uploaded a blob or file!", snapshot);
          getDownloadURL(snapshot.ref).then((url) => {
            setAll({
              ...all,
              image: url,
              image_filename: file.name,
              image_height: height,
              image_width: width,
            });
          });
          setError("");
          onClose();
        })
        .catch((error) => {
          console.error("Error uploading file", error);
          setError(`Error uploading file: ${error}`);
          setTimeout(() => {
            setError("");
            onClose();
          }, 1000);
        });
    };

    // Read the file as a data URL to trigger the image load
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };
  const t = useTranslation();
  let upload_text = t["articles.new.global.drop_image"];
  if (all.image_filename) {
    upload_text = t["articles.new.global.drop_image_filename"].replace(
      "%s",
      all.image_filename,
    );
  }
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });
  return (
    <div className="flex flex-col gap-2 w-full justify-center items-center">
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xs">
        <ModalContent>
          <ModalBody>
            <div className=" flex justify-center items-center">
              {error ? <div>{error}</div> : <CircularProgress size="lg" />}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <h3>{t["articles.new.global.title"]}</h3>
      <Input
        className="w-1/2"
        label={t["articles.new.global.label.latin_name"]}
        placeholder={t["articles.new.global.placeholder.latin_name"]}
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
  const t = useTranslation();
  return (
    <>
      <Switch
        isSelected={all.disable_map_position}
        onValueChange={(e) =>
          setAll({
            ...all,
            disable_map_position: Boolean(!all.disable_map_position),
          })
        }
      >
        {t["articles.new.switch.disable_map_position"]}
      </Switch>
      <Divider orientation="vertical" />
      <Switch
        isSelected={all.disable_in_search}
        onValueChange={(e) =>
          setAll({ ...all, disable_in_search: Boolean(!all.disable_in_search) })
        }
      >
        {t["articles.new.switch.disable_in_search"]}
      </Switch>
      <Switch
        isSelected={all.protected}
        onValueChange={(e) =>
          setAll({ ...all, protected: Boolean(!all.protected) })
        }
      >
        {t["articles.new.switch.protected"]}
      </Switch>
    </>
  );
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
          <DisableOption all={all} setAll={setAll} lang={locale} />
        </div>
        <div className="flex flex-row justify-center">
          <div className="w-5/6 max-w-3xl flex flex-row gap-4 justify-center items-center">
            <div className="w-96">
              <CreateGlobalInput all={all} setAll={setAll} lang="(global)" />
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

"use client";

import { useTranslation } from "@/dictionaries/client";
import { PlantData } from "@/utils/article";
import { storage } from "@/utils/firebase";
import { locales } from "@/utils/langs";
import {
  Card,
  CardBody,
  CircularProgress,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  Snippet,
  Switch,
  Textarea,
  useDisclosure,
  Progress,
} from "@nextui-org/react";
import { getDownloadURL, ref, uploadBytesResumable, UploadTask } from "firebase/storage";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";

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
        <div>{t[`navbar.lang_switch.${lang}`]}</div>
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
  const [task, setTask] = useState<UploadTask | null>(null);

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
      const task = uploadBytesResumable(storageRef, file);
      setTask(task);
      task.then((snapshot) => {
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
          }, 3000);
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
    <div className="flex flex-col gap-2 w-full justify-start items-center">
      <h3>{t["articles.new.global.article_image"]}</h3>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xs" isDismissable={false} isKeyboardDismissDisabled={true} className="z-[9999999999]">
        <ModalContent>
          <ModalBody>
            <div className=" flex flex-col justify-center items-center">
              {error ? <div>{error}</div> : <>
                <CircularProgress size="lg" />
                <Progress aria-label="Uploading..." value={task ? (task.snapshot.bytesTransferred/task.snapshot.totalBytes * 100) : 0} className="max-w-md"/>

              </>}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
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

function CreateDropzoneForMarkdownImage({
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
  const [url, setUrl] = useState("");
  const [filename, setFilename] = useState("");
  const [alt, setAlt] = useState("");
  const [task, setTask] = useState<UploadTask | null>(null);

  let realAlt = alt ? alt : filename;
  if (realAlt === "") {
    realAlt = "(...)";
  }
  const markdownString = `![${realAlt}](${url})`;
  const smallerMarkdownString = `![${realAlt}](${url.slice(0, 20)}...)`;

  const onDrop = (acceptedFiles: any) => {
    onOpen();
    const timestamp = new Date().getTime();
    const file = acceptedFiles[0];

    // upload the file to firebase storage and generate a markdown image string "![alt](url)"
    const storageRef = ref(storage, `images/${file.name}_${timestamp}`);
    const task = uploadBytesResumable(storageRef, file);
    setTask(task);
    task.then((snapshot) => {
        console.log("Uploaded a blob or file!", snapshot);
        getDownloadURL(snapshot.ref).then((url) => {
          setUrl(url);
          setFilename(file.name);
          setError("");
          onClose();
        });
      })
      .catch((error) => {
        console.error("Error uploading file", error);
        setError(`Error uploading file: ${error}`);
        setTimeout(() => {
          setError("");
          onClose();
        }, 3000);
      });
  };
  const t = useTranslation();
  let upload_text = t["articles.new.global.drop_image"];
  if (filename) {
    upload_text = t["articles.new.global.drop_image_filename"].replace(
      "%s",
      filename,
    );
  }
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });
  return (
    <div className="flex flex-col gap-2 w-full justify-start items-center">
      <h3>{t["articles.new.global.add_image"]}</h3>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xs" isDismissable={false} isKeyboardDismissDisabled={true} className="z-[9999999999]">
        <ModalContent>
          <ModalBody>
            <div className=" flex justify-center items-center">
              {error ? <div>{error}</div> : <>
                <CircularProgress size="lg" />
                <Progress aria-label="Uploading..." value={task ? (task.snapshot.bytesTransferred/task.snapshot.totalBytes * 100) : 0} className="max-w-md"/>
              </>}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
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
      <Input
        className="w-1/2"
        label={t["articles.new.global.label.markdown_alt"]}
        placeholder={t["articles.new.global.placeholder.markdown_alt"]}
        value={alt}
        onChange={(e) => setAlt(e.target.value)}
      />
      <Snippet
        symbol=""
        size="sm"
        disableCopy={url === ""}
        className=" max-w-36"
        codeString={markdownString}
      >
        {smallerMarkdownString}
      </Snippet>
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

function FormEditor({
  all,
  setAll,
  locale,
}: {
  all: PlantData;
  setAll: (value: any) => void;
  locale: string;
}) {
  const t = useTranslation();
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col md:flex-row justify-center items-start md:items-center gap-2">
          <DisableOption all={all} setAll={setAll} lang={locale} />
        </div>
        <div className="flex flex-row justify-center">
          <div className="w-5/6 max-w-3xl flex flex-col lg:flex-row gap-4 justify-center items-center">
            <div className="w-full h-full">
              <CreateGlobalInput all={all} setAll={setAll} lang="(global)" />
            </div>
            <Divider orientation="vertical" className=" hidden lg:flex" />
            <Divider orientation="horizontal" className="lg:hidden" />
            <div className="w-full h-full">
              <CreateDropzoneForMarkdownImage
                all={all}
                setAll={setAll}
                lang="(global)"
              />
            </div>
          </div>
        </div>
        <div className=" flex flex-col lg:flex-row gap-2">
          <CreateInput all={all} setAll={setAll} lang="fr" />
          <CreateInput all={all} setAll={setAll} lang="en" />
          <CreateInput all={all} setAll={setAll} lang="it" />
        </div>
      </div>
    </>
  );
}

export default FormEditor;

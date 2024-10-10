"use client";
import { RenderFooter } from "@/components/Footer";
import { UploadToCloud } from "@/components/FormEditor";
import { IsUserLoggedIn, RedirectComponent } from "@/components/RedirectButton";
import { useTranslation } from "@/dictionaries/client";
import { HomeProps } from "@/dictionaries/dictionaries";
import {
  auth,
  footerRef,
  mapRef,
  signOutGlobal,
  storage,
} from "@/utils/firebase";
import { FooterData } from "@/utils/footer";
import { locales } from "@/utils/langs";
import { addDoc, doc, getDocs, setDoc, deleteDoc } from "@firebase/firestore";
import {
  Button,
  Card,
  CardBody,
  Divider,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Snippet,
  Tooltip,
  Progress,
  useDisclosure,
} from "@nextui-org/react";
import { getDownloadURL, ref } from "firebase/storage";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { FiX, FiPlus, FiSave } from "react-icons/fi";
import { Bounce, toast } from "react-toastify";
import { useTheme } from "next-themes";

interface Document {
  id: string;
  data: FooterData;
}

interface TableProps {
  documents: Document[];
  setDocuments: (documents: Document[]) => void;
  refresh: () => void
}
interface TablePropsWithDocument extends TableProps {
  document: Document;
}

function CreateTableLine({
  document,
  documents,
  setDocuments,
  refresh
}: TablePropsWithDocument) {

  const handleDelete = () => {
    setLoading(true)
    deleteDoc(doc(footerRef, document.id)).then(() => {
      onClose()
      setLoading(false)
      refresh()
    }).catch(() => {
      setLoading(false)
      onClose()
      toast.error("Error deleting document", {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        transition: Bounce,
        theme: theme,
      })
    })
  }
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const t = useTranslation()
  const [loading, setLoading] = useState(false)
  const { theme } = useTheme();


  const elements = [
    <div
      key="render"
      className="min-w-10 flex flex-row justify-center items-center"
    >
      <RenderFooter data={document.data} lang="en" />
    </div>,
    <Input
      isDisabled={document.data.protected}
      key="input_url"
      value={document.data.url}
      onValueChange={(value) => {
        setDocuments(
          documents.map((doc) => {
            if (doc.id === document.id) {
              doc.data.url = value;
              return doc;
            }
            return doc;
          }),
        );
      }}
    />,
    <Input
      isDisabled={document.data.protected}
      key="input_icon"
      value={document.data.icon}
      onValueChange={(value) => {
        setDocuments(
          documents.map((doc) => {
            if (doc.id === document.id) {
              doc.data.icon = value;
              return doc;
            }
            return doc;
          }),
        );
      }}
    />,
    <Input 
      isDisabled={document.data.protected}
      key="input_order"
      type="number"
      min={1}
      value={String(document.data.order) || "0"}
      onValueChange={(value) => {
        setDocuments(
          documents.map((doc) => {
            if (doc.id === document.id) {
              doc.data.order = parseInt(value);
              return doc;
            }
            return doc;
          }),
        );
      }
    }
    />,
    <Button
      isDisabled={document.data.protected}
      key="delete_button"
      color="danger"
      isIconOnly
      onClick={onOpen}
      >
        <FiX/>
    </Button>
  ];

  return (
    <>
    <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        closeButton={<></>}
      >
        <ModalContent>
          <ModalBody>
            {t["auth.account.footer.confirm_delete"]}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={handleDelete} isLoading={loading}>
              {t["auth.account.footer.delete"]}
            </Button>
            <Button color="primary" variant="light" onPress={onClose}>
            {t["auth.account.footer.cancel"]}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    <div className="flex flex-row gap-2 justify-start items-center h-full">
      {elements.map((line, index) => (
        <>
          <div key={`${index}_line`}>{line}</div>
          <div key={`${index}_divider`}>
            {index < elements.length - 1 && (
              <Divider orientation="vertical" className="h-6" />
            )}
          </div>
        </>
      ))}
    </div>
    </>
  );
}

function CreateTable({ documents, setDocuments, refresh}: TableProps) {
  const lines = documents.map((document) => {
    return (
      <CreateTableLine
        document={document}
        documents={documents}
        setDocuments={setDocuments}
        key={document.id}
        refresh={refresh}
      />
    );
  });

  return (
    <Card>
      <CardBody>
        <div className="flex flex-col gap-2">
          {lines.map((line, index) => (
            <>
              <div key={`${index}_line`}>{line}</div>
              <div key={`${index}_divider`}>
                {index < lines.length - 1 && <Divider />}
              </div>
            </>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

function FooterTable({ lang }: { lang: (typeof locales)[number] }) {
  const initData: FooterData = {
    url: "",
    icon: "",
    order: 0,
  };
  const t = useTranslation();
  const [edit, setEdit] = useState(0);
  const [progress, setProgress] = useState(0);
  const [documents, setDocuments] = useState<
    { id: string; data: FooterData }[]
  >([]);
  useEffect(() => {
    getDocs(footerRef).then((q) => {
      setDocuments(
        q.docs.map((doc) => ({ id: doc.id, data: doc.data() as FooterData })).sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))
      );
    });
  }, [edit]);
  const refresh = () => setEdit(edit + 1);

  const addFooter = () => {
    const nexOrder =
      Math.max(...documents.map((doc) => doc.data.order ?? 0)) + 1;
    addDoc(footerRef, { ...initData, order: nexOrder }).then((doc) => {
      refresh();
    });
  };

  const saveToDatabase = async () => {
    onOpen();
    setProgress(0);
    for (let i = 0; i < documents.length; i++) {
      await setDoc(doc(footerRef, documents[i].id), documents[i].data);
      setProgress(i + 1);
    }
    onClose();
  };
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const onUploadComplete = (url: string) => {
    setUrl(url);
  };
  const getStorageRef = (filename: string) => {
    return ref(storage, `footer/${filename}`);
  };
  const [url, setUrl] = useState("");

  if (!documents) {
    return <></>;
  }
  return (
    <div className="flex flex-col gap-2">
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        closeButton={<></>}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-2 justify-center items-center">
                <Progress
                  aria-label="Uploading..."
                  value={progress/documents.length * 100 || 0}
                  className="max-w-md"
                />
              {progress}/{documents.length}
            </div>
            
          </ModalBody>
        </ModalContent>
      </Modal>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-end w-full gap-2">
          <Tooltip content={t["auth.account.footer.button_tooltip"]}>
            <Button isIconOnly onClick={addFooter}>
              <FiPlus size={30} />
            </Button>
          </Tooltip>
          <Tooltip content={t["auth.account.footer.save_tooltip"]}>
            <Button isIconOnly onClick={saveToDatabase} color="primary">
              <FiSave size={30} />
            </Button>
          </Tooltip>
        </div>
      </div>
      <CreateTable documents={documents} setDocuments={setDocuments} refresh={refresh}/>
      <UploadToCloud
        onUploadComplete={onUploadComplete}
        getStorageRef={getStorageRef}
      />
      <Snippet codeString={url} size="sm" symbol="">
        {url.slice(0, 50)}...
      </Snippet>
    </div>
  );
}

export default function Home({ params }: { params: HomeProps }) {
  const t = useTranslation();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const [mapUrl, setMapUrl] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    getDownloadURL(mapRef).then(setMapUrl);
  }, []);

  return (
    <>
      <IsUserLoggedIn fallback={<RedirectComponent />}>
        <div className="flex flex-col justify-center items-center">
          <div className="w-5/6 max-w-xl">
            <div className="flex flex-col gap-2">
              <h1>{t["auth.account.title"]}</h1>
              <p>
                {t["auth.account.email"]} {user?.email}
              </p>
              <p>
                {t["auth.account.uid"]}{" "}
                <Snippet symbol="" size="sm">
                  {user?.uid}
                </Snippet>
              </p>
              <br />
              <div>
                <Button
                  onClick={() => {
                    setLoading(true);
                    signOutGlobal().then(redirect("/"));
                  }}
                  isLoading={loading}
                  color="danger"
                >
                  {t["auth.account.signout"]}
                </Button>
              </div>
              <br />
              <h2>{t["auth.account.change_map"]}</h2>
              <h4>{t["auth.account.change_map_small"]}</h4>
              <div className="flex flex-row gap-2">
                <UploadToCloud
                  onUploadComplete={(url: string) => setMapUrl(url)}
                  getStorageRef={() => mapRef}
                />
                <Image src={mapUrl} alt="Map Image" />
              </div>
            </div>
            <h2>{t["auth.account.footer.title"]}</h2>
          </div>
          <div className="w-5/6 max-w-3xl flex flex-col">
            <FooterTable lang={params.lang} />
          </div>
          <br />
        </div>
      </IsUserLoggedIn>
    </>
  );
}

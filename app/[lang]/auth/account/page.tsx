"use client";
import { RenderFooter } from "@/components/Footer";
import { UploadToCloud } from "@/components/FormEditor";
import { IsUserLoggedIn, RedirectComponent } from "@/components/RedirectButton";
import { useTranslation } from "@/dictionaries/client";
import { HomeProps } from "@/dictionaries/dictionaries";
import { auth, footerRef, mapRef, signOutGlobal } from "@/utils/firebase";
import { FooterData } from "@/utils/footer";
import { locales } from "@/utils/langs";
import { addDoc, doc, getDocs, setDoc } from "@firebase/firestore";
import {
  Button,
  Card,
  CardBody,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Snippet,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { getDownloadURL } from "firebase/storage";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { FiEdit, FiPlus, FiSave } from "react-icons/fi";


interface Document { 
  id: string; 
  data: FooterData 
}

interface TableProps {
  documents: Document[];
  setDocuments: (documents: Document[]) => void
}
interface TablePropsWithDocument extends TableProps {
  document: Document
}


function CreateTableLine({document, documents, setDocuments} : TablePropsWithDocument) {

  const elements = [
    (<div key="render" className="min-w-10 flex flex-row justify-center items-center"><RenderFooter data={document.data} lang="en"/></div>),
    (<Input key="input_url" value={document.data.url} onValueChange={(value) => {
      setDocuments(documents.map((doc) => {
        if (doc.id === document.id) {
          doc.data.url = value
          return doc
        }
        return doc
      }))
    }}/>),
    (<Input key="input_icon" value={document.data.icon} onValueChange={(value) => {
      setDocuments(documents.map((doc) => {
        if (doc.id === document.id) {
          doc.data.icon = value
          return doc
        }
        return doc
      }))
    }}/>),
  ]

  return (
  <div className="flex flex-row gap-2 justify-start items-center h-full">
      {elements.map((line, index) => (
        <>
          <div key={`${index}_line`}>
            {line}
          </div>
          <div key={`${index}_divider`}>
            {index < elements.length - 1 && <Divider orientation="vertical" className="h-6"/>}
          </div>
        </>
      ))}
  </div>)
}


function CreateTable({documents, setDocuments} : TableProps) {

  const lines = documents.map((document) => {
    return <CreateTableLine document={document} documents={documents} setDocuments={setDocuments} key={document.id}/>
  })

  return (
  <Card>
    <CardBody>
      <div className="flex flex-col gap-2">
          {lines.map((line, index) => (
            <>
              <div key={`${index}_line`}>
                {line}
              </div>
              <div key={`${index}_divider`}>
                {index < lines.length - 1 && <Divider/>}
              </div>
            </>
          ))}
      </div>
    </CardBody>
  </Card>
  )
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
        q.docs.map((doc) => ({ id: doc.id, data: doc.data() as FooterData })),
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
      await setDoc(doc(footerRef, documents[i].id), documents[i].data)
      setProgress(i + 1);
    }
    onClose();
  };
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

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
            Progress : {progress}, Total : {documents.length}
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
      <CreateTable documents={documents} setDocuments={setDocuments}/>
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
            <h2>{t["auth.account.custom_footer"]}</h2>
          </div>
          <div className="w-5/6 max-w-3xl">
            <FooterTable lang={params.lang} />
          </div>
          <br />
        </div>
      </IsUserLoggedIn>
    </>
  );
}

import { useNavigate, useParams } from "react-router-dom";
import { useStores } from "../store";
import { useEffect, useRef, useState } from "react";
import { MdOutlineArrowBackIosNew, MdOutlineEdit } from "react-icons/md";
import { FaCircleCheck } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import Loader from "./reusable_Components/loader";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";

export default function CertificateEdit() {
    const { UserStore } = useStores();
    const { branch, studentid, id } = useParams();
    const [selectedCertificate, setSelectedCertificate] = useState(UserStore?.students.find((student) => student?._id === studentid)?.documents.find((doc) => doc?._id === id));

    const nameref = useRef();
    const typeref = useRef();
    const semref = useRef();
    const percentageref = useRef();
    const backlogsref = useRef();
    const [isMarklist, setIsMarklist] = useState(false);
    const fileInputRef = useRef();
    const [pdfurl, setPdfurl] = useState(selectedCertificate?.fileUrl);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleTypeChange = () => {
        try {
            if (typeref.current.value === "mark list") {
                setIsMarklist(true);
            }
            else {
                setIsMarklist(false);
            }
        } catch (error) {

        }
    }

    const autofillref = () => {
        nameref.current.value = selectedCertificate?.name;
        typeref.current.value = selectedCertificate?.certificateType;
        semref.current.value = selectedCertificate?.semister;
        percentageref.current.value = selectedCertificate?.semPercentage;
        backlogsref.current.value = selectedCertificate?.backlogs;
    }

    useEffect(() => {
        autofillref();
        handleTypeChange();
    }, [selectedCertificate])

    const openfiles = () => {
        fileInputRef.current.click();
    }

    const uploadPdfToFirebase = async (file) => {
        const timeStamp = new Date().valueOf();
        const storageRef = ref(storage, `pdfs/${timeStamp}-${file.name}`);
        try {
            setLoading(true);
            await uploadBytes(storageRef, file);
            console.log("uploaded");
            const pdf = await getDownloadURL(storageRef);
            console.log(pdf);
            setPdfurl(pdf);
            setLoading(false);
        } catch (error) {
            
        }
    }


    const changepdf = async (e) => {
        const file = e.target.files[0];
        if(file){
          await  uploadPdfToFirebase(file);
        }
    }

    const updateCertificate = async (e) => {
        e.preventDefault();
        try {
        const name = nameref.current.value;
        const type = typeref.current.value;
        const sem = semref.current.value;
        const percentage = percentageref.current.value;
        const backlogs = backlogsref.current.value;
        const fileUrl = pdfurl;
        const student = studentid;
        if(!pdfurl){
            alert("please upload a pdf");
            return;
        }
        await UserStore.updateStudentDocuments(name,type,fileUrl,sem,percentage,backlogs,student,id);
        return navigate(`/${branch}/${studentid}`)
        } catch (error) {
            console.log(error);
        }   
    }
        

    return (
        <form
            onSubmit={updateCertificate}
            className="flex flex-col items-center">
            {loading && <Loader loader={true} />}
            <div className="w-[90%] my-2 mx-auto flex justify-between ">
                <button onClick={() => navigate(`/${branch}/${studentid}/certificate/${id}`)} className="flex items-center">
                    <MdOutlineArrowBackIosNew className="mr-1" />Back
                </button>
                <button type="submit"><FaCircleCheck className="text-primary text-3xl" /></button>
            </div>

            {!pdfurl ?
                <div  onClick={openfiles} className="bg-primary w-[80%] h-96 rounded-lg m-2 flex flex-col items-center justify-center">
                    <IoMdAdd className="text-white text-6xl"/>
                    <p className="text-white text-xl">Upload Certificate</p>
                    <input ref={fileInputRef} type="file" onChange={changepdf} className="hidden"  />
                </div>
                :
                <div className="w-[80%] relative h-96 rounded-lg">
                <iframe src={pdfurl}
                 frameborder="0"
                 className="w-full h-full  rounded-lg"
                 style={{ zoom: "150%" }}
                >
                
                </iframe>
                <div  className="w-8 h-8 absolute bg-primary  rounded-full  text-xl text-white flex items-center justify-center right-0 bottom-0" onClick={openfiles}>
                    <MdOutlineEdit />
                <input type="file" className="hidden" ref={fileInputRef} onChange={changepdf} />
                </div>
            </div>  

            }
               
            <div className="flex flex-col w-[90%] mx-auto ">
                <h1 className="text-primary text-2xl">Certificate Details</h1>
                <div className="flex flex-col mt-2">
                    <label className="pb-2" >Certificate Name</label>
                    <input
                        ref={nameref}
                        type="text"
                        required
                        className="mb-1 p-2 text-lg text-opacity-80 focus:outline-none border-2 rounded-lg border-[0.3px solid #000000]" />
                </div>
                <div className="flex flex-col mt-2">
                    <label className="pb-2" >Certificate Type</label>
                    <select ref={typeref}
                        onChange={handleTypeChange}
                        name="type"
                        className="mb-1 bg-transparent p-2 text-lg text-opacity-80 focus:outline-none border-2 rounded-lg border-[0.3px solid #000000]"
                    >
                        <option value="OD">Original Diploma Certificate</option>
                        <option value="mark list">Mark list </option>
                    </select>
                </div>
                <div className="flex flex-col mt-2">
                    <label className="pb-2" >Semester</label>
                    <select required
                        disabled={!isMarklist}
                        ref={semref}
                        name="semester"
                        className="mb-1 bg-transparent p-2 text-lg text-opacity-80 focus:outline-none border-2 rounded-lg border-[0.3px solid #000000]"
                    >
                        <option value="sem1">Semester 1</option>
                        <option value="sem3">Semester 3</option>
                        <option value="sem4">Semester 4</option>
                        <option value="sem5">Semester 5</option>
                        <option value="sem6">Semester 6</option>
                    </select>
                </div>
                <div className="flex flex-col mt-2">
                    <label className="pb-2" >Sem percentage</label>
                    <input disabled={!isMarklist} required ref={percentageref} type="text" className="mb-1 p-2 text-lg text-opacity-80 focus:outline-none border-2 rounded-lg border-[0.3px solid #000000]" />
                </div>
                <div className="flex flex-col mt-2">
                    <label className="pb-2" >Backlogs</label>
                    <input disabled={!isMarklist} required ref={backlogsref} type="text" className="mb-1 p-2 text-lg text-opacity-80 focus:outline-none border-2 rounded-lg border-[0.3px solid #000000]" />
                </div>
            </div>

        </form>
    )
}
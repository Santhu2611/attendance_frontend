import { useRef, useState } from "react";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { FaCircleCheck } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { useStores } from "../store/index";
import { IoMdAdd } from "react-icons/io";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import Loader from "./reusable_Components/loader";

export default function Certificateview2() {
    const {branch , id } = useParams();
    const {UserStore} = useStores();
    const nameref = useRef();
    const typeref = useRef();
    const semref = useRef();
    const percentageref = useRef();
    const backlogsref = useRef();   
    const [showCertificate, setShowCertificate] = useState(false);
    const [isMarklist , setIsMarklist] = useState(false);  
    const fileInputRef = useRef();  
    const [pdfurl, setPdfurl] = useState();
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
    
    const handleTypeChange = () => {
        try {
            if(typeref.current.value === "mark list"){
                setIsMarklist(true);
            }
            else{
                setIsMarklist(false);
            }
        } catch (error) {
            
        }
    }

    const openfiles = () => {
        fileInputRef.current.click();
    }

    const uploadPdfToFirbase = async (file) => {
        const timeStamp = new Date().valueOf();
        const storageRef = ref(storage, `pdfs/${timeStamp}-${file.name}`);
        try{
            setLoading(true);
            await uploadBytes(storageRef, file);

            console.log("Uploaded");
            
            const pdfurl = await getDownloadURL(storageRef);
            console.log(pdfurl);
            setPdfurl(pdfurl);
            setLoading(false);
        }
        catch(error){
            console.log(error);
        }
    }

    const changeFile = (e) => {
        const file = e.target.files[0];
        if(file){
            uploadPdfToFirbase(file);
            setShowCertificate(true);
        }
    }

    const postCertificate = async (e) => {
        e.preventDefault();
        const name = nameref.current.value;
        const type = typeref.current.value;
        const semester = semref.current.value;
        const percentage = percentageref.current.value;
        const backlogs = backlogsref.current.value;
        const fileUrl = pdfurl;
        if(!fileUrl){
            alert("Please upload the certificate");
            return;
        }
        await UserStore.postStudentDocuments(name,type,fileUrl,semester,percentage,backlogs,id);
        navigate(`/${branch}/${id}`);
    }
    
    return (
        <form onSubmit={postCertificate} className="flex flex-col items-center">
            {loading && <Loader loader={true}/> }
            <div className="w-[90%] my-2 mx-auto flex justify-between ">
                <button onClick={() => navigate(`/${branch}/${id}`)} className="flex items-center">
                    <MdOutlineArrowBackIosNew className="mr-1"/>Back
                </button>
                <button type="submit"><FaCircleCheck className="text-primary text-3xl"/></button>
            </div>
            
            {
                showCertificate ? (
                    <div className="w-[80%] h-96">
                        <iframe src={pdfurl} 
                         frameborder="0"
                        className="w-full h-full"
                        style={{zoom : "150%"}}
                         ></iframe>
                    </div>
                ) : (
                    <div  onClick={openfiles} className="bg-primary w-[80%] h-96 rounded-lg m-2 flex flex-col items-center justify-center">
                        <IoMdAdd className="text-white text-6xl"/>
                        <p className="text-white text-xl">Upload Certificate</p>
                        <input ref={fileInputRef} type="file" onChange={changeFile} className="hidden"  />
                    </div>
            )

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
                        <option value="allotment">Allotment Order </option>
                        <option value="ssc mark list">SSC Mark list </option>
                        <option value="polycet rank card">Polycet Rank Card</option>
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

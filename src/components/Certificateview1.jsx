import { MdDeleteOutline, MdOutlineArrowBackIosNew, MdOutlineEdit } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { useStores } from "../store";
import { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineLeft } from "react-icons/ai";
export default function Certificateview1() {
  const { branch, studentid, id } = useParams();
  const navigate = useNavigate();
  const { UserStore, CommonStore } = useStores();
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [showError, setShowError] = useState(false)

  const Certificate = () => {
    if (CommonStore.role === "student") {
      const foundCerificate = UserStore.user?.documents.find((doc) => doc?._id === id);
      setSelectedCertificate(foundCerificate);
    }
    else {
      const foundCerificate = UserStore.students.find((student) => student?._id === studentid)?.documents.find((doc) => doc?._id === id);
      setSelectedCertificate(foundCerificate);
    }
  }

  const removeCertificate = async (id) => {
    setDeleteModal(false);
    await UserStore.deleteStudentDocuments(studentid, id);

    navigate(`/${branch}/${studentid}`);
  }

  const Navbar = () => {
    if (CommonStore.role === "student") {
      return (
        <div className="w-[90%] mx-auto">
          <button className="flex items-center justify-center mt-2 text-lg" onClick={() => navigate(`/${branch}/${studentid}`)}><MdOutlineArrowBackIosNew className="mr-1" /> Back</button>
        </div>
      );
    }
    else {
      return (
        <div className="flex justify-between w-[95%] mx-auto my-2 items-center">
          <button
            className="flex items-center w-[20%]  text-lg"
            onClick={() => navigate(`/${branch}/${studentid}`)}
          >
            <AiOutlineLeft className="mr-1" /> Back
          </button>
          <div className="flex">
            <button
              className="w-10 h-10 bg-primary  rounded-full mx-2 text-2xl text-white flex items-center justify-center"
              onClick={() => UserStore.user?.access?.granted ? navigate(`/${branch}/${studentid}/certificateupdate/${id}`) : setShowError(true)}
            >
              <MdOutlineEdit />
            </button>
            <button
              onClick={() => UserStore.user?.access?.granted ? setDeleteModal(true) : setShowError(true)}
              className="w-10 h-10 bg-primary rounded-full mx-3 text-2xl text-white flex items-center justify-center"
            >
              <MdDeleteOutline />
            </button>
          </div>
        </div>
      )
    }
  }

  useEffect(() => {
    console.log(id);
    Certificate();
  }, [])

  return (
    <div className="flex flex-col items-center justify-between">
      <Navbar />
      {showError && <p className="text-red-500 font-semibold w-[90%] mx-auto mt-2">! You don't have access to edit the details</p>}
      {!selectedCertificate?.fileUrl ? (
        <p className="text-2xl font-semibold py-10">No Certificate Uploaded</p>
      ) :
        <div className='h-96 w-[80%] rounded-lg'>
          <iframe src={selectedCertificate?.fileUrl} className="w-full h-full my-2" style={{ zoom: "150%" }} frameborder="0"></iframe>
        </div>

      }

      <div className="flex flex-col w-[90%] mx-auto">
        <h1 className=' text-2xl text-primary my-3'>Certificate Details</h1>
        <div className="flex flex-col  mt-2 items-start ">
          <label className="pb-2">Certificate Name</label>
          <div className="text-base px-4 py-2 w-full  border-2 rounded-lg border-[border: 0.3px solid #000000]">
            {selectedCertificate?.name ?? "No Name Found"}
          </div>
        </div>
        <div className="flex flex-col mt-2 items-start ">
          <label className="pb-2">Certificate Type</label>
          <div className="text-base px-4 py-2 w-full  border-2 rounded-lg border-[border: 0.3px solid #000000]">
            {selectedCertificate?.certificateType ?? "No CertificateType Found"}
          </div>
        </div>
      </div>

      {deleteModal && (
        <div className="fixed inset-0  w-[80%] m-auto h-[20%] flex flex-col z-50 py-4 px-2 rounded-2xl items-center  bg-primary">
          <h1 className="text-center text-2xl text-white">Confirm to delete</h1>
          <p className="text-white pt-1 text-2xl">{selectedCertificate?.name}</p>
          {/* <AiOutlineClose onClick={() => setDeleteForm(false)} className="absolute text-white text-2xl cursor-pointer right-2 top-4" /> */}
          <div className="w-[90%] mx-auto flex my-3  justify-between items-center">
            <button
              onClick={() => setDeleteModal(false)}
              className="flex w-[40%] mx-auto text-xl justify-between bg-white rounded-lg  text-black items-center p-2"
            >
              Cancel
              <AiOutlineClose className="mx-1" />
            </button>
            <button
              onClick={() => removeCertificate(selectedCertificate?._id)}
              className="flex w-[40%] mx-auto text-xl justify-between bg-white rounded-lg text-black items-center p-2">
              Delete
              <MdDeleteOutline className="mx-1" />
            </button>
          </div>
        </div>
      )}


    </div>
  )
}

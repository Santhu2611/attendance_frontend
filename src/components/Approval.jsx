import { AiOutlineLeft } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useStores } from "../store/index";
import { useObserver } from "mobx-react";
import { MdDeleteOutline } from "react-icons/md";

export default function Approval({ navigation }) {
  let { id, pin } = useParams();
  const navigate = useNavigate();
  const defaultprofile = "https://t4.ftcdn.net/jpg/00/64/67/63/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg";
  const { UserStore, CommonStore } = useStores();

  const selectedLecturer = UserStore?.lecturers.find(
    (lecturer) => lecturer?._id === id
  );

  const selectedStudent = UserStore?.students.find(
    (student) => student?._id === pin
  );

  const approveStaff = async (id) => {
    if (CommonStore.role === "principal") {
      if (await UserStore.approveLecturer(id)) {
        navigate(`/principal`);
      }
    }
    else {
      if (await UserStore.approveStudent(id)) {
        navigate(`/${UserStore.user?.department}/studentapproval`);
      }
    }
  };

  const Delete = async (id) => {
    if (CommonStore.role === "principal") {
      if (await UserStore.deleteLecturers(id)) {
        navigate(`/principal`);
      }
    }
    else {
      if (await UserStore.deleteStudents(id)) {
        navigate(`/${UserStore.user?.department}/studentapproval`);
      }
    }
  };

  const goToPrincipalHome = () => {
    if (CommonStore.role === "principal") {
      navigate(`/principal`);
    } else {
      navigate(`/${UserStore.user?.department}/studentapproval`);
    }
  };

  return useObserver(() => (
    <>
      {!navigation ? (
        <div className="w-[100%] bg-secondary py-10 flex flex-col items-start">
          <div className="w-[90%] flex justify-between mx-auto ">
            <button
              className="flex items-center  text-lg"
              onClick={goToPrincipalHome}
            >
              <AiOutlineLeft className="mr-1" /> Back
            </button>
            <button onClick={() => Delete(selectedLecturer?._id)} className="w-10 h-10 bg-primary rounded-full  text-2xl text-white flex items-center justify-center">
              <MdDeleteOutline />
            </button>
          </div>

          <div className="w-[85%] mx-auto  flex mt-6">
            <div className="h-44 w-36 rounded-lg overflow-hidden"
              style={{ backgroundImage: `url(${defaultprofile})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
            >
              <img
                src={selectedLecturer?.photo}
                className="object-cover rounded-lg"
                alt=""
              />
            </div>
            <div className="ml-6">
              <h1 className="text-xl pb-1 ">{selectedLecturer?.name}</h1>
              <p className="text-base ">{selectedLecturer?.idno}</p>
              <p className="text-base">{selectedLecturer?.department}</p>
              <p className="text-base">{selectedLecturer?.phoneNumber}</p>
              <p className="text-base pb-1">{selectedLecturer?.email}</p>
              <button
                className="py-2 px-4 bg-primary text-white rounded-lg"
                onClick={() => approveStaff(selectedLecturer?._id)}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-[100%] bg-secondary py-10 flex flex-col items-start">
          <div className="w-[90%] mx-auto flex justify-between">
            <button
              className="flex items-center  text-lg"
              onClick={goToPrincipalHome}
            >
              <AiOutlineLeft className="mr-1" /> Back
            </button>
            <button onClick={() => Delete(selectedStudent?._id)} className="w-10 h-10 bg-primary rounded-full  text-2xl text-white flex items-center justify-center">
              <MdDeleteOutline />
            </button>
          </div>

          <div className="w-[85%] mx-auto  flex mt-6">
            <img
              src={selectedStudent?.photo}
              className="h-44 w-36 rounded-lg"
              alt=""
            />
            <div className="ml-6">
              <h1 className="text-xl pb-1 ">{selectedStudent?.name}</h1>
              <p className="text-base ">{selectedStudent?.pinno}</p>
              <p className="text-base">{selectedStudent?.department},{selectedStudent?.semister}</p>
              <p className="text-base">{selectedStudent?.studentmobile}</p>
              <p className="text-base pb-1">{selectedStudent?.emailid}</p>
              <button
                className="py-2 px-4 bg-primary text-white rounded-lg"
                onClick={() => approveStaff(selectedStudent?._id)}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  ));
}

import React, { useRef, useState } from 'react';
import { MdArrowBackIosNew } from 'react-icons/md';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AiOutlineRight } from 'react-icons/ai';
import {useStores} from '../store/index';

const Search = () => {
    // const searchref = useRef(null);
    const navigate = useNavigate();
    const [searchPin, setSearchPin] = useState('');
    const [SearchResultStudents,setSearchResultStudents] = useState([]);
    const [SearchResultLecturers,setSearchResultLecturers] = useState([]);
    const {UserStore} = useStores();
    const defaultprofile = "https://ih1.redbubble.net/image.1046392278.3346/pp,504x498-pad,600x600,f8f8f8.jpg"

    const showStudentDetails = (branch, id) => {
        navigate(`/${branch}/${id}`);
    }

    const showLecturerDetails = (branch,id) => {
        navigate(`/${branch}/lecturer/${id}`);
    }
   
    const handleSearch = (e) => {
        const input = e.target.value;
        setSearchPin(input);

        if (input === '') {
            setSearchResultStudents([]);
            setSearchResultLecturers([]);
            return;
          }
    
        // Search for the student from the students array in userStore
        const searchResultstudents = UserStore?.students.filter((student) => {
            return student?.name.toLowerCase().includes(input.toLowerCase()) || student?.pinno.includes(input);
        });
        setSearchResultStudents(searchResultstudents);

        // Search for the lecturer from the lecturers array in userStore
        const searchResultlecturers = UserStore?.lecturers.filter((lecturer) => {
            return lecturer?.name.toLowerCase().includes(input.toLowerCase()) || lecturer?.idno.includes(input);
        });
        setSearchResultLecturers(searchResultlecturers);
      };


    const goBack = () => {
        navigate("/principal")
    }

    return (
        <div>
            <div onClick={goBack} className="flex my-4">
                <MdArrowBackIosNew className="my-1 mx-2 ml-4" />
                <p> Back</p>
            </div>
            <div className='mt-6 relative w-[90%] mx-auto '>
                <input type="text" 
                value={searchPin}
                onChange={handleSearch} placeholder='Search' className='pl-14 pr-4 py-4 w-full border-2 rounded-full shadow-lg shadow-grey' />
                <span className='absolute left-2 top-5  mx-4'>
                    <FaSearch className='text-lg' />
                </span>
            </div>
            {
                SearchResultStudents.length > 0 || SearchResultLecturers.length > 0 ? (
                    <>
                    <div className="bg-secondary mt-6 w-[90%] mx-auto rounded-lg ">
                    <h2 className="text-2xl mx-3 text-text_color1 font-semibold">Lecturers</h2>
                        <div className="flex overflow-x-auto items-center pb-4">
                            {
                                SearchResultLecturers.map((lecturer, index) => (
                                    <div
                                      key={index}
                                      onClick={() => showLecturerDetails(lecturer?.department,lecturer?._id)}
                                      className="cursor-pointer mx-3 flex flex-col items-center justify-center"
                                    >
                                      <div className="w-20 h-20 rounded-full overflow-hidden"
                                        style={{ backgroundImage: `url(${defaultprofile})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
                                      >
                                        <img
                                          src={lecturer?.photo}
                                          alt=" "
                                          className=" rounded-full object-cover "
                                        />
                                      </div>
                    
                                      <p className="text-black pt-1 md:w-28 text-center truncate">{lecturer?.name}</p>
                                    </div>
                                  ))
                            }
                        </div>
                    </div> 
                    <div className="bg-white  drop-shadow my-6 shadow-lg w-[90%] py-3 mx-auto rounded-lg">
                    <h2 className="text-2xl mx-3 text-text_color1 font-semibold">Students</h2>
                    {SearchResultStudents.map((student) => (
                        <div className="w-[90%] p-2 border-b-2 border-[rgba(0, 0, 0, 1)] mx-auto my-2 flex flex-row items-end justify-between">
                            <div className="flex flex-row items-center">
                            <div className="w-12 h-12 rounded-full overflow-hidden"
                                style={{ backgroundImage: `url(${defaultprofile})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
                            >
                                <img
                                    src={student?.photo}
                                    className="object-cover rounded-full"
                                    alt=""
                                />
                            </div>
                                <div className="flex flex-col items-start ml-3">
                                    <h1 className="text-lg">{student?.name}</h1>
                                    <p className="text-base">{student?.pinno}</p>
                                </div>
                            </div>
                        <div className="flex">
                            <button className="flex items-center justify-center" onClick={() => showStudentDetails(student?.department,student?._id)} >view details  <AiOutlineRight className="text-sm ml-1 mt-1" /> </button>
                        </div>
                    </div>
                    ))}
                    </div>  
                    </>
                )

                : 
                    searchPin === "" ? (
                        null
                ) : (
                         <p className='text-lg flex items-center justify-center h-[330px]'>No matching students found.</p>
                )
          
            }
            
        </div>
    );
}

export default Search;
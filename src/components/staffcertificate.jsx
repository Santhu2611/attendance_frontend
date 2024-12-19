// import { MdOutlineArrowBackIosNew } from "react-icons/md";
// import React, { useState } from 'react';
// import { TiTickOutline } from "react-icons/ti";

// const file = 'https://www.ittcouncil.com/assets/img/certificate/new1.jpg'

// function Staffcertificate() {
//     const [selectedCertificate, setSelectedCertificate] = useState('');

//     const handleCertificateChange = (e) => {
//         setSelectedCertificate(e.target.value);
//     };
//     return (
//         <div>
//             <div className='flex mt-4 ml-4'>
//                 <div className=' pt-2'>
//                     <MdOutlineArrowBackIosNew />
//                 </div>
//                 <button className='flex text-xl'>Back</button>
//                 <div className="ml-64">
//                 <div className="bg-blue-900 rounded-full text-white text-3xl h-8 w-8 ">
//                 <TiTickOutline />
//                 </div>
//                 </div>
//             </div>
            
//             <div className='h-96 w-80 border-2 border-slate-400 justify-center bg-slate-400 rounded-lg m-9'>
//                 <img className='h-96 w-80 rounded-lg' src={file} alt="" />
//             </div>
//             <div classname=''>
//                 <h1 className='font-semibold ml-4 text-3xl text-primary'>Certificate Details</h1>
//             </div>

//             <div>
//                 <p className='mt-6 ml-3 font-semibold'>Certificate Name</p>
//             </div>
//             <div className='h-16 w-[92%] ml-4  justify-center'>
//                 <input className='w-full h-12 border-2 px-6 mt-2 border-slate-400 rounded-lg ' type="text" />
//                 <p></p>
//             </div>

//             <div>
//                 <p className='mt-4 ml-3 font-semibold'>Certificate Type</p>
//                 <select
//                     className='w-[92%] ml-4 h-12 border-2 px-4 mt-2  border-slate-400 rounded-lg'
//                     value={selectedCertificate}
//                     onChange={handleCertificateChange}
//                 >
//                     {/* <option value="">Select Certificate</option> */}
//                     <option value="Mark List">Mark List</option>
//                     <option value="Certificate">Original Diploma Certificate</option>
//                 </select>
//             </div>

//             <div>
//                 <p className='mt-6 ml-3 font-semibold'>Semester</p>
//                 <select
//                     className='w-[92%] ml-4 h-12 border-2 px-4 mt-2 border-slate-400 rounded-lg'
//                     value={selectedCertificate}
//                     onChange={handleCertificateChange}
//                 >
//                     {/* <option value="">Select Certificate</option> */}
//                     <option value="1st Semester">1st Semester</option>
//                     <option value="3rd Semester">3rd Semester</option>
//                     <option value="4th Semester">4th Semester</option>
//                     <option value="5th Semester">5th Semester</option>
//                     <option value="6th Semester">6th Semester</option>
//                 </select>
//             </div>

//             <div>
//                 <p className='mt-6 ml-3 font-semibold'>Sem Percentage</p>
//             </div>
//             <div className='h-16 w-[92%] ml-4  justify-center'>
//                 <input className='w-full h-12 border-2 px-6 mt-2 border-slate-400 rounded-lg ' type="text" />
//                 <p></p>
//             </div>

//             <div>
//                 <p className='mt-6 ml-3 font-semibold'>Backlogs</p>
//             </div>
//             <div className='h-16 w-[92%] ml-4  justify-center'>
//                 <input className='w-full h-12 border-2 px-6 mt-2 border-slate-400 rounded-lg ' type="text" />
//                 <p></p>
//             </div>
            


//         </div>
//     )
// }

// export default Staffcertificate;


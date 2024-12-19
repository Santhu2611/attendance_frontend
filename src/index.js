import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import { SetPasswordFields } from "./components/register";
// import App from './App';
import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import HomePage from "./components/category";
import Login from "./components/login";
import Register from "./components/register";
// import Staffdetails from './components/staffdetails';
import Certificateview1 from "./components/Certificateview1";
import Certificateview2 from "./components/Certificateview2";
// import Staffcertificate1 from "./components/staffcertificate1";
// import Staffcertificate from "./components/staffcertificate";

// import Branch from './components/branch';
import Studentview from "./components/studentview";
import Principal from "./components/Principal";
import Approval from "./components/Approval";
import BranchDetails from "./components/branchDetails";
import { Profile } from "./components/profile";
import Search from "./components/search";
import LecturerView from "./components/lecturerview";
import NewStaff from "./components/newStaff";
import StaffPage from "./components/staffpage";
import StudentApproval from "./components/studentApproval";
import StudentApprovalDetails from "./components/studentDetails";
// import StudentLogin from "./components/studentlogin";
// import StaffLogin from "./components/stafflogin";
import Selectbranch from "./components/selectbranch";
import NewStudent from "./components/newStudent";
import Welcome from "./components/Welcome";

import MainPage from "./components/MainPage";

import CertificateEdit from "./components/certificateEdit";
import Biodata from "./components/biodata";
import OtpVerification from "./components/otpVerification";
import NotFound from "./components/404";

// import StudentRegister from "./components/studentregister";
// import Electrical from './components/electrical';
// import Civil from './components/civil';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/category" element={<HomePage />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/selectbranch" element={<Selectbranch />} />
        {/* <Route path="/setpassword" element={<SetPasswordFields />} /> */}
        {/* <Route path="/studentregister" element={<StudentRegister />} /> */}
        {/* <Route path="/branch" element={<Branch />} /> */}
        <Route path="/studentview" element={<Studentview />} />
        <Route path="/:branch/:studentid/certificate/:id" element={<Certificateview1 />} />
        <Route path="/:branch/:id/certificate" element={<Certificateview2 />} />
        <Route path="/:branch/:studentid/certificateupdate/:id" element={<CertificateEdit />} />
        <Route path="/forgotPassword" element={<OtpVerification />} />
        {/* <Route path="/staffcertificate1" element={<Staffcertificate1 />} /> */}
        {/* <Route path="/staffcertificate" element={<Staffcertificate />} /> */}
        <Route path="/profile" element={<Profile />} />
        {/* <Route path="/studentlogin" element={<StudentLogin />} />
        <Route path="/stafflogin" element={<StaffLogin />} /> */}
        {/* <Route path="/ece" element={<Branch />} /> */}
        <Route path="/principal/:branch" element={<BranchDetails />} />
        {/* <Route path="/electrical" element={<Electrical />} /> */}
        {/* <Route path="/civil" element={<Civil />} /> */}
        <Route path="/:branch/:id" element={<Studentview />} />
        <Route path="/:branch/lecturer/:id" element={<LecturerView />} />
        <Route path="/principal" element={<Principal />} />
        <Route path="/staff/:id" element={<Approval />} />
        <Route path="/search" element={<Search />} />
        <Route path="/:branch/newstaff" element={<NewStaff />} />
        <Route path="/:branch/newstudent" element={<NewStudent />} />
        <Route path="/:branch/staffpage" element={<StaffPage />} />
        <Route path="/:branch/studentapproval" element={<StudentApproval />} />

        <Route path="/welcome" element={<MainPage />} />
        <Route path="/" element={<Welcome />} />
        <Route path="/biodata/:id" element={<Biodata />} />
        <Route path="/:branch/:id/biodata" element={<Biodata />} />

        <Route
          path="/:branch/studentapproval/:pin"
          element={<StudentApprovalDetails />}
        />
        <Route path="*" element={<NotFound />} />
    
      </Routes>
    </BrowserRouter>
    {/* <App /> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../config";
import { FaArrowLeft } from "react-icons/fa";

const CheckAttendance = () => {
  const [students, setStudents] = useState([]);
  const [branches, setBranches] = useState(["ECE", "CSE", "IT", "ME", "EE","MCA"]); // Example branches
  const [percentage , setPercentage] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [studentDetails, setStudentDetails] = useState(null);
  const [attendanceType, setAttendanceType] = useState(null);
  const [attended,setAttended] = useState(0);
  const [total,setTotal] = useState(0);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${BASE_URL}/students`);
      const data = await response.json();
      const verifiedStudents = data.students.filter(
        (student) => student.isVerified
      );
      setStudents(verifiedStudents);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    if (startDate === endDate) {
      alert("Start date and end date cannot be the same.");
      return;
    }
    try {
      const response = await fetch(
        `${BASE_URL}/attendance/${selectedStudent}?startDate=${startDate}&endDate=${endDate}`
      );
      const data = await response.json();
      setAttendanceData(data.response || []);
      setPercentage(data.attendancePercentage);
      setAttended(data.attendedClasses);
      setTotal(data.totalClasses);
      const student = students.find(
        (student) => student._id === selectedStudent
      );
      setStudentDetails(student);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  const handleBranchSubmit = async (e) => {
    e.preventDefault();
    if (startDate === endDate) {
      alert("Start date and end date cannot be the same.");
      return;
    }
    try {
      const response = await fetch(
        `${BASE_URL}/get-attendance-branch?department=${selectedBranch}&startDate=${startDate}&endDate=${endDate}`
      );
      const data = await response.json();
      setAttendanceData(data.response || []);
    } catch (error) {
      console.error("Error fetching branch attendance data:", error);
    }
  };

  const handleGetCSV = async () => {
    try {
      console.log(selectedStudent)
      const email = localStorage.getItem("staffEmail");
      const studentData = await fetch(`${BASE_URL}/students/${selectedStudent}`);

      const stu = await studentData.json();

      console.log(stu.student)

      const body =
        attendanceType === "student"
          ? {
              studentId: selectedStudent,
              startDate,
              endDate,
              staffEmail: stu.student.parentEmail,
            }
          : {
              department: selectedBranch,
              startDate,
              endDate,
              staffEmail: email,
            };
      const url =
        attendanceType === "student"
          ? `${BASE_URL}/sendattendance`
          : `${BASE_URL}/sendattendanceBranch`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      alert(data.message || "CSV will be sent to your email.");
    } catch (error) {
      console.error("Error sending CSV:", error);
      alert("Failed to send CSV.");
    }
  };

  const handleBack = () => {
    setAttendanceType(null);
    setStudentDetails(null);
    setSelectedBranch("");
    setSelectedStudent("");
    setStartDate("");
    setEndDate("");
  };

  const handleBackDetails = () => {
    setAttendanceData([]);
    setStudentDetails(null);
    setSelectedBranch("");
    setSelectedStudent("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gray-50">
      <div className="w-full mt-[5%] bg-red-400 text-white text-center py-6 text-4xl font-bold relative">
        Check Attendance
      </div>

      {/* Selection Buttons */}
      {!attendanceType && (
        <div className="mt-6 flex gap-4">
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={() => setAttendanceType("student")}>
            Check Student Attendance
          </button>
          <button
            className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-700"
            onClick={() => setAttendanceType("branch")}>
            Check Branch-Wise Attendance
          </button>
        </div>
      )}

      {/* Student Attendance Form */}
      {attendanceType === "student" && attendanceData.length === 0 && (
        <form className="mt-[3%] w-[50%]" onSubmit={handleStudentSubmit}>
          <button onClick={handleBack} className=" text-red-500">
            <FaArrowLeft size={24} />
          </button>
          <h1 className="font-semibold text-xl text-center">Student Details</h1>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Select Student
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              required
              className="border rounded w-full py-2 px-3">
              <option value="" disabled>
                Select a student
              </option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} - {student.pinno}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="border rounded w-full py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="border rounded w-full py-2 px-3"
            />
          </div>
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded">
            Submit
          </button>
        </form>
      )}

      {/* Branch Attendance Form */}
      {attendanceType === "branch" && attendanceData.length === 0 && (
        <form className="mt-[3%] w-[50%]" onSubmit={handleBranchSubmit}>
          <button onClick={handleBack} className=" text-red-500">
            <FaArrowLeft size={24} />
          </button>
          <h1 className="font-semibold text-xl text-center">Branch Details</h1>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Select Branch
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              required
              className="border rounded w-full py-2 px-3">
              <option value="" disabled>
                Select a branch
              </option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="border rounded w-full py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="border rounded w-full py-2 px-3"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded">
            Submit
          </button>
        </form>
      )}

      {/* Attendance Table */}
      {/* Attendance Table */}
      {attendanceData.length > 0 && (
        <div className="mt-6 w-[70%] bg-white p-6 rounded shadow-md relative">
          <button
            onClick={handleBackDetails}
            className="absolute top-4 left-4 text-red-500">
            <FaArrowLeft size={24} />
          </button>
          <h1 className="font-semibold text-xl text-center mb-4">
            Attendance Details (
            {attendanceType === "student" ? "Student" : "Branch"})
          </h1>
          <button
            onClick={async () => await handleGetCSV()}
            className="mb-4 px-4 py-2 border border-red-400 text-red-400 rounded hover:bg-red-400 hover:text-white">
            Get CSV through Mail
          </button>
           {attendanceType === "student" && (
            <>
            <p className="font-semibold">Attended Classes : {attended} / {total} </p>
            <p className="font-semibold">Attendance Percentage : {percentage} %</p>
            </>
           )}

          <div className="max-h-64 overflow-y-auto custom-scrollbar">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Date</th>
                  {attendanceType === "branch" && (
                    <th className="py-2 px-4 border">Student Name</th>
                  )}
                  {attendanceType === "branch" && (
                    <th className="py-2 px-4 border">Roll No</th>
                  )}
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {attendanceType === "student"
                  ? // Student Attendance Table
                    attendanceData.map((record, index) => (
                      <tr key={index} className="text-center">
                        <td className="py-2 px-4 border">
                          {new Date(record?.date).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4 border">{record?.status}</td>
                        <td className="py-2 px-4 border">
                          {record?.remarks || "N/A"}
                        </td>
                      </tr>
                    ))
                  : // Branch Attendance Table
                    attendanceData.map((dayRecord, index) =>
                      dayRecord.records.length > 0 ? (
                        dayRecord.records.map((studentRecord, subIndex) => (
                          <tr
                            key={`${index}-${subIndex}`}
                            className="text-center">
                            {subIndex === 0 ? (
                              <td
                                className="py-2 px-4 border"
                                rowSpan={dayRecord.records.length}>
                                {dayRecord.date}
                              </td>
                            ) : null}
                            <td className="py-2 px-4 border">
                              {studentRecord.name}
                            </td>
                            <td className="py-2 px-4 border">
                              {studentRecord.pinno}
                            </td>
                            <td className="py-2 px-4 border">
                              {studentRecord.status}
                            </td>
                            <td className="py-2 px-4 border">
                              {studentRecord.remarks || "N/A"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr key={index} className="text-center">
                          <td className="py-2 px-4 border">{dayRecord.date}</td>
                          <td
                            className="py-2 px-4 border text-gray-500"
                            colSpan="4">
                            No records available
                          </td>
                        </tr>
                      )
                    )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckAttendance;

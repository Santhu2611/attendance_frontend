import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../config";
import { FaArrowLeft } from "react-icons/fa";

const CheckAttendance = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [attendanceData, setAttendanceData] = useState([]);
    const [studentDetails, setStudentDetails] = useState(null);

    const fetchStudents = async () => {
        try {
            const response = await fetch(`${BASE_URL}/students`);
            const data = await response.json();
            const verifiedStudents = data.filter((student) => student.isVerified);
            setStudents(verifiedStudents);
        } catch (error) {
            console.error("Error fetching student data:", error);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (startDate === endDate) {
            alert("Start date and end date cannot be the same.");
            return;
        }
        try {
            const response = await fetch(`${BASE_URL}/attendance/${selectedStudent}?startDate=${startDate}&endDate=${endDate}`);
            const data = await response.json();
            setAttendanceData(data.response ? data.response : []);
            const student = students.find((student) => student._id === selectedStudent);
            setStudentDetails(student);
        } catch (error) {
            console.error("Error fetching attendance data:", error);
        }
    };

    const handleBack = () => {
        setAttendanceData([]);
    };

    return (
        <div className="flex flex-col justify-center items-center bg-gray-50">
            <div className="w-full mt-[5%] bg-red-400 text-white text-center py-6 text-4xl font-bold relative">
                Check Attendance
            </div>
            {attendanceData.length === 0 ? (
                <form className="mt-[3%] w-[50%]" onSubmit={handleSubmit}>
                    <h1 className="font-semibold text-xl text-center">Student Details</h1>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="student">
                            Select Student
                        </label>
                        <select
                            id="student"
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="" disabled>Select a student</option>
                            {students.map((student) => (
                                <option key={student._id} value={student._id}>
                                    Name: {student.name} - Roll No: {student.pinno}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
                            Start Date
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
                            End Date
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            ) : (
                <div className="mt-[3%] w-[50%] bg-white p-6 rounded shadow-md relative">
                    <button
                        onClick={handleBack}
                        className="absolute top-4 left-4 text-red-500"
                    >
                        <FaArrowLeft size={24} />
                    </button>
                    <h1 className="font-semibold text-xl text-center mb-4">Attendance Details</h1>
                    <div className="mb-4">
                        <p><strong>Name:</strong> {studentDetails.name}</p>
                        <p><strong>Roll No:</strong> {studentDetails.pinno}</p>
                        <p><strong>Academic Year:</strong> {studentDetails.year}</p>
                        <p><strong>Department:</strong> {studentDetails.department}</p>
                    </div>
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2">Date</th>
                                <th className="py-2">Status</th>
                                <th className="py-2">Remarks</th>
                                <th className="py-2">Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceData.map((record, index) => (
                                <tr key={index} className="text-center">
                                    <td className="py-2">{new Date(record.date).toLocaleDateString()}</td>
                                    <td className="py-2">{record.status}</td>
                                    <td className="py-2">{record.remarks}</td>
                                    <td className="py-2">{record.message}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CheckAttendance;

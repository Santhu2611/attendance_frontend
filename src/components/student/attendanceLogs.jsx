import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../config";

const StudentAttendanceLogs = () => {
    const [attendance, setAttendance] = useState([]);
    const studentId = localStorage.getItem("id");
    const [student, setStudent] = useState({});

    const fetchStudent = async () => {
        try {
            const response = await fetch(`${BASE_URL}/students/${studentId}`);
            const data = await response.json();
            setStudent(data.student);
        } catch (error) {
            console.error("Error fetching student data:", error);
        }
    };

    const fetchAttendance = async () => {
        try {
            const response = await fetch(`${BASE_URL}/get-attendance/${studentId}`);
            const data = await response.json();
            setAttendance(data.attendance);
        } catch (error) {
            console.error("Error fetching student data:", error);
        }
    };

    useEffect(() => {
        fetchStudent();
        fetchAttendance();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    
    const formatTime = (dateString) => {
        const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return new Date(dateString).toLocaleTimeString(undefined, options);
    };

    return (
        <div className="flex flex-col justify-center items-center bg-gray-50">
            <div className="w-full mt-[5%]  bg-red-400 text-white text-center py-6 text-4xl font-bold">
                My Attendance Logs
            </div>
            <div className="overflow-x-auto mt-[3%] w-[90%]">
                {attendance.length === 0 ? (
                    <div className="text-center text-gray-500">No attendance logs</div>
                ) : (
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead className="bg-red-300 text-white">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">Id</th>
                                <th className="border border-gray-300 px-4 py-2">Name</th>
                                <th className="border border-gray-300 px-4 py-2">Roll No</th>
                                <th className="border border-gray-300 px-4 py-2">Year</th>
                                <th className="border border-gray-300 px-4 py-2">Department</th>
                                <th className="border border-gray-300 px-4 py-2">Present Date</th>
                                <th className="border border-gray-300 px-4 py-2">Attendance Time</th>
                                <th className="border border-gray-300 px-4 py-2">Pic</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.map((attend, index) => (
                                <tr key={index} className="text-center">
                                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                    <td className="border border-gray-300 px-4 py-2">{student.name}</td>
                                    <td className="border border-gray-300 px-4 py-2">{student.pinno}</td>
                                    <td className="border border-gray-300 px-4 py-2">{student.year}</td>
                                    <td className="border border-gray-300 px-4 py-2">{student.department}</td>
                                    <td className="border border-gray-300 px-4 py-2">{formatDate(attend.date)}</td>
                                    <td className="border border-gray-300 px-4 py-2">{formatTime(attend.date)}</td>
                                    <td className="border border-gray-300 px-4 py-2 "><img src={attend?.pic} alt="pic" className="mx-auto h-20" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default StudentAttendanceLogs;

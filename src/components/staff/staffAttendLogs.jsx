import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../config";

const StaffAttendanceLogs = () => {
    const [attendance, setAttendance] = useState([]);
    const studentId = localStorage.getItem("id");
    const [student, setStudent] = useState({});

    const fetchAttendance = async () => {
        try {
            const response = await fetch(`${BASE_URL}/attendance`);
            const data = await response.json();
            setAttendance(data.students);
            console.log(data.students[0].attendance[0].pic);
        } catch (error) {
            console.error("Error fetching student data:", error);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return "Did not attend";
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return isNaN(date) ? "Did not attend" : date.toLocaleDateString(undefined, options);
    };
    
    const formatTime = (dateString) => {
        if (!dateString) return "Did not attend";
        const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const date = new Date(dateString);
        return isNaN(date) ? "Did not attend" : date.toLocaleTimeString(undefined, options);
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
                                <th className="border border-gray-300 px-4 py-2">Department</th>
                                <th className="border border-gray-300 px-4 py-2">Present Date</th>
                                <th className="border border-gray-300 px-4 py-2">Attendance Time</th>
                                {/* <th className="border border-gray-300 px-4 py-2">Attendance Pic</00.th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.map((attend, index) => (
                                <tr key={index} className="text-center">
                                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                    <td className="border border-gray-300 px-4 py-2">{attend.name}</td>
                                    <td className="border border-gray-300 px-4 py-2">{attend.department}</td>
                                    <td className="border border-gray-300 px-4 py-2">{formatDate(attend?.attendance[index]?.date)}

                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">{formatTime(attend?.attendance[index]?.date)}</td>
                                    {/* <td className="border border-gray-300 px-4 py-2">
                                        <img src={attend?.attendance[index]?.pic} alt="Attendance Pic" className="w-16 h-16 object-cover mx-auto" />
                                    </td>  */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default StaffAttendanceLogs;

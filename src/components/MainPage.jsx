import React, { useState } from 'react';
import logo from "../assets/logo.png";
import { useStores } from "../store/index"
import { Logo } from "./category";
import { useNavigate } from 'react-router-dom';
import { useObserver } from 'mobx-react';

const MainPage = () => {
    const [showState, setShowState] = useState(true);
    const [showDistrict, setShowDistrict] = useState(false);
    const [showCollege, setShowCollege] = useState(false);
    const { CommonStore } = useStores();
    const navigate = useNavigate();

    const states = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttarakhand', 'Uttar Pradesh', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
    ];

    // Define districts for each state (you can replace this with your actual data)
    const districts = {
        'Andhra Pradesh': ['Vishakhapatnam', 'Guntur', 'Krishna', 'Kurnool', 'Chittoor', 'Anantapur', 'East Godavari', 'West Godavari', 'Srikakulam', 'Prakasam', 'Nellore', 'Y.S.R Kadapa', 'Vizianagaram', 'Other'],
        'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Roing', 'Pasighat', 'Other'],
        'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Other'],
        'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Arrah', 'Begusarai', 'Katihar', 'Munger', 'Chhapra', 'Danapur', 'Bettiah', 'Saharsa', 'Sasaram', 'Hajipur', 'Dehri-on-Sone', 'Buxar', 'Kishanganj', 'Nawada', 'Jamalpur', 'Sitamarhi', 'Motihari', 'Bagaha', 'Siwan', 'Other'],
        'Chhattisgarh': ['Raipur', 'Bhilai Nagar', 'Korba', 'Bilaspur', 'Durg', 'Rajnandgaon', 'Jagdalpur', 'Raigarh', 'Ambikapur', 'Other'],
        'Goa': ['Panaji', 'Madgaon', 'Vasco Da Gama', 'Other'],
        'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Nadiad', 'Gandhidham', 'Morbi', 'Surendranagar Dudhrej', 'Bharuch', 'Anand', 'Porbandar', 'Godhra', 'Navsari', 'Dahod', 'Botad', 'Veraval', 'Palanpur', 'Valsad', 'Vapi', 'Deesa', 'Amreli', 'Bhuj', 'Anjar', 'Other'],
        'Haryana': ['Faridabad', 'Gurgaon', 'Hisar', 'Rohtak', 'Panipat', 'Karnal', 'Sonipat', 'Yamunanagar', 'Panchkula', 'Bhiwani', 'Sirsa', 'Bahadurgarh', 'Jind', 'Thanesar', 'Kaithal', 'Rewari', 'Palwal', 'Other'],
        'Himachal Pradesh': ['Shimla', 'Solan', 'Dharamsala', 'Palampur', 'Mandi', 'Sundarnagar', 'Other'],
        'Jharkhand': ['Jamshedpur', 'Dhanbad', 'Ranchi', 'Bokaro Steel City', 'Deoghar', 'Phusro', 'Hazaribag', 'Giridih', 'Ramgarh', 'Medininagar (Daltonganj)', 'Chirkunda', 'Jhumri Tilaiya', 'Saunda', 'Sahibganj', 'Jharia', 'Gumia', 'Bokaro', 'Ghatshila', 'Other'],
        'Karnataka': ['Bengaluru', 'Hubli-Dharwad', 'Mysore', 'Gulbarga', 'Mangalore', 'Belgaum', 'Davanagere', 'Bellary', 'Bijapur', 'Shimoga', 'Tumkur', 'Raichur', 'Bidar', 'Hospet', 'Udupi', 'Robertson Pet', 'Other'],
        'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Kollam', 'Thrissur', 'Kannur', 'Kottayam', 'Other'],
        'Madhya Pradesh': ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa', 'Murwara (Katni)', 'Singrauli', 'Burhanpur', 'Khandwa', 'Bhind', 'Chhindwara', 'Guna', 'Shivpuri', 'Vidisha', 'Chhatarpur', 'Damoh', 'Mandsaur', 'Khargone', 'Neemuch', 'Pithampur', 'Hoshangabad', 'Itarsi', 'Sehore', 'Betul', 'Seoni', 'Datia', 'Nagda', 'Narsinghgarh', 'Other'],
        'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Pimpri-Chinchwad', 'Nashik', 'Kalyan-Dombivali', 'Vasai-Virar', 'Aurangabad', 'Navi Mumbai', 'Solapur', 'Mira-Bhayandar', 'Bhiwandi', 'Amravati', 'Nanded Waghala', 'Kolhapur', 'Akola', 'Latur', 'Ahmednagar', 'Jalgaon', 'Ambernath', 'Navi Mumbai Panvel Raigad', 'Allahabad', 'Jalna', 'Panvel', 'Other'],
        'Manipur': ['Imphal', 'Other'],
        'Meghalaya': ['Shillong', 'Other'],
        'Mizoram': ['Aizawl', 'Other'],
        'Nagaland': ['Dimapur', 'Kohima', 'Other'],
        'Odisha': ['Bhubaneswar', 'Cuttack', 'Raurkela', 'Brahmapur', 'Sambalpur', 'Puri', 'Baleshwar Town', 'Baripada Town', 'Bhadrak', 'Balangir', 'Jharsuguda', 'Jeypur', 'Other'],
        'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Pathankot', 'Hoshiarpur', 'Batala', 'Moga', 'Malerkotla', 'Khanna', 'Phagwara', 'Muktasar', 'Barnala', 'Rajpura', 'Firozpur', 'Kapurthala', 'Mohali', 'Barnala', 'Other'],
        'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar', 'Bharatpur', 'Sikar', 'Pali', 'Sri Ganganagar', 'Other'],
        'Sikkim': ['Gangtok', 'Other'],
        'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Tiruppur', 'Salem', 'Erode', 'Tirunelveli', 'Vellore', 'Thoothukkudi', 'Dindigul', 'Thanjavur', 'Ranipet', 'Sivakasi', 'Karur', 'Udhagamandalam', 'Hosur', 'Nagercoil', 'Kanchipuram', 'Kumarapalayam', 'Karaikkudi', 'Neyveli', 'Cuddalore', 'Kumbakonam', 'Tiruvannamalai', 'Pollachi', 'Rajapalayam', 'Gudiyatham', 'Pudukottai', 'Vaniyambadi', 'Ambur', 'Nagapattinam', 'Other'],
        'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Ramagundam', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet', 'Other'],
        'Tripura': ['Agartala', 'Other'],
        'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani-cum-Kathgodam', 'Other'],
        'Uttar Pradesh': ['Kanpur', 'Lucknow', 'Ghaziabad', 'Agra', 'Meerut', 'Varanasi', 'Allahabad', 'Bareilly', 'Aligarh', 'Moradabad', 'Saharanpur', 'Gorakhpur', 'Noida', 'Jhansi', 'Muzaffarnagar', 'Mathura', 'Shahjahanpur', 'Rampur', 'Mau', 'Farrukhabad', 'Hapur', 'Etawah', 'Mirzapur', 'Bulandshahr', 'Sambhal', 'Amroha', 'Hardoi', 'Fatehpur', 'Raebareli', 'Orai', 'Sitapur', 'Bahraich', 'Modinagar', 'Unnao', 'Jaunpur', 'Lakhimpur', 'Hathras', 'Banda', 'Pilibhit', 'Mainpuri', 'Etah', 'Ujhani', 'Sultanpur', 'Mihinpurwa', 'Other'],
        'West Bengal': ['Kolkata', 'Asansol', 'Siliguri', 'Durgapur', 'Bardhaman', 'Malda', 'Baharampur', 'Habra', 'Kharagpur', 'Shantipur', 'Dankuni', 'Dhulian', 'Ranaghat', 'Haldia', 'Raiganj', 'Krishnanagar', 'Nabadwip', 'Medinipur', 'Jalpaiguri', 'Balurghat', 'Basirhat', 'Bankura', 'Chakdaha', 'Darjeeling', 'Alipurduar', 'Purulia', 'Jangipur', 'Bangaon', 'Cooch Behar', 'Other'],
        'Andaman and Nicobar Islands': ['Port Blair', 'Other'],
        'Chandigarh': ['Chandigarh', 'Other'],
        'Dadra and Nagar Haveli': ['Silvassa', 'Other'],
    };

    const colleges = {
        'Vishakhapatnam': ['Government Polytechnic Pendurthi', 'Government Polytechnic Kancharapalem', 'Polytechnic for Women Bheemunipatnam', 'Other'],
    };

    const handleStateChange = (state) => {
        CommonStore.setState(state);
        console.log(CommonStore.state)
    };

    const statenext = () => {
        if (CommonStore?.state) {
            setShowDistrict(true);
            setShowState(false);
        }
        else {
            alert("Select State")
        }
    }

    const handleDistrictChange = (district) => {
        CommonStore.setDistrict(district);
    };

    const districtnext = () => {
        if (CommonStore?.district) {
            if (CommonStore?.district === "Vishakhapatnam") {
                setShowCollege(true);
                setShowDistrict(false);
            }
            else {
                alert("Coming Soon...")
            }
        }
        else {
            alert("Select District")
        }
    }

    const handleCollegeChange = (college) => {
        CommonStore.setCollege(college);
    }

    const GoToCategory = () => {
        if (CommonStore?.college) {
            if (CommonStore?.college === "Government Polytechnic Pendurthi") {
                navigate("/category")
            }
            else {
                alert("Coming Soon...")
            }
        }
        else {
            alert("Select College")
        }
    }

    return useObserver(() => (
        <div className="flex flex-col w-[100%] h-screen justify-center items-center">
            <div className=" flex justify-center md:w-[30%] items-center  md:h-[100%] ">
                <Logo />
            </div>
            <div className="  flex flex-col w-[90%] items-center justify-center">
                {showState &&
                    <>
                        <div className='flex flex-col items-start w-full'>
                            <label htmlFor="state" className="ml-1 mt-10">
                                Select State:
                            </label>
                            <select
                                id="state"
                                name="state"
                                className="border p-4 rounded-full mt-1 w-full bg-primary text-white"
                                value={CommonStore?.state}
                                onChange={(e) => handleStateChange(e.target.value)}
                            >
                                <option value="">Select a state</option>
                                {states.map((state, index) => (
                                    <option key={index} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button onClick={statenext} className='px-4 py-2 border-2 border-primary hover:border-none hover:bg-primary hover:text-white mt-5 rounded-lg' >Next</button>
                    </>
                }

                {CommonStore?.state && showDistrict && (
                    <>
                        <div className='flex flex-col w-full items-start'>
                            <label htmlFor="district" className="ml-1 mt-10">
                                Select District:
                            </label>
                            <select
                                id="district"
                                name="district"
                                className="border p-4 rounded-full mt-1 w-full bg-primary text-white"
                                value={CommonStore?.district}
                                onChange={(e) => handleDistrictChange(e.target.value)}
                            >
                                <option value="">Select a district</option>
                                {districts[CommonStore?.state].map((district, index) => (
                                    <option key={index} value={district}>
                                        {district}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='flex justify-around w-[80%] items-center'>
                            <button onClick={districtnext} className='px-4 py-2 border-2 border-primary hover:border-none hover:bg-primary hover:text-white mt-5 rounded-lg' >Next</button>
                            <button onClick={() => {
                                setShowDistrict(false)
                                setShowState(true)
                            }} className='text-primary mt-5' >Change State</button>
                        </div>

                    </>
                )}
                {/* code for college selection */}
                {CommonStore?.district && showCollege && (
                    <>
                        <div className='flex flex-col w-full items-start'>
                            <label htmlFor="college" className="ml-1 mt-10">
                                Select College:
                            </label>
                            <select
                                id="college"
                                name="college"
                                className="border p-4 rounded-full mt-1 w-full bg-primary text-white"
                                value={CommonStore?.college}
                                onChange={(e) => handleCollegeChange(e.target.value)}
                            >
                                <option value="">Select a college</option>
                                {colleges[CommonStore?.district].map((college, index) => (
                                    <option key={index} value={college}>
                                        {college}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='flex justify-around w-[80%] items-center'>
                            <button onClick={GoToCategory} className='px-4 py-2 border-2 border-primary hover:border-none hover:bg-primary hover:text-white mt-5 rounded-lg'>
                                Login
                            </button>
                            <button onClick={() => {
                                setShowDistrict(true)
                                setShowCollege(false)
                            }} className='text-primary mt-5' >Change District</button>
                        </div>
                    </>
                )}

                {/* after selecting the college login button ends */}
            </div>
        </div>
    ));
};

export default MainPage;

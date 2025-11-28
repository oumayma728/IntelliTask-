import { updateUser, GetAllUsers, getUserById } from "../api/UserApi"
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../Context/AuthContext";
import { ChangePassword } from "../api/AuthApi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { coerceAndCheckDataType } from "ajv/dist/compile/validate/dataType";

export default function ProfileSettings({ userId, userData, profileImage }) {
    const fileInputRef = useRef(null);
    const { user, setUser , token} = useAuth();
    const navigate = useNavigate();
    const sourceUser = userData || user || {};
    const [showPassword, setShowPassword] = useState(false);

    const [profileImg, setProfileImg] = useState(profileImage || localStorage.getItem("profileImage") || null);
    const [username, setUsername] = useState(sourceUser.username || "");
    const [email, setEmail] = useState(sourceUser.email || "");
    const [phoneNumber, setPhoneNumber] = useState(sourceUser.phoneNumber || "");
    const [CurrentPassword, setCurrentPassword] = useState("");
    const [NewPassword, setNewPassword] = useState("");
    //for the image upload
    const handleImageChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result;
            setProfileImg(base64String);
            localStorage.setItem("profileImage", base64String);
        };
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) return;
            try {
                const user = await getUserById(userId);
                setUsername(user.username || "");
                setEmail(user.email || "");
                setPhoneNumber(user.phoneNumber || "");
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUser();
    }, [userId]);


    const UpdateProfile = async () => {
        const updatedUser = {
            username: username,
            email: email,
            phoneNumber: phoneNumber,
        };
        try {
let idToUpdate = userId || user?.id || sourceUser.id || sourceUser.Id || user?.id || user?.Id;// this now works
            if (!idToUpdate && token ) {
                const decoded = jwtDecode(token);
        idToUpdate = decoded.id || decoded.sub || decoded.userid || decoded.nameid;

                console.error('No user id available to update');
                return;
            }
            const result = await updateUser(idToUpdate, updatedUser);
            //to update the context user info
            setUser(prev => ({ ...prev, ...result }));
            localStorage.setItem("user", JSON.stringify(result));
            console.log("Profile updated successfully:", result);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const changePassword = async () => {
    if (!CurrentPassword || !NewPassword) {
        alert("Please fill both current and new password fields.");
        return;
    }
    if (CurrentPassword === NewPassword) {
        alert("New password must be different from the current password.");
        return;
    }

    // Get the user ID from props, context, or token
    const idToUpdate = userId || sourceUser.id || sourceUser.Id || user?.id || user?.Id;
    

    try {
        const result = await ChangePassword(idToUpdate, CurrentPassword, NewPassword);
        alert(result?.message || "Password changed successfully.");
        setCurrentPassword("");
        setNewPassword("");
        navigate("/");
    } catch (error) {
        const serverMsg = error.response?.data?.message || error.response?.data || error.message;
        console.error("Change password error:", error);
        alert(serverMsg || "Failed to change password. Please try again.");
    }
};

    return (
        <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between p-6">
                {/* Left side: User Info */}
                <div className="flex flex-col space-y-2">
                    <h1 className="text-2xl font-bold ">{user?.username}</h1>
                    <p>{user?.email}</p>
                    <p>{user?.phoneNumber || user?.PhoneNumber}</p>
                </div>

                {/* Right side: Profile Image */}
                <div className="relative ml-8">
                    <img
                        src={profileImg || profileImage || "https://via.placeholder.com/80"}
                        alt="Profile"
                        className="w-20 h-20 rounded-full border-2 border-blue-500 object-cover cursor-pointer"
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </div>
            </div>


            <div className="p-6 rounded-2xl shadow">
                <h2 className="text-lg font-semibold mb-4">Profile Settings</h2>

                <div className="space-y-4">
                    <input
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full text-black p-2 rounded-lg border" />

                    <input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}

                        className="w-full  text-black p-2 rounded-lg border" />
                    <input
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full text-black p-2 rounded-lg border" />
                </div>
                <button
                    onClick={UpdateProfile}
                    className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"> Save Changes </button>
            </div>
            <div >
                <h2 className="text-lg font-semibold mb-4">Change Password</h2>
                <div className="space-y-3 max-w-md">
                    <div className="relative">

                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Current Password"
                        value={CurrentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full text-black p-2 rounded-lg border mb-2" />
                    <button
                    type="button"
                    onClick ={()=>setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/70">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}</button>
                    </div>
                    <div className="relative">

                    <input
                        type={showPassword ? "text" : "password"}

                        placeholder="New Password"
                        value={NewPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full text-black p-2 rounded-lg border" />
                        <button
                    type="button"
                    onClick ={()=>setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/70">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}</button>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={changePassword}
                            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        > Change Password</button>
                        <button
                            onClick={() => { setCurrentPassword(''); setNewPassword(''); }}
                            className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        > Cancel</button>
                    </div>
                </div>
                </div>

            </div>
    );
}
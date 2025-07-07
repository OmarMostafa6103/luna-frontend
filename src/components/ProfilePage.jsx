// import React, { useState, useEffect, useContext } from 'react';
// import { ShopContext } from '../context/ShopContext';
// import { assets } from '../assets/assets';
// import { Link } from 'react-router-dom';

// const ProfilePage = () => {
//     const { isLoggedIn, backendUrl } = useContext(ShopContext);
//     const [profileData, setProfileData] = useState(null);
//     const [editMode, setEditMode] = useState(false);
//     const [editedData, setEditedData] = useState({
//         name: '',
//         email: '',
//         phone: '',
//         image: null,
//         address: '',
//         current_password: '',
//         password: '',
//         password_confirmation: '',
//     });

//     useEffect(() => {
//         const fetchProfileData = async () => {
//             const token = localStorage.getItem('token');
//             if (!token) return;

//             try {
//                 const response = await fetch(`${backendUrl}/api/profile`, {
//                     method: 'GET',
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });

//                 if (response.ok) {
//                     const data = await response.json();
//                     setProfileData(data.data);
//                     setEditedData({
//                         name: data.data.name || '',
//                         email: data.data.email || '',
//                         phone: data.data.phone || '',
//                         image: data.data.image || null,
//                         address: data.data.address || '',
//                         current_password: '',
//                         password: '',
//                         password_confirmation: '',
//                     });
//                 }
//             } catch (error) {
//                 console.error('Error fetching profile data:', error);
//             }
//         };

//         if (isLoggedIn) fetchProfileData();
//     }, [isLoggedIn, backendUrl]);

//     const handleEditProfile = async () => {
//         const token = localStorage.getItem('token');
//         if (!token) return;

//         const formData = new FormData();
//         formData.append('name', editedData.name);
//         formData.append('email', editedData.email);
//         formData.append('phone', editedData.phone);
//         if (editedData.image instanceof File) {
//             formData.append('image', editedData.image);
//         }
//         formData.append('address', editedData.address);
//         formData.append('current_password', editedData.current_password);
//         formData.append('password', editedData.password);
//         formData.append('password_confirmation', editedData.password_confirmation);

//         try {
//             const response = await fetch(`${backendUrl}/api/profile?_method=PUT`, {
//                 method: 'POST',
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//                 body: formData,
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 setProfileData(data.data);
//                 setEditMode(false);
//             }
//         } catch (error) {
//             console.error('Error updating profile:', error);
//         }
//     };

//     const handleDeleteEmail = async () => {
//         const token = localStorage.getItem('token');
//         if (!token) return;

//         if (window.confirm('Are you sure you want to delete your email?')) {
//             try {
//                 const response = await fetch(`${backendUrl}/api/profile?_method=DELETE`, {
//                     method: 'POST',
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });

//                 if (response.ok) {
//                     setProfileData((prev) => ({ ...prev, email: '' }));
//                 }
//             } catch (error) {
//                 console.error('Error deleting email:', error);
//             }
//         }
//     };

//     if (!isLoggedIn) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
//                 <div className="bg-white dark:bg-[#1a2338] p-6 rounded-xl shadow-2xl text-center">
//                     <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Please Log In</h2>
//                     <p className="text-gray-600 dark:text-gray-300 mb-6">
//                         You need to be logged in to view your profile.
//                     </p>
//                     <Link to="/login" className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-200">
//                         Go to Login
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 flex items-center justify-center">
//             <div className="w-full max-w-3xl bg-white dark:bg-[#1a2338] rounded-2xl shadow-2xl p-8">
//                 <div className="text-center mb-8">
//                     <h1 className="text-4xl font-bold text-gray-800 dark:text-white">👤 ملفك الشخصي</h1>
//                     <p className="text-gray-500 dark:text-gray-300 mt-2">قم بإدارة معلوماتك الشخصية وتحديثها</p>
//                 </div>

//                 <div className="flex justify-center mb-6">
//                     <img
//                         src={profileData?.image || assets.profile_icon}
//                         alt="User Avatar"
//                         className="w-28 h-28 rounded-full border-4 border-green-500 shadow-lg object-cover transition-transform duration-300 hover:scale-105"
//                     />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
//                     {editMode ? (
//                         <>
//                             {['name', 'email', 'phone', 'address', 'current_password', 'password', 'password_confirmation'].map((field) => (
//                                 <div key={field}>
//                                     <label className="text-gray-700 dark:text-gray-200 font-semibold block mb-1 capitalize">{field.replace('_', ' ')}:</label>
//                                     <input
//                                         type={field.includes('password') ? 'password' : 'text'}
//                                         value={editedData[field] || ''}
//                                         onChange={(e) => setEditedData({ ...editedData, [field]: e.target.value })}
//                                         className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
//                                     />
//                                 </div>
//                             ))}
//                             <div>
//                                 <label className="text-gray-700 dark:text-gray-200 font-semibold block mb-1">Profile Image:</label>
//                                 <input
//                                     type="file"
//                                     onChange={(e) => setEditedData({ ...editedData, image: e.target.files[0] })}
//                                     className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
//                                 />
//                             </div>
//                         </>
//                     ) : (
//                         <>
//                             <div>
//                                 <p className="text-gray-700 dark:text-gray-200 font-semibold">الاسم الكامل:</p>
//                                 <p className="text-gray-600 dark:text-gray-300">{profileData?.name || 'غير متوفر'}</p>
//                             </div>
//                             <div>
//                                 <p className="text-gray-700 dark:text-gray-200 font-semibold">البريد الإلكتروني:</p>
//                                 <p className="text-gray-600 dark:text-gray-300">{profileData?.email || 'غير متوفر'}</p>
//                             </div>
//                             <div>
//                                 <p className="text-gray-700 dark:text-gray-200 font-semibold">رقم الهاتف:</p>
//                                 <p className="text-gray-600 dark:text-gray-300">{profileData?.phone || 'غير متوفر'}</p>
//                             </div>
//                             <div>
//                                 <p className="text-gray-700 dark:text-gray-200 font-semibold">العنوان:</p>
//                                 <p className="text-gray-600 dark:text-gray-300">{profileData?.address || 'لا يوجد عنوان'}</p>
//                             </div>
//                         </>
//                     )}
//                 </div>

//                 {/* أزرار الإجراءات */}
//                 <div className="mt-8 flex flex-wrap gap-4 justify-center">
//                     {editMode ? (
//                         <>
//                             <button
//                                 onClick={handleEditProfile}
//                                 className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-200"
//                             >
//                                 حفظ التغييرات
//                             </button>
//                             <button
//                                 onClick={() => setEditMode(false)}
//                                 className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition duration-200"
//                             >
//                                 إلغاء
//                             </button>
//                         </>
//                     ) : (
//                         <>
//                             <button
//                                 onClick={() => setEditMode(true)}
//                                 className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
//                             >
//                                 تعديل الملف الشخصي
//                             </button>
//                             <button
//                                 onClick={handleDeleteEmail}
//                                 className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-200"
//                             >
//                                 حذف البريد الإلكتروني
//                             </button>
//                             <Link
//                                 to="/"
//                                 className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition duration-200"
//                             >
//                                 العودة للرئيسية
//                             </Link>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProfilePage;










// ملف ProfilePage محسَّن بتصميم عصري وتحسين عرض المعلومات باستخدام TailwindCSS

import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
    const { isLoggedIn, backendUrl } = useContext(ShopContext);
    const [profileData, setProfileData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editedData, setEditedData] = useState({
        name: '',
        email: '',
        phone: '',
        image: null,
        address: '',
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        const fetchProfileData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch(`${backendUrl}/api/profile`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setProfileData(data.data);
                    setEditedData({
                        name: data.data.name || '',
                        email: data.data.email || '',
                        phone: data.data.phone || '',
                        image: data.data.image || null,
                        address: data.data.address || '',
                        current_password: '',
                        password: '',
                        password_confirmation: '',
                    });
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        if (isLoggedIn) fetchProfileData();
    }, [isLoggedIn, backendUrl]);

    const handleEditProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const formData = new FormData();

        if (editedData.name) formData.append('name', editedData.name);
        if (editedData.email) formData.append('email', editedData.email);
        if (editedData.phone) formData.append('phone', editedData.phone);
        if (editedData.image instanceof File) formData.append('image', editedData.image);
        if (editedData.address) formData.append('address', editedData.address);
        if (editedData.current_password) formData.append('current_password', editedData.current_password);
        if (editedData.password) formData.append('password', editedData.password);
        if (editedData.password_confirmation) formData.append('password_confirmation', editedData.password_confirmation);

        try {
            const response = await fetch(`${backendUrl}/api/profile?_method=PUT`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setProfileData(data.data);
                setEditMode(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleDeleteEmail = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        if (window.confirm('Are you sure you want to delete your email?')) {
            try {
                const response = await fetch(`${backendUrl}/api/profile?_method=DELETE`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    setProfileData((prev) => ({ ...prev, email: '' }));
                }
            } catch (error) {
                console.error('Error deleting email:', error);
            }
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="bg-white dark:bg-[#1a2338] p-6 rounded-xl shadow-2xl text-center">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Please Log In</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        You need to be logged in to view your profile.
                    </p>
                    <Link to="/login" className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-200">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 flex items-center justify-center">
            <div className="w-full max-w-3xl bg-white dark:bg-[#1a2338] rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white">👤 ملفك الشخصي</h1>
                    <p className="text-gray-500 dark:text-gray-300 mt-2">قم بإدارة معلوماتك الشخصية وتحديثها</p>
                </div>

                <div className="flex justify-center mb-6">
                    <img
                        src={profileData?.image || assets.profile_icon}
                        alt="User Avatar"
                        className="w-28 h-28 rounded-full border-4 border-green-500 shadow-lg object-cover transition-transform duration-300 hover:scale-105"
                    />
                </div>

                {editMode ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        {['name', 'email', 'phone', 'address', 'current_password', 'password', 'password_confirmation'].map((field) => (
                            <div key={field}>
                                <label className="text-gray-700 dark:text-gray-200 font-semibold block mb-1 capitalize">{field.replace('_', ' ')}:</label>
                                <input
                                    type={field.includes('password') ? 'password' : 'text'}
                                    value={editedData[field] || ''}
                                    onChange={(e) => setEditedData({ ...editedData, [field]: e.target.value })}
                                    className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                />
                            </div>
                        ))}
                        <div>
                            <label className="text-gray-700 dark:text-gray-200 font-semibold block mb-1">Profile Image:</label>
                            <input
                                type="file"
                                onChange={(e) => setEditedData({ ...editedData, image: e.target.files[0] })}
                                className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 divide-y divide-gray-200 dark:divide-gray-700">
                        <div className="flex items-center gap-4">
                            <span className="text-gray-500 dark:text-gray-400 w-32">👤 الاسم:</span>
                            <p className="text-gray-800 dark:text-gray-100 font-medium">{profileData?.name || 'غير متوفر'}</p>
                        </div>
                        <div className="flex items-center gap-4 pt-4">
                            <span className="text-gray-500 dark:text-gray-400 w-32">📧 البريد:</span>
                            <p className="text-gray-800 dark:text-gray-100">{profileData?.email || 'غير متوفر'}</p>
                        </div>
                        <div className="flex items-center gap-4 pt-4">
                            <span className="text-gray-500 dark:text-gray-400 w-32">📞 الهاتف:</span>
                            <p className="text-gray-800 dark:text-gray-100">{profileData?.phone || 'غير متوفر'}</p>
                        </div>
                        <div className="flex items-center gap-4 pt-4">
                            <span className="text-gray-500 dark:text-gray-400 w-32">📍 العنوان:</span>
                            <p className="text-gray-800 dark:text-gray-100">{profileData?.address || 'لا يوجد عنوان'}</p>
                        </div>
                    </div>
                )}

                {/* أزرار الإجراءات */}
                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                    {editMode ? (
                        <>
                            <button
                                onClick={handleEditProfile}
                                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                            >
                                حفظ التغييرات
                            </button>
                            <button
                                onClick={() => setEditMode(false)}
                                className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition duration-200"
                            >
                                إلغاء
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setEditMode(true)}
                                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                            >
                                تعديل الملف الشخصي
                            </button>
                            <button
                                onClick={handleDeleteEmail}
                                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                            >
                                حذف البريد الإلكتروني
                            </button>
                            <Link
                                to="/"
                                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition duration-200"
                            >
                                العودة للرئيسية
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

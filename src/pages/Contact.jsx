import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import Title from '../components/Title';

const Contact = () => {
    const { backendUrl } = useContext(ShopContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!backendUrl || backendUrl.trim() === '') {
            toast.error('خطأ: عنوان الخادم الخلفي غير محدد أو فارغ. تحقق من إعدادات التطبيق.');
            console.log('backendUrl:', backendUrl);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('message', formData.message);

            console.log('Form Data Being Sent:', {
                name: formData.name,
                email: formData.email,
                message: formData.message
            });

            const headers = {
                'Authorization': token ? `Bearer ${token}` : ''
            };

            console.log('Request Headers:', headers);

            const response = await fetch(`${backendUrl}/api/contact`, {
                method: 'POST',
                headers: headers,
                body: formDataToSend,
            });

            console.log('Response Status:', response.status);
            console.log('Response OK:', response.ok);

            const responseData = await response.text();
            console.log('Raw Response:', responseData);

            const parsedResponse = responseData ? JSON.parse(responseData) : {};
            console.log('Parsed Response Data:', parsedResponse);

            if (response.ok) {
                toast.success(parsedResponse.message || 'تم إرسال الرسالة بنجاح!');
                setFormData({ name: '', email: '', message: '' });
            } else {
                // عرض رسالة الخطأ من الخادم
                const errorMessage = parsedResponse.data?.message?.[0] || parsedResponse.message || 'حاول مرة أخرى.';
                toast.error(`فشل إرسال الرسالة: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error Details:', error);
            toast.error('حدث خطأ أثناء الإرسال. تأكد من اتصالك بالإنترنت أو عنوان الخادم.');
        }
    };

    return (
        <div id="contact">
            <Title text1="Contact" text2="Us" />
            <h1 className="text-center max-w-3xl mx-auto mt-4 text-md">
                We'd love to hear from you! Whether you have questions, feedback, or need assistance, our team is here to help. Reach out and let's connect to create an amazing experience together!
            </h1>
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto pt-8">
                <div className="flex flex-wrap">
                    <div className="w-full md:w-1/2 text-left">
                        Your Name
                        <input
                            type="text"
                            className="bg-gray-200 dark:bg-gray-700 w-full border border-gray-300 rounded py-3 px-4 mt-2"
                            name="name"
                            placeholder="Enter Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="w-full md:w-1/2 text-left md:pl-4">
                        Your Email
                        <input
                            type="email"
                            className="bg-gray-200 dark:bg-gray-700 w-full border border-gray-300 rounded py-3 px-4 mt-2"
                            name="email"
                            placeholder="Enter Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="my-6 text-left">
                    Your Message
                    <textarea
                        name="message"
                        placeholder="Enter Your Message"
                        className="bg-gray-200 dark:bg-gray-700 w-full border border-gray-300 rounded py-3 px-4 mt-2 h-48 resize-none"
                        value={formData.message}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 hover:bg-blue-400">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Contact;


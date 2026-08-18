import { useEffect, useState } from 'react';
import bannerService from '../../services/bannerService';

function Banners() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        sloganAr: '',
        sloganEn: '',
        sort_order: 0,
        status: 'active',
        image: null,
    });

    const [preview, setPreview] = useState(null);

    const fetchBanners = async () => {
        try {
            setLoading(true);

            const response = await bannerService.getBanners();

           const data = response.data?.data ?? response.data ?? response;

          setBanners(data);
        } catch (error) {
            console.error('Failed to fetch banners:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setForm((prev) => ({
            ...prev,
            image: file,
        }));

        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            formData.append(
                'slogan[ar]',
                form.sloganAr
            );

            formData.append(
                'slogan[en]',
                form.sloganEn
            );

            formData.append(
                'sort_order',
                form.sort_order
            );

            formData.append(
                'status',
                form.status
            );

            if (form.image) {
                formData.append(
                    'image',
                    form.image
                );
            }

            await bannerService.createBanner(formData);

            setForm({
                sloganAr: '',
                sloganEn: '',
                sort_order: 0,
                status: 'active',
                image: null,
            });

            setPreview(null);
            setShowForm(false);

            await fetchBanners();

        } catch (error) {
            console.error('Failed to create banner:', error);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'هل أنتِ متأكدة من حذف هذا البنر؟'
        );

        if (!confirmed) return;

        try {
            await bannerService.deleteBanner(id);

            setBanners((prev) =>
                prev.filter((banner) => banner.id !== id)
            );
        } catch (error) {
            console.error('Failed to delete banner:', error);
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                جاري تحميل البنرات...
            </div>
        );
    }

    return (
        <div className="p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold">
                        إدارة البنرات
                    </h1>

                    <p className="text-gray-500 mt-1">
                        إدارة البنرات التي تظهر في الصفحة الرئيسية
                    </p>
                </div>

                <button
                    onClick={() => setShowForm(true)}
                    className="bg-green-700 text-white px-5 py-3 rounded-xl"
                >
                    + إضافة بنر
                </button>
            </div>

            {/* Add Form */}
            {showForm && (
                <div className="bg-white rounded-2xl shadow p-6 mb-8">

                    <h2 className="text-xl font-bold mb-6">
                        إضافة بنر جديد
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Arabic slogan */}
                        <div>
                            <label className="block mb-2 font-semibold">
                                النص بالعربي
                            </label>

                            <input
                                type="text"
                                name="sloganAr"
                                value={form.sloganAr}
                                onChange={handleChange}
                                className="w-full border rounded-xl px-4 py-3"
                                placeholder="خصومات الموسم: نكهات الأصالة"
                                required
                            />
                        </div>

                        {/* English slogan */}
                        <div>
                            <label className="block mb-2 font-semibold">
                                النص بالإنجليزي
                            </label>

                            <input
                                type="text"
                                name="sloganEn"
                                value={form.sloganEn}
                                onChange={handleChange}
                                className="w-full border rounded-xl px-4 py-3"
                                placeholder="Seasonal Offers: Authentic Flavors"
                            />
                        </div>

                        {/* Image */}
                        <div>
                            <label className="block mb-2 font-semibold">
                                صورة البنر
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                required
                            />
                        </div>

                        {/* Preview */}
                        {preview && (
                            <div className="mt-4">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full max-w-xl h-64 object-cover rounded-xl"
                                />
                            </div>
                        )}

                        {/* Sort order */}
                        <div>
                            <label className="block mb-2 font-semibold">
                                ترتيب البنر
                            </label>

                            <input
                                type="number"
                                name="sort_order"
                                value={form.sort_order}
                                onChange={handleChange}
                                className="border rounded-xl px-4 py-3"
                                min="0"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block mb-2 font-semibold">
                                الحالة
                            </label>

                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="border rounded-xl px-4 py-3"
                            >
                                <option value="active">
                                    نشط
                                </option>

                                <option value="inactive">
                                    غير نشط
                                </option>
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">

                            <button
                                type="submit"
                                className="bg-green-700 text-white px-6 py-3 rounded-xl"
                            >
                                حفظ البنر
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setPreview(null);
                                }}
                                className="border px-6 py-3 rounded-xl"
                            >
                                إلغاء
                            </button>

                        </div>

                    </form>
                </div>
            )}

            {/* Banners */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {banners.map((banner) => (

                    <div
                        key={banner.id}
                        className="bg-white rounded-2xl shadow overflow-hidden"
                    >

                        <img
                            src={banner.image_url}
                            alt={banner.slogan?.ar ?? ''}
                            className="w-full h-64 object-cover"
                        />

                        <div className="p-5">

                            <h3 className="font-bold text-lg">
                                {banner.slogan?.ar}
                            </h3>

                            <p className="text-gray-500 mt-1">
                                {banner.slogan?.en}
                            </p>

                            <div className="flex items-center justify-between mt-5">

                                <span>
                                    الترتيب: {banner.sort_order}
                                </span>

                                <span
                                    className={
                                        banner.status === 'active'
                                            ? 'text-green-600'
                                            : 'text-gray-400'
                                    }
                                >
                                    {banner.status === 'active'
                                        ? 'نشط'
                                        : 'غير نشط'}
                                </span>

                            </div>

                            <button
                                onClick={() => handleDelete(banner.id)}
                                className="mt-5 text-red-600"
                            >
                                حذف
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default Banners;
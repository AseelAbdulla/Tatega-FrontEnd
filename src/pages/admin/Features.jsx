
import { useEffect, useState } from 'react';
import featureService from '../../services/featureService';

function Features() {
    const emptyForm = {
        icon: '',
        titleAr: '',
        titleEn: '',
        descriptionAr: '',
        descriptionEn: '',
        sort_order: 0,
        status: 'active',
    };

    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingFeature, setEditingFeature] = useState(null);
    const [form, setForm] = useState(emptyForm);

    // =========================
    // Fetch Features
    // =========================
    const fetchFeatures = async () => {
        try {
            setLoading(true);

            const response = await featureService.getFeatures();

            setFeatures(response.data?.data ?? response.data ?? []);
        } catch (error) {
            console.error('Failed to fetch features:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeatures();
    }, []);

    // =========================
    // Form Change
    // =========================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================
    // Open Add Form
    // =========================
    const handleAdd = () => {
        setEditingFeature(null);
        setForm(emptyForm);
        setShowForm(true);
    };

    // =========================
    // Open Edit Form
    // =========================
    const handleEdit = (feature) => {
        setEditingFeature(feature);

        setForm({
            icon: feature.icon ?? '',
            titleAr: feature.title?.ar ?? '',
            titleEn: feature.title?.en ?? '',
            descriptionAr: feature.description?.ar ?? '',
            descriptionEn: feature.description?.en ?? '',
            sort_order: feature.sort_order ?? 0,
            status: feature.status ?? 'active',
        });

        setShowForm(true);
    };

    // =========================
    // Close Form
    // =========================
    const handleCancel = () => {
        setShowForm(false);
        setEditingFeature(null);
        setForm(emptyForm);
    };

    // =========================
    // Submit
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = {
                icon: form.icon,

                title: {
                    ar: form.titleAr,
                    en: form.titleEn,
                },

                description: {
                    ar: form.descriptionAr,
                    en: form.descriptionEn,
                },

                sort_order: Number(form.sort_order),
                status: form.status,
            };

            if (editingFeature) {
                // Update
                await featureService.updateFeature(
                    editingFeature.id,
                    data
                );
            } else {
                // Create
                await featureService.createFeature(data);
            }

            handleCancel();
            await fetchFeatures();

        } catch (error) {
            console.error(
                editingFeature
                    ? 'Failed to update feature:'
                    : 'Failed to create feature:',
                error
            );
        }
    };

    // =========================
    // Delete
    // =========================
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'هل أنتِ متأكدة من حذف هذه الميزة؟'
        );

        if (!confirmed) return;

        try {
            await featureService.deleteFeature(id);

            setFeatures((prev) =>
                prev.filter((feature) => feature.id !== id)
            );
        } catch (error) {
            console.error('Failed to delete feature:', error);
        }
    };

    // =========================
    // Loading
    // =========================
    if (loading) {
        return (
            <div className="p-6" dir="rtl">
                جاري تحميل المميزات...
            </div>
        );
    }

    return (
        <div className="p-6" dir="rtl">

            {/* =========================
                Header
            ========================= */}
            <div className="flex items-center justify-between mb-8">

                <div>
                    <h1 className="text-2xl font-bold">
                        إدارة المميزات
                    </h1>

                    <p className="text-gray-500 mt-1">
                        إدارة المميزات التي تظهر في الصفحة الرئيسية
                    </p>
                </div>

                <button
                    onClick={handleAdd}
                    className="bg-green-700 text-white px-5 py-3 rounded-xl hover:bg-green-800 transition"
                >
                    + إضافة ميزة
                </button>

            </div>


            {/* =========================
                Add / Edit Form
            ========================= */}
            {showForm && (
                <div className="bg-white rounded-2xl shadow p-6 mb-8">

                    <div className="flex items-center justify-between mb-6">

                        <h2 className="text-xl font-bold">
                            {editingFeature
                                ? 'تعديل الميزة'
                                : 'إضافة ميزة جديدة'}
                        </h2>

                        <button
                            type="button"
                            onClick={handleCancel}
                            className="text-gray-400 hover:text-gray-700 text-xl"
                        >
                            ✕
                        </button>

                    </div>


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Icon */}
                        <div>
                            <label className="block mb-2 font-semibold">
                                الأيقونة
                            </label>

                            <input
                                type="text"
                                name="icon"
                                value={form.icon}
                                onChange={handleChange}
                                className="w-full border rounded-xl px-4 py-3"
                                placeholder="local_shipping"
                                required
                            />

                            <p className="text-xs text-gray-400 mt-1">
                                استخدمي اسم Material Symbol مثل:
                                local_shipping أو verified
                            </p>
                        </div>


                        {/* Titles */}
                        <div className="grid md:grid-cols-2 gap-5">

                            <div>
                                <label className="block mb-2 font-semibold">
                                    العنوان بالعربي
                                </label>

                                <input
                                    type="text"
                                    name="titleAr"
                                    value={form.titleAr}
                                    onChange={handleChange}
                                    className="w-full border rounded-xl px-4 py-3"
                                    placeholder="توصيل سريع وموثوق"
                                    required
                                />
                            </div>


                            <div>
                                <label className="block mb-2 font-semibold">
                                    العنوان بالإنجليزي
                                </label>

                                <input
                                    type="text"
                                    name="titleEn"
                                    value={form.titleEn}
                                    onChange={handleChange}
                                    className="w-full border rounded-xl px-4 py-3"
                                    placeholder="Fast & Reliable Delivery"
                                    required
                                />
                            </div>

                        </div>


                        {/* Descriptions */}
                        <div className="grid md:grid-cols-2 gap-5">

                            <div>
                                <label className="block mb-2 font-semibold">
                                    الوصف بالعربي
                                </label>

                                <textarea
                                    name="descriptionAr"
                                    value={form.descriptionAr}
                                    onChange={handleChange}
                                    className="w-full border rounded-xl px-4 py-3"
                                    rows="4"
                                    placeholder="تجربة تسوق سلسة تبدأ من المتجر وتنتهي عند باب منزلك..."
                                    required
                                />
                            </div>


                            <div>
                                <label className="block mb-2 font-semibold">
                                    الوصف بالإنجليزي
                                </label>

                                <textarea
                                    name="descriptionEn"
                                    value={form.descriptionEn}
                                    onChange={handleChange}
                                    className="w-full border rounded-xl px-4 py-3"
                                    rows="4"
                                    placeholder="A smooth shopping experience..."
                                    required
                                />
                            </div>

                        </div>


                        {/* Sort + Status */}
                        <div className="grid md:grid-cols-2 gap-5">

                            <div>
                                <label className="block mb-2 font-semibold">
                                    ترتيب الميزة
                                </label>

                                <input
                                    type="number"
                                    name="sort_order"
                                    value={form.sort_order}
                                    onChange={handleChange}
                                    className="w-full border rounded-xl px-4 py-3"
                                    min="0"
                                />
                            </div>


                            <div>
                                <label className="block mb-2 font-semibold">
                                    الحالة
                                </label>

                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="w-full border rounded-xl px-4 py-3"
                                >
                                    <option value="active">
                                        نشط
                                    </option>

                                    <option value="inactive">
                                        غير نشط
                                    </option>
                                </select>
                            </div>

                        </div>


                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">

                            <button
                                type="submit"
                                className="bg-green-700 text-white px-6 py-3 rounded-xl hover:bg-green-800 transition"
                            >
                                {editingFeature
                                    ? 'حفظ التعديلات'
                                    : 'حفظ الميزة'}
                            </button>

                            <button
                                type="button"
                                onClick={handleCancel}
                                className="border px-6 py-3 rounded-xl hover:bg-gray-50 transition"
                            >
                                إلغاء
                            </button>

                        </div>

                    </form>

                </div>
            )}


            {/* =========================
                Features Grid
            ========================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {features.map((feature) => (

                    <div
                        key={feature.id}
                        className="bg-white rounded-2xl shadow p-6"
                    >

                        {/* Icon */}
                        <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center mb-5">
                            <span className="material-symbols-outlined text-green-700 text-3xl">
                                {feature.icon}
                            </span>
                        </div>


                        {/* Arabic Title */}
                        <h3 className="font-bold text-lg">
                            {feature.title?.ar}
                        </h3>


                        {/* English Title */}
                        <p className="text-gray-500 mt-1">
                            {feature.title?.en}
                        </p>


                        {/* Description */}
                        <p className="text-gray-600 mt-4 leading-relaxed">
                            {feature.description?.ar}
                        </p>


                        {/* Info */}
                        <div className="flex items-center justify-between mt-5">

                            <span className="text-sm text-gray-500">
                                الترتيب: {feature.sort_order}
                            </span>

                            <span
                                className={
                                    feature.status === 'active'
                                        ? 'text-green-600 text-sm font-semibold'
                                        : 'text-gray-400 text-sm font-semibold'
                                }
                            >
                                {feature.status === 'active'
                                    ? 'نشط'
                                    : 'غير نشط'}
                            </span>

                        </div>


                        {/* Actions */}
                        <div className="flex items-center gap-4 mt-5">

                            <button
                                onClick={() => handleEdit(feature)}
                                className="text-blue-600 hover:text-blue-800 font-semibold"
                            >
                                تعديل
                            </button>

                            <button
                                onClick={() => handleDelete(feature.id)}
                                className="text-red-600 hover:text-red-800 font-semibold"
                            >
                                حذف
                            </button>

                        </div>

                    </div>

                ))}

            </div>


            {/* Empty State */}
            {features.length === 0 && (
                <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-500">
                    لا توجد مميزات مضافة حتى الآن.
                </div>
            )}

        </div>
    );
}

export default Features;

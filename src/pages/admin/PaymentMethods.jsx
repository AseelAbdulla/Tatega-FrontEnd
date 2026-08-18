import { useState } from "react";
import { Link } from "react-router-dom";

export default function PaymentMethods() {
    const [cards, setCards] = useState([
        {
            id: 1,
            type: "Visa",
            number: "•••• •••• •••• 4582",
            name: "أحمد محمد",
            expiry: "12/28",
            default: true,
        },
        {
            id: 2,
            type: "Mastercard",
            number: "•••• •••• •••• 7821",
            name: "أحمد محمد",
            expiry: "09/27",
            default: false,
        },
    ]);

    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        cardNumber: "",
        cardName: "",
        expiry: "",
        cvv: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddCard = (e) => {
        e.preventDefault();

        if (
            !formData.cardNumber ||
            !formData.cardName ||
            !formData.expiry ||
            !formData.cvv
        ) {
            alert("يرجى تعبئة جميع بيانات البطاقة");
            return;
        }

        const lastFour = formData.cardNumber.slice(-4);

        const newCard = {
            id: Date.now(),
            type: "Visa",
            number: `•••• •••• •••• ${lastFour}`,
            name: formData.cardName,
            expiry: formData.expiry,
            default: cards.length === 0,
        };

        setCards((prev) => [...prev, newCard]);

        setFormData({
            cardNumber: "",
            cardName: "",
            expiry: "",
            cvv: "",
        });

        setShowForm(false);
    };

    const handleDelete = (id) => {
        const confirmDelete = window.confirm(
            "هل أنت متأكد من حذف طريقة الدفع هذه؟"
        );

        if (!confirmDelete) return;

        setCards((prev) => {
            const updatedCards = prev.filter((card) => card.id !== id);

            if (
                updatedCards.length > 0 &&
                !updatedCards.some((card) => card.default)
            ) {
                updatedCards[0].default = true;
            }

            return updatedCards;
        });
    };

    const handleSetDefault = (id) => {
        setCards((prev) =>
            prev.map((card) => ({
                ...card,
                default: card.id === id,
            }))
        );
    };

    return (
        <div
            dir="rtl"
            className="min-h-screen bg-[#fbf9f8] px-4 py-8 md:px-10"
        >
            <div className="mx-auto max-w-5xl">

                {/* =========================
                    HEADER
                ========================== */}

                <div className="mb-8">

                    <Link
                        to="/admin/profile"
                        className="mb-5 inline-flex items-center gap-2 text-sm text-[#75796b] transition hover:text-[#3e5219]"
                    >
                        <span className="material-symbols-outlined">
                            arrow_forward
                        </span>

                        العودة إلى الملف الشخصي
                    </Link>

                    <h1 className="text-3xl font-bold text-[#3e5219] md:text-4xl">
                        طرق الدفع
                    </h1>

                    <p className="mt-2 text-[#45483c]">
                        إدارة البطاقات البنكية وطرق الدفع المحفوظة في حسابك.
                    </p>

                </div>


                {/* =========================
                    PAYMENT HEADER CARD
                ========================== */}

                <div className="mb-6 rounded-2xl border border-[#c5c8b8]/40 bg-white p-5 shadow-sm">

                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

                        <div className="flex items-center gap-4">

                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#3e5219]/10">

                                <span className="material-symbols-outlined text-3xl text-[#3e5219]">
                                    credit_card
                                </span>

                            </div>

                            <div>

                                <h2 className="text-xl font-semibold text-[#1b1c1c]">
                                    بطاقات الدفع
                                </h2>

                                <p className="mt-1 text-sm text-[#75796b]">
                                    يمكنك إضافة وإدارة بطاقاتك البنكية
                                </p>

                            </div>

                        </div>


                        <button
                            type="button"
                            onClick={() => setShowForm(!showForm)}
                            className="flex items-center justify-center gap-2 rounded-full bg-[#a04100] px-6 py-3 font-semibold text-white transition hover:opacity-90"
                        >

                            <span className="material-symbols-outlined">
                                add
                            </span>

                            إضافة بطاقة
                        </button>

                    </div>

                </div>


                {/* =========================
                    ADD CARD FORM
                ========================== */}

                {showForm && (
                    <div className="mb-6 rounded-2xl border border-[#c5c8b8]/40 bg-white p-6 shadow-sm">

                        <div className="mb-6 flex items-center justify-between">

                            <div>

                                <h2 className="text-xl font-semibold text-[#3e5219]">
                                    إضافة بطاقة جديدة
                                </h2>

                                <p className="mt-1 text-sm text-[#75796b]">
                                    أدخل بيانات البطاقة لإضافتها إلى حسابك
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="text-[#75796b] transition hover:text-[#ba1a1a]"
                            >
                                <span className="material-symbols-outlined">
                                    close
                                </span>
                            </button>

                        </div>


                        <form
                            onSubmit={handleAddCard}
                            className="grid grid-cols-1 gap-5 md:grid-cols-2"
                        >

                            {/* Card Number */}

                            <div className="md:col-span-2">

                                <label className="mb-2 block text-sm font-semibold text-[#3e5219]">
                                    رقم البطاقة
                                </label>

                                <div className="relative">

                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#75796b]">
                                        credit_card
                                    </span>

                                    <input
                                        type="text"
                                        name="cardNumber"
                                        value={formData.cardNumber}
                                        onChange={handleChange}
                                        maxLength="19"
                                        placeholder="0000 0000 0000 0000"
                                        className="w-full rounded-xl border border-[#c5c8b8]/50 bg-[#f6f3f2] py-3 pr-12 pl-4 outline-none transition focus:border-[#3e5219] focus:ring-2 focus:ring-[#3e5219]/20"
                                    />

                                </div>

                            </div>


                            {/* Card Name */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-[#3e5219]">
                                    اسم حامل البطاقة
                                </label>

                                <input
                                    type="text"
                                    name="cardName"
                                    value={formData.cardName}
                                    onChange={handleChange}
                                    placeholder="أحمد محمد"
                                    className="w-full rounded-xl border border-[#c5c8b8]/50 bg-[#f6f3f2] px-4 py-3 outline-none transition focus:border-[#3e5219] focus:ring-2 focus:ring-[#3e5219]/20"
                                />

                            </div>


                            {/* Expiry */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-[#3e5219]">
                                    تاريخ الانتهاء
                                </label>

                                <input
                                    type="text"
                                    name="expiry"
                                    value={formData.expiry}
                                    onChange={handleChange}
                                    maxLength="5"
                                    placeholder="MM/YY"
                                    dir="ltr"
                                    className="w-full rounded-xl border border-[#c5c8b8]/50 bg-[#f6f3f2] px-4 py-3 text-right outline-none transition focus:border-[#3e5219] focus:ring-2 focus:ring-[#3e5219]/20"
                                />

                            </div>


                            {/* CVV */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-[#3e5219]">
                                    رمز الأمان CVV
                                </label>

                                <input
                                    type="password"
                                    name="cvv"
                                    value={formData.cvv}
                                    onChange={handleChange}
                                    maxLength="4"
                                    placeholder="123"
                                    dir="ltr"
                                    className="w-full rounded-xl border border-[#c5c8b8]/50 bg-[#f6f3f2] px-4 py-3 text-right outline-none transition focus:border-[#3e5219] focus:ring-2 focus:ring-[#3e5219]/20"
                                />

                            </div>


                            {/* Buttons */}

                            <div className="flex flex-col gap-3 md:col-span-2 md:flex-row">

                                <button
                                    type="submit"
                                    className="rounded-full bg-[#3e5219] px-8 py-3 font-semibold text-white transition hover:opacity-90"
                                >
                                    حفظ البطاقة
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="rounded-full border border-[#c5c8b8] px-8 py-3 font-semibold text-[#45483c] transition hover:bg-[#f0eded]"
                                >
                                    إلغاء
                                </button>

                            </div>

                        </form>

                    </div>
                )}


                {/* =========================
                    SAVED CARDS
                ========================== */}

                <div className="space-y-5">

                    {cards.length === 0 ? (

                        <div className="rounded-2xl border border-dashed border-[#c5c8b8] bg-white p-12 text-center">

                            <span className="material-symbols-outlined mb-3 text-5xl text-[#75796b]">
                                credit_card_off
                            </span>

                            <h3 className="text-lg font-semibold text-[#1b1c1c]">
                                لا توجد بطاقات محفوظة
                            </h3>

                            <p className="mt-2 text-sm text-[#75796b]">
                                قم بإضافة بطاقة دفع للبدء.
                            </p>

                        </div>

                    ) : (

                        cards.map((card) => (

                            <div
                                key={card.id}
                                className="overflow-hidden rounded-2xl border border-[#c5c8b8]/40 bg-white shadow-sm"
                            >

                                <div className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">

                                    {/* Card Info */}

                                    <div className="flex items-center gap-4">

                                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#f0eded]">

                                            <span className="material-symbols-outlined text-3xl text-[#3e5219]">
                                                credit_card
                                            </span>

                                        </div>

                                        <div>

                                            <div className="flex flex-wrap items-center gap-3">

                                                <h3 className="font-semibold text-[#1b1c1c]">
                                                    {card.type}
                                                </h3>

                                                {card.default && (
                                                    <span className="rounded-full bg-[#d2eca2] px-3 py-1 text-xs font-semibold text-[#394d14]">
                                                        البطاقة الافتراضية
                                                    </span>
                                                )}

                                            </div>

                                            <p
                                                dir="ltr"
                                                className="mt-2 text-lg tracking-wider text-[#45483c]"
                                            >
                                                {card.number}
                                            </p>

                                            <div className="mt-2 flex flex-wrap gap-4 text-sm text-[#75796b]">

                                                <span>
                                                    {card.name}
                                                </span>

                                                <span>
                                                    تنتهي {card.expiry}
                                                </span>

                                            </div>

                                        </div>

                                    </div>


                                    {/* Actions */}

                                    <div className="flex flex-wrap items-center gap-3">

                                        {!card.default && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleSetDefault(card.id)
                                                }
                                                className="rounded-full border border-[#3e5219] px-4 py-2 text-sm font-semibold text-[#3e5219] transition hover:bg-[#3e5219] hover:text-white"
                                            >
                                                جعلها افتراضية
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(card.id)
                                            }
                                            className="flex items-center gap-1 rounded-full border border-[#ba1a1a]/30 px-4 py-2 text-sm font-semibold text-[#ba1a1a] transition hover:bg-[#ba1a1a] hover:text-white"
                                        >

                                            <span className="material-symbols-outlined text-[18px]">
                                                delete
                                            </span>

                                            حذف
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))

                    )}

                </div>


                {/* =========================
                    SECURITY NOTICE
                ========================== */}

                <div className="mt-8 flex items-start gap-4 rounded-2xl border border-[#c5c8b8]/30 bg-[#f6f3f2] p-5">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#3e5219]/10">

                        <span className="material-symbols-outlined text-[#3e5219]">
                            lock
                        </span>

                    </div>

                    <div>

                        <h3 className="font-semibold text-[#1b1c1c]">
                            معلومات الدفع بأمان
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-[#75796b]">
                            يتم حفظ معلومات الدفع بشكل آمن. عند ربط الصفحة
                            بالـ Laravel API لاحقًا سيتم التعامل مع بيانات
                            الدفع وفق آليات الحماية المناسبة.
                        </p>

                    </div>

                </div>

            </div>
        </div>
    );
}
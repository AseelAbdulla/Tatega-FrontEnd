const API_URL = "http://127.0.0.1:8000/api/categories";

const getToken = () => {
    return localStorage.getItem("token");
};

const getHeaders = () => {
    const token = getToken();

    return {
        Accept: "application/json",

        ...(token && {
            Authorization: `Bearer ${token}`,
        }),
    };
};

const parseResponse = async (response) => {
    const text = await response.text();

    console.log("Category API Response:", text);

    if (!text) {
        return {};
    }

    try {
        return JSON.parse(text);
    } catch (error) {
        console.error("Invalid JSON:", text);

        throw new Error(
            "الخادم رجع استجابة غير صحيحة: " +
                text.substring(0, 200)
        );
    }
};

/* =====================================================
   GET
===================================================== */

export async function getCategories() {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: getHeaders(),
    });

    const result = await parseResponse(response);

    if (!response.ok) {
        throw new Error(
            result.message ||
                "فشل في جلب التصنيفات"
        );
    }

    return result;
}

/* =====================================================
   CREATE
===================================================== */

export async function createCategory(formData) {
    const response = await fetch(API_URL, {
        method: "POST",

        headers: {
            Accept: "application/json",

            ...(getToken() && {
                Authorization: `Bearer ${getToken()}`,
            }),
        },

        body: formData,
    });

    const result = await parseResponse(response);

    if (!response.ok) {
        if (result.errors) {
            const firstError =
                Object.values(result.errors)[0];

            if (Array.isArray(firstError)) {
                throw new Error(firstError[0]);
            }

            throw new Error(firstError);
        }

        throw new Error(
            result.message ||
                "فشل في إضافة التصنيف"
        );
    }

    return result;
}

/* =====================================================
   UPDATE
===================================================== */

export async function updateCategory(
    id,
    formData
) {
    formData.append("_method", "PUT");

    const response = await fetch(
        `${API_URL}/${id}`,
        {
            method: "POST",

            headers: {
                Accept: "application/json",

                ...(getToken() && {
                    Authorization: `Bearer ${getToken()}`,
                }),
            },

            body: formData,
        }
    );

    const result = await parseResponse(response);

    if (!response.ok) {
        if (result.errors) {
            const firstError =
                Object.values(result.errors)[0];

            if (Array.isArray(firstError)) {
                throw new Error(firstError[0]);
            }

            throw new Error(firstError);
        }

        throw new Error(
            result.message ||
                "فشل في تعديل التصنيف"
        );
    }

    return result;
}

/* =====================================================
   DELETE
===================================================== */

export async function deleteCategory(id) {
    const response = await fetch(
        `${API_URL}/${id}`,
        {
            method: "DELETE",
            headers: getHeaders(),
        }
    );

    const result = await parseResponse(response);

    if (!response.ok) {
        if (result.errors) {
            const firstError =
                Object.values(result.errors)[0];

            if (Array.isArray(firstError)) {
                throw new Error(firstError[0]);
            }

            throw new Error(firstError);
        }

        throw new Error(
            result.message ||
                "فشل في حذف التصنيف"
        );
    }

    return result;
}
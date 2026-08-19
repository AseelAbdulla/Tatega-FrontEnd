import { useNavigate } from "react-router-dom";
import ProductForm from "./ProductForm";

export default function AddProduct() {
    const navigate = useNavigate();

    return (
        <ProductForm
            mode="add"
            onSaved={async () => {
                navigate("/admin/products");
            }}
        />
    );
}
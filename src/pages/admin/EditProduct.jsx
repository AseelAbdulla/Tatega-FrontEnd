import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "./ProductForm";

export default function EditProduct() {
    const navigate = useNavigate();
    const { id } = useParams();

    return (
        <ProductForm
            mode="edit"
            productId={id}
            onSaved={async () => {
                navigate("/admin/products");
            }}
        />
    );
}
import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg';

const API_BASE_URL=import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const AddProduct = () => {
    const [images, setImages] = useState([null, null, null, null]);
    const [loading,setLoading] = useState(false);
    const [productDetails, setProductDetails] = useState({
        name: "",
        images: [],
        new_price: "",
        old_price: "",
        description: "",
    });

    const imageHandler = (e, index) => {
        const newImages = [...images];
        newImages[index] = e.target.files[0];
        setImages(newImages);
        
        const newImageUrls = [...productDetails.images];
        newImageUrls[index] = URL.createObjectURL(e.target.files[0]);
        setProductDetails({...productDetails, images: newImageUrls});
    }

    const changeHandler = (e)=>{
        setProductDetails({...productDetails,[e.target.name]:e.target.value});
    }

    const Add_Product = async () => {
        setLoading(true);
        console.log("Submitting Product:", productDetails);
    
        let formData = new FormData();
        images.forEach((image) => {
            if (image) {
                formData.append('product', image);
            }
        });
    
        try {
            // 🔹 Upload Images First
            const uploadResponse = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                body: formData,
            });
    
            if (!uploadResponse.ok) {
                throw new Error(`Upload failed with status: ${uploadResponse.status}`);
            }
    
            const responseData = await uploadResponse.json();
            console.log("Upload Response:", responseData);
    
            if (!responseData.success || !responseData.images) {
                alert('Image upload failed.');
                setLoading(false);
                return;
            }
    
            // 🔹 Extract correct image URLs from the backend response
            const imageUrls = responseData.images; // Assuming responseData.images is already an array of URLs
    
            // 🔹 Update productDetails with actual image URLs
            const updatedProduct = {
                ...productDetails,
                images: imageUrls, // Use actual image URLs
            };
            setProductDetails(updatedProduct);
    
            // 🔹 Send Product Data to Backend
            const addProductResponse = await fetch(`${API_BASE_URL}/addproduct`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProduct),
            });
    
            if (!addProductResponse.ok) {
                throw new Error(`Add product failed with status: ${addProductResponse.status}`);
            }
    
            const data = await addProductResponse.json();
            console.log("Add Product Response:", data);
    
            if (data.success) {
                alert("Product Added Successfully!");
                setProductDetails({
                    name: "",
                    images: [],
                    new_price: "",
                    old_price: "",
                    description: "",
                });
                setImages([null, null, null, null]);
            } else {
                alert("Failed to add product.");
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }finally{
            setLoading(false);
        }
    };
    
    

    return (
        <div className='add-product'>
            <div className="addproduct-itemfield">
                <p>Product title</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Type here'/>
                </div>
                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Type here'/>
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Description</p>
                <input value={productDetails.description} onChange={changeHandler} type="text" name='description' placeholder='Type product description'/>
            </div>
            <div className="addproduct-images-container">
                {[0, 1, 2, 3].map((index) => (
                    <div className="addproduct-image-field" key={index}>
                        <label htmlFor={`file-input-${index}`}>
                            <img 
                                src={images[index] ? URL.createObjectURL(images[index]) : upload_area} 
                                className='addproduct-thumnail-img' 
                                alt="" 
                            />
                        </label>
                        <input 
                            onChange={(e) => imageHandler(e, index)} 
                            type="file" 
                            name={`image_${index}`} 
                            id={`file-input-${index}`} 
                            hidden
                        />
                    </div>
                ))}
            </div>

            <button onClick={()=>{Add_Product()}} className='addproduct-btn' disabled={!productDetails.name || !productDetails.old_price || !productDetails.new_price || !productDetails.description || loading}>
            {loading ? <span className="loader"></span> : "ADD"}
            </button>
        </div>
    )
}

export default AddProduct

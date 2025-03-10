import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BASE_URL = "http://localhost:8000/storage/";

function CardProduct({ product }) {
    const [selectedVariation, setSelectedVariation] = useState(null);
    const [attributes, setAttributes] = useState([]);

    useEffect(() => {
        if (product && product.variations && product.variations.length > 0) {
            // Set default variation (either the one marked as default or the first one)
            const defaultVariation = product.variations.find(v => v.is_default) || product.variations[0];
            setSelectedVariation(defaultVariation);

            // Extract unique attribute types from all variations
            extractAttributes();
        }
    }, [product]);

    const extractAttributes = () => {
        if (!product || !product.variations) return;

        // Create a map to store unique attributes by type
        const attributeMap = new Map();

        // Go through all variations and collect unique attribute values
        product.variations.forEach(variation => {
            if (variation.attributes) {
                variation.attributes.forEach(attr => {
                    if (attr.attribute_value && attr.attribute_value.attribute_type) {
                        const typeId = attr.attribute_value.attribute_type.id;
                        const typeName = attr.attribute_value.attribute_type.display_name;

                        if (!attributeMap.has(typeId)) {
                            attributeMap.set(typeId, {
                                typeId,
                                typeName,
                                values: []
                            });
                        }

                        // Add the attribute value if it doesn't exist
                        const currentAttr = attributeMap.get(typeId);
                        const valueExists = currentAttr.values.some(v =>
                            v.id === attr.attribute_value.id
                        );

                        if (!valueExists) {
                            currentAttr.values.push({
                                id: attr.attribute_value.id,
                                value: attr.attribute_value.display_value,
                                variations: [variation.id]
                            });
                        } else {
                            // Add this variation to the existing value
                            const existingValue = currentAttr.values.find(v =>
                                v.id === attr.attribute_value.id
                            );
                            if (!existingValue.variations.includes(variation.id)) {
                                existingValue.variations.push(variation.id);
                            }
                        }
                    }
                });
            }
        });

        // Convert map to array
        setAttributes(Array.from(attributeMap.values()));
    };

    const handleAttributeSelect = (attrTypeId, valueId) => {
        // Find all variations that have this attribute value
        const validVariations = product.variations.filter(variation =>
            variation.attributes && variation.attributes.some(attr =>
                attr.attribute_value && attr.attribute_value.id === valueId
            )
        );

        if (validVariations.length > 0) {
            setSelectedVariation(validVariations[0]);
        }
    };

    // Return empty div if no product or variations
    if (!product || !product.variations || product.variations.length === 0) {
        return <div className="hidden"></div>;
    }

    // Get the price to display
    const price = selectedVariation ? selectedVariation.price : product.base_price;
    const discountPrice = selectedVariation ? selectedVariation.discount_price : null;

    // Format price in Vietnamese currency
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(price).replace('₫', '').trim() + ' ₫';
    };

    return (
        <div className="shadow-xl hover:shadow-product transition-shadow duration-300 group rounded-xl">
            <Link to={`/products/${product.id}`}>
                <div className="relative overflow-hidden rounded-t-xl">
                    {/* Product image */}
                    <img
                        className="w-full h-56 object-cover rounded-t-xl transition-transform group-hover:scale-105"
                        src={
                            selectedVariation && selectedVariation.images && selectedVariation.images.length > 0
                                ? `${BASE_URL}${selectedVariation.images[0].image_path}`
                                : product.images && product.images.length > 0
                                    ? `${BASE_URL}${product.images[0].image_path}`
                                    : 'https://via.placeholder.com/300x300?text=No+Image'
                        }
                        alt={product.name}
                    />

                    {/* Discount badge */}
                    {discountPrice && (
                        <div className="absolute top-2 right-2 bg-[#ff6683] text-white text-xs font-bold px-2 py-1 rounded-md">
                            -{Math.round((1 - discountPrice / price) * 100)}%
                        </div>
                    )}
                </div>
            </Link>

            <div className="p-3">
                {/* Product name */}
                <Link to={`/product/${product.slug}`}>
                    <div className="text-center text-base font-medium group-hover:text-[#02c4c1] line-clamp-1 mb-2">
                        {product.name}
                    </div>
                </Link>

                {/* Product price */}
                <div className="text-center font-bold text-sm">
                    {discountPrice ? (
                        <div className="flex justify-center items-center gap-2">
                            <span className="text-[#ff6683]">{formatPrice(discountPrice)}</span>
                            <span className="text-gray-400 line-through text-xs">{formatPrice(price)}</span>
                        </div>
                    ) : (
                        <span className="text-[#ff6683]">{formatPrice(price)}</span>
                    )}
                </div>

                {/* Attributes selection */}
                {attributes.map((attributeType) => (
                    <div key={attributeType.typeId} className="mt-2">
                        <div className="flex flex-wrap justify-center gap-2">
                            {attributeType.values.map((attrValue) => {
                                // Check if the current attribute value is in the selected variation
                                const isSelected = selectedVariation && selectedVariation.attributes &&
                                    selectedVariation.attributes.some(attr =>
                                        attr.attribute_value && attr.attribute_value.id === attrValue.id
                                    );

                                return (
                                    <div key={attrValue.id} className="flex justify-center">
                                        <span
                                            onClick={() => handleAttributeSelect(attributeType.typeId, attrValue.id)}
                                            className={`
                                                border text-xs px-2 py-1 rounded-md cursor-pointer transition-all
                                                ${isSelected
                                                    ? 'bg-[#ff6683] text-white border-[#ff6683]'
                                                    : 'border-[#ff6683] hover:text-white hover:bg-[#ff6683]'}
                                            `}
                                        >
                                            {attrValue.value}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CardProduct;
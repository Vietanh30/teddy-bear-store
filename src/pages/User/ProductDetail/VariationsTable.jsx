
// VariationsTable.jsx
import React from 'react';

const VariationsTable = ({ attributeOptions, variationTableData, formatPrice }) => {
    return (
        <div className="border-2 border-[#02c4c1] p-3 w-full md:w-2/3 mt-2 overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr>
                        {Object.keys(attributeOptions).map(attrType => (
                            <th key={attrType} className="text-left p-1 font-medium">{attrType}</th>
                        ))}
                        <th className="text-left p-1 font-medium">Giá bán</th>
                        <th className="text-left p-1 font-medium">Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {variationTableData.map((item, index) => (
                        <tr key={index} className="border-t">
                            {Object.keys(attributeOptions).map(attrType => (
                                <td key={attrType} className="p-1 text-sm font-medium text-[#02c4c1]">
                                    {item.attributes[attrType] || 'N/A'}
                                </td>
                            ))}
                            <td className="p-1 text-sm font-medium text-[#02c4c1]">
                                {item.discount_price > 0
                                    ? formatPrice(item.discount_price)
                                    : formatPrice(item.price)}
                            </td>
                            <td className="p-1 text-sm font-medium text-[#02c4c1]">
                                {item.stock > 0
                                    ? `Còn ${item.stock} sản phẩm`
                                    : 'Hết hàng'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VariationsTable;

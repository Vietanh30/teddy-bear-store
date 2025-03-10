
// AttributeSelector.jsx
import React from 'react';

const AttributeSelector = ({ attributeOptions, selectedAttributes, onAttributeSelect }) => {
    return (
        <>
            {Object.keys(attributeOptions).map(attrType => (
                <div key={attrType} className="mb-3">
                    <div className="font-medium mb-1">{attrType}:</div>
                    <div className="flex flex-wrap gap-2">
                        {attributeOptions[attrType].map((value, index) => (
                            <button
                                key={index}
                                onClick={() => onAttributeSelect(attrType, value)}
                                className={`text-sm p-1 px-2 font-medium ${selectedAttributes[attrType] === value
                                    ? 'bg-[#F15E9A] text-white'
                                    : 'border'
                                    }`}
                            >
                                {value}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </>
    );
};

export default AttributeSelector;
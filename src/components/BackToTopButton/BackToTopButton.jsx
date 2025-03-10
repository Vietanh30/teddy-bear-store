import React, { useState, useEffect } from 'react';

function BackToTopButton() {
    const [visible, setVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <button
            onClick={scrollToTop}
            style={{
                display: visible ? 'flex' : 'none',
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                backgroundColor: '#ff6683',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                cursor: 'pointer',
            }}
        >
            ↑
        </button>
    );
}

export default BackToTopButton;
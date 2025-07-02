'use client';

import { useState, useRef, useEffect } from 'react';

interface OTPInputProps {
    length: number;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    error?: boolean;
}

export default function OTPInput({ length, value, onChange, disabled = false, error = false }: OTPInputProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Initialize refs array
        inputRefs.current = inputRefs.current.slice(0, length);
    }, [length]);

    const handleChange = (index: number, digit: string) => {
        if (digit.length > 1) return; // Only allow single digit

        const newValue = value.split('');
        newValue[index] = digit;
        const newOTP = newValue.join('');
        onChange(newOTP);

        // Move to next input if digit is entered
        if (digit && index < length - 1) {
            setActiveIndex(index + 1);
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (value[index]) {
                // Clear current digit
                const newValue = value.split('');
                newValue[index] = '';
                onChange(newValue.join(''));
            } else if (index > 0) {
                // Move to previous input and clear it
                setActiveIndex(index - 1);
                inputRefs.current[index - 1]?.focus();
                const newValue = value.split('');
                newValue[index - 1] = '';
                onChange(newValue.join(''));
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            setActiveIndex(index - 1);
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < length - 1) {
            setActiveIndex(index + 1);
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleFocus = (index: number) => {
        setActiveIndex(index);
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, length);
        if (pastedData.length === length) {
            onChange(pastedData);
            setActiveIndex(length - 1);
            inputRefs.current[length - 1]?.focus();
        }
    };

    return (
        <div className="flex justify-center space-x-2 sm:space-x-3">
            {Array.from({ length }, (_, index) => (
                <input
                    key={index}
                    ref={(el) => {
                        inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={value[index] || ''}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onFocus={() => handleFocus(index)}
                    onPaste={handlePaste}
                    disabled={disabled}
                    className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        error
                            ? 'border-red-300 bg-red-50 text-red-900'
                            : activeIndex === index
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 bg-white hover:border-gray-400'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}`}
                />
            ))}
        </div>
    );
} 
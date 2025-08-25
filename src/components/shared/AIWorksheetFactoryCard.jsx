// src/components/shared/AIWorksheetFactoryCard.jsx (Center Watermark Version)
import React from 'react';
import Icon from '../../icons/Icon';
import { colorThemes } from '../../constants/theme';

const AIWorksheetFactoryCard = ({ onClick }) => {
    const theme = colorThemes.purple;

    return (
        <div 
            onClick={onClick} 
            className={`relative flex flex-col backdrop-blur-lg rounded-2xl p-6 transform hover:-translate-y-2 transition-all duration-300 cursor-pointer shadow-lg overflow-hidden ${theme.bg} ${theme.border} ${theme.glow}`}
        >
            {/* Centered Background Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
                <Icon name="FileText" className={`w-32 h-32 ${theme.text} opacity-10`} />
            </div>

            <div className="flex-grow z-10">
                <div className="flex justify-between items-start">
                    <div className="flex-grow">
                        <h3 className="text-xl font-bold text-white truncate">สร้างใบงาน/ข้อสอบ (AI)</h3>
                        <p className="text-sm text-gray-400">เปลี่ยนไอเดียเป็นเอกสารพร้อมพิมพ์</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                        <Icon name="FileText" className={theme.text} size={24} />
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-center text-sm text-purple-200 bg-purple-500/20 py-2 px-4 rounded-lg z-10">
                <Icon name="Sparkles" size={16} className="mr-2"/>
                <span>ขับเคลื่อนด้วย AI</span>
            </div>
        </div>
    );
};

export default AIWorksheetFactoryCard;
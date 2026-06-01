import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NiceAvatar, { genConfig } from 'react-nice-avatar';
import type { AvatarFullConfig } from 'react-nice-avatar';

import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AVATAR_OPTIONS = {
    faceColor: ['#f9c9b6', '#ac6651', '#f5d0c5', '#e9b4a4', '#d08b5b', '#ae5d29', '#614335'],
    hairColor: ['#000000', '#2c1b0f', '#52261b', '#6b4f3a', '#8b5e3c', '#d2b48c', '#fff5b5'],
    shirtColor: ['#9287FF', '#6BD9E9', '#FC909F', '#F4D150', '#77311D'],
    bgColor: ['#ffad4d', '#7ed957', '#9d68ff', '#ff6e83', '#4dd6ff', '#2087b3'],
    earSize: ['small', 'big'],
    hairStyle: ['normal', 'thick', 'mohawk', 'womanLong', 'womanShort'],
    eyeStyle: ['circle', 'oval', 'smile'],
    glassesStyle: ['round', 'square', 'none'],
    noseStyle: ['short', 'long', 'round'],
    mouthStyle: ['laugh', 'smile', 'peace'],
    shirtStyle: ['hoody', 'short', 'polo'],
    eyeBrowStyle: ['up', 'upWoman'],
};

const getOptionLabel = (val: string): string => {
    switch (val) {
        case 'womanLong': return 'Woman Long';
        case 'womanShort': return 'Woman Short';
        case 'upWoman': return 'Up Woman';
        case 'mohawk': return 'Mohawk';
        case 'normal': return 'Normal';
        case 'thick': return 'Thick';
        case 'circle': return 'Circle';
        case 'oval': return 'Oval';
        case 'smile': return 'Smile';
        case 'round': return 'Round';
        case 'square': return 'Square';
        case 'none': return 'None';
        case 'short': return 'Short';
        case 'long': return 'Long';
        case 'laugh': return 'Laugh';
        case 'peace': return 'Peace';
        case 'hoody': return 'Hoody';
        case 'polo': return 'Polo';
        case 'up': return 'Up';
        case 'small': return 'Small';
        case 'big': return 'Big';
        default:
            return val.charAt(0).toUpperCase() + val.slice(1).replace(/([A-Z])/g, ' $1');
    }
};

export default function Avatar() {
    const { user, updateAvatar } = useAuth();
    const navigate = useNavigate();

    const [config, setConfig] = useState<AvatarFullConfig>(() => {
        if (user?.avatar) {
            try {
                return JSON.parse(user.avatar);
            } catch (e) {
                return genConfig();
            }
        }
        return genConfig();
    });

    const [activeTab, setActiveTab] = useState('Head');

    const handleRandom = () => {
        setConfig(genConfig());
    };

    const handleSave = async () => {
        try {
            await updateAvatar(JSON.stringify(config));
            toast.success('Avatar saved successfully!');
            navigate('/profile');
        } catch (error) {
            toast.error('Failed to save avatar');
        }
    };

    const updateConfig = (key: keyof AvatarFullConfig, value: any) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const tabs = [
        { id: 'Head', icon: '/head-white.svg', title: 'Head' },
        { id: 'Eyes', icon: '/eye-white.svg', title: 'Eyes' },
        { id: 'Mouth', icon: '/mouth-white.svg', title: 'Mouth' },
        { id: 'Hair', icon: '/hair-white.svg', title: 'Hair' },
        { id: 'Body', icon: '/shirt-white.svg', title: 'Body' },
        { id: 'Background', icon: '/frame-white.svg', title: 'Background' }
    ];

    const renderOptions = (key: keyof AvatarFullConfig, options: any[], type: 'color' | 'select' = 'select') => {
        return (
            <div className="flex flex-wrap gap-3 mb-6">
                {options.map((opt, i) => {
                    const isSelected = config[key] === opt;
                    if (type === 'color') {
                        return (
                            <div
                                key={i}
                                onClick={() => updateConfig(key, opt)}
                                className={`w-10 h-10 rounded-xl cursor-pointer border-2 transition-all relative ${isSelected
                                    ? 'border-white scale-110 shadow-lg shadow-white/20 ring-2'
                                    : 'border-transparent hover:scale-105 hover:border-white/50'
                                    }`}
                                style={{ backgroundColor: opt }}
                            />
                        );
                    }
                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => updateConfig(key, opt)}
                            className={`relative flex items-center justify-center px-5 py-2.5 rounded-xl border-2 transition-all text-sm font-semibold cursor-pointer border-b-5 hover:border-b-2 hover:translate-y-[3px] ${isSelected
                                ? 'border-blue-light'
                                : 'border-grey-light'
                                }`}
                        >
                            {getOptionLabel(opt)}
                        </button>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="flex-1 p-8 w-full max-w-[700px]">
            <div className="flex items-center pb-4 justify-between">
                <button onClick={() => navigate(-1)} className="flex items-center cursor-pointer">
                    <img src="/left-white.svg" className="mr-2" /> <span className="text-lg">Edit Avatar</span>
                </button>
                <div className="flex gap-4">
                    <button onClick={handleRandom} className="inline-flex items-center justify-center px-10 py-2.5 bg-grey text-blue-light font-semibold rounded-xl transition-all border-2 border-grey-light shadow-[0_5px_0_0_#494D50] hover:shadow-[0_0px_0_0_#494D50] hover:translate-y-[3px]">
                        RANDOM
                    </button>
                    <button onClick={handleSave} className="inline-flex items-center justify-center px-10 py-2.5 bg-blue text-white font-semibold rounded-xl transition-all shadow-[0_5px_0_0_#264D73] hover:shadow-[0_0px_0_0_#264D73] hover:translate-y-[3px]">
                        SAVE
                    </button>
                </div>
            </div>

            <div>
                <div className="bg-grey rounded-2xl overflow-hidden border-3 border-grey-light">
                    <div className="w-full h-80 flex items-center justify-center" style={{ backgroundColor: config.bgColor || '#2087B3' }}>
                        <div className="w-64 h-64 shadow-2xl rounded-full bg-white/10 backdrop-blur-sm p-4">
                            <NiceAvatar className="w-full h-full" hairColorRandom {...config} />
                        </div>
                    </div>

                    <div className="bg-darker p-4 border-b border-grey">
                        <div className="flex gap-6 px-2 hide-scrollbar">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center justify-center p-3 rounded-xl ${activeTab === tab.id ? 'bg-grey-light text-white scale-105' : 'text-grey-light hover:bg-dark hover:text-white'}`}
                                    title={tab.title}
                                >
                                    <img src={tab.icon} alt={tab.title} className={`w-6 h-6 object-contain transition-opacity`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 bg-dark">
                        {activeTab === 'Head' && (
                            <div className="animate-fade-in">
                                <h3 className="text-lg font-semibold mb-3 tracking-wider">Skin color</h3>
                                {renderOptions('faceColor', AVATAR_OPTIONS.faceColor, 'color')}
                                <h3 className="text-lg font-semibold mb-3 tracking-wider mt-6">Ear size</h3>
                                {renderOptions('earSize', AVATAR_OPTIONS.earSize)}
                            </div>
                        )}

                        {activeTab === 'Eyes' && (
                            <div className="animate-fade-in">
                                <h3 className="text-lg font-semibold mb-3 tracking-wider">Eye style</h3>
                                {renderOptions('eyeStyle', AVATAR_OPTIONS.eyeStyle)}
                                <h3 className="text-lg font-semibold mb-3 tracking-wider mt-6">Glasses</h3>
                                {renderOptions('glassesStyle', AVATAR_OPTIONS.glassesStyle)}
                                <h3 className="text-lg font-semibold mb-3 tracking-wider mt-6">Eyebrows</h3>
                                {renderOptions('eyeBrowStyle', AVATAR_OPTIONS.eyeBrowStyle)}
                            </div>
                        )}

                        {activeTab === 'Mouth' && (
                            <div className="animate-fade-in">
                                <h3 className="text-lg font-semibold mb-3 tracking-wider">Mouth style</h3>
                                {renderOptions('mouthStyle', AVATAR_OPTIONS.mouthStyle)}
                                <h3 className="text-lg font-semibold mb-3 tracking-wider mt-6">Nose style</h3>
                                {renderOptions('noseStyle', AVATAR_OPTIONS.noseStyle)}
                            </div>
                        )}

                        {activeTab === 'Hair' && (
                            <div className="animate-fade-in">
                                <h3 className="text-lg font-semibold mb-3 tracking-wider">Hair color</h3>
                                {renderOptions('hairColor', AVATAR_OPTIONS.hairColor, 'color')}
                                <h3 className="text-lg font-semibold mb-3 tracking-wider mt-6">Hair style</h3>
                                {renderOptions('hairStyle', AVATAR_OPTIONS.hairStyle)}
                            </div>
                        )}

                        {activeTab === 'Body' && (
                            <div className="animate-fade-in">
                                <h3 className="text-lg font-semibold mb-3 tracking-wider">Shirt color</h3>
                                {renderOptions('shirtColor', AVATAR_OPTIONS.shirtColor, 'color')}
                                <h3 className="text-lg font-semibold mb-3 tracking-wider mt-6">Shirt style</h3>
                                {renderOptions('shirtStyle', AVATAR_OPTIONS.shirtStyle)}
                            </div>
                        )}

                        {activeTab === 'Background' && (
                            <div className="animate-fade-in">
                                <h3 className="text-lg font-semibold mb-3 tracking-wider">Background color</h3>
                                {renderOptions('bgColor', AVATAR_OPTIONS.bgColor, 'color')}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

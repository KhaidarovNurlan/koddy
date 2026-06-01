import NiceAvatar from 'react-nice-avatar';

interface UserAvatarProps {
    avatarConfig?: string | null;
    className?: string;
    alt?: string;
}

export default function UserAvatar({ avatarConfig, className = "w-10 h-10 rounded-full", alt = "User Avatar" }: UserAvatarProps) {
    if (!avatarConfig) {
        return <img src="/avatar_placeholder.png" alt={alt} className={`object-cover ${className}`} />;
    }

    try {
        const config = JSON.parse(avatarConfig);
        return <NiceAvatar className={className} hairColorRandom {...config} />;
    } catch (e) {
        return <img src="/avatar_placeholder.png" alt={alt} className={`object-cover ${className}`} />;
    }
}

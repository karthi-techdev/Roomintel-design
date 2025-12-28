import React from 'react';
import * as PiIcons from 'react-icons/pi';

interface Amenity {
    name?: string;
    title?: string;
    icon?: string;
}

interface RoomAmenitiesProps {
    roomAmenities: Amenity[];
}

const RoomAmenities: React.FC<RoomAmenitiesProps> = ({ roomAmenities }) => {
    if (!roomAmenities || roomAmenities.length === 0) {
        return <div className="text-gray-500 text-sm">No specific amenities listed for this room.</div>;
    }

    // Function to get icon component from string name
    const getIconComponent = (iconName?: string) => {
        if (!iconName) return <PiIcons.PiCheckCircle />;

        // Get the icon component from the imported icons
        const IconComponent = (PiIcons as any)[iconName];

        // If icon exists, render it, otherwise use default
        return IconComponent ? <IconComponent /> : <PiIcons.PiCheckCircle />;
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
            {roomAmenities.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3 text-gray-500 group">
                    <span className="text-[#EDA337] text-lg group-hover:text-[#c23535] transition-colors">
                        {getIconComponent(item.icon)}
                    </span>
                    <span className="text-xs md:text-sm font-medium group-hover:text-[#283862] transition-colors">
                        {item.name || item.title}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default RoomAmenities;

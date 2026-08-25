import { icons, LucideProps } from "lucide-react";

export type IconName = keyof typeof icons;

interface IconProps extends LucideProps {
    name: IconName;
}

export const Icon = ({ name, ...props }: IconProps) => {
    const LucideIconComponent = icons[name];

    if (!LucideIconComponent) {
        return null;
    }

    return <LucideIconComponent {...props} />;
};
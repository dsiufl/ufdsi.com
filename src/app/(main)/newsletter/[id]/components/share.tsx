'use client'
import { Stage, Layer, Rect, Text, Image as KImage } from "react-konva"
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
const inter = Inter({ subsets: ["latin"] });
export default function Share({url, title}: {url: string, title: string}) {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [dsiLogo, setDsiLogo] = useState<HTMLImageElement | null>(null);
    const [ratio, setRatio] = useState(1);
    const [logoRatio, setLogoRatio] = useState(1);
    useEffect(() => {
        const img = new window.Image();
        img.src = url;
        const ratio = img.naturalWidth / img.naturalHeight;
        setRatio(ratio);
        setImage(img);
        const logo = new window.Image();
        logo.src = "/images/logo/hd-transparent-dsi-logo.png";
        setDsiLogo(logo);
        setLogoRatio(logo.naturalWidth / logo.naturalHeight);
    }, [url]);

    return (
        <Stage width={400} height={600} className="mt-10">
            <Layer>
                <KImage
                    image={image}
                    x={200 - 600 * ratio / 2}
                    y={0}
                    width={600 * ratio}
                    height={600}
                />
                <Rect x={0} y={500} width={400} height={100} fill="#fff"/>
            </Layer>
            <Layer>
                <KImage
                    image={dsiLogo}
                    x={200 - (75 * logoRatio / 2)}
                    y={20}
                    width={75 * logoRatio}
                    height={75}
                />
                <Text
                    text={title}
                    x={20}
                    y={550 - 24*4/6}
                    fontSize={24}
                    fontFamily={inter.style.fontFamily}
                    fill="#000"
                    align="center"
                    verticalAlign="middle"
                />
                
            </Layer>
            </Stage>
    )
}
import { Composition } from "remotion";
import { Main } from "./Main";
import "./style.css";

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="PromoVideo"
                component={Main}
                durationInFrames={735} // 24.5 seconds at 30 fps
                fps={30}
                width={1920}
                height={1080}
            />
        </>
    );
};

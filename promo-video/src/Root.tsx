import { Composition } from "remotion";
import { Main } from "./Main";
import "./style.css";

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="PromoVideo"
                component={Main}
                durationInFrames={600} // 20 seconds at 30 fps
                fps={30}
                width={1920}
                height={1080}
            />
        </>
    );
};

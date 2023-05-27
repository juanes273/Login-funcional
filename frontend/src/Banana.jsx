import { useGLTF } from "@react-three/drei";

export default function Banana(props) {
    const gltf = useGLTF(props.url);
    return <primitive object={gltf.scene} />;
}

import { useAnimations, useGLTF } from '@react-three/drei';
import React, { useEffect, useRef } from 'react'
import * as THREE from "three";

const CarMode: React.FC = () => {
    const ref = useRef<THREE.Group>(null)
    const { animations, scene } = useGLTF("/models/spaceship.glb")
    const { actions, names } = useAnimations(animations, ref);

    useEffect(() => {
        console.log(actions, names)
        if (actions && names.length > 0) {
            actions[names[0]]?.play()
        }
    }, [actions, names])
    return (
        <primitive ref={ref} object={scene} scale={0.5} />
    )
}

export default CarMode


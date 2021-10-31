import { ReactThreeFiber } from '@react-three/fiber';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { MeshLine, MeshLineMaterial } from 'meshline';


declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            unrealBloomPass: ReactThreeFiber.Object3DNode<
                UnrealBloomPass,
                typeof UnrealBloomPass
            >;
            meshLine: ReactThreeFiber.Object3DNode<MeshLine, typeof MeshLine>;
            meshLineMaterial: ReactThreeFiber.Object3DNode<MeshLineMaterial, typeof MeshLineMaterial>;
        }
    }
}

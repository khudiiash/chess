export type TResources = {
    textures: {
        [key: string]: {
            [key: string]: THREE.Texture
        }
    },
    models: {
        [key: string]: THREE.Mesh
    }
}
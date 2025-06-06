import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Camera } from "@babylonjs/core/Cameras/camera";
import { DebugLayerTab } from "@babylonjs/core/Debug/debugLayer";
import { AbstractEngine } from "@babylonjs/core/Engines/abstractEngine";
import { Engine } from "@babylonjs/core/Engines/engine";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
//import { KeyboardEventTypes } from "@babylonjs/core/Events/keyboardEvents";
import { Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { IDisposable, Scene } from "@babylonjs/core/scene";
import "@babylonjs/core/Engines/AbstractEngine/abstractEngine.views";

export default class Renderer implements IDisposable {
    private _engine: AbstractEngine;
    private _scene: Scene;
    private _renderCanvas: HTMLCanvasElement = document.createElement('canvas');
    private _renderContainer: HTMLDivElement;

    private _wireframeEnabled = false;

    public constructor(renderContainer: HTMLDivElement) {

        let engine = this.createEngine(this._renderCanvas);
        let scene = this.createScene(engine);
        this._createEngineView(engine, scene, renderContainer);

        const sphere = CreateSphere(
            "sphere",
            { diameter: 2, segments: 32 },
            scene
        );
        sphere.position.y = 1;

        const ground = CreateGround(
            "ground",
            { width: 6, height: 6 },
            scene
        );
        ground.receiveShadows = true;

        const light = new DirectionalLight(
            "light",
            new Vector3(0, -1, 1),
            scene
        );
        light.intensity = 0.5;
        light.position.y = 10;

        this.setupEngineViews(engine);

        engine.runRenderLoop(() => {
            scene.render();
        });

        window.addEventListener("resize", () => {
            engine.resize();
        });

        this._scene = scene;
        this._engine = engine;
        this._renderContainer = renderContainer;
    }

    dispose(): void {
        this._scene.dispose();
        this._engine.dispose();
    }

    protected createEngine(canvas: HTMLCanvasElement): Engine {
        const engine = new Engine(canvas, true, { stencil: true, preserveDrawingBuffer: true });
        engine.enableOfflineSupport = false;

        console.info(
            `${engine.getGlInfo().renderer}, ${engine.getGlInfo().version}\n${engine.getGlInfo().vendor}`
        );

        return engine;
    }

    protected createScene(engine: AbstractEngine): Scene {
        const scene = new Scene(engine, { useGeometryUniqueIdsMap: true, useMaterialMeshMap: true });
        scene.clearColor = new Color4(0.0, 0.5, 0.75, 1.0);

        return scene;
    }

    protected setupEngineViews(engine: AbstractEngine) {
        engine.onBeforeViewRenderObservable.add(() => {
            this._setWireframe(this._wireframeEnabled);
        })
    }

    private _createCanvas(parentElement: HTMLElement): HTMLCanvasElement {
        const viewCanvas = document.createElement('canvas');
        viewCanvas.style.width = "100%"
        viewCanvas.style.height = "100%";
        viewCanvas.style.display = "flex";
        viewCanvas.style.position = "relative";
        viewCanvas.tabIndex = 0;
        parentElement.appendChild(viewCanvas);

        return viewCanvas;
    }

    private _createCamera(scene: Scene): Camera {
        const camera = new ArcRotateCamera('Camera', 0, Math.PI / 3, 10, Vector3.Zero(), scene, true);
        camera.minZ = 0.01;

        return camera;
    }

    private _createEngineView(engine: AbstractEngine, scene: Scene, viewContainer: HTMLDivElement) {
        const canvas = this._createCanvas(viewContainer);
        const camera = this._createCamera(scene);
        camera.attachControl(canvas);

        engine.registerView(canvas, [camera]);
    }

    private _setWireframe(isEnabled: boolean) {
        this._scene.materials.forEach(mat => {
            mat.wireframe = isEnabled;
        })
    }

    public async toggleInspector() {
        const { Inspector } = await import('@babylonjs/inspector');
        if (Inspector.IsVisible) {
            Inspector.Hide();
        } else {
            if (!this._scene) {
                return;
            }

            Inspector.Show(this._scene, {
                globalRoot: this._renderContainer,
                overlay: true,
                gizmoCamera: this._scene.activeCamera ?? undefined,
                initialTab: DebugLayerTab.Statistics,
            });
        }
    }

    public toggleWireframe() {
        this._wireframeEnabled = !this._wireframeEnabled;
    }
}


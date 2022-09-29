declare global {
    interface IUnityWebGLConfig {
        dataUrl: string;
        frameworkUrl: string;
        codeUrl: string;
        streamingAssetsUrl: string;
        companyName?: string;
        productName?: string;
        productVersion?: string;
        matchWebGLToCanvasSize?: boolean;
        devicePixelRatio?: number;
    }
    class UnityInstance {
        SetFullscreen(fullscreen: boolean): void;
        SendMessage(objectName: string, methodName: string, value?: string | number): void;
        Quit(): Promise<void>;
    }
    function createUnityInstance(canvas: HTMLCanvasElement, config: IUnityWebGLConfig, onProgress: (progress: number) => void): Promise<UnityInstance>;
}
export declare type UnityWebLinkOptions = IUnityWebGLConfig & {
    loaderUrl: string;
    canvasId?: string;
    startInvisible?: boolean;
};
export declare class UnityWebLink {
    private options;
    private unity;
    private canvas;
    private $ready;
    private $progress;
    private $event;
    constructor(options: UnityWebLinkOptions);
    private init;
    private initUnity;
    private loadCanvas;
    private listenForEvents;
    onReady(): Promise<boolean>;
    onError(): Promise<boolean>;
    onProgress(): import("rxjs").Observable<number>;
    Quit(): Promise<void>;
    SetFullscreen(fullscreen: boolean): void;
    Send(action: string, data: any): void;
    Listen<T>(action: string): import("rxjs").Observable<{
        action: string;
        data: T;
    }>;
    getCanvas(): HTMLCanvasElement;
    SetVisible(visible: boolean): void;
}

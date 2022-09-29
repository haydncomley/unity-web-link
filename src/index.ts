import { BehaviorSubject, filter, firstValueFrom, lastValueFrom, map, ReplaySubject, Subject } from "rxjs";

declare global {
    interface IUnityWebGLConfig {
        dataUrl: string,
        frameworkUrl: string,
        codeUrl: string,
        streamingAssetsUrl: string,
        companyName?: string,
        productName?: string,
        productVersion?: string,
        matchWebGLToCanvasSize?: boolean,
        devicePixelRatio?: number,
    }

    class UnityInstance {
        public SetFullscreen(fullscreen: boolean): void;
        public SendMessage(objectName: string, methodName: string, value?: string | number): void;
        public Quit(): Promise<void>;
    }

    function createUnityInstance(
        canvas: HTMLCanvasElement,
        config: IUnityWebGLConfig,
        onProgress: (progress: number) => void
    ): Promise<UnityInstance>;
}

export type UnityWebLinkOptions = IUnityWebGLConfig & {
    loaderUrl: string,
    canvasId?: string,
    startInvisible?: boolean,
}

export class UnityWebLink {
    // Private
    private options: UnityWebLinkOptions;
    private unity: UnityInstance;
    private canvas: HTMLCanvasElement;

    // Observables
    private $ready = new ReplaySubject<boolean>(1);
    private $progress = new BehaviorSubject<number>(0);
    private $event = new Subject<{ action: string, data: unknown }>();

    constructor(options: UnityWebLinkOptions) {
        this.options = options;
        this.init();
    }

    private async init() {
        this.initUnity();
    }

    private async initUnity() {
        this.listenForEvents();
        const loaderExists = document.querySelector(`script[src="${this.options.loaderUrl}"]`);

        if (loaderExists) {
            this.loadCanvas();
            return;
        }

        const script = document.createElement('script');
        script.src = this.options.loaderUrl;
        document.body.appendChild(script);
        script.onload = async () => {
            this.loadCanvas();
        };
    }

    private async loadCanvas() {
        if (this.options.canvasId) this.canvas = document.querySelector(`#${this.options.canvasId}`);
        this.canvas = this.canvas || document.createElement('canvas');
        this.canvas.id = this.options?.canvasId || `unity-web-link-${Math.floor(Math.random() * 100000)}`;
        if (this.options.startInvisible) this.canvas.style.display = 'none';
        document.body.appendChild(this.canvas);

        try {
            this.unity = await createUnityInstance(
                this.canvas,
                this.options,
                (progress) => {
                    this.$progress.next(progress)
                }
            );
            this.$ready.next(true);
        } catch {
            this.$ready.next(false);
        }
    }

    private listenForEvents() {
        document.addEventListener('onUnityMessage', (event: CustomEvent) => {
            this.$event.next({
                action: event.detail.action,
                data: event.detail.data
            });
        })
    }

    public onReady() {
        return firstValueFrom(this.$ready.pipe(filter((x) => x)));
    }

    public onError() {
        return firstValueFrom(this.$ready.pipe(filter((x) => !x)));
    }

    public onProgress() {
        return this.$progress.asObservable();
    }

    public async Quit() {
        await this.unity.Quit();
        this.canvas.remove();
        return;
    }

    public SetFullscreen(fullscreen: boolean) {
        this.unity.SetFullscreen(fullscreen);
    }

    public Send(action: string, data: any) {
        if (!this.unity) return;
        this.unity.SendMessage('UnityJS', 'SendToUnity', JSON.stringify({
            action,
            data: JSON.stringify(data)
        }));
    }

    public Listen<T>(action: string) {
        return this.$event.pipe(filter((x) => {
            return x.action === action;
        }), map((x) => x as { action: string, data: T }));
    }

    public getCanvas() {
        return this.canvas;
    }

    public SetVisible(visible: boolean) {
        this.canvas.style.display = visible ? '' : 'none';
    }
}
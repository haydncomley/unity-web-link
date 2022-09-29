# Unity Web Link 🔗
This is a fully typed class to help communicate with a Unity GL instance with ease using JSON. Listen to, and dispatch actions from either within your game or browser.

It's super simple to get up-and-running, just import the unity asset into your project from the asset store, and include the NPM package within your website. From there the API is simple and easy to use.

### Unity Setup 🎳
1. Import the `Unity Web Link` package into your Unity project from the [Unity Asset Store](#)

### Web Setup 🕸
1. Import the `Unity Web Link` package into your web project using : `npm install unity-web-link`

```TypeScript
// 1. Import the package
import { UnityWebLink } from 'unity-web-link';

// 2. Create your link
const unityLink = new UnityWebLink({
    codeUrl: '/assets/unity/Build.wasm',
    dataUrl: '/assets/unity/Build.data',
    frameworkUrl: '/assets/unity/Build.framework.js',
    loaderUrl: '/assets/unity/Build.loader.js',
    streamingAssetsUrl: '/assets/unity/StreamingAssets'
});

// 3. Listen for actions
unityLink.Listen('player-died').subscribe((e) => {
    console.log('We Died :(', e.data);
});

// 4. Send actions & data to Unity.
document.addEventListener('offline', () => {
    unityLink.Send('network-change', {
        networkState: false
    }
});
```
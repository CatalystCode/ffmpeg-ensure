# ffmpeg-ensure

Ensure that the utility file for ffmpeg is available on the current environment

# Why?

I wanted to be able to use ffmpeg without needing to install it in advance on the environment.

> currently only works on Windows

# Usage

```bash
npm install --save ffmpeg-ensure
```

```js
const { ensureFFMPEG } = require('ffmpeg-ensure');
ensureFFMPEG().then(() => {
  console.log('done');
});
```
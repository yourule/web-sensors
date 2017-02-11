# Web Sensors

Web Sensors is a wrapper around a handful of common web APIs. It provides a simple way to add real-world sensors to a web application. This library was developed to make creative web coding easier. It also includes streams for perlin and simplex noise.

# Installation

```
npm install web-sensors --save
```

# Example Usage

    import { sight, click, mouse, simplexnoise } from 'web-sensors'

    sight().subscribe((light) => {
      state.update('retinas', light)
    })

    click().subscribe((ev) => {
      state.update('click', ev)
    })

    mousemove().map((ev) => {return {x: ev.clientX, y: ev.clientY}})
    .subscribe((location) => {
      state.update('mouse', location)
    })

    simplexnoise({shape: [5, 5, 5]}).subscribe((3DnoiseArray) => {
      state.update('noise', 3DnoiseArray)
    })

# Documentation

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## time

observe the passing of time...

**Parameters**

-   `framerate` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)?** optional framerate.
    defaults to 0, which uses requestAnimationFrame (optional, default `0`)

Returns **Observable** stream of the current UTC time in ms

## sight

a wrapper to make getting a webcam feed much easier than the standard getUserMedia API

**Parameters**

-   `framerate` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)?** optional framerate.
    defaults to 0, which uses requestAnimationFrame (optional, default `0`)
-   `width` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)?** optional width for the returned frame (height is calculated). (optional, default `320`)
-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)**  (optional, default `{}`)
    -   `$0.framerate`   (optional, default `0`)
    -   `$0.width`   (optional, default `320`)

Returns **Observable** pixel array stream

## sound

a wrapper to make getting a microphone feed much easier than the standard getUserMedia API

**Parameters**

-   `framerate` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)?** optional framerate.
    defaults to 0, which uses requestAnimationFrame (optional, default `0`)
-   `fftSize` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)?** optional fft resolution. (optional, default `2048`)
-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)**  (optional, default `{}`)
    -   `$0.framerate`   (optional, default `0`)
    -   `$0.fftSize`   (optional, default `2048`)

Returns **Observable** Uint8Array stream

## geolocation

watch the user's current GPS coordinates

Returns **Observable** {lat, lng} stream

## resize

watch for changes in the user's browser window size

**Parameters**

-   `throttleRate` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)?** optional interval to throttle this stream by. (optional, default `100`)

Returns **Observable** {width, height}

## scroll

**Parameters**

-   `throttleRate` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)?** optional interval to throttle this stream by. (optional, default `2`)

Returns **Observable** {scroll event}

## mousedown

Returns **Observable** document mousedown event

## mousemove

Returns **Observable** mousemove event

## mouse

a simple version of mousemove that only returns the clientX and clientY location

Returns **Observable** {x, y} of the mouse position

## mouseup

Returns **Observable** document mouseup event

## click

Returns **Observable** document click event

## dblclick

Returns **Observable** document double click event

## keydown

Returns **Observable** document keydown event

## keypress

Returns **Observable** document keypress event

## keyup

Returns **Observable** document keyup event

## touchstart

Returns **Observable** document touchstart event

## touchmove

Returns **Observable** document touchmove event

## touch

Returns **Observable** document touchmove event

## touchend

Returns **Observable** document touchend event

## random

generates a stream of random numbers

**Parameters**

-   `seed` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)?** optional seed for the generator. (optional, default `Math.random()`)
-   `shape` **[array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)?** the dimensionality of the returned value
    shape[0] corresponds to the length of the x axis, shape[1] corresponds to the length of the y axis,
    shape[2] corresponds to the length of the z axis. Shape array can be any length between 1 and 3,
    so [5, 5], for example, would return a 5x5 array of random values between 0 and 1 (optional, default `[1,0,0]`)
-   `framerate` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)?** optional framerate.
    defaults to 0, which uses requestAnimationFrame (optional, default `0`)
-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)**  (optional, default `{}`)
    -   `$0.seed`   (optional, default `null`)
    -   `$0.shape`   (optional, default `[1, 0, 0]`)
    -   `$0.framerate`   (optional, default `0`)

Returns **Observable** stream of random numbers or an array of random numbers

## simplexnoise

generates a stream of values using simplex noise

**Parameters**

-   `seed` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)?** optional seed for the generator. (optional, default `Math.random()`)
-   `shape` **[array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)?** the dimensionality of the returned value
    shape[0] corresponds to the length of the x axis, shape[1] corresponds to the length of the y axis,
    shape[2] corresponds to the length of the z axis. Shape array can be any length between 1 and 3,
    so [5, 5], for example, would return a 5x5 array of simplex noise values (optional, default `[1,0,0]`)
-   `framerate` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)?** optional framerate.
    defaults to 0, which uses requestAnimationFrame (optional, default `0`)
-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)**  (optional, default `{}`)
    -   `$0.seed`   (optional, default `null`)
    -   `$0.shape`   (optional, default `[1, 0, 0]`)
    -   `$0.framerate`   (optional, default `0`)

Returns **Observable** stream of simplex values

## perlinnoise

generates a stream of values using perlin noise

**Parameters**

-   `seed` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)?** optional seed for the generator. (optional, default `Math.random()`)
-   `shape` **[array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)?** the dimensionality of the returned value
    shape[0] corresponds to the length of the x axis, shape[1] corresponds to the length of the y axis,
    shape[2] corresponds to the length of the z axis. Shape array can be any length between 1 and 3,
    so [5, 5], for example, would return a 5x5 array of perlin noise values (optional, default `[1,0,0]`)
-   `framerate` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)?** optional framerate.
    defaults to 0, which uses requestAnimationFrame (optional, default `0`)
-   `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)**  (optional, default `{}`)
    -   `$0.seed`   (optional, default `null`)
    -   `$0.shape`   (optional, default `[1, 0, 0]`)
    -   `$0.framerate`   (optional, default `0`)

Returns **Observable** stream of perlin values

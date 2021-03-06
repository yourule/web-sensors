import Rx from 'rx-lite'
import rxdom from 'rx-dom'
import getUserMedia from 'getusermedia'
import requestAnimationFrame from 'requestanimationframe'
import { Noise } from 'noisejs'
let AudioContext = window.AudioContext || window.webkitAudioContext

class DataGenerator {
  constructor(framerate = 0, cb) {
    if (typeof cb !== 'function') {
      console.error('generator requires a callback')
      return
    }
    this.framerate = framerate
    this.interval = null
    this.frameWaitTime = 0
    this.lastTime = Date.now()
    let wrapperFn = () => {
      this.frameWaitTime = Date.now() - this.lastTime
      this.lastTime = Date.now()
      cb()
      if (this.framerate === 0) {
        requestAnimationFrame(wrapperFn)
      }
      else {
        setTimeout(() => {
          requestAnimationFrame(wrapperFn)},
        1/framerate * (1000 - this.frameWaitTime))
      }
    }
    this.interval = requestAnimationFrame(wrapperFn)
  }

  stop () {
    cancelAnimationFrame(this.interval)
  }
}

const noiseArrHelper = (shape = [1, 0, 0], fn2d, fn3d) => {
  return [...Array(shape[0]).keys()].map((x) => {
    x += Date.now() / 1000
    if (shape[1] > 0) {
      return [...Array(shape[1]).keys()].map((y) => {
        y += Date.now() / 1000
        if (shape[2] > 0) {
          return [...Array(shape[2]).keys()].map((z) => {
            z += Date.now() / 1000
            return fn3d(x, y, z)
          })
        }
        else {
          return fn2d(x, y)
        }
      })
    }
    else {
      return fn2d(x, 0)
    }
  })
}

/**
 * observe the passing of time...
 * @param {number} [framerate=0] optional framerate.
 * defaults to 0, which uses requestAnimationFrame
 * @returns {Observable} stream of the current UTC time in ms
 */
export function time (framerate = 0) {
  return Rx.Observable.create((observer) => {
    let gen = new DataGenerator(framerate, () => {
      observer.onNext(Date.now())
    })
    return function () {
      gen.stop()
    }
  })
}

/**
 * a wrapper to make getting a webcam feed much easier than the standard getUserMedia API
 * @param {number} [$0.framerate=0] optional framerate.
 * defaults to 0, which uses requestAnimationFrame
 * @param {number} [$0.width=320] optional width for the returned frame (height is calculated).
 * @returns {Observable} pixel array stream
 */
export function sight ({framerate = 33, width = 320} = {}) {
  let canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d')
  let video = document.createElement('video')
  let streaming = false
  let height = 0
  video.addEventListener('canplay', function(ev){
        if (!streaming) {
          height = video.videoHeight / (video.videoWidth/width);
          video.setAttribute('width', width);
          video.setAttribute('height', height);
          canvas.setAttribute('width', width);
          canvas.setAttribute('height', height);
          streaming = true
        }
      }, false);
  return Rx.Observable.create((observer) => {
    getUserMedia({audio: false, video: true}, (err, stream) => {
      if (err) { observer.onError(err); return }
      video.srcObject = stream
      video.play()
      let gen = new DataGenerator(framerate, () => {
        if (!streaming) { return }
        ctx.drawImage(video, 0, 0, width, height)
        let frame = ctx.getImageData(0, 0, width, height)
        observer.onNext(frame)
      })
    })
    return function () { gen.stop() }
  }).publish().refCount()
}

/**
 * a wrapper to make getting a microphone feed much easier than the standard getUserMedia API
 * @param {number} [$0.framerate=0] optional framerate.
 * defaults to 0, which uses requestAnimationFrame
 * @param {number} [$0.fftSize=2048] optional fft resolution.
 * @returns {Observable} Uint8Array stream
 */
export function sound ({framerate=0, fftSize=2048} = {}) {
  let audioCtx = new AudioContext();
  var analyser = audioCtx.createAnalyser();
  analyser.fftSize = fftSize;
  var freqData = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteTimeDomainData(freqData)
  return Rx.Observable.create((observer) => {
    getUserMedia({audio: true, video: false}, (err, stream) => {
      if (err) { observer.onError(err); return }
      let source = audioCtx.createMediaStreamSource(stream)
      source.connect(analyser)
      let gen = new DataGenerator(framerate, () => {
        analyser.getByteTimeDomainData(freqData)
        observer.onNext(freqData)
      })
    })
    return function () { gen.stop() }
  }).publish().refCount()
}

/**
 * watch the user's current GPS coordinates
 * @returns {Observable} {lat, lng} stream
 */
export function geolocation () {
  return rxdom.DOM.geolocation.watchPosition()
}

/**
 * watch for changes in the user's browser window size
 * @param {number} [throttleRate=100] optional interval to throttle this stream by.
 * @returns {Observable} {width, height}
 */
export function resize (throttleRate = 100) {
  return rxdom.DOM.resize(document)
    .throttle(throttleRate)
    .map(({target}) => {
      return {
        width: target.innerWidth,
        height: target.innerHeight
      }
    })
}

/**
 * @param {number} [throttleRate=2] optional interval to throttle this stream by.
 * @returns {Observable} {scroll event}
 */
export function scroll (throttleRate = 2) {
  return rxdom.DOM.scroll(document).throttle(throttleRate)
}

/**
 * @returns {Observable} document mousedown event
 */
export function mousedown () {
  return rxdom.DOM.mousedown(document)
}

/**
 * @returns {Observable} mousemove event
 */
export function mousemove () {
  return rxdom.DOM.mousemove(document)
}

/**
 * a simple version of mousemove that only returns the clientX and clientY location
 * @returns {Observable} {x, y} of the mouse position
 */
 export function mouse () {
   return rxdom.DOM.mousemove(document).map((ev) => {return {x: ev.clientX, y: ev.clientY}})
 }

/**
 * @returns {Observable} document mouseup event
 */
export function mouseup () {
  return rxdom.DOM.mouseup(document)
}

/**
 * @returns {Observable} document click event
 */
export function click () {
  return rxdom.DOM.click(document)
}

/**
 * @returns {Observable} document double click event
 */
export function dblclick () {
  return rxdom.DOM.dblclick(document)
}

/**
 * @returns {Observable} document keydown event
 */
export function keydown () {
  return rxdom.DOM.keydown(document)
}

/**
 * @returns {Observable} document keypress event
 */
export function keypress () {
  return rxdom.DOM.keypress(document)
}

/**
 * @returns {Observable} document keyup event
 */
export function keyup () {
  return rxdom.DOM.keyup(document)
}

/**
 * @returns {Observable} document touchstart event
 */
export function touchstart () {
  return rxdom.DOM.touchstart(document)
}

/**
 * @returns {Observable} document touchmove event
 */
export function touchmove () {
  return rxdom.DOM.touchmove(document)
}

/**
 * @returns {Observable} document touchmove event
 */
 export function touch () {
   return rxdom.DOM.touchmove(document)
 }

/**
 * @returns {Observable} document touchend event
 */
export function touchend () {
  return rxdom.DOM.touchend(document)
}

/**
  * generates a stream of random numbers
  *
  * @param {number} [$0.seed=Math.random()] optional seed for the generator.
  * @param {array} [$0.shape=[1, 0, 0]] the dimensionality of the returned value
  * shape[0] corresponds to the length of the x axis, shape[1] corresponds to the length of the y axis,
  * shape[2] corresponds to the length of the z axis. Shape array can be any length between 1 and 3,
  * so [5, 5], for example, would return a 5x5 array of random values between 0 and 1
  * @param {number} [$0.framerate=0] optional framerate.
  * defaults to 0, which uses requestAnimationFrame
  * @returns {Observable} stream of random numbers or an array of random numbers
 */
export function random ({seed = -1, shape = [1, 0, 0], framerate = 0} = {}) {
  if (seed === -1) {seed = Math.random()}
  return Rx.Observable.create((observer) => {
    let gen = new DataGenerator(framerate, () => {
      let noise = noiseArrHelper(shape, Math.random, Math.random)
      observer.onNext(noise)
    })
    return function () {
      gen.stop()
    }
  })
}

/**
  * generates a stream of values using simplex noise
  * @param {number} [$0.seed=Math.random()] optional seed for the generator.
  * @param {array} [$0.shape=[1, 0, 0]] the dimensionality of the returned value
  * shape[0] corresponds to the length of the x axis, shape[1] corresponds to the length of the y axis,
  * shape[2] corresponds to the length of the z axis. Shape array can be any length between 1 and 3,
  * so [5, 5], for example, would return a 5x5 array of simplex noise values
  * @param {number} [$0.framerate=0] optional framerate.
  * defaults to 0, which uses requestAnimationFrame
  * @returns {Observable} stream of simplex values
 */
export function simplexnoise ({seed = -1, shape = [1, 0, 0], framerate = 0} = {}) {
  if (seed === -1) {seed = Math.random()}
  return Rx.Observable.create((observer) => {
    let noiseGen = new Noise(seed)
    let gen = new DataGenerator(framerate, () => {
      let noise = noiseArrHelper(shape, (x, y) => {
        return noiseGen.simplex2(x, y)
      }, (x, y, z) => {
        return noiseGen.simplex3(x, y, z)
      })
      observer.onNext(noise)
    })
    return function () {
      gen.stop()
    }
  })
}

/**
  * generates a stream of values using perlin noise
  * @param {number} [$0.$0.seed=Math.random()] optional seed for the generator.
  * @param {array} [$0.$0.shape=[1, 0, 0]] the dimensionality of the returned value
  * shape[0] corresponds to the length of the x axis, shape[1] corresponds to the length of the y axis,
  * shape[2] corresponds to the length of the z axis. Shape array can be any length between 1 and 3,
  * so [5, 5], for example, would return a 5x5 array of perlin noise values
  * @param {number} [$0.$0.framerate=0] optional framerate.
  * defaults to 0, which uses requestAnimationFrame
  * @returns {Observable} stream of perlin values
 */
export function perlinnoise ({seed = -1, shape = [1, 0, 0], framerate = 0} = {}) {
  if (seed === -1) {seed = Math.random()}
  return Rx.Observable.create((observer) => {
    let noiseGen = new Noise(seed)
    let gen = new DataGenerator(framerate, () => {
      let noise = noiseArrHelper(shape, (x, y) => {
        return noiseGen.perlin2(x, y)
      }, (x, y, z) => {
        return noiseGen.perlin3(x, y, z)
      })
      observer.onNext(noise)
    })
    return function () {
      gen.stop()
    }
  })
}

export function midi () {
  return Rx.Observable.create((observer) => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess({sysex: false}).then(
        (midiData) => {
          observer.onNext(midiData)
        },
        (err) => { observer.onError(err) }
      )
    } else {
      observer.onError('your browser does not support MIDI')
    }
  })
}

export default {
  time, sight, sound,
  geolocation, resize, scroll,
  mousedown, mouse, mousemove, mouseup, click, dblclick,
  keydown, keypress, keyup,
  touchstart, touchmove, touchend,
  random, simplexnoise, perlinnoise,
  midi
}

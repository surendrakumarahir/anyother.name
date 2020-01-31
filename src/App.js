import React, { Component } from 'react';
import './App.css';

// import {data} from  './data';
import data from './data.json'
const gallery = data;


class Video extends React.Component {

    state = {
        playing: false
    }

    componentDidMount() {
        // const isTouch = 'ontouchstart' in document.documentElement
        // console.log(isTouch, 'is touch')
        // this.setState({
        //   playing: !isTouch
        // })
        window.addEventListener('touchstart', this.playVideo)
        this.refs.el.addEventListener('canplay', this.isPlaying)
    }

    componentWillUnmount() {
        window.removeEventListener('touchstart', this.playVideo, false)
        this.refs.el.removeEventListener('canplay', this.isPlaying, false)
    }

    playVideo = () => {
        this.refs.el.play()
        this.isPlaying()
    }

    isPlaying = () => {

        this.setState({
            playing: true
        })
    }

    render() {

        const { src } = this.props

        return (
            <video src={src} autoPlay muted loop playsInline controls={false} ref="el" style={{
                opacity: this.state.playing ? 1 : 0
            }} />
        )
    }
}

class Gallery extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            slide: 0,
            slideCount: 0,
        }

        this.timer = null
    }

    componentDidMount() {
        window.addEventListener('mousemove', this.handleMouse)
        this.setTimer()
    }

    componentWillUnmount() {
        window.removeEventListener('mousemove', this.handleMouse, false)
        clearInterval(this.timer)
    }

    componentDidUpdate(nextProps) {
        if (nextProps.touchX !== this.props.touchX) {
            this.updateSlide(this.props.touchX)
        }
    }

    setTimer() {
        clearInterval(this.timer)
        this.timer = setInterval(this.handleTimer, 3000)
    }

    updateSlide(x) {
        const winW = window.innerWidth;
        const count = this.state.slideCount - 1;
        const divisions = winW / count;
        const newIndex = Math.round(x / divisions);

        if (this.state.slide !== newIndex) {
            this.setState({
                slide: newIndex
            })
        }

        this.setTimer()
    }

    handleMouse = e => {
        this.updateSlide(e.clientX)
    }

    handleTimer = () => {
        this.setState(prev => {
            if (prev.slide === this.state.slideCount - 1) {
                return {
                    slide: 0
                }
            } else {
                return {
                    slide: prev.slide + 1
                }
            }
        })
    }

    countSlides = () => {
        this.setState(prev => {
            return {
                slideCount: prev.slideCount + 1
            }
        })
    }

    render() {

        //const { gallery } = this.props

        return (
            <div className="pfix fs t0 l0 z-bottom">
                {gallery.map((slide, i) => {
                    const count = i - 1;
                    return slide.reference !== 'TEMPLATE (DO NOT DELETE)' ? (
                        <Slide key={`slide-${count}`} style={{
                            zIndex: count === this.state.slide ? 100 : count
                        }} slide={slide} counter={this.countSlides} isTouch={this.props.isTouch} />
                    ) : false
                })}
            </div>
        )
    }
}

class Slide extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            ready: false
        }
    }

    componentDidMount() {
        const slide = this.props.slide

        if (slide.image) {
            this.loadImage(slide.image.fluid.srcSet)
        } else {
            this.renderSlide()
        }
    }

    componentWillUnmount() {
        this.destroyImage()
    }

    loadImage(srcset) {
        this.img = new Image()
        this.img.srcset = srcset
        this.img.onload = e => {
            this.renderSlide()
        }
    }

    destroyImage() {
        if (!this.img) {
            return;
        }
        this.img.onload = function(){};
        delete this.img;
    }

    renderSlide() {
        if (!this.state.ready) {
            this.setState({
                ready: true
            })
            this.props.counter()
        }
    }

    render() {

        const { style, slide } = this.props

        return this.state.ready ? (
            <div className="gallery-slide fs pabs t0 l0" style={style}>
                {slide.video ? (
                    <Video src={slide.video.file.url} autoPlay muted loop playsInline controls={false} isTouch={this.props.isTouch} />
                ) : slide.image ? (
                    <img srcSet={slide.image.fluid.srcSet} alt={slide.image.title} />
                ) : null}
            </div>
        ) : null
    }
}

class App extends Component {
    render() {
        return (
            <div className="App">
                <Gallery />
            </div>
        );
    }
}
//export default Gallery




export default App;

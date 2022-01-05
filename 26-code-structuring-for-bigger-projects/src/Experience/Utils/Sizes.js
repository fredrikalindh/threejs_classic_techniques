import EventEmitter from "./EventEmitter";

export default class Sizes extends EventEmitter {
    constructor() {
        super();

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);

        this.onResize = () => {
            // Update sizes
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.pixelRatio = Math.min(window.devicePixelRatio, 2);

            // Emit event
            this.trigger("resize");
        };

        window.addEventListener("resize", this.onResize);
    }

    destroy() {
        window.removeEventListener("resize", this.onResize);
    }
}

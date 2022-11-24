import { DebugGUI } from "../class/DebugGUI"

export class TitleScene extends Phaser.Scene {
    private debugGUI: DebugGUI

    private startText: Phaser.GameObjects.Text

    private backgroundCamera: Phaser.Cameras.Scene2D.Camera

    private particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter
    constructor() {
        super("title")
    }

    init() {
        this.debugGUI = new DebugGUI(this)
        this.events.on(Phaser.Scenes.Events.TRANSITION_OUT, () => {
            this.debugGUI.destroy()
        })
    }

    create() {
        const { width, height } = this.game.canvas

        this.backgroundCamera = this.cameras.add(0, 0, 1280, 720)
        this.backgroundCamera.setScroll(1280, 720)
        this.cameras.add(0, 0, 1280, 720, true)
        this.add
            .shader("background", width / 2 + 1280, height / 2 + 720, 1280, 720)
            .setDepth(-5)

        // @ts-expect-error
        this.plugins.get("rexKawaseBlurPipeline").add(this.backgroundCamera, {
            blur: 8,
            quality: 8,
        })

        const particleYellow = this.add.particles("particle-yellow").setDepth(20)

        this.particleEmitter = particleYellow.createEmitter({
            x: -1280,
            y: 0,
            angle: { min: 0, max: 360 },
            speed: 60,
            emitZone: {
                type: "random",
                source: new Phaser.Geom.Circle(0, 0, 6),
                quantity: 12,
                yoyo: false,
            },
            scale: { start: 0.08, end: 0 },
            lifespan: { min: 300, max: 1000 },
            quantity: 0.6,
            blendMode: "ADD",
            on: true,
        })

        this.startText = this.add
            .text(640, 520, "touch to start", {
                fontFamily: "Bungee",
                fontSize: "80px",
                color: "#fafafa",
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(10)
            .setAlpha(1)
            .setScale(0.5)
            .setInteractive({
                useHandCursor: true,
            })
            .on("pointerdown", () => {
                this.sound.play("decide")
                this.cameras.main.fadeOut(800)
            })
        this.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {
                this.scene.start("select")
            }
        )
        this.cameras.main.fadeIn(500)
    }

    update(time: number, dt: number) {
        this.particleEmitter.setPosition(this.input.x, this.input.y)

        this.startText.setAlpha(
            0.5 + 0.5 * 0.5 * (0.25 * Math.sin((time * 2 * Math.PI) / 1000) + 1)
        )
    }
}

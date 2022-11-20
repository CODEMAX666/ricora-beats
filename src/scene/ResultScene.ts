import { DebugGUI } from "../class/DebugGUI"
import { PlayResult } from "../class/PlayResult"
import { Music } from "../class/Music"

export class ResultScene extends Phaser.Scene {
    private debugGUI: DebugGUI

    private playResult: PlayResult

    private titleText: Phaser.GameObjects.Text
    private artistText: Phaser.GameObjects.Text
    private noterText: Phaser.GameObjects.Text
    private scoreText: Phaser.GameObjects.Text
    private scoreLabelText: Phaser.GameObjects.Text
    private comboText: Phaser.GameObjects.Text
    private comboLabelText: Phaser.GameObjects.Text
    private judgeTexts: Phaser.GameObjects.Text[]
    private judgeLabelTexts: Phaser.GameObjects.Text[]

    private titleFrame: Phaser.GameObjects.Image
    private detailFrame: Phaser.GameObjects.Image

    private musicIcon: Phaser.GameObjects.Image
    private artistIcon: Phaser.GameObjects.Image
    private noterIcon: Phaser.GameObjects.Image

    private keyIcon: Phaser.GameObjects.Image
    private diffIcon: Phaser.GameObjects.Image

    private backIcon: Phaser.GameObjects.Image

    private line1: Phaser.GameObjects.Rectangle
    private line2: Phaser.GameObjects.Rectangle

    private backgroundCamera: Phaser.Cameras.Scene2D.Camera

    constructor() {
        super("result")
    }

    init(data: any) {
        this.debugGUI = new DebugGUI(this)
        this.events.on(Phaser.Scenes.Events.TRANSITION_OUT, () => {
            this.debugGUI.destroy()
        })

        this.playResult =
            data.playResult ||
            new PlayResult({
                music: {
                    title: "test",
                    artist: "作曲者",
                    noter: "譜面作者",
                    folder: "test",
                    beatmap_7k_1: {
                        filename: "test7.bme",
                        playlevel: 1,
                    },
                },
                playConfig: {
                    noteSpeed: 6.5,
                    noteType: "rectangle",
                    key: 7,
                    difficulty: 3,
                },
                judges: [1000, 200, 30, 4, 5],
                score: 95.21,
                maxCombo: 1234,
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

        this.titleFrame = this.add
            .image(100, 125, "frame-title")
            .setScale(0.67, 0)
            .setOrigin(0, 0.5)
            .setDepth(-2)

        this.detailFrame = this.add
            .image(100, 500, "frame-detail")
            .setScale(0.67, 0)
            .setOrigin(0, 0.5)
            .setDepth(-2)

        this.tweens.add({
            targets: [this.titleFrame, this.detailFrame],
            delay: 200,
            scaleY: {
                value: 0.67,
                duration: 200,
                ease: "Quintic.Out",
            },
        })

        this.titleText = this.add
            .text(190, 110, this.playResult.music.title, {
                fontFamily: "Noto Sans JP",
                fontSize: "60px",
                color: "#f0f0f0",
            })
            .setOrigin(0, 0.5)
            .setScale(0.5)
            .setAlpha(0)

        this.artistText = this.add
            .text(170, 150, this.playResult.music.artist, {
                fontFamily: "Noto Sans JP",
                fontSize: "30px",
                color: "#bbbbbb",
            })
            .setOrigin(0, 0.5)
            .setScale(0.5)
            .setAlpha(0)

        this.noterText = this.add
            .text(420, 150, this.playResult.music.noter, {
                fontFamily: "Noto Sans JP",
                fontSize: "30px",
                color: "#bbbbbb",
            })
            .setOrigin(0, 0.5)
            .setScale(0.5)
            .setAlpha(0)

        this.keyIcon = this.add
            .image(130, 65, `key-icon-${this.playResult.playConfig.key}`)
            .setOrigin(0, 0.5)
            .setDepth(10)
            .setAlpha(0)

        this.diffIcon = this.add
            .image(310, 65, `diff-icon-${this.playResult.playConfig.difficulty}`)
            .setOrigin(0, 0.5)
            .setDepth(10)
            .setAlpha(0)

        this.musicIcon = this.add
            .image(130, 110, "icon-music")
            .setScale(0.6)
            .setOrigin(0, 0.5)
            .setAlpha(0)

        this.artistIcon = this.add
            .image(140, 150, "icon-artist")
            .setScale(0.7)
            .setOrigin(0, 0.5)
            .setAlpha(0)

        this.noterIcon = this.add
            .image(390, 150, "icon-noter")
            .setScale(0.7)
            .setOrigin(0, 0.5)
            .setAlpha(0)

        this.scoreText = this.add
            .text(431, 350, `${this.playResult.score.toFixed(2)} %`, {
                fontFamily: "Oswald",
                fontSize: "40px",
                color: "#fafafa",
                align: "center",
            })
            .setOrigin(1, 0.5)
            .setAlpha(0)

        this.scoreLabelText = this.add
            .text(170, 350, "ACC.", {
                fontFamily: "Oswald",
                fontSize: "30px",
                color: "#888888",
                align: "center",
            })
            .setOrigin(0, 0.5)
            .setAlpha(0)

        this.line1 = this.add
            .rectangle(300, 385, 320, 2, 0x444444, 30)
            .setDepth(-1)
            .setScale(0, 1)

        this.line2 = this.add
            .rectangle(300, 605, 320, 2, 0x444444, 30)
            .setDepth(-1)
            .setScale(0, 1)

        this.tweens.add({
            targets: [this.line1, this.line2],
            delay: 450,
            scaleX: {
                value: 1,
                duration: 200,
                ease: "Quintic.Out",
            },
        })

        this.judgeTexts = []
        this.judgeLabelTexts = []
        for (const judgeIndex of Array(5).keys()) {
            this.add
                .image(830, 430 + 35 * judgeIndex, `judge-${judgeIndex}`)
                .setScale(0.4)
                .setOrigin(judgeIndex === 0 ? 0.03 : 0, 0.5)
                .setAlpha(0)

            this.judgeLabelTexts.push(
                this.add
                    .text(
                        200,
                        424 + 35 * judgeIndex,
                        ["PERFECT", "GREAT", "GOOD", "BAD", "MISS"][judgeIndex],
                        {
                            fontFamily: "Oswald",
                            fontSize: "20px",
                            color: ["#e530e5", "#d8a10a", "#3cc43c", "#2f9ec6", "#880aaa"][
                                judgeIndex
                            ],
                            align: "center",
                        }
                    )
                    .setOrigin(0, 0.5)
                    .setAlpha(0)
            )

            this.judgeTexts.push(
                this.add
                    .text(
                        400,
                        424 + 35 * judgeIndex,
                        `${this.playResult.judges[judgeIndex]}`,
                        {
                            fontFamily: "Oswald",
                            fontSize: "28px",
                            color: "#fafafa",
                            align: "center",
                        }
                    )
                    .setOrigin(1, 0.5)
                    .setAlpha(0)
            )
        }

        this.comboText = this.add
            .text(430, 640, `${this.playResult.maxCombo}`, {
                fontFamily: "Oswald",
                fontSize: "28px",
                color: "#fafafa",
                align: "center",
            })
            .setOrigin(1, 0.5)
            .setAlpha(0)
        this.comboLabelText = this.add
            .text(170, 640, "MAX COMBO", {
                fontFamily: "Oswald",
                fontSize: "20px",
                color: "#888888",
                align: "center",
            })
            .setOrigin(0, 0.5)
            .setAlpha(0)

        this.tweens.add({
            targets: [
                this.titleText,
                this.artistText,
                this.noterText,
                this.keyIcon,
                this.diffIcon,
                this.musicIcon,
                this.artistIcon,
                this.noterIcon,
                this.scoreText,
                this.scoreLabelText,
                this.comboText,
                this.comboLabelText,
                this.judgeTexts[0],
                this.judgeTexts[1],
                this.judgeTexts[2],
                this.judgeTexts[3],
                this.judgeTexts[4],
                this.judgeLabelTexts[0],
                this.judgeLabelTexts[1],
                this.judgeLabelTexts[2],
                this.judgeLabelTexts[3],
                this.judgeLabelTexts[4],
            ],
            delay: 500,
            alpha: {
                value: 1,
                duration: 150,
                ease: "Quintic.Out",
            },
        })

        this.backIcon = this.add
            .image(10, 10, "icon-back")
            .setOrigin(0, 0)
            .setDepth(10)
            .setScale(0.6)
            .setInteractive({
                useHandCursor: true,
            })
            .on("pointerdown", () => {
                this.cameras.main.fadeOut(500)
            })

        this.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {
                this.scene.start("select", { playConfig: this.playResult.playConfig })
            }
        )

        this.cameras.main.fadeIn(500)
    }

    update(time: number, deltaTime: number) {
        switch (Math.floor(time / 40) % 4) {
            case 0:
                this.judgeLabelTexts[0].setColor("#e530e5")
                break
            case 1:
                this.judgeLabelTexts[0].setColor("#ffffff")
                break
            case 2:
                this.judgeLabelTexts[0].setColor("#2fdfe2")
                break
            case 3:
                this.judgeLabelTexts[0].setColor("#ffffff")
                break
        }
    }
}

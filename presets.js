const { combineRgb } = require('@companion-module/base')
// This is the main function that will be called by the module to set the presets

module.exports = async function (self) {

    let presets = {

        // enable disable modules
        enableplaylist: {
            type: 'button',
            category: 'Enable/Disable Modules',
            name: 'Enable Playlist',
            style: {

                bgcolor: combineRgb(0, 180, 0),
                color: combineRgb(0, 0, 0),
                text: 'PLAYLIST\nON',
                size: '14'
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'enabledisablemodule',
                            options: {
                                module: 'playlist',
                                enable: true
                            }
                        }

                    ],
                    up: [

                    ],
                },
            ],
            feedbacks: [],
        },
        disableplaylist: {
            type: 'button',
            category: 'Enable/Disable Modules',
            name: 'Disable Playlist',
            style: {

                bgcolor: combineRgb(180, 0, 0),
                color: combineRgb(255, 255, 255),
                text: 'PLAYLIST\nOFF',
                size: '14'
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'enabledisablemodule',
                            options: {
                                module: 'playlist',
                                enable: false
                            }
                        }

                    ],
                    up: [

                    ],
                },
            ],
            feedbacks: [],
        },
        enabletimecodel1: {
            type: 'button',
            category: 'Enable/Disable Modules',
            name: 'Enable Timecode Playlist On Layer 1',
            style: {

                bgcolor: combineRgb(0, 180, 0),
                color: combineRgb(0, 0, 0),
                text: 'TIMECODE\nCUELIST\nON',
                size: '12'
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'enabledisablemodule',
                            options: {
                                module: 'tc1',
                                enable: true
                            }
                        }

                    ],
                    up: [

                    ],
                },
            ],
            feedbacks: [],
        },
        disabletimecodel1: {
            type: 'button',
            category: 'Enable/Disable Modules',
            name: 'Disable Timecode Playlist On Layer 1',
            style: {

                bgcolor: combineRgb(180, 0, 0),
                color: combineRgb(255, 255, 255),
                text: 'TIMECODE\nCUELIST\nOFF',
                size: '12'
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'enabledisablemodule',
                            options: {
                                module: 'tc1',
                                enable: false
                            }
                        }

                    ],
                    up: [

                    ],
                },
            ],
            feedbacks: [],
        },
        enabletimecodel2: {
            type: 'button',
            category: 'Enable/Disable Modules',
            name: 'Enable Timecode Playlist On Layer 2',
            style: {

                bgcolor: combineRgb(0, 180, 0),
                color: combineRgb(0, 0, 0),
                text: 'TIMECODE\nCUELIST\nON',
                size: '12'
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'enabledisablemodule',
                            options: {
                                module: 'tc2',
                                enable: true
                            }
                        }

                    ],
                    up: [

                    ],
                },
            ],
            feedbacks: [],
        },
        disabletimecodel2: {
            type: 'button',
            category: 'Enable/Disable Modules',
            name: 'Disable Timecode Playlist On Layer 2',
            style: {

                bgcolor: combineRgb(180, 0, 0),
                color: combineRgb(255, 255, 255),
                text: 'TIMECODE\nCUELIST\nOFF',
                size: '12'
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'enabledisablemodule',
                            options: {
                                module: 'tc2',
                                enable: false
                            }
                        }

                    ],
                    up: [

                    ],
                },
            ],
            feedbacks: [],
        },
        enabletimeline: {
            type: 'button',
            category: 'Enable/Disable Modules',
            name: 'Enable Timeline',
            style: {

                bgcolor: combineRgb(0, 180, 0),
                color: combineRgb(0, 0, 0),
                text: 'TIMELINE\nON',
                size: '14'
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'enabledisablemodule',
                            options: {
                                module: 'timeline',
                                enable: true
                            }
                        }

                    ],
                    up: [

                    ],
                },
            ],
            feedbacks: [],
        },
        disabletimeline: {
            type: 'button',
            category: 'Enable/Disable Modules',
            name: 'Disable Timeline',
            style: {

                bgcolor: combineRgb(180, 0, 0),
                color: combineRgb(255, 255, 255),
                text: 'TIMELINE\nOFF',
                size: '14'
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'enabledisablemodule',
                            options: {
                                module: 'timeline',
                                enable: false
                            }
                        }

                    ],
                    up: [

                    ],
                },
            ],
            feedbacks: [],
        },
        enablescheduler: {
            type: 'button',
            category: 'Enable/Disable Modules',
            name: 'Enable Scheduler',
            style: {

                bgcolor: combineRgb(0, 180, 0),
                color: combineRgb(0, 0, 0),
                text: 'SCHEDULE\nON',
                size: '10'
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'enabledisablemodule',
                            options: {
                                module: 'scheduler',
                                enable: true
                            }
                        }

                    ],
                    up: [

                    ],
                },
            ],
            feedbacks: [],
        },
        disablescheduler: {
            type: 'button',
            category: 'Enable/Disable Modules',
            name: 'Disable Scheduler',
            style: {

                bgcolor: combineRgb(180, 0, 0),
                color: combineRgb(255, 255, 255),
                text: 'SCHEDULE\nOFF',
                size: '10'
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'enabledisablemodule',
                            options: {
                                module: 'scheduler',
                                enable: false
                            }
                        }

                    ],
                    up: [

                    ],
                },
            ],
            feedbacks: [],
        },

        // toggle module states
        toggleplaylist: {
            type: 'button',
            category: 'Toggle Module State',
            name: 'Toggle Playlist',
            style: {

                bgcolor: combineRgb(0, 0, 0),
                color: combineRgb(255, 255, 255),
                text: 'PLAYLIST',
                size: '14'
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'togglemodule',
                            options: {
                                module: 'playlist'
                            }
                        }

                    ],
                    up: [

                    ],
                },
            ],
            feedbacks: [
                {
                    feedbackId: 'moduledisabled',
                    options: {
                        module: 'playlist'
                    },
                    style: {
                        bgcolor: combineRgb(180, 0, 0),
                        color: combineRgb(0, 0, 0),
                    },
                },
                {
                    feedbackId: 'moduleenabled',
                    options: {
                        module: 'playlist'
                    },
                    style: {
                        bgcolor: combineRgb(0, 180, 0),
                        color: combineRgb(0, 0, 0),
                    }
                },
            ],
        },
        toggletimecodel1: {
            type: 'button',
            category: 'Toggle Module State',
            name: 'Enable Timecode Playlist On Layer 1',
            style: {

                bgcolor: combineRgb(0, 0, 0),
                color: combineRgb(255, 255, 255),
                text: 'TIMECODE\nCUELIST',
                size: '12'
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'togglemodule',
                            options: {
                                module: 'tc1'
                            }
                        }

                    ],
                    up: [

                    ],
                },
            ],
            feedbacks: [
                {
                    feedbackId: 'moduledisabled',
                    options: {
                        module: 'tc1'
                    },
                    style: {
                        bgcolor: combineRgb(180, 0, 0),
                        color: combineRgb(0, 0, 0),
                    },
                },
                {
                    feedbackId: 'moduleenabled',
                    options: {
                        module: 'tc1'
                    },
                    style: {
                        bgcolor: combineRgb(0, 180, 0),
                        color: combineRgb(0, 0, 0),
                    }
                },
            ],
        },
        toggletimecodel2: {
            type: 'button',
            category: 'Toggle Module State',
            name: 'Enable Timecode Playlist On Layer 2',
            style: {

                bgcolor: combineRgb(0, 0, 0),
                color: combineRgb(255, 255, 255),
                text: 'TIMECODE\nCUELIST',
                size: '12'
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'togglemodule',
                            options: {
                                module: 'tc2'
                            }
                        }

                    ],
                    up: [

                    ],
                },
            ],
            feedbacks: [
                {
                    feedbackId: 'moduledisabled',
                    options: {
                        module: 'tc2'
                    },
                    style: {
                        bgcolor: combineRgb(180, 0, 0),
                        color: combineRgb(0, 0, 0),
                    },
                },
                {
                    feedbackId: 'moduleenabled',
                    options: {
                        module: 'tc2'
                    },
                    style: {
                        bgcolor: combineRgb(0, 180, 0),
                        color: combineRgb(0, 0, 0),
                    }
                },
            ],
        },
        toggletimeline: {
            type: 'button',
            category: 'Toggle Module State',
            name: 'Enable Timeline',
            style: {

                bgcolor: combineRgb(0, 0, 0),
                color: combineRgb(255, 255, 255),
                text: 'TIMELINE',
                size: '14'
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'togglemodule',
                            options: {
                                module: 'timeline'
                            }
                        }

                    ],
                    up: [

                    ],
                },
            ],
            feedbacks: [
                {
                    feedbackId: 'moduledisabled',
                    options: {
                        module: 'timeline'
                    },
                    style: {
                        bgcolor: combineRgb(180, 0, 0),
                        color: combineRgb(0, 0, 0),
                    },
                },
                {
                    feedbackId: 'moduleenabled',
                    options: {
                        module: 'timeline'
                    },
                    style: {
                        bgcolor: combineRgb(0, 180, 0),
                        color: combineRgb(0, 0, 0),
                    }
                },
            ],
        },
        togglescheduler: {
            type: 'button',
            category: 'Toggle Module State',
            name: 'Enable Scheduler',
            style: {

                bgcolor: combineRgb(0, 0, 0),
                color: combineRgb(255, 255, 255),
                text: 'SCHEDULE',
                size: '10'
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'togglemodule',
                            options: {
                                module: 'scheduler'
                            }
                        }

                    ],
                    up: [

                    ],
                },
            ],
            feedbacks: [
                {
                    feedbackId: 'moduledisabled',
                    options: {
                        module: 'scheduler'
                    },
                    style: {
                        bgcolor: combineRgb(180, 0, 0),
                        color: combineRgb(0, 0, 0),
                    },
                },
                {
                    feedbackId: 'moduleenabled',
                    options: {
                        module: 'scheduler'
                    },
                    style: {
                        bgcolor: combineRgb(0, 180, 0),
                        color: combineRgb(0, 0, 0),
                    }
                },
            ],
        },

        // system commandas
        restart: {
            type: 'button',
            category: 'System Commands',
            name: 'Reboot',
            style: {

                bgcolor: combineRgb(0, 0, 180),
                color: combineRgb(255, 255, 255),
                text: 'REBOOT',
                size: '14'
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'sendcommand',
                            options: {
                                command: 'sudo systemctl reboot'
                            }
                        }

                    ],
                    up: [

                    ],
                },
            ],
            feedbacks: [],
        },

        // PLaylist commands
        playlistgo: {
            type: 'button',
            category: 'Playlist Commands',
            name: 'Go Next',
            style: {

                bgcolor: combineRgb(0, 204, 0),
                color: combineRgb(255, 255, 255),
                text: 'GO',
                size: '32'
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'playlistaction',
                            options: {
                                action: 'playnext',
                                parameter: 0
                            }
                        }

                    ],
                    up: [

                    ],
                },
            ],
            feedbacks: [],
        },
        playlistback: {
            type: 'button',
            category: 'Playlist Commands',
            name: 'back',
            style: {

                bgcolor: combineRgb(204, 204, 0),
                color: combineRgb(0, 0, 0),
                text: 'BACK',
                size: '24'
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'playlistaction',
                            options: {
                                action: 'playprevious',
                                parameter: 0
                            }
                        }

                    ],
                    up: [

                    ],
                },
            ],
            feedbacks: [],
        },
        playlistfirst: {
            type: 'button',
            category: 'Playlist Commands',
            name: 'restart',
            style: {

                bgcolor: combineRgb(204, 204, 0),
                color: combineRgb(0, 0, 0),
                text: 'RESET',
                size: '18'
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'playlistaction',
                            options: {
                                action: 'playfirst',
                                parameter: 0
                            }
                        }

                    ],
                    up: [

                    ],
                },
            ],
            feedbacks: [],
        },
        playlistpause: {
            type: 'button',
            category: 'Playlist Commands',
            name: 'pause',
            style: {

                bgcolor: combineRgb(204, 204, 0),
                color: combineRgb(0, 0, 0),
                text: 'PAUSE',
                size: '18'
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'playlistaction',
                            options: {
                                action: 'pause',
                                parameter: 0
                            }
                        }

                    ],
                    up: [

                    ],
                },
            ],
            feedbacks: [],
        },
        playlistplay: {
            type: 'button',
            category: 'Playlist Commands',
            name: 'play',
            style: {

                bgcolor: combineRgb(0, 204, 0),
                color: combineRgb(0, 0, 0),
                text: 'PLAY',
                size: '18'
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'playlistaction',
                            options: {
                                action: 'play',
                                parameter: 0
                            }
                        }

                    ],
                    up: [

                    ],
                },
            ],
            feedbacks: [],
        },


        // layer clip selections
        l1black: {
            type: 'button',
            category: 'Layer 1 Clip Selection',
            name: 'Black',
            style: {

                bgcolor: combineRgb(0, 0, 180),
                color: combineRgb(255, 255, 255),
                text: 'BLACK',
                size: '14'
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'setparameter',
                            options: {
                                parameter: 'file',
                                layer: '1',
                                int1000: 0
                            }
                        }

                    ],
                    up: [

                    ],
                },
            ],
            feedbacks: [],
        },
        l12lack: {
            type: 'button',
            category: 'Layer 2 Clip Selection',
            name: 'Black',
            style: {

                bgcolor: combineRgb(0, 0, 180),
                color: combineRgb(255, 255, 255),
                text: 'BLACK',
                size: '14'
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'setparameter',
                            options: {
                                parameter: 'file',
                                layer: '2',
                                int1000: 0
                            }
                        }

                    ],
                    up: [

                    ],
                },
            ],
            feedbacks: [],
        },
    }
    for (let layer = 1; layer < 3; layer++) {
        for (let clip = 1; clip < 101; clip++) {
            presets['l' + layer + 'clip' + clip] = {
                type: 'button',
                category: `Layer ${layer} Clip Selection`,
                name: `File ${clip}`,
                style: {

                    bgcolor: combineRgb(0, 0, 180),
                    color: combineRgb(255, 255, 255),
                    text: `FILE\n${clip}`,
                    size: '14'
                },
                steps: [
                    {
                        down: [
                            {
                                actionId: 'setparameter',
                                options: {
                                    parameter: 'file',
                                    layer: `${layer}`,
                                    int1000: clip
                                }
                            }

                        ],
                        up: [

                        ],
                    },
                ],
                feedbacks: [],
            }
        }
    }

    for (let row = 1; row < 51; row++) {
        presets['playlistrow' + row] = {
            type: 'button',
            category: 'Playlist Commands',
            name: `Row ${row}`,
            style: {

                bgcolor: combineRgb(0, 0, 180),
                color: combineRgb(255, 255, 255),
                text: `PLAY\nROW\n${row}`,
                size: '14'
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'playlistaction',
                            options: {
                                action: 'playrowx',
                                parameter: row
                            }
                        }

                    ],
                    up: [

                    ],
                },
            ],
            feedbacks: [],
        }
    }

    self.setPresetDefinitions(presets)
}

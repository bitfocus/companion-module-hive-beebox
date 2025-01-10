const { combineRgb } = require('@companion-module/base')

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
    self.setPresetDefinitions(presets)
}

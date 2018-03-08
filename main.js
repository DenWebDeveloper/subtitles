'use strict';
let youTubeAPIReady = false;
let {subtitles} = {
    'subtitles': [
        {
            'begin': '0',
            'end': '7',
            'text': [
                {
                    'word': '1Слово(0-7)',
                    'translates': [{
                        'translate': 'Перевод для першого слова',
                        'precision': '90'
                    }, {
                        'translate': 'Добрый день',
                        'precision': '70'
                    }, {
                        'translate': 'Очень добрый день',
                        'precision': '50'
                    }, {
                        'translate': 'Останній Перевод для першого слова',
                        'precision': '30'
                    },]
                }, {
                    'word': '2Слово',
                    'translates': [{
                        'translate': 'Перевод для Другого слова',
                        'precision': '90'
                    }, {
                        'translate': 'Добрый день1',
                        'precision': '70'
                    }, {
                        'translate': 'Очень добрый день1',
                        'precision': '50'
                    }, {
                        'translate': 'Останній Перевод для Другого слова',
                        'precision': '30'
                    },]
                }, {
                    'word': 'Hello3',
                    'translates': [{
                        'translate': 'Привет3',
                        'precision': '90'
                    }, {
                        'translate': 'Добрый день3',
                        'precision': '70'
                    }, {
                        'translate': 'Очень добрый день3',
                        'precision': '50'
                    }, {
                        'translate': 'Не точно3',
                        'precision': '30'
                    },]
                }
            ]
        }, {
            'begin': '8',
            'end': '15',
            'text': [
                {
                    'word': 'Hello12 8-15',
                    'translates': [{
                        'translate': 'Привет12',
                        'precision': '90'
                    }, {
                        'translate': 'Добрый день12',
                        'precision': '70'
                    }, {
                        'translate': 'Очень добрый день12',
                        'precision': '50'
                    }, {
                        'translate': 'Не точно12',
                        'precision': '30'
                    },]
                }, {
                    'word': 'Hello1123',
                    'translates': [{
                        'translate': 'Привет1',
                        'precision': '90'
                    }, {
                        'translate': 'Добрый день1',
                        'precision': '70'
                    }, {
                        'translate': 'Очень добрый день1',
                        'precision': '50'
                    }, {
                        'translate': 'Не точно12',
                        'precision': '30'
                    },]
                }, {
                    'word': 'Hello321',
                    'translates': [{
                        'translate': 'Привет23',
                        'precision': '90'
                    }, {
                        'translate': 'Добрый день3',
                        'precision': '70'
                    }, {
                        'translate': 'Очень добрый день3',
                        'precision': '50'
                    }, {
                        'translate': 'Не точно3',
                        'precision': '30'
                    },]
                }
            ]
        }, {
            'begin': '42',
            'end': '53',
            'text': [
                {
                    'words': '11mollit',
                    'translate': 'привет'
                }, {
                    'words': 'sint',
                    'translate': 'привет'
                }, {
                    'words': 'irure',
                    'translate': 'привет'
                }
            ]
        }, {
            'begin': '65',
            'end': '68',
            'text': [
                {
                    'words': '15reprehenderit',
                    'translate': 'привет'
                }, {
                    'words': 'minim',
                    'translate': 'привет'
                }, {
                    'words': 'elit',
                    'translate': 'привет'
                }
            ]
        }, {
            'begin': '70',
            'end': '85',
            'text': [
                {
                    'words': 'ex',
                    'translate': 'привет'
                }, {
                    'words': 'cupidatat',
                    'translate': 'привет'
                }, {
                    'words': 'laborum',
                    'translate': 'привет'
                }
            ]
        }, {
            'begin': '88',
            'end': '99',
            'text': [
                {
                    'words': 'Lorem'
                }, {
                    'words': 'adipisicing'
                }, {
                    'words': 'elit'
                }
            ]
        }
    ]
};

function onYouTubeIframeAPIReady() {
    youTubeAPIReady = true;
}

function videosYouTube() {
    let tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    let containerVideos = document.querySelector('#videos');
    containerVideos.addEventListener('click', (e) => {
        if (e.target.dataset.video || e.target.parentElement.dataset.video && youTubeAPIReady) {
            e.preventDefault();
            new Video(new YT.Player('video-player', {
                height: '600px',
                width: '100%',
                videoId: e.target.dataset.video || e.target.parentElement.dataset.video
            }));
        }
    });
}

class Video {
    constructor(Player) {
        this.Player = Player;
        this.text = '';
        this.init();
    }

    init() {
        this.onStateChange();
        this.tooltipVideoStop();
        this.close();

        let videoPlayer = document.querySelector('#video-player iframe');
        let containerVideo = document.querySelector('.container-video');

        containerVideo.style.display = 'block';
        videoPlayer.setAttribute('wmode', 'opaque');
    }

    tooltipVideoStop() {
        let subtitlesContainer = document.querySelector('.subtitles');
        subtitlesContainer.addEventListener('click', (e) => {
            this.Player.pauseVideo();
        });
    }

    translate() {
        this.templateTranslates = document.querySelector('#template-translates');
        let text = '';
        this.templateTranslates.innerHTML = "";
        subtitles[this.numberPosition].text.forEach((elem, index) => {
            elem.translates.forEach((elem) => {
                text += `<li>${elem.translate}</li>`;
            });
            this.templateTranslates.innerHTML += `<div class="template-translate-${index}"><ul>${text}</ul><div class="template-translate__buttons"><button type="button" class="template-translate__menu"></button><div class="template-translate__volumeon"></div></div></div>`;
            text = '';
        });
    }

    onStateChange() {
        this.Player.addEventListener('onStateChange', (status) => {
            let {data} = status;
            if (data == 1) {
                this.pause = false;
                this.videoUpdate()
                if(this.tippy) {
                    this.tippyDestroy();
                }
            }
            if (data == 2) {
                this.pause = true;
            }
        });
    }

    tippyDestroy() {
        let elmentsTippy = document.querySelectorAll('.tippy-popper');
        elmentsTippy.forEach((item)=>{
            item.remove();
        });
    }

    videoUpdate() {
        let that = this;
        this.numberPosition = this.searchSubtitles(Math.floor(this.Player.getCurrentTime()), subtitles);
        this.timerId = setTimeout(function update() {
            that.numberPosition = that.searchSubtitles(Math.floor(that.Player.getCurrentTime()), subtitles);
            console.log(that.numberPosition);
            that.numberPosition !== -1
                ? that.generateText(that.numberPosition)
                : that.updateText(false);
            if (!that.pause) {
                that.timerId = setTimeout(update, 500);
            }
        }, 500);
    }

    generateText(number) {
        this.updateText(false);
        subtitles[number].text.forEach((elem, index) => {
            this.text += `<button class="btn-tooltip" data-position="${index}" title="title">${elem.word}</button>`;
        });
        this.updateText(true);
        this.tippyUpdate();
    }

    tippyUpdate() {
        this.translate();
        this.tippy = tippy('.btn-tooltip', {
            theme: 'speak-starter',
            distance: 15,
            arrow: true,
            html: el => document.querySelector(`.template-translate-${el.dataset.position}`),
            dynamicTitle: true,
            trigger: 'click'
        });
    }

    updateText(type) { //додає або удаляє текс якщо type = true то додаєм
        let containerText = document.querySelector('.subtitles');
        if (type) {
            containerText.innerHTML = this.text;
        } else {
            this.text = '';
            containerText.innerHTML = '';
        }
    }

    searchSubtitles(searchData, subtitles) {
        let i = 0,
            j = subtitles.length,
            k;

        while (i < j) {
            k = Math.floor((i + j) / 2);
            if (searchData <= subtitles[k].begin)
                j = k;
            else
                i = k + 1;
        }
        i === 0 ? 0 : i--;
        if (subtitles[i].begin <= searchData && subtitles[i].end >= searchData)
            return i;
        else
            return -1;
    }

    close() {
        let closeVideo = document.querySelector(".video-close");
        closeVideo.addEventListener('click', () => {
            this.Player.destroy();
            let containerVideo = document.querySelector('.container-video');
            containerVideo.style.display = 'none';
        });
    }
}

document.addEventListener('DOMContentLoaded', ()=>{
    videosYouTube();
});
